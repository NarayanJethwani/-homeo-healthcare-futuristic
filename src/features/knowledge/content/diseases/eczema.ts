import { KnowledgeEntity } from "../../types";

export const EczemaDisease: KnowledgeEntity = {
  id: "D0002",
  slug: "eczema",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-06-30T12:00:00Z",
    reviewed: "2026-06-30T12:00:00Z"
  },
  title: {
    en: "Atopic Dermatitis (Eczema)",
    hi: "एक्जिमा (खुजलीदार त्वचा रोग)",
    gu: "ખરજવું અને ત્વચાના રોગો (Eczema)",
    mr: "खरूज आणि त्वचेचे आजार (Eczema)",
    es: "Dermatitis Atópica (Eczema)",
    ar: "الأكزيما (Eczema)"
  },
  summary: {
    en: "A chronic, inflammatory skin condition characterized by dry, red, itchy patches, commonly associated with personal or family history of allergic conditions.",
    hi: "त्वचा की एक पुरानी सूजन संबंधी बीमारी जिसमें त्वचा पर लाल, सूखी और खुजलीदार पपड़ीदार परतें बन जाती हैं.",
    gu: "લાંબા ગાળાનો ત્વચાનો સોજો, જેનાથી ત્વચા લાલ, સુકી અને ખંજવાળવાળી થાય છે. આ ઘણીવાર એલર્જી સાથે જોડાયેલ હોય છે.",
    mr: "त्वचेचा एक जुनाट दाहयुक्त आजार, ज्यामध्ये त्वचा कोरडी पडते, लाल डाग आणि तीव्र खाज निर्माण होते.",
    es: "Una condición crónica e inflamatoria de la piel caracterizada por parches secos, rojos y con picazón.",
    ar: "حالة جلدية مزمنة والتهابية تتميز بوجود بقع جافة وحمراء ومثيرة للحكة."
  },
  content: {
    overview: "Atopic Dermatitis (Eczema) is a chronic pruritic inflammatory skin disease that typically affects individuals with a personal or family history of atopic diseases (asthma, allergic rhinitis). It is marked by a dysfunctional skin barrier and an overactive immune response to environmental triggers.",
    definition: "Eczema is an erythematous, papulovesicular, pruritic skin eruption. It involves structural defects in the epidermal barrier (such as filaggrin mutations) combined with an immune response skew towards Th2 pathways.",
    causes: [
      "Genetic mutation in the filaggrin gene leading to skin barrier dysfunction.",
      "Immune system dysregulation with excessive inflammatory cytokine release.",
      "Environmental allergens (dust mites, pollen, pet dander).",
      "Staphylococcus aureus colonization on the skin."
    ],
    riskFactors: [
      "Family history of eczema, asthma, or hay fever.",
      "Living in cold, damp climates or highly polluted urban areas.",
      "Frequent contact with harsh chemicals, soaps, or synthetic fabrics.",
      "Psychological stress, which triggers cutaneous flares."
    ],
    symptoms: [
      "Pruritus (itching): Often intense, worse during the night.",
      "Dry, scaly skin patches: Red to brownish-gray in color, especially on hands, feet, ankles, wrists, neck, and inner bends of elbows and knees.",
      "Small, raised bumps: May leak fluid and crust over when scratched.",
      "Lichenification: Thickened, cracked, leather-like skin from chronic rubbing."
    ],
    diagnosis: "Primarily diagnosed clinically based on history and morphologic features (Hanifin and Rajka criteria). Relevant elements include history of itching, typical distribution of lesions, chronic or relapsing course, and history of atopy.",
    differentialDiagnosis: "Seborrheic dermatitis, Psoriasis, Contact dermatitis (allergic or irritant), Scabies, and Cutaneous T-cell lymphoma.",
    labTests: [
      "Total Serum IgE (often elevated in atopic individuals).",
      "Allergy patch testing to identify potential contact allergens.",
      "Skin biopsy in atypical or refractory cases to rule out other dermatoses."
    ],
    imaging: "Not applicable for eczema diagnosis.",
    redFlags: [
      "Signs of secondary bacterial infection: Pus, yellow crusts, warmth, swelling, or spreading redness.",
      "Eczema herpeticum: Rapidly spreading painful blisters, often with fever, caused by herpes simplex virus infection.",
      "Erythroderma: Redness covering more than 90% of the body surface area, posing risks of thermoregulatory failure."
    ],
    conventionalManagement: "Conventional therapies emphasize skin hydration with thick emollient creams, topical corticosteroids (Hydrocortisone, Betamethasone) to reduce inflammation, topical calcineurin inhibitors (Tacrolimus), and systemic biologics (Dupilumab) for severe refractory cases.",
    homeopathicApproach: "Homeopathic prescribing targets the constitutional state rather than suppressing local skin eruptions. Selecting remedies like Sulphur depends on determining whether the skin flares correlate with dry/burning sensations, cold/heat aggravation, and systemic metabolic sluggishness. Suppression is avoided to prevent triggering respiratory atopy (asthma).",
    lifestyleAdvice: "Moisturize the skin at least twice daily. Take lukewarm showers rather than hot baths (keep under 10 minutes). Use mild, fragrance-free soaps. Pat dry instead of rubbing. Wear soft, breathable cotton fabrics. Keep fingernails short to prevent scratching injury.",
    references: ["CIT-0002"]
  },
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Constitutional Prescribing",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Level-B",
  tags: ["Eczema", "Atopic Dermatitis", "Skin Rash", "Allergic Skin", "Dermatology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/eczema",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.5",
  changeLog: ["1.0.0: Initial release of Eczema disease profile"]
};
