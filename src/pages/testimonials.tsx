import Head from 'next/head';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  imageUrl?: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sophie Martin',
    role: 'Beginner French Learner',
    content: 'I\'ve tried many language learning apps, but French Tutor AI is by far the most effective. The personalized feedback on my pronunciation has helped me gain confidence in speaking French.',
    rating: 5,
    imageUrl: '/images/testimonials/sophie.jpg'
  },
  {
    id: '2',
    name: 'Jean Dupont',
    role: 'Business Professional',
    content: 'I needed to learn French quickly for a job opportunity in Paris. The focused lessons and conversation practice helped me achieve professional fluency in just 3 months!',
    rating: 5,
    imageUrl: '/images/testimonials/jean.jpg'
  },
  {
    id: '3',
    name: 'Maria Rodriguez',
    role: 'University Student',
    content: 'The grammar correction feature is a game-changer. It doesn\'t just tell me what\'s wrong but explains why, which has dramatically improved my writing skills.',
    rating: 4,
    imageUrl: '/images/testimonials/maria.jpg'
  },
  {
    id: '4',
    name: 'David Chen',
    role: 'Intermediate French Speaker',
    content: 'I was stuck at an intermediate plateau for years. The adaptive exercises and AI conversation partner helped me break through to advanced fluency.',
    rating: 5,
    imageUrl: '/images/testimonials/david.jpg'
  },
  {
    id: '5',
    name: 'Emma Wilson',
    role: 'Travel Enthusiast',
    content: 'I used French Tutor AI to prepare for a 3-week trip to France. The situational vocabulary and cultural notes were incredibly helpful during my travels!',
    rating: 5,
    imageUrl: '/images/testimonials/emma.jpg'
  },
  {
    id: '6',
    name: 'Alexandre Lefebvre',
    role: 'French Teacher',
    content: 'As a French teacher, I recommend French Tutor AI to all my students for additional practice. The quality of the content and accuracy of the feedback is impressive.',
    rating: 4,
    imageUrl: '/images/testimonials/alexandre.jpg'
  },
];

export default function TestimonialsPage() {
  return (
    <>
      <Head>
        <title>Success Stories | French Tutor AI</title>
        <meta name="description" content="Read success stories from our French learners" />
      </Head>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">Success Stories</h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Discover how French Tutor AI has helped learners of all levels achieve their language goals.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 mr-4">
                    {testimonial.imageUrl ? (
                      <img
                        src={testimonial.imageUrl}
                        alt={testimonial.name}
                        className="object-cover w-12 h-12 rounded-full"
                        onError={(e) => {
                          // Fallback if image fails to load
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=random`;
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center w-12 h-12 text-white rounded-full bg-primary-600">
                        {testimonial.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                
                <p className="mb-4 text-gray-600">"{testimonial.content}"</p>
                
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className="w-5 h-5" 
                      fill={i < testimonial.rating ? "currentColor" : "none"} 
                      stroke={i < testimonial.rating ? "none" : "currentColor"}
                      viewBox="0 0 20 20" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 mb-12 text-center bg-gray-50 rounded-xl">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">Ready to Start Your French Journey?</h2>
          <p className="mb-6 text-lg text-gray-600">Join thousands of satisfied learners and experience the power of AI-assisted language learning.</p>
          <Link href="/register">
            <Button size="lg">
              Start Learning Today
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
