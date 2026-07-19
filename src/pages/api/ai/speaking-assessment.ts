import type { NextApiResponse } from 'next';
import { getOpenAIClient, createAudioTranscription, safeJSONParse } from '../../../utils/openaiClient';
import { authMiddleware } from '../../../utils/authMiddleware';
import { AuthenticatedRequest } from '@/types/api';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { recordActivity, updateUserXpAndStreak } from '@/utils/progressTracker';
import { parseMultipartForm, formField, formFile } from '@/utils/multipart';
import { normalizeAssessment } from '@/utils/assessment';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // multipart audio upload
  },
};

const CRITERIA = ['fluency', 'accuracy', 'range', 'coherence', 'taskAchievement'];

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  const tempFiles: string[] = [];

  try {
    const { fields, files } = await parseMultipartForm(req);

    const task = formField(fields.task);
    const level = formField(fields.level) || 'B1';

    if (!task) {
      return res.status(400).json({ success: false, error: { message: 'Task prompt is required' } });
    }

    const audioFile = formFile(files.audio);
    if (!audioFile) {
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

    // Validate/clamp the model output before it reaches the client or DB —
    // unusable output fails loudly instead of persisting fabricated zeros
    const assessment = normalizeAssessment(
      safeJSONParse(response.choices[0].message.content || '{}'),
      CRITERIA
    );
    if (!assessment) {
      return res.status(502).json({
        success: false,
        error: { message: 'The examiner could not produce a valid assessment. Please try again.' }
      });
    }

    // Track the attempt (non-blocking)
    const userId = req.user?.id;
    if (userId) {
      const db = supabaseAdmin ?? supabase;
      await recordActivity(db as never, userId, 'speaking', assessment.overallScore, { task, level });
      await updateUserXpAndStreak(db as never, userId, 10);
    }

    return res.status(200).json({
      success: true,
      data: { transcript, ...assessment }
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
