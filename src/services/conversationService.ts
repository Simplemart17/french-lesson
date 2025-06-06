import conversationApiService from './api/conversationApiService';
import { Conversation, Message } from '@/types/api';

interface ConversationTopic {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
}

/**
 * Conversation Service
 *
 * This service provides a wrapper around the conversation API service with additional
 * functionality for caching and offline support.
 */
class ConversationService {
  private cache: Map<string, unknown> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private cacheDuration = 5 * 60 * 1000; // 5 minutes
  private pendingMessages: Map<string, Message[]> = new Map();

  /**
   * Start a new conversation
   */
  async startConversation(topic: string, level: string): Promise<Conversation> {
    try {
      const response = await conversationApiService.startConversation({
        topic,
        level
      });

      if (response.data) {
        return response.data as Conversation;
      }

      throw new Error('Failed to start conversation');
    } catch (error) {
      console.error('Error starting conversation:', error);

      // Create a local conversation if API fails
      const localConversation: Conversation = {
        id: `local-${Date.now()}`,
        userId: 'offline-user', // Default value for offline mode
        title: topic,
        context: `Conversation about ${topic}`,
        messages: [],
        startedAt: new Date().toISOString(),
        lastMessageAt: new Date().toISOString()
      };

      return localConversation;
    }
  }

  /**
   * Get conversation history
   */
  async getConversationHistory(): Promise<Conversation[]> {
    const cacheKey = 'conversation-history';

    // Check cache first
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey) as Conversation[];
    }

    try {
      const response = await conversationApiService.getConversationHistory();

      if (response.data) {
        // Cache the result
        this.setCache(cacheKey, response.data);
        return response.data as Conversation[];
      }

      return [];
    } catch (error) {
      console.error('Error fetching conversation history:', error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey) as Conversation[];
      }

      return [];
    }
  }

  /**
   * Get conversation by ID
   */
  async getConversation(conversationId: string): Promise<Conversation | null> {
    const cacheKey = `conversation-${conversationId}`;

    // Check cache first
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey) as Conversation | null;
    }

    try {
      const response = await conversationApiService.getConversation(conversationId);

      if (response.data) {
        const conversation = response.data as Conversation;
        // Cache the result
        this.setCache(cacheKey, conversation);

        // Add any pending messages
        if (this.pendingMessages.has(conversationId)) {
          const pendingMessages = this.pendingMessages.get(conversationId) || [];
          conversation.messages = [...conversation.messages, ...pendingMessages];
        }

        return conversation;
      }

      return null;
    } catch (error) {
      console.error(`Error fetching conversation ${conversationId}:`, error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey) as Conversation | null;
      }

      return null;
    }
  }

  /**
   * Send a message to a conversation
   */
  async sendMessage(conversationId: string, content: string, audioBlob?: Blob): Promise<Message> {
    try {
      const response = await conversationApiService.sendMessage({
        conversationId,
        content,
        audioBlob
      });

      if (response.data) {
        // Invalidate conversation cache
        this.invalidateCache(`conversation-${conversationId}`);

        return response.data as Message;
      }

      throw new Error('Failed to send message');
    } catch (error) {
      console.error('Error sending message:', error);

      // Create a local message if API fails
      const localMessage: Message = {
        role: 'user',
        content,
        timestamp: new Date().toISOString()
      };

      // Store the message locally
      this.addPendingMessage(conversationId, localMessage);

      return localMessage;
    }
  }

  /**
   * Get conversation topics
   */
  async getConversationTopics(level?: string): Promise<ConversationTopic[]> {
    const cacheKey = `conversation-topics-${level || 'all'}`;

    // Check cache first
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey) as ConversationTopic[];
    }

    try {
      const response = await conversationApiService.getTopics(level);

      if (response.data) {
        // Cache the result
        this.setCache(cacheKey, response.data);
        return response.data as ConversationTopic[];
      }

      return [];
    } catch (error) {
      console.error('Error fetching conversation topics:', error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey) as ConversationTopic[];
      }

      return [];
    }
  }

  /**
   * Add a pending message to be synced later
   */
  private addPendingMessage(conversationId: string, message: Message): void {
    if (!this.pendingMessages.has(conversationId)) {
      this.pendingMessages.set(conversationId, []);
    }

    const messages = this.pendingMessages.get(conversationId) || [];
    messages.push(message);
    this.pendingMessages.set(conversationId, messages);
  }

  /**
   * Check if cache is valid
   */
  private isValidCache(key: string): boolean {
    if (!this.cache.has(key) || !this.cacheExpiry.has(key)) {
      return false;
    }

    const expiry = this.cacheExpiry.get(key) || 0;
    return Date.now() < expiry;
  }

  /**
   * Set cache with expiry
   */
  private setCache(key: string, data: unknown): void {
    this.cache.set(key, data);
    this.cacheExpiry.set(key, Date.now() + this.cacheDuration);
  }

  /**
   * Invalidate cache for a specific key
   */
  private invalidateCache(key: string): void {
    this.cache.delete(key);
    this.cacheExpiry.delete(key);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }
}

// Create and export conversation service instance
const conversationService = new ConversationService();
export default conversationService;
