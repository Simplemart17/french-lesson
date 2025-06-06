import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

// Define the vocabulary word type
export interface VocabularyWord {
  id: string;
  word: string;
  translation: string;
  example: string;
  category: string;
  pronunciation: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  lastReviewed?: string;
  nextReview?: string;
  repetitionStage?: number; // 0-5, higher means longer interval
}

interface SpacedRepetitionProps {
  words: VocabularyWord[];
  onComplete?: (reviewedWords: VocabularyWord[]) => void;
}

// Spaced repetition intervals in days
const INTERVALS = [0, 1, 3, 7, 14, 30]; // 0=same day, 1=next day, 3=three days later, etc.

const SpacedRepetition = ({ words, onComplete }: SpacedRepetitionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewedWords, setReviewedWords] = useState<VocabularyWord[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  
  // Filter words that are due for review
  const [dueWords, setDueWords] = useState<VocabularyWord[]>([]);
  
  useEffect(() => {
    // Filter words that are due for review (today or earlier)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const due = words.filter(word => {
      if (!word.nextReview) return true; // Never reviewed
      const reviewDate = new Date(word.nextReview);
      return reviewDate <= today;
    });
    
    // Sort by repetition stage (lowest first)
    due.sort((a, b) => {
      const stageA = a.repetitionStage || 0;
      const stageB = b.repetitionStage || 0;
      return stageA - stageB;
    });
    
    setDueWords(due);
  }, [words]);
  
  const currentWord = dueWords[currentIndex];
  
  const handleStartSession = () => {
    setSessionStarted(true);
    setCurrentIndex(0);
    setShowAnswer(false);
    setReviewedWords([]);
    setIsComplete(false);
  };
  
  const handleShowAnswer = () => {
    setShowAnswer(true);
  };
  
  const handleRating = (rating: 'easy' | 'medium' | 'hard') => {
    if (!currentWord) return;
    
    // Calculate new repetition stage based on rating
    let newStage = currentWord.repetitionStage || 0;
    
    switch (rating) {
      case 'easy':
        newStage = Math.min(5, newStage + 1); // Move up one stage, max 5
        break;
      case 'medium':
        // Stay at the same stage
        break;
      case 'hard':
        newStage = Math.max(0, newStage - 1); // Move down one stage, min 0
        break;
    }
    
    // Calculate next review date
    const today = new Date();
    const nextReviewDate = new Date(today);
    nextReviewDate.setDate(today.getDate() + INTERVALS[newStage]);
    
    // Update the word with new review information
    const updatedWord: VocabularyWord = {
      ...currentWord,
      lastReviewed: today.toISOString(),
      nextReview: nextReviewDate.toISOString(),
      repetitionStage: newStage,
    };
    
    // Add to reviewed words
    setReviewedWords([...reviewedWords, updatedWord]);
    
    // Move to next word or complete
    if (currentIndex < dueWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      setIsComplete(true);
      if (onComplete) {
        onComplete([...reviewedWords, updatedWord]);
      }
    }
  };
  
  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  if (!sessionStarted) {
    return (
      <Card className="p-6 text-center">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Spaced Repetition Review</h2>
        <p className="mb-6 text-gray-600">
          You have {dueWords.length} words due for review today.
        </p>
        {dueWords.length > 0 ? (
          <Button onClick={handleStartSession}>
            Start Review Session
          </Button>
        ) : (
          <p className="font-medium text-green-600">
            You&apos;re all caught up! No words to review today.
          </p>
        )}
      </Card>
    );
  }
  
  if (isComplete) {
    return (
      <Card className="p-6 text-center">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Review Complete!</h2>
        <p className="mb-6 text-gray-600">
          You&apos;ve reviewed {reviewedWords.length} words. Great job!
        </p>
        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={() => setSessionStarted(false)}>
            Back to Summary
          </Button>
          <Button onClick={handleStartSession}>
            Start New Session
          </Button>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-500">
          Card {currentIndex + 1} of {dueWords.length}
        </div>
        <div className="text-sm text-gray-500">
          {currentWord?.repetitionStage !== undefined && (
            <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">
              Level {currentWord.repetitionStage + 1}
            </span>
          )}
        </div>
      </div>
      
      <div className="min-h-[200px] flex flex-col items-center justify-center mb-6">
        {!showAnswer ? (
          <>
            <h2 className="mb-3 text-3xl font-bold text-gray-800">{currentWord?.word}</h2>
            <p className="italic text-gray-500">{currentWord?.pronunciation}</p>
            <p className="mt-6 text-sm text-gray-500">Do you know this word?</p>
            <Button 
              onClick={handleShowAnswer} 
              className="mt-4"
              variant="outline"
            >
              Show Answer
            </Button>
          </>
        ) : (
          <>
            <h2 className="mb-3 text-3xl font-bold text-gray-800">{currentWord?.translation}</h2>
            <p className="mt-2 text-gray-600">{currentWord?.example}</p>
            
            <div className="w-full mt-8">
              <p className="mb-3 text-sm text-center text-gray-500">How well did you know this word?</p>
              <div className="flex justify-center space-x-3">
                <Button 
                  onClick={() => handleRating('hard')} 
                  variant="destructive"
                >
                  Difficult
                </Button>
                <Button 
                  onClick={() => handleRating('medium')} 
                  variant="secondary"
                >
                  Okay
                </Button>
                <Button 
                  onClick={() => handleRating('easy')} 
                  variant="success"
                >
                  Easy
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      
      {currentWord?.lastReviewed && (
        <div className="text-xs text-center text-gray-500">
          Last reviewed: {formatDate(currentWord.lastReviewed)}
          {currentWord.nextReview && ` • Next review: ${formatDate(currentWord.nextReview)}`}
        </div>
      )}
    </Card>
  );
};

export default SpacedRepetition;
