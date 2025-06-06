import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

interface ListeningComprehensionProps {
  audioUrl: string;
  title: string;
  description?: string;
  questions: Question[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  transcript?: string;
  onComplete?: (score: number, answers: Record<string, string>) => void;
}

const ListeningComprehension = ({
  audioUrl,
  title,
  description,
  questions,
  difficulty,
  transcript,
  onComplete
}: ListeningComprehensionProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [currentStep, setCurrentStep] = useState<'intro' | 'listening' | 'questions' | 'results'>('intro');
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [score, setScore] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Maximum number of times the audio can be played based on difficulty
  const maxPlayCount = difficulty === 'beginner' ? 3 : difficulty === 'intermediate' ? 2 : 1;
  
  const playAudio = () => {
    if (audioRef.current && playCount < maxPlayCount) {
      audioRef.current.play();
      setIsPlaying(true);
      setPlayCount(playCount + 1);
      
      if (currentStep === 'intro') {
        setCurrentStep('listening');
      }
    }
  };
  
  const handleAudioEnd = () => {
    setIsPlaying(false);
    
    if (currentStep === 'listening') {
      setCurrentStep('questions');
    }
  };
  
  const handleAnswerSelect = (questionId: string, answer: string) => {
    if (isSubmitted) return;
    
    setUserAnswers({
      ...userAnswers,
      [questionId]: answer
    });
  };
  
  const handleSubmit = () => {
    if (Object.keys(userAnswers).length < questions.length) return;
    
    setIsSubmitted(true);
    
    // Calculate score
    let correctCount = 0;
    questions.forEach(question => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    const calculatedScore = Math.round((correctCount / questions.length) * 100);
    setScore(calculatedScore);
    setCurrentStep('results');
    
    if (onComplete) {
      onComplete(calculatedScore, userAnswers);
    }
  };
  
  const isAnswerCorrect = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    return question && userAnswers[questionId] === question.correctAnswer;
  };
  
  const getCorrectAnswer = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    return question ? question.correctAnswer : '';
  };
  
