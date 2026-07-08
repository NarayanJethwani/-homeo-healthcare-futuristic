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

  useEffect(() => {
    const all = getAllKnowledgeEntities();
    const current = all.find(e => e.id === currentId);
    if (current) {
      const titleStr = typeof current.title === "string" ? current.title : current.title.en;
      setCurrentNodeTitle(titleStr);
    }

    // Filter relationships connected to current node
    const connected: GraphNode[] = [];
    KNOWLEDGE_RELATIONSHIPS.forEach(rel => {
      let partnerId = "";
      let relationLabel = "";

      if (rel.source === currentId) {
        partnerId = rel.target;
        relationLabel = rel.relation;
      } else if (rel.target === currentId) {
        partnerId = rel.source;
        relationLabel = `is ${rel.relation} of`;
      }

      if (partnerId) {
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
        }
      }
    });

    setNodes(connected.slice(0, 8)); // Limit to max 8 nodes for clean presentation
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
      disease: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/20",
      remedy: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30 hover:bg-teal-500/20",
      symptom: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20",
      "lab-test": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/20"
    };
    return colorMap[type] || "bg-neutral-500/10 text-neutral-600 border-neutral-550";
  };

  const getIcon = (type: string) => {
    if (type === "disease") return <Stethoscope className="h-3.5 w-3.5" />;
    if (type === "remedy") return <Heart className="h-3.5 w-3.5" />;
    if (type === "symptom") return <Activity className="h-3.5 w-3.5" />;
    return <Beaker className="h-3.5 w-3.5" />;
  };

  return (
    <div className="p-6 border border-neutral-200 dark:border-neutral-850 rounded-3xl bg-white/5 backdrop-blur-md space-y-6 print-hide">
      
      {/* Widget Header */}
      <div className="flex justify-between items-center pb-3 border-b border-neutral-200 dark:border-neutral-850">
        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
          <GitFork className="h-4 w-4 text-teal-500" /> Interactive Knowledge Explorer
        </h4>
        <span className="text-[9px] uppercase tracking-wide text-neutral-450 font-bold bg-neutral-100 dark:bg-neutral-950 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-900 font-mono">
          Interactive Graph Map
        </span>
      </div>

      {/* Orbit Visualization Frame */}
      <div className="relative min-h-[220px] flex items-center justify-center border border-neutral-500/5 bg-neutral-950/20 rounded-2xl overflow-hidden p-4">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

        {/* Central Core Node */}
        <div className="z-15 text-center p-3.5 rounded-full border border-teal-500/30 bg-teal-500/5 backdrop-blur-xl max-w-[130px] shadow-[0_0_24px_rgba(20,184,166,0.15)] animate-pulse">
          <span className="text-[9px] text-teal-600 dark:text-teal-400 uppercase font-bold block mb-0.5">CURRENT NODE</span>
          <h5 className="text-[10px] font-extrabold text-neutral-850 dark:text-neutral-50 leading-tight truncate">
            {currentNodeTitle || "Active Article"}
          </h5>
        </div>

        {/* Connected Satellites mapping in circles */}
        {nodes.map((node, idx) => {
          const angle = (idx * 2 * Math.PI) / nodes.length;
          const radius = 85; // Distance from center
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);

          return (
            <Link
              key={node.id}
              href={`/knowledge/${getSectionPath(node.type)}/${node.slug}`}
              style={{
                transform: `translate(${x}px, ${y}px)`,
                transition: "transform 0.5s ease-in-out"
              }}
              className={`absolute p-2 border rounded-full text-center flex items-center gap-1.5 shadow-sm transition-all duration-300 ${getThemeColor(
                node.type
              )}`}
            >
              {getIcon(node.type)}
              <div className="text-[8.5px] font-bold text-left leading-none max-w-[70px] truncate">
                <span className="text-[7.5px] opacity-70 block uppercase font-mono tracking-wide">{node.relation}</span>
                <span className="truncate block font-semibold">{node.title}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <p className="text-[10px] text-neutral-500 text-center leading-normal">
        Click any satellite node to visually explore adjacent disease relationships, remedy affinities, or lab investigations.
      </p>
    </div>
  );
}
