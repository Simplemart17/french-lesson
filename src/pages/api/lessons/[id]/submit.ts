import { NextApiResponse } from "next";
import {
  ApiResponse,
  LessonSubmissionResult,
  AuthenticatedRequest,
} from "@/types/api";
import { authMiddleware } from "@/utils/authMiddleware";
import { supabase, TABLES } from "@/lib/supabase";

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse<LessonSubmissionResult>>
) {
  // Only allow POST for this endpoint
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: { message: "Method not allowed" } });
  }

  try {
    const { id } = req.query;
    const { answers } = req.body;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        error: {
          message: "Invalid lesson ID",
        },
      });
    }

    const lessonId = id;

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({
        success: false,
        error: {
          message: "Invalid answers format",
        },
      });
    }

    // Get the user ID from the authenticated user
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          message: "User not authenticated",
        },
      });
    }

    // Check if the lesson exists and get its data
    const { data: lesson, error: lessonError } = await supabase
      .from(TABLES.LESSONS)
      .select("*")
      .eq("id", lessonId)
      .single();

    if (lessonError || !lesson) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Lesson not found",
        },
      });
    }

    // Get lesson sections
    const { data: sections, error: sectionsError } = await supabase
      .from(TABLES.LESSON_SECTIONS)
      .select("*")
      .eq("lesson_id", lessonId);

    if (sectionsError) {
      return res.status(500).json({
        success: false,
        error: {
          message: "Failed to fetch lesson sections",
        },
      });
    }

    if (!sections) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Lesson sections not found",
        },
      });
    }

    // Get exercises from lesson_exercises table based on session_id from sections
    interface Exercise {
      id: string;
      correctAnswer: string | string[];
      explanation?: string;
    }
    const exercises: Exercise[] = [];

    // Try to get exercises from the lesson_exercises table
    // Since the schema uses session_id, we'll look for exercises that might be linked to sections
    for (const section of sections) {
      // Check if section content contains exercises (JSON format)
      if (section.content) {
        try {
          const sectionData =
            typeof section.content === "string"
              ? JSON.parse(section.content)
              : section.content;

          if (sectionData.exercises && Array.isArray(sectionData.exercises)) {
            const sectionExercises = sectionData.exercises.map(
              (ex: Exercise) => ({
                id: ex.id,
                correctAnswer: ex.correctAnswer,
                explanation: ex.explanation,
              })
            );
            exercises.push(...sectionExercises);
          }
        } catch (parseError) {
          console.warn("Failed to parse section content as JSON:", parseError);
        }
      }
    }

    // If no exercises found, return early with appropriate message
    if (exercises.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: "No exercises found for this lesson",
        },
      });
    }

    // Calculate the score and generate feedback
    let correctCount = 0;
    const feedback: Record<string, { correct: boolean; explanation?: string }> =
      {};

    // Process each answer
    for (const [exerciseIdStr, userAnswer] of Object.entries(answers)) {
      const exerciseId = exerciseIdStr;
      const exercise = exercises.find((ex) => ex.id === exerciseId);

      if (!exercise) {
        feedback[exerciseId] = {
          correct: false,
          explanation: "Exercise not found",
        };
        continue;
      }

      // Check if the answer is correct
      let isCorrect = false;

      if (Array.isArray(exercise.correctAnswer)) {
        // For multiple correct answers (e.g., matching exercises)
        if (Array.isArray(userAnswer)) {
          isCorrect =
            exercise.correctAnswer.length === userAnswer.length &&
            exercise.correctAnswer.every((answer: string) =>
              userAnswer.includes(answer)
            );
        }
      } else {
        // For single correct answer
        isCorrect = exercise.correctAnswer === userAnswer;
      }

      if (isCorrect) {
        correctCount++;
      }

      feedback[exerciseId] = {
        correct: isCorrect,
        explanation: exercise.explanation || undefined,
      };
    }

    // Calculate the score as a percentage
    const totalExercises = Object.keys(answers).length;
    const score =
      totalExercises > 0
        ? Math.round((correctCount / totalExercises) * 100)
        : 0;

    // Determine if the lesson is completed (typically 70% or higher is passing)
    const completed = score >= 70;

    // Update the user's progress
    const progressData = {
      user_id: userId,
      lesson_id: lessonId,
      score: score,
      completed: completed,
      started_at: new Date().toISOString(),
      completed_at: completed ? new Date().toISOString() : null,
      answers: answers,
    };

    const { error: upsertError } = await supabase
      .from(TABLES.LESSON_PROGRESS)
      .upsert(progressData, {
        onConflict: "user_id,lesson_id",
      });

    if (upsertError) {
      console.error("Error updating lesson progress:", upsertError);
      return res.status(500).json({
        success: false,
        error: {
          message: "Failed to update lesson progress",
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        score,
        feedback,
        completed,
      },
    });
  } catch (error) {
    console.error("Error submitting lesson answers:", error);
    return res.status(500).json({
      success: false,
      error: {
        message: "Failed to submit lesson answers",
      },
    });
  }
}

export default authMiddleware(handler);
