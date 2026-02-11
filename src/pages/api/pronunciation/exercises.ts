import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { PronunciationExercise as ImportedPronunciationExercise, PronunciationPhrase as ImportedPronunciationPhrase } from '@/services/api/pronunciationApiService';
import { supabase, TABLES } from '@/lib/supabase';

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

// Define a custom response type that uses our local PronunciationExercise type
interface CustomPronunciationExerciseListResponse {
  items: PronunciationExercise[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<CustomPronunciationExerciseListResponse>>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: { message: 'Method not allowed' }
    });
  }

  try {
    console.log('Pronunciation exercises API called with query:', req.query);
    
    // Get query parameters
    const { difficulty, search, page = '1', limit = '10' } = req.query;

    // Calculate pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const safePage = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;
    const safeLimit = Number.isFinite(limitNum) && limitNum > 0 ? limitNum : 10;
    const from = (safePage - 1) * safeLimit;
    const to = from + safeLimit;

    console.log('Querying PRONUNCIATION_EXERCISES table with params:', { difficulty, search, pageNum, limitNum });

    // Build query
    let query = supabase
      .from(TABLES.PRONUNCIATION_EXERCISES)
      .select('*')
      .order('created_at', { ascending: true });

    // Apply filters
    if (difficulty) {
      console.log('Applying difficulty filter:', difficulty);
      const levels = mapDifficultyToDbLevels(difficulty as string);
      query = query.in('level', levels);
    }

    if (search && typeof search === 'string') {
      console.log('Applying search filter:', search);
      query = query.or(`text.ilike.%${search}%,translation.ilike.%${search}%`);
    }

    console.log('Executing database query...');
    const { data: exercises, error } = await query;

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    console.log('Database query successful. Found exercises:', exercises?.length || 0);

    // const total = count || 0; // Unused for now

    // If no exercises found in database, return mock data
    if (!exercises || exercises.length === 0) {
      console.log('No exercises found in database, returning mock data');
      const mockExercises = createMockExercises(difficulty as string);
      
      const response: CustomPronunciationExerciseListResponse = {
        items: mockExercises,
        total: mockExercises.length,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(mockExercises.length / safeLimit)
      };

      return res.status(200).json({
        success: true,
        data: response
      });
    }

    // Group exercises by difficulty and create exercise objects
    interface DatabasePronunciationExercise {
      id: string;
      text: string;
      level: string; // Changed from difficulty to level
      translation?: string;
      expected_pronunciation?: string; // Changed from expectedPronunciation
      phonetic?: string;
      audio_url?: string;
    }
    const exerciseGroups: { [key: string]: PronunciationPhrase[] } = {};

    (exercises || []).forEach((exercise: DatabasePronunciationExercise) => {
      const difficulty = mapDifficultyLevel(exercise.level); // Changed from exercise.difficulty
      if (!exerciseGroups[difficulty]) {
        exerciseGroups[difficulty] = [];
      }
      exerciseGroups[difficulty].push({
        id: exercise.id,
        text: exercise.text,
        translation: exercise.translation || '',
        difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
        audioUrl: `/api/tts?text=${encodeURIComponent(exercise.text)}&lang=fr`,
        phonetics: exercise.expected_pronunciation || '', // Changed from expectedPronunciation
        focusSounds: []
      });
    });

    // Create exercise objects
    const exerciseObjects: PronunciationExercise[] = [];
    let exerciseId = 1;

    Object.entries(exerciseGroups).forEach(([difficulty, phrases]) => {
      if (phrases.length > 0) {
        // Group phrases into exercises of 3-5 phrases each
        for (let i = 0; i < phrases.length; i += 4) {
          const exercisePhrases = phrases.slice(i, i + 4);
          exerciseObjects.push({
            id: exerciseId++,
            title: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Pronunciation Practice`,
            description: `Practice French pronunciation with ${difficulty} level phrases.`,
            difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
            phrases: exercisePhrases,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      }
    });

    // Apply pagination to exercise objects
    const paginatedExercises = exerciseObjects.slice(from, to);

    // Prepare response
    const response: CustomPronunciationExerciseListResponse = {
      items: paginatedExercises,
      total: exerciseObjects.length,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(exerciseObjects.length / safeLimit)
    };

    return res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Error in pronunciation exercises API:', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
}

// Helper function to map database difficulty to API difficulty
function mapDifficultyLevel(dbDifficulty: string): 'beginner' | 'intermediate' | 'advanced' {
  switch (dbDifficulty) {
    case 'A1':
    case 'A2':
      return 'beginner';
    case 'B1':
    case 'B2':
      return 'intermediate';
    case 'C1':
    case 'C2':
      return 'advanced';
    default:
      return 'beginner';
  }
}

function mapDifficultyToDbLevels(
  difficulty: string
): Array<'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'> {
  switch (difficulty) {
    case 'beginner':
      return ['A1', 'A2'];
    case 'intermediate':
      return ['B1', 'B2'];
    case 'advanced':
      return ['C1', 'C2'];
    case 'A1':
    case 'A2':
    case 'B1':
    case 'B2':
    case 'C1':
    case 'C2':
      return [difficulty];
    default:
      return ['A1', 'A2'];
  }
}

function normalizeDifficultyInput(difficulty?: string): 'beginner' | 'intermediate' | 'advanced' {
  if (!difficulty) return 'beginner';
  if (difficulty === 'beginner' || difficulty === 'intermediate' || difficulty === 'advanced') {
    return difficulty;
  }
  return mapDifficultyLevel(difficulty);
}

// Helper function to create mock exercises when database is empty
function createMockExercises(difficulty: string): PronunciationExercise[] {
  const requestedDifficulty = normalizeDifficultyInput(difficulty);
  
  const mockPhrases: { [key: string]: PronunciationPhrase[] } = {
    beginner: [
      {
        id: 1,
        text: 'Bonjour, comment allez-vous?',
        translation: 'Hello, how are you?',
        difficulty: 'beginner',
        audioUrl: '/api/tts?text=Bonjour%2C%20comment%20allez-vous%3F&lang=fr',
        phonetics: 'bon-ZHOOR, ko-mahn-tah-lay VOO',
        focusSounds: ['r', 'ou']
      },
      {
        id: 2,
        text: 'Je m\'appelle Marie.',
        translation: 'My name is Marie.',
        difficulty: 'beginner',
        audioUrl: '/api/tts?text=Je%20m%27appelle%20Marie.&lang=fr',
        phonetics: 'zhuh mah-PEHL mah-REE',
        focusSounds: ['j', 'é']
      },
      {
        id: 3,
        text: 'Où est la boulangerie?',
        translation: 'Where is the bakery?',
        difficulty: 'beginner',
        audioUrl: '/api/tts?text=O%C3%B9%20est%20la%20boulangerie%3F&lang=fr',
        phonetics: 'OO eh lah boo-lahn-zhuh-REE',
        focusSounds: ['où', 'an']
      },
      {
        id: 4,
        text: 'Merci beaucoup!',
        translation: 'Thank you very much!',
        difficulty: 'beginner',
        audioUrl: '/api/tts?text=Merci%20beaucoup!&lang=fr',
        phonetics: 'mer-SEE bo-KOO',
        focusSounds: ['r', 'eau']
      }
    ],
    intermediate: [
      {
        id: 5,
        text: 'Qu\'est-ce que vous avez fait le weekend dernier?',
        translation: 'What did you do last weekend?',
        difficulty: 'intermediate',
        audioUrl: '/api/tts?text=Qu%27est-ce%20que%20vous%20avez%20fait%20le%20weekend%20dernier%3F&lang=fr',
        phonetics: 'kes-kuh voo-zah-vay feh luh weekend der-NYAY',
        focusSounds: ['qu', 'ez', 'ai']
      },
      {
        id: 6,
        text: 'Je voudrais réserver une table pour deux personnes.',
        translation: 'I would like to book a table for two people.',
        difficulty: 'intermediate',
        audioUrl: '/api/tts?text=Je%20voudrais%20r%C3%A9server%20une%20table%20pour%20deux%20personnes.&lang=fr',
        phonetics: 'zhuh voo-DREH ray-zer-VAY oon tah-bluh poor duh per-SON',
        focusSounds: ['ai', 'é', 'eu']
      }
    ],
    advanced: [
      {
        id: 7,
        text: 'Les changements climatiques représentent un défi majeur.',
        translation: 'Climate change represents a major challenge.',
        difficulty: 'advanced',
        audioUrl: '/api/tts?text=Les%20changements%20climatiques%20repr%C3%A9sentent%20un%20d%C3%A9fi%20majeur.&lang=fr',
        phonetics: 'lay shahn-zhuh-mahn klee-mah-TEEK ruh-pray-zahn-tahn uhn day-FEE mah-ZHUR',
        focusSounds: ['an', 'en', 'é']
      },
      {
        id: 8,
        text: 'L\'analyse des données révèle des tendances intéressantes.',
        translation: 'Data analysis reveals interesting trends.',
        difficulty: 'advanced',
        audioUrl: '/api/tts?text=L%27analyse%20des%20donn%C3%A9es%20r%C3%A9v%C3%A8le%20des%20tendances%20int%C3%A9ressantes.&lang=fr',
        phonetics: 'lah-nah-LEEZ day don-NAY ray-VEHL day tahn-dahnss in-tay-ruh-SAHNT',
        focusSounds: ['è', 'an', 'é']
      }
    ]
  };

  const phrases = mockPhrases[requestedDifficulty] || mockPhrases.beginner;
  
  return [{
    id: 1,
    title: `${requestedDifficulty.charAt(0).toUpperCase() + requestedDifficulty.slice(1)} Pronunciation Practice`,
    description: `Practice French pronunciation with ${requestedDifficulty} level phrases.`,
    difficulty: requestedDifficulty as 'beginner' | 'intermediate' | 'advanced',
    phrases,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }];
}

export default handler;
