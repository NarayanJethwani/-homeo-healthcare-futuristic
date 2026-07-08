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
              <h4 className="text-xs font-bold text-neutral-350 mb-4">
                Entity Specific Information
              </h4>

              {/* Remedy subclass */}
              {entity.entityType === "remedy" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">Latin Name</span>
                      <input
                        type="text"
                        value={entity.content?.latinName || ""}
                        onChange={e => setEntity({
                          ...entity,
                          content: { ...entity.content, latinName: e.target.value }
                        })}
                        className="w-full text-xs px-3 py-1.5 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">Common Name</span>
                      <input
                        type="text"
                        value={entity.content?.commonName || ""}
                        onChange={e => setEntity({
                          ...entity,
                          content: { ...entity.content, commonName: e.target.value }
                        })}
                        className="w-full text-xs px-3 py-1.5 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">Kingdom</span>
                      <input
                        type="text"
                        value={entity.content?.kingdom || ""}
                        onChange={e => setEntity({
                          ...entity,
                          content: { ...entity.content, kingdom: e.target.value }
                        })}
                        className="w-full text-xs px-3 py-1.5 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">Source Material</span>
                      <input
                        type="text"
                        value={entity.content?.source || ""}
                        onChange={e => setEntity({
                          ...entity,
                          content: { ...entity.content, source: e.target.value }
                        })}
                        className="w-full text-xs px-3 py-1.5 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">Remedy Type</span>
                      <input
                        type="text"
                        value={entity.content?.remedyType || ""}
                        onChange={e => setEntity({
                          ...entity,
                          content: { ...entity.content, remedyType: e.target.value }
                        })}
                        className="w-full text-xs px-3 py-1.5 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 block uppercase font-bold">Description</span>
                    <textarea
                      rows={3}
                      value={entity.content?.description || ""}
                      onChange={e => setEntity({
                        ...entity,
                        content: { ...entity.content, description: e.target.value }
                      })}
                      className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200 focus:outline-none focus:border-cyan-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">Guiding Keynotes (One per line)</span>
                      <textarea
                        rows={3}
                        value={entity.content?.keynotes?.join("\n") || ""}
                        onChange={e => setEntity({
                          ...entity,
                          content: { ...entity.content, keynotes: e.target.value.split("\n").filter(Boolean) }
                        })}
                        className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">Mental Symptoms (One per line)</span>
                      <textarea
                        rows={3}
                        value={entity.content?.mentalSymptoms?.join("\n") || ""}
                        onChange={e => setEntity({
                          ...entity,
                          content: { ...entity.content, mentalSymptoms: e.target.value.split("\n").filter(Boolean) }
                        })}
                        className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">Physical Symptoms (One per line)</span>
                      <textarea
                        rows={3}
                        value={entity.content?.physicalSymptoms?.join("\n") || ""}
                        onChange={e => setEntity({
                          ...entity,
                          content: { ...entity.content, physicalSymptoms: e.target.value.split("\n").filter(Boolean) }
                        })}
                        className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">Generalities</span>
                      <textarea
                        rows={3}
                        value={entity.content?.generalities || ""}
                        onChange={e => setEntity({
                          ...entity,
                          content: { ...entity.content, generalities: e.target.value }
                        })}
                        className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">Modalities Better (One per line)</span>
                      <textarea
                        rows={3}
                        value={entity.content?.modalitiesBetter?.join("\n") || ""}
                        onChange={e => setEntity({
                          ...entity,
                          content: { ...entity.content, modalitiesBetter: e.target.value.split("\n").filter(Boolean) }
                        })}
                        className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">Modalities Worse (One per line)</span>
                      <textarea
                        rows={3}
                        value={entity.content?.modalitiesWorse?.join("\n") || ""}
                        onChange={e => setEntity({
                          ...entity,
                          content: { ...entity.content, modalitiesWorse: e.target.value.split("\n").filter(Boolean) }
                        })}
                        className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">Clinical Uses (One per line)</span>
                      <textarea
                        rows={3}
                        value={entity.content?.clinicalUses?.join("\n") || ""}
                        onChange={e => setEntity({
                          ...entity,
                          content: { ...entity.content, clinicalUses: e.target.value.split("\n").filter(Boolean) }
                        })}
                        className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">Organ Affinity (One per line)</span>
                      <textarea
                        rows={3}
                        value={entity.content?.organAffinity?.join("\n") || ""}
                        onChange={e => setEntity({
                          ...entity,
                          content: { ...entity.content, organAffinity: e.target.value.split("\n").filter(Boolean) }
                        })}
                        className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">Miasmatic Affinity (One per line)</span>
                      <textarea
                        rows={3}
                        value={entity.content?.miasmaticAffinity?.join("\n") || ""}
                        onChange={e => setEntity({
                          ...entity,
                          content: { ...entity.content, miasmaticAffinity: e.target.value.split("\n").filter(Boolean) }
                        })}
                        className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">Constitution</span>
                      <textarea
                        rows={2}
                        value={entity.content?.constitution || ""}
                        onChange={e => setEntity({
                          ...entity,
                          content: { ...entity.content, constitution: e.target.value }
                        })}
                        className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">Potencies (One per line)</span>
                      <textarea
                        rows={2}
                        value={entity.content?.potencies?.join("\n") || ""}
                        onChange={e => setEntity({
                          ...entity,
                          content: { ...entity.content, potencies: e.target.value.split("\n").filter(Boolean) }
                        })}
                        className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 block uppercase font-bold">Safety Notes</span>
                    <textarea
                      rows={2}
                      value={entity.content?.safetyNotes || ""}
                      onChange={e => setEntity({
                        ...entity,
                        content: { ...entity.content, safetyNotes: e.target.value }
                      })}
                      className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                    />
                  </div>
                </div>
              )}

              {/* Disease subclass */}
              {entity.entityType === "disease" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 block uppercase font-bold">Overview</span>
                    <textarea
                      rows={3}
                      value={entity.content?.overview || ""}
                      onChange={e => setEntity({
                        ...entity,
                        content: { ...entity.content, overview: e.target.value }
                      })}
                      className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 block uppercase font-bold">Definition</span>
                    <textarea
                      rows={2}
                      value={entity.content?.definition || ""}
                      onChange={e => setEntity({
                        ...entity,
                        content: { ...entity.content, definition: e.target.value }
                      })}
                      className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">Causes (One per line)</span>
                      <textarea
                        rows={3}
                        value={entity.content?.causes?.join("\n") || ""}
                        onChange={e => setEntity({
                          ...entity,
                          content: { ...entity.content, causes: e.target.value.split("\n").filter(Boolean) }
                        })}
                        className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">Risk Factors (One per line)</span>
                      <textarea
                        rows={3}
                        value={entity.content?.riskFactors?.join("\n") || ""}
                        onChange={e => setEntity({
                          ...entity,
                          content: { ...entity.content, riskFactors: e.target.value.split("\n").filter(Boolean) }
                        })}
                        className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 block uppercase font-bold">Symptoms (One per line)</span>
                    <textarea
                      rows={3}
                      value={entity.content?.symptoms?.join("\n") || ""}
                      onChange={e => setEntity({
                        ...entity,
                        content: { ...entity.content, symptoms: e.target.value.split("\n").filter(Boolean) }
                      })}
                      className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">Diagnosis</span>
                      <textarea
                        rows={3}
                        value={entity.content?.diagnosis || ""}
                        onChange={e => setEntity({
                          ...entity,
                          content: { ...entity.content, diagnosis: e.target.value }
                        })}
                        className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">Differential Diagnosis</span>
                      <textarea
                        rows={3}
                        value={entity.content?.differentialDiagnosis || ""}
                        onChange={e => setEntity({
                          ...entity,
                          content: { ...entity.content, differentialDiagnosis: e.target.value }
                        })}
                        className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200 font-mono"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">Recommended Lab Tests (One per line)</span>
                      <textarea
                        rows={3}
                        value={entity.content?.labTests?.join("\n") || ""}
                        onChange={e => setEntity({
                          ...entity,
                          content: { ...entity.content, labTests: e.target.value.split("\n").filter(Boolean) }
                        })}
                        className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">Imaging Details</span>
                      <textarea
                        rows={3}
                        value={entity.content?.imaging || ""}
                        onChange={e => setEntity({
                          ...entity,
                          content: { ...entity.content, imaging: e.target.value }
                        })}
                        className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 block uppercase font-bold">Red Flags (One per line)</span>
                    <textarea
                      rows={3}
                      value={entity.content?.redFlags?.join("\n") || ""}
                      onChange={e => setEntity({
                        ...entity,
                        content: { ...entity.content, redFlags: e.target.value.split("\n").filter(Boolean) }
                      })}
                      className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200 font-semibold text-rose-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">Conventional Management</span>
                      <textarea
                        rows={3}
                        value={entity.content?.conventionalManagement || ""}
                        onChange={e => setEntity({
                          ...entity,
                          content: { ...entity.content, conventionalManagement: e.target.value }
                        })}
                        className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">Homeopathic Approach</span>
                      <textarea
                        rows={3}
                        value={entity.content?.homeopathicApproach || ""}
                        onChange={e => setEntity({
                          ...entity,
                          content: { ...entity.content, homeopathicApproach: e.target.value }
                        })}
                        className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 block uppercase font-bold">Lifestyle Advice</span>
                    <textarea
                      rows={2}
                      value={entity.content?.lifestyleAdvice || ""}
                      onChange={e => setEntity({
                        ...entity,
                        content: { ...entity.content, lifestyleAdvice: e.target.value }
                      })}
                      className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                    />
                  </div>
                </div>
              )}

              {/* Symptom subclass */}
              {entity.entityType === "symptom" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 block uppercase font-bold">Definition</span>
                    <textarea
                      rows={3}
                      value={entity.content?.definition || ""}
                      onChange={e => setEntity({
                        ...entity,
                        content: { ...entity.content, definition: e.target.value }
                      })}
                      className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 block uppercase font-bold">Clinical Meaning</span>
                    <textarea
                      rows={3}
                      value={entity.content?.clinicalMeaning || ""}
                      onChange={e => setEntity({
                        ...entity,
                        content: { ...entity.content, clinicalMeaning: e.target.value }
                      })}
                      className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">Common Causes (One per line)</span>
                      <textarea
                        rows={3}
                        value={entity.content?.commonCauses?.join("\n") || ""}
                        onChange={e => setEntity({
                          ...entity,
                          content: { ...entity.content, commonCauses: e.target.value.split("\n").filter(Boolean) }
                        })}
                        className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">Differential Diagnosis</span>
                      <textarea
                        rows={3}
                        value={entity.content?.differentialDiagnosis || ""}
                        onChange={e => setEntity({
                          ...entity,
                          content: { ...entity.content, differentialDiagnosis: e.target.value }
                        })}
                        className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 block uppercase font-bold">Red Flags (One per line)</span>
                    <textarea
                      rows={3}
                      value={entity.content?.redFlags?.join("\n") || ""}
                      onChange={e => setEntity({
                        ...entity,
                        content: { ...entity.content, redFlags: e.target.value.split("\n").filter(Boolean) }
                      })}
                      className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200 font-bold text-rose-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 block uppercase font-bold">Lifestyle Advice</span>
                    <textarea
                      rows={2}
                      value={entity.content?.lifestyleAdvice || ""}
                      onChange={e => setEntity({
                        ...entity,
                        content: { ...entity.content, lifestyleAdvice: e.target.value }
                      })}
                      className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                    />
                  </div>
                </div>
              )}

              {/* Lab Test subclass */}
              {entity.entityType === "lab-test" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 block uppercase font-bold">Overview</span>
                    <textarea
                      rows={3}
                      value={entity.content?.overview || ""}
                      onChange={e => setEntity({
                        ...entity,
                        content: { ...entity.content, overview: e.target.value }
                      })}
                      className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 block uppercase font-bold">Standard Reference Range</span>
                    <input
                      type="text"
                      value={entity.content?.normalRange || ""}
                      onChange={e => setEntity({
                        ...entity,
                        content: { ...entity.content, normalRange: e.target.value }
                      })}
                      placeholder="e.g. 13.5 - 17.5 g/dL"
                      className="w-full text-xs px-3 py-1.5 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">High Values Interpretation (One per line)</span>
                      <textarea
                        rows={3}
                        value={entity.content?.highValues?.join("\n") || ""}
                        onChange={e => setEntity({
                          ...entity,
                          content: { ...entity.content, highValues: e.target.value.split("\n").filter(Boolean) }
                        })}
                        className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold">Low Values Interpretation (One per line)</span>
                      <textarea
                        rows={3}
                        value={entity.content?.lowValues?.join("\n") || ""}
                        onChange={e => setEntity({
                          ...entity,
                          content: { ...entity.content, lowValues: e.target.value.split("\n").filter(Boolean) }
                        })}
                        className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 block uppercase font-bold">Clinical Interpretation</span>
                    <textarea
                      rows={3}
                      value={entity.content?.clinicalInterpretation || ""}
                      onChange={e => setEntity({
                        ...entity,
                        content: { ...entity.content, clinicalInterpretation: e.target.value }
                      })}
                      className="w-full text-xs p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200"
                    />
                  </div>
                </div>
              )}
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
