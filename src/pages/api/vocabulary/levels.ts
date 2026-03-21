import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '@/utils/authMiddleware';
import { supabase, TABLES } from '@/lib/supabase';

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
    const { data: vocabulary, error } = await supabase
      .from(TABLES.VOCABULARY)
      .select('level');

    if (error) {
      console.error('Error fetching vocabulary:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to fetch vocabulary levels' }
      });
    }

    // Extract unique levels
    const levels = new Set<string>();
    (vocabulary || []).forEach((item: { level?: string }) => {
      if (item.level) {
        levels.add(item.level);
      }
    });

    // Convert Set to array and sort by level
    const sortedLevels = Array.from(levels).sort((a, b) => {
      // Sort by CEFR level (A1, A2, B1, B2, C1, C2)
      const levelOrder: Record<string, number> = {
        'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6
      };
      
      return (levelOrder[a] || 99) - (levelOrder[b] || 99);
    });

    return res.status(200).json({
      success: true,
      data: sortedLevels,
      levels: sortedLevels
    });
  } catch (error) {
    console.error('Error fetching vocabulary levels:', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch vocabulary levels' }
    });
  }
}

export default authMiddleware(handler);
