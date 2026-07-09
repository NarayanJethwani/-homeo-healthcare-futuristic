"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMedicalMetadata = generateMedicalMetadata;
/**
 * Generates SEO/GEO metadata for a given Knowledge Entity.
 */
function generateMedicalMetadata(entity) {
    const title = typeof entity.title === "string" ? entity.title : (entity.title?.en || "");
    const summary = typeof entity.summary === "string" ? entity.summary : (entity.summary?.en || "");
    const fullTitle = `${title} | Homeo Healthcare Clinical Platform`;
    // Safeguard: Only published entities are crawlable
    const isCrawlable = entity.editorialStatus === "published";
    return {
        title: fullTitle,
        description: summary,
        alternates: {
            canonical: entity.canonicalUrl,
        },
        robots: {
            index: isCrawlable,
            follow: isCrawlable,
            nocache: !isCrawlable,
            googleBot: {
                index: isCrawlable,
                follow: isCrawlable,
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
            authors: [entity.author.name],
            tags: entity.tags,
        },
        twitter: {
            card: "summary_large_image",
            title: fullTitle,
            description: summary,
            creator: entity.author.name,
        },
        other: {
            "medical-reviewer": entity.reviewer.name,
            "reviewer-specialty": entity.reviewer.specialty,
            "evidence-level": entity.evidenceLevel,
            "last-reviewed": entity.versionInfo.reviewed,
            "audience-type": entity.audience,
        },
    };
}
