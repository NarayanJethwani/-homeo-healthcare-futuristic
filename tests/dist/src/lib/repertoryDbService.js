"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapFallbackToRubric = mapFallbackToRubric;
exports.getRubrics = getRubrics;
exports.searchRubrics = searchRubrics;
exports.getRubricDetails = getRubricDetails;
exports.saveRubric = saveRubric;
exports.mergeRubrics = mergeRubrics;
exports.deleteRubric = deleteRubric;
exports.toggleFavorite = toggleFavorite;
exports.getFavorites = getFavorites;
exports.saveRepertorizationSession = saveRepertorizationSession;
const firebase_1 = require("./firebase");
const firestore_1 = require("firebase/firestore");
const repertoryData_1 = require("./repertoryData");
// ==========================================
// HELPERS
// ==========================================
function generateSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
// Convert fallback data format to the full Rubric interface format
function mapFallbackToRubric(fr) {
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
function inferOrganSystem(name) {
    const text = name.toLowerCase();
    if (text.includes("heart") || text.includes("pulse") || text.includes("hypertension") || text.includes("circulation"))
        return "Cardiovascular";
    if (text.includes("stomach") || text.includes("gerd") || text.includes("ibs") || text.includes("gastric") || text.includes("acidity") || text.includes("bloating"))
        return "Gastrointestinal";
    if (text.includes("asthma") || text.includes("respiratory") || text.includes("cough") || text.includes("sinusitis") || text.includes("rhinitis") || text.includes("bronchial"))
        return "Respiratory";
    if (text.includes("eczema") || text.includes("skin") || text.includes("dermatitis") || text.includes("acne") || text.includes("psoriasis") || text.includes("urticaria") || text.includes("hives"))
        return "Skin / Integumentary";
    if (text.includes("thyroid") || text.includes("hypothyroidism") || text.includes("pcos") || text.includes("hormonal") || text.includes("metabolism") || text.includes("insulin"))
        return "Endocrine";
    if (text.includes("joint") || text.includes("arthritis") || text.includes("musculoskeletal") || text.includes("fibromyalgia") || text.includes("back") || text.includes("pain"))
        return "Musculoskeletal";
    if (text.includes("burnout") || text.includes("anxiety") || text.includes("panic") || text.includes("insomnia") || text.includes("sleep") || text.includes("mind") || text.includes("depression"))
        return "Psychology & Psychiatry";
    return "Generalities";
}
// ==========================================
// DATABASE READS / SEARCH SERVICE
// ==========================================
async function getRubrics(filters) {
    try {
        const rubricsRef = (0, firestore_1.collection)(firebase_1.db, "rubrics");
        let q = (0, firestore_1.query)(rubricsRef, (0, firestore_1.where)("status", "!=", "archived"));
        if (filters?.status) {
            q = (0, firestore_1.query)(rubricsRef, (0, firestore_1.where)("status", "==", filters.status));
        }
        const snapshot = await (0, firestore_1.getDocs)(q);
        let rubrics = [];
        snapshot.forEach(docSnap => {
            rubrics.push(docSnap.data());
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
                rubrics = rubrics.filter(r => r.miasms && r.miasms.includes(filters.miasm));
            }
            if (filters.remedy && filters.remedy !== "All") {
                rubrics = rubrics.filter(r => r.remedies && r.remedies[filters.remedy] !== undefined);
            }
        }
        if (rubrics.length === 0) {
            console.log("No rubrics found in Firestore. Serving fallback clinical database.");
            return getFallbackRubrics(filters);
        }
        return rubrics;
    }
    catch (err) {
        console.error("Firestore error in getRubrics. Falling back to local data.", err);
        return getFallbackRubrics(filters);
    }
}
async function searchRubrics(queryText, filters) {
    try {
        const allRubrics = await getRubrics(filters);
        const normalizedText = queryText.toLowerCase().trim();
        if (!normalizedText)
            return allRubrics;
        // 1. Fetch Synonyms
        let synonymTerms = [normalizedText];
        try {
            const synDoc = await (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, "synonyms", normalizedText));
            if (synDoc.exists()) {
                const mappings = synDoc.data();
                synonymTerms = Array.from(new Set([normalizedText, ...mappings.synonyms]));
            }
            else {
                // Local fallback synonym check
                const localSyn = repertoryData_1.SEARCH_SYNONYMS[normalizedText];
                if (localSyn) {
                    synonymTerms = Array.from(new Set([normalizedText, ...localSyn]));
                }
            }
        }
        catch {
            console.warn("Failed to retrieve synonyms from Firestore. Using local synonym engine.");
            const localSyn = repertoryData_1.SEARCH_SYNONYMS[normalizedText];
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
                }
                else if (rName.includes(t)) {
                    score += 100;
                }
                else if (rDesc.includes(t)) {
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
    }
    catch (err) {
        console.error("Error searching rubrics:", err);
        return getFallbackRubrics(filters);
    }
}
async function getRubricDetails(id) {
    try {
        const docRef = (0, firestore_1.doc)(firebase_1.db, "rubrics", id);
        const snap = await (0, firestore_1.getDoc)(docRef);
        if (snap.exists()) {
            return snap.data();
        }
        // Check fallback
        const fallback = repertoryData_1.JETHWANI_REPERTORY_DATA.find(r => r.id === id);
        if (fallback)
            return mapFallbackToRubric(fallback);
        return null;
    }
    catch {
        const fallback = repertoryData_1.JETHWANI_REPERTORY_DATA.find(r => r.id === id);
        if (fallback)
            return mapFallbackToRubric(fallback);
        return null;
    }
}
// ==========================================
// DATABASE WRITES (MUTATIONS)
// ==========================================
async function saveRubric(rubricData) {
    if (!rubricData.name) {
        throw new Error("Rubric name is required.");
    }
    const id = rubricData.id || `custom_${generateSlug(rubricData.name)}_${Date.now()}`;
    const slug = generateSlug(rubricData.name);
    const words = rubricData.name.toLowerCase().split(/[\s,\.\-_]+/);
    const rubric = {
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
    await (0, firestore_1.setDoc)((0, firestore_1.doc)(firebase_1.db, "rubrics", id), rubric);
    return rubric;
}
async function mergeRubrics(targetName, sourceIds, category = "Merged Rubrics") {
    const sourceRubrics = [];
    for (const id of sourceIds) {
        const r = await getRubricDetails(id);
        if (r)
            sourceRubrics.push(r);
    }
    if (sourceRubrics.length === 0) {
        throw new Error("No valid source rubrics found for merge.");
    }
    // Combine remedies: take union, sum grades or take max grade
    const combinedRemedies = {};
    const combinedIndexWeights = {};
    const combinedKeywords = [];
    const combinedSynonyms = [];
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
        if (sr.keywords)
            combinedKeywords.push(...sr.keywords);
        if (sr.synonyms)
            combinedSynonyms.push(...sr.synonyms);
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
async function deleteRubric(id) {
    try {
        // Instead of deleting standard ones, we mark as archived. Custom ones can be deleted.
        const docRef = (0, firestore_1.doc)(firebase_1.db, "rubrics", id);
        const snap = await (0, firestore_1.getDoc)(docRef);
        if (snap.exists()) {
            const data = snap.data();
            if (data.status === "custom") {
                await (0, firestore_1.deleteDoc)(docRef);
            }
            else {
                await (0, firestore_1.updateDoc)(docRef, { status: "archived", modifiedDate: new Date().toISOString() });
            }
            return true;
        }
        return false;
    }
    catch (err) {
        console.error("Failed to delete rubric:", err);
        return false;
    }
}
// ==========================================
// FAVORITES SERVICE
// ==========================================
async function toggleFavorite(userId, rubricId) {
    try {
        const favId = `${userId}_${rubricId}`;
        const favRef = (0, firestore_1.doc)(firebase_1.db, "favorites", favId);
        const snap = await (0, firestore_1.getDoc)(favRef);
        if (snap.exists()) {
            await (0, firestore_1.deleteDoc)(favRef);
            return false; // Removed
        }
        else {
            await (0, firestore_1.setDoc)(favRef, {
                id: favId,
                userId,
                rubricId,
                addedAt: new Date().toISOString()
            });
            return true; // Added
        }
    }
    catch (err) {
        console.error("Error toggling favorite in Firestore:", err);
        // Local fallback using localStorage
        if (typeof window !== "undefined") {
            const localFavs = JSON.parse(localStorage.getItem(`favs_${userId}`) || "[]");
            const idx = localFavs.indexOf(rubricId);
            if (idx > -1) {
                localFavs.splice(idx, 1);
                localStorage.setItem(`favs_${userId}`, JSON.stringify(localFavs));
                return false;
            }
            else {
                localFavs.push(rubricId);
                localStorage.setItem(`favs_${userId}`, JSON.stringify(localFavs));
                return true;
            }
        }
        return false;
    }
}
async function getFavorites(userId) {
    try {
        const snapshot = await (0, firestore_1.getDocs)((0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, "favorites"), (0, firestore_1.where)("userId", "==", userId)));
        const rubricIds = [];
        snapshot.forEach(docSnap => {
            rubricIds.push(docSnap.data().rubricId);
        });
        const list = [];
        for (const rid of rubricIds) {
            const r = await getRubricDetails(rid);
            if (r)
                list.push(r);
        }
        return list;
    }
    catch (err) {
        console.error("Error getting favorites:", err);
        // Local fallback
        if (typeof window !== "undefined") {
            const localFavs = JSON.parse(localStorage.getItem(`favs_${userId}`) || "[]");
            const list = [];
            for (const rid of localFavs) {
                const r = await getRubricDetails(rid);
                if (r)
                    list.push(r);
            }
            return list;
        }
        return [];
    }
}
// ==========================================
// REPERTORIZATION SESSION HISTORY
// ==========================================
async function saveRepertorizationSession(patientId, userId, rubrics, results) {
    try {
        const sessionId = `session_${patientId}_${Date.now()}`;
        const sessionDoc = {
            id: sessionId,
            patientId,
            userId,
            rubrics,
            results,
            createdAt: new Date().toISOString()
        };
        await (0, firestore_1.setDoc)((0, firestore_1.doc)(firebase_1.db, "repertorization_sessions", sessionId), sessionDoc);
        return sessionId;
    }
    catch (err) {
        console.error("Failed to save repertorization session to Firestore:", err);
        return "";
    }
}
// ==========================================
// LOCAL FALLBACK DATA LAYER
// ==========================================
function getFallbackRubrics(filters) {
    let mapped = repertoryData_1.JETHWANI_REPERTORY_DATA.map(mapFallbackToRubric);
    if (filters) {
        if (filters.category && filters.category !== "All") {
            mapped = mapped.filter(r => r.category === filters.category);
        }
        if (filters.organSystem && filters.organSystem !== "All") {
            mapped = mapped.filter(r => r.organSystem === filters.organSystem);
        }
        if (filters.miasm && filters.miasm !== "All") {
            mapped = mapped.filter(r => r.miasms && r.miasms.includes(filters.miasm));
        }
        if (filters.remedy && filters.remedy !== "All") {
            mapped = mapped.filter(r => r.remedies && r.remedies[filters.remedy] !== undefined);
        }
    }
    return mapped;
}
