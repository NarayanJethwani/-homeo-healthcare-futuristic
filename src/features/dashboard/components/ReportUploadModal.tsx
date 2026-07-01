import React, { useState, useEffect, useRef } from "react";
import { 
  X, 
  UploadCloud, 
  FileText, 
  Check, 
  AlertTriangle, 
  Shield, 
  Info, 
  RefreshCw, 
  CheckSquare, 
  Square,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useClinicalReportUpload } from "../hooks/useClinicalReportUpload";
import { ReportExtractionResult } from "../types/reportExtractionTypes";

interface ReportUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  uploadType: "lab" | "prescription" | "imaging" | null;
  onApply: (data: Partial<ReportExtractionResult>) => void;
}

export function ReportUploadModal({ isOpen, onClose, uploadType, onApply }: ReportUploadModalProps) {
  const [step, setStep] = useState<"select" | "review">("select");
  const [extractedData, setExtractedData] = useState<ReportExtractionResult | null>(null);
  
  // Field selection toggles
  const [selectedFields, setSelectedFields] = useState({
    clinicalImpressions: true,
    labs: true,
    imaging: true,
    currentMeds: true,
    pastTreatments: true,
    thermal: true,
    miasm: true
  });

  // Acknowledgment for low confidence fields
  const [acknowledgedFields, setAcknowledgedFields] = useState<Record<string, boolean>>({});

  const dropZoneRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExtractionSuccess = (result: ReportExtractionResult) => {
    setExtractedData(result);
    
    // Auto-select fields that actually contain extracted content
    setSelectedFields({
      clinicalImpressions: !!result.clinicalImpressions,
      labs: !!result.labs,
      imaging: !!result.imaging,
      currentMeds: !!result.currentMeds,
      pastTreatments: !!result.pastTreatments,
      thermal: !!result.thermal,
      miasm: !!(result.miasm && result.miasm.length > 0)
    });

    // Reset acknowledgments
    setAcknowledgedFields({});
    setStep("review");
  };

  const {
    file,
    isIngesting,
    errorMessage,
    duplicateWarning,
    handleFileSelection,
    processReportIngestion,
    cancelIngestion,
    clearUploader
  } = useClinicalReportUpload(handleExtractionSuccess);

  // Reset modal on close or type change
  useEffect(() => {
    if (!isOpen) {
      clearUploader();
      setStep("select");
      setExtractedData(null);
    }
  }, [isOpen]);

  if (!isOpen || !uploadType) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add("border-emerald-500", "bg-emerald-50/10");
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove("border-emerald-500", "bg-emerald-50/10");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove("border-emerald-500", "bg-emerald-50/10");
    }
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const getTypeName = () => {
    if (uploadType === "lab") return "Pathology (Labs) Report";
    if (uploadType === "prescription") return "Prescription (Rx) Document";
    if (uploadType === "imaging") return "Imaging (Scan) Report";
    return "Clinical Report";
  };

  const handleApply = () => {
    if (!extractedData) return;

    // Check if any selected field is low confidence and NOT acknowledged
    const unacknowledged: string[] = [];
    Object.entries(selectedFields).forEach(([field, isSelected]) => {
      if (isSelected) {
        const confidence = extractedData.confidenceLevels[field];
        if (confidence === "Low" && !acknowledgedFields[field]) {
          unacknowledged.push(field);
        }
      }
    });

    if (unacknowledged.length > 0) {
      alert(`Please acknowledge the low-confidence extraction for the following fields: ${unacknowledged.join(", ")}`);
      return;
    }

    // Compile applied object
    const appliedData: Partial<ReportExtractionResult> = {};
    if (selectedFields.clinicalImpressions) appliedData.clinicalImpressions = extractedData.clinicalImpressions;
    if (selectedFields.labs) appliedData.labs = extractedData.labs;
    if (selectedFields.imaging) appliedData.imaging = extractedData.imaging;
    if (selectedFields.currentMeds) appliedData.currentMeds = extractedData.currentMeds;
    if (selectedFields.pastTreatments) appliedData.pastTreatments = extractedData.pastTreatments;
    if (selectedFields.thermal) {
      appliedData.thermal = extractedData.thermal;
      appliedData.energy = extractedData.energy;
    }
    if (selectedFields.miasm) appliedData.miasm = extractedData.miasm;

    appliedData.reportType = uploadType;
    appliedData.fileNameHash = extractedData.fileNameHash;

    onApply(appliedData);
    onClose();
  };

  const toggleField = (field: keyof typeof selectedFields) => {
    setSelectedFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const toggleAcknowledge = (field: string) => {
    setAcknowledgedFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const renderConfidenceBadge = (confidence: string) => {
    if (confidence === "High") {
      return <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[9px] px-2 py-0.5 rounded-full font-bold">High Confidence</span>;
    }
    if (confidence === "Medium") {
      return <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[9px] px-2 py-0.5 rounded-full font-bold">Medium Confidence</span>;
    }
    return <span className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[9px] px-2 py-0.5 rounded-full font-bold animate-pulse flex items-center gap-1"><AlertTriangle className="w-2.5 h-2.5" /> Low Confidence</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl bg-pearl dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 px-6 py-4 border-b border-slate-150 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Ingest {getTypeName()}</h3>
              <p className="text-[10px] text-slate-400 font-medium">Extract parameters dynamically with Clinical AI Ingestion</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            disabled={isIngesting}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-transparent border-none cursor-pointer p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-grow space-y-4">
          <AnimatePresence mode="wait">
            {isIngesting ? (
              /* Step 2: Processing Ingestion Loader */
              <motion.div 
                key="ingesting"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-10 space-y-4 text-center"
              >
                <div className="w-14 h-14 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Ingesting Clinical Report</h4>
                  <p className="text-xs text-slate-400 font-medium animate-pulse">Running Gemini AI OCR & extracting homeopathic coordinates...</p>
                </div>
                
                {/* Visual scanning accent bar */}
                <div className="w-64 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative border border-slate-250 dark:border-slate-700">
                  <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-emerald-500 rounded-full animate-[loading-bar_1.5s_infinite_ease-in-out]" />
                </div>

                <button 
                  onClick={cancelIngestion}
                  className="mt-4 px-5 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all border border-rose-200 dark:border-rose-900/40 cursor-pointer"
                >
                  Cancel Ingestion
                </button>
              </motion.div>
            ) : step === "select" ? (
              /* Step 1: File selection & Dropzone */
              <motion.div 
                key="select"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* PHI Privacy Notice Alert */}
                <div className="p-3 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-900/40 rounded-2xl flex gap-2.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed">
                  <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">PHI Privacy notice:</span> Uploaded files are processed strictly in-memory for clinical parameters extraction and are not stored in any database or cloud storage directory. All medical data is handled securely under compliance guidelines.
                  </div>
                </div>

                {/* Drop Zone */}
                <div 
                  ref={dropZoneRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500/50 rounded-3xl p-8 flex flex-col items-center justify-center space-y-3 cursor-pointer bg-white/40 dark:bg-slate-900/40 hover:bg-slate-50/20 dark:hover:bg-slate-900/60 transition-all group"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={(e) => e.target.files && handleFileSelection(e.target.files[0])}
                    className="hidden"
                    accept=".pdf,.png,.jpeg,.jpg,.txt,.docx"
                  />
                  <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                  <div className="text-center">
                    <p className="text-xs font-bold text-slate-700 dark:text-white">Drag & drop report or click to browse</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold">Supports PDF, PNG, JPEG, TXT, DOCX (Max 10 MB)</p>
                  </div>
                </div>

                {/* Selected File State */}
                {file && (
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-5 h-5 text-slate-400" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{file.name}</p>
                        <p className="text-[9px] text-slate-400 font-mono">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button 
                      onClick={clearUploader}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-rose-400 bg-transparent border-none cursor-pointer p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Warning & Errors */}
                {duplicateWarning && (
                  <div className="p-3 bg-amber-500/5 border border-amber-200/50 dark:border-amber-900/40 rounded-2xl flex gap-2 text-xs text-amber-700 dark:text-amber-400 font-semibold">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>⚠️ {duplicateWarning}</span>
                  </div>
                )}

                {errorMessage && (
                  <div className="p-3 bg-rose-500/5 border border-rose-200/50 dark:border-rose-900/40 rounded-2xl flex gap-2 text-xs text-rose-700 dark:text-rose-400 font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>❌ {errorMessage}</span>
                  </div>
                )}

                {/* Action Trigger */}
                <div className="flex justify-end gap-2.5 pt-2">
                  <button 
                    onClick={onClose}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white dark:bg-slate-950"
                  >
                    Cancel
                  </button>
                  <button 
                    disabled={!file}
                    onClick={() => processReportIngestion(uploadType)}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 dark:disabled:bg-slate-900 text-white disabled:text-slate-400 dark:disabled:text-slate-600 rounded-xl text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-1.5 shadow-sm disabled:cursor-not-allowed"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Start Ingestion & OCR</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Step 3: Review extracted data with confidence & traceability */
              <motion.div 
                key="review"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Clinical Disclaimer Tag */}
                <div className="p-3 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-200/50 dark:border-amber-900/40 rounded-2xl flex gap-2 text-xs text-amber-700 dark:text-amber-400 font-semibold leading-normal">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>AI-extracted draft for clinician review only. Validate extracted impressions and clinical logs against the source document prior to form integration.</span>
                </div>

                <div className="text-xs font-bold text-slate-700 dark:text-slate-350 border-b border-slate-150 dark:border-slate-800 pb-1 flex justify-between items-center">
                  <span>Structured Report Summary (File: {file?.name})</span>
                  <span className="text-[10px] text-slate-400">Review and select parameters to apply</span>
                </div>

                {/* Extracted Fields Review List */}
                <div className="border border-slate-150 dark:border-slate-805 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-805 bg-white/40 dark:bg-slate-950/40">
                  
                  {/* Field Row: Clinical Impressions */}
                  {extractedData?.clinicalImpressions && (
                    <div className="p-3 flex gap-3 items-start">
                      <button 
                        onClick={() => toggleField("clinicalImpressions")}
                        className="mt-1 text-slate-400 hover:text-emerald-500 cursor-pointer bg-transparent border-none p-0 flex items-center"
                      >
                        {selectedFields.clinicalImpressions ? (
                          <span className="text-emerald-600"><CheckSquare className="w-4 h-4" /></span>
                        ) : (
                          <Square className="w-4 h-4 text-slate-350" />
                        )}
                      </button>
                      <div className="flex-grow space-y-1.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-slate-700 dark:text-slate-300">Clinical Impressions</span>
                          {renderConfidenceBadge(extractedData.confidenceLevels.clinicalImpressions)}
                        </div>
                        <p className="font-semibold text-slate-850 dark:text-slate-200 bg-slate-50 dark:bg-slate-955 p-2 rounded-xl border border-slate-100 dark:border-slate-850">
                          {extractedData.clinicalImpressions}
                        </p>
                        {extractedData.sourceEvidence?.clinicalImpressions?.text && (
                          <div className="text-[9.5px] text-slate-450 dark:text-slate-400 leading-normal bg-slate-100/40 dark:bg-slate-900/40 p-1.5 rounded-lg border-l-2 border-slate-300 dark:border-slate-700">
                            <strong>Source Quote (Pg {extractedData.sourceEvidence.clinicalImpressions.page || 1}):</strong> "{extractedData.sourceEvidence.clinicalImpressions.text}"
                          </div>
                        )}
                        {extractedData.confidenceLevels.clinicalImpressions === "Low" && (
                          <label className="flex items-center gap-1.5 text-[10px] text-rose-500 font-bold mt-1 select-none cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={!!acknowledgedFields.clinicalImpressions}
                              onChange={() => toggleAcknowledge("clinicalImpressions")}
                              className="rounded accent-rose-500" 
                            />
                            Acknowledge low-confidence extraction
                          </label>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Field Row: Labs */}
                  {extractedData?.labs && (
                    <div className="p-3 flex gap-3 items-start">
                      <button 
                        onClick={() => toggleField("labs")}
                        className="mt-1 text-slate-400 hover:text-emerald-500 cursor-pointer bg-transparent border-none p-0 flex items-center"
                      >
                        {selectedFields.labs ? (
                          <span className="text-emerald-600"><CheckSquare className="w-4 h-4" /></span>
                        ) : (
                          <Square className="w-4 h-4 text-slate-350" />
                        )}
                      </button>
                      <div className="flex-grow space-y-1.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-slate-700 dark:text-slate-300">Lab Results / Pathology findings</span>
                          {renderConfidenceBadge(extractedData.confidenceLevels.labs)}
                        </div>
                        <p className="font-semibold text-slate-850 dark:text-slate-200 bg-slate-50 dark:bg-slate-955 p-2 rounded-xl border border-slate-100 dark:border-slate-850">
                          {extractedData.labs}
                        </p>
                        {extractedData.sourceEvidence?.labs?.text && (
                          <div className="text-[9.5px] text-slate-450 dark:text-slate-400 leading-normal bg-slate-100/40 dark:bg-slate-900/40 p-1.5 rounded-lg border-l-2 border-slate-300 dark:border-slate-700">
                            <strong>Source Quote (Pg {extractedData.sourceEvidence.labs.page || 1}):</strong> "{extractedData.sourceEvidence.labs.text}"
                          </div>
                        )}
                        {extractedData.confidenceLevels.labs === "Low" && (
                          <label className="flex items-center gap-1.5 text-[10px] text-rose-500 font-bold mt-1 select-none cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={!!acknowledgedFields.labs}
                              onChange={() => toggleAcknowledge("labs")}
                              className="rounded accent-rose-500" 
                            />
                            Acknowledge low-confidence extraction
                          </label>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Field Row: Imaging */}
                  {extractedData?.imaging && (
                    <div className="p-3 flex gap-3 items-start">
                      <button 
                        onClick={() => toggleField("imaging")}
                        className="mt-1 text-slate-400 hover:text-emerald-500 cursor-pointer bg-transparent border-none p-0 flex items-center"
                      >
                        {selectedFields.imaging ? (
                          <span className="text-emerald-600"><CheckSquare className="w-4 h-4" /></span>
                        ) : (
                          <Square className="w-4 h-4 text-slate-350" />
                        )}
                      </button>
                      <div className="flex-grow space-y-1.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-slate-700 dark:text-slate-300">Imaging Scans findings</span>
                          {renderConfidenceBadge(extractedData.confidenceLevels.imaging)}
                        </div>
                        <p className="font-semibold text-slate-850 dark:text-slate-200 bg-slate-50 dark:bg-slate-955 p-2 rounded-xl border border-slate-100 dark:border-slate-850">
                          {extractedData.imaging}
                        </p>
                        {extractedData.sourceEvidence?.imaging?.text && (
                          <div className="text-[9.5px] text-slate-450 dark:text-slate-400 leading-normal bg-slate-100/40 dark:bg-slate-900/40 p-1.5 rounded-lg border-l-2 border-slate-300 dark:border-slate-700">
                            <strong>Source Quote (Pg {extractedData.sourceEvidence.imaging.page || 1}):</strong> "{extractedData.sourceEvidence.imaging.text}"
                          </div>
                        )}
                        {extractedData.confidenceLevels.imaging === "Low" && (
                          <label className="flex items-center gap-1.5 text-[10px] text-rose-500 font-bold mt-1 select-none cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={!!acknowledgedFields.imaging}
                              onChange={() => toggleAcknowledge("imaging")}
                              className="rounded accent-rose-500" 
                            />
                            Acknowledge low-confidence extraction
                          </label>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Field Row: Medicines & Past Treatments */}
                  {(extractedData?.currentMeds || extractedData?.pastTreatments) && (
                    <div className="p-3 flex gap-3 items-start">
                      <button 
                        onClick={() => {
                          const state = !selectedFields.currentMeds;
                          setSelectedFields(prev => ({ ...prev, currentMeds: state, pastTreatments: state }));
                        }}
                        className="mt-1 text-slate-400 hover:text-emerald-500 cursor-pointer bg-transparent border-none p-0 flex items-center"
                      >
                        {selectedFields.currentMeds || selectedFields.pastTreatments ? (
                          <span className="text-emerald-600"><CheckSquare className="w-4 h-4" /></span>
                        ) : (
                          <Square className="w-4 h-4 text-slate-350" />
                        )}
                      </button>
                      <div className="flex-grow space-y-1.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-slate-700 dark:text-slate-300">Medication history (Rx details)</span>
                          {renderConfidenceBadge(extractedData.confidenceLevels.currentMeds || extractedData.confidenceLevels.pastTreatments)}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                          {extractedData.currentMeds && (
                            <div className="bg-slate-50 dark:bg-slate-955 p-2 rounded-xl border border-slate-100 dark:border-slate-850">
                              <span className="font-bold text-[9px] uppercase tracking-wider text-slate-400 block mb-1">Current Active Meds</span>
                              <p className="font-semibold text-slate-800 dark:text-slate-200">{extractedData.currentMeds}</p>
                            </div>
                          )}
                          {extractedData.pastTreatments && (
                            <div className="bg-slate-50 dark:bg-slate-955 p-2 rounded-xl border border-slate-100 dark:border-slate-850">
                              <span className="font-bold text-[9px] uppercase tracking-wider text-slate-400 block mb-1">Past Suppressions / Treatments</span>
                              <p className="font-semibold text-slate-800 dark:text-slate-200">{extractedData.pastTreatments}</p>
                            </div>
                          )}
                        </div>
                        {(extractedData.sourceEvidence?.currentMeds?.text || extractedData.sourceEvidence?.pastTreatments?.text) && (
                          <div className="text-[9.5px] text-slate-450 dark:text-slate-400 leading-normal bg-slate-100/40 dark:bg-slate-900/40 p-1.5 rounded-lg border-l-2 border-slate-300 dark:border-slate-700">
                            <strong>Source Quote:</strong> "{extractedData.sourceEvidence.currentMeds?.text || extractedData.sourceEvidence.pastTreatments?.text}"
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Field Row: Thermal Orientation & Miasm Load */}
                  {(extractedData?.thermal || (extractedData?.miasm && extractedData.miasm.length > 0)) && (
                    <div className="p-3 flex gap-3 items-start">
                      <button 
                        onClick={() => {
                          const state = !selectedFields.thermal;
                          setSelectedFields(prev => ({ ...prev, thermal: state, miasm: state }));
                        }}
                        className="mt-1 text-slate-400 hover:text-emerald-500 cursor-pointer bg-transparent border-none p-0 flex items-center"
                      >
                        {selectedFields.thermal || selectedFields.miasm ? (
                          <span className="text-emerald-600"><CheckSquare className="w-4 h-4" /></span>
                        ) : (
                          <Square className="w-4 h-4 text-slate-350" />
                        )}
                      </button>
                      <div className="flex-grow space-y-1.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-slate-700 dark:text-slate-300">Homeopathic Miasms & Thermal Orientation</span>
                          {renderConfidenceBadge(extractedData.confidenceLevels.thermal || extractedData.confidenceLevels.miasm)}
                        </div>
                        <div className="flex flex-wrap gap-2.5 mt-1 bg-slate-50 dark:bg-slate-955 p-2 rounded-xl border border-slate-100 dark:border-slate-850">
                          {extractedData.thermal && (
                            <div>
                              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Inferred Thermal</span>
                              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono text-[10px] uppercase tracking-wide bg-emerald-500/5 px-2 py-0.5 rounded-md border border-emerald-500/10 mt-0.5 inline-block">{extractedData.thermal}</span>
                            </div>
                          )}
                          {extractedData.miasm && extractedData.miasm.length > 0 && (
                            <div>
                              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Inferred Miasm Indicator</span>
                              <div className="flex flex-wrap gap-1 mt-0.5">
                                {extractedData.miasm.map((m) => (
                                  <span key={m} className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10 font-bold text-[9px] px-2 py-0.5 rounded-md">{m}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {typeof extractedData.energy === "number" && (
                            <div>
                              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Energy Level</span>
                              <span className="font-bold text-slate-700 dark:text-slate-300">{extractedData.energy} / 10</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Confirm Actions */}
                <div className="flex justify-between items-center pt-2">
                  <button 
                    onClick={() => setStep("select")}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white dark:bg-slate-950"
                  >
                    Back to Uploader
                  </button>
                  <div className="flex gap-2.5">
                    <button 
                      onClick={onClose}
                      className="px-4 py-2 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white dark:bg-slate-955"
                    >
                      Discard Ingestion
                    </button>
                    <button 
                      onClick={handleApply}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Apply Selected Fields to Intake</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
