"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Type, Eye } from "lucide-react";
import AntigravityBackground from "@/components/AntigravityBackground";
import ScrollSpyTOC from "./ScrollSpyTOC";
import { PatientModeProvider } from "../context/PatientModeContext";
import PatientModeToggle from "./PatientModeToggle";
import InteractiveSidebar from "./InteractiveSidebar";
import PrintButton from "./PrintButton";

interface KnowledgePageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  backLink?: string;
  backText?: string;
  headerBadges?: React.ReactNode;
  tocItems?: { id: string; label: string }[];
  entityId?: string;
  entityType?: string;
}

export default function KnowledgePageLayout({
  children,
  title,
  subtitle,
  backLink = "/knowledge",
  backText = "Back to Knowledge Hub",
  headerBadges,
  tocItems,
  entityId,
  entityType
}: KnowledgePageLayoutProps) {
  const [fontScale, setFontScale] = useState(1.0);
  const [lineSpacing, setLineSpacing] = useState("normal"); // "normal" | "spacious" | "loose"
  const [highContrast, setHighContrast] = useState(false);

  const increaseFont = () => setFontScale(prev => Math.min(prev + 0.1, 1.4));
  const decreaseFont = () => setFontScale(prev => Math.max(prev - 0.1, 0.85));
  const resetFont = () => setFontScale(1.0);
  const toggleLineSpacing = () => {
    setLineSpacing(prev => {
      if (prev === "normal") return "spacious";
      if (prev === "spacious") return "loose";
      return "normal";
    });
  };
  const toggleContrast = () => setHighContrast(prev => !prev);

  const hasSidebar = !!((tocItems && tocItems.length > 0) || (entityId && entityType));

  return (
    <PatientModeProvider>
      <div className="relative min-h-screen w-full pt-32 pb-24 px-6 md:px-12 lg:px-24">
        
        {/* Dynamic CSS Print & Accessibility Overrides */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Accessibility Scaling overrides for prose */
          main.accessibility-enabled {
            font-size: ${fontScale}rem !important;
          }
          main.accessibility-enabled p:not(.graph-exclude *), 
          main.accessibility-enabled li:not(.graph-exclude *), 
          main.accessibility-enabled span:not(.graph-exclude *),
          main.accessibility-enabled a:not(.graph-exclude *),
          main.accessibility-enabled td:not(.graph-exclude *),
          main.accessibility-enabled ul:not(.graph-exclude *),
          main.accessibility-enabled ol:not(.graph-exclude *),
          main.accessibility-enabled mark:not(.graph-exclude *) {
            font-size: 1em !important;
          }
          main.accessibility-enabled h1:not(.graph-exclude *) {
            font-size: 2.25em !important;
          }
          main.accessibility-enabled h2:not(.graph-exclude *) {
            font-size: 1.5em !important;
          }
          main.accessibility-enabled h3:not(.graph-exclude *) {
            font-size: 1.25em !important;
          }
          main.accessibility-enabled h4:not(.graph-exclude *) {
            font-size: 1.1em !important;
          }
          main.accessibility-enabled h5:not(.graph-exclude *) {
            font-size: 1em !important;
          }
          main.accessibility-enabled h6:not(.graph-exclude *) {
            font-size: 0.875em !important;
          }

          @media print {
            /* Hide non-content elements */
            nav, footer, header, button, .print-hide, .back-link, .sidebar, .disclaimer-block, .related-nav, iframe, img[src*="icon"] {
              display: none !important;
            }
            /* Expand main container fully */
            body, main, .prose {
              background: transparent !important;
              color: #000000 !important;
              box-shadow: none !important;
              padding: 0 !important;
              margin: 0 !important;
              max-width: 100% !important;
              font-size: 12pt !important;
              line-height: 1.5 !important;
            }
            .prose h1, .prose h2, .prose h3 {
              color: #000000 !important;
              page-break-after: avoid;
            }
            section {
              page-break-inside: avoid;
              margin-bottom: 20pt !important;
            }
          }
        `}} />

        {/* Background Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40 print:hidden">
          <AntigravityBackground />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* Navigation & Actions Top Line */}
          <div className="flex items-center justify-between mb-8 print-hide gap-4 flex-wrap">
             <Link
               href={backLink}
               className="back-link inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
             >
               <ChevronLeft className="h-4 w-4" /> {backText}
             </Link>
             
             <div className="flex items-center flex-wrap gap-3">
               {/* Readability Accessibility Controls Strip */}
               <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm text-neutral-500 dark:text-neutral-400">
                 {/* Text Zoom */}
                 <button
                   onClick={decreaseFont}
                   className="px-1.5 py-0.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-[10px] font-extrabold cursor-pointer transition-colors"
                   title="Decrease Text Size"
                 >
                   A-
                 </button>
                 <button
                   onClick={resetFont}
                   className="px-1.5 py-0.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-extrabold cursor-pointer transition-colors"
                   title="Reset Text Size"
                 >
                   A
                 </button>
                 <button
                   onClick={increaseFont}
                   className="px-1.5 py-0.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-extrabold cursor-pointer transition-colors"
                   title="Increase Text Size"
                 >
                   A+
                 </button>

                 <div className="h-3.5 w-[1px] bg-neutral-300 dark:bg-neutral-800 mx-1" />

                 {/* Line Spacing */}
                 <button
                   onClick={toggleLineSpacing}
                   className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
                   title={`Line Spacing: ${lineSpacing}`}
                 >
                   <Type className="h-3.5 w-3.5" />
                 </button>

                 <div className="h-3.5 w-[1px] bg-neutral-300 dark:bg-neutral-800 mx-1" />

                 {/* High Contrast */}
                 <button
                   onClick={toggleContrast}
                   className={`p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer transition-colors ${
                     highContrast ? "text-teal-650 dark:text-teal-400 bg-teal-500/10" : ""
                   }`}
                   title="Toggle High Contrast Text"
                 >
                   <Eye className="h-3.5 w-3.5" />
                 </button>
               </div>

               <PatientModeToggle />
               <PrintButton />
             </div>
          </div>

          {/* Header Block */}
          <header className="mb-10 space-y-4 border-b border-neutral-500/5 pb-6">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400 bg-clip-text text-transparent">
              {title}
            </h1>
            {subtitle && (
              <p className="text-md md:text-lg leading-relaxed text-neutral-600 dark:text-neutral-400 font-medium">
                {subtitle}
              </p>
            )}

            {headerBadges && (
              <div className="flex flex-wrap gap-2.5 pt-2 print-hide">
                {headerBadges}
              </div>
            )}
          </header>

          {/* Master Layout Grid with sticky scrollspy TOC */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
            
            {/* Main content body */}
            <main 
              style={{
                lineHeight: lineSpacing === "loose" ? "2.0" : lineSpacing === "spacious" ? "1.8" : "1.6"
              }}
              className={`${hasSidebar ? "lg:col-span-3" : "lg:col-span-4"} prose dark:prose-invert max-w-none transition-all duration-200 accessibility-enabled ${
                highContrast 
                  ? "prose-headings:text-black dark:prose-headings:text-white prose-p:text-neutral-950 dark:prose-p:text-white font-medium contrast-125" 
                  : ""
              }`}
            >
              {children}
            </main>

            {/* Sidebar Columns (TOC + Personalization Recs) */}
            {hasSidebar && (
              <aside className="lg:col-span-1 sticky top-28 hidden lg:block sidebar space-y-6">
                {tocItems && tocItems.length > 0 && <ScrollSpyTOC items={tocItems} />}
                {entityId && entityType && (
                  <InteractiveSidebar currentId={entityId} entityType={entityType} />
                )}
              </aside>
            )}
          </div>

        </div>
      </div>
    </PatientModeProvider>
  );
}
