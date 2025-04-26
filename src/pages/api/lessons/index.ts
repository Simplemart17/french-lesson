import type { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '../../../utils/authMiddleware';

// Sample lesson data for demonstration
// In a real app this would come from a database
const lessons = [
  {
    id: 1,
    title: 'Basic Greetings in French',
    description: 'Learn essential greetings and introductions in French to start conversations confidently.',
    level: 'beginner',
    duration: 15,
    topics: ['conversation', 'basics'],
    imageUrl: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?q=80&w=2070',
    content: {
      sections: [
        {
          type: 'text',
          title: 'Introduction',
          content: 'In this lesson, you will learn the most common French greetings used in everyday conversation.'
        }
      ]
    }
  },
  {
    id: 2,
    title: 'Introducing Yourself in French',
    description: 'Learn how to introduce yourself and ask basic personal questions in French.',
    level: 'beginner',
    duration: 20,
    topics: ['conversation', 'basics'],
    imageUrl: 'https://images.unsplash.com/photo-1445991842772-097fea258e7b?q=80&w=2070',
    content: {
      sections: [
        {
          type: 'text',
          title: 'Introduction',
          content: 'This lesson covers introducing yourself and having basic personal conversations in French.'
        }
      ]
    }
  },
  {
    id: 3,
    title: 'Present Tense Verbs',
    description: 'Master the conjugation of regular and common irregular verbs in the present tense.',
    level: 'beginner',
    duration: 25,
    topics: ['grammar', 'verbs'],
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2073',
    content: {
      sections: [
        {
          type: 'text',
          title: 'Introduction',
          content: 'In this lesson, you will learn how to conjugate regular and common irregular verbs in the present tense.'
        }
      ]
    }
  },
  {
    id: 4,
    title: 'Food and Dining Vocabulary',
    description: 'Learn essential vocabulary for ordering food, discussing preferences, and navigating restaurants.',
    level: 'beginner',
    duration: 20,
    topics: ['vocabulary', 'food'],
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070',
    content: {
      sections: [
        {
          type: 'text',
          title: 'Introduction',
          content: 'This lesson covers essential vocabulary and phrases for ordering food and dining in French restaurants.'
        }
      ]
    }
  },
  {
    id: 5,
    title: 'French Pronunciation Basics',
    description: 'Master the fundamentals of French pronunciation, including nasal sounds and silent letters.',
    level: 'beginner',
    duration: 30,
    topics: ['pronunciation'],
    imageUrl: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=2073',
    content: {
      sections: [
        {
          type: 'text',
          title: 'Introduction',
          content: 'In this lesson, you will learn the basics of French pronunciation, focusing on unique sounds and rules.'
        }
      ]
    }
  },
  {
    id: 6,
    title: 'Past Tense: Passé Composé',
    description: 'Learn how to form and use the passé composé to talk about past events.',
    level: 'intermediate',
    duration: 35,
    topics: ['grammar', 'tenses'],
    imageUrl: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?q=80&w=2074',
    content: {
      sections: [
        {
          type: 'text',
          title: 'Introduction',
          content: 'This lesson covers the passé composé, the most common past tense used in French.'
        }
      ]
    }
  },
  {
    id: 7,
    title: 'French Café Culture',
    description: 'Explore the importance of cafés in French society and learn related vocabulary and expressions.',
    level: 'intermediate',
    duration: 25,
    topics: ['culture', 'vocabulary'],
    imageUrl: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?q=80&w=2071',
    content: {
      sections: [
        {
          type: 'text',
          title: 'Introduction',
          content: 'In this lesson, you will learn about the significance of cafés in French culture and related vocabulary.'
        }
      ]
    }
  },
  {
    id: 8,
    title: 'Advanced French Expressions',
    description: 'Master idiomatic expressions and colloquialisms used by native French speakers.',
    level: 'advanced',
    duration: 40,
    topics: ['vocabulary', 'expressions'],
    imageUrl: 'https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?q=80&w=2070',
    content: {
      sections: [
        {
          type: 'text',
          title: 'Introduction',
          content: 'This lesson covers advanced idiomatic expressions and colloquialisms used in everyday French.'
        }
      ]
    }
  }
];

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET for this endpoint
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    // Extract query parameters
    const { level, topic } = req.query;
    
    // Filter lessons based on query parameters
    let filteredLessons = [...lessons];
    
    if (level && typeof level === 'string') {
      filteredLessons = filteredLessons.filter(lesson => 
        lesson.level.toLowerCase() === level.toLowerCase()
      );
    }
    
    if (topic && typeof topic === 'string') {
      filteredLessons = filteredLessons.filter(lesson => 
        lesson.topics.some(t => t.toLowerCase() === topic.toLowerCase())
      );
    }
    
    // Return filtered lessons
    return res.status(200).json({
      success: true,
      data: filteredLessons
    });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch lessons' }
    });
  }
}

export default authMiddleware(handler);
