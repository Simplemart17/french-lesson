import { useState, useEffect } from 'react';
import Head from 'next/head';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import AIChat from '@/components/features/AIChat';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/services/api/apiClient';

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

interface PreviousConversation {
  id: string;
  topic: string;
  messages: Array<{ content: string; role: string; createdAt: string }>;
  updatedAt: string;
}

export default function ChatPage() {
  const { isAuthenticated } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState<typeof conversationTopics[0] | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>();
  const [previousConversations, setPreviousConversations] = useState<PreviousConversation[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showHistorySidebar, setShowHistorySidebar] = useState(false);
  const [enableCorrections, setEnableCorrections] = useState(true);
  const [enableVocabSuggestions, setEnableVocabSuggestions] = useState(true);

  // Fetch conversation history
  useEffect(() => {
    if (!isAuthenticated) return;

    setIsLoadingHistory(true);
    apiClient.get<{ data?: PreviousConversation[]; conversations?: PreviousConversation[] }>('/conversation/history')
      .then((response) => {
        const conversations = response.data?.data || response.data?.conversations || [];
        if (Array.isArray(conversations)) {
          setPreviousConversations(conversations.slice(0, 20));
        }
      })
      .catch((err) => {
        console.error('Failed to load conversation history:', err);
        // Fallback to chat endpoint
        apiClient.get<{ data?: PreviousConversation[]; conversations?: PreviousConversation[] }>('/conversation/chat')
          .then((response) => {
            const conversations = response.data?.data || response.data?.conversations || [];
            if (Array.isArray(conversations)) {
              setPreviousConversations(conversations.slice(0, 20));
            }
          })
          .catch(() => {});
      })
      .finally(() => {
        setIsLoadingHistory(false);
      });
  }, [isAuthenticated]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleSelectConversation = (conv: PreviousConversation) => {
    setSelectedConversationId(conv.id);
    setSelectedTopic(conversationTopics[0]); // Use general topic as wrapper
    setShowHistorySidebar(false);
  };

  const handleNewConversation = () => {
    setSelectedConversationId(undefined);
    setSelectedTopic(null);
    setShowHistorySidebar(false);
  };

  const historySidebar = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Previous Conversations</h2>
        <button
          onClick={() => setShowHistorySidebar(false)}
          className="p-1 text-gray-400 rounded hover:text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-3">
        <Button size="sm" className="w-full" onClick={handleNewConversation}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Conversation
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoadingHistory ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 mb-2 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mt-1"></div>
              </div>
            ))}
          </div>
        ) : previousConversations.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            <p>No previous conversations yet.</p>
            <p className="mt-1">Start chatting to see your history here.</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {previousConversations.map((conv) => {
              const lastMessage = conv.messages?.[conv.messages.length - 1];
              const preview = lastMessage?.content?.substring(0, 80) || 'No messages yet';
              const isActive = selectedConversationId === conv.id;

              return (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 border border-primary-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium truncate ${isActive ? 'text-primary-700' : 'text-gray-800'}`}>
                      {conv.topic || 'Conversation'}
                    </span>
                    <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                      {formatDate(conv.updatedAt)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {preview}{preview.length >= 80 ? '...' : ''}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <Head>
        <title>French Chat Practice | French Tutor AI</title>
        <meta name="description" content="Practice French conversation with our AI chat assistant" />
      </Head>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-4 text-3xl font-bold text-gray-800">French Conversation Practice</h1>
              <p className="text-lg text-gray-600">
                Practice your French writing and conversation skills by chatting with our AI assistant. Choose a topic and start chatting in French!
              </p>
            </div>
            {isAuthenticated && (
              <button
                onClick={() => setShowHistorySidebar(!showHistorySidebar)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 lg:hidden"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                History
              </button>
            )}
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        {showHistorySidebar && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowHistorySidebar(false)} />
            <div className="absolute top-0 right-0 w-80 h-full bg-white shadow-xl">
              {historySidebar}
            </div>
          </div>
        )}

        {!selectedTopic ? (
          <div className="flex gap-6">
            {/* Desktop sidebar */}
            {isAuthenticated && (
              <div className="hidden lg:block w-72 flex-shrink-0">
                <div className="sticky top-4 bg-white rounded-lg shadow-md border border-gray-200 max-h-[calc(100vh-8rem)] overflow-hidden flex flex-col">
                  {historySidebar}
                </div>
              </div>
            )}

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Previous Conversations - mobile only (compact cards) */}
              {isAuthenticated && previousConversations.length > 0 && (
                <div className="mb-8 lg:hidden">
                  <h2 className="mb-4 text-xl font-semibold text-gray-800">Recent Conversations</h2>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {previousConversations.slice(0, 4).map((conv) => {
                      const lastMessage = conv.messages?.[conv.messages.length - 1];
                      const preview = lastMessage?.content?.substring(0, 100) || 'No messages yet';
                      const date = formatDate(conv.updatedAt);
                      return (
                        <div key={conv.id} className="cursor-pointer" onClick={() => handleSelectConversation(conv)}>
                          <Card>
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="text-sm font-medium text-gray-800">{conv.topic || 'Conversation'}</h3>
                                <span className="text-xs text-gray-400">{date}</span>
                              </div>
                              <p className="mb-3 text-xs text-gray-500 line-clamp-2">{preview}{preview.length >= 100 ? '...' : ''}</p>
                              <Button size="sm" variant="outline">Continue</Button>
                            </div>
                          </Card>
                        </div>
                      );
                    })}
                  </div>
                  {previousConversations.length > 4 && (
                    <button
                      onClick={() => setShowHistorySidebar(true)}
                      className="mt-3 text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      View all {previousConversations.length} conversations
                    </button>
                  )}
                </div>
              )}

              <div className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">Select a Conversation Topic</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {conversationTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedConversationId(undefined);
                        setSelectedTopic(topic);
                      }}
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
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedTopic(null);
                  setSelectedConversationId(undefined);
                }}
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
                existingConversationId={selectedConversationId}
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
    </ProtectedRoute>
  );
}
