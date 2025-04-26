import { authService, userService } from './api';
import vocabularyApiService from './vocabularyApiService';
import lessonApiService from './lessonApiService';
import conversationApiService from './conversationApiService';
import listeningApiService from './listeningApiService';
import speakingApiService from './speakingApiService';
import grammarApiService from './grammarApiService';
import examApiService from './examApiService';

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

export default {
  auth: authService,
  user: userService,
  vocabulary: vocabularyApiService,
  lessons: lessonApiService,
  conversation: conversationApiService,
  listening: listeningApiService,
  speaking: speakingApiService,
  grammar: grammarApiService,
  exam: examApiService
};
