import React, { useState } from 'react';
import PronunciationPlayer from './PronunciationPlayer';
import pronunciationService from '../services/pronunciationService';

interface ExerciseData {
  text: string;
  translation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category?: string;
  expectedPronunciation?: string;
}

interface FeedbackHighlight {
  index: number;
  message: string;
}

interface FeedbackData {
  score: number;
  message: string;
  status: 'success' | 'good' | 'needs-work';
  highlights?: FeedbackHighlight[];
}

interface PronunciationExerciseProps {
  exercise: ExerciseData;
}

/**
 * PronunciationExercise - A component for pronunciation practice
 */
const PronunciationExercise: React.FC<PronunciationExerciseProps> = ({ exercise }) => {
  const { text, translation, difficulty, category, expectedPronunciation } = exercise;
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  
  // Simulate recording and providing feedback
  const handleRecordClick = (): void => {
    if (isRecording) return;
    
    setIsRecording(true);
    setFeedback(null);
    
    // Simulate recording process
    setTimeout(() => {
      setIsRecording(false);
      
      // Simulate feedback (in a real app, this would come from speech recognition)
      const randomScore = Math.floor(Math.random() * 100);
      
      if (randomScore > 80) {
        setFeedback({
          score: randomScore,
          message: "Excellent pronunciation!",
          status: "success"
        });
      } else if (randomScore > 60) {
        setFeedback({
          score: randomScore,
          message: "Good pronunciation. Try to improve your intonation.",
          status: "good"
        });
      } else {
        setFeedback({
          score: randomScore,
          message: "Keep practicing. Focus on the sounds highlighted below.",
          status: "needs-work",
          highlights: [
            { index: Math.floor(Math.random() * text.length), message: "This sound needs work" }
          ]
        });
      }
    }, 2000);
  };
  
  // Get status color based on difficulty
  const getDifficultyColor = (): string => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get status color based on feedback
  const getFeedbackColor = (): string => {
    if (!feedback) return '';
    
    switch (feedback.status) {
      case 'success': return 'bg-green-50 border-green-200 text-green-700';
      case 'good': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'needs-work': return 'bg-red-50 border-red-200 text-red-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className="p-4 mb-4 bg-white rounded-lg border shadow-sm pronunciation-exercise">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold">Pronunciation Exercise</h3>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs rounded difficulty-badge ${getDifficultyColor()}`}>
            {difficulty}
          </span>
          {category && (
            <span className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded category-badge">
              {category}
            </span>
          )}
        </div>
      </div>
      
      <div className="mb-4 exercise-content">
        <div className="mb-2 text-section">
          <p className="text-xl font-medium text-to-pronounce">{text}</p>
          <p className="text-gray-600 translation">{translation}</p>
        </div>
        
        {expectedPronunciation && (
          <div className="p-2 mt-2 bg-gray-50 rounded phonetic-section">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Phonetic: </span>
              <code className="font-mono">{expectedPronunciation}</code>
            </p>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4 exercise-controls">
        <PronunciationPlayer 
          text={text} 
          useAI={true}
          voice="nova" // Using a different voice for variety
          className="flex items-center px-3 py-2 text-white bg-blue-600 rounded transition-colors hover:bg-blue-700"
        />
        
        <button
          onClick={handleRecordClick}
          disabled={isRecording}
          className={`flex items-center px-3 py-2 rounded transition-colors ${
            isRecording 
              ? 'text-white bg-red-600 animate-pulse' 
              : 'text-gray-800 bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {isRecording ? (
            <>
              <svg className="mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
              </svg>
              Recording...
            </>
          ) : (
            <>
              <svg className="mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
              Record Your Pronunciation
            </>
          )}
        </button>
        
        <button
          className="flex items-center px-3 py-2 text-gray-800 bg-gray-100 rounded transition-colors hover:bg-gray-200"
          onClick={() => {
            // Play at slower speed for learning
            const slowOptions = { rate: 0.7 };
            pronunciationService.speakWithBrowser(text, { lang: 'fr-FR', ...slowOptions });
          }}
        >
          <svg className="mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Slow Version
        </button>
      </div>
      
      {feedback && (
        <div className={`p-3 mt-3 rounded border feedback-section ${getFeedbackColor()}`}>
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Your Pronunciation</h4>
            <span className="px-2 py-1 text-sm font-medium bg-white rounded-full score">
              Score: {feedback.score}/100
            </span>
          </div>
          <p className="mt-1">{feedback.message}</p>
          
          {feedback.highlights && feedback.highlights.length > 0 && (
            <div className="p-2 mt-2 bg-white bg-opacity-50 rounded highlights">
              <p className="text-sm font-medium">Focus on improving:</p>
              <ul className="text-sm list-disc list-inside">
                {feedback.highlights.map((highlight, index) => (
                  <li key={index}>{highlight.message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PronunciationExercise;