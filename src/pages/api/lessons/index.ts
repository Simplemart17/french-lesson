import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, Lesson } from '@/types/api';
import { isAuthenticated, getUserId } from '@/utils/auth';
import { prisma } from '@/lib/prisma';

// Mock lessons data
const lessonsData: Lesson[] = [
  {
    id: 1,
    title: 'Basic Greetings in French',
    description: 'Learn essential greetings and introductions in French to start conversations confidently.',
    level: 'A1',
    duration: 15,
    topics: ['Greetings', 'Conversation', 'Basics'],
    content: {
      sections: [
        {
          type: 'text',
          title: 'Introduction',
          content: 'Welcome to your first French lesson! In this lesson, you\'ll learn the most common greetings in French. Being able to greet people properly is essential for any conversation. Let\'s start with the basics.'
        },
        {
          type: 'vocabulary',
          title: 'Key Vocabulary',
          words: [
            { word: 'Bonjour', translation: 'Hello / Good day', notes: 'Used during the day until evening' },
            { word: 'Bonsoir', translation: 'Good evening', notes: 'Used in the evening' },
            { word: 'Salut', translation: 'Hi / Bye', notes: 'Informal greeting used among friends' },
            { word: 'Au revoir', translation: 'Goodbye', notes: 'Formal way to say goodbye' },
            { word: 'À bientôt', translation: 'See you soon', notes: 'Informal way to say goodbye' }
          ]
        },
        {
          type: 'audio',
          title: 'Pronunciation',
          audioUrl: '/audio/lesson1-greetings.mp3',
          transcript: 'Bonjour! Comment allez-vous? Je m\'appelle Marie. Enchanté!'
        },
        {
          type: 'exercise',
          title: 'Practice',
          questions: [
            {
              type: 'multiple-choice',
              question: 'How do you say "Hello" in French?',
              options: ['Bonjour', 'Au revoir', 'Merci', 'S\'il vous plaît'],
              correctAnswer: 'Bonjour'
            },
            {
              type: 'multiple-choice',
              question: 'Which greeting would you use in the evening?',
              options: ['Bonjour', 'Bonsoir', 'Salut', 'À bientôt'],
              correctAnswer: 'Bonsoir'
            }
          ]
        }
      ]
    }
  },
  {
    id: 2,
    title: 'Common French Phrases',
    description: 'Essential phrases to help you navigate basic conversations in French.',
    level: 'A1',
    duration: 25,
    topics: ['Phrases', 'Conversation', 'Basics'],
    content: {
      sections: [
        {
          type: 'text',
          title: 'Essential Phrases',
          content: 'In this lesson, you\'ll learn some essential French phrases that will help you in everyday situations. These phrases are useful for basic communication and will help you navigate simple conversations.'
        },
        {
          type: 'vocabulary',
          title: 'Key Phrases',
          words: [
            { word: 'Comment allez-vous?', translation: 'How are you? (formal)', notes: 'Used in formal situations' },
            { word: 'Comment ça va?', translation: 'How are you? (informal)', notes: 'Used among friends' },
            { word: 'Je m\'appelle...', translation: 'My name is...', notes: 'Used when introducing yourself' },
            { word: 'Enchanté(e)', translation: 'Nice to meet you', notes: 'Add "e" if you are female' },
            { word: 'S\'il vous plaît', translation: 'Please (formal)', notes: 'Used in formal situations' },
            { word: 'Merci', translation: 'Thank you', notes: 'Used in all situations' },
            { word: 'De rien', translation: 'You\'re welcome', notes: 'Response to "merci"' }
          ]
        },
        {
          type: 'video',
          title: 'Using Phrases in Conversation',
          videoUrl: '/videos/lesson2-phrases.mp4',
          transcript: 'Bonjour! Comment allez-vous? Je m\'appelle Marie. Enchanté!'
        }
      ]
    }
  },
  {
    id: 3,
    title: 'Numbers and Counting in French',
    description: 'Learn to count and use numbers in French for shopping, telling time, and more.',
    level: 'A1',
    duration: 20,
    topics: ['Numbers', 'Basics'],
    content: {
      sections: [
        {
          type: 'text',
          title: 'Introduction to Numbers',
          content: 'In this lesson, you\'ll learn how to count in French from 1 to 100. Numbers are essential for many everyday situations like shopping, telling time, and giving your phone number.'
        },
        {
          type: 'vocabulary',
          title: 'Numbers 1-10',
          words: [
            { word: 'Un', translation: '1', notes: 'Pronounced "ahn"' },
            { word: 'Deux', translation: '2', notes: 'Pronounced "duh"' },
            { word: 'Trois', translation: '3', notes: 'Pronounced "twah"' },
            { word: 'Quatre', translation: '4', notes: 'Pronounced "katr"' },
            { word: 'Cinq', translation: '5', notes: 'Pronounced "sank"' },
            { word: 'Six', translation: '6', notes: 'Pronounced "sees"' },
            { word: 'Sept', translation: '7', notes: 'Pronounced "set"' },
            { word: 'Huit', translation: '8', notes: 'Pronounced "weet"' },
            { word: 'Neuf', translation: '9', notes: 'Pronounced "nuhf"' },
            { word: 'Dix', translation: '10', notes: 'Pronounced "dees"' }
          ]
        },
        {
          type: 'audio',
          title: 'Pronunciation of Numbers',
          audioUrl: '/audio/lesson3-numbers.mp3',
          transcript: 'Un, deux, trois, quatre, cinq, six, sept, huit, neuf, dix.'
        }
      ]
    }
  },
  {
    id: 4,
    title: 'Ordering Food and Drinks',
    description: 'Learn how to order food and drinks in French restaurants and cafés.',
    level: 'A2',
    duration: 30,
    topics: ['Food', 'Restaurant', 'Conversation'],
    content: {
      sections: [
        {
          type: 'text',
          title: 'Introduction',
          content: 'In this lesson, you\'ll learn how to order food and drinks in French restaurants and cafés. You\'ll learn vocabulary related to food and drinks, as well as useful phrases for ordering and paying.'
        },
        {
          type: 'vocabulary',
          title: 'Restaurant Vocabulary',
          words: [
            { word: 'Le menu', translation: 'Menu', notes: 'Pronounced "luh men-u"' },
            { word: 'La carte', translation: 'Menu card', notes: 'More detailed than "le menu"' },
            { word: 'Le serveur / La serveuse', translation: 'Waiter / Waitress', notes: 'Person who takes your order' },
            { word: 'Une table pour deux', translation: 'A table for two', notes: 'Requesting a table' },
            { word: 'L\'addition', translation: 'The bill', notes: 'What you ask for when you want to pay' }
          ]
        },
        {
          type: 'dialogue',
          title: 'At the Restaurant',
          content: 'Serveur: Bonjour, bienvenue au Café Parisien. Une table pour combien de personnes?\nClient: Bonjour, une table pour deux, s\'il vous plaît.\nServeur: Par ici, s\'il vous plaît. Voici la carte.\nClient: Merci. Je voudrais un café, s\'il vous plaît.\nServeur: Un café, très bien. Et pour vous, madame?\nCliente: Je voudrais un thé, s\'il vous plaît.\nServeur: Un café et un thé. Je vous apporte ça tout de suite.'
        }
      ]
    }
  },
  {
    id: 5,
    title: 'Asking for Directions',
    description: 'Learn how to ask for and understand directions in French.',
    level: 'A2',
    duration: 25,
    topics: ['Travel', 'Conversation', 'City'],
    content: {
      sections: [
        {
          type: 'text',
          title: 'Introduction',
          content: 'In this lesson, you\'ll learn how to ask for and understand directions in French. This is essential for navigating in French-speaking countries.'
        },
        {
          type: 'vocabulary',
          title: 'Direction Vocabulary',
          words: [
            { word: 'Où est...?', translation: 'Where is...?', notes: 'Basic question for locations' },
            { word: 'À droite', translation: 'To the right', notes: 'Direction' },
            { word: 'À gauche', translation: 'To the left', notes: 'Direction' },
            { word: 'Tout droit', translation: 'Straight ahead', notes: 'Direction' },
            { word: 'Au coin', translation: 'At the corner', notes: 'Location' },
            { word: 'La rue', translation: 'The street', notes: 'Location' },
            { word: 'Le carrefour', translation: 'The intersection', notes: 'Location' }
          ]
        },
        {
          type: 'dialogue',
          title: 'Asking for Directions',
          content: 'Touriste: Excusez-moi, où est la gare, s\'il vous plaît?\nPassant: La gare? C\'est facile. Allez tout droit, puis prenez la deuxième rue à droite. La gare est au bout de la rue.\nTouriste: Merci beaucoup!\nPassant: Je vous en prie.'
        }
      ]
    }
  }
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Lesson[] | Lesson>>
) {
  // GET request to retrieve lessons
  if (req.method === 'GET') {
    try {
      const { level, topic } = req.query;
      let filteredLessons = [...lessonsData];

      // Filter by level if provided
      if (level) {
        filteredLessons = filteredLessons.filter(lesson => lesson.level === level);
      }

      // Filter by topic if provided
      if (topic) {
        filteredLessons = filteredLessons.filter(lesson => 
          lesson.topics.some(t => t.toLowerCase() === (topic as string).toLowerCase())
        );
      }

      return res.status(200).json({
        success: true,
        data: filteredLessons
      });
    } catch (error) {
      console.error('Error fetching lessons:', error);
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
