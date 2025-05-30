import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import LoadingState from '@/components/ui/LoadingState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface DashboardData {
  user: {
    name: string;
    level: string;
    points: number;
    streakDays: number;
    dailyGoal: number;
    completedLessons: number;
  };
  dailyProgress: {
    minutesStudied: number;
    goalMinutes: number;
    progressPercentage: number;
  };
  recentActivities: Array<{
    id: string;
    type: 'lesson' | 'vocabulary' | 'pronunciation' | 'conversation';
    title: string;
    description: string;
    timestamp: string;
    score?: number;
  }>;
  recommendations: Array<{
    id: string;
    type: 'lesson' | 'practice' | 'review';
    title: string;
    description: string;
    url: string;
  }>;
  stats: {
    totalLessons: number;
    completedLessons: number;
    vocabularyLearned: number;
    currentStreak: number;
    totalPoints: number;
  };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    let newGreeting = '';

    if (hour < 12) {
      newGreeting = 'Bonjour';
    } else if (hour < 18) {
      newGreeting = 'Bon après-midi';
    } else {
      newGreeting = 'Bonsoir';
    }

    setGreeting(newGreeting);
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/user/dashboard');
        const result = await response.json();

        if (result.success) {
          setDashboardData(result.data);
        } else {
          setError(result.error?.message || 'Failed to load dashboard data');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return (
    <ProtectedRoute>
      <Head>
        <title>Dashboard | French Tutor AI</title>
        <meta name="description" content="Your personalized French learning dashboard" />
      </Head>

      <div className="container px-4 py-8 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {greeting}, {dashboardData?.user.name || user?.name || 'Student'}!
          </h1>
          <p className="mt-2 text-gray-600">Welcome to your French learning dashboard</p>
          {dashboardData && (
            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                Level: {dashboardData.user.level}
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                {dashboardData.user.points} XP
              </span>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingState message="Loading your dashboard..." size="large" />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="mb-8">
            <ErrorMessage
              message={error}
              retryAction={() => window.location.reload()}
            />
          </div>
        )}

        {/* Dashboard Content */}
        {dashboardData && !isLoading && (
          <>

        {/* Main dashboard content */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Daily Goal Card */}
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">Daily Goal</h2>
            <div className="mt-4">
              <div className="w-full h-3 bg-gray-200 rounded-full">
                <div
                  className="h-3 bg-primary-500 rounded-full transition-all duration-300"
                  style={{ width: `${dashboardData.dailyProgress.progressPercentage}%` }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {dashboardData.dailyProgress.minutesStudied} minutes of {dashboardData.dailyProgress.goalMinutes} completed today
              </p>
            </div>
          </div>

          {/* Streak Card */}
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">Current Streak</h2>
            <div className="flex items-center mt-4">
              <span className="text-3xl font-bold text-primary-500">{dashboardData.user.streakDays}</span>
              <span className="ml-2 text-gray-600">days</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {dashboardData.user.streakDays > 0 ? 'Keep it up!' : 'Start your streak today!'}
            </p>
          </div>

          {/* Level Card */}
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">Current Level</h2>
            <div className="flex items-center mt-4">
              <span className="text-3xl font-bold text-primary-500">{dashboardData.user.level}</span>
              <span className="ml-2 text-gray-600">
                {dashboardData.user.level.startsWith('A') ? 'Beginner' :
                 dashboardData.user.level.startsWith('B') ? 'Intermediate' : 'Advanced'}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600">{dashboardData.user.points} XP earned</p>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">Recent Activities</h2>
          <div className="mt-4 overflow-hidden bg-white rounded-xl shadow-sm">
            {dashboardData.recentActivities.length > 0 ? (
              dashboardData.recentActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`p-4 ${index < dashboardData.recentActivities.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <p className="font-medium text-gray-800">{activity.title}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(activity.timestamp).toLocaleDateString()} • {activity.description}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>No recent activities yet.</p>
                <p className="text-sm">Start learning to see your progress here!</p>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Next Steps */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">Recommended Next Steps</h2>
          <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
            {dashboardData.recommendations.map((recommendation) => (
              <Link key={recommendation.id} href={recommendation.url}>
                <div className="p-4 transition-all duration-200 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer">
                  <h3 className="text-lg font-medium text-gray-800">{recommendation.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{recommendation.description}</p>
                  <div className="px-4 py-2 mt-4 text-sm text-white rounded-lg bg-primary-500 hover:bg-primary-600 inline-block">
                    {recommendation.type === 'lesson' ? 'Start Lesson' :
                     recommendation.type === 'practice' ? 'Start Practice' : 'Review Now'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
