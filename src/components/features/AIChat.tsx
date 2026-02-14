import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import aiService from '@/services/aiService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  corrections?: {
    original: string;
    corrected: string;
    explanation: string;
  }[];
  suggestions?: string[];
}

interface AIChatProps {
  initialMessage?: string;
  language?: string;
  topic?: string;
  enableCorrections?: boolean;
  enableVocabSuggestions?: boolean;
}

const AIChat = ({
  initialMessage = "Bonjour! Je suis votre assistant français. Comment puis-je vous aider aujourd'hui?",
  language = 'fr',
  topic = 'general',
  enableCorrections = true,
  enableVocabSuggestions = true
}: AIChatProps) => {
  void language;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialMsg: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: initialMessage,
      timestamp: new Date()
    };

    setMessages([initialMsg]);
  }, [initialMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const suggestVocabulary = (text: string, currentTopic: string): string[] => {
    const suggestions: string[] = [];

    const topicVocab: Record<string, string[]> = {
      general: ['en effet (indeed)', 'par conséquent (therefore)'],
      travel: ['un aller-retour (round trip)', 'l\'hébergement (accommodation)'],
      food: ['savoureux (tasty)', 'un plat principal (main dish)'],
      culture: ['le patrimoine (heritage)', 'une exposition (exhibition)']
    };

    const vocab = topicVocab[currentTopic] || topicVocab.general;
    suggestions.push(...vocab.slice(0, 2));

    if (/voyage|train|avion|hotel|hôtel/i.test(text)) {
      suggestions.push('prendre le train (to take the train)');
    }

    return Array.from(new Set(suggestions)).slice(0, 3);
  };

  const detectUserLevel = (text: string): 'beginner' | 'intermediate' | 'advanced' => {
    let score = 0;

    if (/subjonctif|conditionnel|néanmoins|cependant/i.test(text)) score += 2;
    if (/j\'ai|je suis|nous avons|vous êtes/i.test(text)) score += 1;
    if (text.length > 120) score += 1;

    if (score >= 3) return 'advanced';
    if (score >= 2) return 'intermediate';
    return 'beginner';
  };

  const generateResponse = async (userInput: string) => {
    setIsTyping(true);

    try {
      const detectedLevel = detectUserLevel(userInput);
      setUserLevel(detectedLevel);

      const tutor = await aiService.tutorChat(userInput, conversationId, detectedLevel);
      if (tutor.conversationId && tutor.conversationId !== conversationId) {
        setConversationId(tutor.conversationId);
      }

      const corrections = enableCorrections
        ? (tutor.corrections || []).map((item) => ({
            original: item.error,
            corrected: item.correction,
            explanation: item.explanation
          }))
        : undefined;

      const suggestions = enableVocabSuggestions
        ? suggestVocabulary(userInput, topic)
        : undefined;

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: tutor.response,
        timestamp: new Date(),
        corrections: corrections && corrections.length > 0 ? corrections : undefined,
        suggestions: suggestions && suggestions.length > 0 ? suggestions : undefined
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Je suis désolé, je ne peux pas répondre pour le moment.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    const text = inputText;
    setInputText('');
    generateResponse(text);
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-medium text-gray-800">French Conversation Practice</h3>
        <p className="text-sm text-gray-500">Chat with our AI assistant to practice your French</p>
        <p className="mt-1 text-xs text-gray-400">Detected level: {userLevel}</p>
      </div>

      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-primary-100 text-primary-900'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="whitespace-pre-line">{message.content}</p>

              {message.role === 'assistant' && message.corrections && message.corrections.length > 0 && (
                <div className="pt-2 mt-2 border-t border-gray-200">
                  <p className="text-sm font-medium text-amber-700">Corrections grammaticales:</p>
                  <ul className="mt-1 space-y-1 text-sm text-gray-600">
                    {message.corrections.map((correction, index) => (
                      <li key={index}>
                        <span className="text-red-500 line-through">{correction.original}</span> 
                        {' '}→{' '}
                        <span className="text-green-600">{correction.corrected}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {message.role === 'assistant' && message.suggestions && message.suggestions.length > 0 && (
                <div className="pt-2 mt-2 border-t border-gray-200">
                  <p className="text-sm font-medium text-blue-700">Vocabulaire utile:</p>
                  <ul className="mt-1 space-y-1 text-sm text-gray-600">
                    {message.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-1 text-xs text-gray-500">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleInputSubmit} className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message in French..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            disabled={isTyping}
          />
          <Button
            type="submit"
            disabled={!inputText.trim() || isTyping}
          >
            Send
          </Button>
        </form>

        <div className="mt-3 text-xs text-gray-500">
          <p>Tip: Try to write in French as much as possible to practice your skills.</p>
        </div>
      </div>
    </Card>
  );
};

export default AIChat;
