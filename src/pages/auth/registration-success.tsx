import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/Button';
import { supabaseAuth } from '@/lib/supabaseAuth';
import { toast } from 'sonner';

export default function RegistrationSuccessPage() {
  const [email, setEmail] = useState<string>('');
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Get email from query params or localStorage
    const emailFromQuery = router.query.email as string;
    const emailFromStorage = localStorage.getItem('registration_email');
    
    if (emailFromQuery) {
      setEmail(emailFromQuery);
      localStorage.setItem('registration_email', emailFromQuery);
    } else if (emailFromStorage) {
      setEmail(emailFromStorage);
    }
  }, [router.query]);

  useEffect(() => {
    // Cooldown timer
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendConfirmation = async () => {
    if (!email || isResending || resendCooldown > 0) return;

    setIsResending(true);
    try {
      const { error } = await supabaseAuth.resendConfirmation(email);
      
      if (error) {
        toast.error(error);
      } else {
        toast.success('Confirmation email sent! Please check your inbox.');
        setResendCooldown(60); // 60 second cooldown
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to resend confirmation email');
    } finally {
      setIsResending(false);
    }
  };

  const handleLoginRedirect = () => {
    // Clear the stored email
    localStorage.removeItem('registration_email');
    router.push('/login');
  };

  return (
    <>
      <Head>
        <title>Registration Successful | French Tutor AI</title>
        <meta name="description" content="Your account has been created successfully" />
      </Head>

      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-800">Account Created!</h1>
            <p className="text-gray-600">
              Welcome to French Tutor AI! Your account has been created successfully.
            </p>
          </div>

          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">📧 Verify Your Email</h2>
            <p className="text-sm text-blue-700 mb-3">
              We&apos;ve sent a verification email to:
            </p>
            <p className="font-medium text-blue-800 mb-3">{email}</p>
            <p className="text-sm text-blue-700">
              Please check your inbox and click the verification link to activate your account.
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              <p className="mb-2">📱 <strong>Check your spam folder</strong> if you don&apos;t see the email</p>
              <p className="mb-2">⏰ The verification link expires in 24 hours</p>
              <p>🔄 You can resend the email if needed</p>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={handleResendConfirmation}
                disabled={isResending || resendCooldown > 0}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  isResending || resendCooldown > 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isResending 
                  ? 'Sending...' 
                  : resendCooldown > 0 
                    ? `Resend in ${resendCooldown}s`
                    : 'Resend Verification Email'
                }
              </button>

              <Button
                onClick={handleLoginRedirect}
                variant="outline"
                className="w-full"
              >
                Continue to Login
              </Button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">🚀 What&apos;s Next?</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>1. Verify your email address</p>
              <p>2. Complete your learning profile</p>
              <p>3. Take a placement test (optional)</p>
              <p>4. Start your French learning journey!</p>
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            <p>
              Need help? <Link href="/contact" className="text-primary-600 hover:text-primary-700">Contact Support</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
