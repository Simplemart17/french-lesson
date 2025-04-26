import apiClient, { ApiResponse } from './apiClient';
import { API_ENDPOINTS } from './apiConfig';

// Define interfaces for conversation data
export interface Conversation {
  id: number;
  topic: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  messages: ConversationMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ConversationMessage {
  id: number;
  conversationId: number;
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
  id: number;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

export interface StartConversationRequest {
  topicId?: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  customTopic?: string;
}

export interface SendMessageRequest {
  conversationId: number;
  content: string;
  audioBlob?: Blob;
}

export interface ConversationHistoryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ConversationHistoryResponse {
  items: Conversation[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Conversation service class
class ConversationService {
  // Start a new conversation
  public async startConversation(data: StartConversationRequest): Promise<ApiResponse<Conversation>> {
    return apiClient.post<Conversation>(API_ENDPOINTS.CONVERSATION.START, data);
  }
  
  // Send a message
  public async sendMessage(data: SendMessageRequest): Promise<ApiResponse<ConversationMessage>> {
    // If we have an audio blob, we need to use FormData
    if (data.audioBlob) {
      const formData = new FormData();
      formData.append('conversationId', data.conversationId.toString());
      formData.append('content', data.content);
      formData.append('audio', data.audioBlob);
      
      return apiClient.request<ConversationMessage>({
        method: 'POST',
        url: API_ENDPOINTS.CONVERSATION.SEND_MESSAGE,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    
    // Otherwise, just send the content
    return apiClient.post<ConversationMessage>(API_ENDPOINTS.CONVERSATION.SEND_MESSAGE, {
      conversationId: data.conversationId,
      content: data.content,
    });
  }
  
  // Get conversation history
  public async getHistory(params?: ConversationHistoryParams): Promise<ApiResponse<ConversationHistoryResponse>> {
    return apiClient.get<ConversationHistoryResponse>(API_ENDPOINTS.CONVERSATION.HISTORY, params);
  }
  
  // Get conversation by ID
  public async getConversation(id: number): Promise<ApiResponse<Conversation>> {
    return apiClient.get<Conversation>(`${API_ENDPOINTS.CONVERSATION.HISTORY}/${id}`);
  }
  
  // Get conversation topics
  public async getTopics(level?: 'beginner' | 'intermediate' | 'advanced'): Promise<ApiResponse<ConversationTopic[]>> {
    return apiClient.get<ConversationTopic[]>(API_ENDPOINTS.CONVERSATION.TOPICS, { level });
  }
}

// Create and export conversation service instance
const conversationService = new ConversationService();
export default conversationService;
