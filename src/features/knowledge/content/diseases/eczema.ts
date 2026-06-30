import { KnowledgeEntity } from "../../types";

export const EczemaEntity: KnowledgeEntity = {
  id: "DIS-eczema",
  slug: "eczema",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-06-30T12:00:00Z",
    reviewed: "2026-06-30T12:00:00Z"
  },
  title: {
    en: "Atopic Dermatitis (Eczema)",
    hi: "एटोपिक डर्मेटाइटिस (एक्जिमा)",
    gu: "એટોપિક ડર્મેટાઇટિસ (એકઝીમા)",
    mr: "एटोपिक डर्मेटायटिस (एक्झिमा)",
    es: "Dermatitis Atópica (Eczema)",
    ar: "التهاب الجلد التأتبي (الإكزيما)"
  },
  summary: {
    en: "An inflammatory chronic skin disorder characterized by dry, red, intensely itchy skin eruptions.",
    hi: "त्वचा में सूजन का एक पुराना विकार जिसमें सूखी, लाल और बहुत खुजली वाली फुंसियां होती हैं.",
    gu: "ચામડીની ક્રોનિક બળતરા, જેમાં શુષ્ક, લાલ અને ખૂબ ખંજવાળ આવતી ફોલ્લીઓ થાય છે.",
    mr: "त्वचेचा एक जुनाट दाहक आजार ज्यामध्ये कोरडी, लाल आणि तीव्र खाज सुटणारी पुरळ येते.",
    es: "Un trastorno inflamatorio crónico de la piel caracterizado por piel seca, roja y con picazón intensa.",
    ar: "اضطراب جلدي مزمن يتميز بالجلد الجاف والأحمر والحكة الشديدة."
  },
  content: {
    whatItMeans: {
      en: "Eczema is a skin barrier dysfunction linked to immune system dysregulation. Flaws in the skin barrier allow moisture to escape and environmental irritants to penetrate, leading to localized inflammation.",
      hi: "एक्जिमा त्वचा की सुरक्षात्मक परत के कमजोर होने के कारण होता है, जिससे बाहरी तत्व त्वचा में जलन पैदा करते हैं.",
      gu: "ત્વચાના સુરક્ષા કવચમાં ખામી આવવાથી ભેજ ઓછો થાય છે અને ખંજવાળ શરૂ થાય છે.",
      mr: "त्वचेचा संरक्षक थर कमकुवत झाल्यामुळे बाहेरून संसर्ग होण्याची शक्यता वाढते.",
      es: "El eczema es una disfunción de la barrera cutánea ligada a una desregulación del sistema inmunitario.",
      ar: "الإكزيما هي خلل في حاجز الجلد مرتبط بخلل في تنظيم الجهاز المناعي."
    },
    commonSymptoms: [
      {
        en: "Pruritus (intense itching, often worse at night)",
        hi: "तीव्र खुजली",
        gu: "ખૂબ ખંજવાળ આવવી",
        mr: "तीव्र खाज सुटणे",
        es: "Prurito (picazón intensa)",
        ar: "حكة شديدة"
      },
      {
        en: "Erythema (red to brownish-gray patches)",
        hi: "लाल चकत्ते",
        gu: "લાલ ધાબા પડવા",
        mr: "लालसर चट्टे पडणे",
        es: "Eritema (parches rojos)",
        ar: "احمرار الجلد"
      }
    ],
    whenToConsultDoctor: {
      en: "Seek urgent care if you notice yellow crusting, pus-filled blisters, streaks, or rapid spread of redness, which indicate secondary bacterial infection (like Staphylococcus) or viral infection (Eczema Herpeticum).",
      hi: "यदि त्वचा पर पीली पपड़ी, मवाद या बहुत तेज़ लालिमा दिखे, तो तुरंत डॉक्टर से संपर्क करें.",
      gu: "જો પીળી પોપડી કે પરુ થાય, તો તુરંત ડોક્ટરનો સંપર્ક કરો.",
      mr: "त्वचेवर पिवळसर खपली किंवा पू दिसल्यास त्वरित डॉक्टरांशी संपर्क साधा.",
      es: "Consulte a un médico de inmediato si nota costras amarillas, pus o propagación rápida de enrojecimiento.",
      ar: "استشر الطبيب فورًا إذا لاحظت وجود قشور صفراء أو صديد أو انتشار سريع للاحمرار."
    },
    conventionalPerspective: {
      en: "Conventional treatments involve topical corticosteroids to suppress inflammation, antihistamines for itching, and barrier repair moisturizers.",
      hi: "पारंपरिक चिकित्सा में कॉर्टिकोस्टेरॉइड क्रीम और एंटीहिस्टामिन दवाएं शामिल हैं.",
      gu: "પરંપરાગત સારવારમાં સ્ટીરોઈડ ક્રીમ અને મોઈશ્ચરાઈઝર વાપરવામાં આવે છે.",
      mr: "पारंपारिक उपचारांमध्ये स्टिरॉइड क्रीम आणि खाज कमी करणारी औषधे दिली जातात.",
      es: "El tratamiento convencional incluye corticosteroides tópicos y cremas hidratantes.",
      ar: "يشمل العلاج التقليدي الكورتيكوستيرويدات الموضعية ومضادات الهيستامين."
    },
    homeopathicPerspective: {
      en: "Homeopathy considers eczema an external expression of internal systemic inflammation (often linked to the psoric miasm). Topical suppressive creams are discouraged, as constitutional remedies aim to heal the skin barrier from within.",
      hi: "होम्योपैथी त्वचा पर किसी भी बाहरी क्रीम से दबाने का विरोध करती है और इसका उपचार अंदरूनी तौर पर करती है.",
      gu: "હોમિયોપેથી ચામડી પર ક્રીમ લગાવી દબાવવાનો વિરોધ કરે છે અને આંતરિક સારવાર આપે છે.",
      mr: "होम्योपैथीमध्ये मलम लावून पुरळ दाबण्याचा विरोध केला जातो आणि आजारावर मूळ औषध दिले जाते.",
      es: "La homeopatía considera el eczema como una expresión externa de inflamación interna.",
      ar: "تعتبر المعالجة المثلية الإكزيما تعبيرًا خارجيًا عن التهاب داخلي وتتجنب الكريمات المثبطة."
    },
    remedyConsiderations: {
      en: "Remedies commonly considered include Sulphur (for dry, red, itchy skin worse from washing and warmth of bed), Graphites (for thick, cracked skin oozing a sticky, honey-like fluid), and Mezereum (for intense itching with thick crusts). Requires consultation with a qualified physician.",
      hi: "एक्जिमा के लिए सल्फर, ग्रेफाइटिस और मेजेरियम पर विचार किया जाता है. डॉक्टर की सलाह आवश्यक है.",
      gu: "સલ્ફર અને ગ્રેફાઈટીસ જેવી દવાઓ વિચારવામાં આવે છે. યોગ્ય ડોક્ટરની સલાह જરૂરી છે.",
      mr: "सल्फर आणि ग्रेफायटिस या औषधांचा प्रामुख्याने विचार केला जातो. डॉक्टरांचा सल्ला आवश्यक आहे.",
      es: "Remedios comunes incluyen Sulphur y Graphites. Requiere consulta con un médico calificado.",
      ar: "الأدوية الشائعة تشمل الكبريت والجرافيت. تتطلب استشارة طبيب مؤهل."
    },
    lifestyleDietGuidance: {
      en: "Keep skin well-lubricated with natural, fragrance-free emollient creams immediately after bathing. Use lukewarm water for showers, wear soft cotton clothing, and avoid harsh detergents or soaps.",
      hi: "त्वचा को हमेशा मॉइश्चराइज रखें, गुनगुने पानी से नहाएं और सूती कपड़े पहनें.",
      gu: "ત્વચાને ભેજયુક્ત રાખવી, નવશેકા પાણીથી સ્નાન કરવું અને સુતરાઉ કપડાં પહેરવા.",
      mr: "त्वचा नेहमी ओलसर ठेवा, कोमट पाण्याने आंघोळ करा आणि सुती कपडे वापरा.",
      es: "Mantenga la piel hidratada con cremas sin fragancia. Use agua tibia y ropa de algodón.",
      ar: "حافظ على رطوبة الجلد بكريمات خالية من العطور. استخدم الماء الفاتر واستخدم الملابس القطنية."
    },
    references: [
      "Eczema guidelines - American Academy of Dermatology, 2023.",
      "Kent JT. Lectures on Homoeopathic Materia Medica. 1905."
    ],
    relatedEntities: ["SYM-skin-eruptions", "REM-sulphur", "REM-lycopodium"]
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
  tags: ["Eczema", "Skin", "Dermatitis", "Pruritus", "Itching"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/eczema",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Eczema education profile"]
};
