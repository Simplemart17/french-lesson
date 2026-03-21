import { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, User } from "@/types/api";
import { supabase, supabaseAdmin, TABLES } from "@/lib/supabase";
import { authMiddleware } from "@/utils/authMiddleware";
import { getUserId } from "@/utils/auth";
import { getOrCreateUserProfile } from "@/utils/userProfile";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<User>>
) {
  const db = supabaseAdmin ?? supabase;

  try {
    // Get user ID from the authenticated request
    const userId = await getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          message: "Unauthorized",
        },
      });
    }

    if (req.method === "GET") {
      const { data: userProfile, error } = await getOrCreateUserProfile(userId);
      if (error || !userProfile) {
        console.error("Error fetching/creating user profile:", error);
        return res.status(500).json({
          success: false,
          error: {
            message: "Failed to fetch user profile",
          },
        });
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
          theme: userProfile.theme as "light" | "dark",
        },
      };

      return res.status(200).json({
        success: true,
        data: transformedProfile,
      });
    } else if (req.method === "PUT" || req.method === "PATCH") {
      // Update user profile
      const { name, level, learningGoals, preferences } = req.body;

      // Prepare updates (using database field names)
      const updates: Record<string, unknown> = {
        last_active: new Date().toISOString(),
      };

      if (name) updates.name = name;
      if (level) updates.level = level;
      if (learningGoals) updates.learning_goals = learningGoals;

      if (preferences) {
        if (preferences.dailyGoal !== undefined)
          updates.daily_goal = preferences.dailyGoal;
        if (preferences.notifications !== undefined)
          updates.notifications = preferences.notifications;
        if (preferences.theme !== undefined) updates.theme = preferences.theme;
      }

      // Update user profile
      const { data: updatedProfile, error } = await db
        .from(TABLES.USERS)
        .update(updates)
        .eq("id", userId)
        .select()
        .maybeSingle();

      if (error || !updatedProfile) {
        return res.status(500).json({
          success: false,
          error: {
            message: "Failed to update profile",
          },
        });
      }

      // Transform to match expected User type
      const transformedProfile: User = {
        id: updatedProfile.id,
        name: updatedProfile.name,
        email: updatedProfile.email,
        level: updatedProfile.level,
        points: updatedProfile.points,
        streakDays: updatedProfile.streak_days,
        joinedAt: updatedProfile.joined_at,
        learningGoals: updatedProfile.learning_goals,
        completedLessons: updatedProfile.completed_lessons,
        lastActive: updatedProfile.last_active,
        preferences: {
          dailyGoal: updatedProfile.daily_goal,
          notifications: updatedProfile.notifications,
          theme: updatedProfile.theme as "light" | "dark",
        },
      };

      return res.status(200).json({
        success: true,
        data: transformedProfile,
      });
    } else {
      return res.status(405).json({
        success: false,
        error: {
          message: "Method not allowed",
        },
      });
    }
  } catch (error) {
    console.error("Profile API error:", error);
    return res.status(500).json({
      success: false,
      error: {
        message: "Internal server error",
      },
    });
  }
}

export default authMiddleware(handler);
