import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import InteractiveLesson from '@/components/features/InteractiveLesson';
import { useAuth } from '@/context/AuthContext';
import lessonService from '@/services/lessonService';
import { Lesson } from '@/types/api';


export default function LessonPage() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<{ completed: boolean; score: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch lesson data
  useEffect(() => {
    const fetchLessonData = async () => {
      if (id && typeof id === 'string') {
        setIsLoading(true);
        setError(null);

        try {
          // Fetch lesson data from API
          const data = await lessonService.getLesson(id);
          
          if (data) {
            setLesson(data);

            // Fetch progress if authenticated
            if (isAuthenticated) {
              const progressData = await lessonService.getLessonProgress(id);
              if (progressData) {
                setProgress({
                  completed: progressData.completed,
                  score: progressData.score
                });
              }
            }
          } else {
            setError('Lesson not found');
          }
          
          setIsLoading(false);
        } catch (err) {
          console.error('Error fetching lesson:', err);
          setError('Failed to load lesson. Please try again later.');
          setIsLoading(false);
        }
      }
    };

    fetchLessonData();
  }, [id, isAuthenticated]);

  // Handle lesson completion
  const handleLessonComplete = async (score: number) => {
    if (!id || !lesson || !isAuthenticated) return;

    try {
      // Update lesson progress
      const updatedProgress = await lessonService.updateLessonProgress(
        id as string,
        true, // completed
        score
      );

      if (updatedProgress) {
        setProgress({
          completed: updatedProgress.completed,
          score: updatedProgress.score
        });

        // Show success message
        console.log('Progress saved successfully:', updatedProgress);
      }
    } catch (err) {
      console.error('Error updating lesson progress:', err);
    }
  };

  // Handle exercise submission
  const handleSubmitAnswers = async (answers: Record<string, string | string[]>) => {
    if (!id || !lesson || !isAuthenticated) return null;

    try {
      // Submit answers to API
      const result = await lessonService.submitLessonAnswers(id as string, answers);
      return result;
    } catch (err) {
      console.error('Error submitting answers:', err);
      return null;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-primary-600"></div>
      </div>
    );
  }

  // Error state
  if (error || !lesson) {
    return (
      <div className="max-w-4xl px-4 py-8 mx-auto">
        <Card className="p-8 text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-800">
            {error || 'Lesson Not Found'}
          </h1>
          <p className="mb-6 text-gray-600">
            Sorry, the lesson you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/lessons">
            <Button>
              Back to Lessons
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Adapt the lesson to the InteractiveLesson component format
  const adaptedLesson = {
    id: lesson.id.toString(),
    title: lesson.title,
    description: lesson.description,
    level: lesson.level.toLowerCase().includes('a1') || lesson.level.toLowerCase().includes('a2')
      ? 'beginner' as const
      : lesson.level.toLowerCase().includes('b')
        ? 'intermediate' as const
        : 'advanced' as const,
    category: lesson.topics[0] || 'general',
    duration: lesson.duration,
    sections: lesson.sections?.map(section => ({
      id: section.id.toString(),
      type: section.type,
      title: section.title,
      content: section.content || '',
      audioUrl: section.audioUrl,
      videoUrl: section.videoUrl,
      exercise: section.exercises && section.exercises.length > 0
        ? {
            type: (['multiple-choice', 'fill-in-blank', 'matching', 'translation', 'true-false', 'reorder'].includes(section.exercises[0].type)
              ? section.exercises[0].type
              : 'multiple-choice') as 'multiple-choice' | 'fill-in-blank' | 'matching' | 'translation' | 'true-false' | 'reorder',
            question: section.exercises[0].question,
            options: section.exercises[0].options || [],
            correctAnswer: section.exercises[0].correctAnswer,
            explanation: section.exercises[0].explanation
          }
        : undefined
    })) || []
  };

  return (
    <>
      <Head>
        <title>{lesson.title} | French Tutor AI</title>
        <meta name="description" content={lesson.description} />
      </Head>

      <div className="max-w-4xl px-4 py-8 mx-auto">
        <div className="mb-8">
          <div className="flex flex-col mb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Link href="/lessons" className="inline-flex items-center mb-2 text-primary-600 hover:text-primary-700">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Lessons
              </Link>
              <h1 className="text-3xl font-bold text-gray-800">{lesson.title}</h1>
            </div>

            <div className="flex items-center mt-4 space-x-4 md:mt-0">
              <div className="px-3 py-1 text-sm font-medium rounded-full bg-primary-100 text-primary-800">
                {lesson.level}
              </div>
              <div className="px-3 py-1 text-sm font-medium text-gray-800 bg-gray-100 rounded-full">
                {lesson.duration} min
              </div>
              {progress?.completed && (
                <div className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                  Completed ({progress.score}%)
                </div>
              )}
            </div>
          </div>

          <p className="mb-6 text-lg text-gray-600">
            {lesson.description}
          </p>

          {!isAuthenticated && (
            <div className="p-4 mb-6 border border-yellow-200 rounded-lg bg-yellow-50">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Sign in to track your progress
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Create an account or sign in to save your progress and access all features.
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="flex space-x-3">
                      <Link href="/login">
                        <Button size="sm" variant="secondary">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button size="sm" variant="outline">
                          Create Account
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <InteractiveLesson
          lesson={adaptedLesson}
          onComplete={handleLessonComplete}
          onSubmitAnswers={handleSubmitAnswers}
          initialProgress={progress}
        />
      </div>
    </>
  );
}