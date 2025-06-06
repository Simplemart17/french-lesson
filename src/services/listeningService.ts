import { localStorageCache } from '@/utils/cache';
import listeningApiService from './api/listeningApiService';

interface ListeningExercise {
  id: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  audioUrl: string;
  transcript?: string;
  text?: string;
  type?: 'dictation' | 'comprehension';
  questions?: Array<{
    id: string;
    text: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }>;
}

interface ApiListeningQuestion {
  id: string;
  text?: string;
  question?: string;
  options: string[];
  correctAnswer?: string;
  explanation?: string;
}

interface ApiListeningExercise {
  id: string | number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  audioUrl: string;
  transcript?: string;
  text?: string;
  type?: 'dictation' | 'comprehension';
  questions?: ApiListeningQuestion[];
}

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
  async getListeningExercises(difficulty?: string): Promise<ListeningExercise[]> {
    const cacheKey = `listening-exercises-${difficulty || 'all'}`;

    // Check cache first
    const cachedData = this.cache.get<ListeningExercise[]>(cacheKey);
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

      // Transform API response to match our interface
      const transformedExercises = (exercises as ApiListeningExercise[]).map(exercise => ({
        ...exercise,
        id: typeof exercise.id === 'string' ? parseInt(exercise.id) : exercise.id,
        questions: exercise.questions?.map((q: ApiListeningQuestion) => ({
          id: q.id,
          text: q.question || q.text || '',
          options: q.options,
          correctAnswer: q.correctAnswer?.toString() || '',
          explanation: q.explanation || ''
        }))
      }));

      // Cache the result
      this.cache.set(cacheKey, transformedExercises, this.cacheDuration);

      return transformedExercises;
    } catch (error) {
      console.error('Error fetching listening exercises:', error);
      return [];
    }
  }

  /**
   * Get a specific listening exercise by ID
   */
  async getListeningExercise(id: number): Promise<ListeningExercise | null> {
    const cacheKey = `listening-exercise-${id}`;

    // Check cache first
    const cachedData = this.cache.get<ListeningExercise>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      // Call the API service
      const exercise = await listeningApiService.getExercise(id.toString());

      if (!exercise) {
        return null;
      }

      // Transform API response to match our interface
      const transformedExercise = {
        ...exercise,
        id: typeof exercise.id === 'string' ? parseInt(exercise.id) : exercise.id,
        questions: (exercise as ApiListeningExercise).questions?.map((q: ApiListeningQuestion) => ({
          id: q.id,
          text: q.question || q.text || '',
          options: q.options,
          correctAnswer: q.correctAnswer?.toString() || '',
          explanation: q.explanation || ''
        }))
      };

      // Cache the result
      this.cache.set(cacheKey, transformedExercise, this.cacheDuration);

      return transformedExercise;
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
