import React from 'react';
import PronunciationPlayer from './PronunciationPlayer';

interface VocabularyItemProps {
  word: string;
  translation: string;
  example: string;
  pronunciation?: string;
  level?: string;
  category?: string;
}

/**
 * VocabularyItem - A component for displaying vocabulary words with pronunciation
 */
const VocabularyItem: React.FC<VocabularyItemProps> = ({
  word,
  translation,
  example,
  pronunciation,
  level,
  category,
}) => {
  return (
    <div className="p-4 mb-4 bg-white rounded-lg border shadow-sm vocabulary-item">
      <div className="mb-3 word-section">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-blue-700">{word}</h3>
          <div className="flex items-center space-x-2">
            {level && (
              <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded level-badge">
                {level}
              </span>
            )}
            {category && (
              <span className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded category-badge">
                {category}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center mt-1">
          <p className="text-gray-700 translation">{translation}</p>
          {pronunciation && (
            <p className="ml-2 text-gray-500 phonetic">[{pronunciation}]</p>
          )}
        </div>
        
        <div className="mt-2">
          <PronunciationPlayer 
            text={word} 
            useAI={true} 
            className="inline-flex items-center px-3 py-1 text-sm text-blue-700 bg-blue-50 rounded transition-colors hover:bg-blue-100"
          />
        </div>
      </div>
      
      <div className="pt-3 mt-3 border-t example-section">
        <p className="italic text-gray-800 example">example</p>
        <div className="mt-2">
          <PronunciationPlayer 
            text={example}
            useAI={true}
            className="inline-flex items-center px-3 py-1 text-sm text-gray-700 bg-gray-50 rounded transition-colors hover:bg-gray-100" 
          />
        </div>
      </div>
    </div>
  );
};

export default VocabularyItem;