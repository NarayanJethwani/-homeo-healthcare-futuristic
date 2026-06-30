export const CITATION_POLICY = {
  style: "AMA (American Medical Association)",
  minCitationsPerEntity: 1,
  acceptableSources: [
    "Peer-reviewed clinical trials (indexed in PubMed/MEDLINE)",
    "Official guidelines (WHO, ACG, CDC, NHS)",
    "Classical Homeopathic Materia Medica (Kent, Boericke, Clarke, Allen, Boger)",
    "Hahnemann's Organon of Medicine (6th Edition)",
  ],
  requiredFields: {
    author: "Primary investigator or book author.",
    title: "Article or book title.",
    source: "Journal, publisher, or repository.",
    year: "Publication or revision year.",
    identifier: "DOI, PubMed ID (PMID), or reference chapter/page.",
  },
  attributionPreferences: {
    textLink: true,
    schemaLD: true,
    citationBlock: true,
  },
};
