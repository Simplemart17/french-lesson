import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { authMiddleware } from '@/utils/authMiddleware';
import { prisma } from '@/lib/prisma';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: { message: 'Method not allowed' }
    });
  }

  try {
    // Get all vocabulary items
    const vocabulary = await prisma.vocabulary.findMany({
      select: {
        category: true
      }
    });

    // Extract unique categories
    const categories = new Set<string>();
    vocabulary.forEach(item => {
      if (item.category) {
        categories.add(item.category);
      }
    });

    // Convert Set to array and sort alphabetically
    const sortedCategories = Array.from(categories).sort();

    return res.status(200).json({
      success: true,
      data: sortedCategories
    });
  } catch (error) {
    console.error('Error fetching vocabulary categories:', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch vocabulary categories' }
    });
  }
}

export default authMiddleware(handler);
