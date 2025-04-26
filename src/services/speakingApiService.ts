import axios from 'axios';
import { ApiResponse } from '@/types/api';
import { AuthService } from '@/utils/authService';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = AuthService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Define the speaking exercise type
interface SpeakingExercise {
  id: number;
  prompt: string;
  translation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category?: 'greetings' | 'travel' | 'dining' | 'everyday' | 'business';
}

// Define the speaking feedback type
interface SpeakingFeedback {
  accuracy: number;
  pronunciation: number;
  fluency: number;
  feedback: string;
  type: 'success' | 'warning' | 'error';
}

/**
 * Speaking API Service
 *
 * This service handles all speaking-related API calls.
 */
export const speakingApiService = {
  /**
   * Get speaking exercises with optional filtering
   */
  getExercises: async (
    difficulty?: string,
    category?: string
  ): Promise<SpeakingExercise[]> => {
    try {
      const params = { difficulty, category };
      const response = await api.get<ApiResponse<SpeakingExercise[]>>('/speaking/exercises', { params });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error('Error fetching speaking exercises:', error);
      return [];
    }
  },

  /**
   * Get a specific speaking exercise by ID
   */
  getExercise: async (id: number): Promise<SpeakingExercise | null> => {
    try {
      const response = await api.get<ApiResponse<SpeakingExercise>>(`/speaking/exercises?id=${id}`);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      return null;
    } catch (error) {
      console.error(`Error fetching speaking exercise ${id}:`, error);
      return null;
    }
  },

  /**
   * Evaluate speaking exercise
   */
  evaluateSpeaking: async (
    exerciseId: number,
    audioBlob: Blob,
    transcript: string
  ): Promise<SpeakingFeedback> => {
    try {
      // Convert blob to base64 for API transmission
      const reader = new FileReader();
      const audioBase64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64data = reader.result as string;
          resolve(base64data.split(',')[1]); // Remove the data URL part
        };
        reader.readAsDataURL(audioBlob);
      });

      const audioBase64 = await audioBase64Promise;

      const response = await api.post<ApiResponse<SpeakingFeedback>>('/speaking/exercises', {
        exerciseId,
        audioData: audioBase64,
        transcript
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Failed to evaluate speaking');
    } catch (error) {
      console.error('Error evaluating speaking:', error);
      throw error;
    }
  },

  /**
   * Get speaking categories
   */
  getCategories: async (): Promise<string[]> => {
    try {
      const exercises = await speakingApiService.getExercises();
      const categories = new Set(
        exercises
          .filter(ex => ex.category)
          .map(ex => ex.category as string)
      );
      return Array.from(categories);
    } catch (error) {
      console.error('Error getting speaking categories:', error);
      return [];
    }
  }
};

export default speakingApiService;
