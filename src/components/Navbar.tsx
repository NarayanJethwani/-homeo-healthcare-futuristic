"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, Sun, Moon, Stethoscope, ClipboardList, User, ShoppingBag, BookOpen, Mail, ChevronRight, Download } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Magnetic from "./Magnetic";
import { usePWAInstall } from "@/lib/pwaStore";
import PWAInstallModal from "@/components/PWAInstallModal";


export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isPortalHost, setIsPortalHost] = useState(false);
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [portalUrl, setPortalUrl] = useState("https://portal.homeo.healthcare/login");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
    if (typeof window !== "undefined") {
      const isPortal = window.location.hostname.includes("portal.homeo.healthcare");
      setIsPortalHost(isPortal);
      
      const host = window.location.hostname;
      if (host === "localhost" || host === "127.0.0.1" || host.includes("192.168.")) {
        setPortalUrl("/login");
      }
    }
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
      localStorage.setItem("theme", "light");
    }
  };

  const menuItems = [
    { name: "Conditions", href: "/services", icon: Stethoscope, color: "bg-teal-500/10 text-teal-600 dark:text-teal-400" },
    { name: "Protocol", href: "/evidence-based-homeopathy", icon: ClipboardList, color: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
    { name: "Intelligence", href: "/health-intelligence", icon: ClipboardList, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
    { name: "Dr Jethwani", href: "/dr-narayan-jethwani", icon: User, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
    { name: "Care Plans", href: "/store", icon: ShoppingBag, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
    { name: "Blog", href: "/blogs", icon: BookOpen, color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
    { name: "Knowledge", href: "/knowledge", icon: BookOpen, color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" },
    { name: "Contact", href: "/contact-us", icon: Mail, color: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  ];

  if (pathname?.startsWith("/admin") || isPortalHost) {
    return null;
  }

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled ? "py-4" : "py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="glass-panel rounded-full px-6 py-3 flex items-center justify-between border-white/30 shadow-[0_8px_30px_rgb(20,184,166,0.03)]">
            
            {/* Logo */}
            <Magnetic>
              <Link href="/" data-cursor="homeo" className="flex items-center gap-2 group cursor-pointer">
                <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white border border-slate-200/50 overflow-hidden shadow-sm flex-shrink-0">
                  <Image
                    src="/images/logo.png"
                    alt="Homeo Healthcare Logo"
                    width={36}
                    height={36}
                    className="object-contain p-0.5"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold tracking-tight text-[#1A2421] text-base leading-none">Homeo</span>
                  <span className="text-[10px] text-mint uppercase tracking-widest font-semibold">Healthcare</span>
                </div>
              </Link>
            </Magnetic>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-4">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  data-cursor="explore"
                  className="text-sm font-semibold text-slate-700 hover:text-mint transition-colors duration-300 relative py-1 cursor-pointer group whitespace-nowrap"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-mint transition-all duration-300 group-hover:w-full group-hover:left-0" />
                </Link>
              ))}
            </div>

            {/* CTA Button & Desktop Theme Toggle */}
            <div className="hidden md:flex items-center gap-4">
              <Magnetic>
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="glass-panel border-mint/20 hover:border-mint/60 bg-mint/5 hover:bg-mint/10 text-[#1A2421] dark:text-zinc-200 p-2.5 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center"
                >
                  {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </button>
              </Magnetic>

              {mounted && !isInstalled && (
                <Magnetic>
                  <button
                    onClick={() => {
                      if (isInstallable) {
                        install();
                      } else {
                        setShowInstallModal(true);
                      }
                    }}
                    className="glass-panel border-mint/20 hover:border-mint/60 bg-mint/5 hover:bg-mint/10 text-slate-700 dark:text-zinc-200 hover:text-mint dark:hover:text-mint px-4 py-2 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all duration-500 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Install App
                  </button>
                </Magnetic>
              )}

              <Magnetic>
                <a
                  href={portalUrl}
                  data-cursor="explore"
                  className="glass-panel border-[#0F766E]/20 hover:border-mint/50 bg-[#0F766E]/5 hover:bg-mint/10 text-slate-700 dark:text-zinc-200 hover:text-mint dark:hover:text-mint px-4 py-2 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all duration-500 flex items-center gap-1 cursor-pointer"
                >
                  Patient / Doctor Login
                </a>
              </Magnetic>

              <Magnetic>
                <Link
                  href="https://homeo.healthcare/#booking"
                  data-cursor="book"
                  className="glass-panel border-mint/20 hover:border-mint/40 bg-mint/5 hover:bg-white text-mint-dark hover:text-mint-dark px-5 py-2 rounded-full text-xs font-bold tracking-wide uppercase transition-all duration-500 flex items-center gap-1.5 cursor-pointer"
                >
                  Book Consultation
                  <ArrowUpRight className="w-3.5 h-3.5 text-mint-dark" />
                </Link>
              </Magnetic>
            </div>

            {/* Mobile Controls */}
            <div className="lg:hidden flex items-center gap-3">
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-2 text-[#1A2421] dark:text-zinc-200 hover:text-mint transition-colors cursor-pointer"
              >
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-[#1A2421] dark:text-zinc-200 hover:text-mint transition-colors cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-24 z-30 mx-6 lg:hidden"
          >
            <div className="bg-white/80 dark:bg-[#0B0F19]/85 backdrop-blur-2xl border border-white/40 dark:border-slate-800/40 rounded-3xl p-5 shadow-[0_20px_50px_rgba(20,184,166,0.15)] max-h-[calc(100vh-120px)] overflow-y-auto">
              <div className="flex flex-col gap-4">
                {menuItems.map((item, idx) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24, delay: idx * 0.05 }}
                    key={item.name}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-500/5 dark:bg-white/5 hover:bg-mint/10 dark:hover:bg-mint/15 transition-all duration-300 group cursor-pointer border border-transparent hover:border-mint/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <span className="text-base font-bold text-slate-800 dark:text-zinc-100 group-hover:text-mint transition-colors">
                          {item.name}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-mint group-hover:translate-x-1 transition-all" />
                    </Link>
                  </motion.div>
                ))}
                
                <div className="h-px bg-slate-100 dark:bg-slate-800/60 my-2" />
                
                {mounted && !isInstalled && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (isInstallable) {
                        install();
                      } else {
                        setShowInstallModal(true);
                      }
                    }}
                    className="w-full text-center border border-mint/20 text-mint bg-mint/5 hover:bg-mint/10 py-3 rounded-2xl text-xs font-bold tracking-wider uppercase transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Install Web App
                  </button>
                )}
                
                <a
                  href={portalUrl}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center border border-[#0F766E]/20 text-[#0F766E] dark:text-mint bg-[#0F766E]/5 hover:bg-[#0F766E]/10 py-3 rounded-2xl text-xs font-bold tracking-wider uppercase transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  Clinical Workspace
                </a>
                <Link
                  href="https://homeo.healthcare/#booking"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-mint hover:bg-mint-dark text-white py-3 rounded-2xl text-xs font-bold tracking-wider uppercase shadow-md shadow-mint/10 hover:shadow-mint/20 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Book Consultation
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                
                <div className="flex gap-3 pt-1">
                  <a
                    href="mailto:narayan.jethwani@homeo.healthcare"
                    className="flex-1 text-center border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-zinc-300 py-3 rounded-2xl text-xs font-bold hover:border-mint hover:text-mint dark:hover:text-mint transition-colors"
                  >
                    Email Dr. Narayan
                  </a>
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918446056789"}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 py-3 rounded-2xl text-xs font-bold transition-colors"
                  >
                    WhatsApp Chat
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PWAInstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        isIOS={isIOS}
      />
    </>
  );
}
