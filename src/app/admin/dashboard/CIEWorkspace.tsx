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

// Visit history data dictionary for the simulated Digital Twin
const PATIENT_LONGITUDINAL_DATA: Record<string, {
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
  remedyMatches: Array<{ name: string; score: number; status: string }>;
  predictiveRisks: Array<{ name: string; level: string; val: number; color: string; driver: string; modifiable: string }>;
  ostmSystems: Array<{ name: string; status: string; color: string }>;
}> = {
  // Default values used if a selected patient is not found in local seed list
  default: {
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
      { name: "Sulphur", score: 85, status: "Active Constitutional" },
      { name: "Nux Vomica", score: 72, status: "Active Acute Support" }
    ],
    predictiveRisks: [
      { name: "Metabolic Syndrome", level: "Low Risk", val: 32, color: "text-emerald-500", driver: "Glycemic stability", modifiable: "Regular exercises" }
    ],
    ostmSystems: [
      { name: "Pancreatic Endocrine", status: "Compensated", color: "text-emerald-500" }
    ]
  },
  // Specific patients seeded
  aarav: {
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
      { name: "Lycopodium Clavatum", score: 88, status: "Active Constitutional" },
      { name: "Serum Anguillae", score: 85, status: "Active Organ Support" },
      { name: "Apis Mellifica", score: 80, status: "Active Symptomatic" }
    ],
    predictiveRisks: [
      { name: "CKD Progression", level: "High Risk", val: 82, color: "text-rose-500", driver: "eGFR slope decline & microalbuminuria", modifiable: "Dietary sodium & blood sugar management" },
      { name: "Diabetic Neuropathy", level: "Moderate Risk", val: 55, color: "text-amber-500", driver: "Long-standing glycemic fluctuation", modifiable: "HbA1c tight control & exercise" },
      { name: "Cardiovascular Stroke", level: "Moderate Risk", val: 48, color: "text-amber-500", driver: "Sedentary job & hypertensive spikes", modifiable: "Weight reduction & aerobic conditioning" }
    ],
    ostmSystems: [
      { name: "Renal Filtration (Kidneys)", status: "Compensated Degraded", color: "text-amber-500" },
      { name: "Pancreatic Endocrine (Insulin)", status: "Active Stabilized", color: "text-emerald-500" },
      { name: "Digestive Absorption (Gut)", status: "Active Congested", color: "text-amber-500" }
    ]
  },
  priya: {
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
      { name: "Pulsatilla Nigricans", score: 92, status: "Active Constitutional" },
      { name: "Thyroidinum", score: 86, status: "Active Organ Support" },
      { name: "Calcarea Carbonica", score: 82, status: "Active Intercurrent" }
    ],
    predictiveRisks: [
      { name: "Type 2 Diabetes Risk", level: "Moderate Risk", val: 58, color: "text-amber-500", driver: "LH/FSH insulin link & weight gain", modifiable: "Low GI diet, physical conditioning" },
      { name: "Hypothyroidism Severity", level: "Moderate Risk", val: 52, color: "text-amber-500", driver: "TSH rising pattern to 7.8", modifiable: "Thyroidinum support, stress regulation" },
      { name: "Metabolic Syndrome", level: "Low Risk", val: 35, color: "text-emerald-500", driver: "Hypercholesterolemia (240 max)", modifiable: "Regular exercise & lipid detox" }
    ],
    ostmSystems: [
      { name: "Thyroid Gland (T3/T4)", status: "De-compensated Subclinical", color: "text-rose-500" },
      { name: "Ovarian Gland (Cycle rhythm)", status: "Compensated Improving", color: "text-emerald-500" }
    ]
  }
};

