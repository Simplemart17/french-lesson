import { ApiResponse, Lesson, LessonProgress } from '@/types/api';
import apiClient from '@/services/api/apiClient';
import { API_ENDPOINTS } from './apiConfig';

/**
 * Lesson API Service
 *
 * This service handles all lesson-related API calls.
 */
export const lessonApiService = {
  /**
   * Get all lessons with optional filtering
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
   * Get a specific lesson by ID
   */
  getLesson: async (id: number): Promise<Lesson | null> => {
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
   * Get user lesson progress
   */
  getLessonProgress: async (lessonId?: number): Promise<LessonProgress[]> => {
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
   */
  updateLessonProgress: async (
    lessonId: number,
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
   * Get recommended next lessons based on user progress
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
