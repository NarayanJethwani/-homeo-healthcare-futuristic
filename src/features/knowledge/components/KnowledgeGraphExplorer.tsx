"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getAllKnowledgeEntities } from "../index";
import { KNOWLEDGE_RELATIONSHIPS } from "../graph/entityRelationships";
import { KnowledgeEntity } from "../types";
import { Stethoscope, Heart, Beaker, Activity, GitFork } from "lucide-react";

interface GraphNode {
  id: string;
  slug: string;
  title: string;
  type: string;
  relation: string; // HasSymptom, TreatedWith, etc.
}

interface KnowledgeGraphExplorerProps {
  currentId: string;
}

export default function KnowledgeGraphExplorer({ currentId }: KnowledgeGraphExplorerProps) {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [currentNodeTitle, setCurrentNodeTitle] = useState("");
  const [errorOccurred, setErrorOccurred] = useState(false);

  useEffect(() => {
    try {
      const all = getAllKnowledgeEntities();
      const current = all.find(e => e.id === currentId);
      if (current) {
        const titleStr = typeof current.title === "string" ? current.title : current.title.en;
        setCurrentNodeTitle(titleStr);
      } else {
        setCurrentNodeTitle("Active Topic");
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
            connected.push({
              id: partner.id,
              slug: partner.slug,
              title: titleStr,
              type: partner.entityType,
              relation: relationLabel
            });
            existingIds.add(partner.id);
          }
        }
      });

      // FALLBACK 1: If direct relationships are fewer than 5, load same-category entities
      if (connected.length < 5 && current) {
        const categoryMatches = all.filter(e => 
          e.entityType === current.entityType && 
          e.editorialStatus === "published" && 
          !existingIds.has(e.id)
        );

        categoryMatches.forEach(partner => {
          if (connected.length >= 6) return;
          const titleStr = typeof partner.title === "string" ? partner.title : partner.title.en;
          connected.push({
            id: partner.id,
            slug: partner.slug,
            title: titleStr,
            type: partner.entityType,
            relation: "related topic"
          });
          existingIds.add(partner.id);
        });
      }

      // FALLBACK 2: Fill remaining slots with core high-value entities
      if (connected.length < 4) {
        const coreIds = ["D0001", "R0002", "S0001", "L0001", "D0003", "R0001"];
        coreIds.forEach(coreId => {
          if (connected.length >= 6) return;
          if (existingIds.has(coreId)) return;

          const partner = all.find(e => e.id === coreId);
          if (partner) {
            const titleStr = typeof partner.title === "string" ? partner.title : partner.title.en;
            connected.push({
              id: partner.id,
              slug: partner.slug,
              title: titleStr,
              type: partner.entityType,
              relation: "clinical focus"
            });
            existingIds.add(coreId);
          }
        });
      }

      setNodes(connected.slice(0, 6)); // Cap at 6 nodes for neat circular spacing
      setErrorOccurred(false);
    } catch (err) {
      console.error("Failed to load Knowledge Graph Explorer nodes:", err);
      setErrorOccurred(true);
    }
  }, [currentId]);

  const getSectionPath = (type: string) => {
    const pathMap: Record<string, string> = {
      remedy: "remedies",
      disease: "diseases",
      symptom: "symptoms",
      "lab-test": "lab-tests"
    };
    return pathMap[type] || "remedies";
  };

  const getThemeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      disease: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/20 hover:border-rose-500",
      remedy: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30 hover:bg-teal-500/20 hover:border-teal-500",
      symptom: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-500",
      "lab-test": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-500"
    };
    return colorMap[type] || "bg-neutral-500/10 text-neutral-600 border-neutral-500/20";
  };

  const getIcon = (type: string) => {
    if (type === "disease") return <Stethoscope className="h-3 w-3" />;
    if (type === "remedy") return <Heart className="h-3 w-3" />;
    if (type === "symptom") return <Activity className="h-3 w-3" />;
    return <Beaker className="h-3 w-3" />;
  };

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
    <div className="p-6 border border-neutral-200 dark:border-neutral-850 rounded-3xl bg-white/5 backdrop-blur-md space-y-6 print-hide shadow-sm">
      
      {/* Widget Header */}
      <div className="flex justify-between items-center pb-3 border-b border-neutral-200 dark:border-neutral-850">
        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
          <GitFork className="h-4 w-4 text-teal-500" /> Interactive Knowledge Explorer
        </h4>
        <span className="text-[9px] uppercase tracking-wide text-teal-600 dark:text-teal-400 font-bold bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20 font-mono">
          Clinical Map
        </span>
      </div>

      {/* Orbit Visualization Frame */}
      <div className="relative w-full aspect-square max-w-[340px] md:max-w-[380px] mx-auto flex items-center justify-center bg-neutral-950/20 dark:bg-black/10 rounded-2xl overflow-hidden border border-neutral-500/5">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        {/* SVG Connector Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-5" viewBox="0 0 100 100">
          {nodes.map((_, idx) => {
            const angle = (idx * 2 * Math.PI) / nodes.length;
            const radius = 33; // Radius distance in %
            const nx = 50 + radius * Math.cos(angle);
            const ny = 50 + radius * Math.sin(angle);

            return (
              <line
                key={idx}
                x1="50"
                y1="50"
                x2={nx}
                y2={ny}
                className="stroke-neutral-300 dark:stroke-neutral-800"
                strokeWidth="0.4"
                strokeDasharray="1,1"
              />
            );
          })}
        </svg>

        {/* Central Core Node */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center p-3 rounded-full border border-teal-500/40 bg-teal-500/10 dark:bg-teal-950/80 backdrop-blur-xl w-24 h-24 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.15)] select-none">
          <span className="text-[7.5px] text-teal-600 dark:text-teal-400 uppercase font-extrabold block mb-0.5 tracking-wider">ACTIVE</span>
          <h5 className="text-[9.5px] font-extrabold text-neutral-800 dark:text-neutral-50 leading-tight w-full px-1 line-clamp-3 text-center">
            {currentNodeTitle}
          </h5>
        </div>

        {/* Connected Satellites mapping in responsive percentages */}
        {nodes.map((node, idx) => {
          const angle = (idx * 2 * Math.PI) / nodes.length;
          const radius = 33; // Matches SVG line radius
          const nx = 50 + radius * Math.cos(angle);
          const ny = 50 + radius * Math.sin(angle);

          return (
            <Link
              key={node.id}
              href={`/knowledge/${getSectionPath(node.type)}/${node.slug}`}
              style={{
                left: `${nx}%`,
                top: `${ny}%`
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 border rounded-xl text-center flex flex-col items-center justify-center gap-0.5 shadow-sm transition-all duration-300 hover:scale-105 z-10 w-20 max-w-[85px] h-12 leading-none cursor-pointer ${getThemeColor(
                node.type
              )}`}
            >
              <div className="flex items-center gap-1">
                {getIcon(node.type)}
                <span className="text-[7.5px] opacity-75 uppercase font-mono tracking-wide truncate max-w-[45px]">{node.relation}</span>
              </div>
              <span className="text-[8.5px] font-extrabold truncate block w-full text-center mt-0.5">{node.title}</span>
            </Link>
          );
        })}

        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center bg-neutral-900/40 z-30">
            <p className="text-xs text-neutral-450 leading-normal max-w-[200px]">
              No mapped clinical relationships yet. Explore related Knowledge topics below.
            </p>
          </div>
        )}
      </div>

      <p className="text-[10px] text-neutral-500 text-center leading-normal">
        Click any satellite node to visually explore adjacent disease relationships, remedy affinities, or lab investigations.
      </p>
    </div>
  );
}
