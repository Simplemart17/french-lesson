// Import PrismaClient from the generated path
const { PrismaClient } = require('@prisma/client');
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

    // Seed lessons
    await seedLessons();

    // Seed conversation templates
    await seedConversationTemplates();

    // Seed grammar rules
    await seedGrammarRules();

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

// Seed lessons
async function seedLessons() {
  console.log('📚 Seeding lessons...');

  // Check if lessons already exist to avoid duplicates
  const existingCount = await prisma.lesson.count();
  if (existingCount > 0) {
    console.log(`Found ${existingCount} existing lessons, skipping seed.`);
    return;
  }

  // Comprehensive lesson data for all CEFR levels
  const lessonsData = [
    // A1 Level Lessons
    {
      title: "French Greetings and Introductions",
      description: "Learn essential French greetings, how to introduce yourself, and basic polite expressions for everyday interactions.",
      level: "A1",
      duration: 15,
      topics: ["greetings", "introductions", "politeness"]
    },
    {
      title: "Numbers and Time",
      description: "Master French numbers from 0-100, tell time, and express dates and ages in French.",
      level: "A1",
      duration: 20,
      topics: ["numbers", "time", "dates"]
    },
    {
      title: "Family and Relationships",
      description: "Vocabulary for family members, describing relationships, and talking about your family in French.",
      level: "A1",
      duration: 18,
      topics: ["family", "relationships", "vocabulary"]
    },
    {
      title: "Colors, Shapes, and Basic Adjectives",
      description: "Learn colors, shapes, and essential adjectives to describe objects and people in French.",
      level: "A1",
      duration: 16,
      topics: ["colors", "adjectives", "descriptions"]
    },
    {
      title: "Food and Drinks",
      description: "Essential vocabulary for food, drinks, ordering at restaurants, and expressing preferences.",
      level: "A1",
      duration: 22,
      topics: ["food", "drinks", "restaurant", "preferences"]
    },
    {
      title: "Shopping and Money",
      description: "Learn to shop in French, ask for prices, handle money, and basic shopping vocabulary.",
      level: "A1",
      duration: 19,
      topics: ["shopping", "money", "prices", "vocabulary"]
    },
    {
      title: "Transportation and Directions",
      description: "Navigate in French: transportation vocabulary, asking for directions, and basic travel phrases.",
      level: "A1",
      duration: 21,
      topics: ["transportation", "directions", "travel"]
    },
    {
      title: "Weather and Seasons",
      description: "Describe weather conditions, seasons, and climate-related vocabulary in French.",
      level: "A1",
      duration: 14,
      topics: ["weather", "seasons", "climate"]
    },

    // A2 Level Lessons
    {
      title: "Past Tense: Passé Composé",
      description: "Master the passé composé tense to talk about completed actions in the past.",
      level: "A2",
      duration: 25,
      topics: ["grammar", "past-tense", "verbs"]
    },
    {
      title: "Daily Routines and Habits",
      description: "Express daily routines, habits, and regular activities using appropriate vocabulary and structures.",
      level: "A2",
      duration: 20,
      topics: ["routines", "habits", "daily-life"]
    },
    {
      title: "Describing People and Personality",
      description: "Advanced vocabulary for physical descriptions and personality traits in French.",
      level: "A2",
      duration: 18,
      topics: ["descriptions", "personality", "people"]
    },
    {
      title: "Health and Body Parts",
      description: "Medical vocabulary, body parts, expressing pain and symptoms, visiting the doctor.",
      level: "A2",
      duration: 23,
      topics: ["health", "body", "medical", "symptoms"]
    },
    {
      title: "Hobbies and Leisure Activities",
      description: "Talk about hobbies, sports, entertainment, and leisure activities in French.",
      level: "A2",
      duration: 19,
      topics: ["hobbies", "sports", "leisure", "entertainment"]
    },
    {
      title: "Making Plans and Invitations",
      description: "Learn to make plans, extend invitations, accept or decline offers politely.",
      level: "A2",
      duration: 17,
      topics: ["plans", "invitations", "social", "politeness"]
    },
    {
      title: "Comparative and Superlative",
      description: "Compare things and people using comparative and superlative forms in French.",
      level: "A2",
      duration: 21,
      topics: ["grammar", "comparisons", "adjectives"]
    },
    {
      title: "Expressing Opinions and Preferences",
      description: "Learn to express opinions, preferences, likes and dislikes with appropriate vocabulary.",
      level: "A2",
      duration: 16,
      topics: ["opinions", "preferences", "expressions"]
    },

    // B1 Level Lessons
    {
      title: "Subjunctive Mood Introduction",
      description: "Introduction to the subjunctive mood: when and how to use it in French.",
      level: "B1",
      duration: 30,
      topics: ["grammar", "subjunctive", "moods"]
    },
    {
      title: "Work and Professional Life",
      description: "Professional vocabulary, job interviews, workplace communication, and career discussions.",
      level: "B1",
      duration: 28,
      topics: ["work", "professional", "career", "interviews"]
    },
    {
      title: "Education and Learning",
      description: "Educational system, academic vocabulary, discussing studies and learning experiences.",
      level: "B1",
      duration: 24,
      topics: ["education", "academic", "studies", "learning"]
    },
    {
      title: "Technology and Modern Life",
      description: "Technology vocabulary, social media, digital communication, and modern lifestyle.",
      level: "B1",
      duration: 22,
      topics: ["technology", "digital", "modern-life", "communication"]
    },
    {
      title: "Environmental Issues",
      description: "Discuss environmental problems, climate change, and sustainability in French.",
      level: "B1",
      duration: 26,
      topics: ["environment", "climate", "sustainability", "ecology"]
    },
    {
      title: "French Culture and Traditions",
      description: "Explore French culture, traditions, holidays, and cultural practices.",
      level: "B1",
      duration: 25,
      topics: ["culture", "traditions", "holidays", "society"]
    },
    {
      title: "Conditional Tense and Hypotheticals",
      description: "Master the conditional tense and express hypothetical situations in French.",
      level: "B1",
      duration: 27,
      topics: ["grammar", "conditional", "hypotheticals"]
    },
    {
      title: "Travel and Tourism",
      description: "Advanced travel vocabulary, planning trips, cultural experiences, and travel stories.",
      level: "B1",
      duration: 23,
      topics: ["travel", "tourism", "culture", "experiences"]
    },

    // B2 Level Lessons
    {
      title: "Complex Grammar Structures",
      description: "Advanced grammar including relative pronouns, complex sentence structures, and stylistic variations.",
      level: "B2",
      duration: 35,
      topics: ["grammar", "complex-structures", "style"]
    },
    {
      title: "French Literature and Arts",
      description: "Explore French literature, analyze texts, discuss artistic movements and cultural heritage.",
      level: "B2",
      duration: 32,
      topics: ["literature", "arts", "culture", "analysis"]
    },
    {
      title: "Politics and Social Issues",
      description: "Discuss political systems, social issues, current events, and civic engagement.",
      level: "B2",
      duration: 30,
      topics: ["politics", "social-issues", "current-events", "society"]
    },
    {
      title: "Business French",
      description: "Professional communication, business vocabulary, negotiations, and formal correspondence.",
      level: "B2",
      duration: 28,
      topics: ["business", "professional", "formal", "communication"]
    },
    {
      title: "Media and Communication",
      description: "Analyze media content, discuss journalism, advertising, and communication strategies.",
      level: "B2",
      duration: 26,
      topics: ["media", "journalism", "communication", "analysis"]
    },
    {
      title: "Philosophy and Abstract Concepts",
      description: "Discuss philosophical concepts, abstract ideas, and complex reasoning in French.",
      level: "B2",
      duration: 33,
      topics: ["philosophy", "abstract", "reasoning", "concepts"]
    },
    {
      title: "Scientific and Technical French",
      description: "Scientific vocabulary, technical explanations, and academic discourse.",
      level: "B2",
      duration: 29,
      topics: ["science", "technical", "academic", "vocabulary"]
    },
    {
      title: "Regional Variations and Francophonie",
      description: "Explore French variations across different regions and francophone countries.",
      level: "B2",
      duration: 24,
      topics: ["regional", "francophonie", "variations", "culture"]
    },

    // C1 Level Lessons
    {
      title: "Advanced Literary Analysis",
      description: "In-depth analysis of French literary works, literary movements, and critical thinking.",
      level: "C1",
      duration: 40,
      topics: ["literature", "analysis", "critical-thinking", "advanced"]
    },
    {
      title: "Nuanced Expression and Style",
      description: "Master subtle expressions, stylistic nuances, and sophisticated language use.",
      level: "C1",
      duration: 38,
      topics: ["style", "nuance", "sophisticated", "expression"]
    },
    {
      title: "Historical and Cultural Context",
      description: "Deep dive into French history, cultural evolution, and historical analysis.",
      level: "C1",
      duration: 36,
      topics: ["history", "culture", "evolution", "analysis"]
    },
    {
      title: "Academic Writing and Research",
      description: "Academic writing techniques, research methodology, and scholarly discourse.",
      level: "C1",
      duration: 42,
      topics: ["academic", "writing", "research", "scholarly"]
    },
    {
      title: "Debate and Argumentation",
      description: "Advanced argumentation techniques, debate skills, and persuasive communication.",
      level: "C1",
      duration: 35,
      topics: ["debate", "argumentation", "persuasion", "communication"]
    },
    {
      title: "Professional Specialization",
      description: "Specialized vocabulary for specific professional fields and expert communication.",
      level: "C1",
      duration: 37,
      topics: ["professional", "specialization", "expert", "vocabulary"]
    },

    // C2 Level Lessons
    {
      title: "Mastery of French Idioms and Expressions",
      description: "Complete mastery of idiomatic expressions, colloquialisms, and cultural references.",
      level: "C2",
      duration: 45,
      topics: ["idioms", "expressions", "mastery", "cultural"]
    },
    {
      title: "Creative Writing and Literary Creation",
      description: "Creative writing techniques, literary creation, and artistic expression in French.",
      level: "C2",
      duration: 50,
      topics: ["creative", "writing", "literary", "artistic"]
    },
    {
      title: "Translation and Interpretation",
      description: "Advanced translation techniques, interpretation skills, and cross-cultural communication.",
      level: "C2",
      duration: 48,
      topics: ["translation", "interpretation", "cross-cultural", "advanced"]
    },
    {
      title: "Linguistic Analysis and Metalanguage",
      description: "Analyze language structure, linguistic phenomena, and metalinguistic awareness.",
      level: "C2",
      duration: 43,
      topics: ["linguistics", "analysis", "metalanguage", "structure"]
    },
    {
      title: "Cultural Expertise and Intercultural Communication",
      description: "Expert-level cultural knowledge and sophisticated intercultural communication skills.",
      level: "C2",
      duration: 46,
      topics: ["cultural", "expertise", "intercultural", "sophisticated"]
    }
  ];

  // Process lessons in batches
  const batchSize = 10;
  const totalBatches = Math.ceil(lessonsData.length / batchSize);
  for (let i = 0; i < lessonsData.length; i += batchSize) {
    const batch = lessonsData.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;

    console.log(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} items)...`);

    await prisma.lesson.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }

  console.log(`✅ Seeded ${lessonsData.length} lessons`);
}

// Seed conversation templates
async function seedConversationTemplates() {
  console.log('💬 Seeding conversation templates...');

  // Check if conversation templates already exist to avoid duplicates
  const existingCount = await prisma.conversationTemplate.count();
  if (existingCount > 0) {
    console.log(`Found ${existingCount} existing conversation templates, skipping seed.`);
    return;
  }

  // Load conversation templates data from JSON file
  let templatesData = [];
  const dataFilePath = path.join(__dirname, 'data', 'conversationTemplates.json');

  try {
    if (fs.existsSync(dataFilePath)) {
      const rawData = fs.readFileSync(dataFilePath, 'utf8');
      templatesData = JSON.parse(rawData);
      console.log(`Loaded ${templatesData.length} conversation templates from JSON file`);
    } else {
      console.warn('Conversation templates data file not found, creating basic templates...');
      // Create basic templates if file doesn't exist
      templatesData = [
        {
          title: "Restaurant Conversation",
          description: "Practice ordering food and drinks at a French restaurant",
          systemPrompt: "You are a French waiter/waitress. Help the customer order food and drinks. Be polite and helpful.",
          initialMessage: "Bonjour ! Bienvenue dans notre restaurant. Avez-vous une réservation ?",
          topics: ["food", "restaurant", "ordering"],
          level: "A2"
        },
        {
          title: "Shopping for Clothes",
          description: "Practice shopping for clothes and accessories in French",
          systemPrompt: "You are a French shop assistant in a clothing store. Help the customer find what they need.",
          initialMessage: "Bonjour ! Puis-je vous aider à trouver quelque chose aujourd'hui ?",
          topics: ["shopping", "clothes", "fashion"],
          level: "A2"
        },
        {
          title: "Job Interview",
          description: "Practice a job interview conversation in French",
          systemPrompt: "You are a French HR manager conducting a job interview. Ask relevant questions about experience and skills.",
          initialMessage: "Bonjour ! Merci d'être venu(e) pour cet entretien. Pouvez-vous vous présenter ?",
          topics: ["work", "interview", "professional"],
          level: "B1"
        }
      ];
    }
  } catch (error) {
    console.error('Error loading conversation templates data:', error);
  }

  // Process conversation templates in batches
  const batchSize = 10;
  const totalBatches = Math.ceil(templatesData.length / batchSize);
  for (let i = 0; i < templatesData.length; i += batchSize) {
    const batch = templatesData.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;

    console.log(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} items)...`);

    await prisma.conversationTemplate.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }

  console.log(`✅ Seeded ${templatesData.length} conversation templates`);
}

