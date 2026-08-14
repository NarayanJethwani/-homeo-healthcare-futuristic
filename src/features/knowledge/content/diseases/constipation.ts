import { KnowledgeEntity } from "../../types";

export const ConstipationDisease: KnowledgeEntity = {
  id: "D0046",
  slug: "constipation",
  entityType: "disease",
  editorialStatus: "published",
  reviewStatus: "owner-authorization-required",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-08-14T12:00:00Z",
    reviewed: "2026-08-14T12:00:00Z"
  },
  title: {
    en: "Chronic Functional Constipation (Colonic Inertia & Pelvic Dyssynergia)",
    hi: "कब्ज / क्रॉनिक कब्जियत (Chronic Constipation / Obstipation)",
    gu: "કબજિયાત / ક્રોનિક કબજિયાત (Chronic Constipation)",
    mr: "बद्धकोष्ठता / जुनाट बद्धकोष्ठता (Chronic Constipation)",
    es: "Estreñimiento Crónico (Constipación Funcional)",
    ar: "الإمساك المزمن والقصور الحركي القولوني (Chronic Constipation)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Chronic Functional Constipation, covering slow-transit colonic inertia, pelvic floor dyssynergic defecation, enteric neuromotor coordination, constitutional homeopathic supportive management, and emergency red flags for acute mechanical bowel obstruction, toxic megacolon, and colorectal malignancy.",
    hi: "क्रॉनिक कब्ज (कब्जियत / मंद आंत्र गतिशीलता) का स्लो-ट्रांजिट पैथोलॉजी, पेल्विक फ्लोर डिसिनर्जिया, मल त्याग में रुकावट, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और आंतों में रुकावट (बाउल ऑब्स्ट्रक्शन) व कोलन कैंसर की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "ક્રોનિક કબજિયાત ની આંતરડાની ધીમી ગતિ પેથોલોજી, કઠણ મળ અને શૌચ વખતે જોર કરવું, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને આંતરડાના અટકાવાની (બોવેલ ઓબ્સ્ટ્રક્શન) ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "जुनाट बद्धकोष्ठता (Chronic Constipation), पोट साफ न होणे व कडक शौच, आंतड्यांची मंद हालचाल, पारंपरिक होमिओपॅथिक पद्धत आणि आतड्यांच्या अडथळ्याच्या (Bowel Obstruction) आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado del estreñimiento crónico que cubre la inercia colónica de tránsito lento, disinergia del suelo pélvico, manejo homeopático complementario y banderas rojas de obstrucción intestinal mecánica y neoplasias.",
    ar: "دليل سريري وتعليمي موثوق للإمساك المزمن يغطي بطء العبور القولوني واعتلال عضلات قاع الحوض والرعاية التكميلية وعلامات الخطر للانسداد المعوي الميكانيكي وتضخم القولون السمي."
  },
  content: {
    overview:
      "Chronic Functional Constipation is a widespread, heterogeneous gastrointestinal disorder defined by persistent, infrequent bowel evacuations (<3 spontaneous bowel movements per week), difficulty during defecation (excessive straining in \u226525% of defecations), hard or lumpy stools (Bristol Stool Form Scale Types 1 and 2), a sensation of incomplete anorectal evacuation, and a feeling of anorectal blockage. Pathophysiologically categorized into normal-transit constipation (most common; often overlapping with constipation-predominant IBS [IBS-C]), slow-transit constipation (colonic inertia / myopathic or neuropathic delay in colonic transit), and defecatory disorders (pelvic floor dyssynergia / paradoxical anal sphincter contraction), it causes significant abdominal bloating, discomfort, and impaired quality of life.",
    definition:
      "A symptom-based functional gastrointestinal disorder defined by the Rome IV diagnostic criteria as the presence of at least two characteristic defecatory symptoms occurring for the past 3 months with symptom onset at least 6 months prior to diagnosis, in the absence of structural, metabolic, or mechanical obstruction.",
    causes: [
      "Slow-Transit Constipation (Colonic Inertia): marked reduction in propagating high-amplitude peristaltic colonic contractions (HAPCs), loss of enteric interstitial cells of Cajal (ICCs), and enteric myopathic/neuropathic degenerative changes",
      "Defecatory Disorders (Pelvic Floor Dyssynergia / Anismus): paradoxical contraction or failure of relaxation of the puborectalis muscle and external anal sphincter during bearing-down attempts",
      "Dietary and lifestyle factors: inadequate dietary soluble/insoluble fiber, chronic fluid dehydration, and sedentary physical inactivity",
      "Pharmacological agents: opioids (opioid-induced constipation [OIC]), anticholinergics, calcium channel blockers, iron supplements, aluminum antacids, and tricyclic antidepressants",
      "Secondary metabolic and neuroendocrine disorders: hypothyroidism (slowed basal metabolic and intestinal transit rate), hypercalcemia, diabetes mellitus (diabetic autonomic enteropathy), Parkinson's disease, and spinal cord injuries"
    ],
    riskFactors: [
      "Female gender (prevalence 2 to 3 times higher due to progesterone slowing transit time and higher rates of pelvic floor trauma from childbirth)",
      "Advanced age (>65 years; reduced physical mobility, diminished thirst response, polypharmacy, and pelvic floor laxity)",
      "Chronic suppression of the natural defecatory urge ('habitual withholding')",
      "Low dietary intake of dietary fiber (<15 g/day) and low daily water consumption",
      "History of pelvic organ prolapse (rectocele, enterocele) or prior pelvic surgeries"
    ],
    symptoms: [
      "Infrequent bowel movements: fewer than 3 spontaneous bowel evacuations per week",
      "Excessive straining, grunting, and prolonged time spent on the toilet during \u226525% of defecations",
      "Lumpy, hard, dry, compacted stools: separate hard lumps resembling nuts or sheep dung (Bristol Stool Form Scale Type 1) or sausage-shaped but lumpy (Bristol Type 2)",
      "Sensation of incomplete evacuation: feeling that stool remains in the rectum even after passing a bowel movement",
      "Sensation of anorectal obstruction or blockage requiring manual maneuvers to facilitate defecation (digital evacuation or perineal support)",
      "Abdominal bloating, crampy lower quadrant distension, gas retention, and malaise relieved following a successful bowel movement"
    ],
    diagnosis:
      "Diagnosed clinically using the Rome IV diagnostic criteria for Functional Constipation. Digital Rectal Examination (DRE) is mandatory in all patients to assess for fecal impaction, resting anal sphincter tone, puborectalis relaxation during simulated bearing down, and to detect rectal masses or rectoceles. Diagnostic physiological tests (indicated for refractory constipation) include Radiopaque Marker Colonic Transit Study (Sitzmarks test), Anorectal Manometry (assessing rectoanal inhibitory reflex [RAIR] to exclude adult Hirschsprung's disease and evaluating dyssynergia), and Balloon Expulsion Test (abnormal if unable to expel a 50 mL water-filled balloon within 1 minute).",
    differentialDiagnosis:
      "Differentiate Functional Constipation from Constipation-Predominant Irritable Bowel Syndrome (IBS-C; abdominal pain is the predominant cardinal feature and is temporally related to defecation), Mechanical Colorectal Obstruction (colon adenocarcinoma, benign strictures, volvulus, external compression), Hypothyroidism, Hypercalcemia (hyperparathyroidism), and Drug-Induced Constipation (opioids).",
    conventionalManagement:
      "A stepwise structured ladder approach is recommended: (1) Dietary modification (gradually increasing dietary fiber to 25–35 g/day plus generous hydration). (2) Osmotic laxatives (polyethylene glycol [PEG 3350] is the first-line evidence-based osmotic agent; lactulose, magnesium hydroxide) or bulk-forming fiber (psyllium / ispaghula husk). (3) Stimulant laxatives (bisacodyl, senna) for rescue use. (4) Secretagogues and prokinetics (lubiprostone [chloride channel activator], linaclotide, plecanatide [guanylate cyclase-C agonists], or prucalopride [5-HT4 receptor agonist]) for severe refractory slow-transit constipation. (5) Pelvic Floor Biofeedback Therapy is the undisputed first-line treatment for dyssynergic defecation (>70–80% success rate).",
    homeopathicApproach:
      "Homeopathic constitutional and gastrointestinal remedies (such as Nux Vomica, Bryonia Alba, Alumina, Opium, Lycopodium Clavatum, Silicea, Plumbum Metallicum, Graphites, Hydrastis Canadensis) serve as supportive care to assist peristaltic coordination, ease dry stool straining, and support bowel regularity alongside dietary fiber, adequate water intake, and biofeedback retraining.",
    lifestyleAdvice:
      "Gradually increase dietary fiber intake by consuming oats, flaxseeds, legumes, prunes, kiwi fruit, and green vegetables, drink at least 2.5 to 3 liters of water throughout the day, take advantage of the morning gastrocolic reflex by sitting on the toilet 20–30 minutes after breakfast, use a footstool ('Squatty Potty') to elevate the knees above the hips and straighten the anorectal angle, and engage in daily brisk walking to stimulate colonic motor activity.",
    references: [
      "CIT-0004",
      "CIT-0005",
      "CIT-0006",
      "CIT-0007",
      "CIT-0023",
      "CIT-0024"
    ],
    faqs: [
      {
        question: "How does using a footstool on the toilet help with constipation?",
        answer: "Modern toilets place the body in a seated 90-degree position where the puborectalis muscle remains partially cinched around the rectum like a kinked garden hose. Elevating your feet on a small footstool mimics natural squatting (creating a 35-degree hip angle), which fully relaxes the puborectalis muscle and allows stool to pass smoothly with minimal straining."
      },
      {
        question: "Is it dangerous to use osmotic laxatives like polyethylene glycol (PEG 3350) every day?",
        answer: "No. Unlike older stimulant laxatives that irritate the bowel wall, osmotic laxatives like polyethylene glycol (PEG) simply hold water inside the stool to keep it soft and pliable. PEG is not absorbed into the bloodstream, does not cause dependency or 'lazy bowel', and is proven safe for long-term daily use under medical guidance."
      }
    ],
    redFlags: [
      "Acute Complete Mechanical Bowel Obstruction: sudden cessation of passage of both feces and flatus (obstipation), accompanied by severe abdominal distension, tympanitic abdomen, high-pitched hyperactive bowel sounds or absent bowel sounds, severe vomiting (potentially feculent), and visible peristalsis (surgical emergency requiring emergency abdominal CT and surgical decompression)",
      "Red flag 'Alarm' colorectal cancer signs: new-onset constipation in an individual over 50 years of age, persistent unexplained hematochezia (rectal bleeding) or melena, iron-deficiency anemia, rapid unintentional weight loss, or family history of colorectal cancer (mandates urgent diagnostic Colonoscopy)",
      "Severe fecal impaction with stercoral ulceration, bowel ischemia, or stercoral peritonitis (requires urgent manual disimpaction and surgical evaluation)",
      "Toxic Megacolon: marked colonic dilation (>6 cm on radiograph) accompanied by high fever, severe tachycardia, leukocytosis, and systemic toxicity"
    ]
  },
  claimCitations: [
    { claimId: "D0046-TRADITIONAL-PROFILE", statement: "Homeopathic constipation profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0046-TRADITIONAL-PROFILE" },
    { claimId: "D0046-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for mechanical bowel obstruction, colon cancer resection, or toxic megacolon.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0046-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0046-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for acute bowel obstruction, toxic megacolon, or colorectal cancer screening.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Complete cessation of stool and gas (obstipation) with vomiting and distension indicating acute mechanical bowel obstruction requiring emergency surgery",
    "New-onset constipation after age 50 with rectal bleeding, anemia, or weight loss requiring urgent screening colonoscopy",
    "Fever, severe tachycardia, and massive colonic distension indicating toxic megacolon"
  ],
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Clinical Governance & Materia Medica",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Constipation", "Chronic Constipation", "Colonic Inertia", "Pelvic Dyssynergia", "Disease", "Hard Stool", "Bowel Transit", "Gastroenterology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/constipation",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive Rome IV functional colonic clinical boundaries, obstruction red flags, and verified citations"],
  clinicalPearl: "New-onset constipation in any patient over the age of 50 is an alarm symptom that mandates diagnostic colonoscopy to rule out colorectal adenocarcinoma.",
  quickFacts: {
    "Global Prevalence": "Estimated 12% to 19% across the adult population (increases with age)",
    "Primary System": "Gastrointestinal & Colorectal System (Neurogastroenterology / Motility)",
    "Diagnostic Standard": "Rome IV Diagnostic Criteria & Digital Rectal Examination",
    "Clinical Character": "Functional colonic motility disorder characterized by infrequent bowel movements, hard stools, and excessive straining"
  },
  aiReadiness: {
    retrievalSummary: "Chronic Functional Constipation is a motility disorder marked by infrequent defecation, hard lumpy stools, and excessive straining, managed with supportive care, dietary fiber, osmotic laxatives, and biofeedback.",
    clinicalSummary: "Constipation pathophysiology involves slow colonic transit, reduced peristaltic contractions, or pelvic floor dyssynergia. Homeopathic remedies serve as supportive digestive care and do not replace dietary fiber optimization, biofeedback training, or emergency surgery for acute mechanical bowel obstruction or colon cancer screening.",
    patientSummary: "Chronic constipation is having bowel movements fewer than three times a week with hard, dry stools that are difficult or painful to pass, improved by eating more fiber, drinking plenty of water, and using a bathroom footstool.",
    studentSummary: "Diagnosed using Rome IV criteria. Three main subtypes: normal-transit, slow-transit (colonic inertia), and dyssynergic defecation (puborectalis spasm). First-line therapy: PEG 3350 osmotic laxative and biofeedback. Red flag: bowel obstruction and colon cancer after age 50.",
    keywords: ["constipation", "chronic constipation", "hard stool", "colonic inertia", "straining at stool", "pelvic dyssynergia", "rome iv constipation"],
    semanticKeywords: ["slow transit constipation", "functional defecation disorder", "colonic dysmotility"],
    icd: "K59.00",
    mesh: "D003248",
    bodySystem: "Gastroenterology & Colorectal",
    urgency: "routine"
  }
};
