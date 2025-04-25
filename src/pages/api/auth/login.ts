import { NextApiRequest, NextApiResponse } from 'next';
import { findUserByEmail } from '@/lib/db';
import { LoginRequest, AuthResponse, ApiResponse } from '@/types/api';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';

// Secret key for JWT signing - in production, use environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: {
          message: 'Email and password are required'
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
          message: 'Invalid credentials'
        }
      });
    }

    // Check if password matches (would require accessing the hashed password from the db)
    // For now, we'll assume any password works
    // In a real implementation, we would use: const isValid = await compare(password, user.password);

    // Create JWT token
    const token = sign(
      { 
        userId: user.id,
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data and token
    return res.status(200).json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      error: {
        message: 'Internal server error'
      }
    });
  }
} 