import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import InteractiveLesson, { Lesson } from '@/components/features/InteractiveLesson';
import { useAuth } from '@/context/AuthContext';

// Sample lesson data
const sampleLessons: Record<string, Lesson> = {
  '1': {
    id: '1',
    title: 'Basic Greetings in French',
    description: 'Learn essential greetings and introductions in French to start conversations confidently.',
    level: 'beginner',
    category: 'conversation',
    duration: 15,
    sections: [
      {
        id: 'intro',
        type: 'text',
        title: 'Introduction',
        content: `
          <p>Welcome to your first French lesson! In this lesson, you'll learn the most common greetings in French.</p>
          <p>Being able to greet people properly is essential for any conversation. Let's start with the basics.</p>
        `
      },
      {
        id: 'formal-greetings',
        type: 'text',
        title: 'Formal Greetings',
        content: `
          <h3>Formal Greetings</h3>
          <p>When meeting someone in a formal context, use these expressions:</p>
          <ul>
            <li><strong>Bonjour</strong> - Hello/Good day</li>
            <li><strong>Bonsoir</strong> - Good evening</li>
            <li><strong>Au revoir</strong> - Goodbye</li>
            <li><strong>Enchanté(e)</strong> - Nice to meet you</li>
          </ul>
          <p>Note: Add an "e" to "Enchanté" if you are female.</p>
        `
      },
      {
        id: 'informal-greetings',
        type: 'text',
        title: 'Informal Greetings',
        content: `
          <h3>Informal Greetings</h3>
          <p>With friends and family, you can use these more casual expressions:</p>
          <ul>
            <li><strong>Salut</strong> - Hi/Bye</li>
            <li><strong>Coucou</strong> - Hey (very informal)</li>
            <li><strong>À plus tard</strong> - See you later</li>
            <li><strong>À bientôt</strong> - See you soon</li>
          </ul>
        `
      },
      {
        id: 'audio-practice',
        type: 'audio',
        title: 'Pronunciation Practice',
        content: `
          <p>Listen to the following audio to practice your pronunciation:</p>
        `,
        audioUrl: 'https://example.com/audio/greetings.mp3' // This is a placeholder URL
      },
      {
        id: 'exercise-1',
        type: 'exercise',
        title: 'Practice Exercise',
        content: `<p>Let's test your understanding with a simple exercise:</p>`,
        exercise: {
          type: 'multiple-choice',
          question: 'How would you greet someone in the evening in a formal context?',
          options: ['Bonjour', 'Salut', 'Bonsoir', 'Coucou'],
          correctAnswer: 'Bonsoir',
          explanation: 'Bonsoir is used as a formal greeting in the evening, while Bonjour is used during the day.'
        }
      },
      {
        id: 'exercise-2',
        type: 'exercise',
        title: 'Translation Exercise',
        content: `<p>Translate the following phrase to French:</p>`,
        exercise: {
          type: 'translation',
          question: 'How do you say "Nice to meet you" (to a man) in French?',
          correctAnswer: ['Enchanté', 'Je suis enchanté de faire votre connaissance'],
          explanation: 'Enchanté is the most common way to say "Nice to meet you" in French.'
        }
      },
      {
        id: 'conclusion',
        type: 'text',
        title: 'Conclusion',
        content: `
          <p>Great job! You've learned the basic greetings in French.</p>
          <p>Remember to practice these phrases regularly. In the next lesson, we'll learn how to introduce yourself and ask basic questions.</p>
        `
      }
    ],
    vocabulary: [
      {
        word: 'Bonjour',
        translation: 'Hello/Good day',
        pronunciation: '/bɔ̃.ʒuʁ/'
      },
      {
        word: 'Bonsoir',
        translation: 'Good evening',
        pronunciation: '/bɔ̃.swaʁ/'
      },
      {
        word: 'Au revoir',
        translation: 'Goodbye',
        pronunciation: '/o.ʁə.vwaʁ/'
      },
      {
        word: 'Enchanté(e)',
        translation: 'Nice to meet you',
        pronunciation: '/ɑ̃.ʃɑ̃.te/'
      },
      {
        word: 'Salut',
        translation: 'Hi/Bye (informal)',
        pronunciation: '/sa.ly/'
      },
      {
        word: 'À bientôt',
        translation: 'See you soon',
        pronunciation: '/a.bjɛ̃.to/'
      }
    ]
  },
  '2': {
    id: '2',
    title: 'Introducing Yourself in French',
    description: 'Learn how to introduce yourself and ask basic personal questions in French.',
    level: 'beginner',
    category: 'conversation',
    duration: 20,
    sections: [
      {
        id: 'intro',
        type: 'text',
        title: 'Introduction',
        content: `
          <p>Welcome to your second French lesson! Now that you know how to greet people, let's learn how to introduce yourself.</p>
        `
      },
      {
        id: 'basic-intro',
        type: 'text',
        title: 'Basic Introductions',
        content: `
          <h3>Basic Phrases for Introducing Yourself</h3>
          <ul>
            <li><strong>Je m'appelle...</strong> - My name is...</li>
            <li><strong>Je suis...</strong> - I am...</li>
            <li><strong>Comment vous appelez-vous?</strong> - What is your name? (formal)</li>
            <li><strong>Comment tu t'appelles?</strong> - What is your name? (informal)</li>
            <li><strong>D'où venez-vous?</strong> - Where are you from? (formal)</li>
            <li><strong>D'où viens-tu?</strong> - Where are you from? (informal)</li>
            <li><strong>Je viens de...</strong> - I am from...</li>
          </ul>
        `
      },
      {
        id: 'exercise-1',
        type: 'exercise',
        title: 'Practice Exercise',
        content: `<p>Let's practice what you've learned:</p>`,
        exercise: {
          type: 'multiple-choice',
          question: 'How would you ask someone their name in an informal setting?',
          options: [
            'Comment vous appelez-vous?', 
            'Comment tu t\'appelles?', 
            'D\'où venez-vous?', 
            'Je m\'appelle'
          ],
          correctAnswer: 'Comment tu t\'appelles?',
          explanation: 'In informal settings, you use "tu" instead of "vous" and the corresponding verb form.'
        }
      }
    ],
    vocabulary: [
      {
        word: 'Je m\'appelle',
        translation: 'My name is',
        pronunciation: '/ʒə.ma.pɛl/'
      },
      {
        word: 'Je suis',
        translation: 'I am',
        pronunciation: '/ʒə.sɥi/'
      },
      {
        word: 'D\'où',
        translation: 'From where',
        pronunciation: '/du/'
      },
      {
        word: 'Je viens de',
        translation: 'I come from',
        pronunciation: '/ʒə.vjɛ̃.də/'
      }
    ]
  }
};

