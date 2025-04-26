import type { NextApiRequest, NextApiResponse } from 'next';
import { getOpenAIClient, createAudioTranscription } from '../../../utils/openaiClient';
import { authMiddleware } from '../../../utils/authMiddleware';
import fs from 'fs';
import formidable from 'formidable';
import path from 'path';
import os from 'os';

// Configure Next.js API route to handle file uploads
export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
  },
};

// Helper to parse the form data with formidable
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

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  // Temporary file paths to clean up later
  const tempFiles: string[] = [];

  try {
    // Parse the form data
    const { fields, files } = await parseForm(req);
    
    // Extract the expected text from the form fields
    const expectedText = Array.isArray(fields.text) 
      ? fields.text[0] 
      : fields.text || '';
    
    if (!expectedText) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Expected text is required' } 
      });
    }
    
    // Get the audio file
    const audioFile = Array.isArray(files.audio) 
      ? files.audio[0] 
      : files.audio;
      
    if (!audioFile || !audioFile.filepath) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Audio file is required' } 
      });
    }
    
    // Add the file path to the cleanup list
    tempFiles.push(audioFile.filepath);
    
    // Get OpenAI client
    const openai = getOpenAIClient();

    // Use our createAudioTranscription helper function with Whisper API
    const actualText = await createAudioTranscription(fs.createReadStream(audioFile.filepath));
    const expectedTextNormalized = expectedText.toLowerCase().trim();
    
    // Calculate similarity score
    const similarityScore = calculateSimilarity(actualText.toLowerCase().trim(), expectedTextNormalized);
    
    // Generate feedback using GPT
    const feedbackResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `You are a French pronunciation assistant. Compare the expected French text with what the user actually said, and provide helpful feedback on pronunciation.
          
          Format your response as JSON:
          {
            "overallScore": number between 0-100,
            "wordScores": [
              { "word": "word", "score": number between 0-100, "feedback": "specific feedback" }
            ],
            "problemSounds": [
              { "sound": "sound", "description": "description of issue" }
            ],
            "recommendations": ["recommendation 1", "recommendation 2"]
          }`
        },
        {
          role: "user",
          content: `Expected text: "${expectedTextNormalized}"
          Actual transcript: "${actualText}"
          Similarity score: ${similarityScore}`
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const feedback = JSON.parse(feedbackResponse.choices[0].message.content || '{}');
    
    return res.status(200).json({
      success: true,
      data: {
        transcript: actualText,
        expected: expectedTextNormalized,
        similarity: similarityScore,
        feedback
      }
    });
  } catch (error) {
    console.error('Pronunciation analysis error:', error);
    return res.status(500).json({ 
      success: false, 
      error: { message: 'Failed to analyze pronunciation' } 
    });
  } finally {
    // Clean up temporary files
    for (const filePath of tempFiles) {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error('Error cleaning up temp file:', err);
      }
    }
  }
}

// Simple text similarity function
function calculateSimilarity(text1: string, text2: string): number {
  // In production, use a more sophisticated algorithm
  const words1 = text1.split(/\s+/);
  const words2 = text2.split(/\s+/);
  
  const commonWords = words1.filter(word => words2.includes(word)).length;
  const totalWords = Math.max(words1.length, words2.length);
  
  return Math.round((commonWords / totalWords) * 100);
}

export default authMiddleware(handler); 