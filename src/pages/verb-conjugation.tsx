import { useState } from 'react';
import Head from 'next/head';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import VerbConjugation from '@/components/exercises/VerbConjugation';
import { useAuth } from '@/context/AuthContext';

// Sample verb conjugation exercises organized by difficulty and verb groups
const verbConjugationExercises = {
  beginner: [
    {
      id: 'etre-present',
      verb: 'être',
      tense: 'présent',
      description: 'The verb "être" (to be) is one of the most important and frequently used verbs in French.',
      conjugations: [
        { pronoun: 'je', correctAnswer: 'suis' },
        { pronoun: 'tu', correctAnswer: 'es' },
        { pronoun: 'il/elle', correctAnswer: 'est' },
        { pronoun: 'nous', correctAnswer: 'sommes' },
        { pronoun: 'vous', correctAnswer: 'êtes' },
        { pronoun: 'ils/elles', correctAnswer: 'sont' }
      ],
      irregularNotes: '"Être" is a highly irregular verb. These forms must be memorized.',
      examples: [
        'Je suis étudiant. (I am a student.)',
        'Nous sommes à Paris. (We are in Paris.)',
        'Elles sont françaises. (They are French.)'
      ]
    },
    {
      id: 'avoir-present',
      verb: 'avoir',
      tense: 'présent',
      description: 'The verb "avoir" (to have) is essential for forming compound tenses in French.',
      conjugations: [
        { pronoun: 'je', correctAnswer: 'ai' },
        { pronoun: 'tu', correctAnswer: 'as' },
        { pronoun: 'il/elle', correctAnswer: 'a' },
        { pronoun: 'nous', correctAnswer: 'avons' },
        { pronoun: 'vous', correctAnswer: 'avez' },
        { pronoun: 'ils/elles', correctAnswer: 'ont' }
      ],
      irregularNotes: '"Avoir" is an irregular verb with unique conjugations in the present tense.',
      examples: [
        'J\'ai un livre. (I have a book.)',
        'Tu as raison. (You are right.)',
        'Ils ont une maison. (They have a house.)'
      ]
    },
    {
      id: 'parler-present',
      verb: 'parler',
      tense: 'présent',
      description: 'The verb "parler" (to speak) is a regular -ER verb, which follows the most common conjugation pattern.',
      conjugations: [
        { pronoun: 'je', correctAnswer: 'parle' },
        { pronoun: 'tu', correctAnswer: 'parles' },
        { pronoun: 'il/elle', correctAnswer: 'parle' },
        { pronoun: 'nous', correctAnswer: 'parlons' },
        { pronoun: 'vous', correctAnswer: 'parlez' },
        { pronoun: 'ils/elles', correctAnswer: 'parlent' }
      ],
      examples: [
        'Je parle français. (I speak French.)',
        'Vous parlez trop vite. (You speak too fast.)',
        'Ils parlent trois langues. (They speak three languages.)'
      ]
    }
  ],
  intermediate: [
    {
      id: 'aller-present',
      verb: 'aller',
      tense: 'présent',
      description: 'The verb "aller" (to go) is irregular and also used to form the immediate future tense.',
      conjugations: [
        { pronoun: 'je', correctAnswer: 'vais' },
        { pronoun: 'tu', correctAnswer: 'vas' },
        { pronoun: 'il/elle', correctAnswer: 'va' },
        { pronoun: 'nous', correctAnswer: 'allons' },
        { pronoun: 'vous', correctAnswer: 'allez' },
        { pronoun: 'ils/elles', correctAnswer: 'vont' }
      ],
      irregularNotes: '"Aller" has unique forms that must be memorized. The "je", "tu", "il/elle", and "ils/elles" forms do not follow a regular pattern.',
      examples: [
        'Je vais au cinéma. (I am going to the cinema.)',
        'Nous allons à la plage. (We are going to the beach.)',
        'Ils vont bien. (They are doing well.)'
      ]
    },
    {
      id: 'finir-present',
      verb: 'finir',
      tense: 'présent',
      description: 'The verb "finir" (to finish) is a regular -IR verb, following the second group conjugation pattern.',
      conjugations: [
        { pronoun: 'je', correctAnswer: 'finis' },
        { pronoun: 'tu', correctAnswer: 'finis' },
        { pronoun: 'il/elle', correctAnswer: 'finit' },
        { pronoun: 'nous', correctAnswer: 'finissons' },
        { pronoun: 'vous', correctAnswer: 'finissez' },
        { pronoun: 'ils/elles', correctAnswer: 'finissent' }
      ],
      examples: [
        'Je finis mon travail. (I am finishing my work.)',
        'Nous finissons à 18h. (We finish at 6pm.)',
        'Ils finissent la réunion. (They are finishing the meeting.)'
      ]
    },
    {
      id: 'prendre-present',
      verb: 'prendre',
      tense: 'présent',
      description: 'The verb "prendre" (to take) is an irregular -RE verb.',
      conjugations: [
        { pronoun: 'je', correctAnswer: 'prends' },
        { pronoun: 'tu', correctAnswer: 'prends' },
        { pronoun: 'il/elle', correctAnswer: 'prend' },
        { pronoun: 'nous', correctAnswer: 'prenons' },
        { pronoun: 'vous', correctAnswer: 'prenez' },
        { pronoun: 'ils/elles', correctAnswer: 'prennent' }
      ],
      irregularNotes: 'Note the irregular stem change in the "ils/elles" form (prenn-).',
      examples: [
        'Je prends le bus. (I take the bus.)',
        'Vous prenez un café? (Are you having a coffee?)',
        'Ils prennent des photos. (They are taking photos.)'
      ]
    }
  ],
  advanced: [
    {
      id: 'etre-passe-compose',
      verb: 'être',
      tense: 'passé composé',
      description: 'The passé composé of "être" uses "avoir" as its auxiliary verb.',
      conjugations: [
        { pronoun: 'j\'', correctAnswer: 'ai été' },
        { pronoun: 'tu', correctAnswer: 'as été' },
        { pronoun: 'il/elle', correctAnswer: 'a été' },
        { pronoun: 'nous', correctAnswer: 'avons été' },
        { pronoun: 'vous', correctAnswer: 'avez été' },
        { pronoun: 'ils/elles', correctAnswer: 'ont été' }
      ],
      examples: [
        'J\'ai été malade hier. (I was sick yesterday.)',
        'Nous avons été surpris. (We were surprised.)',
        'Ils ont été gentils. (They were kind.)'
      ]
    },
    {
      id: 'parler-imparfait',
      verb: 'parler',
      tense: 'imparfait',
      description: 'The imparfait (imperfect) tense is used to describe ongoing or habitual actions in the past.',
      conjugations: [
        { pronoun: 'je', correctAnswer: 'parlais' },
        { pronoun: 'tu', correctAnswer: 'parlais' },
        { pronoun: 'il/elle', correctAnswer: 'parlait' },
        { pronoun: 'nous', correctAnswer: 'parlions' },
        { pronoun: 'vous', correctAnswer: 'parliez' },
        { pronoun: 'ils/elles', correctAnswer: 'parlaient' }
      ],
      examples: [
        'Je parlais souvent français quand j\'étais étudiant. (I often spoke French when I was a student.)',
        'Vous parliez au téléphone. (You were speaking on the phone.)',
        'Ils parlaient de leur voyage. (They were talking about their trip.)'
      ]
    },
    {
      id: 'aller-futur-simple',
      verb: 'aller',
      tense: 'futur simple',
      description: 'The futur simple (simple future) tense is used to talk about actions that will happen in the future.',
      conjugations: [
        { pronoun: 'j\'', correctAnswer: 'irai' },
        { pronoun: 'tu', correctAnswer: 'iras' },
        { pronoun: 'il/elle', correctAnswer: 'ira' },
        { pronoun: 'nous', correctAnswer: 'irons' },
        { pronoun: 'vous', correctAnswer: 'irez' },
        { pronoun: 'ils/elles', correctAnswer: 'iront' }
      ],
      irregularNotes: 'The stem of "aller" changes completely in the future tense to "ir-".',
      examples: [
        'J\'irai en France l\'année prochaine. (I will go to France next year.)',
        'Nous irons au restaurant samedi. (We will go to the restaurant on Saturday.)',
        'Ils iront à la plage cet été. (They will go to the beach this summer.)'
      ]
    }
  ]
};

