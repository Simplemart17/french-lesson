import Head from 'next/head';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import UserProfile, { UserProfileData } from '@/components/features/UserProfile';
import { useAuth } from '@/context/AuthContext';
import LoadingState from '@/components/ui/LoadingState';

export default function ProfilePage() {
  const { isAuthenticated } = useAuth();
  // Mock user data - would come from API/state in a real app
  const [user, setUser] = useState({
    name: 'Sophie Laurent',
    email: 'sophie.laurent@example.com',
    level: 'intermediate',
    joinDate: '2023-10-15',
    streak: 12,
    totalLessons: 34,
    totalPracticeMinutes: 420,
    achievements: [
      { id: 1, name: 'First Lesson', description: 'Completed your first lesson', date: '2023-10-16', icon: '🎓' },
      { id: 2, name: 'Week Streak', description: 'Practiced for 7 days in a row', date: '2023-10-23', icon: '🔥' },
      { id: 3, name: 'Vocabulary Master', description: 'Learned 100 new words', date: '2023-11-05', icon: '📚' },
    ],
    recentActivities: [
      { id: 1, type: 'lesson', name: 'Basic Greetings', date: '2023-11-10', score: 85 },
      { id: 2, type: 'practice', name: 'Speaking Practice', date: '2023-11-09', duration: 15 },
      { id: 3, type: 'exam', name: 'TCF Reading Module', date: '2023-11-07', score: 78 },
    ]
  });

  // Mock language skills data
  const languageSkills = [
    { skill: 'Listening', level: 'B1', percentage: 65 },
    { skill: 'Speaking', level: 'B1', percentage: 60 },
    { skill: 'Reading', level: 'B2', percentage: 75 },
    { skill: 'Writing', level: 'B1', percentage: 55 },
    { skill: 'Grammar', level: 'B1', percentage: 70 },
    { skill: 'Vocabulary', level: 'B2', percentage: 80 },
  ];

  // User profile data for the UserProfile component
  const [profileData, setProfileData] = useState<UserProfileData>({
    name: user.name,
    email: user.email,
    level: user.level as 'beginner' | 'intermediate' | 'advanced',
    learningGoals: ['Improve conversation skills', 'Expand vocabulary', 'Prepare for an exam'],
    interests: ['Culture', 'Food & Cuisine', 'Travel', 'Movies & TV'],
    studyTime: '30min-1hour',
    targetExam: 'tcf'
  });

  // Handle profile save
  const handleProfileSave = async (data: UserProfileData) => {
    try {
      // In a real app, this would save to an API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

      setProfileData(data);
      // Update user data
      setUser(prev => ({
        ...prev,
        name: data.name,
        email: data.email,
        level: data.level
      }));

      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  return (
    <>
      <Head>
        <title>My Profile | French Tutor AI</title>
        <meta name="description" content="View and manage your French learning profile" />
      </Head>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="text-lg text-gray-600">
            View your progress, achievements, and manage your account settings.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-12 lg:grid-cols-3">
          {/* Profile Summary Card */}
          <div className="lg:col-span-1">
            <Card className="h-full p-5">
              <div className="flex flex-col items-center mb-6 text-center">
                <div className="flex items-center justify-center w-24 h-24 mb-4 text-3xl font-bold rounded-full bg-primary-100 text-primary-700">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
                <div className="px-3 py-1 mt-2 text-sm font-medium rounded-full bg-primary-100 text-primary-800">
                  {user.level.charAt(0).toUpperCase() + user.level.slice(1)} Level
                </div>
                <p className="mt-2 text-sm text-gray-500">Member since {new Date(user.joinDate).toLocaleDateString()}</p>
              </div>

              <div className="pt-4 mb-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600">Current Streak</span>
                  <span className="font-semibold text-gray-800">{user.streak} days 🔥</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600">Lessons Completed</span>
                  <span className="font-semibold text-gray-800">{user.totalLessons}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Practice Time</span>
                  <span className="font-semibold text-gray-800">{user.totalPracticeMinutes} minutes</span>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Link href="/settings">
                  <Button variant="outline" className="w-full">
                    Account Settings
                  </Button>
                </Link>
                <Link href="/progress">
                  <Button variant="outline" className="w-full">
                    Detailed Progress
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Language Skills Card */}
          <div className="lg:col-span-2">
            <Card title="Language Skills" className="h-full p-5">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {languageSkills.map((skill, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">{skill.skill}</span>
                      <span className="text-sm bg-primary-50 text-primary-700 px-2 py-0.5 rounded">
                        {skill.level}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-primary-600 h-2.5 rounded-full"
                        style={{ width: `${skill.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-end mt-1">
                      <span className="text-xs text-gray-500">{skill.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 mt-4 border border-yellow-100 rounded-lg bg-yellow-50">
                <h3 className="mb-2 font-medium text-yellow-800">Recommended Focus Areas</h3>
                <p className="text-sm text-yellow-700">
                  Based on your progress, we recommend focusing on improving your writing skills.
                  Check out our <Link href="/writing" className="text-primary-600 hover:underline">writing exercises</Link> to practice.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">Recent Activity</h2>
          <div className="overflow-hidden bg-white rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Activity
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Result
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {user.recentActivities.map((activity) => (
                    <tr key={activity.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{activity.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${activity.type === 'lesson' ? 'bg-green-100 text-green-800' :
                            activity.type === 'practice' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'}`}>
                          {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{new Date(activity.date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {activity.score !== undefined ? (
                          <div className="text-sm text-gray-900">{activity.score}%</div>
                        ) : activity.duration !== undefined ? (
                          <div className="text-sm text-gray-900">{activity.duration} min</div>
                        ) : (
                          <div className="text-sm text-gray-900">-</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <Link href={`/${activity.type === 'lesson' ? 'lessons' :
                                        activity.type === 'practice' ? 'practice' :
                                        'exam-practice'}`}
                              className="text-primary-600 hover:text-primary-900">
                          Retry
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Link href="/progress">
              <Button variant="outline">
                View All Activity
              </Button>
            </Link>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">Achievements</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {user.achievements.map((achievement) => (
              <div key={achievement.id} className="p-6 transition-shadow bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="mr-4 text-4xl">{achievement.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{achievement.name}</h3>
                    <p className="text-sm text-gray-500">{new Date(achievement.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>
            ))}
            <div className="flex flex-col items-center justify-center p-6 text-center border border-gray-300 border-dashed rounded-lg bg-gray-50">
              <div className="mb-2 text-4xl text-gray-400">🏆</div>
              <h3 className="mb-1 font-semibold text-gray-600">More to Unlock</h3>
              <p className="text-sm text-gray-500">Keep practicing to earn more achievements!</p>
            </div>
          </div>
        </div>

        {/* Learning Goals Section */}
        <div className="mb-12">
          <div className="p-6 rounded-lg bg-gradient-to-r from-primary-50 to-primary-100">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">Learning Goals</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="p-5 bg-white rounded-lg shadow-sm">
                <h3 className="mb-3 text-lg font-semibold text-gray-800">Current Goal</h3>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Reach B2 Level</span>
                    <span className="text-sm text-gray-500">60% Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <p className="mb-4 text-sm text-gray-600">
                  You're making great progress! Continue with regular practice to reach your B2 level goal.
                </p>
                <Button
                  size="sm"
                  onClick={() => {
                    const profileSection = document.getElementById('profile-section');
                    if (profileSection) {
                      profileSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Update Goals
                </Button>
              </div>

              <div className="p-5 bg-white rounded-lg shadow-sm">
                <h3 className="mb-3 text-lg font-semibold text-gray-800">Daily Streak</h3>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className={`aspect-square rounded-md flex items-center justify-center text-sm font-medium
                      ${i < 5 ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-400'}`}>
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  You've practiced 5 days this week. Keep going to maintain your streak!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div id="profile-section" className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">Learning Profile</h2>
          <UserProfile
            initialData={profileData}
            onSave={handleProfileSave}
          />
        </div>

        {/* Suggested Resources */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">Suggested Resources</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Link href="/lessons" className="block group">
              <Card
                variant="primary"
                title="Intermediate Grammar"
                className="h-full p-5 transition-transform group-hover:scale-105"
              >
                <p className="text-gray-300">Master complex verb tenses and sentence structures.</p>
                <div className="flex items-center mt-4 font-medium text-gray-200">
                  Start Learning
                  <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Card>
            </Link>

            <Link href="/vocabulary" className="block group">
              <Card
                variant="secondary"
                title="Business Vocabulary"
                className="h-full p-5 transition-transform group-hover:scale-105"
              >
                <p className="text-gray-300">Learn essential terms for professional environments.</p>
                <div className="flex items-center mt-4 font-medium text-secondary-600">
                  Explore Words
                  <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Card>
            </Link>

            <Link href="/exam-practice" className="block group">
              <Card
                variant="success"
                title="B1 Exam Preparation"
                className="h-full p-5 transition-transform group-hover:scale-105"
              >
                <p className="text-gray-600">Practice tests and exercises to prepare for your B1 exam.</p>
                <div className="flex items-center mt-4 font-medium text-green-600">
                  Start Practice
                  <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
