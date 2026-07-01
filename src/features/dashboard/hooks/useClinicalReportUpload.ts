import { useState, useRef } from "react";
import { ReportExtractionResult } from "../types/reportExtractionTypes";

export function useClinicalReportUpload(onSuccess: (result: ReportExtractionResult) => void) {
  const [file, setFile] = useState<File | null>(null);
  const [isIngesting, setIsIngesting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  
  // Track uploaded file hashes to prevent duplicate ingestion in this session
  const [uploadedHashes, setUploadedHashes] = useState<string[]>([]);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const calculateSimpleHash = (fileName: string, fileSize: number): string => {
    let sum = 0;
    const str = `${fileName}-${fileSize}`;
    for (let i = 0; i < str.length; i++) {
      sum = (sum << 5) - sum + str.charCodeAt(i);
      sum = sum & sum;
    }
    return Math.abs(sum).toString(16);
  };

  const handleFileSelection = (selectedFile: File) => {
    setErrorMessage(null);
    setDuplicateWarning(null);

    // 1. Strict size check (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMessage("File exceeds strict 10MB size limit.");
      setFile(null);
      return;
    }

    // 2. Strict type check
    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "text/plain",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    
    const extension = selectedFile.name.split(".").pop()?.toLowerCase();
    const isDocx = extension === "docx";
    const isTxt = extension === "txt";
    
    if (!allowedTypes.includes(selectedFile.type) && !isDocx && !isTxt) {
      setErrorMessage("Unsupported file type. Allowed: PDF, PNG, JPEG, TXT, DOCX.");
      setFile(null);
      return;
    }

    // 3. Duplicate check
    const hash = calculateSimpleHash(selectedFile.name, selectedFile.size);
    if (uploadedHashes.includes(hash)) {
      setDuplicateWarning("Possible duplicate report uploaded. This report was already processed in the current session.");
    }

    setFile(selectedFile);
  };

  const cancelIngestion = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsIngesting(false);
    setErrorMessage("Ingestion cancelled by clinician.");
  };

  const processReportIngestion = async (reportType: "lab" | "prescription" | "imaging") => {
    if (!file) {
      setErrorMessage("Please select a file first.");
      return;
    }

    setIsIngesting(true);
    setErrorMessage(null);
    abortControllerRef.current = new AbortController();

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          const base64Str = result.split(",")[1] || result;
          resolve(base64Str);
        };
        reader.onerror = () => reject(new Error("File reading failed."));
      });

      const fileData = await base64Promise;

      let mimeType = file.type;
      if (!mimeType) {
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (ext === "docx") {
          mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        } else if (ext === "txt") {
          mimeType = "text/plain";
        } else {
          mimeType = "application/octet-stream";
        }
      }

      const response = await fetch("/api/import-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileData,
          fileName: file.name,
          mimeType,
          reportType
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => null);
        throw new Error(errBody?.message || `Ingestion service returned status code: ${response.status}`);
      }

      const payload = await response.json();
      if (!payload.success || !payload.result) {
        throw new Error(payload.message || "Failed to extract report parameters.");
      }

      const hash = calculateSimpleHash(file.name, file.size);
      setUploadedHashes(prev => [...prev, hash]);

      onSuccess(payload.result);

    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Ingestion cancelled.");
      } else {
        setErrorMessage(err.message || "An unexpected error occurred during report parsing.");
      }
    } finally {
      setIsIngesting(false);
      abortControllerRef.current = null;
    }
  };

  const clearUploader = () => {
    setFile(null);
    setErrorMessage(null);
    setDuplicateWarning(null);
    setIsIngesting(false);
  };

  return {
    file,
    isIngesting,
    errorMessage,
    duplicateWarning,
    handleFileSelection,
    processReportIngestion,
    cancelIngestion,
    clearUploader
  };
}
