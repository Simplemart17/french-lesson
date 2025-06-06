import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

export type QuestionType = 'multiple-choice' | 'text-input' | 'audio-response';

export interface ExamQuestionData {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer?: number | string;
  audioUrl?: string;
  imageUrl?: string;
  explanation?: string;
}

interface ExamQuestionProps {
  question: ExamQuestionData;
  onAnswer: (answer: string | number) => void;
  showFeedback?: boolean;
  userAnswer?: string | number | null;
}

export default function ExamQuestion({ 
  question, 
  onAnswer, 
  showFeedback = false,
  userAnswer = null 
}: ExamQuestionProps) {
  const [textInput, setTextInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handleSubmitTextAnswer = () => {
    if (textInput.trim()) {
      onAnswer(textInput);
    }
  };
  
  const isCorrect = userAnswer !== null && 
    (typeof question.correctAnswer === 'number' ? 
      userAnswer === question.correctAnswer : 
      String(userAnswer).toLowerCase() === String(question.correctAnswer).toLowerCase());
  
  const renderAudioPlayer = () => {
    if (!question.audioUrl) return null;
    
    return (
      <div className="mb-4">
        <div className="flex items-center justify-center p-4 border border-indigo-100 rounded-lg bg-indigo-50">
          <button 
            className="p-3 text-white transition-colors bg-indigo-600 rounded-full hover:bg-indigo-700"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isPlaying ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              )}
            </svg>
          </button>
          <div className="ml-4 text-indigo-800">
            <p className="font-medium">Audio Exercise</p>
            <p className="text-sm">{isPlaying ? 'Playing audio...' : 'Click to play audio'}</p>
          </div>
        </div>
      </div>
    );
  };
  
  const renderQuestionContent = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => onAnswer(index)}
                disabled={showFeedback}
                className={`w-full text-left p-4 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${showFeedback && userAnswer === index
                  ? isCorrect
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                  : showFeedback && question.correctAnswer === index
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : userAnswer === index
                      ? 'bg-primary-50 border-primary-200'
                      : 'border-gray-200 hover:bg-primary-50 hover:border-primary-200'
                }`}
              >
                <span className="inline-block w-6 h-6 mr-3 text-sm font-medium text-center rounded-full bg-primary-100 text-primary-700">
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
                {showFeedback && userAnswer === index && (
                  <span className="ml-2">
                    {isCorrect ? (
                      <svg className="inline-block w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="inline-block w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </span>
                )}
              </button>
            ))}
          </div>
        );
        
      case 'text-input':
        return (
          <div>
            <textarea 
              className={`w-full h-24 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${showFeedback
                ? isCorrect
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
                : 'border-gray-300'
              }`}
              placeholder="Write your response here..."
              value={typeof userAnswer === 'string' ? userAnswer : textInput}
              onChange={(e) => setTextInput(e.target.value)}
              disabled={showFeedback}
            />
            {!showFeedback && (
              <div className="mt-3 text-right">
                <Button onClick={handleSubmitTextAnswer}>Submit Answer</Button>
              </div>
            )}
          </div>
        );
        
      case 'audio-response':
        return (
          <div>
            {renderAudioPlayer()}
            <div className="mt-4">
              <textarea 
                className={`w-full h-24 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${showFeedback
                  ? isCorrect
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                  : 'border-gray-300'
                }`}
                placeholder="Write what you heard here..."
                value={typeof userAnswer === 'string' ? userAnswer : textInput}
                onChange={(e) => setTextInput(e.target.value)}
                disabled={showFeedback}
              />
              {!showFeedback && (
                <div className="mt-3 text-right">
                  <Button onClick={handleSubmitTextAnswer}>Submit Answer</Button>
                </div>
              )}
            </div>
          </div>
        );
        
      default:
        return <p>Unsupported question type</p>;
    }
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {question.imageUrl && (
        <div className="mb-4">
          <Image
            src={question.imageUrl}
            alt="Question visual"
            width={800}
            height={400}
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}
      
      <h3 className="mb-4 text-xl font-semibold text-gray-800">{question.text}</h3>
      
      {renderQuestionContent()}
      
      {showFeedback && question.explanation && (
        <div className={`mt-6 p-4 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-yellow-50'}`}>
          <h4 className="mb-2 font-medium text-gray-800">Explanation:</h4>
          <p className="text-gray-700">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}