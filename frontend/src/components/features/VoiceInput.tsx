import { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/Button';

// Define the SpeechRecognition type
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onerror: (event: any) => void;
  onresult: (event: any) => void;
  onend: () => void;
}

// Define the window with SpeechRecognition
interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: new () => SpeechRecognition;
  webkitSpeechRecognition?: new () => SpeechRecognition;
}

interface VoiceInputProps {
  onTranscriptReady?: (transcript: string) => void;
  placeholder?: string;
  className?: string;
  language?: string;
}

const VoiceInput = ({
  onTranscriptReady,
  placeholder = 'Your spoken French will appear here...',
  className = '',
  language = 'fr-FR', // Default to French
}: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const windowWithSpeech = window as WindowWithSpeechRecognition;
      const SpeechRecognition = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = language;

        recognition.onresult = (event) => {
          const current = event.resultIndex;
          const result = event.results[current];
          const transcriptValue = result[0].transcript;

          setTranscript(transcriptValue);

          if (result.isFinal && onTranscriptReady) {
            onTranscriptReady(transcriptValue);
          }
        };

        recognition.onerror = (event) => {
          setError(`Error occurred in recognition: ${event.error}`);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setError('Speech recognition is not supported in this browser.');
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, onTranscriptReady]);

  const startListening = async () => {
    setError('');
    setTranscript('');

    if (recognitionRef.current) {
      try {
        setIsListening(true);
        recognitionRef.current.start();
      } catch (err) {
        setError('Error starting speech recognition. Please try again.');
        setIsListening(false);
        console.error('Speech recognition error:', err);
      }
    } else {
      setError('Speech recognition is not supported in this browser.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col space-y-4">
        <div className="flex space-x-2">
          <Button
            onClick={isListening ? stopListening : startListening}
            variant={isListening ? 'secondary' : 'default'}
            className="flex-shrink-0"
          >
            {isListening ? (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
                Stop Listening
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                Start Speaking
              </>
            )}
          </Button>
        </div>

        <div className="relative">
          <div className="w-full min-h-[100px] p-3 bg-white border border-gray-300 rounded-md shadow-sm">
            {isListening ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1 animate-pulse">
                    <div className="w-1 h-3 rounded bg-primary-500"></div>
                    <div className="w-1 h-5 rounded bg-primary-500"></div>
                    <div className="w-1 h-4 rounded bg-primary-500"></div>
                    <div className="w-1 h-6 rounded bg-primary-500"></div>
                    <div className="w-1 h-3 rounded bg-primary-500"></div>
                  </div>
                  <span className="text-gray-500">Listening...</span>
                </div>
              </div>
            ) : transcript ? (
              <p className="text-gray-800">{transcript}</p>
            ) : (
              <p className="text-gray-400">{placeholder}</p>
            )}
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-500">{error}</div>
        )}
      </div>
    </div>
  );
};

export default VoiceInput;