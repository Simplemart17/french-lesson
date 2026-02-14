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
      .select('category');

    if (error) {
      console.error('Error fetching vocabulary:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to fetch vocabulary categories' }
      });
    }

    // Extract unique categories
    const categories = new Set<string>();
    (vocabulary || []).forEach((item: { category?: string }) => {
      if (item.category) {
        categories.add(item.category);
      }
    });

    // Convert Set to array and sort alphabetically
    const sortedCategories = Array.from(categories).sort();

    return res.status(200).json({
      success: true,
      data: sortedCategories,
      categories: sortedCategories
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
