import { 
  User, 
  Lesson, 
  LessonProgress, 
  VocabularyItem,
  Conversation,
  ExamResult,
  Message
} from '../types/api';

// Define the structure of our in-memory database
interface MockDatabase {
  users: User[];
  lessons: Lesson[];
  lessonProgress: Record<number, LessonProgress[]>; // userId -> progress[]
  vocabularyProgress: Record<number, VocabularyItem[]>; // userId -> vocabulary[]
  examProgress: Record<number, ExamResult[]>; // userId -> examResults[]
  conversations: Conversation[];
  nextUserId: number;
  nextLessonId: number;
}

// Initialize an empty database
const db: MockDatabase = {
  users: [],
  lessons: [],
  lessonProgress: {},
  vocabularyProgress: {},
  examProgress: {},
  conversations: [],
  nextUserId: 1,
  nextLessonId: 1,
};

// User operations
export const findUserById = (id: number): User | undefined => {
  return db.users.find(user => user.id === id);
};

export const findUserByEmail = (email: string): User | undefined => {
  return db.users.find(user => user.email === email);
};

export const createUser = (userData: Omit<User, 'id'>): User => {
  const newUser: User = {
    ...userData,
    id: db.nextUserId++
  };
  db.users.push(newUser);
  
  // Initialize empty progress arrays for the new user
  db.lessonProgress[newUser.id] = [];
  db.vocabularyProgress[newUser.id] = [];
  db.examProgress[newUser.id] = [];
  
  return newUser;
};

export const updateUser = (id: number, userData: Partial<User>): User | undefined => {
  const userIndex = db.users.findIndex(user => user.id === id);
  if (userIndex === -1) return undefined;
  
  db.users[userIndex] = {
    ...db.users[userIndex],
    ...userData
  };
  
  return db.users[userIndex];
};

// Lesson operations
export const getAllLessons = (): Lesson[] => {
  return db.lessons;
};

export const getLessonsByLevel = (level: string): Lesson[] => {
  return db.lessons.filter(lesson => lesson.level === level);
};

export const getLessonsByTopic = (topic: string): Lesson[] => {
  return db.lessons.filter(lesson => lesson.topics.includes(topic));
};

export const getLessonById = (id: number): Lesson | undefined => {
  return db.lessons.find(lesson => lesson.id === id);
};

export const updateLessonProgress = (
  userId: number,
  lessonId: number,
  progress: Partial<LessonProgress>
): LessonProgress | undefined => {
  if (!db.lessonProgress[userId]) return undefined;
  
  const existingProgressIndex = db.lessonProgress[userId].findIndex(
    p => p.lessonId === lessonId
  );
  
  if (existingProgressIndex >= 0) {
    // Update existing progress
    db.lessonProgress[userId][existingProgressIndex] = {
      ...db.lessonProgress[userId][existingProgressIndex],
      ...progress
    };
    return db.lessonProgress[userId][existingProgressIndex];
  } else {
    // Create new progress
    const newProgress: LessonProgress = {
      lessonId,
      completed: false,
      score: 0,
      ...progress
    };
    db.lessonProgress[userId].push(newProgress);
    return newProgress;
  }
};

export const getLessonProgress = (userId: number, lessonId?: number): LessonProgress[] | LessonProgress | undefined => {
  const userProgress = db.lessonProgress[userId];
  if (!userProgress) return undefined;
  
  if (lessonId !== undefined) {
    return userProgress.find(p => p.lessonId === lessonId);
  }
  return userProgress;
};

// Vocabulary operations
export const getUserVocabulary = (userId: number): VocabularyItem[] => {
  return db.vocabularyProgress[userId] || [];
};

export const addUserVocabulary = (userId: number, item: VocabularyItem): VocabularyItem => {
  if (!db.vocabularyProgress[userId]) {
    db.vocabularyProgress[userId] = [];
  }
  
  // Check if word already exists
  const existingIndex = db.vocabularyProgress[userId].findIndex(
    v => v.word === item.word
  );
  
  if (existingIndex >= 0) {
    // Update existing vocabulary item
    db.vocabularyProgress[userId][existingIndex] = {
      ...db.vocabularyProgress[userId][existingIndex],
      ...item
    };
    return db.vocabularyProgress[userId][existingIndex];
  } else {
    // Add new vocabulary item
    db.vocabularyProgress[userId].push(item);
    return item;
  }
};

export const updateVocabularyItem = (userId: number, word: string, updates: Partial<VocabularyItem>): VocabularyItem | undefined => {
  if (!db.vocabularyProgress[userId]) return undefined;
  
  const itemIndex = db.vocabularyProgress[userId].findIndex(item => item.word === word);
  if (itemIndex === -1) return undefined;
  
  db.vocabularyProgress[userId][itemIndex] = {
    ...db.vocabularyProgress[userId][itemIndex],
    ...updates
  };
  
  return db.vocabularyProgress[userId][itemIndex];
};

// Conversation operations
export const getConversation = (id: string): Conversation | undefined => {
  return db.conversations.find(conv => conv.id === id);
};

