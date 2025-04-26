import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, VocabularyItem } from '@/types/api';
import { isAuthenticated, getUserId } from '@/utils/auth';
import { prisma } from '@/lib/prisma';

// Vocabulary database organized by level and category
const vocabularyDatabase = {
  A1: {
    greetings: [
      { word: 'Bonjour', translation: 'Hello', example: 'Bonjour, comment ça va?', level: 'A1', learned: false },
      { word: 'Au revoir', translation: 'Goodbye', example: 'Au revoir, à demain!', level: 'A1', learned: false },
      { word: 'Merci', translation: 'Thank you', example: 'Merci beaucoup pour votre aide.', level: 'A1', learned: false },
      { word: 'S\'il vous plaît', translation: 'Please', example: 'Un café, s\'il vous plaît.', level: 'A1', learned: false },
      { word: 'Excusez-moi', translation: 'Excuse me', example: 'Excusez-moi, où est la gare?', level: 'A1', learned: false }
    ],
    basics: [
      { word: 'Oui', translation: 'Yes', example: 'Oui, j\'aime le français.', level: 'A1', learned: false },
      { word: 'Non', translation: 'No', example: 'Non, je ne parle pas allemand.', level: 'A1', learned: false },
      { word: 'Je m\'appelle', translation: 'My name is', example: 'Je m\'appelle Marie.', level: 'A1', learned: false },
      { word: 'Comment allez-vous?', translation: 'How are you?', example: 'Bonjour, comment allez-vous?', level: 'A1', learned: false },
      { word: 'Je ne comprends pas', translation: 'I don\'t understand', example: 'Désolé, je ne comprends pas.', level: 'A1', learned: false }
    ],
    numbers: [
      { word: 'Un', translation: 'One', example: 'J\'ai un frère.', level: 'A1', learned: false },
      { word: 'Deux', translation: 'Two', example: 'J\'ai deux sœurs.', level: 'A1', learned: false },
      { word: 'Trois', translation: 'Three', example: 'Trois personnes sont arrivées.', level: 'A1', learned: false },
      { word: 'Quatre', translation: 'Four', example: 'Il y a quatre chaises.', level: 'A1', learned: false },
      { word: 'Cinq', translation: 'Five', example: 'Cinq minutes, s\'il vous plaît.', level: 'A1', learned: false }
    ]
  },
  A2: {
    travel: [
      { word: 'Le billet', translation: 'Ticket', example: 'J\'ai perdu mon billet de train.', level: 'A2', learned: false },
      { word: 'La gare', translation: 'Train station', example: 'La gare est à dix minutes à pied.', level: 'A2', learned: false },
      { word: 'L\'hôtel', translation: 'Hotel', example: 'Nous restons dans un hôtel près de la plage.', level: 'A2', learned: false },
      { word: 'Le passeport', translation: 'Passport', example: 'N\'oubliez pas votre passeport.', level: 'A2', learned: false },
      { word: 'La valise', translation: 'Suitcase', example: 'Ma valise est trop lourde.', level: 'A2', learned: false }
    ],
    food: [
      { word: 'Le restaurant', translation: 'Restaurant', example: 'Ce restaurant est très bon.', level: 'A2', learned: false },
      { word: 'Le menu', translation: 'Menu', example: 'Pouvez-vous m\'apporter le menu, s\'il vous plaît?', level: 'A2', learned: false },
      { word: 'La réservation', translation: 'Reservation', example: 'J\'ai fait une réservation pour deux personnes.', level: 'A2', learned: false },
      { word: 'L\'addition', translation: 'Bill', example: 'L\'addition, s\'il vous plaît.', level: 'A2', learned: false },
      { word: 'Le pourboire', translation: 'Tip', example: 'Le pourboire est inclus dans l\'addition.', level: 'A2', learned: false }
    ]
  },
  B1: {
    work: [
      { word: 'Le bureau', translation: 'Office', example: 'Je travaille dans un grand bureau.', level: 'B1', learned: false },
      { word: 'La réunion', translation: 'Meeting', example: 'J\'ai une réunion importante demain.', level: 'B1', learned: false },
      { word: 'Le collègue', translation: 'Colleague', example: 'Mes collègues sont très sympathiques.', level: 'B1', learned: false },
      { word: 'Le projet', translation: 'Project', example: 'Nous travaillons sur un nouveau projet.', level: 'B1', learned: false },
      { word: 'Le salaire', translation: 'Salary', example: 'Le salaire est payé à la fin du mois.', level: 'B1', learned: false }
    ],
    health: [
      { word: 'Le médecin', translation: 'Doctor', example: 'J\'ai rendez-vous chez le médecin.', level: 'B1', learned: false },
      { word: 'La pharmacie', translation: 'Pharmacy', example: 'La pharmacie est fermée le dimanche.', level: 'B1', learned: false },
      { word: 'Le médicament', translation: 'Medicine', example: 'Je dois prendre ce médicament trois fois par jour.', level: 'B1', learned: false },
      { word: 'La douleur', translation: 'Pain', example: 'J\'ai une douleur au dos.', level: 'B1', learned: false },
      { word: 'La fièvre', translation: 'Fever', example: 'L\'enfant a de la fièvre.', level: 'B1', learned: false }
    ]
  },
  B2: {
    environment: [
      { word: 'Le réchauffement climatique', translation: 'Global warming', example: 'Le réchauffement climatique est un problème mondial.', level: 'B2', learned: false },
      { word: 'Le développement durable', translation: 'Sustainable development', example: 'Nous devons promouvoir le développement durable.', level: 'B2', learned: false },
      { word: 'La pollution', translation: 'Pollution', example: 'La pollution de l\'air est dangereuse pour la santé.', level: 'B2', learned: false },
      { word: 'Le recyclage', translation: 'Recycling', example: 'Le recyclage est important pour protéger l\'environnement.', level: 'B2', learned: false },
      { word: 'Les énergies renouvelables', translation: 'Renewable energy', example: 'Les énergies renouvelables sont l\'avenir.', level: 'B2', learned: false }
    ]
  }
};

