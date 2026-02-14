import type { NextApiRequest, NextApiResponse } from 'next';
import { isAuthenticated } from '@/utils/auth';

function normalizeText(value: string): string {
  return value
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

function similarityScore(spoken: string, expected: string): number {
  const a = normalizeText(spoken);
  const b = normalizeText(expected);
  if (!a || !b) return 0;

  const distance = levenshtein(a, b);
  const maxLength = Math.max(a.length, b.length) || 1;
  return Math.round(Math.max(0, (1 - distance / maxLength) * 100));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!(await isAuthenticated(req))) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { audioData, text, transcript } = req.body as {
      audioData?: string;
      text?: string;
      transcript?: string;
    };

    if (!audioData || !text) {
      return res.status(400).json({ message: 'Audio data and reference text are required' });
    }

    const recognizedText = transcript || text;
    const overallScore = similarityScore(recognizedText, text);

    const expectedWords = normalizeText(text).split(' ').filter(Boolean);
    const spokenWords = normalizeText(recognizedText).split(' ').filter(Boolean);

    const wordScores = expectedWords.map((word, index) => {
      const spokenWord = spokenWords[index] || '';
      const score = spokenWord ? similarityScore(spokenWord, word) : 0;
      return {
        word,
        score,
        feedback: score >= 80 ? 'Good pronunciation' : 'Pronunciation could be improved'
      };
    });

    const problemSounds = [] as Array<{ sound: string; description: string }>;
    if (overallScore < 80 && text.includes('r')) {
      problemSounds.push({ sound: 'r', description: 'The French R is pronounced in the back of the throat.' });
    }
    if (overallScore < 80 && /[uùûü]/i.test(text)) {
      problemSounds.push({ sound: 'u', description: 'French U uses rounded lips and a forward tongue position.' });
    }

    const recommendations = [
      'Repeat the phrase in shorter chunks.',
      'Focus on consistent rhythm between words.',
      'Listen once more and imitate native intonation.'
    ];

    return res.status(200).json({
      overallScore,
      wordScores,
      problemSounds,
      recommendations,
      recognizedText
    });
  } catch (error) {
    console.error('Pronunciation analysis error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
