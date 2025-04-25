import { NextApiRequest, NextApiResponse } from 'next';
import { 
  getUserVocabulary, 
  addUserVocabulary,
  updateVocabularyItem
} from '@/utils/mockDb';
import { ApiResponse, VocabularyItem } from '@/types/api';
import { isAuthenticated, getUserId } from '@/utils/auth';

// Mock vocabulary data organized by level and category for browsing
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
    ]
  },
  A2: {
    food: [
      { word: 'le pain', translation: 'bread', example: 'J\'aime le pain français.', level: 'A2', learned: false },
      { word: 'le fromage', translation: 'cheese', example: 'La France est connue pour son fromage.', level: 'A2', learned: false },
      { word: 'le vin', translation: 'wine', example: 'Un verre de vin rouge, s\'il vous plaît.', level: 'A2', learned: false },
      { word: 'le restaurant', translation: 'restaurant', example: 'Allons au restaurant ce soir.', level: 'A2', learned: false },
      { word: 'le menu', translation: 'menu', example: 'Puis-je voir le menu, s\'il vous plaît?', level: 'A2', learned: false }
    ],
    travel: [
      { word: 'l\'hôtel', translation: 'hotel', example: 'Nous restons dans un hôtel près de la plage.', level: 'A2', learned: false },
      { word: 'le passeport', translation: 'passport', example: 'N\'oubliez pas votre passeport.', level: 'A2', learned: false },
      { word: 'l\'avion', translation: 'airplane', example: 'L\'avion décolle à 15h.', level: 'A2', learned: false },
      { word: 'la gare', translation: 'train station', example: 'La gare est à 10 minutes à pied.', level: 'A2', learned: false },
      { word: 'le billet', translation: 'ticket', example: 'J\'ai acheté un billet de train.', level: 'A2', learned: false }
    ]
  },
  B1: {
    work: [
      { word: 'le bureau', translation: 'office', example: 'Je travaille dans un petit bureau.', level: 'B1', learned: false },
      { word: 'la réunion', translation: 'meeting', example: 'J\'ai une réunion importante demain.', level: 'B1', learned: false },
      { word: 'le collègue', translation: 'colleague', example: 'Mes collègues sont très sympathiques.', level: 'B1', learned: false },
      { word: 'le projet', translation: 'project', example: 'Nous travaillons sur un projet intéressant.', level: 'B1', learned: false },
      { word: 'le CV', translation: 'resume', example: 'J\'ai envoyé mon CV à plusieurs entreprises.', level: 'B1', learned: false }
    ],
    emotions: [
      { word: 'heureux/heureuse', translation: 'happy', example: 'Je suis heureuse de te voir.', level: 'B1', learned: false },
      { word: 'triste', translation: 'sad', example: 'Il est triste depuis son départ.', level: 'B1', learned: false },
      { word: 'stressé(e)', translation: 'stressed', example: 'Elle est très stressée avant l\'examen.', level: 'B1', learned: false },
      { word: 'fâché(e)', translation: 'angry', example: 'Il est fâché contre son frère.', level: 'B1', learned: false },
      { word: 'surpris(e)', translation: 'surprised', example: 'Nous étions surpris par la nouvelle.', level: 'B1', learned: false }
    ]
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
) {
  // Check authentication
  if (!isAuthenticated(req)) {
    return res.status(401).json({ 
      success: false, 
      error: {
        message: 'Unauthorized'
      }
    });
  }

  const userId = getUserId(req);

  if (req.method === 'GET') {
    const { level, category, learned } = req.query;
    
    // Get user's vocabulary progress
    if (learned === 'true' || learned === 'false') {
      const userVocab = getUserVocabulary(userId);
      const filteredVocab = userVocab.filter(item => 
        item.learned === (learned === 'true') &&
        (!level || item.level === level)
      );
      
      return res.status(200).json({
        success: true,
        data: filteredVocab
      });
    }
    
    // Browse vocabulary database
    if (level && !vocabularyDatabase[level as keyof typeof vocabularyDatabase]) {
      return res.status(400).json({ 
        success: false, 
        error: {
          message: 'Invalid level'
        }
      });
    }
    
    // Filter by level
    if (level && !category) {
      return res.status(200).json({
        success: true,
        data: vocabularyDatabase[level as keyof typeof vocabularyDatabase]
      });
    }
    
    // Filter by level and category
    if (level && category) {
      const levelData = vocabularyDatabase[level as keyof typeof vocabularyDatabase];
      if (!levelData || !levelData[category as keyof typeof levelData]) {
        return res.status(400).json({ 
          success: false, 
          error: {
            message: 'Invalid category'
          }
        });
      }
      
      // Add user learning status to the vocabulary items
      const userVocab = getUserVocabulary(userId);
      const userWords = new Set(userVocab.filter(v => v.learned).map(v => v.word));
      
      const vocabItems = levelData[category as keyof typeof levelData] as VocabularyItem[];
      const itemsWithUserStatus = vocabItems.map(item => ({
        ...item,
        learned: userWords.has(item.word)
      }));
      
      return res.status(200).json({
        success: true,
        data: itemsWithUserStatus
      });
    }
    
    // Return available levels and categories
    return res.status(200).json({
      success: true,
      data: {
        levels: Object.keys(vocabularyDatabase),
        categories: Object.entries(vocabularyDatabase).reduce((acc, [level, categories]) => {
          acc[level] = Object.keys(categories);
          return acc;
        }, {} as Record<string, string[]>)
      }
    });
  } else if (req.method === 'POST') {
    // Track user progress with vocabulary
    try {
      const { word, translation, example, level, learned, lastPracticed } = req.body;
      
      if (!word) {
        return res.status(400).json({ 
          success: false, 
          error: {
            message: 'Word is required'
          }
        });
      }
      
      // If the word already exists for the user, update it
      const existingVocab = getUserVocabulary(userId).find(item => item.word === word);
      
      if (existingVocab) {
        const updatedItem = updateVocabularyItem(userId, word, {
          learned: learned !== undefined ? learned : existingVocab.learned,
          lastPracticed: lastPracticed || existingVocab.lastPracticed
        });
        
        return res.status(200).json({
          success: true,
          data: updatedItem
        });
      } else {
        // Add new vocabulary item
        if (!translation || !level) {
          return res.status(400).json({ 
            success: false, 
            error: {
              message: 'Translation and level are required for new vocabulary items'
            }
          });
        }
        
        const newItem = addUserVocabulary(userId, {
          word,
          translation,
          example: example || '',
          level,
          learned: learned || false,
          lastPracticed: lastPracticed || new Date().toISOString()
        });
        
        return res.status(200).json({
          success: true,
          data: newItem
        });
      }
    } catch (error) {
      console.error('Vocabulary progress error:', error);
      return res.status(500).json({ 
        success: false, 
        error: {
          message: 'Internal server error'
        }
      });
    }
  } else {
    return res.status(405).json({ 
      success: false, 
      error: {
        message: 'Method not allowed'
      }
    });
  }
} 