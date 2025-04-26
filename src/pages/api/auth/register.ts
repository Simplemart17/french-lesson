import { NextApiRequest, NextApiResponse } from 'next';
import { findUserByEmail, createUser } from '@/lib/db';
import { RegisterRequest, AuthResponse, ApiResponse } from '@/types/api';
import { sign } from 'jsonwebtoken';

// Secret key for JWT signing - in production, use environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Cookie constants
const TOKEN_NAME = 'auth_token';
const USER_DATA = 'user_data';
const MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

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

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          message: 'User with this email already exists'
        }
      });
    }

    // Create new user using our database service
    const newUser = await createUser({
      name,
      email,
      password,
      level: 'A1', // Starting level for new users
      points: 0,
      streakDays: 0,
      joinedAt: new Date().toISOString(),
      learningGoals: [],
      completedLessons: 0,
      lastActive: new Date().toISOString(),
      preferences: {
        dailyGoal: 15, // Default 15 minutes per day
        notifications: true,
        theme: 'light'
      }
    });

    // Create JWT token
    const token = sign(
      {
        userId: newUser.id,
        email: newUser.email
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookies directly using the Set-Cookie header with a very simple approach
    res.setHeader('Set-Cookie', [
      `${TOKEN_NAME}=${token}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax`,
      `${USER_DATA}=${encodeURIComponent(JSON.stringify(newUser))}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax`
    ]);

    // Log cookie setting
    console.log('Setting auth cookies for new user:', newUser.email);

    return res.status(201).json({
      success: true,
      data: {
        user: newUser,
        token
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