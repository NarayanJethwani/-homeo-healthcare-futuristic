"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false);

  const phoneNumber = "918446056789";
  const defaultMessage = encodeURIComponent(
    "Hello Dr. Narayan, I am visiting your website and would like to inquire about a homeopathic consultation."
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip Label */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 15, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 15, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="hidden sm:block px-4 py-2 rounded-2xl glass-panel text-xs font-bold text-slate-800 shadow-md border-white/40 whitespace-nowrap"
          >
            Chat with Dr. Narayan
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[4px] w-2 h-2 rotate-45 bg-[#FAF9F6] dark:bg-slate-900 border-r border-t border-white/40 dark:border-slate-800/40" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center justify-center w-14 h-14 rounded-full glass-panel shadow-[0_8px_32px_rgba(20,184,166,0.15)] hover:shadow-[0_12px_40px_rgba(20,184,166,0.25)] border-white/50 group transition-all duration-300 cursor-pointer"
      >
        {/* Pulsing Outer Ring (Green/Mint) */}
        <span className="absolute inset-0 rounded-full bg-mint/10 animate-ping opacity-75" />

        {/* Dynamic Multicolor Glow Underlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-mint/10 via-aqua/10 to-lavender/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

        {/* WhatsApp Icon (Vibrant green/mint aesthetic matching branding) */}
        <svg
          className="w-7 h-7 text-mint-dark group-hover:text-mint transition-colors duration-300 z-10"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.13-1.347a9.947 9.947 0 0 0 4.88 1.282h.005c5.505 0 9.99-4.478 9.99-9.985 0-2.667-1.04-5.176-2.93-7.065A9.923 9.923 0 0 0 12.012 2zm5.727 14.045c-.244.693-1.42 1.262-1.956 1.344-.479.073-1.103.137-3.224-.741-2.715-1.124-4.46-3.887-4.597-4.068-.135-.181-1.102-1.464-1.102-2.793 0-1.329.697-1.984.97-2.257.274-.273.595-.341.794-.341.2 0 .399.001.573.01.18.008.419-.07.658.502.244.585.83 2.03.902 2.179.072.15.12.322.02.522-.1.2-.149.324-.298.497-.15.173-.314.385-.448.517-.15.148-.306.31-.132.61.174.3.774 1.278 1.66 2.067.944.844 1.74 1.107 1.989 1.232.25.125.393.104.539-.065.144-.17.622-.723.789-.97.168-.246.335-.207.564-.122.23.085 1.458.687 1.708.812.25.125.416.188.478.297.062.109.062.63-.182 1.323z" />
        </svg>

        {/* Pulse Online Dot */}
        <span className="absolute top-1 right-1 flex h-3 w-3 z-20">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-[#FAF9F6] dark:border-slate-950"></span>
        </span>
      </motion.a>
    </div>
  );
}
