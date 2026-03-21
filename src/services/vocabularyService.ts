import { VocabularyWord } from '@/components/features/SpacedRepetition';
import vocabularyApiService from './api/vocabularyApiService';
import { VocabularyItem } from '@/types/api';

/**
 * Maps a VocabularyItem from the API to the VocabularyWord format used by components.
 */
function mapItemToWord(item: VocabularyItem): VocabularyWord {
  const levelMap: Record<string, 'beginner' | 'intermediate' | 'advanced'> = {
    'A1': 'beginner',
    'A2': 'beginner',
    'B1': 'intermediate',
    'B2': 'intermediate',
    'C1': 'advanced',
    'C2': 'advanced',
    'beginner': 'beginner',
    'intermediate': 'intermediate',
    'advanced': 'advanced',
  };

  return {
    id: item.id || Date.now().toString(),
    word: item.word,
    translation: item.translation,
    example: item.example || '',
    category: item.category || 'general',
    pronunciation: item.pronunciation || '',
    level: levelMap[item.level] || 'beginner',
    lastReviewed: item.lastPracticed,
    nextReview: item.nextReview,
    repetitionStage: item.repetitionStage,
  };
}

// This is a wrapper service that provides compatibility between the API service and the local components
class VocabularyService {
  // Get vocabulary from the API
  async getVocabulary(level?: string, category?: string): Promise<VocabularyWord[]> {
    try {
      const response = await vocabularyApiService.getVocabulary(level, category);
      return response.map(mapItemToWord);
    } catch {
      return [];
    }
  }

  // Update vocabulary progress in the API
  async updateVocabularyProgress(data: {
    word: string;
    learned?: boolean;
    lastPracticed?: string;
    nextReview?: string
  }): Promise<void> {
    try {
      await vocabularyApiService.updateVocabularyProgress(
        data.word,
        data.learned || false,
        data.lastPracticed,
        data.nextReview
      );
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
      await vocabularyApiService.addVocabularyItem(
        word.word,
        word.translation,
        word.example || '',
        apiLevel,
        word.category || 'general'
      );

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
      // Use the API's getCategories method
      return await vocabularyApiService.getCategories();
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
