"use client";

import { useEffect, useRef, useState } from "react";

export default function EcgGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bpm, setBpm] = useState(72);
  const [isDark, setIsDark] = useState(false);

  // Monitor theme changes
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Simulating slightly fluctuating Heart Rate for realism
  useEffect(() => {
    const interval = setInterval(() => {
      setBpm((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next >= 68 && next <= 76 ? next : prev;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = 100); // fixed height

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
    };
    window.addEventListener("resize", handleResize);

    // Heartbeat template (P-Q-R-S-T wave sequence)
    // Map normalized time 0.0 -> 1.0 to y-offset ratio (-0.3 to 1.0)
    const getEcgValue = (t: number) => {
      if (t < 0.1) return 0; // flat baseline
      if (t < 0.18) {
        // P wave (atria contraction)
        const p = (t - 0.1) / 0.08;
        return Math.sin(p * Math.PI) * 0.12;
      }
      if (t < 0.22) return 0; // PR interval
      if (t < 0.24) {
        // Q wave (septal depolarization - initial dip)
        const q = (t - 0.22) / 0.02;
        return -q * 0.08;
      }
      if (t < 0.27) {
        // R wave (ventricular depolarization - sharp peak)
        const r = (t - 0.24) / 0.03;
        return -0.08 + r * 1.08;
      }
      if (t < 0.30) {
        // S wave (ventricular depolarization - deep plunge)
        const s = (t - 0.27) / 0.03;
        return 1.0 - s * 1.25;
      }
      if (t < 0.33) {
        // Return to baseline
        const ret = (t - 0.30) / 0.03;
        return -0.25 + ret * 0.25;
      }
      if (t < 0.42) return 0; // ST segment
      if (t < 0.58) {
        // T wave (ventricular repolarization - secondary dome)
        const dome = (t - 0.42) / 0.16;
        return Math.sin(dome * Math.PI) * 0.22;
      }
      return 0; // flat baseline before next beat
    };

    let sweepX = 0;
    const speed = 2.8; // scanline speed (pixels per frame)
    const cycleLength = 220; // horizontal width of one full heartbeat cycle in pixels
    
    // Store historic values to draw a persistent line
    const yHistory: number[] = new Array(width).fill(height / 2);

    const animate = () => {
      if (!ctx || !canvas) return;

      // 1. Draw grid in the background
      ctx.fillStyle = isDark ? "#090d16" : "#FAF9F6";
      ctx.fillRect(0, 0, width, height);

      // Faint ECG grid lines
      const gridSize = 15;
      ctx.strokeStyle = isDark ? "rgba(20, 184, 166, 0.08)" : "rgba(20, 184, 166, 0.04)";
      ctx.lineWidth = 0.5;

      for (let x = 0; x < width; x += gridSize) {
        // Darken every 5th grid line (major grid blocks)
        ctx.strokeStyle = (x % (gridSize * 5) === 0)
          ? (isDark ? "rgba(20, 184, 166, 0.15)" : "rgba(20, 184, 166, 0.08)")
          : (isDark ? "rgba(20, 184, 166, 0.06)" : "rgba(20, 184, 166, 0.03)");
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.strokeStyle = (y % (gridSize * 5) === 0)
          ? (isDark ? "rgba(20, 184, 166, 0.15)" : "rgba(20, 184, 166, 0.08)")
          : (isDark ? "rgba(20, 184, 166, 0.06)" : "rgba(20, 184, 166, 0.03)");
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Update sweep position and write new value
      const prevSweepX = Math.floor(sweepX);
      sweepX = (sweepX + speed) % width;
      const currentSweepX = Math.floor(sweepX);

      // Determine y position at current x based on heartbeat cycle
      const cycleProgress = (currentSweepX % cycleLength) / cycleLength;
      const ecgVal = getEcgValue(cycleProgress);
      const centerY = height / 2;
      const newY = centerY - ecgVal * (height * 0.35); // scale to 35% height

      // Write values to history for all pixels between prevSweepX and currentSweepX (in case of sub-pixel steps)
      if (currentSweepX > prevSweepX) {
        for (let i = prevSweepX; i <= currentSweepX; i++) {
          yHistory[i] = newY;
        }
      } else {
        // Handle wrap-around
        for (let i = prevSweepX; i < width; i++) {
          yHistory[i] = newY;
        }
        for (let i = 0; i <= currentSweepX; i++) {
          yHistory[i] = newY;
        }
      }

      // 3. Draw the ECG sweep line
      ctx.lineWidth = 2;
      ctx.shadowBlur = 4;
      ctx.shadowColor = isDark ? "rgba(20, 184, 166, 0.6)" : "rgba(20, 184, 166, 0.4)";

      const gapSize = 35; // gap in front of sweep head to hide old segments

      ctx.beginPath();
      let isDrawing = false;

      for (let i = 0; i < width; i++) {
        // Calculate horizontal distance between this pixel and the sweep head
        const dist = (i - currentSweepX + width) % width;

        if (dist < gapSize) {
          // Inside the gap ahead of sweep head, do not draw
          if (isDrawing) {
            ctx.stroke();
            isDrawing = false;
          }
          continue;
        }

        // Apply fading opacity: brightest right behind sweep head, fading to baseline
        const opacity = Math.max(0.08, 1 - dist / (width - gapSize));
        
        // Dynamic gradient/color to match the theme
        ctx.strokeStyle = isDark 
          ? `rgba(20, 184, 166, ${opacity * 0.95})` 
          : `rgba(15, 118, 110, ${opacity * 0.9})`;

        if (!isDrawing) {
          ctx.beginPath();
          ctx.moveTo(i, yHistory[i]);
          isDrawing = true;
        } else {
          ctx.lineTo(i, yHistory[i]);
        }

        // Draw segments in groups to apply changing opacity
        if (i % 30 === 0) {
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(i, yHistory[i]);
        }
      }
      if (isDrawing) {
        ctx.stroke();
      }

      // 4. Draw the pulsing sweep head cursor
      ctx.save();
      ctx.beginPath();
      ctx.arc(currentSweepX, yHistory[currentSweepX], 3.5, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? "#2dd4bf" : "#0d9488";
      ctx.shadowBlur = 10;
      ctx.shadowColor = isDark ? "#14b8a6" : "#0f766e";
      ctx.fill();
      ctx.restore();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [bpm, isDark]);

  return (
    <div className="w-full relative overflow-hidden border-y border-mint/10 bg-pearl dark:bg-[#090d16] select-none h-[100px]">
      <canvas ref={canvasRef} className="w-full h-full block" />
      
      {/* Medical Monitor Overlays */}
      <div className="absolute inset-0 z-10 pointer-events-none flex justify-between items-center px-6 text-[10px] font-mono tracking-widest text-mint/65 dark:text-mint/50 font-bold uppercase">
        <div className="flex flex-col gap-0.5">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
            EKG II-LEAD MONITOR
          </span>
          <span className="text-[8px] opacity-70">VAL. PROTOCOL: ACTIVE</span>
        </div>
        
        <div className="flex gap-8 items-center">
          <div className="flex flex-col items-end">
            <span className="text-[8px] opacity-70">HR (BPM)</span>
            <span className="text-sm font-bold text-mint animate-pulse">
              {bpm}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] opacity-70">NIBP (mmHg)</span>
            <span className="text-xs font-bold">120/80</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] opacity-70">SpO2 (%)</span>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400">99%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
