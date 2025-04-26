import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function DashboardPage() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');

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

  return (
    <ProtectedRoute>
      <Head>
        <title>Dashboard | French Tutor AI</title>
        <meta name="description" content="Your personalized French learning dashboard" />
      </Head>

      <div className="container px-4 py-8 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {greeting}, {user?.name || 'Student'}!
          </h1>
          <p className="mt-2 text-gray-600">Welcome to your French learning dashboard</p>
        </div>

        {/* Main dashboard content */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Daily Goal Card */}
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">Daily Goal</h2>
            <div className="mt-4">
              <div className="w-full h-3 bg-gray-200 rounded-full">
                <div className="h-3 bg-primary-500 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                12 minutes of 20 completed today
              </p>
            </div>
          </div>

          {/* Streak Card */}
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">Current Streak</h2>
            <div className="flex items-center mt-4">
              <span className="text-3xl font-bold text-primary-500">7</span>
              <span className="ml-2 text-gray-600">days</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">Keep it up!</p>
          </div>

          {/* Level Card */}
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">Current Level</h2>
            <div className="flex items-center mt-4">
              <span className="text-3xl font-bold text-primary-500">A2</span>
              <span className="ml-2 text-gray-600">Elementary</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">125 XP to next level</p>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">Recent Activities</h2>
          <div className="mt-4 overflow-hidden bg-white rounded-xl shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <p className="font-medium text-gray-800">Completed Lesson: Common French Phrases</p>
              <p className="text-sm text-gray-600">2 hours ago • Score: 85%</p>
            </div>
            <div className="p-4 border-b border-gray-100">
              <p className="font-medium text-gray-800">Practiced Pronunciation: R sounds</p>
              <p className="text-sm text-gray-600">Yesterday • Score: 72%</p>
            </div>
            <div className="p-4">
              <p className="font-medium text-gray-800">Added 5 words to your vocabulary</p>
              <p className="text-sm text-gray-600">2 days ago</p>
            </div>
          </div>
        </div>

        {/* Recommended Next Steps */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">Recommended Next Steps</h2>
          <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 transition-all duration-200 bg-white rounded-lg shadow-sm hover:shadow-md">
              <h3 className="text-lg font-medium text-gray-800">Continue Learning</h3>
              <p className="mt-1 text-sm text-gray-600">Intro to Past Tense</p>
              <button className="px-4 py-2 mt-4 text-sm text-white rounded-lg bg-primary-500 hover:bg-primary-600">
                Start Lesson
              </button>
            </div>
            <div className="p-4 transition-all duration-200 bg-white rounded-lg shadow-sm hover:shadow-md">
              <h3 className="text-lg font-medium text-gray-800">Practice Speaking</h3>
              <p className="mt-1 text-sm text-gray-600">Restaurant Conversation</p>
              <button className="px-4 py-2 mt-4 text-sm text-white rounded-lg bg-primary-500 hover:bg-primary-600">
                Start Practice
              </button>
            </div>
            <div className="p-4 transition-all duration-200 bg-white rounded-lg shadow-sm hover:shadow-md">
              <h3 className="text-lg font-medium text-gray-800">Review Vocabulary</h3>
              <p className="mt-1 text-sm text-gray-600">Common Travel Phrases</p>
              <button className="px-4 py-2 mt-4 text-sm text-white rounded-lg bg-primary-500 hover:bg-primary-600">
                Review Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
