import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import ExamProgress from '@/components/exam/ExamProgress';
import { ExamResults } from '@/components/exam/ExamModule';
import examService from '@/services/examService';

export default function ExamProgressPage() {
  const router = useRouter();
  const [examType, setExamType] = useState<'tcf' | 'tef'>('tcf');
  const [results, setResults] = useState<ExamResults[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch exam results from the API
  useEffect(() => {
    const fetchExamResults = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const examResults = await examService.getExamResults();

        // If we have results, set them
        if (examResults && examResults.length > 0) {
          setResults(examResults);
        } else {
          // If no results, use some sample data for demonstration
          const sampleResults: ExamResults[] = [
            {
              moduleId: 'tcf-listening-1',
              score: 8,
              totalQuestions: 10,
              answers: [0, 1, 2, 0, 1, 2, 3, 0, 1, 2],
              timeSpent: 1140, // 19 minutes
              completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
            },
            {
              moduleId: 'tcf-reading-1',
              score: 7,
              totalQuestions: 10,
              answers: [0, 1, 2, 0, 1, 2, 3, 0, 1, 2],
              timeSpent: 1320, // 22 minutes
              completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
            },
            {
              moduleId: 'tef-listening-1',
              score: 6,
              totalQuestions: 10,
              answers: [0, 1, 2, 0, 1, 2, 3, 0, 1, 2],
              timeSpent: 1200, // 20 minutes
              completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
            },
          ];
          setResults(sampleResults);
        }
      } catch (err) {
        console.error('Error fetching exam results:', err);
        setError('Failed to load your exam results. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExamResults();
  }, []);

  const filteredResults = results.filter(result => result.moduleId.startsWith(examType));

  return (
    <>
      <Head>
        <title>Exam Progress | French Tutor AI</title>
        <meta name="description" content="Track your progress on TCF and TEF exam practice modules" />
      </Head>

      <div className="max-w-6xl px-4 py-8 mx-auto">
        <div className="mb-6">
          <Button
            variant="link"
            onClick={() => router.push('/exam-practice')}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Exam Practice
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">Your Exam Progress</h1>
          <p className="text-lg text-gray-600">
            Track your performance across different exam modules and identify areas for improvement.
          </p>
        </div>

        {/* Exam Type Selector */}
        <div className="p-6 mb-8 text-white rounded-lg shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600">
          <div className="flex flex-col justify-between md:flex-row md:items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="mb-2 text-2xl font-bold">Exam Progress Tracking</h2>
              <p className="opacity-90">View your progress and performance on practice modules</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setExamType('tcf')}
                className={`px-5 py-2 rounded-full font-medium transition-colors ${examType === 'tcf'
                  ? 'bg-white text-indigo-700'
                  : 'bg-white/20 hover:bg-white/30'}`}
              >
                TCF
              </button>
              <button
                onClick={() => setExamType('tef')}
                className={`px-5 py-2 rounded-full font-medium transition-colors ${examType === 'tef'
                  ? 'bg-white text-purple-700'
                  : 'bg-white/20 hover:bg-white/30'}`}
              >
                TEF
              </button>
            </div>
          </div>
        </div>

        {/* Progress Dashboard */}
        <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Completion Rate</h3>
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                    strokeDasharray="100, 100"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#4F46E5"
                    strokeWidth="3"
                    strokeDasharray={`${filteredResults.length * 12.5}, 100`}
                  />
                </svg>
                <div className="absolute text-center transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                  <div className="text-3xl font-bold text-gray-800">{filteredResults.length * 12.5}%</div>
                  <div className="text-sm text-gray-500">Completed</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Average Score</h3>
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600">
                  {filteredResults.length > 0
                    ? Math.round(filteredResults.reduce((sum, result) => sum + (result.score / result.totalQuestions * 100), 0) / filteredResults.length)
                    : 0}%
                </div>
                <div className="mt-2 text-sm text-gray-500">Across all modules</div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Time Spent</h3>
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600">
                  {filteredResults.length > 0
                    ? Math.round(filteredResults.reduce((sum, result) => sum + result.timeSpent, 0) / 60)
                    : 0}
                </div>
                <div className="mt-2 text-sm text-gray-500">Minutes of practice</div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="flex items-center justify-center p-12">
            <LoadingState message="Loading your exam results..." size="large" />
          </div>
        )}

        {error && !isLoading && (
          <div className="p-6 mb-8">
            <ErrorMessage
              message={error}
              type="error"
              retryAction={() => window.location.reload()}
            />
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* Detailed Progress */}
            <ExamProgress examType={examType} results={filteredResults} />

            {/* Recommendations */}
            <div className="p-6 mt-8 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">Recommended Next Steps</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="p-5 bg-white rounded-lg shadow-sm">
                  <div className="mb-3 text-blue-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-800">Practice Writing</h3>
                  <p className="mb-4 text-gray-600">Based on your performance, we recommend focusing on improving your writing skills.</p>
                  <Link href="/exam-practice/tcf-writing-1">
                    <Button variant="outline" className="w-full">Start Writing Practice</Button>
                  </Link>
                </div>
                <div className="p-5 bg-white rounded-lg shadow-sm">
                  <div className="mb-3 text-indigo-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-800">Improve Listening</h3>
                  <p className="mb-4 text-gray-600">Continue practicing your listening comprehension with more challenging exercises.</p>
                  <Link href="/exam-practice/tcf-listening-1">
                    <Button variant="outline" className="w-full">Start Listening Practice</Button>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}