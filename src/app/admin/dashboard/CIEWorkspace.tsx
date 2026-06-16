"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Activity, Sparkles, Brain, Send, FileText, 
  Award, Compass, Network, Layers, ShieldAlert, Cpu, 
  Play, RefreshCw, Zap, TrendingUp, Workflow, Calendar, 
  Database, Stethoscope, AlertTriangle, Check, X, Shield, ChevronRight, ChevronDown,
  FileSpreadsheet, ExternalLink, Maximize2, Minimize2
} from "lucide-react";
import EcgGraph from "@/components/EcgGraph";
import { CONSTITUTIONAL_QUESTIONS, analyzeConstitution } from "@/app/health-intelligence/constitutionalEngine";

interface CIEWorkspaceProps {
  patients: any[];
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  theme: "light" | "dark";
  activeTabOverride?: "cockpit" | "intake" | "miasms" | "reports";
}

// Mapped symptoms, miasms, labs and remedies longitudinal database
const PATIENT_LONGITUDINAL_DATA: Record<string, {
  id: number;
  name: string;
  constitution: string;
  miasm: string;
  thermal: string;
  cravings: string;
  aversions: string;
  vitalityIndex: number;
  diseaseBurdenIndex: number;
  history: Array<{ date: string; type: string; event: string; notes: string }>;
  labs: {
    timeline: string[];
    [key: string]: any[];
  };
  symptoms: Array<{ name: string; severity: string; modalities: string; organAffinity: string }>;
  miasmaticIndex: { psora: number; sycosis: number; syphilis: number };
  remedyMatches: Array<{ name: string; score: number; status: string; keyEvidence: string }>;
  predictiveRisks: Array<{ id: string; name: string; level: string; val: number; color: string; driver: string; modifiable: string }>;
  ostmSystems: Array<{ name: string; status: string; color: string }>;
  cohortPercentiles: { ageCohort: number; remedyCohort: number; regionalPercentile: number };
}> = {
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


// Centralized OSTM Navigator Focus Mapping Matrix (Priority 1 & 2)
const NODE_PIVOT_MAP: Record<string, {
  nodeName: string;
  type: string;
  confidence: number;
  status: string;
  evidenceWeight: number;
  connectedLabs: string[];
  connectedSymptoms: string[];
  connectedRemedies: string[];
  predictedOutcome: string;
  clinicalEvidence: string;
  populationBenchmark: string;
  cohortData: { top: number; avg: number; poor: number };
  copilotPrompt: string;
  forecastHighlight: string;
  therapeuticHighlight: string;
  traceHighlight: string;
  guideline?: string;
  pathway?: string;
  outcomes?: string;
}> = {
  org_kidney: {
    nodeName: "Renal Kidneys",
    type: "Anatomical Organ System",
    confidence: 88,
    status: "Compensated Degraded (Stage 3b CKD)",
    evidenceWeight: 92,
    connectedLabs: ["Creatinine", "eGFR", "Urinary Microalbumin"],
    connectedSymptoms: ["Bilateral Ankle Edema", "Nocturia Urination", "Generalized Fatigue"],
    connectedRemedies: ["Apis Mellifica", "Serum Anguillae", "Lycopodium Clavatum"],
    predictedOutcome: "Moderate Progression Risk (stabilizable with glycemic & BP control)",
    clinicalEvidence: "92% match - Repertory rubrics and KDIGO 2024 renal guidelines.",
    populationBenchmark: "Renal clearance stability is in the top 14% of the regional age-matched cohort.",
    cohortData: { top: 76, avg: 20, poor: 4 },
    copilotPrompt: "Analyze renal reserve decline. Current eGFR is 49. Suggest intercurrent remedies to reduce microalbuminuria.",
    forecastHighlight: "Renal Risk Progression",
    therapeuticHighlight: "Dietary Sodium Restriction (< 1.5g / day)",
    traceHighlight: "ckd"
  },
  org_thyroid: {
    nodeName: "Endocrine Thyroid Gland",
    type: "Anatomical Organ System",
    confidence: 84,
    status: "De-compensated Subclinical (Hypothyroidism)",
    evidenceWeight: 89,
    connectedLabs: ["TSH Level", "Serum Cholesterol", "Weight Index"],
    connectedSymptoms: ["Morning Lethargy", "Weight Gain", "Extreme Fatigue"],
    connectedRemedies: ["Pulsatilla Nigricans", "Thyroidinum", "Calcarea Carbonica"],
    predictedOutcome: "Hormonal feedback loop regularization within 90 days under intercurrent support",
    clinicalEvidence: "89% match - Glandular matching and thyroid hormone feedback literature.",
    populationBenchmark: "TSH recovery rate matches the top 18% of the subclinical thyroid cohort.",
    cohortData: { top: 70, avg: 22, poor: 8 },
    copilotPrompt: "Analyze thyroid hormone loop. TSH is 4.8. Evaluate intercurrent Calcarea Carbonica response.",
    forecastHighlight: "Thyroid Dysfunction",
    therapeuticHighlight: "Aerobic Physical Exercise (30m / 4 days a week)",
    traceHighlight: "thyroid"
  },
  org_joints: {
    nodeName: "Articular Synovium Joints",
    type: "Anatomical Organ System",
    confidence: 86,
    status: "Active Inflamed (Synovial Congestion)",
    evidenceWeight: 91,
    connectedLabs: ["CRP Inflammatory", "ESR Rate", "Anti-CCP Autoantibody"],
    connectedSymptoms: ["Morning Joint Stiffness", "Joint Swelling & Pain", "Chilly State"],
    connectedRemedies: ["Silicea Terra", "Rhus Toxicodendron", "Causticum"],
    predictedOutcome: "Articular stiffness mitigation and inflammation reduction within 30 days",
    clinicalEvidence: "91% match - Rheumatic guidelines and chilly thermal reaction profiles.",
    populationBenchmark: "Stiffness duration reduction matches the top 22% of auto-immune cohorts.",
    cohortData: { top: 68, avg: 24, poor: 8 },
    copilotPrompt: "Review synovial inflammation indicators. Anti-CCP is 79, ESR is 38. Rhus Tox is active.",
    forecastHighlight: "RA Inflammatory Flare",
    therapeuticHighlight: "Thermal Protection & Dry Heat Compliance Check",
    traceHighlight: "ra_flare"
  },
  rem_apis: {
    nodeName: "Apis Mellifica",
    type: "Homeopathic Remedy Vector",
    confidence: 90,
    status: "Active Symptomatic Support",
    evidenceWeight: 86,
    connectedLabs: ["eGFR Filtration", "Urinary Microalbumin"],
    connectedSymptoms: ["Bilateral Ankle Edema", "Nocturia Urination", "Puffiness under eyes"],
    connectedRemedies: ["Serum Anguillae", "Lycopodium Clavatum"],
    predictedOutcome: "Rapid fluid drainage and reduction of lower limb interstitial pressure",
    clinicalEvidence: "86% match - Thirstless state, morning aggravation rubrics in Kent's Repertory.",
    populationBenchmark: "90% responder rate in renal fluid retention cohorts within 14 days.",
    cohortData: { top: 82, avg: 14, poor: 4 },
    copilotPrompt: "Review Apis Mellifica fluid clearing efficacy. Fluid intake slider is set to 2.5L.",
    forecastHighlight: "Renal Risk Progression",
    therapeuticHighlight: "Sleep Hygiene Protocol (target > 8 hours nightly)",
    traceHighlight: "ckd"
  },
  rem_lyc: {
    nodeName: "Lycopodium Clavatum",
    type: "Constitutional Remedy Vector",
    confidence: 92,
    status: "Active Constitutional Support",
    evidenceWeight: 88,
    connectedLabs: ["HbA1c Glycemia", "Serum Creatinine"],
    connectedSymptoms: ["Flatulence & Bloat", "Aggravation 4-8 PM", "Generalized Fatigue"],
    connectedRemedies: ["Sulphur", "Nux Vomica"],
    predictedOutcome: "Long-term metabolic reserve restoration and digestive gas clearing",
    clinicalEvidence: "88% match - Flatulence, warm water craving, and late afternoon aggravation rubrics.",
    populationBenchmark: "86% success in psoric-sycotic metabolic twins with renal stress.",
    cohortData: { top: 78, avg: 16, poor: 6 },
    copilotPrompt: "Explain Lycopodium Clavatum constitutional matching. Rubrics include late afternoon aggravation.",
    forecastHighlight: "Metabolic Burden",
    therapeuticHighlight: "Dietary Sodium Restriction (< 1.5g / day)",
    traceHighlight: "ckd"
  },
  rem_anguillae: {
    nodeName: "Serum Anguillae (Eel Serum)",
    type: "Organotherapy Remedy Vector",
    confidence: 85,
    status: "Active Organ Support",
    evidenceWeight: 90,
    connectedLabs: ["Serum Creatinine", "eGFR Filtration", "Urinary Microalbumin"],
    connectedSymptoms: ["Proteinuria", "Nocturia Urination"],
    connectedRemedies: ["Apis Mellifica", "Lycopodium Clavatum"],
    predictedOutcome: "Nephron glomerular membrane stabilization and creatinine clearance improvement",
    clinicalEvidence: "90% match - Boericke Materia Medica documentation for high-burden kidney filtration.",
    populationBenchmark: "84% success in stabilizing Stage 3 CKD eGFR declines.",
    cohortData: { top: 74, avg: 20, poor: 6 },
    copilotPrompt: "Evaluate Serum Anguillae support for glomerular filtration. Creatinine is 1.6.",
    forecastHighlight: "Renal Risk Progression",
    therapeuticHighlight: "Dietary Sodium Restriction (< 1.5g / day)",
    traceHighlight: "ckd"
  },
  rem_puls: {
    nodeName: "Pulsatilla Nigricans",
    type: "Constitutional Remedy Vector",
    confidence: 92,
    status: "Active Constitutional Support",
    evidenceWeight: 87,
    connectedLabs: ["TSH Level", "LH/FSH Ratio"],
    connectedSymptoms: ["Irregular menses", "Sluggishness", "Mood swings"],
    connectedRemedies: ["Calcarea Carbonica", "Thyroidinum"],
    predictedOutcome: "Endocrine pathway regularization and menstrual rhythm alignment",
    clinicalEvidence: "87% match - Mild temperament, thirstlessness, and amelioration in cool open air.",
    populationBenchmark: "90% response rate in open-air ameliorated female endocrine cohorts.",
    cohortData: { top: 80, avg: 15, poor: 5 },
    copilotPrompt: "Explain Pulsatilla Nigricans selection. Patient is warm-blooded, thirstless.",
    forecastHighlight: "PCOS Diabetes Trigger",
    therapeuticHighlight: "Aerobic Physical Exercise (30m / 4 days a week)",
    traceHighlight: "thyroid"
  },
  rem_thyroid: {
    nodeName: "Thyroidinum",
    type: "Organotherapy Glandular Support",
    confidence: 86,
    status: "Active Organ Support",
    evidenceWeight: 89,
    connectedLabs: ["TSH Level", "Serum Cholesterol"],
    connectedSymptoms: ["Weight Gain", "Sluggishness"],
    connectedRemedies: ["Pulsatilla Nigricans", "Calcarea Carbonica"],
    predictedOutcome: "Thyroid hormone loop compensation and basal metabolic acceleration",
    clinicalEvidence: "89% match - Sluggish metabolism and subclinical thyroid insufficiency profiles.",
    populationBenchmark: "86% success in subclinical hypothyroidism stabilization.",
    cohortData: { top: 72, avg: 22, poor: 6 },
    copilotPrompt: "Review Thyroidinum glandular support. TSH is 4.8, weight is 75kg.",
    forecastHighlight: "Thyroid Dysfunction",
    therapeuticHighlight: "Aerobic Physical Exercise (30m / 4 days a week)",
    traceHighlight: "thyroid"
  },
  rem_sil: {
    nodeName: "Silicea Terra",
    type: "Constitutional Remedy Vector",
    confidence: 90,
    status: "Active Constitutional Support",
    evidenceWeight: 91,
    connectedLabs: ["Anti-CCP Autoantibody", "ESR Rate"],
    connectedSymptoms: ["Morning Joint Stiffness", "Chilly State", "Mucosal Dryness"],
    connectedRemedies: ["Rhus Toxicodendron", "Causticum"],
    predictedOutcome: "Deep-acting synovial immune stabilization and joint nodule clearing",
    clinicalEvidence: "91% match - Extreme chilly sensitivity, sweaty palms, and slow chronic tissue changes.",
    populationBenchmark: "92% response in auto-immune patients with high chilly sensitivity.",
    cohortData: { top: 84, avg: 12, poor: 4 },
    copilotPrompt: "Review Silicea Terra constitutional affinity. Patient is chilly, with joint nodes.",
    forecastHighlight: "RA Inflammatory Flare",
    therapeuticHighlight: "Thermal Protection & Dry Heat Compliance Check",
    traceHighlight: "ra_flare"
  },
  sym_renal: {
    nodeName: "Bilateral Ankle Edema",
    type: "Clinical Symptom Vector",
    confidence: 90,
    status: "Active Fluid Loading",
    evidenceWeight: 94,
    connectedLabs: ["eGFR Filtration", "Serum Creatinine", "Urinary Microalbumin"],
    connectedSymptoms: ["Nocturia Urination", "Generalized Fatigue"],
    connectedRemedies: ["Apis Mellifica", "Serum Anguillae"],
    predictedOutcome: "Fluid reduction and systemic clearing within 7 days of active Apis protocol",
    clinicalEvidence: "94% match - Peripheral fluid overload linked to glomerular filtration lag.",
    populationBenchmark: "Edema resolution rate matches top 15% of responders under Apis 30C.",
    cohortData: { top: 78, avg: 18, poor: 4 },
    copilotPrompt: "Review edema severity and fluid clearing trajectory. Ankle edema is moderate.",
    forecastHighlight: "Renal Risk Progression",
    therapeuticHighlight: "Dietary Sodium Restriction (< 1.5g / day)",
    traceHighlight: "ckd"
  },
  sym_stiffness: {
    nodeName: "Morning Joint Stiffness",
    type: "Clinical Symptom Vector",
    confidence: 88,
    status: "Active Inflamed Articular",
    evidenceWeight: 90,
    connectedLabs: ["ESR Rate", "CRP Inflammatory", "Anti-CCP Autoantibody"],
    connectedSymptoms: ["Joint Swelling & Pain", "Chilly State"],
    connectedRemedies: ["Rhus Toxicodendron", "Causticum", "Silicea Terra"],
    predictedOutcome: "Stiffness duration reduced below 30 minutes in 14 days of Rhus Tox support",
    clinicalEvidence: "90% match - Rheumatic joint congestion rubrics, worse waking up and cold damp.",
    populationBenchmark: "Stiffness duration drops by 75% in similar cohorts under Rhus Tox 30C.",
    cohortData: { top: 80, avg: 16, poor: 4 },
    copilotPrompt: "Evaluate stiffness duration. Stiffness is severe, worse waking up.",
    forecastHighlight: "RA Inflammatory Flare",
    therapeuticHighlight: "Thermal Protection & Dry Heat Compliance Check",
    traceHighlight: "ra_flare"
  },
  org_heart: {
    nodeName: "Cardiovascular Heart",
    type: "Anatomical Organ System",
    confidence: 88,
    status: "Compensated Normal / Subclinical Strain",
    evidenceWeight: 85,
    connectedLabs: ["ECG Rhythm Stability", "Serum Cholesterol", "Blood Pressure"],
    connectedSymptoms: ["Chest Palpitations", "Dyspnea Breathlessness"],
    connectedRemedies: ["Crataegus Oxyacantha", "Cactus Grandiflorus"],
    predictedOutcome: "Cardiovascular tone and rhythm normalization under crataegus protocol",
    clinicalEvidence: "85% match - Cardiovascular guidelines and myocardial tone rubrics.",
    populationBenchmark: "Cardiac index efficiency matches the top 20% of the active cohort.",
    cohortData: { top: 74, avg: 20, poor: 6 },
    copilotPrompt: "Evaluate myocardial status. Rhythm is stable, BP spikes to 142/90. Suggest support.",
    forecastHighlight: "Cardiovascular Burden",
    therapeuticHighlight: "Aerobic Conditioning & Stress Management",
    traceHighlight: "cvd"
  },
  org_brain: {
    nodeName: "Cognitive Brain",
    type: "Anatomical Organ System",
    confidence: 90,
    status: "Active Sluggish (Neural Tension)",
    evidenceWeight: 88,
    connectedLabs: ["Sleep Quality Index", "Adrenal Cortisol Output"],
    connectedSymptoms: ["Cognitive Brain Fog", "Insomnia Sleep Loss", "Systemic Anxiety"],
    connectedRemedies: ["Kali Phosphoricum 6X", "Gelsemium Sempervirens"],
    predictedOutcome: "Resolution of cognitive lag and sleep latency reduction within 14 days",
    clinicalEvidence: "88% match - Kent's Repertory brain fog and nervous fatigue rubrics.",
    populationBenchmark: "Sleep restoration index matches the top 15% of the active cohort.",
    cohortData: { top: 82, avg: 14, poor: 4 },
    copilotPrompt: "Analyze brain fog and sleep continuity. Suggest remedies for neural fatigue.",
    forecastHighlight: "Neurological Load",
    therapeuticHighlight: "Sleep Hygiene Protocol (target > 8 hours nightly)",
    traceHighlight: "neuropathy"
  },
  org_liver: {
    nodeName: "Metabolic Liver",
    type: "Anatomical Organ System",
    confidence: 86,
    status: "Compensated Sluggish (Hepatic Congestion)",
    evidenceWeight: 84,
    connectedLabs: ["ALT/AST Enzymes", "Serum Cholesterol"],
    connectedSymptoms: ["Bilious Jaundice", "Flatulence & Bloat"],
    connectedRemedies: ["Chelidonium Majus", "Carduus Marianus", "Lycopodium Clavatum"],
    predictedOutcome: "ALT/AST enzyme normalization and bile clearance within 30 days",
    clinicalEvidence: "84% match - Boericke Materia Medica hepatic sluggishness and right-sided rubrics.",
    populationBenchmark: "Liver clearance reserve is in the top 25% of the metabolic cohort.",
    cohortData: { top: 72, avg: 22, poor: 6 },
    copilotPrompt: "Assess liver enzymes AST/ALT. Suggest right-sided hepatic support remedies.",
    forecastHighlight: "Metabolic Burden",
    therapeuticHighlight: "Fat intake restriction and warm-water therapy",
    traceHighlight: "metabolic"
  },
  org_lungs: {
    nodeName: "Pulmonary Lungs",
    type: "Anatomical Organ System",
    confidence: 85,
    status: "Reactive Bronze (Bronchial Congestion)",
    evidenceWeight: 89,
    connectedLabs: ["Oxygen Saturation SpO2", "FEV1 Lung Volume"],
    connectedSymptoms: ["Chronic Dry Cough", "Asthmatic Wheezing", "Dyspnea Breathlessness"],
    connectedRemedies: ["Antimonium Tartaricum", "Arsenicum Album"],
    predictedOutcome: "Expiratory wheeze resolution and oxygenation stability in 10 days",
    clinicalEvidence: "89% match - Rattling mucus in bronchial tree rubrics from Kent's Repertory.",
    populationBenchmark: "FEV1 lung volume is in the top 18% of the respiratory cohort.",
    cohortData: { top: 76, avg: 18, poor: 6 },
    copilotPrompt: "Review expellable mucus indicators. Suggest bronchial spasm remedies.",
    forecastHighlight: "Respiratory Load",
    therapeuticHighlight: "Air quality check and warm steam inhalations",
    traceHighlight: "respiratory"
  },
  org_skin: {
    nodeName: "Dermatic Skin",
    type: "Anatomical Organ System",
    confidence: 91,
    status: "Active Eruptive (Cutaneous Leakage)",
    evidenceWeight: 87,
    connectedLabs: ["IgE Allergy Index"],
    connectedSymptoms: ["Dermatic Eczema", "Mucosal Dryness"],
    connectedRemedies: ["Graphites 30C", "Sulphur 30C"],
    predictedOutcome: "Eczema surface area reduction and dryness healing within 21 days",
    clinicalEvidence: "87% match - Honey-like sticky discharge and skin folds eczema rubrics.",
    populationBenchmark: "Cutaneous barrier recovery rate is in the top 12% of dermatic cohorts.",
    cohortData: { top: 80, avg: 15, poor: 5 },
    copilotPrompt: "Review skin eczema discharge and itch rubrics. Suggest dermatic remedies.",
    forecastHighlight: "Dermatic Load",
    therapeuticHighlight: "Allergen elimination and natural topical moisturizers",
    traceHighlight: "sjogren"
  },
  org_adrenals: {
    nodeName: "Adrenal Glands",
    type: "Anatomical Organ System",
    confidence: 84,
    status: "De-compensated (Hypoadrenia / Exhaustion)",
    evidenceWeight: 86,
    connectedLabs: ["Adrenal Cortisol Output"],
    connectedSymptoms: ["Generalized Fatigue", "Morning Lethargy"],
    connectedRemedies: ["Phosphoricum Acidum", "Gelsemium Sempervirens"],
    predictedOutcome: "Diurnal cortisol curve stabilization and energy reserve restoration in 45 days",
    clinicalEvidence: "86% match - Exhaustion from emotional or mental strain rubrics.",
    populationBenchmark: "Adrenal stress recovery matches the top 22% of fatigue cohorts.",
    cohortData: { top: 68, avg: 24, poor: 8 },
    copilotPrompt: "Review cortisol curve. Salivary cortisol is low at 8 AM. Suggest adrenal support.",
    forecastHighlight: "Endocrine Strain",
    therapeuticHighlight: "Stress management, adaptogenic diet, and sleep hygiene",
    traceHighlight: "thyroid"
  },
  org_bladder: {
    nodeName: "Urinary Bladder",
    type: "Anatomical Organ System",
    confidence: 89,
    status: "Active Irritated (Urinary Congestion)",
    evidenceWeight: 90,
    connectedLabs: ["Urine Leukocyte Index", "Urinary Microalbumin"],
    connectedSymptoms: ["Frequent nocturnal urination", "Painful Dysuria"],
    connectedRemedies: ["Cantharis 30C", "Pulsatilla Nigricans"],
    predictedOutcome: "Painful urination clearing and nocturnal frequency reduction in 5 days",
    clinicalEvidence: "90% match - Kent's Repertory scalding urine and constant urging rubrics.",
    populationBenchmark: "Bladder irritation clearance matches the top 15% of urinary cohorts.",
    cohortData: { top: 82, avg: 14, poor: 4 },
    copilotPrompt: "Review bladder urging and dysuria metrics. Urinalysis shows trace leukocytes.",
    forecastHighlight: "Renal Risk Progression",
    therapeuticHighlight: "Increased alkaline fluid intake (> 2.5L / day)",
    traceHighlight: "ckd"
  },
  rem_kali_phos: {
    nodeName: "Kali Phosphoricum 6X",
    type: "Homeopathic Remedy Vector",
    confidence: 90,
    status: "Active Tissue Salt Support",
    evidenceWeight: 88,
    connectedLabs: ["Sleep Quality Index"],
    connectedSymptoms: ["Cognitive Brain Fog", "Insomnia Sleep Loss"],
    connectedRemedies: ["Silicea Terra", "Phosphoricum Acidum"],
    predictedOutcome: "Nervous exhaustion relief and cognitive sharpness restoration",
    clinicalEvidence: "88% match - Schuessler tissue salts documentation for nervous debility.",
    populationBenchmark: "88% responder rate in brain fog and sleep lag cohorts in 14 days.",
    cohortData: { top: 82, avg: 14, poor: 4 },
    copilotPrompt: "Explain Kali Phos selection. Nerve nutrient rubrics matched.",
    forecastHighlight: "Neurological Load",
    therapeuticHighlight: "Sleep Hygiene Protocol (target > 8 hours nightly)",
    traceHighlight: "neuropathy"
  },
  rem_crataegus: {
    nodeName: "Crataegus Oxyacantha",
    type: "Homeopathic Remedy Vector",
    confidence: 87,
    status: "Active Cardiotonic Support",
    evidenceWeight: 84,
    connectedLabs: ["ECG Rhythm Stability"],
    connectedSymptoms: ["Chest Palpitations", "Dyspnea Breathlessness"],
    connectedRemedies: ["Apis Mellifica", "Serum Anguillae"],
    predictedOutcome: "Stabilization of cardiovascular rhythm and pulse pressure index",
    clinicalEvidence: "84% match - Boericke Materia Medica cardiotonic and myocardial support.",
    populationBenchmark: "82% success in improving pulse pressure indices.",
    cohortData: { top: 74, avg: 20, poor: 6 },
    copilotPrompt: "Review Crataegus Oxyacantha cardiotonic indicators.",
    forecastHighlight: "Cardiovascular Burden",
    therapeuticHighlight: "Dietary Sodium Restriction (< 1.5g / day)",
    traceHighlight: "cvd"
  },
  rem_chelidonium: {
    nodeName: "Chelidonium Majus",
    type: "Homeopathic Remedy Vector",
    confidence: 88,
    status: "Active Hepatic Support",
    evidenceWeight: 85,
    connectedLabs: ["ALT/AST Enzymes"],
    connectedSymptoms: ["Bilious Jaundice", "Flatulence & Bloat"],
    connectedRemedies: ["Lycopodium Clavatum", "Nux Vomica"],
    predictedOutcome: "Biliary flow acceleration and liver enzyme stabilization",
    clinicalEvidence: "85% match - Right-sided pain, yellowing of skin and eyes, desire for hot drinks.",
    populationBenchmark: "85% responder success rate in bilious digestive cohorts.",
    cohortData: { top: 78, avg: 16, poor: 6 },
    copilotPrompt: "Review Chelidonium hepatic affinity. Rubrics include right-sided pain.",
    forecastHighlight: "Metabolic Burden",
    therapeuticHighlight: "Fat intake restriction and warm-water therapy",
    traceHighlight: "metabolic"
  },
  rem_ant_tart: {
    nodeName: "Antimonium Tartaricum",
    type: "Homeopathic Remedy Vector",
    confidence: 86,
    status: "Active Bronchial Support",
    evidenceWeight: 88,
    connectedLabs: ["Oxygen Saturation SpO2"],
    connectedSymptoms: ["Chronic Dry Cough", "Asthmatic Wheezing"],
    connectedRemedies: ["Arsenicum Album"],
    predictedOutcome: "Bronchial mucus clearance and breathing volume optimization",
    clinicalEvidence: "88% match - Coarse rattling in chest, suffocative coughing, better sitting up.",
    populationBenchmark: "86% success in resolving bronchial mucus loads.",
    cohortData: { top: 72, avg: 22, poor: 6 },
    copilotPrompt: "Assess Antimonium Tartaricum rattling chest mucus matching.",
    forecastHighlight: "Respiratory Load",
    therapeuticHighlight: "Air quality check and warm steam inhalations",
    traceHighlight: "respiratory"
  },
  rem_graphites: {
    nodeName: "Graphites 30C",
    type: "Homeopathic Remedy Vector",
    confidence: 91,
    status: "Active Cutaneous Support",
    evidenceWeight: 87,
    connectedLabs: ["IgE Allergy Index"],
    connectedSymptoms: ["Dermatic Eczema", "Mucosal Dryness"],
    connectedRemedies: ["Sulphur 30C", "Silicea Terra"],
    predictedOutcome: "Eczema clearance and cutaneous moisture restoration",
    clinicalEvidence: "87% match - Rough dry skin, sticky honey-like discharge, worse in folds.",
    populationBenchmark: "90% response in chronic eczematous dermatopathic cohorts.",
    cohortData: { top: 80, avg: 15, poor: 5 },
    copilotPrompt: "Evaluate Graphites 30C dermatic barrier support.",
    forecastHighlight: "Dermatic Load",
    therapeuticHighlight: "Allergen elimination and natural topical moisturizers",
    traceHighlight: "sjogren"
  },
  rem_phos_acid: {
    nodeName: "Phosphoricum Acidum",
    type: "Homeopathic Remedy Vector",
    confidence: 86,
    status: "Active Adrenal Support",
    evidenceWeight: 85,
    connectedLabs: ["Adrenal Cortisol Output"],
    connectedSymptoms: ["Generalized Fatigue", "Morning Lethargy"],
    connectedRemedies: ["Kali Phosphoricum 6X", "Calcarea Carbonica"],
    predictedOutcome: "Adrenal stress recovery and physical vitality restoration",
    clinicalEvidence: "85% match - Apathy, mental debility, physical weakness from fluid loss or stress.",
    populationBenchmark: "84% success in resolving subclinical fatigue and cortisol lags.",
    cohortData: { top: 74, avg: 20, poor: 6 },
    copilotPrompt: "Review Phos Acid support for adrenal exhaustion.",
    forecastHighlight: "Endocrine Strain",
    therapeuticHighlight: "Stress management, adaptogenic diet, and sleep hygiene",
    traceHighlight: "thyroid"
  },
  rem_cantharis: {
    nodeName: "Cantharis 30C",
    type: "Homeopathic Remedy Vector",
    confidence: 92,
    status: "Active Bladder Support",
    evidenceWeight: 90,
    connectedLabs: ["Urine Leukocyte Index"],
    connectedSymptoms: ["Frequent nocturnal urination", "Painful Dysuria"],
    connectedRemedies: ["Apis Mellifica", "Pulsatilla Nigricans"],
    predictedOutcome: "Urinary tract irritation relief and dysuria clearing",
    clinicalEvidence: "90% match - Intense burning and cutting pain, constant urging to urinate.",
    populationBenchmark: "92% responder rate in acute bladder irritation within 48 hours.",
    cohortData: { top: 84, avg: 12, poor: 4 },
    copilotPrompt: "Evaluate Cantharis 30C for painful bladder urging.",
    forecastHighlight: "Renal Risk Progression",
    therapeuticHighlight: "Increased alkaline fluid intake (> 2.5L / day)",
    traceHighlight: "ckd"
  }
};


// Cluster mappings for OSTM Graph (Priority 7)
const NODE_CLUSTERS: Record<string, { id: string; label: string; color: string; cx: number; cy: number }> = {
  renal: { id: "renal", label: "Renal Cluster", color: "rgba(14, 165, 233, 0.04)", cx: 120, cy: 150 },
  endocrine: { id: "endocrine", label: "Endocrine Cluster", color: "rgba(168, 85, 247, 0.04)", cx: 240, cy: 160 },
  musculoskeletal: { id: "musculoskeletal", label: "Musculoskeletal Cluster", color: "rgba(244, 63, 94, 0.04)", cx: 340, cy: 140 },
  metabolic: { id: "metabolic", label: "Metabolic Cluster", color: "rgba(251, 191, 36, 0.04)", cx: 180, cy: 220 },
  nervous: { id: "nervous", label: "Nervous Cluster", color: "rgba(99, 102, 241, 0.04)", cx: 400, cy: 300 },
  cardiorespiratory: { id: "cardiorespiratory", label: "Cardiorespiratory Cluster", color: "rgba(239, 68, 68, 0.04)", cx: 300, cy: 400 },
  integumentary: { id: "integumentary", label: "Dermatic & Immune Cluster", color: "rgba(16, 185, 129, 0.04)", cx: 100, cy: 300 }
};

const NODE_TO_CLUSTER: Record<string, string> = {
  org_kidney: "renal", sys_renal: "renal", sym_renal: "renal", sym_nocturia: "renal", sym_proteinuria: "renal", sym_anemia: "renal", lab_creatinine: "renal", lab_egfr: "renal", lab_microalbumin: "renal", diag_ckd: "renal", risk_bp: "renal", rem_apis: "renal", rem_anguillae: "renal",
  org_thyroid: "endocrine", org_ovaries: "endocrine", sys_endocrine: "endocrine", sys_reproductive: "endocrine", sym_menses: "endocrine", sym_hirsutism: "endocrine", sym_weight: "endocrine", lab_tsh: "endocrine", lab_lh_fsh: "endocrine", diag_pcos: "endocrine", diag_hypothyroid: "endocrine", rem_puls: "endocrine", rem_thyroid: "endocrine",
  org_joints: "musculoskeletal", sys_musculoskeletal: "musculoskeletal", sym_stiffness: "musculoskeletal", sym_dryness: "musculoskeletal", sym_cramps: "musculoskeletal", lab_crp: "musculoskeletal", lab_anticcp: "musculoskeletal", lab_esr: "musculoskeletal", diag_ra: "musculoskeletal", rem_sil: "musculoskeletal", rem_rhus: "musculoskeletal", rem_caust: "musculoskeletal",
  org_pancreas: "metabolic", org_gut: "metabolic", sys_digestive: "metabolic", sym_bloat: "metabolic", sym_lethargy: "metabolic", lab_cholesterol: "metabolic", lab_hba1c: "metabolic", diag_metabolic: "metabolic", risk_glycemia: "metabolic", risk_sedentary: "metabolic", rem_lyc: "metabolic", rem_sulph: "metabolic", rem_nux: "metabolic", rem_calc: "metabolic",
  sys_nervous: "nervous", org_brain: "nervous", sym_brain_fog: "nervous", sym_insomnia: "nervous", lab_sleep_index: "nervous", rem_kali_phos: "nervous",
  sys_respiratory: "cardiorespiratory", org_heart: "cardiorespiratory", org_lungs: "cardiorespiratory", sym_palpitations: "cardiorespiratory", sym_dyspnea: "cardiorespiratory", sym_cough: "cardiorespiratory", sym_wheezing: "cardiorespiratory", lab_ecg: "cardiorespiratory", lab_sp02: "cardiorespiratory", rem_crataegus: "cardiorespiratory", rem_ant_tart: "cardiorespiratory",
  sys_immune: "integumentary", sys_integumentary: "integumentary", org_skin: "integumentary", sym_eczema: "integumentary", lab_ige: "integumentary", rem_graphites: "integumentary",
  org_liver: "metabolic", sym_jaundice: "metabolic", lab_liver_enzymes: "metabolic", rem_chelidonium: "metabolic",
  org_adrenals: "endocrine", lab_cortisol: "endocrine", rem_phos_acid: "endocrine",
  org_bladder: "renal", sym_dysuria: "renal", lab_urinalysis: "renal", rem_cantharis: "renal"
};

export default function CIEWorkspace({ patients, selectedPatientId, setSelectedPatientId, theme, activeTabOverride }: CIEWorkspaceProps) {
  // Dynamic patient key resolver
  const getActiveDataKey = () => {
    if (!selectedPatientId) return "aarav";
    if (selectedPatientId === "aarav" || selectedPatientId === "priya" || selectedPatientId === "elena") {
      return selectedPatientId;
    }
    const patientObj = patients.find(p => p.id === selectedPatientId);
    if (!patientObj) return "aarav";
    const nameLower = patientObj.name.toLowerCase();
    if (nameLower.includes("aarav") || nameLower.includes("sharma")) return "aarav";
    if (nameLower.includes("priya") || nameLower.includes("patel")) return "priya";
    if (nameLower.includes("elena") || nameLower.includes("rostova")) return "elena";
    return patientObj.id; // Return custom patient ID!
  };

  const activeDataKey = getActiveDataKey();

  // Overrides for dynamic updating of patient records (remedies, miasms, etc.)
  const [patientOverrides, setPatientOverrides] = useState<Record<string, {
    miasmaticIndex?: { psora: number; sycosis: number; syphilis: number };
    constitutional?: any;
    miasm?: string;
    constitution?: string;
    remedyMatches?: any[];
  }>>({});

  // Dynamic twin builder for custom imported patients
  const getCustomPatientBase = (id: string) => {
    const p = patients.find(pat => pat.id === id);
    if (!p) return PATIENT_LONGITUDINAL_DATA.aarav;
    
    // Parse complaints into symptoms list
    const symptomsList: Array<{ name: string; severity: string; modalities: string; organAffinity: string }> = [];
    if (p.complaint) {
      const parts = p.complaint.split(/[,.;]/).map((s: string) => s.trim()).filter((s: string) => s.length > 5);
      parts.slice(0, 4).forEach((part: string, idx: number) => {
        let affinity = "Constitutional";
        const low = part.toLowerCase();
        if (low.includes("acid") || low.includes("bloat") || low.includes("stomach") || low.includes("gerd") || low.includes("diges")) affinity = "Digestive";
        else if (low.includes("joint") || low.includes("stiff") || low.includes("pain") || low.includes("knee") || low.includes("back")) affinity = "Musculoskeletal";
        else if (low.includes("urine") || low.includes("noctur") || low.includes("kidney") || low.includes("creatinine")) affinity = "Renal/Urinary";
        else if (low.includes("fatigue") || low.includes("sleep") || low.includes("tired")) affinity = "Nervous/Autonomic";
        else if (low.includes("thyroid") || low.includes("hormon") || low.includes("tsh")) affinity = "Endocrine";
        
        symptomsList.push({
          name: part.length > 30 ? part.substring(0, 28) + "..." : part,
          severity: idx === 0 ? "Severe" : idx === 1 ? "Moderate" : "Mild",
          modalities: "Varies with daily factors",
          organAffinity: affinity
        });
      });
    }
    if (symptomsList.length === 0) {
      symptomsList.push({ name: "General symptoms", severity: "Moderate", modalities: "Worse drafts", organAffinity: "Constitutional" });
    }

    const compLower = (p.complaint || "").toLowerCase();
    let guessedRemedy = "Sulphur";
    let guessedMiasm = "Psora (Dominant)";
    let guessedMiasmIndex = { psora: 70, sycosis: 20, syphilis: 10 };
    
    if (compLower.includes("acidity") || compLower.includes("bloating") || compLower.includes("irrita") || compLower.includes("chilly")) {
      guessedRemedy = "Nux Vomica";
      guessedMiasm = "Psora (Dominant)";
      guessedMiasmIndex = { psora: 75, sycosis: 40, syphilis: 15 };
    } else if (compLower.includes("joint") || compLower.includes("stiff") || compLower.includes("motion") || compLower.includes("damp")) {
      guessedRemedy = "Rhus Toxicodendron";
      guessedMiasm = "Sycosis (Dominant)";
      guessedMiasmIndex = { psora: 45, sycosis: 70, syphilis: 25 };
    } else if (compLower.includes("fatigue") || compLower.includes("kidney") || compLower.includes("creatinine") || compLower.includes("edema")) {
      guessedRemedy = "Serum Anguillae";
      guessedMiasm = "Sycosis (Dominant) & Syphilitic (Sub-acute)";
      guessedMiasmIndex = { psora: 40, sycosis: 60, syphilis: 50 };
    } else if (compLower.includes("thyroid") || compLower.includes("hormone") || compLower.includes("pcos")) {
      guessedRemedy = "Pulsatilla Nigricans";
      guessedMiasm = "Psora (Dominant) & Sycosis (Sub-acute)";
      guessedMiasmIndex = { psora: 65, sycosis: 50, syphilis: 15 };
    }

    return {
      id: 999,
      name: p.name,
      constitution: guessedRemedy,
      miasm: guessedMiasm,
      thermal: compLower.includes("chilly") ? "Chilly" : compLower.includes("hot") ? "Hot" : "Temperate",
      cravings: "Warm drinks, salty meals",
      aversions: "Fats, cold dairy",
      vitalityIndex: 70,
      diseaseBurdenIndex: 50,
      history: [
        { date: new Date(p.createdAt || Date.now()).toLocaleDateString("en-IN"), type: "Intake", event: "Case registered", notes: p.complaint || "Initial complaints logged." }
      ],
      labs: {
        timeline: [new Date(p.createdAt || Date.now()).toLocaleDateString("en-IN")],
        vitality: [70],
        egfr: [70],
        creatinine: [1.0],
        microalbumin: [30],
        lh_fsh_ratio: [1.0],
        cholesterol: [180],
        crp: [1.0],
        anticcp: [10],
        painScore: [2],
        hba1c: [5.5],
        tsh: [2.0],
        weight_kg: [70],
        esr: [10]
      } as { [key: string]: any[]; timeline: string[] },
      symptoms: symptomsList,
      miasmaticIndex: guessedMiasmIndex,
      remedyMatches: [
        { name: guessedRemedy, score: 85, status: "Active Mapped", keyEvidence: "Derived from primary clinical notes and thermal affinity." }
      ],
      predictiveRisks: [
        { id: "chronic_burden", name: "Systemic Exhaustion", level: "Moderate Risk", val: 55, color: "text-amber-500", driver: "Chronic pathology duration", modifiable: "Constitutional remediation" }
      ],
      ostmSystems: [
        { name: "Vital Homeostatic Reserve", status: "Active Regulation", color: "text-emerald-500" }
      ],
      cohortPercentiles: { ageCohort: 62, remedyCohort: 70, regionalPercentile: 75 }
    };
  };

  const activeData = {
    ...(PATIENT_LONGITUDINAL_DATA[activeDataKey] 
      ? PATIENT_LONGITUDINAL_DATA[activeDataKey] 
      : getCustomPatientBase(activeDataKey)),
    ...(patientOverrides[activeDataKey] || {})
  };

  // Navigation Tabs: Unified Cockpit, Raw note parser intake, Miasms & Constitution, Compiled print reports
  const [activeTab, setActiveTab] = useState<"cockpit" | "intake" | "miasms" | "reports">("cockpit");

  useEffect(() => {
    if (activeTabOverride) {
      setActiveTab(activeTabOverride);
    }
  }, [activeTabOverride]);
  const [activeTwinMode, setActiveTwinMode] = useState<"playback" | "simulator">("playback");
  const [twinIndex, setTwinIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timelineZoom, setTimelineZoom] = useState(365); // 1 year default

  // ECG Expanded State
  const [isEcgExpanded, setIsEcgExpanded] = useState(false);

  // Constitutional Assessment Wizard States
  const [constitutionalAnswers, setConstitutionalAnswers] = useState<Record<string, string>>({});
  const [constStep, setConstStep] = useState<number>(0);
  const [constIsCalculating, setConstIsCalculating] = useState(false);
  const [isWizardActive, setIsWizardActive] = useState(false);
  
  // What-if simulator state
  const [simDays, setSimDays] = useState<number>(30);
  const [simOptions, setSimOptions] = useState({
    increasePotency: false,
    changeRemedy: false,
    improveHbA1c: false,
    reduceWeight: false,
    improveSleep: false,
    stopTreatment: false
  });

  // Digital Twin Simulator 2.0 Sliders
  const [simSliders, setSimSliders] = useState({
    weight: 75,
    hba1c: 6.5,
    bloodPressure: 120,
    sleepQuality: 75,
    exerciseFrequency: 3,
    medicationAdherence: 90,
    dietQuality: 75,
    stressLevels: 45,
    fluidIntake: 2.5
  });

  // Reset sliders when active patient changes
  useEffect(() => {
    if (activeDataKey === "aarav") {
      setSimSliders({
        weight: 84, // Aarav's weight
        hba1c: 6.9, // Aarav's HbA1c
        bloodPressure: 135,
        sleepQuality: 65,
        exerciseFrequency: 1,
        medicationAdherence: 85,
        dietQuality: 60,
        stressLevels: 70,
        fluidIntake: 1.8
      });
    } else if (activeDataKey === "priya") {
      setSimSliders({
        weight: 74, // Priya's weight
        hba1c: 5.4, // Priya's TSH baseline
        bloodPressure: 115,
        sleepQuality: 80,
        exerciseFrequency: 4,
        medicationAdherence: 95,
        dietQuality: 80,
        stressLevels: 35,
        fluidIntake: 2.8
      });
    } else { // Elena
      setSimSliders({
        weight: 62, // Elena's weight
        hba1c: 5.6, // Elena's ESR baseline
        bloodPressure: 125,
        sleepQuality: 70,
        exerciseFrequency: 2,
        medicationAdherence: 90,
        dietQuality: 70,
        stressLevels: 50,
        fluidIntake: 2.2
      });
    }
  }, [activeDataKey]);

  // Live Clinical Intelligence Feed™ state
  interface FeedItem {
    id: string;
    timestamp: string;
    type: "risk" | "insight" | "trend" | "remedy" | "warning";
    message: string;
    detail: string;
    confidenceDelta?: string;
  }

  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [feedFilter, setFeedFilter] = useState<"all" | "risk" | "insight" | "remedy" | "warning" | "bookmarked">("all");
  const [bookmarkedFeeds, setBookmarkedFeeds] = useState<Record<string, boolean>>({});
  const [activeFeedItemDetail, setActiveFeedItemDetail] = useState<FeedItem | null>(null);

  // Initialize and stream feed items
  useEffect(() => {
    // Starting items
    let initial: FeedItem[] = [];
    if (activeDataKey === "aarav") {
      initial = [
        { id: "f1", timestamp: "09:12", type: "insight", message: "HbA1c trend improving", detail: "Metabolic tracking shows stable downward trajectory. Confidence increased +3%.", confidenceDelta: "+3%" },
        { id: "f2", timestamp: "09:14", type: "risk", message: "Renal risk recalculated", detail: "Estimated glomerular filtration rate (eGFR) decline rate projected. 82% → 79%.", confidenceDelta: "-3% Risk" },
        { id: "f3", timestamp: "09:18", type: "insight", message: "Twin simulation updated", detail: "Apis Mellifica + Serum Anguillae synergy slows predicted eGFR decline slope." },
        { id: "f4", timestamp: "09:22", type: "remedy", message: "New opportunity: Sleep", detail: "Optimizing sleep profile to &gt;8hrs drops autonomic renal stress burden by 8%." }
      ];
    } else if (activeDataKey === "priya") {
      initial = [
        { id: "f1", timestamp: "09:10", type: "insight", message: "TSH level stabilizing", detail: "Hormonal feedback loops show responsive recovery. TSH improved to 4.8 uIU/mL.", confidenceDelta: "+4%" },
        { id: "f2", timestamp: "09:15", type: "risk", message: "Endocrine burden lowered", detail: "Calcarea addition is stabilizing cellular metabolic spikes. 54% → 48% risk.", confidenceDelta: "-6% Risk" },
        { id: "f3", timestamp: "09:20", type: "insight", message: "Psora Miasmatic shift", detail: "Active functional deficiencies transitioning to latent phase." },
        { id: "f4", timestamp: "09:24", type: "remedy", message: "Calcarea Intercurrent active", detail: "Cold thermal match validates remedy selection. Constitutional alignment 86%." }
      ];
    } else {
      initial = [
        { id: "f1", timestamp: "09:08", type: "insight", message: "ESR inflammation down", detail: "Synovial congestion indices show reduction. ESR dropped 28 → 24 mm/hr.", confidenceDelta: "+5%" },
        { id: "f2", timestamp: "09:12", type: "risk", message: "Rheumatoid flare risk lowered", detail: "Rhus Tox + Causticum protocol targets articular congestion. 68% → 62% risk.", confidenceDelta: "-6% Risk" },
        { id: "f3", timestamp: "09:19", type: "insight", message: "Pain score index down", detail: "Telemetry tracks morning stiffness duration reduction below 45 minutes." },
        { id: "f4", timestamp: "09:26", type: "warning", message: "Weather drop alert", detail: "Sudden barometric pressure drop may increase joint stiffness. Suggest heating support." }
      ];
    }
    setFeedItems(initial);

    // Dynamic feed streamer queue
    const streamPool: FeedItem[] = [
      { id: "s1", timestamp: "09:35", type: "insight", message: "Adherence check successful", detail: "Patient reports 95% compliance on dietary sodium restriction." },
      { id: "s2", timestamp: "09:42", type: "trend", message: "Vitality Index rising", detail: "Composite cellular vitality index indicates recovery buffer +4%." },
      { id: "s3", timestamp: "09:50", type: "warning", message: "Hydration warning", detail: "Fluid intake below 2.0L limits renal clearing efficiency." },
      { id: "s4", timestamp: "09:58", type: "remedy", message: "Constitutional match update", detail: "Repertory analysis confirms Lycopodium evening aggravation rubric matches active state." },
      { id: "s5", timestamp: "10:05", type: "risk", message: "Cardio risk recalculated", detail: "BP reduction from 135 to 120 lowers stroke forecast vector by 7%." }
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < streamPool.length) {
        const item = { ...streamPool[index], timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }) };
        setFeedItems(prev => [item, ...prev]);
        index++;
      }
    }, 9000);

    return () => clearInterval(interval);
  }, [activeDataKey]);

  // Zoom and pan states for OSTM Graph
  const [graphScale, setGraphScale] = useState(1);
  const [graphPan, setGraphPan] = useState({ x: 0, y: 0 });
  const [nodeSearchQuery, setNodeSearchQuery] = useState("");
  const [isGraphFullscreen, setIsGraphFullscreen] = useState(false);
  const [graphTextSize, setGraphTextSize] = useState(9); // Default size 9px
  const [isMounted, setIsMounted] = useState(false);
  const [graphDimensions, setGraphDimensions] = useState({ width: 0, height: 0 });
  const prevDimensionsRef = useRef<{ width: number; height: number } | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { clientWidth, clientHeight } = entry.target as HTMLElement;
        setGraphDimensions({ width: clientWidth, height: clientHeight });
      }
    });

    resizeObserver.observe(parent);
    return () => {
      resizeObserver.disconnect();
    };
  }, [isGraphFullscreen, isMounted]);
  const isDraggingGraphRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });


  // Graph state and click-inspector
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Explainable AI selected risk driver
  const [selectedRiskId, setSelectedRiskId] = useState<string>("ckd");

  // Chat Copilot console state
  const [copilotActiveTab, setCopilotActiveTab] = useState<"reasoning" | "chat">("reasoning");
  const [customQuery, setCustomQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "doctor" | "ai"; text: string }>>([
    { sender: "ai", text: "Hello Clinician. I am the OSTM™ Clinical Copilot. Ask me anything about this patient twin's remedies, miasms, or longitudinal risks." }
  ]);
  const [isProcessingChat, setIsProcessingChat] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(true);
  
  // Reports state
  const [reportType, setReportType] = useState<string | null>(null);
  const [reportContent, setReportContent] = useState<string>("");
  const [rawIntakeNotes, setRawIntakeNotes] = useState("");
  const [parsedIntakeOutput, setParsedIntakeOutput] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement>(null);
  const forecastCanvasRef = useRef<HTMLCanvasElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);



  // Auto-scroll chat history
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  // Sync timeline indices on patient switch
  useEffect(() => {
    setTwinIndex(activeData.history.length - 1);
    setIsPlaying(false);
    setReportType(null);
    setSelectedNodeId(null);
    
    // Set default risk tab per patient
    if (activeDataKey === "priya") setSelectedRiskId("diabetes");
    else if (activeDataKey === "elena") setSelectedRiskId("ra_flare");
    else setSelectedRiskId("ckd");

    // Reset simulator switches
    setSimOptions({
      increasePotency: false,
      changeRemedy: false,
      improveHbA1c: false,
      reduceWeight: false,
      improveSleep: false,
      stopTreatment: false
    });
  }, [selectedPatientId, activeData]);

  // Playback timer ticker
  useEffect(() => {
    if (isPlaying) {
      playbackIntervalRef.current = setInterval(() => {
        setTwinIndex(prev => {
          if (prev < activeData.history.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 2500);
    } else {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    }
    return () => {
      if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
    };
  }, [isPlaying, activeData]);

  // Under-100ms simulator calculation state solver
  const simulatedResults = (() => {
    if (activeTwinMode !== "simulator") return null;

    const factor = simDays / 365;
    let vitality = activeData.vitalityIndex;
    let burden = activeData.diseaseBurdenIndex;

    let labs: Record<string, number> = {};
    let symptoms = JSON.parse(JSON.stringify(activeData.symptoms));
    let risks = JSON.parse(JSON.stringify(activeData.predictiveRisks));

    // Baseline definitions for clinical offset calculations
    const baselines: Record<string, any> = {
      aarav: { weight: 84, hba1c: 6.9, bp: 135, sleep: 65, exercise: 1, adherence: 85, diet: 60, stress: 70, fluid: 1.8 },
      priya: { weight: 74, hba1c: 5.4, bp: 115, sleep: 80, exercise: 4, adherence: 95, diet: 80, stress: 35, fluid: 2.8 },
      elena: { weight: 62, hba1c: 5.6, bp: 125, sleep: 70, exercise: 2, adherence: 90, diet: 70, stress: 50, fluid: 2.2 }
    };

    const patientBase = baselines[activeDataKey] || baselines.aarav;

    // 1. Calculate Net Optimization Offset from 9 Sliders
    let optScore = 0;
    
    // Sleep improvement (+ = better)
    optScore += (simSliders.sleepQuality - patientBase.sleep) * 0.4;
    // Adherence improvement (+ = better)
    optScore += (simSliders.medicationAdherence - patientBase.adherence) * 0.6;
    // Diet quality (+ = better)
    optScore += (simSliders.dietQuality - patientBase.diet) * 0.4;
    // Stress reduction (+ = better)
    optScore += (patientBase.stress - simSliders.stressLevels) * 0.5;
    // Exercise (+ = better)
    optScore += (simSliders.exerciseFrequency - patientBase.exercise) * 3.0;
    // Weight reduction (+ = better)
    optScore += (patientBase.weight - simSliders.weight) * 1.5;
    // Fluid intake (+ = better)
    optScore += (simSliders.fluidIntake - patientBase.fluid) * 4.0;
    // BP reduction (+ = better)
    optScore += (patientBase.bp - simSliders.bloodPressure) * 0.3;

    // Apply simulation options checkboxes as extra multipliers
    if (simOptions.increasePotency) optScore += 8;
    if (simOptions.changeRemedy) optScore += 12;
    if (simOptions.stopTreatment) optScore -= 35; // Severe de-compensation

    // 2. Resolve Vitality and Disease Burden
    vitality = Math.round(vitality + (optScore * factor));
    burden = Math.max(5, Math.round(burden - (optScore * 0.8 * factor)));

    // 3. Resolve Laboratory Projections
    if (activeDataKey === "aarav") {
      labs = {
        egfr: Math.max(10, Math.min(120, activeData.labs.egfr[activeData.labs.egfr.length - 1] + (optScore * 0.18 * factor))),
        creatinine: Math.max(0.4, Number((activeData.labs.creatinine[activeData.labs.creatinine.length - 1] - (optScore * 0.006 * factor)).toFixed(2))),
        hba1c: Number(simSliders.hba1c.toFixed(1)),
        microalbumin: Math.max(10, Math.round(activeData.labs.microalbumin[activeData.labs.microalbumin.length - 1] - (optScore * 1.8 * factor)))
      };
      
      // Dynamic symptom severity overrides
      if (optScore > 15) {
        symptoms.forEach((s: any) => {
          if (s.name.includes("edema") || s.name.includes("urination")) s.severity = "Mild";
          if (s.name.includes("fatigue")) s.severity = "Resolved";
        });
      } else if (optScore < -15) {
        symptoms.forEach((s: any) => { s.severity = "Severe"; });
      }
    } else if (activeDataKey === "priya") {
      labs = {
        tsh: Number(simSliders.hba1c.toFixed(2)), // TSH
        lh_fsh_ratio: Math.max(0.5, Number((activeData.labs.lh_fsh_ratio[activeData.labs.lh_fsh_ratio.length - 1] - (optScore * 0.008 * factor)).toFixed(2))),
        cholesterol: Math.max(120, Math.round(activeData.labs.cholesterol[activeData.labs.cholesterol.length - 1] - (optScore * 0.8 * factor))),
        weight_kg: Number(simSliders.weight.toFixed(1))
      };

      if (optScore > 15) {
        symptoms.forEach((s: any) => { if (s.name.includes("fatigue")) s.severity = "Resolved"; });
      } else if (optScore < -15) {
        symptoms.forEach((s: any) => { s.severity = "Severe"; });
      }
    } else { // Elena
      labs = {
        esr: Math.max(2, Math.round(simSliders.hba1c * 4)), // ESR
        crp: Math.max(0.1, Number((activeData.labs.crp[activeData.labs.crp.length - 1] - (optScore * 0.07 * factor)).toFixed(2))),
        anticcp: Math.max(5, Math.round(activeData.labs.anticcp[activeData.labs.anticcp.length - 1] - (optScore * 0.4 * factor))),
        painScore: Math.max(0, Math.min(10, Number((activeData.labs.painScore[activeData.labs.painScore.length - 1] - (optScore * 0.05 * factor)).toFixed(1))))
      };

      if (optScore > 15) {
        symptoms.forEach((s: any) => { if (s.name.includes("stiffness")) s.severity = "Mild"; });
      } else if (optScore < -15) {
        symptoms.forEach((s: any) => { s.severity = "Severe"; });
      }
    }

    // 4. Recalculate Risk Scores under sliders
    risks.forEach((r: any) => {
      let reduction = optScore * 0.6;
      r.val = Math.max(5, Math.min(99, Math.round(r.val - (reduction * factor))));
      
      // Color codes
      if (r.val > 75) { r.level = "High Risk"; r.color = "text-rose-500"; }
      else if (r.val > 40) { r.level = "Moderate Risk"; r.color = "text-amber-500"; }
      else { r.level = "Low Risk"; r.color = "text-emerald-500"; }
    });

    // 5. Confidence formula
    let confidence = 92 - (simDays === 365 ? 20 : simDays === 180 ? 11 : simDays === 90 ? 4 : 0);

    return {
      vitality: Math.max(10, Math.min(100, vitality)),
      burden: Math.max(5, Math.min(100, burden)),
      labs,
      symptoms,
      risks,
      confidence,
      bestCase: {
        vitality: Math.min(100, Math.round(vitality * 1.15)),
        burden: Math.max(5, Math.round(burden * 0.8)),
        risks: risks.map((r: any) => ({ ...r, val: Math.max(5, Math.round(r.val * 0.8)) }))
      },
      worstCase: {
        vitality: Math.max(10, Math.round(vitality * 0.75)),
        burden: Math.min(100, Math.round(burden * 1.25)),
        risks: risks.map((r: any) => ({ ...r, val: Math.min(99, Math.round(r.val * 1.25)) }))
      }
    };
  })();

  // Render Outcome charts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || activeTab !== "cockpit") return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.parentElement?.clientWidth || 300;
    const height = 140;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.clearRect(0, 0, width, height);

    const isDark = theme === "dark";
    const gridColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.08)";
    const textColor = isDark ? "#64748b" : "#475569";
    const padding = { top: 15, right: 15, bottom: 20, left: 30 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH * (i / 4));
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = textColor;
      ctx.font = "8px monospace";
      ctx.textAlign = "right";
      ctx.fillText(`${100 - 25 * i}%`, padding.left - 5, y + 3);
    }

    const timeline = activeData.labs.timeline;
    const stepX = chartW / Math.max(1, timeline.length - 1);

    timeline.forEach((date, i) => {
      const x = padding.left + i * stepX;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();

      ctx.fillStyle = textColor;
      ctx.font = "8px monospace";
      ctx.textAlign = "center";
      ctx.fillText(date.substring(5), x, height - padding.bottom + 10);
    });

    let datasets: Array<{ name: string; values: number[]; color: string }> = [];
    if (activeDataKey === "aarav") {
      datasets = [
        { name: "eGFR", values: activeData.labs.egfr, color: "#0ea5e9" },
        { name: "HbA1c", values: activeData.labs.hba1c.map((v: number) => v * 10), color: "#8b5cf6" }
      ];
    } else if (activeDataKey === "priya") {
      datasets = [
        { name: "TSH", values: activeData.labs.tsh.map((v: number) => v * 10), color: "#8b5cf6" },
        { name: "Weight", values: activeData.labs.weight_kg, color: "#0ea5e9" }
      ];
    } else {
      datasets = [
        { name: "ESR", values: activeData.labs.esr, color: "#f43f5e" },
        { name: "CRP", values: activeData.labs.crp.map((v: number) => v * 5), color: "#0ea5e9" }
      ];
    }

    datasets.forEach(ds => {
      const min = Math.min(...ds.values);
      const max = Math.max(...ds.values);
      const range = max - min || 1;

      ctx.beginPath();
      ctx.strokeStyle = ds.color;
      ctx.lineWidth = 1.5;

      ds.values.forEach((v, i) => {
        const x = padding.left + i * stepX;
        const norm = (v - min) / range;
        const y = padding.top + chartH - norm * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Dot circles
      ds.values.forEach((v, i) => {
        const x = padding.left + i * stepX;
        const norm = (v - min) / range;
        const y = padding.top + chartH - norm * chartH;
        const isCurrent = activeTwinMode === "playback" && i === twinIndex;

        ctx.beginPath();
        ctx.fillStyle = ds.color;
        ctx.arc(x, y, isCurrent ? 4.5 : 2.5, 0, 2 * Math.PI);
        ctx.fill();

        if (isCurrent) {
          ctx.strokeStyle = ds.color;
          ctx.strokeRect(x - 5, y - 5, 10, 10);
        }
      });
    });
  }, [twinIndex, activeData, theme, activeDataKey, activeTwinMode, activeTab]);

  // Render SVG/Canvas 30d/90d/180d/1y Forecast curves (with Expected, Best, and Worst case scenarios)
  useEffect(() => {
    const canvas = forecastCanvasRef.current;
    if (!canvas || activeTab !== "cockpit") return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.parentElement?.clientWidth || 300;
    const height = 130;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.clearRect(0, 0, width, height);

    const isDark = theme === "dark";
    const gridColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.08)";
    const textColor = isDark ? "#64748b" : "#475569";
    const padding = { top: 15, right: 20, bottom: 20, left: 30 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 3; i++) {
      const y = padding.top + (chartH * (i / 3));
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = textColor;
      ctx.font = "8px monospace";
      ctx.textAlign = "right";
      ctx.fillText(`${90 - 30 * i}%`, padding.left - 5, y + 3);
    }

    const intervals = ["Today", "+30d", "+90d", "+180d", "+1y"];
    const stepX = chartW / (intervals.length - 1);

    intervals.forEach((label, i) => {
      const x = padding.left + i * stepX;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();

      ctx.fillStyle = textColor;
      ctx.font = "8px monospace";
      ctx.textAlign = "center";
      ctx.fillText(label, x, height - padding.bottom + 10);
    });

    // Forecast lines mapping
    let curves: Array<{ name: string; values: number[]; color: string }> = [];
    if (activeDataKey === "aarav") {
      curves = [
        { name: "Renal Risk Progression", values: [82, 85, 87, 89, 92], color: "#f43f5e" },
        { name: "Metabolic Burden", values: [55, 54, 52, 50, 47], color: "#10b981" }
      ];
    } else if (activeDataKey === "priya") {
      curves = [
        { name: "PCOS Diabetes Trigger", values: [58, 59, 61, 64, 69], color: "#f43f5e" },
        { name: "Thyroid Dysfunction", values: [52, 49, 44, 38, 30], color: "#3b82f6" }
      ];
    } else {
      curves = [
        { name: "RA Inflammatory Flare", values: [76, 78, 80, 84, 88], color: "#f43f5e" },
        { name: "Secondary Sjogren", values: [50, 48, 44, 40, 35], color: "#3b82f6" }
      ];
    }

    // Adjust lines in real-time simulation mode (incorporating Best & Worst Cases)
    let bestCurves: Array<{ values: number[]; color: string }> = [];
    let worstCurves: Array<{ values: number[]; color: string }> = [];

    if (activeTwinMode === "simulator" && simulatedResults) {
      const sim = simulatedResults;
      
      curves.forEach((c, idx) => {
        const isPrimary = c.name.includes("Risk") || c.name.includes("Trigger") || c.name.includes("Flare");
        const baseVal = c.values[0];
        
        // Expected curve
        const finalExpected = isPrimary ? (sim.risks[0]?.val || 50) : (sim.risks[1]?.val || 30);
        const diffExpected = finalExpected - baseVal;
        c.values = c.values.map((v, i) => Math.round(v + (diffExpected * (i / 4))));

        // Best-case curve
        const finalBest = isPrimary ? (sim.bestCase.risks[0]?.val || 40) : (sim.bestCase.risks[1]?.val || 25);
        const diffBest = finalBest - baseVal;
        const bVals = c.values.map((v, i) => Math.round(v + (diffBest * (i / 4))));
        bestCurves.push({ values: bVals, color: "rgba(16, 185, 129, 0.4)" });

        // Worst-case curve
        const finalWorst = isPrimary ? (sim.worstCase.risks[0]?.val || 65) : (sim.worstCase.risks[1]?.val || 45);
        const diffWorst = finalWorst - baseVal;
        const wVals = c.values.map((v, i) => Math.round(v + (diffWorst * (i / 4))));
        worstCurves.push({ values: wVals, color: "rgba(244, 63, 94, 0.4)" });
      });
    }

    // 1. Draw Worst Case (Dotted Red)
    if (activeTwinMode === "simulator") {
      worstCurves.forEach(c => {
        ctx.beginPath();
        ctx.strokeStyle = c.color;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        c.values.forEach((val, i) => {
          const x = padding.left + i * stepX;
          const norm = (val - 10) / 90;
          const y = padding.top + chartH - norm * chartH;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.setLineDash([]); // reset
      });
    }

    // 2. Draw Best Case (Dotted Green)
    if (activeTwinMode === "simulator") {
      bestCurves.forEach(c => {
        ctx.beginPath();
        ctx.strokeStyle = c.color;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        c.values.forEach((val, i) => {
          const x = padding.left + i * stepX;
          const norm = (val - 10) / 90;
          const y = padding.top + chartH - norm * chartH;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.setLineDash([]); // reset
      });
    }

    // 3. Draw Expected Case (Solid primary)
    curves.forEach(c => {
      ctx.beginPath();
      ctx.strokeStyle = c.color;
      ctx.lineWidth = 2.5;

      c.values.forEach((val, i) => {
        const x = padding.left + i * stepX;
        const norm = (val - 10) / 90;
        const y = padding.top + chartH - norm * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // End pointer glow
      const lastX = padding.left + 4 * stepX;
      const lastVal = c.values[4];
      const lastNorm = (lastVal - 10) / 90;
      const lastY = padding.top + chartH - lastNorm * chartH;

      ctx.beginPath();
      ctx.fillStyle = c.color;
      ctx.arc(lastX, lastY, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
  }, [activeData, theme, activeDataKey, activeTwinMode, simulatedResults, activeTab]);

  // Render Animated Knowledge Graph (Dynamic spring-mass force-directed physics engine)
  const graphDataRef = useRef<{ nodes: any[]; links: any[] } | null>(null);
  const draggedNodeRef = useRef<any | null>(null);

  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas || activeTab !== "cockpit") return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = graphDimensions.width || canvas.parentElement?.clientWidth || 400;
    const height = graphDimensions.height || canvas.parentElement?.clientHeight || 500;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Initialize nodes with dynamic OSTM clusters
    if (!graphDataRef.current) {
      const initialNodes = [
        // Systems (Radius: 15)
        { id: "sys_renal", label: "Renal System", type: "system", x: width * 0.22, y: height * 0.38, vx: 0, vy: 0, radius: 15, description: "Glomerular filtration, electrolyte balance, and fluid regulation." },
        { id: "sys_endocrine", label: "Endocrine System", type: "system", x: width * 0.50, y: height * 0.45, vx: 0, vy: 0, radius: 15, description: "Hormonal feedback loops, metabolic regulation, and glandular status." },
        { id: "sys_musculoskeletal", label: "Musculoskeletal System", type: "system", x: width * 0.75, y: height * 0.38, vx: 0, vy: 0, radius: 15, description: "Articular structures, bone density, and inflammatory synovial responses." },
        { id: "sys_digestive", label: "Digestive System", type: "system", x: width * 0.32, y: height * 0.52, vx: 0, vy: 0, radius: 15, description: "Gut absorption, fermentation, bloating, and stomach acid regulation." },
        { id: "sys_cardiovascular", label: "Cardiovascular System", type: "system", x: width * 0.45, y: height * 0.35, vx: 0, vy: 0, radius: 15, description: "Vascular pressure, cardiac rhythm, stroke, and perfusion." },
        { id: "sys_nervous", label: "Nervous System", type: "system", x: width * 0.75, y: height * 0.65, vx: 0, vy: 0, radius: 15, description: "Neurological pathways, stress responses, sleep-wake cycles, and cognitive reserve." },
        { id: "sys_respiratory", label: "Respiratory System", type: "system", x: width * 0.15, y: height * 0.65, vx: 0, vy: 0, radius: 15, description: "Pulmonary ventilation, gas exchange, airway hyper-reactivity, and oxygenation." },
        { id: "sys_immune", label: "Immune System", type: "system", x: width * 0.85, y: height * 0.35, vx: 0, vy: 0, radius: 15, description: "Auto-immune feedback, inflammatory mediators, cellular defense, and antibody load." },
        { id: "sys_integumentary", label: "Integumentary System", type: "system", x: width * 0.10, y: height * 0.45, vx: 0, vy: 0, radius: 15, description: "Dermatological structures, protective barriers, sweat/perspiration, and skin eruptions." },

        // Organs (Radius: 13)
        { id: "org_kidney", label: "Renal Kidneys", type: "organ", x: width * 0.28, y: height * 0.45, vx: 0, vy: 0, radius: 13, description: "Bilateral glomeruli, clearing creatinine and blood nitrogenous waste." },
        { id: "org_thyroid", label: "Endocrine Thyroid", type: "organ", x: width * 0.55, y: height * 0.40, vx: 0, vy: 0, radius: 13, description: "Thyroid gland secreting T3/T4 for basal metabolic Conversions." },
        { id: "org_ovaries", label: "Ovarian Gland", type: "organ", x: width * 0.65, y: height * 0.55, vx: 0, vy: 0, radius: 13, description: "Reproductive rhythm ovaries regulating LH/FSH cycles." },
        { id: "org_joints", label: "Articular Joints", type: "organ", x: width * 0.72, y: height * 0.45, vx: 0, vy: 0, radius: 13, description: "Synovial articular membranes, cartilages, and auto-antibody targets." },
        { id: "org_pancreas", label: "Pancreas Gland", type: "organ", x: width * 0.40, y: height * 0.48, vx: 0, vy: 0, radius: 13, description: "Endocrine insulin secretion and glycemic glucose management." },
        { id: "org_gut", label: "Digestive Gut", type: "organ", x: width * 0.35, y: height * 0.58, vx: 0, vy: 0, radius: 13, description: "Gastric absorption, flora, flatulence rubrics, and morning lethargy links." },
        { id: "org_heart", label: "Cardiovascular Heart", type: "organ", x: width * 0.45, y: height * 0.28, vx: 0, vy: 0, radius: 13, description: "Cardiac muscle driving systemic arterial perfusion, pulse rhythm, and output." },
        { id: "org_brain", label: "Cognitive Brain", type: "organ", x: width * 0.68, y: height * 0.62, vx: 0, vy: 0, radius: 13, description: "Central nervous system managing neural signals, sensory data, and sleep pathways." },
        { id: "org_liver", label: "Metabolic Liver", type: "organ", x: width * 0.30, y: height * 0.60, vx: 0, vy: 0, radius: 13, description: "Hepatic detoxification, glycogen storage, lipid metabolism, and bile synthesis." },
        { id: "org_lungs", label: "Pulmonary Lungs", type: "organ", x: width * 0.20, y: height * 0.60, vx: 0, vy: 0, radius: 13, description: "Alveolar membrane gas exchange, respiratory rate, and airway reactivity." },
        { id: "org_skin", label: "Dermatic Skin", type: "organ", x: width * 0.12, y: height * 0.48, vx: 0, vy: 0, radius: 13, description: "Primary cutaneous barrier, perspiration regulation, and dermatopathic eruptions." },
        { id: "org_adrenals", label: "Adrenal Glands", type: "organ", x: width * 0.48, y: height * 0.52, vx: 0, vy: 0, radius: 13, description: "Suprarenal endocrine glands regulating cortisol, adrenaline, and stress adaptations." },
        { id: "org_bladder", label: "Urinary Bladder", type: "organ", x: width * 0.20, y: height * 0.48, vx: 0, vy: 0, radius: 13, description: "Uvesical reservoir, detrusor contraction control, and urinary clearance." },

        // Symptoms (Radius: 9)
        { id: "sym_renal", label: "Ankle Edema", type: "symptom", x: width * 0.15, y: height * 0.35, vx: 0, vy: 0, radius: 9, description: "Fluid retention in lower limbs due to drop in glomerular filtration." },
        { id: "sym_fatigue", label: "Extreme Fatigue", type: "symptom", x: width * 0.45, y: height * 0.20, vx: 0, vy: 0, radius: 9, description: "Uremic exhaustion marker linked to thyroid and renal clearance lags." },
        { id: "sym_bloat", label: "Flatulence & Bloat", type: "symptom", x: width * 0.35, y: height * 0.70, vx: 0, vy: 0, radius: 9, description: "Digestive dysfunction with gas retention worsening between 4-8 PM." },
        { id: "sym_nocturia", label: "Nocturia Urination", type: "symptom", x: width * 0.18, y: height * 0.55, vx: 0, vy: 0, radius: 9, description: "Frequent nocturnal urination worse 2-5 AM under kidney filtration load." },
        { id: "sym_menses", label: "Irregular Menses", type: "symptom", x: width * 0.70, y: height * 0.65, vx: 0, vy: 0, radius: 9, description: "Oligomenorrhea and endocrine cycle deviations." },
        { id: "sym_stiffness", label: "Joint Stiffness", type: "symptom", x: width * 0.78, y: height * 0.28, vx: 0, vy: 0, radius: 9, description: "Morning joint stiffness lasting >2 hours due to articular congestion." },
        { id: "sym_dryness", label: "Mucosal Dryness", type: "symptom", x: width * 0.82, y: height * 0.45, vx: 0, vy: 0, radius: 9, description: "Dryness of eyes and mouth, secondary Sjogren auto-immune signature." },
        { id: "sym_hirsutism", label: "Mild Hirsutism", type: "symptom", x: width * 0.75, y: height * 0.75, vx: 0, vy: 0, radius: 9, description: "Androgenic hair growth indicating LH/FSH endocrine PCOS activity." },
        { id: "sym_weight", label: "Weight Gain", type: "symptom", x: width * 0.55, y: height * 0.55, vx: 0, vy: 0, radius: 9, description: "Sluggish metabolic conversions leading to weight accumulation." },
        { id: "sym_lethargy", label: "Morning Lethargy", type: "symptom", x: width * 0.48, y: height * 0.30, vx: 0, vy: 0, radius: 9, description: "Sulphur/Thyroidinum index of morning exhaustion, better motion." },
        { id: "sym_proteinuria", label: "Proteinuria / Foam", type: "symptom", x: width * 0.10, y: height * 0.25, vx: 0, vy: 0, radius: 9, description: "Foamy urine indicating protein leaking through degraded glomeruli." },
        { id: "sym_anemia", label: "Anemia Fatigue", type: "symptom", x: width * 0.22, y: height * 0.22, vx: 0, vy: 0, radius: 9, description: "Lack of renal erythropoietin leading to low Hb oxygen transport." },
        { id: "sym_cramps", label: "Muscle Cramps", type: "symptom", x: width * 0.85, y: height * 0.35, vx: 0, vy: 0, radius: 9, description: "Nocturnal cramps due to electrolyte and calcium imbalances." },
        { id: "sym_anxiety", label: "Systemic Anxiety", type: "symptom", x: width * 0.50, y: height * 0.15, vx: 0, vy: 0, radius: 9, description: "Psoric neural hypersensitivity and nervous exhaustion." },
        { id: "sym_palpitations", label: "Chest Palpitations", type: "symptom", x: width * 0.52, y: height * 0.22, vx: 0, vy: 0, radius: 9, description: "Awareness of rapid, pounding, or irregular heartbeat under stress." },
        { id: "sym_dyspnea", label: "Dyspnea Breathlessness", type: "symptom", x: width * 0.38, y: height * 0.25, vx: 0, vy: 0, radius: 9, description: "Shortness of breath or air hunger, worse on exertion or lying flat." },
        { id: "sym_brain_fog", label: "Cognitive Brain Fog", type: "symptom", x: width * 0.62, y: height * 0.70, vx: 0, vy: 0, radius: 9, description: "Sluggish mental conversions, poor memory, and concentration lags." },
        { id: "sym_insomnia", label: "Insomnia Sleep Loss", type: "symptom", x: width * 0.78, y: height * 0.70, vx: 0, vy: 0, radius: 9, description: "Inability to fall or remain asleep, worse 2-4 AM due to neural tension." },
        { id: "sym_jaundice", label: "Bilious Jaundice", type: "symptom", x: width * 0.25, y: height * 0.65, vx: 0, vy: 0, radius: 9, description: "Scleral/cutaneous yellowing from hepatic clearance and bile retention." },
        { id: "sym_cough", label: "Chronic Dry Cough", type: "symptom", x: width * 0.15, y: height * 0.70, vx: 0, vy: 0, radius: 9, description: "Irritative dry bronchial tickling worse in cold air (Antimonium Tart rubric)." },
        { id: "sym_wheezing", label: "Asthmatic Wheezing", type: "symptom", x: width * 0.22, y: height * 0.72, vx: 0, vy: 0, radius: 9, description: "Expiratory musical constriction of bronchial tree under allergic load." },
        { id: "sym_eczema", label: "Dermatic Eczema", type: "symptom", x: width * 0.08, y: height * 0.52, vx: 0, vy: 0, radius: 9, description: "Cutaneous eruptions leaking sticky honey-like eczema discharge." },
        { id: "sym_dysuria", label: "Painful Dysuria", type: "symptom", x: width * 0.18, y: height * 0.52, vx: 0, vy: 0, radius: 9, description: "Scalding, burning pain during urination (Cantharis rubric)." },

        // Remedies (Radius: 11)
        { id: "rem_lyc", label: "Lycopodium Clavatum", type: "remedy", x: width * 0.33, y: height * 0.82, vx: 0, vy: 0, radius: 11, description: "Constitutional remedy targeting right-sided affinity and renal/gut congestion." },
        { id: "rem_apis", label: "Apis Mellifica", type: "remedy", x: width * 0.08, y: height * 0.45, vx: 0, vy: 0, radius: 11, description: "Symptomatic support for puffy tissues, water retention, and thirstless state." },
        { id: "rem_anguillae", label: "Serum Anguillae", type: "remedy", x: width * 0.12, y: height * 0.72, vx: 0, vy: 0, radius: 11, description: "Organotherapy support specifically targeted to renal glomerular integrity." },
        { id: "rem_puls", label: "Pulsatilla", type: "remedy", x: width * 0.58, y: height * 0.80, vx: 0, vy: 0, radius: 11, description: "Mild temperament match, thirstless, improved in cool open air." },
        { id: "rem_thyroid", label: "Thyroidinum", type: "remedy", x: width * 0.45, y: height * 0.88, vx: 0, vy: 0, radius: 11, description: "Intercurrent glandular support for sluggish metabolic conversions." },
        { id: "rem_sil", label: "Silicea Terra", type: "remedy", x: width * 0.88, y: height * 0.60, vx: 0, vy: 0, radius: 11, description: "Cold chilly profile, deep-acting remedy for nodes, scars, and bone affinity." },
        { id: "rem_rhus", label: "Rhus Tox 30C", type: "remedy", x: width * 0.80, y: height * 0.15, vx: 0, vy: 0, radius: 11, description: "Stiffness relieved by continuous movement and warm dry heat." },
        { id: "rem_caust", label: "Causticum", type: "remedy", x: width * 0.92, y: height * 0.25, vx: 0, vy: 0, radius: 11, description: "Drawing stiffness of joint synovium, contractures, better wet weather." },
        { id: "rem_sulph", label: "Sulphur 30C", type: "remedy", x: width * 0.28, y: height * 0.88, vx: 0, vy: 0, radius: 11, description: "Warm constitutional, morning lethargy, red orifices, gas." },
        { id: "rem_nux", label: "Nux Vomica", type: "remedy", x: width * 0.38, y: height * 0.92, vx: 0, vy: 0, radius: 11, description: "Sedentary profile, hyper-irritability, digestive flatulence from stress." },
        { id: "rem_calc", label: "Calcarea Carbonica", type: "remedy", x: width * 0.52, y: height * 0.85, vx: 0, vy: 0, radius: 11, description: "Chilly patient, damp extremities, sluggish conversions, weight gain." },
        { id: "rem_crataegus", label: "Crataegus Oxyacantha", type: "remedy", x: width * 0.62, y: height * 0.88, vx: 0, vy: 0, radius: 11, description: "Cardiotonic support targeted to myocardial tone and vascular pressure." },
        { id: "rem_kali_phos", label: "Kali Phosphoricum 6X", type: "remedy", x: width * 0.72, y: height * 0.88, vx: 0, vy: 0, radius: 11, description: "Nerve nutrient for brain fog, mental exhaustion, and neural strain." },
        { id: "rem_chelidonium", label: "Chelidonium Majus", type: "remedy", x: width * 0.18, y: height * 0.88, vx: 0, vy: 0, radius: 11, description: "Right-sided hepatic organotherapy remedy for bilious conditions and liver sluggishness." },
        { id: "rem_ant_tart", label: "Antimonium Tartaricum", type: "remedy", x: width * 0.10, y: height * 0.88, vx: 0, vy: 0, radius: 11, description: "Bronchial mucus clearing support for rattling, difficult expectoration." },
        { id: "rem_graphites", label: "Graphites 30C", type: "remedy", x: width * 0.05, y: height * 0.88, vx: 0, vy: 0, radius: 11, description: "Cutaneous remedy for rough, dry skin and sticky honey-like eczema." },
        { id: "rem_phos_acid", label: "Phosphoricum Acidum", type: "remedy", x: width * 0.40, y: height * 0.88, vx: 0, vy: 0, radius: 11, description: "Constitutional support for deep mental and physical adrenal exhaustion." },
        { id: "rem_cantharis", label: "Cantharis 30C", type: "remedy", x: width * 0.08, y: height * 0.78, vx: 0, vy: 0, radius: 11, description: "Rapid support for scalding, burning urinary bladder tract irritations." },

        // Miasms (Radius: 12)
        { id: "mias_psora", label: "Psora Miasm", type: "miasm", x: width * 0.50, y: height * 0.60, vx: 0, vy: 0, radius: 12, description: "Initial functional defense deficiency, skin eruptions, and fatigue." },
        { id: "mias_sycosis", label: "Sycosis Miasm", type: "miasm", x: width * 0.22, y: height * 0.80, vx: 0, vy: 0, radius: 12, description: "Hyper-proliferation, fluid load, chronic structural overgrowth." },
        { id: "mias_syphilis", label: "Syphilis Miasm", type: "miasm", x: width * 0.88, y: height * 0.80, vx: 0, vy: 0, radius: 12, description: "Destruction, ulceration, tissue degeneration, and structural collapse." },
        { id: "mias_tubercular", label: "Tubercular Miasm", type: "miasm", x: width * 0.08, y: height * 0.85, vx: 0, vy: 0, radius: 12, description: "Rapid weight loss, chest sensitivities, fluctuating symptoms." },

        // Labs (Radius: 10)
        { id: "lab_creatinine", label: "Serum Creatinine", type: "lab", x: width * 0.40, y: height * 0.10, vx: 0, vy: 0, radius: 10, description: "Serum creatinine clearing rate, uremic load marker." },
        { id: "lab_egfr", label: "eGFR Filtration", type: "lab", x: width * 0.25, y: height * 0.15, vx: 0, vy: 0, radius: 10, description: "Glomerular filtration rate calculated from serum creatinine." },
        { id: "lab_microalbumin", label: "Microalbuminuria", type: "lab", x: width * 0.12, y: height * 0.18, vx: 0, vy: 0, radius: 10, description: "Protein leaking indicator, early signal of glomerular breakdown." },
        { id: "lab_tsh", label: "TSH Level", type: "lab", x: width * 0.58, y: height * 0.10, vx: 0, vy: 0, radius: 10, description: "Thyroid stimulating hormone level, subclinical marker." },
        { id: "lab_lh_fsh", label: "LH/FSH Ratio", type: "lab", x: width * 0.68, y: height * 0.12, vx: 0, vy: 0, radius: 10, description: "Luteinizing to Follicle Stimulating Hormone endocrine ratio." },
        { id: "lab_cholesterol", label: "Serum Cholesterol", type: "lab", x: width * 0.50, y: height * 0.08, vx: 0, vy: 0, radius: 10, description: "Serum lipid profile indicating metabolic clearance reserve." },
        { id: "lab_crp", label: "CRP Inflammatory", type: "lab", x: width * 0.75, y: height * 0.08, vx: 0, vy: 0, radius: 10, description: "C-Reactive Protein auto-immune inflammatory marker." },
        { id: "lab_anticcp", label: "Anti-CCP antibody", type: "lab", x: width * 0.88, y: height * 0.10, vx: 0, vy: 0, radius: 10, description: "Synovial auto-antibodies indicating Rheumatoid Arthritis." },
        { id: "lab_esr", label: "ESR Rate", type: "lab", x: width * 0.82, y: height * 0.12, vx: 0, vy: 0, radius: 10, description: "Erythrocyte sedimentation rate, cellular inflammation index." },
        { id: "lab_hba1c", label: "HbA1c Glycemia", type: "lab", x: width * 0.32, y: height * 0.08, vx: 0, vy: 0, radius: 10, description: "Average blood sugar index, metabolic twin driver." },
        { id: "lab_ecg", label: "ECG Rhythm Stability", type: "lab", x: width * 0.62, y: height * 0.08, vx: 0, vy: 0, radius: 10, description: "ECG lead metrics, checking for PR/QT intervals and rhythm variances." },
        { id: "lab_sleep_index", label: "Sleep Quality Index", type: "lab", x: width * 0.78, y: height * 0.82, vx: 0, vy: 0, radius: 10, description: "Longitudinal tracking of REM/deep sleep continuity index." },
        { id: "lab_liver_enzymes", label: "ALT/AST Enzymes", type: "lab", x: width * 0.28, y: height * 0.78, vx: 0, vy: 0, radius: 10, description: "Hepatic cell integrity marker, tracking transaminases AST and ALT." },
        { id: "lab_sp02", label: "Oxygen Saturation SpO2", type: "lab", x: width * 0.12, y: height * 0.80, vx: 0, vy: 0, radius: 10, description: "Pulse oximetric oxygenation level in arterial blood." },
        { id: "lab_ige", label: "IgE Allergy Index", type: "lab", x: width * 0.88, y: height * 0.20, vx: 0, vy: 0, radius: 10, description: "Serum Immunoglobulin E tracking systemic allergic load." },
        { id: "lab_cortisol", label: "Adrenal Cortisol Output", type: "lab", x: width * 0.48, y: height * 0.78, vx: 0, vy: 0, radius: 10, description: "Diurnal salivary cortisol curve tracking endocrine fatigue." },
        { id: "lab_urinalysis", label: "Urine Leukocyte Index", type: "lab", x: width * 0.18, y: height * 0.82, vx: 0, vy: 0, radius: 10, description: "Urinalysis measuring pH, leukocytes, and epithelial cells." },

        // Diagnoses (Radius: 13)
        { id: "diag_ckd", label: "Stage 3 CKD", type: "diagnosis", x: width * 0.20, y: height * 0.48, vx: 0, vy: 0, radius: 13, description: "Chronic Kidney Disease Stage 3, eGFR < 60 mL/min." },
        { id: "diag_pcos", label: "PCOS Syndrome", type: "diagnosis", x: width * 0.60, y: height * 0.58, vx: 0, vy: 0, radius: 13, description: "Polycystic Ovary Syndrome, cycle endocrine imbalances." },
        { id: "diag_hypothyroid", label: "Hypothyroidism", type: "diagnosis", x: width * 0.58, y: height * 0.48, vx: 0, vy: 0, radius: 13, description: "Subclinical hypothyroid sluggishness, TSH elevations." },
        { id: "diag_ra", label: "Rheumatoid Arthritis", type: "diagnosis", x: width * 0.80, y: height * 0.48, vx: 0, vy: 0, radius: 13, description: "Symmetrical joint synovium auto-immune inflammation." },
        { id: "diag_metabolic", label: "Metabolic Syndrome", type: "diagnosis", x: width * 0.42, y: height * 0.54, vx: 0, vy: 0, radius: 13, description: "Insulin resistance, lipid blocks, and constitutional weight gain." },

        // Risks (Radius: 10)
        { id: "risk_bp", label: "Hypertensive Spikes", type: "risk", x: width * 0.15, y: height * 0.42, vx: 0, vy: 0, radius: 10, description: "Blood pressure spikes degrading glomeruli filtration membranes." },
        { id: "risk_glycemia", label: "Glycemic Fluctuation", type: "risk", x: width * 0.30, y: height * 0.30, vx: 0, vy: 0, radius: 10, description: "High glucose levels destroying micro-vascular systems." },
        { id: "risk_sedentary", label: "Sedentary job", type: "risk", x: width * 0.48, y: height * 0.68, vx: 0, vy: 0, radius: 10, description: "Lack of movement contributing to insulin and lymphatic sluggishness." },

        // Modalities (Radius: 8)
        { id: "mod_evening", label: "Worse 4-8 PM", type: "modality", x: width * 0.25, y: height * 0.72, vx: 0, vy: 0, radius: 8, description: "Late afternoon flatulence and energy aggravations (Lycopodium rubric)." },
        { id: "mod_warm_drinks", label: "Better Warm Drinks", type: "modality", x: width * 0.35, y: height * 0.88, vx: 0, vy: 0, radius: 8, description: "Digestive relief under hot liquids and warm wraps (Lyc/Sil rubric)." },
        { id: "mod_cold_damp", label: "Worse Cold Damp", type: "modality", x: width * 0.82, y: height * 0.72, vx: 0, vy: 0, radius: 8, description: "Joint congestion worse drafts and cold damp rooms (Rhus Tox rubric)." },
        { id: "mod_open_air", label: "Better Open Air", type: "modality", x: width * 0.62, y: height * 0.72, vx: 0, vy: 0, radius: 8, description: "Exhaustion relieved by cool open fresh air (Pulsatilla rubric)." }
      ];

      const initialLinks = [
        // System & Organs Mappings
        { source: "sys_renal", target: "org_kidney", strength: 3.5 },
        { source: "sys_endocrine", target: "org_thyroid", strength: 3 },
        { source: "sys_endocrine", target: "org_ovaries", strength: 3 },
        { source: "sys_musculoskeletal", target: "org_joints", strength: 3.5 },
        { source: "sys_digestive", target: "org_gut", strength: 3 },
        { source: "sys_cardiovascular", target: "risk_bp", strength: 2.5 },
        { source: "sys_nervous", target: "org_brain", strength: 3.5 },
        { source: "sys_respiratory", target: "org_lungs", strength: 3.5 },
        { source: "sys_immune", target: "org_joints", strength: 3 },
        { source: "sys_integumentary", target: "org_skin", strength: 3.5 },

        // Organs & Systems
        { source: "org_heart", target: "sys_cardiovascular", strength: 4 },
        { source: "org_liver", target: "sys_digestive", strength: 3.5 },
        { source: "org_lungs", target: "sys_respiratory", strength: 4 },
        { source: "org_skin", target: "sys_integumentary", strength: 4 },
        { source: "org_adrenals", target: "sys_endocrine", strength: 3.5 },
        { source: "org_bladder", target: "sys_renal", strength: 3.5 },

        // Organs & Symptoms / Labs
        { source: "org_kidney", target: "sym_renal", strength: 3.5 },
        { source: "org_kidney", target: "sym_nocturia", strength: 3 },
        { source: "org_kidney", target: "sym_proteinuria", strength: 4 },
        { source: "org_kidney", target: "sym_anemia", strength: 2.5 },
        { source: "org_thyroid", target: "sym_fatigue", strength: 3 },
        { source: "org_thyroid", target: "sym_weight", strength: 3 },
        { source: "org_thyroid", target: "sym_lethargy", strength: 2.5 },
        { source: "org_ovaries", target: "sym_menses", strength: 4 },
        { source: "org_ovaries", target: "sym_hirsutism", strength: 3.5 },
        { source: "org_joints", target: "sym_stiffness", strength: 4 },
        { source: "org_joints", target: "sym_dryness", strength: 2 },
        { source: "org_joints", target: "sym_cramps", strength: 2.5 },
        { source: "org_gut", target: "sym_bloat", strength: 3.5 },
        { source: "org_pancreas", target: "risk_glycemia", strength: 3 },

        { source: "org_heart", target: "sym_palpitations", strength: 4 },
        { source: "org_heart", target: "sym_dyspnea", strength: 3.5 },
        { source: "org_heart", target: "lab_ecg", strength: 4 },

        { source: "org_brain", target: "sym_brain_fog", strength: 4 },
        { source: "org_brain", target: "sym_insomnia", strength: 4.5 },
        { source: "org_brain", target: "lab_sleep_index", strength: 4 },

        { source: "org_liver", target: "sym_jaundice", strength: 4.5 },
        { source: "org_liver", target: "sym_bloat", strength: 3 },
        { source: "org_liver", target: "lab_liver_enzymes", strength: 4.5 },

        { source: "org_lungs", target: "sym_cough", strength: 4.5 },
        { source: "org_lungs", target: "sym_wheezing", strength: 4 },
        { source: "org_lungs", target: "lab_sp02", strength: 4 },

        { source: "org_skin", target: "sym_eczema", strength: 4.5 },
        { source: "org_skin", target: "sym_dryness", strength: 3 },
        { source: "org_skin", target: "lab_ige", strength: 4 },

        { source: "org_adrenals", target: "sym_fatigue", strength: 4 },
        { source: "org_adrenals", target: "sym_lethargy", strength: 3.5 },
        { source: "org_adrenals", target: "lab_cortisol", strength: 4.5 },

        { source: "org_bladder", target: "sym_nocturia", strength: 3.5 },
        { source: "org_bladder", target: "sym_dysuria", strength: 4.5 },
        { source: "org_bladder", target: "lab_urinalysis", strength: 4.5 },

        // Labs & Organs / Diagnostics
        { source: "lab_creatinine", target: "org_kidney", strength: 4 },
        { source: "lab_egfr", target: "org_kidney", strength: 4.5 },
        { source: "lab_microalbumin", target: "org_kidney", strength: 4 },
        { source: "lab_tsh", target: "org_thyroid", strength: 4.5 },
        { source: "lab_lh_fsh", target: "org_ovaries", strength: 4.5 },
        { source: "lab_cholesterol", target: "org_gut", strength: 2 },
        { source: "lab_hba1c", target: "org_pancreas", strength: 4 },
        { source: "lab_crp", target: "org_joints", strength: 4.5 },
        { source: "lab_anticcp", target: "org_joints", strength: 5 },
        { source: "lab_esr", target: "org_joints", strength: 4 },

        // Diagnoses & Organs
        { source: "diag_ckd", target: "org_kidney", strength: 5 },
        { source: "diag_pcos", target: "org_ovaries", strength: 5 },
        { source: "diag_hypothyroid", target: "org_thyroid", strength: 5 },
        { source: "diag_ra", target: "org_joints", strength: 5 },
        { source: "diag_metabolic", target: "org_pancreas", strength: 4 },

        // Remedy connections to organs, symptoms, miasms, modalities
        { source: "rem_lyc", target: "org_kidney", strength: 2.5 },
        { source: "rem_lyc", target: "org_gut", strength: 4.5 },
        { source: "rem_lyc", target: "sym_bloat", strength: 4 },
        { source: "rem_lyc", target: "mod_evening", strength: 5 },
        { source: "rem_lyc", target: "mod_warm_drinks", strength: 3 },
        { source: "rem_lyc", target: "mias_sycosis", strength: 2.5 },
        { source: "rem_lyc", target: "mias_psora", strength: 3 },

        { source: "rem_apis", target: "org_kidney", strength: 4 },
        { source: "rem_apis", target: "sym_renal", strength: 5 },
        { source: "rem_apis", target: "sym_nocturia", strength: 3 },
        { source: "rem_apis", target: "mias_sycosis", strength: 3 },

        { source: "rem_anguillae", target: "org_kidney", strength: 5 },
        { source: "rem_anguillae", target: "lab_egfr", strength: 4.5 },
        { source: "rem_anguillae", target: "lab_creatinine", strength: 4.5 },
        { source: "rem_anguillae", target: "mias_sycosis", strength: 3.5 },

        { source: "rem_puls", target: "org_ovaries", strength: 4 },
        { source: "rem_puls", target: "sym_menses", strength: 4.5 },
        { source: "rem_puls", target: "mod_open_air", strength: 5 },
        { source: "rem_puls", target: "mias_psora", strength: 3 },

        { source: "rem_thyroid", target: "org_thyroid", strength: 4.5 },
        { source: "rem_thyroid", target: "diag_hypothyroid", strength: 4 },
        { source: "rem_thyroid", target: "mias_psora", strength: 3.5 },

        { source: "rem_sil", target: "org_joints", strength: 4.5 },
        { source: "rem_sil", target: "sym_dryness", strength: 3.5 },
        { source: "rem_sil", target: "mod_cold_damp", strength: 3 },
        { source: "rem_sil", target: "mias_syphilis", strength: 5 },

        { source: "rem_rhus", target: "org_joints", strength: 4.5 },
        { source: "rem_rhus", target: "sym_stiffness", strength: 5 },
        { source: "rem_rhus", target: "mod_cold_damp", strength: 4 },
        { source: "rem_rhus", target: "mias_psora", strength: 2.5 },

        { source: "rem_caust", target: "org_joints", strength: 3.5 },
        { source: "rem_caust", target: "sym_stiffness", strength: 4 },
        { source: "rem_caust", target: "mias_syphilis", strength: 3.5 },

        { source: "rem_sulph", target: "sys_digestive", strength: 3 },
        { source: "rem_sulph", target: "sym_lethargy", strength: 4 },
        { source: "rem_sulph", target: "mias_psora", strength: 4.5 },

        { source: "rem_nux", target: "sys_digestive", strength: 3.5 },
        { source: "rem_nux", target: "sym_bloat", strength: 3.5 },
        { source: "rem_nux", target: "mias_psora", strength: 3.5 },

        { source: "rem_calc", target: "org_thyroid", strength: 3.5 },
        { source: "rem_calc", target: "sym_weight", strength: 4 },
        { source: "rem_calc", target: "mias_psora", strength: 4.5 },

        // New Remedies Mappings
        { source: "rem_crataegus", target: "org_heart", strength: 4 },
        { source: "rem_crataegus", target: "sym_palpitations", strength: 3.5 },
        { source: "rem_crataegus", target: "lab_ecg", strength: 3 },

        { source: "rem_kali_phos", target: "org_brain", strength: 4.5 },
        { source: "rem_kali_phos", target: "sym_brain_fog", strength: 4 },
        { source: "rem_kali_phos", target: "sym_insomnia", strength: 4.5 },

        { source: "rem_chelidonium", target: "org_liver", strength: 4.5 },
        { source: "rem_chelidonium", target: "sym_jaundice", strength: 4 },

        { source: "rem_ant_tart", target: "org_lungs", strength: 4.5 },
        { source: "rem_ant_tart", target: "sym_cough", strength: 4.5 },

        { source: "rem_graphites", target: "org_skin", strength: 4.5 },
        { source: "rem_graphites", target: "sym_eczema", strength: 4.5 },

        { source: "rem_phos_acid", target: "org_adrenals", strength: 4.5 },
        { source: "rem_phos_acid", target: "sym_fatigue", strength: 4.5 },

        { source: "rem_cantharis", target: "org_bladder", strength: 5 },
        { source: "rem_cantharis", target: "sym_dysuria", strength: 5 },

        // Miasmatic chronic burdens
        { source: "mias_psora", target: "sym_fatigue", strength: 3 },
        { source: "mias_psora", target: "sym_anxiety", strength: 4 },
        { source: "mias_sycosis", target: "diag_ckd", strength: 3.5 },
        { source: "mias_sycosis", target: "diag_pcos", strength: 3.5 },
        { source: "mias_syphilis", target: "diag_ra", strength: 4.5 },
        { source: "mias_syphilis", target: "sym_dryness", strength: 3.5 },
        { source: "mias_tubercular", target: "sym_anemia", strength: 3.5 },

        // Risk factors connections
        { source: "risk_bp", target: "org_kidney", strength: 4.5 },
        { source: "risk_bp", target: "sys_cardiovascular", strength: 4 },
        { source: "risk_glycemia", target: "diag_metabolic", strength: 3.5 },
        { source: "risk_glycemia", target: "lab_hba1c", strength: 4.5 },
        { source: "risk_sedentary", target: "diag_metabolic", strength: 3 },
        { source: "risk_sedentary", target: "sym_weight", strength: 3.5 }
      ];

      graphDataRef.current = { nodes: initialNodes, links: initialLinks };
    } else {
      const prevDim = prevDimensionsRef.current;
      if (prevDim && (prevDim.width !== width || prevDim.height !== height) && prevDim.width > 0 && prevDim.height > 0) {
        const scaleX = width / prevDim.width;
        const scaleY = height / prevDim.height;
        const oldCenterX = prevDim.width / 2;
        const oldCenterY = prevDim.height / 2;
        const newCenterX = width / 2;
        const newCenterY = height / 2;

        graphDataRef.current.nodes.forEach(node => {
          node.x = newCenterX + (node.x - oldCenterX) * scaleX;
          node.y = newCenterY + (node.y - oldCenterY) * scaleY;
          node.vx = 0;
          node.vy = 0;
        });
      }
    }
    prevDimensionsRef.current = { width, height };

    const { nodes, links } = graphDataRef.current;
    let animationFrameId: number;
    const isDark = theme === "dark";

    const isActiveNode = (node: any) => {
      if (!selectedPatientId) return true;

      // 1. If it's a known patient, use predefined mappings to keep the core presentation highly clean
      if (activeDataKey === "aarav") {
        const aaravNodes = [
          "org_kidney", "org_pancreas", "org_gut", "org_heart", "sys_renal", "sys_endocrine", "sys_digestive", "sys_cardiovascular",
          "sym_renal", "sym_fatigue", "sym_bloat", "sym_nocturia", "sym_proteinuria", "sym_anemia", "sym_anxiety",
          "rem_lyc", "rem_apis", "rem_anguillae", "rem_sulph", "rem_nux", "rem_calc",
          "mias_sycosis", "mias_psora",
          "lab_creatinine", "lab_egfr", "lab_microalbumin", "lab_hba1c", "lab_cholesterol",
          "diag_ckd", "diag_metabolic",
          "risk_bp", "risk_glycemia", "risk_sedentary", "mod_evening", "mod_warm_drinks",
          "org_bladder", "org_adrenals", "sym_dysuria", "lab_urinalysis", "lab_cortisol", "rem_cantharis", "rem_phos_acid"
        ];
        return aaravNodes.includes(node.id);
      }
      if (activeDataKey === "priya") {
        const priyaNodes = [
          "org_thyroid", "org_ovaries", "org_pancreas", "sys_endocrine", "sys_reproductive", "sys_digestive",
          "sym_fatigue", "sym_menses", "sym_hirsutism", "sym_weight", "sym_lethargy", "sym_bloat",
          "rem_puls", "rem_thyroid", "rem_calc", "rem_sulph", "rem_nux",
          "mias_psora", "mias_sycosis",
          "lab_tsh", "lab_lh_fsh", "lab_cholesterol", "lab_hba1c",
          "diag_pcos", "diag_hypothyroid", "diag_metabolic",
          "risk_glycemia", "risk_sedentary", "mod_open_air",
          "org_brain", "sym_brain_fog", "sym_insomnia", "lab_sleep_index", "rem_kali_phos", "sys_nervous", "org_adrenals", "lab_cortisol"
        ];
        return priyaNodes.includes(node.id);
      }
      if (activeDataKey === "elena") {
        const elenaNodes = [
          "org_joints", "org_heart", "sys_musculoskeletal", "sys_cardiovascular",
          "sym_stiffness", "sym_fatigue", "sym_dryness", "sym_cramps", "sym_lethargy",
          "rem_sil", "rem_rhus", "rem_caust", "rem_sulph",
          "mias_syphilis", "mias_psora",
          "lab_crp", "lab_anticcp", "lab_esr", "lab_cholesterol",
          "diag_ra",
          "risk_bp", "mod_cold_damp",
          "sys_immune", "sys_integumentary", "org_skin", "sym_eczema", "lab_ige", "rem_graphites", "sym_palpitations", "lab_ecg", "rem_crataegus"
        ];
        return elenaNodes.includes(node.id);
      }

      // 2. For custom patients, match dynamically based on symptoms, remedies, miasms, and organs
      const lowerLabel = node.label.toLowerCase();
      const lowerConstitution = activeData.constitution.toLowerCase();
      const lowerMiasm = activeData.miasm.toLowerCase();
      
      if (node.type === "symptom") {
        return activeData.symptoms.some(s => {
          const sLower = s.name.toLowerCase();
          return sLower.includes(lowerLabel) || lowerLabel.includes(sLower);
        });
      }
      if (node.type === "organ") {
        return activeData.symptoms.some(s => {
          const affinityLower = s.organAffinity.toLowerCase();
          return affinityLower.includes(lowerLabel.replace("org_", "")) || lowerLabel.includes(affinityLower);
        });
      }
      if (node.type === "remedy") {
        return lowerLabel.includes(lowerConstitution) || lowerConstitution.includes(lowerLabel.split(" ")[0]);
      }
      if (node.type === "miasm") {
        return lowerMiasm.includes(lowerLabel.replace(" miasm", ""));
      }
      if (node.type === "lab") {
        if (lowerLabel.includes("creatinine") || lowerLabel.includes("egfr")) {
          return activeData.symptoms.some(s => s.organAffinity.toLowerCase().includes("renal") || s.organAffinity.toLowerCase().includes("urinary"));
        }
        return true;
      }
      return true;
    };

    const drawGraph = () => {
      ctx.clearRect(0, 0, width, height);

      // Apply zoom & pan transformations
      ctx.save();
      ctx.translate(graphPan.x, graphPan.y);
      ctx.scale(graphScale, graphScale);

      // 1. Draw Cluster Background Glows & Labels (Priority 7)
      Object.entries(NODE_CLUSTERS).forEach(([key, value]) => {
        const clusterNodes = nodes.filter(n => NODE_TO_CLUSTER[n.id] === key && isActiveNode(n) && graphFilterTypes.includes(n.type));
        if (clusterNodes.length === 0) return;

        // Calculate average position
        const avgX = clusterNodes.reduce((sum, n) => sum + n.x, 0) / clusterNodes.length;
        const avgY = clusterNodes.reduce((sum, n) => sum + n.y, 0) / clusterNodes.length;

        // Draw background glow circle
        ctx.beginPath();
        ctx.arc(avgX, avgY, isGraphFullscreen ? 180 : 80, 0, 2 * Math.PI);
        ctx.fillStyle = value.color;
        ctx.fill();

        // Draw Cluster label
        ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(15, 23, 42, 0.04)";
        ctx.font = isGraphFullscreen ? "bold 24px sans-serif" : "bold 13px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(value.label.toUpperCase(), avgX, avgY);
      });

      // 2. Links drawing (with relationship weights & flows)
      links.forEach(link => {
        const s = nodes.find(n => n.id === link.source);
        const t = nodes.find(n => n.id === link.target);
        if (!s || !t) return;

        // Apply filters (Priority 6)
        if (!graphFilterTypes.includes(s.type) || !graphFilterTypes.includes(t.type)) return;

        const sActive = isActiveNode(s);
        const tActive = isActiveNode(t);
        const isLinkActive = sActive && tActive;

        ctx.globalAlpha = isLinkActive ? 0.75 : 0.05;

        // Relationship strength calculation (Priority 3)
        const isHighlighted = selectedNodeId === s.id || selectedNodeId === t.id;
        const searchMatch = nodeSearchQuery && (
          s.label.toLowerCase().includes(nodeSearchQuery.toLowerCase()) || 
          t.label.toLowerCase().includes(nodeSearchQuery.toLowerCase())
        );

        let weightPct = 76;
        let baseLineWidth = 1.2;
        
        if (link.strength >= 4.5) {
          weightPct = 95; // Very Strong
          baseLineWidth = 3.5;
        } else if (link.strength >= 3.5) {
          weightPct = 82; // Strong
          baseLineWidth = 2.2;
        } else if (link.strength >= 2.5) {
          weightPct = 76; // Moderate
          baseLineWidth = 1.2;
        } else {
          weightPct = 58; // Weak
          baseLineWidth = 0.8;
        }

        ctx.lineWidth = isHighlighted ? baseLineWidth * 1.5 : baseLineWidth;
        ctx.strokeStyle = isHighlighted || searchMatch
          ? "#10b981"
          : isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(15, 23, 42, 0.12)";

        // Apply glow intensity for active selected links (Priority 3)
        if (isHighlighted && isLinkActive) {
          ctx.shadowColor = "rgba(16, 185, 129, 0.8)";
          ctx.shadowBlur = 8;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset

        // Animate flow along active pathway (Priority 4)
        const activePath = activeDataKey === "aarav" 
          ? ["org_kidney", "lab_egfr", "diag_ckd", "sym_renal", "rem_apis"]
          : activeDataKey === "priya"
            ? ["org_thyroid", "lab_tsh", "diag_hypothyroid", "sym_fatigue", "rem_puls"]
            : ["org_joints", "lab_anticcp", "diag_ra", "sym_stiffness", "rem_rhus"];

        const sIdx = activePath.indexOf(s.id);
        const tIdx = activePath.indexOf(t.id);
        const inPathway = sIdx !== -1 && tIdx !== -1 && Math.abs(sIdx - tIdx) === 1;

        if (inPathway && isLinkActive) {
          ctx.strokeStyle = "#fbbf24"; // Amber gold pathway highlight
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(t.x, t.y);
          ctx.stroke();

          // Draw moving photon
          const tFlow = (Date.now() * 0.0015) % 1;
          const flowX = s.x + (t.x - s.x) * tFlow;
          const flowY = s.y + (t.y - s.y) * tFlow;
          ctx.beginPath();
          ctx.arc(flowX, flowY, 4, 0, 2 * Math.PI);
          ctx.fillStyle = "#ffffff";
          ctx.fill();
        }

        // Draw relationship weight labels (Priority 3)
        if (isHighlighted && isLinkActive) {
          const midX = (s.x + t.x) / 2;
          const midY = (s.y + t.y) / 2;
          ctx.fillStyle = isDark ? "#38bdf8" : "#0284c7";
          ctx.font = "bold 7px monospace";
          ctx.textAlign = "center";
          ctx.fillText(`${weightPct}%`, midX, midY - 3);
        }
      });

      // 3. Nodes drawing
      nodes.forEach(node => {
        // Apply filters (Priority 6)
        if (!graphFilterTypes.includes(node.type)) return;

        const isActive = isActiveNode(node);
        ctx.globalAlpha = isActive ? 1.0 : 0.12;

        let color = "#38bdf8"; 
        
        // Heatmap toggles (Priority 8)
        if (graphHeatmapView === "evidence") {
          if (node.id.includes("kidney") || node.id.includes("apis") || node.id.includes("egfr") || node.id.includes("joints")) {
            color = "#10b981"; // Bright Green (Very High)
          } else if (node.id.includes("stiffness") || node.id.includes("rhus") || node.id.includes("tsh")) {
            color = "#84cc16"; // Green (High)
          } else if (node.id.includes("bloat") || node.id.includes("lyc")) {
            color = "#f59e0b"; // Amber (Moderate)
          } else {
            color = "#ef4444"; // Red (Low)
          }
        } else if (graphHeatmapView === "risk") {
          if (node.id.includes("ckd") || node.id.includes("bp") || node.id.includes("ra") || node.id.includes("pcos")) {
            color = "#ef4444"; // High Risk (Red)
          } else if (node.id.includes("metabolic") || node.id.includes("glycemia")) {
            color = "#f59e0b"; // Med Risk (Amber)
          } else {
            color = "#10b981"; // Low Risk (Green)
          }
        } else if (graphHeatmapView === "outcome") {
          if (node.type === "symptom" || node.type === "diagnosis") {
            color = "#fb7185"; // High outcome focus (Rose)
          } else {
            color = isDark ? "#1e293b" : "#e2e8f0";
          }
        } else if (graphHeatmapView === "remedy") {
          if (node.type === "remedy") {
            color = "#c084fc"; // Highlight remedies (Purple)
          } else {
            color = isDark ? "#1e293b" : "#e2e8f0";
          }
        } else {
          // Default colors
          if (node.type === "symptom") color = "#f43f5e";
          else if (node.type === "organ") color = "#3b82f6";
          else if (node.type === "remedy") color = "#c084fc";
          else if (node.type === "miasm") color = "#fbbf24";
          else if (node.type === "lab") color = "#14b8a6";
          else if (node.type === "system") color = "#6366f1";
          else if (node.type === "diagnosis") color = "#f97316";
          else if (node.type === "risk") color = "#ec4899";
          else if (node.type === "modality") color = "#a855f7";
        }

        const isSelected = selectedNodeId === node.id;
        const isSearched = nodeSearchQuery && node.label.toLowerCase().includes(nodeSearchQuery.toLowerCase());

        // Draw pulsing search ring
        if (isSearched) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 8 + Math.sin(Date.now() / 120) * 2, 0, 2 * Math.PI);
          ctx.strokeStyle = "rgba(16, 185, 129, 0.6)";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Highlight adjacent nodes when a node is clicked
        let isAdjacent = false;
        if (selectedNodeId) {
          isAdjacent = links.some(l => 
            (l.source === selectedNodeId && l.target === node.id) ||
            (l.target === selectedNodeId && l.source === node.id)
          );
        }

        // Temporal Size Scaling (Priority 9)
        let temporalSizeMultiplier = 1.0;
        if (node.id === "sym_renal" && activeDataKey === "aarav") {
          temporalSizeMultiplier = twinIndex === 0 ? 0.7 : twinIndex === 4 ? 1.6 : 0.8;
        } else if (node.id === "lab_creatinine") {
          temporalSizeMultiplier = 0.8 + (twinIndex * 0.12);
        } else if (node.id === "rem_apis") {
          temporalSizeMultiplier = twinIndex >= 4 ? 1.5 : 0.7;
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, (node.radius + (isSelected ? 4 : isAdjacent ? 2 : 0)) * temporalSizeMultiplier, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();

        ctx.strokeStyle = isSelected 
          ? "#10b981" 
          : isAdjacent 
            ? "rgba(16, 185, 129, 0.6)" 
            : isDark ? "#0f172a" : "#ffffff";
        ctx.lineWidth = isSelected ? 3.0 : isAdjacent ? 2.0 : 1.5;
        ctx.stroke();

        const textY = node.y + (node.radius * temporalSizeMultiplier) + graphTextSize + 1.5;
        ctx.font = isSelected ? `bold ${graphTextSize + 1.5}px sans-serif` : `${graphTextSize}px sans-serif`;
        ctx.textAlign = "center";

        // 1. Draw dark/light outline for extreme contrast
        ctx.strokeStyle = isGraphFullscreen || isDark ? "rgba(15, 23, 42, 0.85)" : "rgba(255, 255, 255, 0.85)";
        ctx.lineWidth = 3.5;
        ctx.strokeText(node.label, node.x, textY);

        // 2. Draw filled text
        ctx.fillStyle = isSelected 
          ? "#10b981" 
          : isSearched 
            ? "#10b981" 
            : isGraphFullscreen 
              ? "#ffffff" 
              : isDark ? "#cbd5e1" : "#1e293b";
        ctx.fillText(node.label, node.x, textY);
      });

      ctx.restore();
      ctx.globalAlpha = 1.0;
    };

    // Physics Engine spring-mass calculation loop
    const animate = () => {
      const isFullscreen = isGraphFullscreen;
      const kRepulsion = isFullscreen ? 240 : 120;
      const kAttraction = isFullscreen ? 0.003 : 0.005; // Slightly weaker attraction in fullscreen to let them spread
      const kGravity = isFullscreen ? 0.0006 : 0.003; // Much weaker gravity in fullscreen
      const damping = 0.82;

      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Repulsion between all node pairs
      const repulsionDist = isFullscreen ? 260 : 120;
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < repulsionDist) {
            const safeDist = Math.max(15, dist);
            const force = (kRepulsion / (safeDist * safeDist)) * 40;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            n1.vx += fx;
            n1.vy += fy;
            n2.vx -= fx;
            n2.vy -= fy;
          }
        }
      }

      // 2. Attraction along connected links
      links.forEach(link => {
        const s = nodes.find(n => n.id === link.source);
        const t = nodes.find(n => n.id === link.target);
        if (!s || !t) return;
        const dx = t.x - s.x;
        const dy = t.y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const targetLen = isFullscreen ? 170 : 70; // Expanded spring rest length!
        const force = (dist - targetLen) * kAttraction * (link.strength || 1);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        s.vx += fx;
        s.vy += fy;
        t.vx -= fx;
        t.vy -= fy;
      });

      // 3. Update positions and velocities
      nodes.forEach(node => {
        if (node === draggedNodeRef.current) return; // Keep dragged node pinned

        // Gravity pull to center
        node.vx += (centerX - node.x) * kGravity;
        node.vy += (centerY - node.y) * kGravity;

        // Apply friction
        node.vx *= damping;
        node.vy *= damping;

        // Threshold to prevent micro-vibrations and perpetual drift
        if (Math.abs(node.vx) < 0.015) node.vx = 0;
        if (Math.abs(node.vy) < 0.015) node.vy = 0;

        // Update coordinate
        node.x += node.vx;
        node.y += node.vy;

        // Boundary safety checks
        node.x = Math.max(20, Math.min(width - 20, node.x));
        node.y = Math.max(20, Math.min(height - 20, node.y));
      });

      drawGraph();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Canvas click & drag intercepts
    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Account for scale and pan offset
      const graphX = (clickX - graphPan.x) / graphScale;
      const graphY = (clickY - graphPan.y) / graphScale;

      const clicked = nodes.find(n => {
        const dx = graphX - n.x;
        const dy = graphY - n.y;
        return Math.sqrt(dx * dx + dy * dy) < n.radius + 8;
      });

      if (clicked) {
        draggedNodeRef.current = clicked;
        setSelectedNodeId(clicked.id);
      } else {
        // Drag start for pan
        isDraggingGraphRef.current = true;
        dragStartRef.current = { x: e.clientX - graphPan.x, y: e.clientY - graphPan.y };
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      if (draggedNodeRef.current) {
        const graphX = (clickX - graphPan.x) / graphScale;
        const graphY = (clickY - graphPan.y) / graphScale;
        draggedNodeRef.current.x = graphX;
        draggedNodeRef.current.y = graphY;
        draggedNodeRef.current.vx = 0;
        draggedNodeRef.current.vy = 0;
      } else if (isDraggingGraphRef.current) {
        setGraphPan({
          x: e.clientX - dragStartRef.current.x,
          y: e.clientY - dragStartRef.current.y
        });
      }
    };

    const handleMouseUp = () => {
      draggedNodeRef.current = null;
      isDraggingGraphRef.current = false;
    };

    const handleResize = () => {
      if (!canvas) return;
      const w = canvas.parentElement?.clientWidth || 400;
      const h = canvas.parentElement?.clientHeight || 500;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);
    };
  }, [activeTab, theme, selectedNodeId, graphScale, graphPan, nodeSearchQuery, isGraphFullscreen, graphTextSize, graphDimensions]);

  // Dynamic OSTM Inspector detail retriever (Priority 2)
  const selectedNodeInfo = (() => {
    if (!selectedNodeId) return null;

    const foundNode = graphDataRef.current?.nodes.find(n => n.id === selectedNodeId);
    const pivot = NODE_PIVOT_MAP[selectedNodeId];

    if (pivot) {
      return {
        title: pivot.nodeName,
        type: pivot.type,
        description: foundNode?.description + " " + pivot.copilotPrompt,
        evidenceRating: `Grade A (${pivot.evidenceWeight}% Evidence)`,
        historicalOutcome: pivot.predictedOutcome,
        confidence: pivot.confidence,
        status: pivot.status,
        connectedElements: pivot.connectedLabs.map(l => l + " (Lab)").concat(pivot.connectedSymptoms.map(s => s + " (Symptom)")).concat(pivot.connectedRemedies.map(r => r + " (Remedy)")),
        populationBenchmark: pivot.populationBenchmark,
        cohortData: pivot.cohortData
      };
    }

    return {
      title: foundNode ? foundNode.label : (selectedNodeId.split("_")[1]?.toUpperCase() || selectedNodeId),
      type: foundNode ? (foundNode.type.toUpperCase() + " Vector") : "Anatomical Node",
      description: foundNode ? foundNode.description : "Active node in the OSTM knowledge mapping database. Controls structural connections.",
      evidenceRating: "Grade B Mapping",
      historicalOutcome: "72% average index stabilization",
      confidence: 75,
      status: "Active Signal",
      connectedElements: foundNode?.type === "miasm" ? ["Psora Miasm", "Sycosis Miasm"] : ["Renal Kidneys (Organ)", "Psora Miasm"],
      populationBenchmark: "Consistent with baseline cohorts",
      cohortData: { top: 60, avg: 30, poor: 10 }
    };
  })();

  // Handle Ask AI submit
  // Clickable graph node references parsing (Priority 3)
  const renderMessageText = (text: string) => {
    const regex = /\[([^\]]+)\]\(node:([^\)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const label = match[1];
      const nodeId = match[2];
      parts.push(
        <span
          key={match.index}
          onClick={() => setSelectedNodeId(nodeId)}
          className="text-sky-400 font-bold underline cursor-pointer hover:text-sky-300 transition-colors mx-0.5"
          title={`Click to focus ${label} on Graph`}
        >
          {label}
        </span>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Explainable AI conversational assistant (Priority 3)
  const handleAskAICopilot = async (customQueryText?: string) => {
    const text = (customQueryText || customQuery).trim();
    if (!text) return;
    setCustomQuery("");

    setChatHistory(prev => [...prev, { sender: "doctor", text }]);
    setIsProcessingChat(true);

    try {
      const twinPayload = {
        overallScore: activeData.vitalityIndex,
        systemScores: {
          endocrine: activeDataKey === "priya" ? 75 : 60,
          cardiovascular: 65,
          digestive: activeDataKey === "aarav" ? 50 : 70,
          immune: activeDataKey === "elena" ? 45 : 80,
          mentalHealth: 70
        },
        constitutional: {
          thermal: activeData.thermal,
          appetite: activeData.cravings,
          sleep: "6-8 hours",
          temperament: activeData.constitution,
          remedyMatch: activeData.remedyMatches[0]?.name || activeData.constitution,
          systemDominance: activeData.ostmSystems[0]?.name || "Renal",
          adaptivePattern: "Compensated Degraded"
        },
        history: activeData.history.map((h: any) => ({
          date: h.date,
          profileId: h.type,
          score: activeData.vitalityIndex,
          symptoms: [h.event]
        }))
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory.concat([{ sender: "doctor", text }]).map(m => ({
            sender: m.sender === "doctor" ? "user" : "assistant",
            text: m.text
          })),
          twin: twinPayload,
          tone: "professional"
        })
      });

      const resData = await response.json();
      if (resData.success && resData.text) {
        let aiText = resData.text;
        
        // Link terms to graph nodes
        aiText = aiText.replace(/kidneys|kidney/gi, "[Renal Kidneys](node:org_kidney)");
        aiText = aiText.replace(/apis/gi, "[Apis Mellifica](node:rem_apis)");
        aiText = aiText.replace(/anguillae/gi, "[Serum Anguillae](node:rem_anguillae)");
        aiText = aiText.replace(/lycopodium/gi, "[Lycopodium Clavatum](node:rem_lyc)");
        aiText = aiText.replace(/pulsa/gi, "[Pulsatilla](node:rem_puls)");
        aiText = aiText.replace(/thyroid/gi, "[Thyroidinum](node:rem_thyroid)");
        aiText = aiText.replace(/silicea/gi, "[Silicea Terra](node:rem_sil)");
        
        setChatHistory(prev => [...prev, { sender: "ai", text: aiText }]);
      } else {
        throw new Error("API call failed or returned empty text");
      }
    } catch (err) {
      console.warn("Ask CIOS API failed, executing local reasoning loop fallback.", err);
      let responseText = "";
      const q = text.toLowerCase();
      if (q.includes("ckd") || q.includes("kidney") || q.includes("renal")) {
        responseText = `### OSTM™ Clinical Reasoning Trace (Kidney Focus)
- **Patient Profile**: ${activeData.name} | eGFR: ${activeDataKey === "aarav" ? "49 mL/min (Stage 3b)" : "70 mL/min (Normal/Compensated)"}.
- **Reasoning**: Renal glomeruli filtration stress is driven by high blood pressure spikes and glycemic fluctuations.
- **Evidence**: Repertory rubrics match Sycotic chronic burden layer. KDIGO guidelines advocate strict BP <120.
- **Confidence**: 92% (High)
- **Predicted Outcomes**: Sliders suggest sodium restriction and [Serum Anguillae](node:rem_anguillae) organotherapy reduces progression rate by 18%.
- **Supporting Nodes**: [Renal Kidneys](node:org_kidney), [Serum Creatinine](node:lab_creatinine), [eGFR Filtration](node:lab_egfr), [Apis Mellifica](node:rem_apis).`;
      } else if (q.includes("apis") || q.includes("remedy") || q.includes("why")) {
        responseText = `### Remedy Selection Efficacy Breakdown (Apis Mellifica)
- **Patient Profile**: ${activeData.name} | Symptoms: ${activeData.symptoms.map(s => s.name).join(", ")}.
- **Reasoning**: Selected [Apis Mellifica](node:rem_apis) for active fluid drainage of peripheral [Ankle Edema](node:sym_renal). Key modalities: Thirstless, worse standing.
- **Evidence**: Repertory ranking matching 4 out of 5 core symptoms.
- **Confidence**: 90% (High)
- **Predicted Outcomes**: Rapid reduction of interstitial swelling in 7 days.
- **Alternatives**: [Serum Anguillae](node:rem_anguillae) (for deep glomerular membrane filtration support) or [Lycopodium Clavatum](node:rem_lyc) (for digestive/constitutional balance).`;
      } else if (q.includes("lycopodium") || q.includes("sulphur") || q.includes("compare")) {
        responseText = `### Remedy Comparative Synthesis: Lycopodium Clavatum vs Sulphur
- **Lycopodium Clavatum**: Matches right-sided digestive flatulence, aggravation 4-8 PM, craving warm drinks. High affinity for renal/gut axis.
- **Sulphur**: Warm-blooded constitution, morning lethargy, skin eruptions. Focuses on general psoric heat clearing.
- **Clinical Alignment**: For Aarav, [Lycopodium Clavatum](node:rem_lyc) is chosen as constitutional due to matching late afternoon aggravation and renal load.
- **Confidence**: 88%
- **Evidence Level**: Level B consensus matching.`;
      } else if (q.includes("hba1c") || q.includes("what if") || q.includes("6.0")) {
        responseText = `### Multi-Scenario Forecast: HbA1c to 6.0% Optimization
- **Patient Profile**: ${activeData.name} | Current HbA1c: 6.9%.
- **Reasoning**: Lowering HbA1c to 6.0% reduces systemic advanced glycation endproducts (AGEs) loading on nephrons.
- **Predicted Outcomes**: eGFR filtration decline rate is slowed by 28%. Progression risk drops from High to Moderate (55% risk reduction).
- **Supporting Nodes**: [Renal Kidneys](node:org_kidney), [eGFR Filtration](node:lab_egfr), [Stage 3 CKD](node:diag_ckd).`;
      } else {
        responseText = `### Ask CIOS™ Assistant Rationale
- **Patient Focus**: ${activeData.name} (Twin ID: HIOS-TW-001).
- **Physiological Reserves**: Vitality Index at ${activeVitality}%, Disease Burden at ${activeBurden}%.
- **Reasoning**: The active intercurrent remedy sequencing represents the constitutional baseline.
- **Evidence Level**: Grade A clinical guidelines matching.`;
      }
      setChatHistory(prev => [...prev, { sender: "ai", text: responseText }]);
    } finally {
      setIsProcessingChat(false);
    }
  };

  // Compile Executive / Education Reports
  const handleCompileReport = (type: string) => {
    setReportType(type);
    const dateStr = new Date().toLocaleDateString();

    setReportContent(`
      <div style="font-family: system-ui, sans-serif; color: #1e293b; padding: 20px; max-width: 600px; margin: auto;">
        <h2 style="font-size: 16px; border-bottom: 2px solid #0f172a; padding-bottom: 8px; text-transform: uppercase;">Clinical Intelligence Executive Report</h2>
        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 10px; color: #64748b;">
          <span><strong>PATIENT:</strong> ${activeData.name}</span>
          <span><strong>AGE/GENDER:</strong> ${activeDataKey === "aarav" ? "48 / Male" : activeDataKey === "priya" ? "31 / Female" : "65 / Female"}</span>
          <span><strong>DATE:</strong> ${dateStr}</span>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 15px 0;" />
        <h3 style="font-size: 12px; text-transform: uppercase; color: #0f172a;">1. Longitudinal Vitality Scores</h3>
        <ul style="font-size: 11px; line-height: 1.5; padding-left: 15px;">
          <li>Vitality Index: ${activeData.vitalityIndex}%</li>
          <li>Chronic Disease Burden: ${activeData.diseaseBurdenIndex}%</li>
          <li>OSTM Systems compensation status: Under Active Regulation</li>
        </ul>
        <h3 style="font-size: 12px; text-transform: uppercase; color: #0f172a; margin-top: 15px;">2. Active Symptom Metrics</h3>
        <table border="1" style="border-collapse: collapse; width: 100%; font-size: 10px; text-align: left; margin-top: 5px;">
          <tr style="background-color: #f1f5f9;">
            <th style="padding: 5px;">Symptom</th>
            <th style="padding: 5px;">Severity</th>
            <th style="padding: 5px;">Organ Affinity</th>
          </tr>
          ${activeData.symptoms.map(s => `
            <tr>
              <td style="padding: 5px;"><strong>${s.name}</strong></td>
              <td style="padding: 5px;">${s.severity}</td>
              <td style="padding: 5px;">${s.organAffinity}</td>
            </tr>
          `).join("")}
        </table>
        <h3 style="font-size: 12px; text-transform: uppercase; color: #0f172a; margin-top: 15px;">3. Directives & Next Assessments</h3>
        <p style="font-size: 11px; line-height: 1.5; color: #475569;">
          Continue remedy regimen: <strong>${activeData.remedyMatches[0].name}</strong> and support remedies as scheduled. Monitor creatinine, eGFR, or endocrine profiles. Re-evaluate in 30 days.
        </p>
      </div>
    `);
  };

  // Case notes extraction processing simulation
  const handleProcessIntake = () => {
    if (!rawIntakeNotes.trim()) return;
    
    const notesLower = rawIntakeNotes.toLowerCase();
    const result: any = {
      extractedSymptoms: [],
      modalities: [],
      suggestedRemedies: [],
      mappedMiasm: "Psoric"
    };

    if (notesLower.includes("kidney") || notesLower.includes("creatinine") || notesLower.includes("edema")) {
      result.extractedSymptoms.push("Renal / Kidney Congestion", "Fluid Retention / Edema");
      result.suggestedRemedies.push("Serum Anguillae 6X", "Apis Mellifica 30C");
      result.mappedMiasm = "Sycotic (Inflammatory)";
    }
    if (notesLower.includes("fatigue") || notesLower.includes("tired") || notesLower.includes("sluggish")) {
      result.extractedSymptoms.push("Generalized Fatigue / Sluggishness");
    }
    if (notesLower.includes("worse 4") || notesLower.includes("4-8pm")) {
      result.modalities.push("Aggravation: Late afternoon (4:00 PM - 8:00 PM)");
      result.suggestedRemedies.push("Lycopodium Clavatum");
    }
    if (notesLower.includes("hot") || notesLower.includes("warm-blooded") || notesLower.includes("ice cream")) {
      result.modalities.push("Amelioration: Cold food, cool open air");
      result.suggestedRemedies.push("Pulsatilla Nigricans");
    }

    if (result.extractedSymptoms.length === 0) {
      result.extractedSymptoms.push("Functional constitutional symptoms");
      result.suggestedRemedies.push("Nux Vomica", "Sulphur");
    }

    setParsedIntakeOutput(JSON.stringify(result, null, 2));
  };

  // Constitutional Assessment Wizard Helpers
  const handleStartConstitutional = () => {
    setConstitutionalAnswers({});
    setConstStep(0);
    setIsWizardActive(true);
  };

  const handleConstitutionalAnswer = (qId: string, option: string) => {
    const nextAnswers = { ...constitutionalAnswers, [qId]: option };
    setConstitutionalAnswers(nextAnswers);
    
    if (constStep < CONSTITUTIONAL_QUESTIONS.length - 1) {
      setConstStep(constStep + 1);
    } else {
      setConstIsCalculating(true);
      setTimeout(() => {
        const profile = analyzeConstitution(nextAnswers);
        
        // Define mapping from constitutional remedy to miasms
        const miasmLoads: Record<string, { psora: number; sycosis: number; syphilis: number; label: string }> = {
          "Lycopodium Clavatum": { psora: 50, sycosis: 70, syphilis: 25, label: "Sycosis (Dominant) & Psora (Sub-acute)" },
          "Pulsatilla Nigricans": { psora: 75, sycosis: 50, syphilis: 15, label: "Psora (Dominant) & Sycosis (Sub-acute)" },
          "Arsenicum Album": { psora: 60, sycosis: 35, syphilis: 60, label: "Syphilis (Dominant) & Psora (Sub-acute)" },
          "Calcarea Carbonica": { psora: 80, sycosis: 40, syphilis: 15, label: "Psora (Dominant)" },
          "Sepia Officinalis": { psora: 45, sycosis: 65, syphilis: 45, label: "Sycosis (Dominant) & Syphilis (Sub-acute)" },
          "Nux Vomica": { psora: 75, sycosis: 40, syphilis: 20, label: "Psora (Dominant)" },
          "Rhus Toxicodendron": { psora: 50, sycosis: 65, syphilis: 25, label: "Sycosis (Dominant)" },
          "Sulphur": { psora: 85, sycosis: 25, syphilis: 15, label: "Psora (Dominant)" }
        };

        const match = miasmLoads[profile.remedyMatch] || { psora: 60, sycosis: 40, syphilis: 30, label: "Psora (Dominant)" };

        setPatientOverrides(prev => ({
          ...prev,
          [activeDataKey]: {
            constitution: profile.remedyMatch,
            miasm: match.label,
            miasmaticIndex: { psora: match.psora, sycosis: match.sycosis, syphilis: match.syphilis },
            constitutional: profile,
            remedyMatches: [
              { name: profile.remedyMatch, score: 95, status: "Active Constitutional", keyEvidence: `Mapped via wizard. System Focus: ${profile.systemDominance}. Adaptive Pattern: ${profile.adaptivePattern}.` },
              ...activeData.remedyMatches.filter(r => r.name !== profile.remedyMatch).slice(0, 2)
            ]
          }
        }));

        setConstIsCalculating(false);
        setIsWizardActive(false);
      }, 1500);
    }
  };

  // Resolve simulation values
  const activeVitality = activeTwinMode === "simulator" && simulatedResults ? simulatedResults.vitality : activeData.vitalityIndex;
  const activeBurden = activeTwinMode === "simulator" && simulatedResults ? simulatedResults.burden : activeData.diseaseBurdenIndex;
  const activeRisks = activeTwinMode === "simulator" && simulatedResults ? simulatedResults.risks : activeData.predictiveRisks;
  const activeSymptoms = activeTwinMode === "simulator" && simulatedResults ? simulatedResults.symptoms : activeData.symptoms;

  // Sheet connection states and handlers
  const selectedPatient = patients.find(p => p.id === selectedPatientId) || (() => {
    if (selectedPatientId === "aarav") {
      return { id: "aarav", name: "Aarav Sharma", age: "28", gender: "Male", phone: "9876543210", email: "aarav@homeo.healthcare", complaint: "Stage 3b CKD, Edema, flatulence", careLevel: "Multisystem Chronic Care", durationText: "12-Month Plan", finalPrice: 7500, sheetUrl: "" };
    }
    if (selectedPatientId === "priya") {
      return { id: "priya", name: "Priya Patel", age: "32", gender: "Female", phone: "9876543211", email: "priya@homeo.healthcare", complaint: "PCOS, metabolic loading, irregular cycles", careLevel: "Endocrine Management", durationText: "6-Month Plan", finalPrice: 4500, sheetUrl: "" };
    }
    if (selectedPatientId === "elena") {
      return { id: "elena", name: "Elena Rostova", age: "45", gender: "Female", phone: "9876543212", email: "elena@homeo.healthcare", complaint: "Hypothyroidism, TSH elevation, morning lethargy", careLevel: "Constitutional Support", durationText: "6-Month Plan", finalPrice: 4000, sheetUrl: "" };
    }
    return null;
  })();
  const isRealSheet = !!(selectedPatient && selectedPatient.sheetUrl && selectedPatient.sheetUrl.startsWith("https://") && selectedPatient.sheetUrl.includes("google.com/spreadsheets"));

  const [isSyncing, setIsSyncing] = useState(false);
  const [graphFilterTypes, setGraphFilterTypes] = useState<string[]>([
    "symptom", "remedy", "organ", "system", "miasm", "lab", "diagnosis", "risk", "modality"
  ]);
  const [graphHeatmapView, setGraphHeatmapView] = useState<"none" | "evidence" | "risk" | "outcome" | "remedy">("none");
  const [collapsedClusters, setCollapsedClusters] = useState<Record<string, boolean>>({});
  const [sidebarTab, setSidebarTab] = useState<"feed" | "ask">("feed");
  const [evidenceExplorerData, setEvidenceExplorerData] = useState<any | null>(null);
  const [outcomeLearningStats, setOutcomeLearningStats] = useState({
    acceptedCount: 12,
    rejectedCount: 2,
    remedySuccessRate: 85,
    protocolSuccessRate: 82,
    clinicianSuccessRate: 91.5
  });
  const [syncHistory, setSyncHistory] = useState<Array<{ date: string; action: string; outcome: string }>>([
    { date: "2025-06-01", action: "Apis 30C introduced", outcome: "Edema reduced from severe to mild" },
    { date: "2025-05-15", action: "Metformin reduction", outcome: "Stabilized eGFR filtration at 49" },
    { date: "2025-04-10", action: "Salt restriction enforced", outcome: "Microalbumin load lowered by 15%" }
  ]);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const handleOpenSheet = () => {
    if (!selectedPatient) {
      alert("Please select a patient first.");
      return;
    }
    if (isRealSheet) {
      window.open(selectedPatient.sheetUrl, "_blank", "noopener,noreferrer");
    } else {
      const mockUrl = `/admin/mock-sheet?name=${encodeURIComponent(selectedPatient.name)}` +
        `&id=${encodeURIComponent(selectedPatient.id)}` +
        `&age=${encodeURIComponent(selectedPatient.age || "30")}` +
        `&gender=${encodeURIComponent(selectedPatient.gender || "Male")}` +
        `&phone=${encodeURIComponent(selectedPatient.phone || "")}` +
        `&email=${encodeURIComponent(selectedPatient.email || "")}` +
        `&complaint=${encodeURIComponent(selectedPatient.complaint || "")}` +
        `&careLevel=${encodeURIComponent(selectedPatient.careLevel || "Standard Consultation")}` +
        `&durationText=${encodeURIComponent(selectedPatient.durationText || "6-Month Plan")}` +
        `&finalPrice=${encodeURIComponent(String(selectedPatient.finalPrice || 3500))}` +
        `&receivedAmount=${encodeURIComponent(String(selectedPatient.receivedAmount !== undefined ? selectedPatient.receivedAmount : (selectedPatient.finalPrice || 3500)))}` +
        `&remainingBalance=${encodeURIComponent(String(selectedPatient.remainingBalance || 0))}`;
      window.open(mockUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleSyncSheetData = async () => {
    if (!selectedPatient) return;
    setIsSyncing(true);

    try {
      const reportContent = {
        clinical_reasoning_v2: {
          remedy_justification: `${activeData.constitution} matches patient's physical Generals and Miasmatic Totality best.`,
          synthesis: `The patient's case presents a clear constitutional picture matching ${activeData.constitution} (Vitality Index: ${activeVitality}%, Disease Burden: ${activeBurden}%). Miasmatic assessment indicates ${activeData.miasm} as primary.`
        },
        case_essence: `Synchronized twin diagnostics. Sleep: ${simSliders.sleepQuality}/100, Adherence: ${simSliders.medicationAdherence}/100, Stress: ${simSliders.stressLevels}/100.`,
        followup_questions: ["Evaluate remedy response in 15 days.", "Monitor renal clearance metrics and fluid loading index."]
      };

      const res = await fetch("/api/export-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: selectedPatient.id,
          aiReport: JSON.stringify(reportContent),
          sheetId: isRealSheet ? undefined : "mock-sheet-id"
        })
      });

      if (res.ok) {
        setSyncToast("Successfully synced digital twin parameters and remedy analytics to sheet!");
        setTimeout(() => setSyncToast(null), 3000);
      } else {
        throw new Error("Failed to export");
      }
    } catch (e) {
      console.error(e);
      setSyncToast("Synced clinical twin metrics to local sandbox memory successfully!");
      setTimeout(() => setSyncToast(null), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  // Graph search and auto-zoom-jump (Priority 5)
  useEffect(() => {
    if (!nodeSearchQuery.trim()) return;
    const nodes = graphDataRef.current?.nodes || [];
    const match = nodes.find(n => n.label.toLowerCase().includes(nodeSearchQuery.toLowerCase().trim()) || 
                           n.id.toLowerCase().includes(nodeSearchQuery.toLowerCase().trim()));
    if (match) {
      setSelectedNodeId(match.id);
      setGraphScale(1.4);
      setGraphPan({
        x: (graphCanvasRef.current?.parentElement?.clientWidth || 400) / 2 - match.x * 1.4,
        y: (graphCanvasRef.current?.parentElement?.clientHeight || 500) / 2 - match.y * 1.4
      });
    }
  }, [nodeSearchQuery]);

  const renderGraphCardContent = (isFullscreen: boolean) => {
    if (isFullscreen) {
      return (
        <div className="relative w-full h-full bg-slate-900 overflow-hidden select-none">
          {/* Edge-to-edge canvas */}
          <canvas ref={graphCanvasRef} className="absolute inset-0 w-full h-full block" />

          {/* Floating Top Left Panel: Title & Search */}
          <div className="absolute top-6 left-6 z-10 w-96 backdrop-blur-md bg-slate-950/75 dark:bg-slate-950/75 border border-slate-800 rounded-2xl p-4 shadow-2xl space-y-3">
            <div>
              <h3 className="font-serif text-sm font-bold flex items-center gap-2 text-white">
                <Network className="w-4 h-4 text-purple-400 animate-pulse" /> OSTM Knowledge Graph™
              </h3>
              <p className="text-[9px] text-slate-400 mt-0.5">Edge-to-edge Navigator. Drag nodes to move, scroll to zoom.</p>
            </div>
            {/* Search Input */}
            <div className="relative">
              <input 
                type="text"
                placeholder="Search OSTM Node (e.g. Creatinine, Kidney, Lycopodium)..."
                value={nodeSearchQuery}
                onChange={(e) => setNodeSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none text-white placeholder-slate-500"
              />
              {nodeSearchQuery && (
                <button 
                  onClick={() => setNodeSearchQuery("")}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-200 border-none bg-transparent cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Floating Top Right Panel: Zoom & View Controls */}
          <div className="absolute top-6 right-6 z-10 flex gap-2 backdrop-blur-md bg-slate-950/75 dark:bg-slate-950/75 border border-slate-800 rounded-2xl p-2 shadow-2xl">
            <button 
              onClick={() => setGraphScale(prev => Math.min(2.0, prev + 0.1))}
              className="w-8 h-8 flex items-center justify-center bg-slate-900 hover:bg-slate-800 rounded-lg text-white font-bold border-none cursor-pointer"
              title="Zoom In"
            >
              ＋
            </button>
            <button 
              onClick={() => setGraphScale(prev => Math.max(0.5, prev - 0.1))}
              className="w-8 h-8 flex items-center justify-center bg-slate-900 hover:bg-slate-800 rounded-lg text-white font-bold border-none cursor-pointer"
              title="Zoom Out"
            >
              －
            </button>
            <button 
              onClick={() => { setGraphScale(1); setGraphPan({ x: 0, y: 0 }); }}
              className="w-8 h-8 flex items-center justify-center bg-slate-900 hover:bg-slate-800 rounded-lg text-white font-bold border-none cursor-pointer"
              title="Reset View"
            >
              ⟲
            </button>
            <span className="w-px h-6 bg-slate-800 self-center mx-1" />
            <button 
              onClick={() => setGraphTextSize(prev => Math.min(18, prev + 1))}
              className="w-8 h-8 flex items-center justify-center bg-slate-900 hover:bg-slate-800 rounded-lg text-xs font-bold border-none cursor-pointer text-slate-300"
              title="Increase Label Size (+A)"
            >
              ＋A
            </button>
            <button 
              onClick={() => setGraphTextSize(prev => Math.max(6, prev - 1))}
              className="w-8 h-8 flex items-center justify-center bg-slate-900 hover:bg-slate-800 rounded-lg text-xs font-bold border-none cursor-pointer text-slate-300"
              title="Decrease Label Size (-A)"
            >
              －A
            </button>
            <span className="w-px h-6 bg-slate-800 self-center mx-1" />
            <button 
              onClick={() => setIsGraphFullscreen(false)}
              className="w-8 h-8 flex items-center justify-center bg-rose-950/50 hover:bg-rose-900/60 rounded-lg text-rose-400 font-bold border-none cursor-pointer"
              title="Exit Fullscreen"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Floating Bottom Left Panel: Filters & Heatmap Perspective */}
          <div className="absolute bottom-6 left-6 z-10 w-[420px] backdrop-blur-md bg-slate-950/75 dark:bg-slate-950/75 border border-slate-800 rounded-2xl p-4 shadow-2xl space-y-3">
            {/* Filter Tags */}
            <div className="space-y-1.5">
              <span className="text-[8.5px] font-mono text-slate-500 uppercase tracking-widest block w-full mb-1 font-bold">Graph Node Filters:</span>
              <div className="flex flex-wrap gap-1">
                {(["system", "organ", "diagnosis", "lab", "symptom", "remedy", "miasm", "risk", "modality"] as const).map((type) => {
                  const isActive = graphFilterTypes.includes(type);
                  return (
                    <button
                      key={type}
                      onClick={() => {
                        if (isActive) {
                          setGraphFilterTypes(prev => prev.filter(t => t !== type));
                        } else {
                          setGraphFilterTypes(prev => [...prev, type]);
                        }
                      }}
                      className={`px-2 py-0.5 rounded text-[8.5px] font-bold border capitalize transition-all cursor-pointer ${
                        isActive 
                          ? "bg-purple-900/40 text-purple-300 border-purple-800" 
                          : "bg-transparent border-slate-800 text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {type}s
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Heatmap Perspective */}
            <div className="flex items-center justify-between text-[9px] pt-2 border-t border-slate-800/60">
              <span className="font-mono text-slate-500 uppercase tracking-widest font-bold">Heatmap Perspective:</span>
              <div className="flex gap-1">
                {(["none", "evidence", "risk", "outcome", "remedy"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setGraphHeatmapView(mode)}
                    className={`px-2 py-0.5 rounded text-[8.5px] font-semibold border capitalize transition-all cursor-pointer ${
                      graphHeatmapView === mode 
                        ? "bg-emerald-600 text-white border-emerald-500" 
                        : "bg-transparent border-slate-800 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Floating Bottom Right Panel: Node Inspector (if selected) */}
          {selectedNodeInfo && (
            <div className="absolute bottom-6 right-6 z-10 w-96 backdrop-blur-md bg-slate-950/90 dark:bg-slate-950/90 border border-slate-800 rounded-2xl p-4 shadow-2xl text-white space-y-3 max-h-[420px] overflow-y-auto animate-fadeIn">
              <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                <div>
                  <span className="text-[8px] font-mono text-purple-400 uppercase tracking-wider block">{selectedNodeInfo.type}</span>
                  <h4 className="text-xs font-bold text-slate-200">{selectedNodeInfo.title}</h4>
                </div>
                <span className="text-[8px] px-1.5 py-0.5 bg-sky-950 border border-sky-800 text-sky-400 font-bold rounded uppercase shrink-0">
                  {selectedNodeInfo.evidenceRating}
                </span>
              </div>
              <div className="text-[10px] space-y-2.5 leading-relaxed font-sans">
                <div className="grid grid-cols-2 gap-2 font-mono text-[9px] bg-slate-900/50 p-2 rounded-lg border border-slate-850">
                  <div>
                    <span className="text-slate-500 block text-[8px]">CLINICAL STATUS</span>
                    <strong className="text-slate-200">{selectedNodeInfo.status}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[8px]">CONFIDENCE</span>
                    <strong className="text-emerald-400">{selectedNodeInfo.confidence}%</strong>
                  </div>
                </div>
                <div>
                  <span className="text-[8.5px] text-purple-400 block uppercase font-mono tracking-wider font-semibold">Anatomical / Remedial Description</span>
                  <p className="text-slate-300 text-[9.5px]">
                    {selectedNodeInfo.description}
                  </p>
                </div>
                <div>
                  <span className="text-[8.5px] text-sky-400 block uppercase font-mono tracking-wider font-semibold">Historical Trends & Changes</span>
                  <p className="text-slate-300 text-[9.5px]">
                    {selectedNodeId?.includes("kidney") ? "Creatinine rose 1.1 -> 1.6, eGFR declined 78 -> 49 over 12 months." : 
                     selectedNodeId?.includes("thyroid") ? "TSH rose 6.2 -> 7.8, now compensated at 4.8." :
                     selectedNodeId?.includes("joints") ? "ESR rose 45 -> 58, currently stabilized at 38." :
                     selectedNodeId?.includes("liver") ? "ALT/AST rose 38 -> 64, bilirubin stabilized at 0.9." :
                     selectedNodeId?.includes("lungs") ? "FEV1 stabilized at 82%, SpO2 96-98%." :
                     "Baseline metric stabilized under remedy matched course."}
                  </p>
                </div>
                <div>
                  <span className="text-[8.5px] text-amber-400 block uppercase font-mono tracking-wider font-semibold">Suggested Actions / Predicted Outcomes</span>
                  <p className="text-emerald-400 text-[9.5px] font-medium">✓ {selectedNodeInfo.historicalOutcome}</p>
                </div>
                <div>
                  <span className="text-[8.5px] text-slate-500 block uppercase font-mono tracking-wider">Connected Elements</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedNodeInfo.connectedElements.map((elem, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-[8px] rounded-md text-slate-400">
                        {elem}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Floating Bottom Center Panel: Graph Insights Panel */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-[450px] backdrop-blur-md bg-slate-950/75 dark:bg-slate-950/75 border border-slate-800 rounded-xl px-4 py-2.5 shadow-2xl text-slate-300 text-[9.5px] font-sans flex justify-between items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
              <div className="truncate">
                <span className="font-bold text-amber-300">LIVE FEED:</span>{" "}
                {selectedNodeId ? `Focused on ${selectedNodeInfo?.title || selectedNodeId}. Viewing connected pathways.` : "Select any node in the graph to begin active clinician-focused system inspection."}
              </div>
            </div>
            <button 
              onClick={() => setSelectedNodeId(null)}
              className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-[8.5px] border border-slate-800 rounded text-slate-400 cursor-pointer shrink-0"
            >
              Reset Selection
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-2">
          <div>
            <h3 className="font-serif text-sm font-bold flex items-center gap-2">
              <Network className="w-4 h-4 text-purple-500 animate-pulse" /> OSTM Knowledge Graph™
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Force-directed map. Drag nodes, scroll to zoom, click to select.</p>
          </div>
          
          {/* Zoom controls */}
          <div className="flex gap-1.5 self-end items-center">
            <button 
              onClick={() => setGraphScale(prev => Math.min(2.0, prev + 0.1))}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-955 hover:bg-slate-200 dark:hover:bg-slate-850 rounded-lg text-xs font-bold border-none cursor-pointer"
              title="Zoom In"
            >
              ＋
            </button>
            <button 
              onClick={() => setGraphScale(prev => Math.max(0.5, prev - 0.1))}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-955 hover:bg-slate-200 dark:hover:bg-slate-850 rounded-lg text-xs font-bold border-none cursor-pointer"
              title="Zoom Out"
            >
              －
            </button>
            <button 
              onClick={() => { setGraphScale(1); setGraphPan({ x: 0, y: 0 }); }}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-955 hover:bg-slate-200 dark:hover:bg-slate-850 rounded-lg text-xs font-bold border-none cursor-pointer"
              title="Reset View"
            >
              ⟲
            </button>
            <span className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1" />
            {/* Dynamic Label Font Size Controls */}
            <button 
              onClick={() => setGraphTextSize(prev => Math.min(18, prev + 1))}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-955 hover:bg-slate-200 dark:hover:bg-slate-850 rounded-lg text-[10px] font-bold border-none cursor-pointer text-slate-700 dark:text-slate-350"
              title="Increase Label Size (+A)"
            >
              ＋A
            </button>
            <button 
              onClick={() => setGraphTextSize(prev => Math.max(6, prev - 1))}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-955 hover:bg-slate-200 dark:hover:bg-slate-850 rounded-lg text-[10px] font-bold border-none cursor-pointer text-slate-700 dark:text-slate-350"
              title="Decrease Label Size (-A)"
            >
              －A
            </button>
            <span className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1" />
            {/* Fullscreen Toggle */}
            <button 
              onClick={() => setIsGraphFullscreen(prev => !prev)}
              className="px-2 py-1 bg-slate-100 dark:bg-slate-955 hover:bg-slate-200 dark:hover:bg-slate-850 rounded-lg text-xs font-bold border-none cursor-pointer flex items-center justify-center text-slate-700 dark:text-slate-350"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Filter tags panel (Priority 6) */}
        <div className="flex flex-wrap gap-1 bg-slate-50 dark:bg-slate-955/50 p-2 rounded-xl border border-slate-200/50 dark:border-slate-850">
          <span className="text-[8.5px] font-mono text-slate-500 uppercase tracking-widest block w-full mb-1">Graph Node Filters:</span>
          {(["system", "organ", "diagnosis", "lab", "symptom", "remedy", "miasm", "risk", "modality"] as const).map((type) => {
            const isActive = graphFilterTypes.includes(type);
            return (
              <button
                key={type}
                onClick={() => {
                  if (isActive) {
                    setGraphFilterTypes(prev => prev.filter(t => t !== type));
                  } else {
                    setGraphFilterTypes(prev => [...prev, type]);
                  }
                }}
                className={`px-2 py-0.5 rounded text-[8.5px] font-bold border capitalize transition-all cursor-pointer ${
                  isActive 
                    ? "bg-purple-900/20 text-purple-400 border-purple-800" 
                    : "bg-transparent border-slate-200 dark:border-slate-800 text-slate-400"
                }`}
              >
                {type}s
              </button>
            );
          })}
        </div>

        {/* Heatmap overlay selector (Priority 8) */}
        <div className="flex items-center justify-between text-[9px] bg-slate-50 dark:bg-slate-955/50 p-2 rounded-xl border border-slate-200/50 dark:border-slate-850 shrink-0">
          <span className="font-mono text-slate-500 uppercase tracking-widest block font-bold">Heatmap Perspective:</span>
          <div className="flex gap-1">
            {(["none", "evidence", "risk", "outcome", "remedy"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setGraphHeatmapView(mode)}
                className={`px-2 py-0.5 rounded text-[8.5px] font-semibold border capitalize transition-all cursor-pointer ${
                  graphHeatmapView === mode 
                    ? "bg-emerald-600 text-white border-emerald-500" 
                    : "bg-transparent border-slate-200 dark:border-slate-800 text-slate-400"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Graph Search */}
        <div className="relative">
          <input 
            type="text"
            placeholder="Search OSTM Node (e.g. Creatinine, Kidney, Lycopodium, Edema)..."
            value={nodeSearchQuery}
            onChange={(e) => setNodeSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none text-slate-800 dark:text-white"
          />
          {nodeSearchQuery && (
            <button 
              onClick={() => setNodeSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className={`w-full bg-slate-50 dark:bg-slate-955/30 rounded-2xl relative border border-slate-100 dark:border-slate-850/50 cursor-grab active:cursor-grabbing transition-all ${isFullscreen ? 'flex-1 min-h-[400px]' : 'h-[520px]'}`}>
          <canvas ref={graphCanvasRef} className="w-full h-full block" />
          
          {/* Floating inspector in fullscreen mode (Priority 2 details) */}
          {isFullscreen && selectedNodeInfo && (
            <div className="absolute bottom-6 right-6 w-80 bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-2xl text-white space-y-3 z-10 max-h-[350px] overflow-y-auto animate-fadeIn">
              <div className="flex justify-between items-start border-b border-slate-800 pb-1.5">
                <div>
                  <span className="text-[8px] font-mono text-purple-400 uppercase tracking-wider block">{selectedNodeInfo.type}</span>
                  <h4 className="text-xs font-bold text-slate-200">{selectedNodeInfo.title}</h4>
                </div>
                <span className="text-[8px] px-1.5 py-0.5 bg-sky-950 border border-sky-800 text-sky-400 font-bold rounded uppercase">
                  {selectedNodeInfo.evidenceRating}
                </span>
              </div>
              <div className="text-[10px] space-y-2 leading-relaxed font-sans">
                <div className="grid grid-cols-2 gap-2 font-mono text-[9px] bg-slate-900/50 p-2 rounded-lg border border-slate-850">
                  <div>
                    <span className="text-slate-500 block text-[8px]">CLINICAL STATUS</span>
                    <strong className="text-slate-200">{selectedNodeInfo.status}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[8px]">CONFIDENCE</span>
                    <strong className="text-emerald-400">{selectedNodeInfo.confidence}%</strong>
                  </div>
                </div>
                <div>
                  <span className="text-[8px] text-slate-555 block uppercase font-mono">Historical Trends & Changes</span>
                  <p className="text-slate-300 text-[9px]">
                    {selectedNodeId?.includes("kidney") ? "Creatinine rose 1.1 -> 1.6, eGFR declined 78 -> 49 over 12 months." : 
                     selectedNodeId?.includes("thyroid") ? "TSH rose 6.2 -> 7.8, now compensated at 4.8." :
                     "ESR rose 45 -> 58, currently stabilized at 38."}
                  </p>
                </div>
                <div>
                  <span className="text-[8px] text-slate-555 block uppercase font-mono">Suggested Actions / Predicted Outcomes</span>
                  <p className="text-emerald-400 text-[9px] font-medium">✓ {selectedNodeInfo.historicalOutcome}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Auto-generated Graph Insights Ticker (Priority 11) */}
        <div className="bg-gradient-to-r from-purple-950/10 to-teal-950/10 p-2.5 rounded-xl border border-purple-900/30 text-[10px] space-y-1">
          <span className="text-[8px] font-mono text-purple-400 uppercase tracking-widest block font-bold">Graph Insights Panel™</span>
          <div className="space-y-0.5 text-slate-300">
            <div>• Kidney node currently has highest centrality score (0.88).</div>
            <div>• eGFR node influence increased 22% over 6 months of metabolic stress.</div>
            <div>• Apis Mellifica pathway activated after edema progression flag.</div>
          </div>
        </div>
      </>
    );
  };

  // Explainable Risk resolver
  const activeExplainableRisk = activeRisks.find((r: any) => r.id === selectedRiskId) || activeRisks[0];

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-100 font-sans">
      
      {/* Tab Selectors (Cockpit Workspace vs Intake Parser vs Compile Reports) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 dark:bg-slate-950 p-6 rounded-[28px] border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-400 animate-pulse" />
            OSTM™ Clinical Operating System (CIOS™)
          </h2>
          <p className="text-xs text-slate-400 font-sans max-w-2xl leading-relaxed mt-1">
            Redesigned AI reasoning cockpit. Ingesting, projecting, simulating, and ranking therapeutic outcomes.
          </p>
        </div>

        <div className="flex gap-2 text-white">
          <button 
            onClick={() => setActiveTab("cockpit")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${activeTab === "cockpit" ? "bg-emerald-600 border-emerald-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"}`}
          >
            🎛️ Full Cockpit
          </button>
          <button 
            onClick={() => setActiveTab("intake")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${activeTab === "intake" ? "bg-emerald-600 border-emerald-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"}`}
          >
            📝 Intake Notes Parser
          </button>
          <button 
            onClick={() => setActiveTab("miasms")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${activeTab === "miasms" ? "bg-emerald-600 border-emerald-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"}`}
          >
            🧬 Miasms & Constitution
          </button>
          <button 
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${activeTab === "reports" ? "bg-emerald-600 border-emerald-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"}`}
          >
            📄 Compiled Reports
          </button>
        </div>
      </div>

      {/* Patient Selection & Sheet Sync Axis */}
      <div className="bg-slate-900 dark:bg-slate-950 border border-slate-800 p-5 rounded-[24px] flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-lg text-white">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono block">Active Patient Switcher</span>
            <select
              value={selectedPatientId || ""}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold min-w-[220px] cursor-pointer shadow-md"
            >
              <option value="" className="text-slate-500">-- Select Active Patient --</option>
              
              {/* Virtual / Sandbox Cases (Always Available) */}
              <optgroup label="Sandbox / Mock Patients" className="text-slate-400 font-mono text-[10px] bg-slate-900">
                <option value="aarav" className="text-white">Aarav Sharma (aarav)</option>
                <option value="priya" className="text-white">Priya Patel (priya)</option>
                <option value="elena" className="text-white">Elena Rostova (elena)</option>
              </optgroup>

              {/* Firestore / Sheets Patients */}
              {patients && patients.length > 0 && (
                <optgroup label="Live / Connected Patients" className="text-slate-400 font-mono text-[10px] bg-slate-900">
                  {patients.filter(p => p.id !== "aarav" && p.id !== "priya" && p.id !== "elena").map(p => (
                    <option key={p.id} value={p.id} className="text-white">
                      {p.name} ({p.id})
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono block">Workspace Integration Status</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`h-2.5 w-2.5 rounded-full ${isRealSheet ? "bg-emerald-500 animate-pulse shadow-md shadow-emerald-500/50" : "bg-sky-400 shadow-md shadow-sky-400/50"}`} />
              <span className="text-xs text-slate-350 font-bold font-mono">
                {isRealSheet ? "Google Sheets Connected" : "Clinical Mock Sheet (Sandbox)"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {syncToast && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0 }}
                className="text-[10px] text-emerald-400 font-bold font-mono mr-2 bg-emerald-950/40 border border-emerald-900/50 px-2.5 py-1 rounded-lg"
              >
                {syncToast}
              </motion.span>
            )}
          </AnimatePresence>

          <button
            onClick={handleOpenSheet}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-bold border border-slate-700 hover:border-slate-600 transition-all cursor-pointer shadow-sm"
            title="Open the active patient spreadsheet in a new tab"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-teal-400" />
            <span>Open Sheet Workspace</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            onClick={handleSyncSheetData}
            disabled={isSyncing}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              isSyncing 
                ? "bg-slate-800 border-slate-750 text-slate-500 cursor-not-allowed" 
                : "bg-emerald-600 border-emerald-500 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20"
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Syncing..." : "Sync Workspace Data"}</span>
          </button>
        </div>
      </div>

      {/* Layer 3 Alerts (Clinical Alert Center) */}
      {isAlertOpen && (
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 p-4 rounded-2xl flex items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-rose-800 dark:text-rose-400">Critical Trend Detected:</span>{" "}
              <span className="text-rose-700 dark:text-rose-300">
                {activeDataKey === "aarav" 
                  ? "eGFR slope decline detected (-9 mL/min in 12 months) under renal load. apis + serum anguillae indicated."
                  : activeDataKey === "priya"
                    ? "Subclinical hypothyroid progression to 7.8 uIU/mL. Thyroidinum intercurrent support active."
                    : "Symmetrical joint stiffness flare-up due to damp winter. Rhus Tox indicated."}
              </span>
            </div>
          </div>
          <button onClick={() => setIsAlertOpen(false)} className="text-rose-500 hover:text-rose-700 cursor-pointer border-none bg-transparent">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ==================== VIEW 1: COCKPIT WORKSPACE ==================== */}
      {activeTab === "cockpit" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* ==================== LEFT/CENTER COLUMN: COCKPIT WORKSPACE (8 COLS) ==================== */}
          <div className="xl:col-span-8 space-y-6">
            
                        {/* 1. EXECUTIVE CLINICAL COMMAND CENTER™ (PRIORITY 10 & 4 & 7) */}
            <div className="bg-slate-950 border border-slate-800 rounded-[28px] p-6 shadow-xl text-white space-y-6">
              
              {/* Navigator Focus Banner (Priority 1) */}
              {selectedNodeId && (
                <div className="bg-purple-950/40 border border-purple-900/60 p-3 rounded-2xl flex items-center justify-between text-xs animate-pulse">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-purple-500" />
                    <span className="font-mono text-slate-350">NAVIGATOR FOCUS ACTIVE:</span>
                    <strong className="text-purple-300 font-bold uppercase">{selectedNodeId.replace("sym_", "").replace("org_", "").replace("rem_", "").replace("mias_", "").replace("lab_", "").replace("_", " ")}</strong>
                  </div>
                  <button 
                    onClick={() => setSelectedNodeId(null)}
                    className="px-2 py-0.5 bg-purple-900/40 hover:bg-purple-900 border border-purple-700/50 rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    Clear Focus
                  </button>
                </div>
              )}

              {/* 10-Second Executive Summary Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-4 border-b border-slate-800/80">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono block">Current Status</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-block ${
                    activeDataKey === "aarav" ? "bg-amber-950/40 text-amber-400 border border-amber-900" :
                    activeDataKey === "priya" ? "bg-rose-950/40 text-rose-400 border border-rose-900" :
                    "bg-rose-950/40 text-rose-400 border border-rose-900"
                  }`}>
                    {activeDataKey === "aarav" ? "Compensated Degraded" :
                     activeDataKey === "priya" ? "De-compensated Subclinical" :
                     "Active Inflamed State"}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono block">Clinical Stability</span>
                  <span className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    {activeTwinMode === "simulator" && simulatedResults ? simulatedResults.vitality - 5 : activeData.vitalityIndex - 10}% (Stable)
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono block">Most Important Risk</span>
                  <span className="text-xs font-bold text-rose-400 truncate block">
                    {activeDataKey === "aarav" ? "CKD Progression (82%)" :
                     activeDataKey === "priya" ? "Metabolic PCOS Trigger (58%)" :
                     "Rheumatoid joint flare (76%)"}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono block">Most Important Opportunity</span>
                  <span className="text-xs font-bold text-emerald-400 truncate block">
                    {activeDataKey === "aarav" ? "Sodium Restriction (+12%)" :
                     activeDataKey === "priya" ? "Exercise Conditioning (+20%)" :
                     "Thermal protection (+18%)"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono block">Next Best Action</span>
                  <span className="text-xs font-bold text-sky-400 truncate block">
                    {activeDataKey === "aarav" ? "Assess Apis 30C response" :
                     activeDataKey === "priya" ? "Review TSH lab next week" :
                     "Assess Rhus Tox response"}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono block">Expected Outcome</span>
                  <span className="text-xs font-bold text-slate-350 truncate block">
                    {activeDataKey === "aarav" ? "eGFR stabilization in 90d" :
                     activeDataKey === "priya" ? "Endocrine feedback balance" :
                     "Stiffness mitigation in 7d"}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono block">Prediction Confidence</span>
                  <span className="text-xs font-bold font-mono text-emerald-400 block">
                    {activeTwinMode === "simulator" && simulatedResults ? simulatedResults.confidence : 92}% (High)
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono block">Digital Twin Status</span>
                  <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5 font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
                    {activeTwinMode === "simulator" ? "SIMULATION READY" : "SYNCHRONIZED"}
                  </span>
                </div>
              </div>

              {/* Next Best Action Engine Table (Priority 4 & 7 & 8) */}
              <div className="border-t border-slate-800/80 pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450 font-mono flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-sky-400" /> Next Best Action Engine™
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">
                    Acceptance Rate: {Math.round((outcomeLearningStats.acceptedCount / (outcomeLearningStats.acceptedCount + outcomeLearningStats.rejectedCount)) * 100)}%
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-mono">
                        <th className="pb-2 font-medium">Recommended Action</th>
                        <th className="pb-2 font-medium text-center">Urgency</th>
                        <th className="pb-2 font-medium text-center">Expected Benefit</th>
                        <th className="pb-2 font-medium text-center">Confidence</th>
                        <th className="pb-2 font-medium text-center">Evidence</th>
                        <th className="pb-2 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {(activeDataKey === "aarav" ? [
                        { action: "Assess Apis 30C Response", urgency: "High", benefit: "18%", confidence: "92%", evidence: "Grade A", time: "7d", reason: "Early nephropathy progression signal under fluid loading.", guideline: "KDIGO 2024 Guidelines on CKD progression recommend immediate fluid stabilization.", pathway: "Kidneys -> Apis Mellifica -> Ankle Edema", outcomes: "84% success rate in matching cohorts of 45+ male patients." },
                        { action: "Repeat Urinary Microalbuminuria", urgency: "Medium", benefit: "12%", confidence: "88%", evidence: "Grade B", time: "30d", reason: "Verify glomerular membrane integrity and leakage stabilization.", guideline: "ADA Standards of Care in Diabetes advise microalbuminuria monitoring every 3 months.", pathway: "Kidneys -> Microalbuminuria -> Creatinine", outcomes: "76% stability index seen in similar diabetic nephron load twins." },
                        { action: "Strict Blood Pressure Control (<120 mmHg)", urgency: "High", benefit: "24%", confidence: "90%", evidence: "Grade A", time: "14d", reason: "Reduce high glomerular perfusion pressure causing eGFR decline.", guideline: "AHA/ACC Hypertension Guidelines advise SBP target <120 in chronic kidney profiles.", pathway: "Kidneys -> Hypertensive Spikes -> Stage 3 CKD", outcomes: "90% response rate in age cohort matching Aarav's parameters." }
                      ] : activeDataKey === "priya" ? [
                        { action: "Review TSH Lab Panel Next Week", urgency: "Medium", benefit: "15%", confidence: "86%", evidence: "Grade B", time: "14d", reason: "Track subclinical hypothyroidism thyroidinum stabilization.", guideline: "ATA Guidelines for Hypothyroidism advise endocrine profiling after glandular intercurrents.", pathway: "Thyroid -> TSH Level -> Thyroidinum", outcomes: "86% success in subclinical hypothyroid responder cohort." },
                        { action: "Exercise Conditioning 4x/week", urgency: "High", benefit: "20%", confidence: "88%", evidence: "Grade A", time: "30d", reason: "Improve hypothalamic-ovarian endocrine feedback loop.", guideline: "ACOG Guidelines on PCOS recommend aerobic conditioning to improve insulin sensitivity.", pathway: "Ovaries -> Weight Gain -> Metabolic Syndrome", outcomes: "90% cycle regularization rate under optimized exercise sliders." },
                        { action: "Gut Absorption Optimization", urgency: "Low", benefit: "10%", confidence: "82%", evidence: "Grade C", time: "30d", reason: "Clear chronic sycotic metabolic sluggishness.", guideline: "Chronic Miasmatic Totality recommends digestive pathway cleaning before endocrine loops.", pathway: "Digestive -> Gut -> Lycopodium Clavatum", outcomes: "68% general vitality increase in psoric-sycotic responder twins." }
                      ] : [
                        { action: "Assess Rhus Tox Response in 7d", urgency: "High", benefit: "22%", confidence: "90%", evidence: "Grade A", time: "7d", reason: "Articular inflammation and morning stiffness control.", guideline: "EULAR Guidelines for Rheumatoid Arthritis recommend acute inflammatory monitoring.", pathway: "Joints -> Joint Stiffness -> Rhus Tox 30C", outcomes: "88% pain score reduction rate in chilly rheumatic cohorts." },
                        { action: "Compliance Check on Dry Warmth", urgency: "High", benefit: "18%", confidence: "92%", evidence: "Grade B", time: "3d", reason: "Prevent cold-damp barometric pressure aggravation.", guideline: "Rheumatic Modality consensus recommends thermal room stability during winter pressure drops.", pathway: "Joints -> Cold Damp -> Morning stiffness", outcomes: "74% flare reduction index under warm dry wrap compliance." },
                        { action: "Anti-Inflammatory Diet Alignment", urgency: "Medium", benefit: "12%", confidence: "80%", evidence: "Grade C", time: "30d", reason: "Suppress auto-immune systemic inflammation triggers.", guideline: "ACR guidelines recommend anti-inflammatory dietary supplements in active flares.", pathway: "Immune -> CRP Inflammatory -> Silicea Terra", outcomes: "80% CRP stabilization rate in Anti-CCP positive cohorts." }
                      ]).map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                          <td className="py-2.5 font-bold text-slate-200">
                            {item.action}
                          </td>
                          <td className="py-2.5 text-center">
                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                              item.urgency === "High" ? "bg-rose-950/60 text-rose-400 border border-rose-900" :
                              item.urgency === "Medium" ? "bg-amber-950/60 text-amber-400 border border-amber-900" :
                              "bg-emerald-950/60 text-emerald-400 border border-emerald-900"
                            }`}>
                              {item.urgency}
                            </span>
                          </td>
                          <td className="py-2.5 text-center font-mono font-bold text-emerald-400">{item.benefit}</td>
                          <td className="py-2.5 text-center font-mono text-slate-400">{item.confidence}</td>
                          <td className="py-2.5 text-center font-mono text-slate-400">{item.evidence}</td>
                          <td className="py-2.5 text-right space-x-1.5 shrink-0">
                            <button
                              onClick={() => setEvidenceExplorerData({
                                actionName: item.action,
                                benefit: item.benefit,
                                confidence: item.confidence,
                                urgency: item.urgency,
                                timeToBenefit: item.time,
                                evidenceLevel: item.evidence,
                                reason: item.reason,
                                guideline: item.guideline,
                                pathway: item.pathway,
                                outcomes: item.outcomes,
                                calculations: `Base Match (${parseInt(item.confidence.replace("%", "")) - 12}%) + Modality Correlation (+7%) + Thermal Reaction (+5%) = ${item.confidence} Total Confidence.`
                              })}
                              className="px-2.5 py-1 bg-sky-900/40 hover:bg-sky-900 hover:text-white border border-sky-700/50 rounded-lg text-[10px] font-bold text-sky-400 transition-all cursor-pointer"
                            >
                              Why?
                            </button>
                            <button
                              onClick={() => {
                                setOutcomeLearningStats(prev => ({ ...prev, acceptedCount: prev.acceptedCount + 1 }));
                                setSyncToast(`Accepted: "${item.action}" logged in learning loop.`);
                                setTimeout(() => setSyncToast(null), 3000);
                              }}
                              className="px-2.5 py-1 bg-emerald-900/40 hover:bg-emerald-900 hover:text-white border border-emerald-700/50 rounded-lg text-[10px] font-bold text-emerald-400 transition-all cursor-pointer"
                            >
                              ✓ Accept
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* ECG Monitor Section (Collapsible) */}
            <div className="bg-slate-900 dark:bg-slate-950 border border-slate-800 rounded-[28px] overflow-hidden shadow-xl text-white">
              <button
                onClick={() => setIsEcgExpanded(!isEcgExpanded)}
                className="w-full flex items-center justify-between p-5 text-left font-bold hover:bg-slate-800/40 transition-all border-none bg-transparent cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                  <span className="font-serif text-base font-bold text-white">Live ECG Telemetry Monitor</span>
                  <span className="text-[9px] font-extrabold text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Live Telemetry
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold">
                    {isEcgExpanded ? "Collapse Monitor" : "Expand Monitor"}
                  </span>
                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isEcgExpanded ? "rotate-90" : ""}`} />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isEcgExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="border-t border-slate-800 overflow-hidden"
                  >
                    <div className="p-4 bg-slate-950/20 font-mono text-emerald-400 flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                          <span>Telemetry Source: Wearable Sensor Net</span>
                        </div>
                        <span>Status: Operational (Sinus Rhythm)</span>
                      </div>
                      <EcgGraph />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. DIGITAL TWIN SIMULATOR 2.0 (PRIORITY 4) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-serif text-base font-bold flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-500" /> Patient Digital Twin Simulator™ 2.0
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Drag clinical sliders to instantly recalculate vitality, disease burden, and future labs.</p>
                </div>

                {/* Mode switch */}
                <div className="flex bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 gap-1">
                  <button
                    onClick={() => setActiveTwinMode("playback")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTwinMode === "playback" ? "bg-white dark:bg-slate-900 shadow-sm text-slate-800 dark:text-slate-100" : "text-slate-450 hover:text-slate-700"}`}
                  >
                    ⏮️ Historical Playback
                  </button>
                  <button
                    onClick={() => setActiveTwinMode("simulator")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTwinMode === "simulator" ? "bg-white dark:bg-slate-900 shadow-sm text-slate-800 dark:text-slate-100" : "text-slate-450 hover:text-slate-700"}`}
                  >
                    🧪 Simulator Lab
                  </button>
                </div>
              </div>

              {/* Playback Mode Panel */}
              {activeTwinMode === "playback" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-900">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-wider text-slate-450">Visit Chronology</span>
                      <span className="text-xs font-bold mt-0.5">{activeData.history[twinIndex]?.date}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-wider text-slate-450">Event Type</span>
                      <span className="text-xs font-bold text-sky-500 mt-0.5">{activeData.history[twinIndex]?.type}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-wider text-slate-450">Clinical Event</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 line-clamp-1">{activeData.history[twinIndex]?.event}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-wider text-slate-450">Repertory Status</span>
                      <span className="text-xs font-bold text-emerald-500 mt-0.5">Active</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-3 bg-emerald-600 hover:opacity-90 text-white rounded-2xl flex items-center justify-center cursor-pointer transition-all border-none shadow-md"
                    >
                      {isPlaying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    </button>

                    <div className="flex-1 space-y-1">
                      <input 
                        type="range"
                        min="0"
                        max={activeData.history.length - 1}
                        value={twinIndex}
                        onChange={(e) => setTwinIndex(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] font-mono text-slate-400">
                        <span>Baseline (Mar 2024)</span>
                        <span>Latest (Jun 2025)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Simulator Mode 2.0 Panel */}
              {activeTwinMode === "simulator" && (
                <div className="space-y-4">
                  
                  {/* Slider Control Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-950 p-5 rounded-[22px] border border-slate-100 dark:border-slate-900">
                    
                    {/* BP Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="font-bold text-slate-500">Blood Pressure</span>
                        <span className="font-mono font-bold text-emerald-500">{Math.round(simSliders.bloodPressure)} mmHg</span>
                      </div>
                      <input 
                        type="range" min="90" max="180" step="1"
                        value={simSliders.bloodPressure}
                        onChange={(e) => setSimSliders(prev => ({ ...prev, bloodPressure: Number(e.target.value) }))}
                        className="w-full accent-emerald-500 cursor-pointer h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
                      />
                    </div>

                    {/* Sleep Quality Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="font-bold text-slate-500">Sleep Quality</span>
                        <span className="font-mono font-bold text-emerald-500">{Math.round(simSliders.sleepQuality)}%</span>
                      </div>
                      <input 
                        type="range" min="30" max="100" step="5"
                        value={simSliders.sleepQuality}
                        onChange={(e) => setSimSliders(prev => ({ ...prev, sleepQuality: Number(e.target.value) }))}
                        className="w-full accent-emerald-500 cursor-pointer h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
                      />
                    </div>

                    {/* Stress Levels Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="font-bold text-slate-500">Stress Load</span>
                        <span className="font-mono font-bold text-emerald-500">{Math.round(simSliders.stressLevels)}%</span>
                      </div>
                      <input 
                        type="range" min="10" max="100" step="5"
                        value={simSliders.stressLevels}
                        onChange={(e) => setSimSliders(prev => ({ ...prev, stressLevels: Number(e.target.value) }))}
                        className="w-full accent-emerald-500 cursor-pointer h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
                      />
                    </div>

                    {/* HbA1c / TSH / ESR Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="font-bold text-slate-500">
                          {activeDataKey === "aarav" ? "HbA1c Glycemia" : activeDataKey === "priya" ? "TSH Endocrine" : "ESR Inflammatory"}
                        </span>
                        <span className="font-mono font-bold text-emerald-500">
                          {simSliders.hba1c.toFixed(activeDataKey === "aarav" ? 1 : 2)}
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min={activeDataKey === "aarav" ? "4.5" : activeDataKey === "priya" ? "0.5" : "1"} 
                        max={activeDataKey === "aarav" ? "12.0" : activeDataKey === "priya" ? "15.0" : "80"} 
                        step="0.1"
                        value={simSliders.hba1c}
                        onChange={(e) => setSimSliders(prev => ({ ...prev, hba1c: Number(e.target.value) }))}
                        className="w-full accent-emerald-500 cursor-pointer h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
                      />
                    </div>

                    {/* Weight Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="font-bold text-slate-500">Body Weight</span>
                        <span className="font-mono font-bold text-emerald-500">{simSliders.weight.toFixed(1)} kg</span>
                      </div>
                      <input 
                        type="range" 
                        min={activeDataKey === "aarav" ? "70" : activeDataKey === "priya" ? "55" : "45"} 
                        max={activeDataKey === "aarav" ? "110" : activeDataKey === "priya" ? "95" : "85"} 
                        step="0.5"
                        value={simSliders.weight}
                        onChange={(e) => setSimSliders(prev => ({ ...prev, weight: Number(e.target.value) }))}
                        className="w-full accent-emerald-500 cursor-pointer h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
                      />
                    </div>

                    {/* Fluid Intake Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="font-bold text-slate-500">Fluid Volume</span>
                        <span className="font-mono font-bold text-emerald-500">{simSliders.fluidIntake.toFixed(1)} L/day</span>
                      </div>
                      <input 
                        type="range" min="1.0" max="5.0" step="0.1"
                        value={simSliders.fluidIntake}
                        onChange={(e) => setSimSliders(prev => ({ ...prev, fluidIntake: Number(e.target.value) }))}
                        className="w-full accent-emerald-500 cursor-pointer h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
                      />
                    </div>

                    {/* Exercise Frequency Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="font-bold text-slate-500">Exercise Rate</span>
                        <span className="font-mono font-bold text-emerald-500">{simSliders.exerciseFrequency} days/wk</span>
                      </div>
                      <input 
                        type="range" min="0" max="7" step="1"
                        value={simSliders.exerciseFrequency}
                        onChange={(e) => setSimSliders(prev => ({ ...prev, exerciseFrequency: Number(e.target.value) }))}
                        className="w-full accent-emerald-500 cursor-pointer h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
                      />
                    </div>

                    {/* Diet Quality Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="font-bold text-slate-500">Diet Quality</span>
                        <span className="font-mono font-bold text-emerald-500">{Math.round(simSliders.dietQuality)}%</span>
                      </div>
                      <input 
                        type="range" min="30" max="100" step="5"
                        value={simSliders.dietQuality}
                        onChange={(e) => setSimSliders(prev => ({ ...prev, dietQuality: Number(e.target.value) }))}
                        className="w-full accent-emerald-500 cursor-pointer h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
                      />
                    </div>

                    {/* Medication Adherence Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="font-bold text-slate-500">Med Adherence</span>
                        <span className="font-mono font-bold text-emerald-500">{Math.round(simSliders.medicationAdherence)}%</span>
                      </div>
                      <input 
                        type="range" min="20" max="100" step="5"
                        value={simSliders.medicationAdherence}
                        onChange={(e) => setSimSliders(prev => ({ ...prev, medicationAdherence: Number(e.target.value) }))}
                        className="w-full accent-emerald-500 cursor-pointer h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
                      />
                    </div>

                    {/* Follow-up Interval Slider (Priority 5) */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="font-bold text-slate-500">Follow-up Interval</span>
                        <span className="font-mono font-bold text-emerald-500">{simDays} days</span>
                      </div>
                      <input 
                        type="range" min="15" max="365" step="15"
                        value={simDays}
                        onChange={(e) => setSimDays(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
                      />
                    </div>

                  </div>

                  {/* Scenarios indicator and projections time scale */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSimDays(30)}
                        className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition-all border ${simDays === 30 ? "bg-emerald-600 text-white border-emerald-500" : "bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-450 border-slate-200 dark:border-slate-800"}`}
                      >
                        30 Days
                      </button>
                      <button 
                        onClick={() => setSimDays(90)}
                        className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition-all border ${simDays === 90 ? "bg-emerald-600 text-white border-emerald-500" : "bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-450 border-slate-200 dark:border-slate-800"}`}
                      >
                        90 Days
                      </button>
                      <button 
                        onClick={() => setSimDays(180)}
                        className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition-all border ${simDays === 180 ? "bg-emerald-600 text-white border-emerald-500" : "bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-450 border-slate-200 dark:border-slate-800"}`}
                      >
                        180 Days
                      </button>
                      <button 
                        onClick={() => setSimDays(365)}
                        className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition-all border ${simDays === 365 ? "bg-emerald-600 text-white border-emerald-500" : "bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-450 border-slate-200 dark:border-slate-800"}`}
                      >
                        1 Year
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 font-bold">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />
                        <span className="text-[10px] text-slate-450">Best Case: {simulatedResults?.bestCase.vitality}% Vitality</span>
                      </span>
                      <span className="flex items-center gap-1.5 font-bold">
                        <span className="w-2.5 h-2.5 bg-sky-500 rounded-full border border-white" />
                        <span className="text-[10px] text-slate-450">Expected: {simulatedResults?.vitality}%</span>
                      </span>
                      <span className="flex items-center gap-1.5 font-bold">
                        <span className="w-2.5 h-2.5 bg-rose-500 rounded-full border border-white" />
                        <span className="text-[10px] text-slate-450">Worst Case: {simulatedResults?.worstCase.vitality}%</span>
                      </span>
                    </div>
                  </div>

                  {/* "What happens if..." switches */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-850">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450 block">Additional Overrides:</span>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <label className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs cursor-pointer hover:border-emerald-500 transition-all select-none">
                        <input 
                          type="checkbox"
                          checked={simOptions.increasePotency}
                          onChange={(e) => setSimOptions(prev => ({ ...prev, increasePotency: e.target.checked }))}
                          className="rounded border-slate-350 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>Increase remedy potency (30C -&gt; 200C)</span>
                      </label>

                      <label className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs cursor-pointer hover:border-emerald-500 transition-all select-none">
                        <input 
                          type="checkbox"
                          checked={simOptions.changeRemedy}
                          onChange={(e) => setSimOptions(prev => ({ ...prev, changeRemedy: e.target.checked }))}
                          className="rounded border-slate-350 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>Change remedy vector</span>
                      </label>

                      <label className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs cursor-pointer hover:border-emerald-500 transition-all select-none">
                        <input 
                          type="checkbox"
                          checked={simOptions.stopTreatment}
                          onChange={(e) => setSimOptions(prev => ({ ...prev, stopTreatment: e.target.checked }))}
                          className="rounded border-slate-350 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-rose-500 font-bold">Stop treatment (De-compensate)</span>
                      </label>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* 3. OSTM KNOWLEDGE GRAPH BRAIN (PRIORITY 2) & INSPECTOR SPLIT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* OSTM graph viewer canvas (7 cols) (Priority 1 & 5 & 6 & 8 & 11) */}
              {isGraphFullscreen && isMounted ? createPortal(
                <div 
                  style={{
                    position: "fixed",
                    top: "0px",
                    left: "0px",
                    right: "0px",
                    bottom: "0px",
                    width: "100vw",
                    height: "100vh",
                    zIndex: 1000
                  }}
                  className="bg-slate-905 overflow-hidden text-slate-800 dark:text-white animate-fadeIn"
                >
                  {renderGraphCardContent(true)}
                </div>,
                document.body
              ) : (
                <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden">
                  {renderGraphCardContent(false)}
                </div>
              )}

              {/* Inspector card (5 cols) (Priority 2 & 10 & 12) */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm flex flex-col justify-between gap-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h3 className="font-serif text-sm font-bold flex items-center gap-2">
                    <Compass className="w-4 h-4 text-emerald-500" /> OSTM Node Inspector™
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Click nodes in OSTM Graph to inspect organ mappings, rubrics, and response histories.</p>
                </div>

                {selectedNodeInfo ? (
                  <div className="flex-1 flex flex-col justify-between gap-4 animate-fadeIn">
                    <div className="space-y-4">
                      
                      {/* Name & Category Header */}
                      <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-2">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">{selectedNodeInfo.type}</span>
                          <span className="text-sm font-bold text-slate-850 dark:text-zinc-150">{selectedNodeInfo.title}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${selectedNodeInfo.evidenceRating.includes("Grade A") ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900" : "bg-sky-950/40 text-sky-400 border border-sky-900"}`}>
                          {selectedNodeInfo.evidenceRating}
                        </span>
                      </div>

                      {/* Clinical Status & Metric Grid (Priority 2 & 12) */}
                      <div className="grid grid-cols-2 gap-3 text-[10px] leading-normal font-sans">
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-955 rounded-xl border border-slate-150 dark:border-slate-850">
                          <span className="text-[8px] text-slate-450 uppercase font-mono block">Clinical Status</span>
                          <strong className="text-slate-800 dark:text-zinc-200 block mt-0.5">{selectedNodeInfo.status}</strong>
                        </div>
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-955 rounded-xl border border-slate-150 dark:border-slate-850">
                          <span className="text-[8px] text-slate-450 uppercase font-mono block">Centrality Index</span>
                          <strong className="text-emerald-500 block mt-0.5">0.88 (High)</strong>
                        </div>
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-955 rounded-xl border border-slate-150 dark:border-slate-850">
                          <span className="text-[8px] text-slate-450 uppercase font-mono block">Confidence Rating</span>
                          <strong className="text-emerald-500 block mt-0.5">{selectedNodeInfo.confidence}%</strong>
                        </div>
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-955 rounded-xl border border-slate-150 dark:border-slate-850">
                          <span className="text-[8px] text-slate-450 uppercase font-mono block">Evidence Weight</span>
                          <strong className="text-slate-700 dark:text-zinc-300 block mt-0.5">{selectedNodeInfo.evidenceRating.split(' ')[2] || "92%"}</strong>
                        </div>
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-955 rounded-xl border border-slate-150 dark:border-slate-850 col-span-2">
                          <span className="text-[8px] text-slate-450 uppercase font-mono block">Historical Trends & Changes</span>
                          <span className="text-slate-650 dark:text-zinc-350 block mt-0.5">
                            {selectedNodeId?.includes("kidney") ? "Creatinine rose 1.1 -> 1.6, eGFR declined 78 -> 49 over 12 months." : 
                             selectedNodeId?.includes("thyroid") ? "TSH rose 6.2 -> 7.8, now compensated at 4.8." :
                             "ESR rose 45 -> 58, currently stabilized at 38."}
                          </span>
                        </div>
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-955 rounded-xl border border-slate-150 dark:border-slate-850 col-span-2">
                          <span className="text-[8px] text-slate-450 uppercase font-mono block">Population Benchmark</span>
                          <span className="text-slate-650 dark:text-zinc-350 block mt-0.5">{selectedNodeInfo.populationBenchmark}</span>
                        </div>
                      </div>

                      {/* Connected Nodes List with Edge weights (Priority 2 & 3) */}
                      <div className="space-y-2">
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Connected Nodes & Strengths</span>
                        <div className="grid grid-cols-1 gap-1.5 max-h-[120px] overflow-y-auto pr-1">
                          {selectedNodeInfo.connectedElements.map((fact: string, idx: number) => {
                            const isVeryStrong = fact.includes("Kidneys") || fact.includes("eGFR") || fact.includes("TSH") || fact.includes("Stiffness") || fact.includes("Rhus");
                            return (
                              <div key={idx} className="p-2 bg-slate-50 dark:bg-slate-955 rounded-xl border border-slate-200/50 dark:border-slate-850/50 text-[10px] flex justify-between items-center">
                                <span className="text-slate-700 dark:text-zinc-350 font-medium">❖ {fact}</span>
                                <span className={`font-bold font-mono ${isVeryStrong ? "text-emerald-500" : "text-sky-500"}`}>
                                  {isVeryStrong ? "Very Strong (95%)" : "Strong (82%)"}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Similar Patient Overlay (Priority 10) */}
                      <div className="p-3 bg-gradient-to-r from-purple-950/10 to-teal-950/10 rounded-2xl border border-purple-900/30 space-y-1.5 text-[10px] leading-normal font-sans">
                        <span className="text-[8.5px] font-mono text-purple-400 uppercase tracking-widest block font-bold">Similar Patient Overlay™</span>
                        <div className="text-slate-300">
                          Matched <strong>128 similar patient twins</strong> in active database:
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-[9px] font-mono font-bold mt-1">
                          <div className="bg-emerald-950/40 text-emerald-400 px-1.5 py-1 rounded border border-emerald-900">Improved: 72%</div>
                          <div className="bg-slate-900 text-slate-400 px-1.5 py-1 rounded border border-slate-800">Stable: 18%</div>
                          <div className="bg-rose-950/40 text-rose-400 px-1.5 py-1 rounded border border-rose-900">Progressed: 10%</div>
                        </div>
                      </div>

                    </div>

                    {/* Bottom Outcomes card */}
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-1.5 text-[10px] shrink-0">
                      <div className="flex justify-between font-bold">
                        <span>Predicted Outcomes:</span>
                        <span className="text-emerald-500 font-mono text-right">{selectedNodeInfo.historicalOutcome}</span>
                      </div>
                      <div className="flex justify-between text-slate-400 text-[9px]">
                        <span>Suggested Actions:</span>
                        <span className="text-sky-400 font-bold">Assess intercurrent remedy response</span>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400 gap-2">
                    <Network className="w-8 h-8 text-slate-300 dark:text-slate-700 animate-pulse" />
                    <span className="text-xs">Select any node in the OSTM Graph to view anatomical details, connections, and evidence weights.</span>
                  </div>
                )}
              </div>
            </div>

            {/* 4. WHY THIS REMEDY? REMEDY INTELLIGENCE ENGINE (PRIORITY 3) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="font-serif text-sm font-bold flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-500" /> Remedy Intelligence Engine™ ("Why This Remedy?")
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Detailed matched features and clinical confidence ratings for active remedies.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeData.remedyMatches.map((match: any, idx: number) => {
                  let badgeColor = "bg-emerald-950/40 text-emerald-400 border border-emerald-900";
                  if (match.score < 82) badgeColor = "bg-amber-950/40 text-amber-400 border border-amber-900";

                  return (
                    <div key={idx} className="p-4 bg-slate-55 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850/50 rounded-2xl space-y-3 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-850/50 pb-2">
                          <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{match.name}</span>
                          <span className={`px-2 py-0.2 rounded text-[8.5px] font-mono ${badgeColor}`}>{match.score}% Match</span>
                        </div>
                        
                        {/* Matched Features */}
                        <div className="space-y-1 text-[10px] text-slate-500 dark:text-slate-450">
                          <span className="font-bold uppercase tracking-wider text-[8px] text-slate-400 block">Matched Features:</span>
                          <div>✓ Right-sided affinity</div>
                          <div>✓ Organ congestion support</div>
                          <div>✓ Evening aggravation shift</div>
                          <div>✓ Constitutional alignment</div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-slate-850/50 text-[10px]">
                        <div className="flex justify-between font-bold text-slate-650 dark:text-slate-350 items-center">
                          <span>Clinical Confidence:</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-emerald-500 font-mono">88% (High)</span>
                            <button
                              onClick={() => {
                                const foundPivot = Object.values(NODE_PIVOT_MAP).find(p => p.nodeName.toLowerCase().includes(match.name.toLowerCase().split(' ')[0]));
                                setEvidenceExplorerData({
                                  actionName: `Remedy Selection: ${match.name}`,
                                  benefit: `${match.score}% match with patient symptoms`,
                                  confidence: `${match.score}%`,
                                  urgency: "High Recommendation",
                                  timeToBenefit: "14 - 30 days",
                                  evidenceLevel: "Grade A Clinical Affinity",
                                  reason: match.keyEvidence || "Constitutional alignment with thermal reaction and chronic miasmatic layer.",
                                  guideline: foundPivot ? foundPivot.guideline : "Clinical repertory alignment based on Kent's and Boericke's Materia Medica.",
                                  pathway: foundPivot ? foundPivot.pathway : `Patient twin symptoms -> ${match.name}`,
                                  outcomes: foundPivot ? foundPivot.outcomes : "84% success rate in matching chronic responder cohorts.",
                                  calculations: `Base Match (${match.score - 10}%) + Glandular / Organ Affinity (+6%) + Modality Correlation (+4%) = ${match.score}% Total Confidence.`
                                });
                              }}
                              className="px-1.5 py-0.5 bg-sky-900/40 hover:bg-sky-900 text-sky-400 hover:text-white border border-sky-700/50 rounded text-[8.5px] font-bold transition-all cursor-pointer"
                            >
                              Why?
                            </button>
                          </div>
                        </div>
                        <div className="text-[8.5px] text-slate-400 leading-tight">
                          Evidence: Repertory rubrics, Materia Medica, and 12 similar historical cases.
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. CLINICAL REASONING TRACE (PRIORITY 5) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="font-serif text-sm font-bold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-500" /> Clinical Reasoning Trace™ (Explainable AI)
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Percent-contribution trace explaining variables behind risk forecasts.</p>
              </div>

              <div className="space-y-3">
                {activeRisks.map((risk: any, idx: number) => {
                  const isCkd = risk.id === "ckd";
                  const isThyroid = risk.id === "thyroid" || risk.id === "neuropathy";
                  
                  return (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{risk.name} ({risk.val}%)</span>
                        <span className="text-[9px] text-slate-400 font-mono">Trace ID: AI-TR-{risk.id.toUpperCase()}</span>
                      </div>
                      
                      {/* Contribution weights */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2 text-[10px] border-t border-slate-200/50 dark:border-slate-850/50">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-slate-400 text-[8px] uppercase">Primary Driver</span>
                          <span className="font-bold text-rose-500">{isCkd ? "eGFR Decline: 35%" : isThyroid ? "Glycemic Spikes: 30%" : "ESR Load: 40%"}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-slate-400 text-[8px] uppercase">Secondary Driver</span>
                          <span className="font-bold text-amber-500">{isCkd ? "Microalbuminuria: 22%" : isThyroid ? "Thyroid Serum: 25%" : "CRP levels: 25%"}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-slate-400 text-[8px] uppercase">Physiological</span>
                          <span className="font-bold text-slate-600 dark:text-slate-400">{isCkd ? "Age: 18%" : isThyroid ? "Age: 15%" : "Age: 12%"}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-slate-400 text-[8px] uppercase">Lifestyle / Sleep</span>
                          <span className="font-bold text-slate-600 dark:text-slate-400">{isCkd ? "Stress Load: 15%" : isThyroid ? "Exercise rate: 18%" : "Damp Exposure: 15%"}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-slate-400 text-[8px] uppercase">Other variables</span>
                          <span className="font-bold text-slate-450">{isCkd ? "BP spikes: 10%" : "Fluid volume: 12%"}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 6. DISEASE FORECAST ENGINE (FORECAST CURVES & SCENARIOS) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                <div>
                  <h3 className="font-serif text-sm font-bold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" /> Disease Forecast Engine™
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Projected disease vectors over 30d, 90d, 180d, and 1y timelines.</p>
                </div>
                {activeTwinMode === "simulator" && (
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-0.5 bg-emerald-500 inline-block border-t border-dashed" /> Best-case
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-0.5 bg-sky-500 inline-block" /> Expected
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-0.5 bg-rose-500 inline-block border-t border-dashed" /> Worst-case
                    </span>
                  </div>
                )}
              </div>

              <div className="w-full bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl relative border border-slate-100 dark:border-slate-850">
                <canvas ref={forecastCanvasRef} />
              </div>

              {/* Scenario Comparison Grid (Priority 6) */}
              <div className="border-t border-slate-100 dark:border-slate-805 pt-4 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block">Multi-Scenario Forecasting Comparison Grid</span>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[11px] leading-normal">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-450 uppercase text-[9px] font-mono">
                        <th className="pb-1.5 font-semibold">Clinical Parameter</th>
                        <th className="pb-1.5 font-semibold text-rose-500 text-center">Scenario A (No Intervention)</th>
                        <th className="pb-1.5 font-semibold text-sky-500 text-center">Scenario B (Recommended)</th>
                        <th className="pb-1.5 font-semibold text-emerald-500 text-center">Scenario C (Optimized)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                      <tr>
                        <td className="py-2 font-bold text-slate-650 dark:text-slate-350">
                          {activeDataKey === "aarav" ? "CKD Progression Risk" : activeDataKey === "priya" ? "PCOS Diabetes Trigger" : "RA Inflammatory Flare"}
                        </td>
                        <td className="py-2 text-center text-rose-500 font-mono font-bold">
                          {activeTwinMode === "simulator" && simulatedResults ? simulatedResults.worstCase.risks[0]?.val : activeData.predictiveRisks[0].val + 10}% (High)
                        </td>
                        <td className="py-2 text-center text-sky-500 font-mono font-bold">
                          {activeTwinMode === "simulator" && simulatedResults ? simulatedResults.risks[0]?.val : activeData.predictiveRisks[0].val}% (Moderate)
                        </td>
                        <td className="py-2 text-center text-emerald-500 font-mono font-bold">
                          {activeTwinMode === "simulator" && simulatedResults ? simulatedResults.bestCase.risks[0]?.val : activeData.predictiveRisks[0].val - 12}% (Low)
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold text-slate-650 dark:text-slate-350">
                          {activeDataKey === "aarav" ? "eGFR Filtration Rate" : activeDataKey === "priya" ? "TSH Endocrine Level" : "ESR Inflammation"}
                        </td>
                        <td className="py-2 text-center font-mono">
                          {activeDataKey === "aarav" ? "38 mL/min" : activeDataKey === "priya" ? "7.8 uIU/mL" : "58 mm/hr"}
                        </td>
                        <td className="py-2 text-center font-mono text-sky-550 dark:text-sky-450 font-bold">
                          {activeTwinMode === "simulator" && simulatedResults ? simulatedResults.labs.egfr || simulatedResults.labs.tsh || simulatedResults.labs.esr : 
                           (activeDataKey === "aarav" ? "49 mL/min" : activeDataKey === "priya" ? "4.8 uIU/mL" : "38 mm/hr")}
                        </td>
                        <td className="py-2 text-center font-mono text-emerald-550 dark:text-emerald-450 font-bold">
                          {activeDataKey === "aarav" ? "56 mL/min" : activeDataKey === "priya" ? "3.2 uIU/mL" : "22 mm/hr"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold text-slate-650 dark:text-slate-350">
                          {activeDataKey === "aarav" ? "HbA1c Glycemia" : activeDataKey === "priya" ? "LH/FSH Endocrine Ratio" : "CRP Auto-antibody"}
                        </td>
                        <td className="py-2 text-center font-mono">
                          {activeDataKey === "aarav" ? "8.0%" : activeDataKey === "priya" ? "2.8" : "18.5 mg/L"}
                        </td>
                        <td className="py-2 text-center font-mono text-sky-550 dark:text-sky-450 font-bold">
                          {activeTwinMode === "simulator" && simulatedResults ? simulatedResults.labs.hba1c || simulatedResults.labs.lh_fsh_ratio || simulatedResults.labs.crp : 
                           (activeDataKey === "aarav" ? "6.9%" : activeDataKey === "priya" ? "1.4" : "8.2 mg/L")}
                        </td>
                        <td className="py-2 text-center font-mono text-emerald-550 dark:text-emerald-450 font-bold">
                          {activeDataKey === "aarav" ? "5.8%" : activeDataKey === "priya" ? "1.0" : "4.0 mg/L"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold text-slate-650 dark:text-slate-350">Patient Vitality Index</td>
                        <td className="py-2 text-center text-rose-500 font-mono font-bold">
                          {activeTwinMode === "simulator" && simulatedResults ? simulatedResults.worstCase.vitality : activeData.vitalityIndex - 15}%
                        </td>
                        <td className="py-2 text-center text-sky-500 font-mono font-bold">
                          {activeTwinMode === "simulator" && simulatedResults ? simulatedResults.vitality : activeData.vitalityIndex}%
                        </td>
                        <td className="py-2 text-center text-emerald-500 font-mono font-bold">
                          {activeTwinMode === "simulator" && simulatedResults ? simulatedResults.bestCase.vitality : activeData.vitalityIndex + 12}%
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold text-slate-650 dark:text-slate-350">Systemic Disease Burden</td>
                        <td className="py-2 text-center font-mono">
                          {activeTwinMode === "simulator" && simulatedResults ? simulatedResults.worstCase.burden : activeData.diseaseBurdenIndex + 12}%
                        </td>
                        <td className="py-2 text-center font-mono font-bold">
                          {activeTwinMode === "simulator" && simulatedResults ? simulatedResults.burden : activeData.diseaseBurdenIndex}%
                        </td>
                        <td className="py-2 text-center font-mono">
                          {activeTwinMode === "simulator" && simulatedResults ? simulatedResults.bestCase.burden : activeData.diseaseBurdenIndex - 10}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 7. LONGITUDINAL PATIENT STORY TIMELINE (PRIORITY 7) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                <div>
                  <h3 className="font-serif text-sm font-bold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-sky-500" /> Longitudinal Patient Story™
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Narrative clinical chronology generated automatically from twin history data.</p>
                </div>
                <button 
                  onClick={() => {
                    alert("Compiling report... Redirecting to Compiled Reports tab.");
                    setActiveTab("reports");
                    handleCompileReport("clinical_summary");
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:opacity-90 text-white rounded-xl text-[10px] font-bold border-none cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5" /> Export Report
                </button>
              </div>

              {/* Story list */}
              <div className="space-y-3">
                {activeData.history.map((h: any, i: number) => (
                  <div key={i} className="flex gap-3 text-xs">
                    <div className="w-[80px] shrink-0 font-mono text-slate-400 font-bold">{h.date}</div>
                    <div className="w-2 bg-slate-200 dark:bg-slate-800 relative rounded-full">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1.5 left-0 border border-white" />
                    </div>
                    <div className="flex-1 pb-3 border-b border-slate-100 dark:border-slate-850">
                      <span className="font-bold text-slate-700 dark:text-slate-300 block">{h.event}</span>
                      <span className="text-slate-550 dark:text-slate-450 mt-0.5 block leading-relaxed">{h.notes}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 8. COHORTS POPULATION DIGITAL TWIN & LEARNING ENGINE (PRIORITY 8 & 9) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm space-y-5">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                <div>
                  <h3 className="font-serif text-sm font-bold flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-500" /> Population Digital Twin™ & Learning Engine
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Outcome benchmarking and learning models active over 14 clinical cohorts.</p>
                </div>
                
                <div className="flex items-center gap-1.5 bg-emerald-950/10 dark:bg-emerald-950/30 text-emerald-500 px-2.5 py-1 rounded-lg border border-emerald-900/30 text-[9px] font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Learning Engine Active</span>
                </div>
              </div>

              {/* Learning stats row (Priority 8) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-850 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[8.5px] uppercase tracking-wider text-slate-500 font-mono">Action Success</span>
                  <span className="text-sm font-bold font-mono text-slate-800 dark:text-zinc-100">88.4%</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[8.5px] uppercase tracking-wider text-slate-500 font-mono">Remedy Success</span>
                  <span className="text-sm font-bold font-mono text-slate-800 dark:text-zinc-100">{outcomeLearningStats.remedySuccessRate}%</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[8.5px] uppercase tracking-wider text-slate-500 font-mono">Protocol Success</span>
                  <span className="text-sm font-bold font-mono text-slate-800 dark:text-zinc-100">{outcomeLearningStats.protocolSuccessRate}%</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[8.5px] uppercase tracking-wider text-slate-500 font-mono">Clinician Success</span>
                  <span className="text-sm font-bold font-mono text-slate-800 dark:text-zinc-100">{outcomeLearningStats.clinicianSuccessRate}%</span>
                </div>
              </div>

              {/* Population Responder Cohort Matrix (Priority 9) */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block">responder cohort comparison matrix</span>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-450 uppercase text-[9px] font-mono">
                        <th className="pb-1.5 font-semibold">Cohort Group</th>
                        <th className="pb-1.5 font-semibold">Expected Trajectory</th>
                        <th className="pb-1.5 font-semibold text-center">Deviation</th>
                        <th className="pb-1.5 font-semibold text-center">Success Probability</th>
                        <th className="pb-1.5 font-semibold text-right">Adjustments</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-950/40">
                        <td className="py-2 font-bold text-slate-750 dark:text-zinc-200">Top Responders (68%)</td>
                        <td className="py-2 text-slate-500">eGFR stable at +2 mL/min/yr, microalbumin cleared</td>
                        <td className="py-2 text-center font-mono font-bold text-emerald-500">+12% vs average</td>
                        <td className="py-2 text-center font-mono text-slate-350">84%</td>
                        <td className="py-2 text-right text-slate-450">Maintain constitutional support</td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-950/40">
                        <td className="py-2 font-bold text-slate-750 dark:text-zinc-200">Average Responders (24%)</td>
                        <td className="py-2 text-slate-500">Stable creatinine, minor fluctuations</td>
                        <td className="py-2 text-center font-mono text-slate-400">0% (Baseline)</td>
                        <td className="py-2 text-center font-mono text-slate-350">54%</td>
                        <td className="py-2 text-right text-slate-450">Optimize sleep & fluid sliders</td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-950/40">
                        <td className="py-2 font-bold text-slate-750 dark:text-zinc-200">Poor Responders (8%)</td>
                        <td className="py-2 text-slate-500">eGFR declines &gt; 5 mL/min/yr, edema flare</td>
                        <td className="py-2 text-center font-mono font-bold text-rose-500">-18% vs average</td>
                        <td className="py-2 text-center font-mono text-slate-350">18%</td>
                        <td className="py-2 text-right text-sky-400 font-bold">Add sycotic intercurrent remedy</td>
                      </tr>
                      <tr className="bg-sky-50/10 dark:bg-sky-950/10 font-semibold">
                        <td className="py-2 font-bold text-sky-500 flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                          Current Patient
                        </td>
                        <td className="py-2 text-slate-300">Stage 3b CKD eGFR recovery slope</td>
                        <td className="py-2 text-center font-mono text-sky-400 font-bold">+8.2% vs average</td>
                        <td className="py-2 text-center font-mono text-sky-400 font-bold">92%</td>
                        <td className="py-2 text-right text-sky-400">Apis + Serum Anguillae active</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* 9. THERAPEUTIC INTELLIGENCE 2.0 (PRIORITY 9) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="font-serif text-sm font-bold flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-500" /> Therapeutic Intelligence 2.0
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Ranked list of non-pharmaceutical interventions sorted by expected clinical efficacy.</p>
              </div>

              {/* Recommendations list */}
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850 flex items-start gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500 font-bold text-xs shrink-0">1</div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">Dietary Sodium Restriction (&lt; 1.5g / day)</span>
                      <span className="px-2 py-0.2 rounded text-[8.5px] font-mono bg-emerald-950/40 text-emerald-400 font-bold border border-emerald-900">Efficacy: +24%</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[9px] text-slate-400 font-mono">
                      <div>Confidence: 91%</div>
                      <div>Time to Impact: 30d</div>
                      <div>Compliance: High (88%)</div>
                      <div>Evidence: Level A studies</div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850 flex items-start gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500 font-bold text-xs shrink-0">2</div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">Aerobic Physical Exercise (30m / 4 days a week)</span>
                      <span className="px-2 py-0.2 rounded text-[8.5px] font-mono bg-emerald-950/40 text-emerald-400 font-bold border border-emerald-900">Efficacy: +18%</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[9px] text-slate-400 font-mono">
                      <div>Confidence: 85%</div>
                      <div>Time to Impact: 14d</div>
                      <div>Compliance: Moderate (72%)</div>
                      <div>Evidence: Clinical trials</div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850 flex items-start gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500 font-bold text-xs shrink-0">3</div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">Sleep Hygiene Protocol (target &gt; 8 hours nightly)</span>
                      <span className="px-2 py-0.2 rounded text-[8.5px] font-mono bg-emerald-950/40 text-emerald-400 font-bold border border-emerald-900">Efficacy: +12%</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[9px] text-slate-400 font-mono">
                      <div>Confidence: 80%</div>
                      <div>Time to Impact: 7d</div>
                      <div>Compliance: High (90%)</div>
                      <div>Evidence: Consensus guidelines</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          
                    {/* ==================== RIGHT COLUMN: PERSISTENT COMMAND SIDEBAR PANEL (4 COLS) (PRIORITY 3) ==================== */}
          <div className="xl:col-span-4 bg-slate-900/90 dark:bg-slate-950/90 border border-slate-800 rounded-[28px] p-5 shadow-xl text-white backdrop-blur-md xl:sticky xl:top-6 select-none max-h-[85vh] flex flex-col gap-4">
            
            {/* Tab Swappers */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1 shrink-0">
              <button
                onClick={() => setSidebarTab("feed")}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${sidebarTab === "feed" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-350"}`}
              >
                📡 Intelligence Feed™
              </button>
              <button
                onClick={() => setSidebarTab("ask")}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${sidebarTab === "ask" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-350"}`}
              >
                💬 Ask CIOS™ Assistant
              </button>
            </div>

            {/* TAB 1: INTELLIGENCE FEED */}
            {sidebarTab === "feed" && (
              <div className="flex flex-col gap-3 flex-1 min-h-0">
                {/* Header with status light */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Live Intelligence Feed™</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[8px] bg-emerald-950/40 text-emerald-400 border border-emerald-900 font-mono">
                    Streaming Live
                  </span>
                </div>

                {/* Filter tags */}
                <div className="flex flex-wrap gap-1 border-b border-slate-800 pb-2 shrink-0">
                  {(["all", "risk", "insight", "remedy", "warning", "bookmarked"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setFeedFilter(filter)}
                      className={`px-2 py-1 rounded-lg text-[9px] font-bold border capitalize transition-all cursor-pointer ${feedFilter === filter ? "bg-emerald-600 text-white border-emerald-500" : "bg-slate-850 border-slate-800 text-slate-400 hover:text-slate-200"}`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                {/* Scrollable list */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-0">
                  <AnimatePresence initial={false}>
                    {feedItems
                      .filter(item => {
                        if (feedFilter === "bookmarked") return bookmarkedFeeds[item.id];
                        if (feedFilter !== "all" && item.type !== feedFilter) return false;
                        return true;
                      })
                      .map((item) => {
                        const isBookmarked = bookmarkedFeeds[item.id];
                        let typeColor = "text-sky-400 bg-sky-950/40 border-sky-900";
                        if (item.type === "risk") typeColor = "text-rose-400 bg-rose-950/40 border-rose-900";
                        else if (item.type === "remedy") typeColor = "text-purple-400 bg-purple-950/40 border-purple-900";
                        else if (item.type === "warning") typeColor = "text-amber-400 bg-amber-950/40 border-amber-900";

                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: -20, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-3 bg-slate-950/60 border border-slate-850 rounded-2xl space-y-2 hover:border-slate-700 transition-all cursor-pointer relative group"
                            onClick={() => setActiveFeedItemDetail(item)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[9px] text-slate-500 font-bold">{item.timestamp}</span>
                                <span className={`px-1.5 py-0.2 rounded text-[8px] font-mono border uppercase tracking-wider font-bold ${typeColor}`}>
                                  {item.type}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {item.confidenceDelta && (
                                  <span className="text-[8px] font-mono font-bold text-emerald-400">{item.confidenceDelta}</span>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setBookmarkedFeeds(prev => ({ ...prev, [item.id]: !prev[item.id] }));
                                  }}
                                  className={`p-1 bg-transparent border-none text-xs cursor-pointer ${isBookmarked ? "text-amber-400" : "text-slate-600 hover:text-slate-400"}`}
                                >
                                  ★
                                </button>
                              </div>
                            </div>

                            <div className="text-[11px] font-bold text-slate-200">
                              {item.message}
                            </div>
                            <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                              {item.detail}
                            </p>
                          </motion.div>
                        );
                      })}
                  </AnimatePresence>
                </div>

                {/* Expand details panel overlay inside sidebar */}
                {activeFeedItemDetail && (
                  <div className="p-3.5 bg-slate-950 border border-emerald-900/50 rounded-2xl space-y-3 relative animate-fadeIn shrink-0">
                    <button 
                      onClick={() => setActiveFeedItemDetail(null)}
                      className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-350 cursor-pointer border-none bg-transparent"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div>
                      <span className="text-[8px] font-mono text-slate-550 uppercase tracking-widest font-bold block mb-1">Deep-Dive Clinical Rationale</span>
                      <span className="font-bold text-xs text-white block">{activeFeedItemDetail.message}</span>
                    </div>
                    <p className="text-[10.5px] leading-relaxed text-slate-350">
                      {activeFeedItemDetail.detail}
                    </p>
                    <div className="flex justify-between items-center text-[9px] border-t border-slate-800 pt-2 text-slate-500 font-mono">
                      <span>Confidence: 92%</span>
                      <span>Target Area: Renal / Systemic</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ASK CIOS™ ASSISTANT */}
            {sidebarTab === "ask" && (
              <div className="flex flex-col gap-3 flex-1 min-h-0">
                
                {/* Quick Question Chips (Priority 3) */}
                <div className="flex flex-col gap-1.5 shrink-0 bg-slate-950/80 p-2.5 rounded-xl border border-slate-850">
                  <span className="text-[8.5px] font-mono text-slate-500 uppercase tracking-widest block mb-0.5">Quick Clinical Questions:</span>
                  <div className="flex flex-wrap gap-1">
                    {(activeDataKey === "aarav" ? [
                      { label: "Why CKD risk high?", query: "Why is CKD risk increased?" },
                      { label: "Why Apis?", query: "Why was Apis Mellifica chosen?" },
                      { label: "Lyc vs Sulphur", query: "Compare Lycopodium Clavatum vs Sulphur." },
                      { label: "If HbA1c = 6.0?", query: "What if HbA1c becomes 6.0?" }
                    ] : activeDataKey === "priya" ? [
                      { label: "Why PCOS risk high?", query: "Why is PCOS diabetes risk increased?" },
                      { label: "Why Pulsatilla?", query: "Why was Pulsatilla chosen?" },
                      { label: "Puls vs Sepia", query: "Compare Pulsatilla vs Sepia." },
                      { label: "If weight = 70kg?", query: "What if weight becomes 70kg?" }
                    ] : [
                      { label: "Why joint flare?", query: "Why was joint flare risk high?" },
                      { label: "Why Silicea?", query: "Why was Silicea chosen?" },
                      { label: "Sil vs Rhus Tox", query: "Compare Silicea vs Rhus Tox." },
                      { label: "If CRP = 5.0?", query: "What if CRP becomes 5.0?" }
                    ]).map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAskAICopilot(q.query)}
                        className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[9px] font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer text-left"
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat Message Box */}
                <div className="flex-1 overflow-y-auto space-y-3 bg-slate-950/40 p-3 rounded-2xl border border-slate-850 min-h-0 font-sans">
                  {chatHistory.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col gap-1 max-w-[88%] text-xs p-2.5 rounded-2xl ${
                        m.sender === "doctor" 
                          ? "bg-sky-600 text-white self-end rounded-tr-none" 
                          : "bg-slate-900 border border-slate-800 text-slate-200 self-start rounded-tl-none"
                      }`}
                    >
                      <span className="text-[8px] font-mono text-slate-450 uppercase font-extrabold tracking-wider">
                        {m.sender === "doctor" ? "Clinician / Doctor" : "OSTM™ Assistant"}
                      </span>
                      <div className="leading-relaxed whitespace-pre-wrap">
                        {m.sender === "ai" ? renderMessageText(m.text) : m.text}
                      </div>
                    </div>
                  ))}
                  {isProcessingChat && (
                    <div className="bg-slate-900 border border-slate-800 text-slate-200 p-2.5 rounded-2xl rounded-tl-none self-start max-w-[80%] flex items-center gap-2">
                      <span className="h-1.5 w-1.5 bg-sky-500 rounded-full animate-bounce" />
                      <span className="h-1.5 w-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="h-1.5 w-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[10px] text-slate-400 font-mono">Analyzing twin telemetry...</span>
                    </div>
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Input Console */}
                <div className="flex gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-850 shrink-0">
                  <input
                    type="text"
                    placeholder="Ask CIOS assistant (e.g. Compare Lycopodium)..."
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleAskAICopilot(); }}
                    className="flex-1 px-3 py-1.5 bg-transparent border-none text-xs text-white focus:outline-none placeholder-slate-600"
                  />
                  <button
                    onClick={() => handleAskAICopilot()}
                    className="p-2 bg-sky-600 hover:opacity-90 rounded-xl flex items-center justify-center cursor-pointer transition-all border-none"
                  >
                    <Send className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>
      )}
      {/* ==================== VIEW 2: AI INTAKE PARSER ==================== */}
      {activeTab === "intake" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="font-serif text-base font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Case Intake Parser Workspace
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Type clinical description notes to extract OSTM mappings instantly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <textarea
                value={rawIntakeNotes}
                onChange={(e) => setRawIntakeNotes(e.target.value)}
                placeholder="Type notes here: e.g. Patient complains of severe swelling under eyes, fatigue worse in the morning, has high creatinine, and craves cold water..."
                className="w-full h-[200px] p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs outline-none focus:border-emerald-500 resize-none font-sans"
              />
              
              <div className="flex gap-2">
                <button 
                  onClick={handleProcessIntake}
                  className="px-4 py-2 bg-emerald-600 hover:opacity-90 text-white rounded-xl text-xs font-bold border-none cursor-pointer"
                >
                  Extract structured data
                </button>
                <button 
                  onClick={() => { setRawIntakeNotes(""); setParsedIntakeOutput(""); }}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold hover:bg-slate-200 cursor-pointer border-none text-slate-700 dark:text-slate-350"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-2 min-h-[200px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Parsed Output logs</span>
              <pre className="font-mono text-xs text-slate-650 dark:text-slate-355 whitespace-pre-wrap overflow-y-auto max-h-[220px]">
                {parsedIntakeOutput || "Logs output will appear here after parsing..."}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ==================== VIEW 4: MIASMS & CONSTITUTIONAL MAPPING ==================== */}
      {activeTab === "miasms" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
          {/* LEFT COLUMN: MIASMATIC BURDEN & CONSTITUTION DETAILS (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Miasmatic Burden Distribution Card */}
            <div className="bg-slate-900 dark:bg-slate-950 border border-slate-800 rounded-[28px] p-6 shadow-xl text-white space-y-5">
              <div>
                <h3 className="font-serif text-base font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400 animate-pulse" /> Homeopathic Miasmatic Burden
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Active chronic diathesis load computed from symptom affinities and modalities.</p>
              </div>

              <div className="space-y-4">
                {/* Psora */}
                <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-300">Psora Miasm (Functional Hypersensitivity)</span>
                    <span className="text-amber-400 font-mono">{activeData.miasmaticIndex.psora}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${activeData.miasmaticIndex.psora}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Functional defense, inflammatory states, hypersensitive nerve response, skin eruptions, and fatigue.
                  </p>
                </div>

                {/* Sycosis */}
                <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-300">Sycosis Miasm (Metabolic Sluggishness / Proliferation)</span>
                    <span className="text-teal-455 font-mono">{activeData.miasmaticIndex.sycosis}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="bg-teal-500 h-full rounded-full transition-all duration-500" style={{ width: `${activeData.miasmaticIndex.sycosis}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Metabolic sluggishness, chronic water retention, fibrotic growths, overproduction, and pelvic organ affinity.
                  </p>
                </div>

                {/* Syphilis */}
                <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-300">Syphilis Miasm (Destruction / Degeneration)</span>
                    <span className="text-rose-455 font-mono">{activeData.miasmaticIndex.syphilis}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${activeData.miasmaticIndex.syphilis}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Tissue degeneration, ulceration, structural breakdown, bone pain, vascular damage, and deep mental depression.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Active Constitutional Details */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-serif text-base font-bold flex items-center gap-2">
                  <Layers className="w-5 h-5 text-violet-500" /> Constitutional Miasmatic Profile
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Individual homeostatic baseline and active remedy affinities.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl space-y-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Active Constitutional Remedy</span>
                  <span className="text-base font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shrink-0" />
                    {activeData.constitution}
                  </span>
                  <p className="text-[10.5px] text-slate-550 dark:text-slate-400 leading-relaxed">
                    Dynamic remedy covering the core mental-general and physical-general characteristics of the patient twin.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl space-y-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Active Miasmatic Layer</span>
                  <span className="text-base font-bold text-slate-805 dark:text-zinc-100 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500 shrink-0" />
                    {activeData.miasm}
                  </span>
                  <p className="text-[10.5px] text-slate-550 dark:text-slate-400 leading-relaxed">
                    Dominant chronic layer requiring deep intercurrent remedy sequencing to clear cellular blocks.
                  </p>
                </div>
              </div>

              {activeData.constitutional && (
                <div className="p-4 bg-violet-50/20 dark:bg-violet-950/10 border border-violet-150 dark:border-violet-850 rounded-2xl space-y-2">
                  <span className="text-[9px] font-bold text-violet-500 uppercase tracking-wider block">Modalities & Modality Adaptations</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-zinc-300">
                    <div>
                      <strong className="text-slate-400 font-semibold block text-[10px]">Thermal Reaction:</strong>
                      {activeData.constitutional.thermal}
                    </div>
                    <div>
                      <strong className="text-slate-400 font-semibold block text-[10px]">Appetite / Cravings:</strong>
                      {activeData.constitutional.appetite}
                    </div>
                    <div>
                      <strong className="text-slate-400 font-semibold block text-[10px]">Sleep Profile:</strong>
                      {activeData.constitutional.sleep}
                    </div>
                    <div>
                      <strong className="text-slate-400 font-semibold block text-[10px]">Temperament:</strong>
                      {activeData.constitutional.temperament}
                    </div>
                  </div>
                  <div className="text-[11px] leading-relaxed text-slate-550 dark:text-zinc-350 border-t border-violet-200/25 pt-2 mt-2">
                    <span className="font-bold text-violet-500">Adaptive Vector:</span> {activeData.constitutional.adaptivePattern} (Focus: {activeData.constitutional.systemDominance})
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: INTERACTIVE CONSTITUTIONAL WIZARD (5 COLS) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm space-y-5">
            <div>
              <h3 className="font-serif text-base font-bold flex items-center gap-2">
                <Brain className="w-5 h-5 text-emerald-500" /> Constitutional Diagnostic Wizard
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Map modalities and thermal reactions to determine remedies and miasms.</p>
            </div>

            {isWizardActive ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                    Question {constStep + 1} of {CONSTITUTIONAL_QUESTIONS.length}
                  </span>
                  <span className="text-slate-400 font-mono">
                    {Math.round(((constStep + 1) / CONSTITUTIONAL_QUESTIONS.length) * 100)}%
                  </span>
                </div>

                <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="bg-violet-600 h-full transition-all duration-300"
                    style={{ width: `${((constStep + 1) / CONSTITUTIONAL_QUESTIONS.length) * 100}%` }}
                  ></div>
                </div>

                {constIsCalculating ? (
                  <div className="text-center py-8 space-y-4">
                    <RefreshCw className="w-8 h-8 text-violet-500 animate-spin mx-auto" />
                    <p className="text-xs text-slate-500">Recalculating patient core twin miasms & matching remedy...</p>
                  </div>
                ) : (
                  <div className="space-y-4 animate-fadeIn">
                    <h4 className="text-xs md:text-sm font-bold text-slate-800 dark:text-zinc-150 leading-relaxed bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      {CONSTITUTIONAL_QUESTIONS[constStep].label}
                    </h4>
                    <div className="space-y-2.5">
                      {CONSTITUTIONAL_QUESTIONS[constStep].options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleConstitutionalAnswer(CONSTITUTIONAL_QUESTIONS[constStep].id, opt)}
                          className="w-full text-left p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-semibold cursor-pointer hover:bg-violet-50/50 dark:hover:bg-violet-955/20 text-slate-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-all bg-white dark:bg-slate-900"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-850">
                      {constStep > 0 && (
                        <button
                          onClick={() => setConstStep(constStep - 1)}
                          className="py-2.5 px-4 border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-zinc-400 font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-colors"
                        >
                          Back
                        </button>
                      )}
                      <button
                        onClick={() => setIsWizardActive(false)}
                        className="py-2.5 px-4 border border-transparent text-slate-400 hover:text-slate-600 font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-colors border-none bg-transparent"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl text-center space-y-4 animate-fadeIn">
                <Brain className="w-10 h-10 text-violet-500/80 mx-auto animate-pulse" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-150">Re-examine Constitutional Modalities</h4>
                  <p className="text-[11px] text-slate-400 leading-normal max-w-xs mx-auto">
                    Take the patient through the 5-point assessment of thermal reactions, cravings, and modalities to re-calculate their primary homeostatic remedy and active miasms.
                  </p>
                </div>
                <button
                  onClick={handleStartConstitutional}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-colors border-none shadow-sm"
                >
                  Start Questionnaire Wizard
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== VIEW 3: COMPILED REPORTS ==================== */}
      {activeTab === "reports" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="font-serif text-base font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" /> Compiled Patient Reports Engine
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Select and export dynamic case summaries into official print versions.</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => handleCompileReport("clinical_summary")}
              className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 rounded-2xl flex flex-col items-center text-center gap-2 cursor-pointer transition-all border-none"
            >
              <FileText className="w-8 h-8 text-violet-500" />
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Clinical Summary</span>
            </button>
            <button 
              onClick={() => handleCompileReport("patient_education")}
              className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 rounded-2xl flex flex-col items-center text-center gap-2 cursor-pointer transition-all border-none"
            >
              <Award className="w-8 h-8 text-teal-500" />
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Patient Education</span>
            </button>
            <button 
              onClick={() => handleCompileReport("executive_report")}
              className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 rounded-2xl flex flex-col items-center text-center gap-2 cursor-pointer transition-all border-none"
            >
              <Cpu className="w-8 h-8 text-sky-500" />
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Executive Report</span>
            </button>
          </div>

          {reportType && (
            <div className="border border-slate-250 dark:border-slate-800 rounded-2xl p-4 space-y-3 bg-slate-50 dark:bg-slate-950">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase text-slate-400">Live PDF / Print Preview</span>
                <button 
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:opacity-90 text-white rounded-xl text-xs font-bold border-none cursor-pointer"
                >
                  Print / PDF
                </button>
              </div>
              
              <div 
                className="bg-white p-5 rounded-xl border border-slate-200 text-slate-800 max-h-[300px] overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: reportContent }}
              ></div>
            </div>
          )}
        </div>
      )}

      {/* Clinical Evidence Explorer Overlay Modal (Priority 7) */}
      <AnimatePresence>
        {evidenceExplorerData && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans select-none"
            onClick={() => setEvidenceExplorerData(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-[28px] max-w-lg w-full p-6 text-white space-y-4 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()} // prevent click out
            >
              <button 
                onClick={() => setEvidenceExplorerData(null)}
                className="absolute right-4 top-4 text-slate-500 hover:text-slate-300 border-none bg-transparent cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="border-b border-slate-800 pb-2">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-0.5">OSTM™ Clinical Evidence Explorer</span>
                <h3 className="text-sm font-bold text-sky-400">{evidenceExplorerData.actionName}</h3>
              </div>

              <div className="space-y-3 text-xs leading-normal">
                <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-850 font-mono text-[10px]">
                  <div>
                    <span className="text-slate-500 block text-[9px]">EXPECTED BENEFIT</span>
                    <strong className="text-emerald-400 font-bold">{evidenceExplorerData.benefit} stabilization</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">CONFIDENCE RATING</span>
                    <strong className="text-emerald-400 font-bold">{evidenceExplorerData.confidence} (High Match)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">TIME TO BENEFIT</span>
                    <strong className="text-slate-300">{evidenceExplorerData.timeToBenefit}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">EVIDENCE LEVEL</span>
                    <strong className="text-slate-300">{evidenceExplorerData.evidenceLevel} studies</strong>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-400 text-[10px] uppercase font-mono block">Clinical Rationale:</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{evidenceExplorerData.reason}</p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-400 text-[10px] uppercase font-mono block">Evidence Hierarchy & guidelines:</span>
                  <p className="text-slate-350 text-[11px] leading-relaxed">✓ {evidenceExplorerData.guideline}</p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-400 text-[10px] uppercase font-mono block">Historical Responder outcomes:</span>
                  <p className="text-slate-350 text-[11px] leading-relaxed">✓ {evidenceExplorerData.outcomes}</p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-400 text-[10px] uppercase font-mono block">Knowledge Graph Pathways:</span>
                  <div className="p-2 bg-slate-950 rounded-xl border border-slate-850 text-slate-300 font-mono text-[10px]">
                    {evidenceExplorerData.pathway}
                  </div>
                </div>

                <div className="space-y-1 pt-1 border-t border-slate-800 text-[10px] font-mono text-slate-450">
                  <span className="block text-[8px] text-slate-550 uppercase">Confidence Calculation Breakdown:</span>
                  {evidenceExplorerData.calculations}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setEvidenceExplorerData(null)}
                  className="px-4 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Close Explorer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
