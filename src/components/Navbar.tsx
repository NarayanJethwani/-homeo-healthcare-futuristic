"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Menu, X, ArrowUpRight, Sun, Moon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Magnetic from "./Magnetic";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

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
  }, []);

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
    { name: "Conditions", href: "/services" },
    { name: "Protocol", href: "/evidence-based-homeopathy" },
    { name: "Dr Jethwani", href: "/dr-narayan-jethwani" },
    { name: "Treatments", href: "/store" },
    { name: "Blog", href: "/blogs" },
    { name: "Contact", href: "/contact-us" },
  ];

  if (pathname?.startsWith("/admin")) {
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
            <div className="hidden lg:flex items-center gap-6">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  data-cursor="explore"
                  className="text-sm font-semibold text-slate-700 hover:text-mint transition-colors duration-300 relative py-1 cursor-pointer group"
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

              <Magnetic>
                <Link
                  href="https://homeo.healthcare/#booking"
                  data-cursor="book"
                  className="glass-panel border-mint/20 hover:border-mint/60 bg-mint/5 hover:bg-mint text-mint-dark hover:text-white px-5 py-2 rounded-full text-xs font-bold tracking-wide uppercase transition-all duration-500 flex items-center gap-1.5 cursor-pointer"
                >
                  Book Consultation
                  <ArrowUpRight className="w-3.5 h-3.5" />
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
            <div className="glass-panel rounded-3xl p-6 border-white/30 shadow-lg">
              <div className="flex flex-col gap-5">
                {menuItems.map((item, idx) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={item.name}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-bold text-slate-800 hover:text-mint py-1 block"
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <hr className="border-slate-150" />
                <Link
                  href="https://homeo.healthcare/#booking"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-mint text-white py-3 rounded-full text-sm font-semibold flex items-center justify-center gap-2"
                >
                  Book Consultation
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <div className="flex gap-3 pt-1">
                  <a
                    href="mailto:narayan.jethwani@gmail.com"
                    className="flex-1 text-center border border-slate-200 text-slate-800 py-2.5 rounded-full text-xs font-bold hover:border-mint hover:text-mint transition-colors"
                  >
                    Email Dr. Narayan
                  </a>
                  <a
                    href="https://wa.me/918446056789"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center border border-[#0F766E]/20 text-[#0F766E] bg-[#0F766E]/5 py-2.5 rounded-full text-xs font-bold hover:bg-[#0F766E]/10 transition-colors"
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
