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

// Check if we're in development mode without API keys
const isDevelopmentMode = !API_URL || !API_KEY || process.env.NODE_ENV === 'development';

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

  if (isDevelopmentMode) {
    return simulateTranslation(text, sourceLanguage, targetLanguage);
  }

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
    console.error('Translation API error:', error);
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

  if (isDevelopmentMode) {
    return simulateDetection(text);
  }

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
    console.error('Language detection API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Language detection failed';
    throw new Error(errorMessage);
  }
};

/**
 * Simulates translation for development purposes with a visual typing effect
 */
const simulateTranslation = (
  text: string,
  sourceLanguage: LanguageCode,
  targetLanguage: LanguageCode
): Promise<TranslationResult> => {
  return new Promise((resolve) => {
    // Simple simulation - in reality would use a more sophisticated approach
    let translatedText = text;
    let detectedLanguage: LanguageCode | undefined = undefined;
    
    // Detect language if auto is selected
    if (sourceLanguage === 'auto') {
      const detection = simulateDetection(text);
      detectedLanguage = detection.language;
      sourceLanguage = detection.language;
    }
    
    // Only translate if source and target are different
    if (sourceLanguage !== targetLanguage) {
      if (sourceLanguage === 'en' && targetLanguage === 'fr') {
        // English to French simple replacements
        translatedText = text
          .replace(/hello/gi, 'bonjour')
          .replace(/goodbye/gi, 'au revoir')
          .replace(/thank you/gi, 'merci')
          .replace(/please/gi, 's\'il vous plaît')
          .replace(/yes/gi, 'oui')
          .replace(/no/gi, 'non')
          .replace(/the/gi, 'le')
          .replace(/a /gi, 'un ')
          .replace(/is/gi, 'est')
          .replace(/I am/gi, 'Je suis')
          .replace(/I /gi, 'Je ')
          // Add more French flair
          .replace(/good/gi, 'bon')
          .replace(/bad/gi, 'mauvais')
          .replace(/beautiful/gi, 'beau')
          .replace(/today/gi, 'aujourd\'hui');
      } else if (sourceLanguage === 'fr' && targetLanguage === 'en') {
        // French to English simple replacements
        translatedText = text
          .replace(/bonjour/gi, 'hello')
          .replace(/au revoir/gi, 'goodbye')
          .replace(/merci/gi, 'thank you')
          .replace(/s'il vous plaît/gi, 'please')
          .replace(/oui/gi, 'yes')
          .replace(/non/gi, 'no')
          .replace(/le /gi, 'the ')
          .replace(/la /gi, 'the ')
          .replace(/un /gi, 'a ')
          .replace(/une /gi, 'a ')
          .replace(/est/gi, 'is')
          .replace(/Je suis/gi, 'I am')
          // Add more English translations
          .replace(/bon/gi, 'good')
          .replace(/mauvais/gi, 'bad')
          .replace(/beau/gi, 'beautiful')
          .replace(/aujourd'hui/gi, 'today')
          .replace(/Je /gi, 'I ');
      }
    }

    // Add a slight delay to simulate processing time
    const processingTime = Math.min(1000, text.length * 20);
    
    // Simulate a typing effect by resolving after a delay
    setTimeout(() => {
      resolve({
        translatedText,
        detectedLanguage,
        confidence: 0.9
      });
    }, processingTime);
  });
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