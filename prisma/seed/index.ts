import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Import seed functions
import { seedVocabulary } from './vocabulary';
import { seedGrammarRules } from './grammarRules';
import { seedPronunciationExercises } from './pronunciationExercises';
import { seedLessons } from './lessons';
import { seedConversationTemplates } from './conversationTemplates';

const prisma = new PrismaClient();

// Configuration for seeding
const SEED_CONFIG = {
  batchSize: {
    vocabulary: 100,
    grammarRules: 50,
    pronunciationExercises: 50,
    lessons: 10,
    conversationTemplates: 20
  },
  dataDir: path.join(__dirname, 'data')
};

// Ensure data directory exists
if (!fs.existsSync(SEED_CONFIG.dataDir)) {
  fs.mkdirSync(SEED_CONFIG.dataDir, { recursive: true });
}

// Helper function to read JSON data files
export function readJsonData(filename: string) {
  const filePath = path.join(SEED_CONFIG.dataDir, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: Data file ${filename} not found`);
    return [];
  }

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

// Helper function to process data in batches
export async function processBatches(
  items: any[],
  batchSize: number,
  processFn: (batch: any[]) => Promise<void>
) {
  const totalBatches = Math.ceil(items.length / batchSize);

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;

    console.log(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} items)...`);
    await processFn(batch);
  }
}

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Seed in order of dependencies
    console.log('📚 Starting vocabulary seeding...');
    await seedVocabulary(prisma);

    console.log('📝 Starting grammar rules seeding...');
    await seedGrammarRules(prisma);

    console.log('🗣️ Starting pronunciation exercises seeding...');
    await seedPronunciationExercises(prisma);

    console.log('📖 Starting lessons seeding...');
    await seedLessons(prisma);

    console.log('💬 Starting conversation templates seeding...');
    await seedConversationTemplates(prisma);

    console.log('✅ Database seeding completed successfully');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
