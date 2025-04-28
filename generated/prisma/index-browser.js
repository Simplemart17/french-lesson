
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  name: 'name',
  password: 'password',
  level: 'level',
  points: 'points',
  streakDays: 'streakDays',
  joinedAt: 'joinedAt',
  learningGoals: 'learningGoals',
  completedLessons: 'completedLessons',
  lastActive: 'lastActive',
  dailyGoal: 'dailyGoal',
  notifications: 'notifications',
  theme: 'theme',
  aiCorrectionEnabled: 'aiCorrectionEnabled',
  aiVocabSuggestionsEnabled: 'aiVocabSuggestionsEnabled',
  preferredVoice: 'preferredVoice',
  speechRecognitionEnabled: 'speechRecognitionEnabled'
};

exports.Prisma.LessonScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  level: 'level',
  duration: 'duration',
  topics: 'topics'
};

exports.Prisma.LessonSectionScalarFieldEnum = {
  id: 'id',
  lessonId: 'lessonId',
  title: 'title',
  type: 'type',
  content: 'content',
  audioUrl: 'audioUrl',
  videoUrl: 'videoUrl',
  order: 'order'
};

exports.Prisma.LessonExerciseScalarFieldEnum = {
  id: 'id',
  sectionId: 'sectionId',
  type: 'type',
  question: 'question',
  options: 'options',
  correctAnswer: 'correctAnswer',
  explanation: 'explanation'
};

exports.Prisma.LessonProgressScalarFieldEnum = {
  id: 'id',
  lessonId: 'lessonId',
  userId: 'userId',
  completed: 'completed',
  score: 'score',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  answers: 'answers'
};

exports.Prisma.VocabularyScalarFieldEnum = {
  id: 'id',
  word: 'word',
  translation: 'translation',
  example: 'example',
  level: 'level',
  category: 'category',
  pronunciation: 'pronunciation',
  usageContext: 'usageContext'
};

exports.Prisma.UserVocabularyScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  vocabularyId: 'vocabularyId',
  learned: 'learned',
  lastPracticed: 'lastPracticed',
  nextReviewDate: 'nextReviewDate',
  repetitionStage: 'repetitionStage'
};

exports.Prisma.ConversationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  title: 'title',
  context: 'context',
  startedAt: 'startedAt',
  lastMessageAt: 'lastMessageAt',
  templateId: 'templateId'
};

exports.Prisma.MessageScalarFieldEnum = {
  id: 'id',
  conversationId: 'conversationId',
  role: 'role',
  content: 'content',
  timestamp: 'timestamp',
  audioUrl: 'audioUrl',
  corrections: 'corrections',
  suggestedVocabulary: 'suggestedVocabulary'
};

exports.Prisma.ConversationTemplateScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  systemPrompt: 'systemPrompt',
  initialMessage: 'initialMessage',
  topics: 'topics',
  level: 'level'
};

exports.Prisma.UserTemplateUsageScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  templateId: 'templateId',
  usedAt: 'usedAt'
};

exports.Prisma.ExamResultScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  examId: 'examId',
  section: 'section',
  level: 'level',
  score: 'score',
  details: 'details',
  completedAt: 'completedAt',
  timeSpent: 'timeSpent'
};

exports.Prisma.PracticeSessionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  duration: 'duration',
  createdAt: 'createdAt',
  aiGenerated: 'aiGenerated',
  difficulty: 'difficulty',
  score: 'score'
};

exports.Prisma.PracticeItemScalarFieldEnum = {
  id: 'id',
  sessionId: 'sessionId',
  vocabularyId: 'vocabularyId',
  exerciseType: 'exerciseType',
  isCorrect: 'isCorrect',
  userAnswer: 'userAnswer',
  expectedAnswer: 'expectedAnswer'
};

exports.Prisma.PronunciationExerciseScalarFieldEnum = {
  id: 'id',
  text: 'text',
  translation: 'translation',
  difficulty: 'difficulty',
  category: 'category',
  expectedPronunciation: 'expectedPronunciation'
};

exports.Prisma.PronunciationPracticeItemScalarFieldEnum = {
  id: 'id',
  sessionId: 'sessionId',
  exerciseId: 'exerciseId',
  userAudioUrl: 'userAudioUrl',
  transcript: 'transcript',
  similarityScore: 'similarityScore',
  feedback: 'feedback'
};

exports.Prisma.GrammarRuleScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  examples: 'examples',
  level: 'level',
  category: 'category'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};


exports.Prisma.ModelName = {
  User: 'User',
  Lesson: 'Lesson',
  LessonSection: 'LessonSection',
  LessonExercise: 'LessonExercise',
  LessonProgress: 'LessonProgress',
  Vocabulary: 'Vocabulary',
  UserVocabulary: 'UserVocabulary',
  Conversation: 'Conversation',
  Message: 'Message',
  ConversationTemplate: 'ConversationTemplate',
  UserTemplateUsage: 'UserTemplateUsage',
  ExamResult: 'ExamResult',
  PracticeSession: 'PracticeSession',
  PracticeItem: 'PracticeItem',
  PronunciationExercise: 'PronunciationExercise',
  PronunciationPracticeItem: 'PronunciationPracticeItem',
  GrammarRule: 'GrammarRule'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
