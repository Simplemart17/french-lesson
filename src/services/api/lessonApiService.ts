import { ApiResponse, Lesson, LessonProgress, LessonSection, LessonExercise } from '@/types/api';
import apiClient from '@/services/api/apiClient';
import { API_ENDPOINTS } from './apiConfig';

/**
 * Lesson API Service
 *
 * This service handles all lesson-related API calls.
 */
const lessonApiService = {
  /**
   * Get all lessons with optional filtering
   * @param level Optional level filter (e.g., 'A1', 'B2')
   * @param topic Optional topic filter
   * @returns Array of lessons matching the filters
   */
  getLessons: async (level?: string, topic?: string): Promise<Lesson[]> => {
    try {
      const params = { level, topic };
      const response = await apiClient.get<ApiResponse<Lesson[]>>(API_ENDPOINTS.LESSONS.LIST, { params });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error('Error fetching lessons:', error);
      return [];
    }
  },

  /**
   * Get a specific lesson by ID with all its sections and exercises
   * @param id Lesson ID
   * @returns Complete lesson with sections and exercises, or null if not found
   */
  getLesson: async (id: string): Promise<Lesson | null> => {
    try {
      const response = await apiClient.get<ApiResponse<Lesson>>(API_ENDPOINTS.LESSONS.ITEM(id));

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      return null;
    } catch (error) {
      console.error(`Error fetching lesson ${id}:`, error);
      return null;
    }
  },

  /**
   * Get lesson sections for a specific lesson
   * @param lessonId Lesson ID
   * @returns Array of lesson sections
   */
  getLessonSections: async (lessonId: string): Promise<LessonSection[]> => {
    try {
      const response = await apiClient.get<ApiResponse<LessonSection[]>>(
        `${API_ENDPOINTS.LESSONS.ITEM(lessonId)}/sections`
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error(`Error fetching sections for lesson ${lessonId}:`, error);
      return [];
    }
  },

  /**
   * Get exercises for a specific lesson section
   * @param sectionId Section ID
   * @returns Array of exercises for the section
   */
  getSectionExercises: async (sectionId: string): Promise<LessonExercise[]> => {
    try {
      const response = await apiClient.get<ApiResponse<LessonExercise[]>>(
        `/lessons/sections/${sectionId}/exercises`
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error(`Error fetching exercises for section ${sectionId}:`, error);
      return [];
    }
  },

  /**
   * Get user lesson progress for all lessons or a specific lesson
   * @param lessonId Optional lesson ID to filter progress
   * @returns Array of lesson progress items
   */
  getLessonProgress: async (lessonId?: string): Promise<LessonProgress[]> => {
    try {
      const params = lessonId ? { lessonId } : {};
      const response = await apiClient.get<ApiResponse<LessonProgress[]>>(API_ENDPOINTS.LESSONS.PROGRESS, { params });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error('Error fetching lesson progress:', error);
      return [];
    }
  },

  /**
   * Update lesson progress
   * @param lessonId Lesson ID
   * @param completed Whether the lesson is completed
   * @param score Score achieved in the lesson (0-100)
   * @returns Updated lesson progress
   */
  updateLessonProgress: async (
    lessonId: string,
    completed: boolean,
    score: number
  ): Promise<LessonProgress> => {
    try {
      const response = await apiClient.post<ApiResponse<LessonProgress>>(API_ENDPOINTS.LESSONS.PROGRESS, {
        lessonId,
        completed,
        score
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Failed to update lesson progress');
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      throw error;
    }
  },

  /**
   * Submit answers for lesson exercises
   * @param lessonId Lesson ID
   * @param answers Object mapping exercise IDs to user answers
   * @returns Score and feedback for the submitted answers
   */
  submitLessonAnswers: async (
    lessonId: string,
    answers: Record<number, string | string[]>
  ): Promise<{ score: number; feedback: Record<number, { correct: boolean; explanation?: string }> }> => {
    try {
      const response = await apiClient.post<ApiResponse<{
        score: number;
        feedback: Record<number, { correct: boolean; explanation?: string }>;
      }>>(
        `${API_ENDPOINTS.LESSONS.ITEM(lessonId)}/submit`,
        { answers }
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Failed to submit lesson answers');
    } catch (error) {
      console.error('Error submitting lesson answers:', error);
      throw error;
    }
  },

  /**
   * Get recommended next lessons based on user progress
   * @param count Number of lessons to recommend
   * @returns Array of recommended lessons
   */
  getRecommendedLessons: async (count: number = 3): Promise<Lesson[]> => {
    try {
      // Get all lessons and progress
      const [lessons, progress] = await Promise.all([
        lessonApiService.getLessons(),
        lessonApiService.getLessonProgress()
      ]);

      // Create a map of completed lessons
      const completedLessonIds = new Set(
        progress
          .filter(p => p.completed)
          .map(p => p.lessonId)
      );

      // Filter out completed lessons
      const incompleteLessons = lessons.filter(lesson => !completedLessonIds.has(lesson.id));

      // Sort by level (A1, A2, B1, B2, etc.)
      const sortedLessons = incompleteLessons.sort((a, b) => {
        // Extract level number for comparison
        const levelA = a.level.substring(1);
        const levelB = b.level.substring(1);

        // Compare level letter first
        if (a.level[0] !== b.level[0]) {
          return a.level[0].localeCompare(b.level[0]);
        }

        // Then compare level number
        return parseInt(levelA) - parseInt(levelB);
      });

      // Return the first 'count' lessons
      return sortedLessons.slice(0, count);
    } catch (error) {
      console.error('Error getting recommended lessons:', error);
      return [];
    }
  }
};

export default lessonApiService;
