import { KnowledgeEntity } from "../types";

/**
 * Helper to generate MedicalWebPage schema (combining clinical topic features)
 */
export function generateMedicalWebPageSchema(entity: KnowledgeEntity) {
  const title = typeof entity.title === "string" ? entity.title : (entity.title?.en || "");
  const summary = typeof entity.summary === "string" ? entity.summary : (entity.summary?.en || "");

  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": `${entity.canonicalUrl}#medicalwebpage`,
    "url": entity.canonicalUrl,
    "name": title,
    "description": summary,
    "lastReviewed": entity.versionInfo.reviewed,
    "dateModified": entity.versionInfo.updated,
    "datePublished": entity.versionInfo.created,
    "reviewedBy": {
      "@type": "Person",
      "name": entity.reviewer.name,
      "jobTitle": "Medical Reviewer",
      "alumniOf": entity.reviewer.institution || "Homeopathic Medical College"
    },
    "author": {
      "@type": "Person",
      "name": entity.author.name
    },
    "audience": {
      "@type": "MedicalAudience",
      "audienceType": entity.audience
    },
    "mainContentOfPage": {
      "@type": "WebPageElement",
      "cssSelector": "main"
    },
    "specialty": {
      "@type": "MedicalSpecialty",
      "name": "Homeopathy"
    }
  };
}

/**
 * Helper to generate Article schema
 */
export function generateArticleSchema(entity: KnowledgeEntity) {
  const title = typeof entity.title === "string" ? entity.title : (entity.title?.en || "");
  const summary = typeof entity.summary === "string" ? entity.summary : (entity.summary?.en || "");

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${entity.canonicalUrl}#article`,
    "url": entity.canonicalUrl,
    "headline": title,
    "description": summary,
    "datePublished": entity.versionInfo.created,
    "dateModified": entity.versionInfo.updated,
    "author": {
      "@type": "Person",
      "name": entity.author.name
    },
    "publisher": {
      "@type": "Organization",
      "name": "Homeo Healthcare",
      "url": "https://homeo.healthcare",
      "logo": {
        "@type": "ImageObject",
        "url": "https://homeo.healthcare/icon.png"
      }
    }
  };
}

/**
 * Helper to generate FAQ schema
 */
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

/**
 * Helper to generate Breadcrumb schema
 */
export function generateBreadcrumbSchema(items: { name: string; item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.item
    }))
  };
}

/**
 * Helper to generate Physician schema for Dr. Narayan Jethwani
 */
export function generatePhysicianSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": "https://homeo.healthcare/dr-narayan-jethwani#physician",
    "name": "Dr. Narayan Jethwani",
    "image": "https://homeo.healthcare/icon.png",
    "telephone": "+91-XXXXXXXXXX", // Replace with real clinical phone if needed
    "url": "https://homeo.healthcare/dr-narayan-jethwani",
    "medicalSpecialty": "Homeopathy",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Homeo Healthcare Clinic",
      "addressLocality": "Mumbai",
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    },
    "knowsAbout": [
      "Homeopathic Therapeutics",
      "Constitutional Remedy Mappings",
      "Repertorization",
      "Chronic Case Management"
    ]
  };
}

/**
 * Helper to generate Clinic schema
 */
export function generateClinicSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": "https://homeo.healthcare#clinic",
    "name": "Homeo Healthcare",
    "url": "https://homeo.healthcare",
    "logo": "https://homeo.healthcare/icon.png",
    "telephone": "+91-XXXXXXXXXX",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Homeo Healthcare Clinic",
      "addressLocality": "Mumbai",
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    },
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:00",
        "closes": "20:00"
      }
    ]
  };
}
