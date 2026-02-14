import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "@/utils/authMiddleware";
import { getUserId } from "@/utils/auth";
import { supabase, TABLES } from "@/lib/supabase";
import { getOrCreateUserProfile } from "@/utils/userProfile";

interface ResourceItem {
  id: string;
  title: string;
  type: "lesson" | "exercise" | "video" | "article";
  description: string;
  level: string;
  duration?: number;
  url?: string;
  thumbnail?: string;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: { message: "Method not allowed" },
    });
  }

  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: "User not authenticated" },
      });
    }

    const { data: user, error: userError } = await getOrCreateUserProfile(userId);
    if (userError || !user) {
      console.error("Error fetching/creating user profile:", userError);
      return res.status(500).json({
        success: false,
        error: { message: "Failed to fetch user profile" },
      });
    }

    // Get user's completed lessons
    const { data: completedLessons, error: progressError } = await supabase
      .from(TABLES.LESSON_PROGRESS)
      .select("lesson_id")
      .eq("user_id", userId)
      .eq("completed", true);

    if (progressError) {
      console.error("Error fetching completed lessons:", progressError);
    }

    const completedLessonIds = new Set(
      (completedLessons || []).map((p) => p.lesson_id)
    );

    // Get recommended lessons based on user's level
    let lessonsQuery = supabase
      .from(TABLES.LESSONS)
      .select("*")
      .eq("level", user.level);

    if (completedLessonIds.size > 0) {
      lessonsQuery = lessonsQuery.not(
        "id",
        "in",
        `(${Array.from(completedLessonIds).join(",")})`
      );
    }

    const { data: lessons, error: lessonsError } = await lessonsQuery.limit(3);

    if (lessonsError) {
      console.error("Error fetching recommended lessons:", lessonsError);
    }

    // Get recommended grammar rules
    const { data: grammarRules, error: grammarError } = await supabase
      .from(TABLES.GRAMMAR_RULES)
      .select("*")
      .eq("level", user.level)
      .limit(2);

    if (grammarError) {
      console.error("Error fetching grammar rules:", grammarError);
    }

    // Combine and format resources
    const resources: ResourceItem[] = [
      ...(lessons || []).map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        type: "lesson" as const,
        description: lesson.description,
        level: lesson.level,
        duration: lesson.duration,
        thumbnail: lesson.thumbnail,
      })),
      ...(grammarRules || []).map((rule) => ({
        id: rule.id,
        title: rule.title,
        type: "exercise" as const,
        description: rule.description,
        level: rule.level,
      })),
    ];

    // Add some default resources if we don't have enough
    if (resources.length < 5) {
      const defaultResources: ResourceItem[] = [
        {
          id: "default-1",
          title: "French Pronunciation Guide",
          type: "video",
          description:
            "Learn the basics of French pronunciation with this comprehensive guide.",
          level: user.level,
          url: "https://www.youtube.com/watch?v=example1",
          thumbnail: "/images/pronunciation-guide.jpg",
        },
        {
          id: "default-2",
          title: "Common French Phrases",
          type: "article",
          description: "Essential phrases for everyday conversation in French.",
          level: user.level,
          url: "/articles/common-phrases",
        },
      ];

      resources.push(...defaultResources.slice(0, 5 - resources.length));
    }

    return res.status(200).json({
      success: true,
      data: resources,
    });
  } catch (error) {
    console.error("Error fetching recommended resources:", error);
    return res.status(500).json({
      success: false,
      error: { message: "Failed to fetch recommended resources" },
    });
  }
}

export default authMiddleware(handler);
