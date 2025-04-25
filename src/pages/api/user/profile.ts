import type { NextApiRequest, NextApiResponse } from 'next';

// Mock middleware to verify authentication token
// In a real app, you would use a proper auth middleware
function isAuthenticated(req: NextApiRequest): boolean {
  const token = req.headers.authorization?.split(' ')[1];
  return token === 'mock-jwt-token';
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check authentication
  if (!isAuthenticated(req)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    // Return mock profile data
    return res.status(200).json({
      id: 1,
      name: 'John Doe',
      email: 'user@example.com',
      level: 'Intermediate',
      points: 750,
      streakDays: 12,
      joinedAt: '2023-01-15',
      learningGoals: ['Conversation', 'Vocabulary', 'Grammar'],
      completedLessons: 32,
      lastActive: '2023-06-10',
      preferences: {
        dailyGoal: 20, // minutes
        notifications: true,
        theme: 'light'
      }
    });
  } else if (req.method === 'PUT') {
    // Update user profile (mock implementation)
    try {
      const updatedData = req.body;
      
      // Validate required fields if needed
      if (!updatedData) {
        return res.status(400).json({ message: 'No data provided for update' });
      }
      
      // In a real app, you would update the user in the database
      
      return res.status(200).json({
        message: 'Profile updated successfully',
        user: {
          id: 1,
          ...updatedData
        }
      });
    } catch (error) {
      console.error('Profile update error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
} 