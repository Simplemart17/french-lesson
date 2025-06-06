import { useState } from 'react';
import Head from 'next/head';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import ExamSimulation, { ExamResult } from '@/components/features/ExamSimulation';
import { useAuth } from '@/context/AuthContext';

// Sample exam questions
const sampleExamQuestions = [
  {
    id: '1',
    type: 'multiple-choice' as const,
    question: 'Quelle est la capitale de la France?',
    options: ['Paris', 'Lyon', 'Marseille', 'Bordeaux'],
    correctAnswer: 'Paris',
    explanation: 'Paris est la capitale de la France depuis le 10ème siècle.',
    category: 'comprehension' as const,
    difficulty: 'beginner' as const
  },
  {
    id: '2',
    type: 'fill-in-blank' as const,
    question: 'Complétez la phrase: "Je _____ étudiant."',
    correctAnswer: 'suis',
    explanation: 'Le verbe "être" conjugué à la première personne du singulier est "suis".',
    category: 'grammar' as const,
    difficulty: 'beginner' as const
  },
  {
    id: '3',
    type: 'multiple-choice' as const,
    question: 'Quel est le synonyme de "content"?',
    options: ['Triste', 'Heureux', 'Fatigué', 'Énervé'],
    correctAnswer: 'Heureux',
    explanation: '"Content" et "heureux" sont des synonymes qui expriment un sentiment de joie ou de satisfaction.',
    category: 'vocabulary' as const,
    difficulty: 'beginner' as const
  },
  {
    id: '4',
    type: 'true-false' as const,
    question: 'Le verbe "aller" est un verbe régulier.',
    correctAnswer: 'False',
    explanation: 'Le verbe "aller" est un verbe irrégulier en français.',
    category: 'grammar' as const,
    difficulty: 'beginner' as const
  },
  {
    id: '5',
    type: 'multiple-choice' as const,
    question: 'Quelle est la bonne traduction de "I have been living in France for 3 years"?',
    options: [
      'Je vis en France depuis 3 ans',
      'Je vivais en France pendant 3 ans',
      'J\'ai vécu en France pour 3 ans',
      'Je vais vivre en France pour 3 ans'
    ],
    correctAnswer: 'Je vis en France depuis 3 ans',
    explanation: 'En français, on utilise le présent avec "depuis" pour exprimer une action qui a commencé dans le passé et qui continue dans le présent.',
    category: 'grammar' as const,
    difficulty: 'intermediate' as const
  },
  {
    id: '6',
    type: 'fill-in-blank' as const,
    question: 'Complétez avec le bon article: "_____ hôpital est à côté de la pharmacie."',
    correctAnswer: 'L\'',
    explanation: 'Devant un mot commençant par une voyelle ou un h muet, on utilise l\'article élidé "l\'".',
    category: 'grammar' as const,
    difficulty: 'beginner' as const
  },
  {
    id: '7',
    type: 'multiple-choice' as const,
    question: 'Quel temps verbal est utilisé dans la phrase: "Si j\'avais su, je ne serais pas venu."?',
    options: [
      'Présent et futur simple',
      'Imparfait et conditionnel présent',
      'Plus-que-parfait et conditionnel passé',
      'Passé composé et conditionnel présent'
    ],
    correctAnswer: 'Plus-que-parfait et conditionnel passé',
    explanation: 'Cette phrase exprime une condition irréelle dans le passé, utilisant le plus-que-parfait ("j\'avais su") dans la condition et le conditionnel passé ("je ne serais pas venu") dans la conséquence.',
    category: 'grammar' as const,
    difficulty: 'advanced' as const
  },
  {
    id: '8',
    type: 'multiple-choice' as const,
    question: 'Que signifie l\'expression "avoir le cafard"?',
    options: [
      'Être en colère',
      'Être déprimé',
      'Être fatigué',
      'Être malade'
    ],
    correctAnswer: 'Être déprimé',
    explanation: 'L\'expression "avoir le cafard" est une expression familière qui signifie être triste ou déprimé.',
    category: 'vocabulary' as const,
    difficulty: 'intermediate' as const
  },
  {
    id: '9',
    type: 'fill-in-blank' as const,
    question: 'Complétez avec le pronom relatif correct: "C\'est le livre _____ je t\'ai parlé."',
    correctAnswer: 'dont',
    explanation: 'On utilise "dont" comme pronom relatif après les verbes suivis de la préposition "de", comme "parler de".',
    category: 'grammar' as const,
    difficulty: 'intermediate' as const
  },
  {
    id: '10',
    type: 'true-false' as const,
    question: 'La phrase "Je me suis lavé les mains" est correcte.',
    correctAnswer: 'True',
    explanation: 'Cette phrase utilise correctement le verbe pronominal "se laver" au passé composé avec l\'accord du participe passé.',
    category: 'grammar' as const,
    difficulty: 'intermediate' as const
  }
];

