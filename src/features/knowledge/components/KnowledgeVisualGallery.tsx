import React from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { getKnowledgeVisuals } from "../content/visualRegistry";

interface KnowledgeVisualGalleryProps {
  slug: string;
  title: string;
}

export default function KnowledgeVisualGallery({ slug, title }: KnowledgeVisualGalleryProps) {
  const visuals = getKnowledgeVisuals(slug);

  if (visuals.length === 0) return null;

  return (
    <section aria-label={`${title} visual guide`} className="space-y-4 not-prose">
      <div className="flex items-center gap-2">
        <ImageIcon className="h-4 w-4 text-teal-600 dark:text-teal-400" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Visual guide</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {visuals.map((visual) => (
          <figure key={visual.src} className="group overflow-hidden rounded-2xl border border-neutral-500/10 bg-neutral-950 shadow-sm">
            <div className="relative aspect-square overflow-hidden">
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
            </div>
            <figcaption className="bg-white dark:bg-neutral-950 px-3 py-2.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              {visual.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