export default function LessonPage() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated, user } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      // In a real app, this would be an API call
      setIsLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        const lessonData = sampleLessons[id as string];
        setLesson(lessonData || null);
        setIsLoading(false);
      }, 500);
    }
  }, [id]);
  
  const handleLessonComplete = () => {
    // In a real app, this would update the user's progress
    console.log('Lesson completed!');
    
    // Simulate saving progress
    alert('Congratulations! Your progress has been saved.');
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-primary-600"></div>
      </div>
    );
  }
  
  if (!lesson) {
    return (
      <div className="max-w-4xl px-4 py-8 mx-auto">
        <Card className="p-8 text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-800">Lesson Not Found</h1>
          <p className="mb-6 text-gray-600">
            Sorry, the lesson you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/lessons">
            <Button>
              Back to Lessons
            </Button>
          </Link>
        </Card>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>{lesson.title} | French Tutor AI</title>
        <meta name="description" content={lesson.description} />
      </Head>
      
      <div className="max-w-4xl px-4 py-8 mx-auto">
        <div className="mb-8">
          <div className="flex flex-col mb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Link href="/lessons" className="inline-flex items-center mb-2 text-primary-600 hover:text-primary-700">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Lessons
              </Link>
              <h1 className="text-3xl font-bold text-gray-800">{lesson.title}</h1>
            </div>
            
            <div className="flex items-center mt-4 space-x-4 md:mt-0">
              <div className="px-3 py-1 text-sm font-medium rounded-full bg-primary-100 text-primary-800">
                {lesson.level.charAt(0).toUpperCase() + lesson.level.slice(1)}
              </div>
              <div className="px-3 py-1 text-sm font-medium text-gray-800 bg-gray-100 rounded-full">
                {lesson.duration} min
              </div>
            </div>
          </div>
          
          <p className="mb-6 text-lg text-gray-600">
            {lesson.description}
          </p>
          
          {!isAuthenticated && (
            <div className="p-4 mb-6 border border-yellow-200 rounded-lg bg-yellow-50">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Sign in to track your progress
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Create an account or sign in to save your progress and access all features.
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="flex space-x-3">
                      <Link href="/login">
                        <Button size="sm" variant="secondary">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button size="sm" variant="outline">
                          Create Account
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <InteractiveLesson 
          lesson={lesson}
          onComplete={handleLessonComplete}
        />
      </div>
    </>
  );
}
