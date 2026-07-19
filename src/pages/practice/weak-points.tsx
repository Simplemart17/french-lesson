import { useState, useCallback } from 'react';
import Head from 'next/head';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import apiClient from '@/services/api/apiClient';
import { ApiResponse } from '@/types/api';

interface DrillExercise {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  area: string;
}

interface DrillData {
  level: string;
  weakAreas: string[];
  recentAccuracy: number | null;
  exercises: DrillExercise[];
}

export default function WeakPointsPage() {
  const [drill, setDrill] = useState<DrillData | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDrill = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAnswers({});
    setSubmitted(false);
    try {
      const response = await apiClient.post<ApiResponse<DrillData>>('/practice/weak-points', {});
      if (response.data?.success && response.data.data) {
        setDrill(response.data.data);
      } else {
        setError('Could not generate a drill. Please try again.');
      }
    } catch (err) {
      console.error('Error loading drill:', err);
      setError('Could not generate a drill. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = async () => {
    if (!drill || submitted) return;
    setSubmitted(true);

    const correct = drill.exercises.filter((ex, i) => answers[i] === ex.correctIndex).length;
    const score = Math.round((correct / drill.exercises.length) * 100);
    const primaryArea = drill.weakAreas[0] || 'grammar';

    try {
      await apiClient.put('/practice/weak-points', { area: primaryArea, score });
    } catch (err) {
      console.error('Error recording drill result:', err);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const correctCount = drill
    ? drill.exercises.filter((ex, i) => answers[i] === ex.correctIndex).length
    : 0;

  return (
    <ProtectedRoute>
      <Head>
        <title>Targeted Practice | French Tutor AI</title>
        <meta name="description" content="Drills generated from your weak areas" />
      </Head>

      <div className="max-w-3xl px-4 py-8 mx-auto">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">Targeted Practice</h1>
          <p className="text-gray-600">
            A short drill generated from the areas where you&apos;ve been scoring lowest.
          </p>
        </div>

        {/* Generation is a paid AI call, so it starts on explicit action, not on mount */}
        {!drill && !isLoading && !error && (
          <div className="p-8 text-center bg-white rounded-lg shadow-md">
            <p className="mb-4 text-gray-700">
              Ready? Your drill is generated fresh from your recent results.
            </p>
            <Button size="lg" onClick={loadDrill}>Build My Drill</Button>
          </div>
        )}

        {isLoading && <LoadingState message="Building your personalized drill..." size="large" />}

        {error && !isLoading && (
          <ErrorMessage message={error} type="error" retryAction={loadDrill} />
        )}

        {drill && !isLoading && !error && (
          <>
            <div className="p-4 mb-6 border border-indigo-100 rounded-lg bg-indigo-50">
              <p className="text-sm text-indigo-800">
                Focus: <span className="font-semibold">{drill.weakAreas.join(' + ')}</span> at level{' '}
                <span className="font-semibold">{drill.level}</span>
                {drill.recentAccuracy !== null && ` — tuned to your recent ${drill.recentAccuracy}% accuracy`}
              </p>
            </div>

            <div className="space-y-6">
              {drill.exercises.map((exercise, index) => (
                <div key={index} className="p-6 bg-white rounded-lg shadow-md">
                  <div className="flex items-start mb-3">
                    <span className="flex items-center justify-center flex-shrink-0 w-8 h-8 mr-3 text-sm font-bold text-white bg-indigo-600 rounded-full">
                      {index + 1}
                    </span>
                    <p className="text-lg font-medium text-gray-800">{exercise.question}</p>
                  </div>
                  <div className="ml-11 space-y-2">
                    {exercise.options.map((option, optionIndex) => {
                      const isSelected = answers[index] === optionIndex;
                      const isCorrect = submitted && optionIndex === exercise.correctIndex;
                      const isWrong = submitted && isSelected && optionIndex !== exercise.correctIndex;
                      return (
                        <button
                          key={optionIndex}
                          onClick={() => !submitted && setAnswers((prev) => ({ ...prev, [index]: optionIndex }))}
                          disabled={submitted}
                          className={`w-full p-3 text-left rounded-lg border transition-colors ${
                            isCorrect
                              ? 'border-green-500 bg-green-50 text-green-800'
                              : isWrong
                                ? 'border-red-500 bg-red-50 text-red-800'
                                : isSelected
                                  ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                                  : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                  {submitted && (
                    <p className="mt-3 text-sm text-gray-600 ml-11">{exercise.explanation}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-4 mt-8">
              {!submitted ? (
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={answeredCount < drill.exercises.length}
                >
                  {answeredCount < drill.exercises.length
                    ? `Answer all questions (${answeredCount}/${drill.exercises.length})`
                    : 'Check Answers'}
                </Button>
              ) : (
                <>
                  <p className="text-lg text-gray-700">
                    You got <span className="font-bold text-indigo-600">{correctCount}</span> of{' '}
                    <span className="font-bold">{drill.exercises.length}</span> correct.
                  </p>
                  <Button size="lg" onClick={loadDrill}>
                    Try Another Drill
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
