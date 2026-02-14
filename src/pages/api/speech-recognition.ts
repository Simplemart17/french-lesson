import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: { message: 'Method not allowed' },
      legacyError: 'Method not allowed'
    });
  }

  try {
    // Get transcript and reference text from request body
    const { transcript, referenceText } = req.body;

    // Validate input
    if (!transcript || typeof transcript !== 'string') {
      return res.status(400).json({
        success: false,
        error: { message: 'Transcript is required' },
        legacyError: 'Transcript is required'
      });
    }

    if (!referenceText || typeof referenceText !== 'string') {
      return res.status(400).json({
        success: false,
        error: { message: 'Reference text is required' },
        legacyError: 'Reference text is required'
      });
    }

    // Get API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: { message: 'OpenAI API key not configured' },
        legacyError: 'OpenAI API key not configured'
      });
    }

    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey });

    // Use OpenAI to analyze pronunciation accuracy
    const analysis = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a French pronunciation assessment expert. 
          Compare the user's spoken transcript to the reference text and provide detailed feedback.
          Focus on pronunciation errors, accent issues, and provide a score from 0-100.
          Format your response as JSON with the following structure:
          {
            "score": number,
            "feedback": string,
            "errors": [{ "word": string, "suggestion": string, "explanation": string }],
            "strengths": [string],
            "areas_for_improvement": [string]
          }`
        },
        {
          role: 'user',
          content: `Reference text: "${referenceText}"
User transcript: "${transcript}"`
        }
      ],
      response_format: { type: 'json_object' }
    });

    // Parse the response
    const analysisContent = analysis.choices[0]?.message?.content;
    if (!analysisContent) {
      throw new Error('Failed to get analysis from OpenAI');
    }

    // Parse the JSON response
    const pronunciationAnalysis = JSON.parse(analysisContent);

    // Return the analysis
    return res.status(200).json({
      success: true,
      data: pronunciationAnalysis
    });
  } catch (error: unknown) {
    console.error('Error analyzing pronunciation:', error);

    // Return appropriate error response
    const errorWithStatus = error as { status?: number };
    if (errorWithStatus.status === 401) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid OpenAI API key' },
        legacyError: 'Invalid OpenAI API key'
      });
    } else if (errorWithStatus.status === 429) {
      return res.status(429).json({
        success: false,
        error: { message: 'OpenAI API rate limit exceeded' },
        legacyError: 'OpenAI API rate limit exceeded'
      });
    } else {
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to analyze pronunciation' },
        legacyError: 'Failed to analyze pronunciation'
      });
    }
  }
}
