"use client";

import { motion } from "framer-motion";
import { Award, Briefcase, GraduationCap, Globe, HeartHandshake, Quote } from "lucide-react";
import Image from "next/image";
import Magnetic from "./Magnetic";

export default function DoctorProfile() {
  const credentials = [
    {
      year: "BHMS",
      title: "Nashik University Graduate",
      institution: "Completed 5.5 years of intensive clinical homeopathic medicine and surgery.",
      icon: <GraduationCap className="w-4 h-4 text-mint" />,
    },
    {
      year: "MD",
      title: "Doctor of Medicine",
      institution: "Completed 3 years of advanced postgraduate clinical specialization at Nashik University.",
      icon: <Briefcase className="w-4 h-4 text-aqua" />,
    },
    {
      year: "2005",
      title: "Ramkrishna Consultancy Founder",
      institution: "Established the main consultation clinic in Baner, Pune in April 2005.",
      icon: <Award className="w-4 h-4 text-lavender" />,
    },
    {
      year: "Present",
      title: "Homeo Healthcare Founder",
      institution: "Directing clinical care for over 10,000+ treated patients with 20+ years of professional experience.",
      icon: <Globe className="w-4 h-4 text-sky" />,
    },
  ];

  const testimonials = [
    {
      quote: "Dr. Narayan is exceptionally skilled. He detected my swine flu early based on basic reports and cured it quickly. Our entire family has trusted only him for over 5 years.",
      author: "Amol R.",
      location: "Pune, IN",
      yOffset: [0, -10, 0],
      duration: 6,
    },
    {
      quote: "I've received treatment for diabetes here for 5 years. Dr. Jethwani's clinical expertise, combined with his humble and human approach, has given me wonderful long-term recovery.",
      author: "Ramesh D.",
      location: "Pune, IN",
      yOffset: [0, 10, 0],
      duration: 8,
      delay: 0.5,
    },
    {
      quote: "Highly qualified doctor with excellent experience. His precise constitutional medicines successfully dissolved my kidney stone and helped me avoid a planned surgical operation.",
      author: "Milind S.",
      location: "Pune, IN",
      yOffset: [0, -8, 0],
      duration: 7,
      delay: 1,
    },
  ];

  return (
    <section id="doctor" className="relative py-32 px-6 bg-gradient-to-b from-transparent to-white/10 overflow-hidden">
      
      {/* Soft moving background aura glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-mint/5 to-lavender/5 opacity-80 blur-[80px] top-[30%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-pulse-slow" />

      <div className="max-w-7xl mx-auto z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Portrait & Floating Testimonials */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center min-h-[550px]">
            
            {/* Ultra premium portrait representation (Minimalist Glass Frame with animated inner light) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[340px] h-[440px] rounded-[40px] glass-panel border-white/60 p-3 shadow-[0_20px_50px_rgba(20,184,166,0.04)] overflow-hidden z-10"
            >
              <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-gradient-to-tr from-beige to-white/90 flex flex-col justify-between p-8 border border-white/20">
                {/* Doctor Portrait Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/images/dr_jethwani_profile.png"
                    alt="Dr. Narayan Jethwani"
                    fill
                    sizes="(max-width: 768px) 100vw, 340px"
                    className="object-cover object-center transition-transform duration-700 hover:scale-105"
                    priority
                  />
                  {/* Subtle dark gradient overlay at the bottom and top to ensure high readability of overlaid text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/20" />
                </div>

                {/* Content inside portrait frame */}
                <div className="z-20 self-start flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-sm">
                  <HeartHandshake className="w-5 h-5 text-white" />
                </div>

                <div className="z-20 text-white">
                  <div className="text-[10px] text-mint font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-mint breathe" />
                    Chief Consultant
                  </div>
                  <h3 className="font-serif text-3xl font-bold text-white mb-1 leading-none">Dr. Narayan Jethwani</h3>
                  <p className="text-xs text-white/80 font-semibold tracking-wide">
                    Senior Homeopath & Genetic Constitutionalist
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Testimonials drifting in the background */}
            {testimonials.map((test, idx) => (
              <motion.div
                key={test.author}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                animate={{
                  y: test.yOffset,
                }}
                className={`absolute glass-panel p-6 rounded-2xl border-white/50 shadow-[0_8px_32px_rgba(20,184,166,0.03)] max-w-[280px] z-20 ${
                  idx === 0 
                    ? "top-0 -left-10 md:-left-16" 
                    : idx === 1 
                    ? "bottom-0 -right-4 md:-right-12"
                    : "top-1/3 -right-10 md:-right-16 hidden sm:block"
                }`}
              >
                <Quote className="w-4 h-4 text-mint/30 mb-2" />
                <p className="text-[10px] text-slate-800 font-semibold leading-relaxed mb-3">
                  &ldquo;{test.quote}&rdquo;
                </p>
                <div className="flex items-center justify-between border-t border-slate-900/5 pt-2">
                  <span className="text-[9px] font-bold text-[#1A2421]">{test.author}</span>
                  <span className="text-[8px] text-slate-600 font-bold uppercase tracking-wider">{test.location}</span>
                </div>
              </motion.div>
            ))}

          </div>

          {/* Right Column: Bio & Credentials Timeline */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-xs font-bold text-mint uppercase tracking-widest mb-4 inline-flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-mint breathe" />
              Meet the Doctor
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl font-semibold tracking-tight text-[#1A2421] mb-6"
            >
              Calm Confidence. Compassionate Healing.
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-sm text-slate-700 font-semibold leading-relaxed mb-10"
            >
              Dr. Narayan Jethwani integrates centuries-old homeopathic knowledge with modern scientific diagnostics. With a focus on genetic mapping and long-term vitality, he provides constitutional remedies that align with your unique biological blueprint.
            </motion.p>

            {/* Credentials timeline */}
            <div className="w-full space-y-6">
              {credentials.map((cred, idx) => (
                <motion.div
                  key={cred.year}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  className="flex gap-4 group"
                >
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-slate-200 shadow-sm group-hover:border-mint transition-colors">
                      {cred.icon}
                    </div>
                    {idx !== credentials.length - 1 && (
                      <div className="w-0.5 bg-slate-200 group-hover:bg-mint/30 transition-colors flex-grow my-2 min-h-[30px]" />
                    )}
                  </div>
                  <div className="pb-4">
                    <span className="text-[10px] font-bold text-mint uppercase tracking-wider">{cred.year}</span>
                    <h4 className="text-sm font-bold text-[#1A2421] leading-tight mb-1">{cred.title}</h4>
                    <p className="text-[11px] text-slate-700 font-semibold leading-relaxed">{cred.institution}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8">
              <Magnetic>
                <a
                  href="#booking"
                  className="px-7 py-3 rounded-full bg-slate-900 text-white hover:bg-mint hover:shadow-[0_8px_25px_rgba(20,184,166,0.3)] font-semibold transition-all duration-500 text-xs tracking-wider uppercase cursor-pointer"
                >
                  Consult Dr. Jethwani
                </a>
              </Magnetic>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
