import axios from 'axios';
import { localStorageCache } from '@/utils/cache';
import { supabase } from '@/lib/supabase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout for AI operations
});

api.interceptors.request.use(async (config) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch {
    // proceed without token
  }
  return config;
});



// Cache configuration
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * AI Service
 *
 * Handles interactions with OpenAI and other AI services for
 * language learning features.
 */
class AIService {
  private cache = localStorageCache;

  /**
   * Grammar correction and feedback
   */
  async correctGrammar(text: string, level: string = 'beginner'): Promise<{
    corrected: string;
    feedback: string[];
    explanations: Array<{ original: string; correction: string; rule: string }>;
  }> {
    // For grammar correction, we don't cache as text is likely unique each time
    try {
      const response = await api.post('/ai/grammar-correction', {
        text,
        level
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Failed to correct grammar');
    } catch (error) {
      console.error('Error correcting grammar:', error);

      // Return a basic response instead of throwing
      return {
        corrected: text,
        feedback: ['Unable to analyze text at this time.'],
        explanations: []
      };
    }
  }

  /**
   * Generate conversation practice
   */
  async generateConversation(
    topic: string,
    level: string = 'beginner',
    context?: string
  ): Promise<{
    conversation: Array<{ role: string; content: string }>;
    vocabulary: Array<{ word: string; translation: string; usage: string }>;
  }> {
    const cacheKey = `conversation-${topic}-${level}-${context || 'none'}`;

    // Check cache first
    const cachedData = this.cache.get<{
      conversation: Array<{ role: string; content: string }>;
      vocabulary: Array<{ word: string; translation: string; usage: string }>;
    }>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await api.post('/ai/generate-conversation', {
        topic,
        level,
        context
      });

      if (response.data.success && response.data.data) {
        // Cache the result
        this.cache.set(cacheKey, response.data.data, CACHE_DURATION);
        return response.data.data;
      }

      throw new Error('Failed to generate conversation');
    } catch (error) {
      console.error('Error generating conversation:', error);

      // Return a basic response instead of throwing
      return {
        conversation: [
          { role: 'system', content: 'Unable to generate conversation at this time.' },
          { role: 'assistant', content: 'Bonjour! Comment puis-je vous aider aujourd\'hui?' }
        ],
        vocabulary: []
      };
    }
  }

  /**
   * French language tutor chat
   */
  async tutorChat(
    message: string,
    conversationId?: string,
    level: string = 'beginner'
  ): Promise<{
    response: string;
    conversationId: string;
    corrections?: Array<{ error: string; correction: string; explanation: string }>;
  }> {
    try {
      const response = await api.post('/ai/tutor-chat', {
        message,
        conversationId,
        level
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Failed to get tutor response');
    } catch (error) {
      console.error('Error in tutor chat:', error);

      // Return a basic response instead of throwing
      return {
        response: "Je suis désolé, je ne peux pas répondre pour le moment. (I'm sorry, I can't respond at the moment.)",
        conversationId: conversationId || `fallback-${Date.now()}`,
        corrections: []
      };
    }
  }

  /**
   * Generate vocabulary practice
   */
  async generateVocabularyExercises(
    topic: string,
    level: string = 'beginner',
    count: number = 10
  ): Promise<{
    exercises: Array<{
      type: 'multiple-choice' | 'fill-in-blank' | 'matching';
      question: string;
      options?: string[];
      answer: string;
    }>;
  }> {
    const cacheKey = `vocab-exercises-${topic}-${level}-${count}`;

    // Check cache first
    const cachedData = this.cache.get<{
      exercises: Array<{
        type: 'multiple-choice' | 'fill-in-blank' | 'matching';
        question: string;
        options?: string[];
        answer: string;
      }>;
    }>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await api.post('/ai/vocabulary-exercises', {
        topic,
        level,
        count
      });

      if (response.data.success && response.data.data) {
        // Cache the result
        this.cache.set(cacheKey, response.data.data, CACHE_DURATION);
        return response.data.data;
      }

      throw new Error('Failed to generate vocabulary exercises');
    } catch (error) {
      console.error('Error generating vocabulary exercises:', error);

      // Return a basic response instead of throwing
      return {
        exercises: [{
          type: 'multiple-choice',
          question: 'Unable to generate exercises at this time.',
          options: ['OK'],
          answer: 'OK'
        }]
      };
    }
  }

  /**
   * Analyze pronunciation
   */
  async analyzePronunciation(
    audioBlob: Blob,
    text: string
  ): Promise<{
    overallScore: number;
    wordScores: Array<{ word: string; score: number; feedback: string }>;
    problemSounds: Array<{ sound: string; description: string }>;
    recommendations: string[];
  }> {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('text', text);

      const response = await api.post('/ai/pronunciation-analysis', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const payload = response.data?.data;
      const feedback = payload?.feedback;

      if (response.data.success && feedback) {
        return {
          overallScore: feedback.overallScore ?? 0,
          wordScores: Array.isArray(feedback.wordScores) ? feedback.wordScores : [],
          problemSounds: Array.isArray(feedback.problemSounds) ? feedback.problemSounds : [],
          recommendations: Array.isArray(feedback.recommendations) ? feedback.recommendations : [],
        };
      }

      throw new Error('Failed to analyze pronunciation');
    } catch (error) {
      console.error('Error analyzing pronunciation:', error);

      // Return a basic response instead of throwing
      return {
        overallScore: 0,
        wordScores: text.split(' ').map(word => ({
          word,
          score: 0,
          feedback: 'Unable to analyze pronunciation at this time.'
        })),
        problemSounds: [],
        recommendations: ['Try again later.']
      };
    }
  }

  /**
   * Generate personalized lesson plan
   */
  async generateLessonPlan(
    userLevel: string,
    learningGoals: string[],
    weakPoints: string[]
  ): Promise<{
    recommendedLessons: Array<{
      title: string;
      description: string;
      topics: string[];
      reason: string;
    }>;
    focusAreas: string[];
    timeEstimate: number;
  }> {
    const cacheKey = `lesson-plan-${userLevel}-${learningGoals.join(',')}-${weakPoints.join(',')}`;

    // Check cache first
    const cachedData = this.cache.get<{
      recommendedLessons: Array<{
        title: string;
        description: string;
        topics: string[];
        reason: string;
      }>;
      focusAreas: string[];
      timeEstimate: number;
    }>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await api.post('/ai/personalized-lesson-plan', {
        userLevel,
        learningGoals,
        weakPoints
      });

      if (response.data.success && response.data.data) {
        // Cache the result
        this.cache.set(cacheKey, response.data.data, CACHE_DURATION);
        return response.data.data;
      }

      throw new Error('Failed to generate lesson plan');
    } catch (error) {
      console.error('Error generating lesson plan:', error);

      // Return a basic response instead of throwing
      return {
        recommendedLessons: [],
        focusAreas: [],
        timeEstimate: 0
      };
    }
  }

  /**
   * Check writing for grammar and style issues
   */
  async checkWriting(text: string, context?: string): Promise<{
    corrections: Array<{
      original: string;
      corrected: string;
      explanation: string;
    }>;
    feedback?: string;
    score?: number;
  }> {
    try {
      const response = await api.post('/ai/check-writing', {
        text,
        context
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Failed to check writing');
    } catch (error) {
      console.error('Error checking writing:', error);

      // Return a basic response instead of throwing
      return {
        corrections: [],
        feedback: 'Unable to analyze writing at this time. Please try again later.',
        score: 0
      };
    }
  }

  /**
   * Clear AI service cache
   */
  clearCache(): void {
    // Get all keys that start with our AI-related prefixes
    const aiCacheKeys = this.cache.keys().filter(key =>
      key.startsWith('conversation-') ||
      key.startsWith('vocab-exercises-') ||
      key.startsWith('lesson-plan-')
    );

    // Remove each key
    aiCacheKeys.forEach(key => this.cache.remove(key));
  }

  /**
   * Generate text from a prompt
   */
  async generateText(prompt: string, token?: string): Promise<string | null> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await api.post('/ai/generate-text', {
        prompt,
      }, { headers });

      if (response.data.success && response.data.data) {
        return response.data.data.text;
      }

      throw new Error('Failed to generate text');
    } catch (error) {
      console.error('Error generating text:', error);
      return null;
    }
  }
}

// Create and export an instance of the AI service
const aiService = new AIService();
export default aiService;
