import { KnowledgeEntity } from "../../types";

export const MigraineEntity: KnowledgeEntity = {
  id: "DIS-migraine",
  slug: "migraine",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-06-30T12:00:00Z",
    reviewed: "2026-06-30T12:00:00Z"
  },
  title: {
    en: "Migraine Headache",
    hi: "माइग्रेन का सिरदर्द",
    gu: "આધાશીશી (માઇગ્રેન)",
    mr: "अर्धशिशी (मायग्रेन)",
    es: "Migraña",
    ar: "الصداع النصفي (الميجريين)"
  },
  summary: {
    en: "A neurological condition marked by moderate to severe throbbing headache attacks, often accompanied by light sensitivity, sound sensitivity, or nausea.",
    hi: "एक न्यूरोलॉजिकल स्थिति जिसमें सिर के एक तरफ तेज़ धड़कन जैसा सिरदर्द होता है, साथ ही मतली या रोशनी-आवाज़ से परेशानी होती है.",
    gu: "એક ન્યુરોલોજીકલ સ્થિતિ જેમાં તીવ્ર માથાનો દુખાવો થાય છે, જે વારંવાર ઉબકા અથવા પ્રકાશ-અવાજની સંવેદનશીલતા સાથે હોય છે.",
    mr: "एक मज्जासंस्थेचा आजार ज्यामध्ये डोक्यात तीव्र ठणक मारल्यासारखे दुखते, सोबत मळमळ आणि प्रकाश-आवाज नकोसा वाटतो.",
    es: "Una condición neurológica caracterizada por dolores de cabeza palpitantes de moderados a severos, a menudo con sensibilidad a la luz y náuseas.",
    ar: "حالة عصبية تتميز بنوبات صداع نابض متوسطة إلى شديدة، وغالبًا ما تكون مصحوبة بحساسية للضوء أو غثيان."
  },
  content: {
    whatItMeans: {
      en: "Migraine is believed to involve cortical spreading depression and activation of the trigeminovascular system, causing release of inflammatory neuropeptides and vasodilation of cranial blood vessels.",
      hi: "माइग्रेन में कपाल की रक्त वाहिकाओं में सूजन और तंत्रिका तंत्र की संवेदनशीलता बढ़ जाती है.",
      gu: "મગજની રક્તવાહિનીઓમાં સોજો આવવાથી આ પ્રકારનો માથાનો દુખાવો થાય છે.",
      mr: "मेंदूच्या रक्तवाहिन्यांमधील बदलांमुळे आणि मज्जासंस्थेच्या अतिसंवेदनशीलतेमुळे मायग्रेनचा त्रास होतो.",
      es: "Se cree que la migraña involucra la depresión cortical propagada y la activación del sistema trigeminovascular.",
      ar: "يُعتقد أن الصداع النصفي ينطوي على تنشيط النظام الثلاثي التوائمي الوعائي في الدماغ."
    },
    commonSymptoms: [
      {
        en: "Unilateral throbbing or pulsating pain",
        hi: "सिर के एक हिस्से में धड़कता हुआ दर्द",
        gu: "માથાના એક ભાગમાં ધબકારા મારતો દુખાવો",
        mr: "डोक्याच्या एका बाजूला ठणक मारल्यासारखे दुखणे",
        es: "Dolor pulsátil unilateral",
        ar: "ألم نابض في جانب واحد من الرأس"
      },
      {
        en: "Photophobia and Phonophobia (sensitivity to light and sound)",
        hi: "रोशनी और आवाज़ से तकलीफ होना",
        gu: "પ્રકાશ અને અવાજથી અગવડતા થવી",
        mr: "उजेड आणि मोठा आवाज सहन न होणे",
        es: "Fotofobia y fonofobia",
        ar: "حساسية شديدة للضوء والصوت"
      }
    ],
    whenToConsultDoctor: {
      en: "Consult a doctor immediately if you experience a sudden, severe headache like a 'thunderclap', or a headache accompanied by fever, stiff neck, mental confusion, seizures, double vision, numbness, or speech difficulty. These can represent medical emergencies.",
      hi: "यदि सिरदर्द अचानक और बहुत तेज़ हो, या साथ में बुखार, गर्दन का अकड़ना, या बोलने में समस्या हो, तो तुरंत आपातकालीन चिकित्सक को दिखाएं.",
      gu: "જો અચાનક ખૂબ જ તીવ્ર માથાનો દુખાવો થાય કે ગરદન અકડાઈ જાય તો તુરંત ડોક્ટરનો સંપર્ક કરો.",
      mr: "अचानक अतिशय तीव्र डोकेदुखी होणे, मानेत ताठरता येणे किंवा बोलण्यास त्रास होणे अशा वेळी तात्काळ डॉक्टरांकडे जा.",
      es: "Consulte a un médico de inmediato si experimenta un dolor de cabeza repentino y severo como un trueno, o acompañado de fiebre y rigidez en el cuello.",
      ar: "استشر الطبيب فورًا إذا شعرت بصداع مفاجئ وشديد للغاية، أو صداع مصحوب بحمى وتصلب في الرقبة."
    },
    conventionalPerspective: {
      en: "Conventional approaches focus on acute relief with triptans or NSAIDs, and preventive therapies using beta-blockers, anticonvulsants, or CGRP inhibitors.",
      hi: "पारंपरिक चिकित्सा में ट्रिप्टान और दर्द निवारक दवाएं तीव्र दर्द में राहत के लिए दी जाती हैं.",
      gu: "પરંપરાગત સારવારમાં પેઇન કિલર્સ અને પ્રિવેન્ટિવ દવાઓ આપવામાં આવે છે.",
      mr: "पारंपारिक उपचारांमध्ये तातडीच्या आरामासाठी वेदनाशामक आणि वेदना रोखण्यासाठी इतर औषधे दिली जातात.",
      es: "Los enfoques convencionales incluyen triptanes y medicamentos preventivos.",
      ar: "يركز الطب التقليدي على مسكنات الألم السريعة والأدوية الوقائية."
    },
    homeopathicPerspective: {
      en: "Homeopathy views migraine as a constitutional susceptibility triggered by emotional stress, hormonal fluctuations, or metabolic changes. Remedial matching focuses on the specific character of pain, lateral side affinity, and modalities.",
      hi: "होम्योपैथी माइग्रेन को मानसिक तनाव या शारीरिक बदलावों से जुड़ी एक संवेदनशीलता के रूप में देखती है और इसका उपचार व्यक्तिगत लक्षणों के आधार पर करती है.",
      gu: "હોમિયોપેથી માઇગ્રેનને માનસિક તણાવ કે હોર્મોનલ ફેરફાર સાથે જોડીને વ્યક્તિગત દવા નક્કી કરે છે.",
      mr: "होम्योपैथीमध्ये डोकेदुखीच्या बाजू, तीव्रतेचे प्रकार आणि मानसिक ताण यांच्या आधारे औषध ठरवले जाते.",
      es: "La homeopatía ve la migraña como una susceptibilidad constitucional provocada por estrés o cambios hormonales.",
      ar: "ينظر الطب التجانسى إلى الصداع النصفي باعتباره حساسية دستورية ناجمة عن الإجهاد أو التغيرات الهرمونية."
    },
    remedyConsiderations: {
      en: "Remedies commonly considered include Belladonna (for sudden, violent throbbing headache with red face, worse light or noise), Bellis Perennis, Spigelia (for left-sided pain settling over the eye), and Sanguinaria (for right-sided headache starting in the neck and spreading to the eye). Requires consultation with a qualified physician.",
      hi: "माइग्रेन के लिए बेलाडोना, स्पाइजेलिया और सेंग्विनेरिया पर विचार किया जाता है. योग्य चिकित्सक का परामर्श आवश्यक है.",
      gu: "બેલાડોના અને સ્પાઇજેલિયા જેવી દવાઓનો વિચાર કરવામાં આવે છે. ડોક્ટરની સલાહ જરૂરી છે.",
      mr: "बेलाडोना, स्पायजेलिया या औषधांचा प्रामुख्याने विचार केला जातो. डॉक्टरांचा सल्ला आवश्यक आहे.",
      es: "Remedios comunes incluyen Belladonna y Spigelia. Requiere consulta con un médico calificado.",
      ar: "الأدوية الشائعة تشمل البلادونا والسبايجيليا. تتطلب استشارة طبيب مؤهل."
    },
    lifestyleDietGuidance: {
      en: "Maintain consistent sleep and meal schedules. Identify and avoid trigger foods (like aged cheese, red wine, chocolate, MSG). Stay hydrated, practice stress management, and rest in a dark, quiet room during an attack.",
      hi: "सोने और जागने का समय निश्चित रखें, चॉकलेट और पनीर जैसी चीज़ों से बचें.",
      gu: "ઊંઘ અને જમવાનો સમય ચોક્કસ રાખવો, ચોકલેટ અને વાસી પનીર ટાળવું.",
      mr: "झोपण्याच्या आणि जेवणाच्या वेळा निश्चित ठेवा, चॉकलेट आणि शिळे अन्न टाळा.",
      es: "Mantenga horarios constantes de sueño y comidas. Identifique y evite desencadenantes como el chocolate o queso maduro.",
      ar: "حافظ على مواعيد نوم ووجبات منتظمة. تجنب الشوكولاتة والأجبان القديمة."
    },
    references: [
      "IHS Classification of Migraine - Cephalagia, 2021.",
      "Allen HC. Keynotes and Characteristics of Leading Remedies. 1899."
    ],
    relatedEntities: ["SYM-headache", "REM-sulphur", "REM-nux-vomica"]
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
  tags: ["Migraine", "Headache", "Neurology", "Pain", "Photophobia"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/migraine",
  readingTimeMinutes: 5,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Migraine education profile"]
};
