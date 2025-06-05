import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate required environment variables
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// Create Supabase client for client-side operations (with RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Create Supabase client for server-side operations (bypasses RLS)
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Helper function to get the appropriate client
export const getSupabaseClient = (useAdmin = false) => {
  if (useAdmin && supabaseAdmin) {
    return supabaseAdmin;
  }
  return supabase;
};

// Database table names (matching Prisma schema)
export const TABLES = {
  USERS: 'User',
  LESSONS: 'Lesson',
  LESSON_SECTIONS: 'LessonSection',
  LESSON_PROGRESS: 'LessonProgress',
  VOCABULARY: 'Vocabulary',
  USER_VOCABULARY: 'UserVocabulary',
  CONVERSATIONS: 'Conversation',
  MESSAGES: 'Message',
  CONVERSATION_TEMPLATES: 'ConversationTemplate',
  USER_TEMPLATE_USAGE: 'UserTemplateUsage',
  PRONUNCIATION_EXERCISES: 'PronunciationExercise',
  GRAMMAR_RULES: 'GrammarRule',
  EXAM_RESULTS: 'ExamResult',
  LESSON_EXERCISES: 'LessonExercise',
  PRACTICE_ITEMS: 'PracticeItem',
  PRACTICE_SESSIONS: 'PracticeSession',
  PRONUNCIATION_PRACTICE_ITEMS: 'PronunciationPracticeItem',
} as const;

// Type definitions for better TypeScript support
export type Database = {
  public: {
    Tables: {
      User: {
        Row: {
          id: string;
          name: string;
          email: string;
          password: string;
          level: string;
          points: number;
          streakDays: number;
          joinedAt: string;
          learningGoals: string[];
          completedLessons: number;
          lastActive: string;
          dailyGoal: number;
          notifications: boolean;
          theme: string;
          aiCorrectionEnabled: boolean;
          aiVocabSuggestionsEnabled: boolean;
          preferredVoice: string;
          speechRecognitionEnabled: boolean;
          
        };
        Insert: Omit<Database['public']['Tables']['User']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['User']['Insert']>;
      };
      Lesson: {
        Row: {
          id: string;
          title: string;
          description: string;
          level: string;
          duration: number;
          topics: string[];
        };
        Insert: Omit<Database['public']['Tables']['Lesson']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['Lesson']['Insert']>;
      };
      LessonSection: {
        Row: {
          id: string;
          lessonId: string;
          title: string;
          type: string;
          content: string | null;
          audioUrl: string | null;
          videoUrl: string | null;
          order: number;
        };
        Insert: Omit<Database['public']['Tables']['LessonSection']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['LessonSection']['Insert']>;
      };
      LessonProgress: {
        Row: {
          id: string;
          userId: string;
          lessonId: string;
          completed: boolean;
          score: number | null;
          answers: string[] | null;
          startedAt: string;
          completedAt: string | null;
        };
        Insert: Omit<Database['public']['Tables']['LessonProgress']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['LessonProgress']['Insert']>;
      };
      Vocabulary: {
        Row: {
          id: string;
          word: string;
          translation: string;
          example: string;
          level: string;
          category: string;
          pronunciation: string;
          usageContext: string[];
        };
        Insert: Omit<Database['public']['Tables']['Vocabulary']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['Vocabulary']['Insert']>;
      };
      UserVocabulary: {
        Row: {
          id: string;
          userId: string;
          vocabularyId: string;
          learned: boolean;
          lastPracticed: string | null;
          nextReviewDate: string;
          repetitionStage: number;
        };
        Insert: Omit<Database['public']['Tables']['UserVocabulary']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['UserVocabulary']['Insert']>;
      };
      Conversation: {
        Row: {
          id: string;
          userId: string;
          title: string;
          context: string;
          startedAt: string;
          lastMessageAt: string;
          templateId: string | null;
        };
        Insert: Omit<Database['public']['Tables']['Conversation']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['Conversation']['Insert']>;
      };
      Message: {
        Row: {
          id: string;
          conversationId: string;
          role: string;
          content: string;
          timestamp: string;
          audioUrl: string | null;
          corrections: string[] | null;
          suggestedVocabulary: string[] | null;
        };
        Insert: Omit<Database['public']['Tables']['Message']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['Message']['Insert']>;
      };
      ConversationTemplate: {
        Row: {
          id: string;
          title: string;
          description: string;
          systemPrompt: string;
          initialMessage: string;
          topics: string[];
          level: string;
        };
        Insert: Omit<Database['public']['Tables']['ConversationTemplate']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['ConversationTemplate']['Insert']>;
      };
      PronunciationExercise: {
        Row: {
          id: number;
          text: string;
          translation: string | null;
          difficulty: string;
          category: string;
          expectedPronunciation: string | null;
        };
        Insert: Omit<Database['public']['Tables']['PronunciationExercise']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['PronunciationExercise']['Insert']>;
      };
      GrammarRule: {
        Row: {
          id: string;
          title: string;
          description: string;
          examples: string[];
          level: string;
          category: string;
        };
        Insert: Omit<Database['public']['Tables']['GrammarRule']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['GrammarRule']['Insert']>;
      };
      ExamResult: {
        Row: {
          id: string;
          userId: string;
          examId: string;
          score: number;
          timeSpent: number;
          completedAt: string;
          section: string;
          level: string;
          details: string[];
        };
        Insert: Omit<Database['public']['Tables']['ExamResult']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['ExamResult']['Insert']>;
      };
      LessonExercise: {
        Row: {
          id: string;
          sectionId: string;
          type: string;
          question: string;
          options: string[];
          correctAnswer: string;
          explanation: string;
        };
        Insert: Omit<Database['public']['Tables']['LessonExercise']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['LessonExercise']['Insert']>;
      };
      PracticeItem: {
        Row: {
          id: string;
          sessionId: string;
          vocabularyId: string;
          exerciseType: string;
          isCorrect: boolean;
          userAnswer: string;
          expectedAnswer: string;
        };
        Insert: Omit<Database['public']['Tables']['PracticeItem']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['PracticeItem']['Insert']>;
      };
      PracticeSession: {
        Row: {
          id: string;
          userId: string;
          type: string;
          duration: number;
          createdAt: string;
          aiGenerated: boolean;
          difficulty: string;
          score: number;
        };
        Insert: Omit<Database['public']['Tables']['PracticeSession']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['PracticeSession']['Insert']>;
      };
      PronunciationPracticeItem: {
        Row: {
          id: string;
          sessionId: string;
          exerciseId: string;
          similarityScore: number;
          transcript: string;
          userAudioUrl: string;
          feedback: string[];
        };
        Insert: Omit<Database['public']['Tables']['PronunciationPracticeItem']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['PronunciationPracticeItem']['Insert']>;
      };
    };
  };
};

export default supabase;
