import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import LoadingState from '@/components/ui/LoadingState';
import { toast } from 'sonner';

export default function AuthCallback() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the auth callback using Supabase's built-in method
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          setError(error.message);
          return;
        }

        // Check URL parameters for callback type
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');
        const accessToken = urlParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token');

        // If we have tokens in URL, this is likely an email confirmation
        if (accessToken && refreshToken) {
          // Set the session from URL tokens
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (sessionError) {
            console.error('Session error:', sessionError);
            setError(sessionError.message);
            return;
          }

          if (sessionData.session && sessionData.user) {
            // Email confirmed and user is now authenticated
            toast.success('Email confirmed successfully! Welcome to French Tutor AI!');

            // Clear any stored registration email
            localStorage.removeItem('registration_email');

            // Redirect to dashboard or profile setup
            router.push('/dashboard');
            return;
          }
        }

        if (data.session) {
          // User is already authenticated
          toast.success('Successfully authenticated!');
          router.push('/dashboard');
        } else {
          // Check if this is a specific callback type
          if (type === 'signup') {
            toast.success('Email confirmed! Please log in.');
            router.push('/login');
          } else if (type === 'recovery') {
            // Password reset - redirect to reset password page
            router.push('/auth/reset-password');
          } else {
            // Default redirect to login
            router.push('/login');
          }
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Authentication failed');
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState message="Processing authentication..." size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
}
