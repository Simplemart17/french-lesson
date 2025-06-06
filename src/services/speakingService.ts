import { localStorageCache } from '@/utils/cache';
import aiService from './aiService';
import speakingApiService from './api/speakingApiService';

interface SpeakingExercise {
  id: number;
  title: string;
  prompt: string;
  translation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'pronunciation' | 'conversation' | 'reading';
}

interface SpeakingPhrase {
  id: number;
  text: string;
  translation: string;
  difficulty: string;
}

/**
 * Speaking Service
 *
 * This service provides speaking practice exercises with caching.
 */
class SpeakingService {
  private cache = localStorageCache;
  private cacheDuration = 30 * 60 * 1000; // 30 minutes

  /**
   * Get speaking exercises with optional filtering
   */
  async getSpeakingExercises(difficulty?: string): Promise<SpeakingExercise[]> {
    const cacheKey = `speaking-exercises-${difficulty || 'all'}`;

    // Check cache first
    const cachedData = this.cache.get<SpeakingExercise[]>(cacheKey);
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
      const apiExercises = await speakingApiService.getExercises(
        difficulty,
        undefined // category
      );

      // Transform API response to match our interface
      const exercises = apiExercises.map(exercise => ({
        id: exercise.id,
        title: `Speaking Exercise ${exercise.id}`, // Generate a title
        prompt: exercise.prompt,
        translation: exercise.translation,
        difficulty: exercise.difficulty,
        type: 'pronunciation' as const // Default type
      }));

      // Cache the result
      this.cache.set(cacheKey, exercises, this.cacheDuration);

      return exercises;
    } catch (error) {
      console.error('Error fetching speaking exercises:', error);
      return [];
    }
  }

  /**
   * Get a specific speaking exercise by ID
   */
  async getSpeakingExercise(id: number): Promise<SpeakingExercise | null> {
    const cacheKey = `speaking-exercise-${id}`;

    // Check cache first
    const cachedData = this.cache.get<SpeakingExercise>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      // Call the API service
      const apiExercise = await speakingApiService.getExercise(id);

      if (!apiExercise) {
        return null;
      }

      // Transform API response to match our interface
      const exercise = {
        id: apiExercise.id,
        title: `Speaking Exercise ${apiExercise.id}`, // Generate a title
        prompt: apiExercise.prompt,
        translation: apiExercise.translation,
        difficulty: apiExercise.difficulty,
        type: 'pronunciation' as const // Default type
      };

      // Cache the result
      this.cache.set(cacheKey, exercise, this.cacheDuration);

      return exercise;
    } catch (error) {
      console.error(`Error fetching speaking exercise ${id}:`, error);
      return null;
    }
  }

  /**
   * Get a specific phrase by ID
   */
  async getPhrase(id: number): Promise<SpeakingPhrase | null> {
    const cacheKey = `phrase-${id}`;

    // Check cache first
    const cachedData = this.cache.get<SpeakingPhrase>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      // For now, we'll use the exercise API since we don't have a separate phrase API
      // In a real implementation, this would call a specific phrase endpoint
      const exercise = await speakingApiService.getExercise(id);

      if (!exercise) {
        return null;
      }

      // Convert exercise to phrase format
      const phrase = {
        id: exercise.id,
        text: exercise.prompt,
        translation: exercise.translation,
        difficulty: exercise.difficulty
      };

      // Cache the result
      this.cache.set(cacheKey, phrase, this.cacheDuration);

      return phrase;
    } catch (error) {
      console.error(`Error fetching phrase ${id}:`, error);
      return null;
    }
  }

  /**
   * Check pronunciation of a phrase
   */
  async checkPronunciation(
    phraseId: number,
    audioBlob: Blob
  ): Promise<{
    accuracy: number;
    feedback: string[];
    details?: Record<string, unknown>;
  }> {
    try {
      // Get the phrase text
      const phrase = await this.getPhrase(phraseId);

      if (!phrase) {
        throw new Error(`Phrase ${phraseId} not found`);
      }

      // First try to use the speaking API service
      try {
        const result = await speakingApiService.evaluateSpeaking(phraseId, audioBlob, phrase.text);

        // Convert the API response to our format
        const feedback = [result.feedback];

        return {
          accuracy: result.pronunciation,
          feedback,
          details: {
            accuracy: result.accuracy,
            fluency: result.fluency,
            type: result.type
          }
        };
      } catch (apiError) {
        console.warn('Speaking API failed, falling back to AI service:', apiError);

        // Fallback to AI service if the API fails
        const result = await aiService.analyzePronunciation(audioBlob, phrase.text);

        // Process the result
        const accuracy = result.overallScore;

        // Generate feedback based on accuracy
        const feedback = [];

        if (accuracy >= 90) {
          feedback.push('Excellent pronunciation!');
        } else if (accuracy >= 70) {
          feedback.push('Good pronunciation. Keep practicing!');
        } else if (accuracy >= 50) {
          feedback.push('Your pronunciation needs some work.');
        } else {
          feedback.push('You need to practice more on your pronunciation.');
        }

        // Add specific feedback from the analysis
        if (result.problemSounds && result.problemSounds.length > 0) {
          result.problemSounds.forEach((problem: { sound: string; description: string }) => {
            feedback.push(`Work on the "${problem.sound}" sound: ${problem.description}`);
          });
        }

        // Add recommendations
        if (result.recommendations && result.recommendations.length > 0) {
          result.recommendations.forEach((recommendation: string) => {
            feedback.push(recommendation);
          });
        }

        return {
          accuracy,
          feedback,
          details: {
            wordScores: result.wordScores,
            problemSounds: result.problemSounds
          }
        };
      }
    } catch (error) {
      console.error('Error checking pronunciation:', error);

      // Return a basic response if there's an error
      return {
        accuracy: 0,
        feedback: ['An error occurred while analyzing your pronunciation.']
      };
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    const keys = this.cache.keys().filter(key =>
      key.startsWith('speaking-exercise-') ||
      key.startsWith('speaking-exercises-') ||
      key.startsWith('phrase-')
    );

    keys.forEach(key => this.cache.remove(key));
  }
}

// Create and export speaking service instance
const speakingService = new SpeakingService();
export default speakingService;
