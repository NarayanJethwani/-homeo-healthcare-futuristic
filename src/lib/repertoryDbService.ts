import { db } from "./firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where
} from "firebase/firestore";
import { JETHWANI_REPERTORY_DATA as FALLBACK_DATA, JethwaniRubric as FallbackRubric, SEARCH_SYNONYMS as FALLBACK_SYNONYMS } from "./repertoryData";

// ==========================================
// SCHEMAS & INTERFACES
// ==========================================

export interface RubricCitation {
  source: string;
  detail: string;
}

export interface Rubric {
  id: string;
  name: string;
  slug: string;
  parentRubricId: string | null;
  description: string;
  category: string;
  subcategory: string;
  organSystem: string;
  clinicalPriority: "low" | "medium" | "high";
  createdDate: string;
  modifiedDate: string;
  status: "active" | "archived" | "custom";
  searchWeight: number;
  remedies: Record<string, number>; // remedy abbreviation -> grade (1, 2, or 3)
  indexWeights?: Record<string, number>; // indexKey -> weight (-1.0 to 1.0)
  researchCitation?: RubricCitation;
  keywords: string[];
  synonyms: string[];
  clinicalConditions: string[];
  modalities: string[];
  miasms: string[];
}

export interface FavoriteRubric {
  id: string;
  userId: string;
  rubricId: string;
  addedAt: string;
}

export interface RepertorizationSession {
  id: string;
  patientId: string;
  userId: string;
  rubrics: Array<{
    rubricId: string;
    severity: number; // 1-10
    frequency: 'constant' | 'frequent' | 'occasional';
    impact: 'severe' | 'moderate' | 'mild';
  }>;
  results: Record<string, { score: number; matches: number }>;
  createdAt: string;
}

export interface SynonymMapping {
  word: string;
  synonyms: string[];
}

