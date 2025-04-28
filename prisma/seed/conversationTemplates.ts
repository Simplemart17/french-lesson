import { PrismaClient } from '../../generated/prisma';
import fs from 'fs';
import path from 'path';

interface ConversationTemplate {
  title: string;
  description: string;
  systemPrompt: string;
  initialMessage: string;
  topics: string[];
  level: string;
}

export async function seedConversationTemplates(prisma: PrismaClient, batchSize = 20) {
  console.log('💬 Seeding conversation templates...');

  // Check if conversation templates already exist to avoid duplicates
  const existingCount = await prisma.conversationTemplate.count();
  if (existingCount > 0) {
    console.log(`Found ${existingCount} existing conversation templates, skipping seed.`);
    return;
  }

  // Load conversation templates data from JSON file
  let conversationTemplatesData: ConversationTemplate[] = [];
  const dataFilePath = path.join(__dirname, 'data', 'conversationTemplates.json');

  try {
    if (fs.existsSync(dataFilePath)) {
      const rawData = fs.readFileSync(dataFilePath, 'utf8');
      conversationTemplatesData = JSON.parse(rawData);
      console.log(`Loaded ${conversationTemplatesData.length} conversation templates from JSON file`);
    } else {
      console.warn('Conversation templates data file not found...');
    }
  } catch (error) {
    console.error('Error loading conversation templates data:', error);
  }

  // Create conversation templates
  await prisma.conversationTemplate.createMany({
    data: conversationTemplatesData,
    skipDuplicates: true,
  });

  console.log(`✅ Seeded ${conversationTemplatesData.length} conversation templates`);
}
