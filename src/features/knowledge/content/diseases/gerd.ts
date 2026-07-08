import { KnowledgeEntity } from "../../types";

export const GerdDisease: KnowledgeEntity = {
  id: "D0001",
  slug: "gastroesophageal-reflux-disease",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-06-30T12:00:00Z",
    reviewed: "2026-06-30T12:00:00Z"
  },
  title: {
    en: "Gastroesophageal Reflux Disease (GERD)",
    hi: "गैस्ट्रोइसोफेजियल रिफ्लक्स रोग (जीईआरडी)",
    gu: "એસિડિટી અને જી.ઈ.આર.ડી. (GERD)",
    mr: "आम्लपित्त आणि जी.ई.आर.डी. (GERD)",
    es: "Enfermedad por Reflujo Gastroesofágico (ERGE)",
    ar: "مرتجع المريء (GERD)"
  },
  summary: {
    en: "A chronic digestive disorder characterized by the backflow of stomach acid into the esophagus, causing irritation, heartburn, and potential mucosal injury.",
    hi: "एक पुरानी पाचन संबंधी बीमारी जिसमें पेट का एसिड वापस भोजन नली में बहने लगता है, जिससे सीने में जलन और दर्द होता है.",
    gu: "લાંબા ગાળાની પાચન સંબંધી તકલીફ જેમાં પેટનું એસિડ પાછું અન્નનળીમાં વહે છે, જેનાથી બળતરા અને છાતીમાં દુખાવો થાય છે.",
    mr: "पोटातील आम्ल अन्ननलिकेत परत येऊन जळजळ आणि छातीत दुखणे निर्माण करणारी एक जुनाट पचनाची तक्रार.",
    es: "Un trastorno digestivo crónico caracterizado por el flujo retrógrado de ácido estomacal hacia el esófago.",
    ar: "اضطراب هضمي مزمن يتميز بتدفق حمض المعدة إلى المريء، مما يسبب تهيجًا وحرقة."
  },
  content: {
    overview: "Gastroesophageal Reflux Disease (GERD) is a chronic pathological condition occurring when stomach acid or bile frequently flows back into the tube connecting your mouth and stomach (esophagus). This backflow (acid reflux) can irritate the lining of your esophagus, leading to mucosal inflammation, pain, and systemic complications.",
    definition: "GERD is clinically defined as symptoms or mucosal damage produced by the abnormal reflux of gastric contents into the esophagus. It is typically diagnosed when reflux occurs more than twice a week and affects the individual's quality of life.",
    causes: [
      "Transient lower esophageal sphincter (LES) relaxations.",
      "Hiatal hernia preventing the diaphragm from supporting the LES.",
      "Delayed gastric emptying causing increased intra-gastric pressure.",
      "Impaired esophageal clearance of acid."
    ],
    riskFactors: [
      "Obesity increasing intra-abdominal pressure.",
      "Pregnancy shifting organs and increasing hormones.",
      "Smoking which relaxes the lower esophageal sphincter.",
      "Consuming trigger foods (fatty foods, coffee, alcohol, citrus, tomato).",
      "Certain medications like antihistamines, calcium channel blockers, and sedatives."
    ],
    symptoms: [
      "Pyrosis (heartburn): A burning sensation in the chest, usually after eating, which might be worse at night or when lying down.",
      "Acid regurgitation: Backflow of sour or bitter-tasting gastric liquid into the throat or mouth.",
      "Dysphagia: Difficulty swallowing or the sensation of food stuck in the chest.",
      "Atypical symptoms: Chronic cough, laryngitis, new or worsening asthma, disrupted sleep."
    ],
    diagnosis: "Clinically diagnosed based on typical symptoms of heartburn and acid regurgitation. Further diagnostics include Upper Endoscopy (EGD) to evaluate mucosal damage, 24-hour ambulatory pH monitoring (gold standard for acid measurement), and Esophageal Manometry to measure muscle contractions.",
    differentialDiagnosis: "Esophagitis (infectious, eosinophilic, or pill-induced), Coronary Artery Disease (ruling out cardiac-related chest pain), Esophageal Motility Disorders (achalasia), and Functional Dyspepsia.",
    labTests: [
      "Complete Blood Count (CBC) to screen for anemia resulting from chronic esophageal bleeding.",
      "Serum Gastrin to rule out Zollinger-Ellison syndrome (gastrinoma) in severe refractory cases."
    ],
    imaging: "Barium Swallow Radiography to detect structural abnormalities, strictures, or a hiatal hernia.",
    redFlags: [
      "Progressive dysphagia (difficulty swallowing) or odynophagia (painful swallowing).",
      "Unexplained weight loss.",
      "Evidence of gastrointestinal bleeding (hematemesis, melena, or iron deficiency anemia).",
      "Persistent vomiting.",
      "New onset of symptoms in patients over 50 years of age."
    ],
    conventionalManagement: "Conventional therapy primarily relies on Acid Suppressants: Proton Pump Inhibitors (PPIs like Omeprazole, Pantoprazole) and H2 Receptor Antagonists (like Famotidine). Antacids are used for temporary relief. Refractory cases may require surgical intervention, such as Nissen Fundoplication.",
    homeopathicApproach: "Homeopathy views GERD not as an isolated local disorder but as a constitutional imbalance. Treatment focuses on stabilizing gastric motility, strengthening the lower esophageal sphincter tone, and addressing underlying nervous excitability. Standard remedies like Nux Vomica and Lycopodium are selected based on the patient's physical and mental triggers.",
    lifestyleAdvice: "Maintain a healthy weight. Avoid tight-fitting clothing. Elevate the head of the bed by 6 inches. Avoid lying down within 3 hours of a meal. Eat small, frequent meals instead of large dinners. Eliminate smoking, alcohol, and trigger foods.",
    references: ["CIT-0001"]
  },
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Gastroenterology & Constitutional Medicine",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Level-A",
  tags: ["GERD", "Acid Reflux", "Acidity", "Heartburn", "Digestive Disease"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/gastroesophageal-reflux-disease",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.5",
  changeLog: ["1.0.0: Initial release of GERD disease profile"]
};