// Helper function to get all vocabulary items as a flat array
const getAllVocabularyItems = (): VocabularyItem[] => {
  const allItems: VocabularyItem[] = [];
  
  Object.keys(vocabularyDatabase).forEach(level => {
    Object.keys(vocabularyDatabase[level]).forEach(category => {
      vocabularyDatabase[level][category].forEach(item => {
        allItems.push({
          ...item,
          category
        });
      });
    });
  });
  
  return allItems;
};

// Helper function to get vocabulary by level
const getVocabularyByLevel = (level: string): VocabularyItem[] => {
  const levelItems: VocabularyItem[] = [];
  
  if (vocabularyDatabase[level]) {
    Object.keys(vocabularyDatabase[level]).forEach(category => {
      vocabularyDatabase[level][category].forEach(item => {
        levelItems.push({
          ...item,
          category
        });
      });
    });
  }
  
  return levelItems;
};

// Helper function to get vocabulary by category
const getVocabularyByCategory = (category: string): VocabularyItem[] => {
  const categoryItems: VocabularyItem[] = [];
  
  Object.keys(vocabularyDatabase).forEach(level => {
    if (vocabularyDatabase[level][category]) {
      vocabularyDatabase[level][category].forEach(item => {
        categoryItems.push({
          ...item,
          category
        });
      });
    }
  });
  
  return categoryItems;
};

// Helper function to get vocabulary by level and category
const getVocabularyByLevelAndCategory = (level: string, category: string): VocabularyItem[] => {
  if (vocabularyDatabase[level] && vocabularyDatabase[level][category]) {
    return vocabularyDatabase[level][category].map(item => ({
      ...item,
      category
    }));
  }
  
  return [];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<VocabularyItem[] | VocabularyItem>>
) {
  // Check if user is authenticated
  if (!isAuthenticated(req)) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Unauthorized'
      }
    });
  }

  const userId = getUserId(req);

  // GET request to retrieve vocabulary
  if (req.method === 'GET') {
    try {
      const { level, category } = req.query;
      let vocabularyItems: VocabularyItem[] = [];

      // Get vocabulary based on query parameters
      if (level && category) {
        vocabularyItems = getVocabularyByLevelAndCategory(level as string, category as string);
      } else if (level) {
        vocabularyItems = getVocabularyByLevel(level as string);
      } else if (category) {
        vocabularyItems = getVocabularyByCategory(category as string);
      } else {
        vocabularyItems = getAllVocabularyItems();
      }

      // In a real app, we would merge this with the user's progress
      // For now, we'll just return the vocabulary items
      return res.status(200).json({
        success: true,
        data: vocabularyItems
      });
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error'
        }
      });
    }
  }

  // POST request to add a new vocabulary item
  if (req.method === 'POST') {
    try {
      const { word, translation, example, level, category } = req.body;

      // Validate required fields
      if (!word || !translation || !level || !category) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Missing required fields'
          }
        });
      }

      // Create a new vocabulary item
      const newItem: VocabularyItem = {
        word,
        translation,
        example: example || '',
        level,
        category,
        learned: false
      };

      // In a real app, we would save this to the database
      // For now, we'll just return the new item
      return res.status(201).json({
        success: true,
        data: newItem
      });
    } catch (error) {
      console.error('Error adding vocabulary item:', error);
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
