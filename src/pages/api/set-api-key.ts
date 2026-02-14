import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: { message: 'Method not allowed' },
      legacyError: 'Method not allowed'
    });
  }

  try {
    // Get API key from request body
    const { apiKey } = req.body;

    // Validate input
    if (!apiKey || typeof apiKey !== 'string') {
      return res.status(400).json({
        success: false,
        error: { message: 'API key is required' },
        legacyError: 'API key is required'
      });
    }

    // Validate API key format (basic check for OpenAI key format)
    if (!apiKey.startsWith('sk-') || apiKey.length < 20) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid API key format' },
        legacyError: 'Invalid API key format'
      });
    }

    // In a production environment, you would store this securely
    // For this demo, we'll update the .env.local file
    const envFilePath = path.join(process.cwd(), '.env.local');
    
    // Read existing .env.local file or create a new one
    let envContent = '';
    try {
      envContent = fs.readFileSync(envFilePath, 'utf8');
    } catch {
      // File doesn't exist, create a new one
      envContent = '';
    }

    // Check if OPENAI_API_KEY already exists in the file
    const keyRegex = /^OPENAI_API_KEY=.*/m;
    if (keyRegex.test(envContent)) {
      // Replace existing key
      envContent = envContent.replace(keyRegex, `OPENAI_API_KEY=${apiKey}`);
    } else {
      // Add new key
      envContent += `\nOPENAI_API_KEY=${apiKey}\n`;
    }

    // Write updated content back to .env.local
    fs.writeFileSync(envFilePath, envContent);

    // Update process.env for the current session
    process.env.OPENAI_API_KEY = apiKey;

    // Return success
    return res.status(200).json({
      success: true,
      data: { saved: true },
      saved: true
    });
  } catch (error) {
    console.error('Error setting API key:', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to set API key' },
      legacyError: 'Failed to set API key'
    });
  }
}
