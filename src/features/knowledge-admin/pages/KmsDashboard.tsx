import React, { useState, useEffect } from "react";
import { KmsKnowledgeEntity, EditorialRole } from "../types";
import globalKmsRepository from "../repositories/MemoryRepository";
import DashboardHealthCard from "../components/DashboardHealthCard";
import { exportEntities, importEntitiesFromJson } from "../adapters/importExport";
import { runQualityGateChecks } from "../validation/qualityGates";
import { ShieldAlert, Plus, Upload, Download, ArrowRight } from "lucide-react";

interface KmsDashboardProps {
  onEditEntity: (entity: KmsKnowledgeEntity) => void;
  onCreateEntity: (type: string) => void;
  currentUser: { name: string; role: EditorialRole };
}

export default function KmsDashboard({ onEditEntity, onCreateEntity, currentUser }: KmsDashboardProps) {
  const [entities, setEntities] = useState<KmsKnowledgeEntity[]>([]);
  const [reviewQueue, setReviewQueue] = useState<KmsKnowledgeEntity[]>([]);
  const [exportFormat, setExportFormat] = useState<"json" | "csv" | "graph">("json");
  const [importJsonText, setImportJsonText] = useState("");
  const [showImportArea, setShowImportArea] = useState(false);

  const loadData = async () => {
    const all = await globalKmsRepository.getEntities();
    setEntities(all);

    // Queue of entities requiring review or failing quality gates
    const reviewRequired = all.filter(e => 
      e.editorialStatus === "medical-review" || 
      e.editorialStatus === "legal-review" ||
      new Date(e.nextReviewDate) < new Date() ||
      !runQualityGateChecks(e, all).passed
    );
    setReviewQueue(reviewRequired);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExport = () => {
    const data = exportEntities(entities, { format: exportFormat, includeInternalNotes: true });
    
    // Create direct download link in browser
    const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kms_export_${exportFormat}_${new Date().toISOString().split("T")[0]}.${
      exportFormat === "json" ? "json" : exportFormat === "csv" ? "csv" : "json"
    }`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const imported = importEntitiesFromJson(importJsonText);
      for (const ent of imported) {
        await globalKmsRepository.saveEntity(ent, currentUser.name, currentUser.role, "Imported from JSON schema");
      }
      alert(`Successfully imported ${imported.length} entities!`);
      setImportJsonText("");
      setShowImportArea(false);
      loadData();
    } catch (err: any) {
      alert(`Import failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Platform Title */}
      <div className="flex justify-between items-center bg-neutral-900/40 p-5 border border-neutral-850 rounded-2xl">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
            <Shield className="h-5 w-5 text-cyan-400" />
            Clinical Knowledge Management System (KMS)
          </h2>
          <p className="text-xs text-neutral-400">
            Editorial governance center for structured medical profiles, Materia Medica, and clinical RAG.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-500">Active Role:</span>
          <span className="font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded">
            {currentUser.role}
          </span>
        </div>
      </div>

      {/* 1. Health dashboard grid */}
      <DashboardHealthCard entities={entities} />

      {/* 2. Admin operations dashboard quick panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Editorial Action & Creation panel */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-neutral-850 bg-neutral-900/60 backdrop-blur-xl space-y-4">
          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider pb-2 border-b border-neutral-850">
            Create Clinical Knowledge Entities
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { label: "Disease", type: "disease" },
              { label: "Symptom", type: "symptom" },
              { label: "Remedy", type: "remedy" },
              { label: "Lab Test", type: "lab-test" },
              { label: "FAQ", type: "faq" },
              { label: "Research", type: "research" },
              { label: "Case Study", type: "case-study" }
            ].map(btn => (
              <button
                key={btn.type}
                type="button"
                onClick={() => onCreateEntity(btn.type)}
                className="p-3 text-xs bg-neutral-950 hover:bg-cyan-600 hover:text-neutral-950 font-semibold border border-neutral-850 rounded-xl flex items-center justify-between text-neutral-300 group transition-all"
              >
                <span>{btn.label}</span>
                <Plus className="h-4 w-4 text-neutral-500 group-hover:text-neutral-950 transition-colors" />
              </button>
            ))}
          </div>

          {/* Import / Export utility panel */}
          <div className="pt-4 border-t border-neutral-850 space-y-4">
            <div className="flex justify-between items-center">
              <h5 className="text-xs font-bold text-neutral-300">
                Migration & Schema Backup Adapters
              </h5>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowImportArea(!showImportArea)}
                  className="text-xs text-neutral-400 hover:text-neutral-200 flex items-center gap-1"
                >
                  <Upload className="h-3.5 w-3.5" /> Import
                </button>
                <div className="h-4 w-px bg-neutral-800" />
                <div className="flex items-center gap-1.5 text-xs">
                  <select
                    value={exportFormat}
                    onChange={e => setExportFormat(e.target.value as any)}
                    className="bg-neutral-950 border border-neutral-850 rounded px-1.5 py-0.5 text-neutral-300 focus:outline-none"
                  >
                    <option value="json">JSON</option>
                    <option value="csv">CSV</option>
                    <option value="graph">Relationship Graph</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleExport}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <Download className="h-3.5 w-3.5" /> Export
                  </button>
                </div>
              </div>
            </div>

            {showImportArea && (
              <form onSubmit={handleImport} className="space-y-3 p-4 border border-neutral-800 bg-neutral-950 rounded-xl">
                <span className="text-[10px] text-neutral-400 block font-bold">
                  Paste JSON Array Schema to Import
                </span>
                <textarea
                  rows={4}
                  required
                  value={importJsonText}
                  onChange={e => setImportJsonText(e.target.value)}
                  placeholder='[ { "id": "DIS-gerd", "slug": "gerd", "entityType": "disease", "title": { "en": "GERD" } ... } ]'
                  className="w-full text-xs font-mono p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-200 focus:outline-none focus:border-cyan-600"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowImportArea(false)}
                    className="text-xs text-neutral-400 hover:text-neutral-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1 rounded"
                  >
                    Import & Save to Repository
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Side: Editorial Review Queue */}
        <div className="p-5 rounded-2xl border border-neutral-850 bg-neutral-900/60 backdrop-blur-xl space-y-4">
          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider pb-2 border-b border-neutral-850">
            Editorial Review Queue ({reviewQueue.length})
          </h4>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {reviewQueue.map(e => {
              const check = runQualityGateChecks(e, entities);
              const nextReview = new Date(e.nextReviewDate);
              const now = new Date();
              const isExpired = nextReview < now;
              const diffTime = nextReview.getTime() - now.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              
              let expiryWarning = "";
              let expiryColor = "text-neutral-500 bg-neutral-950 border-neutral-850";
              if (isExpired) {
                const daysAgo = Math.abs(diffDays);
                expiryWarning = `EXPIRED ${daysAgo}d ago`;
                expiryColor = "text-rose-450 bg-rose-950/15 border-rose-900/30";
              } else if (diffDays <= 30) {
                expiryWarning = `DUE ${diffDays}d`;
                expiryColor = "text-amber-400 bg-amber-950/15 border-amber-900/30";
              } else {
                expiryWarning = `Review: ${nextReview.toLocaleDateString()}`;
                expiryColor = "text-neutral-400 bg-neutral-950 border-neutral-900";
              }

              return (
                <div
                  key={e.id}
                  onClick={() => onEditEntity(e)}
                  className="p-3 bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 hover:border-neutral-750 rounded-xl flex justify-between items-center cursor-pointer transition-all"
                >
                  <div className="space-y-1.5 max-w-[190px]">
                    <h5 className="text-xs font-semibold text-neutral-250 truncate">
                      {e.title.en}
                    </h5>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[9px] font-mono text-neutral-500">{e.id}</span>
                      <span className="text-[9px] text-neutral-400 font-semibold uppercase px-1.5 py-0.2 rounded bg-neutral-900 border border-neutral-850">{e.editorialStatus}</span>
                      <span className={`text-[9.5px] px-1.5 py-0.2 rounded border font-mono ${expiryColor}`}>{expiryWarning}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-[10px] font-bold">
                    {check.passed ? (
                      <span className="text-emerald-400">{check.score}%</span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-0.5">
                        <ShieldAlert className="h-3 w-3" /> {check.score}%
                      </span>
                    )}
                    <ArrowRight className="h-3 w-3 text-neutral-500" />
                  </div>
                </div>
              );
            })}
            {reviewQueue.length === 0 && (
              <div className="p-8 text-center text-xs text-neutral-500">
                All queues are empty. Health check is clear!
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 3. Content Governance Checklist Panel */}
      {(() => {
        const totalCount = entities.length;
        const reviewerCompliant = entities.filter(e => 
          e.reviewer?.credentials?.toLowerCase().includes("md") || 
          e.reviewer?.credentials?.toLowerCase().includes("hom")
        ).length;

        const claimCompliant = entities.filter(e => {
          const check = runQualityGateChecks(e, entities);
          return check.prohibitedClaimsFound.length === 0;
        }).length;

        const canonicalCompliant = entities.filter(e => {
          const check = runQualityGateChecks(e, entities);
          return !check.issues.some(i => i.rule === "CANONICAL_URL");
        }).length;

        const citationCompliant = entities.filter(e => 
          e.content?.references && e.content.references.length > 0
        ).length;

        const disclaimerCompliant = entities.filter(e => 
          e.content?.safetyWarnings?.en && e.content.safetyWarnings.en.trim().length > 0
        ).length;

        const boundaryCompliant = entities.filter(e => 
          e.editorialStatus === "published" ? e.canonicalUrl.includes("/knowledge/") : true
        ).length;

        const items = [
          { 
            label: "Medical Reviewer Credentials Verification", 
            description: "Authors & Reviewers must hold validated MD(Hom) degrees.", 
            passed: totalCount > 0 && reviewerCompliant === totalCount,
            scoreText: `${reviewerCompliant} / ${totalCount} entries compliant`
          },
          { 
            label: "Prohibited Medical Claims Defense", 
            description: "Strictly filters words like 'guaranteed cure' or '100% cure'.", 
            passed: totalCount > 0 && claimCompliant === totalCount,
            scoreText: `${claimCompliant} / ${totalCount} entries verified clean`
          },
          { 
            label: "Canonical Path Validation", 
            description: "Links must align with directory layouts (/knowledge/[type]/[slug]).", 
            passed: totalCount > 0 && canonicalCompliant === totalCount,
            scoreText: `${canonicalCompliant} / ${totalCount} URLs match`
          },
          { 
            label: "Clinical Safety Disclaimers", 
            description: "Requires explicit warnings regarding educational scope.", 
            passed: totalCount > 0 && disclaimerCompliant === totalCount,
            scoreText: `${disclaimerCompliant} / ${totalCount} disclaimers set`
          },
          { 
            label: "Peer Scientific References", 
            description: "Recommends referencing AMA citations with DOI/PubMed links.", 
            passed: totalCount > 0 && citationCompliant === totalCount,
            scoreText: `${citationCompliant} / ${totalCount} referenced`
          },
          { 
            label: "Public-Private Portal Boundaries", 
            description: "Excludes administrative /admin/ and patient portal URLs from sitemap.", 
            passed: totalCount > 0 && boundaryCompliant === totalCount,
            scoreText: "All published entries partitioned"
          }
        ];

        return (
          <div className="p-5 rounded-2xl border border-neutral-850 bg-neutral-900/60 backdrop-blur-xl space-y-4">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider pb-2 border-b border-neutral-850 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-cyan-400" />
              Content Governance & Compliance Checklist
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item, idx) => (
                <div key={idx} className="p-4 bg-neutral-950/80 border border-neutral-850 rounded-xl space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-neutral-200 leading-tight">
                        {item.label}
                      </span>
                      {item.passed ? (
                        <span className="text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 text-[9px] rounded-full border border-emerald-500/20">
                          PASSED
                        </span>
                      ) : (
                        <span className="text-amber-500 font-bold bg-amber-500/10 px-1.5 py-0.5 text-[9px] rounded-full border border-amber-500/20">
                          PENDING
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-400 leading-snug">
                      {item.description}
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-neutral-500 pt-1 flex justify-between items-center">
                    <span>Status:</span>
                    <span className={item.passed ? "text-neutral-350" : "text-amber-400"}>{item.scoreText}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function Shield({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}
