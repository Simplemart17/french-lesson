import { useState, useEffect } from 'react';
import Head from 'next/head';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import DictationExercise from '@/components/exercises/DictationExercise';
import ListeningComprehension from '@/components/exercises/ListeningComprehension';
import { useAuth } from '@/context/AuthContext';
import { listeningService } from '@/services';

// NOTE: exerciseType initial state is set to 'dictation' below so exercises show immediately

// Sample dictation exercises
const dictationExercises = [
  {
    id: 'dictation-1',
    title: 'Basic Greetings',
    description: 'Practice listening to common French greetings',
    difficulty: 'beginner' as const,
    audioUrl: 'https://example.com/audio/greetings.mp3', // Replace with actual URL
    text: 'Bonjour, comment allez-vous aujourd\'hui?'
  },
  {
    id: 'dictation-2',
    title: 'Daily Activities',
    description: 'Practice listening to sentences about daily routines',
    difficulty: 'beginner' as const,
    audioUrl: 'https://example.com/audio/daily-activities.mp3', // Replace with actual URL
    text: 'Je me lève à sept heures et je prends mon petit déjeuner.'
  },
  {
    id: 'dictation-3',
    title: 'Restaurant Dialogue',
    description: 'Practice listening to a conversation in a restaurant',
    difficulty: 'intermediate' as const,
    audioUrl: 'https://example.com/audio/restaurant.mp3', // Replace with actual URL
    text: 'Je voudrais réserver une table pour deux personnes ce soir à vingt heures.'
  },
  {
    id: 'dictation-4',
    title: 'Travel Plans',
    description: 'Practice listening to sentences about travel',
    difficulty: 'intermediate' as const,
    audioUrl: 'https://example.com/audio/travel.mp3', // Replace with actual URL
    text: 'Nous allons prendre le train pour Paris demain matin à neuf heures trente.'
  },
  {
    id: 'dictation-5',
    title: 'Academic Discussion',
    description: 'Practice listening to an academic discussion',
    difficulty: 'advanced' as const,
    audioUrl: 'https://example.com/audio/academic.mp3', // Replace with actual URL
    text: 'Les conséquences du changement climatique sont nombreuses et affectent divers aspects de notre environnement.'
  }
];

