"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { getAllKnowledgeEntities } from "../index";
import { KNOWLEDGE_RELATIONSHIPS } from "../graph/entityRelationships";
import { Stethoscope, Heart, Beaker, Activity, GitFork, Maximize2, Minimize2, Info } from "lucide-react";

interface GraphNode {
  id: string;
  slug: string;
  title: string;
  type: string;
  relation: string; // HasSymptom, TreatedWith, etc.
  rawRelation: string; // original relation string (e.g. treatedWith, complementaryTo)
  tags: string[];
  summary: string;
}

interface KnowledgeGraphExplorerProps {
  currentId: string;
}

// ─── STABLE STATIC HELPER METHODS ─────────────────────────────────────────

const getSectionPath = (type: string) => {
  const pathMap: Record<string, string> = {
    remedy: "remedies",
    disease: "diseases",
    symptom: "symptoms",
    "lab-test": "lab-tests",
    research: "research",
    "case-study": "case-studies"
  };
  return pathMap[type] || "remedies";
};

const getThemeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    disease: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30 hover:bg-rose-500/20 hover:border-rose-500 hover:shadow-[0_0_12px_rgba(244,63,94,0.3)]",
    remedy: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30 hover:bg-teal-500/20 hover:border-teal-500 hover:shadow-[0_0_12px_rgba(20,184,166,0.3)]",
    symptom: "bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-500 hover:shadow-[0_0_12px_rgba(245,158,11,0.3)]",
    "lab-test": "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-500 hover:shadow-[0_0_12px_rgba(59,130,246,0.3)]",
    research: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30 hover:bg-purple-500/20 hover:border-purple-500 hover:shadow-[0_0_12px_rgba(168,85,247,0.3)]",
    "case-study": "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20 hover:border-indigo-500 hover:shadow-[0_0_12px_rgba(99,102,241,0.3)]"
  };
  return colorMap[type] || "bg-neutral-500/10 text-neutral-600 border-neutral-500/20";
};

const getIcon = (type: string) => {
  if (type === "disease") return <Stethoscope className="h-3 w-3" />;
  if (type === "remedy") return <Heart className="h-3 w-3" />;
  if (type === "symptom") return <Activity className="h-3 w-3" />;
  return <Beaker className="h-3 w-3" />;
};

const getLineStroke = (rawRelation: string) => {
  if (["treatedWith", "hasSymptom", "investigatedBy"].includes(rawRelation)) {
    return ""; // solid line
  }
  if (["complementaryTo"].includes(rawRelation)) {
    return "2,2"; // dashed line
  }
  return "1,2"; // dotted line
};

// ─── MEMOIZED SUB-COMPONENTS ──────────────────────────────────────────────

interface ConnectorLinesProps {
  nodes: GraphNode[];
  hoveredNodeId: string | null;
  focusedNodeId: string | null;
  radiusPercent: number;
  centerPercent: number;
}

const ConnectorLines = React.memo(({
  nodes,
  hoveredNodeId,
  focusedNodeId,
  radiusPercent,
  centerPercent,
}: ConnectorLinesProps) => {
  const activeId = hoveredNodeId || focusedNodeId;
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-5" viewBox="0 0 100 100" data-testid="graph-connector-lines">
      {nodes.map((node, idx) => {
        const angle = (idx * 2 * Math.PI) / nodes.length;
        const nx = centerPercent + radiusPercent * Math.cos(angle);
        const ny = centerPercent + radiusPercent * Math.sin(angle);

        return (
          <line
            key={node.id}
            x1={centerPercent}
            y1={centerPercent}
            x2={nx}
            y2={ny}
            className="stroke-neutral-300 dark:stroke-neutral-800 transition-all duration-300 motion-reduce:transition-none"
            strokeWidth={activeId === node.id ? 0.8 : 0.3}
            strokeDasharray={getLineStroke(node.rawRelation)}
          />
        );
      })}
    </svg>
  );
});
ConnectorLines.displayName = "ConnectorLines";