// Seed grammar rules
async function seedGrammarRules() {
  console.log('📝 Seeding grammar rules...');

  // Check if grammar rules already exist to avoid duplicates
  const existingCount = await prisma.grammarRule.count();
  if (existingCount > 0) {
    console.log(`Found ${existingCount} existing grammar rules, skipping seed.`);
    return;
  }

  // Load grammar rules data from JSON file
  let grammarData = [];
  const dataFilePath = path.join(__dirname, 'data', 'grammarRules.json');

  try {
    if (fs.existsSync(dataFilePath)) {
      const rawData = fs.readFileSync(dataFilePath, 'utf8');
      grammarData = JSON.parse(rawData);
      console.log(`Loaded ${grammarData.length} grammar rules from JSON file`);
    } else {
      console.warn('Grammar rules data file not found...');
    }
  } catch (error) {
    console.error('Error loading grammar rules data:', error);
  }

  // Process grammar rules in batches
  const batchSize = 20;
  const totalBatches = Math.ceil(grammarData.length / batchSize);
  for (let i = 0; i < grammarData.length; i += batchSize) {
    const batch = grammarData.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;

    console.log(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} items)...`);

    await prisma.grammarRule.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }

  console.log(`✅ Seeded ${grammarData.length} grammar rules`);
}

// Run the main function
main();
