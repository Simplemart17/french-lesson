import axios from 'axios';
import { ApiResponse } from '@/types/api';
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

// Define the exam module type
interface ExamModule {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  section: 'listening' | 'reading' | 'writing' | 'speaking';
  difficulty: 'easy' | 'medium' | 'hard';
  examType: 'tcf' | 'tef';
  questions?: ExamQuestion[];
}

// Define the exam question types
type ExamQuestion =
  | MultipleChoiceQuestion
  | AudioResponseQuestion
  | WritingQuestion
  | SpeakingQuestion;

interface MultipleChoiceQuestion {
  id: string;
  type: 'multiple-choice';
  text: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

interface AudioResponseQuestion {
  id: string;
  type: 'audio-response';
  text: string;
  audioUrl: string;
  correctAnswer: string;
  explanation?: string;
}

interface WritingQuestion {
  id: string;
  type: 'writing';
  text: string;
  wordLimit?: number;
  sampleAnswer?: string;
  rubric?: {
    criteria: string;
    maxPoints: number;
  }[];
}

interface SpeakingQuestion {
  id: string;
  type: 'speaking';
  text: string;
  preparationTime?: number; // in seconds
  responseTime?: number; // in seconds
  sampleResponse?: string;
  rubric?: {
    criteria: string;
    maxPoints: number;
  }[];
}

// Define the exam result type
interface ExamResult {
  moduleId: string;
  results: any[];
  score: number | null;
  totalCorrect: number;
  totalGraded: number;
  totalQuestions: number;
  submittedAt: string;
}

/**
 * Exam API Service
 *
 * This service handles all exam-related API calls.
 */
export const examApiService = {
  /**
   * Get exam modules with optional filtering
   */
  getExamModules: async (
    examType?: string,
    section?: string,
    difficulty?: string
  ): Promise<ExamModule[]> => {
    try {
      const params = { examType, section, difficulty };
      const response = await api.get<ApiResponse<ExamModule[]>>('/exam/modules', { params });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error('Error fetching exam modules:', error);
      return [];
    }
  },

  /**
   * Get a specific exam module by ID
   */
  getExamModule: async (id: string): Promise<ExamModule | null> => {
    try {
      const response = await api.get<ApiResponse<ExamModule>>(`/exam/modules?id=${id}`);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      return null;
    } catch (error) {
      console.error(`Error fetching exam module ${id}:`, error);
      return null;
    }
  },

  /**
   * Submit exam answers
   */
  submitExamAnswers: async (
    moduleId: string,
    answers: { questionId: string; answer: string }[]
  ): Promise<ExamResult> => {
    try {
      const response = await api.post<ApiResponse<ExamResult>>('/exam/modules', {
        moduleId,
        answers
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Failed to submit exam answers');
    } catch (error) {
      console.error('Error submitting exam answers:', error);
      throw error;
    }
  },

  /**
   * Get exam history
   */
  getExamHistory: async (): Promise<ExamResult[]> => {
    try {
      const response = await api.get<ApiResponse<ExamResult[]>>('/exam/history');

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error('Error fetching exam history:', error);
      return [];
    }
  }
};

export default examApiService;
