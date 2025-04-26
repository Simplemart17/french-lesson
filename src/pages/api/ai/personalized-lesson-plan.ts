import type { NextApiRequest, NextApiResponse } from 'next';
import { getOpenAIClient, safeJSONParse } from '../../../utils/openaiClient';
import { authMiddleware } from '../../../utils/authMiddleware';
import { prisma } from '../../../lib/prisma';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    const { userLevel, learningGoals, weakPoints } = req.body;

    if (!userLevel) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'User level is required' } 
      });
    }
    
    // Get user ID from authenticated user
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'User not authenticated' }
      });
    }

    // Get user's completed lessons
    const completedLessons = await prisma.lessonProgress.findMany({
      where: {
        userId,
        completed: true
      },
      select: {
        lessonId: true
      }
    });
    
    const completedLessonIds = completedLessons.map(l => l.lessonId);
    
    // Get available lessons that the user hasn't completed
    const availableLessons = await prisma.lesson.findMany({
      where: {
        id: {
          notIn: completedLessonIds
        }
      }
    });
    
    if (availableLessons.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          recommendedLessons: [],
          focusAreas: ['You have completed all available lessons'],
          timeEstimate: 0
        }
      });
    }
    
    // Format lessons for the AI
    const formattedLessons = availableLessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      level: lesson.level,
      topics: lesson.topics
    }));

    // Get OpenAI client
    const openai = getOpenAIClient();

    // Call OpenAI API to generate personalized recommendations
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `You are an AI French language learning assistant. Your task is to create a personalized learning plan based on the user's level, learning goals, weak points, and available lessons.
          
          Here's information about the user:
          - Current French level: ${userLevel}
          - Learning goals: ${JSON.stringify(learningGoals || [])}
          - Weak points: ${JSON.stringify(weakPoints || [])}
          
          Based on this information and the available lessons below, recommend a structured learning plan. Focus on the user's weak points and align with their learning goals.
          
          Available lessons:
          ${JSON.stringify(formattedLessons, null, 2)}
          
          Format your response as a JSON object with the following structure:
          {
            "recommendedLessons": [
              {
                "id": lessonId,
                "title": "lesson title",
                "description": "lesson description",
                "topics": ["topic1", "topic2"],
                "reason": "Explanation of why this lesson is recommended"
              }
            ],
            "focusAreas": ["area1", "area2", "area3"],
            "timeEstimate": totalTimeInMinutes
          }
          
          Include 3-5 lessons in your recommendation, ordered by priority.
          Only include lessons from the provided list.
          Only respond with the JSON object and nothing else.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    // Parse the response
    const result = safeJSONParse(response.choices[0].message.content || '{}');

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Personalized lesson plan error:', error);
    return res.status(500).json({ 
      success: false, 
      error: { message: 'Failed to generate personalized lesson plan' } 
    });
  }
}

export default authMiddleware(handler); 