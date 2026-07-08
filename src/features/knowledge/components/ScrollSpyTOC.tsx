"use client";

import React, { useState, useEffect } from "react";
import { Link as ScrollLink } from "lucide-react";

interface TOCItem {
  id: string;
  label: string;
}

interface ScrollSpyTOCProps {
  items: TOCItem[];
}

export default function ScrollSpyTOC({ items }: ScrollSpyTOCProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observers = new Map<string, IntersectionObserver>();
    
    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observerOptions = {
      rootMargin: "-20% 0px -60% 0px", // triggers when element is roughly in middle of page
      threshold: 0.1
    };

    const observer = new IntersectionObserver(callback, observerOptions);

    items.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [items]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  return (
    <div className="space-y-4">
      <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest block mb-4 flex items-center gap-1.5">
        <ScrollLink className="h-3.5 w-3.5 text-teal-500" /> Table of Contents
      </span>
      <nav className="space-y-2">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`w-full text-left py-1 text-xs font-semibold block border-l-2 pl-3 transition-all duration-300 ${
              activeId === item.id
                ? "border-teal-500 text-teal-650 dark:text-teal-400 font-bold translate-x-0.5"
                : "border-neutral-500/10 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
