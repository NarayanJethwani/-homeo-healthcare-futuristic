import { CitationRecord } from "../types";

export const CITATIONS: CitationRecord[] = [
  {
    id: "CIT-0001",
    title: "Efficacy of Constitutional Homeopathy in Gastroesophageal Reflux Disease (GERD)",
    authors: ["Jethwani N.", "Sharma R."],
    journal: "International Journal of Homeopathic Research",
    year: 2024,
    citationStyle: "AMA",
    category: "Primary-Research",
    sourceIdentifier: "UNVERIFIED-CIT-0001",
    sourceAuthority: "external-secondary",
    verificationStatus: "disputed",
    verifiedAt: "2026-07-29",
    verificationEvidenceUrl: "https://pubmed.ncbi.nlm.nih.gov/34892019/",
    verificationNotes:
      "The stored PubMed identifier resolves to an unrelated neuroimaging paper, and the stored DOI could not be matched in PubMed.",
    scopeTags: ["gerd", "homeopathy", "unverified-research"]
  },
  {
    id: "CIT-0002",
    title: "Individualized Homeopathic Treatment for Atopic Dermatitis: A Cohort Study",
    authors: ["Witt C. M.", "Lüdtke R."],
    journal: "Complementary Medicine Research",
    year: 2019,
    citationStyle: "AMA",
    category: "Primary-Research",
    sourceIdentifier: "UNVERIFIED-CIT-0002",
    sourceAuthority: "external-secondary",
    verificationStatus: "disputed",
    verifiedAt: "2026-07-29",
    verificationEvidenceUrl: "https://pubmed.ncbi.nlm.nih.gov/19729965/",
    verificationNotes:
      "The stored DOI resolves to an unrelated nephrology paper and the stored PubMed identifier resolves to an unrelated fetal-anemia paper.",
    scopeTags: ["atopic-dermatitis", "homeopathy", "unverified-research"]
  },
  {
    id: "CIT-0003",
    title: "TSH Reference Intervals and Homeopathic Prescribing Mappings",
    authors: ["Miller D."],
    journal: "Clinical Endocrinology Review",
    year: 2021,
    citationStyle: "AMA",
    category: "Primary-Research",
    sourceIdentifier: "UNVERIFIED-CIT-0003",
    sourceAuthority: "external-secondary",
    verificationStatus: "disputed",
    verifiedAt: "2026-07-29",
    verificationEvidenceUrl: "https://pubmed.ncbi.nlm.nih.gov/34490640/",
    verificationNotes:
      "The stored DOI resolves to an unrelated neonatal bone-mass paper and the stored PubMed identifier resolves to an unrelated outbreak report.",
    scopeTags: ["thyroid", "homeopathy", "unverified-research"]
  },
  {
    id: "CIT-0004",
    title: "Materia Medica Pura",
    authors: ["Hahnemann S."],
    journal: "Adolph Arnold",
    year: 1811,
    citationStyle: "Traditional",
    category: "Materia-Medica"
  },
  {
    id: "CIT-0005",
    title: "Lectures on Homoeopathic Materia Medica",
    authors: ["Kent J. T."],
    journal: "Boericke & Tafel",
    year: 1905,
    citationStyle: "Traditional",
    category: "Materia-Medica",
    canonicalUrl: "https://archive.org/details/lecturesonhomoeo00kent",
    sourceIdentifier: "IA-LECTURESONHOMOEO00KENT",
    sourceAuthority: "external-secondary",
    verificationStatus: "verified",
    verifiedAt: "2026-07-29",
    verificationEvidenceUrl:
      "https://archive.org/details/lecturesonhomoeo00kent",
    verificationNotes:
      "Bibliographic identity is verified for traditional-source description only; it is not modern clinical efficacy evidence.",
    scopeTags: ["traditional-use", "materia-medica", "kent"]
  },
  {
    id: "CIT-0006",
    title: "Pocket Manual of Homoeopathic Materia Medica",
    authors: ["Boericke W."],
    journal: "Boericke & Runyon",
    year: 1901,
    citationStyle: "Traditional",
    category: "Materia-Medica",
    canonicalUrl: "https://archive.org/details/pocketmanualofho00boer",
    sourceIdentifier: "IA-POCKETMANUALOFHO00BOER",
    sourceAuthority: "external-secondary",
    verificationStatus: "verified",
    verifiedAt: "2026-07-29",
    verificationEvidenceUrl:
      "https://archive.org/details/pocketmanualofho00boer",
    verificationNotes:
      "Bibliographic identity is verified for traditional-source description only; it is not modern clinical efficacy evidence.",
    scopeTags: ["traditional-use", "materia-medica", "boericke"]
  },
  {
    id: "CIT-0007",
    title: "The Chronic Diseases: Their Peculiar Nature and Their Homoeopathic Cure",
    authors: ["Hahnemann S."],
    journal: "Adolph Arnold",
    year: 1828,
    citationStyle: "Traditional",
    category: "Classical-Homeopathic-Literature"
  },
  {
    id: "CIT-0008",
    title: "A Dictionary of Practical Materia Medica",
    authors: ["Clarke J. H."],
    journal: "The Homoeopathic Publishing Company",
    year: 1900,
    citationStyle: "Traditional",
    category: "Materia-Medica"
  },
  {
    id: "CIT-0009",
    title: "Keynotes and Characteristics with Comparisons of some of the Leading Remedies of the Materia Medica",
    authors: ["Allen H. C."],
    journal: "Boericke & Tafel",
    year: 1898,
    citationStyle: "Traditional",
    category: "Materia-Medica"
  },
  {
    id: "CIT-0010",
    title: "Leaders in Homoeopathic Therapeutics",
    authors: ["Nash E. B."],
    journal: "Boericke & Tafel",
    year: 1901,
    citationStyle: "Traditional",
    category: "Materia-Medica"
  },
  {
    id: "CIT-0011",
    title: "Concise Repertory of Homoeopathic Medicines",
    authors: ["Phatak S. R."],
    journal: "B. Jain Publishers",
    year: 1963,
    citationStyle: "Traditional",
    category: "Materia-Medica"
  },
  {
    id: "CIT-0012",
    title: "Guidelines for the Treatment of Hypothyroidism: Prepared by the American Thyroid Association Task Force on Thyroid Hormone Replacement",
    authors: ["Jonklaas J.", "Bianco A. C.", "Bauer A. J.", "et al."],
    journal: "Thyroid",
    doi: "10.1089/thy.2014.0028",
    pubmedId: "25266247",
    year: 2014,
    citationStyle: "AMA",
    category: "Clinical-Guidelines",
    canonicalUrl: "https://pubmed.ncbi.nlm.nih.gov/25266247/",
    sourceIdentifier: "PMID-25266247",
    sourceAuthority: "external-authoritative",
    verificationStatus: "verified",
    verifiedAt: "2026-07-29",
    verificationEvidenceUrl: "https://pubmed.ncbi.nlm.nih.gov/25266247/",
    scopeTags: ["hypothyroidism", "thyroid-hormone-replacement", "adult"]
  },
  {
    id: "CIT-0013",
    title: "Clinical Practice Guidelines for Hypothyroidism in Adults: Cosponsored by the American Association of Clinical Endocrinologists and the American Thyroid Association",
    authors: ["Garber J. R.", "Cobin R. H.", "Gharib H.", "et al."],
    journal: "Endocrine Practice",
    doi: "10.4158/EP12280.GL",
    pubmedId: "23246686",
    year: 2012,
    citationStyle: "AMA",
    category: "Clinical-Guidelines",
    canonicalUrl: "https://pubmed.ncbi.nlm.nih.gov/23246686/",
    sourceIdentifier: "PMID-23246686",
    sourceAuthority: "external-authoritative",
    verificationStatus: "verified",
    verifiedAt: "2026-07-29",
    verificationEvidenceUrl: "https://pubmed.ncbi.nlm.nih.gov/23246686/",
    scopeTags: ["hypothyroidism", "diagnosis", "adult"]
  },
  {
    id: "CIT-0014",
    title: "Laboratory Medicine Practice Guidelines: Laboratory Support for the Diagnosis and Monitoring of Thyroid Disease",
    authors: ["Demers L. M.", "Spencer C. A."],
    journal: "National Academy of Clinical Biochemistry (NACB)",
    year: 2002,
    citationStyle: "AMA",
    category: "Clinical-Guidelines"
  },
  {
    id: "CIT-0015",
    title: "Nutritional Anemias: Guidelines for a World Health Organization (WHO) Consultation",
    authors: ["World Health Organization"],
    journal: "WHO Technical Report",
    year: 2007,
    citationStyle: "AMA",
    category: "Clinical-Guidelines"
  },
  {
    id: "CIT-0016",
    title: "Merck Manual of Diagnosis and Therapy: Hematological Disorders Section",
    authors: ["Merck Editorial Staff"],
    journal: "Merck Sharp & Dohme Corp",
    year: 2023,
    citationStyle: "AMA",
    category: "Clinical-Review"
  },
  {
    id: "CIT-0017",
    title: "Gastro-oesophageal reflux disease and dyspepsia in adults: investigation and management",
    authors: ["NICE"],
    journal: "NICE Clinical Guideline CG184",
    year: 2014,
    citationStyle: "AMA",
    category: "Clinical-Guidelines",
    canonicalUrl: "https://www.nice.org.uk/guidance/cg184",
    sourceIdentifier: "NICE-CG184",
    sourceAuthority: "external-authoritative",
    verificationStatus: "verified",
    verifiedAt: "2026-07-29",
    scopeTags: ["gerd", "dyspepsia", "adult", "diagnosis", "conventional-management"]
  },
  {
    id: "CIT-0018",
    title: "Irritable Bowel Syndrome in Adults: Diagnosis and Management",
    authors: ["NICE"],
    journal: "NICE Guideline CG61",
    year: 2008,
    citationStyle: "AMA",
    category: "Clinical-Guidelines",
    canonicalUrl: "https://www.nice.org.uk/guidance/cg61",
    sourceIdentifier: "NICE-CG61",
    sourceAuthority: "external-authoritative",
    verificationStatus: "verified",
    verifiedAt: "2026-07-29",
    scopeTags: ["irritable-bowel-syndrome", "adult", "diagnosis", "conventional-management"]
  },
  {
    id: "CIT-0019",
    title: "Atopic eczema in under 12s: diagnosis and management",
    authors: ["NICE"],
    journal: "NICE Guideline CG57",
    year: 2007,
    citationStyle: "AMA",
    category: "Clinical-Guidelines",
    canonicalUrl: "https://www.nice.org.uk/guidance/cg57",
    sourceIdentifier: "NICE-CG57",
    sourceAuthority: "external-authoritative",
    verificationStatus: "verified",
    verifiedAt: "2026-07-29",
    verificationEvidenceUrl: "https://www.nice.org.uk/guidance/cg57",
    scopeTags: ["atopic-eczema", "children-under-12", "diagnosis", "treatment"]
  },
  {
    id: "CIT-0020",
    title: "Guidelines for the Diagnosis and Management of Asthma (EPR-3)",
    authors: ["National Institutes of Health (NIH)"],
    journal: "National Heart, Lung, and Blood Institute (NHLBI)",
    year: 2007,
    citationStyle: "AMA",
    category: "Clinical-Guidelines",
    canonicalUrl:
      "https://www.nhlbi.nih.gov/health-topics/guidelines-for-diagnosis-management-of-asthma",
    sourceIdentifier: "NHLBI-EPR-3-2007",
    sourceAuthority: "external-authoritative",
    verificationStatus: "verified",
    verifiedAt: "2026-07-29",
    verificationEvidenceUrl:
      "https://www.nhlbi.nih.gov/health-topics/guidelines-for-diagnosis-management-of-asthma",
    scopeTags: ["asthma", "diagnosis", "management", "exacerbation"]
  },
  {
    id: "CIT-0021",
    title: "Allergic Rhinitis and its Impact on Asthma (ARIA) guidelines—2016 revision",
    authors: ["Brożek J. L.", "Bousquet J.", "Agache I.", "et al."],
    journal: "Journal of Allergy and Clinical Immunology",
    doi: "10.1016/j.jaci.2017.03.050",
    pubmedId: "28602936",
    year: 2017,
    citationStyle: "AMA",
    category: "Clinical-Guidelines",
    canonicalUrl: "https://pubmed.ncbi.nlm.nih.gov/28602936/",
    sourceIdentifier: "PMID-28602936",
    sourceAuthority: "external-authoritative",
    verificationStatus: "verified",
    verifiedAt: "2026-07-29",
    verificationEvidenceUrl: "https://pubmed.ncbi.nlm.nih.gov/28602936/",
    scopeTags: ["allergic-rhinitis", "asthma", "treatment", "guideline"]
  },
  {
    id: "CIT-0022",
    title: "Internal Clinical Review Note: Standard Reference Values and Homeopathic Therapeutic Mappings for Lab Diagnostics",
    authors: ["Jethwani N."],
    journal: "Homeo Healthcare Internal Review Series",
    year: 2026,
    citationStyle: "Clinical-Review",
    category: "Clinical-Review",
    sourceIdentifier: "INTERNAL-CLINICAL-REVIEW-0022",
    sourceAuthority: "internal-context",
    verificationStatus: "internal-only",
    verifiedAt: "2026-07-29",
    scopeTags: ["laboratory-reference", "internal-context"]
  }
];

export function getCitationById(id: string): CitationRecord | undefined {
  return CITATIONS.find(c => c.id === id);
}
