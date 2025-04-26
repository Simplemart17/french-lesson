import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './apiConfig';

/**
 * Speaking API Service
 * 
 * Direct API calls for speaking exercises
 */
class SpeakingApiService {
  /**
   * Get speaking exercises
   */
  async getExercises(params?: Record<string, any>) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SPEAKING.LIST, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching speaking exercises:', error);
      return { success: false, error: 'Failed to fetch speaking exercises' };
    }
  }

  /**
   * Get a specific speaking exercise
   */
  async getExercise(id: number) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SPEAKING.ITEM(id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching speaking exercise ${id}:`, error);
      return { success: false, error: `Failed to fetch speaking exercise ${id}` };
    }
  }

  /**
   * Get a specific phrase
   */
  async getPhrase(id: number) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SPEAKING.PHRASE(id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching phrase ${id}:`, error);
      return { success: false, error: `Failed to fetch phrase ${id}` };
    }
  }

  /**
   * Submit pronunciation check
   */
  async checkPronunciation(phraseId: number, audioBlob: Blob) {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('phraseId', phraseId.toString());

      const response = await apiClient.post(API_ENDPOINTS.SPEAKING.CHECK, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error checking pronunciation:', error);
      return { success: false, error: 'Failed to check pronunciation' };
    }
  }
}

// Create and export instance
const speakingApiService = new SpeakingApiService();
export default speakingApiService;
