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
      console.error("Error fetching lesson sections:", sectionsError);
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
      .in("session_id", sectionIds);

    if (exercisesError) {
      console.error("Error fetching lesson exercises:", exercisesError);
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

    // Check for existing progress to preserve started_at
    const { data: existingProgress } = await db
      .from(TABLES.LESSON_PROGRESS)
      .select("started_at")
      .eq("user_id", userId)
      .eq("lesson_id", lessonId)
      .single();

    const now = new Date().toISOString();
    const progressData = {
      user_id: userId,
      lesson_id: lessonId,
      score: score,
      completed: completed,
      started_at: existingProgress?.started_at || now,
      completed_at: completed ? now : null,
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

    // Update XP and streak when lesson is completed
    if (completed) {
      try {
        const { data: userData } = await db
          .from(TABLES.USERS)
          .select("points, streak_days, last_active")
          .eq("id", userId)
          .single();

        if (userData) {
          // Award XP: base 10 + bonus for high scores
          const xpEarned = 10 + Math.round(score / 10);
          const newPoints = (userData.points || 0) + xpEarned;

          // Calculate streak
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const lastActive = userData.last_active ? new Date(userData.last_active) : null;
          if (lastActive) lastActive.setHours(0, 0, 0, 0);

          let newStreak = userData.streak_days || 0;
          if (!lastActive) {
            newStreak = 1;
          } else {
            const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
              newStreak += 1;
            } else if (diffDays > 1) {
              newStreak = 1;
            }
            // diffDays === 0: same day, keep current streak
          }

          await db
            .from(TABLES.USERS)
            .update({
              points: newPoints,
              streak_days: newStreak,
              last_active: now,
            })
            .eq("id", userId);
        }
      } catch (xpError) {
        console.error("Error updating XP/streak:", xpError);
        // Non-fatal: don't fail the submission
      }
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
