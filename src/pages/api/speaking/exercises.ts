import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';

// Define the speaking exercise type
interface SpeakingExercise {
  id: number;
  prompt: string;
  translation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category?: 'greetings' | 'travel' | 'dining' | 'everyday' | 'business' | 'shopping';
}

// Define the feedback type for speaking evaluation
interface SpeakingFeedback {
  accuracy: number;
  pronunciation: number;
  fluency: number;
  feedback: string;
  type: 'success' | 'warning' | 'error';
}

// Mock speaking exercises
const speakingExercises: Record<string, SpeakingExercise[]> = {
  beginner: [
    {
      id: 1,
      prompt: 'Comment allez-vous aujourd\'hui?',
      translation: 'How are you today?',
      difficulty: 'beginner',
      category: 'greetings'
    },
    {
      id: 2,
      prompt: 'Je m\'appelle Marie. Et vous?',
      translation: 'My name is Marie. And you?',
      difficulty: 'beginner',
      category: 'greetings'
    },
    {
      id: 3,
      prompt: 'Où est la boulangerie?',
      translation: 'Where is the bakery?',
      difficulty: 'beginner',
      category: 'travel'
    },
    {
      id: 4,
      prompt: 'Je voudrais un café, s\'il vous plaît.',
      translation: 'I would like a coffee, please.',
      difficulty: 'beginner',
      category: 'dining'
    },
    {
      id: 5,
      prompt: 'Quelle heure est-il?',
      translation: 'What time is it?',
      difficulty: 'beginner',
      category: 'everyday'
    },
    {
      id: 6,
      prompt: 'Combien ça coûte?',
      translation: 'How much does it cost?',
      difficulty: 'beginner',
      category: 'shopping'
    }
  ],
  intermediate: [
    {
      id: 7,
      prompt: 'Pourriez-vous me recommander un bon restaurant dans le quartier?',
      translation: 'Could you recommend a good restaurant in the area?',
      difficulty: 'intermediate',
      category: 'dining'
    },
    {
      id: 8,
      prompt: 'Je cherche un hôtel pas trop cher pour trois nuits.',
      translation: 'I\'m looking for a reasonably priced hotel for three nights.',
      difficulty: 'intermediate',
      category: 'travel'
    },
    {
      id: 9,
      prompt: 'Excusez-moi, je me suis perdu. Pouvez-vous m\'aider?',
      translation: 'Excuse me, I\'m lost. Can you help me?',
      difficulty: 'intermediate',
      category: 'travel'
    },
    {
      id: 10,
      prompt: 'J\'ai réservé une table pour deux personnes à 20h.',
      translation: 'I\'ve reserved a table for two people at 8 PM.',
      difficulty: 'intermediate',
      category: 'dining'
    },
    {
      id: 11,
      prompt: 'Quels sont vos horaires d\'ouverture?',
      translation: 'What are your opening hours?',
      difficulty: 'intermediate',
      category: 'everyday'
    },
    {
      id: 12,
      prompt: 'Je voudrais essayer cette veste en taille moyenne.',
      translation: 'I would like to try this jacket in medium size.',
      difficulty: 'intermediate',
      category: 'shopping'
    }
  ],
  advanced: [
    {
      id: 13,
      prompt: 'Je suis désolé, mais je ne suis pas d\'accord avec votre analyse de la situation.',
      translation: 'I\'m sorry, but I don\'t agree with your analysis of the situation.',
      difficulty: 'advanced',
      category: 'business'
    },
    {
      id: 14,
      prompt: 'Nous devrions envisager d\'autres options avant de prendre une décision finale.',
      translation: 'We should consider other options before making a final decision.',
      difficulty: 'advanced',
      category: 'business'
    },
    {
      id: 15,
      prompt: 'Pourriez-vous m\'expliquer les implications de cette nouvelle politique?',
      translation: 'Could you explain the implications of this new policy to me?',
      difficulty: 'advanced',
      category: 'business'
    },
    {
      id: 16,
      prompt: 'J\'ai eu un problème avec ma réservation et j\'aimerais parler au responsable.',
      translation: 'I had a problem with my reservation and I would like to speak to the manager.',
      difficulty: 'advanced',
      category: 'travel'
    },
    {
      id: 17,
      prompt: 'Les transports en commun sont-ils fiables dans cette ville?',
      translation: 'Is public transportation reliable in this city?',
      difficulty: 'advanced',
      category: 'travel'
    },
    {
      id: 18,
      prompt: 'Je cherche un cadeau pour quelqu\'un qui s\'intéresse à l\'art contemporain.',
      translation: 'I\'m looking for a gift for someone who is interested in contemporary art.',
      difficulty: 'advanced',
      category: 'shopping'
    }
  ]
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<SpeakingExercise[] | SpeakingExercise | SpeakingFeedback>>
) {
  // GET request to retrieve speaking exercises
  if (req.method === 'GET') {
    try {
      const { id, difficulty, category } = req.query;

      // If ID is provided, return that specific exercise
      if (id) {
        // Find the exercise across all difficulty levels
        let exercise: SpeakingExercise | undefined;

        for (const difficultyLevel in speakingExercises) {
          exercise = speakingExercises[difficultyLevel].find(
            ex => ex.id === parseInt(id as string)
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
      let exercises: SpeakingExercise[] = [];

      if (difficulty && speakingExercises[difficulty as string]) {
        exercises = [...speakingExercises[difficulty as string]];
      } else {
        // If no difficulty specified, return all exercises
        Object.values(speakingExercises).forEach(difficultyExercises => {
          exercises = [...exercises, ...difficultyExercises];
        });
      }

      // Filter by category if provided
      if (category) {
        exercises = exercises.filter(ex => ex.category === category);
      }

      return res.status(200).json({
        success: true,
        data: exercises
      });
    } catch (error) {
      console.error('Error fetching speaking exercises:', error);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error'
        }
      });
    }
  }

  // POST request to evaluate speaking
  if (req.method === 'POST') {
    try {
      const { exerciseId, transcript } = req.body;

      // Validate required fields
      if (!exerciseId || !transcript) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Missing required fields'
          }
        });
      }

      // Find the exercise
      let exercise: SpeakingExercise | undefined;

      for (const difficultyLevel in speakingExercises) {
        exercise = speakingExercises[difficultyLevel].find(
          ex => ex.id === parseInt(exerciseId)
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

      // In a real app, this would use a speech recognition API to evaluate the pronunciation
      // For now, we'll just simulate feedback based on the transcript length

      const feedback: SpeakingFeedback = {
        accuracy: Math.random() * 100,
        pronunciation: Math.random() * 100,
        fluency: Math.random() * 100,
        feedback: transcript.length > 20
          ? 'Excellent pronunciation! Your accent is very natural.'
          : transcript.length > 10
            ? 'Good attempt! Try to focus on the "r" sound in French.'
            : 'Try again. Pay attention to the pronunciation of vowels.',
        type: transcript.length > 20
          ? 'success'
          : transcript.length > 10
            ? 'warning'
            : 'error'
      };

      return res.status(200).json({
        success: true,
        data: feedback
      });
    } catch (error) {
      console.error('Error evaluating speaking:', error);
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
