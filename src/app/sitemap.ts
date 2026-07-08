import { MetadataRoute } from "next";
import { getAllKnowledgeEntities, getEntityUrl } from "@/features/knowledge";
import { CURATED_COLLECTIONS } from "@/features/knowledge/collections/collectionsRegistry";
import { COMPARISONS } from "@/features/knowledge/comparisons/comparisonRegistry";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://homeo.healthcare";

  // 1. Static base routes
  const staticRoutes = [
    "",
    "/store",
    "/store/plans",
    "/services",
    "/blogs",
    "/contact",
    "/contact-us",
    "/doctors",
    "/dr-narayan-jethwani",
    "/evidence-based-homeopathy",
    "/health-intelligence",
    "/privacy-policy",
    "/about",
    "/knowledge",
    "/knowledge/diseases",
    "/knowledge/symptoms",
    "/knowledge/remedies",
    "/knowledge/lab-tests",
    "/knowledge/diet-lifestyle",
    "/knowledge/faqs",
    "/knowledge/research",
    "/knowledge/case-studies",
  ];

  const sitemapItems: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : route.startsWith("/knowledge") ? 0.8 : 0.6,
  }));

  // 2. Dynamic knowledge entity details routes
  try {
    const entities = getAllKnowledgeEntities().filter(
      (e) => e.editorialStatus === "published"
    );

    for (const entity of entities) {
      const entityRoute = getEntityUrl(entity.entityType, entity.slug);
      sitemapItems.push({
        url: `${baseUrl}${entityRoute}`,
        lastModified: new Date(entity.versionInfo.updated),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  } catch (error) {
    console.error("Error generating dynamic sitemap links:", error);
  }

  // 3. Dynamic curated hubs (Sprint 3)
  try {
    for (const collection of CURATED_COLLECTIONS) {
      sitemapItems.push({
        url: `${baseUrl}/knowledge/hubs/${collection.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.75,
      });
    }
  } catch (error) {
    console.error("Error generating hubs sitemap links:", error);
  }

  // 4. Dynamic comparison matrix pages (Sprint 2/3)
  try {
    for (const comp of COMPARISONS) {
      sitemapItems.push({
        url: `${baseUrl}/knowledge/compare/${comp.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.75,
      });
    }
  } catch (error) {
    console.error("Error generating comparisons sitemap links:", error);
  }

  return sitemapItems;
}
