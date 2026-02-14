import { NextApiRequest, NextApiResponse } from "next";
import {
  ApiResponse,
  Lesson,
  DatabaseLessonSection,
  DatabaseLessonExercise,
} from "@/types/api";
import { authMiddleware } from "@/utils/authMiddleware";
import { supabase, TABLES } from "@/lib/supabase";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Lesson>>
) {
  // GET request to retrieve a specific lesson
  if (req.method === "GET") {
    try {
      const { id } = req.query;

      if (!id || typeof id !== "string") {
        return res.status(400).json({
          success: false,
          error: {
            message: "Invalid lesson ID",
          },
        });
      }

      const lessonId = id;

      // Find the lesson by ID with its sections
      const { data: lesson, error } = await supabase
        .from(TABLES.LESSONS)
        .select(
          `
          *,
          sections:${TABLES.LESSON_SECTIONS}(
            *,
            exercises:${TABLES.LESSON_EXERCISES}(*)
          )
        `
        )
        .eq("id", lessonId)
        .single();

      if (error || !lesson) {
        console.error("Lesson query error:", error);
        return res.status(404).json({
          success: false,
          error: {
            message: "Lesson not found",
          },
        });
      }

      // Get user ID if authenticated
      const userId = (req as { user?: { id: string } }).user?.id;

      // Note: We're retrieving the user's progress but not using it in the response yet
      // This could be used in the future to customize the response based on user progress
      if (userId) {
        await supabase
          .from(TABLES.LESSON_PROGRESS)
          .select("*")
          .eq("user_id", userId)
          .eq("lesson_id", lessonId)
          .single();
      }

      // Format the response
      const formattedLesson: Lesson = {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        level: lesson.level,
        duration: lesson.duration,
        topics: lesson.topics,
        sections: (lesson.sections || [])
          .sort((a: DatabaseLessonSection, b: DatabaseLessonSection) => {
            // Define the correct order for section types
            const typeOrder: Record<string, number> = {
              introduction: 1,
              text: 2,
              image: 3,
              audio: 4,
              video: 5,
              practice: 6,
              exercise: 7,
              summary: 8,
            };

            // First sort by type priority, then by order within the same type
            const typeOrderA = typeOrder[a.type] || 999;
            const typeOrderB = typeOrder[b.type] || 999;

            if (typeOrderA !== typeOrderB) {
              return typeOrderA - typeOrderB;
            }

            // If same type, sort by order field
            return a.order - b.order;
          })
          .map((section: DatabaseLessonSection) => ({
            id: section.id,
            lessonId: section.lessonId,
            title: section.title,
            type: section.type,
            content: section.content || undefined,
            audioUrl: section.audioUrl || undefined,
            videoUrl: section.videoUrl || undefined,
            order: section.order,
            exercises: (section.exercises || []).map(
              (exercise: DatabaseLessonExercise) => ({
                id: exercise.id,
                sectionId: exercise.sectionId,
                type: exercise.type,
                question: exercise.question,
                options: exercise.options,
                correctAnswer: exercise.correctAnswer,
                explanation: exercise.explanation || undefined,
              })
            ),
          })),
      };

      return res.status(200).json({
        success: true,
        data: formattedLesson,
        lesson: formattedLesson
      });
    } catch (error) {
      console.error("Error fetching lesson:", error);
      return res.status(500).json({
        success: false,
        error: {
          message: "Internal server error",
        },
      });
    }
  }

  // Method not allowed
  return res.status(405).json({
    success: false,
    error: {
      message: "Method not allowed",
    },
  });
}

export default authMiddleware(handler);
