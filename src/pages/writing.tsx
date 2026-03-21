import Head from 'next/head';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import WritingCorrection from '@/components/features/WritingCorrection';
import { Card } from '@/components/ui/Card';

export default function WritingPage() {
  return (
    <ProtectedRoute>
      <Head>
        <title>Writing Practice | French Tutor AI</title>
        <meta name="description" content="Practice your French writing skills with AI-powered corrections" />
      </Head>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">Writing Practice</h1>
          <p className="text-lg text-gray-600">
            Improve your French writing skills with instant AI-powered feedback. Write in French and our system will provide corrections and explanations.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <Card title="Grammar" variant="primary" className="px-5 pt-5 pb-0">
            <p className='text-gray-300'>Our AI checks your grammar, including verb conjugations, gender agreement, and sentence structure.</p>
          </Card>
          
          <Card title="Vocabulary" variant="secondary" className="px-5 pt-5 pb-0">
            <p className='text-gray-300'>Get suggestions for more natural word choices and idiomatic expressions.</p>
          </Card>
          
          <Card title="Style" variant="success" className="px-5 pt-5 pb-0">
            <p className='text-gray-900'>Receive feedback on your writing style and formality level appropriate to different contexts.</p>
          </Card>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Try It Now</h2>
          <WritingCorrection />
        </div>
      </div>
    </ProtectedRoute>
  );
}