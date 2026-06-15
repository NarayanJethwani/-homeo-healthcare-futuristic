"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Heart, Volume2, VolumeX, AlertTriangle, Activity, Sliders, Layout, ChevronUp, Check, BookOpen } from "lucide-react";

// Standard clinical EKG lead configurations with relative wave amplitudes
interface LeadConfig {
  p: number;
  q: number;
  r: number;
  s: number;
  t: number;
}

const LEAD_CONFIGS: { [key: string]: LeadConfig } = {
  I:    { p: 0.08,  q: -0.04, r: 0.6,   s: -0.08, t: 0.15 },
  II:   { p: 0.12,  q: -0.06, r: 1.0,   s: -0.15, t: 0.25 },
  III:  { p: 0.04,  q: -0.08, r: 0.4,   s: -0.2,  t: 0.08 },
  aVR:  { p: -0.12, q: 0.06,  r: -1.0,  s: 0.15,  t: -0.25 },
  aVL:  { p: 0.06,  q: -0.04, r: 0.35,  s: -0.12, t: 0.12 },
  aVF:  { p: 0.1,   q: -0.05, r: 0.7,   s: -0.15, t: 0.2 },
  V1:   { p: 0.05,  q: 0,     r: 0.15,  s: -0.8,  t: -0.1 },
  V2:   { p: 0.06,  q: 0,     r: 0.3,   s: -1.0,  t: 0.15 },
  V3:   { p: 0.08,  q: -0.03, r: 0.6,   s: -0.6,  t: 0.22 },
  V4:   { p: 0.1,   q: -0.05, r: 0.9,   s: -0.3,  t: 0.28 },
  V5:   { p: 0.12,  q: -0.06, r: 1.0,   s: -0.15, t: 0.26 },
  V6:   { p: 0.1,   q: -0.05, r: 0.8,   s: -0.08, t: 0.2 }
};

interface ThemeConfig {
  bg: string;
  majorGrid: string;
  minorGrid: string;
  traceRGB: string;
  cursor: string;
  text: string;
  glow: boolean;
}

const THEMES: { [key: string]: ThemeConfig } = {
  salmon: {
    bg: "#FFF5F5",
    majorGrid: "rgba(255, 170, 170, 0.45)",
    minorGrid: "rgba(255, 170, 170, 0.18)",
    traceRGB: "26, 37, 48",       // dark slate/black ink
    cursor: "#E11D48",            // ruby red cursor
    text: "#5C0F1B",
    glow: false
  },
  teal: {
    bg: "#070a13",
    majorGrid: "rgba(20, 184, 166, 0.16)",
    minorGrid: "rgba(20, 184, 166, 0.05)",
    traceRGB: "45, 212, 191",     // neon teal
    cursor: "#38bdf8",            // cyan cursor
    text: "rgba(20, 184, 166, 0.85)",
    glow: true
  },
  emerald: {
    bg: "#050806",
    majorGrid: "rgba(34, 197, 94, 0.15)",
    minorGrid: "rgba(34, 197, 94, 0.04)",
    traceRGB: "74, 222, 128",     // neon green
    cursor: "#22c55e",            // green cursor
    text: "rgba(74, 222, 128, 0.85)",
    glow: true
  },
  amber: {
    bg: "#0f0b05",
    majorGrid: "rgba(245, 158, 11, 0.16)",
    minorGrid: "rgba(245, 158, 11, 0.05)",
    traceRGB: "251, 191, 36",     // neon amber
    cursor: "#f59e0b",            // amber orange cursor
    text: "rgba(251, 191, 36, 0.85)",
    glow: true
  }
};

interface ArrhythmiaInfo {
  name: string;
  criteria: string;
  causes: string;
  action: string;
  defaultBpm: number;
}

