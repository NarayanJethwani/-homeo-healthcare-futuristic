import React from "react";
import { ASSESSMENT_PROFILES } from "./assessmentsData";

interface SchemaMarkupProps {
  profileId: string;
}

export default function SchemaMarkup({ profileId }: SchemaMarkupProps) {
  const profile = ASSESSMENT_PROFILES.find(p => p.id === profileId);

  if (!profile) {
    // Default Main Health Intelligence Portal Schema
    const mainSchema = {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      "name": "Public Health Intelligence Center | Homeo Healthcare",
      "description": "Assess your homeostatic health profile. Take our metabolic, endocrine, thyroid, and stress self-assessments to mapping constitutional symptoms.",
      "url": "https://homeo.healthcare/health-intelligence",
      "mainEntity": {
        "@type": "MedicalGuideline",
        "name": "Homeopathic Constitutional Mapping Guideline",
        "guidelineSubject": {
          "@type": "MedicalSubject",
          "name": "Homeostatic Health Mapping and Constitutional Vitality"
        }
      },
      "audience": {
        "@type": "Patient",
        "audienceType": "General Public"
      }
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mainSchema) }}
      />
    );
  }

  // Profile-specific FAQ schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is the purpose of the ${profile.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${profile.description} It evaluates key physical parameters, triggers, and constitutional homeopathic modalities.`
        }
      },
      {
        "@type": "Question",
        "name": `Does the ${profile.name} make a clinical diagnosis?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, this assessment maps homeostatic stress loads and miasmatic tendencies to provide educational lifestyle and constitutional wellness insights. It does not replace a clinical diagnosis or medical review."
        }
      },
      {
        "@type": "Question",
        "name": "What are the common symptoms evaluated in this profile?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Common symptoms include: ${profile.symptomsList.join(", ")}.`
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}
