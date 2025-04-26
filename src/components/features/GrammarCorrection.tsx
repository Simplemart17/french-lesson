import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';

interface GrammarCorrectionProps {
  initialText?: string;
  onSave?: (correctedText: string) => void;
}

interface CorrectionResult {
  original: string;
  corrected: string;
  explanation: string;
  severity: 'error' | 'warning' | 'suggestion';
}

const GrammarCorrection: React.FC<GrammarCorrectionProps> = ({
  initialText = '',
  onSave
}) => {
  const [text, setText] = useState(initialText);
  const [isChecking, setIsChecking] = useState(false);
  const [corrections, setCorrections] = useState<CorrectionResult[]>([]);
  const [correctedText, setCorrectedText] = useState('');
  const [showCorrected, setShowCorrected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check grammar
  const checkGrammar = async () => {
    if (!text.trim()) {
      setError('Please enter some text to check.');
      return;
    }

    setIsChecking(true);
    setError(null);
    
    try {
      // In a real app, this would call an API endpoint
      // For now, we'll simulate some corrections
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate grammar checking with some common French errors
      const simulatedCorrections: CorrectionResult[] = [];
      
      // Check for common errors
      if (text.includes('je suis allé au France')) {
        simulatedCorrections.push({
          original: 'je suis allé au France',
          corrected: 'je suis allé en France',
          explanation: 'France is feminine, so use "en France" instead of "au France".',
          severity: 'error'
        });
      }
      
      if (text.includes('j\'ai mangé un pomme')) {
        simulatedCorrections.push({
          original: 'j\'ai mangé un pomme',
          corrected: 'j\'ai mangé une pomme',
          explanation: '"Pomme" is feminine, so use "une pomme" instead of "un pomme".',
          severity: 'error'
        });
      }
      
      if (text.includes('je suis fatigué') && text.toLowerCase().includes('je suis une femme')) {
        simulatedCorrections.push({
          original: 'je suis fatigué',
          corrected: 'je suis fatiguée',
          explanation: 'Add an "e" at the end of "fatigué" when a woman is speaking.',
          severity: 'error'
        });
      }
      
      if (text.includes('j\'ai visité Paris hier soir')) {
        simulatedCorrections.push({
          original: 'j\'ai visité Paris hier soir',
          corrected: 'j\'ai visité Paris hier soir',
          explanation: 'This sentence is correct! Good job using the passé composé correctly.',
          severity: 'suggestion'
        });
      }
      
      // If no specific errors found, add some general feedback
      if (simulatedCorrections.length === 0) {
        // Look for basic verb conjugation errors
        if (text.includes('je va')) {
          simulatedCorrections.push({
            original: 'je va',
            corrected: 'je vais',
            explanation: 'The correct conjugation of "aller" with "je" is "je vais".',
            severity: 'error'
          });
        }
        
        if (text.includes('tu as mangé') && !text.includes('?')) {
          simulatedCorrections.push({
            original: 'tu as mangé',
            corrected: 'tu as mangé ?',
            explanation: 'If this is a question, add a question mark at the end.',
            severity: 'warning'
          });
        }
      }
      
      // If still no corrections, provide a generic response
      if (simulatedCorrections.length === 0) {
        setError('No specific grammar issues found. For more detailed feedback, try adding more text or using more complex sentences.');
      } else {
        setCorrections(simulatedCorrections);
        
        // Create corrected text
        let newText = text;
        simulatedCorrections.forEach(correction => {
          if (correction.severity === 'error') {
            newText = newText.replace(correction.original, correction.corrected);
          }
        });
        
        setCorrectedText(newText);
      }
    } catch (err) {
      console.error('Error checking grammar:', err);
      setError('Failed to check grammar. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  // Apply all corrections
  const applyAllCorrections = () => {
    setShowCorrected(true);
    setText(correctedText);
  };

  // Save corrected text
  const handleSave = () => {
    if (onSave) {
      onSave(showCorrected ? correctedText : text);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">French Grammar Checker</h2>
      
      <div className="mb-4">
        <label htmlFor="grammar-text" className="block mb-2 text-sm font-medium text-gray-700">
          Enter your French text:
        </label>
        <textarea
          id="grammar-text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setCorrections([]);
            setError(null);
            setShowCorrected(false);
          }}
          className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          placeholder="Type or paste your French text here..."
        />
      </div>
      
      <div className="flex justify-between mb-6">
        <Button
          onClick={checkGrammar}
          disabled={isChecking || !text.trim()}
          className="flex items-center"
        >
          {isChecking ? (
            <>
              <LoadingState size="small" />
              <span className="ml-2">Checking...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Check Grammar
            </>
          )}
        </Button>
        
        {corrections.length > 0 && (
          <Button
            variant="outline"
            onClick={applyAllCorrections}
            disabled={isChecking}
          >
            Apply All Corrections
          </Button>
        )}
      </div>
      
      {error && (
        <div className="p-4 mb-6 text-yellow-800 bg-yellow-50 rounded-lg">
          <div className="flex">
            <svg className="w-5 h-5 mr-2 text-yellow-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
      
      {corrections.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-medium text-gray-800">Corrections:</h3>
          <div className="space-y-4">
            {corrections.map((correction, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg ${
                  correction.severity === 'error' 
                    ? 'bg-red-50 border border-red-200' 
                    : correction.severity === 'warning'
                    ? 'bg-yellow-50 border border-yellow-200'
                    : 'bg-blue-50 border border-blue-200'
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {correction.severity === 'error' ? (
                      <svg className="w-5 h-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    ) : correction.severity === 'warning' ? (
                      <svg className="w-5 h-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div>
                        <div className="text-sm font-medium text-gray-700">Original:</div>
                        <div className={`mt-1 text-sm ${correction.severity === 'error' ? 'text-red-800' : 'text-gray-800'}`}>
                          {correction.original}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">Corrected:</div>
                        <div className="mt-1 text-sm text-green-800">
                          {correction.corrected}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      {correction.explanation}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {onSave && (
        <div className="flex justify-end">
          <Button onClick={handleSave}>
            Save Text
          </Button>
        </div>
      )}
    </div>
  );
};

export default GrammarCorrection;
