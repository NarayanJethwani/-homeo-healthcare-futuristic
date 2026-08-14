import { KnowledgeEntity } from "../../types";

export const GastroenteritisDisease: KnowledgeEntity = {
  id: "D0047",
  slug: "gastroenteritis",
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
    en: "Acute Gastroenteritis (Infectious Diarrhea / Food Poisoning & Stomach Flu)",
    hi: "एक्यूट गैस्ट्रोएंटेराइटिस / उल्टी-दस्त व पेट का संक्रमण (Gastroenteritis)",
    gu: "ઝાડા-ઊલટી અને ગેસ્ટ્રો / પેટનો ચેપ (Acute Gastroenteritis)",
    mr: "उलट्या आणि जुलाब / पोटाचा संसर्ग (Gastroenteritis)",
    es: "Gastroenteritis Aguda (Diarrea Infecciosa / Intoxicación Alimentaria)",
    ar: "التهاب المعدة والأمعاء الحاد (Gastroenteritis)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Acute Infectious Gastroenteritis, covering viral and bacterial enterotoxin pathogenesis, secretory/osmotic/inflammatory diarrhea, oral rehydration therapy (ORT), constitutional homeopathic supportive management, and emergency red flags for severe hypovolemic shock, hemolytic uremic syndrome (HUS), and toxic megacolon.",
    hi: "एक्यूट गैस्ट्रोएंटेराइटिस (उल्टी-दस्त / फूड पॉइजनिंग) का वायरल व बैक्टीरियल एंटरोटॉक्सिन पैथोलॉजी, ओरल रिहाइड्रेशन थेरेपी (ORS), पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और गंभीर डिहाइड्रेशन (हाइपोवोलेमिक शॉक) व हीमोलिटिक यूरेमिक सिंड्रोम की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "ઝાડા-ઊલટી (ગેસ્ટ્રોએન્ટેરાઇટિસ / ફૂડ પોઇઝનિંગ) ની બેક્ટેરિયલ-વાયરલ પેથોલોજી, શરીરમાં પાણીની અછત (ડીહાઇડ્રેશન), ઓઆરએસ થેરાપી, પરંપराગત હોમિયોપેથીક સહાયક સારવાર અને હાઇપોવોલેમિક શોક ની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "उलट्या आणि जुलाब (Gastroenteritis / Food Poisoning), शरीरातील पाण्याचे प्रमाण कमी होणे (Dehydration), ओआरएस (ORS) उपचार, पारंपरिक होमिओपॅथिक पद्धत आणि डिहायड्रेशनच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la gastroenteritis aguda que cubre la patogénesis de enterotoxinas virales y bacterianas, terapia de rehidratación oral (SRO), manejo homeopático complementario y banderas rojas de shock hipovolémico y síndrome urémico hemolítico.",
    ar: "دليل سريري وتعليمي موثوق لالتهاب المعدة والأمعاء الحاد يغطي السموم المعوية الفيروسية والبكتيرية وعلاج الجفاف الفموي والرعاية التكميلية وعلامات الخطر للصدمة النقصية الحجمية ومتلازمة انحلال الدم اليوريميائية."
  },
  content: {
    overview:
      "Acute Gastroenteritis (infectious diarrhea / 'stomach flu') is a widespread, rapid-onset inflammatory syndrome of the gastrointestinal mucosal lining involving the stomach and small/large intestines. Driven by viral, bacterial, or protozoal pathogens or their preformed enterotoxins, it is characterized by the sudden onset of watery or loose bowel movements (\u22653 loose stools per 24 hours), projectile or frequent vomiting, spasmodic abdominal cramping, low-grade or high fever, and anorexia. The paramount physiological danger across all age groups is rapid intravascular volume depletion, electrolyte derangement, and hypovolemic shock.",
    definition:
      "A transient infectious or toxic diarrheal illness lasting <14 days characterized by a significant increase in stool frequency, liquidity, or volume, with or without vomiting, fever, and abdominal pain.",
    causes: [
      "Viral enteropathogens (responsible for >70% of acute community cases): Norovirus (leading cause in adults and children in closed settings/cruise ships), Rotavirus (leading cause of severe dehydrating diarrhea in unvaccinated infants), Enteric Adenovirus, and Astrovirus",
      "Bacterial enteropathogens: Campylobacter jejuni (leading bacterial cause in industrialized countries; associated with post-infectious Guillain-Barré syndrome), non-typhoidal Salmonella enterica, Shigella species (bacillary dysentery with mucosal invasion), enterotoxigenic E. coli (ETEC; classic 'traveler's diarrhea'), Shiga toxin-producing E. coli (STEC / E. coli O157:H7; causes bloody diarrhea and risk of hemolytic uremic syndrome), Vibrio cholerae (copious secretory 'rice-water' stool), and Clostridioides difficile (antibiotic-associated pseudomembranous colitis)",
      "Bacterial preformed enterotoxins: Staphylococcus aureus, Bacillus cereus (reheated fried rice), Clostridium perfringens (short incubation period 1–6 hours with explosive vomiting/diarrhea)",
      "Protozoal parasites: Giardia duodenalis (foul greasy frothy diarrhea and flatulence), Cryptosporidium parvum, and Entamoeba histolytica (amoebic dysentery / bloody mucus stools)"
    ],
    riskFactors: [
      "Ingestion of contaminated, unpasteurized, improperly cooked, or spoiled food and water",
      "Recent international travel to resource-limited regions ('traveler's diarrhea')",
      "Extremes of age (infants and young children <5 years, and elderly adults >65 years have dramatically higher risks of rapid dehydration and death)",
      "Recent broad-spectrum antibiotic therapy within the prior 8 to 12 weeks (C. difficile risk)",
      "Immunocompromised states (HIV/AIDS, chemotherapy, immunosuppressive medications, severe malnutrition)"
    ],
    symptoms: [
      "Diarrhea: frequent passage of watery, profuse, unformed, or gushing stools, or inflammatory dysentery (scanty stools containing gross mucus and streaks of frank blood)",
      "Nausea and recurrent vomiting, often preceding or accompanying the onset of diarrhea",
      "Spasmodic, colicky periumbilical or lower abdominal pain and painful tenesmus (straining with ineffective urges)",
      "Low-grade or high spiking fever, chills, generalized myalgias, and headache",
      "Signs of dehydration: dry oral mucous membranes, sunken eyes, decreased skin turgor (delayed skin pinch recoil), absence of tears in crying infants, dark concentrated oliguria, dry diapers, tachycardia, orthostatic lightheadedness, and lethargy"
    ],
    diagnosis:
      "Diagnosed primarily clinically based on acute history and physical examination, with mandatory assessment of the patient's hydration status according to World Health Organization (WHO) dehydration grading (no dehydration, some dehydration, severe dehydration). Diagnostic stool evaluation (Stool Multiplex PCR Gastrointestinal Panel, stool culture, microscopy for ova/parasites, C. difficile toxin EIA, and fecal calprotectin/leukocytes) is indicated for severe illness, bloody stools (dysentery), systemic toxicity, immunocompromised hosts, or symptoms persisting >7 days.",
    differentialDiagnosis:
      "Differentiate Infectious Gastroenteritis from Acute Appendicitis (right lower quadrant focal tenderness and guarding), Inflammatory Bowel Disease flare (Ulcerative Colitis / Crohn's), Ischemic Colitis (elderly patient with postprandial severe abdominal pain and bloody stool), Celiac Disease, Intussusception (infant with episodic colicky pain, 'currant jelly' stool, and abdominal mass), and Diabetic Ketoacidosis (nausea, vomiting, and abdominal pain mimicking gastroenteritis).",
    conventionalManagement:
      "The cornerstone of management is fluid and electrolyte replacement: Oral Rehydration Salts (WHO-formula low-osmolarity ORS solution) is the undisputed first-line therapy for mild to moderate dehydration. Intravenous fluid resuscitation (isotonic crystalloids: Ringer's Lactate or Normal Saline) is mandatory for severe dehydration, hypovolemic shock, or intractable vomiting. Early nutritional re-feeding (age-appropriate normal diet without prolonged fasting) accelerates enterocyte recovery. Zinc supplementation (20 mg/day for 10–14 days) in children under 5 reduces duration and severity. Antiemetics (single-dose oral ondansetron) facilitate oral rehydration in pediatric vomiting. Empirical antibiotics (azithromycin or fluoroquinolones) are reserved strictly for severe traveler's diarrhea, invasive bacterial dysentery, or cholera. Antimotility agents (loperamide) are strictly contraindicated in children and in patients with bloody diarrhea or high fever.",
    homeopathicApproach:
      "Homeopathic constitutional and acute diarrheal remedies (such as Arsenicum Album, Veratrum Album, Podophyllum Peltatum, China Officinalis, Ipecacuanha, Aloe Socotrina, Mercurius Corrosivus, Croton Tiglium, Chamomilla) serve as supportive care to ease nausea, soothe abdominal cramping, and assist vitality alongside rigorous oral rehydration therapy (ORS) and medical dehydration grading.",
    lifestyleAdvice:
      "Begin sipping low-osmolarity Oral Rehydration Solution (ORS) immediately after every loose stool (in small, frequent sips using a spoon or syringe in children), continue breastfeeding or formula feeding infants without dilution, consume easily digestible bland foods (bananas, rice, applesauce, toast, boiled potatoes, lentils) as tolerated, avoid sugary juices, sodas, and sports drinks (high osmolality exacerbates osmotic diarrhea), practice meticulous handwashing with soap and running water, and disinfect household surfaces.",
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
        question: "Why should commercial sports drinks or sugary sodas be avoided during diarrhea?",
        answer: "Commercial sodas, fruit juices, and energy drinks contain very high concentrations of simple sugars (high osmolality) and very low levels of sodium. In an inflamed intestine, excess undigested sugars draw large amounts of water out of the bloodstream into the bowel lumen, worsening diarrhea and accelerating dehydration."
      },
      {
        question: "Why should antidiarrheal medicines like loperamide (Imodium) NOT be taken for bloody diarrhea?",
        answer: "Loperamide paralyzes intestinal motility. In invasive bacterial infections (like Shigella or E. coli O157:H7), stopping bowel movements traps dangerous bacterial toxins inside the intestines, dramatically increasing the risk of bowel perforation, toxic megacolon, and Hemolytic Uremic Syndrome (HUS)."
      }
    ],
    redFlags: [
      "Severe Hypovolemic Dehydration / Shock: lethargy, unresponsiveness, sunken fontanelle in infants, cold mottled extremities, delayed capillary refill >3 seconds, severe hypotension, unrecordable blood pressure, or absolute anuria for >8–12 hours (life-threatening emergency requiring immediate emergency IV fluid resuscitation)",
      "Hemolytic Uremic Syndrome (HUS): pallor, petechiae/bruising, jaundice, and acute oliguria following an episode of bloody diarrhea (classic complication of Shiga toxin-producing E. coli requiring emergency pediatric nephrology admission and dialysis support)",
      "Toxic Megacolon or Bowel Perforation: severe abdominal distension, severe peritoneal rebound tenderness, high fever, and signs of septic peritonitis",
      "Gross bloody stools (dysentery) with high fever (>38.5°C / 101.3°F) in an infant or immunocompromised patient"
    ]
  },
  claimCitations: [
    { claimId: "D0047-TRADITIONAL-PROFILE", statement: "Homeopathic gastroenteritis profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0047-TRADITIONAL-PROFILE" },
    { claimId: "D0047-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for hypovolemic shock resuscitation, IV fluid repletion, or hemolytic uremic syndrome.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0047-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0047-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for severe dehydration, IV fluid resuscitation, or hemolytic uremic syndrome.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Severe hypovolemic shock with lethargy, prolonged capillary refill, and anuria requiring emergency intravenous fluid boluses",
    "Pallor, petechiae, and acute oliguria indicating Hemolytic Uremic Syndrome (HUS) following bloody diarrhea",
    "Severe abdominal rigidity and toxic megacolon indicating peritonitis requiring emergency surgery"
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
  tags: ["Gastroenteritis", "Infectious Diarrhea", "Food Poisoning", "Disease", "Vomiting", "Dehydration", "ORS", "Gastroenterology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/gastroenteritis",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive infectious enteropathy clinical boundaries, hypovolemic shock red flags, and verified citations"],
  clinicalPearl: "Oral Rehydration Salts (ORS) solution is the single most effective, life-saving intervention for acute gastroenteritis; replace fluid volume loss milliliter-for-milliliter.",
  quickFacts: {
    "Global Impact": "Billions of episodes annually worldwide (leading cause of pediatric morbidity and mortality in developing regions)",
    "Primary System": "Gastrointestinal System (Infectious Gastroenterology / Enterology)",
    "Diagnostic Standard": "Clinical Hydration Assessment (WHO Dehydration Scale) & Stool Multiplex PCR/Culture",
    "Clinical Character": "Acute gastrointestinal mucosal infection characterized by watery diarrhea, vomiting, fever, and dehydration"
  },
  aiReadiness: {
    retrievalSummary: "Acute Gastroenteritis is an infection of the stomach and intestines causing watery diarrhea, vomiting, and abdominal cramps, managed with supportive care, mandatory Oral Rehydration Therapy (ORS), and medical dehydration monitoring.",
    clinicalSummary: "Gastroenteritis pathophysiology involves viral mucosal blunting or bacterial enterotoxin secretion. Homeopathic remedies serve as supportive digestive care and do not replace mandatory Oral Rehydration Salts (ORS), intravenous fluid resuscitation for severe hypovolemic shock, or emergency care for hemolytic uremic syndrome (HUS).",
    patientSummary: "Gastroenteritis (stomach flu or food poisoning) causes watery diarrhea, vomiting, stomach cramps, and dehydration, treated primarily by drinking oral rehydration salts (ORS) in small sips to replace lost fluids and electrolytes.",
    studentSummary: "Norovirus and Rotavirus are leading causes. Fluid resuscitation with low-osmolarity WHO ORS is the cornerstone. Stool PCR/culture indicated for bloody dysentery or severe toxicity. Red flags: severe hypovolemic shock and Hemolytic Uremic Syndrome (HUS).",
    keywords: ["gastroenteritis", "infectious diarrhea", "food poisoning", "stomach flu", "watery diarrhea", "vomiting diarrhea", "ors dehydration"],
    semanticKeywords: ["acute infectious enteropathy", "secretory diarrheal illness", "oral rehydration therapy"],
    icd: "A09",
    mesh: "D005759",
    bodySystem: "Gastroenterology & Infectious Disease",
    urgency: "routine"
  }
};
