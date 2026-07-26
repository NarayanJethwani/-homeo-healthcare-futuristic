export type VerifiedArchiveSource = {
  identifier: string;
  sourceUrl: string;
  archiveTitle: string;
  textAssetConfirmed: true;
  editionCoverage: string;
  verifiedAt: string;
};

const archiveSource = (
  identifier: string,
  archiveTitle: string,
  editionCoverage: string,
): VerifiedArchiveSource => ({
  identifier,
  sourceUrl: `https://archive.org/details/${identifier}`,
  archiveTitle,
  textAssetConfirmed: true,
  editionCoverage,
  verifiedAt: "2026-07-21",
});

// Application-layer correction overlay. The governed registry remains unchanged
// until its next approved schema/version migration.
export const VERIFIED_ARCHIVE_SOURCES: Record<string, VerifiedArchiveSource> = {
  "james-tyler-kent": archiveSource(
    "in.ernet.dli.2015.458552",
    "Lectures On Homoeopathic Materia Medica, 1st edition",
    "Single-volume work; PDF and OCR text confirmed",
  ),
  "william-boericke": archiveSource(
    "pocketmanualhom00boergoog",
    "Pocket manual of homoeopathic materia medica",
    "Single-volume work; PDF and OCR text confirmed",
  ),
  "john-henry-clarke": archiveSource(
    "adictionaryprac00clargoog",
    "A dictionary of practical materia medica",
    "Complete three-volume work represented by six scanned parts; OCR text confirmed and ingested",
  ),
  "henry-c-allen": archiveSource(
    "keynotesandchar00allegoog",
    "Keynotes and characteristics with comparisons",
    "Single-volume work; PDF and OCR text confirmed",
  ),
  "benoit-mure": archiveSource(
    "materiamedicaorp00murerich",
    "Materia medica; or, Provings of the Brazilian Empire",
    "Single-volume work; PDF and OCR text confirmed",
  ),
  "cyrus-maxwell-boger": {
    identifier: "homeoint-boger-synoptic-key",
    sourceUrl: "http://homeoint.org/books2/bogersyn/index.htm",
    archiveTitle: "A Synoptic Key of the Materia Medica — public web transcription",
    textAssetConfirmed: true,
    editionCoverage: "Complete linked transcription ingested; the Archive lending copy was not used",
    verifiedAt: "2026-07-21",
  },
  "adolf-zur-lippe": archiveSource(
    "64320760R.nlm.nih.gov",
    "Key to the materia medica, or, Comparative pharmacodynamic",
    "Single-volume work; PDF and OCR text confirmed",
  ),
  "william-boericke-short": archiveSource(
    "pocketmanualhom00boergoog",
    "Pocket manual of homoeopathic materia medica",
    "Derived/abbreviated catalogue record; no separate source edition",
  ),
  "samuel-hahnemann-organon": archiveSource(
    "bwb_P9-DTN-243",
    "Organon of Medicine, 1921",
    "Single-volume 1921 edition; PDF and OCR text confirmed",
  ),
  "constantine-hering-guiding": archiveSource(
    "guidingsymptomso00heri",
    "The guiding symptoms of our materia medica",
    "Complete ten-volume series; all ten OCR text assets confirmed and ingested",
  ),
};

export function getVerifiedArchiveSource(bookId: string): VerifiedArchiveSource | null {
  return VERIFIED_ARCHIVE_SOURCES[bookId] ?? null;
}
