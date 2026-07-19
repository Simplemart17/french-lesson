import apiClient from './apiClient';
import { supabase } from '@/lib/supabase';
import { ApiResponse } from '@/types/api';

export interface AssessmentCriterion {
  score: number;
  comment: string;
}

export interface AssessmentCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

export interface WritingAssessment {
  overallScore: number;
  cefrEstimate: string;
  criteria: {
    grammar: AssessmentCriterion;
    vocabulary: AssessmentCriterion;
    coherence: AssessmentCriterion;
    taskAchievement: AssessmentCriterion;
  };
  corrections: AssessmentCorrection[];
  feedback: string;
}

export interface SpeakingAssessment {
  transcript: string;
  overallScore: number;
  cefrEstimate: string;
  criteria: {
    fluency: AssessmentCriterion;
    accuracy: AssessmentCriterion;
    range: AssessmentCriterion;
    coherence: AssessmentCriterion;
    taskAchievement: AssessmentCriterion;
  };
  corrections: AssessmentCorrection[];
  feedback: string;
}

export const assessmentApiService = {
  /** CEFR-rubric assessment of a written response. */
  assessWriting: async (
    text: string,
    task: string,
    level?: string
  ): Promise<WritingAssessment | null> => {
    try {
      const response = await apiClient.post<ApiResponse<WritingAssessment>>('/ai/writing-assessment', {
        text,
        task,
        level
      });
      if (response.data?.success && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error assessing writing:', error);
      return null;
    }
  },

  /** CEFR-rubric assessment of a spoken response (Whisper transcription server-side). */
  assessSpeaking: async (
    audioBlob: Blob,
    task: string,
    level?: string
  ): Promise<SpeakingAssessment | null> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        console.error('Speaking assessment requires an authenticated session');
        return null;
      }

      const formData = new FormData();
      formData.append('audio', audioBlob, 'response.webm');
      formData.append('task', task);
      if (level) formData.append('level', level);

      const response = await fetch('/api/ai/speaking-assessment', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: formData
      });

      const result = await response.json();
      if (response.ok && result?.success && result.data) {
        return result.data as SpeakingAssessment;
      }
      return null;
    } catch (error) {
      console.error('Error assessing speaking:', error);
      return null;
    }
  },

  /** Transcribe an audio recording to French text (for voice chat input). */
  transcribe: async (audioBlob: Blob): Promise<string | null> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return null;

      const formData = new FormData();
      formData.append('audio', audioBlob, 'speech.webm');

      const response = await fetch('/api/speech/transcribe', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: formData
      });

      const result = await response.json();
      if (response.ok && result?.success && typeof result.data?.transcript === 'string') {
        return result.data.transcript;
      }
      return null;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      return null;
    }
  }
};

export default assessmentApiService;
