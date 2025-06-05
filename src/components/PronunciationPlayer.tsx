import React, { useState } from 'react';
import pronunciationService from '../services/pronunciationService';

interface PronunciationPlayerProps {
  text: string;
  displayText?: string;
  translation?: string;
  useAI?: boolean;
  voice?: string;
  className?: string;
}

/**
 * PronunciationPlayer - A component for playing text-to-speech
 */
const PronunciationPlayer: React.FC<PronunciationPlayerProps> = ({
  text,
  displayText,
  translation,
  useAI = true,
  voice = 'alloy',
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlay = async (): Promise<void> => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setError(null);
    
    try {
      await pronunciationService.speak(text, {
        useAI,
        voice,
        cacheKey: text, // Use the text as cache key
      });
    } catch (err) {
      console.error('Failed to play pronunciation', err);
      setError('Unable to play pronunciation. Please try again.');
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <div className={`pronunciation-player ${className}`}>
      <div className="pronunciation-content">
        {(displayText || text) && (
          <p className="text-to-pronounce">{displayText || text}</p>
        )}
        {translation && <p className="translation">{translation}</p>}
      </div>
      
      <button
        onClick={handlePlay}
        disabled={isPlaying}
        className={`pronunciation-button ${isPlaying ? 'playing' : ''}`}
        aria-label="Listen to pronunciation"
      >
        {isPlaying ? (
          <span className="playing-indicator">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Playing...
          </span>
        ) : (
          <span className="play-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Listen
          </span>
        )}
      </button>
      
      {error && <div className="error-message text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
};

export default PronunciationPlayer;