import apiClient, { ApiResponse } from './apiClient';
import { API_ENDPOINTS } from './apiConfig';

// Define interfaces for exam data
export interface Exam {
  id: number;
  title: string;
  description: string;
  type: 'TCF' | 'TEF' | 'practice';
  duration: number; // in minutes
  questionCount: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
  updatedAt: string;
}

export interface ExamQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-in-blank' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  category: 'comprehension' | 'grammar' | 'vocabulary';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface ExamResult {
  id: number;
  examId: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
  answeredQuestions: {
    questionId: string;
    userAnswer: string | string[];
    isCorrect: boolean;
  }[];
  categoryScores: Record<string, { correct: number; total: number }>;
  createdAt: string;
}

export interface ExamSubmission {
  examId: number;
  timeSpent: number; // in seconds
  answers: {
    questionId: string;
    answer: string | string[];
  }[];
}

export interface ExamType {
  id: string;
  name: string;
  description: string;
}

export interface ExamListParams {
  type?: 'TCF' | 'TEF' | 'practice';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  page?: number;
  limit?: number;
}

export interface ExamListResponse {
  items: Exam[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Exam service class
class ExamService {
  // Get exam list
  public async getExams(params?: ExamListParams): Promise<ApiResponse<ExamListResponse>> {
    return apiClient.get<ExamListResponse>(API_ENDPOINTS.EXAM.LIST, params);
  }
  
  // Get exam by ID
  public async getExam(id: number): Promise<ApiResponse<Exam>> {
    return apiClient.get<Exam>(API_ENDPOINTS.EXAM.ITEM(id));
  }
  
  // Get exam questions
  public async getExamQuestions(id: number): Promise<ApiResponse<ExamQuestion[]>> {
    return apiClient.get<ExamQuestion[]>(API_ENDPOINTS.EXAM.QUESTIONS(id));
  }
  
  // Submit exam
  public async submitExam(data: ExamSubmission): Promise<ApiResponse<ExamResult>> {
    return apiClient.post<ExamResult>(API_ENDPOINTS.EXAM.SUBMIT(data.examId), data);
  }
  
  // Get exam results
  public async getExamResults(): Promise<ApiResponse<ExamResult[]>> {
    return apiClient.get<ExamResult[]>(API_ENDPOINTS.EXAM.RESULTS);
  }
  
  // Get exam result by ID
  public async getExamResult(id: number): Promise<ApiResponse<ExamResult>> {
    return apiClient.get<ExamResult>(`${API_ENDPOINTS.EXAM.RESULTS}/${id}`);
  }
  
  // Get exam types
  public async getExamTypes(): Promise<ApiResponse<ExamType[]>> {
    return apiClient.get<ExamType[]>(API_ENDPOINTS.EXAM.TYPES);
  }
}

// Create and export exam service instance
const examService = new ExamService();
export default examService;
