// User-related types
export interface User {
  id: number;
  name: string;
  email: string;
  level: string;
  points: number;
  streakDays: number;
  joinedAt: string;
  learningGoals: string[];
  completedLessons: number;
  lastActive: string;
  preferences: {
    dailyGoal: number;
    notifications: boolean;
    theme: 'light' | 'dark';
  };
}

// Auth-related types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Lesson-related types
export interface LessonExercise {
  id: number;
  sectionId: number;
  type: 'multiple-choice' | 'fill-in-blank' | 'matching' | 'writing' | 'speaking' | 'translation' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
}

export interface LessonSection {
  id: number;
  lessonId: number;
  title: string;
  type: 'text' | 'audio' | 'video' | 'image' | 'exercise';
  content?: string;
  audioUrl?: string;
  videoUrl?: string;
  imageUrl?: string;
  order: number;
  exercises?: LessonExercise[];
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  level: string;
  duration: number; // in minutes
  topics: string[];
  sections?: LessonSection[];
}

export interface LessonProgress {
  id?: number;
  userId?: number;
  lessonId: number;
  completed: boolean;
  score: number;
  startedAt?: string;
  completedAt?: string | null;
  answers?: Record<number, string | string[]>;
}

export interface LessonSubmissionResult {
  score: number;
  feedback: Record<number, {
    correct: boolean;
    explanation?: string;
  }>;
  completed: boolean;
}

// Vocabulary and Practice types
export interface VocabularyItem {
  id?: number;
  word: string;
  translation: string;
  example: string;
  level: string;
  category?: string;
  pronunciation?: string;
  usageContext?: string[];
  learned: boolean;
  lastPracticed?: string;
  nextReview?: string;
  repetitionStage?: number;
}

export interface PracticeSession {
  id: string;
  userId: number;
  type: 'vocabulary' | 'grammar' | 'listening' | 'speaking';
  items: Array<VocabularyItem | LessonExercise>;
  startedAt: string;
  completedAt?: string;
  score?: number;
}

// Conversation types
export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  userId: number;
  title: string;
  context: string;
  messages: Message[];
  startedAt: string;
  lastMessageAt: string;
}

// Exam types
export interface ExamSection {
  name: string;
  level: string;
  questions: LessonExercise[];
  duration: number; // in minutes
}

export interface ExamResult {
  userId: number;
  examId: string;
  section: string;
  level: string;
  score: number;
  details: Array<{
    questionIndex: number;
    correct: boolean;
    userAnswer: string | string[];
  }>;
  completedAt: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

// HTTP request method types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Assessment-related types
export interface AssessmentResponse {
  score: number;
  level: string;
  levelDescription: string;
  assessment: {
    weaknesses: string[];
    strengths: string[];
    recommendedFocus: string[];
    detailedResults: {
      grammar: number;
      vocabulary: number;
      listening: number;
      reading: number;
      speaking: number;
    };
  };
}

// Pronunciation-related types
export interface WordScore {
  word: string;
  score: number;
  feedback: string;
}

export interface ProblemSound {
  sound: string;
  description: string;
}

export interface PronunciationResponse {
  transcript: string;
  expected: string;
  similarity: number;
  feedback: {
    overallScore: number;
    wordScores: WordScore[];
    problemSounds: ProblemSound[];
    recommendations: string[];
  };
}

// Conversation-related types
export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ConversationResponse {
  conversationId: string;
  message: string;
  context: string;
  history: ConversationMessage[];
}