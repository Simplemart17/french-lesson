import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, User } from '@/types/api';
import { getSupabaseClient, TABLES } from '@/lib/supabase';
import { authMiddleware } from '@/utils/authMiddleware';
import { getUserId } from '@/utils/auth';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
) {
  try {
    // Get user ID from the authenticated request
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Unauthorized'
        }
      });
    }

    if (req.method === 'GET') {
      // Get user profile from User table
      const supabase = getSupabaseClient();

      const { data: userProfile, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // If table doesn't exist, return mock user data for development
        if (error.message.includes('does not exist')) {
          const mockProfile: User = {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
            level: 'A1',
            points: 150,
            streakDays: 5,
            joinedAt: new Date().toISOString(),
            learningGoals: ['conversation', 'grammar'],
            completedLessons: 3,
            lastActive: new Date().toISOString(),
            preferences: {
              dailyGoal: 15,
              notifications: true,
              theme: 'light'
            }
          };

          return res.status(200).json({
            success: true,
            data: mockProfile
          });
        }

        return res.status(404).json({
          success: false,
          error: {
            message: 'User profile not found'
          }
        });
      }

      if (!userProfile) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'User profile not found'
          }
        });
      }

      // Transform to match expected User type
      const transformedProfile: User = {
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        level: userProfile.level,
        points: userProfile.points,
        streakDays: userProfile.streakDays,
        joinedAt: userProfile.joinedAt,
        learningGoals: userProfile.learningGoals,
        completedLessons: userProfile.completedLessons,
        lastActive: userProfile.lastActive,
        preferences: {
          dailyGoal: userProfile.dailyGoal,
          notifications: userProfile.notifications,
          theme: userProfile.theme as 'light' | 'dark'
        }
      };

      return res.status(200).json({
        success: true,
        data: transformedProfile
      });
    } else if (req.method === 'PUT' || req.method === 'PATCH') {
      // Update user profile
      const {
        name,
        level,
        learningGoals,
        preferences
      } = req.body;

      const supabase = getSupabaseClient();

      // Prepare updates
      const updates: any = {
        lastActive: new Date().toISOString()
      };

      if (name) updates.name = name;
      if (level) updates.level = level;
      if (learningGoals) updates.learningGoals = learningGoals;

      if (preferences) {
        if (preferences.dailyGoal !== undefined) updates.dailyGoal = preferences.dailyGoal;
        if (preferences.notifications !== undefined) updates.notifications = preferences.notifications;
        if (preferences.theme !== undefined) updates.theme = preferences.theme;
      }

      // Update user profile
      const { data: updatedProfile, error } = await supabase
        .from(TABLES.USERS)
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error || !updatedProfile) {
        return res.status(500).json({
          success: false,
          error: {
            message: 'Failed to update profile'
          }
        });
      }

      // Transform to match expected User type
      const transformedProfile: User = {
        id: updatedProfile.id,
        name: updatedProfile.name,
        email: updatedProfile.email,
        level: updatedProfile.level,
        points: updatedProfile.points,
        streakDays: updatedProfile.streakDays,
        joinedAt: updatedProfile.joinedAt,
        learningGoals: updatedProfile.learningGoals,
        completedLessons: updatedProfile.completedLessons,
        lastActive: updatedProfile.lastActive,
        preferences: {
          dailyGoal: updatedProfile.dailyGoal,
          notifications: updatedProfile.notifications,
          theme: updatedProfile.theme as 'light' | 'dark'
        }
      };

      return res.status(200).json({
        success: true,
        data: transformedProfile
      });
    } else {
      return res.status(405).json({
        success: false,
        error: {
          message: 'Method not allowed'
        }
      });
    }
  } catch (error) {
    console.error('Profile API error:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
}

export default authMiddleware(handler);