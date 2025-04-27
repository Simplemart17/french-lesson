import examApiService from './api/examApiService';
import { ExamModule, ExamResults, ExamQuestion } from '@/types/api';

/**
 * Exam Service
 *
 * This service provides a wrapper around the exam API service with additional
 * functionality for caching and offline support.
 */
class ExamService {
  private cache: Map<string, any> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private cacheDuration = 30 * 60 * 1000; // 30 minutes

  /**
   * Get exam modules with optional filtering
   */
  async getExamModules(
    examType?: string,
    section?: string,
    difficulty?: string
  ): Promise<ExamModule[]> {
    const cacheKey = `exam-modules-${examType || 'all'}-${section || 'all'}-${difficulty || 'all'}`;

    // Check cache first
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await examApiService.getExamModules({
        examType,
        section,
        difficulty
      });

      if (response.success && response.data) {
        // Cache the result
        this.setCache(cacheKey, response.data);
        return response.data;
      }

      return [];
    } catch (error) {
      console.error('Error fetching exam modules:', error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      return [];
    }
  }

  /**
   * Get exam module by ID
   */
  async getExamModule(moduleId: string): Promise<ExamModule | null> {
    const cacheKey = `exam-module-${moduleId}`;

    // Check cache first
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await examApiService.getExamModule(moduleId);

      if (response.success && response.data) {
        // Cache the result
        this.setCache(cacheKey, response.data);
        return response.data;
      }

      return null;
    } catch (error) {
      console.error(`Error fetching exam module ${moduleId}:`, error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      return null;
    }
  }

  /**
   * Get exam questions for a module
   */
  async getExamQuestions(moduleId: string): Promise<ExamQuestion[]> {
    const cacheKey = `exam-questions-${moduleId}`;

    // Check cache first
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await examApiService.getExamQuestions(moduleId);

      if (response.success && response.data) {
        // Cache the result
        this.setCache(cacheKey, response.data);
        return response.data;
      }

      return [];
    } catch (error) {
      console.error(`Error fetching exam questions for module ${moduleId}:`, error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      return [];
    }
  }

  /**
   * Submit exam results
   */
  async submitExamResults(results: ExamResults): Promise<boolean> {
    try {
      const response = await examApiService.submitExamResults(results);
      return response.success;
    } catch (error) {
      console.error('Error submitting exam results:', error);

      // Store results locally if submission fails
      this.storeResultsLocally(results);

      return false;
    }
  }

  /**
   * Get user's exam results
   */
  async getExamResults(): Promise<ExamResults[]> {
    const cacheKey = 'exam-results';

    // Check cache first
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await examApiService.getExamResults();

      if (response.success && response.data) {
        // Cache the result
        this.setCache(cacheKey, response.data);

        // Merge with any locally stored results
        const localResults = this.getLocalResults();
        if (localResults.length > 0) {
          const mergedResults = [...response.data, ...localResults];
          return mergedResults;
        }

        return response.data;
      }

      // Return locally stored results if API fails
      return this.getLocalResults();
    } catch (error) {
      console.error('Error fetching exam results:', error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      // Return locally stored results if API fails
      return this.getLocalResults();
    }
  }

  /**
   * Store exam results locally
   */
  private storeResultsLocally(results: ExamResults): void {
    if (typeof window === 'undefined') return;

    try {
      // Get existing local results
      const existingResults = this.getLocalResults();

      // Add new results
      existingResults.push(results);

      // Save to localStorage
      localStorage.setItem('exam-results', JSON.stringify(existingResults));
    } catch (error) {
      console.error('Error storing exam results locally:', error);
    }
  }

  /**
   * Get locally stored exam results
   */
  private getLocalResults(): ExamResults[] {
    if (typeof window === 'undefined') return [];

    try {
      const storedResults = localStorage.getItem('exam-results');
      if (storedResults) {
        return JSON.parse(storedResults);
      }
    } catch (error) {
      console.error('Error retrieving local exam results:', error);
    }

    return [];
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
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }
}

// Create and export exam service instance
const examService = new ExamService();
export default examService;
