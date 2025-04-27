import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';

// Define the grammar check response type
interface GrammarCheckResponse {
  text: string;
  corrections: GrammarCorrection[];
  score: number;
}

// Define the grammar correction type
interface GrammarCorrection {
  original: string;
  corrected: string;
  explanation: string;
  position: {
    start: number;
    end: number;
  };
  type: 'grammar' | 'spelling' | 'punctuation' | 'style';
  severity: 'error' | 'warning' | 'suggestion';
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<GrammarCheckResponse>>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: {
        message: 'Method not allowed'
      }
    });
  }

  try {
    // Get the text from the request body
    const { text } = req.body;
    
    // Validate input
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid text'
        }
      });
    }
    
    // In a real application, this would:
    // 1. Process the text using a grammar checking service
    // 2. Identify grammar, spelling, and punctuation errors
    // 3. Generate corrections and explanations
    
    // For this mock implementation, we'll generate some random corrections
    const corrections: GrammarCorrection[] = [];
    
    // Common French grammar mistakes to check for
    const commonMistakes = [
      {
        pattern: /je suis alle/i,
        original: 'je suis alle',
        corrected: 'je suis allé',
        explanation: 'The past participle of "aller" for masculine subjects should have an accent: "allé".',
        type: 'spelling' as const,
        severity: 'error' as const
      },
      {
        pattern: /je suis allee/i,
        original: 'je suis allee',
        corrected: 'je suis allée',
        explanation: 'The past participle of "aller" for feminine subjects should have two accents: "allée".',
        type: 'spelling' as const,
        severity: 'error' as const
      },
      {
        pattern: /je suis \w+ ans/i,
        original: 'je suis',
        corrected: 'j\'ai',
        explanation: 'Use "avoir" (j\'ai) instead of "être" (je suis) when stating age.',
        type: 'grammar' as const,
        severity: 'error' as const
      },
      {
        pattern: /je suis faim/i,
        original: 'je suis faim',
        corrected: 'j\'ai faim',
        explanation: 'Use "avoir faim" (j\'ai faim) instead of "être faim" (je suis faim).',
        type: 'grammar' as const,
        severity: 'error' as const
      },
      {
        pattern: /je suis chaud/i,
        original: 'je suis chaud',
        corrected: 'j\'ai chaud',
        explanation: 'Use "avoir chaud" (j\'ai chaud) instead of "être chaud" (je suis chaud).',
        type: 'grammar' as const,
        severity: 'error' as const
      },
      {
        pattern: /je suis froid/i,
        original: 'je suis froid',
        corrected: 'j\'ai froid',
        explanation: 'Use "avoir froid" (j\'ai froid) instead of "être froid" (je suis froid).',
        type: 'grammar' as const,
        severity: 'error' as const
      },
      {
        pattern: /beaucoup de personnes est/i,
        original: 'beaucoup de personnes est',
        corrected: 'beaucoup de personnes sont',
        explanation: '"Beaucoup de personnes" requires the plural form of the verb.',
        type: 'grammar' as const,
        severity: 'error' as const
      },
      {
        pattern: /la personne sont/i,
        original: 'la personne sont',
        corrected: 'la personne est',
        explanation: '"La personne" is singular and requires the singular form of the verb.',
        type: 'grammar' as const,
        severity: 'error' as const
      }
    ];
    
    // Check for common mistakes
    commonMistakes.forEach(mistake => {
      const match = text.match(mistake.pattern);
      if (match) {
        const start = match.index || 0;
        const end = start + match[0].length;
        
        corrections.push({
          original: mistake.original,
          corrected: mistake.corrected,
          explanation: mistake.explanation,
          position: {
            start,
            end
          },
          type: mistake.type,
          severity: mistake.severity
        });
      }
    });
    
    // If no specific errors were found, add some random style suggestions
    if (corrections.length === 0 && text.length > 20) {
      // Add a random style suggestion
      const randomSuggestions = [
        {
          original: text.substring(0, 10),
          corrected: text.substring(0, 10),
          explanation: 'Consider using more varied vocabulary for a richer expression.',
          position: {
            start: 0,
            end: 10
          },
          type: 'style' as const,
          severity: 'suggestion' as const
        },
        {
          original: text.substring(text.length - 10),
          corrected: text.substring(text.length - 10),
          explanation: 'This sentence could be more concise.',
          position: {
            start: text.length - 10,
            end: text.length
          },
          type: 'style' as const,
          severity: 'suggestion' as const
        }
      ];
      
      // Add a random suggestion
      corrections.push(randomSuggestions[Math.floor(Math.random() * randomSuggestions.length)]);
    }
    
    // Calculate a score based on the number and severity of corrections
    let score = 100;
    corrections.forEach(correction => {
      if (correction.severity === 'error') {
        score -= 10;
      } else if (correction.severity === 'warning') {
        score -= 5;
      } else {
        score -= 2;
      }
    });
    
    // Ensure score is between 0 and 100
    score = Math.max(0, Math.min(100, score));
    
    // Create response
    const response: GrammarCheckResponse = {
      text,
      corrections,
      score
    };
    
    // Return success response
    return res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Error in grammar check API:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
}
