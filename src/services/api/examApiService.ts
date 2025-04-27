import { ApiResponse } from '@/types/api';
import apiClient from '@/services/api/apiClient';

// Define the exam module type
interface ExamModule {
  id: string;
  title: string;
  description: string;
  section: 'listening' | 'reading' | 'writing' | 'speaking';
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  duration: number; // in minutes
  questions: any[];
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
  }): Promise<any> => {
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
    answers: any[],
    timeSpent: number
  ): Promise<any> => {
    try {
      const response = await apiClient.post<ApiResponse<any>>('/exam/submit', {
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
  getExamResults: async (): Promise<any> => {
    try {
      const response = await apiClient.get<ApiResponse<any[]>>('/exam/results');

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
  getExamQuestions: async (moduleId: string): Promise<any> => {
    try {
      const response = await apiClient.get<ApiResponse<any[]>>(`/exam/modules/${moduleId}/questions`);

      return {
        success: response.data.success,
        data: response.data.data || []
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
  submitExamResults: async (results: any): Promise<any> => {
    try {
      const response = await apiClient.post<ApiResponse<any>>('/exam/results', results);

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
  }
};

export default examApiService;
