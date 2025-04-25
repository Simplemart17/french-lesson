import { prisma } from './prisma';
import type { 
  User, 
  Lesson, 
  LessonProgress, 
  VocabularyItem,
  Conversation,
  ExamResult,
  Message
} from '../types/api';
import { hash, compare } from 'bcrypt';

// User operations
export const findUserById = async (id: number): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { id }
  });
  
  if (!user) return null;
  
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    level: user.level,
    points: user.points,
    streakDays: user.streakDays,
    joinedAt: user.joinedAt.toISOString(),
    learningGoals: user.learningGoals,
    completedLessons: user.completedLessons,
    lastActive: user.lastActive.toISOString(),
    preferences: {
      dailyGoal: user.dailyGoal,
      notifications: user.notifications,
      theme: user.theme as 'light' | 'dark',
    }
  };
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) return null;
  
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    level: user.level,
    points: user.points,
    streakDays: user.streakDays,
    joinedAt: user.joinedAt.toISOString(),
    learningGoals: user.learningGoals,
    completedLessons: user.completedLessons,
    lastActive: user.lastActive.toISOString(),
    preferences: {
      dailyGoal: user.dailyGoal,
      notifications: user.notifications,
      theme: user.theme as 'light' | 'dark',
    }
  };
};

export const createUser = async (userData: Omit<User, 'id'> & { password: string }): Promise<User> => {
  const hashedPassword = await hash(userData.password, 10);
  
  const user = await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      level: userData.level,
      points: userData.points,
      streakDays: userData.streakDays,
      learningGoals: userData.learningGoals,
      completedLessons: userData.completedLessons,
      lastActive: new Date(userData.lastActive),
      dailyGoal: userData.preferences.dailyGoal,
      notifications: userData.preferences.notifications,
      theme: userData.preferences.theme,
    }
  });
  
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    level: user.level,
    points: user.points,
    streakDays: user.streakDays,
    joinedAt: user.joinedAt.toISOString(),
    learningGoals: user.learningGoals,
    completedLessons: user.completedLessons,
    lastActive: user.lastActive.toISOString(),
    preferences: {
      dailyGoal: user.dailyGoal,
      notifications: user.notifications,
      theme: user.theme as 'light' | 'dark',
    }
  };
};

export const updateUser = async (id: number, userData: Partial<User>): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { id }
  });
  
  if (!user) return null;
  
  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      name: userData.name ?? user.name,
      level: userData.level ?? user.level,
      points: userData.points ?? user.points,
      streakDays: userData.streakDays ?? user.streakDays,
      learningGoals: userData.learningGoals ?? user.learningGoals,
      completedLessons: userData.completedLessons ?? user.completedLessons,
      lastActive: userData.lastActive ? new Date(userData.lastActive) : user.lastActive,
      dailyGoal: userData.preferences?.dailyGoal ?? user.dailyGoal,
      notifications: userData.preferences?.notifications ?? user.notifications,
      theme: userData.preferences?.theme ?? user.theme,
    }
  });
  
  return {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    level: updatedUser.level,
    points: updatedUser.points,
    streakDays: updatedUser.streakDays,
    joinedAt: updatedUser.joinedAt.toISOString(),
    learningGoals: updatedUser.learningGoals,
    completedLessons: updatedUser.completedLessons,
    lastActive: updatedUser.lastActive.toISOString(),
    preferences: {
      dailyGoal: updatedUser.dailyGoal,
      notifications: updatedUser.notifications,
      theme: updatedUser.theme as 'light' | 'dark',
    }
  };
};

export const verifyUserPassword = async (email: string, password: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user || !user.password) return null;
  
  const isValidPassword = await compare(password, user.password);
  if (!isValidPassword) return null;
  
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    level: user.level,
    points: user.points,
    streakDays: user.streakDays,
    joinedAt: user.joinedAt.toISOString(),
    learningGoals: user.learningGoals,
    completedLessons: user.completedLessons,
    lastActive: user.lastActive.toISOString(),
    preferences: {
      dailyGoal: user.dailyGoal,
      notifications: user.notifications,
      theme: user.theme as 'light' | 'dark',
    }
  };
};

