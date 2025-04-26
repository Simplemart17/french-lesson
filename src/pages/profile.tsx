import Head from 'next/head';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import UserProfile, { UserProfileData } from '@/components/features/UserProfile';
import { useAuth } from '@/context/AuthContext';
import LoadingState from '@/components/ui/LoadingState';
import apiClient from '@/services/api/apiClient';
import { User } from '@/types/api';

interface UserProfileFullData extends User {
  achievements: {
    id: number;
    name: string;
    description: string;
    date: string;
    icon: string;
  }[];
  recentActivities: {
    id: number;
    type: string;
    name: string;
    date: string;
    score?: number;
    duration?: number;
  }[];
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
  };
}

interface LanguageSkill {
  skill: string;
  level: string;
  percentage: number;
}

interface ResourceItem {
  id: string;
  title: string;
  description: string;
  type: 'lesson' | 'exercise' | 'article';
  level: string;
  imageUrl?: string;
  link: string;
}

export default function ProfilePage() {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfileFullData | null>(null);
  const [languageSkills, setLanguageSkills] = useState<LanguageSkill[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);

  // User profile data for the UserProfile component
  const [profileData, setProfileData] = useState<UserProfileData>({
    name: '',
    email: '',
    level: 'beginner',
    learningGoals: [],
    interests: [],
    studyTime: '30min-1hour',
    targetExam: 'tcf'
  });

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await apiClient.get<ApiResponse<UserProfileFullData>>('/user/profile');
        
        if (response.data.success && response.data.data) {
          const userData = response.data.data;
          setUser(userData);
          
          // Update profile data
          setProfileData({
            name: userData.name,
            email: userData.email,
            level: (userData.level as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
            learningGoals: userData.learningGoals || [],
            interests: ['Culture', 'Food & Cuisine', 'Travel', 'Movies & TV'], // Default interests until we have an API
            studyTime: '30min-1hour', // Default value
            targetExam: 'tcf' // Default value
          });
        } else {
          setError('Failed to load user profile data');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user profile. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated]);

  // Fetch language skills from API
  useEffect(() => {
    const fetchLanguageSkills = async () => {
      if (!isAuthenticated || !user) {
        return;
      }

      try {
        const response = await apiClient.get<ApiResponse<LanguageSkill[]>>('/user/skills');
        
        if (response.data.success && response.data.data) {
          setLanguageSkills(response.data.data);
        } else {
          // Fallback to default skills if API fails
          setLanguageSkills([
            { skill: 'Listening', level: 'B1', percentage: 65 },
            { skill: 'Speaking', level: 'B1', percentage: 60 },
            { skill: 'Reading', level: 'B2', percentage: 75 },
            { skill: 'Writing', level: 'B1', percentage: 55 },
            { skill: 'Grammar', level: 'B1', percentage: 70 },
            { skill: 'Vocabulary', level: 'B2', percentage: 80 },
          ]);
        }
      } catch (err) {
        console.error('Error fetching language skills:', err);
        // Fallback to default skills if API fails
        setLanguageSkills([
          { skill: 'Listening', level: 'B1', percentage: 65 },
          { skill: 'Speaking', level: 'B1', percentage: 60 },
          { skill: 'Reading', level: 'B2', percentage: 75 },
          { skill: 'Writing', level: 'B1', percentage: 55 },
          { skill: 'Grammar', level: 'B1', percentage: 70 },
          { skill: 'Vocabulary', level: 'B2', percentage: 80 },
        ]);
      }
    };

    fetchLanguageSkills();
  }, [isAuthenticated, user]);

  // Fetch resources from API
  useEffect(() => {
    const fetchRecommendedResources = async () => {
      if (!isAuthenticated || !user) {
        return;
      }

      try {
        const response = await apiClient.get<{resources: ResourceItem[]}>('/learning/recommended-resources');
        
        if (response.data && response.data.resources) {
          setResources(response.data.resources);
        } else {
          // No fallback needed as we'll handle empty state in the UI
          console.log('No recommended resources available');
        }
      } catch (err) {
        console.error('Error fetching recommended resources:', err);
      }
    };

    fetchRecommendedResources();
  }, [isAuthenticated, user]);

  // Handle profile save
  const handleProfileSave = async (data: UserProfileData) => {
    try {
      setIsLoading(true);
      const response = await apiClient.put<ApiResponse<UserProfileFullData>>('/user/profile', {
        name: data.name,
        email: data.email,
        level: data.level,
        learningGoals: data.learningGoals
      });

      if (response.data.success && response.data.data) {
        // Update local state with new user data
        setUser(prev => prev ? {
          ...prev,
          name: data.name,
          email: data.email,
          level: data.level,
          learningGoals: data.learningGoals
        } : null);
        
        setProfileData(data);
        alert('Profile saved successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingState message="Loading profile..." />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-6xl py-8 mx-auto">
        <div className="p-6 text-red-700 border border-red-100 rounded-lg bg-red-50">
          <h2 className="mb-4 text-xl font-bold">{error || 'User profile not available'}</h2>
          <p>Please try refreshing the page or logging in again.</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

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
                <p className="mt-2 text-sm text-gray-500">Member since {new Date(user.joinedAt).toLocaleDateString()}</p>
              </div>

              <div className="pt-4 mb-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600">Current Streak</span>
                  <span className="font-semibold text-gray-800">{user.streakDays} days 🔥</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600">Lessons Completed</span>
                  <span className="font-semibold text-gray-800">{user.completedLessons}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">XP Points</span>
                  <span className="font-semibold text-gray-800">{user.points} points</span>
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
            <Card className="h-full p-5">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">Language Skills</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {languageSkills.map((skill, index) => (
                  <div key={index} className="p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-800">{skill.skill}</h3>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                        {skill.level}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 rounded-full bg-primary-500"
                        style={{ width: `${skill.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {user.recentActivities && user.recentActivities.length > 0 && (
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
                      <tr key={activity.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{activity.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full 
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
                          {activity.score ? (
                            <div className="text-sm text-gray-900">{activity.score}% score</div>
                          ) : activity.duration ? (
                            <div className="text-sm text-gray-900">{activity.duration} min</div>
                          ) : (
                            <div className="text-sm text-gray-900">-</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                          <Link href={`/${activity.type}s/${activity.id}`} className="text-indigo-600 hover:text-indigo-900">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {user.achievements && user.achievements.length > 0 && (
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
        )}

        {/* Learning Goals Section */}
        {user.learningGoals && user.learningGoals.length > 0 && (
          <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card className="p-5">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">My Learning Goals</h2>
                <div className="space-y-4">
                  {user.learningGoals.map((goal, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-primary-100 text-primary-800">
                          {index + 1}
                        </div>
                        <span className="text-gray-800">{goal}</span>
                      </div>
                    </div>
                  ))}
                  {user.learningGoals.length < 3 && (
                    <div className="p-4 border border-gray-300 border-dashed rounded-lg">
                      <div className="flex items-center justify-center text-gray-500">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Add another learning goal</span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <div className="p-5 bg-white rounded-lg shadow-sm">
                <h3 className="mb-3 text-lg font-semibold text-gray-800">Daily Streak</h3>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className={`aspect-square rounded-md flex items-center justify-center text-sm font-medium
                      ${i < user.streakDays % 7 ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-400'}`}>
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  You've practiced {user.streakDays % 7} days this week. Keep going to maintain your streak!
                </p>
              </div>
            </div>
          </div>
        )}

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
          {resources.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {resources.map(resource => (
                <Card key={resource.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="relative h-40 bg-gray-200">
                    {resource.imageUrl ? (
                      <img 
                        src={resource.imageUrl} 
                        alt={resource.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        <span>Resource Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">{resource.title}</h3>
                    <p className="mb-4 text-sm text-gray-600">{resource.description}</p>
                    <Link href={resource.link}>
                      <Button size="sm">
                        {resource.type === 'lesson' ? 'Start Lesson' : 
                        resource.type === 'exercise' ? 'Start Practice' : 
                        'View Resource'}
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center rounded-lg bg-gray-50">
              <p className="text-gray-600">No recommended resources available at this time.</p>
              <p className="mt-2 text-sm text-gray-500">Complete more lessons to receive personalized recommendations.</p>
              <Link href="/lessons">
                <Button className="mt-4">
                  Browse All Lessons
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
