"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Heart, Volume2, VolumeX, AlertTriangle, Activity, Sliders, Layout } from "lucide-react";

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
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [noiseEnabled, setNoiseEnabled] = useState<boolean>(true);
  const [wanderEnabled, setWanderEnabled] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [heartFlash, setHeartFlash] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(false);

  // Animation Refs
  const beatPhaseRef = useRef<number>(0);
  const lastPhaseRef = useRef<number>(0);
  const prevSweepXRef = useRef<number>(0);
  const yHistoryRef = useRef<{ [leadId: string]: number[] }>({});
  
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

  // Continuous flatline alarm synth
  useEffect(() => {
    if (flatline && audioEnabled) {
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
        osc.frequency.setValueAtTime(450, ctx.currentTime);
        
        // Continuous, irritating steady tone typical of EKG flatline alarm
        gainNode.gain.setValueAtTime(0.035, ctx.currentTime);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start();
        
        flatlineOscRef.current = osc;
        flatlineGainRef.current = gainNode;
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
  }, [flatline, audioEnabled]);

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

  // Generate EKG value for a specific lead config and phase
  const getLeadEcgValue = (leadId: string, phase: number): number => {
    const config = LEAD_CONFIGS[leadId] || LEAD_CONFIGS.II;
    
    // Wave segments within the 0.0 -> 1.0 heartbeat cycle
    if (phase < 0.1) return 0; // baseline
    
    // 1. P Wave (atria depolarization)
    if (phase < 0.18) {
      const pPhase = (phase - 0.1) / 0.08;
      return Math.sin(pPhase * Math.PI) * config.p;
    }
    if (phase < 0.22) return 0; // PR segment
    
    // 2. Q Wave (initial septal dip)
    if (phase < 0.24) {
      const qPhase = (phase - 0.22) / 0.02;
      return qPhase * config.q;
    }
    
    // 3. R Wave (primary ventricular peak)
    if (phase < 0.27) {
      const rPhase = (phase - 0.24) / 0.03;
      return config.q + rPhase * (config.r - config.q);
    }
    
    // 4. S Wave (ventricular plunge)
    if (phase < 0.30) {
      const sPhase = (phase - 0.27) / 0.03;
      return config.r - sPhase * (config.r - config.s);
    }
    
    // 5. Ventricular return to baseline
    if (phase < 0.33) {
      const retPhase = (phase - 0.30) / 0.03;
      return config.s + retPhase * (0 - config.s);
    }
    if (phase < 0.42) return 0; // ST segment
    
    // 6. T Wave (ventricular repolarization)
    if (phase < 0.58) {
      const tPhase = (phase - 0.42) / 0.16;
      return Math.sin(tPhase * Math.PI) * config.t;
    }
    
    return 0; // resting diastole baseline
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
    const beatPeriod = 60 / bpm;

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
        // Continuous, phase accumulation ensures smooth BPM changes
        beatPhaseRef.current = (beatPhaseRef.current + dt / beatPeriod) % 1.0;
        
        const currentPhase = beatPhaseRef.current;
        const prevPhase = lastPhaseRef.current;
        
        // Trigger heartbeat beep precisely at R-wave peak crossing (phase 0.25)
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
          
          const rawSignal = flatline ? 0 : getLeadEcgValue(leadId, beatPhaseRef.current);
          const totalSignal = rawSignal + noise + wander;

          // Fill interpolation between frames (prevents gap artifacts under low framerates)
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
  }, [bpm, layout, paperSpeed, gain, selectedTheme, selectedRhythmLead, flatline, noiseEnabled, wanderEnabled, isPlaying, audioEnabled]);

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
              <span className={`w-2 h-2 rounded-full ${flatline ? "bg-red-500 animate-ping" : "bg-mint animate-pulse"}`} />
              {flatline ? "EKG MONITOR: WARNING" : "EKG MONITORING ACTIVE"}
            </span>
            <span className="text-[8px] opacity-75">
              LEAD FORMAT: {layout.replace("-", " ").toUpperCase()}
            </span>
          </div>
          
          <div className="flex gap-4 items-center bg-pearl/70 dark:bg-[#070b13]/70 p-2 rounded-lg border border-mint/10 backdrop-blur-sm">
            {flatline ? (
              <div className="flex items-center gap-2 text-red-500 font-extrabold animate-pulse">
                <AlertTriangle className="w-4 h-4" />
                <span>ALARM: ASYSTOLE</span>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-end border-r border-mint/10 pr-4">
                  <span className="text-[7px] opacity-70">HR (BPM)</span>
                  <span className="flex items-center gap-1 text-sm font-bold text-mint-dark dark:text-mint">
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
                  <span className="text-xs font-bold text-teal-600 dark:text-teal-400">99%</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Control panel workspace */}
      <div className="w-full p-5 bg-pearl/30 dark:bg-[#0c111e]/40 flex flex-col gap-4 text-xs font-medium text-slate-700 dark:text-slate-300">
        
        {/* Core Quick Controls & Layouts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          
          {/* Action Row */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-mint/20 hover:border-mint/50 bg-mint/5 hover:bg-mint/10 font-bold tracking-wider transition-all duration-300 cursor-pointer flex-1"
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
              title="Toggle Audio Beeps"
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="text-[10px] font-bold">BEEP</span>
            </button>
          </div>

          {/* BPM Slider */}
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-mono tracking-wider uppercase opacity-85 flex items-center gap-1">
                <Sliders className="w-3 h-3 text-mint" />
                HEART RATE:
              </span>
              <span className="font-bold text-mint-dark dark:text-mint-light font-mono text-[11px]">{bpm} BPM</span>
            </div>
            <input
              type="range"
              min="40"
              max="180"
              value={bpm}
              disabled={flatline}
              onChange={(e) => setBpm(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-mint disabled:opacity-30 disabled:cursor-not-allowed"
            />
          </div>

          {/* Layout Selector */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono tracking-wider uppercase opacity-85 flex items-center gap-1 px-1">
              <Layout className="w-3 h-3 text-mint" />
              DISPLAY FORMAT:
            </span>
            <div className="relative">
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
          </div>

          {/* Rhythm Lead (if single active) */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono tracking-wider uppercase opacity-85 flex items-center gap-1 px-1">
              <Activity className="w-3 h-3 text-mint" />
              FOCUS LEAD:
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

        {/* Diagnostic Details & Advanced Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200 dark:border-slate-800/80">
          
          {/* Diagnostic Stats */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Speed Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[9px] font-bold px-1.5 text-slate-500 uppercase">SPEED:</span>
              <button
                onClick={() => setPaperSpeed(25)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  paperSpeed === 25 
                    ? "bg-mint text-white" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                25 mm/s
              </button>
              <button
                onClick={() => setPaperSpeed(50)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  paperSpeed === 50 
                    ? "bg-mint text-white" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                50 mm/s
              </button>
            </div>

            {/* Gain Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[9px] font-bold px-1.5 text-slate-500 uppercase">GAIN:</span>
              {[0.5, 1.0, 2.0].map((val) => (
                <button
                  key={val}
                  onClick={() => setGain(val)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    gain === val 
                      ? "bg-mint text-white" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {val}x
                </button>
              ))}
            </div>

            {/* Color Themes */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[9px] font-bold px-1.5 text-slate-500 uppercase">PAPER:</span>
              {Object.keys(THEMES).map((themeName) => (
                <button
                  key={themeName}
                  onClick={() => setSelectedTheme(themeName)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all capitalize cursor-pointer ${
                    selectedTheme === themeName 
                      ? "bg-mint text-white" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {themeName === "salmon" ? "Clinical Pink" : themeName}
                </button>
              ))}
            </div>

          </div>

          {/* Realism Artifact Checkboxes & Flatline emergency */}
          <div className="flex items-center gap-4">
            
            {/* Artifact filters */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={noiseEnabled}
                  onChange={(e) => setNoiseEnabled(e.target.checked)}
                  className="rounded text-mint border-slate-300 dark:border-slate-800 focus:ring-mint w-3.5 h-3.5 cursor-pointer"
                />
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Muscle Noise</span>
              </label>

              <label className="flex items-center gap-1.5 select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={wanderEnabled}
                  onChange={(e) => setWanderEnabled(e.target.checked)}
                  className="rounded text-mint border-slate-300 dark:border-slate-800 focus:ring-mint w-3.5 h-3.5 cursor-pointer"
                />
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Baseline Wander</span>
              </label>
            </div>

            {/* Flatline Emergency Toggle */}
            <button
              onClick={() => setFlatline(!flatline)}
              className={`px-3 py-1.5 rounded-lg border font-bold text-[10px] tracking-wider transition-all duration-300 cursor-pointer ${
                flatline 
                  ? "bg-red-500 hover:bg-red-600 text-white border-red-500 animate-pulse" 
                  : "bg-transparent border-red-500/20 text-red-500 hover:bg-red-500/10"
              }`}
            >
              EMERGENCY FLATLINE
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
