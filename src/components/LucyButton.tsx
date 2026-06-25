"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Maximize2, Minimize2, RotateCcw } from "lucide-react";

export default function LucyButton() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [iframeSrc, setIframeSrc] = useState("");
  const [isPortalHost, setIsPortalHost] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsPortalHost(window.location.hostname.includes("portal.homeo.healthcare"));
    }
  }, []);

  // Listen to postMessage event for toggling fullscreen or closing
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data) {
        if (event.data.type === 'toggle-fullscreen') {
          setIsFullscreen(!!event.data.isFullscreen);
        } else if (event.data.type === 'close-lucy') {
          setIsOpen(false);
        } else if (event.data.type === 'reset-assessments') {
          if (typeof window !== "undefined") {
            localStorage.removeItem('homeo_health_digital_twin_2026_v2');
            window.location.reload();
          }
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Expose openLucyTab globally to allow parent pages to open specific tabs in Lucy
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).openLucyTab = (tab: string) => {
        if (!hasOpened) {
          setIframeSrc(`/lucy/index.html?embed=true&v=2.5.5&tab=${tab}`);
          setHasOpened(true);
        } else {
          const iframe = document.getElementById('lucy-iframe') as HTMLIFrameElement;
          if (iframe) {
            iframe.contentWindow?.postMessage({ type: 'open-tab', tab }, '*');
          }
        }
        setIsOpen(true);
      };
    }
    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).openLucyTab;
      }
    };
  }, [hasOpened, iframeSrc]);

  // Open iframe on demand
  const handleToggle = () => {
    if (!hasOpened) {
      setIframeSrc("/lucy/index.html?embed=true&v=2.5.5");
      setHasOpened(true);
    }
    if (isOpen) {
      setIsFullscreen(false);
    }
    setIsOpen(!isOpen);
  };

  if (pathname?.startsWith("/admin") || isPortalHost) return null;

  return (
    <>
      {/* Chat Window Frame */}
      {hasOpened && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{
            opacity: isOpen ? 1 : 0,
            scale: isOpen ? 1 : 0.92,
            y: isOpen ? 0 : 15,
            pointerEvents: isOpen ? "auto" : "none",
          }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`fixed z-50 bg-[#F8FAFC] dark:bg-[#090E17] border border-teal-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col origin-bottom-right transition-all duration-300 ${
            isFullscreen ? "rounded-none border-none" : "rounded-2xl"
          }`}
          style={
            isFullscreen
              ? {
                  width: "100vw",
                  height: "100vh",
                  maxHeight: "100vh",
                  bottom: "0",
                  right: "0",
                }
              : {
                  width: "min(380px, calc(100vw - 32px))",
                  height: "600px",
                  maxHeight: "calc(100vh - 200px)",
                  bottom: "168px",
                  right: "24px",
                }
          }
        >
          {/* Custom Window Header / Control Bar (Prevents overlap with iframe controls) */}
          <div className="h-9 bg-slate-900/95 dark:bg-[#060B11] border-b border-teal-500/20 px-3.5 flex items-center justify-between text-[11px] font-bold text-teal-400/90 select-none shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Dr. Lucy AI Assistant</span>
            </div>
            <div className="flex items-center gap-1.5">
              {/* Reset/Reload Button */}
              <button
                onClick={() => {
                  const iframe = document.getElementById('lucy-iframe') as HTMLIFrameElement;
                  if (iframe) {
                    // Force refresh iframe source to reload
                    iframe.src = iframeSrc;
                  }
                }}
                className="w-5.5 h-5.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Reset/Restart Chat Session"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              {/* Minimize Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-5.5 h-5.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Minimize (Keep Chat)"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              {/* Fullscreen Button */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="w-5.5 h-5.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsFullscreen(false);
                }}
                className="w-5.5 h-5.5 rounded-md hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Embedded Iframe */}
          <iframe
            id="lucy-iframe"
            src={iframeSrc}
            className="w-full flex-1 border-none bg-transparent"
            allow="microphone"
          />
        </motion.div>
      )}

      {/* Floating launcher bubble */}
      <div 
        className="fixed z-50 flex items-center gap-3"
        style={{ bottom: "96px", right: "24px" }}
      >
        {/* Tooltip label */}
        <AnimatePresence>
          {isHovered && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 15, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 15, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="hidden sm:block px-4 py-2 rounded-2xl glass-panel text-xs font-bold text-slate-800 shadow-md border-white/40 whitespace-nowrap"
            >
              Consult Dr. Lucy
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[4px] w-2 h-2 rotate-45 bg-[#FAF9F6] border-r border-t border-white/40" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bubble Launcher */}
        <motion.button
          onClick={handleToggle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center justify-center w-14 h-14 rounded-full glass-panel shadow-[0_8px_32px_rgba(20,184,166,0.15)] hover:shadow-[0_12px_40px_rgba(20,184,166,0.25)] border-white/50 group transition-all duration-300 cursor-pointer overflow-visible"
        >
          {/* Pulse animation rings */}
          <span className="absolute inset-0 rounded-full bg-teal-500/10 animate-ping opacity-75" />
          
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-teal-500/10 via-aqua/10 to-lavender/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

          {/* Avatar graphic inside the bubble launcher */}
          <img
            src="/lucy/assets/lucy_avatar.png"
            alt="Lucy AI Doctor Assistant"
            className="w-full h-full rounded-full object-cover z-10"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const iconSpan = parent.querySelector(".fallback-icon");
                if (iconSpan) iconSpan.classList.remove("hidden");
              }
            }}
          />
          <span className="fallback-icon hidden z-10 text-xl">🩺</span>

          {/* Online green indicator badge */}
          <span className="absolute bottom-0 right-0 flex h-3.5 w-3.5 z-20">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#FAF9F6] dark:border-slate-950"></span>
          </span>
        </motion.button>
      </div>
    </>
  );
}
