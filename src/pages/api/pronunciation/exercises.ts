import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { PronunciationExercise as ImportedPronunciationExercise, PronunciationPhrase as ImportedPronunciationPhrase } from '@/services/api/pronunciationApiService';

// Extended PronunciationPhrase interface for the mock data
interface PronunciationPhrase extends ImportedPronunciationPhrase {
  audioUrl: string;
  phonetics: string;
  focusSounds: string[];
}

// Extended PronunciationExercise interface for the mock data
interface PronunciationExercise extends ImportedPronunciationExercise {
  phrases: PronunciationPhrase[];
}

// Mock data for pronunciation exercises
const mockPronunciationPhrases: Record<string, PronunciationPhrase[]> = {
  beginner: [
    {
      id: 1,
      text: "Bonjour, comment allez-vous?",
      translation: "Hello, how are you?",
      audioUrl: "/audio/pronunciation/bonjour.mp3",
      phonetics: "bɔ̃.ʒuʁ kɔ.mɑ̃ t‿a.le vu",
      difficulty: "beginner",
      focusSounds: ["ɔ̃", "ʁ"]
    },
    {
      id: 2,
      text: "Je m'appelle Marie.",
      translation: "My name is Marie.",
      audioUrl: "/audio/pronunciation/je-mappelle.mp3",
      phonetics: "ʒə ma.pɛl ma.ʁi",
      difficulty: "beginner",
      focusSounds: ["ʒ", "ɛ"]
    },
    {
      id: 3,
      text: "Merci beaucoup.",
      translation: "Thank you very much.",
      audioUrl: "/audio/pronunciation/merci-beaucoup.mp3",
      phonetics: "mɛʁ.si bo.ku",
      difficulty: "beginner",
      focusSounds: ["ɛʁ", "u"]
    }
  ],
  intermediate: [
    {
      id: 4,
      text: "Je voudrais réserver une table pour deux personnes.",
      translation: "I would like to reserve a table for two people.",
      audioUrl: "/audio/pronunciation/reserver-table.mp3",
      phonetics: "ʒə vu.dʁɛ ʁe.zɛʁ.ve yn tabl puʁ dø pɛʁ.sɔn",
      difficulty: "intermediate",
      focusSounds: ["ʁ", "ø", "ɛʁ"]
    },
    {
      id: 5,
      text: "Pourriez-vous me dire où se trouve la gare?",
      translation: "Could you tell me where the train station is?",
      audioUrl: "/audio/pronunciation/ou-est-la-gare.mp3",
      phonetics: "pu.ʁje vu mə diʁ u sə tʁuv la gaʁ",
      difficulty: "intermediate",
      focusSounds: ["u", "ʁ", "tʁ"]
    },
    {
      id: 6,
      text: "J'aimerais acheter un billet pour Paris.",
      translation: "I would like to buy a ticket to Paris.",
      audioUrl: "/audio/pronunciation/billet-paris.mp3",
      phonetics: "ʒɛ.mə.ʁɛ a.ʃə.te œ̃ bi.jɛ puʁ pa.ʁi",
      difficulty: "intermediate",
      focusSounds: ["ɛ", "œ̃", "j"]
    }
  ],
  advanced: [
    {
      id: 7,
      text: "Les feuilles des arbres bruissent dans le vent d'automne.",
      translation: "The leaves of the trees rustle in the autumn wind.",
      audioUrl: "/audio/pronunciation/feuilles-arbres.mp3",
      phonetics: "le fœj de.z‿aʁbʁ bʁɥis dɑ̃ lə vɑ̃ do.tɔn",
      difficulty: "advanced",
      focusSounds: ["œ", "ɥi", "ʁ", "ɑ̃"]
    },
    {
      id: 8,
      text: "Ce vieux monsieur a un accent particulièrement charmant.",
      translation: "This old gentleman has a particularly charming accent.",
      audioUrl: "/audio/pronunciation/accent-charmant.mp3",
      phonetics: "sə vjø mə.sjø a œ̃.n‿ak.sɑ̃ paʁ.ti.ky.ljɛʁ.mɑ̃ ʃaʁ.mɑ̃",
      difficulty: "advanced",
      focusSounds: ["œ̃", "ɑ̃", "ʁ"]
    },
    {
      id: 9,
      text: "La prononciation française nécessite beaucoup de pratique.",
      translation: "French pronunciation requires a lot of practice.",
      audioUrl: "/audio/pronunciation/prononciation-francaise.mp3",
      phonetics: "la pʁɔ.nɔ̃.sja.sjɔ̃ fʁɑ̃.sɛz ne.se.sit bo.ku də pʁa.tik",
      difficulty: "advanced",
      focusSounds: ["ɔ̃", "ɑ̃", "ɛ"]
    }
  ]
};

// Mock pronunciation exercises
const mockPronunciationExercises: PronunciationExercise[] = [
  {
    id: 1,
    title: "Basic Greetings",
    description: "Practice basic French greetings and introductions.",
    difficulty: "beginner",
    phrases: mockPronunciationPhrases.beginner.slice(0, 3),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Travel Phrases",
    description: "Common phrases for traveling in French-speaking countries.",
    difficulty: "intermediate",
    phrases: mockPronunciationPhrases.intermediate.slice(0, 3),
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    title: "Advanced Expressions",
    description: "Complex sentences with challenging sounds for advanced learners.",
    difficulty: "advanced",
    phrases: mockPronunciationPhrases.advanced.slice(0, 3),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Define a custom response type that uses our local PronunciationExercise type
interface CustomPronunciationExerciseListResponse {
  items: PronunciationExercise[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<CustomPronunciationExerciseListResponse>>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: {
        message: 'Method not allowed'
      }
    });
  }

  try {
    // Get query parameters
    const { difficulty, search, page = '1', limit = '10' } = req.query;

    // Filter exercises by difficulty if provided
    let filteredExercises = [...mockPronunciationExercises];

    if (difficulty) {
      filteredExercises = filteredExercises.filter(
        exercise => exercise.difficulty === difficulty
      );
    }

    // Filter by search term if provided
    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase();
      filteredExercises = filteredExercises.filter(
        exercise =>
          exercise.title.toLowerCase().includes(searchLower) ||
          exercise.description.toLowerCase().includes(searchLower) ||
          exercise.phrases.some(phrase =>
            phrase.text.toLowerCase().includes(searchLower) ||
            phrase.translation.toLowerCase().includes(searchLower)
          )
      );
    }

    // Calculate pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedExercises = filteredExercises.slice(startIndex, endIndex);

    // Prepare response
    const response: CustomPronunciationExerciseListResponse = {
      items: paginatedExercises,
      total: filteredExercises.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(filteredExercises.length / limitNum)
    };

    // Return success response
    return res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Error in pronunciation exercises API:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
}
