import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

export default function DebugAuthPage() {
  const { user, isAuthenticated, isLoading, isInitialized, error, login, logout } = useAuth();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [loginLoading, setLoginLoading] = useState(false);
  const [localStorageState, setLocalStorageState] = useState<{ token: string | null; userData: string | null }>({ token: null, userData: null });
  const [supabaseSession, setSupabaseSession] = useState<unknown>(null);
  const [supabaseUser, setSupabaseUser] = useState<unknown>(null);

  useEffect(() => {
    const token = localStorage.getItem('supabase_auth_token');
    const userData = localStorage.getItem('supabase_user_data');
    setLocalStorageState({ token, userData });

    // Check Supabase session
    const checkSupabaseSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSupabaseSession(session);

        const { data: { user } } = await supabase.auth.getUser();
        setSupabaseUser(user);

      } catch (error) {
        console.error('Error checking Supabase session:', error);
      }
    };

    checkSupabaseSession();
  }, [isAuthenticated]); // Re-check when auth state changes

  const handleTestLogin = async () => {
    setLoginLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <>
      <Head>
        <title>Debug Auth | French Tutor AI</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Authentication Debug Page</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Auth Context State */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Auth Context State</h2>
            <div className="space-y-2">
              <div>
                <strong>isAuthenticated:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-sm ${isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {isAuthenticated ? 'true' : 'false'}
                </span>
              </div>
              <div>
                <strong>isLoading:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-sm ${isLoading ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                  {isLoading ? 'true' : 'false'}
                </span>
              </div>
              <div>
                <strong>isInitialized:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-sm ${isInitialized ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {isInitialized ? 'true' : 'false'}
                </span>
              </div>
              <div>
                <strong>error:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-sm ${error ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                  {error || 'null'}
                </span>
              </div>
              <div>
                <strong>user:</strong>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-x-auto">
                  {user ? JSON.stringify(user, null, 2) : 'null'}
                </pre>
              </div>
            </div>
          </div>

          {/* Local Storage State */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Local Storage State</h2>
            <div className="space-y-2">
              <div>
                <strong>Token:</strong>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-x-auto">
                  {localStorageState.token || 'null'}
                </pre>
              </div>
              <div>
                <strong>User Data:</strong>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-x-auto">
                  {localStorageState.userData || 'null'}
                </pre>
              </div>
            </div>
          </div>

          {/* Supabase Session State */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Supabase Session State</h2>
            <div className="space-y-2">
              <div>
                <strong>Session:</strong>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-x-auto">
                  {supabaseSession ? JSON.stringify(supabaseSession, null, 2) : 'null'}
                </pre>
              </div>
              <div>
                <strong>User (from getUser()):</strong>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-x-auto">
                  {supabaseUser ? JSON.stringify(supabaseUser, null, 2) : 'null'}
                </pre>
              </div>
            </div>
          </div>

          {/* Test Login */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Login</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={handleTestLogin}
                  isLoading={loginLoading}
                  disabled={loginLoading}
                >
                  Test Login
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  disabled={!isAuthenticated}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="space-y-2">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full"
              >
                Refresh Page
              </Button>
              <Button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                variant="outline"
                className="w-full"
              >
                Clear Storage & Refresh
              </Button>
              <Button
                onClick={() => window.open('/dashboard', '_blank')}
                variant="outline"
                className="w-full"
              >
                Open Dashboard (New Tab)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
