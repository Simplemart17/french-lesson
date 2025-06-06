import { NextApiRequest, NextApiResponse } from 'next';
import { RegisterRequest, AuthResponse, ApiResponse } from '@/types/api';
import { supabaseAuth } from '@/lib/supabaseAuth';
import { supabase } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<AuthResponse>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: {
        message: 'Method not allowed'
      }
    });
  }

  try {
    const { email, password, name } = req.body as RegisterRequest;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Email, password, and name are required'
        }
      });
    }

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    });

    if (authError || !authData.user) {
      return res.status(400).json({
        success: false,
        error: {
          message: authError?.message || 'Registration failed'
        }
      });
    }

    // Create user profile in our database
    const userProfile = await supabaseAuth.createUserProfile(authData.user.id, {
      name,
      email,
      level: 'A1',
      points: 0,
      streakDays: 0,
      learningGoals: [],
      completedLessons: 0,
      preferences: {
        dailyGoal: 15,
        notifications: true,
        theme: 'light'
      }
    });

    if (!userProfile) {
      return res.status(500).json({
        success: false,
        error: {
          message: 'Failed to create user profile'
        }
      });
    }

    // Log successful registration
    console.log('User registered successfully:', userProfile.email);

    return res.status(201).json({
      success: true,
      data: {
        user: userProfile,
        token: authData.session?.access_token || ''
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
}