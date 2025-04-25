import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-t-2 border-b-2 rounded-full animate-spin border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  // Mock data for dashboard
  const recentLessons = [
    { id: 1, title: 'Basic Greetings', progress: 100, category: 'speaking' },
    { id: 2, title: 'Present Tense Verbs', progress: 75, category: 'grammar' },
    { id: 3, title: 'Food and Dining', progress: 30, category: 'vocabulary' },
  ];

  const recommendedLessons = [
    { id: 4, title: 'Past Tense Introduction', category: 'grammar', difficulty: 'intermediate' },
    { id: 5, title: 'Asking for Directions', category: 'speaking', difficulty: 'beginner' },
    { id: 6, title: 'Weather Vocabulary', category: 'vocabulary', difficulty: 'beginner' },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'speaking': return 'bg-blue-100 text-blue-800';
      case 'listening': return 'bg-purple-100 text-purple-800';
      case 'reading': return 'bg-green-100 text-green-800';
      case 'writing': return 'bg-red-100 text-red-800';
      case 'vocabulary': return 'bg-yellow-100 text-yellow-800';
      case 'grammar': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard | French Tutor AI</title>
        <meta name="description" content="Your French learning dashboard" />
      </Head>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">Welcome back, {user.name}!</h1>
          <p className="text-lg text-gray-600">
            Continue your French learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <Card className="p-6 text-center">
            <div className="mb-2 text-4xl font-bold text-primary-600">{user.level}</div>
            <div className="text-gray-600">Current Level</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="mb-2 text-4xl font-bold text-secondary-600">{user.xp}</div>
            <div className="text-gray-600">Total XP</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="mb-2 text-4xl font-bold text-green-600">3</div>
            <div className="text-gray-600">Day Streak</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-800">Continue Learning</h2>
            <div className="space-y-4">
              {recentLessons.map((lesson) => (
                <Card key={lesson.id} className="p-4 transition-shadow hover:shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-800">{lesson.title}</h5>
                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(lesson.category)}`}>
                      {lesson.category.charAt(0).toUpperCase() + lesson.category.slice(1)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                    <div 
                      className="bg-primary-600 h-2.5 rounded-full" 
                      style={{ width: `${lesson.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{lesson.progress}% complete</span>
                    <Link href={`/lessons/${lesson.id}`}>
                      <Button size="sm">Continue</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/lessons">
                <Button variant="outline">View All Lessons</Button>
              </Link>
            </div>
          </div>
          
          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-800">Recommended for You</h2>
            <div className="space-y-4">
              {recommendedLessons.map((lesson) => (
                <Card key={lesson.id} className="p-4 transition-shadow hover:shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-800">{lesson.title}</h5>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(lesson.category)}`}>
                        {lesson.category.charAt(0).toUpperCase() + lesson.category.slice(1)}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(lesson.difficulty)}`}>
                        {lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Link href={`/lessons/${lesson.id}`}>
                      <Button size="sm">Start Lesson</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/progress">
                <Button variant="outline">View Your Progress</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <Card variant="primary" className="p-6">
            <h3 className="mb-2 font-medium text-primary-800">Practice Speaking</h3>
            <p className="mb-4 text-gray-700">Improve your pronunciation with our AI-powered speaking exercises.</p>
            <Link href="/practice">
              <Button variant="default" size="sm" className="w-full">Practice Now</Button>
            </Link>
          </Card>
          
          <Card variant="secondary" className="p-6">
            <h3 className="mb-2 font-medium text-gray-300">Writing Exercises</h3>
            <p className="mb-4 text-gray-300">Get feedback on your written French with our writing correction tool.</p>
            <Link href="/writing">
              <Button variant="secondary" size="sm" className="w-full">Start Writing</Button>
            </Link>
          </Card>
          
          <Card variant="success" className="p-6">
            <h3 className="mb-2 font-medium text-green-800">Vocabulary Review</h3>
            <p className="mb-4 text-gray-700">Review and expand your French vocabulary with flashcards and quizzes.</p>
            <Link href="/vocabulary">
              <Button variant="success" size="sm" className="w-full">Review Vocabulary</Button>
            </Link>
          </Card>
        </div>
      </div>
    </>
  );
}
