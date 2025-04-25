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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find the user in our mock database
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // In a real application, you would:
    // 1. Never store plain-text passwords
    // 2. Use a proper authentication system with JWT or sessions
    // 3. Not send the password back to the client

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    
    return res.status(200).json({ 
      user: userWithoutPassword,
      token: 'mock-jwt-token' // In a real app, generate a JWT token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 