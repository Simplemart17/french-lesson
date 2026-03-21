import { useState } from 'react';
import Head from 'next/head';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import ConversationPractice from '@/components/features/ConversationPractice';
import { useAuth } from '@/context/AuthContext';

// Sample conversation scenarios
const conversationScenarios = [
  {
    id: '1',
    title: 'At a Café',
    description: 'Practice ordering food and drinks at a French café',
    difficulty: 'beginner' as const,
    initialMessage: 'Bonjour! Bienvenue au Café Parisien. Qu\'est-ce que vous voulez commander aujourd\'hui?',
    possibleResponses: [
      {
        userInput: 'café',
        botReply: 'Un café? Bien sûr. Voulez-vous un café noir ou un café au lait?'
      },
      {
        userInput: 'croissant',
        botReply: 'Un croissant, excellent choix! Voulez-vous autre chose avec ça?'
      },
      {
        userInput: 'l\'addition',
        botReply: 'Voici l\'addition. Ça fait 5 euros 50, s\'il vous plaît.'
      },
      {
        userInput: 'merci',
        botReply: 'Je vous en prie. Passez une bonne journée!'
      }
    ]
  },
  {
    id: '2',
    title: 'Meeting Someone New',
    description: 'Practice introducing yourself and making small talk',
    difficulty: 'beginner' as const,
    initialMessage: 'Bonjour! Je m\'appelle Marie. Comment vous appelez-vous?',
    possibleResponses: [
      {
        userInput: 'Je m\'appelle',
        botReply: 'Enchanté(e) de faire votre connaissance! Vous venez d\'où?'
      },
      {
        userInput: 'd\'où',
        botReply: 'C\'est intéressant! Moi, je viens de Lyon. Qu\'est-ce que vous faites dans la vie?'
      },
      {
        userInput: 'étudiant',
        botReply: 'Ah, vous êtes étudiant(e)! Qu\'est-ce que vous étudiez?'
      },
      {
        userInput: 'travaille',
        botReply: 'C\'est un bon métier! Depuis combien de temps faites-vous ce travail?'
      }
    ]
  },
  {
    id: '3',
    title: 'Asking for Directions',
    description: 'Practice asking for and understanding directions in French',
    difficulty: 'intermediate' as const,
    initialMessage: 'Bonjour! Puis-je vous aider?',
    possibleResponses: [
      {
        userInput: 'musée',
        botReply: 'Le musée du Louvre? Bien sûr. Continuez tout droit sur cette rue, puis tournez à gauche au deuxième feu. Le musée sera sur votre droite après environ 200 mètres.'
      },
      {
        userInput: 'gare',
        botReply: 'La gare? C\'est assez loin d\'ici. Je vous conseille de prendre le métro. La station la plus proche est à deux minutes à pied, juste au coin de la rue.'
      },
      {
        userInput: 'restaurant',
        botReply: 'Il y a un très bon restaurant français juste à côté. Sortez d\'ici, tournez à droite et c\'est le bâtiment avec la façade rouge.'
      },
      {
        userInput: 'merci',
        botReply: 'Je vous en prie. Bonne journée!'
      }
    ]
  },
  {
    id: '4',
    title: 'Making Plans',
    description: 'Practice suggesting activities and making plans with friends',
    difficulty: 'intermediate' as const,
    initialMessage: 'Salut! Qu\'est-ce que tu veux faire ce weekend?',
    possibleResponses: [
      {
        userInput: 'cinéma',
        botReply: 'Bonne idée! Il y a un nouveau film français qui passe au cinéma du centre-ville. On pourrait y aller samedi soir?'
      },
      {
        userInput: 'restaurant',
        botReply: 'J\'adore l\'idée d\'aller au restaurant! Tu préfères la cuisine française ou quelque chose de différent?'
      },
      {
        userInput: 'parc',
        botReply: 'Une promenade dans le parc serait agréable, surtout s\'il fait beau. On pourrait faire un pique-nique aussi!'
      },
      {
        userInput: 'musée',
        botReply: 'Il y a une nouvelle exposition au musée d\'art moderne. Ça t\'intéresse?'
      }
    ]
  },
  {
    id: '5',
    title: 'Job Interview',
    description: 'Practice for a job interview in French',
    difficulty: 'advanced' as const,
    initialMessage: 'Bonjour, merci d\'être venu aujourd\'hui. Pourriez-vous vous présenter et me parler de votre expérience professionnelle?',
    possibleResponses: [
      {
        userInput: 'expérience',
        botReply: 'Votre expérience est impressionnante. Quelles sont vos principales compétences qui correspondent à ce poste?'
      },
      {
        userInput: 'compétences',
        botReply: 'Très bien. Et pourquoi voulez-vous travailler dans notre entreprise spécifiquement?'
      },
      {
        userInput: 'entreprise',
        botReply: 'Je comprends. Quels sont vos objectifs professionnels à long terme?'
      },
      {
        userInput: 'objectifs',
        botReply: 'Merci pour ces précisions. Avez-vous des questions concernant le poste ou l\'entreprise?'
      }
    ]
  }
];

