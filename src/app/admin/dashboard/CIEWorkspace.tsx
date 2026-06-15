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
  // Dynamic patient key resolver
  const getActiveDataKey = () => {
    if (!selectedPatientId) return "aarav";
    const patientObj = patients.find(p => p.id === selectedPatientId);
    if (!patientObj) return "aarav";
    const nameLower = patientObj.name.toLowerCase();
    if (nameLower.includes("aarav") || nameLower.includes("sharma")) return "aarav";
    if (nameLower.includes("priya") || nameLower.includes("patel")) return "priya";
    if (nameLower.includes("elena") || nameLower.includes("rostova")) return "elena";
    return "aarav";
  };

  const activeDataKey = getActiveDataKey();
  const activeData = PATIENT_LONGITUDINAL_DATA[activeDataKey] || PATIENT_LONGITUDINAL_DATA.aarav;
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
        { id: "f4", timestamp: "09:22", type: "remedy", message: "New opportunity: Sleep", detail: "Optimizing sleep profile to >8hrs drops autonomic renal stress burden by 8%." }
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

    const width = canvas.parentElement?.clientWidth || 400;
    const height = 320;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Initialize nodes with dynamic OSTM clusters
    if (!graphDataRef.current) {
      const initialNodes = [
        // Symptoms
        { id: "sym_renal", label: "Ankle Edema", type: "symptom", x: width * 0.15, y: height * 0.35, vx: 0, vy: 0, radius: 10, description: "Fluid retention in lower limbs due to drop in glomerular filtration." },
        { id: "sym_fatigue", label: "Extreme Fatigue", type: "symptom", x: width * 0.45, y: height * 0.20, vx: 0, vy: 0, radius: 10, description: "Uremic exhaustion marker linked to thyroid and renal clearance lags." },
        { id: "sym_bloat", label: "Flatulence & Bloat", type: "symptom", x: width * 0.35, y: height * 0.70, vx: 0, vy: 0, radius: 10, description: "Digestive dysfunction with gas retention worsening between 4-8 PM." },
        { id: "sym_nocturia", label: "Nocturia Urination", type: "symptom", x: width * 0.18, y: height * 0.55, vx: 0, vy: 0, radius: 10, description: "Frequent nocturnal urination worse 2-5 AM under kidney filtration load." },
        { id: "sym_menses", label: "Irregular Menses", type: "symptom", x: width * 0.70, y: height * 0.65, vx: 0, vy: 0, radius: 10, description: "Oligomenorrhea and endocrine cycle deviations." },
        { id: "sym_stiffness", label: "Joint Stiffness", type: "symptom", x: width * 0.78, y: height * 0.28, vx: 0, vy: 0, radius: 10, description: "Morning joint stiffness lasting >2 hours due to articular congestion." },

        // Organs / Systems
        { id: "org_kidney", label: "Renal Kidneys", type: "organ", x: width * 0.28, y: height * 0.45, vx: 0, vy: 0, radius: 14, description: "Bilateral filtration glomeruli and endocrine erythropoietin loops." },
        { id: "org_thyroid", label: "Endocrine Thyroid", type: "organ", x: width * 0.55, y: height * 0.40, vx: 0, vy: 0, radius: 14, description: "Thyroxin secretions and core system basal metabolic loops." },
        { id: "org_joints", label: "Joint Articular", type: "organ", x: width * 0.72, y: height * 0.45, vx: 0, vy: 0, radius: 14, description: "Articular cartilages, synovial capsules, and inflammatory response cells." },

        // Remedies
        { id: "rem_lyc", label: "Lycopodium Clavatum", type: "remedy", x: width * 0.33, y: height * 0.82, vx: 0, vy: 0, radius: 11, description: "Constitutional remedy targeting right-sided affinity and renal/gut congestion." },
        { id: "rem_apis", label: "Apis Mellifica", type: "remedy", x: width * 0.08, y: height * 0.45, vx: 0, vy: 0, radius: 11, description: "Symptomatic support for puffy tissues, water retention, and thirstless state." },
        { id: "rem_anguillae", label: "Serum Anguillae", type: "remedy", x: width * 0.12, y: height * 0.72, vx: 0, vy: 0, radius: 11, description: "Organotherapy support specifically targeted to renal glomerular integrity." },
        { id: "rem_puls", label: "Pulsatilla", type: "remedy", x: width * 0.58, y: height * 0.80, vx: 0, vy: 0, radius: 11, description: "Mild, yielding temperament match, thirstless, improved in cool open air." },
        { id: "rem_thyroid", label: "Thyroidinum", type: "remedy", x: width * 0.45, y: height * 0.88, vx: 0, vy: 0, radius: 11, description: "Intercurrent glandular support for sluggish metabolic conversions." },
        { id: "rem_sil", label: "Silicea Terra", type: "remedy", x: width * 0.88, y: height * 0.60, vx: 0, vy: 0, radius: 11, description: "Cold chilly profile, deep-acting remedy for nodes, scars, and bone affinity." },

        // Miasms
        { id: "mias_psora", label: "Psora Miasm", type: "miasm", x: width * 0.50, y: height * 0.60, vx: 0, vy: 0, radius: 12, description: "Initial functional defense deficiency, skin eruptions, and fatigue." },
        { id: "mias_sycosis", label: "Sycosis Miasm", type: "miasm", x: width * 0.22, y: height * 0.80, vx: 0, vy: 0, radius: 12, description: "Hyper-proliferation, fluid load, chronic structural overgrowth." },
        { id: "mias_syphilis", label: "Syphilis Miasm", type: "miasm", x: width * 0.88, y: height * 0.80, vx: 0, vy: 0, radius: 12, description: "Destruction, ulceration, tissue degeneration, and structural collapse." },

        // Labs
        { id: "lab_creatinine", label: "Serum Creatinine", type: "lab", x: width * 0.40, y: height * 0.10, vx: 0, vy: 0, radius: 9, description: "Nitrogenous waste index indicating nephron clearance velocity." },
        { id: "lab_egfr", label: "eGFR Filtration", type: "lab", x: width * 0.25, y: height * 0.15, vx: 0, vy: 0, radius: 9, description: "Glomerular filtration rate calculated from serum creatinine and demographics." }
      ];

      const initialLinks = [
        { source: "sym_renal", target: "org_kidney", strength: 3 },
        { source: "sym_nocturia", target: "org_kidney", strength: 2 },
        { source: "sym_bloat", target: "org_kidney", strength: 1.5 },
        { source: "sym_fatigue", target: "org_thyroid", strength: 2.5 },
        { source: "sym_menses", target: "org_thyroid", strength: 2 },
        { source: "sym_stiffness", target: "org_joints", strength: 3 },
        { source: "org_kidney", target: "rem_apis", strength: 3.5 },
        { source: "org_kidney", target: "rem_anguillae", strength: 4 },
        { source: "org_kidney", target: "rem_lyc", strength: 2 },
        { source: "org_thyroid", target: "rem_puls", strength: 3 },
        { source: "org_thyroid", target: "rem_thyroid", strength: 3.5 },
        { source: "org_joints", target: "rem_sil", strength: 2 },
        { source: "rem_lyc", target: "mias_sycosis", strength: 2.5 },
        { source: "rem_apis", target: "mias_sycosis", strength: 2 },
        { source: "rem_anguillae", target: "mias_sycosis", strength: 2.5 },
        { source: "rem_puls", target: "mias_psora", strength: 3 },
        { source: "rem_thyroid", target: "mias_psora", strength: 2 },
        { source: "rem_sil", target: "mias_syphilis", strength: 4.5 },
        { source: "lab_creatinine", target: "org_kidney", strength: 3 },
        { source: "lab_egfr", target: "org_kidney", strength: 4 }
      ];

      graphDataRef.current = { nodes: initialNodes, links: initialLinks };
    }

    const { nodes, links } = graphDataRef.current;
    let animationFrameId: number;
    const isDark = theme === "dark";

    const drawGraph = () => {
      ctx.clearRect(0, 0, width, height);

      // Apply zoom & pan transformations
      ctx.save();
      ctx.translate(graphPan.x, graphPan.y);
      ctx.scale(graphScale, graphScale);

      // Links drawing
      links.forEach(link => {
        const s = nodes.find(n => n.id === link.source);
        const t = nodes.find(n => n.id === link.target);
        if (!s || !t) return;

        // Relationship strength calculation
        const isHighlighted = selectedNodeId === s.id || selectedNodeId === t.id;
        const searchMatch = nodeSearchQuery && (
          s.label.toLowerCase().includes(nodeSearchQuery.toLowerCase()) || 
          t.label.toLowerCase().includes(nodeSearchQuery.toLowerCase())
        );

        ctx.strokeStyle = isHighlighted || searchMatch
          ? "rgba(16, 185, 129, 0.6)"
          : isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.08)";
        ctx.lineWidth = isHighlighted ? (link.strength || 2) * 1.2 : (link.strength || 1) * 0.7;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);
        ctx.stroke();
      });

      // Nodes drawing
      nodes.forEach(node => {
        let color = "#38bdf8"; // default sky-400
        if (node.type === "symptom") color = "#f43f5e"; // rose-500
        else if (node.type === "organ") color = "#3b82f6"; // blue-500
        else if (node.type === "remedy") color = "#c084fc"; // purple-400
        else if (node.type === "miasm") color = "#fbbf24"; // amber-400
        else if (node.type === "lab") color = "#14b8a6"; // teal-500

        const isSelected = selectedNodeId === node.id;
        const isSearched = nodeSearchQuery && node.label.toLowerCase().includes(nodeSearchQuery.toLowerCase());

        // Draw pulsing search ring
        if (isSearched) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 7 + Math.sin(Date.now() / 150) * 2, 0, 2 * Math.PI);
          ctx.strokeStyle = "rgba(16, 185, 129, 0.5)";
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

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + (isSelected ? 4 : isAdjacent ? 2 : 0), 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();

        ctx.strokeStyle = isSelected 
          ? "#10b981" 
          : isAdjacent 
            ? "rgba(16, 185, 129, 0.6)" 
            : isDark ? "#0f172a" : "#ffffff";
        ctx.lineWidth = isSelected ? 3.0 : isAdjacent ? 2.0 : 1.5;
        ctx.stroke();

        ctx.fillStyle = isSelected 
          ? "#10b981" 
          : isSearched 
            ? "#10b981" 
            : isDark ? "#cbd5e1" : "#1e293b";
        ctx.font = isSelected ? "bold 9px sans-serif" : "7.5px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(node.label, node.x, node.y + node.radius + 10);
      });

      ctx.restore();
    };

    // Physics Engine spring-mass calculation loop
    const animate = () => {
      const kRepulsion = 120;
      const kAttraction = 0.005;
      const kGravity = 0.003;
      const damping = 0.85;

      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Repulsion between all node pairs
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 120) {
            const force = (kRepulsion / (dist * dist)) * 40;
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
        const targetLen = 70; // Rest spring length
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

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [activeTab, theme, selectedNodeId, graphScale, graphPan, nodeSearchQuery]);

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
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* ==================== LEFT/CENTER COLUMN: COCKPIT WORKSPACE (8 COLS) ==================== */}
          <div className="xl:col-span-8 space-y-6">
            
            {/* 1. CLINICAL COMMAND CENTER REDESIGN (PRIORITY 10) */}
            <div className="bg-slate-900 dark:bg-slate-950 border border-slate-800 rounded-[28px] p-6 shadow-xl text-white">
              <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Mission Control Panel */}
                <div className="flex-1 lg:flex-[2] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                      <h2 className="text-xl font-bold font-serif tracking-wide">{activeData.name}</h2>
                      <span className="text-[10px] text-slate-400 px-2 py-0.5 bg-slate-850 rounded-lg border border-slate-800 font-mono">
                        Twin ID: {activeDataKey === "aarav" ? "HIOS-TW-001" : activeDataKey === "priya" ? "HIOS-TW-002" : "HIOS-TW-003"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">Stability Index:</span>
                      <span className="text-sm font-mono font-bold text-emerald-400">
                        {activeTwinMode === "simulator" && simulatedResults ? simulatedResults.vitality - 5 : activeData.vitalityIndex - 10}%
                      </span>
                    </div>
                  </div>

                  {/* Vitals Telemetry Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl flex flex-col gap-0.5">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400">Blood Pressure</span>
                      <span className="text-xs font-bold text-emerald-400 font-mono">
                        {activeTwinMode === "simulator" ? `${Math.round(simSliders.bloodPressure)}/82` : activeDataKey === "aarav" ? "135/85" : activeDataKey === "priya" ? "115/75" : "125/80"} mmHg
                      </span>
                    </div>
                    <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl flex flex-col gap-0.5">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400">Heart Rate</span>
                      <span className="text-xs font-bold text-emerald-400 font-mono">68 BPM</span>
                    </div>
                    <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl flex flex-col gap-0.5">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400">Core Temp</span>
                      <span className="text-xs font-bold text-emerald-400 font-mono">98.4 °F</span>
                    </div>
                    <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl flex flex-col gap-0.5">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400">Resp Rate</span>
                      <span className="text-xs font-bold text-emerald-400 font-mono">16 / min</span>
                    </div>
                  </div>

                  {/* Primary Risks list */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {activeRisks.map((risk: any, i: number) => {
                      let confidenceLevel = "High";
                      let badgeColor = "bg-emerald-950/40 text-emerald-400 border border-emerald-900";
                      
                      if (risk.val > 75) {
                        confidenceLevel = "Uncertain";
                        badgeColor = "bg-rose-950/40 text-rose-400 border border-rose-900";
                      } else if (risk.val > 50) {
                        confidenceLevel = "Moderate";
                        badgeColor = "bg-amber-950/40 text-amber-400 border border-amber-900";
                      }
                      
                      return (
                        <div key={i} className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-1.5">
                          <div className="flex justify-between items-center text-[9px] uppercase tracking-wider text-slate-400">
                            <span>{risk.name}</span>
                            <span className="font-bold text-slate-300">{risk.val}%</span>
                          </div>
                          <div className="flex justify-between items-center text-[8.5px]">
                            <span className={`px-1.5 py-0.2 rounded text-[8px] font-mono ${badgeColor}`}>{risk.level}</span>
                            <span className="text-slate-500 font-mono">Cert. {confidenceLevel}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs border-t border-slate-800 pt-3">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 block mb-0.5">Top Opportunities</span>
                      <span className="font-bold text-emerald-400">
                        {activeDataKey === "aarav" ? "✓ Salt Restriction (+12% renal benefit)" : activeDataKey === "priya" ? "✓ Exercise Conditioning (+15% endocrine)" : "✓ Thermal Warmth Support (+18% pain control)"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 block mb-0.5">Next Best Action</span>
                      <span className="font-bold text-sky-400">
                        {activeDataKey === "aarav" ? "→ Assess Apis 30C response in 7 days" : activeDataKey === "priya" ? "→ Review TSH lab panel next week" : "→ Warm dry room compliance check"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Summary and Twin status */}
                <div className="flex-1 bg-gradient-to-r from-emerald-950/10 to-teal-950/10 border border-emerald-900/30 rounded-2xl p-4 flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 border-b border-emerald-900/30 pb-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">OSTM™ Copilot Insights</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-300 font-sans mt-2">
                      {activeDataKey === "aarav" 
                        ? "Patient displays progressive nephron stress. Sliders suggest BP control < 120 and salt reduction significantly slow creatinine rise vectors. Apis + Serum Anguillae synergy is optimized at 88% confidence."
                        : activeDataKey === "priya"
                          ? "TSH and LH/FSH ratio show functional thyroid response. Regular physical activity (slider > 4 days) reduces cardiovascular stroke forecast score by 14%."
                          : "Rheumatoid joint stiffness flare-up matches winter damp aggravation (Psora/Syphilitic overlap). Restoring thermal comfort decreases morning stiffness below 30 mins."}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[9px] border-t border-emerald-900/20 pt-2 text-slate-400 font-mono">
                    <span>Twin Status: ACTIVE</span>
                    <span>Confidence: {activeTwinMode === "simulator" && simulatedResults ? simulatedResults.confidence : 92}%</span>
                  </div>
                </div>

              </div>
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
              
              {/* OSTM graph viewer canvas (7 cols) */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div>
                    <h3 className="font-serif text-sm font-bold flex items-center gap-2">
                      <Network className="w-4 h-4 text-purple-500" /> OSTM Knowledge Graph™
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Force-directed map. Drag nodes, scroll to zoom, search below.</p>
                  </div>
                  
                  {/* Zoom controls */}
                  <div className="flex gap-1.5">
                    <button 
                      onClick={() => setGraphScale(prev => Math.min(2.0, prev + 0.1))}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-850 rounded-lg text-xs font-bold border-none cursor-pointer"
                    >
                      ＋
                    </button>
                    <button 
                      onClick={() => setGraphScale(prev => Math.max(0.5, prev - 0.1))}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-850 rounded-lg text-xs font-bold border-none cursor-pointer"
                    >
                      －
                    </button>
                    <button 
                      onClick={() => { setGraphScale(1); setGraphPan({ x: 0, y: 0 }); }}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-850 rounded-lg text-xs font-bold border-none cursor-pointer"
                    >
                      ⟲
                    </button>
                  </div>
                </div>

                {/* Graph Search */}
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Search OSTM Node (e.g. Kidney, Lycopodium, Edema)..."
                    value={nodeSearchQuery}
                    onChange={(e) => setNodeSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none"
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

                <div className="w-full h-[320px] bg-slate-50 dark:bg-slate-955/30 rounded-2xl relative border border-slate-100 dark:border-slate-850/50 cursor-grab active:cursor-grabbing">
                  <canvas ref={graphCanvasRef} className="w-full h-full block" />
                </div>
              </div>

              {/* Inspector card (5 cols) */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm flex flex-col justify-between gap-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h3 className="font-serif text-sm font-bold flex items-center gap-2">
                    <Compass className="w-4 h-4 text-emerald-500" /> OSTM Node Inspector™
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Click nodes in OSTM Graph to inspect organ mappings, rubrics, and response histories.</p>
                </div>

                {selectedNodeInfo ? (
                  <div className="flex-1 flex flex-col justify-between gap-4 animate-fadeIn">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-2">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">{selectedNodeInfo.type}</span>
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{selectedNodeInfo.title}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${selectedNodeInfo.evidenceRating.includes("Grade A") ? "bg-emerald-950/40 text-emerald-400" : "bg-sky-950/40 text-sky-400"}`}>
                          {selectedNodeInfo.evidenceRating}
                        </span>
                      </div>
                      
                      <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                        {selectedNodeInfo.description}
                      </p>

                      <div className="space-y-2">
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Dynamic Relationships & Strengths</span>
                        <div className="grid grid-cols-1 gap-1.5">
                          {selectedNodeInfo.connectedElements.map((fact: string, idx: number) => (
                            <div key={idx} className="p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-800/50 text-[10px] flex justify-between items-center">
                              <span className="text-slate-650 dark:text-slate-400 font-medium">❖ {fact}</span>
                              <span className="text-emerald-500 font-bold font-mono">Strong (Strength: 3.5)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-1 text-[10.5px]">
                      <div className="flex justify-between font-bold">
                        <span>Efficacy Success Index:</span>
                        <span className="text-emerald-500 font-mono">88% (High)</span>
                      </div>
                      <div className="flex justify-between text-slate-400 text-[9px]">
                        <span>Materia Medica support:</span>
                        <span>Level A (Clinical guidelines)</span>
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
                        <div className="flex justify-between font-bold text-slate-650 dark:text-slate-350">
                          <span>Clinical Confidence:</span>
                          <span className="text-emerald-500 font-mono">88% (High)</span>
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

            {/* 8. COHORTS POPULATION INTELLIGENCE GRID (PRIORITY 8) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-6 shadow-sm space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="font-serif text-sm font-bold flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-500" /> Population Intelligence™
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Patient outcome benchmarks mapped against similar demographics and remedy cohorts.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Benchmarking stats */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-3 text-xs">
                  <span className="font-bold text-[10px] uppercase text-slate-400">Cohort Percentiles</span>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-450">Same Age Cohort:</span>
                      <span className="font-bold text-emerald-500">{activeData.cohortPercentiles.ageCohort}th percentile</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-450">Remedy Responder Cohort:</span>
                      <span className="font-bold text-emerald-500">{activeData.cohortPercentiles.remedyCohort}th percentile</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-450">Regional Stability Index:</span>
                      <span className="font-bold text-emerald-500">{activeData.cohortPercentiles.regionalPercentile}th percentile</span>
                    </div>
                  </div>
                </div>

                {/* Responder distribution */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-3 text-xs">
                  <span className="font-bold text-[10px] uppercase text-slate-400">Remedy Responder Spread</span>
                  <div className="grid grid-cols-3 gap-2 text-center text-[10.5px]">
                    <div className="p-2 bg-emerald-500/10 dark:bg-emerald-950/20 text-emerald-500 rounded-xl">
                      <div className="font-mono font-bold">68%</div>
                      <div className="text-[8px] mt-0.5">Top</div>
                    </div>
                    <div className="p-2 bg-amber-500/10 dark:bg-amber-950/20 text-amber-500 rounded-xl">
                      <div className="font-mono font-bold">24%</div>
                      <div className="text-[8px] mt-0.5">Average</div>
                    </div>
                    <div className="p-2 bg-rose-500/10 dark:bg-rose-950/20 text-rose-500 rounded-xl">
                      <div className="font-mono font-bold">8%</div>
                      <div className="text-[8px] mt-0.5">Poor</div>
                    </div>
                  </div>
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
          
          {/* ==================== RIGHT COLUMN: PERSISTENT LIVE FEED PANEL (4 COLS) (PRIORITY 1) ==================== */}
          <div className="xl:col-span-4 bg-slate-900/90 dark:bg-slate-950/90 border border-slate-800 rounded-[28px] p-5 shadow-xl text-white backdrop-blur-md xl:sticky xl:top-6 select-none max-h-[85vh] flex flex-col gap-4">
            
            {/* Header with status light */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider font-mono">Live Intelligence Feed™</span>
              </div>
              
              <span className="px-2 py-0.5 rounded text-[8px] bg-emerald-950/40 text-emerald-400 border border-emerald-900 font-mono">
                Streaming Live
              </span>
            </div>

            {/* Filter tags */}
            <div className="flex flex-wrap gap-1 border-b border-slate-800 pb-3">
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
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
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
                                e.stopPropagation(); // prevent card selection expansion
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
              <div className="p-3.5 bg-slate-950 border border-emerald-900/50 rounded-2xl space-y-3 relative animate-fadeIn">
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

        </div>
      )}      {/* ==================== VIEW 2: AI INTAKE PARSER ==================== */}
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
