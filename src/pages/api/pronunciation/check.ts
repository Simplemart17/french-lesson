import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { PronunciationCheckResponse, PronunciationFeedback } from '@/services/api/pronunciationApiService';
import formidable from 'formidable';

// Configure Next.js API route to handle file uploads
export const config = {
  api: {
    bodyParser: false, // Disable the default body parser for file uploads
  },
};

// Helper function to parse form data
const parseFormData = async (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<PronunciationCheckResponse>>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: {
        message: 'Method not allowed'
      }
    });
  }

  try {
    let phraseId: number;
    let transcript: string | undefined;

    // Handle form data if there's an audio file
    if (req.headers['content-type']?.includes('multipart/form-data')) {
      const { fields } = await parseFormData(req);
      // Get the first value from the array or undefined
      const phraseIdValue = fields.phraseId?.[0];
      const transcriptValue = fields.transcript?.[0];

      phraseId = phraseIdValue ? parseInt(phraseIdValue, 10) : NaN;
      transcript = transcriptValue;
    } else {
      // Handle JSON data
      const body = req.body;
      phraseId = body.phraseId;
      transcript = body.transcript;
    }

    // Validate phraseId
    if (!phraseId || isNaN(phraseId)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid phraseId'
        }
      });
    }

    // In a real application, this would:
    // 1. Process the audio file using a speech recognition service
    // 2. Compare the recognized text with the expected phrase
    // 3. Generate detailed feedback on pronunciation

    // For this mock implementation, we'll generate random feedback
    const accuracy = Math.floor(Math.random() * 40) + 60; // 60-100
    const isCorrect = accuracy >= 80;

    // Generate mock feedback
    const feedbackTypes: Array<'sound' | 'intonation' | 'rhythm' | 'general'> = ['sound', 'intonation', 'rhythm', 'general'];
    const severityTypes: Array<'error' | 'warning' | 'info'> = ['error', 'warning', 'info'];

    const feedback: PronunciationFeedback[] = [];

    // Add 1-3 feedback items
    const feedbackCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < feedbackCount; i++) {
      const type = feedbackTypes[Math.floor(Math.random() * feedbackTypes.length)];
      const severity = severityTypes[Math.floor(Math.random() * severityTypes.length)];

      let message = '';
      switch (type) {
        case 'sound':
          message = 'Try to pronounce the "r" sound from the back of your throat.';
          break;
        case 'intonation':
          message = 'Your intonation rises at the end of the sentence, but it should fall.';
          break;
        case 'rhythm':
          message = 'Try to maintain a more even rhythm throughout the sentence.';
          break;
        case 'general':
          message = 'Overall good attempt, but try to speak more slowly and clearly.';
          break;
      }

      feedback.push({
        type,
        message,
        severity,
        position: type === 'sound' ? {
          start: Math.floor(Math.random() * 5),
          end: Math.floor(Math.random() * 5) + 5
        } : undefined
      });
    }

    // Create response
    const response: PronunciationCheckResponse = {
      phraseId,
      accuracy,
      feedback,
      transcript: transcript || 'Bonjour, comment allez-vous?', // Default transcript if none provided
      isCorrect
    };

    // Return success response
    return res.status(200).json({
      success: true,
      data: response
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
