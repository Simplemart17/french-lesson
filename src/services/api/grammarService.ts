import apiClient, { ApiResponse } from './apiClient';
import { API_ENDPOINTS } from './apiConfig';

// Define interfaces for grammar data
export interface GrammarExercise {
  id: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  examples: GrammarExample[];
  createdAt: string;
  updatedAt: string;
}

export interface GrammarExample {
  id: number;
  prompt: string;
  answer: string;
  hint?: string;
}

export interface GrammarCheckRequest {
  text: string;
}

export interface GrammarCheckResponse {
  text: string;
  corrections: GrammarCorrection[];
  score: number; // 0-100
}

export interface GrammarCorrection {
  original: string;
  corrected: string;
  explanation: string;
  severity: 'error' | 'warning' | 'suggestion';
  position: {
    start: number;
    end: number;
  };
  type: 'grammar' | 'spelling' | 'punctuation' | 'style';
}

export interface GrammarProgress {
  exerciseId: number;
  completed: boolean;
  score: number;
  lastAttempt: string;
}

export interface GrammarExerciseListParams {
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface GrammarExerciseListResponse {
  items: GrammarExercise[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Grammar service class
class GrammarService {
  // Get grammar exercises
  public async getExercises(params?: GrammarExerciseListParams): Promise<ApiResponse<GrammarExerciseListResponse>> {
    return apiClient.get<GrammarExerciseListResponse>(API_ENDPOINTS.GRAMMAR.EXERCISES, params);
  }
  
  // Get grammar exercise by ID
  public async getExercise(id: number): Promise<ApiResponse<GrammarExercise>> {
    return apiClient.get<GrammarExercise>(`${API_ENDPOINTS.GRAMMAR.EXERCISES}/${id}`);
  }
  
  // Check grammar
  public async checkGrammar(data: GrammarCheckRequest): Promise<ApiResponse<GrammarCheckResponse>> {
    return apiClient.post<GrammarCheckResponse>(API_ENDPOINTS.GRAMMAR.CHECK, data);
  }
  
  // Get grammar progress
  public async getProgress(): Promise<ApiResponse<GrammarProgress[]>> {
    return apiClient.get<GrammarProgress[]>(API_ENDPOINTS.GRAMMAR.PROGRESS);
  }
  
  // Update grammar progress
  public async updateProgress(exerciseId: number, score: number): Promise<ApiResponse<GrammarProgress>> {
    return apiClient.post<GrammarProgress>(API_ENDPOINTS.GRAMMAR.PROGRESS, {
      exerciseId,
      score,
      completed: true,
    });
  }
}

// Create and export grammar service instance
const grammarService = new GrammarService();
export default grammarService;
