import { KnowledgeEntity } from "../../types";

export const CbcLabTest: KnowledgeEntity = {
  id: "LAB-cbc",
  slug: "cbc",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-06-30T12:00:00Z",
    reviewed: "2026-06-30T12:00:00Z"
  },
  title: {
    en: "Complete Blood Count (CBC)",
    hi: "कम्प्लीट ब्लड काउंट (सीबीसी)",
    gu: "લોહીની સંપૂર્ણ તપાસ (સીબીસી)",
    mr: "कम्प्लीट ब्लड काऊंट (सीबीसी)",
    es: "Conteo Sanguíneo Completo (Hemograma)",
    ar: "صورة الدم الكاملة (CBC)"
  },
  summary: {
    en: "A standard blood test evaluating overall health and screening for disorders such as anemia, infection, and leukemia.",
    hi: "एक सामान्य रक्त परीक्षण जो स्वास्थ्य की स्थिति और एनीमिया, संक्रमण और ल्यूकेमिया जैसी समस्याओं की जांच करता है.",
    gu: "એક સામાન્ય લોહીની તપાસ જે સ્વાસ્થ્યની સ્થિતિ અને પાંડુરોગ કે કોઈ ચેપની તપાસ કરે છે.",
    mr: "आरोग्याची स्थिती आणि अ‍ॅनिमिया किंवा जंतूसंसर्ग तपासण्यासाठी केली जाणारी रक्ताची प्राथमिक चाचणी.",
    es: "Un análisis de sangre estándar para evaluar la salud general y detectar anemia o infecciones.",
    ar: "اختبار دم قياسي لتقييم الصحة العامة والكشف عن فقر الدم أو العدوى."
  },
  content: {
    whatItMeans: {
      en: "A CBC measures several components of your blood, including Red Blood Cells (carrying oxygen), White Blood Cells (fighting infection), Hemoglobin (oxygen-carrying protein), Hematocrit (proportion of blood cells to plasma), and Platelets (helping blood clot).",
      hi: "सीबीसी रक्त के विभिन्न घटकों जैसे लाल रक्त कोशिकाएं, सफेद रक्त कोशिकाएं, हीमोग्लोबिन और प्लेटलेट्स को मापता है.",
      gu: "આ તપાસ લોહીના વિવિધ ઘટકો જેવા કે રક્તકણો, શ્વેતકણો, હિમોગ્લોબિન અને પ્લેટલેટ્સની ગણતરી કરે છે.",
      mr: "सीबीसी रक्तातील लाल पेशी, पांढऱ्या पेशी, हिमोग्लोबिन आणि प्लेटलेट्स मोजते.",
      es: "El hemograma mide componentes como glóbulos rojos, glóbulos blancos, hemoglobina y plaquetas.",
      ar: "يقيس هذا الاختبار خلايا الدم الحمراء، وخلايا الدم البيضاء، والهيموجلوبين، والصفائح الدموية."
    },
    whenToConsultDoctor: {
      en: "Always discuss your CBC report with a qualified clinician. Significant deviations (such as extremely low platelets or hemoglobin) require immediate medical review to exclude systemic disease.",
      hi: "रिपोर्ट में किसी भी बड़े बदलाव के होने पर तुरंत डॉक्टर से संपर्क करें.",
      gu: "રિપોર્ટમાં વધારે ફેરફાર હોય તો તુરંત ડોક્ટરનો સંપર્ક કરવો.",
      mr: "रिपॉर्टमध्ये अधिक तफावत आढळल्यास त्वरित डॉक्टरांशी संपर्क साधा.",
      es: "Consulte a un médico si los niveles están fuera de los rangos normales.",
      ar: "استشر الطبيب دائمًا لمراجعة تقرير صورة الدم الكاملة الخاص بك."
    },
    remedyConsiderations: {
      en: "While homeopathic remedies do not treat lab values, finding indications of chronic anemia (low RBC) or chronic inflammation (elevated WBC) aids in select constitutional remedies (e.g. Ferrum Metallicum for anemia). Requires consultation with a qualified physician.",
      hi: "होम्योपैथिक उपचार प्रयोगशाला रिपोर्ट के आधार पर नहीं बल्कि रोगी के समग्र लक्षणों के आधार पर व्यक्तिगत रूप से चुने जाते हैं. डॉक्टर की सलाह आवश्यक है.",
      gu: "હોમિયોપેથિક દવાઓ રિપોર્ટના આંકડા સુધારવા માટે નહીં પણ પૂરક બંધારણીય સુધારા માટે અપાય છે. ડોક્ટરની સલાહ જરૂરી છે.",
      mr: "होम्योपैथिक उपचार केवळ रक्ताच्या प्रमाणावर अवलंबून नसून रुग्णाच्या संपूर्ण लक्षणांवर आधारित ठरवले जातात.",
      es: "Los remedios se eligen constitucionalmente, no para tratar valores de laboratorio aislados. Para revisión clínica.",
      ar: "لا يعالج الطب التجانسى قيم التحاليل مباشرة، ولكن معرفة فقر الدم يساعد في اختيار الأدوية الدستورية."
    },
    lifestyleDietGuidance: {
      en: "Maintain a balanced, iron-rich diet containing green leafy vegetables, beans, and lentils. Stay hydrated and avoid smoking to support healthy bone marrow function.",
      hi: "आयरन युक्त आहार लें, हरी पत्तेदार सब्जियां खाएं और धूम्रपान से बचें.",
      gu: "લોહતત્વયુક્ત આહાર લેવો, લીલા પાંદડાવાળા શાકભાजी ખાવા.",
      mr: "लोहयुक्त आहार घ्या, हिरव्या पालेभाज्या खा आणि भरपूर पाणी प्या.",
      es: "Consuma una dieta equilibrada rica en hierro. Manténgase hidratado.",
      ar: "تناول نظامًا غذائيًا متوازنًا غنيًا بالحديد مثل الخضار الورقية."
    },
    references: [
      "Laboratory Medicine Standards - AACC Practice Guidelines, 2021.",
      "Boericke W. Pocket Manual of Homoeopathic Materia Medica. 1901."
    ],
    relatedEntities: ["DIS-gerd", "DIS-eczema"]
  },
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Clinical Pathology & Therapeutics",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Expert-Opinion",
  tags: ["CBC", "Blood Test", "Anemia", "Infection", "Platelets"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/cbc",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of CBC laboratory interpretation guide"]
};
