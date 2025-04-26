import axios, { AxiosResponse } from 'axios';
import {
  AuthResponse,
  User,
  Lesson,
  LessonProgress,
  AssessmentResponse,
  PronunciationResponse,
  ConversationResponse,
  ApiResponse
} from '../types/api';
import { AuthService } from '../utils/authService';

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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear auth state on 401 errors
      AuthService.clearAuth();

      // Redirect to login page if we're in a browser environment
      if (typeof window !== 'undefined') {
        window.location.href = '/login?session=expired';
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to handle API responses
const handleApiResponse = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || 'An unknown error occurred');
};

// Authentication services
export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });

      // Handle successful response
      const authData = handleApiResponse(response);

      // No need to set auth data here as cookies are set by the server
      // Just return the auth data for the client to use

      return authData;
    } catch (error: any) {
      console.error('Login error:', error);

      // Enhanced error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage = error.response.data?.error?.message || 'Authentication failed';
        throw new Error(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response from server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw error;
      }
    }
  },

  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', { name, email, password });

      // Handle successful response
      const authData = handleApiResponse(response);

      // No need to set auth data here as cookies are set by the server
      // Just return the auth data for the client to use

      return authData;
    } catch (error: any) {
      console.error('Registration error:', error);

      // Enhanced error handling
      if (error.response) {
        const errorMessage = error.response.data?.error?.message || 'Registration failed';
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('No response from server. Please check your internet connection.');
      } else {
        throw error;
      }
    }
  },

  logout: async (): Promise<void> => {
    try {
      // Call logout endpoint if it exists
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with logout even if API call fails
    } finally {
      // Always clear local auth state
      AuthService.clearAuth();
    }
  },

  isAuthenticated: (): boolean => {
    return AuthService.isAuthenticated();
  },

  getCurrentUser: (): User | null => {
    return AuthService.getUserData();
  }
};

// User services
export const userService = {
  getProfile: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/user/profile');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error('Failed to get user profile');
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await api.put<ApiResponse<User>>('/user/profile', userData);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error('Failed to update user profile');
  }
};

// Lesson services
export const lessonService = {
  getLessons: async (level?: string, topic?: string): Promise<Lesson[]> => {
    const params = { level, topic };
    const response = await api.get<ApiResponse<Lesson[]>>('/learning/lessons', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    return [];
  },

  updateProgress: async (lessonId: number, completed: boolean, score: number): Promise<LessonProgress> => {
    const response = await api.post<ApiResponse<LessonProgress>>('/learning/lessons', { lessonId, completed, score });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error('Failed to update lesson progress');
  }
};

// Assessment services
export const assessmentService = {
  submitAssessment: async (responses: any[]): Promise<AssessmentResponse> => {
    const response = await api.post<ApiResponse<AssessmentResponse>>('/learning/assessment', { responses });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error('Failed to submit assessment');
  }
};

// Pronunciation services
export const pronunciationService = {
  analyzePronunciation: async (audioData: Blob, text: string): Promise<PronunciationResponse> => {
    // Convert blob to base64 for API transmission
    const reader = new FileReader();
    const audioBase64Promise = new Promise<string>((resolve) => {
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data.split(',')[1]); // Remove the data URL part
      };
      reader.readAsDataURL(audioData);
    });

    const audioBase64 = await audioBase64Promise;

    const response = await api.post<ApiResponse<PronunciationResponse>>('/speech/pronunciation', {
      audioData: audioBase64,
      text
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error('Failed to analyze pronunciation');
  }
};

// Conversation services
export const conversationService = {
  sendMessage: async (message: string, conversationId?: string, context?: string): Promise<ConversationResponse> => {
    const response = await api.post<ApiResponse<ConversationResponse>>('/conversation/chat', {
      message,
      conversationId,
      context
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error('Failed to send message');
  },

  getConversationHistory: async (conversationId: string): Promise<ConversationResponse> => {
    const response = await api.get<ApiResponse<ConversationResponse>>(`/conversation/chat?conversationId=${conversationId}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error('Failed to get conversation history');
  }
};

export default {
  auth: authService,
  user: userService,
  lessons: lessonService,
  assessment: assessmentService,
  pronunciation: pronunciationService,
  conversation: conversationService
};