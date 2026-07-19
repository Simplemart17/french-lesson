import { ApiResponse } from '@/types/api';
import apiClient from '@/services/api/apiClient';

// Define exam-related interfaces
interface ExamQuestion {
  id: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
}

interface ExamModule {
  id: string;
  title: string;
  description: string;
  section: 'listening' | 'reading' | 'writing' | 'speaking';
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  duration: number; // in minutes
  questions: ExamQuestion[];
}

interface ExamAnswer {
  questionId: string;
  answer: string | string[];
}

interface ExamResult {
  id: string;
  moduleId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  completedAt: string;
  answers: ExamAnswer[];
}

// Shape POST /api/exam/results validates: examId, section, score required
export interface ExamResultSubmission {
  examId: string;
  section: string;
  level?: string;
  score: number;
  maxScore?: number;
  timeSpent?: number;
  details?: Array<{ questionIndex: number; correct: boolean; userAnswer: string | string[] }>;
}

interface ExamSubmissionResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  results: Array<{
    questionId: string;
    correct: boolean;
    userAnswer: string | string[];
    correctAnswer: string | string[];
    explanation?: string;
  }>;
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
  getExamModules: async (params?: {
    examType?: string,
    section?: string,
    difficulty?: string
  }): Promise<ExamModule[]> => {
    try {
      const response = await apiClient.get<ApiResponse<ExamModule[]>>('/exam/modules', { params });

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
      const response = await apiClient.get<ApiResponse<ExamModule>>(`/exam/modules?id=${id}`);

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
  submitExam: async (
    moduleId: string,
    answers: ExamAnswer[],
    timeSpent: number
  ): Promise<ExamSubmissionResult> => {
    try {
      const response = await apiClient.post<ApiResponse<ExamSubmissionResult>>('/exam/modules', {
        moduleId,
        answers,
        timeSpent
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error('Failed to submit exam');
    } catch (error) {
      console.error('Error submitting exam:', error);
      throw error;
    }
  },

  /**
   * Get exam results
   */
  getExamResults: async (): Promise<{ success: boolean; data: ExamResult[] }> => {
    try {
      const response = await apiClient.get<ApiResponse<ExamResult[]>>('/exam/results');

      return {
        success: response.data.success,
        data: response.data.data || []
      };
    } catch (error) {
      console.error('Error fetching exam results:', error);
      return {
        success: false,
        data: []
      };
    }
  },

  /**
   * Get exam questions
   */
  getExamQuestions: async (moduleId: string): Promise<{ success: boolean; data: ExamQuestion[] }> => {
    try {
      const response = await apiClient.get<ApiResponse<ExamModule>>(`/exam/modules?id=${moduleId}`);

      return {
        success: response.data.success,
        data: response.data.data?.questions || []
      };
    } catch (error) {
      console.error(`Error fetching exam questions for module ${moduleId}:`, error);
      return {
        success: false,
        data: []
      };
    }
  },

  /**
   * Submit exam results
   */
  submitExamResults: async (results: ExamResultSubmission): Promise<{ success: boolean; data?: ExamResult; error?: string }> => {
    try {
      const response = await apiClient.post<ApiResponse<ExamResult>>('/exam/results', results);

      return {
        success: response.data.success,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error submitting exam results:', error);
      return {
        success: false,
        error: 'Failed to submit exam results'
      };
    }
  },

  /**
   * Submit several per-section results concurrently and report how many failed,
   * so callers can surface partial-save errors to the user.
   */
  submitSectionResults: async (
    submissions: ExamResultSubmission[]
  ): Promise<{ failed: number; total: number }> => {
    const outcomes = await Promise.allSettled(
      submissions.map((submission) => examApiService.submitExamResults(submission))
    );
    const failed = outcomes.filter(
      (outcome) => outcome.status === 'rejected' || !outcome.value?.success
    ).length;
    return { failed, total: submissions.length };
  }
};

export default examApiService;
