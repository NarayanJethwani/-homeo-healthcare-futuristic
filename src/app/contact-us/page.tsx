"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, Mail, MessageSquare, MapPin, Clock, 
  Video, Send, CheckCircle2, Navigation, ArrowLeft
} from "lucide-react";
import Magnetic from "@/components/Magnetic";
import Link from "next/link";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Constitutional Consultation",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "Constitutional Consultation",
        message: ""
      });
      // Clear message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1200);
  };

  const clinics = [
    {
      badge: "🆕 New Clinic",
      name: "Homeo Healthcare — Pyramid Axis",
      role: "Main Consultation Centre",
      address: "Office 404, 4th Floor, Pyramid Axis, Baner Road, Behind Croma Showroom, Veerbhadra Nagar, Baner, Pune – 411045",
      landmark: "Behind Croma Showroom, Baner Road · 4th Floor",
      phone: "+91 84460 56789",
      mapUrl: "https://maps.google.com/?q=Office+404,+Pyramid+Axis,+Baner+Road,+Behind+Croma,+Pune",
      glowColor: "rgba(20,184,166,0.15)"
    },
    {
      badge: "📍 Original Clinic",
      name: "Ramkrishna Homeopathic Consultancy",
      role: "Established Practice",
      address: "Shop No. 2, Seema Park, Baner Road, Opp. Savata Mali Temple, Near Sattva Hotel, Baner, Pune – 411069",
      landmark: "Opposite Savata Mali (Sawatamali) Temple · Near Sattva Hotel, Baner Road",
      phone: "+91 84460 56789",
      mapUrl: "https://maps.google.com/?q=Shop+2,+Seema+Park,+Baner+Road,+Opp+Savata+Mali+Temple,+Pune",
      glowColor: "rgba(168,85,247,0.15)"
    }
  ];

  const hours = [
    { days: "Monday – Friday", time: "10:00 AM – 2:00 PM", type: "Morning OPD" },
    { days: "Monday – Friday", time: "5:00 PM – 8:00 PM", type: "Evening OPD" },
    { days: "Saturday", time: "10:00 AM – 2:00 PM", type: "Morning only" },
    { days: "Sunday & Holidays", time: "By Appointment Only", type: "WhatsApp to confirm" }
  ];

  return (
    <div className="pt-32 pb-24 px-6 relative">
      <div className="max-w-7xl mx-auto z-10 relative">
        
        {/* Back to Homepage Button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Magnetic>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-mint/20 hover:border-mint/60 bg-mint/5 hover:bg-mint/10 text-mint-dark hover:text-[#0c6b5e] text-xs font-bold uppercase tracking-wider transition-all duration-300 backdrop-blur-md cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </Link>
          </Magnetic>
        </motion.div>

        {/* Page Hero Header */}
        <div className="max-w-3xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xs font-bold text-mint uppercase tracking-widest mb-4 inline-flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-mint breathe" />
            Find Us & Get in Touch
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl font-semibold tracking-tight text-[#1A2421] mb-6"
          >
            Contact & Directions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-base text-slate-700 font-semibold leading-relaxed"
          >
            Connect with us for standard in-person consultation across Pune, or schedule high-fidelity online telehealth care active worldwide.
          </motion.p>
        </div>

        {/* Primary Contact Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="glass-panel border-white/60 bg-white/40 p-6 rounded-3xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 shadow-sm text-mint">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-700 font-bold uppercase tracking-wider">Appointments</span>
              <a href="tel:+918446056789" className="text-base font-extrabold text-[#1A2421] hover:text-mint transition-colors cursor-pointer">
                +91 84460 56789
              </a>
            </div>
          </div>

          <div className="glass-panel border-white/60 bg-white/40 p-6 rounded-3xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 shadow-sm text-aqua">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-700 font-bold uppercase tracking-wider">WhatsApp Support</span>
              <a href="https://wa.me/918446056789" target="_blank" rel="noopener noreferrer" className="text-base font-extrabold text-[#1A2421] hover:text-mint transition-colors cursor-pointer">
                84460 56789
              </a>
            </div>
          </div>

          <div className="glass-panel border-white/60 bg-white/40 p-6 rounded-3xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 shadow-sm text-purple-500">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-700 font-bold uppercase tracking-wider">Email Inquiry</span>
              <a href="mailto:narayan.jethwani@gmail.com" className="text-sm font-extrabold text-[#1A2421] hover:text-mint transition-colors cursor-pointer">
                narayan.jethwani@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Split Grid: Clinics info & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 items-start">
          
          {/* Left Column: Clinics & Timings */}
          <div className="lg:col-span-6 space-y-8">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight text-[#1A2421]">
              Two Locations, One Standard of Care
            </h2>

            {/* Clinics Card list */}
            <div className="space-y-6">
              {clinics.map((c, idx) => (
                <div 
                  key={idx}
                  className="glass-panel border-white/60 hover:border-white/80 bg-white/30 rounded-3xl p-6 relative overflow-hidden transition-all duration-300 group shadow-sm"
                >
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                      background: `radial-gradient(circle at 80% 20%, ${c.glowColor} 0%, transparent 60%)`
                    }}
                  />
                  <div className="relative z-10 space-y-4">
                    <span className="inline-block text-[9px] font-extrabold uppercase bg-mint/10 border border-mint/20 text-mint-dark px-2.5 py-0.5 rounded-full">
                      {c.badge}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-[#1A2421] leading-none mb-1">{c.name}</h3>
                      <span className="text-[10px] text-slate-700 font-bold uppercase tracking-wider">{c.role}</span>
                    </div>
                    
                    <div className="space-y-2 text-xs text-slate-700 font-semibold leading-relaxed">
                      <p className="flex gap-2"><MapPin className="w-4 h-4 text-mint flex-shrink-0 mt-0.5" /> {c.address}</p>
                      <p className="flex gap-2"><Clock className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" /> Landmark: {c.landmark}</p>
                    </div>

                    <div className="pt-2 flex flex-wrap gap-3">
                      <Magnetic>
                        <a
                          href={c.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-white border border-slate-200 hover:border-slate-800 text-[#1A2421] rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-300 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Navigation className="w-3.5 h-3.5" /> Get Directions
                        </a>
                      </Magnetic>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Timings Card */}
            <div className="glass-panel border-white/60 bg-white/40 p-6 rounded-3xl space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-[#1A2421] flex items-center gap-2">
                <Clock className="w-5 h-5 text-mint" /> Clinic Timings
              </h3>
              <div className="space-y-3 font-semibold">
                {hours.map((h, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs pb-2 border-b border-slate-900/5 last:border-b-0 last:pb-0">
                    <span className="text-slate-700">{h.days}</span>
                    <div className="text-right">
                      <span className="block text-slate-950 font-bold">{h.time}</span>
                      <span className="text-[9px] text-slate-700 uppercase tracking-widest">{h.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Inquiries Form */}
          <div className="lg:col-span-6">
            <div className="glass-panel border-white/60 bg-white/40 p-8 rounded-[36px] shadow-sm relative">
              <h3 className="font-serif text-2xl font-semibold tracking-tight text-[#1A2421] mb-6">
                Send an Inquiry Message
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4 font-semibold">
                <div>
                  <label className="block text-[10px] text-slate-700 uppercase tracking-widest mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-mint bg-white/60 focus:bg-white text-xs outline-none transition-all placeholder:text-slate-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-700 uppercase tracking-widest mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-mint bg-white/60 focus:bg-white text-xs outline-none transition-all placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-700 uppercase tracking-widest mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-mint bg-white/60 focus:bg-white text-xs outline-none transition-all placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-700 uppercase tracking-widest mb-1.5">Subject / Case</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-mint bg-white/60 focus:bg-white text-xs outline-none transition-all"
                  >
                    <option value="Constitutional Consultation">Constitutional Consultation</option>
                    <option value="Skin/Psoriasis Recovery">Skin/Psoriasis Recovery</option>
                    <option value="Respiratory/Asthma Program">Respiratory/Asthma Program</option>
                    <option value="Pediatric Wellness Program">Pediatric Wellness Program</option>
                    <option value="General Chronic Alignment">General Chronic Alignment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-700 uppercase tracking-widest mb-1.5">Your Medical Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Briefly describe your chronic symptoms, duration, prior medication, and diagnostic details..."
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-mint bg-white/60 focus:bg-white text-xs outline-none transition-all placeholder:text-slate-500 resize-none"
                  />
                </div>

                <div className="pt-2">
                  <Magnetic>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-mint hover:bg-mint-dark text-white rounded-full font-bold uppercase tracking-wider text-xs shadow-sm shadow-mint/10 transition-all duration-300 flex items-center justify-center gap-2 disabled:bg-slate-350 cursor-pointer"
                    >
                      {isSubmitting ? "Transmitting..." : "Send Clinical Message"}
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </Magnetic>
                </div>
              </form>

              {/* Success Notification Popup */}
              <AnimatePresence>
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute inset-x-8 bottom-8 bg-emerald-600 text-white rounded-2xl p-4 flex items-center gap-3 shadow-lg"
                  >
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <div className="text-xs font-semibold leading-relaxed">
                      Message transmitted successfully. Our Baner clinic OPD desks will call or WhatsApp you within 24 hours.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* Global Telehealth segment */}
        <div className="glass-panel border-white/60 bg-white/30 rounded-[32px] p-8 md:p-12 flex flex-col lg:flex-row gap-8 items-center justify-between">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-mint uppercase tracking-wider">
              <Video className="w-5 h-5" /> Online Consultations Available Worldwide
            </div>
            <h3 className="text-2xl font-bold text-[#1A2421]">Can't Visit in Person? Consult Online</h3>
            <p className="text-xs md:text-sm text-slate-700 font-semibold leading-relaxed">
              We offer the exact same clinical thoroughness as an in-person visit. Set up video calls via WhatsApp Video, Google Meet, or Zoom. Homeopathic remedies are securely shipped to patients across India, USA, UK, UAE, Australia, and worldwide.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <Magnetic>
              <button
                onClick={() => window.open("https://wa.me/918446056789", "_blank")}
                className="w-full sm:w-auto px-6 py-3.5 bg-mint hover:bg-mint-dark text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Book on WhatsApp Video
              </button>
            </Magnetic>
          </div>
        </div>

      </div>
    </div>
  );
}
