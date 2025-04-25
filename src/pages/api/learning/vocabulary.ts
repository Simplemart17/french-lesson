import type { NextApiRequest, NextApiResponse } from 'next';
import { isAuthenticated } from '../../../utils/auth';

// Mock vocabulary data organized by level and category
const vocabularyData = {
  A1: {
    greetings: [
      { french: 'Bonjour', english: 'Hello', example: 'Bonjour, comment ça va?' },
      { french: 'Au revoir', english: 'Goodbye', example: 'Au revoir, à demain!' },
      { french: 'Merci', english: 'Thank you', example: 'Merci beaucoup pour votre aide.' },
      { french: 'S\'il vous plaît', english: 'Please', example: 'Un café, s\'il vous plaît.' },
      { french: 'Excusez-moi', english: 'Excuse me', example: 'Excusez-moi, où est la gare?' }
    ],
    basics: [
      { french: 'Oui', english: 'Yes', example: 'Oui, j\'aime le français.' },
      { french: 'Non', english: 'No', example: 'Non, je ne parle pas allemand.' },
      { french: 'Je m\'appelle', english: 'My name is', example: 'Je m\'appelle Marie.' },
      { french: 'Comment allez-vous?', english: 'How are you?', example: 'Bonjour, comment allez-vous?' },
      { french: 'Je ne comprends pas', english: 'I don\'t understand', example: 'Désolé, je ne comprends pas.' }
    ]
  },
  A2: {
    food: [
      { french: 'le pain', english: 'bread', example: 'J\'aime le pain français.' },
      { french: 'le fromage', english: 'cheese', example: 'La France est connue pour son fromage.' },
      { french: 'le vin', english: 'wine', example: 'Un verre de vin rouge, s\'il vous plaît.' },
      { french: 'le restaurant', english: 'restaurant', example: 'Allons au restaurant ce soir.' },
      { french: 'le menu', english: 'menu', example: 'Puis-je voir le menu, s\'il vous plaît?' }
    ],
    travel: [
      { french: 'l\'hôtel', english: 'hotel', example: 'Nous restons dans un hôtel près de la plage.' },
      { french: 'le passeport', english: 'passport', example: 'N\'oubliez pas votre passeport.' },
      { french: 'l\'avion', english: 'airplane', example: 'L\'avion décolle à 15h.' },
      { french: 'la gare', english: 'train station', example: 'La gare est à 10 minutes à pied.' },
      { french: 'le billet', english: 'ticket', example: 'J\'ai acheté un billet de train.' }
    ]
  },
  B1: {
    work: [
      { french: 'le bureau', english: 'office', example: 'Je travaille dans un petit bureau.' },
      { french: 'la réunion', english: 'meeting', example: 'J\'ai une réunion importante demain.' },
      { french: 'le collègue', english: 'colleague', example: 'Mes collègues sont très sympathiques.' },
      { french: 'le projet', english: 'project', example: 'Nous travaillons sur un projet intéressant.' },
      { french: 'le CV', english: 'resume', example: 'J\'ai envoyé mon CV à plusieurs entreprises.' }
    ],
    emotions: [
      { french: 'heureux/heureuse', english: 'happy', example: 'Je suis heureuse de te voir.' },
      { french: 'triste', english: 'sad', example: 'Il est triste depuis son départ.' },
      { french: 'stressé(e)', english: 'stressed', example: 'Elle est très stressée avant l\'examen.' },
      { french: 'fâché(e)', english: 'angry', example: 'Il est fâché contre son frère.' },
      { french: 'surpris(e)', english: 'surprised', example: 'Nous étions surpris par la nouvelle.' }
    ]
  }
};

// User vocabulary progress (would be stored in a database in a real app)
const userVocabulary: Record<number, string[]> = {
  1: ['Bonjour', 'Merci', 'Oui', 'Non'] // Words the user has learned
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check authentication
  if (!isAuthenticated(req)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    // Get vocabulary lists
    const { level, category } = req.query;
    
    if (level && !vocabularyData[level as keyof typeof vocabularyData]) {
      return res.status(400).json({ message: 'Invalid level' });
    }
    
    // Filter by level
    if (level && !category) {
      return res.status(200).json(vocabularyData[level as keyof typeof vocabularyData]);
    }
    
    // Filter by level and category
    if (level && category) {
      const levelData = vocabularyData[level as keyof typeof vocabularyData];
      if (!levelData || !levelData[category as keyof typeof levelData]) {
        return res.status(400).json({ message: 'Invalid category' });
      }
      
      return res.status(200).json(levelData[category as keyof typeof levelData]);
    }
    
    // Return all levels and categories
    return res.status(200).json({
      levels: Object.keys(vocabularyData),
      categories: Object.entries(vocabularyData).reduce((acc, [level, categories]) => {
        acc[level] = Object.keys(categories);
        return acc;
      }, {} as Record<string, string[]>)
    });
  } else if (req.method === 'POST') {
    // Track user progress with vocabulary
    try {
      const userId = 1; // In a real app, get this from the authenticated user
      const { word, learned } = req.body;
      
      if (!word) {
        return res.status(400).json({ message: 'Word is required' });
      }
      
      // Initialize user's vocabulary list if not exists
      if (!userVocabulary[userId]) {
        userVocabulary[userId] = [];
      }
      
      // Add or remove from learned words
      if (learned) {
        if (!userVocabulary[userId].includes(word)) {
          userVocabulary[userId].push(word);
        }
      } else {
        userVocabulary[userId] = userVocabulary[userId].filter(w => w !== word);
      }
      
      return res.status(200).json({
        learned: userVocabulary[userId].includes(word),
        learnedWords: userVocabulary[userId]
      });
    } catch (error) {
      console.error('Vocabulary progress error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
} 