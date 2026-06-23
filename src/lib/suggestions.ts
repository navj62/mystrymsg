// Shown when Gemini is unavailable / rate-limited so the UI still works.
export const FALLBACK_QUESTIONS = [
  "What's a hobby you've recently started?",
  "If you could travel anywhere right now, where would you go?",
  "What's a small thing that made you smile today?",
];

/**
 * Splits the model's "a||b||c" response into a clean list of questions,
 * trimming whitespace and dropping empty entries.
 */
export function parseSuggestions(raw: string): string[] {
  return raw
    .split("||")
    .map((q) => q.trim())
    .filter(Boolean);
}
