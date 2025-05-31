import type { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '../../../utils/authMiddleware';
import { prisma } from '../../../lib/prisma';

interface PracticeItemWithVocabulary {
  id: string;
  sessionId: string;
  vocabularyId: string;
  exerciseType: string;
  isCorrect: boolean;
  userAnswer: string;
  expectedAnswer: string;
  vocabulary?: {
    id: string;
    word: string;
    translation: string;
    example: string;
    level: string;
  };
}

interface PracticeItemInput {
  vocabularyId: string;
  exerciseType: string;
  isCorrect: boolean;
  userAnswer: string;
  expectedAnswer: string;
}

interface SessionWithStats {
  id: string;
  userId: string;
  type: string;
  duration: number;
  createdAt: Date;
  practiceItems: PracticeItemWithVocabulary[];
  stats: {
    correct: number;
    total: number;
    accuracy: number;
  };
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get user ID from authenticated user
  const userId = (req as any).user?.id;
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: { message: 'User not authenticated' }
    });
  }

  // GET request to retrieve practice sessions
  if (req.method === 'GET') {
    try {
      const { limit = '10' } = req.query;
      const take = parseInt(limit as string, 10);
      
      const sessions = await prisma.practiceSession.findMany({
        where: {
          userId
        },
        orderBy: {
          createdAt: 'desc'
        },
        take,
        include: {
          practiceItems: {
            include: {
              vocabulary: true
            }
          }
        }
      });
      
      // Calculate statistics for each session
      const sessionsWithStats: SessionWithStats[] = sessions.map(session => {
        const correctCount = session.practiceItems.filter(item => item.isCorrect).length;
        const totalCount = session.practiceItems.length;
        const accuracy = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;
        
        return {
          ...session,
          stats: {
            correct: correctCount,
            total: totalCount,
            accuracy: Math.round(accuracy * 10) / 10
          }
        };
      });
      
      return res.status(200).json({
        success: true,
        data: sessionsWithStats
      });
    } catch (error) {
      console.error('Error fetching practice sessions:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to fetch practice sessions' }
      });
    }
  }
  
  // POST request to create a new practice session
  if (req.method === 'POST') {
    try {
      const { type, duration, practiceItems } = req.body;
      
      if (!type || !practiceItems || !Array.isArray(practiceItems) || practiceItems.length === 0) {
        return res.status(400).json({
          success: false,
          error: { message: 'Missing required session information' }
        });
      }
      
      // Create new practice session
      const session = await prisma.practiceSession.create({
        data: {
          userId,
          type,
          duration: duration || 0,
          practiceItems: {
            create: practiceItems.map((item: PracticeItemInput) => ({
              vocabularyId: item.vocabularyId,
              exerciseType: item.exerciseType,
              isCorrect: item.isCorrect,
              userAnswer: item.userAnswer || '',
              expectedAnswer: item.expectedAnswer
            }))
          }
        },
        include: {
          practiceItems: true
        }
      });
      
      // Update learned status for each vocabulary item based on performance
      await Promise.all(
        practiceItems.map(async (item: PracticeItemInput) => {
          if (item.isCorrect) {
            // Find how many times this vocabulary item has been correct
            const correctCount = await prisma.practiceItem.count({
              where: {
                vocabularyId: item.vocabularyId,
                isCorrect: true
              }
            });
            
            // If correctly answered 3 or more times, mark as learned
            if (correctCount >= 3) {
              await prisma.userVocabulary.update({
                where: {
                  userId_vocabularyId: {
                    userId,
                    vocabularyId: item.vocabularyId
                  }
                },
                data: {
                  learned: true,
                  lastPracticed: new Date()
                }
              });
            }
          }
          
          // Update lastPracticed regardless of correctness
          await prisma.userVocabulary.update({
            where: {
              userId_vocabularyId: {
                userId,
                vocabularyId: item.vocabularyId
              }
            },
            data: {
              lastPracticed: new Date()
            }
          });
        })
      );
      
      return res.status(201).json({
        success: true,
        data: session
      });
    } catch (error) {
      console.error('Error creating practice session:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to create practice session' }
      });
    }
  }
  
  return res.status(405).json({ 
    success: false, 
    error: { message: 'Method not allowed' } 
  });
}

export default authMiddleware(handler); 