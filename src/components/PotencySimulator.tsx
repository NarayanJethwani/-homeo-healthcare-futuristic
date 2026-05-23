"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sliders, Sparkles, HelpCircle, Activity, Wind } from "lucide-react";
import Magnetic from "./Magnetic";

interface PotencyDetail {
  label: string;
  name: string;
  ratio: string;
  affinity: string;
  desc: string;
  color: string;
}

const potencies: PotencyDetail[] = [
  {
    label: "6C",
    name: "Low Dilution (Decimal/Centesimal)",
    ratio: "10⁻¹² (1 in 1 Trillion)",
    affinity: "Physical Tissues & Dermal Matrix",
    desc: "Targeted directly at localized physical tissues and acute organ responses. Best suited for immediate physical support such as skin flares, localized joint pain, and acute indigestion.",
    color: "#14B8A6", // Mint
  },
  {
    label: "30C",
    name: "Medium Dilution",
    ratio: "10⁻⁶⁰ (Beyond Avogadro's Limit)",
    affinity: "Physiological Pathways & Immune Regulation",
    desc: "Acts on functional physiological pathways, cellular communications, and immune loops. Used to regulate systemic functions, respiratory allergies, and circadian endocrine rhythms.",
    color: "#06B6D4", // Aqua
  },
  {
    label: "200C",
    name: "High Dilution",
    ratio: "10⁻⁴⁰⁰ (Subtle Energetic Signature)",
    affinity: "Neuro-Emotional Axis & Vital Force",
    desc: "Reaches the deep neurological and emotional levels. Prescribed to balance chronic stress, psychosomatic manifestations, systemic anxiety, and long-standing emotional blockages.",
    color: "#A855F7", // Lavender
  },
  {
    label: "1M",
    name: "Very High Potency",
    ratio: "10⁻²⁰⁰⁰ (Bio-Resonant Wavefront)",
    affinity: "Constitutional Core & Miasmatic Clearing",
    desc: "Sends subtle, deep-acting resonant wave frequencies to realign the constitutional foundation. Clears chronic, long-standing hereditary conditions and sets the entire system in equilibrium.",
    color: "#0EA5E9", // Sky Blue
  },
  {
    label: "LM1",
    name: "Fifty-Millesimal Potency (Q)",
    ratio: "1:50,000 (Dynamic Succussion)",
    affinity: "Epigenetic Blueprint & Cellular Recovery",
    desc: "A highly advanced, dynamic potency prepared in 1:50,000 steps. Designed to trigger profound cellular memory regeneration and heal genetic patterns smoothly without clinical aggravations.",
    color: "#EC4899", // Coral Pink
  },
];

