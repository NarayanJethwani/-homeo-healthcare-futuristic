import { KnowledgeEntity } from "../../types";

export const HeartburnSymptom: KnowledgeEntity = {
  id: "SYM-heartburn",
  slug: "heartburn",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-06-30T12:00:00Z",
    reviewed: "2026-06-30T12:00:00Z"
  },
  title: {
    en: "Heartburn / Acid Regurgitation",
    hi: "छाती में जलन / खट्टा पानी आना",
    gu: "છાતીમાં બળતરા / એસિડિટી",
    mr: "छातीत जळजळ / आम्लपित्त",
    es: "Acidez / Regurgitación Ácida",
    ar: "حرقة المعدة / الارتجاع الحمضي"
  },
  summary: {
    en: "A burning sensation in the chest, behind the breastbone, often rising towards the throat, caused by stomach acid irritation.",
    hi: "छाती के पीछे होने वाली जलन जो गले की तरफ ऊपर चढ़ती है, यह पेट के एसिड के कारण होती है.",
    gu: "છાતીના વચ્ચેના ભાગમાં બળતરા થવી જે ઘણીવાર ગળા સુધી પહોંચે છે, જે એસિડિટીને કારણે થાય છે.",
    mr: "छातीत जळजळ होणे, जी सहसा घशाकडे वर सरकते, पोटातील आम्लतेमुळे होते.",
    es: "Una sensación de ardor en el pecho, detrás del esternón, que a menudo sube hacia la garganta.",
    ar: "شعور بالحرقان في الصدر، خلف عظم الصدر، وغالبًا ما يرتفع نحو الحلق."
  },
  content: {
    whatItMeans: {
      en: "Heartburn is the primary symptom of gastroesophageal reflux. When stomach acid comes into contact with the sensitive lining of the esophagus, it triggers nerve fibers, resulting in a localized burning sensation.",
      hi: "हार्टबर्न एसिड रिफ्लक्स का प्राथमिक लक्षण है जब पेट का एसिड भोजन नली की नाजुक परत को छूता है.",
      gu: "અન્નનળીમાં એસિડનો સંપર્ક થવાને કારણે બળતરા ઉત્પન્ન થાય છે.",
      mr: "अन्ननलिकेत आम्लाचा संपर्क आल्यामुळे जळजळ होण्याची संवेदना निर्माण होते.",
      es: "La acidez es el síntoma principal del reflujo gastroesofágico.",
      ar: "حرقة المعدة هي العرض الرئيسي لارتجاع المريء عندما يلامس الحمض بطانة المريء."
    },
    whenToConsultDoctor: {
      en: "Consult a healthcare provider immediately if heartburn is accompanied by difficulty swallowing, pain when swallowing, vomiting blood, black stools, or if it feels like crushing chest pain radiating to the arm or jaw (which could represent a myocardial infarction/heart attack).",
      hi: "यदि छाती में बहुत तेज़ दर्द हो जो बांह या जबड़े तक जाए, या निगलने में कठिनाई हो, तो तुरंत डॉक्टर से संपर्क करें.",
      gu: "જો ડાબા હાથમાં કે જડબામાં દુખાવો થાય અથવા ગળવામાં તકલીફ હોય, તો તુરંત ડોક્ટરને બતાવો.",
      mr: "जर छातीत तीव्र दाब जाणवत असेल आणि तो डाव्या हाताकडे पसरत असेल तर तात्काळ हृदयविकाराच्या तपासणीसाठी डॉक्टरांकडे जा.",
      es: "Consulte a un médico si la acidez se acompaña de dificultad para tragar o dolor en el brazo.",
      ar: "استشر الطبيب فورًا إذا كانت حرقة المعدة مصحوبة بصعوبة في البلع أو ألم في الصدر ينتشر إلى الذراع."
    },
    remedyConsiderations: {
      en: "Remedies commonly considered include Nux Vomica (for heartburn after eating heavy or spicy foods), Robinia (for extreme acidity with sour belching and vomiting), and Carbo Vegetabilis (for heartburn accompanied by heavy bloating and gas). Requires consultation with a qualified physician.",
      hi: "नुक्स वोमिका, रोबिनिया और कार्बो वेज जैसी दवाएं उपयोगी मानी जाती हैं. चिकित्सक की सलाह आवश्यक है.",
      gu: "નક્સ વોમિકા અને કાર્બો વેજ જેવી દવાઓનો વિચાર કરવામાં આવે છે. યોગ્ય ડોક્ટરની સલાહ જરૂરી છે.",
      mr: "नक्स व्होमिका आणि कार्बोव्हेज या औषधांचा प्रामुख्याने विचार केला जातो. तज्ज्ञ डॉक्टरांचा सल्ला आवश्यक आहे.",
      es: "Remedios comunes incluyen Nux Vomica y Robinia. Requiere consulta con un médico calificado.",
      ar: "الأدوية الشائعة تشمل نوكس فوميكا وروبينيا. تتطلب استشارة طبيب مؤهل."
    },
    lifestyleDietGuidance: {
      en: "Avoid large meals, fats, mint, chocolate, alcohol, and caffeine. Maintain an upright posture after meals for at least two hours.",
      hi: "अधिक मात्रा में एक बार में भोजन न करें, तली-भुनी चीज़ों और शराब-कैफीन से बचें.",
      gu: "વધારે પડતું એકસાથે જમવું નહીં, ચા-કોફી અને તેલવાળો ખોરાક ટાળવો.",
      mr: "भरपेट जेवणे टाळा, अति स्निग्ध पदार्थ, चहा आणि कॉफी बंद करा.",
      es: "Evite comidas abundantes, grasas, chocolate y cafeína. Mantenga postura erguida tras comer.",
      ar: "تجنب الوجبات الكبيرة والدهون والقهوة. حافظ على وضعية مستقيمة بعد تناول الطعام."
    },
    references: [
      "Gastroesophageal Reflux Symptoms Review - ACG Guidelines, 2022.",
      "Boericke W. Pocket Manual of Homoeopathic Materia Medica. 1901."
    ],
    relatedEntities: ["DIS-gerd", "DIS-ibs", "REM-nux-vomica"]
  },
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Gastroenterology",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Heartburn", "Acid Reflux", "Acidity", "Stomach Pain", "Burning"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/heartburn",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Heartburn symptom profile"]
};
