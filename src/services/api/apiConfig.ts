// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },

  // User endpoints
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/change-password',
    PREFERENCES: '/user/preferences',
    PROGRESS: '/user/progress',
    STATISTICS: '/user/statistics',
  },

  // Vocabulary endpoints
  VOCABULARY: {
    LIST: '/vocabulary',
    CATEGORIES: '/vocabulary/categories',
    LEVELS: '/vocabulary/levels',
    ITEM: (id: number | string) => `/vocabulary/${id}`,
    PROGRESS: '/vocabulary/progress',
    SPACED_REPETITION: '/vocabulary/spaced-repetition',
  },

  // Lessons endpoints
  LESSONS: {
    LIST: '/lessons',
    ITEM: (id: number | string) => `/lessons/${id}`,
    PROGRESS: '/lessons/progress',
    COMPLETE: (id: number | string) => `/lessons/${id}/complete`,
    CATEGORIES: '/lessons/categories',
  },

  // Grammar endpoints
  GRAMMAR: {
    LIST: '/grammar',
    ITEM: (id: number | string) => `/grammar/${id}`,
    CHECK: '/grammar/check',
    EXERCISES: '/grammar/exercises',
    PROGRESS: '/grammar/progress',
  },

  // Pronunciation endpoints
  PRONUNCIATION: {
    EXERCISES: '/pronunciation/exercises',
    PHRASES: '/pronunciation/phrases',
    CHECK: '/pronunciation/check',
    PROGRESS: '/pronunciation/progress',
  },

  // Exam endpoints
  EXAM: {
    LIST: '/exams',
    ITEM: (id: number | string) => `/exams/${id}`,
    QUESTIONS: (id: number | string) => `/exams/${id}/questions`,
    SUBMIT: (id: number | string) => `/exams/${id}/submit`,
    RESULTS: '/exams/results',
    TYPES: '/exams/types',
  },

  // Conversation endpoints
  CONVERSATION: {
    START: '/conversation/start',
    SEND_MESSAGE: '/conversation/message',
    HISTORY: '/conversation/history',
    TOPICS: '/conversation/topics',
  },

  // Listening endpoints
  LISTENING: {
    LIST: '/listening/exercises',
    ITEM: (id: number | string) => `/listening/exercises/${id}`,
    SUBMIT: (id: number | string) => `/listening/exercises/${id}/submit`,
    PROGRESS: '/listening/progress',
  },

  // Speaking endpoints
  SPEAKING: {
    LIST: '/speaking/exercises',
    ITEM: (id: number | string) => `/speaking/exercises/${id}`,
    PHRASE: (id: number | string) => `/speaking/phrases/${id}`,
    CHECK: '/speaking/check',
    PROGRESS: '/speaking/progress',
  },
};

// API Response Status Codes
export const API_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// API Error Messages
export const API_ERRORS = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Unauthorized. Please log in again.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Validation error. Please check your input.',
};

export default API_ENDPOINTS;
