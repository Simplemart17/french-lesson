import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ConjugationItem {
  pronoun: string;
  correctAnswer: string;
}

interface VerbConjugationProps {
  verb: string;
  tense: string;
  description?: string;
  conjugations: ConjugationItem[];
  irregularNotes?: string;
  examples?: string[];
  onComplete?: (score: number, answers: Record<string, string>) => void;
}

const VerbConjugation = ({
  verb,
  tense,
  description,
  conjugations,
  irregularNotes,
  examples,
  onComplete
}: VerbConjugationProps) => {
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<Record<string, { isCorrect: boolean; message?: string }>>({});
  
  const handleAnswerChange = (pronoun: string, value: string) => {
    setUserAnswers({
      ...userAnswers,
      [pronoun]: value
    });
  };
  
  const handleSubmit = () => {
    // Check if all fields have been filled
    const allFilled = conjugations.every(item => userAnswers[item.pronoun]?.trim());
    if (!allFilled) {
      alert('Please fill in all conjugations before submitting.');
      return;
    }
    
    setIsSubmitted(true);
    
    // Calculate score and generate feedback
    let correctCount = 0;
    const newFeedback: Record<string, { isCorrect: boolean; message?: string }> = {};
    
    conjugations.forEach(item => {
      const userAnswer = userAnswers[item.pronoun]?.trim() || '';
      const isCorrect = userAnswer.toLowerCase() === item.correctAnswer.toLowerCase();
      
      if (isCorrect) {
        correctCount++;
        newFeedback[item.pronoun] = { isCorrect: true };
      } else {
        newFeedback[item.pronoun] = { 
          isCorrect: false,
          message: `Correct: ${item.correctAnswer}`
        };
      }
    });
    
    const calculatedScore = Math.round((correctCount / conjugations.length) * 100);
    setScore(calculatedScore);
    setFeedback(newFeedback);
    
    if (onComplete) {
      onComplete(calculatedScore, userAnswers);
    }
  };
  
  const getHint = (pronoun: string) => {
    const conjugation = conjugations.find(item => item.pronoun === pronoun);
    if (!conjugation) return '';
    
    // Show the first letter and the ending
    const answer = conjugation.correctAnswer;
    if (answer.length <= 2) return answer[0] + '...';
    
    return answer[0] + '...' + answer.slice(-2);
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="mb-1 text-2xl font-semibold text-gray-800">{verb}</h2>
            <p className="text-lg font-medium text-primary-600">{tense}</p>
          </div>
          
          {!isSubmitted && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowHints(!showHints)}
            >
              {showHints ? 'Hide Hints' : 'Show Hints'}
            </Button>
          )}
        </div>
        
        {description && (
          <div className="mb-6 text-gray-600">
            <p>{description}</p>
          </div>
        )}
        
        <div className="mb-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {conjugations.map((item) => (
              <div key={item.pronoun} className="relative">
                <div className="flex items-center">
                  <span className="w-16 font-medium text-gray-700">{item.pronoun}</span>
                  <input
                    type="text"
                    value={userAnswers[item.pronoun] || ''}
                    onChange={(e) => handleAnswerChange(item.pronoun, e.target.value)}
                    className={`flex-grow px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                      isSubmitted
                        ? feedback[item.pronoun]?.isCorrect
                          ? 'bg-green-50 border-green-300'
                          : 'bg-red-50 border-red-300'
                        : 'border-gray-300'
                    }`}
                    placeholder={showHints ? getHint(item.pronoun) : "Type conjugation..."}
                    disabled={isSubmitted}
                  />
                </div>
                
                {isSubmitted && !feedback[item.pronoun]?.isCorrect && (
                  <div className="mt-1 text-sm text-red-600">
                    {feedback[item.pronoun]?.message}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {irregularNotes && !isSubmitted && (
          <div className="p-4 mb-6 border border-yellow-200 rounded-lg bg-yellow-50">
            <h4 className="mb-2 font-medium text-yellow-800">Note:</h4>
            <p className="text-yellow-700">{irregularNotes}</p>
          </div>
        )}
        
        {!isSubmitted ? (
          <div className="flex justify-center">
            <Button onClick={handleSubmit}>
              Check Conjugations
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="mb-2 text-xl font-semibold text-gray-800">Your Result</h3>
              <div className={`inline-block px-4 py-2 rounded-lg text-lg font-medium ${
                score >= 80 
                  ? 'bg-green-100 text-green-800' 
                  : score >= 50 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                Score: {score}%
              </div>
            </div>
            
            {examples && examples.length > 0 && (
              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                <h4 className="mb-3 font-medium text-blue-800">Example Sentences:</h4>
                <ul className="space-y-2 text-blue-700 list-disc list-inside">
                  {examples.map((example, index) => (
                    <li key={index}>{example}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {irregularNotes && (
              <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                <h4 className="mb-2 font-medium text-yellow-800">Irregular Verb Notes:</h4>
                <p className="text-yellow-700">{irregularNotes}</p>
              </div>
            )}
            
            <div className="flex justify-center">
              <Button onClick={() => window.location.reload()}>
                Try Another Verb
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default VerbConjugation;