// Lesson operations
export const getAllLessons = async (): Promise<Lesson[]> => {
  const lessons = await prisma.lesson.findMany();
  
  return lessons.map((lesson: any) => ({
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    level: lesson.level,
    duration: lesson.duration,
    topics: lesson.topics,
    content: lesson.content as any,
  }));
};

export const getLessonsByLevel = async (level: string): Promise<Lesson[]> => {
  const lessons = await prisma.lesson.findMany({
    where: { level }
  });
  
  return lessons.map((lesson: any) => ({
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    level: lesson.level,
    duration: lesson.duration,
    topics: lesson.topics,
    content: lesson.content as any,
  }));
};

export const getLessonsByTopic = async (topic: string): Promise<Lesson[]> => {
  const lessons = await prisma.lesson.findMany({
    where: {
      topics: {
        has: topic
      }
    }
  });
  
  return lessons.map((lesson: any) => ({
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    level: lesson.level,
    duration: lesson.duration,
    topics: lesson.topics,
    content: lesson.content as any,
  }));
};

export const getLessonById = async (id: number): Promise<Lesson | null> => {
  const lesson = await prisma.lesson.findUnique({
    where: { id }
  });
  
  if (!lesson) return null;
  
  return {
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    level: lesson.level,
    duration: lesson.duration,
    topics: lesson.topics,
    content: lesson.content as any,
  };
};

export const updateLessonProgress = async (
  userId: number,
  lessonId: number,
  progress: Partial<LessonProgress>
): Promise<LessonProgress | null> => {
  // Check if progress already exists
  const existingProgress = await prisma.lessonProgress.findUnique({
    where: {
      userId_lessonId: {
        userId,
        lessonId
      }
    }
  });
  
  const data = {
    completed: progress.completed ?? existingProgress?.completed ?? false,
    score: progress.score ?? existingProgress?.score ?? 0,
    startedAt: progress.startedAt ? new Date(progress.startedAt) : existingProgress?.startedAt,
    completedAt: progress.completedAt ? new Date(progress.completedAt) : existingProgress?.completedAt,
    answers: progress.answers ? progress.answers : existingProgress?.answers,
  };
  
  if (existingProgress) {
    // Update existing progress
    const updatedProgress = await prisma.lessonProgress.update({
      where: {
        userId_lessonId: {
          userId,
          lessonId
        }
      },
      data
    });
    
    return {
      lessonId: updatedProgress.lessonId,
      completed: updatedProgress.completed,
      score: updatedProgress.score,
      startedAt: updatedProgress.startedAt?.toISOString(),
      completedAt: updatedProgress.completedAt?.toISOString(),
      answers: updatedProgress.answers as any,
    };
  } else {
    // Create new progress
    const newProgress = await prisma.lessonProgress.create({
      data: {
        userId,
        lessonId,
        ...data
      }
    });
    
    return {
      lessonId: newProgress.lessonId,
      completed: newProgress.completed,
      score: newProgress.score,
      startedAt: newProgress.startedAt?.toISOString(),
      completedAt: newProgress.completedAt?.toISOString(),
      answers: newProgress.answers as any,
    };
  }
};

export const getLessonProgress = async (userId: number, lessonId?: number): Promise<LessonProgress[] | LessonProgress | null> => {
  if (lessonId) {
    const progress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId
        }
      }
    });
    
    if (!progress) return null;
    
    return {
      lessonId: progress.lessonId,
      completed: progress.completed,
      score: progress.score,
      startedAt: progress.startedAt?.toISOString(),
      completedAt: progress.completedAt?.toISOString(),
      answers: progress.answers as any,
    };
  } else {
    const progressList = await prisma.lessonProgress.findMany({
      where: { userId }
    });
    
    return progressList.map((progress: any) => ({
      lessonId: progress.lessonId,
      completed: progress.completed,
      score: progress.score,
      startedAt: progress.startedAt?.toISOString(),
      completedAt: progress.completedAt?.toISOString(),
      answers: progress.answers as any,
    }));
  }
};

