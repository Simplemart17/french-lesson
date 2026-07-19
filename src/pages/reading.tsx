import { useState, useCallback, useEffect, useMemo } from 'react';
import Head from 'next/head';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import apiClient from '@/services/api/apiClient';
import { ApiResponse } from '@/types/api';

interface GlossaryEntry {
  french: string;
  english: string;
}

interface ReadingQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface ReadingPassage {
  level: string;
  title: string;
  passage: string;
  glossary: GlossaryEntry[];
  questions: ReadingQuestion[];
}

const normalizeWord = (word: string) =>
  word.toLowerCase().replace(/[.,;:!?«»"()]/g, '').trim();

export default function ReadingPage() {
  const [passage, setPassage] = useState<ReadingPassage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<GlossaryEntry | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const loadPassage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAnswers({});
    setSubmitted(false);
    setSelectedWord(null);
    try {
      const response = await apiClient.post<ApiResponse<ReadingPassage>>('/ai/reading-passage', {});
      if (response.data?.success && response.data.data) {
        setPassage(response.data.data);
      } else {
        setError('Could not generate a passage. Please try again.');
      }
    } catch (err) {
      console.error('Error loading passage:', err);
      setError('Could not generate a passage. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPassage();
  }, [loadPassage]);

  const glossaryMap = useMemo(() => {
    const map = new Map<string, GlossaryEntry>();
    for (const entry of passage?.glossary || []) {
      map.set(normalizeWord(entry.french), entry);
    }
    return map;
  }, [passage]);

  const handleWordClick = (word: string) => {
    const entry = glossaryMap.get(normalizeWord(word));
    setSelectedWord(entry || null);
  };

  const handleSubmit = async () => {
    if (!passage || submitted) return;
    setSubmitted(true);
    const correct = passage.questions.filter((q, i) => answers[i] === q.correctIndex).length;
    const score = Math.round((correct / passage.questions.length) * 100);
    try {
      await apiClient.put('/practice/weak-points', { area: 'reading', score });
    } catch (err) {
      console.error('Error recording reading result:', err);
    }
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <ProtectedRoute>
      <Head>
        <title>Reading | French Tutor AI</title>
        <meta name="description" content="Graded French reading with tap-to-translate" />
      </Head>

      <div className="max-w-3xl px-4 py-8 mx-auto">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">Graded Reading</h1>
          <p className="text-gray-600">
            A passage written for your level. Tap any word to check its meaning, then answer
            the comprehension questions.
          </p>
        </div>

        {isLoading && <LoadingState message="Writing a passage for your level..." size="large" />}
        {error && !isLoading && <ErrorMessage message={error} type="error" retryAction={loadPassage} />}

        {passage && !isLoading && !error && (
          <>
            <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">{passage.title}</h2>
                <span className="px-3 py-1 text-xs font-bold text-indigo-800 bg-indigo-100 rounded-full">
                  {passage.level}
                </span>
              </div>
              <p className="text-lg leading-relaxed text-gray-800">
                {passage.passage.split(/(\s+)/).map((token, index) =>
                  token.trim() ? (
                    <span
                      key={index}
                      onClick={() => handleWordClick(token)}
                      className={`cursor-pointer rounded px-0.5 hover:bg-yellow-100 ${
                        glossaryMap.has(normalizeWord(token)) ? 'underline decoration-dotted decoration-indigo-400' : ''
                      }`}
                    >
                      {token}
                    </span>
                  ) : (
                    token
                  )
                )}
              </p>
              {selectedWord && (
                <div className="p-3 mt-4 border border-yellow-200 rounded-lg bg-yellow-50">
                  <span className="font-medium text-gray-800">{selectedWord.french}</span>
                  {' — '}
                  <span className="text-gray-700">{selectedWord.english}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {passage.questions.map((question, index) => (
                <div key={index} className="p-5 bg-white rounded-lg shadow-md">
                  <p className="mb-3 font-medium text-gray-800">
                    {index + 1}. {question.question}
                  </p>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = answers[index] === optionIndex;
                      const isCorrect = submitted && optionIndex === question.correctIndex;
                      const isWrong = submitted && isSelected && optionIndex !== question.correctIndex;
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
                  {submitted && <p className="mt-2 text-sm text-gray-600">{question.explanation}</p>}
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              {!submitted ? (
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={answeredCount < passage.questions.length}
                >
                  {answeredCount < passage.questions.length
                    ? `Answer all questions (${answeredCount}/${passage.questions.length})`
                    : 'Check Answers'}
                </Button>
              ) : (
                <Button size="lg" onClick={loadPassage}>
                  Read Another Passage
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
