import Head from 'next/head';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import {
  BookOpenIcon,
  PencilIcon,
  LanguageIcon,
  MicrophoneIcon, 
  DocumentTextIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const [selectedLevel, setSelectedLevel] = useState('beginner');
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>French Tutor AI</title>
        <meta name="description" content="Learn French with AI-powered tools" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section with Background */}
      <div className="overflow-hidden relative py-16 mb-12 text-white bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container relative z-10 px-4 mx-auto">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-6xl animate-fadeIn">
              Master French with AI
            </h1>
            <p className="mb-8 text-xl text-gray-300">
              Your personal assistant for learning French from beginner to advanced levels
            </p>

            {/* Language Level Selector */}
            <div className="inline-block p-4 mb-8 rounded-lg backdrop-blur-sm bg-white/10">
              <p className="mb-3 text-white">Select your proficiency level:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['beginner', 'intermediate', 'advanced'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedLevel === level
                      ? 'bg-white text-primary-700 shadow-md'
                      : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <Button size="lg" variant="outline" className="animate-fadeIn animation-delay-100">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Link href={`/lessons?level=${selectedLevel}`}>
                    <Button size="lg" variant="outline" className="text-white border-white bg-white/10 animate-fadeIn animation-delay-200">
                      Continue Learning
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href={`/lessons?level=${selectedLevel}`}>
                    <Button size="lg" variant="outline" className="animate-fadeIn animation-delay-100">
                      Start Learning
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="lg" variant="outline" className="text-white border-white bg-white/10 animate-fadeIn animation-delay-200">
                      Create Free Account
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 mx-auto mb-12 bg-white rounded-lg shadow-md">
        <p className="mb-6 text-lg text-gray-700">
          Welcome to French Tutor AI, an intelligent platform designed to help you master the French language through personalized learning experiences, interactive exercises, and real-time feedback.
        </p>

        <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
          <Link href="/practice" className="block group animate-fadeIn">
            <Card
              variant="primary"
              title="Voice Recognition"
              className="p-5 h-full transition-transform group-hover:scale-105"
            >
              <p className="text-white">Practice your pronunciation with our advanced speech recognition technology.</p>
              <div className="flex items-center mt-4 font-medium text-black">
                Try it now
                <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Card>
          </Link>

          <Link href="/writing" className="block group animate-fadeIn animation-delay-100">
            <Card
              variant="secondary"
              title="Writing Correction"
              className="p-5 h-full transition-transform group-hover:scale-105"
            >
              <p className="text-white">Get instant feedback on your written French with AI-powered corrections.</p>
              <div className="flex items-center mt-4 font-medium text-gray-400">
                Try it now
                <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Card>
          </Link>

          <Link href="/lessons" className="block group animate-fadeIn animation-delay-200">
            <Card
              variant="success"
              title="Interactive Lessons"
              className="p-5 h-full transition-transform group-hover:scale-105"
            >
              <p className="text-gray-600">Explore our comprehensive library of lessons tailored to your proficiency level.</p>
              <div className="flex items-center mt-4 font-medium text-green-600">
                Browse lessons
                <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Card>
          </Link>

          <Link href="/progress" className="block group animate-fadeIn animation-delay-300">
            <Card
              variant="warning"
              title="Progress Tracking"
              className="p-5 h-full transition-transform group-hover:scale-105"
            >
              <p className="text-gray-600">Monitor your learning journey with detailed statistics and personalized insights.</p>
              <div className="flex items-center mt-4 font-medium text-yellow-600">
                View progress
                <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Card>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <Link href="/lessons" className="inline-block mr-4">
            <Button size="lg" className="animate-fadeIn animation-delay-300">
              Get Started
            </Button>
          </Link>
          <Link href="/exam-practice" className="inline-block">
            <Button size="lg" variant="outline" className="animate-fadeIn animation-delay-400">
              Prepare for TCF/TEF
            </Button>
          </Link>
        </div>
      </div>

      <div className="mx-auto mb-12">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Why Choose French Tutor AI?</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <style jsx global>{`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .animate-fadeIn {
              animation: fadeInUp 0.6s ease-out forwards;
            }

            .animation-delay-100 {
              animation-delay: 0.1s;
            }

            .animation-delay-200 {
              animation-delay: 0.2s;
            }

            .animation-delay-300 {
              animation-delay: 0.3s;
            }

            .animation-delay-400 {
              animation-delay: 0.4s;
            }
          `}</style>
          <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm transition-shadow hover:shadow-md animate-fadeIn">
            <div className="mb-4 text-primary-600">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">Personalized Learning</h3>
            <p className="text-gray-600">Our AI adapts to your learning style and pace, creating a customized experience.</p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm transition-shadow hover:shadow-md animate-fadeIn animation-delay-100">
            <div className="mb-4 text-secondary-600">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">Real-time Feedback</h3>
            <p className="text-gray-600">Get instant corrections and suggestions to improve your French skills faster.</p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm transition-shadow hover:shadow-md animate-fadeIn animation-delay-200">
            <div className="mb-4 text-green-600">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">Comprehensive Content</h3>
            <p className="text-gray-600">From beginner to advanced, our curriculum covers all aspects of French language learning.</p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="px-4 mx-auto mb-16">
        <h2 className="mb-8 text-2xl font-bold text-center text-gray-800">What Our Students Say</h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Testimonial 1 */}
          <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-md transition-shadow hover:shadow-lg animate-fadeIn">
            <div className="flex items-center mb-4">
              <div className="flex justify-center items-center mr-4 w-12 h-12 text-xl font-bold rounded-full bg-primary-100 text-primary-700">
                SL
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Sophie Laurent</h3>
                <p className="text-sm text-gray-500">Beginner Level</p>
              </div>
            </div>
            <p className="mb-4 italic text-gray-600">
              "After just 3 months with French Tutor AI, I went from knowing almost nothing to being able to have basic conversations during my trip to Paris. The personalized feedback on my pronunciation made all the difference!"
            </p>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-md transition-shadow hover:shadow-lg animate-fadeIn animation-delay-100">
            <div className="flex items-center mb-4">
              <div className="flex justify-center items-center mr-4 w-12 h-12 text-xl font-bold rounded-full bg-secondary-100 text-secondary-700">
                JM
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Jean Moreau</h3>
                <p className="text-sm text-gray-500">Intermediate Level</p>
              </div>
            </div>
            <p className="mb-4 italic text-gray-600">
              "The interactive lessons and writing correction features helped me improve my grammar significantly. I passed my DELF B1 exam with flying colors thanks to the structured approach of this platform."
            </p>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-md transition-shadow hover:shadow-lg animate-fadeIn animation-delay-200">
            <div className="flex items-center mb-4">
              <div className="flex justify-center items-center mr-4 w-12 h-12 text-xl font-bold text-green-700 bg-green-100 rounded-full">
                AR
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Amelia Rodriguez</h3>
                <p className="text-sm text-gray-500">Advanced Level</p>
              </div>
            </div>
            <p className="mb-4 italic text-gray-600">
              "As someone preparing for the TCF exam, the specialized practice modules were invaluable. The AI's ability to simulate real exam conditions and provide detailed feedback on my weak areas helped me achieve a C1 level."
            </p>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/testimonials">
            <Button variant="link" className="text-primary-600 hover:text-primary-800 animate-fadeIn animation-delay-300">
              Read More Success Stories
              <svg className="inline ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Button>
          </Link>
        </div>
      </div>

      {/* Language Proficiency Test CTA */}
      <div className="px-4 mx-auto mb-16 max-w-4xl">
        <div className="overflow-hidden bg-gradient-to-r rounded-xl shadow-lg from-secondary-500 to-secondary-700">
          <div className="md:flex">
            <div className="p-8 md:w-2/3 md:p-12">
              <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">Not Sure About Your Level?</h2>
              <p className="mb-6 text-white/90">Take our free 5-minute assessment to determine your current French proficiency level and get personalized learning recommendations.</p>
              <Link href="/proficiency-test">
                <Button size="lg" variant="outline" className="animate-fadeIn">
                  Start Free Assessment
                </Button>
              </Link>
            </div>
            <div className="relative md:w-1/3">
              <div className="absolute inset-0 backdrop-blur-sm bg-white/10">
                <svg className="absolute top-0 right-0 w-24 h-full transform translate-x-1/2 text-secondary-700" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <polygon points="0,0 100,0 50,100 0,100" />
                </svg>
              </div>
              <div className="flex relative justify-center items-center p-6 h-full">
                <div className="p-4 rounded-lg shadow-lg backdrop-blur bg-white/90">
                  <div className="mb-2 text-xl font-bold text-center text-secondary-700">5-Minute Test</div>
                  <div className="flex justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="overflow-hidden w-2 h-8 rounded-full bg-secondary-200">
                        <div className="w-full h-full transform origin-bottom scale-y-0 bg-secondary-600 animate-grow" style={{ animationDelay: `${i * 0.2}s` }}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <FeaturedSection />
    </>
  );
}