export default function PotencySimulator() {
  const [activeIndex, setActiveIndex] = useState(1); // Default to 30C
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false, radius: 100 });
  const activePotency = potencies[activeIndex];

  // Canvas particle engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Track mouse position local to canvas
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Particle class definition
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseX: number;
      baseY: number;
      angle: number;
      speed: number;
      alpha: number;
      color: string;
      rippleRadius: number;
      rippleAlpha: number;

      constructor(index: number, total: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.05 + 0.01;
        this.alpha = Math.random() * 0.5 + 0.3;
        this.color = activePotency.color;
        this.rippleRadius = 0;
        this.rippleAlpha = 0;
      }

      update(potencyIndex: number, time: number, idx?: number) {
        const mouse = mouseRef.current;
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        switch (potencyIndex) {
          case 0: // 6C: Dense, rapid physical particles bouncing off walls and cursor
            this.x += this.vx * 2.5;
            this.y += this.vy * 2.5;
            this.size = Math.random() * 1.5 + 1.5;

            // Simple elastic cursor push
            if (mouse.active && dist < 70) {
              const force = (70 - dist) / 70;
              this.vx += (dx / dist) * force * 0.8;
              this.vy += (dy / dist) * force * 0.8;
            }

            // Wall bounce
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
            break;

          case 1: // 30C: Fluid flow around mouse, sine wave offset
            this.angle += this.speed;
            this.vx = Math.cos(this.angle) * 1.2;
            this.vy = Math.sin(this.angle) * 1.2 + Math.sin(time / 20 + this.x / 120) * 0.3;
            
            this.x += this.vx;
            this.y += this.vy;
            this.size = Math.random() * 2 + 2;

            if (mouse.active && dist < 90) {
              const force = (90 - dist) / 90;
              // Deflection around pointer
              this.x += (dy / dist) * force * 3;
              this.y -= (dx / dist) * force * 3;
            }

            // Wrap around screen
            if (this.x < -10) this.x = width + 10;
            if (this.x > width + 10) this.x = -10;
            if (this.y < -10) this.y = height + 10;
            if (this.y > height + 10) this.y = -10;
            break;

          case 2: // 200C: Sparse, glowing nodes with long trails and ripple bursts
            this.x += this.vx * 0.6;
            this.y += this.vy * 0.6;
            this.size = 5;

            if (mouse.active && dist < 100) {
              this.alpha = 0.9;
              if (Math.random() < 0.02 && this.rippleAlpha <= 0) {
                this.rippleRadius = 5;
                this.rippleAlpha = 0.8;
              }
            } else {
              this.alpha = 0.4;
            }

            if (this.rippleAlpha > 0) {
              this.rippleRadius += 2.5;
              this.rippleAlpha -= 0.015;
            }

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
            break;

          case 3: // 1M: Faint points emitting slow expanding bio-energy rings
            this.x += this.vx * 0.3;
            this.y += this.vy * 0.3;
            this.size = 1.5;

            // Trigger ripple rings from the particle
            this.rippleRadius += 1.2;
            if (this.rippleRadius > 140) {
              this.rippleRadius = 0;
            }
            this.rippleAlpha = (140 - this.rippleRadius) / 140 * 0.4;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
            break;

          case 4: // LM1: Math Spiral (geometry) morphing and wrapping around cursor
            const spiralIdx = idx || 0;
            const phi = spiralIdx * 0.1375 + time * 0.015;
            const radius = 9 * Math.sqrt(spiralIdx) + 10;

            const targetX = (mouse.active ? mouse.x : width / 2) + Math.cos(phi) * radius;
            const targetY = (mouse.active ? mouse.y : height / 2) + Math.sin(phi) * radius;

            // Smooth lag follow
            this.x += (targetX - this.x) * 0.08;
            this.y += (targetY - this.y) * 0.08;
            this.size = 3.5;
            this.alpha = 0.75 + Math.sin(time / 10 + spiralIdx) * 0.2;
            break;
        }
      }

      draw(c: CanvasRenderingContext2D, potencyIndex: number) {
        c.save();
        c.globalAlpha = this.alpha;
        c.fillStyle = this.color;

        if (potencyIndex === 2) {
          // Large glowing orb
          c.shadowBlur = 12;
          c.shadowColor = this.color;
        }

        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();

        // Draw individual ripples if present
        if (potencyIndex === 2 && this.rippleAlpha > 0) {
          c.save();
          c.beginPath();
          c.arc(this.x, this.y, this.rippleRadius, 0, Math.PI * 2);
          c.strokeStyle = this.color;
          c.lineWidth = 1;
          c.globalAlpha = this.rippleAlpha;
          c.stroke();
          c.restore();
        }

        if (potencyIndex === 3) {
          // Energy waves
          c.save();
          c.beginPath();
          c.arc(this.x, this.y, this.rippleRadius, 0, Math.PI * 2);
          c.strokeStyle = this.color;
          c.lineWidth = 0.5;
          c.globalAlpha = this.rippleAlpha;
          c.stroke();
          c.restore();
        }
      }
    }

    // Initialize particle arrays
    let particleCount = 130;
    if (activeIndex === 1) particleCount = 70;
    if (activeIndex === 2) particleCount = 30;
    if (activeIndex === 3) particleCount = 12;
    if (activeIndex === 4) particleCount = 180; // geometry nodes

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(i, particleCount));
    }

    // Custom background ripples on pointer click
    let customRipples: { x: number; y: number; r: number; a: number }[] = [];
    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      customRipples.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        r: 10,
        a: 0.8,
      });
    };
    canvas.addEventListener("click", handleCanvasClick);

    let time = 0;
    const animate = () => {
      time++;
      
      // Control trails/alpha clearing
      if (activeIndex === 2 || activeIndex === 3) {
        ctx.fillStyle = "rgba(250, 249, 246, 0.12)"; // Long soft trails
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.clearRect(0, 0, width, height);
      }

      // Draw custom click ripples
      customRipples = customRipples.filter((rip) => rip.a > 0);
      customRipples.forEach((rip) => {
        rip.r += 3.5;
        rip.a -= 0.015;
        ctx.save();
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
        ctx.strokeStyle = activePotency.color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = rip.a;
        ctx.stroke();
        ctx.restore();
      });

      // Draw mouse aura connection
      if (mouseRef.current.active && activeIndex === 4) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = activePotency.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = activePotency.color;
        ctx.fill();
        ctx.restore();
      }

      // Update and draw particles
      particles.forEach((p, idx) => {
        p.update(activeIndex, time, idx);
        p.draw(ctx, activeIndex);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("click", handleCanvasClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeIndex, activePotency]);

  return (
    <div className="mt-28 glass-panel border-white/50 rounded-[32px] p-8 md:p-12 relative overflow-hidden shadow-[0_12px_40px_rgba(20,184,166,0.015)]">
      {/* Absolute canvas background */}
      <div className="absolute inset-0 z-0 bg-white/20">
        <canvas
          ref={canvasRef}
          className="w-full h-full block cursor-crosshair pointer-events-auto"
        />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pointer-events-none">
        
        {/* Left Column: Descriptive Card */}
        <div className="lg:col-span-5 flex flex-col justify-center text-left bg-white/85 backdrop-blur-xl border border-white/60 p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.01)] pointer-events-auto">
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-900/5 text-slate-800">
              <Sliders className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Interactive Simulator</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <div>
                <span
                  style={{ color: activePotency.color }}
                  className="text-3xl font-extrabold tracking-tight font-sans inline-flex items-center gap-2"
                >
                  {activePotency.label}
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-900/5 text-slate-800 font-bold uppercase tracking-wider">
                    Potency
                  </span>
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-2 leading-none">{activePotency.name}</h4>
              </div>

              <hr className="border-slate-100" />

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="block text-[10px] text-slate-700 font-bold uppercase tracking-wide">Dilution Factor</span>
                  <span className="font-mono font-bold text-slate-800">{activePotency.ratio}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-700 font-bold uppercase tracking-wide">Affinity Zone</span>
                  <span className="font-bold text-slate-800">{activePotency.affinity}</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                {activePotency.desc}
              </p>

              <div className="pt-2 flex items-center gap-1.5 text-[10px] text-slate-700 font-bold italic">
                <Sparkles className="w-3.5 h-3.5 text-mint animate-pulse" />
                Tap on canvas to release kinetic succussion waves
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

        {/* Right Column: Potency Select Slider Overlay */}
        <div className="lg:col-span-7 flex flex-col justify-end w-full lg:pl-8 select-none pointer-events-auto">
          
          <div className="glass-panel border-white/60 bg-white/70 p-6 rounded-3xl w-full max-w-lg self-end shadow-sm">
            <h4 className="text-xs font-bold text-[#1A2421] uppercase tracking-wider mb-6 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-mint animate-pulse" />
              Adjust Energetic Resonance Level
            </h4>

            {/* Custom slider tracks */}
            <div className="relative mb-8 mt-2 px-2">
              <input
                type="range"
                min="0"
                max="4"
                value={activeIndex}
                onChange={(e) => setActiveIndex(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-900/5 rounded-lg appearance-none cursor-pointer outline-none accent-mint transition-all"
              />
              
              {/* Target glowing glow indicator following thumb */}
              <div 
                style={{
                  left: `${activeIndex * 25}%`,
                  borderColor: activePotency.color,
                  boxShadow: `0 0 10px ${activePotency.color}40`,
                }}
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border bg-white pointer-events-none transition-all duration-300 transform -translate-x-1/2"
              />
            </div>

            {/* Step triggers */}
            <div className="flex justify-between px-1">
              {potencies.map((pot, idx) => (
                <button
                  key={pot.label}
                  onClick={() => setActiveIndex(idx)}
                  className="flex flex-col items-center group cursor-pointer focus:outline-none"
                >
                  <span
                    style={{
                      color: activeIndex === idx ? pot.color : "rgb(100, 116, 139)",
                      transform: activeIndex === idx ? "scale(1.2)" : "scale(1)",
                    }}
                    className={`text-sm font-extrabold tracking-tight transition-all duration-300 font-sans`}
                  >
                    {pot.label}
                  </span>
                  <span
                    style={{
                      backgroundColor: activeIndex === idx ? pot.color : "transparent",
                    }}
                    className="w-1.5 h-1.5 rounded-full mt-1.5 transition-all duration-300"
                  />
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
