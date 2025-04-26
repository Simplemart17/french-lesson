import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { isAuthenticated, getUserId } from '@/utils/auth';
import { prisma } from '@/lib/prisma';

// Define the listening exercise types
interface DictationExercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  audioUrl: string;
  text: string;
  type: 'dictation';
}

interface ComprehensionExercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  audioUrl: string;
  transcript: string;
  questions: {
    id: string;
    text: string;
    options: string[];
    correctAnswer: string;
  }[];
  type: 'comprehension';
}

type ListeningExercise = DictationExercise | ComprehensionExercise;

// Mock dictation exercises
const dictationExercises: DictationExercise[] = [
  {
    id: 'dict-1',
    title: 'Basic Greetings',
    description: 'Practice listening to common French greetings',
    difficulty: 'beginner',
    audioUrl: '/audio/greetings.mp3',
    text: 'Bonjour, comment allez-vous aujourd\'hui?',
    type: 'dictation'
  },
  {
    id: 'dict-2',
    title: 'Daily Activities',
    description: 'Practice listening to sentences about daily routines',
    difficulty: 'beginner',
    audioUrl: '/audio/daily-activities.mp3',
    text: 'Je me lève à sept heures et je prends mon petit déjeuner.',
    type: 'dictation'
  },
  {
    id: 'dict-3',
    title: 'Weather Expressions',
    description: 'Practice listening to sentences about weather',
    difficulty: 'beginner',
    audioUrl: '/audio/weather.mp3',
    text: 'Aujourd\'hui, il fait beau et chaud. Le ciel est bleu et il y a du soleil.',
    type: 'dictation'
  },
  {
    id: 'dict-4',
    title: 'Restaurant Dialogue',
    description: 'Practice listening to a dialogue at a restaurant',
    difficulty: 'intermediate',
    audioUrl: '/audio/restaurant-dialogue.mp3',
    text: 'Serveur: Bonjour, qu\'est-ce que je vous sers? Client: Je voudrais un café et un croissant, s\'il vous plaît.',
    type: 'dictation'
  },
  {
    id: 'dict-5',
    title: 'Travel Plans',
    description: 'Practice listening to sentences about travel plans',
    difficulty: 'intermediate',
    audioUrl: '/audio/travel-plans.mp3',
    text: 'Nous allons voyager en France l\'été prochain. Nous visiterons Paris, Lyon et Nice pendant deux semaines.',
    type: 'dictation'
  },
  {
    id: 'dict-6',
    title: 'Professional Conversation',
    description: 'Practice listening to a professional conversation',
    difficulty: 'advanced',
    audioUrl: '/audio/professional-conversation.mp3',
    text: 'Nous devons finaliser le rapport avant la réunion de demain. Pouvez-vous me l\'envoyer par email dès que possible?',
    type: 'dictation'
  }
];

