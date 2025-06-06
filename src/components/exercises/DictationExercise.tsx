import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface DictationExerciseProps {
  audioUrl: string;
  text: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  onComplete?: (score: number, userText: string) => void;
}

const DictationExercise = ({
  audioUrl,
  text,
  difficulty,
  onComplete
}: DictationExerciseProps) => {
  const [userText, setUserText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{
    correctWords: string[];
    incorrectWords: string[];
    missingWords: string[];
    extraWords: string[];
  }>({
    correctWords: [],
    incorrectWords: [],
    missingWords: [],
    extraWords: []
  });
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Maximum number of times the audio can be played based on difficulty
  const maxPlayCount = difficulty === 'beginner' ? 5 : difficulty === 'intermediate' ? 3 : 2;
  
  const playAudio = () => {
    if (audioRef.current && playCount < maxPlayCount) {
      audioRef.current.play();
      setIsPlaying(true);
      setPlayCount(playCount + 1);
    }
  };
  
  const handleAudioEnd = () => {
    setIsPlaying(false);
  };
  
  const handleSubmit = () => {
    if (!userText.trim()) return;
    
    setIsSubmitted(true);
    
    // Compare user text with the correct text
    const correctTextLower = text.toLowerCase();
    const userTextLower = userText.toLowerCase();
    
    // Split texts into words and remove punctuation
    const correctWords = correctTextLower.replace(/[.,!?;:]/g, '').split(/\s+/);
    const userWords = userTextLower.replace(/[.,!?;:]/g, '').split(/\s+/);
    
    // Find correct, incorrect, missing, and extra words
    const correct: string[] = [];
    const incorrect: string[] = [];
    const missing: string[] = [];
    const extra: string[] = [];
    
    // Check for correct and incorrect words
    userWords.forEach(word => {
      if (correctWords.includes(word)) {
        correct.push(word);
        // Remove from correctWords to handle duplicates correctly
        const index = correctWords.indexOf(word);
        correctWords.splice(index, 1);
      } else {
        extra.push(word);
      }
    });
    
    // Remaining words in correctWords are missing
    missing.push(...correctWords);
    
    // Calculate score (percentage of correct words)
    const totalCorrectWords = text.replace(/[.,!?;:]/g, '').split(/\s+/).length;
    const calculatedScore = Math.round((correct.length / totalCorrectWords) * 100);
    
    setScore(calculatedScore);
    setFeedback({
      correctWords: correct,
      incorrectWords: incorrect,
      missingWords: missing,
      extraWords: extra
    });
    
    if (onComplete) {
      onComplete(calculatedScore, userText);
    }
  };
  
  const getHint = () => {
    setShowHint(true);
    
    // For beginners, show the first letter of each word
    // For intermediate, show the number of letters in each word
    // For advanced, just show the number of words
    
    if (difficulty === 'beginner') {
      const words = text.split(/\s+/);
      return words.map(word => word[0] + '...').join(' ');
    } else if (difficulty === 'intermediate') {
      const words = text.split(/\s+/);
      return words.map(word => '•'.repeat(word.length)).join(' ');
    } else {
      const wordCount = text.split(/\s+/).length;
      return `This sentence contains ${wordCount} words.`;
    }
  };
  
  const highlightDifferences = () => {
    if (!isSubmitted) return userText;
    
    const correctWords = text.toLowerCase().replace(/[.,!?;:]/g, '').split(/\s+/);
    
    // Create a highlighted version of the user's text
    const userTextWords = userText.split(/\s+/);
    
    const highlightedWords = userTextWords.map((word) => {
      const wordWithoutPunctuation = word.toLowerCase().replace(/[.,!?;:]/g, '');
      
      if (correctWords.includes(wordWithoutPunctuation)) {
        // Remove from correctWords to handle duplicates correctly
        const idx = correctWords.indexOf(wordWithoutPunctuation);
        correctWords.splice(idx, 1);
        return `<span class="text-green-600">${word}</span>`;
      } else {
        return `<span class="text-red-600">${word}</span>`;
      }
    });
    
    return highlightedWords.join(' ');
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">Dictation Exercise</h3>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-500">
              Listen carefully and type what you hear:
            </div>
            <div className="text-sm text-gray-500">
              Plays: {playCount}/{maxPlayCount}
            </div>
          </div>
          
          <div className="flex justify-center mb-4">
            <Button
              onClick={playAudio}
              disabled={isPlaying || playCount >= maxPlayCount || isSubmitted}
              className="flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{isPlaying ? 'Playing...' : 'Play Audio'}</span>
            </Button>
          </div>
          
          <audio 
            ref={audioRef} 
            src={audioUrl} 
            onEnded={handleAudioEnd}
            className="hidden"
          />
          
          <div className="mb-4">
            <textarea
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              placeholder="Type what you hear..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 min-h-[100px]"
              disabled={isSubmitted}
            />
          </div>
          
          {!isSubmitted && (
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setShowHint(true)}
                disabled={showHint}
              >
                Get Hint
              </Button>
              
              <Button
                onClick={handleSubmit}
                disabled={!userText.trim() || playCount === 0}
              >
                Check Answer
              </Button>
            </div>
          )}
          
          {showHint && !isSubmitted && (
            <div className="p-4 mt-4 border border-blue-200 rounded-lg bg-blue-50">
              <h4 className="mb-2 font-medium text-blue-800">Hint:</h4>
              <p className="text-blue-700">{getHint()}</p>
            </div>
          )}
        </div>
        
        {isSubmitted && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-800">Your Result</h4>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                score >= 80 
                  ? 'bg-green-100 text-green-800' 
                  : score >= 50 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                Score: {score}%
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h5 className="mb-2 font-medium text-gray-800">Your Answer:</h5>
              <p 
                className="text-gray-700"
                dangerouslySetInnerHTML={{ __html: highlightDifferences() }}
              />
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h5 className="mb-2 font-medium text-gray-800">Correct Answer:</h5>
              <p className="text-gray-700">{text}</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {feedback.missingWords.length > 0 && (
                <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                  <h5 className="mb-2 font-medium text-yellow-800">Missing Words:</h5>
                  <div className="flex flex-wrap gap-2">
                    {feedback.missingWords.map((word, index) => (
                      <span key={index} className="px-2 py-1 text-yellow-800 bg-yellow-100 rounded">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {feedback.extraWords.length > 0 && (
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h5 className="mb-2 font-medium text-red-800">Extra Words:</h5>
                  <div className="flex flex-wrap gap-2">
                    {feedback.extraWords.map((word, index) => (
                      <span key={index} className="px-2 py-1 text-red-800 bg-red-100 rounded">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h5 className="mb-2 font-medium text-blue-800">Tips for Improvement:</h5>
              <ul className="space-y-1 text-blue-700 list-disc list-inside">
                <li>Listen for individual words and their pronunciation</li>
                <li>Pay attention to articles (le, la, les, un, une, des)</li>
                <li>Practice recognizing common French phrases</li>
                <li>Focus on distinguishing similar-sounding words</li>
              </ul>
            </div>
            
            <div className="flex justify-center">
              <Button onClick={() => window.location.reload()}>
                Try Another Exercise
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DictationExercise;
