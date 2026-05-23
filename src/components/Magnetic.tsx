"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // Calculate distance from element center
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const x = clientX - centerX;
    const y = clientY - centerY;
    
    // Reduce movement intensity (35% pull)
    setPosition({ x: x * 0.35, y: y * 0.35 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.15 }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}