export const getUserConversations = (userId: number): Conversation[] => {
  return db.conversations.filter(conv => conv.userId === userId);
};

export const createConversation = (userId: number, title: string, context: string, initialMessage?: string): Conversation => {
  const now = new Date().toISOString();
  const messages: Message[] = [];
  
  if (initialMessage) {
    messages.push({
      role: 'user',
      content: initialMessage,
      timestamp: now
    });
  }
  
  const newConversation: Conversation = {
    id: `conv_${Date.now()}`,
    userId,
    title,
    context,
    messages,
    startedAt: now,
    lastMessageAt: now
  };
  
  db.conversations.push(newConversation);
  return newConversation;
};

export const addMessageToConversation = (conversationId: string, message: Omit<Message, 'timestamp'>): Conversation | undefined => {
  const conversationIndex = db.conversations.findIndex(conv => conv.id === conversationId);
  if (conversationIndex === -1) return undefined;
  
  const now = new Date().toISOString();
  const newMessage: Message = {
    ...message,
    timestamp: now
  };
  
  db.conversations[conversationIndex].messages.push(newMessage);
  db.conversations[conversationIndex].lastMessageAt = now;
  
  return db.conversations[conversationIndex];
};

// Exam operations
export const saveExamResult = (result: ExamResult): ExamResult => {
  if (!db.examProgress[result.userId]) {
    db.examProgress[result.userId] = [];
  }
  
  db.examProgress[result.userId].push(result);
  return result;
};

export const getUserExamResults = (userId: number): ExamResult[] => {
  return db.examProgress[userId] || [];
};

// Initialize the database with sample data
export const initializeDb = (): void => {
  // Create a sample user
  const sampleUser: User = {
    id: db.nextUserId++,
    name: 'John Doe',
    email: 'john@example.com',
    level: 'A1',
    points: 120,
    streakDays: 5,
    joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    learningGoals: ['Travel', 'Business'],
    completedLessons: 8,
    lastActive: new Date().toISOString(),
    preferences: {
      dailyGoal: 15,
      notifications: true,
      theme: 'light'
    }
  };
  
  db.users.push(sampleUser);
  db.lessonProgress[sampleUser.id] = [];
  db.vocabularyProgress[sampleUser.id] = [];
  db.examProgress[sampleUser.id] = [];
  
  // Create sample lessons
  const lesson1: Lesson = {
    id: db.nextLessonId++,
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
  };
  
  const lesson2: Lesson = {
    id: db.nextLessonId++,
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
  };
  
  db.lessons.push(lesson1);
  db.lessons.push(lesson2);
  
  // Add sample vocabulary
  db.vocabularyProgress[sampleUser.id] = [
    {
      word: 'bonjour',
      translation: 'hello',
      example: 'Bonjour! Comment allez-vous?',
      level: 'A1',
      learned: true,
      lastPracticed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
    },
    {
      word: 'merci',
      translation: 'thank you',
      example: 'Merci beaucoup pour votre aide.',
      level: 'A1',
      learned: true,
      lastPracticed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    },
    {
      word: 'au revoir',
      translation: 'goodbye',
      example: 'Au revoir et à bientôt!',
      level: 'A1',
      learned: false
    }
  ];
  
  // Add sample lesson progress
  db.lessonProgress[sampleUser.id] = [
    {
      lessonId: lesson1.id,
      completed: true,
      score: 90,
      startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
    },
    {
      lessonId: lesson2.id,
      completed: false,
      score: 30,
      startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    }
  ];
  
  // Create sample conversation
  const sampleConversation: Conversation = {
    id: 'conv_1',
    userId: sampleUser.id,
    title: 'Ordering at a Restaurant',
    context: 'Practice ordering food in a French restaurant',
    messages: [
      {
        role: 'user',
        content: 'Bonjour, je voudrais une table pour deux personnes, s\'il vous plaît.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
      },
      {
        role: 'assistant',
        content: 'Bonjour, oui bien sûr. Suivez-moi, s\'il vous plaît. Voici votre table.',
        timestamp: new Date(Date.now() - 29 * 60 * 1000).toISOString() // 29 minutes ago
      },
      {
        role: 'user',
        content: 'Merci. Pouvons-nous voir le menu?',
        timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString() // 28 minutes ago
      },
      {
        role: 'assistant',
        content: 'Bien sûr, voici les menus. Je vous laisse regarder et je reviendrai dans quelques minutes pour prendre votre commande.',
        timestamp: new Date(Date.now() - 27 * 60 * 1000).toISOString() // 27 minutes ago
      }
    ],
    startedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    lastMessageAt: new Date(Date.now() - 27 * 60 * 1000).toISOString()
  };
  
  db.conversations.push(sampleConversation);
  
  // Add sample exam result
  const sampleExamResult: ExamResult = {
    userId: sampleUser.id,
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
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  };
  
  db.examProgress[sampleUser.id] = [sampleExamResult];
};

// Initialize the database on module load
initializeDb();

// Export the database for direct access if needed
export const getMockDb = (): MockDatabase => db; 