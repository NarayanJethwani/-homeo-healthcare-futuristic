import { JETHWANI_REPERTORY_DATA } from "@/lib/repertoryData";

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferOrganSystem(name: string): string {
  const text = name.toLowerCase();
  if (text.includes("heart") || text.includes("pulse") || text.includes("hypertension") || text.includes("circulation")) return "Cardiovascular";
  if (text.includes("stomach") || text.includes("gerd") || text.includes("ibs") || text.includes("gastric") || text.includes("acidity") || text.includes("bloating")) return "Gastrointestinal";
  if (text.includes("asthma") || text.includes("respiratory") || text.includes("cough") || text.includes("sinusitis") || text.includes("rhinitis") || text.includes("bronchial")) return "Respiratory";
  if (text.includes("eczema") || text.includes("skin") || text.includes("dermatitis") || text.includes("acne") || text.includes("psoriasis") || text.includes("urticaria") || text.includes("hives")) return "Skin / Integumentary";
  if (text.includes("thyroid") || text.includes("hypothyroidism") || text.includes("pcos") || text.includes("hormonal") || text.includes("metabolism") || text.includes("insulin")) return "Endocrine";
  if (text.includes("joint") || text.includes("arthritis") || text.includes("musculoskeletal") || text.includes("fibromyalgia") || text.includes("back") || text.includes("pain")) return "Musculoskeletal";
  if (text.includes("burnout") || text.includes("anxiety") || text.includes("panic") || text.includes("insomnia") || text.includes("sleep") || text.includes("mind") || text.includes("depression")) return "Psychology & Psychiatry";
  return "Generalities";
}

export function getV2FallbackRubrics() {
  const now = new Date().toISOString();

  return JETHWANI_REPERTORY_DATA.map((rubric) => {
    const words = rubric.name.toLowerCase().split(/[\s,\.\-_]+/);

    return {
      id: rubric.id,
      name: rubric.name,
      slug: generateSlug(rubric.name),
      parentRubricId: null,
      description: rubric.researchCitation?.detail || "Dr. Jethwani's clinical indicator.",
      category: rubric.section,
      subcategory: rubric.name.split(",")[0] || rubric.section,
      organSystem: inferOrganSystem(rubric.name),
      clinicalPriority: rubric.id.includes("burnout") || rubric.id.includes("panic") || rubric.id.includes("collapse") ? "high" : "medium",
      createdDate: now,
      modifiedDate: now,
      status: "active",
      searchWeight: 1,
      remedies: rubric.remedies,
      indexWeights: rubric.indexWeights,
      researchCitation: rubric.researchCitation,
      keywords: Array.from(new Set(words.filter((word) => word.length > 3))),
      synonyms: [],
      clinicalConditions: [],
      modalities: [],
      miasms: rubric.id.includes("psora") ? ["Psora"] : rubric.id.includes("sycosis") ? ["Sycosis"] : rubric.id.includes("syphilis") ? ["Syphilis"] : [],
    };
  });
}
