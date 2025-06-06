import { NextApiRequest, NextApiResponse } from "next";
import { supabaseAuth } from "@/lib/supabaseAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      data: { error: "Method not allowed" }
    });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        data: { error: "Email and password are required" }
      });
    }

    // Use the supabaseAuth service for proper authentication
    const authResult = await supabaseAuth.signIn(email, password);

    if (authResult.error || !authResult.user || !authResult.session) {
      return res.status(401).json({
        success: false,
        data: { error: authResult.error || "Invalid credentials" }
      });
    }

    // Return the session data with user profile
    return res.status(200).json({
      success: true,
      data: {
        user: authResult.user,
        access_token: authResult.session.access_token,
        refresh_token: authResult.session.refresh_token,
        expires_at: authResult.session.expires_at
      }
    });
  } catch (error: unknown) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      data: { error: "Internal server error" }
    });
  }
}
