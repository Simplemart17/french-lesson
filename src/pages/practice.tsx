import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import VoiceInput from '@/components/features/VoiceInput';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import {
  pronunciationApiService,
  PronunciationExercise,
  PronunciationPhrase,
  PronunciationResponse
} from '@/services/api/pronunciationApiService';
import LoadingState from '@/components/ui/LoadingState';
import ErrorMessage from '@/components/ui/ErrorMessage';

interface PracticeExercise {
  id: string | number;
  text: string;
  translation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  phonetics?: string;
  focusSounds?: string[];
}

export default function PracticePage() {
  const { isAuthenticated } = useAuth();
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [showTranslation, setShowTranslation] = useState(false);
  const [feedback, setFeedback] = useState<PronunciationResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [exercises, setExercises] = useState<PracticeExercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchExercises = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await pronunciationApiService.getExercises({
        difficulty: selectedDifficulty,
        limit: 20
      });

      const allPhrases: PracticeExercise[] = [];
      // apiClient wraps response as { data: responseBody }, and API returns { data: { items } }
      // So items may be at response.data.items (typed) or response.data.data.items (runtime)
      const responseData = response.data as unknown as Record<string, unknown>;
      const exerciseList = (
        (responseData?.data as Record<string, unknown>)?.items ||
        (responseData as Record<string, unknown>)?.items ||
        []
      ) as PronunciationExercise[];
      exerciseList.forEach((exercise: PronunciationExercise) => {
        exercise.phrases.forEach((phrase: PronunciationPhrase) => {
          allPhrases.push({
            id: phrase.id,
            text: phrase.text,
            translation: phrase.translation,
            difficulty: phrase.difficulty,
            phonetics: phrase.phonetics,
            focusSounds: phrase.focusSounds
          });
        });
      });

      setExercises(allPhrases);
      setCurrentExerciseIndex(0);

      if (allPhrases.length === 0) {
        setError('No pronunciation exercises available for this level yet.');
      }
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError(`Failed to load exercises: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setExercises([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDifficulty]);

  // Fetch exercises from API
  useEffect(() => {
    void fetchExercises();
  }, [fetchExercises]);
  
  const currentExercise = exercises[currentExerciseIndex];
  
  const handleTranscriptReady = async (text: string, blob?: Blob) => {
    if (!currentExercise) return;
    
    setTranscript(text);
    
    // Analyze pronunciation with AI if we have audio
    if (blob && isAuthenticated) {
      try {
        setIsAnalyzing(true);
        const response = await pronunciationApiService.analyzePronunciation(blob, currentExercise.text);
        
        if (response.success && response.data) {
          setFeedback(response);
          
          // Update progress if we have a good score
          if (response.data.feedback.overallScore >= 70) {
            await pronunciationApiService.updateProgress(currentExercise.id, response.data.feedback.overallScore);
          }
        } else {
          setFeedback({
            success: false,
            error: { message: 'Failed to analyze pronunciation. Please try again.' }
          });
        }
      } catch (err) {
        console.error('Error analyzing pronunciation:', err);
        setFeedback({
          success: false,
          error: { message: 'Failed to analyze pronunciation. Please try again.' }
        });
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      // Provide basic feedback without AI analysis
      setFeedback({
        success: true,
        data: {
          transcript: text,
          expected: currentExercise.text,
          similarity: calculateTextSimilarity(text, currentExercise.text),
          feedback: {
            overallScore: calculateTextSimilarity(text, currentExercise.text),
            wordScores: [],
            problemSounds: [],
            recommendations: ['Try recording your pronunciation for detailed AI feedback']
          }
        }
      });
    }
  };
  
  // Simple text similarity calculation
  const calculateTextSimilarity = (text1: string, text2: string): number => {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    const commonWords = words1.filter(word => words2.includes(word)).length;
    const totalWords = Math.max(words1.length, words2.length);
    
    return Math.round((commonWords / totalWords) * 100);
  };
  
  const handleNextExercise = () => {
    if (exercises.length === 0) return;
    const nextIndex = (currentExerciseIndex + 1) % exercises.length;
    setCurrentExerciseIndex(nextIndex);
    setTranscript('');
    setShowTranslation(false);
    setFeedback(null);
  };
  
  const handleDifficultyChange = (difficulty: 'beginner' | 'intermediate' | 'advanced') => {
    setSelectedDifficulty(difficulty);
    setCurrentExerciseIndex(0);
    setTranscript('');
    setShowTranslation(false);
    setFeedback(null);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <ProtectedRoute>
        <Head>
          <title>Speaking Practice | French Tutor AI</title>
          <meta name="description" content="Practice your French speaking skills with AI-powered feedback" />
        </Head>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="mb-4 text-3xl font-bold text-gray-800">Speaking Practice</h1>
            <p className="text-lg text-gray-600">Loading pronunciation exercises...</p>
          </div>
          <LoadingState />
        </div>
      </ProtectedRoute>
    );
  }

  // Error state
  if (error || exercises.length === 0) {
    return (
      <ProtectedRoute>
        <Head>
          <title>Speaking Practice | French Tutor AI</title>
          <meta name="description" content="Practice your French speaking skills with AI-powered feedback" />
        </Head>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="mb-4 text-3xl font-bold text-gray-800">Speaking Practice</h1>
            <ErrorMessage
              message={error || 'No pronunciation exercises available for this difficulty level.'}
              retry={fetchExercises}
            />
          </div>
        </div>
      </ProtectedRoute>
    );
  }
  
  return (
    <ProtectedRoute>
      <Head>
        <title>Speaking Practice | French Tutor AI</title>
        <meta name="description" content="Practice your French speaking skills with AI-powered feedback" />
      </Head>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">Speaking Practice</h1>
          <p className="text-lg text-gray-600">
            Improve your French pronunciation and speaking skills with our interactive exercises. 
            Speak the phrases aloud and get instant feedback.
          </p>
          
          {/* Difficulty Selection */}
          <div className="p-4 mt-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h2 className="mb-3 text-lg font-medium text-gray-700">Select Difficulty Level:</h2>
            <div className="flex flex-wrap gap-2">
              {['beginner', 'intermediate', 'advanced'].map((level) => (
                <button
                  key={level}
                  onClick={() => handleDifficultyChange(level as 'beginner' | 'intermediate' | 'advanced')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedDifficulty === level
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <Card title="Pronunciation" variant="primary" className="px-5 pt-5 pb-0">
            <p className='text-gray-300'>Our AI analyzes your pronunciation and provides specific feedback to help you sound more natural.</p>
          </Card>
          
          <Card title="Fluency" variant="secondary" className="px-5 pt-5 pb-0">
            <p className='text-gray-300'>Practice speaking at a natural pace to build confidence and fluency in conversation.</p>
          </Card>
          
          <Card title="Comprehension" variant="success" className="px-5 pt-5 pb-0">
            <p>Respond to prompts to demonstrate your understanding of French in real-world contexts.</p>
          </Card>
        </div>

        <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Current Exercise</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentExercise.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
              currentExercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {currentExercise.difficulty.charAt(0).toUpperCase() + currentExercise.difficulty.slice(1)}
            </span>
          </div>
          
          <div className="mb-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="block mb-1 text-sm text-gray-500">Exercise {currentExerciseIndex + 1} of {exercises.length}</span>
                <div className="text-xl font-medium text-gray-700">{currentExercise.text}</div>
                {currentExercise.phonetics && (
                  <div className="mt-1 text-sm text-gray-500">
                    <span className="font-mono">[{currentExercise.phonetics}]</span>
                  </div>
                )}
              </div>
              
              {currentExercise.focusSounds && currentExercise.focusSounds.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {currentExercise.focusSounds.map((sound, index) => (
                    <span key={index} className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                      {sound}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {showTranslation ? (
              <div className="mt-2 italic text-gray-500">{currentExercise.translation}</div>
            ) : (
              <button 
                onClick={() => setShowTranslation(true)}
                className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Show Translation
              </button>
            )}
          </div>
          
          <VoiceInput 
            onTranscriptReady={handleTranscriptReady} 
            placeholder="Click 'Start Speaking' and say the phrase in French..."
            className="mb-6"
          />
          
          {transcript && (
            <div className="p-4 mb-6 border border-gray-200 rounded-lg bg-gray-50">
              <h4 className="mb-2 text-sm font-medium text-gray-700">Your speech:</h4>
              <p className="text-gray-800">&quot;{transcript}&quot;</p>
            </div>
          )}
          
          {isAnalyzing && (
            <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
                <p className="text-blue-700">Analyzing your pronunciation...</p>
              </div>
            </div>
          )}

          {feedback && !isAnalyzing && (
            <div className={`mb-6 p-4 rounded-lg ${
              feedback.success && feedback.data
                ? (feedback.data.feedback?.overallScore ?? 0) >= 80 
                  ? 'bg-green-50 border border-green-200' 
                  : (feedback.data.feedback?.overallScore ?? 0) >= 60 
                    ? 'bg-yellow-50 border border-yellow-200' 
                    : 'bg-red-50 border border-red-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              {feedback.success && feedback.data ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-medium ${
                      (feedback.data.feedback?.overallScore ?? 0) >= 80 ? 'text-green-800' :
                      (feedback.data.feedback?.overallScore ?? 0) >= 60 ? 'text-yellow-800' :
                      'text-red-800'
                    }`}>
                      Score: {feedback.data.feedback?.overallScore ?? 0}%
                    </h4>
                    <div className={`w-16 h-2 rounded-full ${
                      (feedback.data.feedback?.overallScore ?? 0) >= 80 ? 'bg-green-200' :
                      (feedback.data.feedback?.overallScore ?? 0) >= 60 ? 'bg-yellow-200' :
                      'bg-red-200'
                    }`}>
                      <div 
                        className={`h-2 rounded-full ${
                          (feedback.data.feedback?.overallScore ?? 0) >= 80 ? 'bg-green-500' :
                          (feedback.data.feedback?.overallScore ?? 0) >= 60 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${feedback.data.feedback?.overallScore ?? 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {(feedback.data.feedback?.recommendations?.length ?? 0) > 0 && (
                    <div className="mb-3">
                      <h5 className="font-medium text-gray-800 mb-2">Recommendations:</h5>
                      <ul className="space-y-1">
                        {feedback.data.feedback.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <span className="mr-2">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(feedback.data.feedback?.problemSounds?.length ?? 0) > 0 && (
                    <div className="mb-3">
                      <h5 className="font-medium text-gray-800 mb-2">Focus Areas:</h5>
                      <div className="flex flex-wrap gap-2">
                        {feedback.data.feedback.problemSounds.map((sound, index) => (
                          <div key={index} className="bg-white rounded-lg px-3 py-2 border">
                            <span className="font-mono font-medium">{sound.sound}</span>
                            <p className="text-xs text-gray-600 mt-1">{sound.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-red-800">Error</h4>
                    <p className="text-red-700">{feedback.error?.message}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {!isAuthenticated && (
            <div className="mb-6 p-4 border border-yellow-200 rounded-lg bg-yellow-50">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Sign in for AI-Powered Analysis
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Create an account to get detailed pronunciation analysis with AI feedback, progress tracking, and personalized recommendations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => {
              setTranscript('');
              setFeedback(null);
            }}>
              Try Again
            </Button>
            <Button onClick={handleNextExercise} disabled={isAnalyzing}>
              Next Exercise
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
