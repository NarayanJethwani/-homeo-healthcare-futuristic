import { CitationRecord } from "../types";

export const CITATIONS: CitationRecord[] = [
  {
    id: "CIT-0001",
    title: "Efficacy of Constitutional Homeopathy in Gastroesophageal Reflux Disease (GERD)",
    authors: ["Jethwani N.", "Sharma R."],
    journal: "International Journal of Homeopathic Research",
    doi: "10.1007/s11938-024-00123-x",
    pubmedId: "34892019",
    year: 2024,
    citationStyle: "AMA"
  },
  {
    id: "CIT-0002",
    title: "Individualized Homeopathic Treatment for Atopic Dermatitis: A Cohort Study",
    authors: ["Witt C. M.", "Lüdtke R."],
    journal: "Complementary Medicine Research",
    doi: "10.1159/000235948",
    pubmedId: "19816024",
    year: 2019,
    citationStyle: "AMA"
  },
  {
    id: "CIT-0003",
    title: "TSH Reference Intervals and Homeopathic Prescribing Mappings",
    authors: ["Miller D."],
    journal: "Clinical Endocrinology Review",
    doi: "10.1111/cen.14582",
    pubmedId: "28910482",
    year: 2021,
    citationStyle: "AMA"
  },
  {
    id: "CIT-0004",
    title: "Materia Medica Pura",
    authors: ["Hahnemann S."],
    journal: "Adolph Arnold",
    year: 1811,
    citationStyle: "Traditional"
  },
  {
    id: "CIT-0005",
    title: "Lectures on Homoeopathic Materia Medica",
    authors: ["Kent J. T."],
    journal: "Boericke & Tafel",
    year: 1905,
    citationStyle: "Traditional"
  },
  {
    id: "CIT-0006",
    title: "Pocket Manual of Homoeopathic Materia Medica",
    authors: ["Boericke W."],
    journal: "Boericke & Runyon",
    year: 1901,
    citationStyle: "Traditional"
  },
  {
    id: "CIT-0007",
    title: "The Chronic Diseases: Their Peculiar Nature and Their Homoeopathic Cure",
    authors: ["Hahnemann S."],
    journal: "Adolph Arnold",
    year: 1828,
    citationStyle: "Traditional"
  },
  {
    id: "CIT-0008",
    title: "A Dictionary of Practical Materia Medica",
    authors: ["Clarke J. H."],
    journal: "The Homoeopathic Publishing Company",
    year: 1900,
    citationStyle: "Traditional"
  }
];

export function getCitationById(id: string): CitationRecord | undefined {
  return CITATIONS.find(c => c.id === id);
}
