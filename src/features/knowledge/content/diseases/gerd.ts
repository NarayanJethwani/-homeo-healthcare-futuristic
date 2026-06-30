import { KnowledgeEntity } from "../../types";

export const GerdEntity: KnowledgeEntity = {
  id: "DIS-gerd",
  slug: "gerd",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-06-30T12:00:00Z",
    reviewed: "2026-06-30T12:00:00Z"
  },
  title: {
    en: "Gastroesophageal Reflux Disease (GERD)",
    hi: "गैस्ट्रोइसोफेगल रिफ्लक्स रोग (जीईआरडी)",
    gu: "ગેસ્ટ્રોએસોફેગલ રિફ્લક્સ રોગ (જીઈઆરડી)",
    mr: "गॅस्ट्रोएसोफेगल रिफ्लक्स रोग (जीईआरडी)",
    es: "Enfermedad por Reflujo Gastroesofágico (ERGE)",
    ar: "مرض الارتجاع المريئي (GERD)"
  },
  summary: {
    en: "A chronic digestive condition where stomach acid flows back into the food pipe, causing retrosternal burning and irritation.",
    hi: "एक पुरानी पाचन स्थिति जहां पेट का एसिड भोजन नली में वापस बहता है, जिससे जलन और असुविधा होती है.",
    gu: "એક ક્રોનિક પાચનની સ્થિતિ જ્યાં પેટમાં રહેલો એસિડ અન્નનળીમાં પાછો વહે છે, જેનાથી બળતરા થાય છે.",
    mr: "एक जुनाट पचनाचा आजार ज्यामध्ये पोटातील आम्ल अन्ननलिकेत परत जाते, ज्यामुळे छातीत जळजळ होते.",
    es: "Una condición digestiva crónica donde el ácido estomacal regresa al esófago, causando acidez y dolor.",
    ar: "حالة هضمية مزمنة حيث يتدفق حمض المعدة مرة أخرى إلى المريء، مما يسبب حرقان وتهيج."
  },
  content: {
    whatItMeans: {
      en: "GERD occurs when the lower esophageal sphincter (LES) weakens or relaxes inappropriately, allowing gastric contents containing acid and pepsin to reflux into the esophagus. This repeatedly irritates the delicate mucosal lining.",
      hi: "जीईआरडी तब होता है जब निचले अन्नप्रणाली का स्फिंक्टर कमजोर हो जाता है, जिससे पेट का एसिड ऊपर नली में चढ़ जाता है.",
      gu: "અન્નનળીનો નીચલો ભાગ નબળો પડતાં ગેસ્ટ્રિક એસિડ ઉપરના ભાગ તરફ વહે છે જેને કારણે આ તકલીફ થાય છે.",
      mr: "जीईआरडी तेव्हा होतो जेव्हा अन्ननलिकेचा खालचा भाग कमकुवत होतो आणि आम्ल वरच्या दिशेने वाहते.",
      es: "El ERGE ocurre cuando el esfínter esofágico inferior se debilita, permitiendo que el ácido suba al esófago.",
      ar: "يحدث مرض الارتجاع المريئي عندما تضعف العضلة العاصرة المريئية السفلى، مما يسمح بارتجاع الحمض."
    },
    commonSymptoms: [
      {
        en: "Heartburn (retrosternal burning feeling)",
        hi: "छाती में जलन",
        gu: "છાતીમાં બળતરા",
        mr: "छातीत जळजळ",
        es: "Acidez estomacal",
        ar: "حرقة المعدة"
      },
      {
        en: "Acid regurgitation or sour taste in the mouth",
        hi: "खट्टा पानी मुंह में आना",
        gu: "મોંમાં ખાટો સ્વાદ આવવો",
        mr: "तोंडात आंबट पाणी येणे",
        es: "Regurgitación ácida",
        ar: "ارتجاع حمضي"
      }
    ],
    whenToConsultDoctor: {
      en: "Seek immediate medical consultation if you experience progressive difficulty swallowing (dysphagia), painful swallowing (odynophagia), unexplained weight loss, vomiting blood, or black tarry stools. These can indicate severe complications like strictures or bleeding.",
      hi: "यदि निगलने में कठिनाई हो, बिना कारण वजन कम हो रहा हो या उल्टी में खून आ रहा हो, तो तुरंत चिकित्सक से संपर्क करें.",
      gu: "જો ગળવામાં તકલીફ થાય કે વજન ઘટવા લાગે તો તુરંત ડોક્ટરનો સંપર્ક કરો.",
      mr: "घास गिळताना त्रास होणे, वजन कमी होणे किंवा उलट्या वाटे रक्त पडणे अशा वेळी तातडीने डॉक्टरांचा सल्ला घ्या.",
      es: "Consulte a un médico inmediatamente si tiene dificultad para tragar, pérdida de peso inexplicable o sangre en el vómito.",
      ar: "استشر الطبيب فورًا إذا كنت تعاني من صعوبة في البلع، أو فقدان الوزن غير المبرر، أو قيء دموي."
    },
    conventionalPerspective: {
      en: "Conventional treatments focus on suppressing acid production using Proton Pump Inhibitors (PPIs) like Omeprazole, H2-receptor antagonists like Famotidine, and recommending weight loss and elevate the head of the bed.",
      hi: "पारंपरिक चिकित्सा में पीपीआई और एसिड कम करने वाली दवाएं जैसे ओमेप्राजोल दी जाती हैं.",
      gu: "પરંપરાગત સારવારમાં પીપીઆઈ દવાઓ આપીને એસિડ બનતો અટકાવવામાં આવે છે.",
      mr: "पारंपारिक उपचारांमध्ये पीपीआय औषधे देऊन आम्ल निर्मिती कमी केली जाते.",
      es: "El tratamiento convencional se enfoca en inhibidores de la bomba de protones (IBP) para reducir el ácido.",
      ar: "يركز العلاج التقليدي على تقليل إنتاج الحمض باستخدام مثبطات مضخة البروتون."
    },
    homeopathicPerspective: {
      en: "Homeopathy views GERD as an expression of constitutional imbalance and gastrointestinal dysmotility. Rather than purely suppressing acid, homeopathic remedies are selected to optimize digestive tone and address underlying triggers.",
      hi: "होम्योपैथी जीईआरडी को आंतरिक असंतुलन के रूप में देखती है और इसका उपचार जड़ से करने का प्रयास करती है.",
      gu: "હોમિયોપેથી જીઈઆરડીને આંતરિક અસંતુલન ગણે છે અને બંધારણીય સારવાર પૂરી પાડે છે.",
      mr: "होम्योपैथी पचनाचे कार्य पूर्ववत करून आम्लतेचे मूळ कारण दूर करण्यावर भर देते.",
      es: "La homeopatía busca restaurar el equilibrio constitucional y mejorar el movimiento gastrointestinal.",
      ar: "ينظر الطب التجانسى إلى الارتجاع المريئي باعتباره تعبيرًا عن عدم توازن في الجسم ويحاول علاجه دستوريًا."
    },
    remedyConsiderations: {
      en: "Remedies commonly considered for clinician review include Nux Vomica (for reflux worse from coffee, stress, or heavy food), Robinia (for intense, continuous burning and sour regurgitation), and Arsenicum Album (for burning relieved by warm drinks). Requires consultation with a qualified physician.",
      hi: "जीईआरडी के लिए सामान्य रूप से नुक्स वोमिका, रोबिनिया और आर्सेनिकम एल्बम पर विचार किया जाता है. योग्य चिकित्सक से परामर्श आवश्यक है.",
      gu: "નક્સ વોમિકા અને રોબિનિયા જેવી દવાઓનો વિચાર કરવામાં આવે છે. ડોક્ટરની સલાહ જરૂરી છે.",
      mr: "नक्स व्होमिका आणि रॉबिनिया या औषधांचा प्रामुख्याने विचार केला जातो. तज्ज्ञ डॉक्टरांचा सल्ला अनिवार्य आहे.",
      es: "Remedios comunes incluyen Nux Vomica y Robinia. Requiere consulta con un médico calificado.",
      ar: "الأدوية الشائعة تشمل نوكس فوميكا وروبينيا. تتطلب استشارة طبيب مؤهل."
    },
    lifestyleDietGuidance: {
      en: "Avoid lying down for 3 hours after meals. Limit trigger foods including caffeine, chocolate, citrus fruits, tomatoes, alcohol, and spicy foods. Eat smaller, more frequent meals, and maintain a healthy weight.",
      hi: "भोजन के तुरंत बाद न लेटें, चाय-कॉफ़ी और तली-भुनी चीज़ों से परहेज़ करें.",
      gu: "જમ્યા પછી તરત સૂવું નહીં, ચા-કોફી અને તેલવાળો ખોરાક ટાળવો.",
      mr: "जेवल्या जेवल्या लगेच झोपू नका. चहा, कॉफी आणि तिखट पदार्थ टाळा.",
      es: "Evite acostarse inmediatamente después de comer. Evite el café, chocolate y alimentos picantes.",
      ar: "تجنب الاستلقاء مباشرة بعد تناول الوجبات. قلل من الكافيين والأطعمة الحارة."
    },
    references: [
      "ACG Clinical Guideline: Guidelines for the Diagnosis and Management of Gastroesophageal Reflux Disease, 2022.",
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
    specialty: "Gastroenterology & Constitutional Medicine",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["GERD", "Acidity", "Reflux", "Heartburn", "Stomach"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/gerd",
  readingTimeMinutes: 5,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Gerd education profile"]
};
