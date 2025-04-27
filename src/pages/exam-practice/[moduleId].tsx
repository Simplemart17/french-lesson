import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ExamModule, { ExamResults } from '@/components/exam/ExamModule';
import { ExamQuestionData, QuestionType } from '@/components/exam/ExamQuestion';
import { Button } from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { examService } from '@/services/index';

// Define the exam section type
type ExamSection = 'listening' | 'reading' | 'writing' | 'speaking';

interface ExamModuleData {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  section: ExamSection;
  difficulty?: 'easy' | 'medium' | 'hard'; // Make difficulty optional to match API response
  questions: ExamQuestionData[];
}

export default function ExamModulePage() {
  const router = useRouter();
  const { moduleId } = router.query;
  const [moduleData, setModuleData] = useState<ExamModuleData | null>(null);
  const [examResults, setExamResults] = useState<ExamResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExamModule() {
      if (moduleId && typeof moduleId === 'string') {
        setIsLoading(true);
        setError(null);

        try {
          // Fetch the exam module data from the API
          const data = await examService.getExamModule(moduleId);

          if (data) {
            // Convert the API response to match our ExamModuleData interface
            const convertedQuestions: ExamQuestionData[] = (data.questions || []).map(q => {
              // Map the API question type to the component's QuestionType
              let questionType: QuestionType = 'multiple-choice';
              if (q.type === 'text-input' || q.type === 'audio-response') {
                questionType = q.type;
              }

              return {
                id: q.id,
                type: questionType,
                text: q.text,
                options: q.options,
                correctAnswer: q.correctAnswer,
                audioUrl: q.audioUrl,
                imageUrl: q.imageUrl,
                explanation: q.explanation
              };
            });

            const moduleData: ExamModuleData = {
              id: data.id,
              title: data.title,
              description: data.description,
              duration: data.duration,
              section: data.section as ExamSection,
              questions: convertedQuestions,
              difficulty: (data.level === 'A1' || data.level === 'A2') ? 'easy' :
                          (data.level === 'B1' || data.level === 'B2') ? 'medium' : 'hard'
            };
            setModuleData(moduleData);
          } else {
            // Module not found, redirect to exam practice page
            router.push('/exam-practice');
          }
        } catch (err) {
          console.error('Error fetching exam module:', err);
          setError('Failed to load the exam module. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchExamModule();
  }, [moduleId, router]);

  const handleExamComplete = async (results: ExamResults) => {
    setExamResults(results);

    try {
      // Save the results to the database
      await examService.submitExamResults(results);
      console.log('Exam results saved successfully');
    } catch (err) {
      console.error('Error saving exam results:', err);
      // We don't show an error to the user here as they've already completed the exam
      // and we don't want to disrupt their experience
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingState message="Loading exam module..." size="large" />
      </div>
    );
  }

  if (error) {
    return (
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

        <ErrorMessage
          message={error}
          type="error"
          retryAction={() => router.reload()}
        />
      </div>
    );
  }

  if (!moduleData) {
    return (
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

        <div className="p-6 text-center bg-gray-100 rounded-lg">
          <h2 className="mb-2 text-xl font-semibold text-gray-800">Exam Module Not Found</h2>
          <p className="text-gray-600">The requested exam module could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{moduleData.title} | French Tutor AI</title>
        <meta name="description" content={moduleData.description} />
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

        {!examResults ? (
          <ExamModule
            moduleId={moduleData.id}
            title={moduleData.title}
            description={moduleData.description}
            section={moduleData.section}
            duration={moduleData.duration}
            questions={moduleData.questions}
            onComplete={handleExamComplete}
          />
        ) : (
          <div className="p-6 space-y-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800">Exam Results</h2>

            <div className="p-4 rounded-lg bg-indigo-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-medium text-gray-700">Your Score</p>
                  <p className="text-3xl font-bold text-indigo-600">{examResults.score}%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Completed on</p>
                  <p className="font-medium text-gray-800">
                    {new Date(examResults.completedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="mb-4 text-xl font-semibold text-gray-800">Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600">Total Questions</p>
                  <p className="text-xl font-bold text-gray-800">{examResults.totalQuestions}</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600">Time Spent</p>
                  <p className="text-xl font-bold text-gray-800">
                    {Math.floor(examResults.timeSpent / 60)} min {examResults.timeSpent % 60} sec
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button onClick={() => router.push('/exam-practice')}>
                Back to Exam Practice
              </Button>
              <Button onClick={() => setExamResults(null)}>
                Retry Exam
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}