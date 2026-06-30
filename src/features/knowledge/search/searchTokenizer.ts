/**
 * Splits text into a clean set of normalized query tokens (lowercased, alphanumeric only, trimmed).
 */
export function tokenize(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(token => token.trim().length > 1);
}
