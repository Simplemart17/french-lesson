import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { PronunciationCheckResponse, PronunciationFeedback } from '@/services/api/pronunciationApiService';
import formidable from 'formidable';
import { supabase, TABLES } from '@/lib/supabase';

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseFormData = async (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

const parseJsonBody = async (req: NextApiRequest): Promise<Record<string, unknown>> => {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString('utf8').trim();
  if (!rawBody) return {};

  try {
    return JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    throw new Error('Invalid JSON body');
  }
};

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i += 1) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j += 1) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i += 1) {
    for (let j = 1; j <= a.length; j += 1) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[b.length][a.length];
}

function scorePronunciation(transcript: string, expected: string): number {
  const normalizedTranscript = normalizeText(transcript);
  const normalizedExpected = normalizeText(expected);

  if (!normalizedExpected) return 0;
  if (!normalizedTranscript) return 0;

  const distance = levenshtein(normalizedTranscript, normalizedExpected);
  const maxLen = Math.max(normalizedTranscript.length, normalizedExpected.length) || 1;
  const similarity = Math.max(0, 1 - distance / maxLen);
  return Math.round(similarity * 100);
}

function buildFeedback(accuracy: number, transcript: string, expected: string): PronunciationFeedback[] {
  const feedback: PronunciationFeedback[] = [];

  if (!transcript.trim()) {
    feedback.push({
      type: 'general',
      severity: 'warning',
      message: 'No transcript detected. Speak clearly and try recording again.'
    });
    return feedback;
  }

  if (accuracy >= 90) {
    feedback.push({
      type: 'general',
      severity: 'info',
      message: 'Excellent pronunciation. Your transcript closely matches the expected phrase.'
    });
  } else if (accuracy >= 75) {
    feedback.push({
      type: 'general',
      severity: 'info',
      message: 'Good pronunciation. Focus on smoother rhythm to improve consistency.'
    });
  } else if (accuracy >= 50) {
    feedback.push({
      type: 'rhythm',
      severity: 'warning',
      message: 'Partially correct. Repeat more slowly and focus on each word boundary.'
    });
  } else {
    feedback.push({
      type: 'sound',
      severity: 'error',
      message: 'Significant mismatch detected. Listen to the phrase and repeat in shorter chunks.'
    });
  }

  const expectedWords = normalizeText(expected).split(' ').filter(Boolean);
  const spokenWords = normalizeText(transcript).split(' ').filter(Boolean);

  if (expectedWords.length && spokenWords.length && spokenWords[0] !== expectedWords[0]) {
    feedback.push({
      type: 'intonation',
      severity: 'warning',
      message: `Opening word differs: expected "${expectedWords[0]}" but heard "${spokenWords[0]}".`
    });
  }

  return feedback;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<PronunciationCheckResponse>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: {
        message: 'Method not allowed'
      }
    });
  }

  try {
    let phraseId = '';
    let transcript = '';

    const contentType = req.headers['content-type'] || '';

    if (contentType.includes('multipart/form-data')) {
      const { fields } = await parseFormData(req);
      phraseId = Array.isArray(fields.phraseId) ? fields.phraseId[0] || '' : (fields.phraseId || '');
      transcript = Array.isArray(fields.transcript) ? fields.transcript[0] || '' : (fields.transcript || '');
    } else if (contentType.includes('application/json')) {
      const body = await parseJsonBody(req) as { phraseId?: string | number; transcript?: string };
      phraseId = body.phraseId ? String(body.phraseId) : '';
      transcript = body.transcript || '';
    } else {
      return res.status(415).json({
        success: false,
        error: {
          message: 'Unsupported content type'
        }
      });
    }

    if (!phraseId) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid phraseId'
        }
      });
    }

    const { data: exercise, error } = await supabase
      .from(TABLES.PRONUNCIATION_EXERCISES)
      .select('id,text')
      .eq('id', phraseId)
      .single();

    if (error || !exercise) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Pronunciation exercise not found'
        }
      });
    }

    const expectedText = exercise.text;
    const accuracy = scorePronunciation(transcript, expectedText);
    const feedback = buildFeedback(accuracy, transcript, expectedText);

    const response: PronunciationCheckResponse = {
      phraseId,
      accuracy,
      feedback,
      transcript,
      isCorrect: accuracy >= 80
    };

    return res.status(200).json({
      success: true,
      data: response,
      result: response
    });
  } catch (error) {
    console.error('Error in pronunciation check API:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
}
