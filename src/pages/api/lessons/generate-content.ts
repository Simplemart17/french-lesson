import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin, TABLES } from '@/lib/supabase';
import { getOpenAIClient } from '@/utils/openaiClient';
import { ApiResponse } from '@/types/api';
import { authMiddleware } from '../../../utils/authMiddleware';

const db = supabaseAdmin ?? supabase;

/**
 * Generate text using OpenAI directly (server-side).
 * This avoids the issue of aiService using relative URLs that don't work server-to-server.
 */
async function generateTextDirect(prompt: string, responseFormat: 'markdown' | 'json' = 'markdown'): Promise<string | null> {
  try {
    const openai = getOpenAIClient();
    const systemMessage = responseFormat === 'json'
      ? "You are a helpful assistant that generates French lesson content. Return ONLY valid JSON with no markdown fences or extra text."
      : "You are a helpful assistant that generates French lesson content. Return content in Markdown format only. Do NOT wrap the content in JSON. Do NOT include metadata fields like lesson_title or section_type. Just output the lesson content directly as Markdown text.";

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4096
    });
    return response.choices[0].message.content || null;
  } catch (error) {
    console.error('OpenAI generation error:', error);
    return null;
  }
}

interface GeneratedExercise {
  type: string;
  question: string;
  options?: string[] | null;
  correctAnswer: string;
  explanation: string;
}

interface GeneratedExercisePayload {
  exercises?: GeneratedExercise[];
}

interface GeneratedSection {
  title: string;
  type: string;
  content: string;
  order_index: number;
  exercises?: GeneratedExercise[];
}

interface GeneratedLessonPlan {
  sections: GeneratedSection[];
}

/**
 * Generate a full lesson structure (sections + exercises) when no sections exist.
 */
