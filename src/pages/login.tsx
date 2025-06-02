import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { GetServerSideProps } from 'next';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{email?: string; password?: string; general?: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isLoading, isAuthenticated, error, clearError, isInitialized, user } = useAuth();
  const router = useRouter();
  const { redirect, session } = router.query;

  // Show session expired message if redirected with session=expired
  useEffect(() => {
    if (session === 'expired') {
      toast.error('Your session has expired. Please log in again.');

      // Remove the query parameter to prevent showing the message again on refresh
      const { pathname } = router;
      router.replace(pathname, undefined, { shallow: true });
    }
  }, [session]);

  // If already authenticated, redirect to dashboard or the redirect URL
  useEffect(() => {
    console.log('🔄 Login page auth state:', { isAuthenticated, isInitialized, isLoading, user });
    // Only redirect if we're authenticated, initialized, and not in a loading state
    if (isAuthenticated && isInitialized && !isLoading) {
      // Prevent redirect loops by checking if we're being redirected back to login
      const redirectPath = redirect && typeof redirect === 'string' && !redirect.includes('/login')
        ? redirect
        : '/dashboard';

      console.log('🔄 Redirecting to:', redirectPath);
      // Use router.push for navigation
      router.push(redirectPath);
    }
  }, [isAuthenticated, isLoading, isInitialized, user, router, redirect]);

  // Show auth error from context if present
  useEffect(() => {
    if (error) {
      setErrors({ general: error });
      clearError(); // Clear the error from context after displaying it
    }
  }, [error]);

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await login(email, password);

      toast.success('Successfully logged in!', {
        duration: 2000,
      });

      // The redirect will be handled by the useEffect in AuthContext after login
      // No need for manual redirect here as it causes conflicts

    } catch (err: any) {
      console.error('Login form error:', err);
      // Error is already set in the auth context and will be displayed via the useEffect
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to clear errors
  const clearErrors = (field?: string) => {
    if (field) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    } else {
      setErrors({});
    }
  };

  return (
    <>
      <Head>
        <title>Login | French Tutor AI</title>
        <meta name="description" content="Log in to your French Tutor AI account" />
      </Head>

      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-600">Log in to continue your French learning journey</p>
          </div>

          {errors.general && (
            <div className="p-3 mb-4 text-red-700 border border-red-200 rounded-lg bg-red-50">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email || errors.general) {
                    clearErrors('email');
                    clearErrors('general');
                  }
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password || errors.general) {
                    clearErrors('password');
                    clearErrors('general');
                  }
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
                  errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="w-4 h-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading || isSubmitting}
              disabled={isLoading || isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Log In'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href={`/register${redirect ? `?redirect=${redirect}` : ''}`} className="font-medium text-primary-600 hover:text-primary-700">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// Server-side props to check authentication status
export const getServerSideProps: GetServerSideProps = async () => {
  // We'll let client-side handle authentication to avoid redirection loops
  // This is safer because client-side can check the actual auth state
  // rather than just the presence of a token

  return {
    props: {},
  };
};
