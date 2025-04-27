import lessonApiService from '@/services/api/lessonApiService';
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
      const lessons = await lessonApiService.getLessons(level, topic);

      // Cache the result
      this.setCache(cacheKey, lessons);
      return lessons;
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
      const lesson = await lessonApiService.getLesson(id);

      if (lesson) {
        // Cache the result
        this.setCache(cacheKey, lesson);
        return lesson;
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
      const progressList = await lessonApiService.getLessonProgress(lessonId);

      if (progressList && progressList.length > 0) {
        const progress = progressList[0];
        // Cache the result
        this.setCache(cacheKey, progress);
        return progress;
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
    score: number = 0
  ): Promise<LessonProgress | null> {
    try {
      const response = await lessonApiService.updateLessonProgress(
        lessonId,
        completed,
        score
      );

      if (response) {
        // Invalidate progress cache
        this.invalidateCache(`lesson-progress-${lessonId}`);
        return response;
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
      // Get all progress by calling getLessonProgress without a specific lessonId
      const progressList = await lessonApiService.getLessonProgress();

      // Cache the result
      this.setCache(cacheKey, progressList);
      return progressList;
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
