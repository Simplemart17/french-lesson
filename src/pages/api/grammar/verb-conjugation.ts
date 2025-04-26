import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { isAuthenticated, getUserId } from '@/utils/auth';
import { prisma } from '@/lib/prisma';

// Define the verb conjugation exercise type
interface VerbConjugationExercise {
  id: string;
  verb: string;
  tense: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  group?: 1 | 2 | 3 | 'irregular';
  conjugations: {
    pronoun: string;
    correctAnswer: string;
  }[];
}

// Mock verb conjugation exercises
const verbConjugationExercises: Record<string, VerbConjugationExercise[]> = {
  beginner: [
    {
      id: 'etre-present',
      verb: 'être',
      tense: 'présent',
      description: 'The verb "être" (to be) is one of the most important and frequently used verbs in French.',
      difficulty: 'beginner',
      group: 'irregular',
      conjugations: [
        { pronoun: 'je', correctAnswer: 'suis' },
        { pronoun: 'tu', correctAnswer: 'es' },
        { pronoun: 'il/elle', correctAnswer: 'est' },
        { pronoun: 'nous', correctAnswer: 'sommes' },
        { pronoun: 'vous', correctAnswer: 'êtes' },
        { pronoun: 'ils/elles', correctAnswer: 'sont' }
      ]
    },
    {
      id: 'avoir-present',
      verb: 'avoir',
      tense: 'présent',
      description: 'The verb "avoir" (to have) is essential in French and is also used as an auxiliary verb.',
      difficulty: 'beginner',
      group: 'irregular',
      conjugations: [
        { pronoun: 'je', correctAnswer: 'ai' },
        { pronoun: 'tu', correctAnswer: 'as' },
        { pronoun: 'il/elle', correctAnswer: 'a' },
        { pronoun: 'nous', correctAnswer: 'avons' },
        { pronoun: 'vous', correctAnswer: 'avez' },
        { pronoun: 'ils/elles', correctAnswer: 'ont' }
      ]
    },
    {
      id: 'parler-present',
      verb: 'parler',
      tense: 'présent',
      description: 'The verb "parler" (to speak) is a regular -er verb, which is the most common verb group in French.',
      difficulty: 'beginner',
      group: 1,
      conjugations: [
        { pronoun: 'je', correctAnswer: 'parle' },
        { pronoun: 'tu', correctAnswer: 'parles' },
        { pronoun: 'il/elle', correctAnswer: 'parle' },
        { pronoun: 'nous', correctAnswer: 'parlons' },
        { pronoun: 'vous', correctAnswer: 'parlez' },
        { pronoun: 'ils/elles', correctAnswer: 'parlent' }
      ]
    },
    {
      id: 'finir-present',
      verb: 'finir',
      tense: 'présent',
      description: 'The verb "finir" (to finish) is a regular -ir verb, which is the second most common verb group in French.',
      difficulty: 'beginner',
      group: 2,
      conjugations: [
        { pronoun: 'je', correctAnswer: 'finis' },
        { pronoun: 'tu', correctAnswer: 'finis' },
        { pronoun: 'il/elle', correctAnswer: 'finit' },
        { pronoun: 'nous', correctAnswer: 'finissons' },
        { pronoun: 'vous', correctAnswer: 'finissez' },
        { pronoun: 'ils/elles', correctAnswer: 'finissent' }
      ]
    }
  ],
  intermediate: [
    {
      id: 'aller-present',
      verb: 'aller',
      tense: 'présent',
      description: 'The verb "aller" (to go) is an irregular verb that is essential for expressing movement and future actions.',
      difficulty: 'intermediate',
      group: 'irregular',
      conjugations: [
        { pronoun: 'je', correctAnswer: 'vais' },
        { pronoun: 'tu', correctAnswer: 'vas' },
        { pronoun: 'il/elle', correctAnswer: 'va' },
        { pronoun: 'nous', correctAnswer: 'allons' },
        { pronoun: 'vous', correctAnswer: 'allez' },
        { pronoun: 'ils/elles', correctAnswer: 'vont' }
      ]
    },
    {
      id: 'faire-present',
      verb: 'faire',
      tense: 'présent',
      description: 'The verb "faire" (to do/make) is an irregular verb used in many common expressions.',
      difficulty: 'intermediate',
      group: 'irregular',
      conjugations: [
        { pronoun: 'je', correctAnswer: 'fais' },
        { pronoun: 'tu', correctAnswer: 'fais' },
        { pronoun: 'il/elle', correctAnswer: 'fait' },
        { pronoun: 'nous', correctAnswer: 'faisons' },
        { pronoun: 'vous', correctAnswer: 'faites' },
        { pronoun: 'ils/elles', correctAnswer: 'font' }
      ]
    },
    {
      id: 'prendre-present',
      verb: 'prendre',
      tense: 'présent',
      description: 'The verb "prendre" (to take) is an irregular -re verb with many common derivatives.',
      difficulty: 'intermediate',
      group: 3,
      conjugations: [
        { pronoun: 'je', correctAnswer: 'prends' },
        { pronoun: 'tu', correctAnswer: 'prends' },
        { pronoun: 'il/elle', correctAnswer: 'prend' },
        { pronoun: 'nous', correctAnswer: 'prenons' },
        { pronoun: 'vous', correctAnswer: 'prenez' },
        { pronoun: 'ils/elles', correctAnswer: 'prennent' }
      ]
    },
    {
      id: 'parler-passe-compose',
      verb: 'parler',
      tense: 'passé composé',
      description: 'The passé composé of "parler" (to speak) is formed with the auxiliary verb "avoir" and the past participle "parlé".',
      difficulty: 'intermediate',
      group: 1,
      conjugations: [
        { pronoun: 'j\'', correctAnswer: 'ai parlé' },
        { pronoun: 'tu', correctAnswer: 'as parlé' },
        { pronoun: 'il/elle', correctAnswer: 'a parlé' },
        { pronoun: 'nous', correctAnswer: 'avons parlé' },
        { pronoun: 'vous', correctAnswer: 'avez parlé' },
        { pronoun: 'ils/elles', correctAnswer: 'ont parlé' }
      ]
    }
  ],
  advanced: [
    {
      id: 'etre-subjonctif',
      verb: 'être',
      tense: 'subjonctif présent',
      description: 'The subjunctive mood of "être" (to be) is used to express wishes, emotions, doubts, and possibilities.',
      difficulty: 'advanced',
      group: 'irregular',
      conjugations: [
        { pronoun: 'que je', correctAnswer: 'sois' },
        { pronoun: 'que tu', correctAnswer: 'sois' },
        { pronoun: 'qu\'il/elle', correctAnswer: 'soit' },
        { pronoun: 'que nous', correctAnswer: 'soyons' },
        { pronoun: 'que vous', correctAnswer: 'soyez' },
        { pronoun: 'qu\'ils/elles', correctAnswer: 'soient' }
      ]
    },
    {
      id: 'avoir-conditionnel',
      verb: 'avoir',
      tense: 'conditionnel présent',
      description: 'The conditional mood of "avoir" (to have) is used to express hypothetical situations and polite requests.',
      difficulty: 'advanced',
      group: 'irregular',
      conjugations: [
        { pronoun: 'je', correctAnswer: 'aurais' },
        { pronoun: 'tu', correctAnswer: 'aurais' },
        { pronoun: 'il/elle', correctAnswer: 'aurait' },
        { pronoun: 'nous', correctAnswer: 'aurions' },
        { pronoun: 'vous', correctAnswer: 'auriez' },
        { pronoun: 'ils/elles', correctAnswer: 'auraient' }
      ]
    },
    {
      id: 'venir-passe-simple',
      verb: 'venir',
      tense: 'passé simple',
      description: 'The passé simple of "venir" (to come) is a literary tense used in formal writing.',
      difficulty: 'advanced',
      group: 'irregular',
      conjugations: [
        { pronoun: 'je', correctAnswer: 'vins' },
        { pronoun: 'tu', correctAnswer: 'vins' },
        { pronoun: 'il/elle', correctAnswer: 'vint' },
        { pronoun: 'nous', correctAnswer: 'vînmes' },
        { pronoun: 'vous', correctAnswer: 'vîntes' },
        { pronoun: 'ils/elles', correctAnswer: 'vinrent' }
      ]
    },
    {
      id: 'aller-plus-que-parfait',
      verb: 'aller',
      tense: 'plus-que-parfait',
      description: 'The plus-que-parfait (pluperfect) of "aller" (to go) is used to express actions that happened before another past action.',
      difficulty: 'advanced',
      group: 'irregular',
      conjugations: [
        { pronoun: 'j\'', correctAnswer: 'étais allé(e)' },
        { pronoun: 'tu', correctAnswer: 'étais allé(e)' },
        { pronoun: 'il/elle', correctAnswer: 'était allé(e)' },
        { pronoun: 'nous', correctAnswer: 'étions allé(e)s' },
        { pronoun: 'vous', correctAnswer: 'étiez allé(e)(s)' },
        { pronoun: 'ils/elles', correctAnswer: 'étaient allé(e)s' }
      ]
    }
  ]
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<VerbConjugationExercise[] | VerbConjugationExercise>>
) {
  // GET request to retrieve verb conjugation exercises
  if (req.method === 'GET') {
    try {
      const { id, difficulty, verb, tense, group } = req.query;
      
      // If ID is provided, return that specific exercise
      if (id) {
        // Find the exercise across all difficulty levels
        let exercise: VerbConjugationExercise | undefined;
        
        for (const difficultyLevel in verbConjugationExercises) {
          exercise = verbConjugationExercises[difficultyLevel].find(
            ex => ex.id === id
          );
          
          if (exercise) break;
        }
        
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
      
      // Get exercises based on difficulty
      let exercises: VerbConjugationExercise[] = [];
      
      if (difficulty && verbConjugationExercises[difficulty as string]) {
        exercises = [...verbConjugationExercises[difficulty as string]];
      } else {
        // If no difficulty specified, return all exercises
        Object.values(verbConjugationExercises).forEach(difficultyExercises => {
          exercises = [...exercises, ...difficultyExercises];
        });
      }
      
      // Filter by verb if provided
      if (verb) {
        exercises = exercises.filter(ex => ex.verb === verb);
      }
      
      // Filter by tense if provided
      if (tense) {
        exercises = exercises.filter(ex => ex.tense === tense);
      }
      
      // Filter by group if provided
      if (group) {
        exercises = exercises.filter(ex => ex.group === group);
      }
      
      return res.status(200).json({
        success: true,
        data: exercises
      });
    } catch (error) {
      console.error('Error fetching verb conjugation exercises:', error);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error'
        }
      });
    }
  }
  
  // POST request to check conjugation answers
  if (req.method === 'POST') {
    try {
      const { exerciseId, answers } = req.body;
      
      // Validate required fields
      if (!exerciseId || !answers || !Array.isArray(answers)) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Missing required fields or invalid format'
          }
        });
      }
      
      // Find the exercise
      let exercise: VerbConjugationExercise | undefined;
      
      for (const difficultyLevel in verbConjugationExercises) {
        exercise = verbConjugationExercises[difficultyLevel].find(
          ex => ex.id === exerciseId
        );
        
        if (exercise) break;
      }
      
      if (!exercise) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Exercise not found'
          }
        });
      }
      
      // Check answers
      const results = answers.map((answer: { pronoun: string; answer: string }) => {
        const conjugation = exercise!.conjugations.find(c => c.pronoun === answer.pronoun);
        
        if (!conjugation) {
          return {
            pronoun: answer.pronoun,
            isCorrect: false,
            correctAnswer: 'Unknown',
            userAnswer: answer.answer
          };
        }
        
        return {
          pronoun: answer.pronoun,
          isCorrect: answer.answer.trim().toLowerCase() === conjugation.correctAnswer.toLowerCase(),
          correctAnswer: conjugation.correctAnswer,
          userAnswer: answer.answer
        };
      });
      
      // Calculate score
      const correctCount = results.filter(result => result.isCorrect).length;
      const totalCount = results.length;
      const score = Math.round((correctCount / totalCount) * 100);
      
      return res.status(200).json({
        success: true,
        data: {
          results,
          score,
          totalCorrect: correctCount,
          totalQuestions: totalCount
        }
      });
    } catch (error) {
      console.error('Error checking conjugation answers:', error);
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
