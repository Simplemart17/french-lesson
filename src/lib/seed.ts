import { prisma } from './prisma';
import { hash } from 'bcrypt';

/**
 * Seed the database with initial data
 */
export async function seedDatabase(): Promise<void> {
  console.log('Seeding database...');

  // Check if we already have users
  const existingUsersCount = await prisma.user.count();
  if (existingUsersCount > 0) {
    console.log('Database already seeded. Skipping...');
    return;
  }

  try {
    // Create sample user
    const hashedPassword = await hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        email: 'john@example.com',
        password: hashedPassword,
        name: 'John Doe',
        level: 'A1',
        points: 120,
        streakDays: 5,
        learningGoals: ['Travel', 'Business'],
        completedLessons: 8,
        dailyGoal: 15,
        notifications: true,
        theme: 'light',
      }
    });

    // Create sample lessons
    const lesson1 = await prisma.lesson.create({
      data: {
        title: 'Introduction to French Basics',
        description: 'Learn the fundamental building blocks of French including greetings, introductions, and basic phrases.',
        level: 'A1',
        duration: 20,
        topics: ['Greetings', 'Introductions', 'Basics'],
        content: {
          sections: [
            {
              type: 'text',
              title: 'French Greetings',
              content: 'Bonjour (Hello/Good day)\nBonsoir (Good evening)\nSalut (Hi/Bye, informal)\nAu revoir (Goodbye)\nÀ bientôt (See you soon)'
            },
            {
              type: 'audio',
              title: 'Pronunciation Guide',
              audioUrl: '/audio/lesson1-greetings.mp3',
              transcript: 'Bonjour. Bonsoir. Salut. Au revoir. À bientôt.'
            }
          ],
          exercises: [
            {
              type: 'multiple-choice',
              question: 'How do you say "Hello" in French?',
              options: ['Salut', 'Bonjour', 'Au revoir', 'Merci'],
              correctAnswer: 'Bonjour',
              hint: 'Think of "bon" (good) + "jour" (day)'
            },
            {
              type: 'fill-in-blank',
              question: '_____ is how you say goodbye in French.',
              correctAnswer: 'Au revoir',
              hint: 'It literally means "until seeing again"'
            }
          ]
        }
      }
    });

    const lesson2 = await prisma.lesson.create({
      data: {
        title: 'Common French Phrases',
        description: 'Essential phrases to help you navigate basic conversations in French.',
        level: 'A1',
        duration: 25,
        topics: ['Phrases', 'Conversation', 'Basics'],
        content: {
          sections: [
            {
              type: 'text',
              title: 'Essential Phrases',
              content: 'Comment allez-vous? (How are you? - formal)\nComment ça va? (How are you? - casual)\nJe m\'appelle... (My name is...)\nEnchanté(e) (Nice to meet you)\nS\'il vous plaît (Please - formal)\nMerci (Thank you)\nDe rien (You\'re welcome)'
            },
            {
              type: 'video',
              title: 'Using Phrases in Conversation',
              videoUrl: '/videos/lesson2-phrases.mp4',
              transcript: 'Bonjour! Comment allez-vous? Je m\'appelle Marie. Enchanté!'
            }
          ],
          exercises: [
            {
              type: 'matching',
              question: 'Match the French phrases with their English meanings',
              options: ['Merci', 'Je m\'appelle', 'Comment ça va?', 'Enchanté'],
              correctAnswer: ['Thank you', 'My name is', 'How are you?', 'Nice to meet you'],
              hint: 'Think about the context in which these phrases are used'
            },
            {
              type: 'speaking',
              question: 'Pronounce the following phrase: "Je m\'appelle..."',
              correctAnswer: 'Je m\'appelle',
              hint: 'Break it down: "Je" (I) + "m\'appelle" (call myself)'
            }
          ]
        }
      }
    });

    // Add sample lesson progress
    await prisma.lessonProgress.create({
      data: {
        userId: user.id,
        lessonId: lesson1.id,
        completed: true,
        score: 90,
        startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      }
    });

    await prisma.lessonProgress.create({
      data: {
        userId: user.id,
        lessonId: lesson2.id,
        completed: false,
        score: 30,
        startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      }
    });

    // Create vocabulary words
    const bonjour = await prisma.vocabulary.create({
      data: {
        word: 'bonjour',
        translation: 'hello',
        example: 'Bonjour! Comment allez-vous?',
        level: 'A1'
      }
    });

    const merci = await prisma.vocabulary.create({
      data: {
        word: 'merci',
        translation: 'thank you',
        example: 'Merci beaucoup pour votre aide.',
        level: 'A1'
      }
    });

    const auRevoir = await prisma.vocabulary.create({
      data: {
        word: 'au revoir',
        translation: 'goodbye',
        example: 'Au revoir et à bientôt!',
        level: 'A1'
      }
    });

    // Add user vocabulary progress
    await prisma.userVocabulary.create({
      data: {
        userId: user.id,
        vocabularyId: bonjour.id,
        learned: true,
        lastPracticed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
    });

    await prisma.userVocabulary.create({
      data: {
        userId: user.id,
        vocabularyId: merci.id,
        learned: true,
        lastPracticed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      }
    });

    await prisma.userVocabulary.create({
      data: {
        userId: user.id,
        vocabularyId: auRevoir.id,
        learned: false
      }
    });

    // Create a sample conversation
    const conversation = await prisma.conversation.create({
      data: {
        userId: user.id,
        title: 'Ordering at a Restaurant',
        context: 'Practice ordering food in a French restaurant',
        startedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        lastMessageAt: new Date(Date.now() - 27 * 60 * 1000), // 27 minutes ago
      }
    });

    // Add messages to the conversation
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: 'Bonjour, je voudrais une table pour deux personnes, s\'il vous plaît.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
      }
    });

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: 'Bonjour, oui bien sûr. Suivez-moi, s\'il vous plaît. Voici votre table.',
        timestamp: new Date(Date.now() - 29 * 60 * 1000) // 29 minutes ago
      }
    });

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: 'Merci. Pouvons-nous voir le menu?',
        timestamp: new Date(Date.now() - 28 * 60 * 1000) // 28 minutes ago
      }
    });

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: 'Bien sûr, voici les menus. Je vous laisse regarder et je reviendrai dans quelques minutes pour prendre votre commande.',
        timestamp: new Date(Date.now() - 27 * 60 * 1000) // 27 minutes ago
      }
    });

    // Add a sample exam result
    await prisma.examResult.create({
      data: {
        userId: user.id,
        examId: 'exam_a1_1',
        section: 'Vocabulary',
        level: 'A1',
        score: 80,
        details: [
          {
            questionIndex: 0,
            correct: true,
            userAnswer: 'Bonjour'
          },
          {
            questionIndex: 1,
            correct: true,
            userAnswer: 'Merci'
          },
          {
            questionIndex: 2,
            correct: false,
            userAnswer: 'Bon matin'
          },
          {
            questionIndex: 3,
            correct: true,
            userAnswer: 'Au revoir'
          },
          {
            questionIndex: 4,
            correct: true,
            userAnswer: 'Comment allez-vous'
          }
        ],
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      }
    });

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
} 