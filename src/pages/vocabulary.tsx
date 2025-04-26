import Head from 'next/head';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import SpacedRepetition, { VocabularyWord } from '@/components/features/SpacedRepetition';
import { vocabularyService } from '@/services/vocabularyService';
import { vocabularyApiService } from '@/services/index';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function VocabularyPage() {
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [studyMode, setStudyMode] = useState<'flashcards' | 'quiz' | 'spaced'>('flashcards');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);
  const [isAddingWord, setIsAddingWord] = useState(false);
  const [newWord, setNewWord] = useState<Partial<VocabularyWord>>({
    word: '',
    translation: '',
    example: '',
    category: 'greetings',
    pronunciation: '',
    level: 'beginner'
  });

  // Load vocabulary from API service
  useEffect(() => {
    const fetchVocabulary = async () => {
      try {
        // First try to get vocabulary from API
        const apiVocabulary = await vocabularyApiService.getVocabulary();

        // Convert API vocabulary to VocabularyWord format
        const convertedVocabulary: VocabularyWord[] = apiVocabulary.map((item, index) => ({
          id: index.toString(),
          word: item.word,
          translation: item.translation,
          example: item.example,
          category: item.category || 'general',
          pronunciation: '', // API doesn't provide pronunciation
          level: item.level === 'A1' || item.level === 'A2' ? 'beginner' :
                 item.level === 'B1' || item.level === 'B2' ? 'intermediate' : 'advanced',
          lastReviewed: item.lastPracticed,
          nextReview: item.nextReview,
          repetitionStage: item.learned ? 3 : 0 // Estimate stage based on learned status
        }));

        if (convertedVocabulary.length > 0) {
          setVocabulary(convertedVocabulary);
        } else {
          // Fallback to local service if API returns empty
          const loadedVocabulary = vocabularyService.getVocabulary();
          setVocabulary(loadedVocabulary);
        }
      } catch (error) {
        console.error('Error fetching vocabulary from API:', error);
        // Fallback to local service
        const loadedVocabulary = vocabularyService.getVocabulary();
        setVocabulary(loadedVocabulary);
      }
    };

    fetchVocabulary();
  }, []);

  // Get unique categories from vocabulary
  const categories = ['all', ...Array.from(new Set(vocabulary.map(word => word.category)))];

  const vocabularyCategories = [
    { id: 'all', name: 'All Categories' },
    { id: 'greetings', name: 'Greetings & Introductions' },
    { id: 'travel', name: 'Travel & Directions' },
    { id: 'food', name: 'Food & Dining' },
    { id: 'shopping', name: 'Shopping' },
    { id: 'business', name: 'Business & Work' },
  ];

  const vocabularyLevels = [
    { id: 'beginner', name: 'Beginner (A1-A2)' },
    { id: 'intermediate', name: 'Intermediate (B1-B2)' },
    { id: 'advanced', name: 'Advanced (C1-C2)' },
  ];

  // Filter vocabulary based on selected category and level
  const filteredVocabulary = vocabulary
    .filter(word => word.level === selectedLevel)
    .filter(word => selectedCategory === 'all' || word.category === selectedCategory);

  const currentWord = filteredVocabulary[currentCardIndex];

  // Handle spaced repetition completion
  const handleSpacedRepetitionComplete = async (reviewedWords: VocabularyWord[]) => {
    try {
      // Update each reviewed word in the API
      const updatePromises = reviewedWords.map(async (word) => {
        try {
          // Update the word in the API
          await vocabularyApiService.updateVocabularyProgress(
            word.word,
            !!word.repetitionStage && word.repetitionStage > 0, // Consider learned if stage > 0
            word.lastReviewed,
            word.nextReview
          );
          return word;
        } catch (error) {
          console.error(`Error updating word "${word.word}" in API:`, error);
          return word;
        }
      });

      // Wait for all updates to complete
      await Promise.all(updatePromises);

      // Update local state
      const updatedVocabulary = vocabularyService.updateVocabularyWords(reviewedWords);
      setVocabulary(updatedVocabulary);
    } catch (error) {
      console.error('Error updating vocabulary progress:', error);
      // Fallback to local service
      const updatedVocabulary = vocabularyService.updateVocabularyWords(reviewedWords);
      setVocabulary(updatedVocabulary);
    }
  };

  // Handle adding a new word
  const handleAddWord = async () => {
    if (!newWord.word || !newWord.translation) return;

    try {
      // First try to add the word to the API
      const apiLevel = newWord.level === 'beginner' ? 'A1' :
                      newWord.level === 'intermediate' ? 'B1' : 'C1';

      await vocabularyApiService.addVocabularyItem(
        newWord.word,
        newWord.translation,
        newWord.example || '',
        apiLevel,
        newWord.category || 'general'
      );

      // Then update local state
      const updatedVocabulary = vocabularyService.addVocabularyWord(newWord as Omit<VocabularyWord, 'id'>);
      setVocabulary(updatedVocabulary);
    } catch (error) {
      console.error('Error adding word to API:', error);
      // Fallback to local service
      const updatedVocabulary = vocabularyService.addVocabularyWord(newWord as Omit<VocabularyWord, 'id'>);
      setVocabulary(updatedVocabulary);
    }

    // Reset form
    setIsAddingWord(false);
    setNewWord({
      word: '',
      translation: '',
      example: '',
      category: 'greetings',
      pronunciation: '',
      level: 'beginner'
    });
  };

  // Get due words count
  const dueWordsCount = vocabulary.filter(word => {
    if (!word.nextReview) return true;
    const reviewDate = new Date(word.nextReview);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return reviewDate <= today;
  }).length;

  const handleNextCard = () => {
    setShowTranslation(false);
    setCurrentCardIndex((currentCardIndex + 1) % filteredVocabulary.length);
  };

  const handlePrevCard = () => {
    setShowTranslation(false);
    setCurrentCardIndex((currentCardIndex - 1 + filteredVocabulary.length) % filteredVocabulary.length);
  };

  const toggleTranslation = () => {
    setShowTranslation(!showTranslation);
  };

  return (
    <>
      <Head>
        <title>Vocabulary Trainer | French Tutor AI</title>
        <meta name="description" content="Learn and practice French vocabulary with flashcards and quizzes" />
      </Head>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">Vocabulary Trainer</h1>
          <p className="text-lg text-gray-600">
            Build your French vocabulary with our interactive flashcards and quizzes.
          </p>
        </div>

        {/* Spaced Repetition Banner */}
        {isAuthenticated && dueWordsCount > 0 && (
          <div className="flex flex-col items-center justify-between p-4 mb-8 border rounded-lg bg-primary-50 border-primary-100 md:flex-row">
            <div>
              <h2 className="mb-1 text-lg font-semibold text-primary-800">
                {dueWordsCount} {dueWordsCount === 1 ? 'word' : 'words'} due for review
              </h2>
              <p className="text-primary-700">
                Review your vocabulary with spaced repetition to improve long-term memory
              </p>
            </div>
            <Button
              onClick={() => setStudyMode('spaced')}
              className="mt-4 md:mt-0"
            >
              Start Review Session
            </Button>
          </div>
        )}

        {/* Filters Section */}
        <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Vocabulary Trainer</h2>
            {isAuthenticated && (
              <Button
                variant="outline"
                onClick={() => setIsAddingWord(!isAddingWord)}
              >
                {isAddingWord ? 'Cancel' : 'Add New Word'}
              </Button>
            )}
          </div>

          {/* Add Word Form */}
          {isAddingWord && (
            <div className="p-4 mb-6 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="mb-4 text-lg font-medium text-gray-800">Add New Vocabulary Word</h3>
              <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    French Word
                  </label>
                  <input
                    type="text"
                    value={newWord.word}
                    onChange={(e) => setNewWord({...newWord, word: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g. Bonjour"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    English Translation
                  </label>
                  <input
                    type="text"
                    value={newWord.translation}
                    onChange={(e) => setNewWord({...newWord, translation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g. Hello"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Example Sentence
                  </label>
                  <input
                    type="text"
                    value={newWord.example}
                    onChange={(e) => setNewWord({...newWord, example: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g. Bonjour, comment allez-vous?"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Pronunciation (optional)
                  </label>
                  <input
                    type="text"
                    value={newWord.pronunciation}
                    onChange={(e) => setNewWord({...newWord, pronunciation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g. /bɔ̃.ʒuʁ/"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    value={newWord.category}
                    onChange={(e) => setNewWord({...newWord, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {vocabularyCategories.filter(c => c.id !== 'all').map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Level
                  </label>
                  <select
                    value={newWord.level}
                    onChange={(e) => setNewWord({...newWord, level: e.target.value as 'beginner' | 'intermediate' | 'advanced'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {vocabularyLevels.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleAddWord}>
                  Add Word
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Category Filter */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-gray-800">Category</h2>
              <div className="flex flex-wrap gap-2">
                {vocabularyCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Level Filter */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-gray-800">Level</h2>
              <div className="flex flex-wrap gap-2">
                {vocabularyLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => {
                      setSelectedLevel(level.id as 'beginner' | 'intermediate' | 'advanced');
                      setCurrentCardIndex(0);
                      setShowTranslation(false);
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedLevel === level.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {level.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Study Mode */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-gray-800">Study Mode</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStudyMode('flashcards')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    studyMode === 'flashcards'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Flashcards
                </button>
                <button
                  onClick={() => setStudyMode('quiz')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    studyMode === 'quiz'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Quiz Mode
                </button>
                {isAuthenticated && (
                  <button
                    onClick={() => setStudyMode('spaced')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      studyMode === 'spaced'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Spaced Repetition
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Flashcard Section */}
        {studyMode === 'flashcards' && filteredVocabulary.length > 0 && (
          <div className="mb-12">
            <div className="overflow-hidden bg-white rounded-lg shadow-lg">
              <div className="p-6 text-center">
                <div className="mb-2 text-sm text-gray-500">
                  Card {currentCardIndex + 1} of {filteredVocabulary.length}
                </div>

                <div
                  className="min-h-[200px] flex flex-col items-center justify-center cursor-pointer"
                  onClick={toggleTranslation}
                >
                  {!showTranslation ? (
                    <>
                      <h2 className="mb-3 text-3xl font-bold text-gray-800">{currentWord.word}</h2>
                      <p className="italic text-gray-500">{currentWord.pronunciation}</p>
                      <p className="mt-4 text-sm text-gray-500">Click to reveal translation</p>
                    </>
                  ) : (
                    <>
                      <h2 className="mb-3 text-3xl font-bold text-gray-800">{currentWord.translation}</h2>
                      <p className="mt-2 text-gray-600">{currentWord.example}</p>
                      <p className="mt-4 text-sm text-gray-500">Click to see word</p>
                    </>
                  )}
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={handlePrevCard}>
                    Previous
                  </Button>
                  <Button onClick={handleNextCard}>
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Mode - Simple Implementation */}
        {studyMode === 'quiz' && (
          <div className="mb-12">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h2 className="mb-6 text-xl font-semibold text-center text-gray-800">
                Quiz Mode Coming Soon!
              </h2>
              <p className="mb-4 text-center text-gray-600">
                We're working on an interactive quiz mode to help you test your vocabulary knowledge.
              </p>
              <div className="flex justify-center">
                <Button onClick={() => setStudyMode('flashcards')}>
                  Return to Flashcards
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Spaced Repetition Mode */}
        {studyMode === 'spaced' && (
          <div className="mb-12">
            {isAuthenticated ? (
              <SpacedRepetition
                words={vocabulary}
                onComplete={handleSpacedRepetitionComplete}
              />
            ) : (
              <div className="p-6 text-center bg-white rounded-lg shadow-lg">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">
                  Sign in to use Spaced Repetition
                </h2>
                <p className="mb-6 text-gray-600">
                  Spaced repetition helps you remember vocabulary more effectively by reviewing words at optimal intervals.
                </p>
                <div className="flex justify-center space-x-4">
                  <Link href="/login">
                    <Button>
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="outline">
                      Create Account
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Vocabulary List Section */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">Vocabulary List</h2>
          <div className="overflow-hidden bg-white rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      French
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      English
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Example
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Category
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVocabulary.map((word, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{word.word}</div>
                        <div className="text-xs text-gray-500">{word.pronunciation}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{word.translation}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{word.example}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 text-xs font-semibold leading-5 text-blue-800 bg-blue-100 rounded-full">
                          {word.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mb-12">
          <div className="p-6 rounded-lg bg-primary-50">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">Vocabulary Learning Tips</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="p-5 bg-white rounded-lg shadow-sm">
                <h3 className="mb-2 text-lg font-semibold text-gray-800">Use Spaced Repetition</h3>
                <p className="text-gray-600">
                  Review words at increasing intervals to improve long-term retention. Start with daily review, then every few days, then weekly.
                </p>
              </div>
              <div className="p-5 bg-white rounded-lg shadow-sm">
                <h3 className="mb-2 text-lg font-semibold text-gray-800">Learn in Context</h3>
                <p className="text-gray-600">
                  Instead of memorizing isolated words, learn them in phrases or sentences to better understand their usage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
