import axios from 'axios';
import { 
  AuthResponse, 
  User, 
  Lesson, 
  LessonProgress, 
  AssessmentResponse, 
  PronunciationResponse,
  ConversationResponse
} from '../types/api';
import { getAuthCookie, setAuthCookie, removeAuthCookie, isAuthenticated as isAuthCookie } from '../utils/authCookies';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = getAuthCookie();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication services
export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    setAuthCookie(response.data.token);
    return response.data;
  },
  
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', { name, email, password });
    setAuthCookie(response.data.token);
    return response.data;
  },
  
  logout: (): void => {
    removeAuthCookie();
  },
  
  isAuthenticated: (): boolean => {
    return isAuthCookie();
  }
};

// User services
export const userService = {
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/user/profile');
    return response.data;
  },
  
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await api.put<{ user: User }>('/user/profile', userData);
    return response.data.user;
  }
};

// Lesson services
export const lessonService = {
  getLessons: async (level?: string, topic?: string): Promise<Lesson[]> => {
    const params = { level, topic };
    const response = await api.get<Lesson[]>('/learning/lessons', { params });
    return response.data;
  },
  
  updateProgress: async (lessonId: number, completed: boolean, score: number): Promise<LessonProgress> => {
    const response = await api.post<LessonProgress>('/learning/lessons', { lessonId, completed, score });
    return response.data;
  }
};

// Assessment services
export const assessmentService = {
  submitAssessment: async (responses: any[]): Promise<AssessmentResponse> => {
    const response = await api.post<AssessmentResponse>('/learning/assessment', { responses });
    return response.data;
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
    
    const response = await api.post<PronunciationResponse>('/speech/pronunciation', {
      audioData: audioBase64,
      text
    });
    
    return response.data;
  }
};

// Conversation services
export const conversationService = {
  sendMessage: async (message: string, conversationId?: string, context?: string): Promise<ConversationResponse> => {
    const response = await api.post<ConversationResponse>('/conversation/chat', {
      message,
      conversationId,
      context
    });
    return response.data;
  },
  
  getConversationHistory: async (conversationId: string): Promise<ConversationResponse> => {
    const response = await api.get<ConversationResponse>(`/conversation/chat?conversationId=${conversationId}`);
    return response.data;
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