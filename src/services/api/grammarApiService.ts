import { ApiResponse } from '@/types/api';
import apiClient from '@/services/api/apiClient';
import { API_ENDPOINTS } from './apiConfig';

// Define the verb conjugation exercise type
interface VerbConjugationExercise {
  id: number;
  verb: string;
  tense: string;
  group: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  conjugations: {
    pronoun: string;
    form: string;
  }[];
}

// Define the grammar exercise type
interface GrammarExercise {
  id: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'multiple-choice' | 'fill-in-blank' | 'reorder';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
}

// Define the grammar exercise list response type
interface GrammarExerciseListResponse {
  items: GrammarExercise[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Grammar API Service
 *
 * This service handles all grammar-related API calls.
 */
export const grammarApiService = {
  /**
   * Get exercises with optional filtering
   * This is the main method used by the grammarService
   */
  getExercises: async (params?: {
    difficulty?: string;
    category?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<GrammarExerciseListResponse>> => {
    const response = await apiClient.get<GrammarExerciseListResponse>(API_ENDPOINTS.GRAMMAR.EXERCISES, params);
    return {
      success: true,
      data: response.data
    };
  },

  /**
   * Get exercise by ID
   */
  getExercise: async (id: number): Promise<ApiResponse<GrammarExercise>> => {
    const response = await apiClient.get<GrammarExercise>(`${API_ENDPOINTS.GRAMMAR.EXERCISES}/${id}`);
    return {
      success: true,
      data: response.data
    };
  },

  /**
   * Get progress
   */
  getProgress: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get<any[]>(API_ENDPOINTS.GRAMMAR.PROGRESS);
    return {
      success: true,
      data: response.data
    };
  },

  /**
   * Update progress
   */
  updateProgress: async (exerciseId: number, score: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<any>(API_ENDPOINTS.GRAMMAR.PROGRESS, {
      exerciseId,
      score
    });
    return {
      success: true,
      data: response.data
    };
  },
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
      const response = await apiClient.get<ApiResponse<VerbConjugationExercise[]>>('/grammar/verb-conjugation', { params });

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
   * Get grammar exercises with optional filtering
   */
  getGrammarExercises: async (
    difficulty?: string,
    type?: string
  ): Promise<GrammarExercise[]> => {
    try {
      const params = { difficulty, type };
      const response = await apiClient.get<ApiResponse<GrammarExercise[]>>('/grammar/exercises', { params });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error('Error fetching grammar exercises:', error);
      return [];
    }
  },

  /**
   * Check grammar in a text
   */
  checkGrammar: async (text: string): Promise<any> => {
    try {
      const response = await apiClient.post<ApiResponse<any>>('/grammar/check', { text });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      return {
        corrections: [],
        score: 100
      };
    } catch (error) {
      console.error('Error checking grammar:', error);
      return {
        corrections: [],
        score: 100
      };
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
