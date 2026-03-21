import { ApiResponse } from '@/types/api';
import apiClient from '@/services/api/apiClient';
import { API_ENDPOINTS } from './apiConfig';

// Define the speaking exercise type
interface SpeakingExercise {
  id: string;
  prompt: string;
  translation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category?: 'greetings' | 'travel' | 'dining' | 'everyday' | 'business' | 'shopping';
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
      const response = await apiClient.get<ApiResponse<SpeakingExercise[]>>(
        API_ENDPOINTS.SPEAKING.LIST, 
        { params }
      );

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
  getExercise: async (id: number | string): Promise<SpeakingExercise | null> => {
    try {
      const response = await apiClient.get<ApiResponse<SpeakingExercise>>(
        API_ENDPOINTS.SPEAKING.ITEM(id)
      );

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
    exerciseId: number | string,
    _audioBlob: Blob,
    transcript: string
  ): Promise<SpeakingFeedback> => {
    try {
      const response = await apiClient.request<ApiResponse<SpeakingFeedback>>({
        method: 'POST',
        url: API_ENDPOINTS.SPEAKING.CHECK,
        data: {
          exerciseId: exerciseId.toString(),
          transcript
        }
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
