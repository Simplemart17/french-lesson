import pronunciationApiService, {
  PronunciationExercise,
  PronunciationCheckResponse,
  PronunciationProgress
} from './api/pronunciationApiService';

/**
 * Pronunciation Service
 *
 * This service provides a wrapper around the pronunciation API service with additional
 * functionality for caching and offline support.
 */
class PronunciationService {
  private cache: Map<string, unknown> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private cacheDuration = 30 * 60 * 1000; // 30 minutes

  /**
   * Get pronunciation exercises with optional filtering
   */
  async getPronunciationExercises(
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<PronunciationExercise[]> {
    const cacheKey = `pronunciation-exercises-${difficulty || 'all'}`;

    // Check cache first
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey) as PronunciationExercise[];
    }

    try {
      const response = await pronunciationApiService.getExercises({
        difficulty
      });

      if (response.data) {
        // Cache the result
        this.setCache(cacheKey, response.data.items);
        return response.data.items;
      }

      return [];
    } catch (error) {
      console.error('Error fetching pronunciation exercises:', error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey) as PronunciationExercise[];
      }

      return [];
    }
  }

  /**
   * Get pronunciation exercise by ID
   */
  async getPronunciationExercise(id: number): Promise<PronunciationExercise | null> {
    const cacheKey = `pronunciation-exercise-${id}`;

    // Check cache first
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey) as PronunciationExercise | null;
    }

    try {
      const response = await pronunciationApiService.getExercise(id);

      if (response.data) {
        // Cache the result
        this.setCache(cacheKey, response.data);
        return response.data;
      }

      return null;
    } catch (error) {
      console.error(`Error fetching pronunciation exercise ${id}:`, error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey) as PronunciationExercise | null;
      }

      return null;
    }
  }

  /**
   * Check pronunciation
   */
  async checkPronunciation(
    phraseId: number,
    audioBlob?: Blob,
    transcript?: string
  ): Promise<PronunciationCheckResponse> {
    try {
      const response = await pronunciationApiService.checkPronunciation({
        phraseId,
        audioBlob,
        transcript
      });

      if (response.data) {
        return response.data;
      }

      throw new Error('Failed to check pronunciation');
    } catch (error) {
      console.error('Error checking pronunciation:', error);

      // Return a basic response if API fails
      return {
        phraseId,
        accuracy: 0,
        feedback: [],
        transcript: transcript || '',
        isCorrect: false
      };
    }
  }

  /**
   * Get pronunciation progress
   */
  async getPronunciationProgress(): Promise<PronunciationProgress[]> {
    const cacheKey = 'pronunciation-progress';

    // Check cache first
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey) as PronunciationProgress[];
    }

    try {
      const response = await pronunciationApiService.getProgress();

      if (response.data) {
        // Cache the result
        this.setCache(cacheKey, response.data);
        return response.data;
      }

      return [];
    } catch (error) {
      console.error('Error fetching pronunciation progress:', error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey) as PronunciationProgress[];
      }

      return [];
    }
  }

  /**
   * Update pronunciation progress
   */
  async updatePronunciationProgress(phraseId: number, accuracy: number): Promise<boolean> {
    try {
      const response = await pronunciationApiService.updateProgress(phraseId, accuracy);

      if (response.status === 200) {
        // Invalidate progress cache
        this.invalidateCache('pronunciation-progress');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error updating pronunciation progress:', error);
      return false;
    }
  }

  /**
   * Get text for a phrase and speak it
   */
  async speakPhrase(id: number): Promise<boolean> {
    try {
      // Get the phrase text
      const text = await pronunciationApiService.getPhraseText(id);

      if (!text) {
        throw new Error(`Failed to get text for phrase ${id}`);
      }

      // Use the speak method to play the audio
      return await this.speak(text, { voice: 'alloy' });
    } catch (error) {
      console.error(`Error speaking phrase ${id}:`, error);
      return false;
    }
  }

  /**
   * Speak the provided text using text-to-speech
   */
  async speak(text: string, options: { voice?: string } = {}): Promise<boolean> {
    try {
      // Use the JavaScript implementation directly
      if (typeof window !== 'undefined') {
        const audio = new Audio();
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            voice: options.voice || 'alloy'
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        audio.src = audioUrl;
        await new Promise((resolve, reject) => {
          audio.onended = () => resolve(true);
          audio.onerror = (e) => reject(e);
          audio.play().catch(reject);
        });
      } else {
        // Server-side - can't play audio
      }

      return true;
    } catch (error) {
      console.error(`Error speaking text:`, error);
      return false;
    }
  }

  /**
   * Speak the provided text using the browser's built-in speech synthesis
   */
  speakWithBrowser(text: string, options: { lang?: string; rate?: number; pitch?: number; volume?: number } = {}): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set options
    utterance.lang = options.lang || 'fr-FR';
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;
    
    // Speak
    window.speechSynthesis.speak(utterance);
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

// Create and export pronunciation service instance
const pronunciationService = new PronunciationService();
export default pronunciationService;
