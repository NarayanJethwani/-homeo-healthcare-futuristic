import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferOrganSystem(name: string, category: string): string {
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, rubricData, mergeData, cloneData } = body;

    const rubricsRef = adminDb.collection("rubrics");

    if (action === "save") {
      if (!rubricData || !rubricData.name) {
        return NextResponse.json({ success: false, message: "Rubric name is required." }, { status: 400 });
      }

      const id = rubricData.id || `custom_${generateSlug(rubricData.name)}_${Date.now()}`;
      const slug = generateSlug(rubricData.name);
      const words: string[] = rubricData.name.toLowerCase().split(/[\s,\.\-_]+/);

      const rubric = {
        id,
        name: rubricData.name,
        slug,
        parentRubricId: rubricData.parentRubricId || null,
        description: rubricData.description || "",
        category: rubricData.category || "Custom Rubrics",
        subcategory: rubricData.subcategory || "Personal",
        organSystem: rubricData.organSystem || inferOrganSystem(rubricData.name, rubricData.category || ""),
        clinicalPriority: rubricData.clinicalPriority || "medium",
        createdDate: rubricData.createdDate || new Date().toISOString(),
        modifiedDate: new Date().toISOString(),
        status: rubricData.status || "custom",
        searchWeight: rubricData.searchWeight || 1.0,
        remedies: rubricData.remedies || {},
        indexWeights: rubricData.indexWeights || {},
        researchCitation: rubricData.researchCitation || null,
        keywords: rubricData.keywords || Array.from(new Set(words.filter(w => w.length > 3))),
        synonyms: rubricData.synonyms || [],
        clinicalConditions: rubricData.clinicalConditions || [],
        modalities: rubricData.modalities || [],
        miasms: rubricData.miasms || []
      };

      await rubricsRef.doc(id).set(rubric);

      return NextResponse.json({
        success: true,
        message: "Rubric saved successfully.",
        rubric
      });
    }

    if (action === "merge") {
      const { targetName, sourceIds, category = "Merged Rubrics" } = mergeData || {};

      if (!targetName || !sourceIds || sourceIds.length === 0) {
        return NextResponse.json({ success: false, message: "Target name and source IDs are required." }, { status: 400 });
      }

      const sourceRubrics: any[] = [];
      for (const sid of sourceIds) {
        const docSnap = await rubricsRef.doc(sid).get();
        if (docSnap.exists) {
          sourceRubrics.push(docSnap.data());
        }
      }

      if (sourceRubrics.length === 0) {
        return NextResponse.json({ success: false, message: "No source rubrics found." }, { status: 404 });
      }

      const combinedRemedies: Record<string, number> = {};
      const combinedIndexWeights: Record<string, number> = {};
      const combinedKeywords: string[] = [];
      const combinedSynonyms: string[] = [];

      sourceRubrics.forEach(sr => {
        if (sr.remedies) {
          Object.entries(sr.remedies).forEach(([remedy, grade]) => {
            combinedRemedies[remedy] = Math.max(combinedRemedies[remedy] || 0, grade as number);
          });
        }

        if (sr.indexWeights) {
          Object.entries(sr.indexWeights).forEach(([key, weight]) => {
            combinedIndexWeights[key] = (combinedIndexWeights[key] || 0) + (weight as number) / sourceRubrics.length;
          });
        }

        if (sr.keywords) combinedKeywords.push(...sr.keywords);
        if (sr.synonyms) combinedSynonyms.push(...sr.synonyms);
        combinedSynonyms.push(sr.name);
      });

      const id = `custom_merged_${generateSlug(targetName)}_${Date.now()}`;
      const slug = generateSlug(targetName);
      const words: string[] = targetName.toLowerCase().split(/[\s,\.\-_]+/);

      const rubric = {
        id,
        name: targetName,
        slug,
        parentRubricId: null,
        description: `Merged clinical rubric combining: ${sourceRubrics.map(r => r.name).join("; ")}`,
        category,
        subcategory: "Merged",
        organSystem: inferOrganSystem(targetName, category),
        clinicalPriority: "medium",
        createdDate: new Date().toISOString(),
        modifiedDate: new Date().toISOString(),
        status: "custom",
        searchWeight: 1.0,
        remedies: combinedRemedies,
        indexWeights: combinedIndexWeights,
        keywords: Array.from(new Set(combinedKeywords.concat(words.filter(w => w.length > 3)))),
        synonyms: Array.from(new Set(combinedSynonyms)),
        clinicalConditions: [],
        modalities: [],
        miasms: []
      };

      await rubricsRef.doc(id).set(rubric);

      return NextResponse.json({
        success: true,
        message: "Rubrics merged successfully.",
        rubric
      });
    }

    if (action === "clone") {
      const { sourceId, newName } = cloneData || {};

      if (!sourceId || !newName) {
        return NextResponse.json({ success: false, message: "Source ID and new name are required." }, { status: 400 });
      }

      const docSnap = await rubricsRef.doc(sourceId).get();
      if (!docSnap.exists) {
        return NextResponse.json({ success: false, message: "Source rubric not found." }, { status: 404 });
      }

      const source = docSnap.data();
      const id = `custom_${generateSlug(newName)}_${Date.now()}`;
      const slug = generateSlug(newName);
      const words: string[] = newName.toLowerCase().split(/[\s,\.\-_]+/);

      const rubric = {
        ...source,
        id,
        name: newName,
        slug,
        createdDate: new Date().toISOString(),
        modifiedDate: new Date().toISOString(),
        status: "custom",
        keywords: Array.from(new Set((source?.keywords || []).concat(words.filter(w => w.length > 3))))
      };

      await rubricsRef.doc(id).set(rubric);

      return NextResponse.json({
        success: true,
        message: "Rubric cloned successfully.",
        rubric
      });
    }

    return NextResponse.json({ success: false, message: "Invalid action." }, { status: 400 });
  } catch (error: any) {
    console.error("Repertory Save API failed:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to perform save action.",
      error: error.message || error
    }, { status: 500 });
  }
}
