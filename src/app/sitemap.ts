import { MetadataRoute } from "next";
import { getAllKnowledgeEntities } from "@/features/knowledge";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://homeo.healthcare";

  // 1. Static base routes
  const staticRoutes = [
    "",
    "/store",
    "/services",
    "/blogs",
    "/contact-us",
    "/dr-narayan-jethwani",
    "/evidence-based-homeopathy",
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
      // e.g. /knowledge/diseases/gerd
      const entityRoute = `/knowledge/${entity.entityType}s/${entity.slug}`;
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

  return sitemapItems;
}
