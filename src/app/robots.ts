import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/knowledge",
        "/knowledge/diseases",
        "/knowledge/symptoms",
        "/knowledge/remedies",
        "/knowledge/lab-tests",
        "/knowledge/diet-lifestyle",
        "/knowledge/faqs",
        "/knowledge/research",
        "/knowledge/case-studies",
      ],
      disallow: [
        "/admin",
        "/admin/dashboard",
        "/admin/login",
        "/patient",
        "/patient/dashboard",
        "/patient/login",
        "/api/admin",
        "/api/patient",
      ],
    },
    sitemap: "https://homeo.healthcare/sitemap.xml",
  };
}