// ==========================================
// HELPERS
// ==========================================

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Convert fallback data format to the full Rubric interface format
export function mapFallbackToRubric(fr: FallbackRubric): Rubric {
  const words = fr.name.toLowerCase().split(/[\s,\.\-_]+/);
  return {
    id: fr.id,
    name: fr.name,
    slug: generateSlug(fr.name),
    parentRubricId: null,
    description: fr.researchCitation?.detail || "Dr. Jethwani's clinical indicator.",
    category: fr.section,
    subcategory: fr.name.split(",")[0] || fr.section,
    organSystem: inferOrganSystem(fr.name),
    clinicalPriority: fr.id.includes("burnout") || fr.id.includes("panic") || fr.id.includes("collapse") ? "high" : "medium",
    createdDate: new Date().toISOString(),
    modifiedDate: new Date().toISOString(),
    status: "active",
    searchWeight: 1.0,
    remedies: fr.remedies,
    indexWeights: fr.indexWeights,
    researchCitation: fr.researchCitation,
    keywords: Array.from(new Set(words.filter(w => w.length > 3))),
    synonyms: [],
    clinicalConditions: [],
    modalities: [],
    miasms: fr.id.includes("psora") ? ["Psora"] : fr.id.includes("sycosis") ? ["Sycosis"] : fr.id.includes("syphilis") ? ["Syphilis"] : []
  };
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

// ==========================================
// DATABASE READS / SEARCH SERVICE
// ==========================================

export async function getRubrics(filters?: {
  category?: string;
  organSystem?: string;
  miasm?: string;
  remedy?: string;
  status?: string;
}): Promise<Rubric[]> {
  try {
    const rubricsRef = collection(db, "rubrics");
    let q = query(rubricsRef, where("status", "!=", "archived"));

    if (filters?.status) {
      q = query(rubricsRef, where("status", "==", filters.status));
    }
    
    const snapshot = await getDocs(q);
    let rubrics: Rubric[] = [];
    
    snapshot.forEach(docSnap => {
      rubrics.push(docSnap.data() as Rubric);
    });

    // Apply client-side filters for complex queries if not supported by simple firestore indexes
    if (filters) {
      if (filters.category && filters.category !== "All") {
        rubrics = rubrics.filter(r => r.category === filters.category);
      }
      if (filters.organSystem && filters.organSystem !== "All") {
        rubrics = rubrics.filter(r => r.organSystem === filters.organSystem);
      }
      if (filters.miasm && filters.miasm !== "All") {
        rubrics = rubrics.filter(r => r.miasms && r.miasms.includes(filters.miasm!));
      }
      if (filters.remedy && filters.remedy !== "All") {
        rubrics = rubrics.filter(r => r.remedies && r.remedies[filters.remedy!] !== undefined);
      }
    }

    if (rubrics.length === 0) {
      console.log("No rubrics found in Firestore. Serving fallback clinical database.");
      return getFallbackRubrics(filters);
    }

    return rubrics;
  } catch (err) {
    console.error("Firestore error in getRubrics. Falling back to local data.", err);
    return getFallbackRubrics(filters);
  }
}

export async function searchRubrics(
  queryText: string,
  filters?: {
    category?: string;
    organSystem?: string;
    miasm?: string;
    remedy?: string;
  }
): Promise<Rubric[]> {
  try {
    const allRubrics = await getRubrics(filters);
    const normalizedText = queryText.toLowerCase().trim();
    if (!normalizedText) return allRubrics;

    // 1. Fetch Synonyms
    let synonymTerms = [normalizedText];
    try {
      const synDoc = await getDoc(doc(db, "synonyms", normalizedText));
      if (synDoc.exists()) {
        const mappings = synDoc.data() as SynonymMapping;
        synonymTerms = Array.from(new Set([normalizedText, ...mappings.synonyms]));
      } else {
        // Local fallback synonym check
        const localSyn = FALLBACK_SYNONYMS[normalizedText];
        if (localSyn) {
          synonymTerms = Array.from(new Set([normalizedText, ...localSyn]));
        }
      }
    } catch {
      console.warn("Failed to retrieve synonyms from Firestore. Using local synonym engine.");
      const localSyn = FALLBACK_SYNONYMS[normalizedText];
      if (localSyn) {
        synonymTerms = Array.from(new Set([normalizedText, ...localSyn]));
      }
    }

    // 2. Score and Filter Rubrics
    const scored = allRubrics.map(rubric => {
      let score = 0;
      const rName = rubric.name.toLowerCase();
      const rDesc = rubric.description.toLowerCase();
      
      synonymTerms.forEach(term => {
        const t = term.toLowerCase();
        if (rName === t) {
          score += 150;
        } else if (rName.includes(t)) {
          score += 100;
        } else if (rDesc.includes(t)) {
          score += 40;
        }
        
        // Match keywords
        if (rubric.keywords && rubric.keywords.some(k => k.toLowerCase().includes(t))) {
          score += 30;
        }
        
        // Match remedies abbreviations
        if (rubric.remedies && Object.keys(rubric.remedies).some(rem => rem.toLowerCase() === t)) {
          score += 50;
        }

        // Match categories / subcategories
        if (rubric.category.toLowerCase().includes(t) || rubric.subcategory.toLowerCase().includes(t)) {
          score += 20;
        }
      });

      return { rubric, score };
    });

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(s => s.rubric);
  } catch (err) {
    console.error("Error searching rubrics:", err);
    return getFallbackRubrics(filters);
  }
}

export async function getRubricDetails(id: string): Promise<Rubric | null> {
  try {
    const docRef = doc(db, "rubrics", id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as Rubric;
    }
    // Check fallback
    const fallback = FALLBACK_DATA.find(r => r.id === id);
    if (fallback) return mapFallbackToRubric(fallback);
    return null;
  } catch {
    const fallback = FALLBACK_DATA.find(r => r.id === id);
    if (fallback) return mapFallbackToRubric(fallback);
    return null;
  }
}

// ==========================================
// DATABASE WRITES (MUTATIONS)
// ==========================================

export async function saveRubric(rubricData: Partial<Rubric>): Promise<Rubric> {
  if (!rubricData.name) {
    throw new Error("Rubric name is required.");
  }
  
  const id = rubricData.id || `custom_${generateSlug(rubricData.name)}_${Date.now()}`;
  const slug = generateSlug(rubricData.name);
  const words = rubricData.name.toLowerCase().split(/[\s,\.\-_]+/);
  
  const rubric: Rubric = {
    id,
    name: rubricData.name,
    slug,
    parentRubricId: rubricData.parentRubricId || null,
    description: rubricData.description || "",
    category: rubricData.category || "Custom Rubrics",
    subcategory: rubricData.subcategory || "Personal",
    organSystem: rubricData.organSystem || inferOrganSystem(rubricData.name),
    clinicalPriority: rubricData.clinicalPriority || "medium",
    createdDate: rubricData.createdDate || new Date().toISOString(),
    modifiedDate: new Date().toISOString(),
    status: rubricData.status || "custom",
    searchWeight: rubricData.searchWeight || 1.0,
    remedies: rubricData.remedies || {},
    indexWeights: rubricData.indexWeights || {},
    researchCitation: rubricData.researchCitation,
    keywords: rubricData.keywords || Array.from(new Set(words.filter(w => w.length > 3))),
    synonyms: rubricData.synonyms || [],
    clinicalConditions: rubricData.clinicalConditions || [],
    modalities: rubricData.modalities || [],
    miasms: rubricData.miasms || []
  };

  await setDoc(doc(db, "rubrics", id), rubric);
  return rubric;
}

export async function mergeRubrics(
  targetName: string,
  sourceIds: string[],
  category = "Merged Rubrics"
): Promise<Rubric> {
  const sourceRubrics: Rubric[] = [];
  for (const id of sourceIds) {
    const r = await getRubricDetails(id);
    if (r) sourceRubrics.push(r);
  }

  if (sourceRubrics.length === 0) {
    throw new Error("No valid source rubrics found for merge.");
  }

  // Combine remedies: take union, sum grades or take max grade
  const combinedRemedies: Record<string, number> = {};
  const combinedIndexWeights: Record<string, number> = {};
  const combinedKeywords: string[] = [];
  const combinedSynonyms: string[] = [];

  sourceRubrics.forEach(sr => {
    // Remedies union
    Object.entries(sr.remedies).forEach(([remedy, grade]) => {
      combinedRemedies[remedy] = Math.max(combinedRemedies[remedy] || 0, grade);
    });
    
    // Index weights average
    if (sr.indexWeights) {
      Object.entries(sr.indexWeights).forEach(([key, weight]) => {
        combinedIndexWeights[key] = (combinedIndexWeights[key] || 0) + weight / sourceRubrics.length;
      });
    }

    if (sr.keywords) combinedKeywords.push(...sr.keywords);
    if (sr.synonyms) combinedSynonyms.push(...sr.synonyms);
    combinedSynonyms.push(sr.name); // Add source rubric names as synonyms
  });

  const merged = await saveRubric({
    name: targetName,
    category,
    subcategory: "Merged",
    remedies: combinedRemedies,
    indexWeights: combinedIndexWeights,
    keywords: Array.from(new Set(combinedKeywords)),
    synonyms: Array.from(new Set(combinedSynonyms)),
    description: `Merged clinical rubric combining: ${sourceRubrics.map(r => r.name).join("; ")}`
  });

  return merged;
}

export async function deleteRubric(id: string): Promise<boolean> {
  try {
    // Instead of deleting standard ones, we mark as archived. Custom ones can be deleted.
    const docRef = doc(db, "rubrics", id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as Rubric;
      if (data.status === "custom") {
        await deleteDoc(docRef);
      } else {
        await updateDoc(docRef, { status: "archived", modifiedDate: new Date().toISOString() });
      }
      return true;
    }
    return false;
  } catch (err) {
    console.error("Failed to delete rubric:", err);
    return false;
  }
}

// ==========================================
// FAVORITES SERVICE
// ==========================================

export async function toggleFavorite(userId: string, rubricId: string): Promise<boolean> {
  try {
    const favId = `${userId}_${rubricId}`;
    const favRef = doc(db, "favorites", favId);
    const snap = await getDoc(favRef);

    if (snap.exists()) {
      await deleteDoc(favRef);
      return false; // Removed
    } else {
      await setDoc(favRef, {
        id: favId,
        userId,
        rubricId,
        addedAt: new Date().toISOString()
      });
      return true; // Added
    }
  } catch (err) {
    console.error("Error toggling favorite in Firestore:", err);
    // Local fallback using localStorage
    if (typeof window !== "undefined") {
      const localFavs = JSON.parse(localStorage.getItem(`favs_${userId}`) || "[]");
      const idx = localFavs.indexOf(rubricId);
      if (idx > -1) {
        localFavs.splice(idx, 1);
        localStorage.setItem(`favs_${userId}`, JSON.stringify(localFavs));
        return false;
      } else {
        localFavs.push(rubricId);
        localStorage.setItem(`favs_${userId}`, JSON.stringify(localFavs));
        return true;
      }
    }
    return false;
  }
}

export async function getFavorites(userId: string): Promise<Rubric[]> {
  try {
    const snapshot = await getDocs(
      query(collection(db, "favorites"), where("userId", "==", userId))
    );
    const rubricIds: string[] = [];
    snapshot.forEach(docSnap => {
      rubricIds.push(docSnap.data().rubricId);
    });

    const list: Rubric[] = [];
    for (const rid of rubricIds) {
      const r = await getRubricDetails(rid);
      if (r) list.push(r);
    }
    return list;
  } catch (err) {
    console.error("Error getting favorites:", err);
    // Local fallback
    if (typeof window !== "undefined") {
      const localFavs = JSON.parse(localStorage.getItem(`favs_${userId}`) || "[]");
      const list: Rubric[] = [];
      for (const rid of localFavs) {
        const r = await getRubricDetails(rid);
        if (r) list.push(r);
      }
      return list;
    }
    return [];
  }
}

// ==========================================
// REPERTORIZATION SESSION HISTORY
// ==========================================

export async function saveRepertorizationSession(
  patientId: string,
  userId: string,
  rubrics: Array<{ rubricId: string; severity: number; frequency: any; impact: any }>,
  results: Record<string, { score: number; matches: number }>
): Promise<string> {
  try {
    const sessionId = `session_${patientId}_${Date.now()}`;
    const sessionDoc: RepertorizationSession = {
      id: sessionId,
      patientId,
      userId,
      rubrics,
      results,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, "repertorization_sessions", sessionId), sessionDoc);
    return sessionId;
  } catch (err) {
    console.error("Failed to save repertorization session to Firestore:", err);
    return "";
  }
}

// ==========================================
// LOCAL FALLBACK DATA LAYER
// ==========================================

function getFallbackRubrics(filters?: {
  category?: string;
  organSystem?: string;
  miasm?: string;
  remedy?: string;
}): Rubric[] {
  let mapped = FALLBACK_DATA.map(mapFallbackToRubric);

  if (filters) {
    if (filters.category && filters.category !== "All") {
      mapped = mapped.filter(r => r.category === filters.category);
    }
    if (filters.organSystem && filters.organSystem !== "All") {
      mapped = mapped.filter(r => r.organSystem === filters.organSystem);
    }
    if (filters.miasm && filters.miasm !== "All") {
      mapped = mapped.filter(r => r.miasms && r.miasms.includes(filters.miasm!));
    }
    if (filters.remedy && filters.remedy !== "All") {
      mapped = mapped.filter(r => r.remedies && r.remedies[filters.remedy!] !== undefined);
    }
  }

  return mapped;
}
