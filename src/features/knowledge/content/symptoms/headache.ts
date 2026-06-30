import { KnowledgeEntity } from "../../types";

export const HeadacheSymptom: KnowledgeEntity = {
  id: "SYM-headache",
  slug: "headache",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-06-30T12:00:00Z",
    reviewed: "2026-06-30T12:00:00Z"
  },
  title: {
    en: "Headache (Cephalgia)",
    hi: "सिरदर्द",
    gu: "માથાનો દુખાવો",
    mr: "डोकेदुखी",
    es: "Dolor de Cabeza / Cefalea",
    ar: "الصداع / ألم الرأس"
  },
  summary: {
    en: "Pain in any region of the head, presenting as sharp, throbbing, dull, or band-like compression.",
    hi: "सिर के किसी भी हिस्से में होने वाला दर्द जो धड़कता हुआ, तेज या दबाने जैसा महसूस हो सकता है.",
    gu: "માથાના કોઈપણ ભાગમાં થતો દુખાવો જે તીવ્ર, ધબકારા મારતો કે અકળામણ આપનારો હોઈ શકે છે.",
    mr: "डोक्याच्या कोणत्याही भागात होणारी वेदना जी ठणकणारी किंवा जड वाटणारी असू शकते.",
    es: "Dolor en cualquier región de la cabeza, presentándose como punzante o sordo.",
    ar: "ألم في أي منطقة من الرأس، ويظهر على شكل ألم حاد أو نابض أو ضاغط."
  },
  content: {
    whatItMeans: {
      en: "Headaches are classified into primary (such as tension-type, cluster, or migraine) and secondary (due to underlying pathology). Activation of pain-sensitive structures like meninges, cranial nerves, and muscles triggers the pain signal.",
      hi: "सिरदर्द दो प्रकार के होते हैं: प्राथमिक (तनाव, माइग्रेन) और माध्यमिक (किसी अन्य बीमारी के कारण).",
      gu: "માથાનો દુખાવો પ્રાથમિક (તણાવ, આધાશીશી) અથવા સેકન્ડરી (બીજી બીમારીના લક્ષણ રૂપે) હોઈ શકે છે.",
      mr: "डोकेदुखीचे मुख्य प्रकार म्हणजे प्रायमरी (ताणतणाव, मायग्रेन) आणि सेकंडरी (इतर आजारांमुळे होणारी).",
      es: "Los dolores de cabeza se clasifican en primarios y secundarios.",
      ar: "يصنف الصداع إلى أولي وثانوي، وينتج عن تنشيط الهياكل الحساسة للألم في الرأس."
    },
    whenToConsultDoctor: {
      en: "Seek emergency care immediately if you experience a sudden 'thunderclap' headache, or a headache associated with fever, stiff neck, seizures, mental confusion, double vision, numbness, or weakness in limbs.",
      hi: "यदि अचानक असहनीय दर्द हो, या गर्दन में अकड़न और तेज़ बुखार हो, तो तुरंत अस्पताल जाएं.",
      gu: "જો અચાનક અસહ્ય દુખાવો થાય અથવા તાવ અને ગરદન જકડાઈ જાય તો તાત્કાલિક હોસ્પિટલ જવું.",
      mr: "मानेत ताठरता येणे, जोडीला ताप असणे किंवा अचानक अतिशय तीव्र डोकेदुखी होणे अशा वेळी तात्काळ डॉक्टरांकडे जा.",
      es: "Busque atención de emergencia si tiene un dolor de cabeza repentino tipo 'trueno' o rigidez en el cuello.",
      ar: "استشر الطبيب فورًا إذا شعرت بصداع مفاجئ وشديد للغاية، أو صداع مصحوب بتصلب في الرقبة."
    },
    remedyConsiderations: {
      en: "Remedies commonly considered include Belladonna (for sudden, congestive headache with throbbing pain, worse light and noise), Nux Vomica (for headache due to stress or gastric reflux), and Gelsemium (for dull, heavy headache starting in the neck with droopy eyes). Requires consultation with a qualified physician.",
      hi: "बेलाडोना, नक्स वोमिका और जेलसीमियम जैसी दवाओं पर विचार किया जाता है. डॉक्टर की सलाह आवश्यक है.",
      gu: "બેલાડોના અને જેલસેમિયમ જેવી દવાઓ વિચારવામાં આવે છે. યોગ્ય ડોક્ટરની સલાહ જરૂરી છે.",
      mr: "बेलाडोना, नक्स व्होमिका आणि जेलसेमियम या औषधांचा प्रामुख्याने विचार केला जातो. तज्ज्ञ डॉक्टरांचा सल्ला आवश्यक आहे.",
      es: "Remedios comunes incluyen Belladonna y Gelsemium. Requiere consulta con un médico calificado.",
      ar: "الأدوية الشائعة تشمل البلادونا والجيلسيميوم. تتطلب استشارة طبيب مؤهل."
    },
    lifestyleDietGuidance: {
      en: "Stay hydrated, maintain consistent sleep patterns, avoid skipping meals, and manage eye strain by taking breaks from screens.",
      hi: "पर्याप्त मात्रा में पानी पीएं, समय पर सोएं और मोबाइल-लैपटॉप स्क्रीन से दूरी बनाएं.",
      gu: "પૂરતું પાણી પીવું, નિયમિત ઊંઘ લેવી અને સ્ક્રીન ટાઈમ ઓછો કરવો.",
      mr: "भरपूर पाणी प्या, झोप व्यवस्थित घ्या आणि सतत मोबाईल किंवा स्क्रीनकडे पाहणे टाळा.",
      es: "Manténgase hidratado, duerma bien y evite saltarse comidas.",
      ar: "حافظ على رطوبة جسمك، ونم بشكل منتظم، وتجنب إجهاد العين من الشاشات."
    },
    references: [
      "Headache Disorders Review - World Health Organization, 2020.",
      "Allen HC. Keynotes and Characteristics of Leading Remedies. 1899."
    ],
    relatedEntities: ["DIS-migraine", "REM-sulphur", "REM-nux-vomica"]
  },
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Neurology",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Headache", "Pain", "Cephalgia", "Belladonna", "Tension Headache"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/headache",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Headache symptom profile"]
};
