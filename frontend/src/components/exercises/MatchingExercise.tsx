import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface MatchingPair {
  left: string;
  right: string;
}

interface MatchingExerciseProps {
  question: string;
  pairs: MatchingPair[];
  onComplete: (isCorrect: boolean) => void;
}

const MatchingExercise = ({ 
  question, 
  pairs, 
  onComplete 
}: MatchingExerciseProps) => {
  const [leftItems, setLeftItems] = useState<(MatchingPair & { id: number })[]>([]);
  const [rightItems, setRightItems] = useState<(MatchingPair & { id: number })[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matches, setMatches] = useState<{left: number, right: number}[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Initialize the exercise
  useEffect(() => {
    // Add IDs to pairs and shuffle the right items
    const pairsWithIds = pairs.map((pair, index) => ({
      ...pair,
      id: index
    }));
    
    setLeftItems(pairsWithIds);
    
    // Shuffle right items
    const shuffledRight = [...pairsWithIds].sort(() => Math.random() - 0.5);
    setRightItems(shuffledRight);
  }, [pairs]);
  
  const handleLeftClick = (id: number) => {
    if (isSubmitted) return;
    
    // If this item is already matched, do nothing
    if (matches.some(match => match.left === id)) return;
    
    setSelectedLeft(id);
    
    // If right is already selected, create a match
    if (selectedRight !== null) {
      const newMatch = { left: id, right: selectedRight };
      setMatches([...matches, newMatch]);
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  };
  
  const handleRightClick = (id: number) => {
    if (isSubmitted) return;
    
    // If this item is already matched, do nothing
    if (matches.some(match => match.right === id)) return;
    
    setSelectedRight(id);
    
    // If left is already selected, create a match
    if (selectedLeft !== null) {
      const newMatch = { left: selectedLeft, right: id };
      setMatches([...matches, newMatch]);
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  };
  
  const removeMatch = (leftId: number, rightId: number) => {
    if (isSubmitted) return;
    
    setMatches(matches.filter(match => 
      !(match.left === leftId && match.right === rightId)
    ));
  };
  
  const handleSubmit = () => {
    setIsSubmitted(true);
    
    // Check if all matches are correct
    const allCorrect = matches.every(match => {
      const leftItem = leftItems.find(item => item.id === match.left);
      const rightItem = rightItems.find(item => item.id === match.right);
      return leftItem && rightItem && leftItem.id === rightItem.id;
    });
    
    setIsCorrect(allCorrect);
    onComplete(allCorrect);
  };
  
  const resetExercise = () => {
    setMatches([]);
    setSelectedLeft(null);
    setSelectedRight(null);
    setIsSubmitted(false);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800">{question}</h3>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left column */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Match these items:</h4>
          {leftItems.map(item => {
            const isMatched = matches.some(match => match.left === item.id);
            const isSelected = selectedLeft === item.id;
            
            return (
              <div 
                key={`left-${item.id}`}
                onClick={() => handleLeftClick(item.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  isMatched 
                    ? isSubmitted 
                      ? matches.find(m => m.left === item.id)?.right === item.id
                        ? 'bg-green-50 border-green-300'
                        : 'bg-red-50 border-red-300'
                      : 'bg-blue-50 border-blue-300' 
                    : isSelected
                    ? 'bg-primary-100 border-primary-300'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{item.left}</span>
                  {isMatched && !isSubmitted && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const match = matches.find(m => m.left === item.id);
                        if (match) removeMatch(match.left, match.right);
                      }}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Right column */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">With these items:</h4>
          {rightItems.map(item => {
            const isMatched = matches.some(match => match.right === item.id);
            const isSelected = selectedRight === item.id;
            
            return (
              <div 
                key={`right-${item.id}`}
                onClick={() => handleRightClick(item.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  isMatched 
                    ? isSubmitted 
                      ? matches.find(m => m.right === item.id)?.left === item.id
                        ? 'bg-green-50 border-green-300'
                        : 'bg-red-50 border-red-300'
                      : 'bg-blue-50 border-blue-300' 
                    : isSelected
                    ? 'bg-primary-100 border-primary-300'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{item.right}</span>
                  {isMatched && !isSubmitted && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const match = matches.find(m => m.right === item.id);
                        if (match) removeMatch(match.left, match.right);
                      }}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Connections */}
      <div className="mt-4">
        {matches.length > 0 && (
          <div className="mb-4">
            <h4 className="mb-2 font-medium text-gray-700">Your matches:</h4>
            <div className="space-y-2">
              {matches.map((match, index) => {
                const leftItem = leftItems.find(item => item.id === match.left);
                const rightItem = rightItems.find(item => item.id === match.right);
                const isCorrectMatch = leftItem?.id === rightItem?.id;
                
                return (
                  <div 
                    key={`match-${index}`}
                    className={`p-2 rounded-lg border flex justify-between items-center ${
                      isSubmitted
                        ? isCorrectMatch
                          ? 'bg-green-50 border-green-300'
                          : 'bg-red-50 border-red-300'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="font-medium">{leftItem?.left}</span>
                      <span className="mx-2">→</span>
                      <span className="font-medium">{rightItem?.right}</span>
                    </div>
                    
                    {isSubmitted && (
                      <div>
                        {isCorrectMatch ? (
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                    )}
                    
                    {!isSubmitted && (
                      <button 
                        onClick={() => removeMatch(match.left, match.right)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex space-x-4">
        {!isSubmitted ? (
          <>
            <Button 
              onClick={handleSubmit} 
              disabled={matches.length < pairs.length}
            >
              Check Answers
            </Button>
            
            {matches.length > 0 && (
              <Button 
                variant="outline" 
                onClick={resetExercise}
              >
                Reset
              </Button>
            )}
          </>
        ) : (
          <div className="w-full p-4 mt-4 border border-blue-200 rounded-lg bg-blue-50">
            <p className="text-blue-800">
              {isCorrect
                ? 'Great job! All matches are correct.'
                : 'Some matches are incorrect. The correct matches are highlighted in green.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchingExercise;