// Sample listening comprehension exercises
const comprehensionExercises = [
  {
    id: 'comprehension-1',
    title: 'At the Café',
    description: 'Listen to a conversation at a café and answer questions',
    difficulty: 'beginner' as const,
    audioUrl: 'https://example.com/audio/cafe-conversation.mp3', // Replace with actual URL
    transcript: 'Serveur: Bonjour, qu\'est-ce que je vous sers?\nClient: Bonjour, je voudrais un café, s\'il vous plaît.\nServeur: Un café noir?\nClient: Oui, et aussi un croissant.\nServeur: Très bien. Ce sera tout?\nClient: Oui, merci. C\'est combien?\nServeur: Ça fait 5 euros 50, s\'il vous plaît.',
    questions: [
      {
        id: '1-1',
        text: 'What does the customer order?',
        options: ['A coffee and a sandwich', 'A coffee and a croissant', 'A tea and a croissant', 'Just a coffee'],
        correctAnswer: 'A coffee and a croissant',
        explanation: 'The customer says "je voudrais un café" and then adds "et aussi un croissant".'
      },
      {
        id: '1-2',
        text: 'How much does the order cost?',
        options: ['4 euros 50', '5 euros', '5 euros 50', '6 euros'],
        correctAnswer: '5 euros 50',
        explanation: 'The server says "Ça fait 5 euros 50, s\'il vous plaît" at the end of the conversation.'
      },
      {
        id: '1-3',
        text: 'What type of coffee does the customer order?',
        options: ['Café au lait', 'Espresso', 'Café noir', 'Not specified'],
        correctAnswer: 'Café noir',
        explanation: 'The server asks "Un café noir?" and the customer confirms with "Oui".'
      }
    ]
  },
  {
    id: 'comprehension-2',
    title: 'Weather Forecast',
    description: 'Listen to a weather forecast and answer questions',
    difficulty: 'intermediate' as const,
    audioUrl: 'https://example.com/audio/weather-forecast.mp3', // Replace with actual URL
    transcript: 'Bonjour à tous. Voici les prévisions météo pour demain. Il fera beau dans le sud avec des températures entre 25 et 30 degrés. Dans le nord, le temps sera nuageux avec quelques averses possibles l\'après-midi. Les températures seront plus fraîches, entre 18 et 22 degrés. À Paris, on attend un temps variable avec des éclaircies le matin et des nuages l\'après-midi. La température maximale sera de 24 degrés.',
    questions: [
      {
        id: '2-1',
        text: 'What will the weather be like in the south?',
        options: ['Rainy', 'Sunny', 'Cloudy', 'Snowy'],
        correctAnswer: 'Sunny',
        explanation: 'The forecast says "Il fera beau dans le sud" which means it will be nice/sunny in the south.'
      },
      {
        id: '2-2',
        text: 'What is the maximum temperature expected in Paris?',
        options: ['18 degrees', '22 degrees', '24 degrees', '30 degrees'],
        correctAnswer: '24 degrees',
        explanation: 'For Paris, it says "La température maximale sera de 24 degrés."'
      },
      {
        id: '2-3',
        text: 'What weather is expected in the north in the afternoon?',
        options: ['Sunny', 'Foggy', 'Possible showers', 'Strong winds'],
        correctAnswer: 'Possible showers',
        explanation: 'For the north, it mentions "quelques averses possibles l\'après-midi" which means possible showers in the afternoon.'
      },
      {
        id: '2-4',
        text: 'What will the weather be like in Paris in the morning?',
        options: ['Cloudy', 'Sunny spells', 'Rainy', 'Foggy'],
        correctAnswer: 'Sunny spells',
        explanation: 'For Paris, it says "un temps variable avec des éclaircies le matin" which means variable weather with sunny spells in the morning.'
      }
    ]
  },
  {
    id: 'comprehension-3',
    title: 'Job Interview',
    description: 'Listen to a job interview and answer questions',
    difficulty: 'advanced' as const,
    audioUrl: 'https://example.com/audio/job-interview.mp3', // Replace with actual URL
    transcript: 'Recruteur: Bonjour, merci d\'être venu aujourd\'hui. Pourriez-vous me parler de votre expérience professionnelle?\nCandidat: Bonjour. Bien sûr. J\'ai travaillé pendant cinq ans comme développeur web dans une entreprise de technologie. J\'étais responsable de la création et de la maintenance de sites web pour nos clients. J\'ai également dirigé une petite équipe de trois personnes pendant les deux dernières années.\nRecruteur: Très intéressant. Et quelles sont vos compétences techniques principales?\nCandidat: Je maîtrise HTML, CSS, JavaScript et PHP. J\'ai aussi de l\'expérience avec des frameworks comme React et Vue.js. De plus, j\'ai de bonnes connaissances en SEO et en accessibilité web.\nRecruteur: Parfait. Et pourquoi voulez-vous rejoindre notre entreprise?\nCandidat: J\'admire beaucoup les projets innovants que votre entreprise développe, particulièrement dans le domaine de l\'intelligence artificielle. Je pense que mes compétences en développement web pourraient être très utiles pour vos interfaces utilisateur, et j\'aimerais beaucoup apprendre davantage sur l\'IA.',
    questions: [
      {
        id: '3-1',
        text: 'How long did the candidate work as a web developer?',
        options: ['3 years', '5 years', '2 years', '10 years'],
        correctAnswer: '5 years',
        explanation: 'The candidate says "J\'ai travaillé pendant cinq ans comme développeur web".'
      },
      {
        id: '3-2',
        text: 'What was the candidate responsible for in their previous job?',
        options: ['Marketing websites', 'Creating and maintaining websites', 'Managing the company', 'Customer service'],
        correctAnswer: 'Creating and maintaining websites',
        explanation: 'The candidate mentions "J\'étais responsable de la création et de la maintenance de sites web pour nos clients."'
      },
      {
        id: '3-3',
        text: 'How many people did the candidate manage?',
        options: ['None', '2 people', '3 people', '5 people'],
        correctAnswer: '3 people',
        explanation: 'The candidate says "J\'ai également dirigé une petite équipe de trois personnes".'
      },
      {
        id: '3-4',
        text: 'Which of these technologies did the candidate NOT mention as part of their skills?',
        options: ['HTML', 'Python', 'React', 'JavaScript'],
        correctAnswer: 'Python',
        explanation: 'The candidate lists HTML, CSS, JavaScript, PHP, React, and Vue.js, but does not mention Python.'
      },
      {
        id: '3-5',
        text: 'Why does the candidate want to join the company?',
        options: ['Higher salary', 'Better work-life balance', 'Interest in the company\'s AI projects', 'Shorter commute'],
        correctAnswer: 'Interest in the company\'s AI projects',
        explanation: 'The candidate expresses admiration for the company\'s innovative projects in AI: "J\'admire beaucoup les projets innovants que votre entreprise développe, particulièrement dans le domaine de l\'intelligence artificielle."'
      }
    ]
  }
];

