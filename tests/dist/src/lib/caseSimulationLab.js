"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VIRTUAL_PATIENTS = void 0;
exports.evaluateCaseSubmission = evaluateCaseSubmission;
const caseIntelligence_1 = require("./caseIntelligence");
/**
 * 5 Pre-configured Clinical Case Scenarios representing classical constitutions.
 */
exports.VIRTUAL_PATIENTS = [
    {
        id: "pat_psoric_child",
        caseTitle: "Case of a 6-year-old with Severe Skin Eruptions",
        age: 6,
        gender: "Male",
        presentingComplaint: "Eczematous skin patches on the neck, hands, and behind the ears. Intense itching, scratches until it bleeds and burns.",
        caseHistory: "The child is dirty in appearance and dislikes bathing. Eruptions are highly aggravated by the warmth of the bed at night. Clinically, the child has an empty, sinking feeling in the stomach around 11 AM and craves sweets and spices. He is hot-blooded, wants to uncover his feet in bed.",
        hiddenAffinities: ["Skin", "Stomach"],
        correctRubrics: [
            "Skin; Eruptions; scratch, until it bleeds",
            "Skin; Eruptions; warmth of bed, agg.",
            "Stomach; Emptiness; 11 AM",
            "Generals; Sweets; desires"
        ],
        correctRemedyId: "rem_sulphur",
        correctPotency: "200C",
        miasmaticBase: "Psora"
    },
    {
        id: "pat_tubercular_teen",
        caseTitle: "Case of a 17-year-old with Recurrent Chest Catch",
        age: 17,
        gender: "Female",
        presentingComplaint: "Recurrent dry, irritating chest cough, followed by rapid weight loss and severe emaciation despite a huge appetite.",
        caseHistory: "The patient is extremely restless, constantly desires to travel or change surroundings, and cannot remain in one class or place. She suffers from profuse night sweats around the head and neck. Highly sensitive to cold damp weather. Miasmatic assessment suggests deep tubercular load.",
        hiddenAffinities: ["Lungs", "Skin"],
        correctRubrics: [
            "Mind; Travel; desire to",
            "Generals; Emaciation; appetite, with increased",
            "Sleep; Perspiration; neck, on",
            "Generals; Weather; cold damp, agg."
        ],
        correctRemedyId: "rem_calcarea", // Calcarea Carbonica is antipsoric/tubercular or we can match Phosphorus/Calc-phos, but Calc-carb represents neck sweat keynote.
        correctPotency: "1M",
        miasmaticBase: "Tubercular"
    },
    {
        id: "pat_arsenicum_anxiety",
        caseTitle: "Case of a 45-year-old with Nocturnal Panic Attacks",
        age: 45,
        gender: "Female",
        presentingComplaint: "Sudden waking between 12 AM and 1 AM with intense chest constriction, panic of death, and physical restlessness.",
        caseHistory: "The patient walks from room to room or bed to bed during panic. She is extremely fastidious, requires absolute order in the clinic, and is highly chilly. Pain is described as burning, but is paradoxically relieved by warm applications or hot drinks. Thirsts for small sips of warm water frequently.",
        hiddenAffinities: ["Nervous System", "Heart", "Stomach"],
        correctRubrics: [
            "Mind; Restlessness; midnight, after",
            "Mind; Fastidious",
            "Mind; Fear; death, of",
            "Generals; Thirst; small quantities, for, frequently"
        ],
        correctRemedyId: "rem_arsenicum",
        correctPotency: "200C",
        miasmaticBase: "Psora-Syphilis"
    },
    {
        id: "pat_lycopodium_exec",
        caseTitle: "Case of a 50-year-old Corporate Executive with Dyspepsia",
        age: 50,
        gender: "Male",
        presentingComplaint: "Severe abdominal bloating and flatulence. Satiety and fullness occur after eating just a few mouthfuls.",
        caseHistory: "The patient is highly authoritative and dictatorial at work but suffers from hidden anticipatory stage fright before board meetings. Symptoms lateralize right-sided and are highly aggravated from 4 PM to 8 PM. He craves warm food and sweets. Chilly overall.",
        hiddenAffinities: ["Digestive Axis", "Brain"],
        correctRubrics: [
            "Stomach; Distension; eating, after, immediately",
            "Mind; Dictatorial",
            "Mind; Anxiety; anticipatory",
            "Generals; Modalities; 4 PM - 8 PM, agg."
        ],
        correctRemedyId: "rem_lycopodium",
        correctPotency: "30C", // Executive needs lower gentler digestive activation first
        miasmaticBase: "Psora-Sycosis"
    },
    {
        id: "pat_natrum_grief",
        caseTitle: "Case of a 30-year-old Grieving Mother with Migraines",
        age: 30,
        gender: "Female",
        presentingComplaint: "Chronic splitting, hammer-like migraines starting at 10 AM, accompanied by absolute social withdrawal.",
        caseHistory: "The patient lost her husband 2 years ago and has suppressed her grief, refusing to cry or discuss it. Consolation from family members violently irritates her. She desires solitude, craves table salt directly, and is highly aggravated by exposure to the summer sun.",
        hiddenAffinities: ["Brain", "Heart", "Mucous Membranes"],
        correctRubrics: [
            "Mind; Grief; silent / suppressed",
            "Mind; Consolation; agg.",
            "Head; Pain; morning, 10 AM",
            "Generals; Food; salt, desires"
        ],
        correctRemedyId: "rem_natrum_mur",
        correctPotency: "1M", // Grief requires high constitutional dynamic potency
        miasmaticBase: "Sycosis-Syphilis"
    }
];
/**
 * Evaluates student selections against virtual patient cases.
 */
