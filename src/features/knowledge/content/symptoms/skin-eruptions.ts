import { KnowledgeEntity } from "../../types";

export const SkinEruptionsSymptom: KnowledgeEntity = {
  id: "SYM-skin-eruptions",
  slug: "skin-eruptions",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-06-30T12:00:00Z",
    reviewed: "2026-06-30T12:00:00Z"
  },
  title: {
    en: "Skin Eruptions and Eczematous Rashes",
    hi: "त्वचा पर चकत्ते और खुजली वाली फुंसियां",
    gu: "ચામડી પર ફોલ્લીઓ અને ખંજવાળ",
    mr: "त्वचेवर उठणारी पुरळ आणि खाज",
    es: "Erupciones Cutáneas y Eczema",
    ar: "الطفح الجلدي والتهابات الجلد"
  },
  summary: {
    en: "Visual changes in the skin texture, color, or integrity, presenting as dry, scaly, vesicular, or papular lesions.",
    hi: "त्वचा की बनावट या रंग में बदलाव जो सूखी, पपड़ीदार या पानी भरी फुंसियों के रूप में दिखते हैं.",
    gu: "ત્વચાના રંગ અથવા બંધારણમાં ફેરફાર જે શુષ્ક, ભીની ફોલ્લીઓ કે ખંજવાળ સ્વરૂપે દેખાય છે.",
    mr: "त्वचेचा रंग किंवा रचनेत होणारे बदल जे कोरड्या किंवा पाण्याच्या पुरळ स्वरूपात दिसतात.",
    es: "Cambios visibles en la textura o color de la piel, presentándose como lesiones secas o escamosas.",
    ar: "تغيرات مرئية في ملمس الجلد أو لونه، وتظهر على شكل آفات جافة أو متقشرة."
  },
  content: {
    whatItMeans: {
      en: "Skin eruptions occur due to localized dermal or epidermal inflammation. The skin immune cells respond to internal triggers or external contact allergens, causing vascular dilation (redness) and fluid accumulation (vesicles).",
      hi: "त्वचा की परत में सूजन के कारण लालिमा और पानी भरी फुंसियां निकलती हैं.",
      gu: "ત્વચાના કોષોમાં સોજો આવવાને લીધेत દાદર કે ખંજવાળ ઉત્પન્ન થાય છે.",
      mr: "त्वचेच्या पेशींना सूज आल्यामुळे लालसरपणा आणि पुरळ निर्माण होते.",
      es: "Las erupciones cutáneas ocurren debido a una inflamación dérmica o epidérmica localizada.",
      ar: "يحدث الطفح الجلدي بسبب التهاب موضعي في الجلد."
    },
    whenToConsultDoctor: {
      en: "Seek professional medical help if the skin eruption spreads rapidly, is accompanied by high fever, severe pain, yellow discharge, or is located near the eyes. These can represent cellulitis or severe herpes zoster infections.",
      hi: "यदि चकत्ते तेज़ी से फैलें, तेज बुखार हो या आँखों के पास हो, तो तुरंत चिकित्सक को दिखाएं.",
      gu: "જો ખંજવાળ કે સોજો આંખની નજીક હોય અથવા તાવ હોય, તો તુરંત ડોક્ટરનો સંપર્ક કરો.",
      mr: "जर पुरळ झपाट्याने पसरत असेल, सोबत ताप असेल किंवा डोळ्यांच्या जवळ असेल तर तात्काळ डॉक्टरांना दाखवा.",
      es: "Consulte a un médico si la erupción se extiende rápidamente o se acompaña de fiebre.",
      ar: "استشر الطبيب فورًا إذا انتشر الطفح الجلدي بسرعة، أو كان مصحوبًا بحمى شديدة."
    },
    remedyConsiderations: {
      en: "Remedies commonly considered include Sulphur (for dry, scaling eruptions with intense burning, worse from warmth and washing), Graphites (for dry, cracked patches oozing honey-like sticky fluid), and Apis Mellifica (for puffy, red eruptions with stinging pain relieved by cold). Requires consultation with a qualified physician.",
      hi: "सल्फर, ग्रेफाइटिस और एपिस मेलिफिका जैसी दवाओं पर विचार किया जाता है. योग्य डॉक्टर की सलाह आवश्यक है.",
      gu: "સલ્ફર અને ગ્રેફાઈટીસ જેવી દવાઓનો વિચાર કરાય છે. ડોક્ટરની સલાહ જરૂરી છે.",
      mr: "सल्फर आणि ग्रेफायटिस या औषधांचा प्रामुख्याने विचार केला जातो. तज्ज्ञ डॉक्टरांचा सल्ला आवश्यक आहे.",
      es: "Remedios comunes incluyen Sulphur y Graphites. Requiere consulta con un médico calificado.",
      ar: "الأدوية الشائعة تشمل الكبريت والجرافيت. تتطلب استشارة طبيب مؤهل."
    },
    lifestyleDietGuidance: {
      en: "Avoid scrubbing the lesions. Apply cold compresses to relieve intense burning. Keep the skin moisturized with natural, unscented emollients.",
      hi: "त्वचा को रगड़ें नहीं, जलन शांत करने के लिए ठंडी सिकाई करें और नारियल तेल लगाएं.",
      gu: "ચામડીને ઘસવી નહીં, બળતરા શાંત કરવા ઠંડક આપવી અને મોઈશ્ચરાઈઝર લગાવવું.",
      mr: "त्वचा खाजवू नका, जळजळ कमी करण्यासाठी थंड पाण्याच्या पट्ट्या वापरा आणि मऊ कपडे वापरा.",
      es: "Evite frotar las lesiones. Aplique compresas frías para calmar el ardor.",
      ar: "تجنب حك الآفات. ضع كمادات باردة لتخفيف الحرقان الشديد."
    },
    references: [
      "Dermatology Practice Review - Fitzpatrick's Dermatology, 2019.",
      "Kent JT. Lectures on Homoeopathic Materia Medica. 1905."
    ],
    relatedEntities: ["DIS-eczema", "REM-sulphur", "REM-lycopodium"]
  },
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Dermatology",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Clinical-Experience",
  tags: ["Skin Eruptions", "Rash", "Itching", "Eczema", "Graphites"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/skin-eruptions",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Skin Eruptions symptom profile"]
};
