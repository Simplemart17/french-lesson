import { PrismaClient } from '../../generated/prisma';
import fs from 'fs';
import path from 'path';

interface LessonExercise {
  type: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface LessonSection {
  title: string;
  type: string;
  content: string;
  audioUrl: string | null;
  videoUrl: string | null;
  exercises?: LessonExercise[];
}

interface Lesson {
  title: string;
  description: string;
  level: string;
  duration: number;
  topics: string[];
  sections: LessonSection[];
}

export async function seedLessons(prisma: PrismaClient, batchSize = 10) {
  console.log('📚 Seeding lessons...');

  // Check if lessons already exist to avoid duplicates
  const existingCount = await prisma.lesson.count();
  if (existingCount > 0) {
    console.log(`Found ${existingCount} existing lessons, skipping seed.`);
    return;
  }

  // Load lessons data from JSON file
  let lessonsData: Lesson[] = [];
  const dataFilePath = path.join(__dirname, 'data', 'lessons.json');

  try {
    if (fs.existsSync(dataFilePath)) {
      const rawData = fs.readFileSync(dataFilePath, 'utf8');
      lessonsData = JSON.parse(rawData);
      console.log(`Loaded ${lessonsData.length} lessons from JSON file`);
    } else {
      console.warn('Lessons data file not found...');
    }
  } catch (error) {
    console.error('Error loading lessons data:', error);
  }

  // Create lessons with their sections and exercises
  let lessonCount = 0;
  for (const lesson of lessonsData) {
    // Create the lesson
    const createdLesson = await prisma.lesson.create({
      data: {
        title: lesson.title,
        description: lesson.description,
        level: lesson.level,
        duration: lesson.duration,
        topics: lesson.topics
      }
    });

    // Create sections for this lesson
    for (let i = 0; i < lesson.sections.length; i++) {
      const section = lesson.sections[i];
      const createdSection = await prisma.lessonSection.create({
        data: {
          lessonId: createdLesson.id,
          title: section.title,
          type: section.type,
          content: section.content,
          audioUrl: section.audioUrl,
          videoUrl: section.videoUrl,
          order: i + 1
        }
      });

      // Create exercises for this section if any
      if (section.exercises && section.exercises.length > 0) {
        for (const exercise of section.exercises) {
          await prisma.lessonExercise.create({
            data: {
              sectionId: createdSection.id,
              type: exercise.type,
              question: exercise.question,
              options: exercise.options || [],
              correctAnswer: exercise.correctAnswer,
              explanation: exercise.explanation
            }
          });
        }
      }
    }

    lessonCount++;
    console.log(`Created lesson ${lessonCount}/${lessonsData.length}: ${lesson.title}`);
  }

  console.log(`✅ Seeded ${lessonCount} lessons with sections and exercises`);
}
