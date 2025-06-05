import speechRecognitionApiService, { SpeechRecognitionResponse } from './api/speechRecognitionApiService';

/**
 * Speech Recognition Service
 *
 * This service provides a wrapper around the speech recognition API service with additional
 * functionality for caching and error handling.
 */
class SpeechRecognitionService {
  private cache: Map<string, any> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private cacheDuration = 30 * 60 * 1000; // 30 minutes

  /**
   * Analyze pronunciation by comparing transcript to reference text
   */
  async analyzePronunciation(
    transcript: string,
    referenceText: string,
    audioBlob?: Blob
  ): Promise<SpeechRecognitionResponse> {
    try {
      // For pronunciation analysis, we don't cache as each attempt is unique
      const response = await speechRecognitionApiService.analyzePronunciation({
        transcript,
        referenceText,
        audioBlob
      });

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.error?.message || 'Failed to analyze pronunciation');
    } catch (error) {
      console.error('Error analyzing pronunciation:', error);

      // Return a basic response instead of throwing
      return {
        score: 0,
        feedback: 'Unable to analyze pronunciation at this time.',
        errors: [],
        strengths: [],
        areas_for_improvement: ['Please try again later.']
      };
    }
  }

  /**
   * Get supported languages for speech recognition
   */
  async getSupportedLanguages(): Promise<import('./api/speechRecognitionApiService').Language[]> {
    const cacheKey = 'supported-languages';

    // Check cache first
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await speechRecognitionApiService.getSupportedLanguages();

      if (response.success && response.data) {
        // Cache the result
        this.setCache(cacheKey, response.data);
        return response.data;
      }

      // Default to French
      return [{ code: 'fr-FR', name: 'French (France)' }];
    } catch (error) {
      console.error('Error getting supported languages:', error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      // Default to French
      return [{ code: 'fr-FR', name: 'French (France)' }];
    }
  }

  /**
   * Check if browser supports speech recognition
   */
  isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') {
      return false; // Not supported in server-side rendering
    }

    return (
      'SpeechRecognition' in window ||
      'webkitSpeechRecognition' in window ||
      'mozSpeechRecognition' in window ||
      'msSpeechRecognition' in window
    );
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

// Create and export speech recognition service instance
const speechRecognitionService = new SpeechRecognitionService();
export default speechRecognitionService;