import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { aiService } from '@/services';

// Define the response type based on what we're using
interface PronunciationResponse {
  transcript?: string;
  expected?: string;
  similarity?: number;
  feedback: {
    overallScore: number;
    wordScores: Array<{ word: string; score: number; feedback: string }>;
    problemSounds: Array<{ sound: string; description: string }>;
    recommendations: string[];
  };
}

interface AdvancedPronunciationPracticeProps {
  phrase: string;
  translation?: string;
  onResult?: (result: PronunciationResponse) => void;
}

const AdvancedPronunciationPractice: React.FC<AdvancedPronunciationPracticeProps> = ({
  phrase,
  translation,
  onResult
}) => {
  // State
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PronunciationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Play phrase audio using AI TTS
  const playPhraseAudio = async () => {
    try {
      // Import the pronunciation service
      const pronunciationService = (await import('@/services/pronunciationService')).default;

      // Use the service to speak the phrase
      await pronunciationService.speak(phrase, {
        useAI: true,
        voice: 'alloy',
        cacheKey: phrase
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      setError('Failed to play audio. Please try again.');

      // Fallback to browser's speech synthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.lang = 'fr-FR';
        window.speechSynthesis.speak(utterance);
      } else {
        setError('Text-to-speech is not supported in your browser');
      }
    }
  };

  // Play recorded audio
  const playRecordedAudio = () => {
    if (audioBlob && audioElementRef.current) {
      audioElementRef.current.src = URL.createObjectURL(audioBlob);
      audioElementRef.current.play();
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      setError(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);

        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Could not access microphone. Please check your browser permissions.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Analyze pronunciation
  const analyzePronunciation = async () => {
    if (!audioBlob) {
      setError('No recording available to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Use the AI service to analyze pronunciation
      const response = await aiService.analyzePronunciation(audioBlob, phrase);

      // Convert the response to the expected format
      const formattedResponse: PronunciationResponse = {
        transcript: phrase, // Use the expected phrase as fallback
        expected: phrase,
        similarity: response.overallScore,
        feedback: {
          overallScore: response.overallScore,
          wordScores: response.wordScores,
          problemSounds: response.problemSounds,
          recommendations: response.recommendations
        }
      };

      setResult(formattedResponse);

      if (onResult) {
        onResult(formattedResponse);
      }

      // Save the result to the user's progress if needed
      if (response.overallScore > 0) {
        try {
          // This would typically use a phraseId, but we'll skip that for now
          // await pronunciationService.updatePronunciationProgress(phraseId, response.overallScore);
        } catch (progressError) {
          console.error('Error saving pronunciation progress:', progressError);
          // Don't show this error to the user as it's not critical
        }
      }
    } catch (err) {
      console.error('Error analyzing pronunciation:', err);
      setError('Failed to analyze pronunciation. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-xl font-semibold">Pronunciation Practice</h3>

      {/* Phrase display */}
      <div className="p-4 mb-6 text-center bg-gray-50 rounded-lg">
        <p className="mb-2 text-2xl font-bold">{phrase}</p>
        {translation && (
          <>
            {showTranslation ? (
              <p className="text-gray-600">{translation}</p>
            ) : (
              <button
                onClick={() => setShowTranslation(true)}
                className="text-sm text-primary-600 hover:underline"
              >
                Show translation
              </button>
            )}
          </>
        )}
      </div>

      {/* Audio playback controls */}
      <div className="flex justify-center mb-6">
        <Button
          onClick={playPhraseAudio}
          className="flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Listen
        </Button>
      </div>

      {/* Recording controls */}
      <div className="mb-6">
        <div className="flex justify-center mb-4">
          {isRecording ? (
            <Button
              onClick={stopRecording}
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
              onClick={startRecording}
              className="flex items-center"
              disabled={isAnalyzing}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
              Record
            </Button>
          )}
        </div>

        {isRecording && (
          <div className="flex items-center justify-center p-3 mb-4 text-primary-600 bg-primary-50 rounded-lg">
            <div className="w-4 h-4 mr-2 bg-red-500 rounded-full animate-pulse"></div>
            Recording...
          </div>
        )}

        {audioBlob && !isRecording && !result && (
          <div className="flex flex-col items-center mt-4">
            <div className="flex mb-4 space-x-2">
              <Button onClick={playRecordedAudio} variant="outline" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Play Recording
              </Button>
              <Button onClick={startRecording} variant="outline" size="sm">Record Again</Button>
            </div>
            <Button
              onClick={analyzePronunciation}
              disabled={isAnalyzing}
              className="flex items-center"
            >
              {isAnalyzing ? (
                <>
                  <svg className="w-5 h-5 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Analyze Pronunciation
                </>
              )}
            </Button>
          </div>
        )}

        {error && (
          <div className="p-3 mb-4 text-red-700 bg-red-50 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6">
          <h4 className="mb-4 text-lg font-semibold">Results</h4>

          {/* Overall score */}
          <div className="p-4 mb-6 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Overall Score</span>
              <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                result.feedback.overallScore >= 80
                  ? 'bg-green-100 text-green-800'
                  : result.feedback.overallScore >= 60
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {result.feedback.overallScore}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 mb-4 bg-gray-200 rounded-full">
              <div
                className={`h-2 rounded-full ${
                  result.feedback.overallScore >= 80 ? 'bg-green-500' :
                  result.feedback.overallScore >= 60 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${result.feedback.overallScore}%` }}
              ></div>
            </div>

            {/* What you said */}
            <div className="mb-4">
              <div className="mb-1 text-xs font-medium text-gray-500">What you said:</div>
              <div className="p-2 text-sm bg-white rounded border border-gray-200">
                {result.transcript || '[no speech detected]'}
              </div>
            </div>

            {/* Expected */}
            <div>
              <div className="mb-1 text-xs font-medium text-gray-500">Expected:</div>
              <div className="p-2 text-sm bg-white rounded border border-gray-200">
                {result.expected || phrase}
              </div>
            </div>
          </div>

          {/* Word-by-word feedback */}
          {result.feedback.wordScores && result.feedback.wordScores.length > 0 && (
            <div className="mb-6">
              <h5 className="mb-3 text-sm font-semibold text-gray-700">Word-by-word Analysis</h5>
              <div className="space-y-2">
                {result.feedback.wordScores.map((word, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 mr-3 rounded-full ${word.score >= 80 ? 'bg-green-500' : word.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                    <div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium">{word.word}</span>
                        <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                          word.score >= 80 ? 'bg-green-100 text-green-800' :
                          word.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {word.score}%
                        </span>
                      </div>
                      {word.score < 80 && (
                        <p className="text-xs text-gray-600">{word.feedback}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Problem sounds */}
          {result.feedback.problemSounds && result.feedback.problemSounds.length > 0 && (
            <div className="mb-6">
              <h5 className="mb-3 text-sm font-semibold text-gray-700">Sounds to Practice</h5>
              <div className="space-y-2">
                {result.feedback.problemSounds.map((sound, index) => (
                  <div key={index} className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                    <div className="flex items-center mb-1">
                      <span className="px-2 py-0.5 mr-2 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">{sound.sound}</span>
                    </div>
                    <p className="text-sm text-yellow-800">{sound.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {result.feedback.recommendations && result.feedback.recommendations.length > 0 && (
            <div className="mb-6">
              <h5 className="mb-3 text-sm font-semibold text-gray-700">Recommendations</h5>
              <ul className="ml-6 list-disc space-y-1">
                {result.feedback.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-sm text-gray-700">{recommendation}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={playPhraseAudio}>Listen Again</Button>
            <Button onClick={() => {
              setResult(null);
              setAudioBlob(null);
            }}>Try Again</Button>
          </div>
        </div>
      )}

      {/* Hidden audio element for playback */}
      <audio ref={audioElementRef} className="hidden" />
    </Card>
  );
};

export default AdvancedPronunciationPractice;