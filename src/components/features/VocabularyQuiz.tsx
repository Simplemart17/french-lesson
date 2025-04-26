import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { VocabularyWord } from './SpacedRepetition';

interface VocabularyQuizProps {
  words: VocabularyWord[];
  onComplete: (results: QuizResult[]) => void;
  questionsCount?: number;
}

export interface QuizResult {
  word: VocabularyWord;
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
}

type QuizQuestion = {
  word: VocabularyWord;
  options: string[];
  correctIndex: number;
};

const VocabularyQuiz: React.FC<VocabularyQuizProps> = ({
  words,
  onComplete,
  questionsCount = 10
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Generate quiz questions
  useEffect(() => {
    if (words.length < 4) return; // Need at least 4 words for options

    // Shuffle words and take the first questionsCount
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    const quizWords = shuffledWords.slice(0, Math.min(questionsCount, words.length));
    
    // Create questions
    const generatedQuestions = quizWords.map(word => {
      // Get 3 random incorrect options
      const incorrectOptions = shuffledWords
        .filter(w => w.id !== word.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.translation);
      
      // Insert correct answer at random position
      const correctIndex = Math.floor(Math.random() * 4);
      const options = [...incorrectOptions];
      options.splice(correctIndex, 0, word.translation);
      
      return {
        word,
        options,
        correctIndex
      };
    });
    
    setQuestions(generatedQuestions);
  }, [words, questionsCount]);

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    
    setSelectedOption(index);
    setIsAnswered(true);
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = index === currentQuestion.correctIndex;
    
    // Add result
    const result: QuizResult = {
      word: currentQuestion.word,
      isCorrect,
      userAnswer: currentQuestion.options[index],
      correctAnswer: currentQuestion.options[currentQuestion.correctIndex]
    };
    
    setResults([...results, result]);
    
    if (isCorrect) {
      setQuizScore(quizScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
      onComplete(results);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setResults([]);
    setQuizCompleted(false);
    setQuizScore(0);
    
    // Regenerate questions
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    const quizWords = shuffledWords.slice(0, Math.min(questionsCount, words.length));
    
    const generatedQuestions = quizWords.map(word => {
      const incorrectOptions = shuffledWords
        .filter(w => w.id !== word.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.translation);
      
      const correctIndex = Math.floor(Math.random() * 4);
      const options = [...incorrectOptions];
      options.splice(correctIndex, 0, word.translation);
      
      return {
        word,
        options,
        correctIndex
      };
    });
    
    setQuestions(generatedQuestions);
  };

  if (questions.length === 0) {
    return (
      <div className="p-6 text-center bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Not Enough Vocabulary Words
        </h2>
        <p className="mb-6 text-gray-600">
          You need at least 4 vocabulary words to take a quiz. Please add more words to your vocabulary.
        </p>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-center text-gray-800">
          Quiz Completed!
        </h2>
        <div className="mb-6 text-center">
          <div className="mb-2 text-4xl font-bold text-primary-600">
            {quizScore} / {questions.length}
          </div>
          <div className="text-gray-600">
            {quizScore === questions.length
              ? 'Perfect score! Excellent work!'
              : quizScore >= questions.length * 0.8
              ? 'Great job! Keep practicing!'
              : quizScore >= questions.length * 0.6
              ? 'Good effort! Review the words you missed.'
              : 'Keep practicing! Review the words you missed.'}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-medium text-gray-800">Results:</h3>
          <div className="space-y-3">
            {results.map((result, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg ${
                  result.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="flex justify-between">
                  <div className="font-medium">{result.word.word}</div>
                  <div className={result.isCorrect ? 'text-green-600' : 'text-red-600'}>
                    {result.isCorrect ? 'Correct' : 'Incorrect'}
                  </div>
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  {!result.isCorrect && (
                    <>
                      Your answer: <span className="text-red-600">{result.userAnswer}</span><br />
                      Correct answer: <span className="text-green-600">{result.correctAnswer}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button onClick={handleRestartQuiz}>
            Take Another Quiz
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Vocabulary Quiz
          </h2>
          <div className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
        
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-primary-600 rounded-full"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="mb-6 text-2xl font-bold text-center text-gray-800">
          {currentQuestion.word.word}
        </h3>
        <p className="mb-4 text-center text-gray-600">
          Select the correct translation:
        </p>
        
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              disabled={isAnswered}
              className={`p-4 text-left border rounded-lg transition-colors ${
                isAnswered
                  ? index === currentQuestion.correctIndex
                    ? 'bg-green-50 border-green-300 text-green-800'
                    : index === selectedOption
                    ? 'bg-red-50 border-red-300 text-red-800'
                    : 'bg-white border-gray-200 text-gray-500'
                  : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-800'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button
          onClick={handleNextQuestion}
          disabled={!isAnswered}
          className={!isAnswered ? 'opacity-50 cursor-not-allowed' : ''}
        >
          {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </Button>
      </div>
    </div>
  );
};

export default VocabularyQuiz;
