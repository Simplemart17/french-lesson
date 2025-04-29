import { ApiResponse, VocabularyItem } from '@/types/api';
import apiClient from '@/services/api/apiClient';

/**
 * Vocabulary API Service
 *
 * This service handles all vocabulary-related API calls.
 */
export const vocabularyApiService = {
  /**
   * Get vocabulary items with optional filtering
   */
  getVocabulary: async (level?: string, category?: string): Promise<VocabularyItem[]> => {
    try {
      const params = { level, category };

      const response = await apiClient.get<ApiResponse<VocabularyItem[]>>('/vocabulary', { params });

      // Handle the standard ApiResponse format
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
      return [];
    }
  },

  /**
   * Get user vocabulary progress
   */
  getVocabularyProgress: async (): Promise<VocabularyItem[]> => {
    try {
      const response = await apiClient.get<ApiResponse<VocabularyItem[]>>('/vocabulary/progress');

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error('Error fetching vocabulary progress:', error);
      return [];
    }
  },

  /**
   * Update vocabulary progress
   */
  updateVocabularyProgress: async (
    word: string,
    learned: boolean,
    lastPracticed?: string,
    nextReview?: string
  ): Promise<VocabularyItem> => {
    try {
      const response = await apiClient.put<ApiResponse<VocabularyItem>>('/vocabulary/progress', {
        word,
        learned,
        lastPracticed: lastPracticed || new Date().toISOString(),
        nextReview
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Failed to update vocabulary progress');
    } catch (error) {
      console.error('Error updating vocabulary progress:', error);
      throw error;
    }
  },

  /**
   * Add a new vocabulary item
   */
  addVocabularyItem: async (
    word: string,
    translation: string,
    example: string,
    level: string,
    category: string
  ): Promise<VocabularyItem> => {
    try {
      const response = await apiClient.post<ApiResponse<VocabularyItem>>('/vocabulary', {
        word,
        translation,
        example,
        level,
        category
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Failed to add vocabulary item');
    } catch (error) {
      console.error('Error adding vocabulary item:', error);
      throw error;
    }
  },

  /**
   * Get vocabulary due for review
   */
  getDueVocabulary: async (): Promise<VocabularyItem[]> => {
    try {
      const progress = await vocabularyApiService.getVocabularyProgress();

      // Filter items that are due for review
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return progress.filter((item: VocabularyItem) => {
        if (!item.nextReview) return true;
        const reviewDate = new Date(item.nextReview);
        return reviewDate <= today;
      });
    } catch (error) {
      console.error('Error getting due vocabulary:', error);
      return [];
    }
  },

  /**
   * Get vocabulary categories
   */
  getCategories: async (): Promise<string[]> => {
    try {
      const vocabulary = await vocabularyApiService.getVocabulary();
      const categories = new Set(vocabulary.map((item: VocabularyItem) => item.category));
      return Array.from(categories).filter((category): category is string => category !== undefined);
    } catch (error) {
      console.error('Error getting vocabulary categories:', error);
      return [];
    }
  }
};

export default vocabularyApiService;
