import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, TABLES } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: {
        message: 'Method not allowed'
      }
    });
  }

  try {
    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid audio ID'
        }
      });
    }

    const { data: exercise, error } = await supabase
      .from(TABLES.PRONUNCIATION_EXERCISES)
      .select('text')
      .eq('id', id)
      .single();

    if (error || !exercise?.text) {
      return res.status(404).json({
        success: false,
        error: {
          message: `Audio source with ID ${id} not found`
        }
      });
    }

    const ttsUrl = `/api/tts?text=${encodeURIComponent(exercise.text)}&lang=fr`;
    return res.redirect(307, ttsUrl);
  } catch (error) {
    console.error('Error in pronunciation audio API:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
}
