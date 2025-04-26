import { localStorageCache } from '@/utils/cache';
import { apiClient } from './api/apiClient';

/**
 * Listening Service
 *
 * This service provides listening comprehension exercises.
 * Currently using mock data, but designed to be replaced with real API calls.
 */
class ListeningService {
  private cache = localStorageCache;
  private cacheDuration = 30 * 60 * 1000; // 30 minutes

  /**
   * Get listening exercises with optional filtering
   */
  async getListeningExercises(difficulty?: string): Promise<any[]> {
    const cacheKey = `listening-exercises-${difficulty || 'all'}`;

    // Check cache first
    const cachedData = this.cache.get<any[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      // Build query parameters
      const params: Record<string, string> = {};
      if (difficulty) {
        params.difficulty = difficulty;
      }

      // Call the API
      const response = await apiClient.get('/api/listening/exercises', { params });

      if (!response.data || !response.data.success) {
        throw new Error('Failed to fetch listening exercises');
      }

      const exercises = response.data.data || [];

      // Cache the result
      this.cache.set(cacheKey, exercises, this.cacheDuration);

      return exercises;
    } catch (error) {
      console.error('Error fetching listening exercises:', error);
      return [];
    }
  }

  /**
   * Get a specific listening exercise by ID
   */
  async getListeningExercise(id: number): Promise<any | null> {
    const cacheKey = `listening-exercise-${id}`;

    // Check cache first
    const cachedData = this.cache.get<any>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      // Call the API
      const response = await apiClient.get(`/api/listening/exercises/${id}`);

      if (!response.data || !response.data.success) {
        throw new Error(`Failed to fetch listening exercise ${id}`);
      }

      const exercise = response.data.data;

      if (!exercise) {
        return null;
      }

      // Cache the result
      this.cache.set(cacheKey, exercise, this.cacheDuration);

      return exercise;
    } catch (error) {
      console.error(`Error fetching listening exercise ${id}:`, error);
      return null;
    }
  }

  /**
   * Submit answers for a listening exercise
   */
  async submitListeningAnswers(
    exerciseId: number,
    answers: number[]
  ): Promise<{
    score: number;
    correctAnswers: number[];
    feedback: string;
  }> {
    try {
      // Call the API to submit answers
      const response = await apiClient.post(`/api/listening/exercises/${exerciseId}/submit`, {
        answers
      });

      if (!response.data || !response.data.success) {
        throw new Error('Failed to submit listening answers');
      }

      const result = response.data.data;

      return {
        score: result.score || 0,
        correctAnswers: result.correctAnswers || [],
        feedback: result.feedback || 'Your answers have been submitted.'
      };
    } catch (error) {
      console.error('Error submitting listening answers:', error);

      // Return a basic response if there's an error
      return {
        score: 0,
        correctAnswers: [],
        feedback: 'An error occurred while processing your answers.'
      };
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    const keys = this.cache.keys().filter(key =>
      key.startsWith('listening-exercise-') ||
      key.startsWith('listening-exercises-')
    );

    keys.forEach(key => this.cache.remove(key));
  }
}

// Create and export listening service instance
const listeningService = new ListeningService();
export default listeningService;
