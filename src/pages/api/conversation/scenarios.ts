import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { isAuthenticated, getUserId } from '@/utils/auth';

// Define the conversation scenario type
interface ConversationScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  initialMessage: string;
  possibleResponses: {
    userInput: string;
    botReply: string;
  }[];
}

// Mock conversation scenarios
const conversationScenarios: ConversationScenario[] = [
  {
    id: '1',
    title: 'At a Café',
    description: 'Practice ordering food and drinks at a French café',
    difficulty: 'beginner',
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
    title: 'Asking for Directions',
    description: 'Practice asking for and understanding directions in French',
    difficulty: 'beginner',
    initialMessage: 'Bonjour! Vous semblez perdu. Est-ce que je peux vous aider?',
    possibleResponses: [
      {
        userInput: 'gare',
        botReply: 'La gare? C\'est facile. Allez tout droit, puis prenez la deuxième rue à droite. La gare est au bout de la rue.'
      },
      {
        userInput: 'musée',
        botReply: 'Le musée est à environ 10 minutes à pied. Prenez la première rue à gauche, puis continuez tout droit jusqu\'au grand bâtiment blanc.'
      },
      {
        userInput: 'hôtel',
        botReply: 'Il y a plusieurs hôtels dans le quartier. Quel hôtel cherchez-vous exactement?'
      },
      {
        userInput: 'merci',
        botReply: 'Je vous en prie. Bon séjour à Paris!'
      }
    ]
  },
  {
    id: '3',
    title: 'Shopping for Clothes',
    description: 'Practice shopping for clothes in a French store',
    difficulty: 'intermediate',
    initialMessage: 'Bonjour! Bienvenue dans notre boutique. Je peux vous aider à trouver quelque chose?',
    possibleResponses: [
      {
        userInput: 'chemise',
        botReply: 'Les chemises sont au premier étage. Quelle taille portez-vous?'
      },
      {
        userInput: 'pantalon',
        botReply: 'Les pantalons sont au rez-de-chaussée, à droite. Nous avons plusieurs styles et couleurs disponibles.'
      },
      {
        userInput: 'essayer',
        botReply: 'Les cabines d\'essayage sont au fond du magasin, à côté des caisses.'
      },
      {
        userInput: 'prix',
        botReply: 'Le prix est indiqué sur l\'étiquette. Cette chemise coûte 45 euros.'
      },
      {
        userInput: 'trop cher',
        botReply: 'Nous avons des articles moins chers dans notre section soldes, au deuxième étage.'
      }
    ]
  },
  {
    id: '4',
    title: 'Making a Hotel Reservation',
    description: 'Practice making a hotel reservation in French',
    difficulty: 'intermediate',
    initialMessage: 'Hôtel de la Paix, bonjour. Comment puis-je vous aider?',
    possibleResponses: [
      {
        userInput: 'réservation',
        botReply: 'Vous souhaitez faire une réservation? Bien sûr. Pour quelles dates?'
      },
      {
        userInput: 'chambre',
        botReply: 'Nous avons des chambres simples, doubles et des suites. Quel type de chambre souhaitez-vous?'
      },
      {
        userInput: 'prix',
        botReply: 'Le prix dépend du type de chambre et de la saison. Une chambre double coûte environ 120 euros par nuit en ce moment.'
      },
      {
        userInput: 'petit-déjeuner',
        botReply: 'Oui, le petit-déjeuner est inclus dans le prix de la chambre. Il est servi de 7h à 10h dans notre restaurant.'
      },
      {
        userInput: 'merci',
        botReply: 'Je vous en prie. N\'hésitez pas à nous contacter si vous avez d\'autres questions.'
      }
    ]
  },
  {
    id: '5',
    title: 'At the Doctor\'s Office',
    description: 'Practice explaining symptoms and understanding medical advice in French',
    difficulty: 'advanced',
    initialMessage: 'Bonjour, je suis le Dr. Martin. Qu\'est-ce qui vous amène aujourd\'hui?',
    possibleResponses: [
      {
        userInput: 'mal à la tête',
        botReply: 'Depuis combien de temps avez-vous mal à la tête? Est-ce que vous avez de la fièvre aussi?'
      },
      {
        userInput: 'fièvre',
        botReply: 'Quelle est votre température? Avez-vous pris des médicaments pour faire baisser la fièvre?'
      },
      {
        userInput: 'toux',
        botReply: 'Est-ce que c\'est une toux sèche ou grasse? Est-ce que vous toussez plus la nuit ou le jour?'
      },
      {
        userInput: 'médicament',
        botReply: 'Je vais vous prescrire un médicament pour soulager vos symptômes. Prenez-le trois fois par jour après les repas.'
      },
      {
        userInput: 'merci',
        botReply: 'Je vous en prie. Revenez me voir si les symptômes persistent plus de trois jours.'
      }
    ]
  }
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ConversationScenario[] | ConversationScenario>>
) {
  // GET request to retrieve conversation scenarios
  if (req.method === 'GET') {
    try {
      const { id, difficulty } = req.query;
      
      // If ID is provided, return that specific scenario
      if (id) {
        const scenario = conversationScenarios.find(s => s.id === id);
        
        if (!scenario) {
          return res.status(404).json({
            success: false,
            error: {
              message: 'Conversation scenario not found'
            }
          });
        }
        
        return res.status(200).json({
          success: true,
          data: scenario
        });
      }
      
      // If difficulty is provided, filter by difficulty
      if (difficulty) {
        const filteredScenarios = conversationScenarios.filter(
          s => s.difficulty === difficulty
        );
        
        return res.status(200).json({
          success: true,
          data: filteredScenarios
        });
      }
      
      // Otherwise, return all scenarios
      return res.status(200).json({
        success: true,
        data: conversationScenarios
      });
    } catch (error) {
      console.error('Error fetching conversation scenarios:', error);
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
