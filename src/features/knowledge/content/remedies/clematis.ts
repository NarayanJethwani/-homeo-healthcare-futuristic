import { KnowledgeEntity } from "../../types";

export const ClematisRemedy: KnowledgeEntity = {
  id: "R0100",
  slug: "clematis",
  entityType: "remedy",
  editorialStatus: "published",
  reviewStatus: "owner-authorization-required",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-08-18T14:00:00Z",
    reviewed: "2026-08-18T14:00:00Z"
  },
  title: {
    en: "Clematis Erecta (Virgin's Bower / Upright Virgin's Bower)",
    hi: "क्लेमैटिस इरेक्टा (Clematis Erecta / वर्जिन्स बोवर)",
    gu: "ક્લેમેટિસ ઇરેક્ટા (Clematis Erecta / વર્જિન્સ બોવર)",
    mr: "क्लेमॅटिस इरेक्टा (Clematis Erecta / Virgin's Bower)",
    es: "Clematis Erecta (Clemátide Erecta / Hierba de los Pordioseros)",
    ar: "كليماتيس إيريكتا (ظيان منتصب / عريشة العذراء)"
  },
  summary: {
    en: "An authoritative clinical and educational materia medica profile of Clematis Erecta (Virgin's Bower), covering post-gonorrheal inflammatory urethral strictures, acute and chronic epididymo-orchitis, and vesicular dermatoses characterized by pathognomonic interrupted, intermittent urinary flow where the urine starts and stops in fits and starts, flowing only drop by drop with severe burning and straining, narrow or split urinary stream, acute painful swelling and stony-hard induration of the right testicle and spermatic cord (orchitis) from suppressed gonorrhea or exposure to cold, intense vesicular, weeping, corrosive eczematous eruptions on the occiput, face, and hands that itch violently and burn worse from washing and warmth of bed, constitutional indications, and emergency red flags for acute testicular torsion / testicular ischemia with absent blood flow, acute complete mechanical urethral obstruction from high-grade stricture, acute bacterial urosepsis with ascending pyelonephritis, and acute necrotizing fasciitis of the perineum (Fournier's gangrene).",
    hi: "क्लेमैटिस इरेक्टा (वर्जिन्स बोवर) का शास्त्रीय होम्योपैथिक मटेरिया मेडिका विवरण, जिसमें सूजाक के बाद मूत्रमार्ग का सिकुड़ना (Urethral Stricture - पेशाब रुक-रुक कर, बूंद-बूंद करके बार-बार कटना), दाहिने अंडकोष में तेज दर्द व पत्थर जैसा कड़ापन (Right-Sided Orchitis & Epididymitis), सिर के पिछले भाग (Occiput) व चेहरे पर तेज खुजलीदार पानी वाले छाले व एक्जिमा (Vesicular Eczema), और अंडकोष में खून का दौरा रुकना (Testicular Torsion), पेशाब का पूर्ण अवरोध (Urinary Retention) व फोरनियर गैंग्रीन (Fournier's Gangrene) की आपातकालीन सुरक्षा सीमाएं शामिल हैं.",
    gu: "ક્લેમેટિસ ઇરેક્ટા (વર્જિન્સ બોવર) નું મટેરિયા મેડિકા વિવરણ, પેશાબની નળીનું સંકોચન (યુરેથ્રલ સ્ટ્રિકચર - પેશાબ અટકી અટકીને, ટીપે ટીપે અને ખૂબ જોર કરવાથી જ નીકળવો), જમણા અંડકોષનો અસહ્ય સોજો અને પથ્થર જેવો કઠણ થવો (ઓર્કિટિસ), માથાના પાછળના ભાગે અને ચહેરા પર પાણી ભરેલા ખુજલીવાળા ફોડલા (એક્ઝિમા), અને અંડકોષનું વળી જવું (ટેસ્ટિક્યુલર ટોર્શન) તથા પેશાબનો સંપૂર્ણ અટકાવ (યુરિનરી રીટેન્શન) ની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "क्लेमॅटिस इरेक्टा (Clematis Erecta / Virgin's Bower) चे सविस्तर विवरण, मूत्रमार्गाचे आकुंचन (Urethral Stricture - लघवी थांबून थांबून, थेंब थेंब व जोर दिल्यावरच होणे), उजव्या अंडकोषाची तीव्र सूज व दगडासारखा कडकपणा (Right Orchitis), डोक्याच्या मागच्या भागावरील पाणीदार खाजरे पुरळ (Vesicular Eczema), पारंपरिक होमिओपॅथिक पद्धत आणि अंडकोषाला रक्तपुरवठा बंद होणे (Testicular Torsion) व लघवी पूर्ण बंद होण्याच्या (Urinary Retention) आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de Clematis Erecta que cubre estenosis uretrales post-gonocócicas, epidídimo-orquitis y dermatosis vesiculares patognomónicas caracterizadas por flujo urinario intermitente que se interrumpe y sale gota a gota, induración pétrea dolorosa del testículo derecho, eccema vesiculoso del occipucio, y banderas rojas de torsión testicular y retención urinaria aguda.",
    ar: "دليل موثوق لدواء كليماتيس إيريكتا يغطي تضيقات الإحليل الالتهابية التالية للسيلان والتهاب الخصية والبربخ المميز بالجريان البولي المتقطع الذي يبدأ ويتوقف على دفعات ولا يتدفق إلا قطرة قطرة مع الحرق والجهد وتصلب وتورم مؤلم حجري للخصية اليمنى والحبل المنوي والأكزيما الحويصلية النازة على القذال والوجه وعلامات الخطر لانفتال الخصية والاحتباس البولي الحاد وغنغرينا فورنييه."
  },
  content: {
    overview:
      "Clematis Erecta (Clematis erecta, Upright Virgin's Bower, belonging to the Ranunculaceae family; introduced and systematically proven in classical homeopathic practice by Dr. Samuel Hahnemann in the Materia Medica Pura) is a premier constitutional, urological, and dermatological polychrest for post-gonorrheal inflammatory urethral strictures, acute right-sided epididymo-orchitis, and crusted vesicular dermatoses. Prepared from the fresh leaves and flowering stems harvested in late summer and potentized according to pharmacopoeial standards, its natural botanical phytochemistry contains distinctive ranunculaceous bioactive lactones—principally Protoanemonin (and its dimer Anemonin) and clematoside triterpenoid saponins—which exert powerful anti-inflammatory, mucocutaneous irritant-resolving, smooth-muscle antispasmodic, and glandular decongestant actions upon the male and female urethral epithelium, testicular tunica albuginea, and epididymal stroma. In classical homeopathic provings and urological clinical practice, Clematis Erecta is universally renowned for its pathognomonic diagnostic pair: (1) an INTERRUPTED, INTERMITTENT FLOW OF URINE—the patient experiences severe urinary hesitancy where the stream starts, suddenly stops, starts again, and then dribbles only drop by drop, requiring intense muscular straining to evacuate the bladder due to early inflammatory stricture formation; and (2) acute, painful, STONY-HARD SWELLING AND INDURATION OF THE RIGHT TESTICLE AND SPERMATIC CORD (right-sided orchitis / epididymitis) following suppressed gonorrheal discharges or cold water exposure. A third characteristic keynote is an intensely pruritic, VESICULAR, CORROSIVE ECZEMA on the occiput (base of the skull) and facial margins that weeps yellowish fluid and crusts heavily.",
    definition:
      "A classical homeopathic medicine prepared from Virgin's Bower (Clematis erecta), historically indicated for inflammatory urethral strictures with interrupted intermittent urination, right-sided orchitis, and vesicular weeping eczema on the occiput.",
    causes: [
      "Botanical virgin's bower source: Fresh leaves and flowering stems of Clematis erecta (Ranunculaceae family), rich in protoanemonin lactones and clematoside saponins",
      "Urethral stricture proving pathophysiology: chronic subepithelial fibroblastic proliferation and annular cicatricial narrowing of the bulbous/pendulous urethra, creating high mechanical outflow resistance and an interrupted, intermittent urinary flow",
      "Epididymo-testicular proving inflammation: acute microvascular hyper-congestion and neutrophilic infiltration within the right epididymal head/body and testicular interstitial tissue, causing hot, tender, stony-hard induration",
      "Cutaneous vesicular proving exudation: epidermal spongiosis and intraepidermal vesicle formation along the occipital and facial dermatomes, producing clear or seropurulent weeping eczema with intense burning pruritus"
    ],
    riskFactors: [
      "Men presenting with chronic slow urinary stream, straining to void, or history of gonococcal urethritis",
      "Patients experiencing intermittent urinary flow where the stream stops and starts repeatedly during a single voiding",
      "Men presenting with acute hot, tender swelling and rock-hard induration of the right testicle or epididymis",
      "Individuals suffering from chronic weeping, itchy, burning eczematous eruptions on the back of the head (occiput) and face"
    ],
    symptoms: [
      "Interrupted, Intermittent Flow of Urine (the cardinal urological keynote): urine does not flow in a steady continuous stream; it starts, suddenly stops, starts again, and flows only drop by drop in fits and starts; patient has to wait long and strain hard to empty the bladder",
      "Acute Painful Swelling of Right Testicle & Spermatic Cord (the scrotal keynote): right testicle is enlarged, hot, acutely tender, and hard as stone; pain shoots upward along the right spermatic cord into the abdomen and groin, worse from slightest touch or walking",
      "Narrow, Thin, or Forked Urinary Stream: due to progressive stricture narrowing, the urinary stream is reduced to a thin thread, split into two streams, or dribbles involuntarily after voiding",
      "Vesicular Weeping Eczema on the Occiput & Face (the dermatological keynote): clusters of small clear or yellow fluid-filled blisters on the back of the neck/occiput and face; blisters break, discharge corrosive sticky moisture, and dry into thick scabs that itch violently, worse from washing and heat of bed",
      "Constant Burning in Urethra & Meatus: burning, smarting, scalding pain in the urethra during urination and lasting long after, with feeling as if the urethra were constricted or blocked",
      "Flickering Sparks & Flashes Before the Eyes: visual disturbances with flickering fiery dots or shimmering before the eyes when looking intently",
      "Modality: symptoms worsen at night, from warmth of bed, washing with cold water, and during new moon; relieved by walking in open cool air, sweating, and resting"
    ],
    diagnosis:
      "Homeopathic diagnosis is established by matching the characteristic urological-scrotal totality: interrupted intermittent urinary stream, right-sided stony-hard orchitis, and weeping occipital eczema. In modern conventional medicine, any patient presenting with acute scrotal pain, urinary hesitancy, or skin ulceration requires immediate objective clinical evaluation: Emergent High-Resolution Scrotal Ultrasound with Color and Spectral Doppler (the mandatory immediate standard within 4 hours; evaluating Testicular Arterial Perfusion, Resistive Index, and Whisker/Whirlpool Sign to definitively rule out Testicular Torsion vs. Epididymo-Orchitis), Retrograde Urethrogram (RUG) & Voiding Cystourethrogram (VCUG) / Flexible Urethrocystoscopy (the gold standard evaluating Urethral Stricture Location, Length, and Caliber), Uroflowmetry (evaluating Maximum Flow Rate [$Q_{\text{max}} <10\text{ mL/s}$] and Plateau Flow Curve), Urinalysis with Urine Culture & First-Catch Urine NAAT (ruling out Neisseria gonorrhoeae, Chlamydia trachomatis, and E. coli), Serum Prostate-Specific Antigen (PSA), Complete Blood Count with Differential, and Bacterial Wound Swab Culture.",
    differentialDiagnosis:
      "Differentiate Clematis Erecta from Cantharis Vesicatoria (Cantharis has continuous, agonizing, burning drop-by-drop urination with intolerable tenesmus before, during, and after urination, bloody urine, and intense sexual erethism, whereas Clematis has INTERRUPTED INTERMITTENT STREAM, right-sided stony testicle, and occipital eczema), Conium Maculatum (intermittent starting-and-stopping urinary stream, but Conium is due to PROSTATIC ENLARGEMENT or paresis in elderly men with vertigo on turning head, whereas Clematis is due to URETHRAL STRICTURE and gonorrheal orchitis in younger men), Rhododendron Chrysanthum (orchitis with drawing pains worse BEFORE A THUNDERSTORM and windy weather), Pulsatilla Pratensis (orchitis from suppressed gonorrhea, but Pulsatilla is left-sided, relieved in cool open air, with weeping emotional temperament), and Cannabis Sativa (acute burning gonococcal urethritis with zigzag spraying stream and cold water drop sensation, but lacks Clematis's right testicle induration and occipital eczema).",
    conventionalManagement:
      "Homeopathic Clematis Erecta is administered in low decimal/centesimal potencies (3X, 6C, 30C) as supportive urological and scrotal care. Conventional urology, emergency medicine, and infectious disease management is paramount, vital, and mandatory: (1) Acute Testicular Torsion is a surgical emergency requiring immediate emergent surgical exploration, detorsion, and bilateral orchiopexy within 6 hours (viability window). (2) Severe Acute Epididymo-Orchitis requires targeted antimicrobial therapy: Ceftriaxone 500 mg IM single dose + Doxycycline 100 mg oral BID for 10 days (if sexually transmitted / age <35), or Levofloxacin 500 mg daily for 10–14 days (if enteric pathogen / age >35), scrotal elevation (jockstrap support), and NSAIDs. (3) Severe Urethral Stricture with Urinary Retention requires emergent Urological Catheterization / Direct Vision Internal Urethrotomy (DVIU) / Urethroplasty.",
    homeopathicApproach:
      "Clematis Erecta serves as a supportive constitutional and urological remedy to soothe urethral burning, ease scrotal dragging tension, and calm occipital skin itching alongside guideline-directed antimicrobial treatment, urological dilation/imaging, and physician supervision.",
    lifestyleAdvice:
      "Wear snug, supportive athletic underwear (jockstrap or brief) to elevate the scrotum and minimize painful mechanical traction on the inflamed epididymis and spermatic cord, avoid holding urine for prolonged periods and take adequate unhurried time when voiding to allow the bladder to completely empty despite an intermittent stream, maintain high daily hydration (2.5–3.0 liters) to keep urine dilute and reduce urethral mucosal burning, avoid aggressive scrubbing or hot water washing of weeping occipital eczema lesions (use gentle hypoallergenic colloidal oatmeal cleansers and pat dry with clean towels), refrain from sexual intercourse until infectious epididymo-orchitis is completely resolved and cleared by a physician, and maintain regular urology follow-up.",
    references: [
      "CIT-0004",
      "CIT-0005",
      "CIT-0006",
      "CIT-0007",
      "CIT-0023",
      "CIT-0024"
    ],
    faqs: [
      {
        question: "Why does urine flow in an 'interrupted, stop-and-start' stream in Clematis?",
        answer: "When the urethra develops early inflammatory narrowing (stricture) or muscle spasms after infection, the flow of urine cannot maintain a smooth laminar stream. The stream starts, suddenly breaks off, pauses, starts again, and then dribbles drop by drop."
      },
      {
        question: "How does Clematis help right-sided testicle swelling?",
        answer: "Clematis has a classic organ affinity for the right testicle and epididymis. When infection or suppression causes the right testicle to become hot, enlarged, and hard as stone, Clematis reduces the inflammatory congestion and aching in the spermatic cord."
      }
    ],
    redFlags: [
      "Acute Testicular Torsion / Ischemia: sudden severe agonizing unilateral testicular pain, high-riding horizontal lie of the testicle, scrotal swelling, absent cremasteric reflex, and nausea (surgical urological emergency requiring immediate emergency surgery within 6 hours to save the testicle)",
      "Acute Complete Urethral Obstruction / Retention: severe suprapubic lower abdominal pain, painful bladder distension, and total inability to pass urine (urological emergency requiring emergent catheterization or suprapubic cystostomy)",
      "Acute Necrotizing Fasciitis of Perineum (Fournier's Gangrene): rapidly spreading severe pain, dusky erythema, bullae, foul odor, and crepitus in the scrotum/perineum with high fever and septic shock (surgical emergency requiring immediate debridement)",
      "Acute Ascending Pyelonephritis / Urosepsis: high fever with shaking chills, flank pain, vomiting, and hypotension"
    ]
  },
  claimCitations: [
    { claimId: "R0100-TRADITIONAL-PROFILE", statement: "Homeopathic Clematis erecta profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-R0100-TRADITIONAL-PROFILE" },
    { claimId: "R0100-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for testicular torsion surgical detorsion, complete urethral stricture surgical urethroplasty, or Fournier's gangrene emergency debridement.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "R0100-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "R0100-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for acute scrotal ischemia, complete urinary retention, or perineal necrotizing infections.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Sudden severe testicle pain with swelling and nausea requiring emergency surgery within 6 hours for testicular torsion",
    "Complete inability to pass urine with severe lower belly swelling requiring emergency catheterization",
    "Rapidly spreading dark red or purple swelling with bad odor in the groin and high fever"
  ],
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Clinical Governance & Materia Medica",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Clematis Erecta", "Virgin's Bower", "Upright Virgin's Bower", "Interrupted Urinary Stream", "Urethral Stricture", "Right Orchitis", "Epididymitis", "Stony Hard Testicle", "Weeping Eczema Occiput", "Remedy", "Materia Medica", "Urology", "Dermatology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/clematis",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive interrupted intermittent urinary stream, right-sided stony-hard orchitis, urethral strictures, and weeping occipital eczema clinical boundaries, testicular torsion/retention red flags, and verified citations"],
  clinicalPearl: "Interrupted, intermittent urinary stream that starts and stops in fits and starts, paired with stony-hard swelling of the right testicle and weeping eczema on the occiput, is pathognomonic of Clematis Erecta.",
  quickFacts: {
    "Source Material": "Fresh leaves and flowering stems of Clematis erecta (Virgin's Bower, Ranunculaceae)",
    "Key Keynote": "Interrupted stop-and-start urinary stream; right-sided stony orchitis; occipital eczema",
    "Cardinal Field": "Urethral strictures, intermittent micturition, right-sided orchitis, and vesicular dermatoses",
    "Safety Class": "Prescription homeopathic dilution; non-toxic in potentized forms"
  },
  aiReadiness: {
    retrievalSummary: "Clematis Erecta is a homeopathic remedy for pee that starts and stops in fits and starts and comes out drop by drop, rock-hard painful swelling of the right testicle, and watery itchy blisters on the back of the head, used as supportive care.",
    clinicalSummary: "Clematis Erecta materia medica focuses on post-gonorrheal urethral strictures and epididymo-orchitis (pathognomonic interrupted, intermittent urinary flow starting and stopping in fits and starts, dribbling drop by drop with straining, acute painful stony-hard induration of the right testicle and spermatic cord), and vesicular weeping corrosive eczema on the occiput and face. Homeopathic dilutions serve as supportive care and do not replace emergent surgical exploration/detorsion for testicular torsion, surgical urethroplasty for tight strictures, or ceftriaxone/doxycycline for acute epididymo-orchitis.",
    patientSummary: "Clematis (Virgin's Bower) is a traditional homeopathic medicine for men whose urine starts and stops repeatedly and only dribbles out, who have a painful, rock-hard swollen right testicle, and crusty, itchy blisters on the back of their head.",
    studentSummary: "Premier urethral stricture, intermittent micturition, right orchitis, and occipital eczema polychrest. Keynotes: interrupted intermittent flow of urine (starts, stops, starts again, flows drop by drop with straining), acute painful stony-hard induration of right testicle and spermatic cord, narrow/forked stream from stricture, and vesicular weeping corrosive eczema on occiput and face. Ranunculaceous protoanemonin lactones. Red flags: acute testicular torsion (emergent Doppler/surgical detorsion within 6 hours) and complete urinary retention.",
    keywords: ["clematis erecta", "virgins bower", "interrupted urinary stream", "stop and start urination", "urethral stricture", "right orchitis epididymitis", "stony hard right testicle", "weeping eczema occiput"],
    semanticKeywords: ["urethral cicatricial annular stenosis resistance", "right epididymo-testicular neutrophilic induration", "occipital epidermal spongiosis vesicular eruption"],
    icd: "N35.9",
    mesh: "D029892",
    bodySystem: "Urology & Dermatology",
    urgency: "routine"
  }
};
