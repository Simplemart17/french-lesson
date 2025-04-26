import axios from 'axios';
import { AuthService } from '@/utils/authService';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout for AI operations
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = AuthService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * AI Service
 * 
 * Handles interactions with OpenAI and other AI services for
 * language learning features.
 */
export const aiService = {
  /**
   * Grammar correction and feedback
   */
  correctGrammar: async (text: string, level: string = 'beginner'): Promise<{
    corrected: string;
    feedback: string[];
    explanations: Array<{ original: string; correction: string; rule: string }>;
  }> => {
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
      throw error;
    }
  },

  /**
   * Generate conversation practice
   */
  generateConversation: async (
    topic: string,
    level: string = 'beginner',
    context?: string
  ): Promise<{
    conversation: Array<{ role: string; content: string }>;
    vocabulary: Array<{ word: string; translation: string; usage: string }>;
  }> => {
    try {
      const response = await api.post('/ai/generate-conversation', {
        topic,
        level,
        context
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Failed to generate conversation');
    } catch (error) {
      console.error('Error generating conversation:', error);
      throw error;
    }
  },

  /**
   * French language tutor chat
   */
  tutorChat: async (
    message: string,
    conversationId?: string,
    level: string = 'beginner'
  ): Promise<{
    response: string;
    conversationId: string;
    corrections?: Array<{ error: string; correction: string; explanation: string }>;
  }> => {
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
      throw error;
    }
  },

  /**
   * Generate vocabulary practice
   */
  generateVocabularyExercises: async (
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
  }> => {
    try {
      const response = await api.post('/ai/vocabulary-exercises', {
        topic,
        level,
        count
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Failed to generate vocabulary exercises');
    } catch (error) {
      console.error('Error generating vocabulary exercises:', error);
      throw error;
    }
  },

  /**
   * Analyze pronunciation
   */
  analyzePronunciation: async (
    audioBlob: Blob,
    text: string
  ): Promise<{
    overallScore: number;
    wordScores: Array<{ word: string; score: number; feedback: string }>;
    problemSounds: Array<{ sound: string; description: string }>;
    recommendations: string[];
  }> => {
    try {
      // Convert blob to base64
      const base64Audio = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64.split(',')[1]); // Remove data URL prefix
        };
        reader.readAsDataURL(audioBlob);
      });

      const response = await api.post('/ai/pronunciation-analysis', {
        audio: base64Audio,
        text
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Failed to analyze pronunciation');
    } catch (error) {
      console.error('Error analyzing pronunciation:', error);
      throw error;
    }
  },

  /**
   * Generate personalized lesson plan
   */
  generateLessonPlan: async (
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
  }> => {
    try {
      const response = await api.post('/ai/personalized-lesson-plan', {
        userLevel,
        learningGoals,
        weakPoints
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Failed to generate lesson plan');
    } catch (error) {
      console.error('Error generating lesson plan:', error);
      throw error;
    }
  }
};

export default aiService; 