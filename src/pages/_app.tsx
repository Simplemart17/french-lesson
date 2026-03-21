import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from 'sonner';
import { prefetchCommonData, prefetchPageData } from '@/utils/prefetch';


// AppContent component to use hooks inside the AuthProvider
function AppContent({ Component, pageProps }: AppProps) {
  const { isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();

  // Prefetch common data when the app initializes or user logs in
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      prefetchCommonData();
    }
  }, [isInitialized, isAuthenticated]);

  // Prefetch data for the next page when route changes
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // Extract page and params from URL
      const [path, queryString] = url.split('?');
      const params: Record<string, string> = {};

      if (queryString) {
        queryString.split('&').forEach(param => {
          const [key, value] = param.split('=');
          params[key] = decodeURIComponent(value);
        });
      }

      // Map URL path to page name
      let pageName = '';
      if (path === '/vocabulary') pageName = 'vocabulary';
      else if (path === '/lessons') pageName = 'lessons';
      else if (path.startsWith('/lessons/') && path.split('/').length === 3) {
        pageName = 'lesson-detail';
        params.id = path.split('/').pop() as string;
      }

      // Prefetch data if we have a recognized page
      if (pageName) {
        prefetchPageData(pageName, params);
      }
    };

    // Add route change event listener
    router.events.on('routeChangeStart', handleRouteChange);

    // Clean up event listener
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  return (
    <main>
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Toaster position="top-right" richColors />
    </main>
  );
}

export default function App(props: AppProps) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent {...props} />
      </ThemeProvider>
    </AuthProvider>
  );
}
