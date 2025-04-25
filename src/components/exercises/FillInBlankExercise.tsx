import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface FillInBlankExerciseProps {
  question: string;
  text: string; // Text with blanks marked as [blank]
  answers: string[]; // Correct answers for each blank
  onComplete: (isCorrect: boolean) => void;
}

const FillInBlankExercise = ({ 
  question, 
  text, 
  answers, 
  onComplete 
}: FillInBlankExerciseProps) => {
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(answers.length).fill(''));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string[]>(Array(answers.length).fill(''));
  
  // Split the text into parts (text and blanks)
  const parts = text.split(/\[blank\]/g);
  
  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };
  
  const handleSubmit = () => {
    setIsSubmitted(true);
    
    // Check each answer
    const newFeedback = userAnswers.map((answer, index) => {
      const correctAnswer = answers[index].toLowerCase().trim();
      const userAnswer = answer.toLowerCase().trim();
      
      if (userAnswer === correctAnswer) {
        return 'correct';
      } else if (userAnswer === '') {
        return 'empty';
      } else {
        return 'incorrect';
      }
    });
    
    setFeedback(newFeedback);
    
    // Determine if all answers are correct
    const isAllCorrect = newFeedback.every(f => f === 'correct');
    onComplete(isAllCorrect);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800">{question}</h3>
      
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className="flex flex-wrap items-center">
          {parts.map((part, index) => (
            <div key={index} className="flex items-center">
              {/* Text part */}
              <span>{part}</span>
              
              {/* Input part (except after the last text part) */}
              {index < parts.length - 1 && (
                <div className="inline-block mx-1">
                  <input
                    type="text"
                    value={userAnswers[index]}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    disabled={isSubmitted}
                    className={`w-32 px-2 py-1 border rounded-md text-center ${
                      isSubmitted
                        ? feedback[index] === 'correct'
                          ? 'bg-green-50 border-green-300 text-green-800'
                          : feedback[index] === 'incorrect'
                          ? 'bg-red-50 border-red-300 text-red-800'
                          : 'bg-yellow-50 border-yellow-300 text-yellow-800'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }`}
                  />
                  
                  {isSubmitted && (
                    <div className="mt-1 text-xs">
                      {feedback[index] === 'correct' ? (
                        <span className="text-green-600">Correct!</span>
                      ) : (
                        <span className="text-red-600">
                          {feedback[index] === 'empty' 
                            ? 'Please fill in this blank.' 
                            : `Correct answer: ${answers[index]}`}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {!isSubmitted ? (
        <Button onClick={handleSubmit} disabled={userAnswers.some(a => a === '')}>
          Check Answers
        </Button>
      ) : (
        <div className="p-4 mt-4 border border-blue-200 rounded-lg bg-blue-50">
          <p className="text-blue-800">
            {feedback.every(f => f === 'correct')
              ? 'Great job! All answers are correct.'
              : 'Some answers need correction. Review the feedback above.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default FillInBlankExercise;
