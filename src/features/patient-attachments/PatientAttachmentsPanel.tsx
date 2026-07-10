"use client";

import React, { useState, useEffect } from "react";
import { 
  Upload, 
  Trash2, 
  Download, 
  Check, 
  AlertTriangle, 
  Edit3, 
  X, 
  Database,
  Loader
} from "lucide-react";
import { PatientAttachment, ExtractedLabParameter, AttachmentType } from "./types";
import { 
  listPatientAttachments, 
  uploadPatientAttachment, 
  downloadAttachment, 
  archiveAttachment, 
  extractLabs, 
  listLabParameters, 
  updateLabParameterReviewStatus 
} from "./attachmentClient";

interface PatientAttachmentsPanelProps {
  patientId: string;
}

const TYPE_LABELS: Record<AttachmentType, string> = {
  "lab-report": "Lab Report",
  "prescription": "Prescription",
  "imaging-report": "Imaging Report",
  "discharge-summary": "Discharge Summary",
  "case-note": "Case Note",
  "consent-form": "Consent Form",
  "other": "Other Document"
};

export default function PatientAttachmentsPanel({ patientId }: PatientAttachmentsPanelProps) {
  const [attachments, setAttachments] = useState<PatientAttachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<AttachmentType>("lab-report");
  const [notes, setNotes] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Labs review state
  const [selectedAttachment, setSelectedAttachment] = useState<PatientAttachment | null>(null);
  const [labParameters, setLabParameters] = useState<ExtractedLabParameter[]>([]);
  const [loadingLabs, setLoadingLabs] = useState(false);
  const [editingParameterId, setEditingParameterId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editUnit, setEditUnit] = useState("");
  const [editFlag, setEditFlag] = useState<"low" | "normal" | "high" | "critical" | "unknown">("normal");

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const data = await listPatientAttachments(patientId);
      setAttachments(data);
    } catch (err: any) {
      setError(err.message || "Failed to load clinical attachments.");
    } finally {
      setLoading(false);
    }
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setUploadError("");
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError("Please select a file to upload.");
      return;
    }
    setUploading(true);
    setUploadError("");
    try {
      await uploadPatientAttachment(patientId, selectedFile, {
        type: selectedType,
        notes: notes.trim() || undefined
      });
      setSelectedFile(null);
      setNotes("");
      await loadData();
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload file.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDownload(attachment: PatientAttachment) {
    try {
      const { downloadUrl } = await downloadAttachment(patientId, attachment.id);
      window.open(downloadUrl, "_blank");
    } catch (err: any) {
      alert(err.message || "Failed to retrieve signed download URL.");
    }
  }

  async function handleArchive(attachmentId: string) {
    if (!confirm("Are you sure you want to archive this attachment? This will restrict its visibility on the clinical timeline.")) {
      return;
    }
    try {
      await archiveAttachment(patientId, attachmentId, "Archived by clinician");
      if (selectedAttachment?.id === attachmentId) {
        setSelectedAttachment(null);
        setLabParameters([]);
      }
      await loadData();
    } catch (err: any) {
      alert(err.message || "Failed to archive document.");
    }
  }

  async function handleExtractLabs(attachment: PatientAttachment) {
    setLoadingLabs(true);
    setSelectedAttachment(attachment);
    try {
      const params = await extractLabs(patientId, attachment.id);
      setLabParameters(params);
      await loadData(); // Reload status
    } catch (err: any) {
      alert(err.message || "Lab extraction failed.");
    } finally {
      setLoadingLabs(false);
    }
  }

  async function handleLoadLabs(attachment: PatientAttachment) {
    setLoadingLabs(true);
    setSelectedAttachment(attachment);
    try {
      const params = await listLabParameters(patientId, attachment.id);
      setLabParameters(params);
    } catch (err: any) {
      alert(err.message || "Failed to load parameters.");
    } finally {
      setLoadingLabs(false);
    }
  }

  async function handleConfirmParameter(parameterId: string) {
    try {
      const updated = await updateLabParameterReviewStatus(
        patientId,
        selectedAttachment!.id,
        parameterId,
        "clinician-confirmed"
      );
      setLabParameters(prev => prev.map(p => p.id === parameterId ? updated : p));
    } catch (err: any) {
      alert(err.message || "Failed to confirm parameter.");
    }
  }

  function startEditParameter(param: ExtractedLabParameter) {
    setEditingParameterId(param.id);
    setEditValue(param.value);
    setEditUnit(param.unit || "");
    setEditFlag(param.flag || "normal");
  }

  async function handleSaveCorrection(parameterId: string) {
    try {
      const updated = await updateLabParameterReviewStatus(
        patientId,
        selectedAttachment!.id,
        parameterId,
        "corrected",
        {
          value: editValue,
          unit: editUnit,
          flag: editFlag
        }
      );
      setLabParameters(prev => prev.map(p => p.id === parameterId ? updated : p));
      setEditingParameterId(null);
    } catch (err: any) {
      alert(err.message || "Failed to save correction.");
    }
  }

  return (
    <div className="space-y-6 select-none">
      {/* Clinician Alert Warning */}
      <div className="bg-[#FAF9F6] dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-4.5 rounded-[20px] flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <h4 className="font-bold text-[#1A2421] dark:text-white">Diagnostic & Scoring Warning Gate</h4>
          <p className="text-slate-500 leading-relaxed">
            Extracted lab values require active clinician review and must not be treated as automated diagnoses. 
            These parameters act as decision-support markers and will not auto-feed into repertorization scoring or constitutional recommendations until confirmed.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Upload New File */}
        <div className="lg:col-span-1 bg-slate-50 dark:bg-slate-950/60 p-5 rounded-[22px] border border-slate-200 dark:border-slate-850 space-y-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Upload Attachment</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Secure document repository injection</p>
          </div>

          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Select File</label>
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-white dark:bg-slate-900 relative hover:border-emerald-500 transition-all">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  onChange={handleFileSelect}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  disabled={uploading}
                />
                <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400">
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span className="text-xs truncate font-semibold">
                    {selectedFile ? selectedFile.name : "Choose file..."}
                  </span>
                </div>
              </div>
              <span className="text-[8.5px] text-slate-400 block font-mono">PDF, PNG, JPG, or WEBP (Max 10MB)</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Document Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as AttachmentType)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-emerald-500 bg-white dark:bg-slate-900 text-slate-850 dark:text-white"
                disabled={uploading}
              >
                {Object.entries(TYPE_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>{label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Clinician Notes</label>
              <textarea
                placeholder="Optional notes or details..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-emerald-500 bg-white dark:bg-slate-900 text-slate-850 dark:text-white h-20 resize-none"
                disabled={uploading}
              />
            </div>

            {uploadError && (
              <div className="p-2 bg-rose-500/10 text-rose-600 text-[10px] rounded-lg font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Secure Save to Ledger</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Files List & Action Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-5 rounded-[22px] space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Attachments History</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Sanitized case documents timeline</p>
            </div>

            {loading ? (
              <div className="text-center py-10">
                <Loader className="w-6 h-6 animate-spin text-slate-400 mx-auto" />
              </div>
            ) : error ? (
              <div className="text-center py-10 text-rose-500 text-xs">{error}</div>
            ) : attachments.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">No files uploaded for this patient.</div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {attachments.map((att) => (
                  <div 
                    key={att.id} 
                    className={`p-3 border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs transition-all ${
                      selectedAttachment?.id === att.id 
                        ? "bg-emerald-500/5 border-emerald-500" 
                        : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850"
                    }`}
                  >
                    <div className="space-y-1 max-w-md">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-800 dark:text-white truncate block max-w-[220px]">
                          {att.fileName}
                        </span>
                        <span className="text-[9px] font-bold uppercase bg-slate-250 dark:bg-slate-850 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
                          {TYPE_LABELS[att.type]}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2">
                        <span>{new Date(att.createdAt).toLocaleDateString()}</span>
                        <span>·</span>
                        <span>{(att.sizeBytes / 1024).toFixed(1)} KB</span>
                        <span>·</span>
                        <span className="font-semibold text-emerald-600 uppercase tracking-wide">
                          {att.extractionStatus === "completed" ? "Extracted" : att.extractionStatus}
                        </span>
                      </div>
                      {att.notes && (
                        <p className="text-[10.5px] text-slate-500 italic">Notes: {att.notes}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <button
                        onClick={() => handleDownload(att)}
                        title="Download raw report"
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-all border-none cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      {att.type === "lab-report" && (
                        <button
                          onClick={() => {
                            if (att.extractionStatus === "completed" || att.extractionStatus === "requires-clinician-review") {
                              handleLoadLabs(att);
                            } else {
                              handleExtractLabs(att);
                            }
                          }}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold border-none transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Database className="w-3 h-3" />
                          <span>{att.extractionStatus === "completed" ? "View Parameters" : "Extract Labs"}</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleArchive(att.id)}
                        title="Archive metadata"
                        className="p-2 hover:bg-rose-500/10 rounded-lg text-rose-500 hover:text-rose-600 transition-all border-none cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Labs parameter verification section */}
          {selectedAttachment && (
            <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-5 rounded-[22px] space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Extracted Laboratory Parameters</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-md">Source: {selectedAttachment.fileName}</p>
                </div>
                <button
                  onClick={() => setSelectedAttachment(null)}
                  className="p-1 hover:bg-slate-100 rounded-lg transition-all text-slate-400 border-none cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {loadingLabs ? (
                <div className="text-center py-6">
                  <Loader className="w-5 h-5 animate-spin text-slate-400 mx-auto" />
                </div>
              ) : labParameters.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No parameters extracted. Please verify report format or key values manually.
                </div>
              ) : (
                <div className="space-y-3">
                  {labParameters.map((param) => (
                    <div 
                      key={param.id} 
                      className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                    >
                      {editingParameterId === param.id ? (
                        /* Editing form inline */
                        <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <span className="text-[9px] text-slate-400 block font-mono">TEST NAME</span>
                            <strong className="text-slate-800 dark:text-white">{param.testName}</strong>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] text-slate-400 block font-mono">VALUE</span>
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="px-2 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 w-full text-xs"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] text-slate-400 block font-mono">UNIT</span>
                            <input
                              type="text"
                              value={editUnit}
                              onChange={(e) => setEditUnit(e.target.value)}
                              className="px-2 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 w-full text-xs"
                            />
                          </div>
                          <div className="md:col-span-3 flex justify-end gap-2 mt-2">
                            <button
                              onClick={() => setEditingParameterId(null)}
                              className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-[10px] cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveCorrection(param.id)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] border-none cursor-pointer"
                            >
                              Save Correction
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Static review details */
                        <>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-grow">
                            <div>
                              <span className="text-[9px] text-slate-400 block font-mono uppercase">Parameter</span>
                              <strong className="text-slate-800 dark:text-white">{param.testName}</strong>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 block font-mono uppercase">Value</span>
                              <span className="font-bold text-slate-800 dark:text-white">
                                {param.value} {param.unit}
                              </span>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 block font-mono uppercase">Ref Range</span>
                              <span className="text-slate-500">{param.referenceRange || "N/A"}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 block font-mono uppercase">Flag</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                param.flag === "high" || param.flag === "critical"
                                  ? "bg-rose-100 text-rose-700 border border-rose-200"
                                  : param.flag === "low"
                                  ? "bg-amber-100 text-amber-700 border border-amber-200"
                                  : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              }`}>
                                {param.flag || "normal"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-[9px] font-mono text-slate-400">
                              {param.reviewStatus === "pending-review" ? "Pending Review" : param.reviewStatus === "clinician-confirmed" ? "Confirmed" : "Corrected"}
                            </span>
                            
                            {param.reviewStatus === "pending-review" && (
                              <button
                                onClick={() => handleConfirmParameter(param.id)}
                                title="Confirm extracted value"
                                className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 rounded-lg transition-all border-none cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              onClick={() => startEditParameter(param)}
                              title="Edit/correct value"
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-all border-none cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
