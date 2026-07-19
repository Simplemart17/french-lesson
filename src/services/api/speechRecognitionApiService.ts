/**
 * Shared result shape for pronunciation analysis consumers.
 * The analysis itself runs through /api/ai/pronunciation-analysis
 * (Whisper transcription + GPT feedback) via pronunciationApiService.
 */
export interface SpeechRecognitionResponse {
  score: number;
  feedback: string;
  errors: Array<{ word: string; suggestion: string; explanation: string }>;
  strengths: string[];
  areas_for_improvement: string[];
}
