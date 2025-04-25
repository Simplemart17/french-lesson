import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface GrammarQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  rule?: string;
}

interface GrammarExerciseProps {
  title: string;
  description?: string;
  questions: GrammarQuestion[];
  grammarRule?: {
    title: string;
    explanation: string;
    examples: string[];
  };
  onComplete?: (score: number, answers: Record<string, string>) => void;
}

const GrammarExercise = ({
  title,
  description,
  questions,
  grammarRule,
  onComplete
}: GrammarExerciseProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showRule, setShowRule] = useState(false);
  const [score, setScore] = useState(0);
  
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
  const handleAnswerSelect = (answer: string) => {
    if (showExplanation) return;
    
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: answer
    });
  };
  
  const handleCheckAnswer = () => {
    setShowExplanation(true);
  };
  
  const handleNextQuestion = () => {
    setShowExplanation(false);
    
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate score
      let correctCount = 0;
      questions.forEach(question => {
        if (userAnswers[question.id] === question.correctAnswer) {
          correctCount++;
        }
      });
      
      const calculatedScore = Math.round((correctCount / totalQuestions) * 100);
      setScore(calculatedScore);
      setIsCompleted(true);
      
      if (onComplete) {
        onComplete(calculatedScore, userAnswers);
      }
    }
  };
  
  const isAnswerCorrect = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    return question && userAnswers[questionId] === question.correctAnswer;
  };
  
  const renderQuestion = () => (
    <div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-1 text-sm text-gray-600">
          <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary-600 h-2.5 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="mb-4 text-lg font-medium text-gray-800">{currentQuestion.text}</h3>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <div 
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                userAnswers[currentQuestion.id] === option
                  ? showExplanation
                    ? isAnswerCorrect(currentQuestion.id)
                      ? 'bg-green-50 border-green-300'
                      : 'bg-red-50 border-red-300'
                    : 'bg-primary-50 border-primary-300'
                  : showExplanation && option === currentQuestion.correctAnswer
                    ? 'bg-green-50 border-green-300'
                    : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border flex-shrink-0 mr-3 flex items-center justify-center ${
                  userAnswers[currentQuestion.id] === option
                    ? showExplanation
                      ? isAnswerCorrect(currentQuestion.id)
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-red-500 bg-red-500 text-white'
                      : 'border-primary-500 bg-primary-500 text-white'
                    : showExplanation && option === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300'
                }`}>
                  {userAnswers[currentQuestion.id] === option && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {showExplanation && option === currentQuestion.correctAnswer && userAnswers[currentQuestion.id] !== option && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span>{option}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {showExplanation && (
        <div className="p-4 mb-6 border border-blue-200 rounded-lg bg-blue-50">
          <h4 className="mb-2 font-medium text-blue-800">Explanation:</h4>
          <p className="mb-3 text-blue-700">{currentQuestion.explanation}</p>
          
          {currentQuestion.rule && (
            <div className="text-blue-700">
              <strong>Grammar Rule:</strong> {currentQuestion.rule}
            </div>
          )}
        </div>
      )}
      
      <div className="flex justify-between">
        {grammarRule && (
          <Button 
            variant="outline" 
            onClick={() => setShowRule(!showRule)}
          >
            {showRule ? 'Hide Grammar Rule' : 'Show Grammar Rule'}
          </Button>
        )}
        
        <div>
          {!showExplanation ? (
            <Button 
              onClick={handleCheckAnswer}
              disabled={!userAnswers[currentQuestion.id]}
            >
              Check Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'See Results'}
            </Button>
          )}
        </div>
      </div>
      
      {showRule && grammarRule && (
        <div className="p-4 mt-6 border border-gray-200 rounded-lg bg-gray-50">
          <h4 className="mb-2 font-medium text-gray-800">{grammarRule.title}</h4>
          <p className="mb-3 text-gray-700">{grammarRule.explanation}</p>
          
          {grammarRule.examples.length > 0 && (
            <div>
              <h5 className="mb-2 font-medium text-gray-700">Examples:</h5>
              <ul className="space-y-1 text-gray-600 list-disc list-inside">
                {grammarRule.examples.map((example, index) => (
                  <li key={index}>{example}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
  
  const renderResults = () => (
    <div className="py-6 text-center">
      <h3 className="mb-4 text-2xl font-semibold text-gray-800">Exercise Completed!</h3>
      
      <div className="mb-6">
        <div className={`inline-block px-4 py-2 rounded-lg text-lg font-medium ${
          score >= 80 
            ? 'bg-green-100 text-green-800' 
            : score >= 50 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          Your Score: {score}%
        </div>
      </div>
      
      <div className="mb-8">
        <p className="text-gray-600">
          {score >= 80 
            ? 'Excellent! You have a good understanding of this grammar concept.' 
            : score >= 50 
            ? 'Good effort! Review the explanations for the questions you missed.' 
            : 'Keep practicing! Review the grammar rules and try again.'}
        </p>
      </div>
      
      <div className="p-6 mb-8 text-left bg-white border border-gray-200 rounded-lg shadow-sm">
        <h4 className="mb-4 font-medium text-gray-800">Question Summary</h4>
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={question.id} className="flex items-start">
              <div className={`w-6 h-6 rounded-full flex-shrink-0 mr-3 flex items-center justify-center ${
                isAnswerCorrect(question.id)
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              }`}>
                {isAnswerCorrect(question.id) ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-800">Question {index + 1}: {question.text}</p>
                <div className="mt-1 text-sm">
                  <span className="text-gray-600">Your answer: </span>
                  <span className={isAnswerCorrect(question.id) ? 'text-green-600' : 'text-red-600'}>
                    {userAnswers[question.id] || 'No answer'}
                  </span>
                </div>
                {!isAnswerCorrect(question.id) && (
                  <div className="mt-1 text-sm">
                    <span className="text-gray-600">Correct answer: </span>
                    <span className="text-green-600">{question.correctAnswer}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {grammarRule && (
        <div className="p-6 mb-8 text-left border border-blue-200 rounded-lg bg-blue-50">
          <h4 className="mb-3 font-medium text-blue-800">{grammarRule.title}</h4>
          <p className="mb-4 text-blue-700">{grammarRule.explanation}</p>
          
          {grammarRule.examples.length > 0 && (
            <div>
              <h5 className="mb-2 font-medium text-blue-800">Examples:</h5>
              <ul className="space-y-1 text-blue-700 list-disc list-inside">
                {grammarRule.examples.map((example, index) => (
                  <li key={index}>{example}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      <Button onClick={() => window.location.reload()}>
        Try Another Exercise
      </Button>
    </div>
  );
  
  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <h2 className="mb-2 text-xl font-semibold text-gray-800">{title}</h2>
        {description && <p className="mb-6 text-gray-600">{description}</p>}
        
        {isCompleted ? renderResults() : renderQuestion()}
      </div>
    </Card>
  );
};

export default GrammarExercise;
