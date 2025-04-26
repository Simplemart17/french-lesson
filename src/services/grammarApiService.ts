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

// Define the verb conjugation exercise type
interface VerbConjugationExercise {
  id: string;
  verb: string;
  tense: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  group?: 1 | 2 | 3 | 'irregular';
  conjugations: {
    pronoun: string;
    correctAnswer: string;
  }[];
}

// Define the conjugation result type
interface ConjugationResult {
  results: {
    pronoun: string;
    isCorrect: boolean;
    correctAnswer: string;
    userAnswer: string;
  }[];
  score: number;
  totalCorrect: number;
  totalQuestions: number;
}

/**
 * Grammar API Service
 *
 * This service handles all grammar-related API calls.
 */
export const grammarApiService = {
  /**
   * Get verb conjugation exercises with optional filtering
   */
  getVerbConjugationExercises: async (
    difficulty?: string,
    verb?: string,
    tense?: string,
    group?: string
  ): Promise<VerbConjugationExercise[]> => {
    try {
      const params = { difficulty, verb, tense, group };
      const response = await api.get<ApiResponse<VerbConjugationExercise[]>>('/grammar/verb-conjugation', { params });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error('Error fetching verb conjugation exercises:', error);
      return [];
    }
  },

  /**
   * Get a specific verb conjugation exercise by ID
   */
  getVerbConjugationExercise: async (id: string): Promise<VerbConjugationExercise | null> => {
    try {
      const response = await api.get<ApiResponse<VerbConjugationExercise>>(`/grammar/verb-conjugation?id=${id}`);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      return null;
    } catch (error) {
      console.error(`Error fetching verb conjugation exercise ${id}:`, error);
      return null;
    }
  },

  /**
   * Check verb conjugation answers
   */
  checkVerbConjugation: async (
    exerciseId: string,
    answers: { pronoun: string; answer: string }[]
  ): Promise<ConjugationResult> => {
    try {
      const response = await api.post<ApiResponse<ConjugationResult>>('/grammar/verb-conjugation', {
        exerciseId,
        answers
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Failed to check verb conjugation');
    } catch (error) {
      console.error('Error checking verb conjugation:', error);
      throw error;
    }
  },

  /**
   * Get available verb tenses
   */
  getVerbTenses: async (): Promise<string[]> => {
    try {
      const exercises = await grammarApiService.getVerbConjugationExercises();
      const tenses = new Set(exercises.map(ex => ex.tense));
      return Array.from(tenses);
    } catch (error) {
      console.error('Error getting verb tenses:', error);
      return [];
    }
  },

  /**
   * Get available verbs
   */
  getVerbs: async (): Promise<string[]> => {
    try {
      const exercises = await grammarApiService.getVerbConjugationExercises();
      const verbs = new Set(exercises.map(ex => ex.verb));
      return Array.from(verbs);
    } catch (error) {
      console.error('Error getting verbs:', error);
      return [];
    }
  }
};

export default grammarApiService;