async function generateFullLesson(
  lesson: { id: string; title: string; level: string; description?: string; topics?: string[] }
) {
  const topicsStr = lesson.topics?.length ? lesson.topics.join(', ') : 'general French';

  const prompt = `Generate a complete French lesson plan as a JSON object.

Lesson Title: ${lesson.title}
Lesson Level: ${lesson.level}
Lesson Description: ${lesson.description || 'N/A'}
Topics: ${topicsStr}

Create 4-6 sections for this lesson. The response must be a valid JSON object with this exact structure:
{
  "sections": [
    {
      "title": "Section title",
      "type": "introduction",
      "content": "Markdown content for this section. Include vocabulary, examples, and explanations appropriate for ${lesson.level} level learners.",
      "order_index": 0
    },
    {
      "title": "Key Vocabulary & Phrases",
      "type": "text",
      "content": "Markdown content with vocabulary tables, example sentences, and usage notes.",
      "order_index": 1
    },
    {
      "title": "Grammar Focus",
      "type": "text",
      "content": "Markdown content explaining relevant grammar rules with examples.",
      "order_index": 2
    },
    {
      "title": "Practice Exercises",
      "type": "practice",
      "content": "Interactive practice session",
      "order_index": 3,
      "exercises": [
        {
          "type": "multiple-choice",
          "question": "Question text",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": "correct option",
          "explanation": "Why this is correct"
        },
        {
          "type": "fill-in-blank",
          "question": "Complete: Je ___ français (to speak)",
          "options": null,
          "correctAnswer": "parle",
          "explanation": "Parler conjugated for je in present tense"
        },
        {
          "type": "translation",
          "question": "Translate to French: Good morning",
          "options": null,
          "correctAnswer": "Bonjour",
          "explanation": "Bonjour is the standard French greeting"
        }
      ]
    },
    {
      "title": "Summary & Review",
      "type": "summary",
      "content": "Markdown summary of key points learned in this lesson.",
      "order_index": 4
    }
  ]
}

Requirements:
- Content sections should be detailed (200+ words each) with real French examples
- Include 5-8 exercises in the practice section with a mix of multiple-choice, fill-in-blank, translation, and true-false types
- All content must be appropriate for ${lesson.level} level
- Use Markdown formatting in content fields
- Return ONLY valid JSON, no additional text`;

  const generatedContent = await generateTextDirect(prompt, 'json');

  if (!generatedContent) {
    throw new Error('Failed to generate lesson content from AI');
  }

  // Parse the JSON response (handle potential markdown code fences and truncation)
  let jsonStr = generatedContent.trim();
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
  }

  // Try to extract JSON object even if there's trailing text
  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    jsonStr = jsonMatch[0];
  }

  let lessonPlan: GeneratedLessonPlan;
  try {
    lessonPlan = JSON.parse(jsonStr) as GeneratedLessonPlan;
  } catch {
    // If JSON is truncated, try to fix common issues
    // Remove trailing incomplete entries and close arrays/objects
    let fixedJson = jsonStr;
    // Remove last incomplete object in an array
    fixedJson = fixedJson.replace(/,\s*\{[^}]*$/, '');
    // Ensure all arrays and objects are closed
    const openBraces = (fixedJson.match(/\{/g) || []).length;
    const closeBraces = (fixedJson.match(/\}/g) || []).length;
    const openBrackets = (fixedJson.match(/\[/g) || []).length;
    const closeBrackets = (fixedJson.match(/\]/g) || []).length;
    fixedJson += ']'.repeat(Math.max(0, openBrackets - closeBrackets));
    fixedJson += '}'.repeat(Math.max(0, openBraces - closeBraces));
    lessonPlan = JSON.parse(fixedJson) as GeneratedLessonPlan;
  }

  if (!lessonPlan.sections || !Array.isArray(lessonPlan.sections) || lessonPlan.sections.length === 0) {
    throw new Error('AI generated invalid lesson plan structure');
  }

  // Insert sections into the database
  for (const section of lessonPlan.sections) {
    const sectionContent = section.type === 'practice'
      ? `Interactive practice session with exercises covering various aspects of French language learning.`
      : section.content;

    const { data: insertedSection, error: sectionError } = await db
      .from(TABLES.LESSON_SECTIONS)
      .insert({
        lesson_id: lesson.id,
        title: section.title,
        type: section.type,
        content: sectionContent,
        order_index: section.order_index,
      })
      .select('id')
      .single();

    if (sectionError || !insertedSection) {
      console.error('Failed to insert section:', sectionError);
      continue;
    }

    // Insert exercises for practice sections
    if ((section.type === 'practice' || section.type === 'exercise') && section.exercises?.length) {
      const exercisesToInsert = section.exercises.map((exercise) => ({
        session_id: insertedSection.id,
        type: exercise.type,
        question: exercise.question,
        options: exercise.options || null,
        correct_answer: exercise.correctAnswer,
        explanation: exercise.explanation,
      }));

      const { error: exerciseError } = await db
        .from(TABLES.LESSON_EXERCISES)
        .insert(exercisesToInsert);

      if (exerciseError) {
        console.error('Failed to insert exercises for section:', insertedSection.id, exerciseError);
      }
    }
  }
}

/**
 * Generate content for a single existing section.
 */
