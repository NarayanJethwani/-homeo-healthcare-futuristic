"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, ArrowUpRight, Sun, Moon, Stethoscope, ClipboardList, User, ShoppingBag, BookOpen, Mail, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";


export default function Navbar() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isPortalHost, setIsPortalHost] = useState(false);

  const [portalUrl, setPortalUrl] = useState("https://portal.homeo.healthcare/login");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
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

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    const desktopBreakpoint = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => {
      if (desktopBreakpoint.matches) setMobileMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    desktopBreakpoint.addEventListener("change", closeOnDesktop);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      desktopBreakpoint.removeEventListener("change", closeOnDesktop);
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

  const isActiveSection = (href: string) => pathname === href || pathname?.startsWith(`${href}/`);

  if (pathname?.startsWith("/admin") || isPortalHost) {
    return null;
  }

  return (
    <>
      <motion.nav
        aria-label="Main navigation"
        initial={shouldReduceMotion ? false : { y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.24, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 motion-reduce:transition-none ${
          scrolled ? "py-2 sm:py-3 md:py-2 xl:py-3" : "py-3 sm:py-4 md:py-2 xl:py-4"
        }`}
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
          <div className="glass-panel flex min-h-[68px] flex-wrap items-center justify-between gap-x-0 gap-y-0 rounded-[28px] border-white/30 px-3 py-2.5 shadow-[0_8px_30px_rgb(20,184,166,0.06)] sm:gap-x-4 sm:px-5 md:py-2 xl:flex-nowrap xl:gap-5 xl:rounded-full xl:py-2.5">
            {/* Logo */}
            <Link href="/" data-cursor="homeo" className="group flex shrink-0 items-center gap-2.5 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mint-dark">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white border border-slate-200/50 overflow-hidden shadow-sm flex-shrink-0">
                <Image
                  src="/images/logo.png"
                  alt=""
                  width={36}
                  height={36}
                  className="object-contain p-0.5"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[17px] font-bold leading-none tracking-tight text-[#1A2421] dark:text-zinc-100">Homeo</span>
                <span className="text-[10px] text-mint uppercase tracking-widest font-semibold">Healthcare</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden min-w-0 flex-1 items-center justify-center gap-2 xl:flex 2xl:gap-4">
              {menuItems.map((item) => {
                const active = isActiveSection(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    data-cursor="explore"
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={`group relative whitespace-nowrap rounded-sm py-2 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mint-dark motion-reduce:transition-none ${
                      active ? "text-mint-dark dark:text-mint" : "text-slate-700 hover:text-mint-dark dark:text-zinc-200 dark:hover:text-mint"
                    }`}
                  >
                    {item.name}
                    <span className={`absolute bottom-0 left-1/2 h-0.5 bg-mint-dark transition-all duration-200 group-hover:left-0 group-hover:w-full motion-reduce:transition-none ${active ? "left-0 w-full" : "w-0"}`} />
                  </Link>
                );
              })}
            </div>

            {/* Desktop actions */}
            <div className="hidden shrink-0 items-center gap-2 md:flex">
              <button
                onClick={toggleTheme}
                aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-mint/20 bg-mint/5 text-[#1A2421] transition-colors duration-200 hover:border-mint/60 hover:bg-mint/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-dark dark:text-zinc-200 motion-reduce:transition-none"
              >
                {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>

              <Link
                href="/#booking"
                data-cursor="book"
                className="flex h-11 items-center gap-1.5 whitespace-nowrap rounded-full bg-mint-dark px-5 text-sm font-semibold text-white shadow-sm shadow-mint/20 transition-colors duration-200 hover:bg-[#0B5F59] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-dark motion-reduce:transition-none"
              >
                Book Consultation
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Mobile Controls */}
            <div className="flex shrink-0 items-center gap-1 sm:gap-2 md:hidden">
              <Link
                href="/#booking"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex h-11 items-center gap-1 rounded-full bg-mint-dark px-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#0B5F59] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-dark sm:px-4 motion-reduce:transition-none"
              >
                <span>Book</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
                className="flex h-11 w-11 items-center justify-center rounded-full text-[#1A2421] transition-colors duration-200 hover:text-mint-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-dark dark:text-zinc-200 motion-reduce:transition-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Keep all sections visible when the single-row layout has less room. */}
            <div className="order-last hidden basis-full items-center justify-center gap-3 border-t border-slate-200/60 pt-1.5 dark:border-white/10 md:flex xl:hidden lg:gap-4">
              {menuItems.map((item) => {
                const active = isActiveSection(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    data-cursor="explore"
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={`group relative whitespace-nowrap rounded-sm py-1.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-dark motion-reduce:transition-none ${
                      active ? "text-mint-dark dark:text-mint" : "text-slate-700 hover:text-mint-dark dark:text-zinc-200 dark:hover:text-mint"
                    }`}
                  >
                    {item.name}
                    <span className={`absolute bottom-0 left-1/2 h-0.5 bg-mint-dark transition-all duration-200 group-hover:left-0 group-hover:w-full motion-reduce:transition-none ${active ? "left-0 w-full" : "w-0"}`} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            id="mobile-navigation"
            className="fixed inset-x-0 top-20 z-[60] mx-4 md:hidden sm:top-24 sm:mx-6"
          >
            <div className="bg-white dark:bg-[#0B0F19] border border-white/40 dark:border-slate-800/40 rounded-3xl p-5 shadow-[0_20px_50px_rgba(20,184,166,0.15)] max-h-[calc(100vh-120px)] overflow-y-auto">
              <div className="flex flex-col gap-4">
                {menuItems.map((item) => (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className={`group flex min-h-12 items-center justify-between rounded-2xl border p-3 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-dark motion-reduce:transition-none ${
                        isActiveSection(item.href)
                          ? "border-mint/30 bg-mint/10 dark:bg-mint/15"
                          : "border-transparent bg-slate-500/5 hover:border-mint/20 hover:bg-mint/10 dark:bg-white/5 dark:hover:bg-mint/15"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <span className="text-base font-semibold text-slate-800 transition-colors group-hover:text-mint dark:text-zinc-100 motion-reduce:transition-none">
                          {item.name}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-mint motion-reduce:transform-none motion-reduce:transition-none" />
                    </Link>
                  </div>
                ))}
                
                <div className="h-px bg-slate-100 dark:bg-slate-800/60 my-2" />
                <button
                  onClick={toggleTheme}
                  className="flex min-h-12 w-full items-center gap-3 rounded-2xl px-3 text-left text-sm font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-500/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-dark dark:text-zinc-200 motion-reduce:transition-none"
                >
                  {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  Switch to {theme === "light" ? "dark" : "light"} mode
                </button>
                
                <a
                  href={portalUrl}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#0F766E]/20 bg-[#0F766E]/5 py-3 text-center text-xs font-bold uppercase tracking-wider text-[#0F766E] transition-colors duration-200 hover:bg-[#0F766E]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-dark dark:text-mint motion-reduce:transition-none"
                >
                  Clinical Workspace
                </a>
                <Link
                  href="/#booking"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-mint py-3 text-center text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-mint/10 transition-colors duration-200 hover:bg-mint-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-dark motion-reduce:transition-none"
                >
                  Book Consultation
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                
                <div className="flex gap-3 pt-1">
                  <a
                    href="mailto:narayan.jethwani@homeo.healthcare"
                    className="flex-1 rounded-2xl border border-slate-200 py-3 text-center text-xs font-bold text-slate-800 transition-colors duration-200 hover:border-mint hover:text-mint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-dark dark:border-slate-800 dark:text-zinc-300 dark:hover:text-mint motion-reduce:transition-none"
                  >
                    Email Dr. Narayan
                  </a>
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918446056789"}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 py-3 text-center text-xs font-bold text-emerald-600 transition-colors duration-200 hover:bg-emerald-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-dark dark:text-emerald-400 motion-reduce:transition-none"
                  >
                    WhatsApp Chat
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
