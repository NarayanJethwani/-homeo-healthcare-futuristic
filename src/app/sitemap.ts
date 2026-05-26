import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://homeo.healthcare";

  const routes = [
    "",
    "/store",
    "/services",
    "/blogs",
    "/contact-us",
    "/dr-narayan-jethwani",
    "/evidence-based-homeopathy",
    "/privacy-policy",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : 0.8,
  })) as MetadataRoute.Sitemap;
}
