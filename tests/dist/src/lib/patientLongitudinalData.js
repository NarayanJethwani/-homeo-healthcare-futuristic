"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PATIENT_LONGITUDINAL_DATA = void 0;
exports.PATIENT_LONGITUDINAL_DATA = {
    aarav: {
        id: 1,
        name: "Aarav Sharma",
        constitution: "Phosphorus",
        miasm: "Sycosis (Dominant) & Syphilitic (Sub-acute)",
        thermal: "Chilly",
        cravings: "Cold water, spicy food, salt",
        aversions: "Sweets, warm food",
        vitalityIndex: 68,
        diseaseBurdenIndex: 58,
        history: [
            { date: "2024-03-15", type: "Diagnosis", event: "Type 2 Diabetes Mellitus diagnosed", notes: "HbA1c 7.8%. Placed on Metformin 500mg BD." },
            { date: "2024-06-20", type: "Lab", event: "Creatinine: 1.4 mg/dL, eGFR: 58 mL/min (Stage 3a CKD)", notes: "Urinary microalbuminuria detected (120 mg/g)." },
            { date: "2024-09-10", type: "Remedy", event: "Lycopodium Clavatum 200C prescribed", notes: "Indicated by flatulence, 4-8 PM worsening, warm drinks craving." },
            { date: "2024-12-05", type: "Clinical", event: "Fatigue worsening, bilateral ankle edema", notes: "eGFR dropped to 52 mL/min. Metformin dose reduced." },
            { date: "2025-03-01", type: "Remedy", event: "Apis Mellifica 30C + Serum Anguillae 6X", notes: "Bilateral renal support, puffiness under eyes, thirstless." },
            { date: "2025-06-10", type: "Lab", event: "Creatinine: 1.6 mg/dL, eGFR: 49 mL/min (Stage 3b CKD)", notes: "HbA1c stabilized at 6.9%. Edema reduced." }
        ],
        labs: {
            timeline: ["2024-03-15", "2024-06-20", "2024-09-10", "2024-12-05", "2025-03-01", "2025-06-10"],
            creatinine: [1.1, 1.4, 1.45, 1.55, 1.5, 1.6],
            egfr: [78, 58, 55, 51, 53, 49],
            hba1c: [7.8, 7.5, 7.2, 7.4, 7.0, 6.9],
            microalbumin: [45, 120, 140, 190, 160, 150]
        },
        symptoms: [
            { name: "Generalized fatigue", severity: "Moderate", modalities: "Worse in morning", organAffinity: "Renal/Nervous" },
            { name: "Bilateral ankle edema", severity: "Mild", modalities: "Worse standing", organAffinity: "Renal/Circulatory" },
            { name: "Flatulence & bloating", severity: "Moderate", modalities: "Worse 4-8 PM, better warm drinks", organAffinity: "Digestive" },
            { name: "Frequent nocturnal urination", severity: "Severe", modalities: "Worse 2-5 AM", organAffinity: "Urinary" }
        ],
        miasmaticIndex: { psora: 45, sycosis: 65, syphilis: 50 },
        remedyMatches: [
            { name: "Lycopodium Clavatum", score: 88, status: "Active Constitutional", keyEvidence: "Right-sided bloating, 4-8 PM aggravation, desires warm drinks." },
            { name: "Serum Anguillae", score: 85, status: "Active Organ Support", keyEvidence: "Direct affinity for renal glomeruli under severe metabolic load." },
            { name: "Apis Mellifica", score: 80, status: "Active Symptomatic", keyEvidence: "Bilateral puffiness, thirstless state, worse standing or warm environments." }
        ],
        predictiveRisks: [
            { id: "ckd", name: "CKD Progression", level: "High Risk", val: 82, color: "text-rose-500", driver: "eGFR decline rate & microalbuminuria", modifiable: "Dietary sodium & blood sugar management" },
            { id: "neuropathy", name: "Diabetic Neuropathy", level: "Moderate Risk", val: 55, color: "text-amber-500", driver: "Long-standing glycemic fluctuation", modifiable: "HbA1c tight control & exercise" },
            { id: "cvd", name: "Cardiovascular Stroke", level: "Moderate Risk", val: 48, color: "text-amber-500", driver: "Sedentary job & hypertensive spikes", modifiable: "Weight reduction & aerobic conditioning" }
        ],
        ostmSystems: [
            { name: "Renal Filtration (Kidneys)", status: "Compensated Degraded", color: "text-amber-500" },
            { name: "Pancreatic Endocrine (Insulin)", status: "Active Stabilized", color: "text-emerald-500" },
            { name: "Digestive Absorption (Gut)", status: "Active Congested", color: "text-amber-500" }
        ],
        cohortPercentiles: { ageCohort: 74, remedyCohort: 86, regionalPercentile: 91 }
    },
    priya: {
        id: 2,
        name: "Priya Patel",
        constitution: "Pulsatilla",
        miasm: "Psora (Dominant)",
        thermal: "Hot / Warm-blooded",
        cravings: "Cold food, ice cream, sour things",
        aversions: "Fatty foods, warm drinks",
        vitalityIndex: 74,
        diseaseBurdenIndex: 42,
        history: [
            { date: "2024-05-10", type: "Clinical", event: "Irregular cycles, hirsutism, weight gain", notes: "Suspected PCOS. Ultrasound ordered." },
            { date: "2024-06-02", type: "Lab", event: "TSH: 6.2 uIU/mL, LH/FSH ratio: 2.8", notes: "Subclinical Hypothyroidism and PCOS confirmed." },
            { date: "2024-08-15", type: "Remedy", event: "Pulsatilla Nigricans 30C prescribed", notes: "Indicated by mild temperament, thirstlessness, open air relief." },
            { date: "2024-11-20", type: "Lab", event: "TSH: 7.8 uIU/mL (Rising)", notes: "Fatigue increasing. Thyroxin 25mcg recommended but patient prefers homeopathy." },
            { date: "2025-02-12", type: "Remedy", event: "Thyroidinum 3X + Calcarea Carbonica 200C", notes: "Intercurrent remedies for sluggish metabolism and thyroid focus." },
            { date: "2025-05-28", type: "Lab", event: "TSH: 4.8 uIU/mL (Improving)", notes: "Cycle regularized to 34 days, fatigue reduced, energy improving." }
        ],
        labs: {
            timeline: ["2024-06-02", "2024-08-15", "2024-11-20", "2025-02-12", "2025-05-28"],
            tsh: [6.2, 6.5, 7.8, 5.9, 4.8],
            lh_fsh_ratio: [2.8, 2.7, 2.5, 1.9, 1.4],
            cholesterol: [220, 225, 240, 215, 205],
            weight_kg: [76, 77.2, 79.5, 77.8, 75.2]
        },
        symptoms: [
            { name: "Irregular menses", severity: "Severe", modalities: "Delayed, scanty, painful", organAffinity: "Endocrine/Reproductive" },
            { name: "Weight gain & sluggishness", severity: "Moderate", modalities: "Worse cold, damp weather", organAffinity: "Metabolic/Thyroid" },
            { name: "Emotional mood swings", severity: "Moderate", modalities: "Better consolation and open air", organAffinity: "Nervous" },
            { name: "Mild hirsutism", severity: "Mild", modalities: "Constant", organAffinity: "Integumentary" }
        ],
        miasmaticIndex: { psora: 75, sycosis: 40, syphilis: 15 },
        remedyMatches: [
            { name: "Pulsatilla Nigricans", score: 92, status: "Active Constitutional", keyEvidence: "Thirstless with dry mouth, mild/yielding temper, ameliorated in cool open air." },
            { name: "Thyroidinum", score: 86, status: "Active Organ Support", keyEvidence: "Affinity for sluggish metabolism, subclinical hypothyroidism triggers." },
            { name: "Calcarea Carbonica", score: 82, status: "Active Intercurrent", keyEvidence: "Constitutional dampness, tendency to gain weight, cold extremities." }
        ],
        predictiveRisks: [
            { id: "diabetes", name: "Type 2 Diabetes Risk", level: "Moderate Risk", val: 58, color: "text-amber-500", driver: "LH/FSH insulin link & weight gain", modifiable: "Low GI diet, physical conditioning" },
            { id: "thyroid", name: "Hypothyroidism Severity", level: "Moderate Risk", val: 52, color: "text-amber-500", driver: "TSH rising pattern to 7.8", modifiable: "Thyroidinum support, stress regulation" },
            { id: "metabolic", name: "Metabolic Syndrome", level: "Low Risk", val: 35, color: "text-emerald-500", driver: "Hypercholesterolemia (240 max)", modifiable: "Regular exercise & lipid detox" }
        ],
        ostmSystems: [
            { name: "Thyroid Gland (T3/T4)", status: "De-compensated Subclinical", color: "text-rose-500" },
            { name: "Ovarian Gland (Cycle rhythm)", status: "Compensated Improving", color: "text-emerald-500" }
        ],
        cohortPercentiles: { ageCohort: 81, remedyCohort: 90, regionalPercentile: 79 }
    },
    elena: {
        id: 3,
        name: "Elena Rostova",
        constitution: "Silicea",
        miasm: "Syphilitic (Dominant) & Psoric (Sub-acute)",
        thermal: "Chilly",
        cravings: "Warm water, warm soup, spices",
        aversions: "Cold food, ice",
        vitalityIndex: 64,
        diseaseBurdenIndex: 62,
        history: [
            { date: "2024-04-12", type: "Clinical", event: "Symmetrical joint stiffness, fatigue", notes: "Chilly patient, sweat on palms, suspect RA." },
            { date: "2024-07-18", type: "Lab", event: "RF: Positive, Anti-CCP: 85, ESR: 45 mm/hr", notes: "Rheumatoid Arthritis diagnosed. Standard DMARDs advised but refused." },
            { date: "2024-10-22", type: "Remedy", event: "Silicea 200C prescribed", notes: "Cold patient, slow resolution of nodes, chilly sensitivity." },
            { date: "2025-01-20", type: "Lab", event: "ESR: 58 mm/hr, CRP: 18.5 mg/L", notes: "Active flare-up due to cold damp winter. Joint pain score 7/10." },
            { date: "2025-03-15", type: "Remedy", event: "Rhus Toxicodendron 30C + Causticum 30C", notes: "For joint pain, stiffness relieved by heat and continuous motion." },
            { date: "2025-06-02", type: "Lab", event: "CRP: 8.2 mg/L, Joint Pain: 4/10", notes: "Stiffness duration reduced from 3 hours to 30 mins. Energy improving." }
        ],
        labs: {
            timeline: ["2024-07-18", "2024-10-22", "2025-01-20", "2025-03-15", "2025-06-02"],
            esr: [45, 48, 58, 52, 38],
            crp: [12.4, 14.1, 18.5, 12.0, 8.2],
            anticcp: [85, 87, 85, 82, 79],
            painScore: [6, 6.5, 8.0, 6.0, 4.0]
        },
        symptoms: [
            { name: "Morning joint stiffness", severity: "Severe", modalities: "Worse waking, better warm bath", organAffinity: "Musculoskeletal" },
            { name: "Joint swelling & pain", severity: "Severe", modalities: "Worse cold damp, better dry heat", organAffinity: "Musculoskeletal" },
            { name: "Extreme chilly state", severity: "Moderate", modalities: "Worse drafts, better warm wraps", organAffinity: "Thermoregulation" },
            { name: "Dryness of eyes & mouth", severity: "Mild", modalities: "Worse wind", organAffinity: "Mucosal" }
        ],
        miasmaticIndex: { psora: 30, sycosis: 20, syphilis: 70 },
        remedyMatches: [
            { name: "Silicea Terra", score: 90, status: "Active Constitutional", keyEvidence: "Cold, chilly, sweat of palms, slow tissue changes, nodes." },
            { name: "Rhus Toxicodendron", score: 85, status: "Active Acute Support", keyEvidence: "Joint stiffness relieved by motion and warm applications, worse cold damp." },
            { name: "Causticum", score: 81, status: "Active Symptomatic", keyEvidence: "Drawing muscular pains, joint contractures, worse clear fine weather." }
        ],
        predictiveRisks: [
            { id: "ra_flare", name: "Joint Flare Relapse", level: "High Risk", val: 76, color: "text-rose-500", driver: "Anti-CCP autoantibodies & ESR slope", modifiable: "Thermal protection & anti-inflammatory diet" },
            { id: "sjogren", name: "Secondary Sjogren", level: "Moderate Risk", val: 50, color: "text-amber-500", driver: "Mucosal dryness indices & auto-immune triggers", modifiable: "Hydration & local protection" },
            { id: "osteopenia", name: "Steroid Osteopenia", level: "Low Risk", val: 24, color: "text-emerald-500", driver: "Calcium levels & exercise tracking", modifiable: "Regular weight bearing physiotherapy" }
        ],
        ostmSystems: [
            { name: "Joint Synovium (Articular)", status: "Active Inflamed", color: "text-rose-500" },
            { name: "Thermoregulation (Autonomic)", status: "Compensated Chilly", color: "text-amber-500" }
        ],
        cohortPercentiles: { ageCohort: 68, remedyCohort: 92, regionalPercentile: 84 }
    },
    default: {
        id: 99,
        name: "General Twin",
        constitution: "Sulphur",
        miasm: "Psora (Dominant)",
        thermal: "Warm-blooded",
        cravings: "Sweets, cold drinks",
        aversions: "Fats, warm drinks",
        vitalityIndex: 75,
        diseaseBurdenIndex: 45,
        history: [
            { date: "2024-03-01", type: "Clinical", event: "Initial consultation & assessment", notes: "Case taking reveals psoric baseline, functional complaints." },
            { date: "2024-06-12", type: "Remedy", event: "Sulphur 30C prescribed", notes: "Symptom improvement verified. Metabolic score stabilized." },
            { date: "2024-10-05", type: "Lab", event: "Follow-up blood panel run", notes: "Lipid profile shows minor elevation. Remedy adjusted." }
        ],
        labs: {
            timeline: ["2024-03-01", "2024-06-12", "2024-10-05"],
            cholesterol: [220, 215, 205],
            sugar: [110, 105, 98]
        },
        symptoms: [
            { name: "Digestive gas & flatulence", severity: "Moderate", modalities: "Worse after eating, better warm water", organAffinity: "Digestive" },
            { name: "Morning lethargy", severity: "Mild", modalities: "Worse waking up, better movement", organAffinity: "Nervous" }
        ],
        miasmaticIndex: { psora: 60, sycosis: 30, syphilis: 10 },
        remedyMatches: [
            { name: "Sulphur", score: 85, status: "Active Constitutional", keyEvidence: "Warm blooded, red orifices, morning diarrhea, skin irritations." },
            { name: "Nux Vomica", score: 72, status: "Active Acute Support", keyEvidence: "Sedentary profile, high irritability, chilly draft sensitivities." }
        ],
        predictiveRisks: [
            { id: "metabolic", name: "Metabolic Syndrome", level: "Low Risk", val: 32, color: "text-emerald-500", driver: "Glycemic stability", modifiable: "Regular exercises" }
        ],
        ostmSystems: [
            { name: "Pancreatic Endocrine", status: "Compensated", color: "text-emerald-500" }
        ],
        cohortPercentiles: { ageCohort: 55, remedyCohort: 60, regionalPercentile: 58 }
    }
};
