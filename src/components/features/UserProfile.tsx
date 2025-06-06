import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';

export interface UserProfileData {
  name: string;
  email: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  learningGoals: string[];
  interests: string[];
  studyTime: 'less-than-30min' | '30min-1hour' | '1-2hours' | 'more-than-2hours';
  targetExam: 'none' | 'tcf' | 'tef' | 'delf' | 'dalf';
}

interface UserProfileProps {
  initialData?: Partial<UserProfileData>;
  onSave?: (data: UserProfileData) => void;
  isLoading?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({
  initialData = {},
  onSave,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<UserProfileData>({
    name: initialData.name || '',
    email: initialData.email || '',
    level: initialData.level || 'beginner',
    learningGoals: initialData.learningGoals || [],
    interests: initialData.interests || [],
    studyTime: initialData.studyTime || 'less-than-30min',
    targetExam: initialData.targetExam || 'none'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserProfileData, string>>>({});

  // Available learning goals
  const availableLearningGoals = [
    'Improve conversation skills',
    'Expand vocabulary',
    'Master grammar rules',
    'Prepare for an exam',
    'Travel to a French-speaking country',
    'Read French literature',
    'Watch French movies/TV',
    'Business/Professional needs'
  ];

  // Available interests
  const availableInterests = [
    'Culture',
    'Food & Cuisine',
    'Travel',
    'Literature',
    'Movies & TV',
    'Music',
    'History',
    'Sports',
    'Technology',
    'Business',
    'Science',
    'Art'
  ];

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name as keyof UserProfileData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Handle checkbox change for arrays (learning goals, interests)
  const handleCheckboxChange = (field: 'learningGoals' | 'interests', value: string) => {
    setFormData(prev => {
      const currentValues = prev[field];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [field]: newValues
      };
    });
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserProfileData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.learningGoals.length === 0) {
      newErrors.learningGoals = 'Please select at least one learning goal';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && onSave) {
      onSave(formData);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">Your Learning Profile</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-primary-500`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          
          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-primary-500`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
        </div>
        
        {/* French Level */}
        <div className="mb-6">
          <label htmlFor="level" className="block mb-2 text-sm font-medium text-gray-700">
            Your French Level
          </label>
          <select
            id="level"
            name="level"
            value={formData.level}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="beginner">Beginner (A1-A2)</option>
            <option value="intermediate">Intermediate (B1-B2)</option>
            <option value="advanced">Advanced (C1-C2)</option>
          </select>
        </div>
        
        {/* Learning Goals */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Learning Goals (select all that apply)
          </label>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {availableLearningGoals.map((goal) => (
              <div key={goal} className="flex items-center">
                <input
                  type="checkbox"
                  id={`goal-${goal}`}
                  checked={formData.learningGoals.includes(goal)}
                  onChange={() => handleCheckboxChange('learningGoals', goal)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor={`goal-${goal}`} className="ml-2 text-sm text-gray-700">
                  {goal}
                </label>
              </div>
            ))}
          </div>
          {errors.learningGoals && (
            <p className="mt-1 text-sm text-red-600">{errors.learningGoals}</p>
          )}
        </div>
        
        {/* Interests */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Interests (select all that apply)
          </label>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {availableInterests.map((interest) => (
              <div key={interest} className="flex items-center">
                <input
                  type="checkbox"
                  id={`interest-${interest}`}
                  checked={formData.interests.includes(interest)}
                  onChange={() => handleCheckboxChange('interests', interest)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor={`interest-${interest}`} className="ml-2 text-sm text-gray-700">
                  {interest}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Study Time */}
        <div className="mb-6">
          <label htmlFor="studyTime" className="block mb-2 text-sm font-medium text-gray-700">
            How much time can you dedicate to learning French each day?
          </label>
          <select
            id="studyTime"
            name="studyTime"
            value={formData.studyTime}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="less-than-30min">Less than 30 minutes</option>
            <option value="30min-1hour">30 minutes to 1 hour</option>
            <option value="1-2hours">1 to 2 hours</option>
            <option value="more-than-2hours">More than 2 hours</option>
          </select>
        </div>
        
        {/* Target Exam */}
        <div className="mb-6">
          <label htmlFor="targetExam" className="block mb-2 text-sm font-medium text-gray-700">
            Are you preparing for a specific exam?
          </label>
          <select
            id="targetExam"
            name="targetExam"
            value={formData.targetExam}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="none">No specific exam</option>
            <option value="tcf">TCF (Test de Connaissance du Français)</option>
            <option value="tef">TEF (Test d&apos;Évaluation de Français)</option>
            <option value="delf">DELF (Diplôme d&apos;Études en Langue Française)</option>
            <option value="dalf">DALF (Diplôme Approfondi de Langue Française)</option>
          </select>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <LoadingState size="small" />
                <span className="ml-2">Saving...</span>
              </>
            ) : (
              'Save Profile'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
