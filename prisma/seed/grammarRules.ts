import { PrismaClient } from '../../generated/prisma';
import fs from 'fs';
import path from 'path';

// Define grammar rule data structure
interface GrammarRule {
  title: string;
  description: string;
  examples: string[];
  level: string;
  category: string;
}

export async function seedGrammarRules(prisma: PrismaClient, batchSize = 20) {
  console.log('📝 Seeding grammar rules...');

  // Check if grammar rules already exist to avoid duplicates
  const existingCount = await prisma.grammarRule.count();
  if (existingCount > 0) {
    console.log(`Found ${existingCount} existing grammar rules, skipping seed.`);
    return;
  }

  // Load grammar rules data from JSON file
  let grammarRulesData: GrammarRule[] = [];
  const dataFilePath = path.join(__dirname, 'data', 'grammarRules.json');

  try {
    if (fs.existsSync(dataFilePath)) {
      const rawData = fs.readFileSync(dataFilePath, 'utf8');
      grammarRulesData = JSON.parse(rawData);
      console.log(`Loaded ${grammarRulesData.length} grammar rules from JSON file`);
    } else {
      console.warn('Grammar rules data file not found...');
    }
  } catch (error) {
    console.error('Error loading grammar rules data:', error);
  }

  // Process grammar rules in batches
  const totalBatches = Math.ceil(grammarRulesData.length / batchSize);
  for (let i = 0; i < grammarRulesData.length; i += batchSize) {
    const batch = grammarRulesData.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;

    console.log(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} items)...`);

    await prisma.grammarRule.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }

  console.log(`✅ Seeded ${grammarRulesData.length} grammar rules`);
}
