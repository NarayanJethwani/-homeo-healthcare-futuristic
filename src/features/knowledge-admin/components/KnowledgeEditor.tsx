import React, { useState, useEffect } from "react";
import { KmsKnowledgeEntity, EditorialStatus, EditorialRole } from "../types";
import { runQualityGateChecks } from "../validation/qualityGates";
import { detectDuplicateEntities, DuplicateWarning } from "../validation/duplicateDetector";
import ReferencePicker from "./ReferencePicker";
import RelationshipGraph from "./RelationshipGraph";
import QualityGatePanel from "./QualityGatePanel";
import VersionTimeline from "./VersionTimeline";
import { EditorialStatusBadge, EvidenceBadge } from "./Badge";
import { EvidenceLevel, EntityType, Locale } from "@/features/knowledge/types";
import { Save, X, Settings, Link2, History, Shield, Trash, Plus } from "lucide-react";

interface KnowledgeEditorProps {
  entity: KmsKnowledgeEntity;
  allEntities: KmsKnowledgeEntity[];
  currentUser: { name: string; role: EditorialRole };
  onSave: (updated: KmsKnowledgeEntity, reason: string) => void;
  onCancel: () => void;
}

export default function KnowledgeEditor({ entity: initialEntity, allEntities, currentUser, onSave, onCancel }: KnowledgeEditorProps) {
  const [activeTab, setActiveTab] = useState<"content" | "relations" | "references" | "history">("content");
  const [entity, setEntity] = useState<KmsKnowledgeEntity>(initialEntity);
  const [saveReason, setSaveReason] = useState("");
  const [duplicateWarnings, setDuplicateWarnings] = useState<DuplicateWarning[]>([]);

  // Update expected canonical URL when slug or entityType changes
  useEffect(() => {
    const pluralType = entity.entityType === "research" 
      ? "research" 
      : entity.entityType === "case-study" 
        ? "case-studies" 
        : entity.entityType === "remedy" 
          ? "remedies" 
          : entity.entityType + "s";
    
    const expected = `https://homeo.healthcare/knowledge/${pluralType}/${entity.slug}`;
    if (entity.canonicalUrl !== expected) {
      setEntity(prev => ({ ...prev, canonicalUrl: expected }));
    }
  }, [entity.slug, entity.entityType]);

  // Run duplicate detector in real time
  useEffect(() => {
    const dups = detectDuplicateEntities(entity, allEntities);
    setDuplicateWarnings(dups);
  }, [entity.title.en, entity.slug, allEntities]);

  // Handlers for linking
  const handleLink = (targetId: string) => {
    if (!entity.relatedEntities.includes(targetId)) {
      setEntity(prev => ({
        ...prev,
        relatedEntities: [...prev.relatedEntities, targetId]
      }));
    }
  };

  const handleUnlink = (targetId: string) => {
    setEntity(prev => ({
      ...prev,
      relatedEntities: prev.relatedEntities.filter(x => x !== targetId)
    }));
  };

  // Rollback logic
  const handleRollback = (snapshotStr: string, reason: string) => {
    try {
      const snap = JSON.parse(snapshotStr);
      setEntity(prev => ({
        ...prev,
        ...snap,
        versionInfo: prev.versionInfo // preserve current version change logs
      }));
      setSaveReason(reason);
    } catch {
      alert("Failed to parse rollback snapshot.");
    }
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const gate = runQualityGateChecks(entity, allEntities);
    if (entity.editorialStatus === "published" && !gate.passed) {
      alert("Cannot publish: Entity fails safety/quality checks. Please check the checklist drawer.");
      return;
    }
    onSave(entity, saveReason || "Updated in Knowledge Editor");
  };

  const gateResult = runQualityGateChecks(entity, allEntities);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* LEFT & CENTER EDITING PANEL */}
      <form onSubmit={handleSaveSubmit} className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center bg-neutral-900/60 border border-neutral-850 p-4 rounded-2xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-neutral-500">{entity.id || "NEW ENTITY"}</span>
              <EditorialStatusBadge status={entity.editorialStatus} />
            </div>
            <h3 className="text-base font-bold text-neutral-200">
              {entity.title.en || "Untitled Article"}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs px-3 py-1.5 rounded-lg border border-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-1.5 rounded-lg flex items-center gap-1 shadow-[0_2px_10px_rgba(6,182,212,0.2)] transition-all"
            >
              <Save className="h-3.5 w-3.5" /> Save Changes
            </button>
          </div>
        </div>

        {/* Duplicate alert block */}
        {duplicateWarnings.length > 0 && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-1 text-rose-400 text-xs">
            <h5 className="font-bold">Possible Duplicate Entity Detected</h5>
            {duplicateWarnings.map(w => (
              <p key={w.entityId}>
                Similarity with <strong>{w.title}</strong> ({w.entityId}) is {Math.round(w.similarity * 100)}% ({w.reason}).
              </p>
            ))}
          </div>
        )}

        {/* Tabs navigation */}
        <div className="flex border-b border-neutral-850 gap-2">
          {(["content", "relations", "references", "history"] as const).map(tab => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all capitalize ${
                activeTab === tab 
                  ? "border-cyan-500 text-cyan-400 font-semibold" 
                  : "border-transparent text-neutral-500 hover:text-neutral-350"
              }`}
            >
              {tab === "relations" ? "Related Graph" : tab === "references" ? "Citations" : tab}
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        {activeTab === "content" && (
          <div className="space-y-6 bg-neutral-900/40 p-5 border border-neutral-850 rounded-2xl backdrop-blur-xl">
            {/* Core configuration metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block font-bold uppercase tracking-wider">
                  Entity ID * (e.g. DIS-gerd)
                </label>
                <input
                  type="text"
                  required
                  value={entity.id}
                  onChange={e => setEntity({ ...entity, id: e.target.value })}
                  placeholder="DIS-gerd"
                  className="w-full text-xs px-3 py-1.5 bg-neutral-950 border border-neutral-805 rounded-lg text-neutral-200 focus:outline-none focus:border-cyan-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block font-bold uppercase tracking-wider">
                  Entity Type *
                </label>
                <select
                  value={entity.entityType}
                  onChange={e => setEntity({ ...entity, entityType: e.target.value as EntityType })}
                  className="w-full text-xs px-2.5 py-1.5 bg-neutral-950 border border-neutral-805 rounded-lg text-neutral-200 focus:outline-none focus:border-cyan-600"
                >
                  <option value="disease">Disease</option>
                  <option value="symptom">Symptom</option>
                  <option value="remedy">Remedy</option>
                  <option value="lab-test">Lab Test</option>
                  <option value="faq">FAQ</option>
                  <option value="research">Research</option>
                  <option value="case-study">Case Study</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block font-bold uppercase tracking-wider">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={entity.slug}
                  onChange={e => setEntity({ ...entity, slug: e.target.value })}
                  placeholder="gerd"
                  className="w-full text-xs px-3 py-1.5 bg-neutral-950 border border-neutral-805 rounded-lg text-neutral-200 focus:outline-none focus:border-cyan-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block font-bold uppercase tracking-wider">
                  Canonical URL
                </label>
                <input
                  type="text"
                  readOnly
                  value={entity.canonicalUrl}
                  className="w-full text-xs px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block font-bold uppercase tracking-wider">
                  Editorial Status *
                </label>
                <select
                  value={entity.editorialStatus}
                  onChange={e => setEntity({ ...entity, editorialStatus: e.target.value as EditorialStatus })}
                  className="w-full text-xs px-2.5 py-1.5 bg-neutral-950 border border-neutral-805 rounded-lg text-neutral-200 focus:outline-none focus:border-cyan-600"
                >
                  <option value="draft">Draft</option>
                  <option value="medical-review">Medical Review</option>
                  <option value="legal-review">Legal Review</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block font-bold uppercase tracking-wider">
                  Evidence Level *
                </label>
                <select
                  value={entity.evidenceLevel}
                  onChange={e => setEntity({ ...entity, evidenceLevel: e.target.value as EvidenceLevel })}
                  className="w-full text-xs px-2.5 py-1.5 bg-neutral-950 border border-neutral-805 rounded-lg text-neutral-200 focus:outline-none focus:border-cyan-600"
                >
                  <option value="Level-A">Level A (RCT)</option>
                  <option value="Level-B">Level B (Cohort)</option>
                  <option value="Level-C">Level C (Case Study)</option>
                  <option value="Traditional-Literature">Traditional Materia Medica</option>
                </select>
              </div>
            </div>

            {/* Core Titles */}
            <div className="space-y-4 pt-2 border-t border-neutral-850">
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block font-bold uppercase tracking-wider">
                  Title (EN) *
                </label>
                <input
                  type="text"
                  required
                  value={entity.title.en}
                  onChange={e => setEntity({ ...entity, title: { ...entity.title, en: e.target.value } })}
                  placeholder="Gastroesophageal Reflux Disease (GERD)"
                  className="w-full text-xs px-3 py-1.5 bg-neutral-950 border border-neutral-805 rounded-lg text-neutral-200 focus:outline-none focus:border-cyan-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block font-bold uppercase tracking-wider">
                  Summary (EN) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={entity.summary.en}
                  onChange={e => setEntity({ ...entity, summary: { ...entity.summary, en: e.target.value } })}
                  placeholder="Brief clinical description of the symptoms and pathological parameters..."
                  className="w-full text-xs px-3 py-1.5 bg-neutral-950 border border-neutral-805 rounded-lg text-neutral-200 focus:outline-none focus:border-cyan-600 resize-none"
                />
              </div>
            </div>

            {/* Subclass-specific input modules */}
            <div className="space-y-4 pt-4 border-t border-neutral-850">
              <h4 className="text-xs font-bold text-neutral-350">
                Entity Specific Information
              </h4>

              {/* Disease subclass */}
              {entity.entityType === "disease" && (
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 block">Pathophysiology Overview</span>
                    <textarea
                      rows={3}
                      value={entity.content?.overview?.en || ""}
                      onChange={e => setEntity({
                        ...entity,
                        content: {
                          ...entity.content,
                          overview: {
                            en: e.target.value,
                            hi: entity.content?.overview?.hi || "",
                            gu: entity.content?.overview?.gu || "",
                            mr: entity.content?.overview?.mr || "",
                            es: entity.content?.overview?.es || "",
                            ar: entity.content?.overview?.ar || ""
                          }
                        }
                      })}
                      className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200 focus:outline-none focus:border-cyan-600"
                    />
                  </div>
                </div>
              )}

              {/* Remedy subclass */}
              {entity.entityType === "remedy" && (
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 block">Source Material</span>
                    <input
                      type="text"
                      value={entity.content?.sourceMaterial || ""}
                      onChange={e => setEntity({
                        ...entity,
                        content: { ...entity.content, sourceMaterial: e.target.value }
                      })}
                      placeholder="e.g. Sublimed Sulphur"
                      className="w-full text-xs px-3 py-1.5 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                    />
                  </div>
                </div>
              )}

              {/* Lab Test subclass */}
              {entity.entityType === "lab-test" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 block">Standard Reference Range</span>
                    <input
                      type="text"
                      value={entity.content?.referenceRanges?.standard || ""}
                      onChange={e => setEntity({
                        ...entity,
                        content: {
                          ...entity.content,
                          referenceRanges: {
                            standard: e.target.value,
                            critical: entity.content?.referenceRanges?.critical || ""
                          }
                        }
                      })}
                      placeholder="e.g. 0.45 - 4.5 uIU/mL"
                      className="w-full text-xs px-3 py-1.5 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 block">Critical Values</span>
                    <input
                      type="text"
                      value={entity.content?.referenceRanges?.critical || ""}
                      onChange={e => setEntity({
                        ...entity,
                        content: {
                          ...entity.content,
                          referenceRanges: {
                            standard: entity.content?.referenceRanges?.standard || "",
                            critical: e.target.value
                          }
                        }
                      })}
                      placeholder="e.g. < 0.1 or > 10"
                      className="w-full text-xs px-3 py-1.5 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                    />
                  </div>
                </div>
              )}

              {/* Default clinical warning disclaimers */}
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-400 block">Clinical Safety warnings / Disclaimers</span>
                <textarea
                  rows={2}
                  value={entity.content?.safetyWarnings?.en || ""}
                  onChange={e => setEntity({
                    ...entity,
                    content: {
                      ...entity.content,
                      safetyWarnings: {
                        en: e.target.value,
                        hi: entity.content?.safetyWarnings?.hi || "",
                        gu: entity.content?.safetyWarnings?.gu || "",
                        mr: entity.content?.safetyWarnings?.mr || "",
                        es: entity.content?.safetyWarnings?.es || "",
                        ar: entity.content?.safetyWarnings?.ar || ""
                      }
                    }
                  })}
                  placeholder="e.g. Consult with a qualified homeopathic practitioner before beginning treatment..."
                  className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200 focus:outline-none focus:border-cyan-600"
                />
              </div>
            </div>

            {/* SEPARATE: Internal Editorial Notes (Never published) */}
            <div className="space-y-1 pt-4 border-t border-neutral-850">
              <label className="text-[10px] text-neutral-400 block font-bold uppercase tracking-wider">
                Internal Editorial Notes (strictly private)
              </label>
              <textarea
                rows={2}
                value={entity.editorialNotes}
                onChange={e => setEntity({ ...entity, editorialNotes: e.target.value })}
                placeholder="Write private comments or draft feedback here. These will never leak to public pages, sitemaps, or search API outputs."
                className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200 focus:outline-none focus:border-cyan-600 font-serif"
              />
            </div>

            {/* scheduled review dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-850">
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block font-bold">
                  Next Scheduled Review Date *
                </label>
                <input
                  type="date"
                  required
                  value={entity.nextReviewDate ? entity.nextReviewDate.split("T")[0] : ""}
                  onChange={e => setEntity({ ...entity, nextReviewDate: new Date(e.target.value).toISOString() })}
                  className="w-full text-xs px-3 py-1.5 bg-neutral-950 border border-neutral-805 rounded-lg text-neutral-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block font-bold">
                  Reason for Save/Edit
                </label>
                <input
                  type="text"
                  value={saveReason}
                  onChange={e => setSaveReason(e.target.value)}
                  placeholder="e.g. Added safety warning for sulfur"
                  className="w-full text-xs px-3 py-1.5 bg-neutral-950 border border-neutral-805 rounded-lg text-neutral-200"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "relations" && (
          <div className="bg-neutral-900/40 p-5 border border-neutral-850 rounded-2xl backdrop-blur-xl">
            <RelationshipGraph
              entity={entity}
              allEntities={allEntities}
              onLink={handleLink}
              onUnlink={handleUnlink}
            />
          </div>
        )}

        {activeTab === "references" && (
          <div className="bg-neutral-900/40 p-5 border border-neutral-850 rounded-2xl backdrop-blur-xl">
            <ReferencePicker
              selectedIds={entity.content?.references || []}
              onChange={ids => setEntity({
                ...entity,
                content: { ...entity.content, references: ids.length > 0 ? ids : undefined }
              })}
            />
          </div>
        )}

        {activeTab === "history" && (
          <div className="bg-neutral-900/40 p-5 border border-neutral-850 rounded-2xl backdrop-blur-xl">
            <VersionTimeline
              entity={entity}
              onRollback={handleRollback}
            />
          </div>
        )}
      </form>

      {/* RIGHT SIDE PANEL: LIVE ASSESSMENT DRAWERS */}
      <div className="space-y-6">
        <QualityGatePanel
          entity={entity}
          allEntities={allEntities}
        />

        {/* Readability & SEO / GEO score breakdowns */}
        <div className="p-5 border border-neutral-850 bg-neutral-900/60 rounded-2xl backdrop-blur-xl space-y-4 text-xs">
          <h4 className="text-sm font-bold text-neutral-200 pb-2 border-b border-neutral-850 flex items-center gap-1.5">
            <Settings className="h-4.5 w-4.5 text-neutral-400" />
            Optimization Metrics
          </h4>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-neutral-400 mb-1">
                <span>SEO Optimizations</span>
                <span className="font-semibold text-emerald-400">{entity.seoGeoScores.seoScore}%</span>
              </div>
              <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: `${entity.seoGeoScores.seoScore}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-neutral-400 mb-1">
                <span>Generative AI (GEO) Readiness</span>
                <span className="font-semibold text-cyan-400">{entity.seoGeoScores.geoScore}%</span>
              </div>
              <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full" style={{ width: `${entity.seoGeoScores.geoScore}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-neutral-400 mb-1">
                <span>Readability Level</span>
                <span className="font-semibold text-neutral-350">{entity.readabilityScore.readingLevel}</span>
              </div>
              <p className="text-[10px] text-neutral-500">
                Score: {entity.readabilityScore.score}/100 &bull; Estimated read: {entity.readabilityScore.readingTimeMinutes} min.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
