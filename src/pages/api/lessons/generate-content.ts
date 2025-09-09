import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, TABLES } from '@/lib/supabase';
import aiService from '@/services/aiService';
import { ApiResponse } from '@/types/api';
import { authMiddleware } from '../../../utils/authMiddleware';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<null>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  const { lessonId, sectionId } = req.body;

  if (!lessonId || !sectionId) {
    return res.status(400).json({ success: false, error: { message: 'Missing lessonId or sectionId' } });
  }

  try {
    // 1. Get lesson and section details
    const { data: lesson, error: lessonError } = await supabase
      .from(TABLES.LESSONS)
      .select('*')
      .eq('id', lessonId)
      .single();

    if (lessonError || !lesson) {
      return res.status(404).json({ success: false, error: { message: 'Lesson not found' } });
    }

    const { data: section, error: sectionError } = await supabase
      .from(TABLES.LESSON_SECTIONS)
      .select('*')
      .eq('id', sectionId)
      .single();

    if (sectionError || !section) {
      return res.status(404).json({ success: false, error: { message: 'Section not found' } });
    }

    // 2. Generate content with AI based on section type
    let prompt: string;
    
    if (section.type === 'practice' || section.type === 'exercise') {
      // Generate interactive practice exercises
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
            "options": ["option1", "option2", "option3", "option4"], // for multiple choice only
            "correctAnswer": "correct answer",
            "explanation": "Brief explanation in English why this is correct",
            "difficulty": "${lesson.level}"
          }
        ]
      }
      
      Make sure exercises are relevant to the lesson topic and appropriate for the learning level.
      `;
    } else {
      // Generate regular educational content
      prompt = `Generate educational content for a French lesson section.
      Lesson Title: ${lesson.title}
      Lesson Level: ${lesson.level}
      Section Title: ${section.title}
      Section Type: ${section.type}

      The content should be in Markdown format and provide a detailed explanation of the topic. It should be engaging and easy to understand for a ${lesson.level} learner.
      Include examples, vocabulary, and key concepts where appropriate.
      `;
    }

    const token = req.headers.authorization?.split(' ')[1];

    const generatedContent = await aiService.generateText(prompt, token);

    if (!generatedContent) {
      return res.status(500).json({ success: false, error: { message: 'Failed to generate content' } });
    }

    // 3. Update the section content in the database
    if (section.type === 'practice' || section.type === 'exercise') {
      // Parse the AI-generated JSON content and store exercises properly
      try {
        const exerciseData = JSON.parse(generatedContent);
        
        if (exerciseData.exercises && Array.isArray(exerciseData.exercises)) {
          // First, delete any existing exercises for this section
          await supabase
            .from('lesson_exercises')
            .delete()
            .eq('sectionId', sectionId);

          // Insert the new exercises
          const exercisesToInsert = exerciseData.exercises.map((exercise: any, index: number) => ({
            sectionId,
            type: exercise.type,
            question: exercise.question,
            options: exercise.options || null,
            correctAnswer: exercise.correctAnswer,
            explanation: exercise.explanation,
            order: index
          }));

          const { error: exerciseError } = await supabase
            .from('lesson_exercises')
            .insert(exercisesToInsert);

          if (exerciseError) {
            console.error('Failed to insert exercises:', exerciseError);
            return res.status(500).json({ success: false, error: { message: 'Failed to store exercises' } });
          }

          // Update section content with a summary
          const { error: updateError } = await supabase
            .from(TABLES.LESSON_SECTIONS)
            .update({ 
              content: `Interactive practice session with ${exerciseData.exercises.length} exercises covering various aspects of French language learning.`
            })
            .eq('id', sectionId);

          if (updateError) {
            return res.status(500).json({ success: false, error: { message: 'Failed to update section content' } });
          }
        } else {
          // If the JSON structure is incorrect, store as regular content
          const { error: updateError } = await supabase
            .from(TABLES.LESSON_SECTIONS)
            .update({ content: generatedContent })
            .eq('id', sectionId);

          if (updateError) {
            return res.status(500).json({ success: false, error: { message: 'Failed to update section content' } });
          }
        }
      } catch (parseError) {
        // If JSON parsing fails, store as regular content
        console.error('Failed to parse AI-generated exercises:', parseError);
        const { error: updateError } = await supabase
          .from(TABLES.LESSON_SECTIONS)
          .update({ content: generatedContent })
          .eq('id', sectionId);

        if (updateError) {
          return res.status(500).json({ success: false, error: { message: 'Failed to update section content' } });
        }
      }
    } else {
      // For non-practice sections, store content directly
      const { error: updateError } = await supabase
        .from(TABLES.LESSON_SECTIONS)
        .update({ content: generatedContent })
        .eq('id', sectionId);

      if (updateError) {
        return res.status(500).json({ success: false, error: { message: 'Failed to update section content' } });
      }
    }

    res.status(200).json({ success: true, data: null });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
}

export default authMiddleware(handler);
