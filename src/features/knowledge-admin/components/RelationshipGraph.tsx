import React, { useState } from "react";
import { KmsKnowledgeEntity } from "../types";
import { getRelationshipSuggestions } from "../validation/relationshipSuggestions";
import { Activity, Stethoscope, Heart, Beaker, HelpCircle, FileText, UserCheck, Plus, Trash2, Check, Lightbulb } from "lucide-react";

interface RelationshipGraphProps {
  entity: KmsKnowledgeEntity;
  allEntities: KmsKnowledgeEntity[];
  onLink: (targetId: string) => void;
  onUnlink: (targetId: string) => void;
}

export default function RelationshipGraph({ entity, allEntities, onLink, onUnlink }: RelationshipGraphProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>("all");

  const suggestions = getRelationshipSuggestions(entity, allEntities);

  const getIcon = (type: string) => {
    switch (type) {
      case "disease": return <Stethoscope className="h-4 w-4 text-rose-500" />;
      case "symptom": return <Activity className="h-4 w-4 text-amber-500" />;
      case "remedy": return <Heart className="h-4 w-4 text-emerald-500" />;
      case "lab-test": return <Beaker className="h-4 w-4 text-blue-500" />;
      case "faq": return <HelpCircle className="h-4 w-4 text-purple-500" />;
      case "research": return <FileText className="h-4 w-4 text-indigo-500" />;
      case "case-study": return <UserCheck className="h-4 w-4 text-cyan-400" />;
      default: return <FileText className="h-4 w-4 text-neutral-500" />;
    }
  };

  const getPluralHeader = (type: string) => {
    switch (type) {
      case "disease": return "Diseases";
      case "symptom": return "Symptoms";
      case "remedy": return "Remedies";
      case "lab-test": return "Lab Tests";
      case "faq": return "FAQs";
      case "research": return "Research Papers";
      case "case-study": return "Case Studies";
      default: return "Related";
    }
  };

  // Find linked entities objects
  const linkedObjects = allEntities.filter(e => entity.relatedEntities.includes(e.id));

  // Search items to link
  const linkablePool = allEntities.filter(e => 
    e.id !== entity.id && 
    !entity.relatedEntities.includes(e.id) &&
    (activeTypeFilter === "all" || e.entityType === activeTypeFilter) &&
    (e.title.en.toLowerCase().includes(searchTerm.toLowerCase()) || e.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* 1. suggestions block */}
      {suggestions.length > 0 && (
        <div className="p-4 border border-amber-500/20 bg-amber-500/5 rounded-2xl space-y-3">
          <div className="flex items-center gap-1.5 text-amber-400">
            <Lightbulb className="h-4 w-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Smart Relationship Suggestions
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {suggestions.map(sug => (
              <div key={sug.entityId} className="flex justify-between items-center gap-2 p-2 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-amber-500/40 transition-colors">
                <div className="flex items-center gap-2">
                  {getIcon(sug.type)}
                  <div className="space-y-0.5 leading-none">
                    <span className="text-xs font-semibold text-neutral-200 block truncate max-w-[180px]">
                      {sug.title}
                    </span>
                    <span className="text-[8px] text-neutral-400 font-mono">
                      {sug.reason} &bull; {Math.round(sug.confidence * 100)}% Match
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onLink(sug.entityId)}
                  className="text-xs bg-amber-500/20 hover:bg-amber-500/40 text-amber-400 px-2 py-0.5 rounded border border-amber-500/25 flex items-center gap-0.5 transition-all"
                >
                  <Plus className="h-3 w-3" /> Link
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Visual relationships tree layout */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-neutral-350">
          Active Knowledge Mappings ({linkedObjects.length} Connections)
        </h4>

        {linkedObjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {linkedObjects.map(obj => (
              <div key={obj.id} className="p-2.5 bg-neutral-900 border border-neutral-850 rounded-xl flex justify-between items-center hover:border-neutral-700 transition-colors">
                <div className="flex items-center gap-2.5">
                  {getIcon(obj.entityType)}
                  <div>
                    <span className="text-[9px] font-bold text-neutral-500 block uppercase tracking-wider">
                      {getPluralHeader(obj.entityType)}
                    </span>
                    <h5 className="text-xs font-semibold text-neutral-200">
                      {obj.title.en}
                    </h5>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onUnlink(obj.id)}
                  className="text-neutral-500 hover:text-rose-500 p-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 border border-dashed border-neutral-850 rounded-2xl text-center text-xs text-neutral-500">
            No active connections configured. Link symptoms, indicated remedies, or diagnostic tests below.
          </div>
        )}
      </div>

      {/* 3. Link builder picker */}
      <div className="space-y-3 border-t border-neutral-850 pt-5">
        <h4 className="text-xs font-bold text-neutral-300">
          Establish New Clinical Connection
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Search bar */}
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search entity name or ID..."
            className="w-full text-xs px-3 py-1.5 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200 focus:outline-none focus:border-cyan-600 sm:col-span-2"
          />

          {/* Type Filter */}
          <select
            value={activeTypeFilter}
            onChange={e => setActiveTypeFilter(e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-300 focus:outline-none focus:border-cyan-600"
          >
            <option value="all">All Types</option>
            <option value="disease">Diseases</option>
            <option value="symptom">Symptoms</option>
            <option value="remedy">Remedies</option>
            <option value="lab-test">Lab Tests</option>
            <option value="faq">FAQs</option>
            <option value="research">Research Summary</option>
            <option value="case-study">Case Studies</option>
          </select>
        </div>

        {/* Picker grid list */}
        <div className="max-h-48 overflow-y-auto border border-neutral-850 rounded-xl bg-neutral-950 divide-y divide-neutral-900 custom-scrollbar">
          {linkablePool.map(item => (
            <div
              key={item.id}
              onClick={() => onLink(item.id)}
              className="p-2.5 flex justify-between items-center hover:bg-neutral-900 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                {getIcon(item.entityType)}
                <div>
                  <h5 className="text-xs font-semibold text-neutral-200">
                    {item.title.en}
                  </h5>
                  <span className="text-[9px] font-mono text-neutral-500">
                    {item.id} ({item.entityType})
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="text-xs bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600 hover:text-neutral-950 font-bold px-2 py-0.5 rounded transition-all"
              >
                Link
              </button>
            </div>
          ))}
          {linkablePool.length === 0 && (
            <div className="p-4 text-center text-xs text-neutral-500">
              No matching matching entities available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