export default function VerbConjugationPage() {
  const { isAuthenticated } = useAuth();
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  
  const exercises = verbConjugationExercises[selectedDifficulty];
  const selectedExercise = selectedExerciseId 
    ? exercises.find(ex => ex.id === selectedExerciseId)
    : null;
  
  const handleExerciseComplete = (score: number) => {
    // In a real app, this would save progress to the user's profile
    console.log(`Exercise completed with score: ${score}%`);
    
    // After a short delay, select a new exercise
    setTimeout(() => {
      setSelectedExerciseId(null);
    }, 3000);
  };
  
  return (
    <>
      <Head>
        <title>Verb Conjugation Practice | French Tutor AI</title>
        <meta name="description" content="Practice French verb conjugations with interactive exercises" />
      </Head>
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">Verb Conjugation Practice</h1>
          <p className="text-lg text-gray-600">
            Master French verb conjugations by practicing with our interactive exercises. Choose a difficulty level and verb to get started.
          </p>
        </div>
        
        {!isAuthenticated && (
          <div className="p-4 mb-8 border rounded-lg bg-amber-50 border-amber-200">
            <p className="text-amber-700">
              <strong>Note:</strong> Sign in to track your progress and access more verb conjugation exercises.
            </p>
          </div>
        )}
        
        <div className="mb-6">
          <h2 className="mb-3 text-xl font-semibold text-gray-800">Select Difficulty Level</h2>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={selectedDifficulty === 'beginner' ? 'default' : 'outline'}
              onClick={() => {
                setSelectedDifficulty('beginner');
                setSelectedExerciseId(null);
              }}
            >
              Beginner
            </Button>
            <Button 
              variant={selectedDifficulty === 'intermediate' ? 'default' : 'outline'}
              onClick={() => {
                setSelectedDifficulty('intermediate');
                setSelectedExerciseId(null);
              }}
            >
              Intermediate
            </Button>
            <Button 
              variant={selectedDifficulty === 'advanced' ? 'default' : 'outline'}
              onClick={() => {
                setSelectedDifficulty('advanced');
                setSelectedExerciseId(null);
              }}
            >
              Advanced
            </Button>
          </div>
        </div>
        
        {!selectedExercise ? (
          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-800">Available Exercises</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {exercises.map((exercise) => (
                <div 
                  key={exercise.id} 
                  className="transition-shadow cursor-pointer hover:shadow-md"
                  onClick={() => setSelectedExerciseId(exercise.id)}
                >
                  <Card>
                    <div className="p-4">
                      <h3 className="mb-1 text-lg font-medium text-gray-800">
                        {exercise.verb} - {exercise.tense}
                      </h3>
                      <p className="mb-3 text-sm text-gray-500">
                        {exercise.description.substring(0, 100)}
                        {exercise.description.length > 100 ? '...' : ''}
                      </p>
                      <Button size="sm">
                        Start Practice
                      </Button>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <VerbConjugation
            verb={selectedExercise.verb}
            tense={selectedExercise.tense}
            description={selectedExercise.description}
            conjugations={selectedExercise.conjugations}
            irregularNotes={selectedExercise.irregularNotes}
            examples={selectedExercise.examples}
            onComplete={handleExerciseComplete}
          />
        )}
        
        <div className="p-6 mt-12 border border-blue-200 rounded-lg bg-blue-50">
          <h2 className="mb-3 text-xl font-semibold text-blue-800">Conjugation Tips</h2>
          <ul className="space-y-2 text-blue-700 list-disc list-inside">
            <li>For regular -ER verbs, remove the -er ending and add the appropriate ending (-e, -es, -e, -ons, -ez, -ent).</li>
            <li>For regular -IR verbs, remove the -ir ending and add -is, -is, -it, -issons, -issez, -issent.</li>
            <li>For regular -RE verbs, remove the -re ending and add -s, -s, -, -ons, -ez, -ent.</li>
            <li>Irregular verbs don&apos;t follow these patterns and need to be memorized individually.</li>
            <li>Pay attention to the subject pronoun as it determines the verb ending.</li>
          </ul>
        </div>
      </div>
    </>
  );
} 