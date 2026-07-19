import { describe, it, expect } from 'vitest';
import {
  CEFR_LEVELS,
  isCefrLevel,
  nextLevelOf,
  difficultyForLevel,
  levelForDifficulty,
  cefrForScore
} from './curriculum';

describe('isCefrLevel', () => {
  it('accepts every CEFR level', () => {
    for (const level of CEFR_LEVELS) {
      expect(isCefrLevel(level)).toBe(true);
    }
  });

  it('rejects invalid values', () => {
    expect(isCefrLevel('D1')).toBe(false);
    expect(isCefrLevel('')).toBe(false);
    expect(isCefrLevel(null)).toBe(false);
    expect(isCefrLevel(undefined)).toBe(false);
    expect(isCefrLevel('a1')).toBe(false);
  });
});

describe('nextLevelOf', () => {
  it('advances through the ladder', () => {
    expect(nextLevelOf('A1')).toBe('A2');
    expect(nextLevelOf('A2')).toBe('B1');
    expect(nextLevelOf('B1')).toBe('B2');
    expect(nextLevelOf('B2')).toBe('C1');
    expect(nextLevelOf('C1')).toBe('C2');
  });

  it('returns null at the top and for unknown levels', () => {
    expect(nextLevelOf('C2')).toBeNull();
    expect(nextLevelOf('bogus')).toBeNull();
  });
});

describe('difficulty mapping', () => {
  it('buckets levels into difficulties', () => {
    expect(difficultyForLevel('A1')).toBe('easy');
    expect(difficultyForLevel('A2')).toBe('easy');
    expect(difficultyForLevel('B1')).toBe('medium');
    expect(difficultyForLevel('B2')).toBe('medium');
    expect(difficultyForLevel('C1')).toBe('hard');
    expect(difficultyForLevel('C2')).toBe('hard');
  });

  it('round-trips: the representative level maps back to its difficulty', () => {
    for (const difficulty of ['easy', 'medium', 'hard'] as const) {
      expect(difficultyForLevel(levelForDifficulty(difficulty))).toBe(difficulty);
    }
  });
});

describe('cefrForScore', () => {
  it('maps score bands to levels with correct boundaries', () => {
    expect(cefrForScore(0)).toBe('A1');
    expect(cefrForScore(34)).toBe('A1');
    expect(cefrForScore(35)).toBe('A2');
    expect(cefrForScore(49)).toBe('A2');
    expect(cefrForScore(50)).toBe('B1');
    expect(cefrForScore(64)).toBe('B1');
    expect(cefrForScore(65)).toBe('B2');
    expect(cefrForScore(79)).toBe('B2');
    expect(cefrForScore(80)).toBe('C1');
    expect(cefrForScore(89)).toBe('C1');
    expect(cefrForScore(90)).toBe('C2');
    expect(cefrForScore(100)).toBe('C2');
  });
});
