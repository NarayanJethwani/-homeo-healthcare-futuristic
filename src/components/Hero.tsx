"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, ShieldCheck, HeartPulse, Video, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Magnetic from "./Magnetic";

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0px", "-80px"]);
  const yCards = useTransform(scrollYProgress, [0, 1], ["0px", "-130px"]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const statCards = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-mint" />,
      title: "Trusted Care",
      desc: "25+ Years of Clinical Expertise",
      delay: 0.5,
    },
    {
      icon: <HeartPulse className="w-5 h-5 text-aqua" />,
      title: "Personalized Treatment",
      desc: "Deep Constitutional Mapping",
      delay: 0.7,
    },
    {
      icon: <Sparkles className="w-5 h-5 text-lavender" />,
      title: "Holistic Healing",
      desc: "Mind, Body & Energy Harmony",
      delay: 0.9,
    },
    {
      icon: <Video className="w-5 h-5 text-sky" />,
      title: "Online Consultation",
      desc: "Global Telehealth Care",
      delay: 1.1,
    },
  ];

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Parallax Background */}
      <motion.div 
        style={{ y: yBg }}
        className="absolute inset-0 bg-gradient-mesh z-0 pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        
        {/* Left Column - Headline Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ y: yText }}
          className="lg:col-span-7 flex flex-col items-start text-left z-10"
        >
          {/* Back to Homepage Button */}
          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <Magnetic>
              <Link
                href="https://admin.homeo.healthcare/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-mint/20 hover:border-mint/60 bg-mint/5 hover:bg-mint/10 text-mint-dark hover:text-[#0c6b5e] text-xs font-bold uppercase tracking-wider transition-all duration-300 backdrop-blur-md cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Classic
              </Link>
            </Magnetic>
          </motion.div>

          {/* Pill Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-panel border-mint/20 text-xs font-semibold uppercase tracking-wider text-mint mb-8 shadow-[0_4px_12px_rgba(20,184,166,0.05)]"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Futuristic Homeopathy meets Scientific Precision</span>
          </motion.div>

          {/* Heading with split-word typography reveals */}
          <h1 className="font-serif text-5xl md:text-6xl xl:text-7xl font-semibold tracking-tight text-[#1A2421] leading-[1.08] mb-6 flex flex-wrap">
            {[
              { text: "Advanced", isGradient: false },
              { text: "Homeopathic", isGradient: true },
              { text: "Care", isGradient: false },
              { text: "for", isGradient: false },
              { text: "Modern", isGradient: false },
              { text: "Life", isGradient: false },
            ].map((word, idx) => (
              <span key={idx} className="inline-block overflow-hidden mr-[0.25em] pb-1">
                <motion.span
                  initial={{ y: "100%", rotate: 3 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{
                    duration: 1.2,
                    delay: idx * 0.08 + 0.3,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className={`inline-block origin-bottom-left ${
                    word.isGradient ? "text-gradient font-sans font-bold" : ""
                  }`}
                >
                  {word.text}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-slate-700 font-semibold tracking-wide max-w-xl mb-10 leading-relaxed"
          >
            Personalized healing. Scientific understanding. Compassionate care. Discover constitutional therapies tailored to your biological essence.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-5">
            <Magnetic>
              <a
                href="#booking"
                data-cursor="book"
                className="px-8 py-4 rounded-full bg-mint text-white font-semibold shadow-[0_8px_30px_rgb(20,184,166,0.25)] hover:shadow-[0_12px_40px_rgb(20,184,166,0.4)] transition-all duration-500 flex items-center gap-2 cursor-pointer text-sm group"
              >
                Book Consultation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Magnetic>
            
            <Magnetic>
              <a
                href="#conditions"
                data-cursor="explore"
                className="px-8 py-4 rounded-full glass-panel border-slate-200 hover:border-mint/30 hover:bg-white/60 text-slate-700 font-semibold transition-all duration-500 cursor-pointer text-sm"
              >
                Explore Treatments
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* Right Column - Drifting Cards Stack */}
        <motion.div 
          style={{ y: yCards }} 
          className="lg:col-span-5 relative w-full h-[450px] lg:h-[500px] flex items-center justify-center z-10"
        >
          
          {/* Central organic mesh glow (adds lighting depth) */}
          <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-mint/10 to-lavender/10 opacity-70 blur-[60px] animate-pulse-slow z-0" />

          {/* Floating Stats Grid */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-[460px] z-10">
            {statCards.map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 1.2,
                  delay: card.delay,
                  type: "spring",
                  stiffness: 70,
                  damping: 15,
                }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  borderColor: "rgba(20,184,166,0.3)"
                }}
                data-cursor="view"
                className="glass-panel glass-panel-hover rounded-3xl p-6 flex flex-col justify-between h-[180px] cursor-pointer border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.02)]"
              >
                <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white/60 border border-white/60 shadow-[0_4px_12px_rgba(0,0,0,0.02)] self-start">
                  {card.icon}
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-bold text-[#1A2421] leading-none mb-1.5">{card.title}</h3>
                  <p className="text-[11px] text-slate-700 font-semibold leading-normal">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Interactive floating pill graphic representing active remedy (micro-interaction) */}
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 10, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-12 left-10 glass-panel border-white/50 rounded-full py-1.5 px-3 flex items-center gap-1.5 shadow-[0_8px_32px_rgba(20,184,166,0.06)] z-20 text-[10px] font-bold text-slate-800"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-mint breathe" />
            Active Remedy
          </motion.div>

          <motion.div
            animate={{
              y: [0, 12, 0],
              rotate: [0, -8, 0]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-12 right-6 glass-panel border-white/50 rounded-full py-1.5 px-3 flex items-center gap-1.5 shadow-[0_8px_32px_rgba(168,85,247,0.06)] z-20 text-[10px] font-bold text-slate-800"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-lavender breathe" />
            Natural Mapping
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
