import React from "react";
import Link from "next/link";
import { ChevronLeft, Printer } from "lucide-react";
import AntigravityBackground from "@/components/AntigravityBackground";
import ScrollSpyTOC from "./ScrollSpyTOC";
import { PatientModeProvider } from "../context/PatientModeContext";
import PatientModeToggle from "./PatientModeToggle";
import InteractiveSidebar from "./InteractiveSidebar";

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
  
  // Quick trigger to print the page
  const printAction = (
    <button
      onClick={() => typeof window !== "undefined" && window.print()}
      className="print-hide inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-500/10 hover:bg-neutral-500/5 text-xs font-semibold text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-all duration-300 cursor-pointer"
    >
      <Printer className="h-3.5 w-3.5" /> Print Article
    </button>
  );

  return (
    <PatientModeProvider>
      <div className="relative min-h-screen w-full pt-32 pb-24 px-6 md:px-12 lg:px-24">
        
        {/* Dynamic CSS Print Overrides */}
        <style dangerouslySetInnerHTML={{ __html: `
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
          <div className="flex items-center justify-between mb-8 print-hide">
            <Link
              href={backLink}
              className="back-link inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
            >
              <ChevronLeft className="h-4 w-4" /> {backText}
            </Link>
            <div className="flex items-center gap-3">
              <PatientModeToggle />
              {printAction}
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
            <main className="lg:col-span-3 prose dark:prose-invert max-w-none">
              {children}
            </main>

            {/* Sidebar Columns (TOC + Personalization Recs) */}
            {(tocItems || entityId) && (
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
