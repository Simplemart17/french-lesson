import lessonApiService from '@/services/api/lessonApiService';
import { Lesson, LessonProgress, LessonSection, LessonExercise, LessonSubmissionResult } from '@/types/api';

/**
 * Lesson Service
 *
 * This service provides a wrapper around the lesson API service with additional
 * functionality for caching and offline support.
 */
class LessonService {
  private cache: Map<string, unknown> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private cacheDuration = 30 * 60 * 1000; // 30 minutes

  /**
   * Get lessons with optional filtering
   * @param level Optional level filter (e.g., 'A1', 'B2')
   * @param topic Optional topic filter
   * @returns Array of lessons matching the filters
   */
  async getLessons(
    level?: string,
    topic?: string
  ): Promise<Lesson[]> {
    const cacheKey = `lessons-${level || 'all'}-${topic || 'all'}`;

    // Check cache first
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey) as Lesson[];
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
        return this.cache.get(cacheKey) as Lesson[];
      }

      return [];
    }
  }

  /**
   * Get a complete lesson by ID with all sections and exercises
   * @param id Lesson ID
   * @returns Complete lesson with sections and exercises, or null if not found
   */
  async getLesson(id: string): Promise<Lesson | null> {
    const cacheKey = `lesson-${id}`;

    // Check cache first
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey) as Lesson | null;
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
        return this.cache.get(cacheKey) as Lesson | null;
      }

      return null;
    }
  }

  /**
   * Get sections for a specific lesson
   * @param lessonId Lesson ID
   * @returns Array of lesson sections
   */
  async getLessonSections(lessonId: string): Promise<LessonSection[]> {
    const cacheKey = `lesson-sections-${lessonId}`;

    // Check cache first
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey) as LessonSection[];
    }

    try {
      const sections = await lessonApiService.getLessonSections(lessonId);

      // Cache the result
      this.setCache(cacheKey, sections);
      return sections;
    } catch (error) {
      console.error(`Error fetching sections for lesson ${lessonId}:`, error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey) as LessonSection[];
      }

      return [];
    }
  }

  /**
   * Get exercises for a specific lesson section
   * @param sectionId Section ID
   * @returns Array of exercises for the section
   */
  async getSectionExercises(sectionId: string): Promise<LessonExercise[]> {
    const cacheKey = `section-exercises-${sectionId}`;

    // Check cache first
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey) as LessonExercise[];
    }

    try {
      const exercises = await lessonApiService.getSectionExercises(sectionId);

      // Cache the result
      this.setCache(cacheKey, exercises);
      return exercises;
    } catch (error) {
      console.error(`Error fetching exercises for section ${sectionId}:`, error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey) as LessonExercise[];
      }

      return [];
    }
  }

  /**
   * Get progress for a specific lesson
   * @param lessonId Lesson ID
   * @returns Lesson progress or null if not found
   */
  async getLessonProgress(lessonId: string): Promise<LessonProgress | null> {
    const cacheKey = `lesson-progress-${lessonId}`;

    // Check cache first
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey) as LessonProgress | null;
    }

    try {
      const progressList = await lessonApiService.getLessonProgress(lessonId);

      if (progressList && progressList.length > 0) {
        const progress = progressList[0];
        // Verify the lesson ID matches
        if (progress.lessonId === lessonId) {
          // Cache the result
          this.setCache(cacheKey, progress);
          return progress;
        }
      }

      return null;
    } catch (error) {
      console.error(`Error fetching lesson progress for lesson ${lessonId}:`, error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey) as LessonProgress | null;
      }

      return null;
    }
  }

  /**
   * Update lesson progress
   * @param lessonId Lesson ID
   * @param completed Whether the lesson is completed
   * @param score Score achieved in the lesson (0-100)
   * @returns Updated lesson progress or null if failed
   */
  async updateLessonProgress(
    lessonId: string,
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
        // Invalidate related caches
        this.invalidateCache(`lesson-progress-${lessonId}`);
        this.invalidateCache('all-lesson-progress');
        return response;
      }

      return null;
    } catch (error) {
      console.error(`Error updating lesson progress for lesson ${lessonId}:`, error);
      return null;
    }
  }

  /**
   * Submit answers for lesson exercises
   * @param lessonId Lesson ID
   * @param answers Object mapping exercise IDs to user answers
   * @returns Submission result with score and feedback
   */
  async submitLessonAnswers(
    lessonId: string,
    answers: Record<string, string | string[]>
  ): Promise<LessonSubmissionResult | null> {
    try {
      const result = await lessonApiService.submitLessonAnswers(lessonId, answers);

      if (!result) return null;

      // Calculate if the lesson is completed based on the score
      // (typically a score of 70% or higher is considered passing)
      const isCompleted = result.score >= 70;

      // If the submission was successful and the score is high enough,
      // update the lesson progress
      if (isCompleted) {
        await this.updateLessonProgress(lessonId, true, result.score);
      }

      return {
        score: result.score,
        feedback: result.feedback,
        completed: isCompleted
      };
    } catch (error) {
      console.error(`Error submitting answers for lesson ${lessonId}:`, error);
      return null;
    }
  }

  /**
   * Get all lesson progress for the current user
   * @returns Array of lesson progress items
   */
  async getAllLessonProgress(): Promise<LessonProgress[]> {
    const cacheKey = 'all-lesson-progress';

    // Check cache first
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey) as LessonProgress[];
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
        return this.cache.get(cacheKey) as LessonProgress[];
      }

      return [];
    }
  }

  /**
   * Get recommended lessons based on user progress
   * @param count Number of lessons to recommend
   * @returns Array of recommended lessons
   */
  async getRecommendedLessons(count: number = 3): Promise<Lesson[]> {
    const cacheKey = `recommended-lessons-${count}`;

    // Check cache first
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey) as Lesson[];
    }

    try {
      const lessons = await lessonApiService.getRecommendedLessons(count);

      // Cache the result
      this.setCache(cacheKey, lessons);
      return lessons;
    } catch (error) {
      console.error('Error fetching recommended lessons:', error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey) as Lesson[];
      }

      return [];
    }
  }

  /**
   * Check if cache is valid
   * @param key Cache key
   * @returns Whether the cache is valid
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
   * @param key Cache key
   * @param data Data to cache
   */
  private setCache(key: string, data: unknown): void {
    this.cache.set(key, data);
    this.cacheExpiry.set(key, Date.now() + this.cacheDuration);
  }

  /**
   * Invalidate cache for a specific key
   * @param key Cache key to invalidate
   */
  private invalidateCache(key: string): void {
    this.cache.delete(key);
    this.cacheExpiry.delete(key);
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }
}

// Create and export lesson service instance
const lessonService = new LessonService();
export default lessonService;