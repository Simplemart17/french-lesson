import Head from 'next/head';
import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import apiClient from '@/services/api/apiClient';
import { supabase } from '@/lib/supabase';

const TTS_VOICES = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'] as const;

export default function SettingsPage() {
  // User preferences state
  const [preferences, setPreferences] = useState({
    dailyGoal: 15, // minutes
    emailNotifications: true,
    reminderTime: '18:00',
    difficulty: 'adaptive',
    theme: 'light',
    audioEnabled: true
  });

  const { user, refreshUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // TTS voice preference
  const [ttsVoice, setTtsVoice] = useState('alloy');

  // Load TTS voice from localStorage on mount
  useEffect(() => {
    const storedVoice = localStorage.getItem('tts-voice');
    if (storedVoice && TTS_VOICES.includes(storedVoice as typeof TTS_VOICES[number])) {
      setTtsVoice(storedVoice);
    }
  }, []);

  // Profile information state - initialize with empty defaults to avoid hydration mismatch
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    level: 'A1' as string
  });

  // Hydrate profile from auth context
  useEffect(() => {
    if (user) {
      const hydrated = {
        name: user.name || '',
        email: user.email || '',
        level: user.level || 'A1'
      };
      setProfile(hydrated);
      setFormData(hydrated);
    }
  }, [user]);

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', newPassword: '', confirm: '' });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleChangePassword = async () => {
    setPasswordError('');
    if (passwordForm.newPassword !== passwordForm.confirm) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({ password: passwordForm.newPassword });
      if (error) throw error;
      setShowPasswordForm(false);
      setPasswordForm({ current: '', newPassword: '', confirm: '' });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    if (!window.confirm('This will permanently delete all your data. Type OK to confirm.')) return;
    try {
      await apiClient.delete('/user/profile');
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (err) {
      console.error('Failed to delete account:', err);
      alert('Failed to delete account. Please contact support.');
    }
  };

  const handlePreferenceChange = async (key: string, value: string | boolean | number) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);

    try {
      await apiClient.put('/user/profile', {
        preferences: {
          dailyGoal: updated.dailyGoal,
          notifications: updated.emailNotifications,
          theme: updated.theme,
        }
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save preferences:', err);
    }
  };

  const handleProfileEdit = () => {
    setIsEditing(true);
    setFormData(profile);
  };

  const handleProfileSave = async () => {
    try {
      await apiClient.put('/user/profile', {
        name: formData.name,
        level: formData.level,
      });
      setProfile(formData);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      // Refresh user in auth context so level is consistent everywhere
      await refreshUser();
    } catch (err) {
      console.error('Failed to save profile:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <ProtectedRoute>
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
                    value={formData.level || 'A1'}
                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="A1">Beginner (A1)</option>
                    <option value="A2">Elementary (A2)</option>
                    <option value="B1">Intermediate (B1)</option>
                    <option value="B2">Upper Intermediate (B2)</option>
                    <option value="C1">Advanced (C1)</option>
                    <option value="C2">Proficient (C2)</option>
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
                      {profile.level === 'A1' ? 'Beginner (A1)' :
                       profile.level === 'A2' ? 'Elementary (A2)' :
                       profile.level === 'B1' ? 'Intermediate (B1)' :
                       profile.level === 'B2' ? 'Upper Intermediate (B2)' :
                       profile.level === 'C1' ? 'Advanced (C1)' :
                       profile.level === 'C2' ? 'Proficient (C2)' :
                       profile.level === 'beginner' ? 'Beginner (A1-A2)' :
                       profile.level === 'intermediate' ? 'Intermediate (B1-B2)' :
                       profile.level === 'advanced' ? 'Advanced (C1-C2)' :
                       profile.level || 'Not set'}
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

              <div>
                <label htmlFor="ttsVoice" className="block mb-1 text-sm font-medium text-gray-700">
                  TTS Voice
                </label>
                <select
                  id="ttsVoice"
                  value={ttsVoice}
                  onChange={(e) => {
                    const voice = e.target.value;
                    setTtsVoice(voice);
                    localStorage.setItem('tts-voice', voice);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  {TTS_VOICES.map((voice) => (
                    <option key={voice} value={voice}>
                      {voice.charAt(0).toUpperCase() + voice.slice(1)}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">Choose the voice used for text-to-speech audio playback.</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="darkMode" className="text-sm font-medium text-gray-700">
                    Dark Mode
                  </label>
                  <p className="text-xs text-gray-500">Switch between light and dark theme.</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="darkMode"
                    checked={theme === 'dark'}
                    onChange={toggleTheme}
                    className="sr-only"
                  />
                  <div className={`block w-10 h-6 rounded-full ${theme === 'dark' ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${theme === 'dark' ? 'transform translate-x-4' : ''}`}></div>
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
                {showPasswordForm ? (
                  <div className="space-y-3">
                    {passwordError && (
                      <div className="p-2 text-sm text-red-700 border border-red-200 rounded bg-red-50">{passwordError}</div>
                    )}
                    <input
                      type="password"
                      placeholder="New password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={passwordForm.confirm}
                      onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <div className="flex space-x-2">
                      <Button onClick={handleChangePassword}>Update Password</Button>
                      <Button variant="outline" onClick={() => setShowPasswordForm(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full" onClick={() => setShowPasswordForm(true)}>
                    Change Password
                  </Button>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50" onClick={handleDeleteAccount}>
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