// Add animation for the proficiency test visualization
const styles = `
@keyframes grow {
  0% { transform: scaleY(0); }
  100% { transform: scaleY(1); }
}

.animate-grow {
  animation: grow 1.5s ease-out forwards;
}
`;

// Add the styles to the global styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

// Featured Section component
const FeaturedSection = () => (
  <section className="py-16 bg-gray-50" id="features">
    <div className="container px-4 mx-auto">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-800">Comprehensive Learning Experience</h2>
        <p className="mx-auto max-w-3xl text-xl text-gray-600">
          Our platform offers a variety of exercises and tools designed to improve all aspects of your French language skills.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          title="Interactive Lessons"
          description="Follow structured lessons that build your knowledge gradually from beginner to advanced levels."
          icon={<BookOpenIcon className="w-10 h-10 text-primary-600" />}
          href="/lessons"
        />
        
        <FeatureCard
          title="Verb Conjugation Practice"
          description="Master French verb conjugations with interactive exercises for different tenses and verb types."
          icon={<PencilIcon className="w-10 h-10 text-primary-600" />}
          href="/verb-conjugation"
        />
        
        <FeatureCard
          title="Vocabulary Building"
          description="Expand your French vocabulary with flashcards, quizzes, and spaced repetition techniques."
          icon={<LanguageIcon className="w-10 h-10 text-primary-600" />}
          href="/vocabulary"
        />
        
        <FeatureCard
          title="Pronunciation Practice"
          description="Perfect your accent with our speech recognition technology and get instant feedback."
          icon={<MicrophoneIcon className="w-10 h-10 text-primary-600" />}
          href="/pronunciation"
        />
        
        <FeatureCard
          title="Writing Correction"
          description="Submit your French writing and receive instant AI-powered corrections and explanations."
          icon={<DocumentTextIcon className="w-10 h-10 text-primary-600" />}
          href="/writing"
        />
        
        <FeatureCard
          title="Conversation Practice"
          description="Chat with our AI conversation partner to improve your French speaking and writing skills."
          icon={<ChatBubbleLeftRightIcon className="w-10 h-10 text-primary-600" />}
          href="/chat"
        />
      </div>
    </div>
  </section>
);

// Add interface for FeatureCard
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

// Update the FeatureCard component with TypeScript types
const FeatureCard = ({ title, description, icon, href }: FeatureCardProps) => (
  <Link href={href} className="block group">
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center mb-4">
        <div className="flex justify-center items-center mr-4 w-12 h-12 text-xl font-bold rounded-full bg-primary-100 text-primary-700">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
      </div>
      <p className="text-gray-600">{description}</p>
      <div className="mt-4 text-primary-600">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>
    </div>
  </Link>
);