function evaluateCaseSubmission(patientId, submission) {
    let patient;
    if (patientId.startsWith("case_")) {
        const idx = parseInt(patientId.split("_")[1], 10) - 1;
        const simCase = (0, caseIntelligence_1.getSimulatedCase)(idx);
        let miasm = "Psora";
        if (simCase.correctRemedyId === "rem_lycopodium")
            miasm = "Psora-Sycosis";
        else if (simCase.correctRemedyId === "rem_nat_mur")
            miasm = "Sycosis-Syphilis";
        else if (simCase.correctRemedyId === "rem_arsenicum")
            miasm = "Psora-Syphilis";
        else if (simCase.correctRemedyId === "rem_lachesis")
            miasm = "Sycosis";
        else if (simCase.correctRemedyId === "rem_calcarea")
            miasm = "Tubercular";
        else if (simCase.correctRemedyId === "rem_pulsatilla")
            miasm = "Psora";
        else if (simCase.correctRemedyId === "rem_gelsemium")
            miasm = "Psora";
        else if (simCase.correctRemedyId === "rem_bryonia")
            miasm = "Psora";
        patient = {
            id: simCase.id,
            caseTitle: `${simCase.name} (${simCase.category})`,
            age: simCase.age,
            gender: simCase.gender,
            presentingComplaint: `${simCase.category} constitutional case study.`,
            caseHistory: simCase.narrative,
            hiddenAffinities: [],
            correctRubrics: simCase.keyRubrics,
            correctRemedyId: simCase.correctRemedyId,
            correctPotency: simCase.correctPotency,
            miasmaticBase: miasm
        };
    }
    else {
        patient = exports.VIRTUAL_PATIENTS.find(p => p.id === patientId);
    }
    if (!patient) {
        throw new Error(`Patient with ID ${patientId} not found.`);
    }
    const isCorrectRemedy = submission.selectedRemedyId === patient.correctRemedyId;
    const isCorrectPotency = submission.selectedPotency === patient.correctPotency;
    // Calculate rubric matching score
    const submissionRubricsSet = new Set(submission.extractedRubrics.map(r => r.toLowerCase()));
    let matchedRubricCount = 0;
    patient.correctRubrics.forEach((rub) => {
        // Check if any selected rubric contains the keyword
        const key = rub.toLowerCase();
        const hasMatch = Array.from(submissionRubricsSet).some(subRub => subRub.includes(key) || key.includes(subRub));
        if (hasMatch)
            matchedRubricCount++;
    });
    const rubricScore = patient.correctRubrics.length > 0
        ? (matchedRubricCount / patient.correctRubrics.length) * 100
        : 100;
    // Calculate overall grade
    let score = 0;
    if (isCorrectRemedy)
        score += 50;
    if (isCorrectPotency)
        score += 20;
    score += Math.round(rubricScore * 0.3);
    // Generate detailed clinical feedback
    let rubricFeedback = "";
    if (matchedRubricCount === patient.correctRubrics.length) {
        rubricFeedback = "Excellent! You extracted all critical constitutional keynotes and rubrics.";
    }
    else if (matchedRubricCount > 0) {
        rubricFeedback = `Partially correct. You mapped ${matchedRubricCount} out of ${patient.correctRubrics.length} keynotes. You missed: ${patient.correctRubrics.filter((r) => !submission.extractedRubrics.includes(r)).join(", ")}.`;
    }
    else {
        rubricFeedback = "Incorrect rubric extraction. Study the patient case file for keynote modalities, food desires, and times.";
    }
    const remedyFeedback = isCorrectRemedy
        ? `Correct Remedy choice! The case essence matches the constitutional picture of ${patient.correctRemedyId.replace("rem_", "").toUpperCase()}.`
        : `Incorrect Remedy. Your choice does not cover the miasmatic base (${patient.miasmaticBase}) or key modalities. The correct remedy is ${patient.correctRemedyId.replace("rem_", "").toUpperCase()}.`;
    const potencyFeedback = isCorrectPotency
        ? `Correct Potency (${submission.selectedPotency}). This matches clinical guidelines for ${patient.miasmaticBase} susceptibility.`
        : `Potency discrepancy. You selected ${submission.selectedPotency}, but the recommended option is ${patient.correctPotency}. High emotional shock/grief requires 1M; physical/skin layers respond better to 200C.`;
    // Hering's Law analysis based on potency and remedy match
    let heringsDirectionAnalysis = "";
    if (isCorrectRemedy && isCorrectPotency) {
        heringsDirectionAnalysis = "Prognosis Excellent: Cure is expected to proceed from within outward, from head to foot, and symptoms will disappear in the reverse order of their appearance (Hering's Law). Watch for temporary skin discharge or aggravation.";
    }
    else if (isCorrectRemedy) {
        heringsDirectionAnalysis = "Prognosis Guarded: Remedy choice is correct, but incorrect potency selection increases the risk of a primary aggravation or sluggish response.";
    }
    else {
        heringsDirectionAnalysis = "No curative direction initiated due to incorrect remedy prescription.";
    }
    return {
        patientId,
        extractedRubrics: submission.extractedRubrics,
        selectedRemedyId: submission.selectedRemedyId,
        selectedPotency: submission.selectedPotency,
        isCorrectRemedy,
        isCorrectPotency,
        score,
        feedback: {
            rubricRelevance: rubricFeedback,
            remedyJustification: remedyFeedback,
            potencyJustification: potencyFeedback,
            heringsDirectionAnalysis
        }
    };
}
