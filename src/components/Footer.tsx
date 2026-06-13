"use client";

import { usePathname } from "next/navigation";
import { Sparkles, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Magnetic from "./Magnetic";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  const links = {
    clinical: [
      { name: "Conditions We Treat", href: "/services" },
      { name: "Clinical Protocol", href: "/evidence-based-homeopathy" },
      { name: "Dr. Narayan Jethwani", href: "/dr-narayan-jethwani" },
      { name: "Treatments Store", href: "/store" },
    ],
    resources: [
      { name: "Clinical Blog", href: "/blogs" },
      { name: "Science & Evidence", href: "/evidence-based-homeopathy" },
      { name: "OPD Locations", href: "/contact-us" },
      { name: "Schedule Consultation", href: "/#booking" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms & Conditions", href: "/privacy-policy#terms" },
      { name: "Telehealth Consent", href: "/privacy-policy#telehealth" },
    ],
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-t from-slate-900/5 to-transparent border-t border-slate-900/5 pt-20 pb-12 px-6 overflow-hidden">
      
      {/* Animated structural grid overlay */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.15]" 
        style={{
          backgroundImage: `
            linear-gradient(rgba(20, 184, 166, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20, 184, 166, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "linear-gradient(to bottom, transparent, rgba(0, 0, 0, 1))",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, rgba(0, 0, 0, 1))"
        }}
      />

      {/* Ambient background glow dots */}
      <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-mint/10 to-transparent opacity-40 blur-[60px] -bottom-10 right-[10%] pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-lavender/5 to-transparent opacity-30 blur-[60px] -bottom-10 left-[10%] pointer-events-none" />

      <div className="max-w-7xl mx-auto z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16">
          
          {/* Brand Info Column */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white border border-slate-200/50 overflow-hidden shadow-sm flex-shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="Homeo Healthcare Logo"
                  width={36}
                  height={36}
                  className="object-contain p-0.5"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-[#1A2421] text-base leading-none">Homeo</span>
                <span className="text-[10px] text-mint uppercase tracking-widest font-semibold">Healthcare</span>
              </div>
            </Link>
            
            <p className="text-xs text-slate-700 font-medium leading-relaxed max-w-sm">
              Experience the evolution of natural therapeutics. High-fidelity homeopathic healing targeted directly to your constitutional blueprint.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                <Mail className="w-4 h-4 text-mint/60" />
                <a href="mailto:narayan.jethwani@gmail.com" className="hover:text-mint transition-colors duration-300 cursor-pointer">
                  narayan.jethwani@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                <svg className="w-4 h-4 text-mint/60" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.13-1.347a9.947 9.947 0 0 0 4.88 1.282h.005c5.505 0 9.99-4.478 9.99-9.985 0-2.667-1.04-5.176-2.93-7.065A9.923 9.923 0 0 0 12.012 2zm5.727 14.045c-.244.693-1.42 1.262-1.956 1.344-.479.073-1.103.137-3.224-.741-2.715-1.124-4.46-3.887-4.597-4.068-.135-.181-1.102-1.464-1.102-2.793 0-1.329.697-1.984.97-2.257.274-.273.595-.341.794-.341.2 0 .399.001.573.01.18.008.419-.07.658.502.244.585.83 2.03.902 2.179.072.15.12.322.02.522-.1.2-.149.324-.298.497-.15.173-.314.385-.448.517-.15.148-.306.31-.132.61.174.3.774 1.278 1.66 2.067.944.844 1.74 1.107 1.989 1.232.25.125.393.104.539-.065.144-.17.622-.723.789-.97.168-.246.335-.207.564-.122.23.085 1.458.687 1.708.812.25.125.416.188.478.297.062.109.062.63-.182 1.323z" />
                </svg>
                <a href="https://wa.me/918446056789" target="_blank" rel="noopener noreferrer" className="hover:text-mint transition-colors duration-300 cursor-pointer">
                  +91 84460 56789
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                <MapPin className="w-4 h-4 text-mint/60" />
                <span>Baner, Pune · homeo.healthcare</span>
              </div>
            </div>
            
            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-3">
              <Magnetic>
                <a
                  href="https://www.facebook.com/DrNarayanJethwani/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full border border-slate-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center text-slate-600 dark:text-zinc-400 hover:text-white hover:bg-[#1877F2] hover:border-[#1877F2] dark:hover:bg-[#1877F2] dark:hover:border-[#1877F2] transition-all duration-300 shadow-sm cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full border border-slate-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center text-slate-600 dark:text-zinc-400 hover:text-white hover:bg-gradient-to-tr hover:from-[#f09433] hover:to-[#bc1888] hover:border-[#bc1888] dark:hover:bg-gradient-to-tr dark:hover:from-[#f09433] dark:hover:to-[#bc1888] dark:hover:border-[#bc1888] transition-all duration-300 shadow-sm cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="https://www.youtube.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full border border-slate-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center text-slate-600 dark:text-zinc-400 hover:text-white hover:bg-[#FF0000] hover:border-[#FF0000] dark:hover:bg-[#FF0000] dark:hover:border-[#FF0000] transition-all duration-300 shadow-sm cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-full border border-slate-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center text-slate-600 dark:text-zinc-400 hover:text-white hover:bg-[#0077B5] hover:border-[#0077B5] dark:hover:bg-[#0077B5] dark:hover:border-[#0077B5] transition-all duration-300 shadow-sm cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
              </Magnetic>
            </div>
          </div>

          {/* Links Column 1: Clinical */}
          <div className="lg:col-span-2 lg:col-start-6 space-y-4">
            <h4 className="text-xs font-bold text-[#1A2421] uppercase tracking-wider">Clinical Services</h4>
            <ul className="space-y-2.5">
              {links.clinical.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-xs text-slate-700 hover:text-mint transition-colors duration-300 font-semibold cursor-pointer"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2: Resources */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-[#1A2421] uppercase tracking-wider">Research & Resources</h4>
            <ul className="space-y-2.5">
              {links.resources.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-xs text-slate-700 hover:text-mint transition-colors duration-300 font-semibold cursor-pointer"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 3: Legal */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-[#1A2421] uppercase tracking-wider">Legal Framework</h4>
            <ul className="space-y-2.5">
              {links.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-xs text-slate-700 hover:text-mint transition-colors duration-300 font-semibold cursor-pointer"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom copyright segment */}
        <div className="border-t border-slate-900/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-slate-700 font-bold uppercase tracking-wider">
            &copy; {currentYear} Homeo Healthcare. All Rights Reserved.
          </p>
          
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-700 uppercase tracking-widest bg-slate-900/5 px-3 py-1.5 rounded-full border border-slate-900/10">
            <Sparkles className="w-3.5 h-3.5 text-mint animate-pulse" />
            <span>Redesigned for Premium Clinical Precision</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
