import lessonApiService from './api/lessonApiService';
import { Lesson, LessonProgress } from '@/types/api';

/**
 * Lesson Service
 *
 * This service provides a wrapper around the lesson API service with additional
 * functionality for caching and offline support.
 */
class LessonService {
  private cache: Map<string, any> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private cacheDuration = 30 * 60 * 1000; // 30 minutes

  /**
   * Get lessons with optional filtering
   */
  async getLessons(
    level?: string,
    topic?: string
  ): Promise<Lesson[]> {
    const cacheKey = `lessons-${level || 'all'}-${topic || 'all'}`;

    // Check cache first
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await lessonApiService.getLessons({
        level,
        topic
      });

      if (response.success && response.data) {
        // Cache the result
        this.setCache(cacheKey, response.data);
        return response.data;
      }

      return [];
    } catch (error) {
      console.error('Error fetching lessons:', error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      return [];
    }
  }

  /**
   * Get lesson by ID
   */
  async getLesson(id: number): Promise<Lesson | null> {
    const cacheKey = `lesson-${id}`;

    // Check cache first
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await lessonApiService.getLesson(id);

      if (response.success && response.data) {
        // Cache the result
        this.setCache(cacheKey, response.data);
        return response.data;
      }

      return null;
    } catch (error) {
      console.error(`Error fetching lesson ${id}:`, error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      return null;
    }
  }

  /**
   * Get lesson progress
   */
  async getLessonProgress(lessonId: number): Promise<LessonProgress | null> {
    const cacheKey = `lesson-progress-${lessonId}`;

    // Check cache first
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await lessonApiService.getLessonProgress(lessonId);

      if (response.success && response.data) {
        // Cache the result
        this.setCache(cacheKey, response.data);
        return response.data;
      }

      return null;
    } catch (error) {
      console.error(`Error fetching lesson progress for lesson ${lessonId}:`, error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      return null;
    }
  }

  /**
   * Update lesson progress
   */
  async updateLessonProgress(
    lessonId: number,
    completed: boolean,
    score?: number
  ): Promise<LessonProgress | null> {
    try {
      const response = await lessonApiService.updateLessonProgress(lessonId, {
        completed,
        score
      });

      if (response.success && response.data) {
        // Invalidate progress cache
        this.invalidateCache(`lesson-progress-${lessonId}`);
        return response.data;
      }

      return null;
    } catch (error) {
      console.error(`Error updating lesson progress for lesson ${lessonId}:`, error);
      return null;
    }
  }

  /**
   * Get all lesson progress
   */
  async getAllLessonProgress(): Promise<LessonProgress[]> {
    const cacheKey = 'all-lesson-progress';

    // Check cache first
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await lessonApiService.getAllLessonProgress();

      if (response.success && response.data) {
        // Cache the result
        this.setCache(cacheKey, response.data);
        return response.data;
      }

      return [];
    } catch (error) {
      console.error('Error fetching all lesson progress:', error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      return [];
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
  private setCache(key: string, data: any): void {
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

// Create and export lesson service instance
const lessonService = new LessonService();
export default lessonService;