// Vocabulary operations
export const getUserVocabulary = async (userId: number): Promise<VocabularyItem[]> => {
  const userVocab = await prisma.userVocabulary.findMany({
    where: { userId },
    include: { vocabulary: true }
  });
  
  return userVocab.map((item: any) => ({
    word: item.vocabulary.word,
    translation: item.vocabulary.translation,
    example: item.vocabulary.example,
    level: item.vocabulary.level,
    learned: item.learned,
    lastPracticed: item.lastPracticed?.toISOString(),
  }));
};

export const addUserVocabulary = async (userId: number, item: VocabularyItem): Promise<VocabularyItem> => {
  // Find or create vocabulary word
  let vocabulary = await prisma.vocabulary.findUnique({
    where: { word: item.word }
  });
  
  if (!vocabulary) {
    vocabulary = await prisma.vocabulary.create({
      data: {
        word: item.word,
        translation: item.translation,
        example: item.example,
        level: item.level,
      }
    });
  }
  
  // Find or create user-vocabulary relationship
  const existingUserVocab = await prisma.userVocabulary.findUnique({
    where: {
      userId_vocabularyId: {
        userId,
        vocabularyId: vocabulary.id
      }
    }
  });
  
  if (existingUserVocab) {
    const updated = await prisma.userVocabulary.update({
      where: {
        userId_vocabularyId: {
          userId,
          vocabularyId: vocabulary.id
        }
      },
      data: {
        learned: item.learned,
        lastPracticed: item.lastPracticed ? new Date(item.lastPracticed) : undefined,
      },
      include: { vocabulary: true }
    });
    
    return {
      word: updated.vocabulary.word,
      translation: updated.vocabulary.translation,
      example: updated.vocabulary.example,
      level: updated.vocabulary.level,
      learned: updated.learned,
      lastPracticed: updated.lastPracticed?.toISOString(),
    };
  } else {
    const newUserVocab = await prisma.userVocabulary.create({
      data: {
        userId,
        vocabularyId: vocabulary.id,
        learned: item.learned,
        lastPracticed: item.lastPracticed ? new Date(item.lastPracticed) : undefined,
      },
      include: { vocabulary: true }
    });
    
    return {
      word: newUserVocab.vocabulary.word,
      translation: newUserVocab.vocabulary.translation,
      example: newUserVocab.vocabulary.example,
      level: newUserVocab.vocabulary.level,
      learned: newUserVocab.learned,
      lastPracticed: newUserVocab.lastPracticed?.toISOString(),
    };
  }
};

export const updateVocabularyItem = async (userId: number, word: string, updates: Partial<VocabularyItem>): Promise<VocabularyItem | null> => {
  // Find vocabulary word
  const vocabulary = await prisma.vocabulary.findUnique({
    where: { word }
  });
  
  if (!vocabulary) return null;
  
  // Update user-vocabulary relationship
  const userVocab = await prisma.userVocabulary.findUnique({
    where: {
      userId_vocabularyId: {
        userId,
        vocabularyId: vocabulary.id
      }
    }
  });
  
  if (!userVocab) return null;
  
  const updated = await prisma.userVocabulary.update({
    where: {
      userId_vocabularyId: {
        userId,
        vocabularyId: vocabulary.id
      }
    },
    data: {
      learned: updates.learned ?? userVocab.learned,
      lastPracticed: updates.lastPracticed ? new Date(updates.lastPracticed) : userVocab.lastPracticed,
    },
    include: { vocabulary: true }
  });
  
  return {
    word: updated.vocabulary.word,
    translation: updated.vocabulary.translation,
    example: updated.vocabulary.example,
    level: updated.vocabulary.level,
    learned: updated.learned,
    lastPracticed: updated.lastPracticed?.toISOString(),
  };
};

