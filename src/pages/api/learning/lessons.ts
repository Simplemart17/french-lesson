import type { NextApiRequest, NextApiResponse } from 'next';

// Mock middleware to verify authentication token
function isAuthenticated(req: NextApiRequest): boolean {
  const token = req.headers.authorization?.split(' ')[1];
  return token === 'mock-jwt-token';
}

// Mock lessons data
const lessons = [
  {
    id: 1,
    title: 'Introduction to French Basics',
    description: 'Learn the fundamentals of French pronunciation and greetings.',
    level: 'A1',
    duration: 15, // minutes
    topics: ['Greetings', 'Pronunciation'],
    content: {
      sections: [
        {
          type: 'text',
          title: 'Basic Greetings',
          content: 'In French, "Hello" is "Bonjour" and "Goodbye" is "Au revoir".'
        },
        {
          type: 'audio',
          title: 'Pronunciation Practice',
          audioUrl: '/api/audio/greetings.mp3',
          transcript: 'Bonjour! Comment allez-vous?'
        }
      ],
      exercises: [
        {
          type: 'multiple-choice',
          question: 'How do you say "Hello" in French?',
          options: ['Bonjour', 'Au revoir', 'Merci', 'S\'il vous plaît'],
          correctAnswer: 'Bonjour'
        }
      ]
    }
  },
  {
    id: 2,
    title: 'Common French Phrases',
    description: 'Learn everyday phrases used in conversation.',
    level: 'A1',
    duration: 20,
    topics: ['Conversation', 'Vocabulary'],
    content: {
      sections: [
        {
          type: 'text',
          title: 'Useful Phrases',
          content: 'Some useful phrases include "S\'il vous plaît" (Please) and "Merci" (Thank you).'
        }
      ],
      exercises: [
        {
          type: 'fill-in-blank',
          question: 'Please fill in: "_____, je voudrais un café."',
          correctAnswer: 'S\'il vous plaît'
        }
      ]
    }
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check authentication
  if (!isAuthenticated(req)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    // Handle query parameters for filtering
    const { level, topic } = req.query;
    
    let filteredLessons = [...lessons];
    
    if (level) {
      filteredLessons = filteredLessons.filter(lesson => 
        lesson.level === level
      );
    }
    
    if (topic) {
      filteredLessons = filteredLessons.filter(lesson => 
        lesson.topics.includes(topic as string)
      );
    }
    
    // Return list of lessons (without full content)
    return res.status(200).json(
      filteredLessons.map(({ content, ...lesson }) => lesson)
    );
  } else if (req.method === 'POST') {
    // For tracking lesson progress/completion
    try {
      const { lessonId, completed, score } = req.body;
      
      if (!lessonId) {
        return res.status(400).json({ message: 'Lesson ID is required' });
      }
      
      // In a real app, update the user's progress in the database
      
      return res.status(200).json({
        message: 'Lesson progress updated',
        lessonId,
        completed: completed || false,
        score: score || 0
      });
    } catch (error) {
      console.error('Lesson progress update error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
} 