import grammarApiService from '@/services/api/grammarApiService';

// Define types if not available in @/types/api
interface GrammarExercise {
  id: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'multiple-choice' | 'fill-in-blank' | 'reorder';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
}

interface GrammarCheckResponse {
  text: string;
  corrections: Array<{
    original: string;
    corrected: string;
    explanation: string;
    position: {
      start: number;
      end: number;
    };
    type: 'grammar' | 'spelling' | 'punctuation' | 'style';
    severity: 'error' | 'warning' | 'suggestion';
  }>;
  score: number;
}

interface ApiGrammarProgress {
  exerciseId?: number;
  id?: number;
  score?: number;
  completedAt?: string;
  attempts?: number;
}

interface GrammarProgress {
  exerciseId: number;
  score: number;
  completedAt: string;
  attempts: number;
}

/**
 * Grammar Service
 *
 * This service provides a wrapper around the grammar API service with additional
 * functionality for caching and offline support.
 */
class GrammarService {
  private cache: Map<string, unknown> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private cacheDuration = 30 * 60 * 1000; // 30 minutes

  /**
   * Get grammar exercises with optional filtering
   */
  async getGrammarExercises(
    difficulty?: string,
    category?: string
  ): Promise<GrammarExercise[]> {
    const cacheKey = `grammar-exercises-${difficulty || 'all'}-${category || 'all'}`;

    // Check cache first
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey) as GrammarExercise[];
    }

    try {
      const response = await grammarApiService.getExercises({
        difficulty,
        category
      });

      if (response.data) {
        // Cache the result
        this.setCache(cacheKey, response.data.items);
        return response.data.items as GrammarExercise[];
      }

      return [];
    } catch (error) {
      console.error('Error fetching grammar exercises:', error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey) as GrammarExercise[];
      }

      return [];
    }
  }

  /**
   * Get grammar exercise by ID
   */
  async getGrammarExercise(id: number): Promise<GrammarExercise | null> {
    const cacheKey = `grammar-exercise-${id}`;

    // Check cache first
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey) as GrammarExercise | null;
    }

    try {
      const response = await grammarApiService.getExercise(id);

      if (response.data) {
        // Cache the result
        this.setCache(cacheKey, response.data);
        return response.data as GrammarExercise;
      }

      return null;
    } catch (error) {
      console.error(`Error fetching grammar exercise ${id}:`, error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey) as GrammarExercise | null;
      }

      return null;
    }
  }

  /**
   * Check grammar
   */
  async checkGrammar(text: string): Promise<GrammarCheckResponse> {
    try {
      const response = await grammarApiService.checkGrammar(text);

      if (response) {
        return response as GrammarCheckResponse;
      }

      throw new Error('Failed to check grammar');
    } catch (error) {
      console.error('Error checking grammar:', error);

      // Return a basic response if API fails
      return {
        text,
        corrections: [],
        score: 0
      };
    }
  }

  /**
   * Get grammar progress
   */
  async getGrammarProgress(): Promise<GrammarProgress[]> {
    const cacheKey = 'grammar-progress';

    // Check cache first
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey) as GrammarProgress[];
    }

    try {
      const response = await grammarApiService.getProgress();

      if (response.data) {
        // Transform the API response to match our interface
        const progressData = (response.data as ApiGrammarProgress[]).map(item => ({
          exerciseId: item.exerciseId || item.id || 0,
          score: item.score || 0,
          completedAt: item.completedAt || new Date().toISOString(),
          attempts: item.attempts || 1
        }));
        // Cache the result
        this.setCache(cacheKey, progressData);
        return progressData;
      }

      return [];
    } catch (error) {
      console.error('Error fetching grammar progress:', error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey) as GrammarProgress[];
      }

      return [];
    }
  }

  /**
   * Update grammar progress
   */
  async updateGrammarProgress(exerciseId: number, score: number): Promise<boolean> {
    try {
      const response = await grammarApiService.updateProgress(exerciseId, score);

      if (response.data) {
        // Invalidate progress cache
        this.invalidateCache('grammar-progress');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error updating grammar progress:', error);
      return false;
    }
  }

  /**
   * Check if cache is valid
   */
  private isValidCache(key: string): boolean {
    if (!this.cache.has(key) || !this.cacheExpiry.has(key)) {
      return false;
    }

    const expiry = this.cacheExpiry.get(key) || 0;
    return Date.now() < expiry;
  }

  /**
   * Set cache with expiry
   */
  private setCache(key: string, data: unknown): void {
    this.cache.set(key, data);
    this.cacheExpiry.set(key, Date.now() + this.cacheDuration);
  }

  /**
   * Invalidate cache for a specific key
   */
  private invalidateCache(key: string): void {
    this.cache.delete(key);
    this.cacheExpiry.delete(key);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }
}

// Create and export grammar service instance
const grammarService = new GrammarService();
export default grammarService;
