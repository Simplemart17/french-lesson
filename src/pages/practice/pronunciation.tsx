import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import AdvancedPronunciationPractice from '@/components/features/AdvancedPronunciationPractice';
import { Card } from '@/components/ui/Card';
// Define the response type based on what we're using
interface PronunciationResponse {
  transcript?: string;
  expected?: string;
  similarity?: number;
  feedback: {
    overallScore: number;
    wordScores: Array<{ word: string; score: number; feedback: string }>;
    problemSounds: Array<{ sound: string; description: string }>;
    recommendations: string[];
  };
}
import apiClient from '@/services/api/apiClient';
import { API_ENDPOINTS } from '@/services/api/apiConfig';
import { PronunciationPhrase, PronunciationExercise, PronunciationExerciseListResponse } from '@/services/api/pronunciationApiService';

interface ApiResponseData {
  success: boolean;
  data?: PronunciationExerciseListResponse;
  error?: {
    message: string;
  };
}

const PronunciationPracticePage: NextPage = () => {
  const [practiceResults, setPracticeResults] = useState<PronunciationResponse[]>([]);
  const [phrases, setPhrases] = useState<PronunciationPhrase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch pronunciation phrases from API
  useEffect(() => {
    const fetchPhrases = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get<ApiResponseData>(API_ENDPOINTS.PRONUNCIATION.EXERCISES);

        if (response.data.success && response.data.data) {
          // Extract phrases from exercises
          const allPhrases = response.data.data.items.flatMap((exercise: PronunciationExercise) => exercise.phrases || []);
          setPhrases(allPhrases);
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

    fetchPhrases();
  }, []);

  const handlePracticeResult = (result: PronunciationResponse) => {
    setPracticeResults(prev => [...prev, result]);
  };

  return (
    <>
      <Head>
        <title>Pronunciation Practice - French Learning</title>
        <meta name="description" content="Practice your French pronunciation with AI feedback" />
      </Head>

      <Layout>
        <div className="container px-4 py-8 mx-auto">
          <h1 className="mb-6 text-3xl font-bold">Pronunciation Practice</h1>

          <div className="mb-8">
            <p className="text-gray-600">
              Practice pronouncing these French phrases. Our AI will analyze your pronunciation and provide feedback.
              Record yourself saying each phrase, then click "Analyze Pronunciation" to see how you did.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="w-12 h-12 border-t-2 border-b-2 rounded-full border-primary-500 animate-spin"></div>
              <span className="ml-3 text-gray-700">Loading phrases...</span>
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
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                {phrases.length > 0 ? (
                  phrases.map((phrase) => (
                    <div key={phrase.id}>
                      <AdvancedPronunciationPractice
                        phrase={phrase.text}
                        translation={phrase.translation}
                        onResult={handlePracticeResult}
                        audioUrl={phrase.audioUrl}
                      />
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-yellow-700 bg-yellow-100 rounded-lg">
                    No pronunciation phrases available. Please check back later.
                  </div>
                )}
              </div>

              <div>
                <Card className="sticky p-6 top-6">
                  <h2 className="mb-4 text-xl font-semibold">Progress</h2>

                  {practiceResults.length === 0 ? (
                    <p className="text-gray-500">No practice data yet. Complete some exercises to see your progress.</p>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-gray-50">
                        <h3 className="mb-2 text-lg font-medium">Overall Score</h3>
                        <div className="flex items-center justify-between mb-2">
                          <span>Average</span>
                          <span className="font-medium">
                            {Math.round(
                              practiceResults.reduce((acc, curr) => acc + curr.feedback.overallScore, 0) /
                              practiceResults.length
                            )}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 rounded-full bg-primary-500"
                            style={{
                              width: `${
                                Math.round(
                                  practiceResults.reduce((acc, curr) => acc + curr.feedback.overallScore, 0) /
                                  practiceResults.length
                                )
                              }%`
                            }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-2 text-lg font-medium">Recent Practice</h3>
                        <div className="space-y-2">
                          {practiceResults.slice(-3).reverse().map((result, index) => (
                            <div key={index} className="p-3 border border-gray-200 rounded-lg">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">{result.expected}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  result.feedback.overallScore >= 80 ? 'bg-green-100 text-green-800' :
                                  result.feedback.overallScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {result.feedback.overallScore}%
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">{result.transcript}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {practiceResults.length > 0 && (
                        <div>
                          <h3 className="mb-2 text-lg font-medium">Common Issues</h3>
                          {/* Collect unique problem sounds across all results */}
                          {Array.from(
                            new Set(
                              practiceResults
                                .flatMap(r => r.feedback.problemSounds)
                                .map(s => s.sound)
                            )
                          ).slice(0, 3).map((sound, index) => {
                            // Find the first description for this sound
                            const description = practiceResults
                              .flatMap(r => r.feedback.problemSounds)
                              .find(s => s.sound === sound)?.description;

                            return (
                              <div key={index} className="p-2 mb-2 border border-yellow-100 rounded bg-yellow-50">
                                <span className="px-1.5 py-0.5 mr-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                                  {sound}
                                </span>
                                <span className="text-sm text-yellow-800">{description}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default PronunciationPracticePage;