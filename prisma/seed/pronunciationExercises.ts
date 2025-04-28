import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Define pronunciation exercise data structure
interface PronunciationExercise {
  text: string;
  translation?: string;
  difficulty: string;
  category?: string;
  expectedPronunciation?: string;
}

export async function seedPronunciationExercises(prisma: PrismaClient, batchSize = 20) {
  console.log('🗣️ Seeding pronunciation exercises...');

  // Check if pronunciation exercises already exist to avoid duplicates
  const existingCount = await prisma.pronunciationExercise.count();
  if (existingCount > 0) {
    console.log(`Found ${existingCount} existing pronunciation exercises, skipping seed.`);
    return;
  }

  // Load pronunciation exercises data from JSON file
  let pronunciationExercisesData: PronunciationExercise[] = [];
  const dataFilePath = path.join(__dirname, 'data', 'pronunciationExercises.json');

  try {
    if (fs.existsSync(dataFilePath)) {
      const rawData = fs.readFileSync(dataFilePath, 'utf8');
      pronunciationExercisesData = JSON.parse(rawData);
      console.log(`Loaded ${pronunciationExercisesData.length} pronunciation exercises from JSON file`);
    } else {
      console.warn('Pronunciation exercises data file not found...');
    }
  } catch (error) {
    console.error('Error loading pronunciation exercises data:', error);
  }

  // Process pronunciation exercises in batches
  const totalBatches = Math.ceil(pronunciationExercisesData.length / batchSize);
  for (let i = 0; i < pronunciationExercisesData.length; i += batchSize) {
    const batch = pronunciationExercisesData.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;

    console.log(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} items)...`);

    await prisma.pronunciationExercise.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }

  console.log(`✅ Seeded ${pronunciationExercisesData.length} pronunciation exercises`);
}
