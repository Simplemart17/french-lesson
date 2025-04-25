import { NextApiRequest, NextApiResponse } from 'next';
import { findUserById, updateUser } from '@/lib/db';
import { ApiResponse, User } from '@/types/api';
import { isAuthenticated, getUserId } from '@/utils/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
) {
  // Check authentication
  if (!isAuthenticated(req)) {
    return res.status(401).json({ 
      success: false, 
      error: {
        message: 'Unauthorized'
      }
    });
  }

  const userId = getUserId(req);

  if (req.method === 'GET') {
    // Get user profile
    const user = await findUserById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: {
          message: 'User not found'
        }
      });
    }
    
    return res.status(200).json({
      success: true,
      data: user
    });
  } else if (req.method === 'PUT' || req.method === 'PATCH') {
    // Update user profile
    try {
      const { 
        name, 
        level, 
        learningGoals,
        preferences
      } = req.body;
      
      // Only allow certain fields to be updated
      const updates: Partial<User> = {};
      
      if (name) updates.name = name;
      if (level) updates.level = level;
      if (learningGoals) updates.learningGoals = learningGoals;
      
      if (preferences) {
        updates.preferences = {
          ...(await findUserById(userId))?.preferences || {},
          ...preferences
        };
      }
      
      // Always update lastActive time
      updates.lastActive = new Date().toISOString();
      
      const updatedUser = await updateUser(userId, updates);
      
      if (!updatedUser) {
        return res.status(404).json({ 
          success: false, 
          error: {
            message: 'User not found'
          }
        });
      }
      
      return res.status(200).json({
        success: true,
        data: updatedUser
      });
    } catch (error) {
      console.error('Profile update error:', error);
      return res.status(500).json({ 
        success: false, 
        error: {
          message: 'Internal server error'
        }
      });
    }
  } else {
    return res.status(405).json({ 
      success: false, 
      error: {
        message: 'Method not allowed'
      }
    });
  }
} 