const normalizeRemedyName = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

type RemedyIdentity = {
  abbreviation: string;
  fullName: string;
};

/**
 * Resolve a source heading without allowing a short repertory abbreviation
 * (for example Bell) to capture a different remedy (Bellis perennis).
 */
export function findRemedyHeadingIndex(headings: string[], identity: RemedyIdentity): number {
  const normalizedHeadings = headings.map(normalizeRemedyName);
  const fullName = normalizeRemedyName(identity.fullName);
  const abbreviation = normalizeRemedyName(identity.abbreviation);

  const exactFullName = normalizedHeadings.indexOf(fullName);
  if (exactFullName >= 0) return exactFullName;

  const exactAbbreviation = normalizedHeadings.indexOf(abbreviation);
  if (exactAbbreviation >= 0) return exactAbbreviation;

  // OCR headings can append qualifiers. Only the canonical full name is safe
  // for prefix matching; abbreviations are deliberately excluded.
  if (fullName.length >= 5) {
    return normalizedHeadings.findIndex((heading) => heading.startsWith(fullName));
  }

  return -1;
}
