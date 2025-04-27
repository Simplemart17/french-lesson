import { prisma } from './prisma';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

interface VocabularyItem {
  word: string;
  translation: string;
  example: string;
  level: string;
  category?: string;
}

/**
 * Seed the database with vocabulary from a CSV file
 * 
 * This function can be run independently of the main seed function
 * to add vocabulary without affecting other data.
 */
export async function seedVocabulary(filePath?: string): Promise<void> {
  console.log('Seeding vocabulary...');

  try {
    // Use default path if not provided
    const csvPath = filePath || path.join(process.cwd(), 'data', 'vocabulary.csv');
    
    // Check if file exists
    if (!fs.existsSync(csvPath)) {
      console.error(`CSV file not found at ${csvPath}`);
      return;
    }

    // Read and parse CSV file
    const fileContent = fs.readFileSync(csvPath, 'utf8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    }) as VocabularyItem[];

    console.log(`Found ${records.length} vocabulary items in CSV file`);

    // Process in batches to avoid memory issues
    const batchSize = 100;
    let processed = 0;
    let created = 0;
    let skipped = 0;

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      
      // Process each item in the batch
      for (const item of batch) {
        // Check if word already exists
        const existingWord = await prisma.vocabulary.findUnique({
          where: { word: item.word.toLowerCase().trim() }
        });

        if (!existingWord) {
          // Create new vocabulary item
          await prisma.vocabulary.create({
            data: {
              word: item.word.toLowerCase().trim(),
              translation: item.translation.trim(),
              example: item.example.trim(),
              level: item.level.toUpperCase().trim()
            }
          });
          created++;
        } else {
          skipped++;
        }
        
        processed++;
      }
      
      // Log progress
      console.log(`Processed ${processed}/${records.length} vocabulary items (${created} created, ${skipped} skipped)`);
    }

    console.log('Vocabulary seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding vocabulary:', error);
    throw error;
  }
}

/**
 * Create a sample CSV file with vocabulary data
 * 
 * This function creates a sample CSV file that can be used as a template
 * for adding more vocabulary items.
 */
export function createSampleVocabularyCSV(outputPath?: string): void {
  const sampleData = [
    { word: 'bonjour', translation: 'hello', example: 'Bonjour! Comment allez-vous?', level: 'A1', category: 'Greetings' },
    { word: 'merci', translation: 'thank you', example: 'Merci beaucoup pour votre aide.', level: 'A1', category: 'Greetings' },
    { word: 'au revoir', translation: 'goodbye', example: 'Au revoir et à bientôt!', level: 'A1', category: 'Greetings' },
    { word: 'oui', translation: 'yes', example: 'Oui, je comprends.', level: 'A1', category: 'Basics' },
    { word: 'non', translation: 'no', example: 'Non, je ne comprends pas.', level: 'A1', category: 'Basics' },
    { word: 's\'il vous plaît', translation: 'please', example: 'Un café, s\'il vous plaît.', level: 'A1', category: 'Basics' },
    { word: 'excusez-moi', translation: 'excuse me', example: 'Excusez-moi, où est la gare?', level: 'A1', category: 'Basics' },
    { word: 'pardon', translation: 'sorry', example: 'Pardon, je ne parle pas bien français.', level: 'A1', category: 'Basics' },
    { word: 'je m\'appelle', translation: 'my name is', example: 'Je m\'appelle Marie.', level: 'A1', category: 'Introductions' },
    { word: 'enchanté', translation: 'nice to meet you', example: 'Enchanté de faire votre connaissance.', level: 'A1', category: 'Introductions' }
  ];

  // Create CSV content
  const headers = 'word,translation,example,level,category\n';
  const rows = sampleData.map(item => 
    `"${item.word}","${item.translation}","${item.example}","${item.level}","${item.category}"`
  ).join('\n');
  const csvContent = headers + rows;

  // Ensure directory exists
  const dirPath = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Write to file
  const filePath = outputPath || path.join(dirPath, 'vocabulary-sample.csv');
  fs.writeFileSync(filePath, csvContent, 'utf8');

  console.log(`Sample vocabulary CSV created at ${filePath}`);
}

