import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export interface LessonSection {
  id: string;
  type: 'text' | 'image' | 'audio' | 'video' | 'exercise';
  title?: string;
  content: string;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  exercise?: Exercise;
}

export interface Exercise {
  type: 'multiple-choice' | 'fill-in-blank' | 'matching' | 'translation' | 'reorder' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  pairs?: {
    left: string;
    right: string;
  }[];
  sentences?: string[];
  audioUrl?: string;
  imageUrl?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  duration: number; // in minutes
  sections: LessonSection[];
  vocabulary?: {
    word: string;
    translation: string;
    pronunciation?: string;
  }[];
}

interface InteractiveLessonProps {
  lesson: Lesson;
  onComplete?: (score: number) => void;
  onSubmitAnswers?: (answers: Record<number, string | string[]>) => Promise<any>;
  initialProgress?: { completed: boolean; score: number } | null;
}

const InteractiveLesson = ({
  lesson,
  onComplete,
  onSubmitAnswers,
  initialProgress
}: InteractiveLessonProps) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string | string[]>>({});
  const [apiAnswers, setApiAnswers] = useState<Record<number, string | string[]>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(initialProgress?.completed || false);
  const [score, setScore] = useState(initialProgress?.score || 0);
  const [submitting, setSubmitting] = useState(false);

  const currentSection = lesson.sections[currentSectionIndex];
  const totalSections = lesson.sections.length;
  const progress = ((currentSectionIndex + 1) / totalSections) * 100;

  const handleNextSection = () => {
    if (currentSectionIndex < totalSections - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setShowExplanation(false);
    } else {
      // Calculate score based on correct answers
      const correctCount = Object.keys(userAnswers).filter(sectionId => {
        const section = lesson.sections.find(s => s.id === sectionId);
        if (!section || !section.exercise) return false;

        const userAnswer = userAnswers[sectionId];
        const correctAnswer = section.exercise.correctAnswer;

        if (Array.isArray(correctAnswer)) {
          if (!Array.isArray(userAnswer)) return false;
          return correctAnswer.every(answer => userAnswer.includes(answer));
        }

        return userAnswer === correctAnswer;
      }).length;

      const totalExercises = lesson.sections.filter(s => s.exercise).length;
      const calculatedScore = totalExercises > 0 ? Math.round((correctCount / totalExercises) * 100) : 100;

      setScore(calculatedScore);
      setIsCompleted(true);

      // Submit answers to API if available
      if (onSubmitAnswers && Object.keys(apiAnswers).length > 0) {
        onSubmitAnswers(apiAnswers);
      }

      // Call onComplete with the calculated score
      if (onComplete) {
        onComplete(calculatedScore);
      }
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      setShowExplanation(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setUserAnswers({
      ...userAnswers,
      [currentSection.id]: answer,
    });

    // Also store the answer in the format expected by the API
    if (currentSection.exercise) {
      // Convert section ID to exercise ID for API
      const exerciseId = parseInt(currentSection.id, 10);
      if (!isNaN(exerciseId)) {
        setApiAnswers({
          ...apiAnswers,
          [exerciseId]: answer,
        });
      }
    }
  };

  const checkAnswer = async () => {
    setShowExplanation(true);

    // If we have an API submission handler and this is an exercise, submit the answer
    if (onSubmitAnswers && currentSection.exercise) {
      const exerciseId = parseInt(currentSection.id, 10);
      if (!isNaN(exerciseId) && userAnswers[currentSection.id]) {
        setSubmitting(true);
        try {
          // Submit just this answer
          const result = await onSubmitAnswers({
            [exerciseId]: userAnswers[currentSection.id]
          });

          // Update the score if we got a result
          if (result && typeof result.score === 'number') {
            setScore(result.score);
          }
        } catch (error) {
          console.error('Error submitting answer:', error);
        } finally {
          setSubmitting(false);
        }
      }
    }
  };

  const isAnswerCorrect = () => {
    if (!currentSection.exercise) return false;

    const userAnswer = userAnswers[currentSection.id];
    const correctAnswer = currentSection.exercise.correctAnswer;

    if (Array.isArray(correctAnswer)) {
      if (!Array.isArray(userAnswer)) return false;
      return correctAnswer.every(answer => userAnswer.includes(answer));
    }

    return userAnswer === correctAnswer;
  };

  const renderExercise = () => {
    if (!currentSection.exercise) return null;

    const { exercise } = currentSection;

    switch (exercise.type) {
      case 'multiple-choice':
        return (
          <div className="mt-6">
            <h3 className="mb-4 text-lg font-medium text-gray-800">{exercise.question}</h3>
            <div className="space-y-3">
              {exercise.options?.map((option, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="radio"
                    id={`option-${index}`}
                    name={`exercise-${currentSection.id}`}
                    value={option}
                    checked={userAnswers[currentSection.id] === option}
                    onChange={() => handleAnswerSelect(option)}
                    className="w-4 h-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                    disabled={showExplanation}
                  />
                  <label htmlFor={`option-${index}`} className="block ml-3 text-gray-700">
                    {option}
                  </label>
                </div>
              ))}
            </div>

            {!showExplanation ? (
              <Button onClick={checkAnswer} className="mt-6" disabled={!userAnswers[currentSection.id]}>
                Check Answer
              </Button>
            ) : (
              <div className={`mt-6 p-4 rounded-lg ${isAnswerCorrect() ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {isAnswerCorrect() ? (
                      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${isAnswerCorrect() ? 'text-green-800' : 'text-red-800'}`}>
                      {isAnswerCorrect() ? 'Correct!' : 'Incorrect'}
                    </h3>
                    <div className={`mt-2 text-sm ${isAnswerCorrect() ? 'text-green-700' : 'text-red-700'}`}>
                      {exercise.explanation || (
                        isAnswerCorrect()
                          ? 'Great job!'
                          : `The correct answer is: ${Array.isArray(exercise.correctAnswer) ? exercise.correctAnswer.join(', ') : exercise.correctAnswer}`
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'translation':
        return (
          <div className="mt-6">
            <h3 className="mb-4 text-lg font-medium text-gray-800">{exercise.question}</h3>
            <div>
              <input
                type="text"
                value={userAnswers[currentSection.id] as string || ''}
                onChange={(e) => handleAnswerSelect(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="Type your answer here"
                disabled={showExplanation}
              />
            </div>

            {!showExplanation ? (
              <Button onClick={checkAnswer} className="mt-6" disabled={!userAnswers[currentSection.id]}>
                Check Answer
              </Button>
            ) : (
              <div className={`mt-6 p-4 rounded-lg ${isAnswerCorrect() ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {isAnswerCorrect() ? (
                      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${isAnswerCorrect() ? 'text-green-800' : 'text-red-800'}`}>
                      {isAnswerCorrect() ? 'Correct!' : 'Incorrect'}
                    </h3>
                    <div className={`mt-2 text-sm ${isAnswerCorrect() ? 'text-green-700' : 'text-red-700'}`}>
                      {exercise.explanation || (
                        isAnswerCorrect()
                          ? 'Great job!'
                          : `The correct answer is: ${Array.isArray(exercise.correctAnswer) ? exercise.correctAnswer.join(' or ') : exercise.correctAnswer}`
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="mt-6">
            <p className="text-gray-600">Exercise type not supported yet.</p>
          </div>
        );
    }
  };

  const renderSectionContent = () => {
    switch (currentSection.type) {
      case 'text':
        return (
          <div className="prose prose-primary max-w-none">
            <div dangerouslySetInnerHTML={{ __html: currentSection.content }} />
          </div>
        );

      case 'image':
        return (
          <div>
            <div className="mb-4 prose prose-primary max-w-none">
              <div dangerouslySetInnerHTML={{ __html: currentSection.content }} />
            </div>
            {currentSection.imageUrl && (
              <div className="mt-4">
                <img
                  src={currentSection.imageUrl}
                  alt={currentSection.title || 'Lesson image'}
                  className="h-auto max-w-full rounded-lg"
                />
              </div>
            )}
          </div>
        );

      case 'audio':
        return (
          <div>
            <div className="mb-4 prose prose-primary max-w-none">
              <div dangerouslySetInnerHTML={{ __html: currentSection.content }} />
            </div>
            {currentSection.audioUrl && (
              <div className="mt-4">
                <audio
                  controls
                  className="w-full"
                  src={currentSection.audioUrl}
                >
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
        );

      case 'video':
        return (
          <div>
            <div className="mb-4 prose prose-primary max-w-none">
              <div dangerouslySetInnerHTML={{ __html: currentSection.content }} />
            </div>
            {currentSection.videoUrl && (
              <div className="mt-4 aspect-w-16 aspect-h-9">
                <iframe
                  src={currentSection.videoUrl}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-lg"
                ></iframe>
              </div>
            )}
          </div>
        );

      case 'exercise':
        return (
          <div>
            <div className="mb-4 prose prose-primary max-w-none">
              <div dangerouslySetInnerHTML={{ __html: currentSection.content }} />
            </div>
            {renderExercise()}
          </div>
        );

      default:
        return (
          <div className="prose prose-primary max-w-none">
            <div dangerouslySetInnerHTML={{ __html: currentSection.content }} />
          </div>
        );
    }
  };

  if (isCompleted) {
    return (
      <Card className="p-6 text-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">Lesson Completed!</h2>
        <div className="mb-6">
          <div className="inline-block p-4 mb-4 text-3xl font-bold text-white bg-green-600 rounded-full">
            {score}%
          </div>
          <p className="text-gray-600">
            Congratulations on completing the lesson. You've made great progress in your French learning journey.
          </p>
          {score < 70 && (
            <p className="mt-2 text-yellow-600">
              You might want to review this lesson to improve your score.
            </p>
          )}
        </div>
        <div className="flex justify-center space-x-4">
          <Button onClick={() => setIsCompleted(false)}>
            Review Lesson
          </Button>
          <Button variant="outline" onClick={() => window.scrollTo(0, 0)}>
            Back to Top
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-1 text-sm text-gray-600">
          <span>Progress</span>
          <span>{currentSectionIndex + 1} of {totalSections}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <Card className="mb-6">
        <div className="p-6">
          {currentSection.title && (
            <h2 className="mb-4 text-xl font-semibold text-gray-800">{currentSection.title}</h2>
          )}

          {renderSectionContent()}
        </div>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevSection}
          disabled={currentSectionIndex === 0}
        >
          Previous
        </Button>

        <Button
          onClick={handleNextSection}
          disabled={currentSection.type === 'exercise' && !showExplanation}
        >
          {currentSectionIndex === totalSections - 1 ? 'Complete Lesson' : 'Next'}
        </Button>
      </div>

      {/* Vocabulary Section */}
      {lesson.vocabulary && lesson.vocabulary.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">Vocabulary in this Lesson</h3>
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {lesson.vocabulary.map((item, index) => (
                <div key={index} className="flex">
                  <div className="flex-grow p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium text-gray-800">{item.word}</div>
                        {item.pronunciation && (
                          <div className="text-xs text-gray-500">{item.pronunciation}</div>
                        )}
                      </div>
                      <div className="text-gray-600">{item.translation}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveLesson;
