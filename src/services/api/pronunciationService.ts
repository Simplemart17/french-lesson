import apiClient, { ApiResponse } from './apiClient';
import { API_ENDPOINTS } from './apiConfig';

// Define interfaces for pronunciation data
export interface PronunciationExercise {
  id: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  phrases: PronunciationPhrase[];
  createdAt: string;
  updatedAt: string;
}

export interface PronunciationPhrase {
  id: number;
  text: string;
  translation: string;
  audioUrl: string;
  phonetics?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  focusSounds?: string[];
}

export interface PronunciationCheckRequest {
  phraseId: number;
  audioBlob?: Blob;
  transcript?: string;
}

export interface PronunciationCheckResponse {
  phraseId: number;
  accuracy: number; // 0-100
  feedback: PronunciationFeedback[];
  transcript: string;
  isCorrect: boolean;
}

export interface PronunciationFeedback {
  type: 'sound' | 'intonation' | 'rhythm' | 'general';
  message: string;
  severity: 'error' | 'warning' | 'info';
  position?: {
    start: number;
    end: number;
  };
}

export interface PronunciationProgress {
  phraseId: number;
  bestAccuracy: number;
  attempts: number;
  lastAttempt: string;
}

export interface PronunciationExerciseListParams {
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  search?: string;
  page?: number;
  limit?: number;
}

export interface PronunciationExerciseListResponse {
  items: PronunciationExercise[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Pronunciation service class
class PronunciationService {
  // Get pronunciation exercises
  public async getExercises(params?: PronunciationExerciseListParams): Promise<ApiResponse<PronunciationExerciseListResponse>> {
    return apiClient.get<PronunciationExerciseListResponse>(API_ENDPOINTS.PRONUNCIATION.EXERCISES, params);
  }
  
  // Get pronunciation exercise by ID
  public async getExercise(id: number): Promise<ApiResponse<PronunciationExercise>> {
    return apiClient.get<PronunciationExercise>(`${API_ENDPOINTS.PRONUNCIATION.EXERCISES}/${id}`);
  }
  
  // Check pronunciation
  public async checkPronunciation(data: PronunciationCheckRequest): Promise<ApiResponse<PronunciationCheckResponse>> {
    // If we have an audio blob, we need to use FormData
    if (data.audioBlob) {
      const formData = new FormData();
      formData.append('phraseId', data.phraseId.toString());
      formData.append('audio', data.audioBlob);
      
      return apiClient.request<PronunciationCheckResponse>({
        method: 'POST',
        url: API_ENDPOINTS.PRONUNCIATION.CHECK,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    
    // Otherwise, just send the transcript
    return apiClient.post<PronunciationCheckResponse>(API_ENDPOINTS.PRONUNCIATION.CHECK, {
      phraseId: data.phraseId,
      transcript: data.transcript,
    });
  }
  
  // Get pronunciation audio
  public getAudioUrl(id: number): string {
    return `${apiClient.baseURL}${API_ENDPOINTS.PRONUNCIATION.AUDIO(id)}`;
  }
  
  // Get pronunciation progress
  public async getProgress(): Promise<ApiResponse<PronunciationProgress[]>> {
    return apiClient.get<PronunciationProgress[]>(API_ENDPOINTS.PRONUNCIATION.PROGRESS);
  }
  
  // Update pronunciation progress
  public async updateProgress(phraseId: number, accuracy: number): Promise<ApiResponse<PronunciationProgress>> {
    return apiClient.post<PronunciationProgress>(API_ENDPOINTS.PRONUNCIATION.PROGRESS, {
      phraseId,
      accuracy,
    });
  }
}

// Create and export pronunciation service instance
const pronunciationService = new PronunciationService();
export default pronunciationService;
