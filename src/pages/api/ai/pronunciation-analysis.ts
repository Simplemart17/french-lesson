import type { NextApiRequest, NextApiResponse } from 'next';
import { getOpenAIClient } from '../../../utils/openaiClient';
import { authMiddleware } from '../../../utils/authMiddleware';
import { prisma } from '../../../lib/prisma';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    const { audio, text } = req.body;
    
    if (!audio || !text) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Audio data and text are required' } 
      });
    }
    
    // Get OpenAI client
    const openai = getOpenAIClient();

    // In a production environment, we would process the audio file with OpenAI's Whisper API
    // For now, we'll simulate the transcription result
    
    // Simulate a transcription with some errors to test the analysis
    const simulatedTranscription = simulateTranscription(text);
    const actualText = simulatedTranscription.toLowerCase().trim();
    const expectedText = text.toLowerCase().trim();
    
    // Calculate simple similarity score
    const similarityScore = calculateSimilarity(actualText, expectedText);
    
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
          content: `Expected text: "${expectedText}"
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
      data: feedback
    });
  } catch (error) {
    console.error('Pronunciation analysis error:', error);
    return res.status(500).json({ 
      success: false, 
      error: { message: 'Failed to analyze pronunciation' } 
    });
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

// Function to simulate transcription with some common pronunciation mistakes
function simulateTranscription(text: string): string {
  // Common French pronunciation mistakes for English speakers
  const mistakes = [
    { pattern: /\br\b/g, replacement: 'r' },  // English 'r' instead of French rolled 'r'
    { pattern: /\bun\b/g, replacement: 'un' }, // Missing nasal sound
    { pattern: /\bje\b/g, replacement: 'je' }, // 'je' pronounced with English 'j'
    { pattern: /\btu\b/g, replacement: 'tu' }, // 'u' sound often mispronounced
    { pattern: /\bau\b/g, replacement: 'o' },  // 'au' sound often Anglicized
  ];
  
  // Introduce some random errors (about 20% of the time)
  let result = text;
  const words = text.split(' ');
  for (let i = 0; i < words.length; i++) {
    if (Math.random() < 0.2) {
      // Either drop a word or modify it
      if (Math.random() < 0.5) {
        words[i] = '';
      } else {
        // Apply a random mistake
        const mistake = mistakes[Math.floor(Math.random() * mistakes.length)];
        words[i] = words[i].replace(mistake.pattern, mistake.replacement);
      }
    }
  }
  
  // Randomly return either the original or modified text
  return Math.random() < 0.7 ? words.filter(Boolean).join(' ') : text;
}

export default authMiddleware(handler); 