import examApiService from '@/services/api/examApiService';

// Define types if not available in @/types/api
interface ExamModule {
  id: string;
  title: string;
  description: string;
  section: 'listening' | 'reading' | 'writing' | 'speaking';
  level: string;
  duration: number; // in minutes
  questions?: ExamQuestion[];
}

interface ExamQuestion {
  id: string;
  type: 'multiple-choice' | 'text-input' | 'audio-response' | 'writing' | 'speaking';
  text: string;
  options?: string[];
  correctAnswer?: string | string[];
  audioUrl?: string;
  imageUrl?: string;
  explanation?: string;
}

interface ExamResults {
  moduleId: string;
  score: number;
  totalQuestions: number;
  answers: (string | number)[];
  timeSpent: number; // in seconds
  completedAt: Date;
}

interface ApiExamModule {
  id: string;
  title: string;
  description: string;
  section: 'listening' | 'reading' | 'writing' | 'speaking';
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  duration: number;
  questions?: Array<{
    id: string;
    type: 'multiple-choice' | 'text-input' | 'audio-response' | 'writing' | 'speaking';
    text?: string;
    question?: string;
    options?: string[];
    correctAnswer?: string | string[];
    explanation?: string;
  }>;
}

interface ApiExamQuestion {
  id: string;
  type: 'multiple-choice' | 'text-input' | 'audio-response' | 'writing' | 'speaking';
  text?: string;
  question?: string;
  options?: string[];
  correctAnswer?: string | string[];
  explanation?: string;
}

interface ApiExamResult {
  moduleId?: string;
  examId?: string;
  score?: number;
  totalQuestions?: number;
  answers?: Array<{ answer: string | number } | string | number>;
  timeSpent?: number;
  completedAt?: string;
}

/**
 * Exam Service
 *
 * This service provides a wrapper around the exam API service with additional
 * functionality for caching and offline support.
 */
class ExamService {
  private cache: Map<string, unknown> = new Map();
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
      return this.cache.get(cacheKey) as ExamModule[];
    }

    try {
      const modules = await examApiService.getExamModules({
        examType,
        section,
        difficulty
      });

      if (modules && Array.isArray(modules)) {
        // Transform the API response to match our interface
        const transformedModules = (modules as unknown as ApiExamModule[]).map((module: ApiExamModule) => ({
          ...module,
          questions: module.questions?.map((q: ApiExamQuestion) => ({
            ...q,
            text: q.text || q.question || '',
            options: q.options || [],
            correctAnswer: q.correctAnswer || '',
            explanation: q.explanation || '',
            type: q.type || 'multiple-choice'
          })) || []
        })) as ExamModule[];
        // Cache the result
        this.setCache(cacheKey, transformedModules);
        return transformedModules;
      }

      return [];
    } catch (error) {
      console.error('Error fetching exam modules:', error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey) as ExamModule[];
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
      return this.cache.get(cacheKey) as ExamModule | null;
    }

    try {
      const examModule = await examApiService.getExamModule(moduleId);

      if (examModule) {
        // Transform the API response to match our interface
        const transformedModule = {
          ...examModule,
          questions: (examModule as unknown as ApiExamModule).questions?.map((q: ApiExamQuestion) => ({
            ...q,
            text: q.text || q.question || '',
            options: q.options || [],
            correctAnswer: q.correctAnswer || '',
            explanation: q.explanation || '',
            type: q.type || 'multiple-choice'
          })) || []
        };
        // Cache the result
        this.setCache(cacheKey, transformedModule);
        return transformedModule;
      }

      return null;
    } catch (error) {
      console.error(`Error fetching exam module ${moduleId}:`, error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey) as ExamModule | null;
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
      return this.cache.get(cacheKey) as ExamQuestion[];
    }

    try {
      const response = await examApiService.getExamQuestions(moduleId);

      if (response && response.success && response.data) {
        // Transform the API response to match our interface
        const transformedQuestions = (response.data as unknown as ApiExamQuestion[]).map((q: ApiExamQuestion) => ({
          ...q,
          text: q.text || q.question || '',
          options: q.options || [],
          correctAnswer: q.correctAnswer || '',
          explanation: q.explanation || '',
          type: q.type || 'multiple-choice'
        })) as ExamQuestion[];
        // Cache the result
        this.setCache(cacheKey, transformedQuestions);
        return transformedQuestions;
      }

      return [];
    } catch (error) {
      console.error(`Error fetching exam questions for module ${moduleId}:`, error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey) as ExamQuestion[];
      }

      return [];
    }
  }

  /**
   * Submit exam results.
   * POST /api/exam/results requires examId, section, level and score, so callers
   * should pass the module's section/level via context; sensible defaults apply.
   */
  async submitExamResults(
    results: ExamResults,
    context?: { section?: string; level?: string; examType?: string }
  ): Promise<boolean> {
    try {
      const response = await examApiService.submitExamResults({
        examId: context?.examType || results.moduleId,
        section: context?.section || 'mixed',
        // No fabricated default: when the level is unknown the server stores null
        level: context?.level,
        score: results.score,
        maxScore: 100,
        timeSpent: results.timeSpent
      });
      return response && response.success === true;
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
      return this.cache.get(cacheKey) as ExamResults[];
    }

    try {
      const response = await examApiService.getExamResults();

      if (response && response.success && response.data) {
        // Transform API response to ExamResults format
        const transformedResults = (response.data as ApiExamResult[]).map((result: ApiExamResult) => ({
          moduleId: result.moduleId || result.examId || '',
          score: result.score || 0,
          totalQuestions: result.totalQuestions || 0,
          answers: result.answers?.map((a) => typeof a === 'object' ? a.answer : a) || [],
          timeSpent: result.timeSpent || 0,
          completedAt: new Date(result.completedAt || Date.now())
        }));

        // Cache the result
        this.setCache(cacheKey, transformedResults);

        // Merge with any locally stored results
        const localResults = this.getLocalResults();
        if (localResults.length > 0) {
          const mergedResults = [...transformedResults, ...localResults];
          return mergedResults;
        }

        return transformedResults;
      }

      // Return locally stored results if API fails
      return this.getLocalResults();
    } catch (error) {
      console.error('Error fetching exam results:', error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey) as ExamResults[];
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
  private setCache(key: string, data: unknown): void {
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
