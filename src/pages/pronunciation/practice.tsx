import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import SpeechRecognition from '@/components/SpeechRecognition';
import PronunciationPlayer from '@/components/PronunciationPlayer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SpeechRecognitionResponse } from '@/services/api/speechRecognitionApiService';

// Sample phrases for practice
const PRACTICE_PHRASES = [
  {
    id: 1,
    text: 'Bonjour, comment allez-vous?',
    translation: 'Hello, how are you?',
    difficulty: 'beginner' as const
  },
  {
    id: 2,
    text: 'Je voudrais un café, s\'il vous plaît.',
    translation: 'I would like a coffee, please.',
    difficulty: 'beginner' as const
  },
  {
    id: 3,
    text: 'Pourriez-vous parler plus lentement?',
    translation: 'Could you speak more slowly?',
    difficulty: 'intermediate' as const
  },
  {
    id: 4,
    text: 'J\'ai besoin de pratiquer mon français.',
    translation: 'I need to practice my French.',
    difficulty: 'intermediate' as const
  },
  {
    id: 5,
    text: 'La prononciation française peut être difficile à maîtriser.',
    translation: 'French pronunciation can be difficult to master.',
    difficulty: 'advanced' as const
  }
];

export default function PronunciationPractice() {
  const router = useRouter();
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [results, setResults] = useState<SpeechRecognitionResponse | null>(null);
  
  const currentPhrase = PRACTICE_PHRASES[currentPhraseIndex];
  
  // Handle receiving results from speech recognition
  const handleResultsReceived = (analysisResults: SpeechRecognitionResponse) => {
    setResults(analysisResults);
  };
  
  // Move to next phrase
  const handleNextPhrase = () => {
    setResults(null);
    setCurrentPhraseIndex((prev) => 
      prev < PRACTICE_PHRASES.length - 1 ? prev + 1 : 0
    );
  };
  
  // Get score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <>
      <Head>
        <title>Pronunciation Practice | French Tutor AI</title>
        <meta name="description" content="Practice your French pronunciation with AI feedback" />
      </Head>

      <div className="container px-4 py-8 mx-auto">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-3xl font-bold">Pronunciation Practice</h1>
          
          <Card className="p-6 mb-6">
            <div className="mb-4">
              <h2 className="mb-2 text-xl font-semibold">Listen to the correct pronunciation</h2>
              <PronunciationPlayer 
                text={currentPhrase.text}
                translation={currentPhrase.translation}
                useAI={true}
                className="p-4 bg-gray-50 rounded border"
              />
            </div>
            
            <div className="mb-4">
              <h2 className="mb-2 text-xl font-semibold">Now you try</h2>
              <SpeechRecognition
                referenceText={currentPhrase.text}
                translation={currentPhrase.translation}
                difficulty={currentPhrase.difficulty}
                onResult={handleResultsReceived}
              />
            </div>
            
            {results && (
              <div className="p-4 bg-white rounded border shadow-sm results">
                <h3 className="mb-2 text-lg font-semibold">Feedback</h3>
                
                <div className="flex items-center mb-3 score-section">
                  <span className="mr-2">Score:</span>
                  <span className={`text-xl font-bold ${getScoreColor(results.score)}`}>
                    {results.score}/100
                  </span>
                </div>
                
                <div className="mb-3 feedback-section">
                  <p className="text-gray-700">{results.feedback}</p>
                </div>
                
                {results.errors && results.errors.length > 0 && (
                  <div className="mb-3 errors-section">
                    <h4 className="mb-1 font-medium text-md">Errors to correct:</h4>
                    <ul className="pl-5 list-disc">
                      {results.errors.map((error, index) => (
                        <li key={index} className="text-red-600">
                          <span className="font-medium">{error.word}</span>: {error.suggestion}
                          <p className="text-sm text-gray-600">{error.explanation}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {results.strengths && results.strengths.length > 0 && (
                  <div className="mb-3 strengths-section">
                    <h4 className="mb-1 font-medium text-md">Your strengths:</h4>
                    <ul className="pl-5 list-disc">
                      {results.strengths.map((strength, index) => (
                        <li key={index} className="text-green-600">{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {results.areas_for_improvement && results.areas_for_improvement.length > 0 && (
                  <div className="mb-3 improvement-section">
                    <h4 className="mb-1 font-medium text-md">Areas for improvement:</h4>
                    <ul className="pl-5 list-disc">
                      {results.areas_for_improvement.map((area, index) => (
                        <li key={index} className="text-yellow-600">{area}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-between mt-6 navigation-buttons">
              <Button 
                onClick={() => router.back()}
                variant="outline"
              >
                Back
              </Button>
              
              <Button 
                onClick={handleNextPhrase}
                variant="primary"
              >
                Next Phrase
              </Button>
            </div>
          </Card>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 tips">
            <h3 className="mb-2 text-lg font-semibold text-blue-800">Tips for Better Pronunciation</h3>
            <ul className="pl-5 list-disc text-blue-700">
              <li>Listen carefully to the native pronunciation first</li>
              <li>Pay attention to your mouth position and tongue placement</li>
              <li>Practice the difficult sounds in isolation before the full phrase</li>
              <li>Record yourself and compare with the native audio</li>
              <li>Be patient - pronunciation takes time to master!</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}