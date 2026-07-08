import { KmsKnowledgeEntity } from "../types";

export interface ExportOptions {
  format: "json" | "csv" | "markdown" | "mdx" | "graph";
  includeInternalNotes?: boolean;
}

/**
 * Serializes entities into targeted string formats
 */
export function exportEntities(entities: KmsKnowledgeEntity[], options: ExportOptions): string {
  const { format, includeInternalNotes = false } = options;

  // Filter out internal notes if not authorized for public consumption
  const cleanEntities = entities.map(e => {
    if (includeInternalNotes) return e;
    const { editorialNotes, ...rest } = e;
    return { ...rest, editorialNotes: "" };
  });

  switch (format) {
    case "json":
      return JSON.stringify(cleanEntities, null, 2);

    case "csv": {
      const headers = ["ID", "Slug", "EntityType", "Title_EN", "Summary_EN", "Status", "Evidence", "Tags"];
      const rows = cleanEntities.map(e => [
        e.id,
        e.slug,
        e.entityType,
        `"${(e.title.en || "").replace(/"/g, '""')}"`,
        `"${(e.summary.en || "").replace(/"/g, '""')}"`,
        e.editorialStatus,
        e.evidenceLevel,
        `"${e.tags.join(",")}"`
      ]);
      return [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    }

    case "markdown":
    case "mdx": {
      // Return compilation of first entity as sample multi-file dump
      if (cleanEntities.length === 0) return "";
      const e = cleanEntities[0];
      const frontmatter = [
        "---",
        `id: ${e.id}`,
        `slug: ${e.slug}`,
        `entityType: ${e.entityType}`,
        `evidenceLevel: ${e.evidenceLevel}`,
        `status: ${e.editorialStatus}`,
        `lastReviewed: ${e.lastReviewed}`,
        `tags: [${e.tags.map(t => `"${t}"`).join(", ")}]`,
        "---"
      ].join("\n");

      const body = [
        `# ${e.title.en}`,
        "",
        `> ${e.summary.en}`,
        "",
        "## Details & ClinicalAffinity",
        e.content?.overview?.en || "No clinical overview.",
        "",
        e.content?.safetyWarnings?.en ? `### Safety Guidelines\n${e.content.safetyWarnings.en}` : "",
        "",
        e.content?.references ? `### References\n${e.content.references.map((r: string) => `- ${r}`).join("\n")}` : ""
      ].join("\n");

      return [frontmatter, "", body].join("\n");
    }

    case "graph": {
      // Export relationship nodes and edges
      const nodes = cleanEntities.map(e => ({
        id: e.id,
        label: e.title.en,
        type: e.entityType
      }));
      const edges: { source: string; target: string; type: string }[] = [];
      cleanEntities.forEach(e => {
        e.relatedEntities.forEach(target => {
          edges.push({
            source: e.id,
            target,
            type: "related"
          });
        });
      });
      return JSON.stringify({ nodes, edges }, null, 2);
    }

    default:
      return "";
  }
}

/**
 * Parses and validates incoming JSON text for importing
 */
export function importEntitiesFromJson(jsonText: string): KmsKnowledgeEntity[] {
  try {
    const parsed = JSON.parse(jsonText);
    const arr = Array.isArray(parsed) ? parsed : [parsed];
    
    // Quick validation checks
    const validated: KmsKnowledgeEntity[] = arr.map((item: any, index: number) => {
      if (!item.id || typeof item.id !== "string") {
        throw new Error(`Item at index ${index} is missing a valid string 'id'.`);
      }
      if (!item.slug || typeof item.slug !== "string") {
        throw new Error(`Item at index ${index} is missing a valid string 'slug'.`);
      }
      if (!item.entityType) {
        throw new Error(`Item at index ${index} is missing 'entityType'.`);
      }
      if (!item.title?.en) {
        throw new Error(`Item at index ${index} is missing english title ('title.en').`);
      }

      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);

      // Supply default values if missing
      return {
        id: item.id,
        slug: item.slug,
        entityType: item.entityType,
        title: item.title,
        summary: item.summary || { en: "" },
        relatedEntities: item.relatedEntities || [],
        lastReviewed: item.lastReviewed || new Date().toISOString(),
        lastUpdated: item.lastUpdated || new Date().toISOString(),
        author: item.author || { name: "System Import" },
        reviewer: item.reviewer || { name: "Dr. Narayan Jethwani", credentials: "MD (Hom)" },
        evidenceLevel: item.evidenceLevel || "Traditional Literature",
        tags: item.tags || [],
        canonicalUrl: item.canonicalUrl || "",
        editorialStatus: item.editorialStatus || "draft",
        editorialNotes: item.editorialNotes || "",
        nextReviewDate: item.nextReviewDate || nextYear.toISOString(),
        versionInfo: item.versionInfo || {
          version: "1.0.0",
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
          reviewed: new Date().toISOString(),
          changelog: []
        },
        content: item.content || {},
        readabilityScore: item.readabilityScore || {
          score: 90,
          readingLevel: "Patient Friendly",
          readingTimeMinutes: 1
        },
        seoGeoScores: item.seoGeoScores || {
          seoScore: 70,
          geoScore: 65,
          aiReadinessScore: 68
        }
      };
    });

    return validated;
  } catch (err: any) {
    throw new Error(`Failed to parse json file: ${err.message}`);
  }
}
