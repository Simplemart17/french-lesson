import Head from 'next/head';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us | French Tutor AI</title>
        <meta name="description" content="Learn about French Tutor AI and our mission to make learning French accessible and effective" />
      </Head>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">About French Tutor AI</h1>
          <p className="text-lg text-gray-600">
            Revolutionizing language learning through artificial intelligence and personalized education.
          </p>
        </div>

        <div className="p-6 mb-8 bg-white rounded-xl shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">Our Mission</h2>
          <p className="mb-4 text-gray-600">
            At French Tutor AI, we believe that language learning should be accessible, effective, and tailored to each individual's needs. Our mission is to break down the barriers to language acquisition by leveraging cutting-edge AI technology to create a personalized learning experience that adapts to your unique learning style, pace, and goals.
          </p>
          <p className="text-gray-600">
            We're committed to helping learners of all levels—from complete beginners to advanced speakers—improve their French language skills through interactive lessons, real-time feedback, and engaging practice opportunities.
          </p>
        </div>

        <div className="p-6 mb-8 bg-white rounded-xl shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">Our Approach</h2>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-xl font-medium text-gray-800">Personalized Learning</h3>
              <p className="text-gray-600">
                Our AI-powered platform analyzes your strengths, weaknesses, and learning patterns to create a customized curriculum that focuses on the areas where you need the most improvement.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-xl font-medium text-gray-800">Real-time Feedback</h3>
              <p className="text-gray-600">
                Get immediate corrections and suggestions on your pronunciation, grammar, and vocabulary usage, helping you learn from mistakes and refine your skills faster.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-xl font-medium text-gray-800">Immersive Practice</h3>
              <p className="text-gray-600">
                Engage in realistic conversations with our AI language partners, practice real-world scenarios, and build confidence in your speaking abilities in a supportive environment.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-xl font-medium text-gray-800">Comprehensive Curriculum</h3>
              <p className="text-gray-600">
                From basic vocabulary and grammar to advanced conversation skills and cultural nuances, our platform covers all aspects of French language learning.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 mb-8 bg-white rounded-xl shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">Our Team</h2>
          <p className="mb-4 text-gray-600">
            French Tutor AI was founded by a team of language educators, AI specialists, and French language enthusiasts who recognized the potential of artificial intelligence to transform language education.
          </p>
          <p className="text-gray-600">
            Our diverse team combines expertise in linguistics, machine learning, educational psychology, and software development to create a learning platform that's both technologically advanced and pedagogically sound.
          </p>
        </div>

        <div className="p-8 mb-8 text-center bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl text-white">
          <h2 className="mb-4 text-2xl font-bold">Ready to Start Your French Journey?</h2>
          <p className="mb-6 text-lg opacity-90">
            Join thousands of learners who are achieving their language goals with French Tutor AI.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="light">
                Sign Up Free
              </Button>
            </Link>
            <Link href="/lessons">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Explore Lessons
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