/**
 * Generate a comprehensive vocabulary CSV file
 * 
 * This function creates a more comprehensive vocabulary CSV file with
 * common French words organized by level and category.
 */
export function generateComprehensiveVocabularyCSV(outputPath?: string): void {
  // Define categories and levels
  const categories = [
    'Greetings', 'Basics', 'Numbers', 'Time', 'Days', 'Months', 'Seasons',
    'Colors', 'Food', 'Drinks', 'Family', 'Professions', 'Travel', 'Transportation',
    'Accommodation', 'Shopping', 'Clothing', 'Body', 'Health', 'Weather',
    'Nature', 'Animals', 'Sports', 'Leisure', 'Education', 'Work', 'Technology',
    'House', 'Furniture', 'Kitchen', 'Bathroom', 'Emotions', 'Personality'
  ];

  // Common French vocabulary organized by level and category
  const vocabularyData: VocabularyItem[] = [
    // A1 Level - Greetings
    { word: 'bonjour', translation: 'hello/good day', example: 'Bonjour! Comment allez-vous?', level: 'A1', category: 'Greetings' },
    { word: 'bonsoir', translation: 'good evening', example: 'Bonsoir! Comment allez-vous?', level: 'A1', category: 'Greetings' },
    { word: 'salut', translation: 'hi/bye (informal)', example: 'Salut! Ça va?', level: 'A1', category: 'Greetings' },
    { word: 'au revoir', translation: 'goodbye', example: 'Au revoir et à bientôt!', level: 'A1', category: 'Greetings' },
    { word: 'à bientôt', translation: 'see you soon', example: 'À bientôt, mon ami!', level: 'A1', category: 'Greetings' },
    { word: 'à demain', translation: 'see you tomorrow', example: 'À demain au bureau!', level: 'A1', category: 'Greetings' },
    { word: 'bonne journée', translation: 'have a good day', example: 'Bonne journée!', level: 'A1', category: 'Greetings' },
    { word: 'bonne soirée', translation: 'have a good evening', example: 'Bonne soirée!', level: 'A1', category: 'Greetings' },
    { word: 'bonne nuit', translation: 'good night', example: 'Bonne nuit, dormez bien!', level: 'A1', category: 'Greetings' },
    { word: 'merci', translation: 'thank you', example: 'Merci beaucoup pour votre aide.', level: 'A1', category: 'Greetings' },
    { word: 'merci beaucoup', translation: 'thank you very much', example: 'Merci beaucoup pour le cadeau!', level: 'A1', category: 'Greetings' },
    { word: 'de rien', translation: 'you\'re welcome', example: 'De rien, c\'était un plaisir.', level: 'A1', category: 'Greetings' },
    { word: 'je vous en prie', translation: 'you\'re welcome (formal)', example: 'Je vous en prie, c\'était un plaisir.', level: 'A1', category: 'Greetings' },
    { word: 's\'il vous plaît', translation: 'please (formal)', example: 'Un café, s\'il vous plaît.', level: 'A1', category: 'Greetings' },
    { word: 's\'il te plaît', translation: 'please (informal)', example: 'Passe-moi le sel, s\'il te plaît.', level: 'A1', category: 'Greetings' },
    
    // A1 Level - Basics
    { word: 'oui', translation: 'yes', example: 'Oui, je comprends.', level: 'A1', category: 'Basics' },
    { word: 'non', translation: 'no', example: 'Non, je ne comprends pas.', level: 'A1', category: 'Basics' },
    { word: 'peut-être', translation: 'maybe', example: 'Peut-être que je viendrai demain.', level: 'A1', category: 'Basics' },
    { word: 'excusez-moi', translation: 'excuse me', example: 'Excusez-moi, où est la gare?', level: 'A1', category: 'Basics' },
    { word: 'pardon', translation: 'sorry', example: 'Pardon, je ne parle pas bien français.', level: 'A1', category: 'Basics' },
    { word: 'je m\'appelle', translation: 'my name is', example: 'Je m\'appelle Marie.', level: 'A1', category: 'Basics' },
    { word: 'comment vous appelez-vous', translation: 'what is your name (formal)', example: 'Comment vous appelez-vous?', level: 'A1', category: 'Basics' },
    { word: 'comment t\'appelles-tu', translation: 'what is your name (informal)', example: 'Comment t\'appelles-tu?', level: 'A1', category: 'Basics' },
    { word: 'enchanté', translation: 'nice to meet you', example: 'Enchanté de faire votre connaissance.', level: 'A1', category: 'Basics' },
    { word: 'comment allez-vous', translation: 'how are you (formal)', example: 'Comment allez-vous aujourd\'hui?', level: 'A1', category: 'Basics' },
    { word: 'comment vas-tu', translation: 'how are you (informal)', example: 'Comment vas-tu aujourd\'hui?', level: 'A1', category: 'Basics' },
    { word: 'ça va', translation: 'how are you/I\'m fine', example: 'Ça va bien, merci.', level: 'A1', category: 'Basics' },
    { word: 'bien', translation: 'good/well', example: 'Je vais bien.', level: 'A1', category: 'Basics' },
    { word: 'mal', translation: 'bad/poorly', example: 'Je me sens mal.', level: 'A1', category: 'Basics' },
    { word: 'comme ci, comme ça', translation: 'so-so', example: 'Comment vas-tu? Comme ci, comme ça.', level: 'A1', category: 'Basics' },
    
    // A1 Level - Numbers
    { word: 'un', translation: 'one', example: 'J\'ai un frère.', level: 'A1', category: 'Numbers' },
    { word: 'deux', translation: 'two', example: 'J\'ai deux sœurs.', level: 'A1', category: 'Numbers' },
    { word: 'trois', translation: 'three', example: 'Il y a trois livres sur la table.', level: 'A1', category: 'Numbers' },
    { word: 'quatre', translation: 'four', example: 'Nous avons quatre chaises.', level: 'A1', category: 'Numbers' },
    { word: 'cinq', translation: 'five', example: 'Il y a cinq personnes dans ma famille.', level: 'A1', category: 'Numbers' },
    { word: 'six', translation: 'six', example: 'J\'ai six ans.', level: 'A1', category: 'Numbers' },
    { word: 'sept', translation: 'seven', example: 'Il est sept heures.', level: 'A1', category: 'Numbers' },
    { word: 'huit', translation: 'eight', example: 'J\'ai huit cousins.', level: 'A1', category: 'Numbers' },
    { word: 'neuf', translation: 'nine', example: 'Il y a neuf étudiants dans la classe.', level: 'A1', category: 'Numbers' },
    { word: 'dix', translation: 'ten', example: 'J\'ai dix doigts.', level: 'A1', category: 'Numbers' },
    
    // A1 Level - Food
    { word: 'pain', translation: 'bread', example: 'J\'achète du pain à la boulangerie.', level: 'A1', category: 'Food' },
    { word: 'fromage', translation: 'cheese', example: 'Le fromage français est délicieux.', level: 'A1', category: 'Food' },
    { word: 'eau', translation: 'water', example: 'Je voudrais un verre d\'eau, s\'il vous plaît.', level: 'A1', category: 'Food' },
    { word: 'café', translation: 'coffee', example: 'Je bois un café tous les matins.', level: 'A1', category: 'Food' },
    { word: 'thé', translation: 'tea', example: 'Préférez-vous le thé ou le café?', level: 'A1', category: 'Food' },
    
    // A2 Level - Travel
    { word: 'voyage', translation: 'trip/journey', example: 'J\'ai fait un voyage en France l\'été dernier.', level: 'A2', category: 'Travel' },
    { word: 'hôtel', translation: 'hotel', example: 'Nous avons réservé une chambre d\'hôtel.', level: 'A2', category: 'Travel' },
    { word: 'passeport', translation: 'passport', example: 'N\'oubliez pas votre passeport pour voyager.', level: 'A2', category: 'Travel' },
    { word: 'valise', translation: 'suitcase', example: 'Ma valise est trop lourde.', level: 'A2', category: 'Travel' },
    { word: 'billet', translation: 'ticket', example: 'J\'ai acheté un billet d\'avion pour Paris.', level: 'A2', category: 'Travel' },
    
    // B1 Level - Work
    { word: 'travail', translation: 'work', example: 'J\'aime mon travail.', level: 'B1', category: 'Work' },
    { word: 'bureau', translation: 'office', example: 'Mon bureau est au deuxième étage.', level: 'B1', category: 'Work' },
    { word: 'réunion', translation: 'meeting', example: 'J\'ai une réunion importante demain.', level: 'B1', category: 'Work' },
    { word: 'collègue', translation: 'colleague', example: 'Mes collègues sont très sympathiques.', level: 'B1', category: 'Work' },
    { word: 'entreprise', translation: 'company', example: 'Je travaille pour une grande entreprise.', level: 'B1', category: 'Work' },
    
    // B2 Level - Technology
    { word: 'ordinateur', translation: 'computer', example: 'J\'utilise mon ordinateur tous les jours.', level: 'B2', category: 'Technology' },
    { word: 'téléphone portable', translation: 'mobile phone', example: 'J\'ai oublié mon téléphone portable à la maison.', level: 'B2', category: 'Technology' },
    { word: 'internet', translation: 'internet', example: 'Je me connecte à Internet pour chercher des informations.', level: 'B2', category: 'Technology' },
    { word: 'application', translation: 'app', example: 'J\'ai téléchargé une nouvelle application sur mon téléphone.', level: 'B2', category: 'Technology' },
    { word: 'réseau social', translation: 'social network', example: 'Les réseaux sociaux sont très populaires aujourd\'hui.', level: 'B2', category: 'Technology' },
    
    // C1 Level - Environment
    { word: 'environnement', translation: 'environment', example: 'Nous devons protéger l\'environnement.', level: 'C1', category: 'Nature' },
    { word: 'développement durable', translation: 'sustainable development', example: 'Le développement durable est important pour l\'avenir de notre planète.', level: 'C1', category: 'Nature' },
    { word: 'réchauffement climatique', translation: 'global warming', example: 'Le réchauffement climatique est un problème mondial.', level: 'C1', category: 'Nature' },
    { word: 'biodiversité', translation: 'biodiversity', example: 'La biodiversité est menacée par les activités humaines.', level: 'C1', category: 'Nature' },
    { word: 'écosystème', translation: 'ecosystem', example: 'Chaque écosystème a son propre équilibre.', level: 'C1', category: 'Nature' }
  ];

  // Create CSV content
  const headers = 'word,translation,example,level,category\n';
  const rows = vocabularyData.map(item => 
    `"${item.word}","${item.translation}","${item.example}","${item.level}","${item.category}"`
  ).join('\n');
  const csvContent = headers + rows;

  // Ensure directory exists
  const dirPath = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Write to file
  const filePath = outputPath || path.join(dirPath, 'vocabulary.csv');
  fs.writeFileSync(filePath, csvContent, 'utf8');

  console.log(`Comprehensive vocabulary CSV created at ${filePath}`);
  console.log(`Created ${vocabularyData.length} vocabulary items across ${categories.length} categories`);
}

// If this file is run directly (not imported)
if (require.main === module) {
  // Generate the comprehensive vocabulary CSV
  generateComprehensiveVocabularyCSV();
  
  // Seed the database with the vocabulary
  seedVocabulary()
    .then(() => {
      console.log('Vocabulary seeding completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Error seeding vocabulary:', error);
      process.exit(1);
    });
}
