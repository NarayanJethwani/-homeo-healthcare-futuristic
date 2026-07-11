export function normalizeSearchQuery(query: string): string {
  if (!query) return "";
  return query
    .toLowerCase()
    .normalize("NFC")
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeSearchField(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFC")
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenizeSearchText(text: string): string[] {
  const normalized = normalizeSearchField(text);
  return normalized.split(" ").filter((t) => t.length > 0);
}
