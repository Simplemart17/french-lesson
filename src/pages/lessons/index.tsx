import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useAuth } from '@/context/AuthContext';
import lessonService from '@/services/lessonService';

// Sample lesson data
const lessonCategories = [
  { id: 'all', name: 'All Categories' },
  { id: 'conversation', name: 'Conversation' },
  { id: 'grammar', name: 'Grammar' },
  { id: 'vocabulary', name: 'Vocabulary' },
  { id: 'pronunciation', name: 'Pronunciation' },
  { id: 'culture', name: 'Culture & Society' },
];

const lessonLevels = [
  { id: 'all', name: 'All Levels' },
  { id: 'A1', name: 'Beginner (A1)' },
  { id: 'A2', name: 'Elementary (A2)' },
  { id: 'B1', name: 'Intermediate (B1)' },
  { id: 'B2', name: 'Upper Intermediate (B2)' },
  { id: 'C1', name: 'Advanced (C1)' },
  { id: 'C2', name: 'Proficient (C2)' },
];

// Define Lesson interface first
interface Lesson {
  id: string;
  title: string;
  description: string;
  level: string;
  category?: string;
  topics: string[];
  duration: number;
  imageUrl?: string;
  progress?: number;
  sectionCount?: number;
}

// Helper function to get category display text
const getCategoryDisplay = (lesson: Lesson): string => {
  if (lesson.category) {
    return lesson.category;
  } else if (lesson.topics && lesson.topics.length > 0) {
    return lesson.topics[0];
  }
  return 'general';
};

// Helper function to get image URL
const getImageUrl = (lesson: string): string => {
  return `/images/lessons/${lesson}.jpg`;
};

// Extended lesson type that includes progress
interface LessonWithProgress extends Lesson {
  progress: number;
}

