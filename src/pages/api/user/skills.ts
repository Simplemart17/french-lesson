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

      // Since we might not have the UserSkill model in your schema yet,
      // we'll generate skills based on the user's level
      const defaultPercentages = {
        beginner: { base: 20, variation: 15 },
        intermediate: { base: 50, variation: 15 },
        advanced: { base: 75, variation: 10 },
      };

      // Determine base percentage based on user level
      const level = (user.level as 'beginner' | 'intermediate' | 'advanced') || 'beginner';
      const { base, variation } = defaultPercentages[level];

      // Generate skills with some randomization
      const skills: SkillResponse[] = [
        { skill: 'Listening', level: level === 'beginner' ? 'A1' : level === 'intermediate' ? 'B1' : 'C1', percentage: base + Math.floor(Math.random() * variation) },
        { skill: 'Speaking', level: level === 'beginner' ? 'A1' : level === 'intermediate' ? 'B1' : 'C1', percentage: base - Math.floor(Math.random() * variation) },
        { skill: 'Reading', level: level === 'beginner' ? 'A2' : level === 'intermediate' ? 'B2' : 'C1', percentage: base + Math.floor(Math.random() * variation) },
        { skill: 'Writing', level: level === 'beginner' ? 'A1' : level === 'intermediate' ? 'B1' : 'C1', percentage: base - Math.floor(Math.random() * variation) },
        { skill: 'Grammar', level: level === 'beginner' ? 'A1' : level === 'intermediate' ? 'B1' : 'C1', percentage: base },
        { skill: 'Vocabulary', level: level === 'beginner' ? 'A2' : level === 'intermediate' ? 'B2' : 'C1', percentage: base + Math.floor(Math.random() * variation) },
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