import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';

interface ExamQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-in-blank' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  category: 'listening' | 'reading' | 'writing' | 'speaking' | 'comprehension' | 'grammar' | 'vocabulary';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface ExamSimulationProps {
  questions: ExamQuestion[];
  timeLimit?: number; // in minutes
  onComplete?: (results: ExamResult) => void;
  examType?: 'TCF' | 'TEF' | 'practice';
}

export interface ExamResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
  answeredQuestions: {
    questionId: string;
    userAnswer: string | string[];
    isCorrect: boolean;
  }[];
  categoryScores: Record<string, { correct: number; total: number }>;
}

const ExamSimulation: React.FC<ExamSimulationProps> = ({
  questions,
  timeLimit = 30,
  onComplete,
  examType = 'practice'
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string | string[]>>({});
  const [isExamCompleted, setIsExamCompleted] = useState(false);
  const [examResults, setExamResults] = useState<ExamResult | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60); // convert to seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [examStartTime, setExamStartTime] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Complete the exam
  const handleExamComplete = useCallback(() => {
    setIsTimerRunning(false);
    setIsExamCompleted(true);

    // Calculate results
    const timeSpent = examStartTime ? Math.floor((Date.now() - examStartTime) / 1000) : timeLimit * 60 - timeRemaining;

    const answeredQuestions = questions.map(question => {
      const userAnswer = userAnswers[question.id] || '';
      const isCorrect = Array.isArray(question.correctAnswer)
        ? Array.isArray(userAnswer) && question.correctAnswer.every(ans => userAnswer.includes(ans))
        : userAnswer === question.correctAnswer;

      return {
        questionId: question.id,
        userAnswer,
        isCorrect
      };
    });

    const correctAnswers = answeredQuestions.filter(q => q.isCorrect).length;
    const score = Math.round((correctAnswers / questions.length) * 100);

    // Calculate category scores
    const categoryScores: Record<string, { correct: number; total: number }> = {};
    questions.forEach((question, index) => {
      const category = question.category;
      if (!categoryScores[category]) {
        categoryScores[category] = { correct: 0, total: 0 };
      }

      categoryScores[category].total += 1;
      if (answeredQuestions[index].isCorrect) {
        categoryScores[category].correct += 1;
      }
    });

    const results: ExamResult = {
      score,
      totalQuestions: questions.length,
      correctAnswers,
      timeSpent,
      answeredQuestions,
      categoryScores
    };

    setExamResults(results);

    if (onComplete) {
      onComplete(results);
    }
  }, [questions, userAnswers, timeLimit, timeRemaining, examStartTime, onComplete]);

  // Start timer when component mounts
  useEffect(() => {
    if (isTimerRunning && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleExamComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isTimerRunning, timeRemaining, handleExamComplete]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Start the exam
  const startExam = () => {
    setIsTimerRunning(true);
    setExamStartTime(Date.now());
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId: string, answer: string | string[]) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Navigate to next question
  const handleNextQuestion = () => {
    setShowExplanation(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleExamComplete();
    }
  };

  // Navigate to previous question
  const handlePrevQuestion = () => {
    setShowExplanation(false);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };



  // Restart the exam
  const handleRestartExam = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setIsExamCompleted(false);
    setExamResults(null);
    setTimeRemaining(timeLimit * 60);
    setIsTimerRunning(false);
    setExamStartTime(null);
    setShowExplanation(false);
  };

  // Get current question
  const currentQuestion = questions[currentQuestionIndex];

  // If exam not started yet, show start screen
  if (!isTimerRunning && !isExamCompleted && examStartTime === null) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-center text-gray-800">
          {examType === 'TCF' ? 'TCF Exam Simulation' : 
           examType === 'TEF' ? 'TEF Exam Simulation' : 
           'French Exam Practice'}
        </h2>
        
        <div className="mb-6 text-center">
          <p className="mb-2 text-gray-600">
            This exam contains {questions.length} questions and has a time limit of {timeLimit} minutes.
          </p>
          <p className="text-gray-600">
            Make sure you&apos;re in a quiet environment and ready to focus before starting.
          </p>
        </div>
        
        <div className="p-4 mb-6 border rounded-lg bg-blue-50 border-blue-200">
          <h3 className="mb-2 font-medium text-blue-800">Exam Instructions:</h3>
          <ul className="pl-5 space-y-1 text-blue-700 list-disc">
            <li>Read each question carefully before answering</li>
            <li>You can navigate between questions using the Previous and Next buttons</li>
            <li>Your answers are saved automatically as you progress</li>
            <li>The timer will show your remaining time</li>
            <li>The exam will automatically submit when time runs out</li>
          </ul>
        </div>
        
        <div className="flex justify-center">
          <Button onClick={startExam} size="lg">
            Start Exam
          </Button>
        </div>
      </div>
    );
  }

  // If exam completed, show results
  if (isExamCompleted && examResults) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-6 text-xl font-semibold text-center text-gray-800">
          Exam Results
        </h2>
        
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-32 h-32 mb-4 text-3xl font-bold text-white bg-primary-600 rounded-full">
            {examResults.score}%
          </div>
          <p className="text-gray-600">
            You answered {examResults.correctAnswers} out of {examResults.totalQuestions} questions correctly.
          </p>
          <p className="text-gray-600">
            Time spent: {Math.floor(examResults.timeSpent / 60)}:{(examResults.timeSpent % 60).toString().padStart(2, '0')}
          </p>
        </div>
        
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-medium text-gray-800">Performance by Category:</h3>
          <div className="space-y-4">
            {Object.entries(examResults.categoryScores).map(([category, scores]) => {
              const percentage = Math.round((scores.correct / scores.total) * 100);
              return (
                <div key={category} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </h4>
                    <span className="font-medium text-gray-700">
                      {scores.correct}/{scores.total} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-2 rounded-full ${
                        percentage >= 80 ? 'bg-green-500' : 
                        percentage >= 60 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-medium text-gray-800">Question Review:</h3>
          <div className="space-y-6">
            {questions.map((question, index) => {
              const userAnswer = userAnswers[question.id] || '';
              const isCorrect = Array.isArray(question.correctAnswer)
                ? Array.isArray(userAnswer) && question.correctAnswer.every(ans => userAnswer.includes(ans))
                : userAnswer === question.correctAnswer;
              
              return (
                <div 
                  key={question.id} 
                  className={`p-4 border rounded-lg ${
                    isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <div className="flex items-center justify-center w-6 h-6 text-sm font-medium text-white rounded-full bg-gray-700">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <p className="mb-2 font-medium text-gray-800">{question.question}</p>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-700">
                          Your answer: <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                            {Array.isArray(userAnswer) ? userAnswer.join(', ') : userAnswer || '(No answer)'}
                          </span>
                        </p>
                        <p className="text-sm text-green-700">
                          Correct answer: {Array.isArray(question.correctAnswer) ? question.correctAnswer.join(', ') : question.correctAnswer}
                        </p>
                      </div>
                      
                      <p className="text-sm text-gray-600">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button onClick={handleRestartExam}>
            Restart Exam
          </Button>
        </div>
      </div>
    );
  }

  // Render the current question
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-sm font-medium text-gray-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        <div className={`px-3 py-1 text-sm font-medium rounded-full ${
          timeRemaining < 60 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
        }`}>
          Time: {formatTime(timeRemaining)}
        </div>
      </div>
      
      <div className="h-2 mb-6 bg-gray-200 rounded-full">
        <div 
          className="h-2 bg-primary-600 rounded-full"
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0 mr-3">
            <div className={`flex items-center justify-center w-6 h-6 text-sm font-medium text-white rounded-full ${
              currentQuestion.difficulty === 'beginner' ? 'bg-green-600' :
              currentQuestion.difficulty === 'intermediate' ? 'bg-yellow-600' :
              'bg-red-600'
            }`}>
              {currentQuestionIndex + 1}
            </div>
          </div>
          <div>
            <p className="font-medium text-gray-800">{currentQuestion.question}</p>
            <div className="mt-1 text-xs text-gray-500">
              Category: {currentQuestion.category.charAt(0).toUpperCase() + currentQuestion.category.slice(1)} | 
              Difficulty: {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
            </div>
          </div>
        </div>
        
        {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
          <div className="space-y-3 ml-9">
            {currentQuestion.options.map((option, optionIndex) => (
              <div 
                key={optionIndex}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  userAnswers[currentQuestion.id] === option
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }`}
                onClick={() => handleAnswerSelect(currentQuestion.id, option)}
              >
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-5 h-5 mr-3 border rounded-full ${
                    userAnswers[currentQuestion.id] === option
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-300'
                  }`}>
                    {userAnswers[currentQuestion.id] === option && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-gray-800">{option}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {currentQuestion.type === 'fill-in-blank' && (
          <div className="ml-9">
            <input
              type="text"
              value={userAnswers[currentQuestion.id] as string || ''}
              onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Your answer..."
            />
          </div>
        )}
        
        {currentQuestion.type === 'true-false' && (
          <div className="flex space-x-4 ml-9">
            <div 
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                userAnswers[currentQuestion.id] === 'True'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
              }`}
              onClick={() => handleAnswerSelect(currentQuestion.id, 'True')}
            >
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-5 h-5 mr-3 border rounded-full ${
                  userAnswers[currentQuestion.id] === 'True'
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300'
                }`}>
                  {userAnswers[currentQuestion.id] === 'True' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-gray-800">True</span>
              </div>
            </div>
            
            <div 
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                userAnswers[currentQuestion.id] === 'False'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
              }`}
              onClick={() => handleAnswerSelect(currentQuestion.id, 'False')}
            >
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-5 h-5 mr-3 border rounded-full ${
                  userAnswers[currentQuestion.id] === 'False'
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300'
                }`}>
                  {userAnswers[currentQuestion.id] === 'False' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-gray-800">False</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {showExplanation && (
        <div className="p-4 mb-6 border rounded-lg bg-blue-50 border-blue-200">
          <h3 className="mb-2 font-medium text-blue-800">Explanation:</h3>
          <p className="text-blue-700">{currentQuestion.explanation}</p>
        </div>
      )}
      
      <div className="flex justify-between">
        <Button 
          variant="outline"
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline"
            onClick={() => setShowExplanation(!showExplanation)}
          >
            {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
          </Button>
          
          {currentQuestionIndex < questions.length - 1 ? (
            <Button onClick={handleNextQuestion}>
              Next
            </Button>
          ) : (
            <Button onClick={handleExamComplete}>
              Finish Exam
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamSimulation;