// TCF exam questions (more formal and structured)
const tcfExamQuestions = [
  {
    id: 'tcf1',
    type: 'multiple-choice' as const,
    question: 'Écoutez l\'audio et choisissez la réponse qui correspond à ce que vous avez entendu: "Le train pour Paris partira à 15h30 du quai numéro 7."',
    options: [
      'Le train part à 15h30 du quai 5',
      'Le train part à 15h30 du quai 7',
      'Le train part à 13h50 du quai 7',
      'Le train part à 15h30 du quai 17'
    ],
    correctAnswer: 'Le train part à 15h30 du quai 7',
    explanation: 'L\'audio indique clairement que le train pour Paris partira à 15h30 du quai numéro 7.',
    category: 'comprehension' as const,
    difficulty: 'beginner' as const
  },
  {
    id: 'tcf2',
    type: 'multiple-choice' as const,
    question: 'Complétez la phrase: "Si vous _____ à l\'heure, nous n\'aurions pas manqué le début du film."',
    options: [
      'étiez arrivé',
      'arriviez',
      'êtes arrivé',
      'arriveriez'
    ],
    correctAnswer: 'étiez arrivé',
    explanation: 'Dans une phrase conditionnelle au passé (irréel du passé), on utilise le plus-que-parfait dans la proposition introduite par "si".',
    category: 'grammar' as const,
    difficulty: 'advanced' as const
  },
  {
    id: 'tcf3',
    type: 'multiple-choice' as const,
    question: 'Lisez le texte et répondez à la question: "Selon le texte, pourquoi la consommation de produits bio a-t-elle augmenté en France?"',
    options: [
      'À cause de la baisse des prix',
      'Grâce aux subventions gouvernementales',
      'En raison d\'une prise de conscience écologique',
      'Suite à des scandales alimentaires'
    ],
    correctAnswer: 'En raison d\'une prise de conscience écologique',
    explanation: 'Le texte explique que la hausse de la consommation de produits bio est principalement due à une prise de conscience écologique des consommateurs.',
    category: 'comprehension' as const,
    difficulty: 'intermediate' as const
  },
  {
    id: 'tcf4',
    type: 'multiple-choice' as const,
    question: 'Choisissez la phrase qui contient une erreur:',
    options: [
      'Je me suis souvenu de cette histoire.',
      'Nous nous sommes parlés hier soir.',
      'Elle s\'est lavé les mains.',
      'Ils se sont rencontrés à Paris.'
    ],
    correctAnswer: 'Nous nous sommes parlés hier soir.',
    explanation: 'La phrase correcte serait "Nous nous sommes parlé hier soir" (sans "s"). Le participe passé ne s\'accorde pas car "parlé" est suivi d\'un complément d\'objet indirect (à quelqu\'un).',
    category: 'grammar' as const,
    difficulty: 'advanced' as const
  },
  {
    id: 'tcf5',
    type: 'multiple-choice' as const,
    question: 'Quel est le synonyme de "néanmoins"?',
    options: [
      'Par conséquent',
      'Cependant',
      'Ainsi',
      'Également'
    ],
    correctAnswer: 'Cependant',
    explanation: '"Néanmoins" et "cependant" sont des synonymes qui expriment une opposition ou une restriction.',
    category: 'vocabulary' as const,
    difficulty: 'intermediate' as const
  },
  {
    id: 'tcf6',
    type: 'multiple-choice' as const,
    question: 'Complétez la phrase: "Je doute qu\'il _____ venir à la réunion."',
    options: [
      'peut',
      'pourra',
      'puisse',
      'pourrait'
    ],
    correctAnswer: 'puisse',
    explanation: 'Après l\'expression "je doute que", on utilise le subjonctif présent.',
    category: 'grammar' as const,
    difficulty: 'advanced' as const
  },
  {
    id: 'tcf7',
    type: 'multiple-choice' as const,
    question: 'Quelle est la fonction de "dont" dans la phrase: "C\'est le sujet dont nous avons discuté hier."?',
    options: [
      'Pronom relatif complément d\'objet direct',
      'Pronom relatif complément d\'objet indirect',
      'Pronom relatif complément du nom',
      'Pronom relatif sujet'
    ],
    correctAnswer: 'Pronom relatif complément d\'objet indirect',
    explanation: '"Dont" remplace "de ce sujet" et est complément indirect du verbe "discuter de".',
    category: 'grammar' as const,
    difficulty: 'advanced' as const
  },
  {
    id: 'tcf8',
    type: 'multiple-choice' as const,
    question: 'Dans quel contexte utiliseriez-vous l\'expression "à la bonne heure"?',
    options: [
      'Pour indiquer qu\'il est l\'heure exacte',
      'Pour exprimer sa satisfaction',
      'Pour dire qu\'on est en retard',
      'Pour fixer un rendez-vous'
    ],
    correctAnswer: 'Pour exprimer sa satisfaction',
    explanation: 'L\'expression "à la bonne heure" est utilisée pour exprimer sa satisfaction ou son approbation.',
    category: 'vocabulary' as const,
    difficulty: 'intermediate' as const
  },
  {
    id: 'tcf9',
    type: 'multiple-choice' as const,
    question: 'Quelle est la bonne réponse à la question: "Qu\'est-ce que vous feriez si vous gagniez au loto?"',
    options: [
      'J\'achète une maison',
      'J\'ai acheté une maison',
      'J\'achèterais une maison',
      'J\'avais acheté une maison'
    ],
    correctAnswer: 'J\'achèterais une maison',
    explanation: 'Pour répondre à une question au conditionnel présent, on utilise également le conditionnel présent.',
    category: 'grammar' as const,
    difficulty: 'intermediate' as const
  },
  {
    id: 'tcf10',
    type: 'multiple-choice' as const,
    question: 'Complétez le proverbe: "Qui _____ s\'instruit."',
    options: [
      'voyage',
      'lit',
      'parle',
      'écoute'
    ],
    correctAnswer: 'voyage',
    explanation: 'Le proverbe complet est "Qui voyage s\'instruit", signifiant que les voyages sont source d\'apprentissage et d\'enrichissement personnel.',
    category: 'comprehension' as const,
    difficulty: 'intermediate' as const
  }
];

