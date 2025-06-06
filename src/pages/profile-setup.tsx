import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { apiClient } from '@/services/api';

const FRENCH_LEVELS = [
  { value: 'A1', label: 'A1 - Beginner', description: 'Just starting to learn French' },
  { value: 'A2', label: 'A2 - Elementary', description: 'Can understand basic phrases' },
  { value: 'B1', label: 'B1 - Intermediate', description: 'Can handle everyday situations' },
  { value: 'B2', label: 'B2 - Upper Intermediate', description: 'Can express ideas fluently' },
  { value: 'C1', label: 'C1 - Advanced', description: 'Can use French effectively' },
  { value: 'C2', label: 'C2 - Proficient', description: 'Near-native level' }
];

const LEARNING_GOALS = [
  'Travel to French-speaking countries',
  'Business and professional communication',
  'Academic studies in French',
  'Connect with French culture',
  'Improve career opportunities',
  'Personal enrichment',
  'Prepare for French exams (DELF/DALF)',
  'Communicate with French-speaking family/friends'
];

const DAILY_GOALS = [
  { value: 5, label: '5 minutes/day', description: 'Quick daily practice' },
  { value: 15, label: '15 minutes/day', description: 'Recommended for beginners' },
  { value: 30, label: '30 minutes/day', description: 'Steady progress' },
  { value: 60, label: '1 hour/day', description: 'Intensive learning' }
];

export default function ProfileSetupPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    level: 'A1',
    learningGoals: [] as string[],
    dailyGoal: 15,
    notifications: true
  });

  // Check if user already has a complete profile
  useEffect(() => {
    if (user && user.learningGoals && user.learningGoals.length > 0) {
      // User already has goals set, redirect to dashboard
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleLevelSelect = (level: string) => {
    setFormData(prev => ({ ...prev, level }));
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      learningGoals: prev.learningGoals.includes(goal)
        ? prev.learningGoals.filter(g => g !== goal)
        : [...prev.learningGoals, goal]
    }));
  };

  const handleDailyGoalSelect = (dailyGoal: number) => {
    setFormData(prev => ({ ...prev, dailyGoal }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (formData.learningGoals.length === 0) {
      toast.error('Please select at least one learning goal');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.put('/user/profile', {
        level: formData.level,
        learningGoals: formData.learningGoals,
        preferences: {
          dailyGoal: formData.dailyGoal,
          notifications: formData.notifications,
          theme: 'light'
        }
      });

      if ((response.data as { success?: boolean })?.success) {
        toast.success('Profile setup complete! Welcome to French Tutor AI!');
        router.push('/dashboard');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error: unknown) {
      console.error('Profile setup error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save profile. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.level;
      case 2: return formData.learningGoals.length > 0;
      case 3: return formData.dailyGoal > 0;
      default: return false;
    }
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Complete Your Profile | French Tutor AI</title>
        <meta name="description" content="Set up your French learning profile" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-800">Complete Your Profile</h1>
              <span className="text-sm text-gray-600">Step {currentStep} of 3</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Step 1: French Level */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">What&apos;s your current French level?</h2>
                <p className="text-gray-600 mb-6">This helps us personalize your learning experience.</p>
                
                <div className="space-y-3">
                  {FRENCH_LEVELS.map((level) => (
                    <div
                      key={level.value}
                      onClick={() => handleLevelSelect(level.value)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        formData.level === level.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-800">{level.label}</h3>
                          <p className="text-sm text-gray-600">{level.description}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          formData.level === level.value
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300'
                        }`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Learning Goals */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">What are your learning goals?</h2>
                <p className="text-gray-600 mb-6">Select all that apply. You can change these later.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {LEARNING_GOALS.map((goal) => (
                    <div
                      key={goal}
                      onClick={() => handleGoalToggle(goal)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        formData.learningGoals.includes(goal)
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                          formData.learningGoals.includes(goal)
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300'
                        }`}>
                          {formData.learningGoals.includes(goal) && (
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="text-gray-800">{goal}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Daily Goal */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">How much time can you dedicate daily?</h2>
                <p className="text-gray-600 mb-6">Choose a realistic goal to build a consistent learning habit.</p>
                
                <div className="space-y-3">
                  {DAILY_GOALS.map((goal) => (
                    <div
                      key={goal.value}
                      onClick={() => handleDailyGoalSelect(goal.value)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        formData.dailyGoal === goal.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-800">{goal.label}</h3>
                          <p className="text-sm text-gray-600">{goal.description}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          formData.dailyGoal === goal.value
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300'
                        }`}></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notifications"
                      checked={formData.notifications}
                      onChange={(e) => setFormData(prev => ({ ...prev, notifications: e.target.checked }))}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="notifications" className="ml-3 text-sm text-gray-700">
                      Send me daily reminders to practice French
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                onClick={handleBack}
                variant="outline"
                disabled={currentStep === 1}
              >
                Back
              </Button>

              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed() || isLoading}
                  isLoading={isLoading}
                >
                  Complete Setup
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
