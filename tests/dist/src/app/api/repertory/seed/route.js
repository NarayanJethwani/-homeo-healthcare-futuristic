"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const firebaseAdmin_1 = require("@/lib/firebaseAdmin");
const repertoryData_1 = require("@/lib/repertoryData");
// Helper to generate slug
function generateSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
// Inferred organ systems helper
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
async function GET(request) {
    try {
        const url = new URL(request.url);
        const force = url.searchParams.get("force") === "true";
        console.log("Starting repertory database seeding operation...");
        // Check if database is already seeded
        const rubricsRef = (0, firebaseAdmin_1.getAdminDb)().collection("rubrics");
        const snapshot = await rubricsRef.limit(1).get();
        if (!snapshot.empty && !force) {
            return server_1.NextResponse.json({
                success: true,
                message: "Database already seeded. Use ?force=true to overwrite."
            });
        }
        // 1. Seed Rubrics
        let rubricsSeeded = 0;
        const batch = (0, firebaseAdmin_1.getAdminDb)().batch();
        repertoryData_1.JETHWANI_REPERTORY_DATA.forEach(fr => {
            const docRef = rubricsRef.doc(fr.id);
            const words = fr.name.toLowerCase().split(/[\s,\.\-_]+/);
            const rubric = {
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
                indexWeights: fr.indexWeights || {},
                researchCitation: fr.researchCitation || null,
                keywords: Array.from(new Set(words.filter(w => w.length > 3))),
                synonyms: [],
                clinicalConditions: [],
                modalities: [],
                miasms: fr.id.includes("psora") ? ["Psora"] : fr.id.includes("sycosis") ? ["Sycosis"] : fr.id.includes("syphilis") ? ["Syphilis"] : []
            };
            batch.set(docRef, rubric);
            rubricsSeeded++;
        });
        await batch.commit();
        console.log(`Seeded ${rubricsSeeded} rubrics to Firestore.`);
        // 2. Seed Synonyms
        let synonymsSeeded = 0;
        const synBatch = (0, firebaseAdmin_1.getAdminDb)().batch();
        const synonymsRef = (0, firebaseAdmin_1.getAdminDb)().collection("synonyms");
        Object.entries(repertoryData_1.SEARCH_SYNONYMS).forEach(([word, synonyms]) => {
            const docRef = synonymsRef.doc(word);
            synBatch.set(docRef, {
                word,
                synonyms
            });
            synonymsSeeded++;
        });
        await synBatch.commit();
        console.log(`Seeded ${synonymsSeeded} synonym groups to Firestore.`);
        return server_1.NextResponse.json({
            success: true,
            message: "Database seeded successfully.",
            rubricsSeeded,
            synonymsSeeded
        });
    }
    catch (error) {
        console.error("Database seeding failed:", error);
        return server_1.NextResponse.json({
            success: false,
            message: "Database seeding failed.",
            error: error.message || error
        }, { status: 500 });
    }
}