interface SatelliteNodeProps {
  node: GraphNode;
  idx: number;
  totalNodes: number;
  radiusPercent: number;
  centerPercent: number;
  isHovered: boolean;
  isFocused: boolean;
  onHoverStart: (node: GraphNode) => void;
  onHoverEnd: () => void;
  onFocus: (node: GraphNode) => void;
  onBlur: () => void;
}

const SatelliteNode = React.memo(({
  node,
  idx,
  totalNodes,
  radiusPercent,
  centerPercent,
  isHovered,
  isFocused,
  onHoverStart,
  onHoverEnd,
  onFocus,
  onBlur,
}: SatelliteNodeProps) => {
  const angle = (idx * 2 * Math.PI) / totalNodes;
  const nx = centerPercent + radiusPercent * Math.cos(angle);
  const ny = centerPercent + radiusPercent * Math.sin(angle);

  const active = isHovered || isFocused;

  return (
    <Link
      href={`/knowledge/${getSectionPath(node.type)}/${node.slug}`}
      style={{
        left: `${nx}%`,
        top: `${ny}%`
      }}
      onMouseEnter={() => onHoverStart(node)}
      onMouseLeave={onHoverEnd}
      onFocus={() => onFocus(node)}
      onBlur={onBlur}
      aria-describedby={active ? "graph-tooltip-details" : undefined}
      data-testid={`satellite-${node.id}`}
      className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 border rounded-2xl text-center flex flex-col items-center justify-center gap-0.5 shadow-sm transition-all duration-350 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-1 focus:ring-teal-500 z-10 w-24 md:w-28 h-12 leading-none cursor-pointer motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:focus:scale-100 ${getThemeColor(
        node.type
      )} ${active ? "ring-1 ring-teal-500" : ""}`}
    >
      <div className="flex items-center gap-1">
        {getIcon(node.type)}
        <span className="text-[7.5px] opacity-75 uppercase font-mono tracking-wide truncate max-w-[50px] md:max-w-[65px]">{node.relation}</span>
      </div>
      <span className="text-[8px] md:text-[9px] font-extrabold truncate block w-full text-center mt-0.5">{node.title}</span>
    </Link>
  );
});
SatelliteNode.displayName = "SatelliteNode";

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────

export default function KnowledgeGraphExplorer({ currentId }: KnowledgeGraphExplorerProps) {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [currentNodeTitle, setCurrentNodeTitle] = useState("");
  const [currentNodeType, setCurrentNodeType] = useState("");
  const [currentNodeSummary, setCurrentNodeSummary] = useState("");
  const [errorOccurred, setErrorOccurred] = useState(false);
  
  // Immersive states
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [focusedNode, setFocusedNode] = useState<GraphNode | null>(null);
  const [mounted, setMounted] = useState(false);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const portalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isFullScreen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isFullScreen]);

  // Escape to Close & Focus trapping
  useEffect(() => {
    if (!isFullScreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullScreen(false);
        triggerRef.current?.focus();
        return;
      }

      if (e.key === "Tab" && portalRef.current) {
        const focusables = portalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabIndex]:not([tabIndex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0] as HTMLElement;
        const last = focusables[focusables.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [isFullScreen]);

  // Initial focus transfer
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isFullScreen && mounted) {
      timer = setTimeout(() => {
        const closeBtn = portalRef.current?.querySelector('[data-testid="close-explorer-btn"]') as HTMLElement;
        closeBtn?.focus();
      }, 30);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isFullScreen, mounted]);

  useEffect(() => {
    try {
      const all = getAllKnowledgeEntities();
      const current = all.find(e => e.id === currentId);
      if (current) {
        const titleStr = typeof current.title === "string" ? current.title : current.title.en;
        const summaryStr = typeof current.summary === "string" ? current.summary : current.summary.en;
        setCurrentNodeTitle(titleStr);
        setCurrentNodeType(current.entityType);
        setCurrentNodeSummary(summaryStr);
      } else {
        setCurrentNodeTitle("Active Topic");
        setCurrentNodeType("");
        setCurrentNodeSummary("");
      }

      // Filter direct relationships connected to current node
      const connected: GraphNode[] = [];
      const existingIds = new Set<string>([currentId]);

      KNOWLEDGE_RELATIONSHIPS.forEach(rel => {
        let partnerId = "";
        let relationLabel = "";

        if (rel.source === currentId) {
          partnerId = rel.target;
          relationLabel = rel.relation;
        } else if (rel.target === currentId) {
          partnerId = rel.source;
          relationLabel = `linked to`;
        }

        if (partnerId && !existingIds.has(partnerId)) {
          const partner = all.find(e => e.id === partnerId);
          if (partner) {
            const titleStr = typeof partner.title === "string" ? partner.title : partner.title.en;
            const summaryStr = typeof partner.summary === "string" ? partner.summary : partner.summary.en;
            connected.push({
              id: partner.id,
              slug: partner.slug,
              title: titleStr,
              type: partner.entityType,
              relation: relationLabel,
              rawRelation: rel.relation,
              tags: partner.tags,
              summary: summaryStr
            });
            existingIds.add(partner.id);
          }
        }
      });

      // FALLBACK: Populate with a diverse mix of categories if direct relationships are fewer than 8
      if (connected.length < 8 && current) {
        const remedies = all.filter(e => e.entityType === "remedy" && e.editorialStatus === "published" && !existingIds.has(e.id));
        const symptoms = all.filter(e => e.entityType === "symptom" && e.editorialStatus === "published" && !existingIds.has(e.id));
        const diseases = all.filter(e => e.entityType === "disease" && e.editorialStatus === "published" && !existingIds.has(e.id));
        const labTests = all.filter(e => e.entityType === "lab-test" && e.editorialStatus === "published" && !existingIds.has(e.id));

        const mixList: typeof all = [];
        const maxLen = Math.max(remedies.length, symptoms.length, diseases.length, labTests.length);
        
        for (let i = 0; i < maxLen; i++) {
          if (remedies[i]) mixList.push(remedies[i]);
          if (symptoms[i]) mixList.push(symptoms[i]);
          if (diseases[i]) mixList.push(diseases[i]);
          if (labTests[i]) mixList.push(labTests[i]);
        }

        mixList.forEach(partner => {
          if (connected.length >= 8) return;
          const titleStr = typeof partner.title === "string" ? partner.title : partner.title.en;
          const summaryStr = typeof partner.summary === "string" ? partner.summary : partner.summary.en;
          connected.push({
            id: partner.id,
            slug: partner.slug,
            title: titleStr,
            type: partner.entityType,
            relation: partner.entityType === "remedy" ? "remedy" : partner.entityType === "symptom" ? "symptom" : partner.entityType === "lab-test" ? "lab eval" : "related",
            rawRelation: "fallback",
            tags: partner.tags,
            summary: summaryStr
          });
          existingIds.add(partner.id);
        });
      }

      setNodes(connected.slice(0, 8)); // Cap at 8 nodes for nice immersive layout
      setErrorOccurred(false);
    } catch (err) {
      console.error("Failed to load Knowledge Graph Explorer nodes:", err);
      setErrorOccurred(true);
    }
  }, [currentId]);

  const radiusPercent = 38;
  const centerPercent = 50;

  const activeNodeId = (hoveredNode || focusedNode)?.id || null;

  // Memoized handlers for child components
  const handleHoverStart = useCallback((node: GraphNode) => setHoveredNode(node), []);
  const handleHoverEnd = useCallback(() => setHoveredNode(null), []);
  const handleFocus = useCallback((node: GraphNode) => setFocusedNode(node), []);
  const handleBlur = useCallback(() => setFocusedNode(null), []);

  const activeNode = hoveredNode || focusedNode;

  const mainContent = useMemo(() => (
    <div className="relative w-full h-full flex items-center justify-center bg-white/60 dark:bg-neutral-900/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-850 select-none" data-testid="graph-interactive-workspace">
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      {/* SVG Connector Lines */}
      <ConnectorLines
        nodes={nodes}
        hoveredNodeId={hoveredNode?.id || null}
        focusedNodeId={focusedNode?.id || null}
        radiusPercent={radiusPercent}
        centerPercent={centerPercent}
      />

      {/* Central Core Node */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center p-3 rounded-full border border-teal-500/40 bg-teal-500/10 dark:bg-teal-950/80 backdrop-blur-xl w-24 h-24 md:w-28 md:h-28 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.15)]">
        <span className="text-[7.5px] text-teal-600 dark:text-teal-400 uppercase font-extrabold block mb-0.5 tracking-widest">ACTIVE</span>
        <h5 className="text-[9px] md:text-[10px] font-extrabold text-neutral-800 dark:text-neutral-50 leading-tight w-full px-1 line-clamp-3 text-center">
          {currentNodeTitle}
        </h5>
        {currentNodeType && (
          <span className="text-[6.5px] text-neutral-450 dark:text-neutral-400 font-bold uppercase tracking-wider block mt-1">
            {currentNodeType}
          </span>
        )}
      </div>

      {/* Connected Satellites */}
      {nodes.map((node, idx) => (
        <SatelliteNode
          key={node.id}
          node={node}
          idx={idx}
          totalNodes={nodes.length}
          radiusPercent={radiusPercent}
          centerPercent={centerPercent}
          isHovered={hoveredNode?.id === node.id}
          isFocused={focusedNode?.id === node.id}
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      ))}

      {/* Polished Floating Tooltip Details Card */}
      {activeNode && (
        <div
          id="graph-tooltip-details"
          className="absolute bottom-4 left-4 right-4 z-40 p-3.5 bg-neutral-900/95 dark:bg-black/95 border border-neutral-800 rounded-2xl text-left backdrop-blur-xl animate-fadeIn pointer-events-none"
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h6 className="text-[10px] font-bold text-neutral-50 flex items-center gap-1">
              {getIcon(activeNode.type)} {activeNode.title}
            </h6>
            <span className="text-[7.5px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-mono">
              {activeNode.type}
            </span>
          </div>
          {activeNode.summary && (
            <p className="text-[8.5px] text-neutral-300 leading-relaxed line-clamp-2 mb-1.5">
              {activeNode.summary}
            </p>
          )}
          {activeNode.tags && activeNode.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {activeNode.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[6.5px] bg-white/5 text-neutral-400 px-1 py-0.2 rounded border border-neutral-800">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {nodes.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-neutral-900/60 z-30">
          <Info className="h-6 w-6 text-neutral-450 mb-2" />
          <p className="text-xs text-neutral-300 leading-normal max-w-[220px]">
            Knowledge graph is still expanding for this topic. Explore related articles below.
          </p>
        </div>
      )}
    </div>
  ), [nodes, hoveredNode, focusedNode, currentNodeTitle, currentNodeType, handleHoverStart, handleHoverEnd, handleFocus, handleBlur, activeNode]);

  if (errorOccurred) {
    return (
      <div className="p-6 border border-neutral-200 dark:border-neutral-850 rounded-3xl bg-white/5 text-center">
        <p className="text-xs text-neutral-500">
          Knowledge Graph Explorer is currently unavailable. Please browse related topics below.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="graph-exclude p-6 border border-neutral-200 dark:border-neutral-850 rounded-3xl bg-white/5 backdrop-blur-md space-y-6 print-hide shadow-sm transition-all duration-350">
        
        {/* Widget Header */}
        <div className="flex justify-between items-center pb-3 border-b border-neutral-200 dark:border-neutral-850">
          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <GitFork className="h-4 w-4 text-teal-500" /> Interactive Knowledge Explorer
          </h4>
          <div className="flex items-center gap-2">
            <button
              ref={triggerRef}
              onClick={() => setIsFullScreen(true)}
              aria-label="Expand graph to fullscreen"
              className="p-1 rounded-lg border border-neutral-500/10 hover:bg-neutral-500/5 text-neutral-400 hover:text-neutral-200 transition-all cursor-pointer"
              title="Expand to Fullscreen"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
            <span className="text-[9px] uppercase tracking-wide text-teal-600 dark:text-teal-400 font-bold bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20 font-mono">
              Clinical Map
            </span>
          </div>
        </div>

        {/* Orbit Visualization Frame - Responsive Square */}
        <div className="w-full aspect-square max-w-[340px] md:max-w-[450px] lg:max-w-[500px] mx-auto relative" data-testid="inline-graph-container">
          {!isFullScreen && mainContent}
        </div>

        {/* Graph Legend */}
        <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-850 text-[8.5px] md:text-[9.5px] font-bold uppercase tracking-wider text-neutral-500">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500/20 border border-rose-500" /> Disease</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500/20 border border-amber-500" /> Symptom</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-teal-500/20 border border-teal-500" /> Remedy</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500/20 border border-blue-500" /> Lab Test</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500/20 border border-purple-500" /> Research</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500/20 border border-indigo-500" /> Case Study</span>
        </div>

        <p className="text-[9.5px] text-neutral-500 text-center leading-normal">
          Hover over nodes to inspect details. Click nodes to navigate and explore adjacent clinical paths.
        </p>
      </div>

      {/* FULLSCREEN IMMERSIVE MODAL PORTAL VIEW */}
      {isFullScreen && mounted && typeof document !== "undefined" && createPortal(
        <div
          ref={portalRef}
          role="dialog"
          aria-modal="true"
          aria-label="Clinical Graph Explorer"
          className="fixed inset-0 z-[9999] bg-pearl/98 dark:bg-black/98 backdrop-blur-xl flex flex-col justify-between p-6 md:p-12 animate-fadeIn text-neutral-900 dark:text-neutral-50 shadow-2xl"
        >
          {/* Fullscreen Header */}
          <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800 pb-4">
            <div className="space-y-1">
              <h3 className="text-base md:text-lg font-extrabold flex items-center gap-2 text-neutral-900 dark:text-neutral-50">
                <GitFork className="h-5 w-5 text-teal-500 animate-pulse" /> Homeo Healthcare Clinical Graph Explorer
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">
                Immersive relational rendering of homeopathic materia medica, diagnostic testing, and clinical symptoms.
              </p>
            </div>
            <button
              data-testid="close-explorer-btn"
              aria-label="Close fullscreen graph"
              onClick={() => {
                setIsFullScreen(false);
                triggerRef.current?.focus();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-all cursor-pointer shadow-md"
            >
              <Minimize2 className="h-4 w-4" /> Close Explorer
            </button>
          </div>

          {/* Immersive Central Interactive Graph Area */}
          <div className="flex-1 w-full max-w-3xl mx-auto relative my-8 flex items-center justify-center" data-testid="fullscreen-graph-container">
            <div className="w-full aspect-square max-w-[340px] md:max-w-[480px] lg:max-w-[540px] relative">
              {mainContent}
            </div>
          </div>

          {/* Fullscreen Footer */}
          <div className="border-t border-neutral-200 dark:border-neutral-850 pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap justify-center gap-5 text-[9px] font-extrabold uppercase tracking-widest text-neutral-500 dark:text-neutral-450">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500/25 border border-rose-500" /> Disease</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500/25 border border-amber-500" /> Symptom</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-500/25 border border-teal-500" /> Remedy</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500/25 border border-blue-500" /> Lab Test</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500/25 border border-purple-500" /> Research</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500/25 border border-indigo-500" /> Case Study</span>
              <span className="flex items-center gap-1.5"><span className="h-[1px] w-5 border-t border-dashed border-neutral-300 dark:border-neutral-500" /> Link Strength</span>
            </div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
              Click any satellite node to navigate to its details.
            </p>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
