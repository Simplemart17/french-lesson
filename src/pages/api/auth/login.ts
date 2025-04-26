import { NextApiRequest, NextApiResponse } from 'next';
import { findUserByEmail } from '@/lib/db';
import { LoginRequest, AuthResponse, ApiResponse } from '@/types/api';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { prisma } from '@/lib/prisma';

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
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: {
        message: 'Method not allowed'
      }
    });
  }

  try {
    const { email, password } = req.body as LoginRequest;

    // Input validation
    if (!email) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Email is required'
        }
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Password is required'
        }
      });
    }

    // Find user by email
    const user = await findUserByEmail(email);

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid email or password'
        }
      });
    }

    // Get user with password from database
    const userWithPassword = await prisma.user.findUnique({
      where: { email }
    });

    if (!userWithPassword || !userWithPassword.password) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid email or password'
        }
      });
    }

    // Check password
    const isPasswordValid = await compare(password, userWithPassword.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid email or password'
        }
      });
    }

    // Create JWT token
    const token = sign(
      {
        userId: user.id,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookies directly using the Set-Cookie header with a very simple approach
    const cookieHeaders = [
      `${TOKEN_NAME}=${token}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax`,
      `${USER_DATA}=${encodeURIComponent(JSON.stringify(user))}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax`
    ];
    res.setHeader('Set-Cookie', cookieHeaders);

    // Return user data and token
    return res.status(200).json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
}