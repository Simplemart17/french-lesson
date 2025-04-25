import type { NextApiRequest, NextApiResponse } from 'next';

// Mock user database - in production this would be a real database
const users = [
  { id: 1, email: 'user@example.com', password: 'password123', name: 'John Doe' },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // In a real application:
    // 1. Hash the password
    // 2. Store the user in a database
    // 3. Generate authentication tokens

    // Create new user (mock implementation)
    const newUser = {
      id: users.length + 1,
      email,
      password, // In a real app, this would be hashed
      name,
    };

    // Add user to our mock database
    users.push(newUser);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser;
    
    return res.status(201).json({
      user: userWithoutPassword,
      token: 'mock-jwt-token' // In a real app, generate a JWT token
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 