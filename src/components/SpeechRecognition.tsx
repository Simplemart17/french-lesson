import React, { useState, useEffect, useRef } from 'react';
import { SpeechRecognitionResponse } from '../services/api/speechRecognitionApiService';
import pronunciationApiService from '../services/api/pronunciationApiService';

interface SpeechRecognitionProps {
  referenceText: string;
  translation: string;
  onResult: (result: SpeechRecognitionResponse) => void;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * SpeechRecognition - A component for recording and analyzing French pronunciation
 */
const SpeechRecognition: React.FC<SpeechRecognitionProps> = ({ 
  referenceText, 
  translation, 
  onResult,
  difficulty = 'intermediate' 
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Recording needs MediaRecorder + microphone access; transcription happens
  // server-side with Whisper, so no browser speech API is required.
  useEffect(() => {
    if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setIsSupported(false);
    }
  }, []);

  // Start recording function
  const startRecording = async (): Promise<void> => {
    try {
      setError(null);
      setTranscript('');
      audioChunksRef.current = [];

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create media recorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      // Handle data available event
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      // Handle recording stop
      mediaRecorderRef.current.onstop = () => {
        // Create audio blob from chunks and send it for Whisper-based analysis
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        analyzePronunciation(audioBlob);
      };
      
      // Start recording
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Could not access microphone. Please check permissions.');
    }
  };

  // Stop recording function
  const stopRecording = (): void => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
      
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  // Send the recorded audio to the Whisper + GPT analysis pipeline, so the
  // score is derived from what the learner actually said.
  const analyzePronunciation = async (audioBlob: Blob): Promise<void> => {
    try {
      const result = await pronunciationApiService.analyzePronunciation(audioBlob, referenceText);

      if (!result.success || !result.data) {
        setError(result.error?.message || 'Failed to analyze pronunciation. Please try again.');
        return;
      }

      const { transcript: heardText, feedback } = result.data;
      setTranscript(heardText);

      if (onResult) {
        const wordScores = feedback.wordScores || [];
        onResult({
          score: feedback.overallScore,
          feedback: feedback.recommendations?.[0] || 'Analysis complete.',
          errors: wordScores
            .filter((w) => w.score < 70)
            .map((w) => ({ word: w.word, suggestion: w.word, explanation: w.feedback })),
          strengths: wordScores
            .filter((w) => w.score >= 85)
            .map((w) => `"${w.word}" was pronounced well`),
          areas_for_improvement: feedback.recommendations || []
        });
      }
    } catch (err) {
      console.error('Error analyzing pronunciation:', err);
      setError('Failed to analyze pronunciation. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Get status color based on difficulty
  const getDifficultyColor = (): string => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isSupported) {
    return (
      <div className="p-4 mb-4 bg-white rounded-lg border shadow-sm speech-recognition">
        <div className="text-center text-red-500">
          <p>Speech recognition is not supported in your browser.</p>
          <p>Please try using Chrome, Edge, or Safari.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 mb-4 bg-white rounded-lg border shadow-sm speech-recognition">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold">Speech Recognition</h3>
        <span className={`px-2 py-1 text-xs rounded difficulty-badge ${getDifficultyColor()}`}>
          {difficulty}
        </span>
      </div>
      
      <div className="mb-4 exercise-content">
        <div className="mb-2 text-section">
          <p className="text-xl font-medium text-to-pronounce">{referenceText}</p>
          <p className="text-gray-600 translation">{translation}</p>
        </div>
      </div>
      
      <div className="flex justify-center space-x-4 controls">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`px-4 py-2 rounded-full flex items-center ${isRecording
            ? 'text-white bg-red-500 hover:bg-red-600'
            : 'text-white bg-primary-500 hover:bg-primary-600'
          } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isRecording ? (
            <>
              <span className="mr-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                </svg>
              </span>
              Stop Recording
            </>
          ) : isProcessing ? (
            <>
              <svg className="mr-2 -ml-1 w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <span className="mr-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              </span>
              Start Recording
            </>
          )}
        </button>
      </div>
      
      {transcript && (
        <div className="p-3 mt-4 bg-gray-50 rounded border border-gray-200 transcript">
          <h4 className="mb-1 text-sm font-medium text-gray-500">Your speech:</h4>
          <p className="text-gray-800">{transcript}</p>
        </div>
      )}
      
      {error && (
        <div className="p-3 mt-4 text-red-700 bg-red-50 rounded border border-red-200 error">
          {error}
        </div>
      )}
    </div>
  );
};

export default SpeechRecognition;