export default function LessonsPage() {
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('recommended');
  const [currentPage, setCurrentPage] = useState(1);
  const lessonsPerPage = 6;

  // State for lessons and progress
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progressData, setProgressData] = useState<Array<{ lessonId: string; completed: boolean; score: number }>>([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(true);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);
  const [lessonsError, setLessonsError] = useState<string | null>(null);
  const [progressError, setProgressError] = useState<string | null>(null);

  // Fetch lessons and progress
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingLessons(true);
      setLessonsError(null);

      try {
        // Get level filter
        const levelFilter = selectedLevel === 'all' ? undefined : selectedLevel;
        const topicFilter = selectedCategory === 'all' ? undefined : selectedCategory;

        // Fetch lessons
        const lessonsData = await lessonService.getLessons(levelFilter, topicFilter);

        // Convert API lessons to our format
        const formattedLessons: Lesson[] = lessonsData.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          level: lesson.level,
          topics: lesson.topics,
          duration: lesson.duration,
          imageUrl: `/images/lessons/${lesson.id}.jpg`,
          sectionCount: lesson.sections?.length || 0
        }));

        setLessons(formattedLessons);
        setIsLoadingLessons(false);
      } catch (err) {
        console.error('Error fetching lessons:', err);
        setLessonsError('Failed to load lessons');
        setIsLoadingLessons(false);
      }
    };

    fetchData();
  }, [selectedLevel, selectedCategory]);

  // Fetch progress if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchProgress = async () => {
      setIsLoadingProgress(true);
      setProgressError(null);

      try {
        const progress = await lessonService.getAllLessonProgress();
        setProgressData(progress);
        setIsLoadingProgress(false);
      } catch (err) {
        console.error('Error fetching lesson progress:', err);
        setProgressError('Failed to load progress');
        setIsLoadingProgress(false);
      }
    };

    fetchProgress();
  }, [isAuthenticated]);

  // Combine lessons with progress data
  const lessonsWithProgress: LessonWithProgress[] = lessons.map(lesson => {
    const progress = progressData.find(p => p.lessonId === lesson.id);
    return {
      ...lesson,
      progress: progress ? (progress.completed ? 100 : progress.score) : 0
    };
  });

  // Filter lessons based on selected category, level, and search query
  const filteredLessons = lessonsWithProgress.filter(lesson => {
    // Check if the lesson matches the selected category
    let matchesCategory = selectedCategory === 'all';
    if (selectedCategory !== 'all') {
      if (lesson.category) {
        matchesCategory = lesson.category.toLowerCase() === selectedCategory;
      } else if (lesson.topics) {
        matchesCategory = lesson.topics.some(topic =>
          topic.toLowerCase() === selectedCategory
        );
      }
    }

    const matchesLevel = selectedLevel === 'all' || lesson.level === selectedLevel;

    const matchesSearch = searchQuery === '' ||
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesLevel && matchesSearch;
  });

  // Sort lessons based on selected option
  const sortedLessons = [...filteredLessons].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        // Sort by id (string comparison for UUIDs)
        return b.id.localeCompare(a.id);
      case 'popular':
        return (b.progress || 0) - (a.progress || 0);
      case 'duration-asc':
        return a.duration - b.duration;
      case 'duration-desc':
        return b.duration - a.duration;
      default: // recommended
        return 0;
    }
  });

  // Paginate lessons
  const indexOfLastLesson = currentPage * lessonsPerPage;
  const indexOfFirstLesson = indexOfLastLesson - lessonsPerPage;
  const currentLessons = sortedLessons.slice(indexOfFirstLesson, indexOfLastLesson);
  const totalPages = Math.ceil(sortedLessons.length / lessonsPerPage);

  // Calculate progress stats
  const completedLessons = isAuthenticated ?
    lessonsWithProgress.filter(lesson => lesson.progress === 100).length : 0;
  const inProgressLessons = isAuthenticated ?
    lessonsWithProgress.filter(lesson => lesson.progress && lesson.progress > 0 && lesson.progress < 100).length : 0;
  const totalLessons = lessonsWithProgress.length;

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>French Lessons | French Tutor AI</title>
        <meta name="description" content="Browse and learn from our comprehensive collection of French lessons" />
      </Head>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">French Lessons</h1>
          <p className="text-lg text-gray-600">
            Browse our comprehensive collection of French lessons designed for all proficiency levels.
          </p>
        </div>

        {isAuthenticated && (
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
            <Card className="p-6 text-center">
              <div className="mb-2 text-4xl font-bold text-primary-600">{completedLessons}</div>
              <div className="text-gray-600">Completed Lessons</div>
            </Card>

            <Card className="p-6 text-center">
              <div className="mb-2 text-4xl font-bold text-yellow-500">{inProgressLessons}</div>
              <div className="text-gray-600">In Progress</div>
            </Card>

            <Card className="p-6 text-center">
              <div className="mb-2 text-4xl font-bold text-gray-600">{totalLessons}</div>
              <div className="text-gray-600">Total Lessons</div>
            </Card>
          </div>
        )}

        {/* Loading and Error States */}
        {(isLoadingLessons || isLoadingProgress) && (
          <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
            <LoadingState message="Loading lessons..." size="medium" />
          </div>
        )}

        {(lessonsError || progressError) && !isLoadingLessons && !isLoadingProgress && (
          <div className="mb-8">
            <ErrorMessage
              message="Failed to load lessons. Please try again."
              retryAction={async () => {
                // Refetch lessons and progress
                const levelFilter = selectedLevel === 'all' ? undefined : selectedLevel;
                const topicFilter = selectedCategory === 'all' ? undefined : selectedCategory;

                setIsLoadingLessons(true);
                try {
                  const data = await lessonService.getLessons(levelFilter, topicFilter);
                  setLessons(data);
                  setIsLoadingLessons(false);
                  setLessonsError(null);
                } catch (err) {
                  console.error('Error fetching lessons:', err);
                  setLessonsError('Failed to load lessons');
                  setIsLoadingLessons(false);
                }

                if (isAuthenticated) {
                  setIsLoadingProgress(true);
                  try {
                    const data = await lessonService.getAllLessonProgress();
                    setProgressData(data);
                    setIsLoadingProgress(false);
                    setProgressError(null);
                  } catch (err) {
                    console.error('Error fetching progress:', err);
                    setProgressError('Failed to load progress');
                    setIsLoadingProgress(false);
                  }
                }
              }}
            />
          </div>
        )}

        {/* Filters Section */}
        <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Search */}
            <div className="md:col-span-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search lessons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-gray-800">Category</h2>
              <div className="flex flex-wrap gap-2">
                {lessonCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Level Filter */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-gray-800">Level</h2>
              <div className="flex flex-wrap gap-2">
                {lessonLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedLevel === level.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {level.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-gray-800">Sort By</h2>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="recommended">Recommended</option>
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="duration-asc">Duration (Shortest First)</option>
                <option value="duration-desc">Duration (Longest First)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
          {isLoadingLessons ? (
            // Loading skeletons
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="h-full overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-5">
                  <div className="w-3/4 h-5 mb-2 bg-gray-200 rounded"></div>
                  <div className="w-full h-4 mb-4 bg-gray-200 rounded"></div>
                  <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                </div>
              </Card>
            ))
          ) : currentLessons.length > 0 ? (
            currentLessons.map((lesson) => {
              const lessonCategory = getCategoryDisplay(lesson).charAt(0).toUpperCase() + getCategoryDisplay(lesson).slice(1);

              return(
              <Link key={lesson.id} href={`/lessons/${lesson.id}`} className="block group">
                <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="relative h-48 overflow-hidden">
                    {getImageUrl(lessonCategory) ? (
                      <Image
                        src={getImageUrl(lessonCategory)}
                        alt={lesson.title}
                        sizes='100%'
                        fill
                        priority
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-gray-200">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}

                    {/* Level Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lesson.level.startsWith('A')
                          ? 'bg-green-100 text-green-800'
                          : lesson.level.startsWith('B')
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {lesson.level}
                      </span>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 text-xs font-medium text-gray-800 rounded-full bg-white/80 backdrop-blur-sm">
                        {lessonCategory}
                      </span>
                    </div>

                    {/* Progress Bar (if authenticated) */}
                    {isAuthenticated && lesson.progress !== undefined && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                        <div
                          className={`h-full ${
                            lesson.progress === 100
                              ? 'bg-green-500'
                              : lesson.progress > 0
                                ? 'bg-yellow-500'
                                : ''
                          }`}
                          style={{ width: `${lesson.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 transition-colors group-hover:text-primary-600">
                        {lesson.title}
                      </h3>
                      <span className="text-sm text-gray-500">{lesson.duration} min</span>
                    </div>
                    <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                      {lesson.description}
                    </p>

                    {isAuthenticated && (
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          {lesson.progress && lesson.progress === 100
                            ? 'Completed'
                            : lesson.progress && lesson.progress > 0
                              ? `${lesson.progress}% complete`
                              : 'Not started'}
                        </div>
                        <Button size="sm" variant={lesson.progress && lesson.progress > 0 ? "outline" : "default"}>
                          {lesson.progress && lesson.progress > 0 ? 'Continue' : 'Start'}
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            )})
          ) : (
            <div className="py-12 text-center col-span-full">
              <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No lessons found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your filters or search query.</p>
              <div className="mt-6">
                <Button onClick={async () => {
                  setSelectedCategory('all');
                  setSelectedLevel('all');
                  setSearchQuery('');
                  setSortOption('recommended');
                  setCurrentPage(1);

                  // Refetch lessons
                  setIsLoadingLessons(true);
                  try {
                    const data = await lessonService.getLessons();
                    setLessons(data);
                    setIsLoadingLessons(false);
                    setLessonsError(null);
                  } catch (err) {
                    console.error('Error fetching lessons:', err);
                    setLessonsError('Failed to load lessons');
                    setIsLoadingLessons(false);
                  }
                }}>
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoadingLessons && sortedLessons.length > lessonsPerPage && (
          <div className="flex justify-center mb-12">
            <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 1
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Previous</span>
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>

              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === index + 1
                      ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === totalPages
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Next</span>
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        )}

        {/* Learning Path Suggestion */}
        <div className="mb-12">
          <div className="overflow-hidden shadow-lg bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl">
            <div className="md:flex">
              <div className="p-8 md:w-2/3 md:p-12">
                <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">Not Sure Where to Start?</h2>
                <p className="mb-6 text-white/90">Take our placement test to get a personalized learning path based on your current French proficiency level.</p>
                <Link href="/proficiency-test">
                  <Button size="lg" variant="outline">
                    Take Placement Test
                  </Button>
                </Link>
              </div>
              <div className="relative md:w-1/3 bg-white/10 backdrop-blur-sm">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-6 text-center">
                    <div className="mb-2 text-4xl font-bold text-white">5 min</div>
                    <div className="text-sm text-white/80">Quick Assessment</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
