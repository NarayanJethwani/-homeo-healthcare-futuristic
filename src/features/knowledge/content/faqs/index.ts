import { KnowledgeEntity } from "../../types";

export const FaqSafetyEntity: KnowledgeEntity = {
  id: "FAQ-safety",
  slug: "safety",
  entityType: "faq",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-07-31T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Homeopathy Safety, Efficacy, and Regulatory Compliance FAQ",
    hi: "होम्योपैथी सुरक्षा, प्रभावकारिता एवं नियामक अनुपालन सामान्य प्रश्न",
    gu: "હોમિયોપેથી સુરક્ષા, ગુણકારીતા અને નિયામક પાલન પ્રશ્નોત્તરી",
    mr: "होम्योपैथी सुरक्षा, प्रभाव आणि नियमन सामान्य प्रश्न",
    es: "Preguntas Frecuentes sobre Seguridad, Eficacia y Cumplimiento Regulatorio en Homeopatía",
    ar: "الأسئلة الشائعة حول سلامة وفعالية والامتثال التنظيمي للطب التجانسى",
  },
  summary: {
    en: "An authoritative guide to homeopathic safety profiles, micro-dilution chemistry, FDA regulatory standards, and strict emergency medicine non-replacement boundaries.",
    hi: "होम्योपैथिक दवाओं की सुरक्षा, सूक्ष्म-डाइल्यूशन रसायन शास्त्र, एफडीए मानकों और आपातकालीन गैर-प्रतिस्थापन सीमाओं की प्रामाणिक जानकारी।",
    gu: "હોમિયોપેથિક સુરક્ષા, માઇક્રો-ડાઇલ્યુશન અને ઇમરજન્સી મેડિસિન નોન-રિપ્લેસમેન્ટ સીમાઓનું માર્ગદર્શન.",
    mr: "होमिओपॅथी सुरक्षा, मायक्रो-डायल्यूशन आणि आणीबाणीच्या औषध नॉन-रिप्लेसमेंट मर्यादा.",
    es: "Una guía autorizada sobre seguridad homeopática, química de microdilución y límites de seguridad regulatorios.",
    ar: "دليل موثوق لمعايير السلامة والموثوقية والتنظيم في الطب التجانسى.",
  },
  content: {
    faqsList: [
      {
        question: {
          en: "Are homeopathic remedies safe for children and infants?",
          hi: "क्या होम्योपैथिक दवाएं बच्चों के लिए सुरक्षित हैं?",
          gu: "શું હોમિયોપેથી બાળકો માટે સુરક્ષિત છે?",
          mr: "होम्योपैथिक औषधे लहान मुलांसाठी सुरक्षित आहेत का?",
          es: "¿Los remedios homeopáticos son seguros para los niños?",
          ar: "هل الأدوية المثلية آمنة للأطفال؟",
        },
        answer: {
          en: "When manufactured under regulated HPUS pharmacopoeia standards and prescribed by qualified healthcare professionals, micro-diluted remedies (6C/30C) carry minimal toxicity risks [FAQ-SAFETY-KEYNOTES, CIT-0024]. However, self-prescribing for severe pediatric illnesses or replacing childhood immunizations is strictly prohibited [FAQ-SAFETY-EMERGENCY-LIMITS, CIT-0023].",
          hi: "एचपीयूएस मानकों के तहत निर्मित और योग्य डॉक्टर द्वारा दी जाने पर डाइल्यूटेड दवाएं न्यूनतम विषाक्तता रखती हैं। हालांकि, गंभीर बाल रोगों में आपातकालीन इलाज का विकल्प नहीं हैं।",
          gu: "નિયંત્રિત HPUS ધોરણો હેઠળ ઉત્પાદિત અને તબીબી માર્ગદર્શનમાં લેવાતી માઇક્રો-ડાઇલ્યુટેડ દવાઓ સુરક્ષિત છે.",
          mr: "योग्य तज्ज्ञांच्या मार्गदर्शनाखाली दिल्यास मायक्रो-डायल्यूटेड औषधे अत्यंत सुरक्षित असतात.",
          es: "Sí, cuando son indicados por un profesional calificado y fabricados bajo normas HPUS reguladas.",
          ar: "نعم، عندما يصفها طبيب متخصص ومصنعة وفقًا لمعايير HPUS المنظمة.",
        },
      },
      {
        question: {
          en: "Can homeopathy replace conventional emergency medicine or antibiotics?",
          hi: "क्या होम्योपैथी आपातकालीन चिकित्सा या एंटीबायोटिक्स का स्थान ले सकती है?",
          gu: "શું હોમિયોપેથી ઇમરજન્સી સારવાર કે એન્ટિબાયોટિક્સનું સ્થાન લઈ શકે?",
          mr: "होम्योपैथी आणीबाणीचे उपचार किंवा प्रतिजैविकांची जागा घेऊ शकते का?",
          es: "¿Puede la homeopatía reemplazar la medicina de emergencia convencional o los antibióticos?",
          ar: "هل يمكن للطب التجانسى أن يحل محل طب الطوارئ التقليدي أو المضادات الحيوية؟",
        },
        answer: {
          en: "No. Homeopathy MUST NOT be used to delay or replace emergency conventional medical treatment for acute life-threatening conditions (such as anaphylaxis, status asthmaticus, acute mechanical bowel obstruction, severe bacterial sepsis, or acute myocardial infarction) [FAQ-SAFETY-EMERGENCY-LIMITS, CIT-0023].",
          hi: "नहीं। गंभीर आपातकालीन स्थितियों (जैसे तीव्र अस्थमा हमला, सेप्सिस, या दिल का दौरा) में होम्योपैथी का उपयोग आपातकालीन एलोपैथिक इलाज में देरी के लिए नहीं किया जाना चाहिए।",
          gu: "ના. ગંભીર ઈમરજન્સી પરિસ્થિતિઓમાં હોમિયોપેથી એલોપેથિક ઈમરજન્સી સારવારનો વિકલ્પ નથી.",
          mr: "नाही. गंभीर आणीबाणीच्या परिस्थितीत एलोपॅथिक उपचारांना विलंब करण्यासाठी होमिओपॅथीचा वापर करू नये.",
          es: "No. La homeopatía NO DEBE usarse para retrasar o reemplazar el tratamiento médico de emergencia convencional.",
          ar: "لا. يجب عدم استخدام الطب التجانسى لتأخير أو استبدال العلاج الطبي التقليدي في حالات الطوارئ الحادة.",
        },
      },
      {
        question: {
          en: "What regulatory oversight governs OTC homeopathic products under the FDA?",
          hi: "एफडीए के तहत ओवर-द-काउंटर होम्योपैथिक उत्पादों का क्या नियामक निरीक्षण है?",
          gu: "FDA હેઠળ OTC હોમિયોપેથિક ઉત્પાદનોનું નિયામક નિયંત્રણ શું છે?",
          mr: "FDA अंतर्गत OTC होमिओपॅथिक उत्पादनांचे नियमन कसे होते?",
          es: "¿Qué supervisión regulatoria rige los productos homeopáticos de venta libre según la FDA?",
          ar: "ما هو الإشراف التنظيمي الذي يحكم المنتجات المثلية المتاحة دون وصفة طبية بموجب إدارة الغذاء والدواء؟",
        },
        answer: {
          en: "Homeopathic products marketed in the United States are subject to FDA enforcement priorities outlined in FDA CPG 400.400 and recent guidance [FAQ-SAFETY-REGULATORY-LIMITS, CIT-0024]. OTC homeopathic products are not FDA-approved drugs for curing serious diseases, and prescription medications should never be stopped without consulting a licensed physician.",
          hi: "अमेरिका में होम्योपैथिक उत्पाद FDA CPG 400.400 प्रवर्तन प्राथमिकताओं के अधीन हैं। OTC उत्पाद गंभीर बीमारियों के इलाज के लिए FDA-स्वीकृत दवाएं नहीं हैं।",
          gu: "યુએસએમાં હોમિયોપેથિક ઉત્પાદનો FDA કાયદાકીય માર્ગદર્શિકાઓ હેઠળ આવે છે અને ગંભીર રોગો માટે FDA-એપ્રોવ્ડ દવાઓ નથી.",
          mr: "FDA CPG 400.400 मार्गदर्शक तत्त्वांनुसार OTC होमिઓपॅथिक उत्पादने गंभीर आजारांवरील FDA-मान्य औषधे नाहीत.",
          es: "Los productos homeopáticos están sujetos a las prioridades de cumplimiento de la FDA bajo CPG 400.400.",
          ar: "تخضع المنتجات المثلية لأولويات إنفاذ إدارة الغذاء والدواء بموجب توجيهات CPG 400.400.",
        },
      },
    ],
    relatedEntities: ["D0001", "D0002", "D0007", "R0001", "R0002", "R0006"],
    references: ["CIT-0023", "CIT-0024"],
    faqs: [
      {
        question: "Is homeopathy chemically safe?",
        answer:
          "Yes, remedies potentized to 6C/30C or higher undergo serial micro-dilution exceeding Avogadro's constant, rendering them chemically non-toxic when prepared under HPUS standards [FAQ-SAFETY-KEYNOTES, CIT-0024].",
      },
      {
        question: "Can patients stop prescription medications when starting homeopathy?",
        answer:
          "No. Prescription pharmaceutical drugs must only be adjusted or discontinued under the direct supervision of the prescribing licensed medical doctor [FAQ-SAFETY-REGULATORY-LIMITS, CIT-0023].",
      },
      {
        question: "What should a patient do during a medical emergency?",
        answer:
          "During an acute life-threatening medical emergency, call emergency services immediately or proceed to the nearest hospital emergency room [FAQ-SAFETY-EMERGENCY-LIMITS].",
      },
    ],
  },
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Clinical Safety & Regulatory Governance",
    institution: "Homeo Healthcare Clinical Board",
  },
  reviewerRole: "Program-owner final clinical authorization",
  lastClinicalReview: "2026-07-31",
  nextClinicalReview: "2027-07-31",
  evidenceLevel: "Expert-Opinion",
  tags: ["Safety", "FAQ", "Efficacy", "Potency", "FDA-Compliance", "Emergency-Limits"],
  canonicalUrl: "https://homeo.healthcare/knowledge/faqs/safety",
  readingTimeMinutes: 5,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial safety FAQ compilation",
    "1.1.0: Upgraded with passage-level claim citations (CIT-0023, CIT-0024), micro-dilution chemistry principles, FDA regulatory enforcement boundaries, and strict emergency medicine non-replacement rules",
  ],
};

export const FAQS = [FaqSafetyEntity];
