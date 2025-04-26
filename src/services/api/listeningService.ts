import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './apiConfig';

/**
 * Listening API Service
 * 
 * Direct API calls for listening exercises
 */
class ListeningApiService {
  /**
   * Get listening exercises
   */
  async getExercises(params?: Record<string, any>) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.LISTENING.LIST, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching listening exercises:', error);
      return { success: false, error: 'Failed to fetch listening exercises' };
    }
  }

  /**
   * Get a specific listening exercise
   */
  async getExercise(id: number) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.LISTENING.ITEM(id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching listening exercise ${id}:`, error);
      return { success: false, error: `Failed to fetch listening exercise ${id}` };
    }
  }

  /**
   * Submit answers for a listening exercise
   */
  async submitAnswers(exerciseId: number, answers: number[]) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LISTENING.SUBMIT(exerciseId), { answers });
      return response.data;
    } catch (error) {
      console.error('Error submitting listening answers:', error);
      return { success: false, error: 'Failed to submit listening answers' };
    }
  }
}

// Create and export instance
const listeningApiService = new ListeningApiService();
export default listeningApiService;
