"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, ImageIcon, X } from "lucide-react";
import { getKnowledgeVisuals } from "../content/visualRegistry";

interface KnowledgeVisualGalleryProps {
  slug: string;
  title: string;
}

export default function KnowledgeVisualGallery({ slug, title }: KnowledgeVisualGalleryProps) {
  const visuals = getKnowledgeVisuals(slug);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const scrollPositionRef = useRef(0);

  const closePreview = useCallback(() => setSelectedIndex(null), []);
  const showPrevious = useCallback(() => setSelectedIndex((index) => index === null ? null : (index + visuals.length - 1) % visuals.length), [visuals.length]);
  const showNext = useCallback(() => setSelectedIndex((index) => index === null ? null : (index + 1) % visuals.length), [visuals.length]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const body = document.body;
    const root = document.documentElement;
    scrollPositionRef.current = window.scrollY;
    const previousOverflow = document.body.style.overflow;
    const previousPosition = body.style.position;
    const previousTop = body.style.top;
    const previousWidth = body.style.width;
    const previousRootOverflow = root.style.overflow;

    // Keep the article exactly where the reader was when the full-screen
    // viewer opens. This also prevents focus from moving the page to the
    // gallery's DOM position on long topic pages.
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollPositionRef.current}px`;
    body.style.width = "100%";
    root.style.overflow = "hidden";
    closeButtonRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePreview();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      body.style.overflow = previousOverflow;
      body.style.position = previousPosition;
      body.style.top = previousTop;
      body.style.width = previousWidth;
      root.style.overflow = previousRootOverflow;
      window.scrollTo({ top: scrollPositionRef.current, behavior: "instant" });
      document.removeEventListener("keydown", onKeyDown);
      openerRef.current?.focus({ preventScroll: true });
    };
  }, [selectedIndex, closePreview, showNext, showPrevious]);

  if (visuals.length === 0) return null;

  return (
    <section aria-label={`${title} visual guide`} className="space-y-4 not-prose">
      <div className="flex items-center gap-2">
        <ImageIcon className="h-4 w-4 text-teal-600 dark:text-teal-400" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Visual guide</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {visuals.map((visual, index) => (
          <figure key={visual.src} className="group overflow-hidden rounded-2xl border border-neutral-500/10 bg-neutral-950 shadow-sm">
            <button
              type="button"
              onClick={() => {
                openerRef.current = document.activeElement as HTMLButtonElement;
                setSelectedIndex(index);
              }}
              className="relative block aspect-square w-full overflow-hidden text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400"
              aria-label={`View larger image: ${visual.label}`}
            >
              <Image
                src={visual.src}
                alt={visual.alt}
                fill
                sizes="(min-width: 640px) 33vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-x-0 top-0 flex items-center gap-1.5 bg-gradient-to-b from-neutral-950/65 to-transparent px-3 py-2.5">
                <Image src="/images/logo.png" alt="" width={18} height={18} className="h-[18px] w-[18px]" />
                <span className="text-[10px] font-bold tracking-wide text-white">Homeo Healthcare</span>
              </div>
              <span className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-black/50 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                <Expand className="h-4 w-4" aria-hidden="true" />
              </span>
            </button>
            <figcaption className="bg-white dark:bg-neutral-950 px-3 py-2.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              {visual.label}
            </figcaption>
          </figure>
        ))}
      </div>
      {selectedIndex !== null && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md md:p-8"
          role="presentation"
          onMouseDown={(event) => { if (event.target === event.currentTarget) closePreview(); }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label={`${visuals[selectedIndex].label} enlarged image`}
            className="relative flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-slate-950 shadow-2xl"
          >
            <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Image src="/images/logo.png" alt="" width={22} height={22} className="h-[22px] w-[22px]" />
                Homeo Healthcare
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closePreview}
                className="grid h-10 w-10 place-items-center rounded-full bg-black/55 text-white transition hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label="Close enlarged image"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="relative min-h-[60vh] flex-1 bg-black">
              <Image
                src={visuals[selectedIndex].src}
                alt={visuals[selectedIndex].alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
              {visuals.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPrevious}
                    className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white transition hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:left-5"
                    aria-label="View previous image"
                  >
                    <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
                    className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white transition hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:right-5"
                    aria-label="View next image"
                  >
                    <ChevronRight className="h-6 w-6" aria-hidden="true" />
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center justify-between gap-3 bg-slate-950 px-5 py-4 text-sm text-white">
              <p className="font-semibold">{visuals[selectedIndex].label}</p>
              <span className="shrink-0 text-xs font-medium text-white/65">{selectedIndex + 1} of {visuals.length}</span>
            </div>
          </section>
        </div>,
        document.body
      )}
    </section>
  );
}
