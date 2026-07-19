import type { NextApiRequest, NextApiResponse } from 'next';
import { getOpenAIClient, createAudioTranscription, safeJSONParse } from '../../../utils/openaiClient';
import { authMiddleware } from '../../../utils/authMiddleware';
import { AuthenticatedRequest } from '@/types/api';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { recordActivity, updateUserXpAndStreak } from '@/utils/progressTracker';
import fs from 'fs';
import formidable from 'formidable';
import os from 'os';

export const config = {
  api: {
    bodyParser: false, // multipart audio upload
  },
};

const parseForm = async (req: NextApiRequest) => {
  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
    const form = formidable({
      uploadDir: os.tmpdir(),
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

const field = (value: string | string[] | undefined): string =>
  (Array.isArray(value) ? value[0] : value) || '';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  const tempFiles: string[] = [];

  try {
    const { fields, files } = await parseForm(req);

    const task = field(fields.task);
    const level = field(fields.level) || 'B1';

    if (!task) {
      return res.status(400).json({ success: false, error: { message: 'Task prompt is required' } });
    }

    const audioFile = Array.isArray(files.audio) ? files.audio[0] : files.audio;
    if (!audioFile || !audioFile.filepath) {
      return res.status(400).json({ success: false, error: { message: 'Audio file is required' } });
    }
    tempFiles.push(audioFile.filepath);

    const transcript = (await createAudioTranscription(fs.createReadStream(audioFile.filepath))).trim();

    if (!transcript) {
      return res.status(422).json({
        success: false,
        error: { message: 'No speech detected in the recording. Please try again.' }
      });
    }

    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a certified TCF/TEF French oral examiner. Assess a learner's spoken response from its transcript against the task, using CEFR criteria. The learner's target level is ${level}.

Respond with ONLY a JSON object in exactly this structure:
{
  "overallScore": 0-100,
  "cefrEstimate": "A1"|"A2"|"B1"|"B2"|"C1"|"C2",
  "criteria": {
    "fluency": {"score": 0-100, "comment": "..."},
    "accuracy": {"score": 0-100, "comment": "..."},
    "range": {"score": 0-100, "comment": "..."},
    "coherence": {"score": 0-100, "comment": "..."},
    "taskAchievement": {"score": 0-100, "comment": "..."}
  },
  "corrections": [{"original": "...", "corrected": "...", "explanation": "..."}],
  "feedback": "2-4 sentences of encouraging, concrete feedback in English"
}

Base fluency on sentence length/connector use visible in the transcript (you cannot hear audio). If the transcript is off-task or extremely short, score accordingly and say so.`
        },
        {
          role: 'user',
          content: `Task: ${task}\n\nTranscript of the learner's spoken response:\n"${transcript}"`
        }
      ],
      temperature: 0.3,
      max_tokens: 1200,
      response_format: { type: 'json_object' }
    });

    const assessment = safeJSONParse(response.choices[0].message.content || '{}');
    const overallScore = typeof assessment.overallScore === 'number' ? assessment.overallScore : 0;

    // Track the attempt (non-blocking)
    const userId = req.user?.id;
    if (userId) {
      const db = supabaseAdmin ?? supabase;
      await recordActivity(db as never, userId, 'speaking', overallScore, { task, level });
      await updateUserXpAndStreak(db as never, userId, 10);
    }

    const payload = { transcript, ...assessment };

    return res.status(200).json({
      success: true,
      data: payload,
      ...payload
    });
  } catch (error) {
    console.error('Speaking assessment error:', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to assess speaking' }
    });
  } finally {
    for (const filePath of tempFiles) {
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Error cleaning up temp file:', err);
      }
    }
  }
}

export default authMiddleware(handler);
