// Import API services
import { authService, userService } from './api';

// Import wrapper services
import vocabularyService from './vocabularyService';
import lessonService from './lessonService';
import conversationService from './conversationService';
import pronunciationService from './pronunciationService';
import grammarService from './grammarService';
import examService from './examService';
import listeningService from './listeningService';
import speakingService from './speakingService';
import aiService from './aiService';

// Import direct API services
import vocabularyApiService from './api/vocabularyService';
import lessonApiService from './api/lessonService';
import conversationApiService from './api/conversationService';
import pronunciationApiService from './api/pronunciationService';
import grammarApiService from './api/grammarService';
import examApiService from './api/examService';
import listeningApiService from './api/listeningService';
import speakingApiService from './api/speakingService';

// Export API services
export {
  authService,
  userService,
  vocabularyApiService,
  lessonApiService,
  conversationApiService,
  listeningApiService,
  speakingApiService,
  grammarApiService,
  examApiService
};

// Export wrapper services
export {
  vocabularyService,
  lessonService,
  conversationService,
  pronunciationService,
  grammarService,
  examService,
  listeningService,
  speakingService,
  aiService
};

// Export default object with all services
export default {
  // Auth and user services
  auth: authService,
  user: userService,

  // Main services with caching and offline support
  vocabulary: vocabularyService,
  lessons: lessonService,
  conversation: conversationService,
  pronunciation: pronunciationService,
  grammar: grammarService,
  exam: examService,
  listening: listeningService,
  speaking: speakingService,
  ai: aiService,

  // Direct API services for backward compatibility
  vocabularyApi: vocabularyApiService,
  lessonsApi: lessonApiService,
  conversationApi: conversationApiService,
  pronunciationApi: pronunciationApiService,
  grammarApi: grammarApiService,
  examApi: examApiService,
  listeningApi: listeningApiService,
  speakingApi: speakingApiService
};
