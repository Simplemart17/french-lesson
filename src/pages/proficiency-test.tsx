import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export default function ProficiencyTest() {
  const [currentStep, setCurrentStep] = useState<'intro' | 'test' | 'results'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<{
    level: 'beginner' | 'intermediate' | 'advanced';
    score: number;
    totalQuestions: number;
  } | null>(null);

  // Sample questions for the proficiency test
  const questions: Question[] = [
    {
      id: 1,
      text: "Comment allez-vous?",
      options: ["How old are you?", "How are you?", "Where are you going?", "What is your name?"],
      correctAnswer: 1,
      level: 'beginner'
    },
    {
      id: 2,
      text: "Je ___ étudiant.",
      options: ["suis", "es", "est", "sommes"],
      correctAnswer: 0,
      level: 'beginner'
    },
    {
      id: 3,
      text: "Hier, je ___ au cinéma.",
      options: ["vais", "allais", "suis allé", "irai"],
      correctAnswer: 2,
      level: 'intermediate'
    },
    {
      id: 4,
      text: "Si j'avais su, je ___ venu plus tôt.",
      options: ["serais", "suis", "étais", "avais"],
      correctAnswer: 0,
      level: 'advanced'
    },
    {
      id: 5,
      text: "Lequel de ces mots est un faux-ami en anglais?",
      options: ["Hôpital", "Actuel", "Famille", "Papier"],
      correctAnswer: 1,
      level: 'advanced'
    },
  ];

  const handleStartTest = () => {
    setCurrentStep('test');
  };

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);

    // Move to next question or show results if it's the last question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResults();
    }
  };

  const calculateResults = () => {
    let correctCount = 0;
    let beginnerCorrect = 0;
    let intermediateCorrect = 0;
    let advancedCorrect = 0;

    // Count correct answers by level
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++;
        if (question.level === 'beginner') beginnerCorrect++;
        if (question.level === 'intermediate') intermediateCorrect++;
        if (question.level === 'advanced') advancedCorrect++;
      }
    });

    // Determine level based on correct answers
    let level: 'beginner' | 'intermediate' | 'advanced' = 'beginner';

    const beginnerQuestions = questions.filter(q => q.level === 'beginner').length;
    const intermediateQuestions = questions.filter(q => q.level === 'intermediate').length;
    const advancedQuestions = questions.filter(q => q.level === 'advanced').length;

    // If they got most advanced questions right, they're advanced
    if (advancedCorrect / advancedQuestions >= 0.7) {
      level = 'advanced';
    }
    // If they got most intermediate questions right, they're at least intermediate
    else if (intermediateCorrect / intermediateQuestions >= 0.7) {
      level = 'intermediate';
    }
    // Use beginnerCorrect and beginnerQuestions for potential future logic
    else if (beginnerCorrect / beginnerQuestions >= 0.5) {
      level = 'beginner';
    }

    setResult({
      level,
      score: correctCount,
      totalQuestions: questions.length
    });

    setCurrentStep('results');
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-green-600';
      case 'intermediate': return 'text-yellow-600';
      case 'advanced': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const renderIntro = () => (
    <div className="max-w-2xl p-8 mx-auto bg-white rounded-lg shadow-md">
      <h1 className="mb-4 text-3xl font-bold text-gray-800">French Proficiency Test</h1>
      <p className="mb-6 text-lg text-gray-600">
        This quick 5-minute assessment will help determine your current French language level.
        Answer the following questions to the best of your ability.
      </p>
      
      <div className="p-4 mb-6 border rounded-lg bg-primary-50 border-primary-100">
        <h2 className="mb-2 text-lg font-semibold text-primary-800">What to expect:</h2>
        <ul className="space-y-1 list-disc list-inside text-primary-700">
          <li>5 questions of varying difficulty</li>
          <li>Multiple choice format</li>
          <li>No time limit (but try to answer naturally)</li>
          <li>Instant results and level assessment</li>
        </ul>
      </div>
      
      <Button size="lg" onClick={handleStartTest} className="w-full">
        Start Assessment
      </Button>
    </div>
  );

  const renderQuestion = () => {
    const question = questions[currentQuestionIndex];
    return (
      <div className="max-w-2xl p-8 mx-auto bg-white rounded-lg shadow-md">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${question.level === 'beginner' ? 'bg-green-100 text-green-800' : question.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
              {question.level.charAt(0).toUpperCase() + question.level.slice(1)}
            </span>
          </div>
          <h2 className="mb-6 text-xl font-bold text-gray-800">{question.text}</h2>
        </div>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelectAnswer(index)}
              className="w-full p-4 text-left transition-colors border border-gray-200 rounded-lg hover:bg-primary-50 hover:border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <span className="inline-block w-6 h-6 mr-3 text-sm font-medium text-center rounded-full bg-primary-100 text-primary-700">
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!result) return null;
    
    return (
      <div className="max-w-2xl p-8 mx-auto bg-white rounded-lg shadow-md">
        <div className="mb-8 text-center">
          <div className="inline-block p-4 mb-4 rounded-full bg-primary-100 text-primary-600">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-800">Assessment Complete!</h1>
          <p className="text-lg text-gray-600">
            Based on your answers, we&apos;ve determined your French level.
          </p>
        </div>
        
        <div className="p-6 mb-8 rounded-lg bg-gray-50">
          <div className="text-center">
            <h2 className="mb-2 text-xl font-semibold text-gray-700">Your French level is:</h2>
            <p className={`text-3xl font-bold mb-4 ${getLevelColor(result.level)}`}>
              {result.level.charAt(0).toUpperCase() + result.level.slice(1)}
            </p>
            <p className="mb-4 text-gray-600">
              You answered {result.score} out of {result.totalQuestions} questions correctly.
            </p>
          </div>
          
          <div className="pt-6 mt-6 border-t border-gray-200">
            <h3 className="mb-3 font-medium text-gray-700">What this means:</h3>
            {result.level === 'beginner' && (
              <p className="text-gray-600">
                You&apos;re at the beginning of your French journey. Focus on building basic vocabulary, simple grammar structures, and everyday phrases.
              </p>
            )}
            {result.level === 'intermediate' && (
              <p className="text-gray-600">
                You have a good foundation in French. Work on expanding your vocabulary, mastering more complex tenses, and improving your conversational skills.
              </p>
            )}
            {result.level === 'advanced' && (
              <p className="text-gray-600">
                You have an excellent command of French. Focus on nuances, idiomatic expressions, and cultural contexts to reach near-native fluency.
              </p>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href={`/lessons?level=${result.level}`} className="flex-1">
            <Button size="lg" className="w-full">
              Browse {result.level.charAt(0).toUpperCase() + result.level.slice(1)} Lessons
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button size="lg" variant="outline" className="w-full">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>French Proficiency Test | French Tutor AI</title>
        <meta name="description" content="Take our free French proficiency test to determine your level and get personalized learning recommendations" />
      </Head>

      <div className="container px-4 py-12 mx-auto">
        {currentStep === 'intro' && renderIntro()}
        {currentStep === 'test' && renderQuestion()}
        {currentStep === 'results' && renderResults()}
      </div>
    </>
  );
}