export default function ListeningPage() {
  const { isAuthenticated } = useAuth();
  const [exerciseType, setExerciseType] = useState<'dictation' | 'comprehension' | null>('dictation');
  interface ListeningExercise {
    id: string | number;
    title: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    audioUrl: string;
    type?: 'dictation' | 'comprehension';
    text?: string;
    questions?: Array<{ id: string; text: string; options: string[]; correctAnswer: string; explanation: string }>;
    transcript?: string;
  }

  const [selectedExercise, setSelectedExercise] = useState<ListeningExercise | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const exercisesPerPage = 9;

  // State for API data
  const [listeningExercises, setListeningExercises] = useState<ListeningExercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch listening exercises from the API
  useEffect(() => {
    const fetchExercises = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const exercises = await listeningService.getListeningExercises(
          selectedDifficulty !== 'all' ? selectedDifficulty : undefined
        );

        if (!exercises || exercises.length === 0) {
          // No exercises from API — use fallback hardcoded data with TTS audio
          const fallbackDictation = dictationExercises.map(ex => ({
            ...ex,
            audioUrl: `/api/tts?text=${encodeURIComponent(ex.text)}&lang=fr`,
            type: 'dictation' as const
          }));
          const fallbackComprehension = comprehensionExercises.map(ex => ({
            ...ex,
            audioUrl: `/api/tts?text=${encodeURIComponent(ex.transcript)}&lang=fr`,
            type: 'comprehension' as const
          }));
          setListeningExercises([...fallbackDictation, ...fallbackComprehension]);
        } else {
          // Convert the exercises to match the expected interface
          const convertedExercises = exercises.map(exercise => ({
            ...exercise,
            id: String(exercise.id),
            questions: exercise.questions?.map(q => ({
              id: q.id,
              text: q.text || '',
              options: q.options || [],
              correctAnswer: String(q.correctAnswer || ''),
              explanation: q.explanation || ''
            }))
          }));
          setListeningExercises(convertedExercises);
        }
      } catch (err) {
        console.error('Error fetching listening exercises:', err);
        // Fallback to hardcoded exercises with TTS audio URLs
        const fallbackDictation = dictationExercises.map(ex => ({
          ...ex,
          audioUrl: `/api/tts?text=${encodeURIComponent(ex.text)}&lang=fr`,
          type: 'dictation' as const
        }));
        const fallbackComprehension = comprehensionExercises.map(ex => ({
          ...ex,
          audioUrl: `/api/tts?text=${encodeURIComponent(ex.transcript)}&lang=fr`,
          type: 'comprehension' as const
        }));
        setListeningExercises([...fallbackDictation, ...fallbackComprehension]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, [selectedDifficulty]);

  // Filter exercises based on type and difficulty
  const filteredDictationExercises = listeningExercises
    .filter(ex => ex.type === 'dictation' || !ex.type) // Include exercises without type for backward compatibility
    .filter(ex => selectedDifficulty === 'all' || ex.difficulty === selectedDifficulty);

  const filteredComprehensionExercises = listeningExercises
    .filter(ex => ex.type === 'comprehension' || (ex.questions && ex.questions.length > 0)) // Include exercises with questions
    .filter(ex => selectedDifficulty === 'all' || ex.difficulty === selectedDifficulty);

  // Paginate the current exercise list
  const currentExercises = exerciseType === 'dictation' ? filteredDictationExercises : filteredComprehensionExercises;
  const totalPages = Math.ceil(currentExercises.length / exercisesPerPage);
  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const paginatedExercises = currentExercises.slice(indexOfFirstExercise, indexOfLastExercise);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [exerciseType, selectedDifficulty]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExerciseComplete = async (score: number, answersOrText?: Record<string, string> | string) => {
    if (selectedExercise && isAuthenticated) {
      try {
        // In a real implementation, this would submit the results to the API.
        void score;
        void answersOrText;
        void selectedExercise.id;
      } catch (err) {
        console.error('Error submitting exercise results:', err);
      }
    }
  };

  // Create separate handlers for each exercise type to match their expected types
  const handleDictationComplete = (score: number, userText: string) => {
    handleExerciseComplete(score, userText);
  };

  const handleComprehensionComplete = (score: number, answers: Record<string, string>) => {
    handleExerciseComplete(score, answers);
  };

  const renderExerciseSelector = () => (
    <>
      <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Choose Exercise Type</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card
            className={`p-6 cursor-pointer transition-all hover:shadow-md ${
              exerciseType === 'dictation' ? 'ring-2 ring-primary-500' : ''
            }`}
            onClick={() => setExerciseType('dictation')}
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary-100 text-primary-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-800">Dictation Exercises</h3>
              <p className="text-gray-600">
                Listen to audio clips and write down what you hear. Great for improving listening and spelling skills.
              </p>
            </div>
          </Card>

          <Card
            className={`p-6 cursor-pointer transition-all hover:shadow-md ${
              exerciseType === 'comprehension' ? 'ring-2 ring-primary-500' : ''
            }`}
            onClick={() => setExerciseType('comprehension')}
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary-100 text-primary-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-800">Comprehension Exercises</h3>
              <p className="text-gray-600">
                Listen to conversations and answer questions about what you heard. Great for improving understanding.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {exerciseType && (
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

          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            {exerciseType === 'dictation' ? 'Dictation Exercises' : 'Comprehension Exercises'}
          </h2>

          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
            {paginatedExercises.map((exercise, index) => (
              <Card key={exercise.id ?? `exercise-${index}`} className="h-full transition-shadow hover:shadow-lg">
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
                      onClick={() => {
                        setSelectedExercise(exercise);
                      }}
                      className="w-full"
                    >
                      Start Exercise
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mb-12">
              <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>

                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === index + 1
                        ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </>
  );

  return (
    <ProtectedRoute>
      <Head>
        <title>Listening Practice | French Tutor AI</title>
        <meta name="description" content="Practice your French listening skills with dictation and comprehension exercises" />
      </Head>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">Listening Practice</h1>
          <p className="text-lg text-gray-600">
            Improve your French listening skills with dictation and comprehension exercises. Listen to native speakers and test your understanding.
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center p-12">
            <LoadingState message="Loading listening exercises..." size="large" />
          </div>
        )}

        {error && !isLoading && (
          <div className="p-6 mb-8">
            <ErrorMessage
              message={error}
              type="error"
              retryAction={() => window.location.reload()}
            />
          </div>
        )}

        {!isLoading && !error && (
          <>
            {selectedExercise ? (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
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

                {exerciseType === 'dictation' ? (
                  <DictationExercise
                    audioUrl={selectedExercise.audioUrl}
                    text={selectedExercise.text || ''}
                    difficulty={selectedExercise.difficulty}
                    onComplete={handleDictationComplete}
                  />
                ) : (
                  <ListeningComprehension
                    audioUrl={selectedExercise.audioUrl}
                    title={selectedExercise.title}
                    description={selectedExercise.description}
                    questions={selectedExercise.questions || []}
                    difficulty={selectedExercise.difficulty}
                    transcript={selectedExercise.transcript}
                    onComplete={handleComprehensionComplete}
                  />
                )}
              </div>
            ) : (
              renderExerciseSelector()
            )}
          </>
        )}

        {!selectedExercise && (
          <>
            {!isAuthenticated && (
              <div className="p-6 mb-8 border rounded-lg bg-primary-50 border-primary-100">
                <div className="items-center md:flex">
                  <div className="md:w-3/4">
                    <h3 className="mb-2 text-xl font-semibold text-primary-800">Create an Account to Track Your Progress</h3>
                    <p className="mb-4 text-primary-700 md:mb-0">
                      Sign up to save your listening exercise scores, track your improvement over time, and unlock more exercises.
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
              <h2 className="mb-4 text-xl font-semibold text-gray-800">Tips for Improving Listening Skills</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-medium text-gray-800">For Beginners</h3>
                  <ul className="space-y-1 text-gray-600 list-disc list-inside">
                    <li>Start with short, simple audio clips</li>
                    <li>Focus on understanding the main idea, not every word</li>
                    <li>Listen to the same clip multiple times</li>
                    <li>Use visual cues and context to help understand</li>
                    <li>Practice with different voices and accents</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 font-medium text-gray-800">For Intermediate/Advanced</h3>
                  <ul className="space-y-1 text-gray-600 list-disc list-inside">
                    <li>Listen to authentic materials like podcasts and radio</li>
                    <li>Try to understand without reading transcripts first</li>
                    <li>Focus on specific details and nuances</li>
                    <li>Practice note-taking while listening</li>
                    <li>Challenge yourself with different regional accents</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="mb-2 font-medium text-gray-800">Daily Practice Ideas</h3>
                <ul className="space-y-1 text-gray-600 list-disc list-inside">
                  <li>Listen to French music and try to write down the lyrics</li>
                  <li>Watch French movies or TV shows with French subtitles</li>
                  <li>Find a French podcast about topics that interest you</li>
                  <li>Use language exchange apps to practice with native speakers</li>
                  <li>Record yourself speaking French and listen back to improve pronunciation</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