export default function ConversationPage() {
  const { isAuthenticated } = useAuth();
  const [selectedScenario, setSelectedScenario] = useState<typeof conversationScenarios[0] | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  
  // Filter scenarios based on selected difficulty
  const filteredScenarios = selectedDifficulty === 'all' 
    ? conversationScenarios 
    : conversationScenarios.filter(scenario => scenario.difficulty === selectedDifficulty);
  
  const handleScenarioComplete = (messages: Array<{ role: string; content: string; timestamp: Date }>) => {
    // In a real app, this would save the conversation history and update user progress.
    void messages;
  };
  
  return (
    <ProtectedRoute>
      <Head>
        <title>Conversation Practice | French Tutor AI</title>
        <meta name="description" content="Practice French conversation with interactive scenarios" />
      </Head>
      
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">Conversation Practice</h1>
          <p className="text-lg text-gray-600">
            Practice your French conversation skills with interactive scenarios. Speak or type your responses to engage in realistic conversations.
          </p>
        </div>
        
        {selectedScenario ? (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="outline" 
                onClick={() => setSelectedScenario(null)}
                className="flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Scenarios
              </Button>
              
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedScenario.difficulty === 'beginner' 
                  ? 'bg-green-100 text-green-800' 
                  : selectedScenario.difficulty === 'intermediate'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
              }`}>
                {selectedScenario.difficulty.charAt(0).toUpperCase() + selectedScenario.difficulty.slice(1)}
              </div>
            </div>
            
            <div className="h-[600px]">
              <ConversationPractice 
                scenario={selectedScenario}
                onComplete={handleScenarioComplete}
              />
            </div>
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
            
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">Available Scenarios</h2>
            
            <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2 lg:grid-cols-3">
              {filteredScenarios.map((scenario) => (
                <Card key={scenario.id} className="h-full transition-shadow hover:shadow-lg">
                  <div className="flex flex-col h-full p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">{scenario.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        scenario.difficulty === 'beginner' 
                          ? 'bg-green-100 text-green-800' 
                          : scenario.difficulty === 'intermediate'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {scenario.difficulty.charAt(0).toUpperCase() + scenario.difficulty.slice(1)}
                      </span>
                    </div>
                    
                    <p className="flex-grow mb-6 text-gray-600">{scenario.description}</p>
                    
                    <div className="mt-auto">
                      <Button 
                        onClick={() => setSelectedScenario(scenario)}
                        className="w-full"
                      >
                        Start Conversation
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
                      Sign up to save your conversation history, track your progress, and unlock more advanced scenarios.
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
              <h2 className="mb-4 text-xl font-semibold text-gray-800">Tips for Effective Conversation Practice</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-medium text-gray-800">Speaking Tips</h3>
                  <ul className="space-y-1 text-gray-600 list-disc list-inside">
                    <li>Speak clearly and at a moderate pace</li>
                    <li>Don&apos;t worry about making mistakes - it&apos;s part of learning</li>
                    <li>Try to use complete sentences</li>
                    <li>Practice common phrases and expressions</li>
                    <li>Record yourself to hear your pronunciation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 font-medium text-gray-800">Listening Tips</h3>
                  <ul className="space-y-1 text-gray-600 list-disc list-inside">
                    <li>Focus on understanding the main idea first</li>
                    <li>Use the translation feature when needed</li>
                    <li>Listen for familiar words and phrases</li>
                    <li>Pay attention to intonation and rhythm</li>
                    <li>Repeat what you hear to improve pronunciation</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
