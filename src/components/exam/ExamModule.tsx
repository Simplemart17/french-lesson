import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/Button';
import ExamQuestion, { ExamQuestionData, QuestionType } from './ExamQuestion';

interface ExamModuleProps {
  moduleId: string;
  title: string;
  description: string;
  section: 'listening' | 'reading' | 'writing' | 'speaking';
  duration: number; // in minutes
  questions: ExamQuestionData[];
  onComplete?: (results: ExamResults) => void;
}

export interface ExamResults {
  moduleId: string;
  score: number;
  totalQuestions: number;
  answers: (string | number)[];
  timeSpent: number; // in seconds
  completedAt: Date;
}

export default function ExamModule({
  moduleId,
  title,
  description,
  section,
  duration,
  questions,
  onComplete
}: ExamModuleProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'intro' | 'exam' | 'results'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | number | null)[]>(Array(questions.length).fill(null));
  const [timeRemaining, setTimeRemaining] = useState(duration * 60); // convert to seconds
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [results, setResults] = useState<ExamResults | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Timer effect
  useEffect(() => {
    if (currentStep !== 'exam' || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentStep, timeRemaining]);
  
  const handleStartExam = () => {
    setCurrentStep('exam');
    setStartTime(new Date());
  };
  
  const handleAnswer = (answer: string | number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowFeedback(false);
    } else {
      handleFinishExam();
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowFeedback(false);
    }
  };
  
  const handleFinishExam = () => {
    if (!startTime) return;
    
    const endTime = new Date();
    const timeSpent = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    
    // Calculate score
    let score = 0;
    questions.forEach((question, index) => {
      const userAnswer = answers[index];
      if (userAnswer !== null) {
        if (typeof question.correctAnswer === 'number') {
          if (userAnswer === question.correctAnswer) score++;
        } else if (typeof question.correctAnswer === 'string') {
          if (String(userAnswer).toLowerCase() === String(question.correctAnswer).toLowerCase()) score++;
        }
      }
    });
    
    const examResults: ExamResults = {
      moduleId,
      score,
      totalQuestions: questions.length,
      answers: answers.filter((a): a is string | number => a !== null),
      timeSpent,
      completedAt: endTime
    };
    
    setResults(examResults);
    setCurrentStep('results');
    
    if (onComplete) {
      onComplete(examResults);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const getSectionColor = (section: string) => {
    switch (section) {
      case 'listening': return 'bg-blue-100 text-blue-800';
      case 'reading': return 'bg-green-100 text-green-800';
      case 'writing': return 'bg-purple-100 text-purple-800';
      case 'speaking': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const renderIntro = () => (
    <div className="max-w-3xl p-8 mx-auto bg-white rounded-lg shadow-md">
      <h1 className="mb-4 text-3xl font-bold text-gray-800">{title}</h1>
      <p className="mb-6 text-lg text-gray-600">{description}</p>
      
      <div className="flex flex-wrap gap-3 mb-6">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSectionColor(section)}`}>
          {section.charAt(0).toUpperCase() + section.slice(1)}
        </span>
        
        <span className="px-3 py-1 text-sm font-medium text-gray-800 bg-gray-100 rounded-full">
          {duration} minutes
        </span>
        
        <span className="px-3 py-1 text-sm font-medium text-gray-800 bg-gray-100 rounded-full">
          {questions.length} questions
        </span>
      </div>
      
      <div className="p-4 mb-6 border rounded-lg bg-primary-50 border-primary-100">
        <h2 className="mb-2 text-lg font-semibold text-primary-800">Instructions:</h2>
        <ul className="space-y-1 list-disc list-inside text-primary-700">
          <li>You have {duration} minutes to complete this module</li>
          <li>Read each question carefully before answering</li>
          <li>You can navigate between questions using the previous and next buttons</li>
          <li>Your progress is saved as you go</li>
          <li>Submit your answers when you're finished</li>
        </ul>
      </div>
      
      <Button size="lg" onClick={handleStartExam} className="w-full">
        Start Exam Module
      </Button>
    </div>
  );
  
  const renderExam = () => (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between p-4 mb-6 bg-white rounded-lg shadow-md">
        <div>
          <span className="text-sm font-medium text-gray-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        <div className="flex items-center">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${timeRemaining < 60 ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-gray-100 text-gray-800'}`}>
            Time: {formatTime(timeRemaining)}
          </div>
          <button 
            onClick={() => setShowFeedback(!showFeedback)}
            className="ml-3 text-primary-600 hover:text-primary-800"
          >
            {showFeedback ? 'Hide Feedback' : 'Show Feedback'}
          </button>
        </div>
      </div>
      
      <ExamQuestion 
        question={questions[currentQuestionIndex]}
        onAnswer={handleAnswer}
        showFeedback={showFeedback}
        userAnswer={answers[currentQuestionIndex]}
      />
      
      <div className="flex justify-between mt-6">
        <Button 
          variant="secondary" 
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        
        <div className="flex gap-3">
          {currentQuestionIndex === questions.length - 1 ? (
            <Button onClick={handleFinishExam}>
              Finish Exam
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              Next Question
            </Button>
          )}
        </div>
      </div>
      
      <div className="mt-8">
        <div className="flex flex-wrap justify-center gap-2">
          {answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium flex items-center justify-center ${currentQuestionIndex === index
                ? 'bg-primary-600 text-white'
                : answer !== null
                  ? 'bg-primary-100 text-primary-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
  
  const renderResults = () => {
    if (!results) return null;
    
    const percentScore = Math.round((results.score / results.totalQuestions) * 100);
    
    return (
      <div className="max-w-3xl p-8 mx-auto bg-white rounded-lg shadow-md">
        <div className="mb-8 text-center">
          <div className="inline-block p-4 mb-4 rounded-full bg-primary-100 text-primary-600">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-800">Exam Complete!</h1>
          <p className="text-lg text-gray-600">
            You've completed the {title} module.
          </p>
        </div>
        
        <div className="p-6 mb-6 rounded-lg bg-primary-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Your Results</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${percentScore >= 70 ? 'bg-green-100 text-green-800' : percentScore >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
              {percentScore}%
            </span>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="p-4 bg-white rounded-md shadow-sm">
              <p className="mb-1 text-sm text-gray-500">Score</p>
              <p className="text-2xl font-bold text-gray-800">{results.score} / {results.totalQuestions}</p>
            </div>
            <div className="p-4 bg-white rounded-md shadow-sm">
              <p className="mb-1 text-sm text-gray-500">Time Spent</p>
              <p className="text-2xl font-bold text-gray-800">{Math.floor(results.timeSpent / 60)}m {results.timeSpent % 60}s</p>
            </div>
          </div>
        </div>
        
        <div className="mb-8 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Question Review</h3>
          
          {questions.map((question, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer !== null && 
              (typeof question.correctAnswer === 'number' ? 
                userAnswer === question.correctAnswer : 
                String(userAnswer).toLowerCase() === String(question.correctAnswer).toLowerCase());
            
            return (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-800">Question {index + 1}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                <p className="mb-2 text-gray-700">{question.text}</p>
                <div className="text-sm">
                  <p className="text-gray-500">Your answer: 
                    <span className="ml-1 font-medium">
                      {question.type === 'multiple-choice' && typeof userAnswer === 'number' && question.options 
                        ? question.options[userAnswer] 
                        : String(userAnswer)}
                    </span>
                  </p>
                  {!isCorrect && (
                    <p className="text-gray-500">Correct answer: 
                      <span className="ml-1 font-medium text-green-700">
                        {question.type === 'multiple-choice' && typeof question.correctAnswer === 'number' && question.options 
                          ? question.options[question.correctAnswer] 
                          : String(question.correctAnswer)}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button 
            variant="secondary" 
            onClick={() => router.push('/exam-practice')}
            className="flex-1"
          >
            Back to Exam Practice
          </Button>
          <Button 
            onClick={() => {
              setCurrentStep('intro');
              setCurrentQuestionIndex(0);
              setAnswers(Array(questions.length).fill(null));
              setTimeRemaining(duration * 60);
              setResults(null);
              setShowFeedback(false);
            }}
            className="flex-1"
          >
            Retry Module
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="py-8">
      {currentStep === 'intro' && renderIntro()}
      {currentStep === 'exam' && renderExam()}
      {currentStep === 'results' && renderResults()}
    </div>
  );
}