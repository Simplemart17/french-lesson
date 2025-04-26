import { VocabularyWord } from '@/components/features/SpacedRepetition';
import vocabularyApiService from './api/vocabularyService';

// This is a wrapper service that provides compatibility between the API service and the local components
class VocabularyService {
  // Get vocabulary from the API
  async getVocabulary(params?: any): Promise<VocabularyWord[]> {
    try {
      const response = await vocabularyApiService.getVocabulary(params);

      if (response.success && response.data.items) {
        // Convert API vocabulary to VocabularyWord format
        return response.data.items.map((item: any, index: number) => ({
          id: item.id?.toString() || index.toString(),
          word: item.word,
          translation: item.translation,
          example: item.example || '',
          category: 'general', // Default category
          pronunciation: '', // API doesn't provide pronunciation
          level: item.level === 'A1' || item.level === 'A2' ? 'beginner' :
                 item.level === 'B1' || item.level === 'B2' ? 'intermediate' : 'advanced',
          lastReviewed: item.lastPracticed,
          nextReview: undefined,
          repetitionStage: item.learned ? 3 : 0 // Estimate stage based on learned status
        }));
      }

      return [];
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
      return [];
    }
  }

  // Update vocabulary progress in the API
  async updateVocabularyProgress(data: any): Promise<void> {
    try {
      await vocabularyApiService.updateVocabularyProgress(data);
    } catch (error) {
      console.error('Error updating vocabulary progress:', error);
    }
  }

  // Add a new vocabulary word to the API
  async addVocabularyWord(word: Omit<VocabularyWord, 'id'>): Promise<VocabularyWord> {
    try {
      // Convert level to API format
      const apiLevel = word.level === 'beginner' ? 'A1' :
                      word.level === 'intermediate' ? 'B1' : 'C1';

      // Add the word to the API
      await vocabularyApiService.updateVocabularyProgress({
        word: word.word,
        translation: word.translation,
        example: word.example || '',
        level: apiLevel,
        learned: false
      });

      // Return the word with a temporary ID
      return {
        ...word,
        id: Date.now().toString()
      };
    } catch (error) {
      console.error('Error adding vocabulary word:', error);

      // Return the word with a temporary ID even if the API call fails
      return {
        ...word,
        id: Date.now().toString()
      };
    }
  }

  // Update multiple vocabulary words
  async updateVocabularyWords(words: VocabularyWord[]): Promise<VocabularyWord[]> {
    try {
      // Update each word in the API
      const updatePromises = words.map(word =>
        this.updateVocabularyProgress({
          word: word.word,
          learned: !!word.repetitionStage && word.repetitionStage > 0,
          lastPracticed: word.lastReviewed
        })
      );

      // Wait for all updates to complete
      await Promise.all(updatePromises);

      // Return the updated words
      return words;
    } catch (error) {
      console.error('Error updating vocabulary words:', error);
      return words;
    }
  }

  // Get vocabulary categories
  async getCategories(): Promise<string[]> {
    try {
      const response = await vocabularyApiService.getVocabulary();

      if (response.success && response.data.items) {
        // Extract categories from vocabulary items
        const categories = new Set<string>();
        response.data.items.forEach((item: any) => {
          // Use first letter as dummy category
          const dummyCategory = item.word.charAt(0).toUpperCase();
          categories.add(dummyCategory);
        });

        return Array.from(categories);
      }

      return [];
    } catch (error) {
      console.error('Error fetching vocabulary categories:', error);
      return [];
    }
  }

  // Get vocabulary due for review
  async getDueVocabulary(): Promise<VocabularyWord[]> {
    try {
      const vocabulary = await this.getVocabulary();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return vocabulary.filter(word => {
        if (!word.nextReview) return true; // Never reviewed
        const reviewDate = new Date(word.nextReview);
        return reviewDate <= today;
      });
    } catch (error) {
      console.error('Error fetching due vocabulary:', error);
      return [];
    }
  }
}

// Create and export vocabulary service instance
const vocabularyService = new VocabularyService();
export default vocabularyService;
