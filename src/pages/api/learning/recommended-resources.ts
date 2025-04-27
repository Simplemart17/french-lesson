import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { isAuthenticated, getUserId } from '@/utils/auth';

type ResourceItem = {
  id: string;
  title: string;
  type: 'lesson' | 'exercise' | 'article';
  description: string;
  level: string;
  imageUrl?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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

    // Get user data to determine their level
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { level: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userLevel = user.level;

    // Get lessons for the user's level without checking progress
    const lessons = await prisma.lesson.findMany({
      where: {
        level: userLevel,
      },
      take: 3,
    });

    // Transform lessons into resource items
    let resources: ResourceItem[] = lessons.map((lesson: any) => ({
      id: lesson.id,
      title: lesson.title,
      type: 'lesson',
      description: lesson.description || 'Practice this lesson to improve your French',
      level: lesson.level,
      imageUrl: lesson.imageUrl || '/images/lesson-default.jpg',
    }));

    // If we have fewer than 3 resources, add some mock grammar exercises
    if (resources.length < 3) {
      const mockExercises = [
        {
          id: 'grammar-1',
          title: 'Present Tense Practice',
          type: 'exercise' as const,
          description: 'Practice conjugating verbs in the present tense',
          level: userLevel,
          imageUrl: '/images/grammar-exercise.jpg',
        },
        {
          id: 'grammar-2',
          title: 'Past Tense Practice',
          type: 'exercise' as const,
          description: 'Master the passé composé and imparfait',
          level: userLevel,
          imageUrl: '/images/grammar-exercise.jpg',
        },
      ];

      // Add mock exercises until we have at least 3 resources
      for (let i = 0; i < mockExercises.length && resources.length < 3; i++) {
        resources.push(mockExercises[i]);
      }
    }

    return res.status(200).json({ resources });
  } catch (error) {
    console.error('Error fetching recommended resources:', error);
    return res.status(500).json({ error: 'Failed to fetch recommended resources' });
  }
}