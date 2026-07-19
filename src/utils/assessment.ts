import { cefrForScore, isCefrLevel } from '@/lib/curriculum';

export interface NormalizedCriterion {
  score: number;
  comment: string;
}

export interface NormalizedCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

export interface NormalizedAssessment {
  overallScore: number;
  cefrEstimate: string;
  criteria: Record<string, NormalizedCriterion>;
  corrections: NormalizedCorrection[];
  feedback: string;
}

const clampScore = (value: unknown): number | null => {
  const score = Number(value);
  if (!Number.isFinite(score)) return null;
  return Math.min(100, Math.max(0, Math.round(score)));
};

/**
 * Validate and clamp a model-produced rubric assessment before it reaches
 * clients or the database. Returns null when the output is unusable (no
 * valid overall score) so routes can fail loudly instead of persisting
 * fabricated zeros or letting NaN/malformed shapes crash the UI.
 */
export function normalizeAssessment(
  raw: unknown,
  criteriaKeys: string[]
): NormalizedAssessment | null {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as Record<string, unknown>;

  const overallScore = clampScore(data.overallScore);
  if (overallScore === null) return null;

  const criteria: Record<string, NormalizedCriterion> = {};
  const rawCriteria = (data.criteria && typeof data.criteria === 'object'
    ? data.criteria
    : {}) as Record<string, unknown>;
  for (const key of criteriaKeys) {
    const entry = (rawCriteria[key] && typeof rawCriteria[key] === 'object'
      ? rawCriteria[key]
      : {}) as Record<string, unknown>;
    criteria[key] = {
      score: clampScore(entry.score) ?? overallScore,
      comment: typeof entry.comment === 'string' ? entry.comment : ''
    };
  }

  const corrections: NormalizedCorrection[] = Array.isArray(data.corrections)
    ? (data.corrections as unknown[])
        .filter((c): c is Record<string, unknown> => Boolean(c) && typeof c === 'object')
        .map((c) => ({
          original: typeof c.original === 'string' ? c.original : '',
          corrected: typeof c.corrected === 'string' ? c.corrected : '',
          explanation: typeof c.explanation === 'string' ? c.explanation : ''
        }))
        .filter((c) => c.original && c.corrected)
        .slice(0, 10)
    : [];

  return {
    overallScore,
    cefrEstimate: isCefrLevel(data.cefrEstimate as string)
      ? (data.cefrEstimate as string)
      : cefrForScore(overallScore),
    criteria,
    corrections,
    feedback: typeof data.feedback === 'string' ? data.feedback : ''
  };
}
