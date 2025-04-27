import Head from 'next/head';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AuthService } from '@/utils/authService';

export default function SettingsPage() {
  const storedUser = AuthService.getUserData();
  // User preferences state
  const [preferences, setPreferences] = useState({
    dailyGoal: 15, // minutes
    emailNotifications: true,
    reminderTime: '18:00',
    difficulty: 'adaptive',
    theme: 'light',
    audioEnabled: true
  });

  // Profile information state
  const [profile, setProfile] = useState({
    name: storedUser?.name,
    email: storedUser?.email,
    level: storedUser?.level
  });

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences({
      ...preferences,
      [key]: value
    });
    
    // Show success message briefly
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleProfileEdit = () => {
    setIsEditing(true);
    setFormData(profile);
  };

  const handleProfileSave = () => {
    setProfile(formData);
    setIsEditing(false);
    
    // Show success message briefly
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <>
      <Head>
        <title>Settings | French Tutor AI</title>
        <meta name="description" content="Manage your account settings and preferences" />
      </Head>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-lg text-gray-600">
            Manage your account settings and learning preferences.
          </p>
        </div>

        {saveSuccess && (
          <div className="relative px-4 py-3 mb-6 text-green-700 border border-green-200 rounded bg-green-50">
            Settings saved successfully!
          </div>
        )}

        {/* Profile Settings */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="mb-6 text-xl font-semibold text-gray-800">Profile Information</h2>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="level" className="block mb-1 text-sm font-medium text-gray-700">
                    French Level
                  </label>
                  <select
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="beginner">Beginner (A1-A2)</option>
                    <option value="intermediate">Intermediate (B1-B2)</option>
                    <option value="advanced">Advanced (C1-C2)</option>
                  </select>
                </div>
                
                <div className="flex justify-end pt-4 space-x-3">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleProfileSave}>
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <p className="mb-1 text-sm text-gray-500">Name</p>
                    <p className="text-gray-800">{profile.name}</p>
                  </div>
                  
                  <div>
                    <p className="mb-1 text-sm text-gray-500">Email</p>
                    <p className="text-gray-800">{profile.email}</p>
                  </div>
                  
                  <div>
                    <p className="mb-1 text-sm text-gray-500">French Level</p>
                    <p className="text-gray-800">
                      {profile.level === "A1" || profile.level === "A2" ? 'Beginner (A1-A2)' : 
                       profile.level === "B1" || profile.level === "B2" ? 'Intermediate (B1-B2)' : 
                       'Advanced (C1-C2)'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button variant="outline" onClick={handleProfileEdit}>
                    Edit Profile
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Learning Preferences */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="mb-6 text-xl font-semibold text-gray-800">Learning Preferences</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="dailyGoal" className="block mb-1 text-sm font-medium text-gray-700">
                  Daily Learning Goal (minutes)
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    id="dailyGoal"
                    min="5"
                    max="60"
                    step="5"
                    value={preferences.dailyGoal}
                    onChange={(e) => handlePreferenceChange('dailyGoal', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-3 text-gray-700 min-w-[40px]">{preferences.dailyGoal}</span>
                </div>
              </div>
              
              <div>
                <label htmlFor="difficulty" className="block mb-1 text-sm font-medium text-gray-700">
                  Content Difficulty
                </label>
                <select
                  id="difficulty"
                  value={preferences.difficulty}
                  onChange={(e) => handlePreferenceChange('difficulty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="easier">Easier - Focus on building confidence</option>
                  <option value="adaptive">Adaptive - Adjust to my performance</option>
                  <option value="challenging">Challenging - Push my limits</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-700">
                  Email Notifications
                </label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={preferences.emailNotifications}
                    onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`block w-10 h-6 rounded-full ${preferences.emailNotifications ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${preferences.emailNotifications ? 'transform translate-x-4' : ''}`}></div>
                </div>
              </div>
              
              <div>
                <label htmlFor="reminderTime" className="block mb-1 text-sm font-medium text-gray-700">
                  Daily Reminder Time
                </label>
                <input
                  type="time"
                  id="reminderTime"
                  value={preferences.reminderTime}
                  onChange={(e) => handlePreferenceChange('reminderTime', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="audioEnabled" className="text-sm font-medium text-gray-700">
                  Audio Pronunciation
                </label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="audioEnabled"
                    checked={preferences.audioEnabled}
                    onChange={(e) => handlePreferenceChange('audioEnabled', e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`block w-10 h-6 rounded-full ${preferences.audioEnabled ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${preferences.audioEnabled ? 'transform translate-x-4' : ''}`}></div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Account Settings */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="mb-6 text-xl font-semibold text-gray-800">Account Settings</h2>
            
            <div className="space-y-6">
              <div>
                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
              </div>
              
              <div>
                <Button variant="outline" className="w-full">
                  Download My Data
                </Button>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
