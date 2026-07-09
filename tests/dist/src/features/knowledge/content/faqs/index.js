"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FAQS = exports.FaqSafetyEntity = void 0;
exports.FaqSafetyEntity = {
    id: "FAQ-safety",
    slug: "safety",
    entityType: "faq",
    editorialStatus: "published",
    versionInfo: {
        version: "1.0.0",
        created: "2026-06-30T12:00:00Z",
        updated: "2026-06-30T12:00:00Z",
        reviewed: "2026-06-30T12:00:00Z"
    },
    title: {
        en: "Homeopathy Safety and Efficacy FAQ",
        hi: "होम्योपैथी सुरक्षा और प्रभावकारिता सामान्य प्रश्न",
        gu: "હોમિયોપેથી સુરક્ષા અને ગુણકારીતા પ્રશ્નોત્તરી",
        mr: "होम्योपैथी सुरक्षा आणि प्रभाव सामान्य प्रश्न",
        es: "Preguntas Frecuentes sobre Seguridad en Homeopatía",
        ar: "الأسئلة الشائعة حول سلامة وفعالية الطب التجانسى"
    },
    summary: {
        en: "Frequently asked questions regarding the safety profiles, dilution standards, and clinical efficacy of homeopathic remedies.",
        hi: "होम्योपैथिक दवाओं की सुरक्षा, डाइल्यूशन और प्रभावकारिता के बारे में अक्सर पूछे जाने वाले प्रश्न.",
        gu: "હોમિયોપેથિક દવાઓની સુરક્ષા, પોટેન્સી અને તેના ફાયદાઓ અંગે વારંવાર પુછાતા પ્રશ્નો.",
        mr: "होम्योपैथिक औषधांचे दुष्परिणाम, प्रमाण आणि गुण याविषयी वारंवार विचारले जाणारे प्रश्न.",
        es: "Preguntas frecuentes sobre la seguridad y eficacia clínica de los remedios homeopáticos.",
        ar: "الأسئلة الشائعة المتعلقة بسلامة وموثوقية الأدوية المثلية."
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
                    ar: "هل الأدوية المثلية آمنة للأطفال؟"
                },
                answer: {
                    en: "Yes, when prescribed by a qualified homeopath, remedies are prepared using ultra-dilute potencies and do not carry toxic side effects. However, always seek professional consultation rather than self-medicating.",
                    hi: "हाँ, अनुभवी डॉक्टर द्वारा दी जाने पर यह अत्यंत सुरक्षित हैं क्योंकि इनका डाइल्यूशन बहुत सूक्ष्म होता है.",
                    gu: "હા, યોગ્ય ડોક્ટરની દેખરેખમાં અપાતી દવાઓ બાળકની પ્રકૃતિ મુજબ હોવાથી અત્યંત સુરક્ષિત છે.",
                    mr: "होय, तज्ज्ञ डॉक्टरांच्या मार्गदर्शनाखाली दिल्यास ही औषधे पूर्णपणे सुरक्षित आणि दुष्परिणामरहित असतात.",
                    es: "Sí, cuando son indicados por un homeópata calificado, ya que se preparan en potencias ultra diluidas.",
                    ar: "نعم، عندما يصفها طبيب متمرس، فإنها تكون آمنة تمامًا ولا تسبب آثارًا جانبية سامة."
                }
            },
            {
                question: {
                    en: "Can homeopathy be taken alongside conventional medications?",
                    hi: "क्या होम्योपैथी को पारंपरिक एलोपैथिक दवाओं के साथ लिया जा सकता है?",
                    gu: "શું હોમિયોપેથી અન્ય એલોપેથિક દવાઓ સાથે લઈ શકાય?",
                    mr: "होम्योपैथी इतर एलोपॅथिक औषधांसोबत घेता येते का?",
                    es: "¿Se puede tomar homeopatía junto con medicamentos convencionales?",
                    ar: "هل يمكن تناول الطب التجانسى إلى جانب الأدوية التقليدية؟"
                },
                answer: {
                    en: "In most cases, yes. Homeopathic remedies operate on micro-doses and do not interfere biochemically with conventional pharmaceutical drugs. However, keep both your prescribing physician and homeopath informed of all therapies.",
                    hi: "हाँ, अधिकांश मामलों में लिया जा सकता है क्योंकि होम्योपैथिक दवाएं जैव-रासायनिक रूप से हस्तक्षेप नहीं करती हैं.",
                    gu: "હા, મોટાભાગના કેસોમાં લઈ શકાય છે કારણ કે બંને પદ્ધતિઓની કાર્યશૈલી અલગ છે. ડોક્ટરને માહિતગાર રાખવા.",
                    mr: "होय, बहुतांश वेळा घेता येते, कारण दोन्ही औषधांची कार्यपद्धती भिन्न असते. डॉक्टरांना पूर्वकल्पना द्यावी.",
                    es: "En la mayoría de los casos sí. Los remedios homeopáticos no interfieren bioquímicamente.",
                    ar: "نعم في معظم الحالات. لا تتدخل الأدوية المثلية كيميائيًا مع الأدوية التقليدية."
                }
            }
        ],
        relatedEntities: ["DIS-gerd", "DIS-eczema"],
        references: ["CIT-0004", "CIT-0005"],
        faqs: [
            {
                question: "Is homeopathy safe?",
                answer: "Yes, individualized homeopathy using ultra-dilute potencies is considered safe when under professional guidance."
            },
            {
                question: "How long does treatment take?",
                answer: "Chronic conditions require constitutional analysis, often showing gradual improvement over several weeks to months."
            },
            {
                question: "Are there any food restrictions?",
                answer: "It is recommended to avoid strong aromatic substances like raw garlic, onions, or camphor close to taking remedies."
            }
        ]
    },
    author: {
        name: "Dr. Narayan Jethwani",
        credentials: "MD (Hom)"
    },
    reviewer: {
        name: "Dr. Narayan Jethwani",
        credentials: "MD (Hom)",
        specialty: "Clinical Safety & Education",
        institution: "Homeo Healthcare Clinic"
    },
    evidenceLevel: "Expert-Opinion",
    tags: ["Safety", "FAQ", "Efficacy", "Potency", "Children"],
    canonicalUrl: "https://homeo.healthcare/knowledge/faqs/safety",
    readingTimeMinutes: 4,
    audience: "patient",
    license: "CC BY-NC-ND 4.0",
    changeLog: ["1.0.0: Initial safety FAQ compilation"]
};
exports.FAQS = [
    exports.FaqSafetyEntity
];
