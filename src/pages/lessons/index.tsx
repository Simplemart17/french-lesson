import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

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
  { id: 'beginner', name: 'Beginner (A1-A2)' },
  { id: 'intermediate', name: 'Intermediate (B1-B2)' },
  { id: 'advanced', name: 'Advanced (C1-C2)' },
];

interface Lesson {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  duration: number;
  imageUrl?: string;
  progress?: number;
}

const sampleLessons: Lesson[] = [
  {
    id: '1',
    title: 'Basic Greetings in French',
    description: 'Learn essential greetings and introductions in French to start conversations confidently.',
    level: 'beginner',
    category: 'conversation',
    duration: 15,
    imageUrl: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?q=80&w=2070',
    progress: 100,
  },
  {
    id: '2',
    title: 'Introducing Yourself in French',
    description: 'Learn how to introduce yourself and ask basic personal questions in French.',
    level: 'beginner',
    category: 'conversation',
    duration: 20,
    imageUrl: 'https://images.unsplash.com/photo-1445991842772-097fea258e7b?q=80&w=2070',
    progress: 75,
  },
  {
    id: '3',
    title: 'Present Tense Verbs',
    description: 'Master the conjugation of regular and common irregular verbs in the present tense.',
    level: 'beginner',
    category: 'grammar',
    duration: 25,
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2073',
    progress: 30,
  },
  {
    id: '4',
    title: 'Food and Dining Vocabulary',
    description: 'Learn essential vocabulary for ordering food, discussing preferences, and navigating restaurants.',
    level: 'beginner',
    category: 'vocabulary',
    duration: 20,
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070',
    progress: 0,
  },
  {
    id: '5',
    title: 'French Pronunciation Basics',
    description: 'Master the fundamentals of French pronunciation, including nasal sounds and silent letters.',
    level: 'beginner',
    category: 'pronunciation',
    duration: 30,
    imageUrl: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=2073',
    progress: 0,
  },
  {
    id: '6',
    title: 'Past Tense: Passé Composé',
    description: 'Learn how to form and use the passé composé to talk about past events.',
    level: 'intermediate',
    category: 'grammar',
    duration: 35,
    imageUrl: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?q=80&w=2074',
    progress: 0,
  },
  {
    id: '7',
    title: 'French Café Culture',
    description: 'Explore the importance of cafés in French society and learn related vocabulary and expressions.',
    level: 'intermediate',
    category: 'culture',
    duration: 25,
    imageUrl: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?q=80&w=2071',
    progress: 0,
  },
  {
    id: '8',
    title: 'Advanced French Expressions',
    description: 'Master idiomatic expressions and colloquialisms used by native French speakers.',
    level: 'advanced',
    category: 'vocabulary',
    duration: 40,
    imageUrl: 'https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?q=80&w=2070',
    progress: 0,
  },
];

export default function LessonsPage() {
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter lessons based on selected category, level, and search query
  const filteredLessons = sampleLessons.filter(lesson => {
    const matchesCategory = selectedCategory === 'all' || lesson.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || lesson.level === selectedLevel;
    const matchesSearch = searchQuery === '' || 
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesLevel && matchesSearch;
  });
  
  // Calculate progress stats
  const completedLessons = isAuthenticated ? sampleLessons.filter(lesson => lesson.progress === 100).length : 0;
  const inProgressLessons = isAuthenticated ? sampleLessons.filter(lesson => lesson.progress && lesson.progress > 0 && lesson.progress < 100).length : 0;
  const totalLessons = sampleLessons.length;
  
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
        <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2 lg:grid-cols-3">
          {filteredLessons.length > 0 ? (
            filteredLessons.map((lesson) => (
              <Link key={lesson.id} href={`/lessons/${lesson.id}`} className="block group">
                <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="relative h-48 overflow-hidden">
                    {lesson.imageUrl ? (
                      <img 
                        src={lesson.imageUrl} 
                        alt={lesson.title} 
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
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
                        lesson.level === 'beginner' 
                          ? 'bg-green-100 text-green-800' 
                          : lesson.level === 'intermediate'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {lesson.level.charAt(0).toUpperCase() + lesson.level.slice(1)}
                      </span>
                    </div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 text-xs font-medium text-gray-800 rounded-full bg-white/80 backdrop-blur-sm">
                        {lesson.category.charAt(0).toUpperCase() + lesson.category.slice(1)}
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
            ))
          ) : (
            <div className="py-12 text-center col-span-full">
              <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No lessons found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your filters or search query.</p>
              <div className="mt-6">
                <Button onClick={() => {
                  setSelectedCategory('all');
                  setSelectedLevel('all');
                  setSearchQuery('');
                }}>
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
        </div>
        
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
