import type { NextApiRequest, NextApiResponse } from 'next';

// Mock middleware to verify authentication token
function isAuthenticated(req: NextApiRequest): boolean {
  const token = req.headers.authorization?.split(' ')[1];
  return token === 'mock-jwt-token';
}

// Mock CEFR levels and their descriptions
const cefrLevels = {
  A1: 'Beginner - Can understand and use familiar everyday expressions and very basic phrases.',
  A2: 'Elementary - Can communicate in simple and routine tasks requiring a simple and direct exchange of information.',
  B1: 'Intermediate - Can deal with most situations likely to arise while traveling in an area where the language is spoken.',
  B2: 'Upper Intermediate - Can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers possible.',
  C1: 'Advanced - Can express ideas fluently and spontaneously without much obvious searching for expressions.',
  C2: 'Proficient - Can understand with ease virtually everything heard or read.'
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check authentication
  if (!isAuthenticated(req)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      const { responses } = req.body;
      
      if (!responses || !Array.isArray(responses)) {
        return res.status(400).json({ message: 'Valid assessment responses are required' });
      }

      // This would be a complex algorithm in a real app
      // Here we're providing a mock implementation
      
      // Calculate a score based on the answers (mock implementation)
      const score = Math.min(Math.floor(Math.random() * 100) + 50, 100); // Random score between 50-100
      
      // Determine CEFR level based on score
      let level;
      if (score < 60) level = 'A1';
      else if (score < 70) level = 'A2';
      else if (score < 80) level = 'B1';
      else if (score < 90) level = 'B2';
      else if (score < 95) level = 'C1';
      else level = 'C2';
      
      // Generate specific weaknesses and strengths (mock data)
      const weaknesses = ['Past tense conjugation', 'Subjunctive mood', 'Formal vocabulary'];
      const strengths = ['Basic conversation', 'Present tense verbs', 'Common vocabulary'];
      
      return res.status(200).json({
        score,
        level,
        levelDescription: cefrLevels[level as keyof typeof cefrLevels],
        assessment: {
          weaknesses,
          strengths,
          recommendedFocus: weaknesses,
          detailedResults: {
            grammar: score - 5,
            vocabulary: score + 3,
            listening: score - 8,
            reading: score + 5,
            speaking: score - 2
          }
        }
      });
    } catch (error) {
      console.error('Assessment error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
} 