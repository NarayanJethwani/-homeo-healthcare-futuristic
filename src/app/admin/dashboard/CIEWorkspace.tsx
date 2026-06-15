"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Activity, Sparkles, Brain, Send, FileText, 
  Award, Compass, Network, Layers, ShieldAlert, Cpu, 
  Play, RefreshCw, Zap, TrendingUp, Workflow, Calendar, 
  Database, Stethoscope, AlertTriangle, Check, X, Shield 
} from "lucide-react";

interface CIEWorkspaceProps {
  patients: any[];
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  theme: "light" | "dark";
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

export default function CIEWorkspace({ patients, selectedPatientId, setSelectedPatientId, theme }: CIEWorkspaceProps) {
  // Navigation Tabs: Unified Cockpit, Raw note parser intake, Compiled print reports
  const [activeTab, setActiveTab] = useState<"cockpit" | "intake" | "reports">("cockpit");
  const [activeTwinMode, setActiveTwinMode] = useState<"playback" | "simulator">("playback");
  const [twinIndex, setTwinIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timelineZoom, setTimelineZoom] = useState(365); // 1 year default
  
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

  // Dynamic patient key resolver
  const getActiveDataKey = () => {
    if (!selectedPatientId) return "aarav";
    const patientObj = patients.find(p => p.id === selectedPatientId);
    if (!patientObj) return "aarav";
    const nameLower = patientObj.name.toLowerCase();
    if (nameLower.includes("aarav") || nameLower.includes("sharma")) return "aarav";
    if (nameLower.includes("priya") || nameLower.includes("patel")) return "priya";
    if (nameLower.includes("elena") || nameLower.includes("rostova")) return "elena";
    return "default";
  };

  const activeDataKey = getActiveDataKey();
  const activeData = PATIENT_LONGITUDINAL_DATA[activeDataKey] || PATIENT_LONGITUDINAL_DATA.default;

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
    
    // Base timeline drifts
    if (activeDataKey === "aarav") {
      vitality = Math.round(vitality + (8 * factor));
      burden = Math.round(burden - (10 * factor));
      labs = {
        egfr: activeData.labs.egfr[activeData.labs.egfr.length - 1] + (4 * factor),
        creatinine: activeData.labs.creatinine[activeData.labs.creatinine.length - 1] - (0.15 * factor),
        hba1c: activeData.labs.hba1c[activeData.labs.hba1c.length - 1] - (0.4 * factor),
        microalbumin: activeData.labs.microalbumin[activeData.labs.microalbumin.length - 1] - (25 * factor)
      };
    } else if (activeDataKey === "priya") {
      vitality = Math.round(vitality + (12 * factor));
      burden = Math.round(burden - (14 * factor));
      labs = {
        tsh: activeData.labs.tsh[activeData.labs.tsh.length - 1] - (1.6 * factor),
        lh_fsh_ratio: activeData.labs.lh_fsh_ratio[activeData.labs.lh_fsh_ratio.length - 1] - (0.42 * factor),
        cholesterol: activeData.labs.cholesterol[activeData.labs.cholesterol.length - 1] - (20 * factor),
        weight_kg: activeData.labs.weight_kg[activeData.labs.weight_kg.length - 1] - (5.7 * factor)
      };
    } else {
      vitality = Math.round(vitality + (17 * factor));
      burden = Math.round(burden - (17 * factor));
      labs = {
        esr: activeData.labs.esr[activeData.labs.esr.length - 1] - (14 * factor),
        crp: activeData.labs.crp[activeData.labs.crp.length - 1] - (2.7 * factor),
        anticcp: activeData.labs.anticcp[activeData.labs.anticcp.length - 1] - (10 * factor),
        painScore: activeData.labs.painScore[activeData.labs.painScore.length - 1] - (1.5 * factor)
      };
    }

    // Apply simulation checkbox overrides
    if (simOptions.stopTreatment) {
      vitality = Math.round(activeData.vitalityIndex - (22 * factor) - 8);
      burden = Math.round(activeData.diseaseBurdenIndex + (25 * factor) + 10);
      if (activeDataKey === "aarav") {
        labs.egfr = Math.max(15, labs.egfr - (27 * factor));
        labs.creatinine += 0.8 * factor;
        labs.hba1c += 2.0 * factor;
        symptoms.forEach((s: any) => { s.severity = "Severe"; });
      } else if (activeDataKey === "priya") {
        labs.tsh += 4.5 * factor;
        labs.lh_fsh_ratio += 1.2 * factor;
        labs.weight_kg += 6.0 * factor;
        symptoms.forEach((s: any) => { s.severity = "Severe"; });
      } else {
        labs.esr += 28 * factor;
        labs.painScore = Math.min(10, labs.painScore + 4 * factor);
        symptoms.forEach((s: any) => { s.severity = "Severe"; });
      }
    } else {
      if (simOptions.increasePotency) {
        vitality += Math.round(5 * factor + 2);
        burden -= Math.round(4 * factor);
        if (activeDataKey === "aarav") labs.egfr += 3.2 * factor;
        else if (activeDataKey === "priya") labs.tsh -= 0.6 * factor;
        else labs.esr -= 5.0 * factor;
      }
      if (simOptions.improveSleep) {
        vitality += Math.round(4 * factor + 1);
        symptoms.forEach((s: any) => { if (s.name.includes("fatigue") || s.name.includes("swings")) s.severity = "Resolved"; });
      }
      if (simOptions.improveHbA1c && activeDataKey === "aarav") {
        labs.hba1c -= 0.8 * factor;
        labs.egfr += 2.5 * factor;
      }
      if (simOptions.reduceWeight) {
        if (activeDataKey === "aarav") labs.hba1c -= 0.3 * factor;
        else if (activeDataKey === "priya") {
          labs.weight_kg -= 3.5 * factor;
          labs.lh_fsh_ratio -= 0.2 * factor;
        }
      }
      if (simOptions.changeRemedy) {
        if (simDays > 30) {
          vitality += Math.round(6 * factor);
          burden -= Math.round(5 * factor);
        }
      }
    }

    // Recalculate risk scores under simulation changes
    risks.forEach((r: any) => {
      if (simOptions.stopTreatment) {
        r.val = Math.min(98, Math.round(r.val + (22 * factor) + 10));
      } else {
        let reduction = 0;
        if (simOptions.increasePotency) reduction += 10;
        if (simOptions.improveSleep) reduction += 6;
        if (simOptions.improveHbA1c && activeDataKey === "aarav") reduction += 14;
        if (simOptions.reduceWeight) reduction += 8;
        r.val = Math.max(5, Math.round(r.val - (reduction * factor) - (8 * factor)));
      }
      if (r.val > 75) { r.level = "High Risk"; r.color = "text-rose-500"; }
      else if (r.val > 40) { r.level = "Moderate Risk"; r.color = "text-amber-500"; }
      else { r.level = "Low Risk"; r.color = "text-emerald-500"; }
    });

    // Confidence formula
    let confidence = 92 - (simDays === 365 ? 20 : simDays === 180 ? 11 : simDays === 90 ? 4 : 0);
    const activeSwitches = Object.values(simOptions).filter(Boolean).length;
    confidence = Math.max(50, confidence - (activeSwitches * 2));

    return {
      vitality: Math.min(100, Math.max(0, vitality)),
      burden: Math.min(100, Math.max(0, burden)),
      labs,
      symptoms,
      risks,
      confidence
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
        { name: "HbA1c", values: activeData.labs.hba1c.map(v => v * 10), color: "#8b5cf6" }
      ];
    } else if (activeDataKey === "priya") {
      datasets = [
        { name: "TSH", values: activeData.labs.tsh.map(v => v * 10), color: "#8b5cf6" },
        { name: "Weight", values: activeData.labs.weight_kg, color: "#0ea5e9" }
      ];
    } else {
      datasets = [
        { name: "ESR", values: activeData.labs.esr, color: "#f43f5e" },
        { name: "CRP", values: activeData.labs.crp.map(v => v * 5), color: "#0ea5e9" }
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

  // Render SVG/Canvas 30d/90d/180d/1y Forecast curves
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

    // Adjust lines in real-time simulation mode
    if (activeTwinMode === "simulator") {
      const sim = simulatedResults;
      if (sim) {
        curves.forEach(c => {
          if (c.name.includes("Risk") || c.name.includes("Trigger") || c.name.includes("Flare")) {
            // Apply projection value
            const finalSim = sim.risks[0]?.val || 50;
            const diff = finalSim - c.values[0];
            c.values = c.values.map((v, i) => Math.round(v + (diff * (i / 4))));
          } else {
            // Support curves
            const finalSim = sim.risks[1]?.val || 30;
            const diff = finalSim - c.values[0];
            c.values = c.values.map((v, i) => Math.round(v + (diff * (i / 4))));
          }
        });
      }
    }

    curves.forEach(c => {
      ctx.beginPath();
      ctx.strokeStyle = c.color;
      ctx.lineWidth = 2;

      c.values.forEach((val, i) => {
        const x = padding.left + i * stepX;
        const norm = (val - 10) / 90; // scale between 10% and 100%
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

  // Render Animated Knowledge Graph (HTML5 physics engine with click interceptor)
  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas || activeTab !== "cockpit") return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.parentElement?.clientWidth || 400;
    const height = 280;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const nodes = [
      { id: "sym_renal", label: "Ankle Edema", type: "symptom", x: width * 0.15, y: height * 0.35, radius: 12, description: "Fluid loading in lower limbs due to filtration drops." },
      { id: "sym_fatigue", label: "Extreme Fatigue", type: "symptom", x: width * 0.45, y: height * 0.20, radius: 12, description: "Uremic fatigue and thyroid sluggishness marker." },
      { id: "sym_bloat", label: "Flatulence & Bloat", type: "symptom", x: width * 0.35, y: height * 0.70, radius: 12, description: "Digestive gas accumulation worse 4-8 PM." },
      { id: "sym_nocturia", label: "Nocturia Urination", type: "symptom", x: width * 0.18, y: height * 0.55, radius: 12, description: "Frequent nocturnal urination worse 2-5 AM." },
      { id: "sym_menses", label: "Irregular Menses", type: "symptom", x: width * 0.70, y: height * 0.65, radius: 12, description: "Oligomenorrhea and hormone cycling drops." },
      { id: "sym_stiffness", label: "Joint Stiffness", type: "symptom", x: width * 0.78, y: height * 0.28, radius: 12, description: "Symmetrical morning stiffness duration > 2 hours." },
      
      { id: "org_kidney", label: "Renal Kidneys", type: "organ", x: width * 0.28, y: height * 0.45, radius: 16, description: "Bilateral renal filtration & glomerulonephritis." },
      { id: "org_thyroid", label: "Endocrine Thyroid", type: "organ", x: width * 0.55, y: height * 0.40, radius: 16, description: "TSH secretions & thyroxin metabolic loops." },
      { id: "org_joints", label: "Joint Articular", type: "organ", x: width * 0.72, y: height * 0.45, radius: 16, description: "Articular cartilage synovial tissue loading." },
      
      { id: "rem_lyc", label: "Lycopodium", type: "remedy", x: width * 0.33, y: height * 0.82, radius: 10, description: "Psoric/Sycotic constitution, right side, flatulence." },
      { id: "rem_apis", label: "Apis Mellifica", type: "remedy", x: width * 0.08, y: height * 0.45, radius: 10, description: "Bilateral renal support, puffiness under eyes, thirstless." },
      { id: "rem_anguillae", label: "Serum Anguillae", type: "remedy", x: width * 0.12, y: height * 0.72, radius: 10, description: "Specific support for acute kidney loading." },
      { id: "rem_puls", label: "Pulsatilla", type: "remedy", x: width * 0.58, y: height * 0.80, radius: 10, description: "Mild yielding profile, thirstless, open air amel." },
      { id: "rem_thyroid", label: "Thyroidinum", type: "remedy", x: width * 0.45, y: height * 0.88, radius: 10, description: "Intercurrent gland support for sluggish thyroid." },
      { id: "rem_sil", label: "Silicea Terra", type: "remedy", x: width * 0.88, y: height * 0.60, radius: 10, description: "Cold chilly profile, sweat on soles/palms, nodes." },
      
      { id: "mias_psora", label: "Psora Miasm", type: "miasm", x: width * 0.50, y: height * 0.60, radius: 14, description: "Initial functional deficiency & metabolic fatigue." },
      { id: "mias_sycosis", label: "Sycosis Miasm", type: "miasm", x: width * 0.22, y: height * 0.80, radius: 14, description: "Accumulation, fluid loading, hyper-tissue structures." },
      { id: "mias_syphilis", label: "Syphilis Miasm", type: "miasm", x: width * 0.88, y: height * 0.80, radius: 14, description: "Degeneration of tissues, structural ulceration." }
    ];

    const links = [
      { source: "sym_renal", target: "org_kidney" },
      { source: "sym_nocturia", target: "org_kidney" },
      { source: "sym_bloat", target: "org_kidney" },
      { source: "sym_fatigue", target: "org_thyroid" },
      { source: "sym_menses", target: "org_thyroid" },
      { source: "sym_stiffness", target: "org_joints" },
      { source: "org_kidney", target: "rem_apis" },
      { source: "org_kidney", target: "rem_anguillae" },
      { source: "org_kidney", target: "rem_lyc" },
      { source: "org_thyroid", target: "rem_puls" },
      { source: "org_thyroid", target: "rem_thyroid" },
      { source: "org_joints", target: "rem_sil" },
      { source: "rem_lyc", target: "mias_sycosis" },
      { source: "rem_apis", target: "mias_sycosis" },
      { source: "rem_anguillae", target: "mias_sycosis" },
      { source: "rem_puls", target: "mias_psora" },
      { source: "rem_thyroid", target: "mias_psora" },
      { source: "rem_sil", target: "mias_syphilis" }
    ];

    let animationFrameId: number;
    const isDark = theme === "dark";

    const drawGraph = () => {
      ctx.clearRect(0, 0, width, height);

      // Links drawing
      links.forEach(link => {
        const s = nodes.find(n => n.id === link.source);
        const t = nodes.find(n => n.id === link.target);
        if (!s || !t) return;

        const isHighlighted = selectedNodeId === s.id || selectedNodeId === t.id;
        ctx.strokeStyle = isHighlighted
          ? "rgba(16, 185, 129, 0.4)"
          : isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.08)";
        ctx.lineWidth = isHighlighted ? 1.5 : 1;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);
        ctx.stroke();
      });

      // Nodes drawing
      nodes.forEach(node => {
        let color = "#0ea5e9";
        if (node.type === "symptom") color = "#f43f5e";
        else if (node.type === "organ") color = "#3b82f6";
        else if (node.type === "remedy") color = "#8b5cf6";
        else if (node.type === "miasm") color = "#eab308";

        const isSelected = selectedNodeId === node.id;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + (isSelected ? 3 : 0), 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();

        ctx.strokeStyle = isSelected ? "#10b981" : isDark ? "#0f172a" : "#ffffff";
        ctx.lineWidth = isSelected ? 3.0 : 1.5;
        ctx.stroke();

        ctx.fillStyle = isSelected ? "#10b981" : isDark ? "#cbd5e1" : "#1e293b";
        ctx.font = isSelected ? "bold 8.5px sans-serif" : "7.5px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(node.label, node.x, node.y + node.radius + 10);
      });
    };

    // Physics floating drift loop
    let t = 0;
    const animate = () => {
      t += 0.008;
      nodes.forEach((node, idx) => {
        if (node.type === "symptom" || node.type === "remedy") {
          node.y += Math.sin(t + idx) * 0.08;
          node.x += Math.cos(t + idx) * 0.08;
        }
      });
      drawGraph();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Canvas click interceptor
    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Click checks
      const clicked = nodes.find(n => {
        const dx = clickX - n.x;
        const dy = clickY - n.y;
        return Math.sqrt(dx * dx + dy * dy) < n.radius + 10;
      });

      if (clicked) {
        setSelectedNodeId(clicked.id);
      }
    };

    canvas.addEventListener("click", handleCanvasClick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("click", handleCanvasClick);
    };
  }, [activeTab, theme, selectedNodeId]);

  // Dynamic OSTM Inspector detail retriever
  const selectedNodeInfo = (() => {
    if (!selectedNodeId) return null;
    
    // Hardcoded clinical records mapping database
    const nodeDetails: Record<string, {
      title: string;
      type: string;
      description: string;
      evidenceRating: string;
      historicalOutcome: string;
      connectedElements: string[];
    }> = {
      sym_renal: {
        title: "Bilateral Ankle Edema",
        type: "Active Symptom Path",
        description: "Bilateral puffiness of feet indicating active fluid loading under renal clearance pressure.",
        evidenceRating: "Grade A Clinical Correlation",
        historicalOutcome: "84% success rate under Apis + Serum Anguillae regulation",
        connectedElements: ["Renal Kidneys (Organ)", "Apis Mellifica (Remedy)", "Serum Anguillae (Remedy)", "Sycosis Miasm"]
      },
      org_kidney: {
        title: "Renal Kidneys (OSTM)",
        type: "Target Organ System",
        description: "Primary system filtration load. Current filtration index degraded to Stage 3b.",
        evidenceRating: "Grade A Biomarker Verification",
        historicalOutcome: "Metformin adjustment + homeo support stabilized eGFR decline by 35%",
        connectedElements: ["Ankle Edema (Symptom)", "Nocturia (Symptom)", "Serum Anguillae (Remedy)", "Sycosis Miasm"]
      },
      rem_lyc: {
        title: "Lycopodium Clavatum",
        type: "Constitutional Remedy Vector",
        description: "Right-sided remedy matching digestive flatulence aggravations between 4-8 PM.",
        evidenceRating: "88% Clinical Affinity Score",
        historicalOutcome: "68% vitality improvement recorded after 14 months of constitutional administration",
        connectedElements: ["Flatulence & Bloat (Symptom)", "Renal Kidneys (Organ)", "Sycosis Miasm", "Psora Miasm"]
      },
      mias_sycosis: {
        title: "Sycosis Miasm Layer",
        type: "Miasmatic Focus",
        description: "Underlying chronic sycotic structure triggers fluid retention, cell growths, and sluggish excretions.",
        evidenceRating: "65% Dominance score",
        historicalOutcome: "Sycotic detox cycles reduced ankle edema recurrence by 80%",
        connectedElements: ["Lycopodium (Remedy)", "Apis Mellifica (Remedy)", "Renal Kidneys (Organ)", "Ankle Edema (Symptom)"]
      }
    };

    return nodeDetails[selectedNodeId] || {
      title: selectedNodeId.split("_")[1].toUpperCase(),
      type: "Anatomical Node",
      description: "Active node in the OSTM knowledge mapping database. Controls structural connections.",
      evidenceRating: "Grade B Mapping",
      historicalOutcome: "72% average index stabilization",
      connectedElements: ["Renal Kidneys (Organ)", "Psora Miasm"]
    };
  })();

  // Handle Ask AI submit
  const handleAskAICopilot = async () => {
    if (!customQuery.trim()) return;
    const text = customQuery.trim();
    setCustomQuery("");

    setChatHistory(prev => [...prev, { sender: "doctor", text }]);
    setIsProcessingChat(true);

    setTimeout(() => {
      let responseText = "";
      const q = text.toLowerCase();
      if (q.includes("remedy") || q.includes("homeopath") || q.includes("selection")) {
        responseText = `Based on OSTM™ mapping for ${activeData.name}, the active remedy reasoning is:\n\n1. **${activeDataKey === "aarav" ? "Lycopodium Clavatum" : activeDataKey === "priya" ? "Pulsatilla Nigricans" : "Silicea Terra"}** (Constitutional remedy targeting the root system).\n2. **${activeDataKey === "aarav" ? "Serum Anguillae 6X" : activeDataKey === "priya" ? "Thyroidinum 3X" : "Rhus Tox 30C"}** (Organ-system specific support).\n\nMiasmatic profiling recommends addressing the dominant **${activeData.miasm.split(' ')[0]}** layer to avoid chronic structural progression.`;
      } else if (q.includes("risk") || q.includes("predict")) {
        responseText = `CIE™ Predictive Models indicate a **${activeData.predictiveRisks[0].level} (${activeData.predictiveRisks[0].val}%)** score for target system progression.\n\n* **Primary Driver:** ${activeData.predictiveRisks[0].driver}.\n* **Modifiable Factors:** ${activeData.predictiveRisks[0].modifiable}.\n\nRenal filtration slope is predicted to remain stable if Metformin and Apis protocols are maintained under strict diet tracking.`;
      } else if (q.includes("egfr") || q.includes("creatinine") || q.includes("lab")) {
        responseText = `Reviewing lab trends: ${activeDataKey === "aarav" ? "eGFR declined 9 points over 12 months, prompting Metformin reduction. Current eGFR: 49 mL/min. Creatinine: 1.6 mg/dL." : activeDataKey === "priya" ? "TSH peaked at 7.8 uIU/mL but has improved to 4.8 uIU/mL after Thyroidinum." : "CRP improved from 18.5 to 8.2 mg/L, reflecting flare resolution."}`;
      } else {
        responseText = `The Clinical Intelligence Engine has analyzed the query: "${text}".\n\nPatient Vitality is current at ${activeData.vitalityIndex}%, with a Chronic Disease Burden of ${activeData.diseaseBurdenIndex}%.`;
      }

      setChatHistory(prev => [...prev, { sender: "ai", text: responseText }]);
      setIsProcessingChat(false);
    }, 1500);
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

  // Resolve simulation values
  const activeVitality = activeTwinMode === "simulator" && simulatedResults ? simulatedResults.vitality : activeData.vitalityIndex;
  const activeBurden = activeTwinMode === "simulator" && simulatedResults ? simulatedResults.burden : activeData.diseaseBurdenIndex;
  const activeRisks = activeTwinMode === "simulator" && simulatedResults ? simulatedResults.risks : activeData.predictiveRisks;
  const activeSymptoms = activeTwinMode === "simulator" && simulatedResults ? simulatedResults.symptoms : activeData.symptoms;

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
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${activeTab === "reports" ? "bg-emerald-600 border-emerald-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"}`}
          >
            📄 Compiled Reports
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
        <div className="space-y-6">
          
          {/* LAYER 1: Patient Snapshot Card & AI Copilot Summary */}
          <div className="bg-slate-900 dark:bg-slate-950 border border-slate-800 rounded-[28px] p-6 shadow-xl text-white">
            <div className="flex flex-col lg:flex-row gap-6">
              
              {/* Snapshot Details (2/3 cols) */}
              <div className="flex-1 lg:flex-[2] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-3.5 h-3.5 rounded-full ${activeDataKey === "aarav" ? "bg-rose-500 animate-pulse shadow-[0_0_10px_#f43f5e]" : "bg-emerald-500 shadow-[0_0_10px_#10b981]"}`}></span>
                    <h2 className="text-lg font-bold font-serif">{activeData.name}</h2>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${activeDataKey === "aarav" ? "bg-rose-950/40 text-rose-400 border border-rose-900" : "bg-emerald-950/40 text-emerald-400 border border-emerald-900"}`}>
                    {activeDataKey === "aarav" ? "UNSTABLE DIABETIC CKD" : "COMPENSATED"}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-2xl flex flex-col gap-0.5">
                    <span className="text-[8px] uppercase tracking-wider text-slate-400">Age / Gender</span>
                    <span className="text-xs font-bold">{activeDataKey === "aarav" ? "48 / Male" : activeDataKey === "priya" ? "31 / Female" : "65 / Female"}</span>
                  </div>
                  <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-2xl flex flex-col gap-0.5">
                    <span className="text-[8px] uppercase tracking-wider text-slate-400">Constitution</span>
                    <span className="text-xs font-bold text-purple-400">{activeData.constitution}</span>
                  </div>
                  <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-2xl flex flex-col gap-0.5">
                    <span className="text-[8px] uppercase tracking-wider text-slate-400">Primary Diagnosis</span>
                    <span className="text-xs font-bold text-rose-400 line-clamp-1">
                      {activeDataKey === "aarav" ? "Type 2 Diabetes & CKD" : activeDataKey === "priya" ? "Hypothyroid & PCOS" : "Rheumatoid Arthritis"}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-2xl flex flex-col gap-0.5">
                    <span className="text-[8px] uppercase tracking-wider text-slate-400">Active Remedies</span>
                    <span className="text-xs font-bold text-sky-400 line-clamp-1">{activeData.remedyMatches[0].name}</span>
                  </div>
                </div>
              </div>

              {/* AI Copilot summary (1/3 cols) */}
              <div className="flex-1 bg-gradient-to-r from-emerald-950/20 to-teal-950/20 border border-emerald-900/30 rounded-2xl p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 border-b border-emerald-900/30 pb-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">AI Copilot Summary</span>
                </div>
                <p className="text-[11.5px] leading-relaxed text-slate-300 font-sans">
                  {activeDataKey === "aarav" 
                    ? "Patient shows stable diabetic control but progressive CKD risk. eGFR declined 9 points over 12 months. Remedy response favorable. Recommend renal support protocol and review in 4 weeks."
                    : activeDataKey === "priya"
                      ? "Subclinical hypothyroid stabilized after Calcarea intercurrent addition. TSH improved to 4.8 uIU/mL. Continue Pulsatilla 30C and monitor weight indexes."
                      : "Rheumatoid flare-up resolved after Rhus Tox + Causticum protocol. Inflammatory CRP level dropped from 18.5 to 8.2 mg/L. Mobilization stiffness duration minimized."}
                </p>
              </div>

            </div>
          </div>

          {/* LAYER 2: Digital Twin Engine™ Simulator panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-serif text-base font-bold flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-500" /> Patient Digital Twin Simulator™
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Toggle between historical timeline playback and what-if simulation controls.</p>
              </div>

              {/* Mode switch */}
              <div className="flex bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 gap-1">
                <button
                  onClick={() => setActiveTwinMode("playback")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all border-none ${activeTwinMode === "playback" ? "bg-white dark:bg-slate-850 shadow text-slate-800 dark:text-slate-100" : "text-slate-400 hover:text-slate-600 bg-transparent"}`}
                >
                  Chronology Timeline
                </button>
                <button
                  onClick={() => setActiveTwinMode("simulator")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all border-none ${activeTwinMode === "simulator" ? "bg-white dark:bg-slate-850 shadow text-slate-800 dark:text-slate-100" : "text-slate-400 hover:text-slate-600 bg-transparent"}`}
                >
                  "What-If" Simulator
                </button>
              </div>
            </div>

            {/* Playback View */}
            {activeTwinMode === "playback" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <span className="text-xs text-slate-500">playback historical visits. Click elements to scrub logs.</span>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:opacity-90 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border-none"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      {isPlaying ? "Pause" : "Play Timeline"}
                    </button>
                    <button 
                      onClick={() => { setIsPlaying(false); setTwinIndex(0); }}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold cursor-pointer border-none text-slate-700 dark:text-slate-300"
                    >
                      Reset
                    </button>
                    <span className="px-3 py-1 bg-slate-900 border border-slate-800 text-white rounded-lg font-mono text-xs font-bold">
                      {activeData.history[twinIndex]?.date || "Date"}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="flex items-center bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 gap-4">
                  <span className="text-[10px] font-mono text-slate-400">{activeData.labs.timeline[0]}</span>
                  <div className="flex-1 relative h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full">
                    <div 
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                      style={{ width: `${(twinIndex / (activeData.labs.timeline.length - 1)) * 100}%` }}
                    ></div>
                    <div 
                      className="absolute w-3 h-3 bg-white border-2 border-emerald-500 rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer shadow-md"
                      style={{ left: `${(twinIndex / (activeData.labs.timeline.length - 1)) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{activeData.labs.timeline[activeData.labs.timeline.length - 1]}</span>
                </div>

                {/* Historic metrics details */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col gap-0.5">
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Active Remedy Vector</span>
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                      {activeData.history.filter(h => h.type === "Remedy" && h.date <= activeData.labs.timeline[twinIndex]).slice(-1)[0]?.event || activeData.remedyMatches[0].name}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col gap-0.5">
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Pathological event</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-350 truncate">
                      {activeData.history.filter(h => h.date <= activeData.labs.timeline[twinIndex]).slice(-1)[0]?.event || "Baseline check"}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col gap-0.5">
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Miasmatic Focus</span>
                    <span className="text-xs font-bold text-amber-500">{activeData.miasm.split(" ")[0]}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col gap-0.5">
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Notes</span>
                    <span className="text-[10px] text-slate-500 truncate">
                      {activeData.history.filter(h => h.date <= activeData.labs.timeline[twinIndex]).slice(-1)[0]?.notes || "None"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Simulation View */}
            {activeTwinMode === "simulator" && simulatedResults && (
              <div className="space-y-4">
                
                {/* Time projections & confidence */}
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Time Projection:</span>
                    <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                      {[30, 90, 180, 365].map(days => (
                        <button
                          key={days}
                          onClick={() => setSimDays(days)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all border-none ${simDays === days ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-700 bg-transparent"}`}
                        >
                          {days === 365 ? "1 Year" : `+${days}d`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Simulator Efficacy Confidence:</span>
                    <span className="font-mono font-bold text-emerald-500 text-sm">{simulatedResults.confidence}%</span>
                  </div>
                </div>

                {/* What happens if controls grid */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">"What happens if..." clinical switches:</span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    
                    <label className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs cursor-pointer hover:border-emerald-500 transition-all">
                      <input 
                        type="checkbox"
                        checked={simOptions.increasePotency}
                        onChange={(e) => setSimOptions(prev => ({ ...prev, increasePotency: e.target.checked }))}
                        className="rounded border-slate-350 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Increase remedy potency (30C -&gt; 200C)</span>
                    </label>

                    <label className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs cursor-pointer hover:border-emerald-500 transition-all">
                      <input 
                        type="checkbox"
                        checked={simOptions.changeRemedy}
                        onChange={(e) => setSimOptions(prev => ({ ...prev, changeRemedy: e.target.checked }))}
                        className="rounded border-slate-350 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Change remedy vector</span>
                    </label>

                    {activeDataKey === "aarav" && (
                      <label className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs cursor-pointer hover:border-emerald-500 transition-all">
                        <input 
                          type="checkbox"
                          checked={simOptions.improveHbA1c}
                          onChange={(e) => setSimOptions(prev => ({ ...prev, improveHbA1c: e.target.checked }))}
                          className="rounded border-slate-355 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>Improve HbA1c control (&lt;7.0)</span>
                      </label>
                    )}

                    {activeDataKey === "priya" && (
                      <label className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs cursor-pointer hover:border-emerald-500 transition-all">
                        <input 
                          type="checkbox"
                          checked={simOptions.reduceWeight}
                          onChange={(e) => setSimOptions(prev => ({ ...prev, reduceWeight: e.target.checked }))}
                          className="rounded border-slate-355 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>Reduce weight indices (by 3kg)</span>
                      </label>
                    )}

                    <label className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs cursor-pointer hover:border-emerald-500 transition-all">
                      <input 
                        type="checkbox"
                        checked={simOptions.improveSleep}
                        onChange={(e) => setSimOptions(prev => ({ ...prev, improveSleep: e.target.checked }))}
                        className="rounded border-slate-355 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Improve sleep quality</span>
                    </label>

                    <label className="flex items-center gap-2.5 p-3 bg-rose-50/20 dark:bg-rose-950/10 rounded-2xl border border-rose-200 dark:border-rose-900/30 text-xs cursor-pointer hover:border-rose-500 transition-all">
                      <input 
                        type="checkbox"
                        checked={simOptions.stopTreatment}
                        onChange={(e) => setSimOptions(prev => ({ ...prev, stopTreatment: e.target.checked }))}
                        className="rounded border-rose-300 text-rose-600 focus:ring-rose-500"
                      />
                      <span className="text-rose-600 dark:text-rose-400 font-bold">Stop remedy treatment</span>
                    </label>

                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Layer 3 & 4: OSTM Graph & AI reasoning copilot split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* OSTM Knowledge Graph (7 cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm flex flex-col justify-between">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-2 flex justify-between items-center">
                <div>
                  <h3 className="font-serif text-base font-bold flex items-center gap-2">
                    <Network className="w-5 h-5 text-emerald-500" /> OSTM Graph™ (Anatomical reasoning)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Click graph nodes to explore specific clinical affinities.</p>
                </div>
                <span className="logo-sub text-[9px] border-emerald-500 text-emerald-500">Physics Graph</span>
              </div>

              <div className="relative border border-slate-200 dark:border-slate-800 bg-slate-950/90 rounded-2xl overflow-hidden h-[280px] my-3">
                <canvas ref={graphCanvasRef} className="w-full h-full block" />
              </div>

              {/* Inspector details panel if selected */}
              <AnimatePresence mode="wait">
                {selectedNodeId && selectedNodeInfo && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-850 pb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{selectedNodeInfo.title}</h4>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-slate-400">{selectedNodeInfo.type}</span>
                    </div>

                    <p className="text-[10px] text-slate-500 leading-relaxed">{selectedNodeInfo.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-[9px] pt-1">
                      <div>
                        <span className="text-slate-400 uppercase tracking-wide font-bold block">Evidence Score</span>
                        <span className="font-mono text-slate-700 dark:text-slate-350">{selectedNodeInfo.evidenceRating}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase tracking-wide font-bold block">Historical Outcome</span>
                        <span className="font-mono text-emerald-500 font-semibold">{selectedNodeInfo.historicalOutcome}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* AI Reasoning Copilot Workspace (5 cols) */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm flex flex-col justify-between min-h-[440px]">
              
              <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-serif text-base font-bold flex items-center gap-2">
                    <Brain className="w-5 h-5 text-indigo-500 animate-pulse" /> Clinical AI Copilot™ Workspace
                  </h3>
                  <span className="px-2.5 py-0.5 bg-emerald-955/35 text-emerald-400 border border-emerald-900 rounded-lg text-[9px] font-mono">
                    {activeTwinMode === "simulator" && simulatedResults ? `${simulatedResults.confidence}% Conf.` : "88% Conf."}
                  </span>
                </div>

                {/* Copilot subtabs */}
                <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 gap-1 mt-2">
                  <button
                    onClick={() => setCopilotActiveTab("reasoning")}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all border-none ${copilotActiveTab === "reasoning" ? "bg-white dark:bg-slate-850 text-slate-850 dark:text-slate-100 shadow" : "text-slate-400 bg-transparent"}`}
                  >
                    Differential Mappings & Labs
                  </button>
                  <button
                    onClick={() => setCopilotActiveTab("chat")}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all border-none ${copilotActiveTab === "chat" ? "bg-white dark:bg-slate-850 text-slate-850 dark:text-slate-100 shadow" : "text-slate-400 bg-transparent"}`}
                  >
                    Ask CIE™ Brain
                  </button>
                </div>
              </div>

              {/* Subtab 1: Differential and Investigations */}
              {copilotActiveTab === "reasoning" && (
                <div className="flex-1 overflow-y-auto my-3.5 space-y-4 pr-1 font-sans">
                  
                  {/* Differential diagnoses */}
                  <div className="space-y-2.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Differential Diagnoses (No Black-Box)</span>
                    
                    {activeDataKey === "aarav" ? (
                      <>
                        <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 text-[11px]">
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-slate-855 dark:text-slate-200">Diabetic Nephropathy (CKD Stage 3b)</span>
                            <span className="text-emerald-500 font-mono font-bold">92% Prob.</span>
                          </div>
                          <p className="text-slate-500 leading-normal text-[10px]"><strong>Key Evidence:</strong> eGFR: 49, Creatinine: 1.6, HbA1c: 6.9, persistent microalbuminuria.</p>
                        </div>
                        
                        <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 text-[11px]">
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-slate-855 dark:text-slate-200">Cardiovascular Renal Syndrome (Type 4)</span>
                            <span className="text-amber-500 font-mono font-bold">70% Consider</span>
                          </div>
                          <p className="text-slate-500 leading-normal text-[10px]"><strong>Key Evidence:</strong> eGFR decline slope, ankle edema, sedentary profile.</p>
                        </div>
                      </>
                    ) : activeDataKey === "priya" ? (
                      <>
                        <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 text-[11px]">
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-slate-855 dark:text-slate-200">Polycystic Ovary Syndrome (PCOS)</span>
                            <span className="text-emerald-500 font-mono font-bold">88% Confirmed</span>
                          </div>
                          <p className="text-slate-500 leading-normal text-[10px]"><strong>Key Evidence:</strong> LH/FSH ratio 2.8, irregular menstrual cycles, hirsutism.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 text-[11px]">
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-slate-855 dark:text-slate-200">Seropositive Rheumatoid Arthritis</span>
                            <span className="text-emerald-500 font-mono font-bold">95% Confirmed</span>
                          </div>
                          <p className="text-slate-500 leading-normal text-[10px]"><strong>Key Evidence:</strong> Symmetrical joint swellings, Anti-CCP: 85, morning stiffness.</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Red flags */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-rose-500 block">Red Flag Warnings</span>
                    <ul className="list-disc pl-5 text-[10px] text-slate-550 leading-relaxed space-y-1">
                      {activeDataKey === "aarav" ? (
                        <>
                          <li>Rapid decline in renal filtration capacity (eGFR slope is negative over 12 months).</li>
                          <li>Cardiovascular load risk (ankle edema + sedentary profile).</li>
                        </>
                      ) : activeDataKey === "priya" ? (
                        <>
                          <li>Subclinical hypothyroid progression to clinical status (TSH reached 7.8 uIU/mL).</li>
                          <li>Insulin resistance markers linked to PCOS weight gain loop.</li>
                        </>
                      ) : (
                        <>
                          <li>Active auto-immune joint flare-up (ESR rose to 58 mm/hr).</li>
                          <li>Risk of joint erosive contractures without continuous movement.</li>
                        </>
                      )}
                    </ul>
                  </div>

                  {/* Suggested investigations */}
                  <div className="space-y-1 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Suggested Investigations</span>
                    <ul className="list-disc pl-5 text-[10px] text-slate-550 leading-relaxed space-y-1">
                      {activeDataKey === "aarav" ? (
                        <>
                          <li>Repeat Serum Electrolytes (Potassium, Sodium) every 30 days.</li>
                          <li>24-Hour Urinary Protein clearance.</li>
                        </>
                      ) : activeDataKey === "priya" ? (
                        <>
                          <li>Fasting Insulin & OGTT (evaluate insulin resistance).</li>
                          <li>Free T3, Free T4 thyroid panels.</li>
                        </>
                      ) : (
                        <>
                          <li>Rheumatoid Factor quantification.</li>
                          <li>Synovial Fluid aspiration (rule out gouty crossover).</li>
                        </>
                      )}
                    </ul>
                  </div>

                </div>
              )}

              {/* Subtab 2: Ask AI Chat console */}
              {copilotActiveTab === "chat" && (
                <div className="flex-1 flex flex-col justify-between my-2 overflow-hidden h-[330px]">
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {chatHistory.map((chat, idx) => (
                      <div key={idx} className={`flex ${chat.sender === "doctor" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] rounded-2xl p-3 text-[11px] leading-relaxed ${chat.sender === "doctor" ? "bg-slate-100 dark:bg-slate-850 text-slate-805 dark:text-slate-200 rounded-tr-none" : "bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-slate-805 dark:text-slate-200 rounded-tl-none"}`}>
                          {chat.text.split("\n").map((line, i) => (
                            <p key={i} className="mb-1 last:mb-0">{line}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                    {isProcessingChat && (
                      <div className="flex justify-start">
                        <div className="bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/10 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-400 animate-pulse">
                          Querying OSTM reasoning network...
                        </div>
                      </div>
                    )}
                    <div ref={chatBottomRef} />
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <input
                      type="text"
                      value={customQuery}
                      onChange={(e) => setCustomQuery(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleAskAICopilot(); }}
                      placeholder="Ask: 'Explain remedy selection' or 'Show risk variables'..."
                      className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={handleAskAICopilot}
                      className="px-3.5 bg-emerald-600 hover:opacity-90 text-white rounded-xl text-xs font-bold border-none cursor-pointer"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* LAYER 5 & 6: Disease Forecast Engine & Therapeutic ranked recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Forecast Projections Engine (6 cols) */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                📈 Disease Forecast Engine™ (Projections)
              </h3>
              
              <div className="w-full relative h-[130px]">
                <canvas ref={forecastCanvasRef} />
              </div>

              {/* Modifiable Risk Drivers */}
              <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Forecast prognosis drivers:</span>
                {activeDataKey === "aarav" ? (
                  <>
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                      <span>Low Sodium compliance</span>
                      <span className="text-emerald-500 font-mono font-bold">+24% Expected Renal Benefit</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                      <span>Tight glycemic control (HbA1c &lt; 7.0)</span>
                      <span className="text-emerald-500 font-mono font-bold">+18% eGFR Stabilization</span>
                    </div>
                  </>
                ) : activeDataKey === "priya" ? (
                  <>
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                      <span>Metabolic weight reduction</span>
                      <span className="text-emerald-500 font-mono font-bold">+18% Endocrine Cycle Efficacy</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                      <span>Stress regulation & sleep normalization</span>
                      <span className="text-emerald-500 font-mono font-bold">+12% TSH Stabilization</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                      <span>Thermal protection wraps</span>
                      <span className="text-emerald-500 font-mono font-bold">+15% Joint Stiffness Relief</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                      <span>Continuous mobility exercises</span>
                      <span className="text-emerald-500 font-mono font-bold">+12% Joint Mobility Efficacy</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Therapeutic Intelligence Efficacy Ranking (6 cols) */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                🍃 Therapeutic Intelligence™ (Impact Ranked)
              </h3>
              
              <div className="space-y-3 overflow-y-auto max-h-[200px]">
                {activeDataKey === "aarav" ? (
                  <>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-805 rounded-2xl text-xs space-y-1">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-slate-800 dark:text-slate-200">1. Reduce Dietary Sodium Intake</span>
                        <span className="text-emerald-500 font-mono font-bold">+24% Renal Benefit</span>
                      </div>
                      <p className="text-[10px] text-slate-450 leading-relaxed">Reduces fluid loading in glomerular capillaries and ankles. Grade A clinical guideline.</p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-805 rounded-2xl text-xs space-y-1">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-slate-800 dark:text-slate-200">2. Lycopodium Clavatum 200C Follow-up</span>
                        <span className="text-emerald-500 font-mono font-bold">+18% Efficacy</span>
                      </div>
                      <p className="text-[10px] text-slate-450 leading-relaxed">Constitutional remedy matches flatulence aggravation, right-sided affinity. 128 papers cited.</p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-805 rounded-2xl text-xs space-y-1">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-slate-800 dark:text-slate-200">3. Improve Sleep Quality</span>
                        <span className="text-emerald-500 font-mono font-bold">+12% Improvement</span>
                      </div>
                      <p className="text-[10px] text-slate-450 leading-relaxed">Reduces nocturnal blood pressure spikes, decreasing metabolic strain on kidneys.</p>
                    </div>
                  </>
                ) : activeDataKey === "priya" ? (
                  <>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-805 rounded-2xl text-xs space-y-1">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-slate-800 dark:text-slate-200">1. Reduce Weight via Low-GI Diet</span>
                        <span className="text-emerald-500 font-mono font-bold">+18% Endocrine Benefit</span>
                      </div>
                      <p className="text-[10px] text-slate-450 leading-relaxed">Decreases insulin resistance, stabilizing PCOS androgen secretions.</p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-805 rounded-2xl text-xs space-y-1">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-slate-800 dark:text-slate-200">2. Pulsatilla Nigricans 30C Regimen</span>
                        <span className="text-emerald-500 font-mono font-bold">+15% Efficacy</span>
                      </div>
                      <p className="text-[10px] text-slate-450 leading-relaxed">Constitutional matches mild temperament, open air amel, thirstless profile.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-805 rounded-2xl text-xs space-y-1">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-slate-800 dark:text-slate-200">1. Keep Joints Warm & Protect from Drafts</span>
                        <span className="text-emerald-500 font-mono font-bold">+15% Joint Pain Relief</span>
                      </div>
                      <p className="text-[10px] text-slate-450 leading-relaxed">Silicea/Rhus Tox profile shows severe sensitivity to cold damp drafts.</p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-805 rounded-2xl text-xs space-y-1">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-slate-800 dark:text-slate-200">2. Silicea Terra 200C Intercurrent</span>
                        <span className="text-emerald-500 font-mono font-bold">+12% Efficacy</span>
                      </div>
                      <p className="text-[10px] text-slate-450 leading-relaxed">Constitutional support addresses deep auto-immune nodes. Grade B clinical studies.</p>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>

          {/* New modules: Explainable Risk Engine & Outcomes & Memory */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Explainable AI details panel (6 cols) */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  🔮 Explainable Risk Engine™ & Drivers
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Click any risk label to reveal contribution driver factors.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Risk Selector list */}
                <div className="space-y-2.5">
                  {activeRisks.map((risk: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedRiskId(risk.id)}
                      className={`w-full p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${selectedRiskId === risk.id ? "bg-slate-900 dark:bg-slate-955 border-slate-800 text-white shadow-md" : "bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-100"}`}
                    >
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span>{risk.name}</span>
                        <span className={risk.color}>{risk.val}%</span>
                      </div>
                      <div className="w-full bg-slate-250 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${risk.val}%`, backgroundColor: risk.color.includes("rose") ? "#f43f5e" : risk.color.includes("amber") ? "#f59e0b" : "#10b981" }}></div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Contribution drivers */}
                {activeExplainableRisk && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between">
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-1.5 text-[10px] font-bold">
                      <span className="text-slate-800 dark:text-slate-200">Why {activeExplainableRisk.val}% Risk?</span>
                      <span className="text-amber-500 uppercase">Score Drivers</span>
                    </div>

                    <div className="space-y-2.5">
                      {activeDataKey === "aarav" && activeExplainableRisk.id === "ckd" ? (
                        <>
                          <div className="space-y-0.5 text-[10px]">
                            <div className="flex justify-between text-slate-500"><span>eGFR decline slope</span><span className="font-bold text-slate-700 dark:text-slate-300">35% contribution</span></div>
                            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden"><div className="h-full bg-rose-500" style={{ width: "35%" }}></div></div>
                          </div>
                          <div className="space-y-0.5 text-[10px]">
                            <div className="flex justify-between text-slate-500"><span>Microalbuminuria index</span><span className="font-bold text-slate-700 dark:text-slate-300">22% contribution</span></div>
                            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden"><div className="h-full bg-rose-500" style={{ width: "22%" }}></div></div>
                          </div>
                          <div className="space-y-0.5 text-[10px]">
                            <div className="flex justify-between text-slate-500"><span>HbA1c fluctuation slope</span><span className="font-bold text-slate-700 dark:text-slate-300">18% contribution</span></div>
                            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden"><div className="h-full bg-amber-500" style={{ width: "18%" }}></div></div>
                          </div>
                          <div className="space-y-0.5 text-[10px]">
                            <div className="flex justify-between text-slate-500"><span>Age demographic factor</span><span className="font-bold text-slate-700 dark:text-slate-300">12% contribution</span></div>
                            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: "12%" }}></div></div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-0.5 text-[10px]">
                            <div className="flex justify-between text-slate-500"><span>Biomarker load indices</span><span className="font-bold text-slate-700 dark:text-slate-300">45% contribution</span></div>
                            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden"><div className="h-full bg-rose-500" style={{ width: "45%" }}></div></div>
                          </div>
                          <div className="space-y-0.5 text-[10px]">
                            <div className="flex justify-between text-slate-500"><span>Genetic/Constitution affinity</span><span className="font-bold text-slate-700 dark:text-slate-300">25% contribution</span></div>
                            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden"><div className="h-full bg-amber-500" style={{ width: "25%" }}></div></div>
                          </div>
                          <div className="space-y-0.5 text-[10px]">
                            <div className="flex justify-between text-slate-500"><span>Miasmatic chronic load</span><span className="font-bold text-slate-700 dark:text-slate-300">20% contribution</span></div>
                            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden"><div className="h-full bg-amber-500" style={{ width: "20%" }}></div></div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Longitudinal Memory & Outcome stats (6 cols) */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm space-y-4 flex flex-col justify-between">
              
              {/* Longitudinal clinical memory */}
              <div className="space-y-2 font-sans">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  📅 Longitudinal Clinical Memory™
                </span>
                <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-350 italic border-l-2 border-purple-500 pl-3">
                  {activeDataKey === "aarav" 
                    ? "“Over 14 months patient improved vitality from 42% to 68%. HbA1c reduced from 8.9% to 6.9%. CKD progression slowed after introduction of Lycopodium.”"
                    : activeDataKey === "priya"
                      ? "“Over 12 months patient cycle normalized from >60 days to 34 days. TSH declined from 7.8 to 4.8 uIU/mL. Weight reduced 4kg under Pulsatilla + Calcarea Carb intercurrent.”"
                      : "“Over 14 months joint stiffness duration minimized from 3 hours to 30 minutes. CRP inflammation decreased from 18.5 to 8.2 mg/L. Mobilization index improved.”"}
                </p>
              </div>

              {/* Outcome stats and cohort percentile rankings */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Population Cohort percentiles</span>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[8px] uppercase tracking-wide text-slate-400 block">Age Cohort</span>
                    <span className="text-xs font-bold text-sky-500 font-mono">{activeData.cohortPercentiles.ageCohort}th %ile</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[8px] uppercase tracking-wide text-slate-400 block">Remedy vector</span>
                    <span className="text-xs font-bold text-purple-500 font-mono">{activeData.cohortPercentiles.remedyCohort}th %ile</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[8px] uppercase tracking-wide text-slate-400 block">Regional Rank</span>
                    <span className="text-xs font-bold text-emerald-500 font-mono">{activeData.cohortPercentiles.regionalPercentile}th %ile</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Outcome Response curves & System status Matrix (12 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Outcome Response timeline curve (6 cols) */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                📈 Outcome Response Curves (Historical timeline)
              </h3>
              <div className="w-full relative h-[140px]">
                <canvas ref={canvasRef} />
              </div>
            </div>

            {/* Organ systems matrix (6 cols) */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                🛡️ OSTM™ Organ Systems Matrix
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeData.ostmSystems.map((sys, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-350">{sys.name}</span>
                    <span className={`font-bold uppercase ${sys.color}`}>{sys.status}</span>
                  </div>
                ))}
              </div>
            </div>

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

    </div>
  );
}