// Mock comprehension exercises
const comprehensionExercises: ComprehensionExercise[] = [
  {
    id: 'comp-1',
    title: 'At the Café',
    description: 'Listen to a conversation at a café and answer questions',
    difficulty: 'beginner',
    audioUrl: '/audio/cafe-conversation.mp3',
    transcript: 'Serveur: Bonjour, qu\'est-ce que je vous sers?\nClient: Bonjour, je voudrais un café, s\'il vous plaît.\nServeur: Un café noir?\nClient: Oui, et aussi un croissant.\nServeur: Très bien. Ce sera tout?\nClient: Oui, merci. C\'est combien?\nServeur: Ça fait 5 euros 50, s\'il vous plaît.',
    questions: [
      {
        id: 'comp-1-q1',
        text: 'What does the customer order?',
        options: ['A coffee and a croissant', 'A tea and a sandwich', 'A coffee and a sandwich', 'A tea and a croissant'],
        correctAnswer: 'A coffee and a croissant'
      },
      {
        id: 'comp-1-q2',
        text: 'How much does the order cost?',
        options: ['4 euros 50', '5 euros', '5 euros 50', '6 euros'],
        correctAnswer: '5 euros 50'
      }
    ],
    type: 'comprehension'
  },
  {
    id: 'comp-2',
    title: 'Making Plans',
    description: 'Listen to friends making plans and answer questions',
    difficulty: 'beginner',
    audioUrl: '/audio/making-plans.mp3',
    transcript: 'Marie: Salut Pierre! Qu\'est-ce que tu fais ce weekend?\nPierre: Salut Marie! Je ne sais pas encore. Tu as des idées?\nMarie: On pourrait aller au cinéma samedi soir. Il y a un nouveau film français.\nPierre: Bonne idée! À quelle heure?\nMarie: La séance est à 20h. On pourrait dîner avant, vers 18h30?\nPierre: D\'accord. On se retrouve devant le restaurant italien près du cinéma?\nMarie: Parfait! À samedi alors.',
    questions: [
      {
        id: 'comp-2-q1',
        text: 'What are Marie and Pierre planning to do on Saturday?',
        options: ['Go to a restaurant', 'Go to the cinema', 'Go to a concert', 'Go to a museum'],
        correctAnswer: 'Go to the cinema'
      },
      {
        id: 'comp-2-q2',
        text: 'What time is the movie?',
        options: ['18h30', '19h', '19h30', '20h'],
        correctAnswer: '20h'
      },
      {
        id: 'comp-2-q3',
        text: 'Where are they meeting?',
        options: ['At the cinema', 'At Marie\'s house', 'At the Italian restaurant', 'At the train station'],
        correctAnswer: 'At the Italian restaurant'
      }
    ],
    type: 'comprehension'
  },
  {
    id: 'comp-3',
    title: 'Weather Forecast',
    description: 'Listen to a weather forecast and answer questions',
    difficulty: 'intermediate',
    audioUrl: '/audio/weather-forecast.mp3',
    transcript: 'Bonjour à tous. Voici les prévisions météo pour demain. Le matin, il fera frais avec des températures autour de 10 degrés. Dans l\'après-midi, le temps sera ensoleillé avec des températures qui monteront jusqu\'à 22 degrés. En soirée, nous attendons quelques nuages et peut-être de la pluie dans le nord du pays. Les températures descendront à 15 degrés. Bon weekend à tous!',
    questions: [
      {
        id: 'comp-3-q1',
        text: 'What will the weather be like in the morning?',
        options: ['Warm', 'Cool', 'Rainy', 'Snowy'],
        correctAnswer: 'Cool'
      },
      {
        id: 'comp-3-q2',
        text: 'What is the maximum temperature expected for the day?',
        options: ['10 degrees', '15 degrees', '20 degrees', '22 degrees'],
        correctAnswer: '22 degrees'
      },
      {
        id: 'comp-3-q3',
        text: 'What weather is expected in the evening in the north?',
        options: ['Sun', 'Clouds and possibly rain', 'Snow', 'Strong winds'],
        correctAnswer: 'Clouds and possibly rain'
      }
    ],
    type: 'comprehension'
  },
  {
    id: 'comp-4',
    title: 'Job Interview',
    description: 'Listen to a job interview and answer questions',
    difficulty: 'advanced',
    audioUrl: '/audio/job-interview.mp3',
    transcript: 'Recruteur: Bonjour Madame Dubois. Merci d\'être venue aujourd\'hui. Pouvez-vous me parler de votre expérience professionnelle?\nCandidate: Bonjour. Bien sûr. J\'ai travaillé pendant cinq ans comme responsable marketing chez ABC Company. J\'étais en charge d\'une équipe de six personnes et nous avons développé plusieurs campagnes publicitaires réussies.\nRecruteur: Très intéressant. Et pourquoi souhaitez-vous rejoindre notre entreprise?\nCandidate: Votre entreprise est leader dans son domaine et j\'admire votre approche innovante. Je pense que mes compétences en marketing digital pourraient être très utiles pour développer votre présence en ligne.\nRecruteur: Quelles sont vos principales qualités professionnelles?\nCandidate: Je suis organisée, créative et j\'ai un bon esprit d\'équipe. J\'aime trouver des solutions originales aux problèmes et motiver mon équipe pour atteindre nos objectifs.',
    questions: [
      {
        id: 'comp-4-q1',
        text: 'What was the candidate\'s previous job?',
        options: ['Sales Manager', 'Marketing Manager', 'HR Manager', 'Project Manager'],
        correctAnswer: 'Marketing Manager'
      },
      {
        id: 'comp-4-q2',
        text: 'How many people did the candidate manage in her previous job?',
        options: ['Four', 'Five', 'Six', 'Seven'],
        correctAnswer: 'Six'
      },
      {
        id: 'comp-4-q3',
        text: 'Why does the candidate want to join the company?',
        options: ['For a better salary', 'Because it\'s a leader in its field', 'To work fewer hours', 'To work from home'],
        correctAnswer: 'Because it\'s a leader in its field'
      },
      {
        id: 'comp-4-q4',
        text: 'Which of these is NOT mentioned as one of the candidate\'s professional qualities?',
        options: ['Organized', 'Creative', 'Team spirit', 'Punctual'],
        correctAnswer: 'Punctual'
      }
    ],
    type: 'comprehension'
  }
];

// Combine all exercises
const allExercises: ListeningExercise[] = [...dictationExercises, ...comprehensionExercises];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ListeningExercise[] | ListeningExercise>>
) {
  // GET request to retrieve listening exercises
  if (req.method === 'GET') {
    try {
      const { id, type, difficulty } = req.query;
      
      // If ID is provided, return that specific exercise
      if (id) {
        const exercise = allExercises.find(ex => ex.id === id);
        
        if (!exercise) {
          return res.status(404).json({
            success: false,
            error: {
              message: 'Exercise not found'
            }
          });
        }
        
        return res.status(200).json({
          success: true,
          data: exercise
        });
      }
      
      // Filter exercises based on query parameters
      let filteredExercises = [...allExercises];
      
      // Filter by type if provided
      if (type === 'dictation') {
        filteredExercises = dictationExercises;
      } else if (type === 'comprehension') {
        filteredExercises = comprehensionExercises;
      }
      
      // Filter by difficulty if provided
      if (difficulty) {
        filteredExercises = filteredExercises.filter(
          ex => ex.difficulty === difficulty
        );
      }
      
      return res.status(200).json({
        success: true,
        data: filteredExercises
      });
    } catch (error) {
      console.error('Error fetching listening exercises:', error);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error'
        }
      });
    }
  }
  
  // Method not allowed
  return res.status(405).json({
    success: false,
    error: {
      message: 'Method not allowed'
    }
  });
}
