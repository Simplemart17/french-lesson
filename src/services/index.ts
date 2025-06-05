// Import API services
import authApiService from './api/authApiService';
import userApiService from './api/userApiService';

// Import wrapper services
import vocabularyService from './vocabularyService';
import lessonService from './lessonService';
import conversationService from './conversationService';
import pronunciationService from './pronunciationService';
import grammarService from './grammarService';
import examService from './examService';
import listeningService from './listeningService';
import speakingService from './speakingService';
import speechRecognitionService from './speechRecognitionService';
import aiService from './aiService';

// Import direct API services
import vocabularyApiService from './api/vocabularyApiService';
import lessonApiService from './api/lessonApiService';
import conversationApiService from './api/conversationApiService';
import pronunciationApiService from './api/pronunciationApiService';
import grammarApiService from './api/grammarApiService';
import examApiService from './api/examApiService';
import listeningApiService from './api/listeningApiService';
import speakingApiService from './api/speakingApiService';

// Export API services
export {
  authApiService,
  userApiService,
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
  speechRecognitionService,
  grammarService,
  examService,
  listeningService,
  speakingService,
  aiService
};

// Export default object with all services
export default {
  // Auth and user services
  auth: authApiService,
  user: userApiService,

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
