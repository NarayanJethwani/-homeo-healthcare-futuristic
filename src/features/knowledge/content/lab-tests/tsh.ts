import { KnowledgeEntity } from "../../types";

export const TshLabTest: KnowledgeEntity = {
  id: "LAB-tsh",
  slug: "tsh",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-06-30T12:00:00Z",
    reviewed: "2026-06-30T12:00:00Z"
  },
  title: {
    en: "Thyroid Stimulating Hormone (TSH)",
    hi: "थायराइड उत्तेजक हार्मोन (टीएसएच)",
    gu: "થાઇરોઇડ સ્ટીમ્યુલેટીંગ હોર્મોન (ટીએસએચ)",
    mr: "थायरॉईड स्टिम्युलेटिंग हार्मोन (टीएसएच)",
    es: "Hormona Estimulante de la Tiroides (TSH)",
    ar: "الهرمون المنشط للغدة الدرقية (TSH)"
  },
  summary: {
    en: "A key blood test used to screen for and diagnose thyroid disorders, evaluating if the thyroid gland is underactive (hypothyroidism) or overactive (hyperthyroidism).",
    hi: "थायराइड विकारों की जांच करने वाला रक्त परीक्षण, यह देखने के लिए कि थायराइड ग्रंथि ठीक से काम कर रही है या नहीं.",
    gu: "થાઇરોઇડની ખામી તપાસવા માટેની લોહીની મુખ્ય તપાસ.",
    mr: "थायरॉईड ग्रंथीचे कार्य मोजण्यासाठी आणि हायपो किंवा हायपरथायरॉईडीझम ओळखण्यासाठी केली जाणारी रक्ताची चाचणी.",
    es: "Un análisis de sangre clave utilizado para detectar y diagnosticar trastornos de la tiroides.",
    ar: "اختبار دم رئيسي للكشف عن اضطرابات الغدة الدرقية وتشخيصها."
  },
  content: {
    whatItMeans: {
      en: "TSH is produced by the pituitary gland to stimulate the thyroid gland to release T3 and T4 hormones. Elevated TSH indicates that the thyroid is underactive (primary hypothyroidism), whereas low TSH suggests it is overactive.",
      hi: "टीएसएच पिट्यूटरी ग्रंथि द्वारा निर्मित होता है. टीएसएच का स्तर बढ़ना थायराइड ग्रंथि के कम काम करने (हाइपोथायरायडिज्म) का संकेत है.",
      gu: "ટીએસએચ મગજની પીચ્યુટરી ગ્રંથિ દ્વારા બને છે. તે વધવો એ લિવર અથવા થાઈરોઈડની ખામી સૂચવે છે.",
      mr: "टीएसएच हा पिट्यूटरी ग्रंथीद्वारे तयार होतो. टीएसएच पातळी वाढणे म्हणजे थायरॉईड ग्रंथी कमी काम करत आहे.",
      es: "La TSH es producida por la glándula pituitaria para estimular la tiroides.",
      ar: "ينتج الهرمون المنشط للغدة الدرقية من الغدة النخامية لتحفيز الغدة الدرقية."
    },
    whenToConsultDoctor: {
      en: "Always consult an endocrinologist or physician if your TSH is outside reference bounds. Extreme values can affect cardiac rhythm, bone density, and pregnancy outcomes.",
      hi: "टीएसएच स्तर में उतार-चढ़ाव होने पर डॉक्टर से परामर्श लें.",
      gu: "રિપોર્ટમાં તકલીફ હોય તો યોગ્ય ડોક્ટરની સલાહ તુરંત લેવી.",
      mr: "टीएसएच पातळी जास्त किंवा कमी आढळल्यास त्वरित डॉक्टरांशी संपर्क साधा.",
      es: "Consulte a un endocrinólogo si los niveles de TSH están fuera del rango normal.",
      ar: "استشر طبيب الغدد الصماء دائمًا إذا كانت قيم TSH خارج النطاق المرجعي."
    },
    remedyConsiderations: {
      en: "Homeopathic care targets the neuro-endocrine axis and systemic susceptibility. Constitutional remedies (like Calcarea Carbonica or Thyroidinum) are selected based on patient symptoms, thermal state, and mental profiles. Requires consultation with a qualified physician.",
      hi: "होम्योपैथी शरीर के हार्मोनल असंतुलन को प्राकृतिक रूप से ठीक करने में सहायक दवाएं प्रदान करती है. डॉक्टर की सलाह आवश्यक है.",
      gu: "હોમિયોપેથિક દવાઓ હોર્મોનલ અસંતુલનને સંતુલિત કરવામાં મદદરૂપ બને છે. ડોક્ટરની સલાહ જરૂરી છે.",
      mr: "होम्योपैथीमध्ये शरीरातील हार्मोन्सचे संतुलन नैसर्गिकरीत्या सुधारण्यासाठी औषध दिले जाते.",
      es: "El cuidado homeopático se enfoca en el eje neuroendocrino y la susceptibilidad constitucional. Para revisión clínica.",
      ar: "تستهدف الرعاية المثلية المحور العصبي الصماوي لمساعدة الغدة الدرقية."
    },
    lifestyleDietGuidance: {
      en: "Ensure adequate iodine intake if iodine-deficiency is present. Limit raw goitrogenic foods (such as uncooked cabbage, kale, broccoli) and maintain consistent exercise schedules.",
      hi: "आहार में आयोडीन का ध्यान रखें, कच्ची गोभी और ब्रोकोली खाने से बचें.",
      gu: "આયોડિનયુક્ત આહાર લેવો, કાચી કોબીજ અથવા બ્રોકોલી ખાવાનું ટાળવું.",
      mr: "योग्य प्रमाणात आयोडीन घ्या, कोबी किंवा ब्रोकोली कच्चे खाणे टाळा.",
      es: "Asegure un consumo adecuado de yodo. Limite las verduras crucíferas crudas.",
      ar: "تأكد من تناول اليود الكافي وقلل من الأطعمة النيئة مثل الكرنب."
    },
    references: [
      "Thyroid Function Guidelines - American Thyroid Association, 2020.",
      "Boericke W. Pocket Manual of Homoeopathic Materia Medica. 1901."
    ],
    relatedEntities: ["DIS-eczema", "DIS-migraine"]
  },
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Clinical Pathology & Endocrinology",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Level-B",
  tags: ["TSH", "Thyroid", "Hypothyroidism", "Hormones", "Blood Test"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/tsh",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of TSH laboratory interpretation guide"]
};
