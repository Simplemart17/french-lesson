import conversationApiService from './api/conversationApiService';
import { Conversation, Message } from '@/types/api';

/**
 * Conversation Service
 *
 * This service provides a wrapper around the conversation API service with additional
 * functionality for caching and offline support.
 */
class ConversationService {
  private cache: Map<string, any> = new Map();
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

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error('Failed to start conversation');
    } catch (error) {
      console.error('Error starting conversation:', error);

      // Create a local conversation if API fails
      const localConversation: Conversation = {
        id: `local-${Date.now()}`,
        topic,
        level,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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
      return this.cache.get(cacheKey);
    }

    try {
      const response = await conversationApiService.getConversationHistory();

      if (response.success && response.data) {
        // Cache the result
        this.setCache(cacheKey, response.data);
        return response.data;
      }

      return [];
    } catch (error) {
      console.error('Error fetching conversation history:', error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
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
      return this.cache.get(cacheKey);
    }

    try {
      const response = await conversationApiService.getConversation(conversationId);

      if (response.success && response.data) {
        // Cache the result
        this.setCache(cacheKey, response.data);

        // Add any pending messages
        if (this.pendingMessages.has(conversationId)) {
          const pendingMessages = this.pendingMessages.get(conversationId) || [];
          response.data.messages = [...response.data.messages, ...pendingMessages];
        }

        return response.data;
      }

      return null;
    } catch (error) {
      console.error(`Error fetching conversation ${conversationId}:`, error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
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

      if (response.success && response.data) {
        // Invalidate conversation cache
        this.invalidateCache(`conversation-${conversationId}`);

        return response.data;
      }

      throw new Error('Failed to send message');
    } catch (error) {
      console.error('Error sending message:', error);

      // Create a local message if API fails
      const localMessage: Message = {
        id: `local-${Date.now()}`,
        conversationId,
        role: 'user',
        content,
        createdAt: new Date().toISOString()
      };

      // Store the message locally
      this.addPendingMessage(conversationId, localMessage);

      return localMessage;
    }
  }

  /**
   * Get conversation topics
   */
  async getConversationTopics(level?: string): Promise<any[]> {
    const cacheKey = `conversation-topics-${level || 'all'}`;

    // Check cache first
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await conversationApiService.getTopics(level);

      if (response.success && response.data) {
        // Cache the result
        this.setCache(cacheKey, response.data);
        return response.data;
      }

      return [];
    } catch (error) {
      console.error('Error fetching conversation topics:', error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
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
  private setCache(key: string, data: any): void {
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
