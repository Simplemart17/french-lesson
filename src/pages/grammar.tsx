import { useState } from 'react';
import Head from 'next/head';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import GrammarCorrection from '@/components/features/GrammarCorrection';
import { useAuth } from '@/context/AuthContext';

// Sample grammar exercises
const grammarExercises = [
  {
    id: '1',
    title: 'Present Tense Conjugation',
    description: 'Practice conjugating regular and irregular verbs in the present tense',
    difficulty: 'beginner' as const,
    examples: [
      {
        prompt: 'Je (aller) au marché.',
        answer: 'Je vais au marché.',
        hint: 'Conjugate "aller" in the present tense for "je"'
      },
      {
        prompt: 'Tu (être) très intelligent.',
        answer: 'Tu es très intelligent.',
        hint: 'Conjugate "être" in the present tense for "tu"'
      },
      {
        prompt: 'Nous (avoir) un chat noir.',
        answer: 'Nous avons un chat noir.',
        hint: 'Conjugate "avoir" in the present tense for "nous"'
      }
    ]
  },
  {
    id: '2',
    title: 'Gender Agreement',
    description: 'Practice matching adjectives with the gender of nouns',
    difficulty: 'beginner' as const,
    examples: [
      {
        prompt: 'La maison est (grand).',
        answer: 'La maison est grande.',
        hint: '"Maison" is feminine, so add an "e" to "grand"'
      },
      {
        prompt: 'Le livre est (intéressant).',
        answer: 'Le livre est intéressant.',
        hint: '"Livre" is masculine, so no change to "intéressant"'
      },
      {
        prompt: 'La voiture est (petit).',
        answer: 'La voiture est petite.',
        hint: '"Voiture" is feminine, so add an "e" to "petit"'
      }
    ]
  },
  {
    id: '3',
    title: 'Passé Composé',
    description: 'Practice forming the past tense with avoir and être',
    difficulty: 'intermediate' as const,
    examples: [
      {
        prompt: 'Je (manger) une pomme hier.',
        answer: 'J\'ai mangé une pomme hier.',
        hint: 'Use "avoir" + past participle of "manger"'
      },
      {
        prompt: 'Elle (aller) à Paris la semaine dernière.',
        answer: 'Elle est allée à Paris la semaine dernière.',
        hint: 'Use "être" + past participle of "aller" (add "e" for feminine)'
      },
      {
        prompt: 'Nous (visiter) le musée samedi dernier.',
        answer: 'Nous avons visité le musée samedi dernier.',
        hint: 'Use "avoir" + past participle of "visiter"'
      }
    ]
  },
  {
    id: '4',
    title: 'Subjunctive Mood',
    description: 'Practice using the subjunctive mood in French',
    difficulty: 'advanced' as const,
    examples: [
      {
        prompt: 'Il faut que je (aller) à la banque.',
        answer: 'Il faut que j\'aille à la banque.',
        hint: 'Use the subjunctive form of "aller" after "il faut que"'
      },
      {
        prompt: 'Je veux que tu (être) heureux.',
        answer: 'Je veux que tu sois heureux.',
        hint: 'Use the subjunctive form of "être" after "je veux que"'
      },
      {
        prompt: 'Il est important que nous (faire) nos devoirs.',
        answer: 'Il est important que nous fassions nos devoirs.',
        hint: 'Use the subjunctive form of "faire" after "il est important que"'
      }
    ]
  }
];

