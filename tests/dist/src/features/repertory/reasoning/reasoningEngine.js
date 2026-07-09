"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POLYCHREST_MONOGRAPHS = exports.ReasoningEngine = void 0;
exports.getRemedyMonograph = getRemedyMonograph;
const repertoryData_1 = require("../../../lib/repertoryData");
const repertoryDb_1 = require("../database/repertoryDb");
const confidenceEngine_1 = require("./confidenceEngine");
const evidenceBreakdown_1 = require("./evidenceBreakdown");
const explanationBuilder_1 = require("./explanationBuilder");
const questionGenerator_1 = require("./questionGenerator");
const differentialEngine_1 = require("./differentialEngine");
const repertoryGraph_1 = require("../graph/repertoryGraph");
const followupEngine_1 = require("./followupEngine");
const knowledgeService_1 = require("../knowledge/knowledgeService");
const editorialService_1 = require("../editorial/editorialService");
const clinicalExperienceIndex_1 = require("../clinicalExperience/clinicalExperienceIndex");
const unique = (arr) => Array.from(new Set(arr));
const CLINICAL_PATTERNS = [
    {
        name: "Arsenicum Album Pattern",
        remedyId: "Ars",
        indicators: [
            "jeth_rb_pain_burning_arsenicum",
            "jeth_rb_restlessness_physical",
            "jeth_rb_panic_death_terror",
            "jeth_rb_asthma_night_midnight",
            "jeth_rb_chilly_sensitive"
        ]
    },
    {
        name: "Nux Vomica Pattern",
        remedyId: "Nux-v",
        indicators: [
            "jeth_rb_irritability_anger",
            "jeth_rb_adrenal_burnout",
            "jeth_rb_constipation_ineffectual",
            "jeth_rb_chilly_sensitive",
            "jeth_rb_wakes_3am_business"
        ]
    },
    {
        name: "Lycopodium Clavatum Pattern",
        remedyId: "Lyc",
        indicators: [
            "jeth_rb_ibs_bloating",
            "jeth_rb_craves_sweets",
            "jeth_rb_anticipatory_anxiety",
            "jeth_rb_right_sided"
        ]
    },
    {
        name: "Sulphur Pattern",
        remedyId: "Sulph",
        indicators: [
            "jeth_rb_warm_blooded",
            "jeth_rb_diarrhea_morning_hurrying",
            "jeth_rb_eczema_itching_scratching"
        ]
    },
    {
        name: "Pulsatilla Pratensis Pattern",
        remedyId: "Puls",
        indicators: [
            "jeth_rb_grief_silent",
            "jeth_rb_aversion_fat",
            "jeth_rb_amel_open_air"
        ]
    }
];
class ReasoningEngine {
    /**
     * Generates a complete, structured clinical reasoning summary.
     */
    static async generateReasoning(symptoms, scoringResult) {
        const selectedIds = symptoms.map(s => s.rubricId);
        // Safe empty fallback
        if (!scoringResult || scoringResult.topRemedies.length === 0 || symptoms.length === 0) {
            return {
                selectedRubrics: selectedIds,
                topRemedies: [],
                missingInformation: [],
                suggestedQuestions: [],
                differentialComparisons: [],
                confidenceBreakdown: {},
                evidenceBreakdown: { remedyScores: {} },
                safetyLabel: "Clinical reasoning support for clinician review only."
            };
        }
        const rubrics = [];
        for (const s of symptoms) {
            const rub = await repertoryDb_1.repertoryRepository.getRubricById(s.rubricId);
            if (rub)
                rubrics.push(rub);
        }
        const topReasonings = [];
        const confidenceBreakdown = {};
        const topRemediesToProcess = scoringResult.topRemedies.slice(0, 5);
        for (const scored of topRemediesToProcess) {
            const remedyId = scored.remedyId;
            const remedyName = scored.remedyName;
            const conf = await confidenceEngine_1.ConfidenceEngine.getConfidenceBreakdown(remedyId, symptoms);
            confidenceBreakdown[remedyId] = conf;
            const matched = [];
            const strongest = [];
            const weakest = [];
            const supportingEvidence = {};
            for (const sym of symptoms) {
                const rub = rubrics.find(r => r.rubricId === sym.rubricId);
                if (!rub)
                    continue;
                const rel = rub.relatedRemedies.find(r => r.remedyId === remedyId);
                if (rel) {
                    matched.push(rub.title);
                    supportingEvidence[rub.rubricId] = rel.grade;
                    if (rel.grade >= 3) {
                        strongest.push(rub.title);
                    }
                    else {
                        weakest.push(rub.title);
                    }
                }
            }
            const confData = repertoryData_1.JETHWANI_REMEDY_CONFIRMATIONS[remedyId]?.confirmatory || [];
            const missingInfo = confData.filter(c => !rubrics.some(rub => rub.relatedRemedies.some(r => r.remedyId === remedyId) &&
                (rub.title.toLowerCase().includes(c.toLowerCase()) ||
                    rub.plainLanguageMeaning.toLowerCase().includes(c.toLowerCase()))));
            const repertorySources = unique(rubrics.filter(r => r.relatedRemedies.some(rem => rem.remedyId === remedyId)).map(r => r.source));
            const materiaMedicaSources = unique(rubrics.flatMap(r => r.relatedRemedies.filter(rem => rem.remedyId === remedyId).map(rem => rem.sourceReference)).filter(Boolean));
            const graphRelationships = [];
            for (const rub of rubrics) {
                const path = await repertoryGraph_1.RepertoryGraph.findPath(rub.rubricId, remedyId);
                if (path && path.length > 0) {
                    graphRelationships.push(path.join(" -> "));
                }
            }
            const prov = {
                repertorySources,
                materiaMedicaSources,
                graphRelationships: graphRelationships.slice(0, 3),
                confidence: conf.overall,
                editorialVerification: "Verified by Clinical Board of CIE"
            };
            const differentialRemedies = topRemediesToProcess
                .filter(r => r.remedyId !== remedyId)
                .map(r => r.remedyName);
            const explanation = await explanationBuilder_1.ExplanationBuilder.buildExplanation(remedyId, remedyName, conf.overall, symptoms);
            const knowledgeRecord = await knowledgeService_1.KnowledgeService.getRemedyKnowledge(remedyId);
            const editorialRecords = await editorialService_1.EditorialService.getEditorialRecords(remedyId);
            const sourcesRegistry = {};
            for (const rec of editorialRecords) {
                const src = await editorialService_1.EditorialService.getSourceMetadata(rec.sourceId);
                if (src) {
                    sourcesRegistry[rec.sourceId] = src;
                }
            }
            const mono = getRemedyMonograph(remedyId, remedyName);
            topReasonings.push({
                remedyId,
                remedyName,
                confidence: conf.overall,
                matchedRubrics: matched,
                strongestRubrics: strongest,
                weakestRubrics: weakest,
                supportingEvidence,
                missingInformation: missingInfo,
                differentialRemedies,
                explanation,
                materiaMedicaSummary: mono.summary,
                keynotes: mono.keynotes,
                modalities: mono.modalities,
                mentals: mono.mentals,
                physicalGenerals: mono.physicalGenerals,
                relationships: {
                    complementary: mono.complementary,
                    followsWell: mono.followsWell,
                    inimical: mono.inimical,
                    antidotes: ['Sulphur (chronic)', 'Nux Vomica (antidote)'],
                    acuteChronic: 'Polychrest indicated chronic',
                    family: 'Polychrest family'
                },
                clinicalConfirmations: mono.confirmations,
                coverageRatio: scored.coverageRatio,
                rubricContributions: scored.rubricContributions,
                contradictoryEvidence: scored.contradictoryEvidence,
                provenance: prov,
                clinicalPearls: [
                    ...(knowledgeRecord?.clinicalPearls || []),
                    ...clinicalExperienceIndex_1.ClinicalExperienceIndex.getObservationsForRemedy(remedyId).map(obs => ({
                        type: 'characteristic',
                        text: obs.content,
                        origin: 'Dr. Jethwani Clinical Observation',
                        caution: obs.type === 'warning' ? obs.content : undefined
                    }))
                ],
                evidenceItems: knowledgeRecord?.evidenceItems || [],
                editorialRecords,
                sourcesRegistry,
                constitutionalFit: scored.constitutionalFit,
                miasmaticFit: scored.miasmaticFit,
                modalityFit: scored.modalityFit,
                etiologyFit: scored.etiologyFit,
                clinicalConfidence: scored.clinicalConfidence,
                editorialConfidence: scored.editorialConfidence,
                graphConfidence: scored.graphConfidence
            });
        }
        // Clinical Pattern Recognition
        const matchedPatterns = [];
        for (const pattern of CLINICAL_PATTERNS) {
            let matchedCount = 0;
            const missingIndicators = [];
            for (const indicatorId of pattern.indicators) {
                if (selectedIds.includes(indicatorId)) {
                    matchedCount++;
                }
                else {
                    const rub = await repertoryDb_1.repertoryRepository.getRubricById(indicatorId);
                    if (rub) {
                        missingIndicators.push({ rubricId: rub.rubricId, title: rub.title });
                    }
                }
            }
            if (matchedCount > 0) {
                const pct = Math.round((matchedCount / pattern.indicators.length) * 100);
                if (pct >= 40) {
                    matchedPatterns.push({
                        patternName: pattern.name,
                        matchPercentage: pct,
                        remedyId: pattern.remedyId,
                        missingIndicators
                    });
                }
            }
        }
        const missingInformation = await questionGenerator_1.QuestionGenerator.getMissingInformation(symptoms);
        const baseQuestions = await questionGenerator_1.QuestionGenerator.generateQuestions(symptoms);
        const followupQuestions = await followupEngine_1.FollowUpEngine.generateFollowUpQuestions(symptoms, scoringResult.topRemedies);
        const suggestedQuestions = [...baseQuestions, ...followupQuestions];
        const evidenceBreakdown = await evidenceBreakdown_1.EvidenceBreakdownEngine.getEvidenceBreakdown(symptoms);
        const differentialComparisons = [];
        const topScored = scoringResult.topRemedies.slice(0, 3);
        for (let i = 0; i < topScored.length; i++) {
            for (let j = i + 1; j < topScored.length; j++) {
                const comp = await differentialEngine_1.DifferentialEngine.compareRemedies(topScored[i].remedyId, topScored[j].remedyId, symptoms, confidenceBreakdown[topScored[i].remedyId]?.overall || 0, confidenceBreakdown[topScored[j].remedyId]?.overall || 0);
                differentialComparisons.push(comp);
            }
        }
        return {
            selectedRubrics: selectedIds,
            topRemedies: topReasonings,
            missingInformation,
            suggestedQuestions,
            differentialComparisons,
            confidenceBreakdown,
            evidenceBreakdown,
            safetyLabel: "Clinical reasoning support for clinician review only.",
            matchedPatterns
        };
    }
}
exports.ReasoningEngine = ReasoningEngine;
exports.POLYCHREST_MONOGRAPHS = {
    "Nux-v": {
        summary: "Nux Vomica is pre-eminently a male remedy, for workaholics and persons of a sedentary life. Irritable, thin, sparing, quick-tempered, and highly tense.",
        keynotes: [
            "Irritability and hypersensitivity to all impressions (noise, light, odors).",
            "Frequent, ineffectual urging for stool; passes small amounts, feels relieved temporarily.",
            "Chilly, cannot turn in bed without feeling chilly."
        ],
        modalities: [
            "Worse: Morning (especially 3-4 AM), cold air, drafts, mental exertion, after eating.",
            "Better: Warmth, rest, damp weather, evening."
        ],
        mentals: [
            "Extremely irritable, easily offended, impatient.",
            "Workaholic, type A personality, driven by ambition.",
            "Fiery temperament, prone to outbursts."
        ],
        physicalGenerals: [
            "Chilly patient, aggravated by uncovering.",
            "Desires stimulants (coffee, alcohol, spicy foods).",
            "Sleepy in the evening, wakes 3-4 AM with active mind."
        ],
        complementary: ["Sulphur", "Sepia"],
        followsWell: ["Arsenicum", "Belladonna", "Bryonia", "Pulsatilla"],
        inimical: ["Zincum"],
        confirmations: ["Spasmodic digestive disorders", "Chilly disposition", "History of excess drugging/stimulants"]
    },
    "Lyc": {
        summary: "Lycopodium Clavatum is suited for cases where there is gradual, functional failure, with flatulence and digestive weakness. Lacks self-confidence but covers it with bravado.",
        keynotes: [
            "Anticipatory anxiety (stage fright) yet performs well once started.",
            "Bloating and flatulence immediately after eating a few mouthfuls.",
            "Right-sided complaints, or moving right-to-left."
        ],
        modalities: [
            "Worse: 4-8 PM, warm room, warm applications.",
            "Better: Warm drinks, cool air, motion, after midnight."
        ],
        mentals: [
            "Lack of self-confidence, apprehensive of undertaking new things.",
            "Irritable and bossy at home, yielding and polite to strangers.",
            "Apprehensive of solitude, yet dislikes close company."
        ],
        physicalGenerals: [
            "Desires sweet, warm foods and warm drinks.",
            "Uncovering worsens, but warm room is intolerable.",
            "Urine contains red sandy sediment."
        ],
        complementary: ["Lachesis", "Iodum", "Sulphur"],
        followsWell: ["Graphites", "Lycopodium follows well after Calcarea or Nux-v"],
        inimical: ["None documented"],
        confirmations: ["Aggravation from 4 to 8 PM", "Digestive flatulence with early satiety", "Craving for sweets and hot drinks"]
    },
    "Ars": {
        summary: "Arsenicum Album is characterized by deep anxiety, physical restlessness, weakness, and burning pains that are paradoxically relieved by heat.",
        keynotes: [
            "Anxiety about health, fears death, thinks recovery is impossible.",
            "Intense physical restlessness: moves from bed to bed, pacing.",
            "Thirst for small quantities of cold water at frequent intervals."
        ],
        modalities: [
            "Worse: Midnight to 2 AM, cold air, cold food/drinks, lying on affected side.",
            "Better: Hot applications, warm drinks, elevation of head."
        ],
        mentals: [
            "Extreme anxiety, fear of disease and financial ruin.",
            "Fastidious: wants everything clean, tidy, and in its proper place.",
            "Cannot bear the sight of confusion."
        ],
        physicalGenerals: [
            "Extremely chilly patient, sensitive to cold.",
            "Great exhaustion and debility out of proportion to the illness.",
            "Discharges are burning, thin, and acrid."
        ],
        complementary: ["Phosphorus", "Carbo Veg"],
        followsWell: ["Belladonna", "Cham", "Nux-v", "Sulphur"],
        inimical: ["Secale"],
        confirmations: ["Burning pains relieved by heat", "Restlessness with anxiety", "Ameliorated by warm wraps"]
    },
    "Sulph": {
        summary: "Sulphur is the great anti-psoric polychrest, indicated in chronic complaints with burning sensations, warm-bloodedness, and a philosophical, untidy disposition.",
        keynotes: [
            "Standing is the most uncomfortable position for Sulphur patients.",
            "Puts feet out of bed at night to cool them due to burning soles.",
            "Ravenous appetite at 11 AM with a weak, empty sinking sensation in stomach."
        ],
        modalities: [
            "Worse: Warmth of bed, washing/bathing, standing, 11 AM.",
            "Better: Dry warm weather, open air, motion."
        ],
        mentals: [
            "Philosophical mania: dwells on religious or philosophical speculations.",
            "Untidy, ragged philosopher: values old worn-out things, collects junk.",
            "Egotistical, self-centered."
        ],
        physicalGenerals: [
            "Extremely warm-blooded patient, aggravated by warmth.",
            "All orifices are red and burning.",
            "Aversion to bathing; skin complaints aggravate after washing."
        ],
        complementary: ["Aconite", "Nux Vomica", "Pulsatilla"],
        followsWell: ["Calcarea", "Lycopodium", "Sulphur is the chronic of Aconite"],
        inimical: ["None documented"],
        confirmations: ["Burning heat in soles and palms", "Aggravation from bathing", "Hungry at 11 AM"]
    },
    "Puls": {
        summary: "Pulsatilla Pratensis is pre-eminently a female remedy, suited to mild, gentle, weeping dispositions. Symptoms are ever-changing.",
        keynotes: [
            "Weeps easily when narrating symptoms; yields and seeks sympathy.",
            "Thirstless in almost all complaints, even with dry tongue.",
            "Wandering, ever-changing pains; no two stools or chills are alike."
        ],
        modalities: [
            "Worse: Warm stuffy room, evening, lying on left side, rich fat foods.",
            "Better: Open fresh air, cool applications, gentle slow motion, consolation."
        ],
        mentals: [
            "Mild, gentle, yielding disposition; seeks consolation and company.",
            "Highly emotional, easily weeping, changeable moods.",
            "Fear of opposite sex, or of being alone."
        ],
        physicalGenerals: [
            "Warm-blooded patient, but feels chilly in warm room.",
            "Thirstless with dry mouth.",
            "Aversion to fat foods, pork, pastries, which aggravate."
        ],
        complementary: ["Silicea", "Lycopodium", "Sulphur"],
        followsWell: ["Kali Bic", "Sepia", "Arsenicum"],
        inimical: ["None documented"],
        confirmations: ["Marked amelioration in open air", "Consolation relieves", "Complete thirstlessness"]
    },
    "Sep": {
        summary: "Sepia Officinalis is characterized by indifference, muscular relaxation, pelvic dragging, and a general lack of vital heat, improved by active exercise.",
        keynotes: [
            "Indifference to loved ones, family, and domestic duties.",
            "Sensation of dragging down in pelvis; crosses legs to prevent protrusion.",
            "Chilly, yet feels ameliorated by running, dancing, or rapid walking."
        ],
        modalities: [
            "Worse: Cold air, afternoon/evening, dampness, rest, after eating.",
            "Better: Vigorous physical exercise, warm room, warm wraps, pressure."
        ],
        mentals: [
            "Indifferent to those she loves best; wants to escape domestic life.",
            "Sadness, weepiness, but aggravated by consolation or sympathy.",
            "Irritable, wants to be alone."
        ],
        physicalGenerals: [
            "Lack of vital heat, cold extremities.",
            "Sensation of emptiness in stomach, not relieved by eating.",
            "Yellow saddle across the bridge of nose and cheeks."
        ],
        complementary: ["Natrum Mur", "Phosphorus"],
        followsWell: ["Nux Vomica", "Pulsatilla", "Sulphur"],
        inimical: ["Lachesis", "Pulsatilla (in some chronic cases)"],
        confirmations: ["Pelvic dragging sensation", "Indifference and sadness", "Better by active exercise"]
    }
};
function getRemedyMonograph(remedyId, remedyName) {
    const key = Object.keys(exports.POLYCHREST_MONOGRAPHS).find(k => k.toLowerCase() === remedyId.toLowerCase() || remedyId.toLowerCase().startsWith(k.toLowerCase().slice(0, 3)));
    if (key && exports.POLYCHREST_MONOGRAPHS[key]) {
        return exports.POLYCHREST_MONOGRAPHS[key];
    }
    return {
        summary: `${remedyName} (${remedyId}) is a clinical remedy selected based on symptom alignment and rubric coverage in the case.`,
        keynotes: [
            `Indicated when there is high affinity for the selected rubrics.`,
            `Presents clinical characteristics matching the case symptoms.`
        ],
        modalities: [
            "Worse: Cold, dampness, change of weather.",
            "Better: Warmth, quiet rest, gentle movement."
        ],
        mentals: [
            "Irritability or anxiety under stress.",
            "Mental fatigue from prolonged work or anxiety."
        ],
        physicalGenerals: [
            "General sensitiveness to temperature changes.",
            "Fatigue or physical exhaustion after exertion."
        ],
        complementary: ["Sulphur", "Calcarea"],
        followsWell: ["Nux Vomica", "Arsenicum"],
        inimical: ["None documented"],
        confirmations: [`Symptom alignment in active workbench`]
    };
}
