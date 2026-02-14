import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { GetServerSideProps } from 'next';


export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{general?: string; password?: string}>({});
  const { register, isLoading, isAuthenticated, isInitialized, error, clearError } = useAuth();
  const router = useRouter();
  const { redirect } = router.query;

  // Show auth error from context if present
  useEffect(() => {
    if (error) {
      setErrors({ general: error });
      clearError(); // Clear the error from context after displaying it
    }
  }, [error, clearError]);

  // If already authenticated, redirect to dashboard or the redirect URL
  useEffect(() => {
    if (isAuthenticated && isInitialized && !isLoading) {
      console.log('Already authenticated, redirecting to dashboard');
      // Use router.push for navigation
      router.push('/dashboard');
    }
  }, [isAuthenticated, isInitialized, isLoading, router]);

  const validateForm = () => {
    const newErrors: {general?: string; password?: string} = {};

    // Password validation
    if (password !== confirmPassword) {
      newErrors.password = 'Passwords do not match';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await register(name, email, password);

      toast.success('Account created successfully!', {
        duration: 2000,
      });

      // Store email for the success page
      localStorage.setItem('registration_email', email);

      // Small delay to allow the toast to be seen before redirecting
      setTimeout(() => {
        console.log('Registration successful, redirecting to success page');
        // Redirect to registration success page with email
        router.push(`/auth/registration-success?email=${encodeURIComponent(email)}`);
      }, 1000);
    } catch (err) {
      // Error is already set in the auth context and will be displayed via the useEffect
      console.error('Registration error:', err);
    }
  };

  return (
    <>
      <Head>
        <title>Register | French Tutor AI</title>
        <meta name="description" content="Create a new account on French Tutor AI" />
      </Head>

      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-800">Create an Account</h1>
            <p className="text-gray-600">Start your French learning journey today</p>
          </div>

          {(errors.general || errors.password) && (
            <div className="p-3 mb-4 text-red-700 border border-red-200 rounded-lg bg-red-50">
              {errors.general || errors.password}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-16 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute text-sm font-medium -translate-y-1/2 right-3 top-1/2 text-primary-600 hover:text-primary-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters long
              </p>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block mb-1 text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-16 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute text-sm font-medium -translate-y-1/2 right-3 top-1/2 text-primary-600 hover:text-primary-700"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="w-4 h-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
                required
              />
              <label htmlFor="terms" className="block ml-2 text-sm text-gray-700">
                I agree to the{' '}
                <Link href="/terms" className="text-primary-600 hover:text-primary-700">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary-600 hover:text-primary-700">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href={`/login${redirect ? `?redirect=${redirect}` : ''}`} className="font-medium text-primary-600 hover:text-primary-700">
                Log in
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
