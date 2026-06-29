"use strict";
// DR. JETHWANI'S ORGANON OF MEDICINE CLINICAL KNOWLEDGE ENGINE
// High-Fidelity Data structures for Interactive Organon Learning & AI Tutoring
Object.defineProperty(exports, "__esModule", { value: true });
exports.TIMELINE_STEPS = exports.ACTIVE_RECALL_EXERCISES = exports.ORGANON_CASES = exports.ORGANON_APHORISMS = exports.ORGANON_KNOWLEDGE_TREE = exports.ORGANON_EDITIONS = void 0;
// 1. EDITIONS
exports.ORGANON_EDITIONS = [
    {
        id: 1,
        name: "1st Edition (Organon of Rational Art of Healing)",
        year: "1810",
        aphorismsCount: 271,
        significance: "The foundation of homeopathic science, introducing the law of similars and basic principles of drug proving.",
        keyShifts: [
            "Initial formulation of 'Similia Similibus Curentur'.",
            "Emphasis on medicinal preparation without highly developed dynamization rules.",
            "Lays out critique of standard polypharmacy."
        ]
    },
    {
        id: 2,
        name: "2nd Edition (Organon of Medicine)",
        year: "1819",
        aphorismsCount: 318,
        significance: "Changes the title to 'Organon of Medicine', introduces the concept of vital force as the maintaining agent, and refines dose selection.",
        keyShifts: [
            "Vital Force starts appearing as the sustaining entity.",
            "Increases total aphorisms to 318.",
            "Advocated moderate dilutions."
        ]
    },
    {
        id: 3,
        name: "3rd Edition",
        year: "1824",
        aphorismsCount: 320,
        significance: "Refined drug proving guidelines and introduced the standard administration of remedies in dry globules.",
        keyShifts: [
            "Standardization of 30th centesimal (30C) potency.",
            "Refinement of proving criteria on healthy subjects."
        ]
    },
    {
        id: 4,
        name: "4th Edition",
        year: "1829",
        aphorismsCount: 292,
        significance: "A major watershed edition introducing the Theory of Chronic Diseases and the three core miasms (Psora, Sycosis, Syphilis).",
        keyShifts: [
            "Introduction of Psora as the parent of most chronic diseases.",
            "Re-organization and condensation of aphorisms to 292.",
            "Explicit instructions on miasmatic loading and chronic case analysis."
        ]
    },
    {
        id: 5,
        name: "5th Edition",
        year: "1833",
        aphorismsCount: 294,
        significance: "Formulates the doctrine of Vital Force clearly (§9-15), introduces the concept of dynamic action of drugs, and explains medicinal aggravations.",
        keyShifts: [
            "Dynamic immaterial nature of Vital Force is fully integrated.",
            "Detailed guidelines on Centesimal (C) scale preparation and single globules."
        ]
    },
    {
        id: 6,
        name: "6th Edition (The Posthumous Masterpiece)",
        year: "1921 (written 1842)",
        aphorismsCount: 291,
        significance: "Hahnemann's final revisions, introducing the 50-Millesimal (LM) potency scale, water administration, and daily repeated doses.",
        keyShifts: [
            "Replacement of dry globule dosage with water solution administration to avoid aggravation.",
            "Introduction of LM (0/1 to 0/30) potentization scale (§270).",
            "Permission to repeat the remedy daily in acute/chronic conditions if dynamically succussed before each dose."
        ]
    }
];
// 2. KNOWLEDGE TREE
exports.ORGANON_KNOWLEDGE_TREE = [
    {
        title: "Introduction & Mission",
        aphorisms: ["§1", "§2", "§3", "§4"],
        description: "The physician's high and only mission and the attributes of a true practitioner."
    },
    {
        title: "Fundamental Principles",
        aphorisms: ["§5", "§6", "§7", "§8"],
        description: "Individualization, the totality of symptoms, and the removal of the exciting cause."
    },
    {
        title: "Vital Force & Health",
        aphorisms: ["§9", "§10", "§11", "§12", "§13", "§14"],
        description: "The spiritual vital force animating the physical body and its role in health and disease."
    },
    {
        title: "Nature of Disease",
        aphorisms: ["§15", "§16", "§17", "§18", "§70"],
        description: "Dynamic derangement of vital force and how diseases present through symptoms."
    },
    {
        title: "Drug Proving (Homoeopathic Pharmacodynamics)",
        aphorisms: ["§105", "§106", "§107", "§108", "§120", "§141"],
        description: "Acquiring knowledge of the pathogenetic effects of substances on healthy human beings."
    },
    {
        title: "Case Taking (The Art of Inquiry)",
        aphorisms: ["§83", "§84", "§85", "§86", "§87", "§90"],
        description: "Unprejudiced observation, recording clinical totality, and individualizing the patient."
    },
    {
        title: "Remedy Selection & Similia",
        aphorisms: ["§146", "§147", "§148", "§153"],
        description: "Selecting the most similar remedy, focusing on striking, singular, uncommon symptoms (PECULIAR)."
    },
    {
        title: "The Single Remedy (Unity of Cure)",
        aphorisms: ["§272", "§273", "§274"],
        description: "Why only one single simple medicinal substance must be administered at a time."
    },
    {
        title: "The Minimum Dose",
        aphorisms: ["§275", "§276", "§277", "§278", "§279"],
        description: "Reducing dose size to avoid toxic aggravations while maintaining dynamic curative power."
    },
    {
        title: "Potentization & Dynamization",
        aphorisms: ["§269", "§270", "§271"],
        description: "The mathematical and physical preparation of homeopathic potencies, including LM scale."
    },
    {
        title: "Miasms & Chronic Disease",
        aphorisms: ["§72", "§73", "§78", "§80", "§81"],
        description: "Psora, Sycosis, and Syphilis as deep chronic blocks to permanent cure."
    },
    {
        title: "Obstacles to Cure",
        aphorisms: ["§4", "§77", "§252", "§260", "§261"],
        description: "Dietary errors, maintaining causes, environmental toxins, and mental blocks."
    },
    {
        title: "Follow-Up & Remedy Reaction",
        aphorisms: ["§248", "§249", "§253", "§256"],
        description: "Observing changes in patient energy, sleep, mood, and physical signs post-dose."
    },
    {
        title: "Second Prescription",
        aphorisms: ["§249", "§250", "§251"],
        description: "When to repeat, change potency, antidote, or select a complementary remedy."
    },
    {
        title: "Direction of Cure",
        aphorisms: ["§161", "§248", "§253"],
        description: "Understanding healing progression (top-down, inside-out, reverse chronological order)."
    }
];
// 3. APHORISMS DATA
exports.ORGANON_APHORISMS = [
    {
        id: "1",
        number: "§1",
        edition: "6th Edition",
        title: "The Physician's Sole Mission",
        originalText: "The physician's high and only mission is to restore the sick to health, to cure, as it is termed.",
        modernTranslation: "A doctor's primary and singular goal is to help sick people get completely well, which is what we call curing.",
        clinicalMeaning: "Healthcare must focus entirely on restoring patient health. Theoretical debates, physiological speculations, and diagnostic labels are secondary to actual clinical recovery. If a therapy does not result in real healing, it fails Hahnemann's mandate.",
        practicalApplication: "Avoid getting lost in complex chemical theories while the patient remains in distress. Every action, case analysis, and prescription must directly aim for gentle, rapid, and permanent healing.",
        repertoryLink: "Integrates with Vital Force indicators in Dr. Jethwani's dashboard by aligning symptom load reduction directly to recovery progression.",
        dailyPracticeExample: "Instead of focusing solely on modifying lab thyroid numbers while the patient still suffers extreme lethargy, the homeopath focuses on restoring vital force, energy, and overall health, which naturally normalizes anti-TPO levels later.",
        crossReferences: ["§2", "§3", "§17"],
        relatedConcepts: ["Mission", "Cure", "Individualization"],
        relatedRemedies: ["Sulph", "Ars", "Nux-v"],
        affinities: {
            migraine: "Focus on curing the patient's neurological reactivity, not just providing temporary analgesic suppression.",
            asthma: "Aim to restore lung immunology and vital force capacity so that inhalers are no longer required.",
            psoriasis: "Cure the internal psoric disturbance rather than suppressing skin plaques with steroid creams.",
            anxiety: "Re-establish autonomic nervous balance and mental calmness permanently.",
            ibs: "Heal gut dysbiosis and nervous hypersensitivity rather than prescribing chronic daily laxatives/antispasmodics.",
            autoimmune: "Calm the self-attacking immune reactivity by addressing the deep constitutional miasm.",
            children: "Build robust natural immunity early, minimizing drug toxicity.",
            geriatrics: "Gently restore vitality and functional independence in older age.",
            modernPractice: "Contrasts with modern symptomatic maintenance treatments for chronic diseases by demanding complete curative restoration."
        }
    },
    {
        id: "2",
        number: "§2",
        edition: "6th Edition",
        title: "The Ideal of Cure",
        originalText: "The highest ideal of cure is rapid, gentle and permanent restoration of the health, or removal and annihilation of the disease in its whole extent, in the shortest, most reliable, and most harmless way, on easily comprehensible principles.",
        modernTranslation: "The absolute best healing is fast, comfortable, and long-lasting, removing the entire disease safely, gently, and predictably based on clear, logical rules.",
        clinicalMeaning: "A true cure must not cause side effects, must act quickly, and must last permanently. Temporary relief followed by dependency or new symptoms (suppression) is not a cure. The cure must be based on clear, scientific natural laws (Similia).",
        practicalApplication: "Always select potencies and doses that minimize healing crises (homeopathic aggravations). Avoid aggressive therapies that trade one symptom for a worse one (e.g., suppressing eczema only to trigger asthma).",
        repertoryLink: "Governs the 'Response Indicators' section in the Clinical Repertory dashboard, marking 'Rapid, gentle, permanent amelioration' as the highest rating.",
        dailyPracticeExample: "A child with chronic recurrent tonsillitis is treated constitutionally with Belladonna and Calcarea Carbonica. Instead of undergoing surgery or recurrent antibiotic runs, the tonsils shrink naturally and overall health and weight gain improve.",
        crossReferences: ["§1", "§148", "§276"],
        relatedConcepts: ["Ideal Cure", "Gentleness", "Suppression"],
        relatedRemedies: ["Puls", "Calc", "Bell"],
        affinities: {
            migraine: "Resolve migraines without daily triptan overuse headaches or dynamic brain fog.",
            asthma: "Slowly reduce bronchospasms permanently without causing steroid-induced bone or growth suppression.",
            psoriasis: "Clear skin plaques from the inside out, showing true healing without creating joint pains (arthropathic psoriasis).",
            anxiety: "Resolve anxiety without generating benzodiazepine dependency or emotional flatlining.",
            ibs: "Normalize bowel motility naturally on a simple diet without continuous drug reliance.",
            autoimmune: "Establish immune tolerance gently, bypassing heavy immunosuppressant side effects.",
            children: "Gentle liquid LM potencies prevent sensory alarms or severe healing crises in sensitive infants.",
            geriatrics: "Avoid polypharmacy interactions and organ strain in patients with compromised liver/kidney clearing.",
            modernPractice: "Underpins the search for 'Low Aggravation' techniques such as water-dissolved LM potencies in modern clinics."
        }
    },
    {
        id: "3",
        number: "§3",
        edition: "6th Edition",
        title: "Knowledge Required for a True Physician",
        originalText: "If the physician clearly perceives what is to be cured in diseases... if he clearly perceives what is curative in medicines... and if he knows how to adapt, according to clearly defined principles, what is curative in medicines to what he has discovered to be undoubtedly morbid in the patient... then only is he a true practitioner of the healing art.",
        modernTranslation: "A true healer must know three things: 1. What needs to be cured in the patient (individual disease totality); 2. The curative power of each medicine (Materia Medica); and 3. How to apply the correct medicine in the correct dose/potency according to logical rules.",
        clinicalMeaning: "Homeopathic practice requires a rigorous triple diagnostic: clinical diagnosis (individual pathology), pathogenetic diagnosis (drug provings), and posological diagnostic (potency, dose size, repetition schedule). Any missing link breaks the therapeutic chain.",
        practicalApplication: "Analyze cases systematically. Separate constitutional symptoms from acute symptoms. Match them to the exact Materia Medica profiles, and choose the potency based on the patient's Vital Force status.",
        repertoryLink: "The mathematical backbone of the Repertory Confidence Engine in the dashboard, linking case symptoms, remedy genome, and confirmation questions.",
        dailyPracticeExample: "In treating a patient with chronic rheumatoid arthritis, the doctor isolates the unique modalities (better motion, worse cold damp) matching Rhus Tox, identifies the Syphilitic miasmatic load, and prescribes Rhus Tox 200C rather than a generic anti-inflammatory.",
        crossReferences: ["§4", "§83", "§147", "§252"],
        relatedConcepts: ["Totality", "Curative Power", "Adaptation", "Posology"],
        relatedRemedies: ["Rhus-t", "Bry", "Caust"],
        affinities: {
            migraine: "Identify if the head pain is triggered by liver stagnation (Lycopodium) or emotional grief (Ignatia).",
            asthma: "Distinguish between damp-cold asthma (Natrum Sulphuricum) and dry-wind asthma (Aconite).",
            psoriasis: "Trace the miasmatic block (Psora/Sycosis) and current maintaining causes (high sugar/stress).",
            anxiety: "Diagnose whether the panic is acute/situational (Aconite) or chronic/anticipatory (Gelsemium).",
            ibs: "Isolate gut symptoms from mental patterns (e.g., Nux Vomica workaholism).",
            autoimmune: "Acknowledge the deep genetic miasmatic load and design a long-term prescribing strategy.",
            children: "Focus on parental history (hereditary miasm) to prevent childhood asthma/eczema.",
            geriatrics: "Assess the pathology severity to adapt the potency safely (preferring lower or LM potencies).",
            modernPractice: "Requires integration of modern clinical pathology with classical homeopathic individualization."
        }
    },
    {
        id: "9",
        number: "§9",
        edition: "6th Edition",
        title: "The Vital Force in Health",
        originalText: "In the healthy condition of man, the spiritual vital force (autocracy), the dynamis that animates the material body (organism), rules with unbounded sway, and retains all the parts of the organism in admirable, harmonious, vital operation... so that our indwelling, reason-gifted mind can freely employ this living, healthy instrument for the higher purposes of our existence.",
        modernTranslation: "In health, a spiritual force (the Vital Force or Dynamis) maintains perfect harmony throughout our mind and body, letting our consciousness use this healthy vehicle to fulfill our life's purpose.",
        clinicalMeaning: "Health is not merely the absence of disease, but a state of dynamic spiritual and physical harmony. The body is animated by an intelligence (vital force) that coordinates immune response, cellular function, and mental clarity. True health allows spiritual and mental fulfillment.",
        practicalApplication: "Prescribing must aim to strengthen the Vital Force, not just suppress local organs. If the Vital Force is strong, the body heals its own tissues (e.g., healing ulcers, balancing hormones).",
        repertoryLink: "Provides the philosophical rationale for the 'Vital Force Index' (VFI) in the Clinical Indices panel on Dr. Jethwani's dashboard.",
        dailyPracticeExample: "A patient feels light, energetic, clear-headed, and sleeps deeply after a dose of Sulphur 1M, even before their chronic skin eruption fully clears. This shows the Vital Force is harmonized and healing has commenced.",
        crossReferences: ["§10", "§11", "§12"],
        relatedConcepts: ["Vital Force", "Dynamis", "Harmony", "Health"],
        relatedRemedies: ["Sulph", "Psor", "Thuja"],
        affinities: {
            migraine: "Restore the autonomic nervous equilibrium rather than dulling head pain receptors.",
            asthma: "Re-establish dynamic lung breathing rhythms and calm hyper-reactive bronchial tissues.",
            psoriasis: "Strengthen the internal skin barrier and cellular turnover cycles dynamically.",
            anxiety: "Restore deep nervous peace, freeing the patient from survival/fight-or-flight panic modes.",
            ibs: "Re-harmonize the gut-brain axis, restoring natural peristaltic rhythm.",
            autoimmune: "Retrain the immune system to recognize self from non-self, resolving self-destructive behavior.",
            children: "Encourage natural, drug-free development of childhood vitality and emotional growth.",
            geriatrics: "Preserve the remaining vital force reserves, enhancing longevity and mental clarity.",
            modernPractice: "Aligns with the modern functional medicine concept of optimizing cellular energy, stress resilience, and homeostasis."
        }
    },
    {
        id: "10",
        number: "§10",
        edition: "6th Edition",
        title: "The Body Without Vital Force",
        originalText: "The material organism, without the vital force, is capable of no sensation, no activity, no self-preservation; it derives all sensation and performs all the functions of life solely by means of the immaterial being (the vital principle) which animates the material organism in health and in disease.",
        modernTranslation: "Without the vital force, the physical body has no feeling, no movement, and decays. All life functions and sensory feelings exist only because the vital force animates the physical form.",
        clinicalMeaning: "Pathology (tissue damage, chemical imbalance) is a secondary effect. The primary cause of disease is the dynamic derangement of the vital principle. Treating a corpse or focusing solely on inert chemistry misses the dynamic living nature of the human organism.",
        practicalApplication: "Address the dynamic disturbance first. Chemical testing is a mapping tool, but the prescription must match the dynamic, living modalities of the patient.",
        repertoryLink: "Correlates directly with the 'Constitutional Stability' index on the dashboard, representing structural resilience.",
        dailyPracticeExample: "A patient in a coma or severe shock displays no active responses because the vital force is severely depressed. Homeopathic remedies like Carbo Veg (the corpse reviver) are administered to stimulate the spark of vitality.",
        crossReferences: ["§9", "§11", "§15"],
        relatedConcepts: ["Material Organism", "Vital Principle", "Animation"],
        relatedRemedies: ["Carbo-v", "Gels", "Op"],
        affinities: {
            migraine: "Addresses the neurological hyper-excitability that precedes physical vascular dilation.",
            asthma: "Treats the dynamic spasmodic constriction of the airways, not just physical inflammation.",
            psoriasis: "Treats the underlying psoric dynamic block that causes abnormal hyper-proliferation of skin cells.",
            anxiety: "Calms the deep energetic tremors that present as physical heart palpitations and cold sweats.",
            ibs: "Regulates the dynamic enteric nervous system signals that cause spastic colon cramps.",
            autoimmune: "Modulates the dynamic self-destructive signals of the immune cells.",
            children: "Safeguards the highly reactive vital principle of children from toxic suppressions.",
            geriatrics: "Gently supports failing organs when vital force expression is declining.",
            modernPractice: "Parallels systems biology, which views the body as a network of dynamic feedback loops rather than a collection of separate parts."
        }
    },
    {
        id: "26",
        number: "§26",
        edition: "6th Edition",
        title: "The Law of Nature / Similia Law",
        originalText: "A weaker dynamic affection is permanently extinguished in the living organism by a stronger one, if the latter (deviating in kind) is very similar in its manifestations to the former.",
        modernTranslation: "A weaker dynamic disease is permanently cured in the body by a stronger, similar disease experience, provided the curing agent is similar in symptoms but different in origin.",
        clinicalMeaning: "The scientific law of cure (Similia Similibus Curentur). When a homeopathic remedy is administered, it creates a temporary, slightly stronger, similar artificial disease in the vital force. The vital force reacts against this artificial disease, easily throws it off, and in doing so, extinguishes the original weaker natural disease.",
        practicalApplication: "To cure a disease, select a remedy that has been proven to produce the most similar totality of symptoms in healthy humans. The remedy's power must be slightly stronger (potentized) to overcome the natural disease.",
        repertoryLink: "This law defines the core matching algorithm of the Repertory Confidence Engine in the dashboard.",
        dailyPracticeExample: "A patient suffering from burning stomach pain relieved by warm drinks is given Arsenicum Album (which produces burning stomach pain in provings). The remedy displaces the natural burning pain, and the patient recovers.",
        crossReferences: ["§27", "§28", "§148"],
        relatedConcepts: ["Law of Similars", "Artificial Disease", "Reaction"],
        relatedRemedies: ["Ars", "Nux-v", "Puls"],
        affinities: {
            migraine: "A throbbing congestive headache is cured by a similar throbbing agent (Belladonna).",
            asthma: "A nocturnal suffocative asthma attack is cured by Arsenicum, which mimics the exact symptoms.",
            psoriasis: "Dry, scaling, itchy skin is displaced by a similar scaly agent (Sulphur or Arsenicum).",
            anxiety: "A state of restless, trembling panic is resolved by Gelsemium (which causes extreme trembling/weakness).",
            ibs: "Spasmodic, painful colic is cured by Colocynthis, which produces identical double-overing cramps.",
            autoimmune: "A deep chronic inflammatory state is displaced by a deeply acting similar miasmatic remedy.",
            children: "Acute teething fevers and irritability are cured by Chamomilla, which mimics the child's anger.",
            geriatrics: "Addresses degenerative joint pains using similar remedies (e.g., Rhus Tox for stiffness relieved by motion).",
            modernPractice: "Explains why low-dose stimulants are used to treat ADHD (a modern medical application of the similia principle)."
        }
    },
    {
        id: "70",
        number: "§70",
        edition: "6th Edition",
        title: "Summary of Homeopathic Doctrine",
        originalText: "Everything of a cure-opposing nature... must be removed... all diseases are dynamic disturbances of the vital force... the medicine must be chosen according to the totality of symptoms... and administered in the minimum dose.",
        modernTranslation: "In short: remove all obstacles to healing, recognize that diseases are dynamic disturbances of the vital force, select remedies based on the totality of symptoms, and give them in the minimum dose.",
        clinicalMeaning: "The grand summary of Hahnemann's system: 1. Hygiene/dietary management (removing obstacles); 2. Dynamic etiology; 3. Symptom totality matching; and 4. Minimal dosage. Deviation from any of these four pillars compromises the clinical outcome.",
        practicalApplication: "Before prescribing, ensure the patient is not drinking excessive coffee, sleeping in moldy rooms, or taking suppressive drugs. Match the remedy to the dynamic totality and give a single, tiny dose.",
        repertoryLink: "Linked to the 'Obstacles to Cure' tracker on the clinical dashboard.",
        dailyPracticeExample: "A patient with chronic eczema is advised to stop using suppressive steroid creams (obstacle to cure) and is given a single dose of Sulphur 200C based on their warm-blooded nature, sweet cravings, and night itching.",
        crossReferences: ["§3", "§5", "§272", "§276"],
        relatedConcepts: ["Doctrine", "Obstacles", "Minimum Dose", "Totality"],
        relatedRemedies: ["Sulph", "Nux-v", "Psor"],
        affinities: {
            migraine: "Remove food triggers (like MSG, red wine) first, then prescribe the similar remedy.",
            asthma: "Remove allergens (mold, dust mites) before evaluating the constitutional response.",
            psoriasis: "Adjust gut health and diet, removing systemic inflammatory foods.",
            anxiety: "Limit caffeine and screen time before bed to resolve insomnia and panic.",
            ibs: "Remove high-FODMAP irritants and food allergens to isolate the true dynamic symptoms.",
            autoimmune: "Clean up environmental toxins and chemical exposures to lower the immune load.",
            children: "Ensure clean, healthy diets and emotional security in the home.",
            geriatrics: "Review and trim unnecessary polypharmacy prescriptions in consultation with their physician.",
            modernPractice: "Integrates standard functional lifestyle medicine with homeopathic therapeutics."
        }
    },
    {
        id: "153",
        number: "§153",
        edition: "6th Edition",
        title: "The Characteristic Symptoms / striking symptoms",
        originalText: "In this search for a homoeopathic specific remedy... the more striking, singular, uncommon and peculiar (characteristic) signs and symptoms of the case of disease are chiefly and almost solely to be kept in view; for it is more especially these that must match the symptoms of the medicine...",
        modernTranslation: "When searching for the correct remedy, focus almost entirely on the striking, singular, uncommon, and peculiar (characteristic) symptoms in the patient. Common symptoms (like fever, pain, or nausea) are too general and do not point to a specific remedy.",
        clinicalMeaning: "Individualization is the core of homeopathy. Common symptoms (e.g., joint pain in arthritis, headache in migraine) only establish the clinical diagnosis. The homeopathic prescription must be based on the unique, peculiar modalities and mental reactions (e.g., headache relieved by standing on one's head, joint pain better from slow motion). These are the key characteristics (PQRS symptoms).",
        practicalApplication: "Filter out common diagnostic symptoms from your primary repertorization sheet. Focus on the most peculiar, striking features (e.g., thirstless during high fever, heat feels like ice, extreme anxiety with no fear of death).",
        repertoryLink: "Underpins the 'Peculiar / Characteristic Rubric Boosting' algorithm in the Jethwani Repertory search engine.",
        dailyPracticeExample: "A patient with a high fever (common symptom) is found to be completely thirstless with dry mouth, weeping, and desires cool open air (peculiar characteristics). This points directly to Pulsatilla, whereas the fever alone could match 100 remedies.",
        crossReferences: ["§3", "§83", "§147"],
        relatedConcepts: ["Characteristic", "Peculiar Symptoms", "PQRS", "Individualization"],
        relatedRemedies: ["Puls", "Apis", "Lyc", "Ign"],
        affinities: {
            migraine: "A migraine with the peculiar modality of being relieved by tight bandaging around the head (Arg-n).",
            asthma: "Asthma worse at exactly 3 AM, requiring the patient to sit up and lean forward (Kali Carb).",
            psoriasis: "Psoriasis with severe itching that is relieved by scalding hot water (Sulphur or Arsenicum).",
            anxiety: "Panic attacks where the patient feels as if their legs are made of wood or glass (Thuja).",
            ibs: "IBS where flatulence is passed only when lying down, or bloating occurs immediately after eating (Lycopodium).",
            autoimmune: "Joint stiffness that is worse during first motion, but better after walking around (Rhus Tox).",
            children: "A child with high fever who demands to be carried constantly and is extremely cross (Chamomilla).",
            geriatrics: "Dizziness when turning the head in bed, or chronic constipation with no urge for stool (Alumina).",
            modernPractice: "Requires the clinician to look past standard diagnostic codes (ICD) to capture the unique human experience of the illness."
        }
    },
    {
        id: "270",
        number: "§270",
        edition: "6th Edition",
        title: "The LM Potency & Succussion Scale",
        originalText: "In order to best obtain this development of power... the medicine is dissolved, potentized by succussions, and diluted in a ratio of 1:50,000 at each step, forming the LM potencies (0/1, 0/2, etc.)...",
        modernTranslation: "To unlock the highest medicinal energy with the least physical aggravation, medicines are prepared using a 1:50,000 dilution ratio at each step (LM potencies), and administered in liquid form.",
        clinicalMeaning: "Hahnemann's ultimate posological breakthrough. The LM (50-Millesimal) scale provides a rapid curative action with minimal risk of severe homeopathic aggravations. It allows frequent (even daily) repetition of the remedy, making it ideal for deep chronic diseases and sensitive patients.",
        practicalApplication: "Use LM potencies (starting at 0/1) for highly sensitive patients, chronic autoimmune conditions, or cases with severe structural pathology where centesimal potencies might cause dangerous aggravations.",
        repertoryLink: "Linked to the 'Potency Selector' recommendations engine in the decision support sidebar of the dashboard.",
        dailyPracticeExample: "A patient with advanced ulcerative colitis is given Sulphur 0/1 in daily water doses. The inflammation decreases smoothly without the severe skin/gut flare-up that a dry dose of Sulphur 200C would have triggered.",
        crossReferences: ["§269", "§271", "§278"],
        relatedConcepts: ["LM Potency", "Succussion", "Dilution", "Dynamization"],
        relatedRemedies: ["Sulph", "Thuja", "Sil"],
        affinities: {
            migraine: "Allows daily micro-dosing to gently desensitize the trigeminal nerve system.",
            asthma: "Avoids sudden broncho-constrictive reactions that can occur with high centesimal dry doses.",
            psoriasis: "Heals deep-seated skin conditions without triggering massive, painful skin exfoliations.",
            anxiety: "Gently calms hyper-reactive nervous systems without causing temporary panic spikes.",
            ibs: "Steadily regulates bowel flora and motility with a daily gentle dynamic stimulus.",
            autoimmune: "Provides a daily modulating signal to the immune system, avoiding heavy systemic shocks.",
            children: "Sweet, water-dissolved doses are easily accepted by children and minimize physical flares.",
            geriatrics: "Safest potency scale for older adults with fragile organs and low vital force reserve.",
            modernPractice: "A key tool for modern homeopaths managing patients who are taking suppressive conventional drugs."
        }
    },
    {
        id: "273",
        number: "§273",
        edition: "6th Edition",
        title: "The Single Remedy Rule",
        originalText: "In no case is it requisite, and therefore it is not permissible, to employ more than one single, simple medicinal substance at a time.",
        modernTranslation: "Under no circumstances is it necessary, nor is it allowed, to give a patient more than one single medicine at any one time.",
        clinicalMeaning: "Homeopathic drug provings are conducted with single substances, not mixtures. The interaction of multiple remedies in the body is unpredictable, unscientific, and prevents the clinician from knowing which substance caused the effect. Complexity breeds confusion.",
        practicalApplication: "Prescribe only one remedy at a time. Do not mix remedies in a single bottle, and do not prescribe 'alternating' remedies (e.g., Aconite in the morning, Belladonna at night). Find the single remedy that matches the totality.",
        repertoryLink: "Enforces the 'Single Remedy Analysis' validation checking rule in the Case Intelligence panel.",
        dailyPracticeExample: "A patient presenting with acute influenza, deep bone aches, and high anxiety is given Gelsemium alone, which covers the entire state. Giving Arnica for body ache, Aconite for anxiety, and Bryonia for thirst simultaneously is bad practice.",
        crossReferences: ["§272", "§274"],
        relatedConcepts: ["Single Remedy", "Simplicity", "Polypharmacy"],
        relatedRemedies: ["Gels", "Eup-per", "Bry"],
        affinities: {
            migraine: "Focus on finding the one constitutional remedy that covers both the headache and the patient's emotional triggers.",
            asthma: "Avoid using mixed 'asthma formulas' which provide only temporary palliative relief.",
            psoriasis: "Uncover the single deep antipsoric remedy that fits the patient's physical thermals and mental profile.",
            anxiety: "Calm the patient's entire state with a single well-selected remedy matching their exact fear profile.",
            ibs: "Address the digestive and psychiatric symptoms together with a single remedy (e.g., Nux Vomica).",
            autoimmune: "Prescribe a single deep constitutional remedy to stabilize the entire immunological field.",
            children: "Keep the treatment pure to observe the child's reaction clearly.",
            geriatrics: "Reduces drug load and confusion in elderly patients who may already be on multiple prescriptions.",
            modernPractice: "Directly opposes retail 'combination homeopathics', advocating for classical, individualised prescribing."
        }
    }
];
// 4. CASE CORRELATION DATA
exports.ORGANON_CASES = [
    {
        id: "case_01",
        title: "Severe Panic Disorder & Autonomic Flare",
        principle: "Single Remedy & Similia Law (§26, §273)",
        patientProfile: "34-year-old male presenting with sudden, terrifying panic attacks, heart palpitations, and fear of immediate death. Triggered by the sudden loss of a close business partner.",
        symptomIntake: "Extreme restlessness, walking back and forth in panic. Chilly, demands warm clothing. Thirst for small sips of warm water frequently. Worse at midnight (12 AM to 2 AM). Obsessive worry about his health and fear of cancer.",
        analysis: "The case presents a clear dynamic derangement of the vital force. The mental state is characterized by extreme anxiety and physical restlessness. The physical general state shows chilliness and peculiar thirst. These symptoms match the pathogenetic profile of Arsenicum Album.",
        remedySelection: "Arsenicum Album 200C, a single dose, dissolved in water.",
        followUp: "On day 3, the patient reported a feeling of deep mental calm and improved sleep. His physical restlessness vanished. He had a slight, temporary increase in nasal discharge (benign dynamic elimination). By week 2, panic attacks had ceased entirely.",
        outcome: "Cure achieved gently and rapidly in accordance with Aphorism 2 and 26. The single remedy addressed the entire psycho-somatic totality."
    },
    {
        id: "case_02",
        title: "Chronic Eczema and suppressed Asthma",
        principle: "Direction of Cure & Miasmatic Block (§70, §80)",
        patientProfile: "8-year-old female presenting with severe bronchial wheezing, dyspnea, and dry cough. History reveals she had severe atopic eczema on her elbows and knees which was treated and cleared with strong topical steroid creams 6 months ago.",
        symptomIntake: "Asthma worse at night in a warm bed. Highly irritable, warm-blooded, kicks covers off. Craves sweets and has a ravenous appetite at 11 AM. Dry skin with scratching until it bleeds.",
        analysis: "This is a classic case of suppression (Aphorism 70). The steroid cream suppressed the outer psoric expression (eczema) into the vital respiratory organ, causing asthma. To cure, the vital force must reverse this direction of cure: asthma must clear, and the skin eruption must temporarily return (Hering's Law).",
        remedySelection: "Sulphur 0/1 (LM potency), administered in daily succussed water doses to ensure a gentle action.",
        followUp: "Within 10 days, the child's chest felt completely clear and she stopped using her inhaler. Simultaneously, the eczema re-appeared on her elbows, itching intensely (confirming Hering's direction of cure). Sulphur was continued in LM potency.",
        outcome: "After 2 months, both the skin eruptions and the asthma cleared permanently. The chronic psoric load was resolved from the inside out."
    },
    {
        id: "case_03",
        title: "Migraine with Post-Concussion Syndrome",
        principle: "Etiology & Maintaining Cause (§5, §153)",
        patientProfile: "42-year-old female suffering from chronic, violent, throbbing migraines for the past 5 years. Standard analgesics and triptans provide no relief. Migraines started shortly after a major car accident where she sustained a concussion.",
        symptomIntake: "Throbbing pain starting in the occiput and spreading over the head. Worse from damp weather, lying down, and mental work. Better from cold applications. Mentally depressed, irritable, and dislikes consolation.",
        analysis: "The primary etiology is the old head injury (post-concussion syndrome). The peculiar characteristics are: occipital start, worse damp weather, and mental depression. Natrum Sulphuricum is the specific chronic remedy for head injuries and matches this modality profile.",
        remedySelection: "Natrum Sulphuricum 1M, single dry dose.",
        followUp: "Aggravation of head pain for 12 hours (homeopathic reaction), followed by deep, refreshing sleep. Over the next month, she experienced only one mild headache.",
        outcome: "At 6 months follow-up, the patient is completely free of migraines. The traumatic obstacle to the vital force was removed."
    }
];
// 5. ACTIVE RECALL EXERCISES
exports.ACTIVE_RECALL_EXERCISES = [
    {
        id: "ar_01",
        type: "mcq",
        difficulty: "beginner",
        category: "BHMS",
        question: "What is the primary mission of the physician according to Aphorism 1 of the Organon?",
        options: [
            "To construct elaborate theories of disease pathogenesis",
            "To prescribe multiple preventative vitamins",
            "To restore the sick to health, to cure",
            "To classify diseases under official ICD codes"
        ],
        correctAnswer: "2", // Index 2 (To restore...)
        explanation: "Aphorism 1 explicitly states: 'The physician's high and only mission is to restore the sick to health, to cure, as it is termed.'"
    },
    {
        id: "ar_02",
        type: "mcq",
        difficulty: "student",
        category: "BHMS",
        question: "Which edition of the Organon first introduced the Theory of Chronic Diseases and Miasms?",
        options: [
            "1st Edition (1810)",
            "3rd Edition (1824)",
            "4th Edition (1829)",
            "6th Edition (1921)"
        ],
        correctAnswer: "2", // Index 2 (4th Edition)
        explanation: "Hahnemann introduced his revolutionary theory of Chronic Diseases (Psora, Sycosis, Syphilis) in the 4th edition (1829) of the Organon."
    },
    {
        id: "ar_03",
        type: "mcq",
        difficulty: "practitioner",
        category: "MD",
        question: "In Aphorism 153, what types of symptoms does Hahnemann state we must chiefly focus on to find the homeopathic remedy?",
        options: [
            "Common pathognomonic symptoms of the disease",
            "General laboratory parameters and biopsy findings",
            "Striking, singular, uncommon, and peculiar (characteristic) symptoms",
            "Alternating symptoms of acute and chronic states"
        ],
        correctAnswer: "2",
        explanation: "Aphorism 153 highlights that striking, singular, uncommon, and peculiar (characteristic) signs and symptoms are the primary guides to the specific homeopathic remedy."
    },
    {
        id: "ar_04",
        type: "mcq",
        difficulty: "advanced",
        category: "Competitive",
        question: "What dilution and potentization scale is used for preparing the LM potencies described in Aphorism 270 of the 6th edition?",
        options: [
            "1:100 scale (Centesimal)",
            "1:10 scale (Decimal)",
            "1:50,000 scale (50-Millesimal)",
            "1:500 scale (Quinquagesimal)"
        ],
        correctAnswer: "2",
        explanation: "Aphorism 270 outlines the preparation of the LM (0/1, 0/2, etc.) potencies based on a 1:50,000 dilution ratio at each step."
    },
    {
        id: "ar_05",
        type: "true-false",
        difficulty: "beginner",
        category: "BHMS",
        question: "The 6th edition of the Organon permits the repetition of the remedy in liquid solution daily, provided the bottle is dynamically succussed before each dose.",
        correctAnswer: "True",
        explanation: "True. Aphorism 248 of the 6th edition explains that in water solutions, succussing the bottle before each dose alters the potency slightly, allowing the vital force to receive the stimulus daily without aggravation."
    },
    {
        id: "ar_06",
        type: "true-false",
        difficulty: "student",
        category: "BHMS",
        question: "According to Hahnemann, a physician is permitted to prescribe two complementary remedies simultaneously if the case is complex.",
        correctAnswer: "False",
        explanation: "False. Aphorisms 272-274 clearly outline the single remedy rule, forbidding the administration of more than one simple medicinal substance at a time."
    },
    {
        id: "ar_07",
        type: "flashcard",
        difficulty: "student",
        category: "BHMS",
        question: "Define 'Hering's Law of Cure' (Direction of Cure).",
        correctAnswer: "Cure progresses: 1. From above downwards; 2. From within outwards (from vital organs to skin/limbs); 3. In reverse chronological order of symptom appearance.",
        explanation: "Hering's Law explains that true recovery shifts pathology from vital internal spheres to superficial outer layers, signaling that the Vital Force is successfully throwing off the disease."
    },
    {
        id: "ar_08",
        type: "flashcard",
        difficulty: "practitioner",
        category: "MD",
        question: "What constitutes an 'Obstacle to Cure' according to Aphorism 4 and 260?",
        correctAnswer: "Factors in the patient's diet, hygiene, environment, or lifestyle that continuously irritate the vital force or maintain the disease (e.g., toxic exposures, coffee/alcohol abuse, damp living quarters, heavy stress).",
        explanation: "Hahnemann states the physician must detect and remove these maintaining causes, as even the most well-selected remedy cannot act permanently if the obstacles remain."
    }
];
// 6. TIMELINE STEPS
exports.TIMELINE_STEPS = [
    {
        edition: "1st Edition (1810)",
        year: "1810",
        concept: "Dose Size & Preparation",
        changeDescription: "Dilutions were relatively low and given as dry doses. Succussion and potentization concepts were in their infancy.",
        originalStance: "Medicines are administered in raw dilution, focusing on Similia matching to minimize toxic responses.",
        sixthEditionStance: "Medicines are highly potentized (up to LM scale) and given in dynamically succussed water solutions to avoid any physical aggravation."
    },
    {
        edition: "2nd Edition (1819)",
        year: "1819",
        concept: "Vital Force (Vital Principle)",
        changeDescription: "First introduction of the vital force concept, moving away from purely material explanation of disease.",
        originalStance: "Diseases are viewed as altered sensory-motor states of the nervous system.",
        sixthEditionStance: "Diseases are spiritual, dynamic derangements of the animating Vital Force, cured only by dynamic remedies."
    },
    {
        edition: "4th Edition (1829)",
        year: "1829",
        concept: "Chronic Disease Theory",
        changeDescription: "Introduction of Psora, Sycosis, and Syphilis as deep genetic miasms, changing chronic treatment strategies.",
        originalStance: "Chronic diseases are treated by matching current acute-like symptom pictures repeatedly.",
        sixthEditionStance: "Chronic diseases must be treated with anti-miasmatic remedies targeting the primary underlying miasm (chiefly Psora)."
    },
    {
        edition: "6th Edition (1842/1921)",
        year: "1921",
        concept: "LM Potencies & Liquid Dosing",
        changeDescription: "Transition to 1:50,000 dilution ratio (LM potencies) and succussed liquid repetition.",
        originalStance: "Dry globules of Centesimal potencies are given, waiting weeks or months before repeating the dose.",
        sixthEditionStance: "LM liquid doses are repeated daily or on alternate days, succussing the bottle before each dose to alter potency and optimize absorption."
    }
];