export default function CIEWorkspace({ patients, selectedPatientId, setSelectedPatientId, theme }: CIEWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"twin" | "diagnostics" | "graph" | "intake">("twin");
  const [twinIndex, setTwinIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timelineZoom, setTimelineZoom] = useState(365); // 1 year default
  const [customQuery, setCustomQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "doctor" | "ai"; text: string }>>([
    { sender: "ai", text: "Hello Clinician. I am the OSTM™ Clinical Copilot. Ask me anything about this patient twin's remedies, miasms, or longitudinal risks." }
  ]);
  const [isProcessingChat, setIsProcessingChat] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(true);
  const [reportType, setReportType] = useState<string | null>(null);
  const [reportContent, setReportContent] = useState<string>("");
  const [rawIntakeNotes, setRawIntakeNotes] = useState("");
  const [parsedIntakeOutput, setParsedIntakeOutput] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Map database patient ID to our pre-seeded data
  const getActiveDataKey = () => {
    if (!selectedPatientId) return "aarav";
    const patientObj = patients.find(p => p.id === selectedPatientId);
    if (!patientObj) return "aarav";
    const nameLower = patientObj.name.toLowerCase();
    if (nameLower.includes("aarav") || nameLower.includes("sharma")) return "aarav";
    if (nameLower.includes("priya") || nameLower.includes("patel")) return "priya";
    return "default";
  };

  const activeDataKey = getActiveDataKey();
  const activeData = PATIENT_LONGITUDINAL_DATA[activeDataKey] || PATIENT_LONGITUDINAL_DATA.default;

  // Auto scroll chat
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  // Handle timeline playback
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

  // Sync timeline when switching patient
  useEffect(() => {
    setTwinIndex(activeData.history.length - 1);
    setIsPlaying(false);
    setReportType(null);
  }, [selectedPatientId, activeData]);

  // Draw Outcome curves on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.parentElement?.clientWidth || 400;
    const height = 150;
    
    // Support retina displays
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

    const padding = { top: 15, right: 20, bottom: 25, left: 35 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Draw horizontal grid lines
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
      ctx.fillText(`${100 - 25 * i}%`, padding.left - 6, y + 3);
    }

    const timeline = activeData.labs.timeline;
    if (!timeline || timeline.length === 0) return;

    const stepX = chartW / Math.max(1, timeline.length - 1);
    
    // Draw vertical grids
    timeline.forEach((date, i) => {
      const x = padding.left + i * stepX;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();

      ctx.fillStyle = textColor;
      ctx.font = "8px monospace";
      ctx.textAlign = "center";
      ctx.fillText(date.substring(5), x, height - padding.bottom + 12);
    });

    // Draw lines
    let datasets: Array<{ name: string; values: number[]; color: string }> = [];
    if (activeDataKey === "aarav") {
      datasets = [
        { name: "eGFR (Filtration)", values: activeData.labs.egfr, color: "#0ea5e9" },
        { name: "HbA1c (x10)", values: activeData.labs.hba1c.map(v => v * 10), color: "#8b5cf6" }
      ];
    } else {
      datasets = [
        { name: "TSH (x10)", values: activeData.labs.tsh.map(v => v * 10), color: "#8b5cf6" },
        { name: "Weight (kg)", values: activeData.labs.weight_kg, color: "#0ea5e9" }
      ];
    }

    datasets.forEach(ds => {
      const min = Math.min(...ds.values);
      const max = Math.max(...ds.values);
      const range = max - min || 1;

      ctx.beginPath();
      ctx.strokeStyle = ds.color;
      ctx.lineWidth = 2;

      ds.values.forEach((v, i) => {
        const x = padding.left + i * stepX;
        const norm = (v - min) / range;
        const y = padding.top + chartH - norm * chartH;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Dots
      ds.values.forEach((v, i) => {
        const x = padding.left + i * stepX;
        const norm = (v - min) / range;
        const y = padding.top + chartH - norm * chartH;

        ctx.beginPath();
        ctx.fillStyle = ds.color;
        const isCurrent = i === twinIndex;
        ctx.arc(x, y, isCurrent ? 5 : 3.5, 0, 2 * Math.PI);
        ctx.fill();

        if (isCurrent) {
          ctx.strokeStyle = ds.color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, 2 * Math.PI);
          ctx.stroke();
          
          ctx.fillStyle = isDark ? "#ffffff" : "#0f172a";
          ctx.font = "bold 8px monospace";
          ctx.textAlign = "center";
          ctx.fillText(v.toFixed(1), x, y - 8);
        }
      });
    });
  }, [twinIndex, activeData, theme, activeDataKey]);

  // Render OSTM Knowledge Graph Physics engine
  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas || activeTab !== "graph") return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.parentElement?.clientWidth || 400;
    const height = 300;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Static coordinates physics simulation coordinates
    const nodes = [
      { id: "sym_renal", label: "Edema / Ankle Swelling", type: "symptom", x: width * 0.15, y: height * 0.35, radius: 14 },
      { id: "sym_fatigue", label: "Lethargy / Fatigue", type: "symptom", x: width * 0.45, y: height * 0.25, radius: 14 },
      { id: "sym_bloat", label: "Bloating / Flatulence", type: "symptom", x: width * 0.35, y: height * 0.75, radius: 14 },
      { id: "sym_nocturia", label: "Nocturnal Urination", type: "symptom", x: width * 0.18, y: height * 0.60, radius: 14 },
      { id: "sym_menses", label: "Irregular Cycles", type: "symptom", x: width * 0.70, y: height * 0.65, radius: 14 },
      { id: "sym_stiffness", label: "Joint Stiffness", type: "symptom", x: width * 0.78, y: height * 0.30, radius: 14 },
      
      { id: "org_kidney", label: "Renal System", type: "organ", x: width * 0.28, y: height * 0.48, radius: 20 },
      { id: "org_thyroid", label: "Thyroid / Endocrine", type: "organ", x: width * 0.55, y: height * 0.45, radius: 20 },
      { id: "org_joints", label: "Joints / Bones", type: "organ", x: width * 0.75, y: height * 0.48, radius: 20 },
      { id: "org_gut", label: "Digestive System", type: "organ", x: width * 0.38, y: height * 0.55, radius: 20 },
      
      { id: "rem_lyc", label: "Lycopodium", type: "remedy", x: width * 0.33, y: height * 0.85, radius: 12 },
      { id: "rem_apis", label: "Apis Mellifica", type: "remedy", x: width * 0.08, y: height * 0.45, radius: 12 },
      { id: "rem_anguillae", label: "Serum Anguillae", type: "remedy", x: width * 0.12, y: height * 0.75, radius: 12 },
      { id: "rem_puls", label: "Pulsatilla", type: "remedy", x: width * 0.58, y: height * 0.82, radius: 12 },
      { id: "rem_thyroid", label: "Thyroidinum", type: "remedy", x: width * 0.45, y: height * 0.90, radius: 12 },
      { id: "rem_sil", label: "Silicea", type: "remedy", x: width * 0.88, y: height * 0.65, radius: 12 },
      { id: "rem_rhus", label: "Rhus Tox", type: "remedy", x: width * 0.85, y: height * 0.40, radius: 12 },

      { id: "mias_psora", label: "Psora Miasm", type: "miasm", x: width * 0.50, y: height * 0.65, radius: 16 },
      { id: "mias_sycosis", label: "Sycosis Miasm", type: "miasm", x: width * 0.22, y: height * 0.80, radius: 16 },
      { id: "mias_syphilis", label: "Syphilis Miasm", type: "miasm", x: width * 0.90, y: height * 0.85, radius: 16 }
    ];

    const links = [
      { source: "sym_renal", target: "org_kidney" },
      { source: "sym_nocturia", target: "org_kidney" },
      { source: "sym_bloat", target: "org_gut" },
      { source: "sym_fatigue", target: "org_thyroid" },
      { source: "sym_menses", target: "org_thyroid" },
      { source: "sym_stiffness", target: "org_joints" },
      { source: "org_kidney", target: "rem_apis" },
      { source: "org_kidney", target: "rem_anguillae" },
      { source: "org_kidney", target: "rem_lyc" },
      { source: "org_gut", target: "rem_lyc" },
      { source: "org_thyroid", target: "rem_puls" },
      { source: "org_thyroid", target: "rem_thyroid" },
      { source: "org_joints", target: "rem_sil" },
      { source: "org_joints", target: "rem_rhus" },
      { source: "rem_lyc", target: "mias_sycosis" },
      { source: "rem_apis", target: "mias_sycosis" },
      { source: "rem_anguillae", target: "mias_sycosis" },
      { source: "rem_puls", target: "mias_psora" },
      { source: "rem_thyroid", target: "mias_psora" },
      { source: "rem_sil", target: "mias_syphilis" },
      { source: "rem_rhus", target: "mias_psora" }
    ];

    let animationFrameId: number;
    const isDark = theme === "dark";

    const drawGraph = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw Links
      ctx.lineWidth = 1;
      links.forEach(link => {
        const s = nodes.find(n => n.id === link.source);
        const t = nodes.find(n => n.id === link.target);
        if (!s || !t) return;

        ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.08)";
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);
        ctx.stroke();
      });

      // Draw Nodes
      nodes.forEach(node => {
        let color = "#0ea5e9";
        if (node.type === "symptom") color = "#f43f5e";
        else if (node.type === "organ") color = "#0ea5e9";
        else if (node.type === "remedy") color = "#a855f7";
        else if (node.type === "miasm") color = "#eab308";

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();

        ctx.strokeStyle = isDark ? "#0f172a" : "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = isDark ? "#cbd5e1" : "#1e293b";
        ctx.font = "8px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(node.label, node.x, node.y + node.radius + 10);
      });
    };

    drawGraph();

    // Minor physics drift
    let t = 0;
    const animate = () => {
      t += 0.01;
      nodes.forEach((node, idx) => {
        if (node.type === "symptom" || node.type === "remedy") {
          node.y += Math.sin(t + idx) * 0.1;
          node.x += Math.cos(t + idx) * 0.1;
        }
      });
      drawGraph();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeTab, theme]);

  // Handle Ask AI submit
  const handleAskAICopilot = async () => {
    if (!customQuery.trim()) return;
    const text = customQuery.trim();
    setCustomQuery("");

    setChatHistory(prev => [...prev, { sender: "doctor", text }]);
    setIsProcessingChat(true);

    // Dynamic responses matching patient state
    setTimeout(() => {
      let responseText = "";
      const q = text.toLowerCase();
      if (q.includes("remedy") || q.includes("homeopath")) {
        responseText = `Based on OSTM™ mapping for ${activeDataKey === "aarav" ? "Aarav Sharma" : "Priya Patel"}, the active remedies are:\n\n1. **${activeDataKey === "aarav" ? "Lycopodium Clavatum" : "Pulsatilla Nigricans"}** (Constitutional remedy targeting the root system).\n2. **${activeDataKey === "aarav" ? "Serum Anguillae & Apis" : "Thyroidinum 3X"}** (Organ-system specific support).\n\nMiasmatic profiling recommends addressing the dominant **${activeData.miasm.split(' ')[0]}** layer to avoid chronic structural progression.`;
      } else if (q.includes("risk") || q.includes("predict")) {
        responseText = `CIE™ Predictive Models indicate a **${activeDataKey === "aarav" ? "High Risk (82%)" : "Moderate Risk (58%)"}** score for further progression of target systems.\n\n* **Primary Driver:** ${activeData.predictiveRisks[0].driver}.\n* **Modifiable Factors:** ${activeData.predictiveRisks[0].modifiable}.\n\nRenal filtration slope is predicted to remain stable if Metformin and Apis protocols are maintained under strict diet tracking.`;
      } else {
        responseText = `The Clinical Intelligence Engine has analyzed the query: "${text}".\n\nPatient Vitality is current at ${activeData.vitalityIndex}%, with a Chronic Disease Burden of ${activeData.diseaseBurdenIndex}%.\n\nWe advise monitoring clinical parameters and continuing the constitutional remedy plan.`;
      }

      setChatHistory(prev => [...prev, { sender: "ai", text: responseText }]);
      setIsProcessingChat(false);
    }, 1500);
  };

  // Handle report compiles
  const handleCompileReport = (type: string) => {
    setReportType(type);
    
    // Set report markup
    const patientObj = patients.find(p => p.id === selectedPatientId) || { name: "Aarav Sharma", age: "48", gender: "Male" };
    const dateStr = new Date().toLocaleDateString();

    setReportContent(`
      <div style="font-family: system-ui, sans-serif; color: #1e293b; padding: 20px; max-width: 600px; margin: auto;">
        <h2 style="font-size: 16px; border-bottom: 2px solid #0f172a; padding-bottom: 8px; text-transform: uppercase;">Clinical Intelligence Executive Report</h2>
        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 10px; color: #64748b;">
          <span><strong>PATIENT:</strong> ${patientObj.name}</span>
          <span><strong>AGE/GENDER:</strong> ${patientObj.age} / ${patientObj.gender}</span>
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

  // Handle Intake notes processing
  const handleProcessIntake = () => {
    if (!rawIntakeNotes.trim()) return;
    
    // Simulate real-time parsing heuristics
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

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-100 font-sans">
      
      {/* Top Banner (Command Center Header) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-900 to-slate-950 p-6 rounded-[28px] border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-400 animate-pulse" />
            Clinical Intelligence Engine™ (CIE)
          </h2>
          <p className="text-xs text-slate-400 font-sans max-w-2xl leading-relaxed mt-1">
            Serving as the central nervous system of Homeo Healthcare. Ingests demographics, labs, symptoms, and outcomes to generate predictive medical intelligence.
          </p>
        </div>

        <div className="flex gap-2">
          {/* Quick Tab Selectors */}
          <button 
            onClick={() => setActiveTab("twin")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${activeTab === "twin" ? "bg-emerald-600 border-emerald-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"}`}
          >
            🧬 Digital Twin
          </button>
          <button 
            onClick={() => setActiveTab("diagnostics")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${activeTab === "diagnostics" ? "bg-emerald-600 border-emerald-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"}`}
          >
            🤖 Copilot & Reasoning
          </button>
          <button 
            onClick={() => setActiveTab("graph")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${activeTab === "graph" ? "bg-emerald-600 border-emerald-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"}`}
          >
            🕸️ OSTM Graph
          </button>
          <button 
            onClick={() => setActiveTab("intake")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${activeTab === "intake" ? "bg-emerald-600 border-emerald-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"}`}
          >
            📝 Intake Parser
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {isAlertOpen && (
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 p-4 rounded-2xl flex items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-rose-800 dark:text-rose-400">Critical Trend Detected:</span>{" "}
              <span className="text-rose-700 dark:text-rose-300">
                {activeDataKey === "aarav" 
                  ? "eGFR slope decline detected (-9 mL/min in 12 months) under renal load. apis + serum anguillae indicated."
                  : "Subclinical hypothyroid progression to 7.8 uIU/mL. Thyroidinum intercurrent support active."}
              </span>
            </div>
          </div>
          <button onClick={() => setIsAlertOpen(false)} className="text-rose-500 hover:text-rose-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ==================== TAB 1: DIGITAL TWIN WORKSPACE ==================== */}
        {activeTab === "twin" && (
          <>
            {/* Playback Digital Twin Card */}
            <div className="lg:col-span-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-serif text-base font-bold flex items-center gap-2">
                    <Users className="w-4.5 h-4.5 text-emerald-500" /> Patient Digital Twin™ Chronology
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Visits playback simulation. Monitor outcome metric changes over historical visits.</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-4 py-1.5 bg-emerald-600 hover:opacity-90 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer border-none"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    {isPlaying ? "Pause Timeline" : "Play Timeline"}
                  </button>
                  <button 
                    onClick={() => { setIsPlaying(false); setTwinIndex(0); }}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-xl hover:bg-slate-200 cursor-pointer border-none text-slate-700 dark:text-slate-300"
                  >
                    Reset
                  </button>
                  <span className="px-3 py-1 bg-slate-900 border border-slate-800 text-white rounded-lg font-mono text-xs font-bold">
                    {activeData.history[twinIndex]?.date || "Date"}
                  </span>
                </div>
              </div>

              {/* Progress Playback Slider Bar */}
              <div className="flex items-center bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 gap-4">
                <span className="text-[10px] font-mono text-slate-400">{activeData.history[0]?.date.substring(0,7)}</span>
                
                <div className="flex-1 relative h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full">
                  <div 
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                    style={{ width: `${(twinIndex / (activeData.history.length - 1)) * 100}%` }}
                  ></div>
                  <div 
                    className="absolute w-3 h-3 bg-white border-2 border-emerald-500 rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer shadow-md"
                    style={{ left: `${(twinIndex / (activeData.history.length - 1)) * 100}%` }}
                  ></div>
                </div>

                <span className="text-[10px] font-mono text-slate-400">{activeData.history[activeData.history.length-1]?.date.substring(0,7)}</span>
              </div>

              {/* Active visit summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Active Remedy Vector</span>
                  <p className="text-xs font-bold text-violet-600 dark:text-violet-400">
                    {activeData.history[twinIndex]?.type === "Remedy" ? activeData.history[twinIndex].event : activeData.remedyMatches[0].name}
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Visit Event</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{activeData.history[twinIndex]?.event}</p>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Miasmatic Focus</span>
                  <p className="text-xs font-bold text-amber-500">{activeData.miasm.split(" ")[0]}</p>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Notes</span>
                  <p className="text-[10px] text-slate-500 leading-normal">{activeData.history[twinIndex]?.notes}</p>
                </div>
              </div>
            </div>

            {/* Health Intelligence Scores (4 cols) */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                🏆 Health Intelligence Score™
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 text-center flex flex-col items-center gap-1">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Vitality Index</span>
                  <span className="text-2xl font-bold font-serif text-emerald-500">{activeData.vitalityIndex}%</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 text-center flex flex-col items-center gap-1">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Disease Burden</span>
                  <span className="text-2xl font-bold font-serif text-rose-500">{activeData.diseaseBurdenIndex}%</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 text-center flex flex-col items-center gap-1">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Metabolic</span>
                  <span className="text-2xl font-bold font-serif text-sky-500">{activeDataKey === "aarav" ? "88%" : "78%"}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 text-center flex flex-col items-center gap-1">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Endocrine</span>
                  <span className="text-2xl font-bold font-serif text-purple-500">{activeDataKey === "aarav" ? "49%" : "84%"}</span>
                </div>
              </div>
            </div>

            {/* Predictive Risk Engine (4 cols) */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                🔮 Predictive Risk Engine™
              </h3>
              
              <div className="space-y-3.5">
                {activeData.predictiveRisks.map((risk, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{risk.name}</span>
                      <span className={`font-mono font-bold ${risk.color}`}>{risk.level} ({risk.val}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${risk.val > 70 ? "bg-rose-500" : risk.val > 40 ? "bg-amber-500" : "bg-emerald-500"}`}
                        style={{ width: `${risk.val}%` }}
                      ></div>
                    </div>
                    <div className="text-[8px] text-slate-400 flex justify-between leading-none pt-0.5">
                      <span>DRIVER: {risk.driver}</span>
                      <span>MODIFIABLE: {risk.modifiable}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Laboratory Intelligence Engine (4 cols) */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] p-6 shadow-sm space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                🔬 Laboratory Intelligence Engine™
              </h3>
              
              <div className="space-y-2">
                {activeDataKey === "aarav" ? (
                  <>
                    <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850 text-xs">
                      <span>Creatinine (mg/dL)</span>
                      <span className="font-mono font-bold text-rose-500">{activeData.labs.creatinine[twinIndex]}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850 text-xs">
                      <span>eGFR filtration</span>
                      <span className="font-mono font-bold text-amber-500">{activeData.labs.egfr[twinIndex]}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850 text-xs">
                      <span>HbA1c Glycemia</span>
                      <span className="font-mono font-bold text-rose-500">{activeData.labs.hba1c[twinIndex]}%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850 text-xs">
                      <span>Microalbumin (mg/g)</span>
                      <span className="font-mono font-bold text-rose-500">{activeData.labs.microalbumin[twinIndex]}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850 text-xs">
                      <span>TSH (uIU/mL)</span>
                      <span className="font-mono font-bold text-rose-500">{activeData.labs.tsh[twinIndex]}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850 text-xs">
                      <span>LH / FSH ratio</span>
                      <span className="font-mono font-bold text-rose-500">{activeData.labs.lh_fsh_ratio[twinIndex]}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850 text-xs">
                      <span>Cholesterol (mg/dL)</span>
                      <span className="font-mono font-bold text-rose-500">{activeData.labs.cholesterol[twinIndex]}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850 text-xs">
                      <span>Weight index</span>
                      <span className="font-mono font-bold text-sky-500">{activeData.labs.weight_kg[twinIndex]} kg</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Outcome curves Line chart (6 cols) */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                📈 Outcome Response Curves
              </h3>
              <div className="w-full relative h-[150px]">
                <canvas ref={canvasRef} />
              </div>
            </div>

            {/* Symptom Intelligence Engine (6 cols) */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                🩺 Symptom Intelligence Engine™
              </h3>
              
              <div className="grid grid-cols-2 gap-3 max-h-[160px] overflow-y-auto">
                {activeData.symptoms.map((s, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850 text-xs flex flex-col gap-1">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-slate-800 dark:text-slate-200">{s.name}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wide ${s.severity === "Severe" ? "bg-rose-50 text-rose-500" : s.severity === "Moderate" ? "bg-amber-50 text-amber-500" : "bg-emerald-50 text-emerald-500"}`}>
                        {s.severity}
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-400 leading-normal">MODALITIES: {s.modalities}</span>
                    <span className="text-[8px] font-mono text-slate-500">SYSTEM: {s.organAffinity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Health Timeline zoom (12 cols) */}
            <div className="lg:col-span-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  📅 AI Health Timeline™ & Longitudinal Trends
                </h3>
                
                <div className="flex gap-1.5">
                  {[30, 90, 365, 1825].map(days => (
                    <button
                      key={days}
                      onClick={() => setTimelineZoom(days)}
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase cursor-pointer border ${timelineZoom === days ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-100 text-slate-500 hover:text-slate-700"}`}
                    >
                      {days === 30 ? "30 Days" : days === 90 ? "90 Days" : days === 365 ? "1 Year" : "5 Years"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                {activeData.history.map((h, idx) => (
                  <div key={idx} className="flex-none w-[200px] p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex flex-col gap-2">
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-1 text-[9px] font-mono font-bold text-slate-400">
                      <span>{h.date}</span>
                      <span className={`px-1.5 py-0.5 rounded text-white ${h.type === "Remedy" ? "bg-purple-500" : h.type === "Diagnosis" ? "bg-rose-500" : "bg-emerald-500"}`}>
                        {h.type}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{h.event}</h4>
                    <p className="text-[10px] text-slate-500 leading-normal">{h.notes}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Automated Report Engine (6 cols) */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                🖨️ Automated Report Engine™
              </h3>
              
              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => handleCompileReport("clinical_summary")}
                  className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 hover:border-emerald-500 rounded-2xl flex flex-col items-center text-center gap-2 cursor-pointer transition-all"
                >
                  <FileText className="w-8 h-8 text-violet-500" />
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Clinical Summary</span>
                </button>
                <button 
                  onClick={() => handleCompileReport("patient_education")}
                  className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 hover:border-emerald-500 rounded-2xl flex flex-col items-center text-center gap-2 cursor-pointer transition-all"
                >
                  <Award className="w-8 h-8 text-teal-500" />
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Patient Education</span>
                </button>
                <button 
                  onClick={() => handleCompileReport("executive_report")}
                  className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 hover:border-emerald-500 rounded-2xl flex flex-col items-center text-center gap-2 cursor-pointer transition-all"
                >
                  <Cpu className="w-8 h-8 text-sky-500" />
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Executive Report</span>
                </button>
              </div>

              {reportType && (
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 bg-slate-50 dark:bg-slate-950">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Live PDF / Print Preview</span>
                    <button 
                      onClick={() => window.print()}
                      className="px-3 py-1 bg-emerald-600 hover:opacity-90 text-white rounded-xl text-xs font-bold border-none cursor-pointer"
                    >
                      Print Report
                    </button>
                  </div>
                  
                  <div 
                    className="bg-white p-5 rounded-xl border border-slate-200 text-slate-800 max-h-[200px] overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: reportContent }}
                  ></div>
                </div>
              )}
            </div>

            {/* OSTM Systems Matrix under active treatment (6 cols) */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                🛡️ OSTM™ Organ Systems Matrix
              </h3>
              
              <div className="space-y-3.5">
                {activeData.ostmSystems.map((sys, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{sys.name}</span>
                    <span className={`font-bold uppercase ${sys.color}`}>{sys.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ==================== TAB 2: AI CLINICAL COPILOT & REASONING ==================== */}
        {activeTab === "diagnostics" && (
          <>
            {/* Copilot Reasoning (7 cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="font-serif text-base font-bold flex items-center gap-2">
                    <Brain className="w-5 h-5 text-indigo-500" /> AI Clinical Copilot™
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Differential diagnosis pathways and red-flag parameters evaluation.</p>
                </div>
                
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold">
                  CIE Confidence: 88%
                </span>
              </div>

              {/* Differential Path List */}
              <div className="space-y-3.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Differential Pathways</span>
                
                {activeDataKey === "aarav" ? (
                  <>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-2 text-xs">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-slate-800 dark:text-slate-200">Diabetic Nephropathy (CKD Stage 3b)</span>
                        <span className="text-emerald-500">92% Probable</span>
                      </div>
                      <p className="text-slate-500 leading-normal"><strong>Evidence:</strong> eGFR: 49, Creatinine: 1.6, HbA1c: 6.9, persistent microalbuminuria.</p>
                    </div>
                    
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-2 text-xs">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-slate-800 dark:text-slate-200">Cardiovascular Renal Syndrome (Type 4)</span>
                        <span className="text-sky-500">70% Consider / Rule Out</span>
                      </div>
                      <p className="text-slate-500 leading-normal"><strong>Evidence:</strong> Sedentary lifestyle, progressive eGFR drop, ankle edema.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-2 text-xs">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-slate-800 dark:text-slate-200">Polycystic Ovary Syndrome (PCOS)</span>
                        <span className="text-emerald-500">88% Confirmed</span>
                      </div>
                      <p className="text-slate-500 leading-normal"><strong>Evidence:</strong> LH/FSH ratio 2.8, irregular menstrual cycles, hirsutism.</p>
                    </div>
                    
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-2 text-xs">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-slate-800 dark:text-slate-200">Primary Hypothyroidism</span>
                        <span className="text-emerald-500">85% Active</span>
                      </div>
                      <p className="text-slate-500 leading-normal"><strong>Evidence:</strong> Elevated TSH (max 7.8), sluggishness, weight gain.</p>
                    </div>
                  </>
                )}
              </div>

              {/* Red Flags */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block">Red Flag Warnings</span>
                <ul className="list-disc pl-5 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
                  {activeDataKey === "aarav" ? (
                    <>
                      <li>Rapid decline in renal filtration capacity (eGFR slope negative over 12 months).</li>
                      <li>Cardiovascular overload warning (bilateral edema + sedentary profile).</li>
                    </>
                  ) : (
                    <>
                      <li>Subclinical hypothyroid progression to clinical levels (TSH reached 7.8).</li>
                      <li>Insulin resistance markers linked to PCOS weight gain loop.</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Ask AI Console (5 cols) */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] p-6 shadow-sm flex flex-col justify-between h-[520px]">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                💬 Ask OSTM™ Copilot
              </h3>

              <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-1">
                {chatHistory.map((chat, idx) => (
                  <div key={idx} className={`flex ${chat.sender === "doctor" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${chat.sender === "doctor" ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tr-none" : "bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-slate-800 dark:text-slate-200 rounded-tl-none"}`}>
                      {chat.text.split("\n").map((line, i) => (
                        <p key={i} className="mb-1 last:mb-0">{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
                
                {isProcessingChat && (
                  <div className="flex justify-start">
                    <div className="bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/10 rounded-2xl rounded-tl-none p-3 text-xs text-slate-400 animate-pulse">
                      Analyzing clinical indexes...
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAskAICopilot(); }}
                  placeholder="Ask: 'Predict risks' or 'Suggest remedy'..."
                  className="flex-1 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl text-xs outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleAskAICopilot}
                  className="px-4 bg-emerald-600 hover:opacity-90 text-white rounded-xl text-xs font-bold border-none cursor-pointer"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        )}

        {/* ==================== TAB 3: OSTM KNOWLEDGE GRAPH ==================== */}
        {activeTab === "graph" && (
          <div className="lg:col-span-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-serif text-base font-bold flex items-center gap-2">
                <Network className="w-5 h-5 text-indigo-500" /> Clinical Knowledge Graph™
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Explore relationships between Symptoms, Organs, Miasms, and Remedies.</p>
            </div>
            
            <div className="relative border border-slate-200 dark:border-slate-800 bg-slate-950 rounded-2xl overflow-hidden h-[300px]">
              <canvas ref={graphCanvasRef} className="w-full h-full block" />
              
              {/* Legend overlay */}
              <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-800 p-3 rounded-xl space-y-1 z-10 text-[9px] text-slate-350">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span>Symptom</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                  <span>Organ / System</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  <span>Remedy</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                  <span>Miasm</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: AI INTAKE PARSER ==================== */}
        {activeTab === "intake" && (
          <div className="lg:col-span-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-serif text-base font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> Case Intake Parser
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Type clinical description notes to extract OSTM mappings instantly.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <textarea
                  value={rawIntakeNotes}
                  onChange={(e) => setRawIntakeNotes(e.target.value)}
                  placeholder="Type notes here: e.g. Patient complains of severe swelling under eyes, fatigue worse in the morning, has high creatinine, and craves cold water..."
                  className="w-full h-[200px] p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl text-xs outline-none focus:border-emerald-500 resize-none font-sans"
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
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold hover:bg-slate-200 cursor-pointer border-none text-slate-700 dark:text-slate-300"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-850 flex flex-col gap-2 min-h-[200px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Parsed Output logs</span>
                <pre className="font-mono text-xs text-slate-600 dark:text-slate-350 whitespace-pre-wrap overflow-y-auto max-h-[220px]">
                  {parsedIntakeOutput || "Logs output will appear here after parsing..."}
                </pre>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