async function generateSectionContent(
  lesson: { id: string; title: string; level: string },
  section: { id: string; title: string; type: string }
) {
  let prompt: string;

  if (section.type === 'practice' || section.type === 'exercise') {
    prompt = `Generate practice exercises for a French lesson section.

Lesson Title: ${lesson.title}
Lesson Level: ${lesson.level}
Section Title: ${section.title}

Create 5-8 interactive exercises appropriate for ${lesson.level} level French learners. Include a mix of:
- Multiple choice questions
- Fill-in-the-blank exercises
- Translation exercises (English to French and French to English)
- True/false questions

Format the response as a JSON object with this structure:
{
  "exercises": [
    {
      "type": "multiple-choice|fill-in-blank|translation|true-false",
      "question": "The exercise question in French or English as appropriate",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": "correct answer",
      "explanation": "Brief explanation in English why this is correct"
    }
  ]
}

Make sure exercises are relevant to the lesson topic and appropriate for the learning level.
Return ONLY valid JSON, no additional text.`;
  } else {
    prompt = `Generate educational content for a French lesson section.
Lesson Title: ${lesson.title}
Lesson Level: ${lesson.level}
Section Title: ${section.title}
Section Type: ${section.type}

Write the content directly in Markdown format. Do NOT wrap it in JSON or include any metadata fields.
Provide a detailed explanation of the topic that is engaging and easy to understand for a ${lesson.level} learner.
Include examples, vocabulary, and key concepts where appropriate.
Start directly with the content (e.g., a heading or introductory paragraph).`;
  }

  const isExercise = section.type === 'practice' || section.type === 'exercise';
  const generatedContent = await generateTextDirect(prompt, isExercise ? 'json' : 'markdown');

  if (!generatedContent) {
    throw new Error('Failed to generate content');
  }

  if (section.type === 'practice' || section.type === 'exercise') {
    // Parse exercises JSON
    let jsonStr = generatedContent.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    }

    try {
      const exerciseData = JSON.parse(jsonStr) as GeneratedExercisePayload;

      if (exerciseData.exercises && Array.isArray(exerciseData.exercises)) {
        // Delete existing exercises for this section
        await db
          .from(TABLES.LESSON_EXERCISES)
          .delete()
          .eq('session_id', section.id);

        // Insert new exercises
        const exercisesToInsert = exerciseData.exercises.map((exercise) => ({
          session_id: section.id,
          type: exercise.type,
          question: exercise.question,
          options: exercise.options || null,
          correct_answer: exercise.correctAnswer,
          explanation: exercise.explanation,
        }));

        const { error: exerciseError } = await db
          .from(TABLES.LESSON_EXERCISES)
          .insert(exercisesToInsert);

        if (exerciseError) {
          throw new Error('Failed to store exercises');
        }

        // Update section with summary
        await db
          .from(TABLES.LESSON_SECTIONS)
          .update({
            content: `Interactive practice session with ${exerciseData.exercises.length} exercises covering various aspects of French language learning.`,
          })
          .eq('id', section.id);
      } else {
        // Fallback: store as regular content
        await db
          .from(TABLES.LESSON_SECTIONS)
          .update({ content: generatedContent })
          .eq('id', section.id);
      }
    } catch (parseError) {
      // If JSON parsing fails, store as regular content
      console.error('Failed to parse AI-generated exercises:', parseError);
      await db
        .from(TABLES.LESSON_SECTIONS)
        .update({ content: generatedContent })
        .eq('id', section.id);
    }
  } else {
    // Non-practice: store content directly
    // If the AI accidentally returned JSON, extract the content field
    let contentToStore = generatedContent;
    const trimmed = generatedContent.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed) as Record<string, unknown>;
        // Extract the most likely content field
        const extracted = parsed.content || parsed.text || parsed.markdown;
        if (typeof extracted === 'string' && extracted.length > 50) {
          contentToStore = extracted;
        }
      } catch {
        // Not valid JSON, use as-is (likely markdown)
      }
    }

    const { error: updateError } = await db
      .from(TABLES.LESSON_SECTIONS)
      .update({ content: contentToStore })
      .eq('id', section.id);

    if (updateError) {
      throw new Error('Failed to update section content');
    }
  }
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<null>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  const { lessonId, sectionId } = req.body;

  if (!lessonId) {
    return res.status(400).json({ success: false, error: { message: 'Missing lessonId' } });
  }

  try {
    // Get lesson details
    const { data: lesson, error: lessonError } = await db
      .from(TABLES.LESSONS)
      .select('*')
      .eq('id', lessonId)
      .single();

    if (lessonError || !lesson) {
      return res.status(404).json({ success: false, error: { message: 'Lesson not found' } });
    }

    if (!sectionId) {
      // No sectionId provided — generate the full lesson structure
      await generateFullLesson(lesson);
      return res.status(200).json({ success: true, data: null });
    }

    // sectionId provided — generate content for a specific section
    const { data: section, error: sectionError } = await db
      .from(TABLES.LESSON_SECTIONS)
      .select('*')
      .eq('id', sectionId)
      .single();

    if (sectionError || !section) {
      return res.status(404).json({ success: false, error: { message: 'Section not found' } });
    }

    await generateSectionContent(lesson, section);
    return res.status(200).json({ success: true, data: null });
  } catch (error) {
    console.error('Error generating content:', error);
    return res.status(500).json({
      success: false,
      error: { message: error instanceof Error ? error.message : 'Internal server error' },
    });
  }
}

export default authMiddleware(handler);
