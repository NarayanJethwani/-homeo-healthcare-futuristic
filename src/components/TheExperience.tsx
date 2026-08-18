"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Check, ClipboardList, Flame, Heart, Sparkles, Compass, ShieldCheck } from "lucide-react";
import PotencySimulator from "./PotencySimulator";

export default function TheExperience() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Hook up scroll progress of this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // Smooth scrollProgress with physics
  const pathLength = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 15,
  });

  const steps = [
    {
      icon: <ClipboardList className="w-5 h-5 text-mint" />,
      title: "Structured Assessment",
      desc: "A detailed review of your symptoms, medical history, current medicines, investigations, priorities and care goals.",
      align: "left",
    },
    {
      icon: <Flame className="w-5 h-5 text-aqua" />,
      title: "Whole-Person Review",
      desc: "Identifying symptom patterns, possible triggers and factors that may need conventional investigation or referral.",
      align: "right",
    },
    {
      icon: <Sparkles className="w-5 h-5 text-lavender" />,
      title: "Individualized Plan",
      desc: "The physician explains the proposed homeopathic approach, scope, limits, follow-up plan and alternatives before you begin.",
      align: "left",
    },
    {
      icon: <Heart className="w-5 h-5 text-rose-500" />,
      title: "Holistic Care",
      desc: "Considering physical symptoms, emotional wellbeing, sleep, nutrition and the treatment already provided by your medical team.",
      align: "right",
    },
    {
      icon: <Compass className="w-5 h-5 text-sky" />,
      title: "Lifestyle Guidance",
      desc: "Practical guidance on diet, sleep, activity and symptom tracking when it is appropriate for your individual situation.",
      align: "left",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-mint" />,
      title: "Review and Reassessment",
      desc: "Monitoring progress against agreed goals and modifying, pausing or referring care when the expected response is not seen.",
      align: "right",
    },
  ];

  return (
    <section id="experience" ref={containerRef} className="relative py-32 px-6 overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-mint/3 to-aqua/3 opacity-50 blur-[100px] -left-[200px] top-[20%] pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-lavender/3 to-sky/3 opacity-50 blur-[100px] -right-[200px] bottom-[20%] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-28">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-xs font-bold text-mint uppercase tracking-widest mb-4 inline-flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-mint breathe" />
            The Healing Pathway
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl font-semibold tracking-tight text-[#1A2421] mb-6"
          >
            Our Therapeutic Philosophy
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-base text-slate-700 font-semibold"
          >
            A clear, physician-led process with safety checks, informed choices and planned reassessment.
          </motion.p>
        </div>

        {/* Timeline body */}
        <div className="relative">
          
          {/* Central Connecting Line (Desktop) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-slate-900/5 hidden md:block">
            {/* SVG Overlay to handle path drawing */}
            <svg className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1.5 h-full" fill="none">
              <motion.line
                x1="3"
                y1="0"
                x2="3"
                y2="100%"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                style={{ pathLength }}
              />
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="100%">
                  <stop offset="0%" stopColor="#14B8A6" />
                  <stop offset="50%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Timeline Steps */}
          <div className="space-y-16 md:space-y-24">
            {steps.map((step, idx) => {
              const isLeft = step.align === "left";
              return (
                <div
                  key={step.title}
                  className={`flex flex-col md:flex-row relative items-center ${
                    isLeft ? "md:justify-start" : "md:justify-end"
                  }`}
                >
                  
                  {/* Timeline node dot (Desktop center) */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-10 h-10 hidden md:flex items-center justify-center z-20">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: "-120px" }}
                      transition={{ type: "spring", stiffness: 100, damping: 12, delay: idx * 0.1 }}
                      className="w-5 h-5 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center group-hover:border-mint transition-colors"
                    >
                      <motion.div
                        className="w-2.5 h-2.5 rounded-full bg-mint"
                        animate={{
                          scale: [1, 1.3, 1],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: idx * 0.5,
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Card content wrapper */}
                  <motion.div
                    initial={{ opacity: 0, x: isLeft ? -60 : 60, rotate: isLeft ? -4 : 4 }}
                    whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ type: "spring", stiffness: 70, damping: 15 }}
                    className={`w-full md:w-[45%] flex ${
                      isLeft ? "md:justify-end" : "md:justify-start"
                    }`}
                  >
                    <div className="glass-panel glass-panel-hover rounded-3xl p-8 border-white/50 w-full relative group">
                      
                      {/* Top border glowing gradient outline */}
                      <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-mint/10 pointer-events-none transition-colors" />

                      {/* Header with Icon */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white/70 border border-white/70 shadow-sm">
                          {step.icon}
                        </div>
                        <h3 className="text-lg font-bold text-[#1A2421]">{step.title}</h3>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Dynamic dilution potency visualizer */}
        <PotencySimulator />

      </div>
    </section>
  );
}
