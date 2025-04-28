import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Define vocabulary data structure
interface VocabularyItem {
  word: string;
  translation: string;
  example: string;
  level: string;
  pronunciation?: string;
  usageContext?: string[];
  category?: string;
}

export async function seedVocabulary(prisma: PrismaClient, batchSize = 50) {
  console.log('🔤 Seeding vocabulary...');

  // Check if vocabulary already exists to avoid duplicates
  const existingCount = await prisma.vocabulary.count();
  if (existingCount > 0) {
    console.log(`Found ${existingCount} existing vocabulary items, skipping seed.`);
    return;
  }

  // Load vocabulary data from JSON file
  let vocabularyData: VocabularyItem[] = [];
  const dataFilePath = path.join(__dirname, 'data', 'vocabulary.json');

  try {
    if (fs.existsSync(dataFilePath)) {
      const rawData = fs.readFileSync(dataFilePath, 'utf8');
      vocabularyData = JSON.parse(rawData);
      console.log(`Loaded ${vocabularyData.length} vocabulary items from JSON file`);
    } else {
      console.warn('Vocabulary data file not found...');
    }
  } catch (error) {
    console.error('Error loading vocabulary data:', error);
  }

  // Process vocabulary items in batches
  const totalBatches = Math.ceil(vocabularyData.length / batchSize);
  for (let i = 0; i < vocabularyData.length; i += batchSize) {
    const batch = vocabularyData.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;

    console.log(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} items)...`);

    await prisma.vocabulary.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }

  console.log(`✅ Seeded ${vocabularyData.length} vocabulary items`);
}
