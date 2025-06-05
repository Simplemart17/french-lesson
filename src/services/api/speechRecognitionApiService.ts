import axios from 'axios';
import { ApiResponse } from '@/types/api';

// Define the speech recognition response type
export interface SpeechRecognitionResponse {
  score: number;
  feedback: string;
  errors: Array<{ word: string; suggestion: string; explanation: string }>;
  strengths: string[];
  areas_for_improvement: string[];
}

/**
 * Language interface for speech recognition
 */
export interface Language {
  code: string;
  name: string;
}

/**
 * Speech Recognition API Service
 * 
 * Handles API requests related to speech recognition and pronunciation analysis
 */
const speechRecognitionApiService = {
  /**
   * Analyze pronunciation by comparing transcript to reference text
   */
  analyzePronunciation: async (params: {
    transcript: string;
    referenceText: string;
    audioBlob?: Blob;
  }): Promise<ApiResponse<SpeechRecognitionResponse>> => {
    try {
      const { transcript, referenceText, audioBlob } = params;
      
      // Create request data
      const requestData: any = {
        transcript,
        referenceText
      };
      
      // If we have audio blob and FormData is available (client-side)
      if (audioBlob && typeof FormData !== 'undefined') {
        const formData = new FormData();
        formData.append('audio', audioBlob);
        formData.append('transcript', transcript);
        formData.append('referenceText', referenceText);
        
        // Send multipart form data
        const response = await axios.post('/api/speech-recognition', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        return response.data;
      } else {
        // Send JSON data
        const response = await axios.post('/api/speech-recognition', requestData);
        return response.data;
      }
    } catch (error) {
      console.error('Error analyzing pronunciation:', error);
      
      // Return error response
      return {
        success: false,
        error: {
          message: 'Failed to analyze pronunciation'
        }
      };
    }
  },
  
  /**
   * Get supported languages for speech recognition
   */
  getSupportedLanguages: async (): Promise<ApiResponse<Language[]>> => {
    try {
      const response = await axios.get('/api/speech-recognition/languages');
      return response.data;
    } catch (error) {
      console.error('Error getting supported languages:', error);
      
      // Return error response
      return {
        success: false,
        error: {
          message: 'Failed to get supported languages'
        }
      };
    }
  }
};

export default speechRecognitionApiService;