// User-related types
export interface User {
  id: number;
  name: string;
  email: string;
  level?: string;
  points?: number;
  streakDays?: number;
  joinedAt?: string;
  learningGoals?: string[];
  completedLessons?: number;
  lastActive?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  dailyGoal?: number; // minutes
  notifications?: boolean;
  theme?: 'light' | 'dark';
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Lesson-related types
export interface Lesson {
  id: number;
  title: string;
  description: string;
  level: string;
  duration: number; // minutes
  topics: string[];
  content?: LessonContent;
}

export interface LessonContent {
  sections: LessonSection[];
  exercises: Exercise[];
}

export interface LessonSection {
  type: 'text' | 'audio' | 'video' | 'image';
  title: string;
  content?: string;
  audioUrl?: string;
  videoUrl?: string;
  imageUrl?: string;
  transcript?: string;
}

export interface Exercise {
  type: 'multiple-choice' | 'fill-in-blank' | 'matching' | 'speaking';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
}

export interface LessonProgress {
  lessonId: number;
  completed: boolean;
  score: number;
}

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
export interface PronunciationResponse {
  overallScore: number;
  wordScores: WordScore[];
  problemSounds: ProblemSound[];
  recommendations: string[];
  recognizedText: string;
}

export interface WordScore {
  word: string;
  score: number;
  feedback: string;
}

export interface ProblemSound {
  sound: string;
  description: string;
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