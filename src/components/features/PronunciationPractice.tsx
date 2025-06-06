import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';

interface PronunciationPracticeProps {
  phrase: string;
  translation: string;
  onResult?: (result: PronunciationResult) => void;
}

export interface PronunciationResult {
  transcript: string;
  accuracy: number;
  feedback: string;
  isCorrect: boolean;
}

const PronunciationPractice: React.FC<PronunciationPracticeProps> = ({
  phrase,
  translation,
  onResult
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionInterface | null>(null);
  // const _audioRef = useRef<HTMLAudioElement | null>(null);

  // Evaluate pronunciation using string similarity
  const evaluatePronunciation = useCallback((userTranscript: string) => {
    // Levenshtein distance calculation for string similarity
    const levenshteinDistance = (a: string, b: string): number => {
      if (a.length === 0) return b.length;
      if (b.length === 0) return a.length;

      const matrix = [];

      // Initialize matrix
      for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
      }

      for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
      }

      // Fill matrix
      for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
          const cost = a[j - 1] === b[i - 1] ? 0 : 1;
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1, // deletion
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j - 1] + cost // substitution
          );
        }
      }

      return matrix[b.length][a.length];
    };
    setIsLoading(true);

    // Normalize strings for comparison
    const normalizedPhrase = phrase.toLowerCase().trim();
    const normalizedTranscript = userTranscript.toLowerCase().trim();

    // Simple string similarity calculation (Levenshtein distance)
    const distance = levenshteinDistance(normalizedPhrase, normalizedTranscript);
    const maxLength = Math.max(normalizedPhrase.length, normalizedTranscript.length);
    const similarityScore = 1 - distance / maxLength;

    // Convert to percentage
    const accuracyPercentage = Math.round(similarityScore * 100);
    setAccuracy(accuracyPercentage);

    // Determine if pronunciation is correct
    const isCorrectPronunciation = accuracyPercentage >= 75;
    setIsCorrect(isCorrectPronunciation);

    // Generate feedback
    let feedbackMessage = '';
    if (accuracyPercentage >= 90) {
      feedbackMessage = 'Excellent pronunciation! Perfect!';
    } else if (accuracyPercentage >= 75) {
      feedbackMessage = 'Good pronunciation! Keep practicing.';
    } else if (accuracyPercentage >= 50) {
      feedbackMessage = 'Fair pronunciation. Try again and focus on the difficult sounds.';
    } else {
      feedbackMessage = 'Needs improvement. Listen to the audio and try again.';
    }

    setFeedback(feedbackMessage);
    setIsLoading(false);

    // Call onResult callback if provided
    if (onResult) {
      onResult({
        transcript: userTranscript,
        accuracy: accuracyPercentage,
        feedback: feedbackMessage,
        isCorrect: isCorrectPronunciation
      });
    }
  }, [phrase, onResult]);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in your browser. Please try Chrome, Edge, or Safari.');
      return;
    }

    // Create speech recognition instance
    const SpeechRecognitionClass = window.webkitSpeechRecognition || window.SpeechRecognition;
    recognitionRef.current = new SpeechRecognitionClass();

    // Configure recognition
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'fr-FR'; // Set language to French

    // Set up event handlers
    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0][0];
      const userTranscript = result.transcript.trim().toLowerCase();
      setTranscript(userTranscript);

      // Evaluate pronunciation
      evaluatePronunciation(userTranscript);
    };

    recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setError(`Error: ${event.error}. Please try again.`);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    // Clean up
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [evaluatePronunciation]);

  // No need to create audio element for TTS anymore
  // We'll use the pronunciation service instead

  // Start listening
  const startListening = () => {
    setError(null);
    setTranscript('');
    setFeedback(null);
    setAccuracy(null);
    setIsCorrect(null);

    try {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      }
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setError('Failed to start speech recognition. Please try again.');
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Play TTS audio using AI
  const playAudio = async () => {
    try {
      // Import the pronunciation service
      const pronunciationService = (await import('@/services/pronunciationService')).default;

      // Use the service to speak the phrase
      await pronunciationService.speak(phrase, {
        voice: 'alloy'
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      setError('Failed to play audio. Please try again.');

      // Fallback to browser TTS
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.lang = 'fr-FR';
        window.speechSynthesis.speak(utterance);
      } else {
        setError('Text-to-speech is not supported in your browser.');
      }
    }
  };



  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="mb-2 text-xl font-semibold text-gray-800">Pronunciation Practice</h2>
        <p className="text-gray-600">Listen to the audio and repeat the phrase</p>
      </div>

      <div className="p-4 mb-6 text-center bg-gray-50 rounded-lg">
        <div className="mb-2 text-2xl font-bold text-gray-800">{phrase}</div>
        {showTranslation ? (
          <div className="text-gray-600">{translation}</div>
        ) : (
          <button
            onClick={() => setShowTranslation(true)}
            className="text-sm text-primary-600 hover:underline"
          >
            Show translation
          </button>
        )}
      </div>

      <div className="flex justify-center mb-6">
        <Button
          onClick={playAudio}
          className="flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Listen
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex justify-center mb-4">
          {isListening ? (
            <Button
              onClick={stopListening}
              variant="destructive"
              className="flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
              </svg>
              Stop Recording
            </Button>
          ) : (
            <Button
              onClick={startListening}
              className="flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
              Start Recording
            </Button>
          )}
        </div>

        {isListening && (
          <div className="flex items-center justify-center p-3 mb-4 text-primary-600 bg-primary-50 rounded-lg">
            <div className="w-4 h-4 mr-2 bg-red-500 rounded-full animate-pulse"></div>
            Listening...
          </div>
        )}

        {error && (
          <div className="p-3 mb-4 text-red-700 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center">
            <LoadingState message="Analyzing pronunciation..." size="small" />
          </div>
        )}

        {transcript && !isLoading && (
          <div className="mb-4">
            <h3 className="mb-1 text-sm font-medium text-gray-700">Your pronunciation:</h3>
            <div className="p-3 bg-gray-50 rounded-lg">
              {transcript}
            </div>
          </div>
        )}

        {feedback && !isLoading && (
          <div className={`p-4 rounded-lg ${
            isCorrect
              ? 'bg-green-50 border border-green-200'
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {isCorrect ? (
                  <svg className="w-5 h-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${isCorrect ? 'text-green-800' : 'text-yellow-800'}`}>
                  {isCorrect ? 'Good job!' : 'Keep practicing'}
                </h3>
                <div className={`mt-1 text-sm ${isCorrect ? 'text-green-700' : 'text-yellow-700'}`}>
                  {feedback}
                </div>
                {accuracy !== null && (
                  <div className="mt-2">
                    <div className="text-xs font-medium text-gray-500">Accuracy</div>
                    <div className="w-full h-2 mt-1 bg-gray-200 rounded-full">
                      <div
                        className={`h-2 rounded-full ${
                          accuracy >= 75 ? 'bg-green-500' :
                          accuracy >= 50 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${accuracy}%` }}
                      ></div>
                    </div>
                    <div className="mt-1 text-xs text-right text-gray-500">{accuracy}%</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={playAudio}
        >
          Listen Again
        </Button>
        <Button
          onClick={startListening}
          disabled={isListening}
        >
          Try Again
        </Button>
      </div>
    </div>
  );
};

// Define Web Speech API types
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionInterface {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInterface;
}

// Add type definitions for the Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: SpeechRecognitionConstructor;
    SpeechRecognition: SpeechRecognitionConstructor;
  }
}

export default PronunciationPractice;
