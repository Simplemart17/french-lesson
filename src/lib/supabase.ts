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

// Database table names (Supabase naming convention)
export const TABLES = {
  USERS: 'users',
  LESSONS: 'lessons',
  LESSON_SECTIONS: 'lesson_sections',
  LESSON_PROGRESS: 'lesson_progress',
  VOCABULARY: 'vocabulary',
  USER_VOCABULARY: 'user_vocabulary',
  CONVERSATIONS: 'conversations',
  MESSAGES: 'messages',
  CONVERSATION_TEMPLATES: 'conversation_templates',
  PRONUNCIATION_EXERCISES: 'pronunciation_exercises',
  GRAMMAR_RULES: 'grammar_rules',
  EXAM_RESULTS: 'exam_results',
  LESSON_EXERCISES: 'lesson_exercises',
  PRACTICE_ITEMS: 'practice_items',
  PRACTICE_SESSIONS: 'practice_sessions',
  PRONUNCIATION_PRACTICE_ITEMS: 'pronunciation_practice_items',
} as const;

// Type definitions for better TypeScript support
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          level: string;
          points: number;
          streak_days: number;
          joined_at: string;
          learning_goals: string[];
          completed_lessons: number;
          last_active: string;
          daily_goal: number;
          notifications: boolean;
          theme: string;
          ai_correction_enabled: boolean;
          ai_vocab_suggestions_enabled: boolean;
          preferred_voice: string;
          speech_recognition_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      lessons: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          level: string;
          category: string | null;
          content: any;
          order_index: number;
          is_published: boolean;
          duration: number;
          topics: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['lessons']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['lessons']['Insert']>;
      };
      lesson_sections: {
        Row: {
          id: string;
          lesson_id: string;
          title: string;
          content: any;
          order_index: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['lesson_sections']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['lesson_sections']['Insert']>;
      };
      lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          completed: boolean;
          score: number | null;
          time_spent: number | null;
          started_at: string;
          completed_at: string | null;
          answers: any;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['lesson_progress']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['lesson_progress']['Insert']>;
      };
      vocabulary: {
        Row: {
          id: string;
          french: string;
          english: string;
          example: string | null;
          pronunciation: string | null;
          difficulty: string;
          category: string | null;
          usage_context: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['vocabulary']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['vocabulary']['Insert']>;
      };
      user_vocabulary: {
        Row: {
          id: string;
          user_id: string;
          vocabulary_id: string;
          learned: boolean;
          last_practiced: string | null;
          next_review_date: string | null;
          repetition_stage: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_vocabulary']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['user_vocabulary']['Insert']>;
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          title: string | null;
          scenario: string | null;
          language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['conversations']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['conversations']['Insert']>;
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: string;
          content: string;
          translation: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
      };
      conversation_templates: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          scenario: string;
          level: string;
          initial_message: string;
          possible_responses: any;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['conversation_templates']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['conversation_templates']['Insert']>;
      };
      pronunciation_exercises: {
        Row: {
          id: string;
          phrase: string;
          translation: string | null;
          level: string;
          difficulty: string;
          audio_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['pronunciation_exercises']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['pronunciation_exercises']['Insert']>;
      };
      grammar_rules: {
        Row: {
          id: string;
          title: string;
          description: string;
          rule: string;
          examples: any;
          level: string;
          category: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['grammar_rules']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['grammar_rules']['Insert']>;
      };
      exam_results: {
        Row: {
          id: string;
          user_id: string;
          exam_type: string;
          module: string;
          score: number;
          max_score: number;
          percentage: number;
          level: string | null;
          completed_at: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['exam_results']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['exam_results']['Insert']>;
      };
      lesson_exercises: {
        Row: {
          id: string;
          lesson_id: string;
          type: string;
          title: string;
          content: any;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['lesson_exercises']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['lesson_exercises']['Insert']>;
      };
      practice_items: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          content: any;
          score: number | null;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['practice_items']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['practice_items']['Insert']>;
      };
      practice_sessions: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          duration: number | null;
          score: number | null;
          items: any;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['practice_sessions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['practice_sessions']['Insert']>;
      };
      pronunciation_practice_items: {
        Row: {
          id: string;
          exercise_id: string;
          user_id: string | null;
          transcript: string | null;
          score: number | null;
          feedback: any;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['pronunciation_practice_items']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['pronunciation_practice_items']['Insert']>;
      };
    };
  };
};

export default supabase;
