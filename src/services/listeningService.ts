import { localStorageCache } from '@/utils/cache';
import listeningApiService from './api/listeningApiService';

/**
 * Listening Service
 *
 * This service provides listening comprehension exercises with caching.
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

      // Call the API service
      const exercises = await listeningApiService.getExercises(
        undefined, // type
        difficulty
      );

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
      // Call the API service
      const exercise = await listeningApiService.getExercise(id.toString());

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
      // For comprehension exercises, we need to format the answers
      const formattedAnswers = answers.map((answer, index) => ({
        questionId: `q${index + 1}`,
        answer: answer.toString()
      }));

      // Call the API service
      const result = await listeningApiService.submitComprehension(
        exerciseId.toString(),
        formattedAnswers
      );

      // Extract correct answers from the feedback
      const correctAnswerIds = result.feedback
        .filter(item => item.isCorrect)
        .map(item => parseInt(item.questionId.replace('q', '')));

      return {
        score: result.score || 0,
        correctAnswers: correctAnswerIds,
        feedback: 'Your answers have been submitted. You got ' +
          result.correctAnswers + ' out of ' + result.totalQuestions + ' correct.'
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
