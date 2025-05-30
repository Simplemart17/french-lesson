import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { isAuthenticated, getUserId } from '@/utils/auth';

interface SkillResponse {
  skill: string;
  level: string;
  percentage: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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

  if (req.method === 'GET') {
    try {
      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: { message: 'User not found' }
        });
      }

      // Get lesson progress to calculate skills based on real data
      const lessonProgress = await prisma.lessonProgress.findMany({
        where: {
          userId,
          completed: true
        },
        include: {
          lesson: {
            select: {
              topics: true,
              level: true
            }
          }
        }
      });

      // Get vocabulary progress
      const vocabularyCount = await prisma.userVocabulary.count({
        where: {
          userId,
          learned: true
        }
      });

      // Calculate skill levels based on actual progress
      const completedLessons = lessonProgress.length;
      const basePercentage = Math.min(80, completedLessons * 3); // Base skill from lesson completion

      // Calculate specific skill percentages
      const listeningLessons = lessonProgress.filter(p =>
        p.lesson.topics.includes('listening') || p.lesson.topics.includes('comprehension')
      ).length;

      const speakingLessons = lessonProgress.filter(p =>
        p.lesson.topics.includes('speaking') || p.lesson.topics.includes('pronunciation') || p.lesson.topics.includes('conversation')
      ).length;

      const readingLessons = lessonProgress.filter(p =>
        p.lesson.topics.includes('reading')
      ).length;

      const writingLessons = lessonProgress.filter(p =>
        p.lesson.topics.includes('writing')
      ).length;

      const grammarLessons = lessonProgress.filter(p =>
        p.lesson.topics.includes('grammar')
      ).length;

      // Map user level to CEFR level
      const cefrLevel = mapUserLevelToCEFR(user.level);

      const skills: SkillResponse[] = [
        {
          skill: 'Listening',
          level: cefrLevel,
          percentage: Math.min(100, Math.max(20, basePercentage + listeningLessons * 5))
        },
        {
          skill: 'Speaking',
          level: cefrLevel,
          percentage: Math.min(100, Math.max(15, basePercentage + speakingLessons * 6))
        },
        {
          skill: 'Reading',
          level: cefrLevel,
          percentage: Math.min(100, Math.max(25, basePercentage + readingLessons * 7))
        },
        {
          skill: 'Writing',
          level: cefrLevel,
          percentage: Math.min(100, Math.max(10, basePercentage + writingLessons * 8))
        },
        {
          skill: 'Grammar',
          level: cefrLevel,
          percentage: Math.min(100, Math.max(20, basePercentage + grammarLessons * 6))
        },
        {
          skill: 'Vocabulary',
          level: cefrLevel,
          percentage: Math.min(100, Math.max(30, basePercentage + Math.floor(vocabularyCount / 5) * 3))
        }
      ];

      return res.status(200).json({
        success: true,
        data: skills
      });
    } catch (error) {
      console.error('Error fetching user skills:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to fetch user skills' }
      });
    }
  } else {
    return res.status(405).json({
      success: false,
      error: { message: 'Method not allowed' }
    });
  }
}

function mapUserLevelToCEFR(userLevel: string): string {
  switch (userLevel.toLowerCase()) {
    case 'beginner':
    case 'a1':
      return 'A1';
    case 'elementary':
    case 'a2':
      return 'A2';
    case 'intermediate':
    case 'b1':
      return 'B1';
    case 'upper-intermediate':
    case 'b2':
      return 'B2';
    case 'advanced':
    case 'c1':
      return 'C1';
    case 'proficient':
    case 'c2':
      return 'C2';
    default:
      return 'A1';
  }
}