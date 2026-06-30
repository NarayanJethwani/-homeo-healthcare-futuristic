import { KnowledgeEntity } from "../../types";

export const IbsEntity: KnowledgeEntity = {
  id: "DIS-ibs",
  slug: "ibs",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-06-30T12:00:00Z",
    reviewed: "2026-06-30T12:00:00Z"
  },
  title: {
    en: "Irritable Bowel Syndrome (IBS)",
    hi: "इरिटेबल बॉवेल सिंड्रोम (आईबीएस)",
    gu: "ઇરીટેબલ બોવેલ સિન્ડ્રોમ (આઇબીએસ)",
    mr: "इरिटेबल बॉवेल सिंड्रोम (आयबीएस)",
    es: "Síndrome de Intestino Irritable (SII)",
    ar: "متلازمة القولون العصبي (IBS)"
  },
  summary: {
    en: "A common functional gastrointestinal disorder marked by recurrent abdominal pain, cramping, bloating, and altered bowel habits (diarrhea, constipation, or both).",
    hi: "एक सामान्य गैस्ट्रोइंटेस्टाइनल विकार जिसमें पेट में दर्द, मरोड़, सूजन और दस्त या कब्ज की शिकायत रहती है.",
    gu: "એક સામાન્ય પાચનતંત્રની ખામી જેમાં પેટમાં દુખાવો, આફરો અને ઝાડા કે કબજિયાતની તકલીફ થાય છે.",
    mr: "पोटाचा एक सामान्य आजार ज्यामध्ये पोटदुखी, फुगणे आणि वारंवार शौचास जावे लागणे किंवा बद्धकोष्ठता होणे असा त्रास होतो.",
    es: "Un trastorno gastrointestinal funcional común caracterizado por dolor abdominal recurrente, distensión y alteración de los hábitos intestinales.",
    ar: "اضطراب هضمي وظيفي شائع يتميز بألم متكرر في البطن وتشنجات وانتفاخ وتغير في عادات الأمعاء."
  },
  content: {
    whatItMeans: {
      en: "IBS is classified as a disorder of gut-brain interaction. Visceral hypersensitivity, abnormal gut motility, and low-grade inflammation play key roles in producing abdominal cramping and stool irregularities without showing structural damage in the colon.",
      hi: "आईबीएस दिमाग और पेट के आपसी तालमेल में गड़बड़ी के कारण होता है, जिससे पेट की संवेदनशीलता बढ़ जाती है.",
      gu: "મગજ અને આંતરડાના પરસ્પર તાલમેલની ખામીને કારણે આંતરડાની ગતિશીલતા ખોરવાય છે.",
      mr: "मेंदू आणि आतडे यांच्यातील समन्वयाच्या बिघाडामुळे आतड्यांच्या हालचाली अनियमित होतात.",
      es: "El SII se clasifica como un trastorno de la interacción intestino-cerebro.",
      ar: "تُصنف متلازمة القولون العصبي على أنها اضطراب في التفاعل بين الأمعاء والدماغ."
    },
    commonSymptoms: [
      {
        en: "Abdominal cramping and bloating, often relieved by defecation",
        hi: "पेट में मरोड़ और गैस बनना",
        gu: "પેટમાં ચૂંક આવવી અને આફરો ચડવો",
        mr: "पोटात पेटके येणे आणि गॅस होणे",
        es: "Cólicos abdominales y distensión",
        ar: "تشنجات البطن والانتفاخ"
      },
      {
        en: "Altered bowel patterns (constipation or diarrhea)",
        hi: "मल त्याग की आदतों में बदलाव (कब्ज या दस्त)",
        gu: "ઝાડા અથવા કબજિયાતની અનિયમિતતા",
        mr: "बद्धकोष्ठता किंवा जुलाब होणे",
        es: "Hábitos intestinales alterados",
        ar: "تغير في عادات الأمعاء (إسهال أو إمساك)"
      }
    ],
    whenToConsultDoctor: {
      en: "Consult a doctor immediately if you experience weight loss, rectal bleeding, unexplained iron-deficiency anemia, nocturnal diarrhea, persistent vomiting, or symptoms starting after age 50. These are 'red flags' requiring exclusion of structural diseases like Colon Cancer or IBD.",
      hi: "यदि मल के साथ खून आए, वजन कम हो, या रात में दस्त हो, तो तुरंत चिकित्सक से जांच कराएं.",
      gu: "જો લોહી પડે કે વજન ઘટવા લાગે તો તુરંત જ ડોક્ટરનો સંપર્ક કરો.",
      mr: "शौचातून रक्त पडणे, रात्रीच्या वेळी जुलाब होणे किंवा वजन कमी होणे अशा वेळी त्वरित तपासणी करा.",
      es: "Consulte a un médico de inmediato si experimenta pérdida de peso, sangrado rectal o diarrea nocturna.",
      ar: "استشر الطبيب فورًا إذا شعرت بفقدان الوزن، أو نزيف مستقيمي، أو إسهال ليلي."
    },
    conventionalPerspective: {
      en: "Conventional management focuses on symptomatic relief with antispasmodics, laxatives, antidiarrheals, and recommending a low-FODMAP diet.",
      hi: "पारंपरिक चिकित्सा में मरोड़ कम करने वाली दवाएं और दस्त या कब्ज को नियंत्रित करने वाले उपाय शामिल हैं.",
      gu: "પરંપરાગત સારવારમાં આંતરડાની ચૂંક બેસાડવાની દવાઓ અને આહારમાં ફેરફાર સૂચવાય છે.",
      mr: "पारंपारिक उपचारांमध्ये पोटदुखी कमी करणारी औषधे आणि आहारातील बदल सुचवले जातात.",
      es: "El manejo convencional se enfoca en alivio sintomático y dieta baja en FODMAP.",
      ar: "يركز العلاج التقليدي على تخفيف الأعراض واتباع نظام غذائي منخفض الفودماب."
    },
    homeopathicPerspective: {
      en: "Homeopathy addresses the gut-brain axis, targeting visceral hypersensitivity and emotional stress. Constitutional prescribing aims to regulate gut motility and restore healthy digestive functions without causing side effects.",
      hi: "होम्योपैथी पेट और दिमाग के तालमेल को सुधारने और तनाव को कम करने वाली दवाओं से आईबीएस का जड़ से इलाज करती है.",
      gu: "હોમિયોપેથી આંતરડા અને મગજના સંતુલનને સુધારીને વ્યક્તિગત લક્ષણો મુજબ સારવાર આપે છે.",
      mr: "होम्योपैथी पचनसंस्थेचे कार्य सुधारण्यासोबतच ताणतणाव कमी करण्यासाठी मानसिक लक्षणांनुसार औषध ठरवते.",
      es: "La homeopatía aborda el eje intestino-cerebro, tratando la hipersensibilidad visceral.",
      ar: "يعالج الطب التجانسى محور الأمعاء والدماغ، ويستهدف فرط الحساسية الحشوية."
    },
    remedyConsiderations: {
      en: "Remedies commonly considered include Nux Vomica (for cramping with frequent, ineffectual urging to stool), Lycopodium (for marked bloating, flatulence, and constipation), and Argentum Nitricum (for nervous diarrhea triggered by anticipation or anxiety). Requires consultation with a qualified physician.",
      hi: "आईबीएस के लिए नुक्स वोमिका, लाइकोपोडियम और अर्जेंटम नाइट्रिकम पर विचार किया जाता है. डॉक्टर से परामर्श आवश्यक है.",
      gu: "નક્સ વોમિકા અને લાયકોપોડિયમ જેવી દવાઓનો વિચાર કરવામાં આવે છે. ડોક્ટરની સલાહ જરૂરી છે.",
      mr: "नक्स व्होमिका, लायकोपोडियम या औषधांचा प्रामुख्याने विचार केला जातो. तज्ज्ञ डॉक्टरांचा सल्ला आवश्यक आहे.",
      es: "Remedios comunes incluyen Nux Vomica y Lycopodium. Requiere consulta con un médico calificado.",
      ar: "الأدوية الشائعة تشمل نوكس فوميكا ولايكوبوديوم. تتطلب استشارة طبيب مؤهل."
    },
    lifestyleDietGuidance: {
      en: "Follow a structured diet, eating at regular hours. Limit gas-producing foods and consider a low-FODMAP protocol under guidance. Stay hydrated, engage in moderate exercise, and practice relaxation techniques to manage stress.",
      hi: "नियमित समय पर भोजन करें, गैस बनाने वाले खाद्य पदार्थों से बचें और तनाव मुक्त रहें.",
      gu: "નિયમિત સમયે ભોજન કરવું, ગેસ ઉત્પન્ન કરતો ખોરાક ટાળવો અને તણાવમુક્ત રહેવું.",
      mr: "जेवणाच्या वेळा नियमित ठेवा, गॅस वाढवणारे अन्नपदार्थ टाळा आणि मानसिक ताण व्यवस्थापन करा.",
      es: "Siga una dieta estructurada. Limite alimentos productores de gas y reduzca el estrés.",
      ar: "اتبع نظامًا غذائيًا منظمًا. قلل من الأطعمة المسببة للغازات وحاول إدارة الإجهاد."
    },
    references: [
      "Rome IV Diagnostic Criteria for functional GI disorders, 2016.",
      "Boericke W. Pocket Manual of Homoeopathic Materia Medica. 1901."
    ],
    relatedEntities: ["SYM-heartburn", "REM-nux-vomica", "REM-lycopodium"]
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
  tags: ["IBS", "Digestive", "Cramping", "Bloating", "Constipation", "Diarrhea"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/ibs",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of IBS education profile"]
};
