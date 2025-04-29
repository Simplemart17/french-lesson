const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Initialize Prisma client
const prisma = new PrismaClient();

async function addLessons() {
  console.log('📚 Adding new lessons...');

  // Load lessons data from JSON file
  let lessonsData = [];
  const dataFilePath = path.join(__dirname, '../prisma/seed/data/lessons.json');

  try {
    if (fs.existsSync(dataFilePath)) {
      const rawData = fs.readFileSync(dataFilePath, 'utf8');
      lessonsData = JSON.parse(rawData);
      console.log(`Loaded ${lessonsData.length} lessons from JSON file`);
    } else {
      console.error('Lessons data file not found at:', dataFilePath);
      return;
    }
  } catch (error) {
    console.error('Error loading lessons data:', error);
    return;
  }

  // Create lessons with their sections and exercises
  let lessonCount = 0;
  let skippedCount = 0;

  for (const lesson of lessonsData) {
    try {
      // Check if a lesson with the same title already exists
      const existingLesson = await prisma.lesson.findFirst({
        where: { title: lesson.title }
      });

      if (existingLesson) {
        console.log(`Lesson "${lesson.title}" already exists, skipping.`);
        skippedCount++;
        continue;
      }

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

      console.log(`Created lesson: ${lesson.title}`);

      // Create sections for this lesson
      for (let i = 0; i < lesson.sections.length; i++) {
        const section = lesson.sections[i];
        const createdSection = await prisma.lessonSection.create({
          data: {
            lessonId: createdLesson.id,
            title: section.title,
            type: section.type,
            content: section.content || null,
            audioUrl: section.audioUrl || null,
            videoUrl: section.videoUrl || null,
            order: i + 1
          }
        });

        console.log(`  Added section: ${section.title}`);

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
                explanation: exercise.explanation || null
              }
            });
          }
          console.log(`    Added ${section.exercises.length} exercises to section`);
        }
      }

      lessonCount++;
    } catch (error) {
      console.error(`Error processing lesson "${lesson.title}":`, error);
      skippedCount++;
    }
  }

  console.log(`✅ Added ${lessonCount} new lessons (${skippedCount} skipped)`);
}

// Main function
async function main() {
  try {
    await addLessons();
  } catch (error) {
    console.error('Error adding lessons:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
