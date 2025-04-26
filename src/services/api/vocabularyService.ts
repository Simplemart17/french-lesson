import apiClient, { ApiResponse } from './apiClient';
import { API_ENDPOINTS } from './apiConfig';

// Define interfaces for vocabulary data
export interface VocabularyWord {
  id: number;
  word: string;
  translation: string;
  pronunciation?: string;
  example?: string;
  imageUrl?: string;
  audioUrl?: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
}

export interface VocabularyCategory {
  id: number;
  name: string;
  description?: string;
  wordCount: number;
}

export interface VocabularyLevel {
  id: string;
  name: string;
  description?: string;
  wordCount: number;
}

export interface VocabularyProgress {
  wordId: number;
  learned: boolean;
  repetitionStage: number;
  lastReviewed?: string;
  nextReview?: string;
}

export interface SpacedRepetitionItem {
  word: VocabularyWord;
  progress: VocabularyProgress;
}

export interface VocabularyListParams {
  page?: number;
  limit?: number;
  category?: string;
  level?: string;
  search?: string;
  sort?: 'alphabetical' | 'level' | 'lastAdded';
  order?: 'asc' | 'desc';
}

export interface VocabularyListResponse {
  items: VocabularyWord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Vocabulary service class
class VocabularyService {
  // Get vocabulary list
  public async getVocabulary(params?: VocabularyListParams): Promise<ApiResponse<VocabularyListResponse>> {
    return apiClient.get<VocabularyListResponse>(API_ENDPOINTS.VOCABULARY.LIST, params);
  }
  
  // Get vocabulary categories
  public async getCategories(): Promise<ApiResponse<VocabularyCategory[]>> {
    return apiClient.get<VocabularyCategory[]>(API_ENDPOINTS.VOCABULARY.CATEGORIES);
  }
  
  // Get vocabulary levels
  public async getLevels(): Promise<ApiResponse<VocabularyLevel[]>> {
    return apiClient.get<VocabularyLevel[]>(API_ENDPOINTS.VOCABULARY.LEVELS);
  }
  
  // Get vocabulary item by ID
  public async getVocabularyItem(id: number): Promise<ApiResponse<VocabularyWord>> {
    return apiClient.get<VocabularyWord>(API_ENDPOINTS.VOCABULARY.ITEM(id));
  }
  
  // Get vocabulary progress
  public async getProgress(): Promise<ApiResponse<VocabularyProgress[]>> {
    return apiClient.get<VocabularyProgress[]>(API_ENDPOINTS.VOCABULARY.PROGRESS);
  }
  
  // Update vocabulary progress
  public async updateProgress(wordId: number, data: Partial<VocabularyProgress>): Promise<ApiResponse<VocabularyProgress>> {
    return apiClient.put<VocabularyProgress>(`${API_ENDPOINTS.VOCABULARY.PROGRESS}/${wordId}`, data);
  }
  
  // Get spaced repetition items
  public async getSpacedRepetitionItems(count?: number): Promise<ApiResponse<SpacedRepetitionItem[]>> {
    return apiClient.get<SpacedRepetitionItem[]>(API_ENDPOINTS.VOCABULARY.SPACED_REPETITION, { count });
  }
  
  // Update spaced repetition items
  public async updateSpacedRepetitionItems(items: { wordId: number; known: boolean }[]): Promise<ApiResponse<{ updated: number }>> {
    return apiClient.post<{ updated: number }>(API_ENDPOINTS.VOCABULARY.SPACED_REPETITION, { items });
  }
}

// Create and export vocabulary service instance
const vocabularyService = new VocabularyService();
export default vocabularyService;