  const getExplanation = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    return question?.explanation || '';
  };
  
  const renderIntro = () => (
    <div className="py-8 text-center">
      <h3 className="mb-4 text-2xl font-semibold text-gray-800">{title}</h3>
      {description && <p className="mb-6 text-gray-600">{description}</p>}
      
      <div className="mb-8">
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
          difficulty === 'beginner' 
            ? 'bg-green-100 text-green-800' 
            : difficulty === 'intermediate'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
        }`}>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level
        </div>
      </div>
      
      <div className="max-w-md p-6 mx-auto border border-gray-200 rounded-lg bg-gray-50">
        <h4 className="mb-4 font-medium text-gray-800">Instructions:</h4>
        <ol className="space-y-2 text-left text-gray-600 list-decimal list-inside">
          <li>Click the &quot;Start Listening&quot; button to play the audio</li>
          <li>Listen carefully to the audio clip (you can play it up to {maxPlayCount} times)</li>
          <li>Answer the questions about what you heard</li>
          <li>Submit your answers to see your results</li>
        </ol>
      </div>
      
      <Button 
        onClick={playAudio}
        size="lg"
        className="mt-8"
      >
        Start Listening
      </Button>
    </div>
  );
  
  const renderListening = () => (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <div className="text-sm text-gray-500">
          Plays: {playCount}/{maxPlayCount}
        </div>
      </div>
      
      <div className="p-6 mb-6 border border-gray-200 rounded-lg bg-gray-50">
        <div className="flex justify-center mb-4">
          {isPlaying ? (
            <div className="flex items-center space-x-2">
              <div className="relative flex items-center justify-center w-12 h-12">
                <div className="absolute inset-0 rounded-full opacity-75 bg-primary-100 animate-ping"></div>
                <div className="relative flex items-center justify-center w-10 h-10 text-white rounded-full bg-primary-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <span className="font-medium text-primary-700">Now Playing...</span>
            </div>
          ) : (
            <Button
              onClick={playAudio}
              disabled={playCount >= maxPlayCount}
              className="flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{playCount === 0 ? 'Play Audio' : 'Play Again'}</span>
            </Button>
          )}
        </div>
        
        <div className="text-center text-gray-600">
          {playCount === 0 ? (
            <p>Click the button to start listening</p>
          ) : (
            <p>Listen carefully to answer the questions that follow</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button 
          onClick={() => setCurrentStep('questions')}
          disabled={playCount === 0}
        >
          Continue to Questions
        </Button>
      </div>
    </div>
  );
  
  const renderQuestions = () => (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Answer the Questions</h3>
        {playCount < maxPlayCount && (
          <Button
            variant="outline"
            size="sm"
            onClick={playAudio}
            disabled={isPlaying}
            className="flex items-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Listen Again ({playCount}/{maxPlayCount})</span>
          </Button>
        )}
      </div>
      
      <div className="mb-8 space-y-8">
        {questions.map((question, index) => (
          <div key={question.id} className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h4 className="mb-4 font-medium text-gray-800">
              {index + 1}. {question.text}
            </h4>
            
            <div className="space-y-2">
              {question.options.map((option, optionIndex) => (
                <div 
                  key={optionIndex}
                  onClick={() => handleAnswerSelect(question.id, option)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    userAnswers[question.id] === option
                      ? isSubmitted
                        ? isAnswerCorrect(question.id)
                          ? 'bg-green-50 border-green-300'
                          : 'bg-red-50 border-red-300'
                        : 'bg-primary-50 border-primary-300'
                      : isSubmitted && option === getCorrectAnswer(question.id)
                        ? 'bg-green-50 border-green-300'
                        : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border flex-shrink-0 mr-3 flex items-center justify-center ${
                      userAnswers[question.id] === option
                        ? isSubmitted
                          ? isAnswerCorrect(question.id)
                            ? 'border-green-500 bg-green-500 text-white'
                            : 'border-red-500 bg-red-500 text-white'
                          : 'border-primary-500 bg-primary-500 text-white'
                        : isSubmitted && option === getCorrectAnswer(question.id)
                          ? 'border-green-500 bg-green-500 text-white'
                          : 'border-gray-300'
                    }`}>
                      {userAnswers[question.id] === option && (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {isSubmitted && option === getCorrectAnswer(question.id) && userAnswers[question.id] !== option && (
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
            
            {isSubmitted && getExplanation(question.id) && (
              <div className="p-3 mt-4 text-sm text-blue-700 rounded-lg bg-blue-50">
                <strong>Explanation:</strong> {getExplanation(question.id)}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {transcript && (
        <div className="mb-8">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="flex items-center font-medium text-primary-600 hover:text-primary-700"
          >
            <svg className={`w-4 h-4 mr-1 transition-transform ${showTranscript ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
          </button>
          
          {showTranscript && (
            <div className="p-4 mt-3 border border-gray-200 rounded-lg bg-gray-50">
              <h5 className="mb-2 font-medium text-gray-800">Transcript:</h5>
              <p className="text-gray-700">{transcript}</p>
            </div>
          )}
        </div>
      )}
      
      <div className="flex justify-center">
        <Button 
          onClick={handleSubmit}
          disabled={Object.keys(userAnswers).length < questions.length || isSubmitted}
        >
          Submit Answers
        </Button>
      </div>
    </div>
  );
  
  const renderResults = () => (
    <div className="py-6">
      <div className="mb-8 text-center">
        <h3 className="mb-2 text-2xl font-semibold text-gray-800">Your Results</h3>
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
      
      <div className="p-6 mb-8 bg-white border border-gray-200 rounded-lg shadow-sm">
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
                    <span className="text-green-600">{getCorrectAnswer(question.id)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {transcript && (
        <div className="p-6 mb-8 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h4 className="mb-2 font-medium text-gray-800">Audio Transcript</h4>
          <p className="text-gray-700">{transcript}</p>
        </div>
      )}
      
      <div className="p-6 mb-8 border border-blue-200 rounded-lg bg-blue-50">
        <h4 className="mb-3 font-medium text-blue-800">Tips for Improvement</h4>
        <ul className="space-y-2 text-blue-700 list-disc list-inside">
          <li>Focus on understanding the main idea first, then details</li>
          <li>Listen for key words and phrases that answer who, what, when, where, why, and how</li>
          <li>Pay attention to transition words (however, therefore, in addition)</li>
          <li>Practice with different accents and speaking speeds</li>
          <li>Take notes while listening to help remember important points</li>
        </ul>
      </div>
      
      <div className="flex justify-center">
        <Button onClick={() => window.location.reload()}>
          Try Another Exercise
        </Button>
      </div>
    </div>
  );
  
  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        {currentStep === 'intro' && renderIntro()}
        {currentStep === 'listening' && renderListening()}
        {currentStep === 'questions' && renderQuestions()}
        {currentStep === 'results' && renderResults()}
        
        <audio 
          ref={audioRef} 
          src={audioUrl} 
          onEnded={handleAudioEnd}
          className="hidden"
        />
      </div>
    </Card>
  );
};

export default ListeningComprehension;
