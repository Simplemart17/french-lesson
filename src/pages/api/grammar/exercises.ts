import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';

// Define the grammar exercise type
interface GrammarExercise {
  id: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'multiple-choice' | 'fill-in-blank' | 'reorder';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
}

// Mock grammar exercises
const mockGrammarExercises: GrammarExercise[] = [
  {
    id: 1,
    title: "Present Tense Conjugation",
    description: "Practice conjugating regular verbs in the present tense.",
    difficulty: "beginner",
    type: "fill-in-blank",
    question: "Je ____ au cinéma. (aller)",
    options: ["va", "vas", "vais", "allez", "allons"],
    correctAnswer: "vais"
  },
  {
    id: 2,
    title: "Gender Agreement",
    description: "Practice matching adjectives with the correct gender.",
    difficulty: "beginner",
    type: "multiple-choice",
    question: "La voiture est ____.",
    options: ["petit", "petite", "petits", "petites"],
    correctAnswer: "petite"
  },
  {
    id: 3,
    title: "Passé Composé vs Imparfait",
    description: "Choose the correct tense for each context.",
    difficulty: "intermediate",
    type: "multiple-choice",
    question: "Quand j'étais petit, je ____ souvent à la plage.",
    options: ["suis allé", "allais", "vais", "irai"],
    correctAnswer: "allais"
  },
  {
    id: 4,
    title: "Subjunctive Mood",
    description: "Practice using the subjunctive mood in French.",
    difficulty: "advanced",
    type: "fill-in-blank",
    question: "Il faut que tu ____ à l'heure. (être)",
    options: ["es", "est", "sois", "soit", "êtes"],
    correctAnswer: "sois"
  },
  {
    id: 5,
    title: "Conditional Sentences",
    description: "Form conditional sentences in French.",
    difficulty: "advanced",
    type: "reorder",
    question: "Reorder the words to form a conditional sentence.",
    options: ["si", "j'avais", "de l'argent", "j'achèterais", "une", "voiture"],
    correctAnswer: ["si", "j'avais", "de l'argent", "j'achèterais", "une", "voiture"]
  },
  {
    id: 6,
    title: "Prepositions of Place",
    description: "Choose the correct preposition for each location.",
    difficulty: "beginner",
    type: "multiple-choice",
    question: "Le livre est ____ la table.",
    options: ["sur", "sous", "dans", "à"],
    correctAnswer: "sur"
  },
  {
    id: 7,
    title: "Negative Constructions",
    description: "Transform sentences into their negative form.",
    difficulty: "intermediate",
    type: "fill-in-blank",
    question: "Transform to negative: 'J'ai quelque chose.' → 'Je ____ ____.'",
    options: ["n'ai pas", "n'ai rien", "ne rien ai", "n'ai quelque chose pas"],
    correctAnswer: "n'ai rien"
  },
  {
    id: 8,
    title: "Relative Pronouns",
    description: "Choose the correct relative pronoun.",
    difficulty: "intermediate",
    type: "multiple-choice",
    question: "La personne ____ parle est mon professeur.",
    options: ["que", "qui", "dont", "où"],
    correctAnswer: "qui"
  }
];

// Define the response type
interface GrammarExerciseListResponse {
  items: GrammarExercise[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<GrammarExerciseListResponse>>
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
    const { difficulty, type, category, page = '1', limit = '10' } = req.query;
    
    // Filter exercises by difficulty if provided
    let filteredExercises = [...mockGrammarExercises];
    
    if (difficulty) {
      filteredExercises = filteredExercises.filter(
        exercise => exercise.difficulty === difficulty
      );
    }
    
    // Filter by type if provided
    if (type) {
      filteredExercises = filteredExercises.filter(
        exercise => exercise.type === type
      );
    }
    
    // Filter by category (not implemented in mock data, but included for API compatibility)
    if (category) {
      // In a real implementation, this would filter by category
      // For now, we'll just log that this filter was requested
      console.log(`Category filter requested: ${category}`);
    }
    
    // Calculate pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedExercises = filteredExercises.slice(startIndex, endIndex);
    
    // Prepare response
    const response: GrammarExerciseListResponse = {
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
    console.error('Error in grammar exercises API:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
}
