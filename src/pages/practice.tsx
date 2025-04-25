import Head from 'next/head';
import { useState, useEffect } from 'react';
import VoiceInput from '@/components/features/VoiceInput';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface PracticeExercise {
  id: number;
  prompt: string;
  translation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category?: 'greetings' | 'travel' | 'dining' | 'everyday' | 'business';
}

export default function PracticePage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [showTranslation, setShowTranslation] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'warning' | 'error' } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Mock exercises data
  const practiceExercises: Record<string, PracticeExercise[]> = {
    beginner: [
      {
        id: 1,
        prompt: 'Comment allez-vous aujourd\'hui?',
        translation: 'How are you today?',
        difficulty: 'beginner',
        category: 'greetings'
      },
      {
        id: 2,
        prompt: 'Je m\'appelle Marie. Et vous?',
        translation: 'My name is Marie. And you?',
        difficulty: 'beginner',
        category: 'greetings'
      },
      {
        id: 3,
        prompt: 'Où est la boulangerie?',
        translation: 'Where is the bakery?',
        difficulty: 'beginner',
        category: 'travel'
      },
    ],
    intermediate: [
      {
        id: 4,
        prompt: 'Qu\'est-ce que vous avez fait le weekend dernier?',
        translation: 'What did you do last weekend?',
        difficulty: 'intermediate',
        category: 'everyday'
      },
      {
        id: 5,
        prompt: 'Je voudrais réserver une table pour deux personnes.',
        translation: 'I would like to book a table for two people.',
        difficulty: 'intermediate',
        category: 'dining'
      },
    ],
    advanced: [
      {
        id: 6,
        prompt: 'Les changements climatiques représentent un défi majeur pour notre génération.',
        translation: 'Climate change represents a major challenge for our generation.',
        difficulty: 'advanced',
        category: 'business'
      },
      {
        id: 7,
        prompt: 'Pourriez-vous m\'expliquer les termes du contrat avant que je le signe?',
        translation: 'Could you explain the terms of the contract before I sign it?',
        difficulty: 'advanced',
        category: 'business'
      },
    ],
  };
  
  const currentExercises = practiceExercises[selectedDifficulty];
  const currentExercise = currentExercises[currentExerciseIndex];
  
  // Animation effect when starting to speak
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const handleTranscriptReady = (text: string) => {
    setTranscript(text);
    setIsAnimating(true);
    
    // Simulate AI feedback (in a real app, this would compare the transcript to the expected phrase)
    setTimeout(() => {
      const randomFeedback = Math.random();
      if (randomFeedback > 0.7) {
        setFeedback({
          message: 'Excellent pronunciation! Your accent is very natural.',
          type: 'success'
        });
      } else if (randomFeedback > 0.3) {
        setFeedback({
          message: 'Good attempt! Try to focus on the "r" sound in French.',
          type: 'warning'
        });
      } else {
        setFeedback({
          message: 'Try again. Pay attention to the pronunciation of vowels.',
          type: 'error'
        });
      }
    }, 1000);
  };
  
  const handleNextExercise = () => {
    const nextIndex = (currentExerciseIndex + 1) % currentExercises.length;
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
  
  return (
    <>
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
                <span className="block mb-1 text-sm text-gray-500">Exercise {currentExerciseIndex + 1} of {currentExercises.length}</span>
                <div className="text-xl font-medium text-gray-700">{currentExercise.prompt}</div>
              </div>
              
              {currentExercise.category && (
                <span className="px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                  {currentExercise.category.charAt(0).toUpperCase() + currentExercise.category.slice(1)}
                </span>
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
              <p className="text-gray-800">"{transcript}"</p>
            </div>
          )}
          
          {feedback && (
            <div className={`mb-6 p-4 rounded-lg ${feedback.type === 'success' ? 'bg-green-50 border border-green-200' : 
              feedback.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' : 
              'bg-red-50 border border-red-200'}`}>
              <div className="flex items-start">
                <div className={`mr-3 ${feedback.type === 'success' ? 'text-green-500' : 
                  feedback.type === 'warning' ? 'text-yellow-500' : 
                  'text-red-500'}`}>
                  {feedback.type === 'success' ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h4 className={`font-medium ${feedback.type === 'success' ? 'text-green-800' : 
                    feedback.type === 'warning' ? 'text-yellow-800' : 
                    'text-red-800'}`}>
                    {feedback.type === 'success' ? 'Excellent!' : 
                     feedback.type === 'warning' ? 'Good attempt!' : 
                     'Try again'}
                  </h4>
                  <p className={feedback.type === 'success' ? 'text-green-700' : 
                    feedback.type === 'warning' ? 'text-yellow-700' : 
                    'text-red-700'}>
                    {feedback.message}
                  </p>
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
            <Button onClick={handleNextExercise}>
              Next Exercise
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}