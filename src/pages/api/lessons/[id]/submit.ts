import { NextApiResponse } from "next";
import {
  ApiResponse,
  LessonSubmissionResult,
  AuthenticatedRequest,
} from "@/types/api";
import { authMiddleware } from "@/utils/authMiddleware";
import { supabase, supabaseAdmin, TABLES } from "@/lib/supabase";

interface LessonExerciseRow {
  id: string;
  correct_answer: string | string[] | null;
  explanation: string | null;
}

function normalizeAnswer(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).toLowerCase().trim()).sort().join("|");
  }
  return String(value ?? "").toLowerCase().trim();
}

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
    const db = supabaseAdmin ?? supabase;
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
    const { data: lesson, error: lessonError } = await db
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
    const { data: sections, error: sectionsError } = await db
      .from(TABLES.LESSON_SECTIONS)
      .select("id")
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

    // Get exercises from lesson_exercises table linked to lesson sections.
    interface Exercise {
      id: string;
      correctAnswer: string | string[];
      explanation?: string;
    }
    const sectionIds = sections.map((section: { id: string }) => section.id);
    if (sectionIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: "No lesson sections found for this lesson",
        },
      });
    }

    const { data: exerciseRows, error: exercisesError } = await db
      .from(TABLES.LESSON_EXERCISES)
      .select("id,correct_answer,explanation")
      .in("section_id", sectionIds);

    if (exercisesError) {
      return res.status(500).json({
        success: false,
        error: {
          message: "Failed to fetch lesson exercises",
        },
      });
    }

    const exercises: Exercise[] = ((exerciseRows || []) as LessonExerciseRow[])
      .filter((row) => row.correct_answer !== null)
      .map((row) => ({
        id: row.id,
        correctAnswer: row.correct_answer as string | string[],
        explanation: row.explanation || undefined,
      }));

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
        isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(exercise.correctAnswer);
      } else {
        // For single correct answer
        isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(exercise.correctAnswer);
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

    const { error: upsertError } = await db
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

    const submission = {
      score,
      feedback,
      completed,
    };

    return res.status(200).json({
      success: true,
      data: submission,
      submission,
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
