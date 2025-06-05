import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: { message: "Method not allowed" }
    });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: "Email and password are required" }
      });
    }

    // Development mode: Allow test user without Supabase
    if (process.env.NODE_ENV === 'development' && email === 'test@example.com' && password === 'password123') {
      return res.status(200).json({
        success: true,
        data: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
            name: 'Test User',
            level: 'A1'
          },
          access_token: 'test-token-' + Date.now(),
          refresh_token: 'test-refresh-token',
          expires_at: Date.now() + 3600000 // 1 hour
        }
      });
    }

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data.user || !data.session) {
      return res.status(401).json({
        success: false,
        error: { message: error?.message || "Invalid credentials" }
      });
    }

    // Return the session data
    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email,
          level: data.user.user_metadata?.level || 'beginner'
        },
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at
      }
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      error: { message: "Internal server error" }
    });
  }
}
