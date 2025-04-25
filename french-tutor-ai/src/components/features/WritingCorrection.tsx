import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface WritingCorrectionProps {
  initialText?: string;
  onSubmit?: (text: string) => void;
  className?: string;
}

interface WritingTopic {
  id: string;
  title: string;
  prompt: string;
}

interface Correction {
  original: string;
  corrected: string;
  explanation: string;
}

const WritingCorrection = ({
  initialText = '',
  onSubmit,
  className = '',
}: WritingCorrectionProps) => {
  const [text, setText] = useState(initialText);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [showTopics, setShowTopics] = useState(false);

  // Sample writing topics
  const writingTopics: WritingTopic[] = [
    { id: 'daily', title: 'Daily Life', prompt: 'Décrivez votre routine quotidienne.' },
    { id: 'travel', title: 'Travel', prompt: 'Racontez vos dernières vacances.' },
    { id: 'food', title: 'Food', prompt: 'Décrivez votre plat préféré et pourquoi vous l\'aimez.' },
    { id: 'hobby', title: 'Hobbies', prompt: 'Parlez de vos passe-temps favoris.' },
    { id: 'future', title: 'Future Plans', prompt: 'Quels sont vos projets pour l\'avenir?' },
  ];

  const handleSubmit = async () => {
    if (!text.trim()) return;

    setIsSubmitting(true);

    // This is a more comprehensive mock implementation of a writing correction service
    // In a real app, this would be an API call to a backend service
    setTimeout(() => {
      // Enhanced mock corrections based on common French mistakes
      const commonMistakes = [
        // Articles and prepositions
        {
          pattern: /au le/gi,
          corrected: 'au',
          explanation: 'When "à" combines with "le", it becomes "au". You don\'t need to say "au le".',
          category: 'grammar',
        },
        {
          pattern: /a le/gi,
          corrected: 'au',
          explanation: 'When "à" combines with "le", it becomes "au".',
          category: 'grammar',
        },
        {
          pattern: /de le/gi,
          corrected: 'du',
          explanation: 'When "de" combines with "le", it becomes "du".',
          category: 'grammar',
        },
        {
          pattern: /a la/gi,
          corrected: 'à la',
          explanation: 'The preposition "à" needs an accent.',
          category: 'spelling',
        },

        // Verb conjugations
        {
          pattern: /j'ai acheter/gi,
          corrected: 'j\'ai acheté',
          explanation: 'After "avoir" in passé composé, use the past participle (acheté) not the infinitive (acheter).',
          category: 'grammar',
        },
        {
          pattern: /je suis alle/gi,
          corrected: 'je suis allé',
          explanation: 'The past participle of "aller" needs an accent: allé',
          category: 'spelling',
        },
        {
          pattern: /j'ai alle/gi,
          corrected: 'je suis allé',
          explanation: 'The verb "aller" uses "être" as its auxiliary verb in passé composé, not "avoir".',
          category: 'grammar',
        },
        {
          pattern: /je suis parti(r)/gi,
          corrected: 'je suis parti',
          explanation: 'The past participle of "partir" is "parti", not "partir".',
          category: 'grammar',
        },

        // Accents and spelling
        {
          pattern: /tres/gi,
          corrected: 'très',
          explanation: 'The word "très" requires an accent.',
          category: 'spelling',
        },
        {
          pattern: /etre/gi,
          corrected: 'être',
          explanation: 'The word "être" requires a circumflex accent.',
          category: 'spelling',
        },
        {
          pattern: /francais/gi,
          corrected: 'français',
          explanation: 'The word "français" requires a cedilla (ç) and an accent.',
          category: 'spelling',
        },

        // Gender agreement
        {
          pattern: /une (homme|garçon|père|frère)/gi,
          corrected: (match: string) => `un ${match.substring(4)}`,
          explanation: 'These nouns are masculine, so they need the masculine article "un" instead of "une".',
          category: 'grammar',
        },
        {
          pattern: /un (femme|fille|mère|soeur)/gi,
          corrected: (match: string) => `une ${match.substring(3)}`,
          explanation: 'These nouns are feminine, so they need the feminine article "une" instead of "un".',
          category: 'grammar',
        },

        // Adjective agreement
        {
          pattern: /(la|une) petit/gi,
          corrected: (match: string) => `${match.substring(0, match.length - 5)}petite`,
          explanation: 'Adjectives must agree with the gender of the noun. Since the noun is feminine, the adjective should be "petite".',
          category: 'grammar',
        },
        {
          pattern: /(le|un) grande/gi,
          corrected: (match: string) => `${match.substring(0, match.length - 6)}grand`,
          explanation: 'Adjectives must agree with the gender of the noun. Since the noun is masculine, the adjective should be "grand".',
          category: 'grammar',
        },

        // Common vocabulary mistakes
        {
          pattern: /attendre pour/gi,
          corrected: 'attendre',
          explanation: 'In French, "attendre" is used without "pour". The correct form is simply "attendre quelque chose".',
          category: 'vocabulary',
        },
        {
          pattern: /regarder la télévision/gi,
          corrected: 'regarder la télé',
          explanation: 'While "regarder la télévision" is grammatically correct, French speakers more commonly say "regarder la télé".',
          category: 'vocabulary',
        },
      ];

      // Generate corrections based on the text
      const foundCorrections: Correction[] = [];

      // Process each mistake pattern
      commonMistakes.forEach(mistake => {
        const matches = text.match(mistake.pattern);
        if (matches) {
          matches.forEach(match => {
            const corrected = typeof mistake.corrected === 'function'
              ? mistake.corrected(match)
              : mistake.corrected;

            foundCorrections.push({
              original: match,
              corrected: corrected,
              explanation: mistake.explanation,
            });
          });
        }
      });

      // Check for sentence structure issues (simplified)
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      sentences.forEach(sentence => {
        // Check for subject-verb-object order
        const trimmedSentence = sentence.trim().toLowerCase();
        if (trimmedSentence.length > 10 && !trimmedSentence.match(/je|tu|il|elle|nous|vous|ils|elles|on/i)) {
          foundCorrections.push({
            original: sentence.trim(),
            corrected: sentence.trim(), // No specific correction, just highlighting
            explanation: 'This sentence might be missing a subject. In French, sentences typically need an explicit subject.',
          });
        }
      });

      // Add contextual feedback based on the writing topic
      if (selectedTopic) {
        const topic = writingTopics.find(t => t.id === selectedTopic);
        if (topic) {
          // Topic-specific feedback
          switch (topic.id) {
            case 'daily':
              if (!text.match(/je me lève|je me réveille|je prends|je vais|je fais/gi)) {
                foundCorrections.push({
                  original: '',
                  corrected: '',
                  explanation: 'When describing your daily routine, try using present tense verbs and time expressions like "d\'abord" (first), "ensuite" (then), "après" (after), etc.',
                });
              }
              break;
            case 'travel':
              if (!text.match(/j'ai visité|je suis allé|nous avons|j'ai vu/gi)) {
                foundCorrections.push({
                  original: '',
                  corrected: '',
                  explanation: 'When talking about past travels, use the passé composé tense for completed actions. Consider including descriptions of places, activities, and your impressions.',
                });
              }
              break;
            case 'food':
              if (!text.match(/j'aime|je préfère|c'est délicieux|saveur|goût/gi)) {
                foundCorrections.push({
                  original: '',
                  corrected: '',
                  explanation: 'When describing food, consider using sensory vocabulary (saveur, goût, texture) and expressions of preference (j\'aime, je préfère, mon plat préféré est...).',
                });
              }
              break;
          }
        }
      }

      // If no mistakes found, provide a positive feedback
      if (foundCorrections.length === 0 && text.length > 10) {
        // Add a placeholder correction with positive feedback
        foundCorrections.push({
          original: '',
          corrected: '',
          explanation: 'Excellent! Your writing looks good. Your grammar and vocabulary usage are appropriate. Keep practicing to improve further.',
        });
      }

      // Sort corrections to show grammar issues first
      foundCorrections.sort((a, b) => {
        // Empty originals (positive feedback) should come last
        if (!a.original) return 1;
        if (!b.original) return -1;
        return 0;
      });

      setCorrections(foundCorrections);
      setIsSubmitting(false);

      if (onSubmit) {
        onSubmit(text);
      }
    }, 1500);
  };

  const handleSelectTopic = (topicId: string) => {
    const topic = writingTopics.find(t => t.id === topicId);
    setSelectedTopic(topicId);
    setShowTopics(false);
    setCorrections([]);
  };

  const getSelectedTopic = () => {
    return writingTopics.find(topic => topic.id === selectedTopic);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col space-y-4">
        {/* Topic Selection */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowTopics(!showTopics)}
              className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              {showTopics ? 'Hide Writing Topics' : 'Show Writing Topics'}
              <svg className={`w-4 h-4 ml-1 transition-transform ${showTopics ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {selectedTopic && (
              <button
                onClick={() => {
                  setSelectedTopic(null);
                  setText('');
                  setCorrections([]);
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear Topic
              </button>
            )}
          </div>

          {showTopics && (
            <div className="p-4 mt-3 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="mb-2 text-sm font-medium text-gray-700">Select a topic to practice:</h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                {writingTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleSelectTopic(topic.id)}
                    className={`p-2 rounded-md text-left transition-colors ${selectedTopic === topic.id
                      ? 'bg-primary-100 border border-primary-300'
                      : 'bg-white border border-gray-200 hover:bg-gray-100'}`}
                  >
                    <h4 className="text-sm font-medium text-gray-800">{topic.title}</h4>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedTopic && (
            <div className="p-3 mt-3 border border-blue-100 rounded-lg bg-blue-50">
              <h3 className="mb-1 text-sm font-medium text-blue-800">Writing Prompt:</h3>
              <p className="text-blue-700">{getSelectedTopic()?.prompt}</p>
            </div>
          )}
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your French text here..."
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          rows={6}
        />

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {text.length > 0 ? `${text.length} characters` : ''}
          </div>
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={!text.trim() || isSubmitting}
          >
            Check My Writing
          </Button>
        </div>

        {corrections.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Feedback</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {corrections.filter(c => c.original).length} {corrections.filter(c => c.original).length === 1 ? 'correction' : 'corrections'}
                </span>
                <div className="w-px h-6 bg-gray-300"></div>
                <div className="flex items-center">
                  <span className={`inline-block w-2 h-2 rounded-full ${corrections.filter(c => c.original).length > 0 ? 'bg-yellow-500' : 'bg-green-500'} mr-1`}></span>
                  <span className="text-sm font-medium">
                    {corrections.filter(c => c.original).length === 0 ? 'Perfect!' : corrections.filter(c => c.original).length <= 2 ? 'Good' : 'Needs work'}
                  </span>
                </div>
              </div>
            </div>

            {/* Corrections */}
            <div className="space-y-4">
              {corrections.map((correction, index) => (
                <Card
                  key={index}
                  variant={correction.original ? "primary" : "success"}
                  className="overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  <div className="-m-5">
                    {correction.original ? (
                      <>
                        <div className="p-5 border-b border-primary-200 bg-primary-100">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 p-1 mr-3 bg-white rounded-full shadow-sm">
                              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </div>
                            <div>
                              <div className="flex items-center mb-1">
                                <span className="mr-2 text-xs font-medium tracking-wide text-gray-500 uppercase">Original</span>
                                <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">Incorrect</span>
                              </div>
                              <p className="font-medium text-gray-700">{correction.original}</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-5 bg-white border-b border-primary-200">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 p-1 mr-3 rounded-full shadow-sm bg-green-50">
                              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div>
                              <div className="flex items-center mb-1">
                                <span className="mr-2 text-xs font-medium tracking-wide text-gray-500 uppercase">Correction</span>
                                <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">Correct</span>
                              </div>
                              <p className="font-medium text-gray-700">{correction.corrected}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="p-5 bg-green-100 border-b border-green-200">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 p-1 mr-3 bg-white rounded-full shadow-sm">
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <div className="flex items-center mb-1">
                              <span className="mr-2 text-xs font-medium tracking-wide text-gray-500 uppercase">Overall Assessment</span>
                              <span className="px-2 py-0.5 text-xs rounded-full bg-green-200 text-green-800">Good job!</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className={`p-5 ${correction.original ? 'bg-primary-50' : 'bg-green-50'}`}>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-xs font-medium tracking-wide text-gray-500 uppercase">Explanation</span>
                          <p className="mt-1 text-gray-700">{correction.explanation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Writing Tips */}
            <div className="p-5 mt-6 border border-blue-100 shadow-sm bg-blue-50 rounded-xl">
              <div className="flex items-start">
                <div className="flex-shrink-0 p-2 mr-3 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h4 className="mb-3 text-lg font-semibold text-blue-800">Writing Tips</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 mr-2 text-white bg-blue-500 rounded-full">1</span>
                      <span className="text-blue-800">Use accents correctly (é, è, ê, ç) as they can change word meanings</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 mr-2 text-white bg-blue-500 rounded-full">2</span>
                      <span className="text-blue-800">Remember that adjectives must agree in gender and number with nouns</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 mr-2 text-white bg-blue-500 rounded-full">3</span>
                      <span className="text-blue-800">Pay attention to verb conjugations, especially in past tenses</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 mr-2 text-white bg-blue-500 rounded-full">4</span>
                      <span className="text-blue-800">Practice regularly to improve your fluency and confidence</span>
                    </li>
                  </ul>

                  <div className="pt-4 mt-4 border-t border-blue-200">
                    <p className="text-sm text-blue-700">
                      <strong>Pro Tip:</strong> Try reading your text aloud to catch errors and improve your pronunciation at the same time.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end mt-4 space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setText('');
                  setCorrections([]);
                }}
              >
                Clear & Start Over
              </Button>
              <Button
                onClick={() => {
                  // In a real app, this would save the writing to the user's history
                  alert('Your writing has been saved to your practice history!');
                }}
              >
                Save to My Practice
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WritingCorrection;