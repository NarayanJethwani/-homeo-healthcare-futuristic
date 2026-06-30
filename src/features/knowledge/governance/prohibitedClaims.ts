export const PROHIBITED_PHRASES = [
  "guaranteed cure",
  "permanent cure",
  "no side effects",
  "replaces emergency care",
  "replaces conventional treatment",
  "100% effective",
  "proven cure",
  "cures instantly",
  "completely cures",
];

/**
 * Checks a localized string or object for any prohibited claims.
 * Returns a list of matches, or an empty array if clear.
 */
export function checkProhibitedClaims(text: string | Record<string, string> | any): string[] {
  if (!text) return [];
  const matches: string[] = [];
  const contentToSearch = typeof text === "string" 
    ? text 
    : JSON.stringify(text);

  const lowerContent = contentToSearch.toLowerCase();

  for (const phrase of PROHIBITED_PHRASES) {
    if (lowerContent.includes(phrase.toLowerCase())) {
      matches.push(phrase);
    }
  }

  return matches;
}
