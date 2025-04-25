import Head from 'next/head';
import { useState } from 'react';
import '../styles/animations.css';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import ProgressChart from '@/components/progress/ProgressChart';
import SkillRadarChart from '@/components/progress/SkillRadarChart';

interface SkillProgress {
  name: string;
  level: number; // 0-100
  category: 'speaking' | 'listening' | 'reading' | 'writing' | 'vocabulary' | 'grammar';
}

interface ActivityLog {
  id: number;
  date: string;
  activity: string;
  duration: number; // in minutes
  xpEarned: number;
  category?: 'speaking' | 'listening' | 'reading' | 'writing' | 'vocabulary' | 'grammar';
}

interface DailyProgress {
  date: string;
  xp: number;
  minutes: number;
}

export default function ProgressPage() {
  // Active tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'activity'>('overview');

  // Mock progress data
  const [skillProgress] = useState<SkillProgress[]>([
    { name: 'Pronunciation', level: 65, category: 'speaking' },
    { name: 'Conversation', level: 45, category: 'speaking' },
    { name: 'Comprehension', level: 70, category: 'listening' },
    { name: 'Reading', level: 60, category: 'reading' },
    { name: 'Writing', level: 40, category: 'writing' },
    { name: 'Vocabulary', level: 55, category: 'vocabulary' },
    { name: 'Grammar', level: 50, category: 'grammar' },
  ]);

  // Mock activity log
  const [activityLog] = useState<ActivityLog[]>([
    { id: 1, date: '2023-11-15', activity: 'Completed Lesson: Basic Greetings', duration: 15, xpEarned: 100, category: 'speaking' },
    { id: 2, date: '2023-11-14', activity: 'Practice Session: Pronunciation', duration: 10, xpEarned: 75, category: 'speaking' },
    { id: 3, date: '2023-11-14', activity: 'Writing Exercise: Daily Routine', duration: 20, xpEarned: 120, category: 'writing' },
    { id: 4, date: '2023-11-12', activity: 'Completed Lesson: Present Tense Verbs', duration: 25, xpEarned: 150, category: 'grammar' },
    { id: 5, date: '2023-11-10', activity: 'Vocabulary Quiz: Food and Dining', duration: 8, xpEarned: 60, category: 'vocabulary' },
    { id: 6, date: '2023-11-09', activity: 'Listening Exercise: Weather Forecast', duration: 12, xpEarned: 90, category: 'listening' },
    { id: 7, date: '2023-11-08', activity: 'Reading Practice: Short Story', duration: 15, xpEarned: 110, category: 'reading' },
    { id: 8, date: '2023-11-07', activity: 'Grammar Quiz: Past Tense', duration: 10, xpEarned: 80, category: 'grammar' },
    { id: 9, date: '2023-11-06', activity: 'Speaking Practice: Daily Conversations', duration: 18, xpEarned: 130, category: 'speaking' },
    { id: 10, date: '2023-11-05', activity: 'Vocabulary Review: Travel Terms', duration: 8, xpEarned: 70, category: 'vocabulary' },
  ]);

  // Generate daily progress data from activity log
  const dailyProgressMap = activityLog.reduce((acc: Record<string, DailyProgress>, activity) => {
    if (!acc[activity.date]) {
      acc[activity.date] = {
        date: activity.date,
        xp: 0,
        minutes: 0
      };
    }

    acc[activity.date].xp += activity.xpEarned;
    acc[activity.date].minutes += activity.duration;

    return acc;
  }, {});

  // Convert to array and sort by date
  const dailyProgress = Object.values(dailyProgressMap).sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Prepare data for charts
  const xpChartData = dailyProgress.map(day => ({
    date: day.date,
    value: day.xp
  }));

  const timeChartData = dailyProgress.map(day => ({
    date: day.date,
    value: day.minutes
  }));

  // Calculate category totals
  const categoryTotals = activityLog.reduce((acc: Record<string, { xp: number, minutes: number }>, activity) => {
    const category = activity.category || 'other';

    if (!acc[category]) {
      acc[category] = { xp: 0, minutes: 0 };
    }

    acc[category].xp += activity.xpEarned;
    acc[category].minutes += activity.duration;

    return acc;
  }, {});

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'speaking': return 'text-blue-600';
      case 'listening': return 'text-purple-600';
      case 'reading': return 'text-green-600';
      case 'writing': return 'text-red-600';
      case 'vocabulary': return 'text-yellow-600';
      case 'grammar': return 'text-indigo-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case 'speaking': return 'bg-blue-100';
      case 'listening': return 'bg-purple-100';
      case 'reading': return 'bg-green-100';
      case 'writing': return 'bg-red-100';
      case 'vocabulary': return 'bg-yellow-100';
      case 'grammar': return 'bg-indigo-100';
      default: return 'bg-gray-100';
    }
  };

  const getCategoryTextColor = (category: string) => {
    switch (category) {
      case 'speaking': return 'text-blue-800';
      case 'listening': return 'text-purple-800';
      case 'reading': return 'text-green-800';
      case 'writing': return 'text-red-800';
      case 'vocabulary': return 'text-yellow-800';
      case 'grammar': return 'text-indigo-800';
      default: return 'text-gray-800';
    }
  };

  const getProgressBarColor = (level: number) => {
    if (level < 30) return 'bg-red-500';
    if (level < 60) return 'bg-yellow-500';
    if (level < 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  // Calculate total XP
  const totalXP = activityLog.reduce((sum, activity) => sum + activity.xpEarned, 0);

  // Calculate total study time
  const totalStudyTime = activityLog.reduce((sum, activity) => sum + activity.duration, 0);

  // Calculate streak (mock data)
  const currentStreak = 3;

  // Calculate level based on XP
  const calculateLevel = (xp: number) => {
    return Math.floor(xp / 500) + 1;
  };

  const userLevel = calculateLevel(totalXP);
  const xpForNextLevel = userLevel * 500;
  const xpProgress = ((totalXP % 500) / 500) * 100;

  return (
    <>
      <Head>
        <title>My Progress | French Tutor AI</title>
        <meta name="description" content="Track your French learning progress and statistics" />
      </Head>

      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col mb-6 md:flex-row md:items-center md:justify-between animate-fade-in">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-800">My Progress</h1>
            <p className="text-lg text-gray-600">
              Track your French learning journey and view your progress
            </p>
          </div>

          <div className="inline-flex p-1 mt-4 bg-white rounded-lg shadow-md transition-all hover-lift md:mt-0">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'skills'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Skills
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'activity'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Activity
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
              <Card className="p-6 text-center transition-all hover-lift animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="inline-flex justify-center items-center mb-4 w-12 h-12 rounded-full bg-primary-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="mb-2 text-4xl font-bold animate-pulse text-primary-600">{totalXP}</div>
                <div className="text-gray-600">Total XP</div>
              </Card>

              <Card className="p-6 text-center transition-all hover-lift animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="inline-flex justify-center items-center mb-4 w-12 h-12 rounded-full bg-secondary-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="mb-2 text-4xl font-bold animate-pulse text-secondary-600">{currentStreak}</div>
                <div className="text-gray-600">Day Streak</div>
              </Card>

              <Card className="p-6 text-center transition-all hover-lift animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="inline-flex justify-center items-center mb-4 w-12 h-12 bg-green-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="mb-2 text-4xl font-bold text-green-600 animate-pulse">{totalStudyTime}</div>
                <div className="text-gray-600">Minutes Studied</div>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
              <Card className="p-6 transition-all hover-lift animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Level Progress
                </h3>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-xl font-bold text-primary-600">Level {userLevel}</span>
                    <span className="ml-2 text-sm text-gray-500">{totalXP} / {xpForNextLevel} XP</span>
                  </div>
                  <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full shadow-sm">
                    {xpForNextLevel - totalXP} XP to Level {userLevel + 1}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-primary-600 h-2.5 rounded-full animate-progress-fill"
                    style={{ width: `${xpProgress}%`, '--progress-width': `${xpProgress}%` } as React.CSSProperties}
                  ></div>
                </div>
              </Card>

              <Card className="p-6 transition-all hover-lift animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 w-5 h-5 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Study Time by Category
                </h3>
                <div className="space-y-3">
                  {Object.entries(categoryTotals).map(([category, data]) => (
                    <div key={category}>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`font-medium ${getCategoryColor(category)}`}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </span>
                        <span className="text-sm text-gray-600">{data.minutes} min</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div
                          className={`${getCategoryColor(category).replace('text', 'bg')} h-2 rounded-full`}
                          style={{ width: `${(data.minutes / totalStudyTime) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
              <Card className="p-6 transition-all hover-lift">
                <ProgressChart
                  data={xpChartData}
                  title="XP Earned Over Time"
                  color="#4f46e5"
                  height={250}
                />
              </Card>

              <Card className="p-6 transition-all hover-lift">
                <ProgressChart
                  data={timeChartData}
                  title="Study Time (minutes)"
                  color="#10b981"
                  height={250}
                />
              </Card>
            </div>
          </>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <Card className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">Skill Levels</h3>
                <div className="space-y-4">
                  {skillProgress.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <span className={`${getCategoryColor(skill.category)} font-medium`}>{skill.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`${getProgressBarColor(skill.level)} h-2.5 rounded-full`}
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">Skill Radar</h3>
                <SkillRadarChart
                  skills={skillProgress}
                  size={350}
                />

                <div className="p-4 mt-6 bg-gray-50 rounded-lg border border-gray-100">
                  <h4 className="mb-2 font-medium text-gray-800">Skill Assessment</h4>
                  <p className="text-gray-600">
                    Your strongest skills are in Listening and Pronunciation. Consider focusing more on Writing and Conversation to achieve a more balanced skill set.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <>
            <Card className="mb-8">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Activity
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Duration
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        XP Earned
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activityLog.map((activity) => (
                      <tr key={activity.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {new Date(activity.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {activity.activity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {activity.category && (
                            <span className={`px-2 py-1 text-xs rounded-full ${getCategoryBgColor(activity.category)} ${getCategoryTextColor(activity.category)}`}>
                              {activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {activity.duration} min
                        </td>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-primary-600">
                          +{activity.xpEarned} XP
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>
    </>
  );
}