export default function GrammarPage() {
  const { isAuthenticated } = useAuth();
  const [selectedExercise, setSelectedExercise] = useState<typeof grammarExercises[0] | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [showFreeform, setShowFreeform] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({});
  
  // Filter exercises based on selected difficulty
  const filteredExercises = selectedDifficulty === 'all' 
    ? grammarExercises 
    : grammarExercises.filter(exercise => exercise.difficulty === selectedDifficulty);
  
  // Check answers
  const checkAnswers = (exerciseId: string) => {
    const newShowAnswers = { ...showAnswers };
    newShowAnswers[exerciseId] = true;
    setShowAnswers(newShowAnswers);
  };
  
  // Handle input change
  const handleInputChange = (exerciseId: string, promptIndex: number, value: string) => {
    const key = `${exerciseId}-${promptIndex}`;
    setUserAnswers(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Check if answer is correct
  const isAnswerCorrect = (exerciseId: string, promptIndex: number, correctAnswer: string) => {
    const key = `${exerciseId}-${promptIndex}`;
    const userAnswer = userAnswers[key] || '';
    
    // Normalize answers for comparison (remove extra spaces, make case insensitive)
    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
    const normalizedCorrectAnswer = correctAnswer.trim().toLowerCase();
    
    return normalizedUserAnswer === normalizedCorrectAnswer;
  };
  
  return (
    <>
      <Head>
        <title>Grammar Practice | French Tutor AI</title>
        <meta name="description" content="Practice French grammar with interactive exercises" />
      </Head>
      
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">French Grammar Practice</h1>
          <p className="text-lg text-gray-600">
            Improve your French grammar with targeted exercises and get instant feedback.
          </p>
        </div>
        
        {showFreeform ? (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="outline" 
                onClick={() => setShowFreeform(false)}
                className="flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Exercises
              </Button>
            </div>
            
            <GrammarCorrection />
          </div>
        ) : selectedExercise ? (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="outline" 
                onClick={() => setSelectedExercise(null)}
                className="flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Exercises
              </Button>
              
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedExercise.difficulty === 'beginner' 
                  ? 'bg-green-100 text-green-800' 
                  : selectedExercise.difficulty === 'intermediate'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
              }`}>
                {selectedExercise.difficulty.charAt(0).toUpperCase() + selectedExercise.difficulty.slice(1)}
              </div>
            </div>
            
            <Card className="mb-6">
              <div className="p-6">
                <h2 className="mb-2 text-xl font-semibold text-gray-800">{selectedExercise.title}</h2>
                <p className="mb-6 text-gray-600">{selectedExercise.description}</p>
                
                <h3 className="mb-4 font-medium text-gray-800">Complete the sentences:</h3>
                <div className="space-y-6">
                  {selectedExercise.examples.map((example, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <p className="mb-3 font-medium text-gray-800">{example.prompt}</p>
                      
                      <div className="mb-3">
                        <input
                          type="text"
                          value={userAnswers[`${selectedExercise.id}-${index}`] || ''}
                          onChange={(e) => handleInputChange(selectedExercise.id, index, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Your answer..."
                          disabled={showAnswers[selectedExercise.id]}
                        />
                      </div>
                      
                      {showAnswers[selectedExercise.id] && (
                        <div className={`p-3 rounded-lg ${
                          isAnswerCorrect(selectedExercise.id, index, example.answer)
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-red-50 border border-red-200'
                        }`}>
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              {isAnswerCorrect(selectedExercise.id, index, example.answer) ? (
                                <svg className="w-5 h-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-800">
                                Correct answer: <span className="text-green-700">{example.answer}</span>
                              </p>
                              <p className="mt-1 text-sm text-gray-600">{example.hint}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end mt-6">
                  {!showAnswers[selectedExercise.id] ? (
                    <Button onClick={() => checkAnswers(selectedExercise.id)}>
                      Check Answers
                    </Button>
                  ) : (
                    <Button onClick={() => setSelectedExercise(null)}>
                      Try Another Exercise
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <>
            <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
              <div className="flex flex-col items-center justify-between mb-6 md:flex-row">
                <h2 className="mb-4 text-xl font-semibold text-gray-800 md:mb-0">Choose a Difficulty Level</h2>
                <Button 
                  onClick={() => setShowFreeform(true)}
                  className="flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Free Writing Practice
                </Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedDifficulty('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedDifficulty === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  All Levels
                </button>
                <button
                  onClick={() => setSelectedDifficulty('beginner')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedDifficulty === 'beginner'
                      ? 'bg-green-600 text-white'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  Beginner
                </button>
                <button
                  onClick={() => setSelectedDifficulty('intermediate')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedDifficulty === 'intermediate'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  }`}
                >
                  Intermediate
                </button>
                <button
                  onClick={() => setSelectedDifficulty('advanced')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedDifficulty === 'advanced'
                      ? 'bg-red-600 text-white'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  Advanced
                </button>
              </div>
            </div>
            
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">Grammar Exercises</h2>
            
            <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2 lg:grid-cols-3">
              {filteredExercises.map((exercise) => (
                <Card key={exercise.id} className="h-full transition-shadow hover:shadow-lg">
                  <div className="flex flex-col h-full p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">{exercise.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        exercise.difficulty === 'beginner' 
                          ? 'bg-green-100 text-green-800' 
                          : exercise.difficulty === 'intermediate'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                      </span>
                    </div>
                    
                    <p className="flex-grow mb-6 text-gray-600">{exercise.description}</p>
                    
                    <div className="mt-auto">
                      <Button 
                        onClick={() => setSelectedExercise(exercise)}
                        className="w-full"
                      >
                        Start Exercise
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {!isAuthenticated && (
              <div className="p-6 mb-8 border rounded-lg bg-primary-50 border-primary-100">
                <div className="items-center md:flex">
                  <div className="md:w-3/4">
                    <h3 className="mb-2 text-xl font-semibold text-primary-800">Create an Account to Track Your Progress</h3>
                    <p className="mb-4 text-primary-700 md:mb-0">
                      Sign up to save your grammar practice results, track your improvement over time, and unlock more exercises.
                    </p>
                  </div>
                  <div className="flex justify-end md:w-1/4">
                    <Button 
                      variant="default"
                      onClick={() => window.location.href = '/register'}
                    >
                      Create Free Account
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">French Grammar Tips</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-medium text-gray-800">Gender Agreement</h3>
                  <ul className="space-y-1 text-gray-600 list-disc list-inside">
                    <li>Most nouns ending in <strong>-e</strong> are feminine</li>
                    <li>Add <strong>-e</strong> to adjectives for feminine nouns</li>
                    <li>Add <strong>-s</strong> to adjectives for plural nouns</li>
                    <li>Some adjectives like <strong>heureux → heureuse</strong> have special feminine forms</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 font-medium text-gray-800">Verb Conjugation</h3>
                  <ul className="space-y-1 text-gray-600 list-disc list-inside">
                    <li>Regular <strong>-er</strong> verbs follow predictable patterns</li>
                    <li>Memorize common irregular verbs: être, avoir, aller, faire</li>
                    <li>Pay attention to subject-verb agreement</li>
                    <li>Practice both written and spoken conjugations</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