// Conversation operations
export const getConversation = async (id: string): Promise<Conversation | null> => {
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: { messages: true }
  });
  
  if (!conversation) return null;
  
  return {
    id: conversation.id,
    userId: conversation.userId,
    title: conversation.title,
    context: conversation.context,
    messages: conversation.messages.map((msg: any) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
      timestamp: msg.timestamp.toISOString(),
    })),
    startedAt: conversation.startedAt.toISOString(),
    lastMessageAt: conversation.lastMessageAt.toISOString(),
  };
};

export const getUserConversations = async (userId: number): Promise<Conversation[]> => {
  const conversations = await prisma.conversation.findMany({
    where: { userId },
    include: { messages: true }
  });
  
  return conversations.map((conv: any) => ({
    id: conv.id,
    userId: conv.userId,
    title: conv.title,
    context: conv.context,
    messages: conv.messages.map((msg: any) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
      timestamp: msg.timestamp.toISOString(),
    })),
    startedAt: conv.startedAt.toISOString(),
    lastMessageAt: conv.lastMessageAt.toISOString(),
  }));
};

export const createConversation = async (userId: number, title: string, context: string, initialMessage?: string): Promise<Conversation> => {
  const now = new Date();
  
  const conversation = await prisma.conversation.create({
    data: {
      userId,
      title,
      context,
      messages: initialMessage ? {
        create: {
          role: 'user',
          content: initialMessage,
          timestamp: now
        }
      } : undefined
    },
    include: { messages: true }
  });
  
  return {
    id: conversation.id,
    userId: conversation.userId,
    title: conversation.title,
    context: conversation.context,
    messages: conversation.messages.map((msg: any) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
      timestamp: msg.timestamp.toISOString(),
    })),
    startedAt: conversation.startedAt.toISOString(),
    lastMessageAt: conversation.lastMessageAt.toISOString(),
  };
};

export const addMessageToConversation = async (conversationId: string, message: Omit<Message, 'timestamp'>): Promise<Conversation | null> => {
  const now = new Date();
  
  // First check if conversation exists
  const conversationExists = await prisma.conversation.findUnique({
    where: { id: conversationId }
  });
  
  if (!conversationExists) return null;
  
  // Add message and update lastMessageAt
  await prisma.message.create({
    data: {
      conversationId,
      role: message.role,
      content: message.content,
      timestamp: now
    }
  });
  
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { lastMessageAt: now }
  });
  
  // Get updated conversation
  const updatedConversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { messages: true }
  });
  
  if (!updatedConversation) return null;
  
  return {
    id: updatedConversation.id,
    userId: updatedConversation.userId,
    title: updatedConversation.title,
    context: updatedConversation.context,
    messages: updatedConversation.messages.map((msg: any) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
      timestamp: msg.timestamp.toISOString(),
    })),
    startedAt: updatedConversation.startedAt.toISOString(),
    lastMessageAt: updatedConversation.lastMessageAt.toISOString(),
  };
};

// Exam operations
export const saveExamResult = async (result: ExamResult): Promise<ExamResult> => {
  const examResult = await prisma.examResult.create({
    data: {
      userId: result.userId,
      examId: result.examId,
      section: result.section,
      level: result.level,
      score: result.score,
      details: result.details,
      completedAt: new Date(result.completedAt)
    }
  });
  
  return {
    userId: examResult.userId,
    examId: examResult.examId,
    section: examResult.section,
    level: examResult.level,
    score: examResult.score,
    details: examResult.details as any,
    completedAt: examResult.completedAt.toISOString(),
  };
};

export const getUserExamResults = async (userId: number): Promise<ExamResult[]> => {
  const results = await prisma.examResult.findMany({
    where: { userId }
  });
  
  return results.map((result: any) => ({
    userId: result.userId,
    examId: result.examId,
    section: result.section,
    level: result.level,
    score: result.score,
    details: result.details as any,
    completedAt: result.completedAt.toISOString(),
  }));
}; 