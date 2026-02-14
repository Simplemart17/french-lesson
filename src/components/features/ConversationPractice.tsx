import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import conversationApiService from '@/services/api/conversationApiService';
import translationService from '@/services/translationService';

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
}

interface WindowWithSpeechRecognition {
  SpeechRecognition?: new () => SpeechRecognition;
  webkitSpeechRecognition?: new () => SpeechRecognition;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  audioUrl?: string;
  translation?: string;
  showTranslation?: boolean;
}

interface ConversationScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  initialMessage: string;
  possibleResponses?: {
    userInput: string;
    botReply: string;
  }[];
}

interface ConversationPracticeProps {
  scenario: ConversationScenario;
  language?: string;
  onComplete?: (messages: Message[]) => void;
}

const ConversationPractice = ({
  scenario,
  language = 'fr-FR',
  onComplete
}: ConversationPracticeProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [conversationEnded, setConversationEnded] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.8;

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      speechSynthesis.speak(utterance);
    }
  }, [language]);

  const translateToEnglish = useCallback(async (text: string): Promise<string> => {
    try {
      const result = await translationService.translateText(text, 'fr', 'en');
      return result.translatedText;
    } catch {
      return '';
    }
  }, []);

  const createAssistantMessage = useCallback(async (content: string): Promise<Message> => {
    const translation = await translateToEnglish(content);
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content,
      timestamp: new Date(),
      translation: translation || undefined,
      showTranslation: false
    };
  }, [translateToEnglish]);

  const initializeConversation = useCallback(async (): Promise<string | null> => {
    try {
      const result = await conversationApiService.startConversation({
        topic: scenario.title,
        level: scenario.difficulty
      });

      const conversation = result.data as {
        id?: string;
        messages?: Array<{ id: string; role: 'assistant' | 'user'; content: string; createdAt?: string }>;
      } | undefined;

      const newConversationId = conversation?.id || null;
      setConversationId(newConversationId);

      const initialFromApi = conversation?.messages?.find((item) => item.role === 'assistant')?.content;
      const initialContent = initialFromApi || scenario.initialMessage;
      const assistantMessage = await createAssistantMessage(initialContent);
      setMessages([assistantMessage]);

      setTimeout(() => speakText(initialContent), 200);
      return newConversationId;
    } catch {
      const assistantMessage = await createAssistantMessage(scenario.initialMessage);
      setMessages([assistantMessage]);
      setConversationId(null);
      return null;
    }
  }, [createAssistantMessage, scenario, speakText]);

  const generateBotResponse = useCallback(async (userInput: string) => {
    setIsTyping(true);

    try {
      let activeConversationId = conversationId;
      if (!activeConversationId) {
        activeConversationId = await initializeConversation();
      }

      if (!activeConversationId) {
        const fallback = await createAssistantMessage('Je suis désolé, je ne peux pas répondre pour le moment.');
        setMessages((prev) => [...prev, fallback]);
        return;
      }

      const response = await conversationApiService.sendMessage({
        conversationId: activeConversationId,
        content: userInput
      });

      const data = response.data as { id?: string; content?: string; createdAt?: string } | undefined;
      const botReply = data?.content || 'Je suis désolé, je ne sais pas comment répondre à cela.';

      const botMessage = await createAssistantMessage(botReply);
      botMessage.id = data?.id || botMessage.id;
      botMessage.timestamp = data?.createdAt ? new Date(data.createdAt) : botMessage.timestamp;

      setMessages((prev) => [...prev, botMessage]);
      speakText(botReply);
    } catch {
      const fallback = await createAssistantMessage('Je suis désolé, je ne peux pas répondre pour le moment.');
      setMessages((prev) => [...prev, fallback]);
    } finally {
      setIsTyping(false);
    }
  }, [conversationId, createAssistantMessage, initializeConversation, speakText]);

  const sendMessage = useCallback((text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    generateBotResponse(text);
  }, [generateBotResponse]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const windowWithSpeech = window as unknown as WindowWithSpeechRecognition;
      const SpeechRecognition = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = language;

        recognition.onresult = (event) => {
          let finalTranscript = '';
          let interim = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }

          setInterimTranscript(interim);

          if (finalTranscript.trim()) {
            sendMessage(finalTranscript.trim());
            setInterimTranscript('');
          }
        };

        recognition.onerror = (event) => {
          setError(`Error occurred in recognition: ${event.error}`);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setError('Speech recognition is not supported in this browser.');
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, sendMessage]);

  useEffect(() => {
    setConversationEnded(false);
    setError('');
    setInterimTranscript('');
    setInputText('');
    setMessages([]);
    setConversationId(null);
    initializeConversation();
  }, [initializeConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startListening = () => {
    setError('');
    setInterimTranscript('');

    if (recognitionRef.current) {
      try {
        setIsListening(true);
        recognitionRef.current.start();
      } catch {
        setError('Error starting speech recognition. Please try again.');
        setIsListening(false);
      }
    } else {
      setError('Speech recognition is not supported in this browser.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessage(inputText.trim());
    }
  };

  const toggleTranslation = (messageId: string) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === messageId
          ? { ...message, showTranslation: !message.showTranslation }
          : message
      )
    );
  };

  const endConversation = () => {
    setConversationEnded(true);

    if (onComplete) {
      onComplete(messages);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Card className="flex flex-col flex-grow overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div>
            <h3 className="font-medium text-gray-800">{scenario.title}</h3>
            <p className="text-sm text-gray-500">{scenario.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowHints(!showHints)}
              className={`p-2 rounded-full ${showHints ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:bg-gray-100'}`}
              title={showHints ? 'Hide translations' : 'Show translations'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </button>
            <button
              onClick={endConversation}
              className="p-2 text-gray-500 rounded-full hover:bg-gray-100"
              title="End conversation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-grow p-4 space-y-4 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.role === 'user' ? 'bg-primary-100 text-primary-900' : 'bg-gray-100 text-gray-800'} rounded-lg p-3`}>
                <div className="flex items-start justify-between">
                  <p>{message.content}</p>
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => speakText(message.content)}
                      className="p-1 ml-2 text-gray-500 rounded-full hover:text-primary-600 hover:bg-white/50"
                      title="Listen again"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </button>
                  )}
                </div>

                {message.role === 'assistant' && message.translation && (showHints || message.showTranslation) && (
                  <div
                    className="pt-2 mt-2 text-sm text-gray-600 border-t border-gray-200 cursor-pointer"
                    onClick={() => toggleTranslation(message.id)}
                  >
                    {message.translation}
                  </div>
                )}

                {message.role === 'assistant' && message.translation && !showHints && !message.showTranslation && (
                  <button
                    onClick={() => toggleTranslation(message.id)}
                    className="mt-1 text-xs text-gray-500 hover:text-primary-600"
                  >
                    Show translation
                  </button>
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

        {!conversationEnded ? (
          <div className="p-4 border-t border-gray-200">
            {isListening && (
              <div className="p-3 mb-4 border rounded-lg bg-primary-50 border-primary-100">
                <div className="flex items-center">
                  <div className="w-3 h-3 mr-3 rounded-full bg-primary-500 animate-pulse"></div>
                  <div>
                    <p className="font-medium text-primary-700">Listening...</p>
                    {interimTranscript && (
                      <p className="text-sm italic text-primary-600">{interimTranscript}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 mb-4 text-red-700 border border-red-200 rounded-lg bg-red-50">
                {error}
              </div>
            )}

            <div className="flex items-center space-x-2">
              <form onSubmit={handleInputSubmit} className="flex-grow">
                <div className="relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your message in French..."
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    disabled={isListening || isSpeaking || isTyping}
                  />
                  <button
                    type="submit"
                    className="absolute text-gray-500 transform -translate-y-1/2 right-2 top-1/2 hover:text-primary-600"
                    disabled={!inputText.trim() || isListening || isSpeaking || isTyping}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </form>

              <button
                onClick={isListening ? stopListening : startListening}
                disabled={isSpeaking || isTyping}
                className={`p-3 rounded-full ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-primary-500 text-white hover:bg-primary-600'
                } ${(isSpeaking || isTyping) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  {isListening ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center border-t border-gray-200 bg-gray-50">
            <h3 className="mb-2 text-lg font-medium text-gray-800">Conversation Completed!</h3>
            <p className="mb-4 text-gray-600">
              You&apos;ve successfully completed this conversation practice.
            </p>
            <Button onClick={() => window.location.reload()}>
              Start a New Conversation
            </Button>
          </div>
        )}
      </Card>

      <audio ref={audioRef} className="hidden" />
    </div>
  );
};

export default ConversationPractice;
