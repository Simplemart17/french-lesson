import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { ConversationTopic } from '@/services/api/conversationApiService';

// Mock conversation topics
const mockConversationTopics: ConversationTopic[] = [
  {
    id: '1',
    title: 'At the Restaurant',
    description: 'Practice ordering food and drinks in a French restaurant.',
    level: 'beginner',
    category: 'dining'
  },
  {
    id: '2',
    title: 'Shopping for Clothes',
    description: 'Learn vocabulary and phrases for shopping in French stores.',
    level: 'beginner',
    category: 'shopping'
  },
  {
    id: '3',
    title: 'Asking for Directions',
    description: 'Practice asking for and understanding directions in French.',
    level: 'beginner',
    category: 'travel'
  },
  {
    id: '4',
    title: 'At the Doctor\'s Office',
    description: 'Learn medical vocabulary and how to describe symptoms in French.',
    level: 'intermediate',
    category: 'health'
  },
  {
    id: '5',
    title: 'Making Travel Arrangements',
    description: 'Practice booking hotels, flights, and tours in French.',
    level: 'intermediate',
    category: 'travel'
  },
  {
    id: '6',
    title: 'Job Interview',
    description: 'Prepare for a job interview in French with common questions and responses.',
    level: 'advanced',
    category: 'professional'
  },
  {
    id: '7',
    title: 'Discussing Current Events',
    description: 'Practice discussing news and current events in French.',
    level: 'advanced',
    category: 'culture'
  },
  {
    id: '8',
    title: 'Making Small Talk',
    description: 'Learn how to engage in casual conversation in French.',
    level: 'beginner',
    category: 'social'
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ConversationTopic[]>>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: {
        message: 'Method not allowed'
      }
    });
  }

  try {
    // Get query parameters
    const { level } = req.query;
    
    // Filter topics by level if provided
    let filteredTopics = [...mockConversationTopics];
    
    if (level && typeof level === 'string') {
      filteredTopics = filteredTopics.filter(
        topic => topic.level === level
      );
    }
    
    // Return success response
    return res.status(200).json({
      success: true,
      data: filteredTopics
    });
  } catch (error) {
    console.error('Error in conversation topics API:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
}
