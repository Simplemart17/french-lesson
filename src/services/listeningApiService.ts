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

// Define the listening exercise types
interface DictationExercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  audioUrl: string;
  text: string;
  type: 'dictation';
}

interface ComprehensionExercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  audioUrl: string;
  transcript: string;
  questions: {
    id: string;
    text: string;
    options: string[];
    correctAnswer: string;
  }[];
  type: 'comprehension';
}

type ListeningExercise = DictationExercise | ComprehensionExercise;

/**
 * Listening API Service
 *
 * This service handles all listening-related API calls.
 */
export const listeningApiService = {
  /**
   * Get listening exercises with optional filtering
   */
  getExercises: async (
    type?: 'dictation' | 'comprehension',
    difficulty?: string
  ): Promise<ListeningExercise[]> => {
    try {
      const params = { type, difficulty };
      const response = await api.get<ApiResponse<ListeningExercise[]>>('/listening/exercises', { params });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error('Error fetching listening exercises:', error);
      return [];
    }
  },

  /**
   * Get a specific listening exercise by ID
   */
  getExercise: async (id: string): Promise<ListeningExercise | null> => {
    try {
      const response = await api.get<ApiResponse<ListeningExercise>>(`/listening/exercises?id=${id}`);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      return null;
    } catch (error) {
      console.error(`Error fetching listening exercise ${id}:`, error);
      return null;
    }
  },

  /**
   * Submit dictation exercise answer
   */
  submitDictation: async (
    exerciseId: string,
    userText: string
  ): Promise<{
    score: number;
    correctText: string;
    feedback: string;
  }> => {
    try {
      const response = await api.post<ApiResponse<{
        score: number;
        correctText: string;
        feedback: string;
      }>>('/listening/dictation', {
        exerciseId,
        userText
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Failed to submit dictation');
    } catch (error) {
      console.error('Error submitting dictation:', error);
      throw error;
    }
  },

  /**
   * Submit comprehension exercise answers
   */
  submitComprehension: async (
    exerciseId: string,
    answers: { questionId: string; answer: string }[]
  ): Promise<{
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    feedback: { questionId: string; isCorrect: boolean; correctAnswer: string }[];
  }> => {
    try {
      const response = await api.post<ApiResponse<{
        score: number;
        correctAnswers: number;
        totalQuestions: number;
        feedback: { questionId: string; isCorrect: boolean; correctAnswer: string }[];
      }>>('/listening/comprehension', {
        exerciseId,
        answers
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Failed to submit comprehension answers');
    } catch (error) {
      console.error('Error submitting comprehension answers:', error);
      throw error;
    }
  }
};

export default listeningApiService;
