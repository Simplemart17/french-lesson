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
    const userId = await getUserId(req);

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
        console.error('Error fetching user profile:', error);
        return res.status(500).json({
          success: false,
          error: {
            message: 'Failed to fetch user profile'
          }
        });
      }

      if (!userProfile) {
        // Create a default user profile if none exists
        const defaultProfile = {
          id: userId,
          name: 'New User',
          email: 'user@example.com',
          level: 'A1',
          points: 0,
          streak_days: 0,
          joined_at: new Date().toISOString(),
          learning_goals: [],
          completed_lessons: 0,
          last_active: new Date().toISOString(),
          daily_goal: 15,
          notifications: true,
          theme: 'light',
          ai_correction_enabled: true,
          ai_vocab_suggestions_enabled: true,
          preferred_voice: 'alloy',
          speech_recognition_enabled: true
        };

        const { error: createError } = await supabase
          .from(TABLES.USERS)
          .insert(defaultProfile);

        if (createError) {
          console.error('Error creating default user profile:', createError);
          return res.status(500).json({
            success: false,
            error: {
              message: 'Failed to create user profile'
            }
          });
        }

        userProfile = defaultProfile;
      }

      // Transform to match expected User type
      const transformedProfile: User = {
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        level: userProfile.level,
        points: userProfile.points,
        streakDays: userProfile.streak_days,
        joinedAt: userProfile.joined_at,
        learningGoals: userProfile.learning_goals,
        completedLessons: userProfile.completed_lessons,
        lastActive: userProfile.last_active,
        preferences: {
          dailyGoal: userProfile.daily_goal,
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