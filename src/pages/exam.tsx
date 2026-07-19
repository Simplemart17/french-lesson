import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import ExamSimulation, { ExamResult } from '@/components/features/ExamSimulation';
import examApiService from '@/services/api/examApiService';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

interface SimulationQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-in-blank' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  category: 'comprehension' | 'grammar' | 'vocabulary';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface ExamTypeCard {
  id: 'practice' | 'tcf' | 'tef';
  name: string;
  description: string;
  duration: number;
  questions: SimulationQuestion[];
}

interface ApiModuleSummary {
  id: string;
  title: string;
  description: string;
  duration: number;
  section: 'listening' | 'reading' | 'writing' | 'speaking';
  examType: 'tcf' | 'tef';
  level: string;
}

interface ApiModuleDetail extends ApiModuleSummary {
  questions?: ApiQuestion[];
}

interface ApiQuestion {
  id: string;
  type: string;
  text?: string;
  question?: string;
  options?: string[];
  correctAnswer?: string | string[];
  explanation?: string;
}

function mapDifficulty(level: string): 'beginner' | 'intermediate' | 'advanced' {
  if (level === 'A1' || level === 'A2') return 'beginner';
  if (level === 'B1' || level === 'B2') return 'intermediate';
  return 'advanced';
}

function mapCategory(section: ApiModuleSummary['section']): 'comprehension' | 'grammar' | 'vocabulary' {
  if (section === 'listening' || section === 'reading') return 'comprehension';
  if (section === 'writing') return 'grammar';
  return 'vocabulary';
}

function mapQuestion(module: ApiModuleSummary, question: ApiQuestion): SimulationQuestion {
  const rawType = (question.type || 'multiple-choice').toLowerCase();
  const normalizedType: SimulationQuestion['type'] =
    rawType === 'true-false' ? 'true-false' :
    rawType === 'fill-in-blank' ? 'fill-in-blank' :
    'multiple-choice';

  const text = question.question || question.text || '';
  const options = normalizedType === 'true-false'
    ? ['True', 'False']
    : (question.options || []);

  return {
    id: question.id,
    type: normalizedType,
    question: text,
    options,
    correctAnswer: question.correctAnswer || '',
    explanation: question.explanation || '',
    category: mapCategory(module.section),
    difficulty: mapDifficulty(module.level)
  };
}

