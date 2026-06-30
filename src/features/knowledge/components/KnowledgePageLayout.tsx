import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import AntigravityBackground from "@/components/AntigravityBackground";

interface KnowledgePageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  backLink?: string;
  backText?: string;
  headerBadges?: React.ReactNode;
}

export default function KnowledgePageLayout({
  children,
  title,
  subtitle,
  backLink = "/knowledge",
  backText = "Back to Knowledge Hub",
  headerBadges,
}: KnowledgePageLayoutProps) {
  return (
    <div className="relative min-h-screen w-full pt-32 pb-24 px-6 md:px-12 lg:px-24">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <AntigravityBackground />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back Link */}
        <Link
          href={backLink}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200 mb-8"
        >
          <ChevronLeft className="h-4 w-4" /> {backText}
        </Link>

        {/* Header Block */}
        <header className="mb-10 space-y-4">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400 bg-clip-text text-transparent">
            {title}
          </h1>
          {subtitle && (
            <p className="text-md md:text-lg leading-relaxed text-neutral-600 dark:text-neutral-400 font-medium">
              {subtitle}
            </p>
          )}

          {headerBadges && (
            <div className="flex flex-wrap gap-2.5 pt-2">
              {headerBadges}
            </div>
          )}
        </header>

        {/* Content Body */}
        <main className="space-y-8 prose dark:prose-invert max-w-none">
          {children}
        </main>
      </div>
    </div>
  );
}
