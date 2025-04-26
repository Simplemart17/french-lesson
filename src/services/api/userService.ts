import apiClient, { ApiResponse } from './apiClient';
import { API_ENDPOINTS } from './apiConfig';

// Define interfaces for user data
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  bio?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  id: number;
  userId: number;
  learningGoals: string[];
  interests: string[];
  studyTime: 'less-than-30min' | '30min-1hour' | '1-2hours' | 'more-than-2hours';
  targetExam: 'none' | 'tcf' | 'tef' | 'delf' | 'dalf';
  emailNotifications: boolean;
  reminderNotifications: boolean;
  progressReports: boolean;
  marketingEmails: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProgress {
  daysStreak: number;
  lessonsCompleted: number;
  vocabularyLearned: number;
  totalPracticeTime: number; // in minutes
  lastActivity: string;
  skillLevels: {
    listening: number;
    speaking: number;
    reading: number;
    writing: number;
    grammar: number;
    vocabulary: number;
  };
}

export interface UserStatistics {
  examScores: {
    id: number;
    examId: number;
    examName: string;
    score: number;
    date: string;
  }[];
  lessonCompletions: {
    date: string;
    count: number;
  }[];
  practiceTime: {
    date: string;
    minutes: number;
  }[];
  skillProgress: {
    skill: string;
    history: {
      date: string;
      level: number;
    }[];
  }[];
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  bio?: string;
  avatar?: string;
}

export interface UpdatePreferencesRequest {
  learningGoals?: string[];
  interests?: string[];
  studyTime?: 'less-than-30min' | '30min-1hour' | '1-2hours' | 'more-than-2hours';
  targetExam?: 'none' | 'tcf' | 'tef' | 'delf' | 'dalf';
  emailNotifications?: boolean;
  reminderNotifications?: boolean;
  progressReports?: boolean;
  marketingEmails?: boolean;
}

// User service class
class UserService {
  // Get user profile
  public async getProfile(): Promise<ApiResponse<UserProfile>> {
    return apiClient.get<UserProfile>(API_ENDPOINTS.USER.PROFILE);
  }
  
  // Update user profile
  public async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<UserProfile>> {
    return apiClient.put<UserProfile>(API_ENDPOINTS.USER.UPDATE_PROFILE, data);
  }
  
  // Get user preferences
  public async getPreferences(): Promise<ApiResponse<UserPreferences>> {
    return apiClient.get<UserPreferences>(API_ENDPOINTS.USER.PREFERENCES);
  }
  
  // Update user preferences
  public async updatePreferences(data: UpdatePreferencesRequest): Promise<ApiResponse<UserPreferences>> {
    return apiClient.put<UserPreferences>(API_ENDPOINTS.USER.PREFERENCES, data);
  }
  
  // Get user progress
  public async getProgress(): Promise<ApiResponse<UserProgress>> {
    return apiClient.get<UserProgress>(API_ENDPOINTS.USER.PROGRESS);
  }
  
  // Get user statistics
  public async getStatistics(period?: 'week' | 'month' | 'year' | 'all'): Promise<ApiResponse<UserStatistics>> {
    return apiClient.get<UserStatistics>(API_ENDPOINTS.USER.STATISTICS, { period });
  }
}

// Create and export user service instance
const userService = new UserService();
export default userService;