const ARRHYTHMIAS: { [key: string]: ArrhythmiaInfo } = {
  normal: {
    name: "Normal Sinus Rhythm (NSR)",
    criteria: "Regular rhythm, HR 60-100 BPM. Normal P-QRS-T complexes. Constant PR interval.",
    causes: "Normal pacemaker activity originating from the Sinoatrial (SA) node.",
    action: "Normal clinical state. Standard vital sign monitoring.",
    defaultBpm: 72
  },
  afib: {
    name: "Atrial Fibrillation (A-Fib)",
    criteria: "Irregularly irregular R-R intervals. Absence of P-waves (chaotic baseline f-waves).",
    causes: "Multiple micro-reentrant electrical loops in the atria. Common in heart disease/hypertension.",
    action: "Rate control (beta-blockers), rhythm control (cardioversion), and anticoagulation therapy.",
    defaultBpm: 110
  },
  stemi: {
    name: "ST-Elevation Infarction (STEMI)",
    criteria: "Elevation of the ST-segment above the baseline in localized chest/limb leads.",
    causes: "Acute, complete occlusion of a coronary artery leading to heart muscle infarction.",
    action: "Medical emergency! Call catheterization lab immediately for coronary intervention (PCI).",
    defaultBpm: 85
  },
  pvc: {
    name: "Premature Ectopic Beats (PVC)",
    criteria: "Occasional wide, distorted QRS complexes firing early, followed by compensatory pause.",
    causes: "Ectopic ventricular focus. Can be triggered by hypoxia, stress, caffeine, or ischemia.",
    action: "Monitor frequency. Correct electrolyte imbalances, treat ischemia, or apply beta-blockers.",
    defaultBpm: 75
  },
  block1: {
    name: "First-Degree AV Block",
    criteria: "Regular sinus rhythm. Prolonged, constant PR interval (>0.20 seconds / >32px on grid).",
    causes: "Delayed electrical conduction through the Atrioventricular (AV) node.",
    action: "Usually benign and asymptomatic. Monitor parameters. Review AV-blocking medications.",
    defaultBpm: 60
  },
  block3: {
    name: "Third-Degree (Complete) Block",
    criteria: "Total AV dissociation. Atrial P-waves and escape QRS complexes fire independently.",
    causes: "Complete block of conduction at the AV junction. Severe ischemia or nodal fibrosis.",
    action: "Urgent emergency! Dual-chamber pacemaker placement. Temporary pacing or atropine support.",
    defaultBpm: 35
  },
  vtach: {
    name: "Ventricular Tachycardia (V-Tach)",
    criteria: "Rapid HR (120-220 BPM) with consecutive wide, monomorphic QRS complexes. No P-waves.",
    causes: "Ventricular re-entry circuit. Life-threatening rhythm; high risk of degeneration to V-Fib.",
    action: "Pulse present: Amiodarone / cardioversion. Pulseless: Immediate defibrillation and CPR.",
    defaultBpm: 150
  },
  vfib: {
    name: "Ventricular Fibrillation (V-Fib)",
    criteria: "Chaotic, irregular trembling baseline waves. No recognizable QRS complexes (cardiac arrest).",
    causes: "Disorganized ventricular electrical quivering. Zero cardiac output.",
    action: "Lethal! Call emergency code. Start immediate high-quality CPR and defibrillation.",
    defaultBpm: 120
  }
};

