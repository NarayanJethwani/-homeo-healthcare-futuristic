"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorOrb() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // High inertia spring config for the background ambient light
  const glowSpringConfig = { damping: 50, stiffness: 50, mass: 1.2 };
  const glowX = useSpring(mouseX, glowSpringConfig);
  const glowY = useSpring(mouseY, glowSpringConfig);

  useEffect(() => {
    // Detect theme class on html tag
    setIsDark(document.documentElement.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className={`pointer-events-none fixed top-0 left-0 z-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-700 ${
        isDark 
          ? "bg-gradient-to-r from-mint/24 via-aqua/18 to-lavender/24 opacity-80 blur-[130px]" 
          : "bg-gradient-to-r from-mint/8 via-aqua/6 to-lavender/8 opacity-65 blur-[100px]"
      }`}
      style={{
        x: glowX,
        y: glowY,
      }}
    />
  );
}
