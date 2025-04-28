import React from 'react';
import PronunciationPlayer from './PronunciationPlayer';

/**
 * VocabularyItem - A component for displaying vocabulary words with pronunciation
 * 
 * @param {Object} props
 * @param {string} props.word - The vocabulary word
 * @param {string} props.translation - The translation of the word
 * @param {string} props.example - An example sentence using the word
 * @param {string} [props.pronunciation] - Optional phonetic pronunciation
 * @param {string} [props.level] - Optional difficulty level
 * @param {string} [props.category] - Optional category
 */
const VocabularyItem = ({
  word,
  translation,
  example,
  pronunciation,
  level,
  category,
}) => {
  return (
    <div className="vocabulary-item border rounded-lg p-4 mb-4 shadow-sm bg-white">
      <div className="word-section mb-3">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-blue-700">{word}</h3>
          <div className="flex items-center space-x-2">
            {level && (
              <span className="level-badge px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                {level}
              </span>
            )}
            {category && (
              <span className="category-badge px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">
                {category}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center mt-1">
          <p className="translation text-gray-700">{translation}</p>
          {pronunciation && (
            <p className="phonetic text-gray-500 ml-2">[{pronunciation}]</p>
          )}
        </div>
        
        <div className="mt-2">
          <PronunciationPlayer 
            text={word} 
            useAI={true} 
            className="inline-flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
          />
        </div>
      </div>
      
      <div className="example-section mt-3 pt-3 border-t">
        <p className="example text-gray-800 italic">"{example}"</p>
        <div className="mt-2">
          <PronunciationPlayer 
            text={example} 
            useAI={true}
            className="inline-flex items-center px-3 py-1 text-sm bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors" 
          />
        </div>
      </div>
    </div>
  );
};

export default VocabularyItem;
