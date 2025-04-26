import '@/styles/globals.css';
import '@/styles/animations.css';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import Layout from '@/components/layout/Layout';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'sonner';

// Initialize Inter font
const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <main className={inter.className}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <Toaster position="top-right" richColors />
      </main>
    </AuthProvider>
  );
}