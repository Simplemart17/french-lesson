import apiClient, { ApiResponse } from './apiClient';
import { API_ENDPOINTS } from './apiConfig';

// Define interfaces for lesson data
export interface Lesson {
  id: number;
  title: string;
  description: string;
  content: LessonContent;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  imageUrl?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LessonContent {
  sections: LessonSection[];
  exercises: LessonExercise[];
}

export interface LessonSection {
  id: string;
  title: string;
  type: 'text' | 'video' | 'audio' | 'image' | 'interactive';
  content: string;
  order: number;
}

export interface LessonExercise {
  id: string;
  title: string;
  type: 'multiple-choice' | 'fill-in-blank' | 'matching' | 'ordering' | 'true-false';
  instructions: string;
  questions: LessonQuestion[];
  order: number;
}

export interface LessonQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
}

export interface LessonCategory {
  id: string;
  name: string;
  description?: string;
  lessonCount: number;
}

export interface LessonProgress {
  lessonId: number;
  completed: boolean;
  progress: number; // 0-100
  lastAccessed?: string;
  completedSections: string[]; // section IDs
  completedExercises: string[]; // exercise IDs
  score?: number; // 0-100
}

export interface LessonListParams {
  page?: number;
  limit?: number;
  category?: string;
  level?: string;
  search?: string;
  sort?: 'newest' | 'popular' | 'recommended';
  order?: 'asc' | 'desc';
}

export interface LessonListResponse {
  items: Lesson[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LessonCompletionRequest {
  lessonId: number;
  completed: boolean;
  progress: number;
  completedSections: string[];
  completedExercises: string[];
  score?: number;
}

// Lesson service class
class LessonService {
  // Get lesson list
  public async getLessons(params?: LessonListParams): Promise<ApiResponse<LessonListResponse>> {
    return apiClient.get<LessonListResponse>(API_ENDPOINTS.LESSONS.LIST, params);
  }
  
  // Get lesson categories
  public async getCategories(): Promise<ApiResponse<LessonCategory[]>> {
    return apiClient.get<LessonCategory[]>(API_ENDPOINTS.LESSONS.CATEGORIES);
  }
  
  // Get lesson by ID
  public async getLesson(id: number): Promise<ApiResponse<Lesson>> {
    return apiClient.get<Lesson>(API_ENDPOINTS.LESSONS.ITEM(id));
  }
  
  // Get lesson progress
  public async getLessonProgress(): Promise<ApiResponse<LessonProgress[]>> {
    return apiClient.get<LessonProgress[]>(API_ENDPOINTS.LESSONS.PROGRESS);
  }
  
  // Get specific lesson progress
  public async getLessonProgressById(id: number): Promise<ApiResponse<LessonProgress>> {
    return apiClient.get<LessonProgress>(`${API_ENDPOINTS.LESSONS.PROGRESS}/${id}`);
  }
  
  // Complete lesson
  public async completeLesson(data: LessonCompletionRequest): Promise<ApiResponse<LessonProgress>> {
    return apiClient.post<LessonProgress>(API_ENDPOINTS.LESSONS.COMPLETE(data.lessonId), data);
  }
  
  // Update lesson progress
  public async updateLessonProgress(id: number, data: Partial<LessonProgress>): Promise<ApiResponse<LessonProgress>> {
    return apiClient.put<LessonProgress>(`${API_ENDPOINTS.LESSONS.PROGRESS}/${id}`, data);
  }
}

// Create and export lesson service instance
const lessonService = new LessonService();
export default lessonService;
