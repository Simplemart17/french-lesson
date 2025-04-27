import type { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '../../../utils/authMiddleware';
import { prisma } from '../../../lib/prisma';
import { getUserId } from '@/utils/auth';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get user ID from authenticated user
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: { message: 'User not authenticated' }
    });
  }

  // GET request to retrieve user's vocabulary
  if (req.method === 'GET') {
    try {
      const vocabularyItems = await prisma.userVocabulary.findMany({
        where: {
          userId
        },
        include: {
          vocabulary: true
        },
        orderBy: {
          lastPracticed: 'desc'
        }
      });
      
      return res.status(200).json({
        success: true,
        data: vocabularyItems
      });
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to fetch vocabulary' }
      });
    }
  }
  
  // POST request to add vocabulary to user's list
  if (req.method === 'POST') {
    try {
      const { vocabularyId, learned } = req.body;
      
      if (!vocabularyId) {
        return res.status(400).json({
          success: false,
          error: { message: 'Missing required vocabulary ID' }
        });
      }
      
      // Check if vocabulary exists
      const vocabularyExists = await prisma.vocabulary.findUnique({
        where: { id: vocabularyId }
      });
      
      if (!vocabularyExists) {
        return res.status(404).json({
          success: false,
          error: { message: 'Vocabulary not found' }
        });
      }
      
      // Create or update user vocabulary
      const userVocabulary = await prisma.userVocabulary.upsert({
        where: {
          userId_vocabularyId: {
            userId,
            vocabularyId
          }
        },
        update: {
          learned: learned !== undefined ? learned : undefined,
          lastPracticed: new Date()
        },
        create: {
          userId,
          vocabularyId,
          learned: learned || false,
          lastPracticed: new Date()
        }
      });
      
      return res.status(201).json({
        success: true,
        data: userVocabulary
      });
    } catch (error) {
      console.error('Error managing vocabulary:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to manage vocabulary' }
      });
    }
  }
  
  // DELETE request to remove vocabulary from user's list
  if (req.method === 'DELETE') {
    try {
      const { vocabularyId } = req.body;
      
      if (!vocabularyId) {
        return res.status(400).json({
          success: false,
          error: { message: 'Missing required vocabulary ID' }
        });
      }
      
      // Delete the user vocabulary entry
      await prisma.userVocabulary.delete({
        where: {
          userId_vocabularyId: {
            userId,
            vocabularyId
          }
        }
      });
      
      return res.status(200).json({
        success: true,
        message: 'Vocabulary removed successfully'
      });
    } catch (error) {
      console.error('Error removing vocabulary:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to remove vocabulary' }
      });
    }
  }
  
  return res.status(405).json({ 
    success: false, 
    error: { message: 'Method not allowed' } 
  });
}

export default authMiddleware(handler);
