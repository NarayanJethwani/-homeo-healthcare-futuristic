import { Metadata } from "next";
import { KnowledgeEntity } from "../types";
import { isEntityIndexable } from "../governance/publicationGuard";

/**
 * Generates SEO/GEO metadata for a given Knowledge Entity.
 */
export function generateMedicalMetadata(entity: KnowledgeEntity): Metadata {
  const title = typeof entity.title === "string" ? entity.title : (entity.title?.en || "");
  const summary = typeof entity.summary === "string" ? entity.summary : (entity.summary?.en || "");

  const fullTitle = `${title} | Homeo Healthcare Clinical Platform`;
  
  // Safeguard: Only governed, published, indexable entities are crawlable
  const isCrawlable = isEntityIndexable(entity);
  
  const reviewerName = typeof entity.reviewer === "string"
    ? entity.reviewer
    : entity.reviewer?.name || entity.author?.name || "Clinical Review Board";

  const reviewerSpecialty = typeof entity.reviewer === "object" && entity.reviewer?.specialty
    ? entity.reviewer.specialty
    : entity.reviewerRole || "Clinical Reviewer";

  return {
    title: fullTitle,
    description: summary,
    alternates: {
      canonical: entity.canonicalUrl,
    },
    robots: {
      index: isCrawlable,
      follow: true,
      nocache: !isCrawlable,
      googleBot: {
        index: isCrawlable,
        follow: true,
      },
    },
    openGraph: {
      title: fullTitle,
      description: summary,
      url: entity.canonicalUrl,
      siteName: "Homeo Healthcare",
      locale: "en_US",
      type: "article",
      publishedTime: entity.versionInfo.created,
      modifiedTime: entity.versionInfo.updated,
      authors: [entity.author?.name || "Homeo Healthcare"],
      tags: entity.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: summary,
      creator: entity.author?.name || "Homeo Healthcare",
    },
    other: {
      "medical-reviewer": reviewerName,
      "reviewer-specialty": reviewerSpecialty,
      "evidence-level": entity.evidenceLevel,
      "last-reviewed": entity.versionInfo.reviewed,
      "audience-type": entity.audience,
    },
  };
}
