import { vocabularyService, lessonService, conversationService, grammarService, pronunciationService, examService } from '@/services';
import { localStorageCache } from '@/utils/cache';
import { isAuthenticated } from '@/utils/authCookies';

/**
 * Prefetch common data that will be needed across the application
 * This can be called on app initialization or when a user logs in
 */
export const prefetchCommonData = async () => {
  // Check if user is authenticated before prefetching
  if (!isAuthenticated()) {
    return;
  }

  try {
    // Start all fetches in parallel
    const promises = [
      // Prefetch vocabulary data
      vocabularyService.getVocabulary().catch((err: Error) => {
        console.error('Failed to prefetch vocabulary:', err);
        return [];
      }),

      // Prefetch lessons data
      lessonService.getLessons().catch((err: Error) => {
        console.error('Failed to prefetch lessons:', err);
        return [];
      }),

      // Prefetch vocabulary categories
      vocabularyService.getCategories().catch((err: Error) => {
        console.error('Failed to prefetch vocabulary categories:', err);
        return [];
      }),

      // Prefetch grammar exercises
      grammarService.getGrammarExercises().catch((err: Error) => {
        console.error('Failed to prefetch grammar exercises:', err);
        return [];
      }),

      // Prefetch pronunciation exercises
      pronunciationService.getPronunciationExercises().catch((err: Error) => {
        console.error('Failed to prefetch pronunciation exercises:', err);
        return [];
      }),

      // Prefetch exam modules
      examService.getExamModules().catch((err: Error) => {
        console.error('Failed to prefetch exam modules:', err);
        return [];
      }),
    ];

    // Wait for all prefetches to complete
    await Promise.all(promises);
  } catch (error) {
    console.error('Prefetch: Error during common data prefetching:', error);
  }
};

/**
 * Prefetch data for a specific page
 * This can be called when hovering over a link or when a page is about to be loaded
 */
export const prefetchPageData = async (page: string, params?: Record<string, string | number>) => {
  try {
    switch (page) {
      case 'vocabulary':
        await vocabularyService.getVocabulary(
          params?.level as string,
          params?.category as string
        ).catch((err: Error) => {
          console.error('Failed to prefetch vocabulary for page:', err);
          return [];
        });
        break;

      case 'lessons':
        await lessonService.getLessons(
          params?.level as string,
          params?.topic as string
        ).catch((err: Error) => {
          console.error('Failed to prefetch lessons for page:', err);
          return [];
        });
        break;

      case 'lesson-detail':
        if (params?.id) {
          await lessonService.getLesson(Number(params.id)).catch((err: Error) => {
            console.error(`Failed to prefetch lesson ${params.id}:`, err);
            return null;
          });
        }
        break;

      case 'grammar':
        await grammarService.getGrammarExercises(
          params?.difficulty as string,
          params?.category as string
        ).catch((err: Error) => {
          console.error('Failed to prefetch grammar exercises for page:', err);
          return [];
        });
        break;

      case 'pronunciation':
        await pronunciationService.getPronunciationExercises(
          params?.difficulty as 'beginner' | 'intermediate' | 'advanced'
        ).catch((err: Error) => {
          console.error('Failed to prefetch pronunciation exercises for page:', err);
          return [];
        });
        break;

      case 'exam':
        await examService.getExamModules(
          params?.examType as string,
          params?.section as string,
          params?.difficulty as string
        ).catch((err: Error) => {
          console.error('Failed to prefetch exam modules for page:', err);
          return [];
        });
        break;

      case 'conversation':
        await conversationService.getConversationTopics(
          params?.level as string
        ).catch((err: Error) => {
          console.error('Failed to prefetch conversation topics for page:', err);
          return [];
        });
        break;

      default:
        break;
    }

    // Store the prefetch timestamp in localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorageCache.set(`prefetch_${page}`, {
          timestamp: Date.now(),
          params
        }, 30 * 60 * 1000); // 30 minutes
      } catch (err) {
        console.error('Failed to store prefetch timestamp:', err);
      }
    }

    console.log(`Prefetching for page ${page} completed`);
  } catch (error) {
    console.error(`Error during prefetching for page ${page}:`, error);
  }
};

const prefetchUtils = {
  prefetchCommonData,
  prefetchPageData
};

export default prefetchUtils;
