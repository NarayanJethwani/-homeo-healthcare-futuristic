import { getAllKnowledgeEntities, getEntityUrl } from "../index";

export interface SEOIssue {
  entityId: string;
  title: string;
  category: "title" | "description" | "canonical" | "schema" | "duplicate";
  type: "error" | "warning";
  message: string;
}

export interface SEOAuditSummary {
  totalAudited: number;
  uniqueTitlesCount: number;
  duplicateTitlesList: string[];
  missingDescriptionsCount: number;
  totalIssuesCount: number;
  issues: SEOIssue[];
}

export function runSEOAudit(): SEOAuditSummary {
  const entities = getAllKnowledgeEntities();
  const issues: SEOIssue[] = [];

  const seenTitles = new Set<string>();
  const duplicateTitles = new Set<string>();
  const seenSlugs = new Set<string>();
  const duplicateSlugs = new Set<string>();

  let missingDescriptionsCount = 0;

  entities.forEach(e => {
    const titleStr = typeof e.title === "string" ? e.title : e.title.en;
    const summaryStr = typeof e.summary === "string" ? e.summary : e.summary.en;

    // 1. Title Checks
    if (!titleStr || titleStr.trim().length === 0) {
      issues.push({
        entityId: e.id,
        title: titleStr,
        category: "title",
        type: "error",
        message: "SEO title tag is empty or missing."
      });
    } else {
      if (seenTitles.has(titleStr)) {
        duplicateTitles.add(titleStr);
        issues.push({
          entityId: e.id,
          title: titleStr,
          category: "duplicate",
          type: "warning",
          message: `Duplicate SEO Title detected: "${titleStr}"`
        });
      }
      seenTitles.add(titleStr);
    }

    // Route URL Duplications
    const fullRouteUrl = getEntityUrl(e.entityType, e.slug);
    if (seenSlugs.has(fullRouteUrl)) {
      duplicateSlugs.add(fullRouteUrl);
      issues.push({
        entityId: e.id,
        title: titleStr,
        category: "duplicate",
        type: "error",
        message: `Duplicate URI Route path detected: URL slug "${fullRouteUrl}" already mapped.`
      });
    }
    seenSlugs.add(fullRouteUrl);

    // 2. Meta Description Checks
    if (!summaryStr || summaryStr.trim().length === 0) {
      missingDescriptionsCount++;
      issues.push({
        entityId: e.id,
        title: titleStr,
        category: "description",
        type: "error",
        message: "Meta Description is empty or missing."
      });
    } else if (summaryStr.length < 50) {
      issues.push({
        entityId: e.id,
        title: titleStr,
        category: "description",
        type: "warning",
        message: "Meta Description is too short (recommended minimum is 50 characters)."
      });
    } else if (summaryStr.length > 160) {
      issues.push({
        entityId: e.id,
        title: titleStr,
        category: "description",
        type: "warning",
        message: "Meta Description exceeds 160 characters (may be truncated in SERPs)."
      });
    }

    // 3. Canonical Checks
    if (!e.canonicalUrl) {
      issues.push({
        entityId: e.id,
        title: titleStr,
        category: "canonical",
        type: "error",
        message: "Missing canonical URL."
      });
    } else {
      const expectedUrl = `https://homeo.healthcare${getEntityUrl(e.entityType, e.slug)}`;
      if (e.canonicalUrl !== expectedUrl) {
        issues.push({
          entityId: e.id,
          title: titleStr,
          category: "canonical",
          type: "warning",
          message: `Canonical URL mismatch. Found: "${e.canonicalUrl}", expected: "${expectedUrl}"`
        });
      }
    }

    // 4. Schema verification check (Must support medical types)
    if (!e.evidenceLevel) {
      issues.push({
        entityId: e.id,
        title: titleStr,
        category: "schema",
        type: "warning",
        message: "No evidence level mapped. Structured medical schema markup might degrade."
      });
    }
  });

  return {
    totalAudited: entities.length,
    uniqueTitlesCount: seenTitles.size,
    duplicateTitlesList: Array.from(duplicateTitles),
    missingDescriptionsCount,
    totalIssuesCount: issues.length,
    issues
  };
}

// Runnable console execution script
if (require.main === module) {
  const summary = runSEOAudit();
  console.log("=== CLINICAL KNOWLEDGE SEO METADATA AUDIT ===");
  console.log(`Total Pages Audited: ${summary.totalAudited}`);
  console.log(`Unique Titles Count: ${summary.uniqueTitlesCount}`);
  console.log(`Duplicate Title Collisions: ${summary.duplicateTitlesList.length}`);
  console.log(`Missing Meta Descriptions: ${summary.missingDescriptionsCount}`);
  console.log(`Total SEO Recommendations/Errors: ${summary.totalIssuesCount}`);

  if (summary.issues.length > 0) {
    console.log("\n--- Top SEO Audit Issues ---");
    summary.issues.slice(0, 15).forEach(iss => {
      console.log(`[${iss.type.toUpperCase()}] ${iss.entityId} (${iss.title}) - [${iss.category}]: ${iss.message}`);
    });
  }
}
