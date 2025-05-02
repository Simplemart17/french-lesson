const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Initialize Prisma client
const prisma = new PrismaClient();

async function addVocabulary() {
  console.log('🔤 Adding new vocabulary items...');

  // Load vocabulary data from JSON file
  let vocabularyData = [];
  const dataFilePath = path.join(__dirname, '../prisma/seed/data/additional_vocabulary.json');

  try {
    if (fs.existsSync(dataFilePath)) {
      const rawData = fs.readFileSync(dataFilePath, 'utf8');
      vocabularyData = JSON.parse(rawData);
      console.log(`Loaded ${vocabularyData.length} vocabulary items from JSON file`);
    } else {
      console.error('Vocabulary data file not found at:', dataFilePath);
      return;
    }
  } catch (error) {
    console.error('Error loading vocabulary data:', error);
    return;
  }

  // Process vocabulary items in batches
  const batchSize = 10;
  const totalBatches = Math.ceil(vocabularyData.length / batchSize);
  let addedCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < vocabularyData.length; i += batchSize) {
    const batch = vocabularyData.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;

    console.log(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} items)...`);

    // Process each item individually to handle duplicates gracefully
    for (const item of batch) {
      try {
        // Check if the word already exists
        const existingWord = await prisma.vocabulary.findUnique({
          where: { word: item.word }
        });

        if (existingWord) {
          console.log(`Word "${item.word}" already exists, skipping.`);
          skippedCount++;
        } else {
          // Add the new word
          await prisma.vocabulary.create({
            data: item
          });
          addedCount++;
          console.log(`Added word: ${item.word}`);
        }
      } catch (error) {
        console.error(`Error processing word "${item.word}":`, error);
        skippedCount++;
      }
    }
  }

  console.log(`✅ Added ${addedCount} new vocabulary items (${skippedCount} skipped)`);
}

// Main function
async function main() {
  try {
    await addVocabulary();
  } catch (error) {
    console.error('Error adding vocabulary:', error);
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
