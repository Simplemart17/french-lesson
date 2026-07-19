import type { NextApiResponse } from 'next';
import { getOpenAIClient, safeJSONParse } from '@/utils/openaiClient';
import { authMiddleware } from '@/utils/authMiddleware';
import { AuthenticatedRequest } from '@/types/api';
import { supabaseAdmin, TABLES } from '@/lib/supabase';
import { getOrCreateUserProfile } from '@/utils/userProfile';
import { isCefrLevel } from '@/lib/curriculum';
import { checkRateLimit } from '@/utils/rateLimit';

const MAX_LESSONS_PER_LEVEL = 40;
const LESSONS_PER_EXPANSION = 6;
const MIN_COMPLETION_TO_EXPAND = 0.6;

const ALLOWED_TOPICS = [
  'grammar', 'vocabulary', 'conversation', 'pronunciation',
  'listening', 'reading', 'writing', 'culture', 'conjugation'
];

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: { message: 'User not authenticated' } });
    }

    // Curriculum expansion is a paid model call plus a privileged write
    if (!checkRateLimit(`expand:${userId}`, 5, 60 * 60 * 1000)) {
      return res.status(429).json({
        success: false,
        error: { message: 'You are expanding your curriculum very quickly — take a short break and try again.' }
      });
    }

    // The lessons INSERT requires the service-role client (RLS allows public
    // read only); fail explicitly instead of a confusing RLS 500
    if (!supabaseAdmin) {
      return res.status(503).json({
        success: false,
        error: { message: 'Curriculum expansion is not available: server is missing its service credentials.' }
      });
    }

    const { data: user } = await getOrCreateUserProfile(userId);
    const level = isCefrLevel(user?.level) ? user!.level : 'A1';

    const db = supabaseAdmin;

    const { data: lessonRows, error: lessonError } = await db
      .from(TABLES.LESSONS)
      .select(`id, title, order_index, ${TABLES.LESSON_PROGRESS}(completed)`)
      .eq('level', level)
      .eq(`${TABLES.LESSON_PROGRESS}.user_id`, userId);

    if (lessonError) {
      throw new Error(`Failed to fetch lessons: ${lessonError.message}`);
    }

    interface Row { id: string; title: string; order_index: number | null; lesson_progress?: Array<{ completed: boolean }> }
    const lessons = (lessonRows || []) as unknown as Row[];

    if (lessons.length >= MAX_LESSONS_PER_LEVEL) {
      return res.status(400).json({
        success: false,
        error: { message: `Level ${level} already has the maximum number of lessons.` }
      });
    }

    const completed = lessons.filter((l) => l.lesson_progress?.[0]?.completed).length;
    if (lessons.length > 0 && completed / lessons.length < MIN_COMPLETION_TO_EXPAND) {
      return res.status(400).json({
        success: false,
        error: { message: 'Complete more of your current lessons before generating new ones.' }
      });
    }

    const existingTitles = lessons.map((l) => l.title);
    const maxOrder = lessons.reduce((max, l) => Math.max(max, l.order_index || 0), 0);
    const count = Math.min(LESSONS_PER_EXPANSION, MAX_LESSONS_PER_LEVEL - lessons.length);

    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a French curriculum designer. Create ${count} NEW lesson outlines for CEFR level ${level} that extend an existing curriculum without repeating it.

Existing lesson titles at this level (do NOT duplicate these themes):
${existingTitles.map((t) => `- ${t}`).join('\n')}

Respond with ONLY a JSON object:
{
  "lessons": [
    {
      "title": "concise lesson title",
      "description": "one-sentence learner-facing description",
      "topics": ["grammar"],
      "duration": 20
    }
  ]
}

Each lesson's "topics" must contain 1-3 values from: ${ALLOWED_TOPICS.join(', ')}. Never include the topic "exam". Duration is 15-30 minutes. Cover a balanced mix of skills the existing titles neglect.`
        },
        { role: 'user', content: 'Generate the lessons now.' }
      ],
      temperature: 0.8,
      max_tokens: 1200,
      response_format: { type: 'json_object' }
    });

    const parsed = safeJSONParse(response.choices[0].message.content || '{}');
    const generated = Array.isArray(parsed.lessons) ? parsed.lessons : [];

    interface GeneratedLesson { title?: string; description?: string; topics?: string[]; duration?: number }
    const rows = (generated as GeneratedLesson[])
      .filter((lesson) => lesson.title && lesson.description)
      .slice(0, count)
      .map((lesson, index) => ({
        title: lesson.title!,
        description: lesson.description!,
        level,
        duration: Math.min(Math.max(Number(lesson.duration) || 20, 15), 30),
        topics: (lesson.topics || ['vocabulary'])
          .filter((topic) => ALLOWED_TOPICS.includes(topic))
          .slice(0, 3),
        // New lessons continue after the current curriculum (checkpoint included)
        order_index: maxOrder + index + 1
      }));

    if (rows.length === 0) {
      return res.status(502).json({
        success: false,
        error: { message: 'Could not generate new lessons. Please try again.' }
      });
    }

    const { data: inserted, error: insertError } = await db
      .from(TABLES.LESSONS)
      .insert(rows)
      .select('id, title, description, level, duration, topics, order_index');

    if (insertError) {
      throw new Error(`Failed to insert lessons: ${insertError.message}`);
    }

    return res.status(201).json({
      success: true,
      data: { lessons: inserted || [], level }
    });
  } catch (error) {
    console.error('Lesson expansion error:', error);
    return res.status(500).json({ success: false, error: { message: 'Failed to expand curriculum' } });
  }
}

export default authMiddleware(handler);
