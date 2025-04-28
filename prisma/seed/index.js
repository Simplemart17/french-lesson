// Import PrismaClient from the generated path
const { PrismaClient } = require('../../generated/prisma');
const fs = require('fs');
const path = require('path');

// Initialize Prisma client
const prisma = new PrismaClient();

// Main seed function
async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Seed vocabulary
    await seedVocabulary();

    // Seed pronunciation exercises
    await seedPronunciationExercises();

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    // Disconnect Prisma client
    await prisma.$disconnect();
  }
}

// Seed vocabulary
async function seedVocabulary() {
  console.log('🔤 Seeding vocabulary...');

  // Check if vocabulary already exists to avoid duplicates
  const existingCount = await prisma.vocabulary.count();
  if (existingCount > 0) {
    console.log(`Found ${existingCount} existing vocabulary items, skipping seed.`);
    return;
  }

  // Load vocabulary data from JSON file
  let vocabularyData = [];
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
  const batchSize = 50;
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

// Seed pronunciation exercises
async function seedPronunciationExercises() {
  console.log('🗣️ Seeding pronunciation exercises...');

  // Check if pronunciation exercises already exist to avoid duplicates
  const existingCount = await prisma.pronunciationExercise.count();
  if (existingCount > 0) {
    console.log(`Found ${existingCount} existing pronunciation exercises, skipping seed.`);
    return;
  }

  // Load pronunciation exercises data from JSON file
  let exercisesData = [];
  const dataFilePath = path.join(__dirname, 'data', 'pronunciationExercises.json');

  try {
    if (fs.existsSync(dataFilePath)) {
      const rawData = fs.readFileSync(dataFilePath, 'utf8');
      exercisesData = JSON.parse(rawData);
      console.log(`Loaded ${exercisesData.length} pronunciation exercises from JSON file`);
    } else {
      console.warn('Pronunciation exercises data file not found...');
    }
  } catch (error) {
    console.error('Error loading pronunciation exercises data:', error);
  }

  // Process pronunciation exercises in batches
  const batchSize = 50;
  const totalBatches = Math.ceil(exercisesData.length / batchSize);
  for (let i = 0; i < exercisesData.length; i += batchSize) {
    const batch = exercisesData.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;

    console.log(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} items)...`);

    await prisma.pronunciationExercise.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }

  console.log(`✅ Seeded ${exercisesData.length} pronunciation exercises`);
}

// Run the main function
main();
