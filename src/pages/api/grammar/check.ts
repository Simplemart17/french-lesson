import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';

interface GrammarCheckResponse {
  text: string;
  corrections: GrammarCorrection[];
  score: number;
}

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

interface MistakeRule {
  pattern: RegExp;
  corrected: string;
  explanation: string;
  type: GrammarCorrection['type'];
  severity: GrammarCorrection['severity'];
}

const RULES: MistakeRule[] = [
  {
    pattern: /\bje suis alle\b/gi,
    corrected: 'je suis alle',
    explanation: 'Use the past participle with accent: "alle" should be "allé".',
    type: 'spelling',
    severity: 'error'
  },
  {
    pattern: /\bje suis allee\b/gi,
    corrected: 'je suis allee',
    explanation: 'Use the accented feminine past participle: "allée".',
    type: 'spelling',
    severity: 'error'
  },
  {
    pattern: /\bje suis (\d{1,3}) ans\b/gi,
    corrected: 'j\'ai $1 ans',
    explanation: 'In French, age uses "avoir": "j\'ai ... ans".',
    type: 'grammar',
    severity: 'error'
  },
  {
    pattern: /\bje suis faim\b/gi,
    corrected: 'j\'ai faim',
    explanation: 'Use "avoir faim", not "être faim".',
    type: 'grammar',
    severity: 'error'
  },
  {
    pattern: /\bje suis froid\b/gi,
    corrected: 'j\'ai froid',
    explanation: 'Use "avoir froid", not "être froid".',
    type: 'grammar',
    severity: 'error'
  },
  {
    pattern: /\bje suis chaud\b/gi,
    corrected: 'j\'ai chaud',
    explanation: 'Use "avoir chaud", not "être chaud".',
    type: 'grammar',
    severity: 'error'
  },
  {
    pattern: /\bla personne sont\b/gi,
    corrected: 'la personne est',
    explanation: 'Singular subject requires singular verb.',
    type: 'grammar',
    severity: 'error'
  },
  {
    pattern: /\bbeaucoup de personnes est\b/gi,
    corrected: 'beaucoup de personnes sont',
    explanation: 'Plural subject requires plural verb.',
    type: 'grammar',
    severity: 'error'
  }
];

function buildCorrections(text: string): GrammarCorrection[] {
  const corrections: GrammarCorrection[] = [];

  RULES.forEach((rule) => {
    const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
    let match: RegExpExecArray | null = regex.exec(text);

    while (match) {
      const original = match[0];
      const corrected = original.replace(rule.pattern, rule.corrected);
      const start = match.index;
      const end = start + original.length;

      corrections.push({
        original,
        corrected,
        explanation: rule.explanation,
        position: { start, end },
        type: rule.type,
        severity: rule.severity
      });

      match = regex.exec(text);
    }
  });

  const doubleSpacePattern = /\s{2,}/g;
  let spaceMatch: RegExpExecArray | null = doubleSpacePattern.exec(text);
  while (spaceMatch) {
    corrections.push({
      original: spaceMatch[0],
      corrected: ' ',
      explanation: 'Replace multiple spaces with a single space.',
      position: {
        start: spaceMatch.index,
        end: spaceMatch.index + spaceMatch[0].length
      },
      type: 'punctuation',
      severity: 'warning'
    });
    spaceMatch = doubleSpacePattern.exec(text);
  }

  return corrections.sort((a, b) => a.position.start - b.position.start);
}

function calculateScore(corrections: GrammarCorrection[]): number {
  let score = 100;

  corrections.forEach((correction) => {
    if (correction.severity === 'error') score -= 10;
    else if (correction.severity === 'warning') score -= 5;
    else score -= 2;
  });

  return Math.max(0, Math.min(100, score));
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<GrammarCheckResponse>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: {
        message: 'Method not allowed'
      }
    });
  }

  try {
    const { text } = req.body as { text?: string };

    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid text'
        }
      });
    }

    const corrections = buildCorrections(text);
    const score = calculateScore(corrections);

    return res.status(200).json({
      success: true,
      data: {
        text,
        corrections,
        score
      }
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
