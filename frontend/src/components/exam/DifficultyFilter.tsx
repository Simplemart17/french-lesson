import React from 'react';

interface DifficultyFilterProps {
  selectedDifficulty: string;
  onDifficultyChange: (difficulty: string) => void;
}

export default function DifficultyFilter({ 
  selectedDifficulty, 
  onDifficultyChange 
}: DifficultyFilterProps) {
  const difficulties = ['all', 'easy', 'medium', 'hard'];
  
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Difficulty Level</h2>
      <div className="flex flex-wrap gap-2">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty}
            onClick={() => onDifficultyChange(difficulty)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedDifficulty === difficulty
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          >
            {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}