export default function EcgGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // EKG Configuration States
  const [layout, setLayout] = useState<string>("12-grid"); // "12-grid" | "12-stacked" | "6-stacked" | "3-stacked" | "single"
  const [bpm, setBpm] = useState<number>(72);
  const [paperSpeed, setPaperSpeed] = useState<number>(25); // 25 | 50 (mm/s)
  const [gain, setGain] = useState<number>(1.0); // 0.5 | 1.0 | 2.0 (gain multiplier)
  const [selectedTheme, setSelectedTheme] = useState<string>("teal");
  const [selectedRhythmLead, setSelectedRhythmLead] = useState<string>("II");
  
  const [flatline, setFlatline] = useState<boolean>(false);
  const [rhythmMode, setRhythmMode] = useState<string>("normal");
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [noiseEnabled, setNoiseEnabled] = useState<boolean>(true);
  const [wanderEnabled, setWanderEnabled] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [heartFlash, setHeartFlash] = useState<boolean>(false);
  const [controlsVisible, setControlsVisible] = useState<boolean>(true);
  const [isDark, setIsDark] = useState<boolean>(false);

  // Animation Refs
  const beatPhaseRef = useRef<number>(0);
  const lastPhaseRef = useRef<number>(0);
  const prevSweepXRef = useRef<number>(0);
  const yHistoryRef = useRef<{ [leadId: string]: number[] }>({});
  
  // PVC Arrhythmia refs
  const beatCountRef = useRef<number>(0);
  const isPvcRef = useRef<boolean>(false);
  const currentBeatPeriodRef = useRef<number>(60 / bpm);

  // 3rd Degree Block Dissociation refs
  const atrialPhaseRef = useRef<number>(0);
  const ventPhaseRef = useRef<number>(0);
  const lastVentPhaseRef = useRef<number>(0);

  // Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const flatlineOscRef = useRef<OscillatorNode | null>(null);
  const flatlineGainRef = useRef<GainNode | null>(null);

  // Monitor theme changes for auto-selecting visual theme
  useEffect(() => {
    const checkTheme = () => {
      const dark = document.documentElement.classList.contains("dark");
      setIsDark(dark);
      setSelectedTheme(dark ? "teal" : "salmon");
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Update current beat period on BPM adjustments
  useEffect(() => {
    currentBeatPeriodRef.current = 60 / bpm;
  }, [bpm]);

  // Heartbeat beep synth using Web Audio API
  const playBeep = (frequency = 480, duration = 0.07) => {
    if (!audioEnabled || flatline) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(0.04, ctx.currentTime); // pleasant low volume
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.error("Audio EKG beep failed:", e);
    }
  };

  // Continuous flatline / V-Fib alarm synth
  useEffect(() => {
    const alarmActive = flatline || rhythmMode === "vfib";
    if (alarmActive && audioEnabled) {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioContextRef.current;
        if (ctx.state === "suspended") {
          ctx.resume();
        }
        
        if (!flatlineOscRef.current) {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          osc.type = "sine";
          osc.frequency.setValueAtTime(450, ctx.currentTime);
          
          // Continuous warning tone typical of ICU monitors
          gainNode.gain.setValueAtTime(0.035, ctx.currentTime);
          
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          osc.start();
          
          flatlineOscRef.current = osc;
          flatlineGainRef.current = gainNode;
        }
      } catch (e) {
        console.error("Flatline audio alarm failed:", e);
      }
    } else {
      if (flatlineOscRef.current) {
        try {
          flatlineOscRef.current.stop();
          flatlineOscRef.current.disconnect();
        } catch (e) {}
        flatlineOscRef.current = null;
      }
      if (flatlineGainRef.current) {
        try {
          flatlineGainRef.current.disconnect();
        } catch (e) {}
        flatlineGainRef.current = null;
      }
    }
    return () => {
      if (flatlineOscRef.current) {
        try {
          flatlineOscRef.current.stop();
          flatlineOscRef.current.disconnect();
        } catch (e) {}
      }
    };
  }, [flatline, rhythmMode, audioEnabled]);

  // Determine active leads based on current layout selector
  const getActiveLeads = (currentLayout: string): string[] => {
    switch (currentLayout) {
      case "12-grid":
      case "12-stacked":
        return [
          "I", "II", "III",
          "aVR", "aVL", "aVF",
          "V1", "V2", "V3",
          "V4", "V5", "V6"
        ];
      case "6-stacked":
        return ["I", "II", "III", "V1", "V3", "V5"];
      case "3-stacked":
        return ["I", "II", "III"];
      default:
        return [selectedRhythmLead];
    }
  };

  // Calculate cell bounding boxes inside single canvas
  const getCellBox = (index: number, activeLeads: string[], currentLayout: string, width: number, height: number) => {
    if (currentLayout === "12-grid") {
      const col = Math.floor(index / 3);
      const row = index % 3;
      const cellWidth = width / 4;
      const cellHeight = height / 3;
      return {
        xMin: col * cellWidth,
        xMax: (col + 1) * cellWidth,
        yMin: row * cellHeight,
        yMax: (row + 1) * cellHeight,
        w: cellWidth,
        h: cellHeight
      };
    } else {
      const n = activeLeads.length;
      const cellHeight = height / n;
      return {
        xMin: 0,
        xMax: width,
        yMin: index * cellHeight,
        yMax: (index + 1) * cellHeight,
        w: width,
        h: cellHeight
      };
    }
  };

  // 1. P Wave generator segment
  const getPWave = (leadId: string, phase: number): number => {
    const config = LEAD_CONFIGS[leadId] || LEAD_CONFIGS.II;
    if (phase >= 0.1 && phase < 0.18) {
      const pPhase = (phase - 0.1) / 0.08;
      return Math.sin(pPhase * Math.PI) * config.p;
    }
    return 0;
  };

  // 2. QRS Complex and T Wave generator segment
  const getQrsTWave = (leadId: string, phase: number, stElevation = 0): number => {
    const config = LEAD_CONFIGS[leadId] || LEAD_CONFIGS.II;
    
    // Q Wave (initial dip)
    if (phase >= 0.22 && phase < 0.24) {
      const qPhase = (phase - 0.22) / 0.02;
      return qPhase * config.q;
    }
    
    // R Wave (primary peak)
    if (phase >= 0.24 && phase < 0.27) {
      const rPhase = (phase - 0.24) / 0.03;
      return config.q + rPhase * (config.r - config.q);
    }
    
    // S Wave (plunge dip)
    if (phase >= 0.27 && phase < 0.30) {
      const sPhase = (phase - 0.27) / 0.03;
      return config.r - sPhase * (config.r - config.s);
    }
    
    // Return to baseline (or elevated STEMI level)
    if (phase >= 0.30 && phase < 0.33) {
      const retPhase = (phase - 0.30) / 0.03;
      return config.s + retPhase * (stElevation - config.s);
    }
    
    // ST Segment (elevation flat block)
    if (phase >= 0.33 && phase < 0.42) {
      return stElevation;
    }
    
    // T Wave (ventricular repolarization dome)
    if (phase >= 0.42 && phase < 0.58) {
      const tPhase = (phase - 0.42) / 0.16;
      return stElevation + Math.sin(tPhase * Math.PI) * config.t;
    }
    
    return 0;
  };

  // 3. Wide Bizarre PVC wave segment
  const getPvcWave = (leadId: string, phase: number): number => {
    const config = LEAD_CONFIGS[leadId] || LEAD_CONFIGS.II;
    const ampMultiplier = -1.35 * Math.abs(config.r); // widened and inverted
    
    // Wide ectopic QRS complex
    if (phase >= 0.15 && phase < 0.35) {
      const qrsPhase = (phase - 0.15) / 0.20;
      return Math.sin(qrsPhase * Math.PI) * ampMultiplier;
    }
    // Opposite direction T-wave
    if (phase >= 0.35 && phase < 0.60) {
      const tPhase = (phase - 0.35) / 0.25;
      return Math.sin(tPhase * Math.PI) * 0.38 * Math.abs(config.r);
    }
    return 0;
  };

  // 4. Ventricular Tachycardia continuous wide QRS waves
  const getVTachWave = (leadId: string, phase: number): number => {
    const config = LEAD_CONFIGS[leadId] || LEAD_CONFIGS.II;
    const rVal = Math.abs(config.r);
    // Mimics continuous monomorphic sine sawtooth loops
    return Math.sin(phase * 2 * Math.PI) * 0.85 * rVal;
  };

  // 5. Ventricular Fibrillation chaotic micro-vibrations
  const getVFibWave = (leadId: string, time: number): number => {
    const config = LEAD_CONFIGS[leadId] || LEAD_CONFIGS.II;
    const rVal = Math.abs(config.r);
    return (
      Math.sin(time / 1000 * 2 * Math.PI * 4.3) * 0.26 * rVal +
      Math.sin(time / 1000 * 2 * Math.PI * 8.9) * 0.16 * rVal +
      Math.sin(time / 1000 * 2 * Math.PI * 13.5) * 0.11 * rVal +
      (Math.random() - 0.5) * 0.25 * rVal
    );
  };

  // Determine dynamic container height for different EKG configurations
  const getContainerHeight = (currentLayout: string): number => {
    switch (currentLayout) {
      case "12-grid":
        return 270;
      case "12-stacked":
        return 480;
      case "6-stacked":
        return 300;
      case "3-stacked":
        return 180;
      default:
        return 130; // single lead rhythm strip
    }
  };

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let sweepX = 0;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      const activeCtx = canvas.getContext("2d");
      if (activeCtx) {
        activeCtx.scale(dpr, dpr);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Active configuration references for loop
    const activeLeads = getActiveLeads(layout);
    const theme = THEMES[selectedTheme] || THEMES.teal;
    const gridSquare = 6.2; // ~6px represents 1mm grid square
    const speedInPixelsPerSec = paperSpeed * gridSquare;

    const animate = (time: number) => {
      if (!ctx || !canvas) return;

      let dt = (time - lastTime) / 1000;
      if (dt > 0.1) dt = 0.1; // clamp to prevent lag spikes
      lastTime = time;

      // 1. Draw Grid Background
      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, width, height);

      // Minor grid blocks (1mm)
      ctx.lineWidth = 0.45;
      ctx.strokeStyle = theme.minorGrid;
      for (let x = 0; x < width; x += gridSquare) {
        if (Math.round(x / gridSquare) % 5 !== 0) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
      }
      for (let y = 0; y < height; y += gridSquare) {
        if (Math.round(y / gridSquare) % 5 !== 0) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      // Major grid blocks (5mm)
      ctx.lineWidth = 0.95;
      ctx.strokeStyle = theme.majorGrid;
      for (let x = 0; x < width; x += gridSquare * 5) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSquare * 5) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw layout dividers
      ctx.lineWidth = 1.0;
      ctx.strokeStyle = theme.majorGrid;
      if (layout === "12-grid") {
        for (let col = 1; col < 4; col++) {
          ctx.beginPath();
          ctx.moveTo(col * (width / 4), 0);
          ctx.lineTo(col * (width / 4), height);
          ctx.stroke();
        }
        for (let row = 1; row < 3; row++) {
          ctx.beginPath();
          ctx.moveTo(0, row * (height / 3));
          ctx.lineTo(width, row * (height / 3));
          ctx.stroke();
        }
      } else if (activeLeads.length > 1) {
        const n = activeLeads.length;
        for (let row = 1; row < n; row++) {
          ctx.beginPath();
          ctx.moveTo(0, row * (height / n));
          ctx.lineTo(width, row * (height / n));
          ctx.stroke();
        }
      }

      // 2. Advance Heartbeat Phase and Sweep Line
      if (isPlaying) {
        if (rhythmMode === "block3") {
          // Dissociated complete heart block rhythm math
          const atrialPeriod = 60 / 85; // SA fires at 85 BPM
          const ventPeriod = 60 / 38;   // Junctional escape fires at 38 BPM
          
          atrialPhaseRef.current = (atrialPhaseRef.current + dt / atrialPeriod) % 1.0;
          ventPhaseRef.current = (ventPhaseRef.current + dt / ventPeriod) % 1.0;
          
          const currentVentPhase = ventPhaseRef.current;
          const prevVentPhase = lastVentPhaseRef.current;
          
          // Beep synced with ventricular escape pulse
          if (!flatline && (
            (prevVentPhase < 0.255 && currentVentPhase >= 0.255) || 
            (prevVentPhase > currentVentPhase && currentVentPhase >= 0.255)
          )) {
            setHeartFlash(true);
            setTimeout(() => setHeartFlash(false), 120);
            playBeep(450, 0.085);
          }
          lastVentPhaseRef.current = currentVentPhase;
        } else if (rhythmMode === "vfib") {
          // V-Fib quivers continuously without standard cardiac cycles (no beeps)
        } else {
          // Normal, AFib, Block1, PVC, STEMI, or VTach rhythms
          const oldPhase = beatPhaseRef.current;
          const newPhase = (oldPhase + dt / currentBeatPeriodRef.current) % 1.0;

          // Phase boundary wrap-around check for EKG cycle progression
          if (newPhase < oldPhase) {
            if (rhythmMode === "pvc") {
              beatCountRef.current = (beatCountRef.current + 1) % 4;
              const nextIsPvc = (beatCountRef.current === 0);
              isPvcRef.current = nextIsPvc;

              // Compensatory pause logic following premature ectopic beats
              if (nextIsPvc) {
                currentBeatPeriodRef.current = (60 / bpm) * 0.55; 
              } else if (isPvcRef.current) {
                currentBeatPeriodRef.current = (60 / bpm) * 1.45; 
              } else {
                currentBeatPeriodRef.current = (60 / bpm);
              }
            } else if (rhythmMode === "afib") {
              // Irregularly irregular pacing intervals
              currentBeatPeriodRef.current = (60 / bpm) * (0.65 + Math.random() * 0.7);
            } else {
              currentBeatPeriodRef.current = 60 / bpm;
            }
          }

          beatPhaseRef.current = newPhase;

          const currentPhase = beatPhaseRef.current;
          const prevPhase = lastPhaseRef.current;

          // Trigger beep precisely at QRS peak crossing (phase 0.255)
          if (!flatline && (
            (prevPhase < 0.255 && currentPhase >= 0.255) || 
            (prevPhase > currentPhase && currentPhase >= 0.255)
          )) {
            setHeartFlash(true);
            setTimeout(() => setHeartFlash(false), 120);
            playBeep(450, 0.085);
          }
          lastPhaseRef.current = currentPhase;
        }
      }

      // Compute sweep width size for active layout configuration
      const cellWidth = layout === "12-grid" ? width / 4 : width;
      const prevSweepX = prevSweepXRef.current;
      
      if (isPlaying) {
        sweepX = (sweepX + speedInPixelsPerSec * dt) % cellWidth;
      }
      
      const currentSweepX = Math.floor(sweepX);
      const gapSize = 35; // gap in front of sweep head to clear old trace segments

      // 3. Update Wave Trace History & Render Leads
      activeLeads.forEach((leadId, index) => {
        const box = getCellBox(index, activeLeads, layout, width, height);

        // Lazily allocate history buffers mapped to active cell widths
        const historySize = Math.floor(box.w);
        if (!yHistoryRef.current[leadId] || yHistoryRef.current[leadId].length !== historySize) {
          yHistoryRef.current[leadId] = new Array(historySize).fill(0);
        }

        const history = yHistoryRef.current[leadId];

        // If playing, update trace buffer values
        if (isPlaying) {
          // Calculate noise and wander offsets
          const noise = noiseEnabled ? (Math.random() - 0.5) * 0.035 : 0;
          const wander = wanderEnabled ? Math.sin(time / 1000 * 2 * Math.PI * 0.12) * 0.08 : 0;
          
          let rawSignal = 0;
          if (flatline) {
            rawSignal = 0;
          } else if (rhythmMode === "vfib") {
            rawSignal = getVFibWave(leadId, time);
          } else if (rhythmMode === "vtach") {
            rawSignal = getVTachWave(leadId, beatPhaseRef.current);
          } else if (rhythmMode === "block3") {
            // Composite signal of SA P-waves + ventricular escape beats
            rawSignal = getPWave(leadId, atrialPhaseRef.current) + getQrsTWave(leadId, ventPhaseRef.current);
          } else if (rhythmMode === "afib") {
            // Atrial fibrillatory ripple (absence of P-waves)
            const fWave = Math.sin(time / 1000 * 2 * Math.PI * (14 + Math.sin(time / 400) * 3)) * 0.06;
            rawSignal = getQrsTWave(leadId, beatPhaseRef.current) + fWave;
          } else if (rhythmMode === "pvc") {
            rawSignal = isPvcRef.current ? getPvcWave(leadId, beatPhaseRef.current) : (getPWave(leadId, beatPhaseRef.current) + getQrsTWave(leadId, beatPhaseRef.current));
          } else if (rhythmMode === "block1") {
            // Delayed AV conduction: shift QRS phase by 0.06
            const delayedQrsPhase = (beatPhaseRef.current - 0.06 + 1.0) % 1.0;
            rawSignal = getPWave(leadId, beatPhaseRef.current) + getQrsTWave(leadId, delayedQrsPhase);
          } else if (rhythmMode === "stemi") {
            // ST segment elevation (+0.32) in clinical infarct leads
            const isAffected = ["II", "aVF", "V2", "V3", "V4", "V5"].includes(leadId);
            rawSignal = getPWave(leadId, beatPhaseRef.current) + getQrsTWave(leadId, beatPhaseRef.current, isAffected ? 0.32 : 0);
          } else {
            // Normal Sinus Rhythm (NSR)
            rawSignal = getPWave(leadId, beatPhaseRef.current) + getQrsTWave(leadId, beatPhaseRef.current);
          }

          const totalSignal = rawSignal + noise + wander;

          // Fill interpolation between frames (prevents gaps under frame drops)
          const px = Math.floor(prevSweepX);
          const cx = Math.floor(sweepX);

          if (cx > px) {
            for (let i = px + 1; i <= cx; i++) {
              if (i < historySize) history[i] = totalSignal;
            }
          } else if (cx < px) {
            for (let i = px + 1; i < historySize; i++) {
              history[i] = totalSignal;
            }
            for (let i = 0; i <= cx; i++) {
              if (i < historySize) history[i] = totalSignal;
            }
          } else {
            if (cx < historySize) history[cx] = totalSignal;
          }
        }

        // Draw trace curve with decaying transparency
        ctx.lineWidth = 1.9;
        ctx.shadowBlur = theme.glow ? 5 : 0;
        ctx.shadowColor = `rgba(${theme.traceRGB}, 0.65)`;

        let isDrawing = false;
        const segmentStep = 15; // split strokes into chunks to render fading opacity

        for (let i = 0; i < historySize; i++) {
          const dist = (i - currentSweepX + historySize) % historySize;
          if (dist < gapSize) {
            if (isDrawing) {
              ctx.stroke();
              isDrawing = false;
            }
            continue;
          }

          // Opacity decay gradient behind the scan head
          const opacity = Math.max(0.07, 1 - dist / (historySize - gapSize));
          ctx.strokeStyle = `rgba(${theme.traceRGB}, ${opacity * 0.95})`;

          const ptX = box.xMin + i;
          // Scale wave amplitude relative to cell height (max 32%) and gain setting
          const ptY = box.yMin + box.h / 2 - history[i] * (box.h * 0.32) * gain;

          if (!isDrawing) {
            ctx.beginPath();
            ctx.moveTo(ptX, ptY);
            isDrawing = true;
          } else {
            ctx.lineTo(ptX, ptY);
          }

          if (i % segmentStep === 0) {
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(ptX, ptY);
          }
        }
        if (isDrawing) {
          ctx.stroke();
        }

        // Draw pulsing sweep cursor dot
        if (isPlaying && currentSweepX < historySize) {
          ctx.save();
          ctx.beginPath();
          const dotX = box.xMin + currentSweepX;
          const dotY = box.yMin + box.h / 2 - history[currentSweepX] * (box.h * 0.32) * gain;
          ctx.arc(dotX, dotY, 3.2, 0, Math.PI * 2);
          ctx.fillStyle = theme.cursor;
          if (theme.glow) {
            ctx.shadowBlur = 9;
            ctx.shadowColor = theme.cursor;
          }
          ctx.fill();
          ctx.restore();
        }

        // Draw EKG lead label (top left of cell)
        ctx.fillStyle = theme.text;
        ctx.font = "bold 9px monospace";
        ctx.fillText(leadId, box.xMin + 8, box.yMin + 13);

        // Draw diagnostic stats (bottom corners of cell)
        ctx.fillStyle = selectedTheme === "salmon" ? "rgba(74, 15, 27, 0.45)" : "rgba(20, 184, 166, 0.4)";
        ctx.font = "7px monospace";
        ctx.fillText(`${paperSpeed} mm/s`, box.xMin + 8, box.yMin + box.h - 5);
        ctx.fillText(`${(gain * 10).toFixed(0)} mm/mV`, box.xMin + box.w - 46, box.yMin + box.h - 5);
      });

      prevSweepXRef.current = sweepX;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [bpm, layout, paperSpeed, gain, selectedTheme, selectedRhythmLead, flatline, rhythmMode, noiseEnabled, wanderEnabled, isPlaying, audioEnabled]);

  return (
    <div className="w-full flex flex-col rounded-2xl border border-mint/20 bg-pearl dark:bg-[#070b13] overflow-hidden shadow-2xl backdrop-blur-md">
      
      {/* EKG Screen viewport */}
      <div 
        className="w-full relative overflow-hidden select-none transition-all duration-500 ease-in-out cursor-crosshair border-b border-mint/10"
        style={{ height: `${getContainerHeight(layout)}px` }}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
        
        {/* Patient vitals dashboard overlay (HUD) */}
        <div className="absolute inset-0 z-10 pointer-events-none flex justify-between items-start p-4 text-[10px] font-mono tracking-widest font-bold text-mint-dark/70 dark:text-mint/60 uppercase">
          <div className="flex flex-col gap-1 bg-pearl/70 dark:bg-[#070b13]/70 p-2 rounded-lg border border-mint/10 backdrop-blur-sm">
            <span className="flex items-center gap-2 text-mint-dark dark:text-mint">
              <span className={`w-2 h-2 rounded-full ${flatline || rhythmMode === "vfib" || rhythmMode === "vtach" ? "bg-red-500 animate-ping" : "bg-mint animate-pulse"}`} />
              {flatline || rhythmMode === "vfib" || rhythmMode === "vtach" 
                ? `EKG ALARM: ${flatline ? "ASYSTOLE" : rhythmMode.toUpperCase()}` 
                : "EKG MONITORING ACTIVE"}
            </span>
            <span className="text-[8px] opacity-75">
              RHYTHM: {ARRHYTHMIAS[rhythmMode]?.name.split(" (")[0]}
            </span>
          </div>
          
          <div className="flex gap-4 items-center bg-pearl/70 dark:bg-[#070b13]/70 p-2 rounded-lg border border-mint/10 backdrop-blur-sm">
            {flatline || rhythmMode === "vfib" ? (
              <div className="flex items-center gap-2 text-red-500 font-extrabold animate-pulse">
                <AlertTriangle className="w-4 h-4" />
                <span>ALARM: {flatline ? "ASYSTOLE" : "VENTRICULAR FIBRILLATION"}</span>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-end border-r border-mint/10 pr-4">
                  <span className="text-[7px] opacity-70">HR (BPM)</span>
                  <span className={`flex items-center gap-1 text-sm font-bold ${rhythmMode === "vtach" ? "text-red-500 animate-pulse" : "text-mint-dark dark:text-mint"}`}>
                    <Heart className={`w-3.5 h-3.5 fill-current transition-all duration-100 ${heartFlash ? "text-red-500 scale-125 glow-lg" : "text-mint dark:text-mint"}`} />
                    {bpm}
                  </span>
                </div>
                <div className="flex flex-col items-end border-r border-mint/10 pr-4">
                  <span className="text-[7px] opacity-70">NIBP (mmHg)</span>
                  <span className="text-xs font-bold text-mint-dark dark:text-mint-light">120/80</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[7px] opacity-70">SpO2 (%)</span>
                  <span className={`text-xs font-bold ${rhythmMode === "vfib" ? "text-red-500 animate-pulse" : "text-teal-600 dark:text-teal-400"}`}>
                    {rhythmMode === "vfib" ? "0%" : "99%"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Floating Settings Trigger when panel is minimized */}
        {!controlsVisible && (
          <div className="absolute bottom-4 right-4 z-20 pointer-events-auto">
            <button
              onClick={() => setControlsVisible(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-mint/35 hover:border-mint bg-pearl/90 dark:bg-[#070b13]/90 text-[10px] font-extrabold text-mint-dark dark:text-mint-light shadow-xl hover:shadow-mint/10 hover:scale-105 cursor-pointer transition-all duration-300 uppercase tracking-widest backdrop-blur-md"
            >
              <Sliders className="w-3.5 h-3.5 text-mint animate-pulse" />
              Show Controls
            </button>
          </div>
        )}
      </div>

      {/* Control panel workspace (collapsible) */}
      <div 
        className={`w-full transition-all duration-500 ease-in-out overflow-hidden bg-pearl/30 dark:bg-[#0c111e]/40 border-slate-200 dark:border-slate-800 ${
          controlsVisible 
            ? "max-h-[1200px] opacity-100 p-5 border-t border-mint/10" 
            : "max-h-0 opacity-0 p-0 border-t-0"
        }`}
      >
        {/* Main Dashboard: Settings and Pathologies side-by-side */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* EKG Settings Panel */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            
            {/* Header with Minimize Button */}
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-extrabold font-mono tracking-widest text-mint dark:text-mint-light uppercase flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                EKG Parameters
              </span>
              <button
                onClick={() => setControlsVisible(false)}
                className="flex items-center gap-1 px-2 py-1 rounded-md border border-slate-300 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 text-[9px] font-bold text-slate-500 cursor-pointer transition-all uppercase tracking-wider"
                title="Collapse Panel"
              >
                <ChevronUp className="w-3 h-3 text-slate-400" />
                Hide Panel
              </button>
            </div>

            {/* Core Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Play/Pause & Audio */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-mono tracking-wider uppercase opacity-85 px-1">EKG Power & Sound:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-mint/20 hover:border-mint/50 bg-mint/5 hover:bg-mint/10 font-bold tracking-wider transition-all duration-300 cursor-pointer flex-1 text-xs"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5 text-mint" />
                        FREEZE
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-mint" />
                        RUN EKG
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 cursor-pointer ${
                      audioEnabled 
                        ? "bg-mint/10 border-mint text-mint-dark dark:text-mint-light" 
                        : "bg-transparent border-slate-300 dark:border-slate-800 text-slate-500"
                    }`}
                    title="Toggle Heartbeat audio"
                  >
                    {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    <span className="text-[10px] font-bold">BEEP</span>
                  </button>
                </div>
              </div>

              {/* Heart Rate Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-mono tracking-wider uppercase opacity-85">Base Heart Rate:</span>
                  <span className="font-bold text-mint-dark dark:text-mint-light font-mono text-[11px]">{bpm} BPM</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="180"
                  value={bpm}
                  disabled={flatline || rhythmMode === "block3" || rhythmMode === "vfib" || rhythmMode === "vtach"}
                  onChange={(e) => setBpm(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-mint disabled:opacity-35 disabled:cursor-not-allowed"
                />
              </div>

              {/* Layout Selector */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-mono tracking-wider uppercase opacity-85 flex items-center gap-1 px-1">
                  <Layout className="w-3 h-3 text-mint" />
                  Display Layout:
                </span>
                <select
                  value={layout}
                  onChange={(e) => setLayout(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-800 bg-pearl dark:bg-[#070b13] text-xs font-bold outline-none cursor-pointer focus:border-mint transition-all"
                >
                  <option value="12-grid">12-Lead EKG Report (3x4 Grid)</option>
                  <option value="12-stacked">12-Channel Stacked (Full Width)</option>
                  <option value="6-stacked">6-Channel Stacked (I, II, III, V1, V3, V5)</option>
                  <option value="3-stacked">3-Channel Stacked (I, II, III)</option>
                  <option value="single">Single Lead Rhythm Strip</option>
                </select>
              </div>

              {/* Rhythm Focus lead */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-mono tracking-wider uppercase opacity-85 flex items-center gap-1 px-1">
                  <Activity className="w-3 h-3 text-mint" />
                  Rhythm Focus Lead:
                </span>
                <select
                  value={selectedRhythmLead}
                  disabled={layout !== "single"}
                  onChange={(e) => setSelectedRhythmLead(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-800 bg-pearl dark:bg-[#070b13] text-xs font-bold outline-none cursor-pointer focus:border-mint transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {Object.keys(LEAD_CONFIGS).map((lead) => (
                    <option key={lead} value={lead}>
                      Lead {lead} {lead === "II" ? "(Rhythm Reference)" : ""}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Diagnostic Toggles */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              
              {/* Paper speed */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[8px] font-bold px-1.5 text-slate-500 uppercase">SPEED:</span>
                <button
                  onClick={() => setPaperSpeed(25)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    paperSpeed === 25 
                      ? "bg-mint text-white font-extrabold shadow-sm" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  25 mm/s
                </button>
                <button
                  onClick={() => setPaperSpeed(50)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    paperSpeed === 50 
                      ? "bg-mint text-white font-extrabold shadow-sm" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  50 mm/s
                </button>
              </div>

              {/* Signal gain */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[8px] font-bold px-1.5 text-slate-500 uppercase">GAIN:</span>
                {[0.5, 1.0, 2.0].map((val) => (
                  <button
                    key={val}
                    onClick={() => setGain(val)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      gain === val 
                        ? "bg-mint text-white font-extrabold shadow-sm" 
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {val}x
                  </button>
                ))}
              </div>

              {/* Themes */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[8px] font-bold px-1.5 text-slate-500 uppercase">PAPER:</span>
                {Object.keys(THEMES).map((themeName) => (
                  <button
                    key={themeName}
                    onClick={() => setSelectedTheme(themeName)}
                    className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all capitalize cursor-pointer ${
                      selectedTheme === themeName 
                        ? "bg-mint text-white font-extrabold shadow-sm" 
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {themeName === "salmon" ? "Clinical Pink" : themeName}
                  </button>
                ))}
              </div>

            </div>

            {/* Artifact Toggles and Emergency flatline */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200 dark:border-slate-800/80">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={noiseEnabled}
                    onChange={(e) => setNoiseEnabled(e.target.checked)}
                    className="rounded text-mint border-slate-300 dark:border-slate-800 focus:ring-mint w-3.5 h-3.5 cursor-pointer"
                  />
                  <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Muscle Noise</span>
                </label>

                <label className="flex items-center gap-1.5 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wanderEnabled}
                    onChange={(e) => setWanderEnabled(e.target.checked)}
                    className="rounded text-mint border-slate-300 dark:border-slate-800 focus:ring-mint w-3.5 h-3.5 cursor-pointer"
                  />
                  <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Baseline Wander</span>
                </label>
              </div>

              <button
                onClick={() => {
                  setFlatline(!flatline);
                  if (!flatline) {
                    setAudioEnabled(true);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg border font-bold text-[9px] tracking-wider transition-all duration-300 cursor-pointer ${
                  flatline 
                    ? "bg-red-500 hover:bg-red-600 text-white border-red-500 animate-pulse" 
                    : "bg-transparent border-red-500/20 text-red-500 hover:bg-red-500/10"
                }`}
              >
                EMERGENCY FLATLINE
              </button>
            </div>

          </div>

          {/* Arrhythmia Reference & Simulator Database */}
          <div className="lg:col-span-2 flex flex-col gap-3 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 lg:pl-6 pt-4 lg:pt-0">
            
            <div className="flex items-center gap-1.5 pb-2 border-b border-slate-200 dark:border-slate-800">
              <BookOpen className="w-4 h-4 text-mint" />
              <span className="text-[10px] font-extrabold font-mono tracking-widest text-mint dark:text-mint-light uppercase">
                Clinical Pathology Simulator
              </span>
            </div>

            {/* Pathology List */}
            <div className="grid grid-cols-2 gap-1.5">
              {Object.keys(ARRHYTHMIAS).map((key) => {
                const active = rhythmMode === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setFlatline(false);
                      setRhythmMode(key);
                      setBpm(ARRHYTHMIAS[key].defaultBpm);
                      // Auto-enable audio alarm context on critical cardiac abnormalities
                      if (key === "vtach" || key === "vfib" || key === "block3") {
                        setAudioEnabled(true);
                      }
                    }}
                    className={`px-2 py-1.5 rounded-lg border text-[10px] font-extrabold text-left transition-all duration-200 cursor-pointer flex justify-between items-center ${
                      active 
                        ? "bg-mint text-white border-mint shadow-md" 
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span>{ARRHYTHMIAS[key].name.split(" (")[0]}</span>
                    {active && <Check className="w-3 h-3 text-white" />}
                  </button>
                );
              })}
            </div>

            {/* Diagnostic Clinical Card */}
            <div className="flex-1 bg-slate-100/70 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800/80 flex flex-col gap-2 mt-1 min-h-[140px] justify-between">
              <div>
                <div className="font-extrabold text-mint-dark dark:text-mint text-[10px] uppercase tracking-widest border-b border-mint/10 pb-1 mb-2 flex justify-between items-center">
                  <span>{ARRHYTHMIAS[rhythmMode]?.name}</span>
                  {rhythmMode !== "normal" && (
                    <span className="text-[7px] bg-red-500 text-white font-extrabold px-1.5 py-0.5 rounded uppercase animate-pulse">
                      {rhythmMode === "block1" ? "MONITOR" : "CRITICAL"}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col gap-1.5 text-[10px] leading-relaxed">
                  <div>
                    <strong className="text-slate-500 dark:text-slate-400">ECG Criteria:</strong>{" "}
                    <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">
                      {ARRHYTHMIAS[rhythmMode]?.criteria}
                    </span>
                  </div>
                  <div>
                    <strong className="text-slate-500 dark:text-slate-400">Etiology:</strong>{" "}
                    <span className="text-slate-800 dark:text-slate-200">
                      {ARRHYTHMIAS[rhythmMode]?.causes}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800/50 text-[10px] leading-relaxed">
                <strong className="text-slate-500 dark:text-slate-400">Clinical Intervention:</strong>{" "}
                <span className="text-slate-800 dark:text-slate-200">
                  {ARRHYTHMIAS[rhythmMode]?.action}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
