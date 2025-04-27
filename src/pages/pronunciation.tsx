import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import PronunciationPractice, { PronunciationResult } from '@/components/features/PronunciationPractice';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/services/api/apiClient';
import { API_ENDPOINTS } from '@/services/api/apiConfig';
import { PronunciationExercise, PronunciationExerciseListResponse } from '@/services/api/pronunciationApiService';

export default function PronunciationPage() {
  const { isAuthenticated } = useAuth();
  const [exercises, setExercises] = useState<PronunciationExercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<PronunciationExercise | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<PronunciationResult[]>([]);

  // Fetch pronunciation exercises from API
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get<PronunciationExerciseListResponse>(API_ENDPOINTS.PRONUNCIATION.EXERCISES);
        if (response.data) {
          setExercises(response.data.items);
          if (response.data.items.length > 0) {
            setSelectedExercise(response.data.items[0]);
          }
        } else {
          setError('Failed to load pronunciation exercises');
        }
      } catch (err) {
        console.error('Error fetching pronunciation exercises:', err);
        setError('Failed to load pronunciation exercises. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const handleResultUpdate = (result: PronunciationResult) => {
    setResults(prev => [...prev, result]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>French Pronunciation Practice</title>
        <meta name="description" content="Practice your French pronunciation with AI feedback" />
      </Head>

      <main className="container p-4 mx-auto max-w-7xl">
        <header className="py-8">
          <h1 className="mb-4 text-3xl font-bold text-center text-indigo-800">
            French Pronunciation Practice
          </h1>
          <p className="max-w-2xl mx-auto text-center text-gray-600">
            Improve your French pronunciation with these exercises. Listen to the audio,
            repeat the phrase, and get feedback on your pronunciation.
          </p>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-700">Loading exercises...</span>
          </div>
        ) : error ? (
          <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 mt-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {/* Exercise selection */}
            <div>
              <Card className="p-4">
                <h2 className="mb-4 text-xl font-semibold">Exercises</h2>

                <div className="space-y-2">
                  {exercises.map((exercise) => (
                    <button
                      key={exercise.id}
                      onClick={() => setSelectedExercise(exercise)}
                      className={`w-full px-4 py-3 text-left rounded-lg transition ${
                        selectedExercise?.id === exercise.id
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-medium">{exercise.title}</div>
                      <div className="text-sm text-gray-500">{exercise.description}</div>
                      <div className="mt-1 text-xs">
                        <span className={`px-2 py-1 rounded-full ${
                          exercise.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                          exercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                        </span>
                      </div>
                    </button>
                  ))}

                  {exercises.length === 0 && (
                    <div className="p-4 text-yellow-700 bg-yellow-100 rounded-lg">
                      No pronunciation exercises available. Please check back later.
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Practice area */}
            <div className="md:col-span-2">
              {selectedExercise ? (
                <div>
                  <Card className="p-6 mb-6">
                    <h2 className="mb-2 text-2xl font-bold">{selectedExercise.title}</h2>
                    <p className="mb-4 text-gray-600">{selectedExercise.description}</p>

                    <div className="p-2 text-sm text-indigo-800 rounded-lg bg-indigo-50">
                      <span className="font-medium">Difficulty:</span> {selectedExercise.difficulty}
                    </div>
                  </Card>

                  <div className="space-y-6">
                    {selectedExercise.phrases.map((phrase) => (
                      <div key={phrase.id}>
                        <PronunciationPractice
                          phrase={phrase.text}
                          translation={phrase.translation}
                          audioUrl={phrase.audioUrl}
                          onResult={handleResultUpdate}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : exercises.length > 0 ? (
                <div className="flex items-center justify-center h-full p-12 text-gray-500">
                  Please select an exercise from the list
                </div>
              ) : null}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
