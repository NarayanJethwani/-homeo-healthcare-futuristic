"use client";

import { motion } from "framer-motion";
import { 
  Award, BookOpen, CheckCircle, ShieldCheck, Heart, 
  MapPin, ArrowRight, ArrowLeft, Activity, Sparkles,
  Baby, Stethoscope, User, Calendar, MessageCircle, ExternalLink
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Magnetic from "@/components/Magnetic";

export default function DrPoojaJethwaniPage() {
  const router = useRouter();

  const credentials = [
    { title: "BHMS (Homoeopathic Medicine & Surgery)", desc: "Comprehensive 5.5-year clinical degree with intensive hospital training." },
    { title: "PGDEMS (Emergency Medical Services)", desc: "Postgraduate clinical training in acute assessment and emergency triage." },
    { title: "8+ Years Clinical Practice", desc: "Consulting physician at Ramkrishna Homeopathic Consultancy & Homeo Healthcare." },
    { title: "2,000+ Patients Treated", desc: "Focused case management across hormonal, pediatric, and chronic conditions." },
    { title: "Specialist in Women's Health & PCOS", desc: "Constitutional homeopathic protocols for hormonal, menstrual, and thyroid health." },
    { title: "Pediatric & Family Care", desc: "Gentle, non-invasive therapeutic approaches tailored for infants and children." }
  ];

  const specialties = [
    {
      title: "Hormonal Imbalances & Women's Health",
      desc: "PCOS, thyroid concerns, menstrual irregularities, and perimenopausal transitions managed through constitutional homeopathic therapy.",
      icon: <Heart className="w-5 h-5 text-rose-500" />
    },
    {
      title: "Pediatric & Child Health",
      desc: "Gentle, safe homeopathic support for recurrent tonsillitis, childhood allergies, low immunity, and developmental wellbeing.",
      icon: <Baby className="w-5 h-5 text-mint" />
    },
    {
      title: "Chronic Conditions & Autoimmunity",
      desc: "Migraines, arthritis, eczema, and long-standing chronic ailments addressed by targeting root metabolic and miasmatic causes.",
      icon: <Activity className="w-5 h-5 text-aqua" />
    },
    {
      title: "Skin & Dermatological Disorders",
      desc: "Psoriasis, urticaria, stubborn acne, and lichen planus treated as external reflections of internal systemic imbalances.",
      icon: <ShieldCheck className="w-5 h-5 text-lavender-dark" />
    },
    {
      title: "Respiratory & Allergies",
      desc: "Asthma, allergic rhinitis, sinusitis, and persistent coughs managed to build long-term respiratory resilience.",
      icon: <Stethoscope className="w-5 h-5 text-teal-500" />
    },
    {
      title: "Mental & Emotional Wellbeing",
      desc: "Anxiety, stress management, sleep disorders, and emotional fatigue supported with holistic, non-sedating homeopathic care.",
      icon: <Sparkles className="w-5 h-5 text-emerald-600" />
    }
  ];

  const philosophyItems = [
    {
      step: "01",
      title: "Comprehensive Case Taking",
      desc: "Understanding physical symptoms, emotional state, lifestyle factors, and medical history together in full context."
    },
    {
      step: "02",
      title: "Evidence-Informed Selection",
      desc: "Precise remedy matching rooted in classical Materia Medica, individualized rubrics, and clinical observation."
    },
    {
      step: "03",
      title: "Monitored Follow-Up",
      desc: "Structured follow-ups with objective symptom tracking to adjust dosages and support long-term recovery."
    }
  ];

  const stats = [
    { value: "8+", label: "Years Experience" },
    { value: "2k+", label: "Patients Treated" },
    { value: "95%", label: "Satisfaction Rate" },
    { value: "100%", label: "Individualized Care" }
  ];

  const handleWhatsAppChat = () => {
    window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918446056789"}?text=Hello%20Dr.%20Pooja%20Jethwani,%20I%20would%20like%20to%20inquire%20about%20a%20homeopathic%20consultation`, "_blank");
  };

  const handleBookConsultation = () => {
    router.push("/#booking");
  };

  return (
    <div className="pt-32 pb-24 px-6 relative">
      <div className="max-w-7xl mx-auto z-10 relative">
        
        {/* Navigation Top Line */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <Magnetic>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-mint/20 hover:border-mint/60 bg-mint/5 hover:bg-mint/10 text-mint-dark hover:text-[#0c6b5e] text-xs font-bold uppercase tracking-wider transition-all duration-300 backdrop-blur-md cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </Link>
          </Magnetic>

          <Magnetic>
            <Link
              href="/dr-narayan-jethwani"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-teal-500/20 hover:border-teal-500/60 bg-teal-500/5 hover:bg-teal-500/10 text-teal-700 dark:text-teal-400 text-xs font-bold uppercase tracking-wider transition-all duration-300 backdrop-blur-md cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              View Dr. Narayan Jethwani Profile
            </Link>
          </Magnetic>
        </div>

        {/* Profile Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-24 items-start">
          
          {/* Left Column: Stats & Profile Card */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="glass-panel border-white/60 bg-white/40 p-8 rounded-[36px] relative overflow-hidden"
            >
              <div className="absolute w-[250px] h-[250px] rounded-full bg-gradient-to-tr from-mint/10 to-transparent blur-[40px] -top-10 -left-10 pointer-events-none" />
              
              {/* Doctor Profile Image Container */}
              <div className="w-full aspect-[4/5] rounded-2xl border border-slate-200/60 overflow-hidden relative shadow-md group mb-8">
                <Image
                  src="/images/dr_pooja_jethwani_profile.jpg"
                  alt="Dr. Pooja Jethwani"
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                {/* Subtle dark gradient overlay at the bottom for caption overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />
                
                {/* Content Overlay */}
                <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                  <h4 className="text-xl font-serif font-bold text-white">Dr. Pooja Jethwani</h4>
                  <p className="text-xs font-bold text-mint uppercase tracking-wider mt-0.5">BHMS · PGDEMS</p>
                  <p className="text-[10px] text-white/85 font-medium mt-2.5 italic max-w-xs leading-relaxed">
                    &quot;Healing that is personal, methodical, and deeply listened to — treating the whole individual, not merely the disease.&quot;
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((s, idx) => (
                  <div key={idx} className="p-4 border border-white/60 bg-white/50 rounded-2xl text-center">
                    <span className="block text-2xl font-extrabold text-[#1A2421]">{s.value}</span>
                    <span className="text-[9px] text-slate-700 font-bold uppercase tracking-wider">{s.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Narrative Biography */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-xs font-bold text-mint uppercase tracking-widest mb-4 inline-flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-mint breathe" />
                8+ Years Dedicated Clinical Practice
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.1 }}
                className="font-serif text-4xl md:text-5xl font-semibold tracking-tight text-[#1A2421] mb-6"
              >
                Dr. Pooja Jethwani
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="space-y-6 text-sm text-slate-700 font-semibold leading-relaxed"
              >
                <p>
                  Dr. Pooja Jethwani (BHMS, PGDEMS) is a compassionate homeopathic physician and clinical consultant at <strong className="text-[#1A2421]">Homeo Healthcare</strong> and <strong className="text-[#1A2421]">Ramkrishna Homeopathic Consultancy</strong> in Baner, Pune.
                </p>
                <p>
                  With specialized focus on women&apos;s health, hormonal regulation, and pediatric constitutional homeopathy, Dr. Pooja brings rigorous diagnostic evaluation and individualized remedy mapping to every clinical consultation.
                </p>
                <p>
                  Working collaboratively alongside <Link href="/dr-narayan-jethwani" className="text-teal-700 hover:text-teal-900 underline font-bold">Dr. Narayan Jethwani MD (Hom.)</Link>, she advances the clinical standard of evidence-based homeopathic care across acute and chronic patient pathways.
                </p>
              </motion.div>
            </div>

            {/* Quick Credentials List */}
            <div className="border-t border-slate-900/5 pt-8">
              <h3 className="text-base font-bold text-[#1A2421] mb-4">Credentials & Clinical Focus</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {credentials.map((cred, idx) => (
                  <div key={idx} className="flex gap-3">
                    <CheckCircle className="w-4 h-4 text-mint flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs font-bold text-slate-900 leading-none mb-1">{cred.title}</span>
                      <span className="text-[10px] text-slate-700 font-semibold">{cred.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA row */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Magnetic>
                <button
                  onClick={handleBookConsultation}
                  className="bg-mint hover:bg-mint-dark text-white font-bold uppercase tracking-wider text-xs px-8 py-4 rounded-full shadow-sm shadow-mint/10 transition-all duration-300 cursor-pointer flex items-center gap-2"
                >
                  Book Consultation <ArrowRight className="w-4 h-4" />
                </button>
              </Magnetic>
              <Magnetic>
                <button
                  onClick={handleWhatsAppChat}
                  className="glass-panel border-[#0F766E]/20 text-[#0F766E] bg-[#0F766E]/5 hover:bg-[#0F766E]/10 px-8 py-4 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer flex items-center gap-2"
                >
                  WhatsApp Dr. Pooja <MessageCircle className="w-4 h-4" />
                </button>
              </Magnetic>
            </div>
          </div>

        </div>

        {/* Clinical Focus & Specialties */}
        <div className="border-t border-slate-900/5 pt-20">
          <div className="max-w-3xl mb-16 text-left">
            <span className="text-[10px] text-mint font-bold uppercase tracking-widest">Clinical Care Areas</span>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-[#1A2421] mt-2 mb-4">
              Areas of Clinical Expertise
            </h2>
            <p className="text-sm text-slate-700 font-semibold leading-relaxed">
              Every concern is approached through detailed constitutional assessment, symptom totality, and individualized remedy selection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specialties.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className="glass-panel border-white/60 bg-white/40 p-8 rounded-3xl"
              >
                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mb-6 shadow-sm">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-[#1A2421] mb-2">{item.title}</h3>
                <p className="text-xs text-slate-700 font-semibold leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 3-Step Clinical Philosophy */}
        <div className="border-t border-slate-900/5 pt-20 mt-20">
          <div className="max-w-3xl mb-16 text-left">
            <span className="text-[10px] text-mint font-bold uppercase tracking-widest">Care Methodology</span>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-[#1A2421] mt-2 mb-4">
              A Rigorous, Patient-Centered Approach
            </h2>
            <p className="text-sm text-slate-700 font-semibold leading-relaxed">
              Integrating classical principles with structured follow-ups to ensure lasting recovery and measurable wellbeing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {philosophyItems.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="glass-panel border-white/60 bg-white/50 p-8 rounded-3xl relative overflow-hidden"
              >
                <span className="text-4xl font-black text-teal-600/15 mb-4 block">{item.step}</span>
                <h3 className="text-base font-bold text-[#1A2421] mb-2">{item.title}</h3>
                <p className="text-xs text-slate-700 font-semibold leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Cross-Link Banner: Meet Dr. Narayan Jethwani */}
        <div className="glass-panel border-teal-500/20 bg-gradient-to-r from-teal-50/80 via-white/80 to-emerald-50/80 rounded-[32px] p-8 md:p-12 mt-24 flex flex-col md:flex-row gap-8 items-center justify-between shadow-sm">
          <div className="flex items-center gap-6">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-teal-500/30 flex-shrink-0 shadow-sm">
              <Image
                src="/images/dr_jethwani_profile.png"
                alt="Dr. Narayan B. Jethwani"
                fill
                sizes="80px"
                className="object-cover object-center"
              />
            </div>
            <div className="space-y-1.5 max-w-xl">
              <span className="text-[9px] text-teal-800 font-bold uppercase tracking-wider border border-teal-500/30 bg-white/80 px-2.5 py-0.5 rounded-full inline-block">
                Clinical Team & Co-Consultant
              </span>
              <h3 className="text-2xl font-bold text-[#1A2421]">Dr. Narayan B. Jethwani MD (Hom.)</h3>
              <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                Founder of Homeo Healthcare with 20+ years of expertise in chronic constitutional care, Kent&apos;s repertorisation, and multi-system chronic disorders.
              </p>
            </div>
          </div>
          <div className="flex gap-4 flex-shrink-0">
            <Magnetic>
              <Link
                href="/dr-narayan-jethwani"
                className="glass-panel border-teal-600/30 hover:border-teal-600 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md shadow-teal-600/10"
              >
                View Dr. Narayan Profile <ArrowRight className="w-4 h-4" />
              </Link>
            </Magnetic>
          </div>
        </div>

        {/* Practice Locations Card */}
        <div className="glass-panel border-white/60 bg-white/30 rounded-[32px] p-8 md:p-12 mt-12 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="space-y-3 max-w-xl">
            <span className="text-[9px] text-mint font-bold uppercase tracking-wider border border-mint/20 bg-white px-2 py-0.5 rounded-full">OPD Clinics</span>
            <h3 className="text-2xl font-bold text-[#1A2421]">Ramkrishna Homeopathic Consultancy</h3>
            <p className="text-xs text-slate-700 font-semibold leading-relaxed">
              Dr. Pooja Jethwani consults at Ramkrishna Homeopathy in Baner, Pune (Pyramid Axis &amp; Seema Park). In-person and online telehealth consultations available.
            </p>
          </div>
          <div className="flex gap-4">
            <Magnetic>
              <Link
                href="/contact-us"
                className="glass-panel border-slate-200 hover:border-slate-800 text-[#1A2421] bg-white/50 px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
              >
                View Map &amp; Directions <MapPin className="w-4 h-4" />
              </Link>
            </Magnetic>
          </div>
        </div>

      </div>
    </div>
  );
}
