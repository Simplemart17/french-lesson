import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, LessonSection } from '@/types/api';
import { authMiddleware } from '@/utils/authMiddleware';
import { supabase, TABLES } from '@/lib/supabase';

interface LessonSectionRow {
  id: string;
  lesson_id: string;
  title: string;
  type: LessonSection['type'];
  content: string | null;
  order_index: number;
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<LessonSection[]>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid lesson ID'
        }
      });
    }

    const { data, error } = await supabase
      .from(TABLES.LESSON_SECTIONS)
      .select('id,lesson_id,title,type,content,order_index')
      .eq('lesson_id', id)
      .order('order_index', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch lesson sections: ${error.message}`);
    }

    const sections: LessonSection[] = ((data || []) as LessonSectionRow[]).map((section) => ({
      id: section.id,
      lessonId: section.lesson_id,
      title: section.title,
      type: section.type,
      content: section.content || undefined,
      order: section.order_index
    }));

    return res.status(200).json({
      success: true,
      data: sections
    });
  } catch (error) {
    console.error('Error fetching lesson sections:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch lesson sections'
      }
    });
  }
}

export default authMiddleware(handler);
