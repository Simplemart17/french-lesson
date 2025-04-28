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

// New interfaces for AI pronunciation analysis
export interface PronunciationWordScore {
  word: string;
  score: number;
  feedback: string;
}

export interface PronunciationProblemSound {
  sound: string;
  description: string;
}

export interface PronunciationResponse {
  success: boolean;
  data?: {
    transcript: string;
    expected: string;
    similarity: number;
    feedback: {
      overallScore: number;
      wordScores: PronunciationWordScore[];
      problemSounds: PronunciationProblemSound[];
      recommendations: string[];
    };
  };
  error?: {
    message: string;
  };
}

/**
 * Pronunciation API Service
 *
 * This service handles all pronunciation-related API calls.
 */
export const pronunciationApiService = {
  /**
   * Get pronunciation exercises
   */
  getExercises: async (params?: PronunciationExerciseListParams): Promise<ApiResponse<PronunciationExerciseListResponse>> => {
    return apiClient.get<PronunciationExerciseListResponse>(API_ENDPOINTS.PRONUNCIATION.EXERCISES, params);
  },

  /**
   * Get pronunciation exercise by ID
   */
  getExercise: async (id: number): Promise<ApiResponse<PronunciationExercise>> => {
    return apiClient.get<PronunciationExercise>(`${API_ENDPOINTS.PRONUNCIATION.EXERCISES}/${id}`);
  },

  /**
   * Check pronunciation
   */
  checkPronunciation: async (data: PronunciationCheckRequest): Promise<ApiResponse<PronunciationCheckResponse>> => {
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
  },

  /**
   * AI-powered advanced pronunciation analysis
   */
  analyzePronunciation: async (audioBlob: Blob, text: string): Promise<PronunciationResponse> => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('text', text);

      const response = await fetch('/api/ai/pronunciation-analysis', {
        method: 'POST',
        body: formData,
      });

      return await response.json();
    } catch (error) {
      console.error('Error in pronunciation analysis:', error);
      return {
        success: false,
        error: {
          message: 'Failed to analyze pronunciation'
        }
      };
    }
  },

  /**
   * Get text for a pronunciation phrase
   *
   * Note: We no longer use audio URLs since we're using AI TTS
   * This method is kept for backward compatibility
   */
  getPhraseText: async (id: number): Promise<string> => {
    try {
      const response = await apiClient.get<PronunciationPhrase>(`${API_ENDPOINTS.PRONUNCIATION.PHRASES}/${id}`);
      if (response.data && response.data.text) {
        return response.data.text;
      }
      return '';
    } catch (error) {
      console.error('Error getting phrase text:', error);
      return '';
    }
  },

  /**
   * Get pronunciation progress
   */
  getProgress: async (): Promise<ApiResponse<PronunciationProgress[]>> => {
    return apiClient.get<PronunciationProgress[]>(API_ENDPOINTS.PRONUNCIATION.PROGRESS);
  },

  /**
   * Update pronunciation progress
   */
  updateProgress: async (phraseId: number, accuracy: number): Promise<ApiResponse<PronunciationProgress>> => {
    return apiClient.post<PronunciationProgress>(API_ENDPOINTS.PRONUNCIATION.PROGRESS, {
      phraseId,
      accuracy,
    });
  }
};

export default pronunciationApiService;
