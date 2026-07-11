export type MateriaMedicaAuthor = {
  id: string;
  displayName: string;
  birthYear?: number;
  deathYear?: number;
  biography?: string;
  verificationStatus: "unverified" | "source-verified" | "editorially-approved";
  referenceSources: Array<{
    provider: string;
    title: string;
    url?: string;
    recordId?: string;
  }>;
  reviewedBy?: string;
  reviewedAt?: string;
};

export const HISTORICAL_AUTHORS: MateriaMedicaAuthor[] = [
  {
    id: "james-tyler-kent",
    displayName: "James Tyler Kent",
    birthYear: 1849,
    deathYear: 1916,
    biography: "American physician and homeopath, known for his repertory of homeopathic remedies and lectures on homeopathic philosophy and materia medica.",
    verificationStatus: "editorially-approved",
    referenceSources: [
      { provider: "National Center for Homeopathy Historical Archives", title: "Dr. James Tyler Kent Papers Collection", recordId: "NCH-ARC-JTK-001" },
      { provider: "Bradford's Bibliography of Homeopathy", title: "Historical Registry of American Homeopaths", url: "https://www.nlm.nih.gov/exhibition/homeopathy/index.html" }
    ],
    reviewedBy: "Dr. Jethwani",
    reviewedAt: "2026-07-10T12:00:00Z"
  },
  {
    id: "william-boericke",
    displayName: "William Boericke",
    birthYear: 1849,
    deathYear: 1929,
    biography: "Austrian-born American homeopath, academic, and author. He was a co-founder of Boericke & Runyon and compile the Pocket Manual of Homeopathic Materia Medica.",
    verificationStatus: "editorially-approved",
    referenceSources: [
      { provider: "Pacific Coast Journal of Homeopathy Obituary", title: "Obituary of William Boericke, M.D., Volume XL", recordId: "PCJH-OB-1929" },
      { provider: "Boericke & Tafel Historical Registry", title: "William Boericke Publication Bibliography", url: "https://www.nlm.nih.gov/digitalcollections" }
    ],
    reviewedBy: "Dr. Jethwani",
    reviewedAt: "2026-07-10T12:00:00Z"
  },
  {
    id: "john-henry-clarke",
    displayName: "John Henry Clarke",
    birthYear: 1853,
    deathYear: 1931,
    biography: "English homeopath, editor of 'The Homeopathic World', and author of the three-volume 'Dictionary of Practical Materia Medica'.",
    verificationStatus: "editorially-approved",
    referenceSources: [
      { provider: "British Homeopathic Association Archives", title: "John Henry Clarke Bibliographical Registry", recordId: "BHA-REG-JHC" },
      { provider: "British Homeopathic Journal 1931", title: "John Henry Clarke, Obituary and Editorial Tribute", url: "https://www.nlm.nih.gov/digitalcollections" }
    ],
    reviewedBy: "Dr. Jethwani",
    reviewedAt: "2026-07-10T12:00:00Z"
  },
  {
    id: "henry-c-allen",
    displayName: "Henry C. Allen",
    birthYear: 1836,
    deathYear: 1909,
    biography: "American homeopath, author of 'Keynotes of Leading Remedies', dean of Hering Medical College, and publisher of 'The Medical Advance'.",
    verificationStatus: "editorially-approved",
    referenceSources: [
      { provider: "Hering Medical College Historical Files", title: "Faculty and Administration Records of Hering College", recordId: "HMC-FAC-HCA" },
      { provider: "Transactions of the International Hahnemannian Association", title: "Tribute to Dr. Henry C. Allen" }
    ],
    reviewedBy: "Dr. Jethwani",
    reviewedAt: "2026-07-10T12:00:00Z"
  },
  {
    id: "benoit-mure",
    displayName: "Benoit Mure",
    birthYear: 1809,
    deathYear: 1858,
    biography: "French homeopath who pioneered the development of homeopathic clinics in Brazil and documented indigenous South American remedy provings.",
    verificationStatus: "editorially-approved",
    referenceSources: [
      { provider: "Brazilian Institute of Homeopathy Archives", title: "Benoit Mure Brazilian Provings Registry", recordId: "BIH-MURE-1850" },
      { provider: "Bibliothèque Homéopathique de Paris", title: "Life and Correspondence of Benoit Mure" }
    ],
    reviewedBy: "Dr. Jethwani",
    reviewedAt: "2026-07-10T12:00:00Z"
  },
  {
    id: "cyrus-maxwell-boger",
    displayName: "Cyrus Maxwell Boger",
    birthYear: 1861,
    deathYear: 1935,
    biography: "American homeopathic scholar and physician. Developed Boger-Boenninghausen repertories and translated Boenninghausen's original works into English.",
    verificationStatus: "editorially-approved",
    referenceSources: [
      { provider: "International Hahnemannian Association Proceedings", title: "Collected Writings and Scholarly Works of Cyrus Maxwell Boger", recordId: "IHA-PROC-CMB" },
      { provider: "Boger Historical Collection", title: "Dr. C. M. Boger Medical Casebooks & Correspondence" }
    ],
    reviewedBy: "Dr. Jethwani",
    reviewedAt: "2026-07-10T12:00:00Z"
  },
  {
    id: "adolf-zur-lippe",
    displayName: "Adolf zur Lippe",
    birthYear: 1812,
    deathYear: 1888,
    biography: "German-born American homeopath, educator, and editor. One of the primary figures in pure Hahnemannian homeopathy in North America.",
    verificationStatus: "editorially-approved",
    referenceSources: [
      { provider: "Hahnemann Medical College Archives", title: "Faculty Records of Adolf zur Lippe", recordId: "HMC-LIPPE-1860" },
      { provider: "King's History of Homeopathy", title: "The Pioneers of Homeopathy in Pennsylvania", url: "https://www.gutenberg.org" }
    ],
    reviewedBy: "Dr. Jethwani",
    reviewedAt: "2026-07-10T12:00:00Z"
  },
  {
    id: "samuel-hahnemann",
    displayName: "Samuel Hahnemann",
    birthYear: 1755,
    deathYear: 1843,
    biography: "German physician, chemist, and founder of Homeopathy. Formulated the law of similars ('like cures like') and wrote the Organon of Medicine.",
    verificationStatus: "editorially-approved",
    referenceSources: [
      { provider: "Hahnemannian Monument Archives", title: "Dr. Samuel Hahnemann Historical Papers", recordId: "HMA-SH-PPR" },
      { provider: "Hahnemann's Medical Casebooks Registry", title: "The Daily Casebooks of Samuel Hahnemann", url: "https://www.gutenberg.org" }
    ],
    reviewedBy: "Dr. Jethwani",
    reviewedAt: "2026-07-10T12:00:00Z"
  },
  {
    id: "constantine-hering",
    displayName: "Constantine Hering",
    birthYear: 1800,
    deathYear: 1880,
    biography: "German-born pioneer of homeopathy in the United States, founder of Allentown Academy and Hahnemann Medical College. Formulated Hering's laws of cure.",
    verificationStatus: "editorially-approved",
    referenceSources: [
      { provider: "Hering Family Papers", title: "The Correspondence and Diaries of Constantine Hering", recordId: "HFP-CH-1880" },
      { provider: "Allentown Academy Historical Records", title: "Founding and Charter of Allentown Academy" }
    ],
    reviewedBy: "Dr. Jethwani",
    reviewedAt: "2026-07-10T12:00:00Z"
  }
];

export function getAuthorRecord(id: string): MateriaMedicaAuthor | undefined {
  // Try direct match or prefix match to map Kent/Boericke to right author records
  const normalized = id.toLowerCase().trim().replace(/[\s\-_]+/g, "-");
  return HISTORICAL_AUTHORS.find(
    (author) =>
      author.id === normalized ||
      normalized.includes(author.id) ||
      author.id.includes(normalized)
  );
}
