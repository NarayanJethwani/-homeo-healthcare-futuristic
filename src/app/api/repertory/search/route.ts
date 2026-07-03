import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";

function isEnabled(value: string | undefined): boolean {
  return value === "true" || value === "1";
}

function isClinicalSearchShadowEnabled(): boolean {
  return isEnabled(process.env.REPERTORY_V2_USE_CLINICAL_SEARCH_ENGINE)
    && isEnabled(process.env.REPERTORY_V2_SEARCH_SHADOW_MODE);
}

function clinicalSearchShadowMaxRubrics(): number {
  const parsed = Number(process.env.REPERTORY_V2_SEARCH_MAX_RUBRICS);
  if (!Number.isFinite(parsed) || parsed <= 0) return 1000;
  return Math.min(Math.floor(parsed), 5000);
}

export async function GET(request: Request) {
  try {
    const shadowEnabled = isClinicalSearchShadowEnabled();
    const requestStartedAt = shadowEnabled ? Date.now() : 0;
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.toLowerCase().trim() || "";
    const category = searchParams.get("category") || "All";
    const organSystem = searchParams.get("organSystem") || "All";
    const miasm = searchParams.get("miasm") || "All";
    const remedy = searchParams.get("remedy") || "All";

    const rubricsRef = getAdminDb().collection("rubrics");
    let results: any[] = [];

    if (!q) {
      // Return list of active rubrics
      let firestoreQuery: any = rubricsRef.where("status", "==", "active");
      
      if (category !== "All") {
        firestoreQuery = firestoreQuery.where("category", "==", category);
      }
      if (organSystem !== "All") {
        firestoreQuery = firestoreQuery.where("organSystem", "==", organSystem);
      }

      const snapshot = await firestoreQuery.limit(100).get();
      snapshot.forEach((doc: any) => {
        results.push(doc.data());
      });

      // Filter by miasm and remedy if specified (client-side filtering of results limit)
      if (miasm !== "All") {
        results = results.filter(r => r.miasms && r.miasms.includes(miasm));
      }
      if (remedy !== "All") {
        results = results.filter(r => r.remedies && r.remedies[remedy] !== undefined);
      }
    } else {
      // 1. Expand query using synonyms
      let searchTerms = [q];
      const synDoc = await getAdminDb().collection("synonyms").doc(q).get();
      if (synDoc.exists) {
        const data = synDoc.data();
        if (data && data.synonyms) {
          searchTerms = Array.from(new Set([q, ...data.synonyms]));
        }
      }

      // Also split the query into individual words and add synonyms for each word
      const words = q.split(/[\s,\.\-_]+/);
      for (const word of words) {
        if (word.length > 2 && word !== q) {
          searchTerms.push(word);
          const wSynDoc = await getAdminDb().collection("synonyms").doc(word).get();
          if (wSynDoc.exists) {
            const data = wSynDoc.data();
            if (data && data.synonyms) {
              searchTerms.push(...data.synonyms);
            }
          }
        }
      }

      // Unique search terms
      searchTerms = Array.from(new Set(searchTerms.map(t => t.toLowerCase())));

      // Firestore allows array-contains-any up to 10 elements. If we have more, chunk them.
      const chunks: string[][] = [];
      const tempTerms = [...searchTerms];
      while (tempTerms.length > 0) {
        chunks.push(tempTerms.splice(0, 10));
      }

      const matchedDocs = new Map<string, any>();

      for (const chunk of chunks) {
        const querySnapshot = await rubricsRef
          .where("status", "==", "active")
          .where("keywords", "array-contains-any", chunk)
          .get();

        querySnapshot.forEach((doc: any) => {
          matchedDocs.set(doc.id, doc.data());
        });
      }

      // Also check direct match on name or slug as fallback or override
      const directSnapshot = await rubricsRef
        .where("status", "==", "active")
        .where("slug", "==", q.replace(/[\s_]+/g, "-"))
        .get();

      directSnapshot.forEach((doc: any) => {
        matchedDocs.set(doc.id, doc.data());
      });

      results = Array.from(matchedDocs.values());

      // 2. Score results by relevance
      const scored = results.map(rubric => {
        let score = 0;
        const name = rubric.name.toLowerCase();
        const desc = rubric.description.toLowerCase();

        searchTerms.forEach(term => {
          if (name === term) score += 200;
          else if (name.includes(term)) score += 100;
          else if (desc.includes(term)) score += 40;

          if (rubric.keywords && rubric.keywords.includes(term)) score += 30;
          if (rubric.remedies && Object.keys(rubric.remedies).some(r => r.toLowerCase() === term)) score += 50;
        });

        return { rubric, score };
      });

      results = scored
        .filter(s => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(s => s.rubric);

      // Apply filters
      if (category !== "All") {
        results = results.filter(r => r.category === category);
      }
      if (organSystem !== "All") {
        results = results.filter(r => r.organSystem === organSystem);
      }
      if (miasm !== "All") {
        results = results.filter(r => r.miasms && r.miasms.includes(miasm));
      }
      if (remedy !== "All") {
        results = results.filter(r => r.remedies && r.remedies[remedy] !== undefined);
      }
    }

    const responsePayload = {
      success: true,
      count: results.length,
      rubrics: results
    };

    if (shadowEnabled) {
      void (async () => {
        let candidateQuery: any = rubricsRef.where("status", "==", "active");

        if (category !== "All") {
          candidateQuery = candidateQuery.where("category", "==", category);
        }
        if (organSystem !== "All") {
          candidateQuery = candidateQuery.where("organSystem", "==", organSystem);
        }

        const candidateSnapshot = await candidateQuery.limit(clinicalSearchShadowMaxRubrics()).get();
        const candidateRubrics: any[] = [];
        candidateSnapshot.forEach((doc: any) => {
          candidateRubrics.push(doc.data());
        });

        const { runClinicalSearchShadowComparison } = await import("@/features/repertory/integration/clinicalSearchShadow");
        runClinicalSearchShadowComparison({
          query: q,
          filters: {
            category,
            organSystem,
            miasm,
            remedy,
          },
          v1Results: results,
          candidateRubrics,
          startedAt: requestStartedAt,
        });
      })().catch((error) => {
        console.info("[repertory-v2-search-shadow]", JSON.stringify({
          query: q,
          error: error instanceof Error ? error.message : String(error),
        }));
      });
    }

    return NextResponse.json(responsePayload);
  } catch (error: any) {
    console.error("Repertory Search API failed:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to search rubrics.",
      error: error.message || error
    }, { status: 500 });
  }
}