// Exam types
const examTypes = [
  {
    id: 'practice',
    name: 'Practice Exam',
    description: 'A short practice exam with 10 questions to help you prepare for the TCF/TEF exams',
    duration: 15,
    questions: sampleExamQuestions
  },
  {
    id: 'tcf',
    name: 'TCF Simulation',
    description: 'A full TCF (Test de Connaissance du Français) exam simulation with formal structure',
    duration: 30,
    questions: tcfExamQuestions
  },
  {
    id: 'tef',
    name: 'TEF Simulation',
    description: 'A full TEF (Test d\'Évaluation de Français) exam simulation with formal structure',
    duration: 30,
    questions: tcfExamQuestions // Using same questions for demo
  }
];

export default function ExamPage() {
  const { isAuthenticated } = useAuth();
  const [selectedExamType, setSelectedExamType] = useState<string | null>(null);
  const [examResults, setExamResults] = useState<ExamResult | null>(null);

  // Get selected exam
  const selectedExam = examTypes.find(exam => exam.id === selectedExamType);

  // Log exam results for debugging
  console.log('Current exam results:', examResults ? 'Available' : 'None');
  
  // Handle exam completion
  const handleExamComplete = (results: ExamResult) => {
    setExamResults(results);
    
    // In a real app, this would save the results to the user's profile
    console.log('Exam completed with results:', results);
  };
  
  return (
    <>
      <Head>
        <title>French Exam Preparation | French Tutor AI</title>
        <meta name="description" content="Prepare for TCF and TEF exams with practice tests and simulations" />
      </Head>
      
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">French Exam Preparation</h1>
          <p className="text-lg text-gray-600">
            Practice for your TCF or TEF exam with our interactive simulations and practice tests.
          </p>
        </div>
        
        {selectedExam ? (
          <div className="mb-12">
            <ExamSimulation 
              questions={selectedExam.questions}
              timeLimit={selectedExam.duration}
              onComplete={handleExamComplete}
              examType={selectedExam.id as 'TCF' | 'TEF' | 'practice'}
            />
          </div>
        ) : (
          <>
            <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
              <h2 className="mb-6 text-xl font-semibold text-gray-800">Choose an Exam Type</h2>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {examTypes.map((examType) => (
                  <Card key={examType.id} className="h-full transition-shadow hover:shadow-lg">
                    <div className="flex flex-col h-full p-6">
                      <div className="mb-4">
                        <h3 className="mb-2 text-xl font-semibold text-gray-800">{examType.name}</h3>
                        <p className="text-gray-600">{examType.description}</p>
                      </div>
                      
                      <div className="flex flex-col flex-grow mt-4 space-y-3">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-2 text-primary-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">{examType.duration} minutes</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-2 text-primary-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">{examType.questions.length} questions</span>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Button 
                          onClick={() => setSelectedExamType(examType.id)}
                          className="w-full"
                        >
                          Start Exam
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-semibold text-gray-800">About TCF and TEF Exams</h2>
              
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <Card className="p-6">
                  <h3 className="mb-4 text-xl font-semibold text-gray-800">TCF (Test de Connaissance du Français)</h3>
                  <p className="mb-4 text-gray-600">
                    The TCF is a standardized test designed to assess French language proficiency for non-native speakers. It is recognized by French universities, government agencies, and employers.
                  </p>
                  
                  <h4 className="mb-2 font-medium text-gray-800">Exam Structure:</h4>
                  <ul className="pl-5 mb-4 space-y-1 text-gray-600 list-disc">
                    <li>Listening Comprehension (30 minutes)</li>
                    <li>Reading Comprehension (45 minutes)</li>
                    <li>Written Expression (60 minutes, optional)</li>
                    <li>Oral Expression (15 minutes, optional)</li>
                  </ul>
                  
                  <h4 className="mb-2 font-medium text-gray-800">Scoring:</h4>
                  <p className="text-gray-600">
                    The TCF uses a scale from A1 to C2 based on the Common European Framework of Reference for Languages (CEFR).
                  </p>
                </Card>
                
                <Card className="p-6">
                  <h3 className="mb-4 text-xl font-semibold text-gray-800">TEF (Test d&apos;Évaluation de Français)</h3>
                  <p className="mb-4 text-gray-600">
                    The TEF is a standardized test that measures French language skills for academic, professional, or immigration purposes. It is recognized by Canadian immigration authorities.
                  </p>
                  
                  <h4 className="mb-2 font-medium text-gray-800">Exam Structure:</h4>
                  <ul className="pl-5 mb-4 space-y-1 text-gray-600 list-disc">
                    <li>Listening Comprehension (40 minutes)</li>
                    <li>Reading Comprehension (60 minutes)</li>
                    <li>Written Expression (60 minutes)</li>
                    <li>Oral Expression (15 minutes)</li>
                  </ul>
                  
                  <h4 className="mb-2 font-medium text-gray-800">Scoring:</h4>
                  <p className="text-gray-600">
                    The TEF uses a scale from 0 to 699, which corresponds to CEFR levels from A1 to C2.
                  </p>
                </Card>
              </div>
            </div>
            
            <div className="p-6 mb-12 bg-white rounded-lg shadow-md">
              <h2 className="mb-6 text-xl font-semibold text-gray-800">Exam Preparation Tips</h2>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 font-medium text-gray-800">General Tips</h3>
                  <ul className="pl-5 space-y-2 text-gray-600 list-disc">
                    <li>Familiarize yourself with the exam format and timing</li>
                    <li>Practice with sample questions and past exams</li>
                    <li>Improve your vocabulary across different topics</li>
                    <li>Practice listening to French media (news, podcasts, etc.)</li>
                    <li>Read French texts regularly (newspapers, books, articles)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="mb-3 font-medium text-gray-800">Exam Day Tips</h3>
                  <ul className="pl-5 space-y-2 text-gray-600 list-disc">
                    <li>Get a good night&apos;s sleep before the exam</li>
                    <li>Arrive early to the exam center</li>
                    <li>Read instructions carefully before starting each section</li>
                    <li>Manage your time effectively during the exam</li>
                    <li>For listening sections, read questions before the audio plays</li>
                    <li>For writing sections, plan your response before writing</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {!isAuthenticated && (
              <div className="p-6 mb-8 border rounded-lg bg-primary-50 border-primary-100">
                <div className="items-center md:flex">
                  <div className="md:w-3/4">
                    <h3 className="mb-2 text-xl font-semibold text-primary-800">Create an Account to Track Your Progress</h3>
                    <p className="mb-4 text-primary-700 md:mb-0">
                      Sign up to save your exam results, track your improvement over time, and get personalized study recommendations.
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
          </>
        )}
      </div>
    </>
  );
}
