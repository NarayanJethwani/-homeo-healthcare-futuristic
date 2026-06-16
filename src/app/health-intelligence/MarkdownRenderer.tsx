import React from "react";

interface MarkdownRendererProps {
  text: string;
  onActionClick?: (action: string) => void;
}

interface Section {
  type: "default" | "clinical" | "constitutional" | "signals" | "timeline" | "whatsapp";
  title: string;
  lines: string[];
}

export default function MarkdownRenderer({ text, onActionClick }: MarkdownRendererProps) {
  if (!text) return null;

  const lines = text.split("\n");
  const sections: Section[] = [];
  let currentSection: Section = { type: "default", title: "", lines: [] };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("### ") || trimmed.startsWith("## ") || trimmed.startsWith("#### ")) {
      if (currentSection.lines.length > 0 || currentSection.title) {
        sections.push(currentSection);
      }
      
      const title = trimmed.replace(/^(###|##|####)\s+/, "");
      let type: Section["type"] = "default";
      const lowerTitle = title.toLowerCase();
      if (lowerTitle.includes("clinical insight") || lowerTitle.includes("clinical perspective") || title.includes("👨⚕️") || lowerTitle.includes("clinical discussion")) {
        type = "clinical";
      } else if (lowerTitle.includes("constitutional")) {
        type = "constitutional";
      } else if (lowerTitle.includes("signal") || lowerTitle.includes("summary") || lowerTitle.includes("scorecard") || lowerTitle.includes("confidence") || lowerTitle.includes("data used")) {
        type = "signals";
      } else if (lowerTitle.includes("timeline") || lowerTitle.includes("what changed")) {
        type = "timeline";
      } else if (lowerTitle.includes("whatsapp")) {
        type = "whatsapp";
      }

      currentSection = { type, title, lines: [] };
    } else {
      currentSection.lines.push(line);
    }
  }
  if (currentSection.lines.length > 0 || currentSection.title) {
    sections.push(currentSection);
  }

  const parseInline = (inlineText: string): React.ReactNode[] => {
    // Split to find **bold**, *italic*, and [button] segments
    const parts = inlineText.split(/(\*\*.*?\*\*|\*.*?\*|\[.*?\])/);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-extrabold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      } else if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <em key={index} className="italic text-slate-800 dark:text-zinc-300">
            {part.slice(1, -1)}
          </em>
        );
      } else if (part.startsWith("[") && part.endsWith("]")) {
        const label = part.slice(1, -1);
        return (
          <button
            key={index}
            onClick={() => onActionClick?.(label)}
            className="mx-1 my-1 px-3 py-1.5 bg-teal-500/10 dark:bg-teal-400/20 hover:bg-teal-600 dark:hover:bg-teal-500 hover:text-white border border-teal-500/30 text-teal-700 dark:text-teal-300 rounded-xl text-[10px] font-black tracking-wide transition-all cursor-pointer shadow-sm active:scale-95 inline-flex items-center gap-1 leading-none"
          >
            {label}
          </button>
        );
      } else {
        return part;
      }
    });
  };

  const renderSectionContent = (secLines: string[]) => {
    const elements: React.ReactNode[] = [];
    let listItems: React.ReactNode[] = [];
    let listKey = 0;

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${listKey++}`} className="list-disc pl-5 my-2 space-y-1.5 text-slate-700 dark:text-zinc-300">
            {listItems}
          </ul>
        );
        listItems = [];
      }
    };

    for (let idx = 0; idx < secLines.length; idx++) {
      const line = secLines[idx].trim();
      if (!line) {
        flushList();
        continue;
      }

      // Bullets
      if (line.startsWith("- ") || line.startsWith("* ")) {
        listItems.push(
          <li key={`li-${idx}`} className="text-[11.5px] leading-relaxed">
            {parseInline(line.substring(2))}
          </li>
        );
      }
      // Numbered items
      else if (/^\d+\.\s/.test(line)) {
        flushList();
        const match = line.match(/^(\d+)\.\s(.*)/);
        if (match) {
          elements.push(
            <div key={`ol-${idx}`} className="flex gap-2 text-[11.5px] leading-relaxed my-1.5 pl-1">
              <span className="font-bold text-teal-600 dark:text-teal-455">{match[1]}.</span>
              <span className="text-slate-700 dark:text-zinc-300">{parseInline(match[2])}</span>
            </div>
          );
        }
      }
      // Status signals with colored indicator spheres (e.g. 🟢 recovery capacity) or tick/warn marks
      else if (line.includes("🟢") || line.includes("🟡") || line.includes("🔴") || line.includes("⚪") || line.includes("✓") || line.includes("⚠")) {
        flushList();
        elements.push(
          <div key={`status-${idx}`} className="flex items-start gap-2 text-[11px] leading-relaxed my-1.5 bg-white/40 dark:bg-slate-900/40 p-2 rounded-xl border border-slate-100/50 dark:border-slate-800/30">
            <span className="text-slate-750 dark:text-zinc-300">{parseInline(line)}</span>
          </div>
        );
      }
      // Standard text block
      else {
        flushList();
        elements.push(
          <p key={`p-${idx}`} className="text-[11.5px] leading-relaxed mb-2 text-slate-750 dark:text-zinc-300 last:mb-0">
            {parseInline(line)}
          </p>
        );
      }
    }
    flushList();
    return elements;
  };

  return (
    <div className="space-y-3.5">
      {sections.map((section, sIdx) => {
        const content = renderSectionContent(section.lines);
        
        if (section.type === "default") {
          return (
            <div key={sIdx} className="space-y-2">
              {section.title && (
                <h4 className="font-extrabold text-[12.5px] text-slate-800 dark:text-zinc-250 mt-3 mb-1.5 font-sans tracking-wide">
                  {parseInline(section.title)}
                </h4>
              )}
              {content}
            </div>
          );
        }

        // Card rendering for special v2.1 layouts
        let cardClass = "";
        let borderClass = "";
        let headerColor = "";

        if (section.type === "clinical") {
          cardClass = "bg-indigo-500/5 dark:bg-indigo-400/5";
          borderClass = "border-indigo-500/20 dark:border-indigo-400/20";
          headerColor = "text-indigo-700 dark:text-indigo-400";
        } else if (section.type === "constitutional") {
          cardClass = "bg-teal-500/5 dark:bg-teal-400/5";
          borderClass = "border-teal-500/20 dark:border-teal-400/20";
          headerColor = "text-teal-700 dark:text-teal-400";
        } else if (section.type === "signals") {
          cardClass = "bg-slate-500/5 dark:bg-slate-400/5";
          borderClass = "border-slate-500/15 dark:border-slate-400/15";
          headerColor = "text-slate-750 dark:text-slate-350";
        } else if (section.type === "timeline") {
          cardClass = "bg-amber-500/5 dark:bg-amber-400/5";
          borderClass = "border-amber-500/15 dark:border-amber-400/15";
          headerColor = "text-amber-700 dark:text-amber-400";
        } else if (section.type === "whatsapp") {
          cardClass = "bg-emerald-500/5 dark:bg-emerald-400/5";
          borderClass = "border-emerald-500/20 dark:border-emerald-400/20";
          headerColor = "text-emerald-700 dark:text-emerald-400";
        }

        return (
          <div 
            key={sIdx} 
            className={`rounded-2xl border p-3.5 shadow-sm transition-all space-y-2 ${cardClass} ${borderClass}`}
          >
            {section.title && (
              <div className="flex items-center gap-1.5 pb-1.5 border-b border-slate-200/40 dark:border-slate-800/40">
                <span className={`text-[11px] font-black uppercase tracking-wider ${headerColor}`}>
                  {section.type === "clinical" && "👨⚕️ "}
                  {section.type === "constitutional" && "✨ "}
                  {section.type === "signals" && "📊 "}
                  {section.type === "timeline" && "🕒 "}
                  {section.type === "whatsapp" && "📱 "}
                  {section.title}
                </span>
              </div>
            )}
            <div className="space-y-1.5">{content}</div>
          </div>
        );
      })}
    </div>
  );
}
