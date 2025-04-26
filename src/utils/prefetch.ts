import { vocabularyApiService, lessonApiService } from '@/services/index';

/**
 * Prefetch common data that will be needed across the application
 * This can be called on app initialization or when a user logs in
 */
export const prefetchCommonData = async () => {
  try {
    // Start all fetches in parallel
    const promises = [
      // Prefetch vocabulary data
      vocabularyApiService.getVocabulary().catch(err => {
        console.error('Failed to prefetch vocabulary:', err);
        return [];
      }),
      
      // Prefetch lessons data
      lessonApiService.getLessons().catch(err => {
        console.error('Failed to prefetch lessons:', err);
        return [];
      }),
      
      // Prefetch vocabulary categories
      vocabularyApiService.getCategories().catch(err => {
        console.error('Failed to prefetch vocabulary categories:', err);
        return [];
      }),
    ];
    
    // Wait for all prefetches to complete
    await Promise.all(promises);
    
    console.log('Prefetching completed successfully');
  } catch (error) {
    console.error('Error during prefetching:', error);
  }
};

/**
 * Prefetch data for a specific page
 * This can be called when hovering over a link or when a page is about to be loaded
 */
export const prefetchPageData = async (page: string, params?: Record<string, any>) => {
  try {
    switch (page) {
      case 'vocabulary':
        await vocabularyApiService.getVocabulary(
          params?.level,
          params?.category
        ).catch(err => {
          console.error('Failed to prefetch vocabulary for page:', err);
          return [];
        });
        break;
        
      case 'lessons':
        await lessonApiService.getLessons(
          params?.level,
          params?.topic
        ).catch(err => {
          console.error('Failed to prefetch lessons for page:', err);
          return [];
        });
        break;
        
      case 'lesson-detail':
        if (params?.id) {
          await lessonApiService.getLesson(Number(params.id)).catch(err => {
            console.error(`Failed to prefetch lesson ${params.id}:`, err);
            return null;
          });
        }
        break;
        
      default:
        break;
    }
    
    console.log(`Prefetching for page ${page} completed`);
  } catch (error) {
    console.error(`Error during prefetching for page ${page}:`, error);
  }
};

export default {
  prefetchCommonData,
  prefetchPageData
};
