import { KnowledgeEntity, EntityType } from "../types";
import { AudienceMode } from "../context/PatientModeContext";
import { getAllKnowledgeEntities, getEntityUrl } from "../index";
import { KNOWLEDGE_RELATIONSHIPS } from "./entityRelationships";
import { COMPARISONS } from "../comparisons/comparisonRegistry";
import { CURATED_COLLECTIONS } from "../collections/collectionsRegistry";

export interface LearningPathStep {
  label: string;
  href: string;
  isActive: boolean;
  type: "disease" | "symptom" | "remedy" | "lab-test" | "info" | "cta";
  description?: string;
  readingTimeMinutes?: number;
}

// Map categories to user-friendly colors (Tailwind classes)
export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  thyroid: { bg: "bg-teal-500/10", text: "text-teal-600 dark:text-teal-400", border: "border-teal-500/20" },
  hematology: { bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400", border: "border-red-500/20" },
  gastrointestinal: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/20" },
  dermatology: { bg: "bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-500/20" },
  respiratory: { bg: "bg-sky-500/10", text: "text-sky-600 dark:text-sky-400", border: "border-sky-500/20" },
  musculoskeletal: { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400", border: "border-purple-500/20" },
  urology: { bg: "bg-pink-500/10", text: "text-pink-600 dark:text-pink-400", border: "border-pink-500/20" },
  general: { bg: "bg-neutral-500/10", text: "text-neutral-600 dark:text-neutral-400", border: "border-neutral-500/20" }
};

export function getClinicalCategory(entity: KnowledgeEntity): string {
  const id = entity.id;
  const name = entity.slug;
  const tags = (entity.tags || []).map(t => t.toLowerCase());
  const title = (typeof entity.title === "string" ? entity.title : entity.title.en || "").toLowerCase();
  const identifier = (id + " " + name + " " + title + " " + tags.join(" ")).toLowerCase();
  
  if (identifier.includes("hba1c") || identifier.includes("diabetes") || identifier.includes("blood-sugar")) {
    return "general";
  }
  if (identifier.includes("thyroid") || identifier.includes("tpo") || identifier.includes("tsh") || identifier.includes("graves") || identifier.includes("hashimoto") || identifier.includes("thyroidinum") || identifier.includes("iodum") || identifier.includes("weight-gain") || identifier.includes("cold-intolerance") || identifier.includes("hair-fall") || identifier.includes("ft3") || identifier.includes("ft4") || identifier.includes("free-t3") || identifier.includes("free-t4")) {
    return "thyroid";
  }
  if (identifier.includes("cbc") || identifier.includes("blood count") || identifier.includes("anemia") || identifier.includes("iron") || identifier.includes("ferritin") || identifier.includes("tibc") || identifier.includes("folic") || identifier.includes("b12") || identifier.includes("hemoglobin") || identifier.includes("platelet") || identifier.includes("wbc") || identifier.includes("ana ") || identifier.includes("antinuclear") || identifier.includes("esr") || identifier.includes("crp") || identifier.includes("fatigue")) {
    return "hematology";
  }
  if (identifier.includes("gerd") || identifier.includes("gastritis") || identifier.includes("reflux") || identifier.includes("ibs") || identifier.includes("peptic") || identifier.includes("acid") || identifier.includes("constipation") || identifier.includes("diarrhea") || identifier.includes("colic") || identifier.includes("h-pylori") || identifier.includes("bowel") || identifier.includes("gallstone") || identifier.includes("hypochlorhydria") || identifier.includes("hyperacidity") || identifier.includes("indigestion") || identifier.includes("morning-sickness") || identifier.includes("flatulent") || identifier.includes("nux-vomica") || identifier.includes("lycopodium") || identifier.includes("pulsatilla") || identifier.includes("carbo-veg") || identifier.includes("flatulence") || identifier.includes("bloating") || identifier.includes("heartburn")) {
    return "gastrointestinal";
  }
  if (identifier.includes("eczema") || identifier.includes("dermatitis") || identifier.includes("psoriasis") || identifier.includes("acne") || identifier.includes("urticaria") || identifier.includes("skin") || identifier.includes("erupt") || identifier.includes("prurit") || identifier.includes("itch") || identifier.includes("cyst") || identifier.includes("intertrigo") || identifier.includes("mastitis") || identifier.includes("fibroadenoma") || identifier.includes("sulphur") || identifier.includes("graphites") || identifier.includes("thuja")) {
    return "dermatology";
  }
  if (identifier.includes("asthma") || identifier.includes("rhinitis") || identifier.includes("sinus") || identifier.includes("cough") || identifier.includes("breath") || identifier.includes("bronch") || identifier.includes("allerg") || identifier.includes("wheez") || identifier.includes("throat") || identifier.includes("laryngitis") || identifier.includes("voice") || identifier.includes("dysphonia") || identifier.includes("gelsemium") || identifier.includes("belladonna") || identifier.includes("hepar")) {
    return "respiratory";
  }
  if (identifier.includes("pain") || identifier.includes("back") || identifier.includes("headache") || identifier.includes("migraine") || identifier.includes("neuralg") || identifier.includes("neurop") || identifier.includes("sciatica") || identifier.includes("joint") || identifier.includes("stiff") || identifier.includes("muscle") || identifier.includes("plantar") || identifier.includes("fasciitis") || identifier.includes("meniere") || identifier.includes("paresthesia") || identifier.includes("numbness") || identifier.includes("limbs") || identifier.includes("legs") || identifier.includes("arnica") || identifier.includes("rhus") || identifier.includes("bryonia")) {
    return "musculoskeletal";
  }
  if (identifier.includes("urination") || identifier.includes("bladder") || identifier.includes("urine") || identifier.includes("renal") || identifier.includes("nephr") || identifier.includes("microalbumin") || identifier.includes("sodium") || identifier.includes("potassium") || identifier.includes("cystitis") || identifier.includes("micturition") || identifier.includes("dysuria") || identifier.includes("lycopodium") || identifier.includes("cantharis")) {
    return "urology";
  }

  // Curated collections fallback
  for (const col of CURATED_COLLECTIONS) {
    if (col.entityIds.includes(entity.id)) {
      if (col.id === "col-thyroid") return "thyroid";
      if (col.id === "col-digestive") return "gastrointestinal";
      if (col.id === "col-respiratory") return "respiratory";
      if (col.id === "col-skin") return "dermatology";
      if (col.id === "col-musculoskeletal") return "musculoskeletal";
      if (col.id === "col-womens") return "urology";
    }
  }

  return "general";
}

export function getFallbackComparison(currentEntity: KnowledgeEntity, category: string): string {
  const allEntities = getAllKnowledgeEntities();
  
  // 1. Try to find a comparison that explicitly features this entity
  const directComp = COMPARISONS.find(c => c.entity1Id === currentEntity.id || c.entity2Id === currentEntity.id);
  if (directComp) return `/knowledge/compare/${directComp.slug}`;

  // 2. Try to find a comparison where at least one entity is of the same clinical category
  const categoryComp = COMPARISONS.find(c => {
    const e1 = allEntities.find(x => x.id === c.entity1Id);
    const e2 = allEntities.find(x => x.id === c.entity2Id);
    if (e1 && getClinicalCategory(e1) === category) return true;
    if (e2 && getClinicalCategory(e2) === category) return true;
    return false;
  });
  if (categoryComp) return `/knowledge/compare/${categoryComp.slug}`;

  // 3. Absolute fallbacks by category
  if (category === "thyroid") {
    return "/knowledge/compare/hypothyroidism-vs-hyperthyroidism";
  }

  // 4. Default fallbacks by entity type
  if (currentEntity.entityType === "lab-test") {
    return "/knowledge/compare/cbc-vs-esr";
  } else if (currentEntity.entityType === "remedy") {
    return "/knowledge/compare/nux-vomica-vs-lycopodium";
  } else {
    return "/knowledge/compare/gerd-vs-gastritis";
  }
}

export function scoreEntity(candidate: KnowledgeEntity, source: KnowledgeEntity): number {
  let score = 0;

  // Direct relationship in graph (incoming or outgoing)
  const directRel = KNOWLEDGE_RELATIONSHIPS.find(
    rel => (rel.source === source.id && rel.target === candidate.id) ||
           (rel.source === candidate.id && rel.target === source.id)
  );
  if (directRel) {
    score += 50;
  }

  // Clinical category match (highly prioritized to avoid mixing unrelated body systems)
  const sourceCat = getClinicalCategory(source);
  const candidateCat = getClinicalCategory(candidate);
  if (sourceCat === candidateCat && sourceCat !== "general") {
    score += 200; // Large boost to ensure path continuity in same medical category
  }

  // Endocrine/Thyroid prioritization tie-breaker to establish clinically logical panel hierarchy
  if (sourceCat === "thyroid" && candidateCat === "thyroid") {
    if (candidate.slug === "tsh") score += 200;
    if (candidate.slug === "ft4" || candidate.slug === "free-t4") score += 150;
    if (candidate.slug === "ft3" || candidate.slug === "free-t3") score += 100;
  }

  // Specialty match
  if (source.reviewer?.specialty && candidate.reviewer?.specialty &&
      source.reviewer.specialty === candidate.reviewer.specialty) {
    score += 30;
  }

  // Shared tags
  const sharedTags = source.tags.filter(t => candidate.tags.includes(t));
  score += sharedTags.length * 10;

  // Shared neighbors in graph (2nd degree)
  const sourceNeighbors = new Set(
    KNOWLEDGE_RELATIONSHIPS.filter(rel => rel.source === source.id || rel.target === source.id)
      .map(rel => rel.source === source.id ? rel.target : rel.source)
  );
  const candidateNeighbors = KNOWLEDGE_RELATIONSHIPS.filter(rel => rel.source === candidate.id || rel.target === candidate.id)
    .map(rel => rel.source === candidate.id ? rel.target : rel.source);
  
  const commonNeighbors = candidateNeighbors.filter(n => sourceNeighbors.has(n));
  score += commonNeighbors.length * 15;

  return score;
}

export function getTopEntitiesOfType(
  currentEntity: KnowledgeEntity,
  type: EntityType,
  count: number,
  excludeIds: Set<string>
): KnowledgeEntity[] {
  const allEntities = getAllKnowledgeEntities();
  
  const sorted = allEntities
    .filter(e => e.entityType === type && e.id !== currentEntity.id && !excludeIds.has(e.id))
    .map(e => ({ entity: e, score: scoreEntity(e, currentEntity) }))
    .sort((a, b) => b.score - a.score);

  return sorted.slice(0, count).map(x => x.entity);
}

function getShortTitle(titleObj: any): string {
  const titleStr = typeof titleObj === "string" ? titleObj : titleObj.en || "";
  return titleStr.split("(")[0].split("/")[0].trim();
}

function getSummaryText(entity: KnowledgeEntity): string {
  const sumObj = entity.summary;
  if (!sumObj) return "";
  if (typeof sumObj === "string") return sumObj;
  return sumObj.en || "";
}

function getContextAwareDescription(entity: KnowledgeEntity, parentEntity: KnowledgeEntity): string {
  const category = getClinicalCategory(parentEntity);
  const slug = entity.slug;
  
  if (slug === "hypothyroidism") {
    return "Hypothyroidism: Low thyroid hormone production";
  }
  if (slug === "hyperthyroidism") {
    return "Hyperthyroidism: Excess thyroid hormone production";
  }
  if (slug === "hair-fall") {
    if (category === "thyroid") {
      return "Hair Fall: May occur in autoimmune thyroid disease";
    }
    return "Hair Fall: Excess shedding of scalp hair follicles";
  }
  if (slug === "ft3") {
    return "FT3: Measures active thyroid hormone";
  }
  if (slug === "ft4") {
    return "FT4: Measures circulating thyroid storage hormone";
  }
  if (slug === "tsh") {
    return "TSH: Regulates thyroid gland hormone release";
  }
  if (slug === "anti-tpo-antibodies") {
    return "Anti-TPO: Identifies autoimmune thyroid antibodies";
  }
  if (slug === "cbc") {
    return "CBC: Screens for anemia and cellular counts";
  }
  if (slug === "anemia") {
    return "Anemia: Diminished oxygen-carrying red cells";
  }
  if (slug === "fatigue") {
    return "Fatigue: Persistent depletion of physical/mental energy";
  }
  if (slug === "weight-gain") {
    return "Weight Gain: Unexplained increase in body mass index";
  }
  if (slug === "nux-vomica") {
    return "Nux Vomica: Key gastrointestinal irritations & spasms";
  }
  if (slug === "lycopodium") {
    return "Lycopodium: Indigestion, flatulence, and liver support";
  }
  if (slug === "gastroesophageal-reflux-disease") {
    return "GERD: Acid reflux irritating esophageal lining";
  }

  // Fall back to getSummaryText or title
  const name = typeof entity.title === "string" ? entity.title : entity.title.en || "";
  const rawSummary = getSummaryText(entity);
  if (rawSummary) {
    const firstSentence = rawSummary.split(".")[0];
    const shortSum = firstSentence.length > 50 ? firstSentence.slice(0, 47) + "..." : firstSentence;
    return `${getShortTitle(name)}: ${shortSum}`;
  }
  return getShortTitle(name);
}

export function generateLearningPath(
  currentEntity: KnowledgeEntity,
  mode: AudienceMode
): LearningPathStep[] {
  const steps: LearningPathStep[] = [];
  const excludeIds = new Set<string>([currentEntity.id]);
  const category = getClinicalCategory(currentEntity);
  const capitalizedCat = category.charAt(0).toUpperCase() + category.slice(1);

  // Helper to safely get entities and add to exclude set
  const getNextEntity = (type: EntityType) => {
    const list = getTopEntitiesOfType(currentEntity, type, 1, excludeIds);
    if (list.length > 0) {
      excludeIds.add(list[0].id);
      return list[0];
    }
    return null;
  };

  const getUrl = (entity: KnowledgeEntity) => {
    return getEntityUrl(entity.entityType, entity.slug);
  };

  // 1. DISEASE PATHS
  if (currentEntity.entityType === "disease") {
    if (mode === "patient") {
      const sym = getNextEntity("symptom");
      if (sym) {
        steps.push({
          label: "Initial Presentation",
          href: getUrl(sym),
          isActive: false,
          type: "symptom",
          description: getContextAwareDescription(sym, currentEntity),
          readingTimeMinutes: sym.readingTimeMinutes || 2
        });
      }
      steps.push({
        label: "Condition Overview",
        href: getUrl(currentEntity),
        isActive: true,
        type: "disease",
        description: getContextAwareDescription(currentEntity, currentEntity),
        readingTimeMinutes: currentEntity.readingTimeMinutes || 3
      });
      steps.push({
        label: "Causes & Triggers",
        href: `/knowledge/diseases/${currentEntity.slug}#etiology`,
        isActive: false,
        type: "info",
        description: `Pathogenesis factors of ${getShortTitle(currentEntity.title)}`,
        readingTimeMinutes: 2
      });
      steps.push({
        label: "Dietary & Lifestyle Guidelines",
        href: `/diet-lifestyle?focus=${category}`,
        isActive: false,
        type: "info",
        description: `Supportive self-care protocols for ${capitalizedCat} health`,
        readingTimeMinutes: 3
      });
      steps.push({
        label: "Next Step",
        href: "/contact",
        isActive: false,
        type: "cta",
        description: "Book Consultation"
      });
    } else if (mode === "student") {
      steps.push({
        label: "Core Pathology",
        href: getUrl(currentEntity),
        isActive: true,
        type: "disease",
        description: getContextAwareDescription(currentEntity, currentEntity),
        readingTimeMinutes: currentEntity.readingTimeMinutes || 3
      });
      steps.push({
        label: "Etiology & Pathophysiology",
        href: `/knowledge/diseases/${currentEntity.slug}#etiology`,
        isActive: false,
        type: "info",
        description: "Functional disease mechanisms and causes",
        readingTimeMinutes: 2
      });
      
      const compUrl = getFallbackComparison(currentEntity, category);
      steps.push({
        label: "Differential Matrix",
        href: compUrl,
        isActive: false,
        type: "info",
        description: "Comparative diagnostic parameters",
        readingTimeMinutes: 4
      });
      
      const sym = getNextEntity("symptom");
      if (sym) {
        steps.push({
          label: "Clinical Presentation",
          href: getUrl(sym),
          isActive: false,
          type: "symptom",
          description: getContextAwareDescription(sym, currentEntity),
          readingTimeMinutes: sym.readingTimeMinutes || 2
        });
      }
      steps.push({
        label: "Evidence & Clinical References",
        href: `/knowledge/diseases/${currentEntity.slug}#references`,
        isActive: false,
        type: "info",
        description: "Literature bibliography and citations",
        readingTimeMinutes: 2
      });
      steps.push({
        label: "Next Step",
        href: "/knowledge",
        isActive: false,
        type: "cta",
        description: "Continue Learning"
      });
    } else {
      // Practitioner
      steps.push({
        label: "Clinical Profile",
        href: getUrl(currentEntity),
        isActive: true,
        type: "disease",
        description: getContextAwareDescription(currentEntity, currentEntity),
        readingTimeMinutes: currentEntity.readingTimeMinutes || 3
      });
      const lab = getNextEntity("lab-test");
      if (lab) {
        steps.push({
          label: "Diagnostic Panel",
          href: getUrl(lab),
          isActive: false,
          type: "lab-test",
          description: getContextAwareDescription(lab, currentEntity),
          readingTimeMinutes: lab.readingTimeMinutes || 2
        });
      }
      steps.push({
        label: "Clinical Red Flags",
        href: `/knowledge/diseases/${currentEntity.slug}#redflags`,
        isActive: false,
        type: "info",
        description: "High-risk symptoms requiring referral",
        readingTimeMinutes: 2
      });
      const rem = getNextEntity("remedy");
      if (rem) {
        steps.push({
          label: "Therapeutic Options",
          href: getUrl(rem),
          isActive: false,
          type: "remedy",
          description: getContextAwareDescription(rem, currentEntity),
          readingTimeMinutes: rem.readingTimeMinutes || 3
        });
      }
      steps.push({
        label: "Next Step",
        href: "/patient/login",
        isActive: false,
        type: "cta",
        description: "Clinical Workspace"
      });
    }
  }

  // 2. LAB TEST PATHS
  else if (currentEntity.entityType === "lab-test") {
    if (mode === "patient") {
      steps.push({
        label: "Why is this test ordered?",
        href: `/knowledge/lab-tests/${currentEntity.slug}#overview`,
        isActive: false,
        type: "info",
        description: `Objective: Assess ${getShortTitle(currentEntity.title)} status`,
        readingTimeMinutes: 2
      });
      steps.push({
        label: "How should I prepare?",
        href: `/knowledge/lab-tests/${currentEntity.slug}#overview`,
        isActive: false,
        type: "info",
        description: "Patient Protocols: Fasting and prep instructions",
        readingTimeMinutes: 1
      });
      steps.push({
        label: `Understanding ${getShortTitle(currentEntity.title)}`,
        href: getUrl(currentEntity),
        isActive: true,
        type: "lab-test",
        description: getContextAwareDescription(currentEntity, currentEntity),
        readingTimeMinutes: currentEntity.readingTimeMinutes || 3
      });
      const dis = getNextEntity("disease");
      if (dis) {
        steps.push({
          label: "Associated Condition",
          href: getUrl(dis),
          isActive: false,
          type: "disease",
          description: getContextAwareDescription(dis, currentEntity),
          readingTimeMinutes: dis.readingTimeMinutes || 3
        });
      }
      const sym = getNextEntity("symptom");
      if (sym) {
        steps.push({
          label: "Common Symptoms",
          href: getUrl(sym),
          isActive: false,
          type: "symptom",
          description: getContextAwareDescription(sym, currentEntity),
          readingTimeMinutes: sym.readingTimeMinutes || 2
        });
      }
      const nextLab = getNextEntity("lab-test");
      if (nextLab) {
        steps.push({
          label: "Related Investigations",
          href: getUrl(nextLab),
          isActive: false,
          type: "lab-test",
          description: getContextAwareDescription(nextLab, currentEntity),
          readingTimeMinutes: nextLab.readingTimeMinutes || 2
        });
      }
      steps.push({
        label: "Next Step",
        href: "/contact",
        isActive: false,
        type: "cta",
        description: "Book Consultation"
      });
    } else if (mode === "student") {
      steps.push({
        label: "Physiological Context",
        href: `/knowledge/lab-tests/${currentEntity.slug}#overview`,
        isActive: false,
        type: "info",
        description: `${capitalizedCat} physiology and regulatory feedback`,
        readingTimeMinutes: 2
      });
      const dis = getNextEntity("disease");
      if (dis) {
        steps.push({
          label: "Associated Pathology",
          href: getUrl(dis),
          isActive: false,
          type: "disease",
          description: getContextAwareDescription(dis, currentEntity),
          readingTimeMinutes: dis.readingTimeMinutes || 3
        });
      }
      steps.push({
        label: `Reference Standard: ${getShortTitle(currentEntity.title)}`,
        href: getUrl(currentEntity),
        isActive: true,
        type: "lab-test",
        description: getContextAwareDescription(currentEntity, currentEntity),
        readingTimeMinutes: currentEntity.readingTimeMinutes || 3
      });
      steps.push({
        label: "Analysis Protocol",
        href: `/knowledge/lab-tests/${currentEntity.slug}#interpretation`,
        isActive: false,
        type: "info",
        description: "Clinical reference ranges & interpretations",
        readingTimeMinutes: 3
      });
      
      const compUrl = getFallbackComparison(currentEntity, category);
      steps.push({
        label: "Differential Diagnosis",
        href: compUrl,
        isActive: false,
        type: "info",
        description: "Diagnostic parameter comparisons",
        readingTimeMinutes: 4
      });
      
      steps.push({
        label: "Evidence & Clinical References",
        href: `/knowledge/lab-tests/${currentEntity.slug}#references`,
        isActive: false,
        type: "info",
        description: "Bibliography and citation registries",
        readingTimeMinutes: 2
      });
      steps.push({
        label: "Next Step",
        href: "/knowledge",
        isActive: false,
        type: "cta",
        description: "Continue Learning"
      });
    } else {
      // Practitioner
      steps.push({
        label: "Primary Investigation",
        href: getUrl(currentEntity),
        isActive: true,
        type: "lab-test",
        description: getContextAwareDescription(currentEntity, currentEntity),
        readingTimeMinutes: currentEntity.readingTimeMinutes || 3
      });
      const lab1 = getNextEntity("lab-test");
      if (lab1) {
        steps.push({
          label: "Secondary Panel",
          href: getUrl(lab1),
          isActive: false,
          type: "lab-test",
          description: getContextAwareDescription(lab1, currentEntity),
          readingTimeMinutes: lab1.readingTimeMinutes || 2
        });
      }
      const lab2 = getNextEntity("lab-test");
      if (lab2) {
        steps.push({
          label: "Tertiary Panel",
          href: getUrl(lab2),
          isActive: false,
          type: "lab-test",
          description: getContextAwareDescription(lab2, currentEntity),
          readingTimeMinutes: lab2.readingTimeMinutes || 2
        });
      }
      const lab3 = getNextEntity("lab-test");
      if (lab3) {
        steps.push({
          label: "Supporting Panel",
          href: getUrl(lab3),
          isActive: false,
          type: "lab-test",
          description: getContextAwareDescription(lab3, currentEntity),
          readingTimeMinutes: lab3.readingTimeMinutes || 2
        });
      }
      const dis = getNextEntity("disease");
      if (dis) {
        steps.push({
          label: "Rule-out Diagnosis",
          href: getUrl(dis),
          isActive: false,
          type: "disease",
          description: getContextAwareDescription(dis, currentEntity),
          readingTimeMinutes: dis.readingTimeMinutes || 3
        });
      }
      const rem = getNextEntity("remedy");
      if (rem) {
        steps.push({
          label: "Materia Medica Match",
          href: getUrl(rem),
          isActive: false,
          type: "remedy",
          description: getContextAwareDescription(rem, currentEntity),
          readingTimeMinutes: rem.readingTimeMinutes || 3
        });
      }
      steps.push({
        label: "Next Step",
        href: "/patient/login",
        isActive: false,
        type: "cta",
        description: "Clinical Workspace"
      });
    }
  }

  // 3. REMEDY PATHS
  else if (currentEntity.entityType === "remedy") {
    if (mode === "patient") {
      const sym = getNextEntity("symptom");
      if (sym) {
        steps.push({
          label: "Symptom Indicators",
          href: getUrl(sym),
          isActive: false,
          type: "symptom",
          description: getContextAwareDescription(sym, currentEntity),
          readingTimeMinutes: sym.readingTimeMinutes || 2
        });
      }
      const dis = getNextEntity("disease");
      if (dis) {
        steps.push({
          label: "Target Indications",
          href: getUrl(dis),
          isActive: false,
          type: "disease",
          description: getContextAwareDescription(dis, currentEntity),
          readingTimeMinutes: dis.readingTimeMinutes || 3
        });
      }
      steps.push({
        label: `Remedy Profile: ${getShortTitle(currentEntity.title)}`,
        href: getUrl(currentEntity),
        isActive: true,
        type: "remedy",
        description: getContextAwareDescription(currentEntity, currentEntity),
        readingTimeMinutes: currentEntity.readingTimeMinutes || 3
      });
      steps.push({
        label: "General Health Hygiene",
        href: "/diet-lifestyle",
        isActive: false,
        type: "info",
        description: "Lifestyle advice & preventive care",
        readingTimeMinutes: 2
      });
      steps.push({
        label: "Next Step",
        href: "/contact",
        isActive: false,
        type: "cta",
        description: "Book Consultation"
      });
    } else if (mode === "student") {
      steps.push({
        label: "Keynotes & Modalities",
        href: `/knowledge/remedies/${currentEntity.slug}#keynotes`,
        isActive: false,
        type: "info",
        description: `Leading indicators of ${getShortTitle(currentEntity.title)}`,
        readingTimeMinutes: 2
      });
      steps.push({
        label: `Materia Medica: ${getShortTitle(currentEntity.title)}`,
        href: getUrl(currentEntity),
        isActive: true,
        type: "remedy",
        description: getContextAwareDescription(currentEntity, currentEntity),
        readingTimeMinutes: currentEntity.readingTimeMinutes || 3
      });
      const sym = getNextEntity("symptom");
      if (sym) {
        steps.push({
          label: "Symptom Modality",
          href: getUrl(sym),
          isActive: false,
          type: "symptom",
          description: getContextAwareDescription(sym, currentEntity),
          readingTimeMinutes: sym.readingTimeMinutes || 2
        });
      }
      
      const compUrl = getFallbackComparison(currentEntity, category);
      steps.push({
        label: "Differential Matrix",
        href: compUrl,
        isActive: false,
        type: "info",
        description: "Remedy comparison parameters",
        readingTimeMinutes: 4
      });
      
      steps.push({
        label: "Literature Logs",
        href: `/knowledge/remedies/${currentEntity.slug}#references`,
        isActive: false,
        type: "info",
        description: "Classical reference sources",
        readingTimeMinutes: 2
      });
      steps.push({
        label: "Next Step",
        href: "/knowledge",
        isActive: false,
        type: "cta",
        description: "Continue Learning"
      });
    } else {
      // Practitioner
      steps.push({
        label: "Reactivity & Constitution",
        href: `/knowledge/remedies/${currentEntity.slug}#constitution`,
        isActive: false,
        type: "info",
        description: `Vital reaction type of ${getShortTitle(currentEntity.title)}`,
        readingTimeMinutes: 2
      });
      steps.push({
        label: "Amelioration/Aggravation",
        href: `/knowledge/remedies/${currentEntity.slug}#modalities`,
        isActive: false,
        type: "info",
        description: `Therapeutic modal details of ${getShortTitle(currentEntity.title)}`,
        readingTimeMinutes: 2
      });
      steps.push({
        label: "Clinical Therapeutics",
        href: getUrl(currentEntity),
        isActive: true,
        type: "remedy",
        description: getContextAwareDescription(currentEntity, currentEntity),
        readingTimeMinutes: currentEntity.readingTimeMinutes || 3
      });
      const compUrl = getFallbackComparison(currentEntity, category);
      steps.push({
        label: "Remedy Relationships",
        href: compUrl,
        isActive: false,
        type: "info",
        description: "Comparative prescribing & complementary remedies",
        readingTimeMinutes: 4
      });
      steps.push({
        label: "Next Step",
        href: "/patient/login",
        isActive: false,
        type: "cta",
        description: "Clinical Workspace"
      });
    }
  }

  // 4. SYMPTOM PATHS
  else if (currentEntity.entityType === "symptom") {
    if (mode === "patient") {
      steps.push({
        label: `Primary Indicator: ${getShortTitle(currentEntity.title)}`,
        href: getUrl(currentEntity),
        isActive: true,
        type: "symptom",
        description: getContextAwareDescription(currentEntity, currentEntity),
        readingTimeMinutes: currentEntity.readingTimeMinutes || 3
      });
      steps.push({
        label: "Potential Causes",
        href: `/knowledge/symptoms/${currentEntity.slug}#causes`,
        isActive: false,
        type: "info",
        description: "Differential diagnosis triggers",
        readingTimeMinutes: 2
      });
      const dis = getNextEntity("disease");
      if (dis) {
        steps.push({
          label: "Target Condition",
          href: getUrl(dis),
          isActive: false,
          type: "disease",
          description: getContextAwareDescription(dis, currentEntity),
          readingTimeMinutes: dis.readingTimeMinutes || 3
        });
      }
      const lab1 = getNextEntity("lab-test");
      if (lab1) {
        steps.push({
          label: "Primary Investigation",
          href: getUrl(lab1),
          isActive: false,
          type: "lab-test",
          description: getContextAwareDescription(lab1, currentEntity),
          readingTimeMinutes: lab1.readingTimeMinutes || 2
        });
      }
      const lab2 = getNextEntity("lab-test");
      if (lab2) {
        steps.push({
          label: "Secondary Investigation",
          href: getUrl(lab2),
          isActive: false,
          type: "lab-test",
          description: getContextAwareDescription(lab2, currentEntity),
          readingTimeMinutes: lab2.readingTimeMinutes || 2
        });
      }
      steps.push({
        label: "Symptom Control Guidelines",
        href: `/knowledge/symptoms/${currentEntity.slug}#lifestyle`,
        isActive: false,
        type: "info",
        description: "Lifestyle advice & immediate relief tips",
        readingTimeMinutes: 2
      });
      steps.push({
        label: "Next Step",
        href: "/contact",
        isActive: false,
        type: "cta",
        description: "Book Consultation"
      });
    } else if (mode === "student") {
      steps.push({
        label: "Core Presentation",
        href: getUrl(currentEntity),
        isActive: true,
        type: "symptom",
        description: getContextAwareDescription(currentEntity, currentEntity),
        readingTimeMinutes: currentEntity.readingTimeMinutes || 3
      });
      steps.push({
        label: "Symptom Pathogenesis",
        href: `/knowledge/symptoms/${currentEntity.slug}#definition`,
        isActive: false,
        type: "info",
        description: "Functional mechanisms & pathology",
        readingTimeMinutes: 2
      });
      steps.push({
        label: "Rule-out Criteria",
        href: `/knowledge/symptoms/${currentEntity.slug}#redflags`,
        isActive: false,
        type: "info",
        description: "Critical red flags and signs",
        readingTimeMinutes: 2
      });
      const dis = getNextEntity("disease");
      if (dis) {
        steps.push({
          label: "Related Pathology",
          href: getUrl(dis),
          isActive: false,
          type: "disease",
          description: getContextAwareDescription(dis, currentEntity),
          readingTimeMinutes: dis.readingTimeMinutes || 3
        });
      }
      steps.push({
        label: "Evidence Logs",
        href: `/knowledge/symptoms/${currentEntity.slug}#references`,
        isActive: false,
        type: "info",
        description: "Bibliography and clinical trials",
        readingTimeMinutes: 2
      });
      steps.push({
        label: "Next Step",
        href: "/knowledge",
        isActive: false,
        type: "cta",
        description: "Continue Learning"
      });
    } else {
      // Practitioner
      steps.push({
        label: "Symptom Presentation",
        href: getUrl(currentEntity),
        isActive: true,
        type: "symptom",
        description: getContextAwareDescription(currentEntity, currentEntity),
        readingTimeMinutes: currentEntity.readingTimeMinutes || 3
      });
      steps.push({
        label: "Clinical Evaluation",
        href: `/knowledge/symptoms/${currentEntity.slug}#definition`,
        isActive: false,
        type: "info",
        description: "Assessment scorecards and guidelines",
        readingTimeMinutes: 2
      });
      steps.push({
        label: "Critical Risk Signs",
        href: `/knowledge/symptoms/${currentEntity.slug}#redflags`,
        isActive: false,
        type: "info",
        description: "Clinical red flags needing direct management",
        readingTimeMinutes: 2
      });
      const rem = getNextEntity("remedy");
      if (rem) {
        steps.push({
          label: "Therapeutic Options",
          href: getUrl(rem),
          isActive: false,
          type: "remedy",
          description: getContextAwareDescription(rem, currentEntity),
          readingTimeMinutes: rem.readingTimeMinutes || 3
        });
      }
      steps.push({
        label: "Next Step",
        href: "/patient/login",
        isActive: false,
        type: "cta",
        description: "Clinical Workspace"
      });
    }
  }

  return steps;
}
