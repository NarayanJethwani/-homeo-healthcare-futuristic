"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Calendar as CalendarIcon, Clock, ChevronRight, ChevronLeft, CheckCircle2, Sparkles, Activity } from "lucide-react";
import Magnetic from "./Magnetic";

export default function BookingSection() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    symptoms: "",
    date: "",
    slot: "",
  });

  useEffect(() => {
    const handlePrefill = (e: Event) => {
      const customEvent = e as CustomEvent<{ category: string; symptomsPrefill: string }>;
      if (customEvent.detail) {
        setFormData((prev) => ({
          ...prev,
          category: customEvent.detail.category,
          symptoms: customEvent.detail.symptomsPrefill,
        }));
        setStep(2); // Jump straight to Step 2: Constitutional Mapping!

        // Smooth scroll to booking section
        const bookingSection = document.getElementById("booking");
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    window.addEventListener("prefill-booking", handlePrefill);
    return () => {
      window.removeEventListener("prefill-booking", handlePrefill);
    };
  }, []);

  const categories = [
    "Skin Disorders",
    "Respiratory Care",
    "Arthritis & Joints",
    "Kidney Stones",
    "Liver Disorders",
    "Child Health",
    "Mental Wellness",
    "Gut Health",
    "Other",
  ];

  const slots = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "06:00 PM"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectCategory = (cat: string) => {
    setFormData((prev) => ({ ...prev, category: cat }));
  };

  const selectSlot = (s: string) => {
    setFormData((prev) => ({ ...prev, slot: s }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(4); // Success step
  };

  const isStep1Valid = formData.name && formData.email && formData.phone;
  const isStep2Valid = formData.category && formData.symptoms;
  const isStep3Valid = formData.date && formData.slot;

  const getWhatsAppMessageLink = () => {
    const text = `Hello Dr. Narayan, I have scheduled a consultation request:
- *Name:* ${formData.name}
- *Category:* ${formData.category}
- *Date:* ${formData.date}
- *Time Slot:* ${formData.slot}
- *Primary Symptoms:* ${formData.symptoms}

Please confirm my appointment.`;
    return `https://wa.me/918446056789?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="booking" className="relative py-32 px-6">
      
      {/* Decorative gradients */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-aqua/4 via-mint/4 to-transparent opacity-40 blur-[100px] top-[10%] right-0 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-lavender/3 to-transparent opacity-30 blur-[80px] bottom-0 left-0 pointer-events-none" />

      <div className="max-w-4xl mx-auto z-10 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-xs font-bold text-mint uppercase tracking-widest mb-4 inline-flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-mint breathe" />
            Digital Clinic
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl font-semibold tracking-tight text-[#1A2421] mb-6"
          >
            Schedule Your Consultation
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-base text-slate-700 font-semibold"
          >
            Begin your personalized roadmap to natural vitality. Select clinical or virtual consultations.
          </motion.p>
        </div>

        {/* Interactive Booking Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel rounded-[36px] border-white/60 p-8 md:p-12 shadow-[0_20px_50px_rgba(20,184,166,0.03)] overflow-hidden"
        >
          {/* Progress Indicator (only visible during form stages) */}
          {step <= 3 && (
            <div className="flex items-center justify-between mb-12 border-b border-slate-900/5 pb-6">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 border ${
                      step === s
                        ? "bg-mint text-white border-mint glow-mint"
                        : step > s
                        ? "bg-mint/10 text-mint border-mint/20"
                        : "bg-white/50 text-slate-400 border-slate-200"
                    }`}
                  >
                    {s}
                  </div>
                  <span
                    className={`text-xs font-semibold hidden sm:inline ${
                      step === s ? "text-[#1A2421]" : "text-slate-400"
                    }`}
                  >
                    {s === 1 ? "Personal Details" : s === 2 ? "Constitutional Mapping" : "Preferred Slot"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* Step 1: Personal Details */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-bold text-[#1A2421] mb-6">Patient Identification</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name input */}
                    <div className="relative group">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:border-mint focus:ring-1 focus:ring-mint outline-none bg-white/40 backdrop-blur-sm transition-all duration-300 font-medium text-sm text-[#1A2421]"
                          required
                        />
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-mint transition-colors" />
                      </div>
                    </div>

                    {/* Email input */}
                    <div className="relative group">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="john@example.com"
                          className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:border-mint focus:ring-1 focus:ring-mint outline-none bg-white/40 backdrop-blur-sm transition-all duration-300 font-medium text-sm text-[#1A2421]"
                          required
                        />
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-mint transition-colors" />
                      </div>
                    </div>
                  </div>

                  {/* Phone input */}
                  <div className="relative group max-w-md">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Phone Number</label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 000-0000"
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:border-mint focus:ring-1 focus:ring-mint outline-none bg-white/40 backdrop-blur-sm transition-all duration-300 font-medium text-sm text-[#1A2421]"
                        required
                      />
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-mint transition-colors" />
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-6 flex justify-end">
                    <Magnetic>
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={!isStep1Valid}
                        className={`px-7 py-3.5 rounded-full font-semibold transition-all duration-500 text-xs tracking-wider uppercase flex items-center gap-1.5 ${
                          isStep1Valid
                            ? "bg-mint text-white shadow-md hover:shadow-lg cursor-pointer"
                            : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                        }`}
                      >
                        Mapping Details
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </Magnetic>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Constitutional Mapping */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-bold text-[#1A2421] mb-2">Constitutional Symptom Mapping</h3>
                    <p className="text-xs text-slate-700 mb-6 font-bold">Select the health category requiring evaluation:</p>
                  </div>

                  {/* Category Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => selectCategory(cat)}
                        className={`px-4 py-3 rounded-2xl text-xs font-bold border transition-all duration-300 text-left ${
                          formData.category === cat
                            ? "bg-mint/10 border-mint text-mint-dark font-bold shadow-sm"
                            : "bg-white/40 border-slate-200 text-slate-700 hover:border-mint/30"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Symptom Textarea */}
                  <div className="relative group pt-4">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Symptom History & Mental Profile Description
                    </label>
                    <textarea
                      name="symptoms"
                      value={formData.symptoms}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Please briefly describe your primary physical symptoms, emotional state, duration, and any previous medical treatments."
                      className="w-full p-4 rounded-2xl border border-slate-200 focus:border-mint focus:ring-1 focus:ring-mint outline-none bg-white/40 backdrop-blur-sm transition-all duration-300 font-medium text-sm text-[#1A2421] resize-none"
                      required
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="pt-6 flex justify-between">
                    <Magnetic>
                      <button
                        type="button"
                        onClick={handleBack}
                        className="px-6 py-3.5 rounded-full border border-slate-200 text-slate-700 font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 hover:bg-slate-50"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                      </button>
                    </Magnetic>

                    <Magnetic>
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={!isStep2Valid}
                        className={`px-7 py-3.5 rounded-full font-semibold transition-all duration-500 text-xs tracking-wider uppercase flex items-center gap-1.5 ${
                          isStep2Valid
                            ? "bg-mint text-white shadow-md hover:shadow-lg cursor-pointer"
                            : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                        }`}
                      >
                        Select Schedule
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </Magnetic>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Date & Slot Booking */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-bold text-[#1A2421] mb-6">Select Date and Consultation Slot</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Datepicker */}
                    <div className="relative group">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Preferred Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:border-mint focus:ring-1 focus:ring-mint outline-none bg-white/40 backdrop-blur-sm transition-all duration-300 font-semibold text-sm text-[#1A2421] h-[50px] inline-flex items-center"
                          required
                        />
                        <CalendarIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-mint transition-colors" />
                      </div>
                    </div>

                    {/* Time Slot Picker */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Available Slots</label>
                      <div className="grid grid-cols-2 gap-3">
                        {slots.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => selectSlot(s)}
                            className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all duration-300 flex items-center justify-center gap-1.5 ${
                              formData.slot === s
                                ? "bg-mint text-white border-mint shadow-md"
                               : "bg-white/40 border-slate-200 text-slate-700 hover:border-mint/30"
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-6 flex justify-between">
                    <Magnetic>
                      <button
                        type="button"
                        onClick={handleBack}
                        className="px-6 py-3.5 rounded-full border border-slate-200 text-slate-700 font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 hover:bg-slate-50"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                      </button>
                    </Magnetic>

                    <Magnetic>
                      <button
                        type="submit"
                        disabled={!isStep3Valid}
                        className={`px-8 py-3.5 rounded-full font-semibold transition-all duration-500 text-xs tracking-wider uppercase flex items-center gap-2 ${
                          isStep3Valid
                            ? "bg-mint text-white shadow-[0_8px_25px_rgba(20,184,166,0.3)] hover:shadow-[0_12px_30px_rgba(20,184,166,0.45)] cursor-pointer"
                            : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                        }`}
                      >
                        Confirm Appointment
                        <Activity className="w-4 h-4 animate-pulse" />
                      </button>
                    </Magnetic>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Success Message */}
              {step === 4 && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center text-center py-10"
                >
                  <div className="w-20 h-20 rounded-full bg-mint/10 border-2 border-mint/20 flex items-center justify-center mb-6 glow-mint breathe">
                    <CheckCircle2 className="w-10 h-10 text-mint" />
                  </div>
                  
                  <h3 className="font-serif text-3xl font-bold text-[#1A2421] mb-3">Consultation Scheduled</h3>
                  
                  <p className="text-slate-700 text-sm font-semibold max-w-md leading-relaxed mb-8">
                    Your request for a constitutional consultation on <strong className="text-mint-dark">{formData.date}</strong> at <strong className="text-mint-dark">{formData.slot}</strong> has been confirmed. A medical questionnaire has been dispatched to <span className="underline font-bold text-slate-800">{formData.email}</span>.
                  </p>

                  <div className="glass-panel border-white/50 p-6 rounded-2xl max-w-sm w-full text-left space-y-2 mb-8 shadow-sm">
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 font-extrabold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-mint" />
                      Patient Summary
                    </div>
                    <div className="text-xs font-bold text-slate-800"><strong>Name:</strong> {formData.name}</div>
                    <div className="text-xs font-bold text-slate-800"><strong>Category:</strong> {formData.category}</div>
                    <div className="text-xs font-bold text-slate-800"><strong>Method:</strong> Global Virtual Consultation</div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Magnetic>
                      <a
                        href={getWhatsAppMessageLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-full bg-[#0F766E] hover:bg-[#0E7490] hover:shadow-[0_8px_25px_rgba(14,116,144,0.3)] text-white text-xs font-bold uppercase tracking-wider transition-all duration-500 inline-flex items-center gap-2 cursor-pointer"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.13-1.347a9.947 9.947 0 0 0 4.88 1.282h.005c5.505 0 9.99-4.478 9.99-9.985 0-2.667-1.04-5.176-2.93-7.065A9.923 9.923 0 0 0 12.012 2zm5.727 14.045c-.244.693-1.42 1.262-1.956 1.344-.479.073-1.103.137-3.224-.741-2.715-1.124-4.46-3.887-4.597-4.068-.135-.181-1.102-1.464-1.102-2.793 0-1.329.697-1.984.97-2.257.274-.273.595-.341.794-.341.2 0 .399.001.573.01.18.008.419-.07.658.502.244.585.83 2.03.902 2.179.072.15.12.322.02.522-.1.2-.149.324-.298.497-.15.173-.314.385-.448.517-.15.148-.306.31-.132.61.174.3.774 1.278 1.66 2.067.944.844 1.74 1.107 1.989 1.232.25.125.393.104.539-.065.144-.17.622-.723.789-.97.168-.246.335-.207.564-.122.23.085 1.458.687 1.708.812.25.125.416.188.478.297.062.109.062.63-.182 1.323z" />
                        </svg>
                        Confirm on WhatsApp
                      </a>
                    </Magnetic>

                    <Magnetic>
                      <button
                        type="button"
                        onClick={() => {
                          setStep(1);
                          setFormData({
                            name: "",
                            email: "",
                            phone: "",
                            category: "",
                            symptoms: "",
                            date: "",
                            slot: "",
                          });
                        }}
                        className="px-6 py-3 rounded-full border border-slate-300 hover:border-slate-800 text-slate-800 text-xs font-bold uppercase tracking-wider transition-all duration-500 cursor-pointer"
                      >
                        Book Another
                      </button>
                    </Magnetic>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

      </div>
    </section>
  );
}
