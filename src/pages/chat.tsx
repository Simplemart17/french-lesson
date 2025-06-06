import { useState } from 'react';
import Head from 'next/head';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import AIChat from '@/components/features/AIChat';
import { useAuth } from '@/context/AuthContext';

// Sample conversation topics
const conversationTopics = [
  {
    id: 'general',
    title: 'General Conversation',
    description: 'Practice everyday French conversation on various topics',
    initialMessage: "Bonjour! Je suis votre assistant français. Comment puis-je vous aider aujourd'hui?"
  },
  {
    id: 'travel',
    title: 'Travel & Tourism',
    description: 'Practice conversations about travel, directions, and tourism in France',
    initialMessage: "Bonjour! Vous planifiez un voyage en France? Je peux vous aider avec des informations sur les destinations, les transports, et plus encore."
  },
  {
    id: 'food',
    title: 'Food & Dining',
    description: 'Practice conversations about French cuisine, restaurants, and ordering food',
    initialMessage: "Bonjour! La cuisine française est célèbre dans le monde entier. Aimez-vous la cuisine française? Quels plats avez-vous déjà essayés?"
  },
  {
    id: 'culture',
    title: 'French Culture',
    description: 'Discuss French art, literature, music, and cultural customs',
    initialMessage: "Bonjour! La culture française est riche et diverse. Êtes-vous intéressé par l'art, la littérature, le cinéma ou la musique française?"
  }
];

// Sample conversation starters
const conversationStarters = [
  "Bonjour! Comment allez-vous aujourd'hui?",
  "Pouvez-vous me parler de vos hobbies?",
  "Quel temps fait-il chez vous?",
  "Avez-vous visité la France?",
  "Qu'est-ce que vous aimez faire pendant votre temps libre?",
  "Quel genre de musique écoutez-vous?",
  "Quel est votre film préféré?",
  "Parlez-moi de votre famille.",
  "Qu'est-ce que vous avez fait le weekend dernier?",
  "Quels sont vos projets pour les vacances?"
];

export default function ChatPage() {
  const { isAuthenticated } = useAuth();
  // Note: isAuthenticated available for future authentication checks
  console.log('User authenticated:', isAuthenticated);
  const [selectedTopic, setSelectedTopic] = useState<typeof conversationTopics[0] | null>(null);
  const [enableCorrections, setEnableCorrections] = useState(true);
  const [enableVocabSuggestions, setEnableVocabSuggestions] = useState(true);
  
  return (
    <>
      <Head>
        <title>French Chat Practice | French Tutor AI</title>
        <meta name="description" content="Practice French conversation with our AI chat assistant" />
      </Head>
      
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">French Conversation Practice</h1>
          <p className="text-lg text-gray-600">
            Practice your French writing and conversation skills by chatting with our AI assistant. Choose a topic and start chatting in French!
          </p>
        </div>
        
        {!selectedTopic ? (
          <>
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">Select a Conversation Topic</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {conversationTopics.map((topic) => (
                  <div 
                    key={topic.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedTopic(topic)}
                  >
                    <Card>
                      <div className="p-4">
                        <h3 className="mb-1 text-lg font-medium text-gray-800">{topic.title}</h3>
                        <p className="mb-4 text-sm text-gray-500">{topic.description}</p>
                        <Button>Start Conversation</Button>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">Conversation Starters</h2>
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <p className="mb-3 text-gray-600">Not sure what to say? Try one of these conversation starters:</p>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {conversationStarters.map((starter, index) => (
                    <div key={index} className="p-2 text-sm text-gray-700 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-100">
                      {starter}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 border border-blue-200 rounded-lg bg-blue-50">
              <h2 className="mb-3 text-xl font-semibold text-blue-800">Tips for Effective Practice</h2>
              <ul className="space-y-2 text-blue-700 list-disc list-inside">
                <li>Try to respond in complete sentences rather than single words.</li>
                <li>Don&apos;t worry about making mistakes - they&apos;re part of learning!</li>
                <li>If you don&apos;t know a word, try to describe it or use another word.</li>
                <li>Aim to use different tenses (present, past, future) in your responses.</li>
                <li>Practice regularly, even if it&apos;s just for a few minutes each day.</li>
              </ul>
            </div>
          </>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <Button 
                variant="outline" 
                onClick={() => setSelectedTopic(null)}
                className="flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Topics
              </Button>
              
              <h2 className="text-xl font-semibold text-gray-800">{selectedTopic.title}</h2>
            </div>
            
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableCorrections"
                  checked={enableCorrections}
                  onChange={() => setEnableCorrections(!enableCorrections)}
                  className="w-4 h-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="enableCorrections" className="ml-2 text-sm text-gray-700">
                  Enable Grammar Corrections
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableVocabSuggestions"
                  checked={enableVocabSuggestions}
                  onChange={() => setEnableVocabSuggestions(!enableVocabSuggestions)}
                  className="w-4 h-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="enableVocabSuggestions" className="ml-2 text-sm text-gray-700">
                  Enable Vocabulary Suggestions
                </label>
              </div>
            </div>
            
            <div className="h-[600px]">
              <AIChat 
                initialMessage={selectedTopic.initialMessage}
                topic={selectedTopic.id}
                enableCorrections={enableCorrections}
                enableVocabSuggestions={enableVocabSuggestions}
              />
            </div>
            
            <div className="p-4 mt-8 border rounded-lg bg-amber-50 border-amber-200">
              <h3 className="mb-2 font-medium text-amber-800">Practice Makes Perfect</h3>
              <p className="text-amber-700">
                Learning a language takes time and consistent practice. Don&apos;t be afraid to make mistakes - they&apos;re an important part of the learning process!
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
