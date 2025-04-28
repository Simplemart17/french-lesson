// This script seeds the vocabulary table with initial data
const { PrismaClient } = require('../generated/prisma');
const fs = require('fs');
const path = require('path');

// Initialize Prisma client
const prisma = new PrismaClient();

async function main() {
  console.log('🔤 Starting vocabulary seeding...');

  try {
    // Check if vocabulary already exists
    const existingCount = await prisma.vocabulary.count();
    console.log(`Found ${existingCount} existing vocabulary items.`);

    if (existingCount > 0) {
      console.log('Vocabulary data already exists. Skipping seed.');
      return;
    }

    // Load vocabulary data from JSON file
    const dataFilePath = path.join(__dirname, '../prisma/seed/data/vocabulary.json');

    if (!fs.existsSync(dataFilePath)) {
      console.error('Vocabulary data file not found:', dataFilePath);
      return;
    }

    const rawData = fs.readFileSync(dataFilePath, 'utf8');
    const vocabularyData = JSON.parse(rawData);
    console.log(`Loaded ${vocabularyData.length} vocabulary items from JSON file.`);

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

    console.log(`✅ Successfully seeded ${vocabularyData.length} vocabulary items.`);
  } catch (error) {
    console.error('Error seeding vocabulary:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
