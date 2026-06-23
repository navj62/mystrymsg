import { describe, it, expect } from 'vitest';
import { parseSuggestions, FALLBACK_QUESTIONS } from '@/lib/suggestions';

describe('parseSuggestions', () => {
  it('splits a "||"-separated string into trimmed questions', () => {
    const raw = 'What is your favorite book?||Where would you travel?||What made you smile?';
    expect(parseSuggestions(raw)).toEqual([
      'What is your favorite book?',
      'Where would you travel?',
      'What made you smile?',
    ]);
  });

  it('trims surrounding whitespace around each question', () => {
    expect(parseSuggestions('  a  ||  b ')).toEqual(['a', 'b']);
  });

  it('drops empty segments from trailing/leading/double separators', () => {
    expect(parseSuggestions('a||||b||')).toEqual(['a', 'b']);
  });

  it('returns an empty array for an empty/whitespace string', () => {
    expect(parseSuggestions('')).toEqual([]);
    expect(parseSuggestions('   ')).toEqual([]);
  });

  it('treats a single question with no separator as one item', () => {
    expect(parseSuggestions('just one question')).toEqual(['just one question']);
  });
});

describe('FALLBACK_QUESTIONS', () => {
  it('provides exactly three non-empty fallback prompts', () => {
    expect(FALLBACK_QUESTIONS).toHaveLength(3);
    expect(FALLBACK_QUESTIONS.every((q) => q.trim().length > 0)).toBe(true);
  });
});
