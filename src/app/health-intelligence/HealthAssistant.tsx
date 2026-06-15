"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Sparkles, Brain, HelpCircle, Calendar, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HealthDigitalTwin } from "./types";

interface HealthAssistantProps {
  twin: HealthDigitalTwin;
  theme: "light" | "dark";
  onSelectProfile: (id: string) => void;
}

interface ChatMessage {
  sender: "user" | "assistant";
  text: string;
}

export default function HealthAssistant({ twin, theme, onSelectProfile }: HealthAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "assistant",
      text: "Hello! I am your AI Health Assistant. Ask me anything about your assessments, medical terms, or how to map your constitutional profile."
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const newMsgs = [...messages, { sender: "user", text: textToSend } as ChatMessage];
    setMessages(newMsgs);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let reply = "";
      const textLower = textToSend.toLowerCase();

      if (textLower.includes("psora") || textLower.includes("miasm")) {
        reply = "In Homeopathy, a **Miasm** represents an inherited or acquired chronic biological predisposition. \n\n* **Psora** is the miasm of functional deficiency and sensory hypersensitivity (common in fatigue or eczema).\n* **Sycosis** is the miasm of metabolic accumulation and sluggish tissue overgrowth (common in bloating, weight gain, or PCOS).\n* **Syphilis** is the miasm of structural breakdown or nocturnal worsening.";
      } else if (textLower.includes("egfr") || textLower.includes("kidney") || textLower.includes("creatinine")) {
        reply = "**eGFR (Estimated Glomerular Filtration Rate)** is the primary metric of kidney filtration. \n\n* An eGFR **above 60** represents normal filtration capacity.\n* An eGFR **below 60** indicates kidney loading. \n* Serum **Creatinine** is a cellular waste product filtered by kidneys; when filtration slows down, blood creatinine levels elevate.";
      } else if (textLower.includes("result") || textLower.includes("score") || textLower.includes("health")) {
        const completedCount = Object.keys(twin.completedAssessments || {}).length;
        if (completedCount === 0) {
          reply = "You haven't completed any self-assessments yet. I recommend starting with the **Metabolic Health Profile** or **Stress Assessment** to initialize your Health Digital Twin!";
        } else {
          reply = `Your overall Health Score stands at **${twin.overallScore}%** based on ${completedCount} completed evaluations. \n\nActive system stress flags: **${twin.activeRulesFlags.join(", ") || "None"}**. \n\nI recommend taking the **Constitutional Assessment** next to compile your custom remedy indicators.`;
        }
      } else if (textLower.includes("remedy") || textLower.includes("constitutional") || textLower.includes("homeopath")) {
        if (twin.constitutional) {
          reply = `Your constitutional assessment matches the **${twin.constitutional.remedyMatch}** profile, showing primary **${twin.constitutional.systemDominance}** dominance. This matches an adaptive pattern of **${twin.constitutional.adaptivePattern}**.`;
        } else {
          reply = "Constitutional analysis matches your thermal response, cravings, sleep, and emotional patterns to custom homeopathic remedies. Click the **Constitutional Profile** button in the dashboard to map yours!";
        }
      } else if (textLower.includes("book") || textLower.includes("consult") || textLower.includes("doctor") || textLower.includes("jethwani")) {
        reply = "You can schedule a clinical review with Dr. Narayan Jethwani directly. Click **Book Consultation** to open the calendar scheduling module. Pushing your self-assessment notes during booking is highly recommended.";
      } else {
        reply = "I've analyzed your question. As your Health Assistant, I advise monitoring your daily hydration, maintaining sleep rhythm, and completing the remaining body system assessments. You can also ask me specific terms like 'What is Psora?' or 'Explain my results'.";
      }

      setMessages(prev => [...prev, { sender: "assistant", text: reply }]);
      setIsTyping(false);
    }, 1200);
  };

  const handleQuickQuestion = (q: string) => {
    handleSend(q);
  };

  const isDark = theme === "dark";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Expanded Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`w-[340px] md:w-[380px] h-[500px] rounded-[28px] border shadow-2xl flex flex-col justify-between overflow-hidden mb-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/80 dark:border-slate-800`}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white flex justify-between items-center shadow-md">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 animate-pulse text-teal-200" />
                <div>
                  <h4 className="text-xs font-bold font-sans">AI Health Companion</h4>
                  <p className="text-[8.5px] text-teal-150 uppercase tracking-widest font-black leading-none">Homeo Healthcare</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer border-none"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 scrollbar-thin">
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-zinc-200 rounded-tr-none border border-slate-200/50 dark:border-slate-800"
                        : "bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-slate-800 dark:text-zinc-200 rounded-tl-none"
                    }`}
                  >
                    {msg.text.split("\n").map((line, idx) => (
                      <p key={idx} className="mb-1.5 last:mb-0">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/10 rounded-2xl rounded-tl-none p-3 text-xs text-slate-400 animate-pulse">
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 flex flex-wrap gap-1.5 shrink-0">
              <button 
                onClick={() => handleQuickQuestion("Explain my results")}
                className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-mint rounded-lg text-[10px] text-slate-600 dark:text-zinc-350 cursor-pointer font-semibold transition-all"
              >
                📊 Score Summary
              </button>
              <button 
                onClick={() => handleQuickQuestion("What is Psora?")}
                className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-mint rounded-lg text-[10px] text-slate-600 dark:text-zinc-350 cursor-pointer font-semibold transition-all"
              >
                🔬 Explain Miasms
              </button>
              <button 
                onClick={() => handleQuickQuestion("What does eGFR mean?")}
                className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-mint rounded-lg text-[10px] text-slate-600 dark:text-zinc-350 cursor-pointer font-semibold transition-all"
              >
                🩺 What is eGFR?
              </button>
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSend(input); }}
                placeholder="Ask your clinical question here..."
                className="flex-1 px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-mint focus:bg-white dark:focus:bg-slate-950 transition-all text-slate-800 dark:text-zinc-100"
              />
              <button
                onClick={() => handleSend(input)}
                className="p-2.5 bg-mint hover:bg-mint-dark text-white rounded-xl cursor-pointer flex items-center justify-center border-none shadow-sm active:scale-95 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Bubble */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-full shadow-lg shadow-teal-500/20 cursor-pointer border-none flex items-center justify-center relative group"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute right-full mr-3 bg-slate-900/90 text-white px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-sm whitespace-nowrap">
          AI Companion
        </span>
      </motion.button>
      
    </div>
  );
}
