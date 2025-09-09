import { NextApiRequest } from 'next';

// User-related types
export interface User {
  id: string;
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
  id: string;
  sectionId: string;
  type: 'multiple-choice' | 'fill-in-blank' | 'matching' | 'writing' | 'speaking' | 'translation' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
}

export interface LessonSection {
  id: string;
  lessonId: string;
  title: string;
  type: 'text' | 'audio' | 'video' | 'image' | 'exercise' | 'introduction' | 'practice' | 'summary';
  content?: string;
  audioUrl?: string;
  videoUrl?: string;
  imageUrl?: string;
  order: number;
  exercises?: LessonExercise[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: number; // in minutes
  topics: string[];
  sections?: LessonSection[];
}

export interface LessonProgress {
  id?: string;
  userId?: string;
  lessonId: string;
  completed: boolean;
  score: number;
  startedAt?: string;
  completedAt?: string | null;
  answers?: Record<string, string | string[]>;
}

export interface LessonSubmissionResult {
  score: number;
  feedback: Record<string, {
    correct: boolean;
    explanation?: string;
  }>;
  completed: boolean;
}

// Vocabulary and Practice types
export interface VocabularyItem {
  id?: string;
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
  userId: string;
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
  userId: string;
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
  userId: string;
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
  timeSpent: number;
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

// Generic API error response
export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
  };
}

// Next.js API request with user
export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

// Common database row types
export interface DatabaseRow {
  id: string;
  created_at: string;
  updated_at: string;
}

// Request body types for various endpoints
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface TutorChatRequest {
  message: string;
  conversationId?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
}

export interface AssessmentRequest {
  answers: Record<string, string | string[]>;
  timeSpent?: number;
}

export interface ExamSubmissionRequest {
  answers: Record<string, string | string[]>;
  timeSpent: number;
  sectionId?: string;
}

export interface VocabularyPracticeRequest {
  level?: string;
  category?: string;
  count?: number;
}

export interface PronunciationRequest {
  text: string;
  audioData?: string;
  language?: string;
}

export interface ConversationMessageRequest {
  message: string;
  conversationId?: string;
  context?: string;
}

// Database response types
export interface DatabaseConversation {
  id: string;
  user_id: string;
  title: string;
  context?: string;
  startedAt: string;
  lastMessageAt: string;
  created_at: string;
  updated_at: string;
  messages?: DatabaseMessage[];
}

export interface DatabaseMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseExamResult {
  id: string;
  user_id: string;
  exam_type: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  time_spent: number;
  completed_at: string;
  answers: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface DatabaseLesson {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: number;
  topics: string[];
  sections?: DatabaseLessonSection[];
  created_at: string;
  updated_at: string;
}

export interface DatabaseLessonSection {
  id: string;
  lessonId: string;
  title: string;
  type: string;
  content?: string;
  audioUrl?: string;
  videoUrl?: string;
  order: number;
  exercises?: DatabaseLessonExercise[];
  created_at: string;
  updated_at: string;
}

export interface DatabaseLessonExercise {
  id: string;
  sectionId: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  order: number;
  created_at: string;
  updated_at: string;
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