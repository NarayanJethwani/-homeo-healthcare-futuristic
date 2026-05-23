"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface ConditionCardProps {
  title: string;
  desc: string;
  icon: React.ReactNode;
  tags: string[];
  glowColor: string;
  onClick?: () => void;
}

export default function ConditionCard({ title, desc, icon, tags, glowColor, onClick }: ConditionCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for tilt tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for lag
  const springX = useSpring(mouseX, { stiffness: 100, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 15 });

  // Map normalized coordinate to degree rotations (-8deg to +8deg)
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);

  // Dynamic glare overlay gradient shifting opposite to mouse tilt
  const glareBg = useTransform(
    [springX, springY],
    ([x, y]) => `radial-gradient(circle at ${50 - (x as number) * 100}% ${50 - (y as number) * 100}%, rgba(255, 255, 255, 0.22) 0%, transparent 55%)`
  );

  // Glow position tracking in px
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Normalized coords (-0.5 to 0.5)
    const normX = (e.clientX - rect.left) / width - 0.5;
    const normY = (e.clientY - rect.top) / height - 0.5;
    
    mouseX.set(normX);
    mouseY.set(normY);

    setGlowPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      data-cursor="details"
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className="relative h-[300px] w-full rounded-[28px] glass-panel border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.015)] cursor-pointer overflow-hidden p-8 flex flex-col justify-between group transition-all duration-300 hover:border-white/90"
    >
      {/* Dynamic Specular Glare Overlay (shifts opposite to cursor) */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
        style={{
          background: glareBg,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Interactive spotlight glow */}
      <div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-[30px] transition-opacity duration-500 z-0"
        style={{
          left: glowPos.x,
          top: glowPos.y,
          width: "200px",
          height: "200px",
          background: glowColor,
          opacity: isHovered ? 0.75 : 0,
        }}
      />

      {/* Card Header: Icon with translateZ(40px) */}
      <div 
        style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }} 
        className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/70 border border-white/75 shadow-[0_4px_12px_rgba(20,184,166,0.03)] transition-colors duration-500 group-hover:bg-white animate-pulse z-10"
      >
        {icon}
      </div>

      {/* Card Content with individual Z-axis offsets */}
      <div style={{ transform: "translateZ(25px)", transformStyle: "preserve-3d" }} className="mt-4 flex-grow flex flex-col justify-end z-10">
        <h3 style={{ transform: "translateZ(30px)" }} className="text-xl font-bold text-[#1A2421] mb-2 leading-none">{title}</h3>
        <p style={{ transform: "translateZ(20px)" }} className="text-xs text-slate-700 font-semibold leading-relaxed mb-4">{desc}</p>
        
        {/* Tags with translateZ(15px) */}
        <div style={{ transform: "translateZ(15px)" }} className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-bold text-slate-800 uppercase tracking-wider bg-slate-900/10 px-2 py-0.5 rounded-md border border-slate-950/5"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
