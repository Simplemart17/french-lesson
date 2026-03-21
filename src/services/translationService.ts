/**
 * Translation Service
 * 
 * This service handles all translation-related API calls.
 * It supports translating text between languages and detecting languages.
 */

import axios from 'axios';

// Types
export type LanguageCode = 'en' | 'fr' | 'auto';

export interface TranslationResult {
  translatedText: string;
  detectedLanguage?: LanguageCode;
  confidence?: number;
}

export interface DetectionResult {
  language: LanguageCode;
  confidence: number;
}

// Configuration
const API_URL = process.env.NEXT_PUBLIC_TRANSLATION_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_TRANSLATION_API_KEY;

// Use external API if configured, otherwise use internal AI translation
const hasExternalApi = !!API_URL && !!API_KEY;

/**
 * Translates text from source language to target language
 */
export const translateText = async (
  text: string,
  sourceLanguage: LanguageCode = 'auto',
  targetLanguage: LanguageCode = 'fr'
): Promise<TranslationResult> => {
  if (!text.trim()) {
    throw new Error('Text is required');
  }

  if (hasExternalApi) {
    try {
      const response = await axios.post(
        `${API_URL}/translate`,
        {
          text,
          sourceLanguage: sourceLanguage === 'auto' ? undefined : sourceLanguage,
          targetLanguage,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error('External translation API error, falling back to AI:', error);
    }
  }

  // Use internal AI-powered translation
  try {
    const response = await axios.post('/api/ai/translate', {
      text,
      sourceLanguage,
      targetLanguage,
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error: unknown) {
    console.error('AI translation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Translation failed';
    throw new Error(errorMessage);
  }
};

/**
 * Detects the language of the provided text
 */
export const detectLanguage = async (text: string): Promise<DetectionResult> => {
  if (!text.trim()) {
    throw new Error('Text is required');
  }

  if (hasExternalApi) {
    try {
      const response = await axios.post(
        `${API_URL}/detect`,
        { text },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error('External detection API error, falling back to heuristic:', error);
    }
  }

  // Fallback to heuristic detection
  return simulateDetection(text);
};

/**
 * Simulates language detection for development purposes
 */
const simulateDetection = (text: string): DetectionResult => {
  // Check for French words/patterns to determine if it's French
  const frenchPatterns = [
    /bonjour/i, /merci/i, /au revoir/i, /s'il vous plaît/i, 
    /je suis/i, /c'est/i, /oui/i, /non/i,
    /le /i, /la /i, /les /i, /un /i, /une /i
  ];
  
  // Check if any French patterns are found in the text
  const isFrench = frenchPatterns.some(pattern => pattern.test(text));
  
  return {
    language: isFrench ? 'fr' : 'en',
    confidence: 0.7
  };
};

const translationService = {
  translateText,
  detectLanguage
};

export default translationService;

/**
 * Get language display name from language code
 */
export const getLanguageName = (code: string): string => {
  const languages: Record<string, string> = {
    'en': 'English',
    'fr': 'French',
    'es': 'Spanish',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'nl': 'Dutch',
    'ru': 'Russian',
    'zh': 'Chinese',
    'ja': 'Japanese',
    'ko': 'Korean',
    'ar': 'Arabic',
    'hi': 'Hindi',
    'auto': 'Auto-detect',
  };
  
  return languages[code] || code;
};