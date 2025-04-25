import { useState } from 'react';
import Head from 'next/head';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import EnhancedSpeechRecognition from '@/components/features/EnhancedSpeechRecognition';
import { useAuth } from '@/context/AuthContext';

// Sample pronunciation exercises
const pronunciationExercises = [
  {
    id: '1',
    title: 'Basic Greetings',
    description: 'Practice common French greetings and introductions',
    difficulty: 'beginner' as const,
    phrases: [
      'Bonjour, comment allez-vous?',
      'Je m\'appelle Jean. Enchanté.',
      'Au revoir et à bientôt!',
      'Merci beaucoup pour votre aide.'
    ]
  },
  {
    id: '2',
    title: 'Nasal Sounds',
    description: 'Practice French nasal vowel sounds',
    difficulty: 'beginner' as const,
    phrases: [
      'Un bon vin blanc',
      'Demain matin',
      'Le train est en retard',
      'J\'ai faim et j\'ai besoin de pain'
    ]
  },
  {
    id: '3',
    title: 'R Sound',
    description: 'Practice the French R sound',
    difficulty: 'intermediate' as const,
    phrases: [
      'Trois gros rats gris',
      'Regardez derrière la porte',
      'Je voudrais réserver une chambre',
      'Le restaurant est sur la rue à droite'
    ]
  },
  {
    id: '4',
    title: 'U Sound',
    description: 'Practice the French U sound',
    difficulty: 'intermediate' as const,
    phrases: [
      'Tu as vu la rue?',
      'J\'ai bu du jus',
      'La musique est une culture universelle',
      'Une minute de plus s\'il vous plaît'
    ]
  },
  {
    id: '5',
    title: 'Difficult Sentences',
    description: 'Practice complex French sentences with multiple challenging sounds',
    difficulty: 'advanced' as const,
    phrases: [
      'Les chaussettes de l\'archiduchesse sont-elles sèches ou archi-sèches?',
      'Un chasseur sachant chasser doit savoir chasser sans son chien',
      'Je veux et j\'exige d\'exquises excuses',
      'Ton thé t\'a-t-il ôté ta toux?'
    ]
  }
];

export default function PronunciationPage() {
  const { isAuthenticated } = useAuth();
  const [selectedExercise, setSelectedExercise] = useState<typeof pronunciationExercises[0] | null>(null);
  const [selectedPhrase, setSelectedPhrase] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [userScores, setUserScores] = useState<Record<string, number>>({});
  
  // Filter exercises based on selected difficulty
  const filteredExercises = selectedDifficulty === 'all' 
    ? pronunciationExercises 
    : pronunciationExercises.filter(exercise => exercise.difficulty === selectedDifficulty);
  
  const handlePronunciationComplete = (transcript: string, score: number, feedback: any[]) => {
    console.log('Pronunciation completed:', { transcript, score, feedback });
    
    // Update user scores
    if (selectedPhrase) {
      setUserScores(prev => ({
        ...prev,
        [selectedPhrase]: score
      }));
    }
    
    // In a real app, this would save the user's progress
  };
  
  return (
    <>
      <Head>
        <title>Pronunciation Practice | French Tutor AI</title>
        <meta name="description" content="Practice French pronunciation with detailed feedback" />
      </Head>
      
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">Pronunciation Practice</h1>
          <p className="text-lg text-gray-600">
            Improve your French pronunciation with targeted exercises and get detailed feedback on your speech.
          </p>
        </div>
        
        {selectedExercise && selectedPhrase ? (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="outline" 
                onClick={() => setSelectedPhrase('')}
                className="flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Phrases
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
            
            <EnhancedSpeechRecognition 
              targetPhrase={selectedPhrase}
              onComplete={handlePronunciationComplete}
            />
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
                
                <h3 className="mb-3 font-medium text-gray-800">Select a phrase to practice:</h3>
                <div className="space-y-3">
                  {selectedExercise.phrases.map((phrase, index) => {
                    const score = userScores[phrase];
                    const hasScore = score !== undefined;
                    
                    return (
                      <div 
                        key={index}
                        onClick={() => setSelectedPhrase(phrase)}
                        className="p-4 transition-colors border border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 hover:bg-primary-50"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-800">{phrase}</p>
                            {hasScore && (
                              <div className="mt-1 text-sm text-gray-500">
                                Last score: 
                                <span className={`ml-1 font-medium ${
                                  score >= 80 
                                    ? 'text-green-600' 
                                    : score >= 50 
                                    ? 'text-yellow-600' 
                                    : 'text-red-600'
                                }`}>
                                  {score}%
                                </span>
                              </div>
                            )}
                          </div>
                          <Button size="sm">Practice</Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <>
            <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">Choose a Difficulty Level</h2>
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
            
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">Pronunciation Exercises</h2>
            
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
                      Sign up to save your pronunciation scores, track your improvement over time, and unlock more exercises.
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
              <h2 className="mb-4 text-xl font-semibold text-gray-800">French Pronunciation Tips</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-medium text-gray-800">Vowel Sounds</h3>
                  <ul className="space-y-1 text-gray-600 list-disc list-inside">
                    <li><strong>U</strong> - Pronounce with rounded lips, like saying "ee" while whistling</li>
                    <li><strong>EU</strong> - Similar to "u" in "burn" but with rounded lips</li>
                    <li><strong>OU</strong> - Like "oo" in "food"</li>
                    <li><strong>E</strong> - Often silent at the end of words</li>
                    <li><strong>É</strong> - Like "ay" in "say"</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 font-medium text-gray-800">Consonant Sounds</h3>
                  <ul className="space-y-1 text-gray-600 list-disc list-inside">
                    <li><strong>R</strong> - Pronounced at the back of the throat</li>
                    <li><strong>J</strong> - Like "s" in "measure"</li>
                    <li><strong>CH</strong> - Like "sh" in "ship"</li>
                    <li><strong>GN</strong> - Like "ny" in "canyon"</li>
                    <li><strong>H</strong> - Always silent</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="mb-2 font-medium text-gray-800">Nasal Sounds</h3>
                <p className="mb-2 text-gray-600">
                  French has four nasal vowel sounds that are pronounced by letting air flow through your nose:
                </p>
                <ul className="space-y-1 text-gray-600 list-disc list-inside">
                  <li><strong>AN/EN/AM/EM</strong> - As in "enfant" (child)</li>
                  <li><strong>IN/IM/AIN/EIN</strong> - As in "pain" (bread)</li>
                  <li><strong>ON/OM</strong> - As in "bon" (good)</li>
                  <li><strong>UN/UM</strong> - As in "parfum" (perfume)</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
