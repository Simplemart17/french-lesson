import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { Message } from '@/services/api/conversationApiService';
import formidable from 'formidable';

// Configure Next.js API route to handle file uploads
export const config = {
  api: {
    bodyParser: false, // Disable the default body parser for file uploads
  },
};

// Helper function to parse form data
const parseFormData = async (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

// Mock responses for different topics
const mockResponses: Record<string, string[]> = {
  restaurant: [
    "Je vous recommande le plat du jour, c'est délicieux !",
    "Voulez-vous un verre de vin avec votre repas ?",
    "Le dessert est offert aujourd'hui. Voulez-vous un gâteau au chocolat ou une crème brûlée ?",
    "Votre commande sera prête dans quelques minutes. Merci de votre patience."
  ],
  shopping: [
    "Cette couleur vous va très bien !",
    "Nous avons ce modèle en plusieurs tailles. Quelle est votre taille ?",
    "Voulez-vous essayer ce vêtement ? Les cabines d'essayage sont par là.",
    "Ce style est très à la mode cette saison."
  ],
  travel: [
    "Pour aller à la tour Eiffel, prenez le métro ligne 6 jusqu'à la station Bir-Hakeim.",
    "Le musée du Louvre est ouvert tous les jours sauf le mardi, de 9h à 18h.",
    "Je vous conseille de visiter le quartier du Marais, c'est très charmant.",
    "Le bus numéro 42 vous amènera directement à votre destination."
  ],
  health: [
    "Depuis combien de temps avez-vous ces symptômes ?",
    "Je vais vous prescrire des médicaments pour soulager la douleur.",
    "Vous devriez vous reposer et boire beaucoup d'eau.",
    "Prenez ce médicament trois fois par jour après les repas."
  ],
  general: [
    "C'est très intéressant, pouvez-vous m'en dire plus ?",
    "Je comprends ce que vous voulez dire.",
    "Pourriez-vous reformuler votre question, s'il vous plaît ?",
    "Bien sûr, je serais ravi de vous aider avec ça."
  ]
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Message>>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: {
        message: 'Method not allowed'
      }
    });
  }

  try {
    let conversationId: string;
    let content: string;
    let audioFile: any = null;
    
    // Handle form data if there's an audio file
    if (req.headers['content-type']?.includes('multipart/form-data')) {
      const { fields, files } = await parseFormData(req);
      conversationId = fields.conversationId as string;
      content = fields.content as string;
      audioFile = files.audio;
    } else {
      // Handle JSON data
      const body = req.body;
      conversationId = body.conversationId;
      content = body.content;
    }
    
    // Validate input
    if (!conversationId || !content) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Conversation ID and content are required'
        }
      });
    }
    
    // Create a user message
    const userMessage: Message = {
      id: `msg-user-${Date.now()}`,
      conversationId,
      role: 'user',
      content,
      createdAt: new Date().toISOString()
    };
    
    // Generate a response based on the content
    let responseContent = '';
    
    // Try to match content with predefined topics
    for (const [topic, responses] of Object.entries(mockResponses)) {
      if (content.toLowerCase().includes(topic)) {
        // Pick a random response from the topic
        responseContent = responses[Math.floor(Math.random() * responses.length)];
        break;
      }
    }
    
    // If no match found, use a generic response
    if (!responseContent) {
      responseContent = mockResponses.general[Math.floor(Math.random() * mockResponses.general.length)];
    }
    
    // Create an assistant message
    const assistantMessage: Message = {
      id: `msg-assistant-${Date.now()}`,
      conversationId,
      role: 'assistant',
      content: responseContent,
      createdAt: new Date(Date.now() + 1000).toISOString() // 1 second later
    };
    
    // In a real application, we would:
    // 1. Save the user message to the database
    // 2. Process the message with an AI model
    // 3. Save the assistant response to the database
    // 4. Return both messages
    
    // For this mock implementation, we'll just return the assistant message
    return res.status(200).json({
      success: true,
      data: assistantMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
}
