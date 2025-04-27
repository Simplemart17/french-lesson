import { ApiResponse } from '@/types/api';
import apiClient from '@/services/api/apiClient';
import { API_ENDPOINTS } from './apiConfig';

// Define interfaces for conversation data
export interface Conversation {
  id: string;
  topic: string;
  level: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  audioUrl?: string;
  corrections?: MessageCorrection[];
  createdAt: string;
}

export interface MessageCorrection {
  original: string;
  corrected: string;
  explanation: string;
  type: 'grammar' | 'vocabulary' | 'pronunciation' | 'style';
}

export interface ConversationTopic {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
}

export interface StartConversationRequest {
  topic: string;
  level: string;
}

export interface SendMessageRequest {
  conversationId: string;
  content: string;
  audioBlob?: Blob;
}

export interface ConversationResponse {
  success: boolean;
  data: any;
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
  getScenarios: async (difficulty?: string): Promise<any[]> => {
    try {
      const params = { difficulty };
      const response = await apiClient.get<ApiResponse<any[]>>('/conversation/scenarios', { params });

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
   * Start a new conversation
   */
  startConversation: async (request: StartConversationRequest): Promise<ConversationResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<Conversation>>('/conversation/start', request);

      return {
        success: response.data.success,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    }
  },

  /**
   * Send a message in a conversation
   */
  sendMessage: async (request: SendMessageRequest): Promise<ConversationResponse> => {
    try {
      // If we have an audio blob, we need to use FormData
      if (request.audioBlob) {
        const formData = new FormData();
        formData.append('conversationId', request.conversationId);
        formData.append('content', request.content);
        formData.append('audio', request.audioBlob);

        const response = await apiClient.post<ApiResponse<Message>>('/conversation/message', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        return {
          success: response.data.success,
          data: response.data.data
        };
      }

      // Otherwise, just send the content
      const response = await apiClient.post<ApiResponse<Message>>('/conversation/message', {
        conversationId: request.conversationId,
        content: request.content
      });

      return {
        success: response.data.success,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  /**
   * Get conversation by ID
   */
  getConversation: async (id: string): Promise<ConversationResponse> => {
    try {
      const response = await apiClient.get<ApiResponse<Conversation>>(`/conversation/${id}`);

      return {
        success: response.data.success,
        data: response.data.data
      };
    } catch (error) {
      console.error(`Error fetching conversation ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get conversation history
   */
  getConversationHistory: async (): Promise<ConversationResponse> => {
    try {
      const response = await apiClient.get<ApiResponse<Conversation[]>>('/conversation/history');

      return {
        success: response.data.success,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error getting conversation history:', error);
      throw error;
    }
  },

  /**
   * Get conversation topics
   */
  getTopics: async (level?: string): Promise<ConversationResponse> => {
    try {
      const params = level ? { level } : undefined;
      const response = await apiClient.get<ApiResponse<ConversationTopic[]>>('/conversation/topics', { params });

      return {
        success: response.data.success,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error getting conversation topics:', error);
      throw error;
    }
  }
};

export default conversationApiService;