export default function ExamPage() {
  const { isAuthenticated, user } = useAuth();
  const [selectedExamType, setSelectedExamType] = useState<string | null>(null);
  const [, setExamResults] = useState<ExamResult | null>(null);
  const [modules, setModules] = useState<ApiModuleDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadModules = async () => {
      setIsLoading(true);
      try {
        const listResp = await fetch('/api/exam/modules');
        const listJson = await listResp.json();
        const list: ApiModuleSummary[] = listJson?.success && Array.isArray(listJson.data) ? listJson.data : [];

        const detailPromises = list.map(async (item) => {
          const detailResp = await fetch(`/api/exam/modules?id=${encodeURIComponent(item.id)}`);
          const detailJson = await detailResp.json();
          if (detailJson?.success && detailJson.data) {
            return detailJson.data as ApiModuleDetail;
          }
          return { ...item, questions: [] } as ApiModuleDetail;
        });

        const details = await Promise.all(detailPromises);
        setModules(details);
      } catch {
        setModules([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadModules();
  }, []);

  const examTypes = useMemo<ExamTypeCard[]>(() => {
    const tcfModules = modules.filter((item) => item.examType === 'tcf');
    const tefModules = modules.filter((item) => item.examType === 'tef');

    const tcfQuestions = tcfModules.flatMap((module) =>
      (module.questions || []).map((question) => mapQuestion(module, question))
    );
    const tefQuestions = tefModules.flatMap((module) =>
      (module.questions || []).map((question) => mapQuestion(module, question))
    );

    const practiceQuestions = [...tcfQuestions, ...tefQuestions].slice(0, 10);

    return [
      {
        id: 'practice',
        name: 'Practice Exam',
        description: 'A short practice exam to help you prepare for TCF/TEF.',
        duration: 15,
        questions: practiceQuestions
      },
      {
        id: 'tcf',
        name: 'TCF Simulation',
        description: 'A TCF-style simulation based on your current content.',
        duration: 30,
        questions: tcfQuestions
      },
      {
        id: 'tef',
        name: 'TEF Simulation',
        description: 'A TEF-style simulation based on your current content.',
        duration: 30,
        questions: tefQuestions
      }
    ];
  }, [modules]);

  const selectedExam = examTypes.find((exam) => exam.id === selectedExamType);

  const handleExamComplete = async (results: ExamResult) => {
    setExamResults(results);

    // Persist one result row per section so per-section analytics work
    const examId = selectedExamType || 'practice';
    const learnerLevel = user?.level;
    const categoryEntries = Object.entries(results.categoryScores).filter(([, v]) => v.total > 0);
    const submissions = categoryEntries.length > 0
      ? categoryEntries.map(([category, v]) => ({
          examId,
          section: category,
          level: learnerLevel,
          score: Math.round((v.correct / v.total) * 100),
          maxScore: 100,
          timeSpent: results.timeSpent
        }))
      : [{
          examId,
          section: 'mixed',
          level: learnerLevel,
          score: results.totalQuestions > 0 ? Math.round((results.correctAnswers / results.totalQuestions) * 100) : 0,
          maxScore: 100,
          timeSpent: results.timeSpent
        }];

    const { failed, total } = await examApiService.submitSectionResults(submissions);
    if (failed > 0) {
      toast.error(
        failed === total
          ? 'Your exam results could not be saved. Check your connection and retake or contact support.'
          : `${failed} of ${total} section results could not be saved.`
      );
    }
  };

  return (
    <>
      <Head>
        <title>French Exam Preparation | French Tutor AI</title>
        <meta name="description" content="Prepare for TCF and TEF exams with practice tests and simulations" />
      </Head>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">French Exam Preparation</h1>
          <p className="text-lg text-gray-600">
            Practice for your TCF or TEF exam with interactive simulations.
          </p>
        </div>

        {isLoading ? (
          <div className="p-6 bg-white rounded-lg shadow-md">Loading exam modules...</div>
        ) : selectedExam ? (
          selectedExam.questions.length > 0 ? (
            <div className="mb-12">
              <ExamSimulation
                questions={selectedExam.questions}
                timeLimit={selectedExam.duration}
                onComplete={handleExamComplete}
                examType={selectedExam.id as 'TCF' | 'TEF' | 'practice'}
              />
            </div>
          ) : (
            <div className="p-6 mb-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-700">No questions are available yet for this exam type.</p>
              <div className="mt-4">
                <Button onClick={() => setSelectedExamType(null)}>Back</Button>
              </div>
            </div>
          )
        ) : (
          <>
            <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
              <h2 className="mb-6 text-xl font-semibold text-gray-800">Choose an Exam Type</h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {examTypes.map((examType) => (
                  <Card key={examType.id} className="h-full transition-shadow hover:shadow-lg">
                    <div className="flex flex-col h-full p-6">
                      <div className="mb-4">
                        <h3 className="mb-2 text-xl font-semibold text-gray-800">{examType.name}</h3>
                        <p className="text-gray-600">{examType.description}</p>
                      </div>

                      <div className="flex flex-col flex-grow mt-4 space-y-3">
                        <div className="flex items-center">
                          <span className="text-gray-700">{examType.duration} minutes</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-700">{examType.questions.length} questions</span>
                        </div>
                      </div>

                      <div className="mt-6">
                        <Button
                          onClick={() => setSelectedExamType(examType.id)}
                          className="w-full"
                          disabled={examType.questions.length === 0}
                        >
                          Start Exam
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {!isAuthenticated && (
              <div className="p-6 mb-8 border rounded-lg bg-primary-50 border-primary-100">
                <div className="items-center md:flex">
                  <div className="md:w-3/4">
                    <h3 className="mb-2 text-xl font-semibold text-primary-800">Create an Account to Track Your Progress</h3>
                    <p className="mb-4 text-primary-700 md:mb-0">
                      Sign up to save your exam results and get personalized study recommendations.
                    </p>
                  </div>
                  <div className="flex justify-end md:w-1/4">
                    <Button
                      variant="default"
                      onClick={() => window.location.href = '/register'}
                    >
                      Create Free Account
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
