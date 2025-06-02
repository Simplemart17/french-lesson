import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabaseAuth } from '@/lib/supabaseAuth';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{password?: string; confirmPassword?: string}>({});
  const router = useRouter();

  const validateForm = () => {
    const newErrors: {password?: string; confirmPassword?: string} = {};

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabaseAuth.updatePassword(password);

      if (error) {
        toast.error(error);
        return;
      }

      toast.success('Password updated successfully!');
      
      // Redirect to dashboard after successful password reset
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);

    } catch (err: any) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Reset Password | French Tutor AI</title>
        <meta name="description" content="Reset your password for French Tutor AI" />
      </Head>

      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-800">Reset Password</h1>
            <p className="text-gray-600">Enter your new password below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors(prev => ({ ...prev, password: undefined }));
                  }
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                  errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) {
                    setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                  }
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                  errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/login')}
              className="text-primary-600 hover:text-primary-700"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
