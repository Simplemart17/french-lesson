import axios from 'axios';
import { ApiResponse, ConversationResponse } from '@/types/api';
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

// Define the conversation scenario type
interface ConversationScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  initialMessage: string;
  possibleResponses: {
    userInput: string;
    botReply: string;
  }[];
}

/**
 * Conversation API Service
 *
 * This service handles all conversation-related API calls.
 */
export const conversationApiService = {
  /**
   * Get conversation scenarios with optional filtering
   */
  getScenarios: async (difficulty?: string): Promise<ConversationScenario[]> => {
    try {
      const params = { difficulty };
      const response = await api.get<ApiResponse<ConversationScenario[]>>('/conversation/scenarios', { params });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error('Error fetching conversation scenarios:', error);
      return [];
    }
  },

  /**
   * Get a specific conversation scenario by ID
   */
  getScenario: async (id: string): Promise<ConversationScenario | null> => {
    try {
      const response = await api.get<ApiResponse<ConversationScenario>>(`/conversation/scenarios?id=${id}`);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      return null;
    } catch (error) {
      console.error(`Error fetching conversation scenario ${id}:`, error);
      return null;
    }
  },

  /**
   * Send a message to the conversation API
   */
  sendMessage: async (
    message: string,
    conversationId?: string
  ): Promise<ConversationResponse> => {
    try {
      const response = await api.post<ApiResponse<ConversationResponse>>('/conversation/chat', {
        message,
        conversationId
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Failed to send message');
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  /**
   * Get conversation history
   */
  getConversationHistory: async (conversationId: string): Promise<ConversationResponse> => {
    try {
      const response = await api.get<ApiResponse<ConversationResponse>>(`/conversation/chat?conversationId=${conversationId}`);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Failed to get conversation history');
    } catch (error) {
      console.error('Error getting conversation history:', error);
      throw error;
    }
  }
};

export default conversationApiService;
