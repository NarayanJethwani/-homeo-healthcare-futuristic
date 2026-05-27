"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Activity, Sparkles, Folder, FileSpreadsheet, ExternalLink, 
  Search, Sliders, Brain, RefreshCw, Send, Plus, Trash2, CheckCircle, 
  Settings, LogOut, ShieldAlert, Award, FileText, ChevronRight, UserPlus, Upload,
  BookOpen, Book, ChevronLeft, Maximize2, Minimize2
} from "lucide-react";
import { REPERTORY_DATA, REPERTORY_CHAPTERS, REMEDIES_METADATA, Rubric } from "@/lib/repertoryData";
import { MATERIA_MEDICA_BOOKS, MateriaMedicaBook } from "@/lib/materiaMedicaData";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, setDoc } from "firebase/firestore";

interface UserSession {
  uid: string;
  email: string;
  name: string;
  role: "admin" | "doctor";
  assignedPatients: string[];
}

interface Patient {
  id: string;
  name: string;
  age: string;
  gender: string;
  phone: string;
  email: string;
  location: string;
  complaint: string;
  careLevel: string;
  durationText: string;
  finalPrice: number;
  folderUrl: string;
  sheetUrl: string;
  assignedDoctor: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState<"patients" | "repertory" | "team" | "materia-medica">("patients");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Repertory State
  const [selectedChapter, setSelectedChapter] = useState(REPERTORY_CHAPTERS[0]);
  const [rubricSearch, setRubricSearch] = useState("");
  const [selectedRubrics, setSelectedRubrics] = useState<Array<{ rubric: Rubric; grade: number }>>([]);
  const [remedyColumns, setRemedyColumns] = useState<string[]>([]);
  const [remedyScores, setRemedyScores] = useState<Array<{ remedy: string; coverage: string; score: number }>>([]);
  
  // AI State
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [customComplaint, setCustomComplaint] = useState("");
  const [aiReport, setAiReport] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  // Materia Medica State
  const [selectedBook, setSelectedBook] = useState<MateriaMedicaBook | null>(null);
  const [remedies, setRemedies] = useState<Array<{ name: string; path: string }>>([]);
  const [remedySearchTerm, setRemedySearchTerm] = useState("");
  const [isRemediesLoading, setIsRemediesLoading] = useState(false);
  const [selectedRemedy, setSelectedRemedy] = useState<{ title: string; content: string; path: string } | null>(null);
  const [isRemedyLoading, setIsRemedyLoading] = useState(false);
  const [readerFontSize, setReaderFontSize] = useState<"sm" | "base" | "lg" | "xl" | "2xl">("base");
  const [readerTheme, setReaderTheme] = useState<"light" | "sepia" | "dark">("sepia");
  const [remediesFetchError, setRemediesFetchError] = useState("");
  const [remedyFetchError, setRemedyFetchError] = useState("");
  const [isReaderFullscreen, setIsReaderFullscreen] = useState(false);

  // Sync scroll lock when fullscreen reader is open
  useEffect(() => {
    if (isReaderFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isReaderFullscreen]);

  const handleSelectBook = async (book: MateriaMedicaBook) => {
    setSelectedBook(book);
    setSelectedRemedy(null);
    setRemedySearchTerm("");
    setRemedies([]);
    setRemediesFetchError("");
    setIsRemediesLoading(true);

    try {
      const res = await fetch(`/api/materia-medica?author=${book.id}`);
      const data = await res.json();
      if (data.success) {
        setRemedies(data.remedies || []);
      } else {
        throw new Error(data.message || "Failed to load remedies index.");
      }
    } catch (err: any) {
      console.error(err);
      setRemediesFetchError(err.message || "Failed to fetch index from knowledge hub.");
    } finally {
      setIsRemediesLoading(false);
    }
  };

  const handleSelectRemedy = async (path: string) => {
    setSelectedRemedy(null);
    setRemedyFetchError("");
    setIsRemedyLoading(true);

    try {
      const res = await fetch(`/api/materia-medica?path=${encodeURIComponent(path)}`);
      const data = await res.json();
      if (data.success) {
        setSelectedRemedy({
          title: data.title,
          content: data.content,
          path: data.path
        });
      } else {
        throw new Error(data.message || "Failed to load remedy details.");
      }
    } catch (err: any) {
      console.error(err);
      setRemedyFetchError(err.message || "Failed to fetch remedy content.");
    } finally {
      setIsRemedyLoading(false);
    }
  };

  const handleJumpToLetter = (letter: string) => {
    const element = document.getElementById(`remedy-letter-${letter.toLowerCase()}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  // New Case Taking & Import States
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [newCaseForm, setNewCaseForm] = useState({
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    email: "",
    city: "",
    state: "",
    country: "India",
    complaint: "",
    careLevel: "🌱 Acute & Wellness Care",
    durationText: "1-Month Consultation",
    finalPrice: 3500
  });
  const [isCreatingCase, setIsCreatingCase] = useState(false);
  const [caseCreationError, setCaseCreationError] = useState("");
  const [caseCreationSuccess, setCaseCreationSuccess] = useState(false);
  const [createdFolderUrl, setCreatedFolderUrl] = useState("");
  const [createdSheetUrl, setCreatedSheetUrl] = useState("");

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");

  const [importMethod, setImportMethod] = useState<"file" | "google" | "ai">("file");
  const [googleSheetUrl, setGoogleSheetUrl] = useState("");
  const [isImportingFromGoogle, setIsImportingFromGoogle] = useState(false);
  const [googlePatientsList, setGooglePatientsList] = useState<any[]>([]);
  const [googleFolderFiles, setGoogleFolderFiles] = useState<any[]>([]);
  const [serviceAccountEmail, setServiceAccountEmail] = useState("");
  const [isAnalyzingFile, setIsAnalyzingFile] = useState(false);
  const [isProvisioningWorkspace, setIsProvisioningWorkspace] = useState(false);
  const [provisioningPatientName, setProvisioningPatientName] = useState("");

  // Check login session
  useEffect(() => {
    const savedSession = localStorage.getItem("admin_session");
    if (!savedSession) {
      router.push("/admin/login");
    } else {
      try {
        const parsed = JSON.parse(savedSession);
        setSession(parsed);
      } catch {
        router.push("/admin/login");
      }
    }
  }, [router]);

  // Fetch Google Service Account Email for display
  useEffect(() => {
    if (isImportModalOpen && !serviceAccountEmail) {
      fetch("/api/import-sheet")
        .then(res => res.json())
        .then(data => {
          if (data.success && data.serviceAccountEmail) {
            setServiceAccountEmail(data.serviceAccountEmail);
          }
        })
        .catch(err => console.error("Error fetching service account email:", err));
    }
  }, [isImportModalOpen, serviceAccountEmail]);

  // Load Patients from Firestore in real-time
  useEffect(() => {
    if (!session?.uid) return;

    const q = query(collection(db, "patients"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        // If Firestore patients collection is empty, seed it with high-quality mock data for testing
        console.log("Firestore patients collection is empty. Seeding initial patients...");
        try {
          const initialPatients: Patient[] = [
            {
              id: "P-100234",
              name: "Aarav Mehta",
              age: "42",
              gender: "Male",
              phone: "+91 98200 12345",
              email: "aarav.mehta@gmail.com",
              location: "Mumbai, Maharashtra, India",
              complaint: "Chronic severe acidity, GERD, and abdominal bloating immediately after eating. Irritability, very chilly, worse cold drinks.",
              careLevel: "Advanced Chronic Tier",
              durationText: "6-Month Treatment Plan",
              finalPrice: 8500,
              folderUrl: "https://drive.google.com/drive/folders/1UR6te8zTdXsrtsWhiuDnhpBGZPx4_Mkb?usp=share_link",
              sheetUrl: "https://drive.google.com/drive/folders/1UR6te8zTdXsrtsWhiuDnhpBGZPx4_Mkb?usp=share_link",
              assignedDoctor: "doctor-bypass-id",
              status: "active",
              createdAt: "2026-05-20T10:00:00Z"
            },
            {
              id: "P-200567",
              name: "Priyanka Sen",
              age: "29",
              gender: "Female",
              phone: "+91 91100 54321",
              email: "priyanka.sen@outlook.com",
              location: "Kolkata, West Bengal, India",
              complaint: "Dry eczematous patches on elbows and neck. Intense itching at night, worse warmth of bed. Desires cold air.",
              careLevel: "Standard Consultation",
              durationText: "1-Month Consultation",
              finalPrice: 2200,
              folderUrl: "https://drive.google.com/drive/folders/1UR6te8zTdXsrtsWhiuDnhpBGZPx4_Mkb?usp=share_link",
              sheetUrl: "https://drive.google.com/drive/folders/1UR6te8zTdXsrtsWhiuDnhpBGZPx4_Mkb?usp=share_link",
              assignedDoctor: "doctor-bypass-id",
              status: "active",
              createdAt: "2026-05-22T14:30:00Z"
            },
            {
              id: "P-339281",
              name: "Suresh Sharma",
              age: "67",
              gender: "Male",
              phone: "+91 88799 11223",
              email: "suresh67@yahoo.com",
              location: "Delhi, NCR, India",
              complaint: "Severe morning joint stiffness in knees and back. Pain worse beginning of motion, improves with continuous walking. Aggravated by cold damp weather.",
              careLevel: "Advanced Chronic Tier",
              durationText: "12-Month Support Plan",
              finalPrice: 15000,
              folderUrl: "https://drive.google.com/drive/folders/1UR6te8zTdXsrtsWhiuDnhpBGZPx4_Mkb?usp=share_link",
              sheetUrl: "https://drive.google.com/drive/folders/1UR6te8zTdXsrtsWhiuDnhpBGZPx4_Mkb?usp=share_link",
              assignedDoctor: "unassigned",
              status: "awaiting-consult",
              createdAt: "2026-05-25T09:15:00Z"
            },
            {
              id: "P-882910",
              name: "Rishi (Golden Retriever)",
              age: "4",
              gender: "Male",
              phone: "+91 98800 99887",
              email: "amit.verma@gmail.com",
              location: "Pune, Maharashtra, India",
              complaint: "Severe separation anxiety, whines and scratches door when owner leaves. Extremely fearful of thunder and firecrackers. Desires cool open air.",
              careLevel: "Veterinary Consultation",
              durationText: "3-Month Plan",
              finalPrice: 4500,
              folderUrl: "https://drive.google.com/drive/folders/1UR6te8zTdXsrtsWhiuDnhpBGZPx4_Mkb?usp=share_link",
              sheetUrl: "https://drive.google.com/drive/folders/1UR6te8zTdXsrtsWhiuDnhpBGZPx4_Mkb?usp=share_link",
              assignedDoctor: "unassigned",
              status: "active",
              createdAt: "2026-05-26T11:45:00Z"
            }
          ];

          for (const pat of initialPatients) {
            await setDoc(doc(db, "patients", pat.id), pat);
          }
        } catch (err) {
          console.error("Error seeding initial patients in Firestore:", err);
        }
      } else {
        const list: Patient[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as Patient);
        });
        setPatients(list);
      }
    }, (error) => {
      console.error("Error listening to patients collection:", error);
    });

    return () => unsubscribe();
  }, [session]);

  // Filter patients based on search and roles
  const filteredPatients = patients.filter((p) => {
    // 1. Role-based visibility
    if (session && session.role !== "admin") {
      // Junior doctor: Only see assigned patients
      if (p.assignedDoctor !== session.uid && !session.assignedPatients.includes(p.id)) {
        return false;
      }
    }
    // 2. Search match
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.id.toLowerCase().includes(term) ||
      p.complaint.toLowerCase().includes(term) ||
      p.location.toLowerCase().includes(term)
    );
  });

  // Handle Log Out
  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin/login");
  };

  const handleCareLevelChange = (level: string) => {
    let price = 3500;
    if (level === "⚡ Standard Chronic Care") price = 7500;
    if (level === "🎯 Deep Systemic Care") price = 12500;
    if (level === "🫁 Advanced Pathological Care") price = 18500;
    if (level === "🔮 Multisystem Integrative Care") price = 25000;
    setNewCaseForm(prev => ({
      ...prev,
      careLevel: level,
      finalPrice: price
    }));
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingCase(true);
    setCaseCreationError("");
    setCaseCreationSuccess(false);

    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCaseForm.name,
          age: newCaseForm.age,
          gender: newCaseForm.gender,
          phone: newCaseForm.phone,
          email: newCaseForm.email,
          city: newCaseForm.city,
          state: newCaseForm.state,
          country: newCaseForm.country,
          complaint: newCaseForm.complaint,
          careLevel: newCaseForm.careLevel,
          conditionsCount: 1,
          durationText: newCaseForm.durationText,
          finalPrice: newCaseForm.finalPrice,
          assignedDoctor: session?.uid || "unassigned"
        })
      });

      const data = await response.json();
      if (data.success) {
        setCreatedFolderUrl(data.folderUrl);
        setCreatedSheetUrl(data.sheetUrl);
        setCaseCreationSuccess(true);
        
        // Append to local state if Firestore is in mock-project mode
        const isMockProject = !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === "mock-project-id";
        if (isMockProject) {
          const newPatient: Patient = {
            id: data.patientId || `P-${Math.floor(100000 + Math.random() * 900000)}`,
            name: newCaseForm.name,
            age: newCaseForm.age,
            gender: newCaseForm.gender,
            phone: newCaseForm.phone,
            email: newCaseForm.email,
            location: `${newCaseForm.city || "N/A"}, ${newCaseForm.state || "N/A"}, ${newCaseForm.country}`,
            complaint: newCaseForm.complaint,
            careLevel: newCaseForm.careLevel,
            durationText: newCaseForm.durationText,
            finalPrice: newCaseForm.finalPrice,
            folderUrl: data.folderUrl,
            sheetUrl: data.sheetUrl,
            assignedDoctor: session?.uid || "unassigned",
            status: "active",
            createdAt: new Date().toISOString()
          };
          setPatients(prev => [newPatient, ...prev]);
        }

        // Reset form
        setNewCaseForm({
          name: "",
          age: "",
          gender: "Male",
          phone: "",
          email: "",
          city: "",
          state: "",
          country: "India",
          complaint: "",
          careLevel: "🌱 Acute & Wellness Care",
          durationText: "1-Month Consultation",
          finalPrice: 3500
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error("Failed to create case:", error);
      setCaseCreationError(error.message || "Failed to connect to Google Drive intake automation. Operating in Mock link mode.");
      
      // Fallback for mock/offline testing
      const mockPatientId = `P-${Math.floor(100000 + Math.random() * 900000)}`;
      const folderUrl = "https://drive.google.com/drive/folders/1UR6te8zTdXsrtsWhiuDnhpBGZPx4_Mkb?usp=share_link";
      const sheetUrl = "https://drive.google.com/drive/folders/1UR6te8zTdXsrtsWhiuDnhpBGZPx4_Mkb?usp=share_link";
      
      setCreatedFolderUrl(folderUrl);
      setCreatedSheetUrl(sheetUrl);
      
      const newPatient: Patient = {
        id: mockPatientId,
        name: newCaseForm.name,
        age: newCaseForm.age,
        gender: newCaseForm.gender,
        phone: newCaseForm.phone,
        email: newCaseForm.email,
        location: `${newCaseForm.city || "N/A"}, ${newCaseForm.state || "N/A"}, ${newCaseForm.country}`,
        complaint: newCaseForm.complaint,
        careLevel: newCaseForm.careLevel,
        durationText: newCaseForm.durationText,
        finalPrice: newCaseForm.finalPrice,
        folderUrl,
        sheetUrl,
        assignedDoctor: session?.uid || "unassigned",
        status: "active",
        createdAt: new Date().toISOString()
      };
      
      try {
        const isMockProject = !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === "mock-project-id";
        if (!isMockProject) {
          await setDoc(doc(db, "patients", mockPatientId), newPatient);
        } else {
          console.log("Firebase operating in mock-project-id. Appending patient locally.");
          setPatients(prev => [newPatient, ...prev]);
        }
        setCaseCreationSuccess(true);
      } catch (dbErr) {
        console.error("Failed to save mock patient to Firestore:", dbErr);
        // Fallback local update if Firestore offline
        setPatients(prev => [newPatient, ...prev]);
        setCaseCreationSuccess(true);
      }
    } finally {
      setIsCreatingCase(false);
    }
  };

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError("");
    setImportSuccess("");

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) throw new Error("File is empty.");

        const lines = text.split(/\r?\n/);
        if (lines.length < 2) throw new Error("CSV must contain headers and at least one row of patient data.");

        const parseCSVLine = (line: string) => {
          const result = [];
          let current = "";
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim());
              current = "";
            } else {
              current += char;
            }
          }
          result.push(current.trim());
          return result;
        };

        const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());
        
        let dataRow: string[] = [];
        for (let i = 1; i < lines.length; i++) {
          const parsed = parseCSVLine(lines[i]);
          if (parsed.length > 0 && parsed.some(val => val !== "")) {
            dataRow = parsed;
            break;
          }
        }
        
        if (dataRow.length === 0) throw new Error("No patient data rows found in CSV.");

        const getVal = (fieldNames: string[]) => {
          const index = headers.findIndex(h => fieldNames.includes(h));
          return index !== -1 ? dataRow[index] : "";
        };

        const name = getVal(["name", "patient name", "fullname", "patient"]);
        const age = getVal(["age", "patient age", "yrs"]);
        const gender = getVal(["gender", "sex", "gender"]);
        const email = getVal(["email", "mail", "email address"]);
        const phone = getVal(["phone", "contact", "mobile", "tel"]);
        const city = getVal(["city", "location", "town"]);
        const state = getVal(["state", "province"]);
        const complaint = getVal(["complaint", "symptoms", "history", "chief complaint"]);
        const rubricsText = getVal(["rubrics", "repertory", "symptom rubrics"]);

        if (!name || !complaint) {
          throw new Error("CSV must at least contain 'Name' and 'Complaint' or 'Symptoms' columns.");
        }

        // Prefill New Case Form
        setNewCaseForm({
          name,
          age: age || "30",
          gender: gender || "Male",
          phone: phone || "",
          email: email || "",
          city: city || "",
          state: state || "",
          country: "India",
          complaint,
          careLevel: "⚡ Standard Chronic Care",
          durationText: "1-Month Consultation",
          finalPrice: 7500
        });

        // Parse rubrics if present (e.g. "GERD (3); bloating (2)")
        if (rubricsText) {
          const parsedRubricsList: Array<{ rubric: Rubric; grade: number }> = [];
          const rubricEntries = rubricsText.split(";");

          rubricEntries.forEach(entry => {
            const match = entry.match(/(.+)\((\d)\)/);
            if (match) {
              const rubricQuery = match[1].trim().toLowerCase();
              const rubricGrade = Number(match[2].trim());

              const foundRubric = REPERTORY_DATA.find(
                r => r.name.toLowerCase().includes(rubricQuery) || rubricQuery.includes(r.name.toLowerCase())
              );

              if (foundRubric) {
                parsedRubricsList.push({ rubric: foundRubric, grade: rubricGrade });
              }
            }
          });

          if (parsedRubricsList.length > 0) {
            setSelectedRubrics(parsedRubricsList);
            setImportSuccess(`Imported case for '${name}' with ${parsedRubricsList.length} matched rubrics populated in Repertory grid!`);
          } else {
            setImportSuccess(`Imported patient details for '${name}' (demographics prefilled, no rubrics matched).`);
          }
        } else {
          setImportSuccess(`Imported patient demographics for '${name}' successfully. You can now verify and save this case!`);
        }

        // Open the New Case Modal with the prefilled values
        setIsNewCaseModalOpen(true);
        setIsImportModalOpen(false);

      } catch (err: any) {
        console.error("CSV import error:", err);
        setImportError(err.message || "Failed to read CSV. Check column headers and format.");
      }
    };
    reader.readAsText(file);
  };

  const handleGoogleSheetImport = async () => {
    if (!googleSheetUrl) {
      setImportError("Please enter a Google Sheet/Folder URL or ID.");
      return;
    }

    setIsImportingFromGoogle(true);
    setImportError("");
    setImportSuccess("");
    setGooglePatientsList([]);
    setGoogleFolderFiles([]);

    try {
      const res = await fetch("/api/import-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urlOrId: googleSheetUrl })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load Drive resource. Please check the URL/ID and permissions.");
      }

      if (data.isFolder) {
        if (data.files && data.files.length > 0) {
          setGoogleFolderFiles(data.files);
          setImportSuccess(`Connected to Google Drive folder! Found ${data.files.length} patient files. Click any file below to import.`);
        } else {
          throw new Error("No files found in the specified Google Drive folder.");
        }
      } else {
        if (data.patients && data.patients.length > 0) {
          setGooglePatientsList(data.patients);
          setImportSuccess(`Successfully retrieved ${data.patients.length} patient records from Google Sheet! Select a patient below to import.`);
          
          // If only 1 patient, auto-select
          if (data.patients.length === 1) {
            selectPatientForImport(data.patients[0]);
          }
        } else {
          throw new Error("No patients found in the specified sheet.");
        }
      }
    } catch (err: any) {
      console.error(err);
      setImportError(err.message || "Error importing from Google Sheets.");
    } finally {
      setIsImportingFromGoogle(false);
    }
  };

  const loadGoogleSheetFile = async (fileId: string) => {
    setIsImportingFromGoogle(true);
    setImportError("");
    setImportSuccess("");
    setGooglePatientsList([]);

    try {
      const res = await fetch("/api/import-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urlOrId: fileId })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load file. Ensure the file contains valid patient headers.");
      }

      if (data.patients && data.patients.length > 0) {
        setGooglePatientsList(data.patients);
        setImportSuccess(`Successfully retrieved ${data.patients.length} patient records from file! Select a patient below.`);
        
        // If only 1 patient, auto-select
        if (data.patients.length === 1) {
          selectPatientForImport(data.patients[0]);
        }
      } else {
        throw new Error("No patients found in the selected sheet.");
      }
    } catch (err: any) {
      console.error(err);
      setImportError(err.message || "Error parsing selected file.");
    } finally {
      setIsImportingFromGoogle(false);
    }
  };

  const handleMedicalFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzingFile(true);
    setImportError("");
    setImportSuccess("");

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const resultStr = event.target?.result as string;
          const base64Data = resultStr.split(",")[1];
          
          const res = await fetch("/api/import-file", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileData: base64Data,
              mimeType: file.type || "application/octet-stream",
              fileName: file.name
            })
          });

          const data = await res.json();
          if (!res.ok || !data.success) {
            throw new Error(data.message || "Failed to analyze file with AI.");
          }

          if (data.patient) {
            setImportSuccess(`AI successfully extracted patient information for '${data.patient.name}'! Opening New Case Form...`);
            selectPatientForImport(data.patient);
          } else {
            throw new Error("AI did not return any patient details.");
          }
        } catch (err: any) {
          console.error(err);
          setImportError(err.message || "Error analyzing file with AI.");
        } finally {
          setIsAnalyzingFile(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error(err);
      setImportError("Failed to read the local file.");
      setIsAnalyzingFile(false);
    }
  };

  const handleWorkspaceLinkClick = async (
    e: React.MouseEvent<HTMLAnchorElement>,
    patient: Patient,
    type: "folder" | "sheet"
  ) => {
    const currentUrl = type === "folder" ? patient.folderUrl : patient.sheetUrl;
    const isMockUrl = !currentUrl || currentUrl.includes("mock-") || currentUrl.includes("/mock");
    
    if (isMockUrl) {
      e.preventDefault();
      setIsProvisioningWorkspace(true);
      setProvisioningPatientName(patient.name);
      
      try {
        const res = await fetch("/api/provision-workspace", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: patient.id,
            name: patient.name,
            age: patient.age,
            gender: patient.gender,
            phone: patient.phone,
            email: patient.email,
            location: patient.location,
            complaint: patient.complaint,
            careLevel: patient.careLevel,
            durationText: patient.durationText,
            finalPrice: patient.finalPrice
          })
        });
        
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to provision workspace");
        }
        
        const targetUrl = type === "folder" ? data.folderUrl : data.sheetUrl;
        
        if (data.isMock) {
          alert(`Operating in Mock Mode (No Google API credentials configured).\n\nRedirecting to folder:\n${targetUrl}`);
        }
        // Open the URL in a new tab (real URL or parent folder URL fallback)
        window.open(targetUrl, "_blank", "noopener,noreferrer");
      } catch (err: any) {
        console.error(err);
        alert(`Failed to create Google Drive workspace: ${err.message || err}`);
      } finally {
        setIsProvisioningWorkspace(false);
        setProvisioningPatientName("");
      }
    }
  };

  const handleMockLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    if (!url || url.includes("mock-") || url.includes("/mock")) {
      e.preventDefault();
      alert(`Operating in Mock Mode (No Google API credentials configured).\n\nRedirecting to folder:\nhttps://drive.google.com/drive/folders/1UR6te8zTdXsrtsWhiuDnhpBGZPx4_Mkb?usp=share_link`);
      window.open("https://drive.google.com/drive/folders/1UR6te8zTdXsrtsWhiuDnhpBGZPx4_Mkb?usp=share_link", "_blank", "noopener,noreferrer");
    }
  };

  const selectPatientForImport = (patient: any) => {
    // Prefill new case taking form
    setNewCaseForm({
      name: patient.name,
      age: patient.age || "30",
      gender: patient.gender || "Male",
      phone: patient.phone || "",
      email: patient.email || "",
      city: patient.city || "",
      state: patient.state || "",
      country: "India",
      complaint: patient.complaint,
      careLevel: "⚡ Standard Chronic Care",
      durationText: "1-Month Consultation",
      finalPrice: 7500
    });

    // Parse rubrics if present (e.g. "GERD (3); bloating (2)")
    if (patient.rubrics) {
      const parsedRubricsList: Array<{ rubric: Rubric; grade: number }> = [];
      const rubricEntries = patient.rubrics.split(";");

      rubricEntries.forEach((entry: string) => {
        const match = entry.match(/(.+)\((\d)\)/);
        if (match) {
          const rubricQuery = match[1].trim().toLowerCase();
          const rubricGrade = Number(match[2].trim());

          const foundRubric = REPERTORY_DATA.find(
            r => r.name.toLowerCase().includes(rubricQuery) || rubricQuery.includes(r.name.toLowerCase())
          );

          if (foundRubric) {
            parsedRubricsList.push({ rubric: foundRubric, grade: rubricGrade });
          }
        }
      });

      if (parsedRubricsList.length > 0) {
        setSelectedRubrics(parsedRubricsList);
        setImportSuccess(`Imported case for '${patient.name}' with ${parsedRubricsList.length} matched rubrics populated in Repertory grid!`);
      } else {
        setImportSuccess(`Imported patient details for '${patient.name}' (demographics prefilled, no rubrics matched).`);
      }
    } else {
      setImportSuccess(`Imported patient demographics for '${patient.name}' successfully. You can now verify and save this case!`);
    }

    // Open new case and close import modals
    setIsNewCaseModalOpen(true);
    setIsImportModalOpen(false);
    // Clear temp states
    setGooglePatientsList([]);
    setGoogleSheetUrl("");
  };

  // Assign doctor to a patient (Admin only)
  const assignDoctor = async (patientId: string, doctorUid: string) => {
    try {
      const patientRef = doc(db, "patients", patientId);
      await updateDoc(patientRef, { assignedDoctor: doctorUid });
    } catch (err) {
      console.error("Failed to update doctor assignment in Firestore:", err);
      // Fallback local update
      const updated = patients.map((p) => {
        if (p.id === patientId) {
          return { ...p, assignedDoctor: doctorUid };
        }
        return p;
      });
      setPatients(updated);
    }
  };

  // Rubrics filtration
  const filteredRubrics = REPERTORY_DATA.filter((r) => {
    const inChapter = r.chapter === selectedChapter;
    if (!rubricSearch) return inChapter;
    return inChapter && r.name.toLowerCase().includes(rubricSearch.toLowerCase());
  });

  // Add Rubric to active list
  const addRubric = (rubric: Rubric) => {
    if (selectedRubrics.some((item) => item.rubric.id === rubric.id)) return;
    setSelectedRubrics([...selectedRubrics, { rubric, grade: 3 }]); // default grade 3
  };

  // Remove Rubric from active list
  const removeRubric = (id: string) => {
    setSelectedRubrics(selectedRubrics.filter((item) => item.rubric.id !== id));
  };

  // Change rubric grade
  const updateGrade = (id: string, grade: number) => {
    setSelectedRubrics(
      selectedRubrics.map((item) => {
        if (item.rubric.id === id) {
          return { ...item, grade };
        }
        return item;
      })
    );
  };

  // Calculate Repertorization Grid results
  useEffect(() => {
    if (selectedRubrics.length === 0) {
      setRemedyColumns([]);
      setRemedyScores([]);
      return;
    }

    // 1. Gather all remedies matching the selected rubrics
    const remedyList: Record<string, { coverage: number; score: number }> = {};

    selectedRubrics.forEach(({ rubric, grade: userWeight }) => {
      Object.entries(rubric.remedies).forEach(([remedy, remGrade]) => {
        // If remedy is contraindicated (-1), skip or penalize
        if (remGrade < 0) return;

        if (!remedyList[remedy]) {
          remedyList[remedy] = { coverage: 0, score: 0 };
        }
        remedyList[remedy].coverage += 1;
        // Score: remedy grade * patient symptom grade (userWeight)
        remedyList[remedy].score += remGrade * userWeight;
      });
    });

    // 2. Format scores
    const calculatedScores = Object.entries(remedyList).map(([remedy, stats]) => {
      return {
        remedy,
        coverage: `${stats.coverage}/${selectedRubrics.length}`,
        score: stats.score
      };
    });

    // 3. Sort by score (descending) then coverage (descending)
    calculatedScores.sort((a, b) => b.score - a.score || parseInt(b.coverage) - parseInt(a.coverage));

    // 4. Update state with top remedies (max 10 columns for visualization)
    const topRemedies = calculatedScores.slice(0, 10);
    setRemedyColumns(topRemedies.map((s) => s.remedy));
    setRemedyScores(topRemedies);
  }, [selectedRubrics]);

  // Pre-fill active rubrics and complaint based on patient selection
  const handleSelectPatientForAnalysis = (patientId: string) => {
    setSelectedPatientId(patientId);
    const pat = patients.find((p) => p.id === patientId);
    if (!pat) return;

    setCustomComplaint(pat.complaint);
    
    // Load previously exported AI analysis report if it exists
    if ((pat as any).aiReport) {
      setAiReport((pat as any).aiReport);
    } else {
      setAiReport("");
    }
    
    // Clear and auto-populate some relevant rubrics based on keywords
    setSelectedRubrics([]);
    const matched: Array<{ rubric: Rubric; grade: number }> = [];
    
    // Simple rule-based rubric mapping for demo context
    const complaintLower = pat.complaint.toLowerCase();
    
    REPERTORY_DATA.forEach((rubric) => {
      const keywords = rubric.name.toLowerCase().replace(/,/g, "").split(" ");
      const matchesKeyword = keywords.some(
        (kw) => kw.length > 3 && complaintLower.includes(kw)
      );
      if (matchesKeyword && matched.length < 5) {
        matched.push({ rubric, grade: 3 });
      }
    });

    if (matched.length > 0) {
      setSelectedRubrics(matched);
    }
  };

  // Run AI Medical Brain Diagnostics
  const handleQueryAi = async () => {
    setIsAiLoading(true);
    setAiReport("");
    setSaveStatus("");

    try {
      const patientInfo = selectedPatientId
        ? patients.find((p) => p.id === selectedPatientId)
        : {
            name: "Constitutional Mapping Case",
            age: "N/A",
            gender: "N/A",
            complaint: customComplaint || "Custom symptoms analyzed via Repertory Hub",
            careLevel: "Single Consult Assessment"
          };

      const rubricPayload = selectedRubrics.map((r) => ({
        chapter: r.rubric.chapter,
        name: r.rubric.name,
        grade: r.grade
      }));

      const gridPayload = remedyScores.map((res) => ({
        remedyName: res.remedy,
        fullName: REMEDIES_METADATA[res.remedy]?.fullName || res.remedy,
        coverage: res.coverage,
        score: res.score
      }));

      const res = await fetch("/api/ai-diagnostics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientInfo,
          rubrics: rubricPayload,
          repertorizationResults: gridPayload
        })
      });

      const data = await res.json();
      if (data.success) {
        setAiReport(data.analysis);
      } else {
        throw new Error(data.message || "Failed to fetch response");
      }
    } catch (err: any) {
      setAiReport(`### System Alert: AI Medical Brain Unavailable
Failed to compute live comparative diagnostics. Please check internet connection or backend key configurations.

**Error Details:**
${err.message || err}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Save/Export Analysis to patient record
  const handleExportAnalysis = async () => {
    if (!selectedPatientId || !aiReport) return;
    setSaveStatus("exporting");
    
    try {
      const response = await fetch("/api/export-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId: selectedPatientId, aiReport })
      });
      const data = await response.json();
      if (data.success) {
        setSaveStatus("success");
      } else {
        throw new Error(data.message || "Failed to export");
      }
    } catch (err) {
      console.error("Failed to export AI analysis:", err);
      setSaveStatus("error");
    } finally {
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-pearl">
      
      {/* Dashboard Top Header */}
      <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-900/5 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200/50 flex items-center justify-center shadow-sm breathe">
            <Activity className="w-5 h-5 text-mint" />
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold text-[#1A2421] leading-none mb-1">Clinical Portal</h1>
            <span className="text-[10px] text-mint font-bold uppercase tracking-wider">
              {session?.role === "admin" ? "Master Control Panel (Admin)" : "Junior Medical Officer Panel"}
            </span>
          </div>
        </div>

        {/* User profile & Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-[#1A2421]">{session?.name}</span>
            <span className="text-[9px] text-slate-400 font-semibold">{session?.email}</span>
          </div>

          <div className="h-8 w-px bg-slate-900/5 hidden sm:block" />

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-full text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/50 text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Panel Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6 select-text">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-900/5 gap-2">
          <button
            onClick={() => setActiveTab("patients")}
            className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "patients"
                ? "border-mint text-mint-dark"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            <Users className="w-4 h-4" />
            Patient Records & Workspace
          </button>

          <button
            onClick={() => setActiveTab("repertory")}
            className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "repertory"
                ? "border-mint text-mint-dark"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            <Brain className="w-4 h-4" />
            Repertory & AI Lab
          </button>

          <button
            onClick={() => {
              setActiveTab("materia-medica");
              setSelectedBook(null);
              setSelectedRemedy(null);
            }}
            className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "materia-medica"
                ? "border-mint text-mint-dark"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Materia Medica
          </button>

          {session?.role === "admin" && (
            <button
              onClick={() => setActiveTab("team")}
              className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "team"
                  ? "border-mint text-mint-dark"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              <Settings className="w-4 h-4" />
              Staff Directory
            </button>
          )}
        </div>

        {/* Tab Views */}
        <div className="flex-1 min-h-0">
          
          {/* TAB 1: Patients List */}
          {activeTab === "patients" && (
            <div className="space-y-6">
              
              {/* Search & Action Buttons Header */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:max-w-md">
                  <input
                    type="text"
                    placeholder="Search patients by name, ID, symptoms or city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 focus:border-mint focus:ring-1 focus:ring-mint outline-none rounded-2xl bg-white text-xs font-medium text-[#1A2421]"
                  />
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto flex-wrap sm:flex-nowrap">
                  <button
                    onClick={() => {
                      setCaseCreationSuccess(false);
                      setCaseCreationError("");
                      setIsNewCaseModalOpen(true);
                    }}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-full bg-mint text-white text-xs font-bold uppercase tracking-wider transition-all hover:bg-mint-dark shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Case Taking</span>
                  </button>

                  <button
                    onClick={() => {
                      setImportError("");
                      setImportSuccess("");
                      setIsImportModalOpen(true);
                    }}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-full border border-slate-200 hover:border-slate-800 text-slate-800 text-xs font-bold uppercase tracking-wider transition-all bg-white shadow-sm cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-slate-500" />
                    <span>Import Patients (XLSX / Google Sheet)</span>
                  </button>

                  <div className="text-[10px] text-slate-500 font-semibold bg-slate-900/5 px-4 py-2.5 rounded-xl border border-slate-900/5 whitespace-nowrap">
                    Showing <strong>{filteredPatients.length}</strong> cases
                  </div>
                </div>
              </div>

              {/* Patients Grid */}
              <div className="grid grid-cols-1 gap-4">
                {filteredPatients.length === 0 ? (
                  <div className="glass-panel p-12 text-center rounded-[28px] border-white/60">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-800">No Patient Files Found</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      There are no registered cases matching your search criteria or assigned files.
                    </p>
                  </div>
                ) : (
                  filteredPatients.map((patient) => (
                    <motion.div
                      key={patient.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-panel rounded-3xl border-white/60 p-6 md:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:shadow-[0_10px_25px_rgba(20,184,166,0.02)] transition-all"
                    >
                      {/* Name & Basic Profile */}
                      <div className="space-y-2 flex-grow max-w-xl">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-[#1A2421]">{patient.name}</h3>
                          <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-900/5 border border-slate-900/5 text-slate-600">
                            {patient.id}
                          </span>
                          <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-mint/10 border border-mint/20 text-mint-dark">
                            {patient.careLevel}
                          </span>
                        </div>
                        
                        <p className="text-xs font-semibold text-slate-700">
                          <strong>Profile:</strong> {patient.age} Y/O · {patient.gender} · {patient.location}
                        </p>
                        
                        <p className="text-xs font-semibold text-slate-800 bg-[#FAF9F6] p-3.5 rounded-2xl border border-slate-900/5 leading-relaxed">
                          <strong>Chief Complaint:</strong> {patient.complaint}
                        </p>
                      </div>

                      {/* Staff & Assignment */}
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">
                          Assigned Clinician
                        </span>
                        {session?.role === "admin" ? (
                          <select
                            value={patient.assignedDoctor}
                            onChange={(e) => assignDoctor(patient.id, e.target.value)}
                            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-mint"
                          >
                            <option value="unassigned">Unassigned (OPD Queue)</option>
                            <option value="doctor-bypass-id">Dr. Sarah (Junior)</option>
                            <option value="admin-bypass-id">Dr. Narayan Jethwani</option>
                          </select>
                        ) : (
                          <span className="font-bold text-slate-800 bg-mint/5 px-3 py-1.5 rounded-xl border border-mint/10 inline-block">
                            {patient.assignedDoctor === "unassigned" ? "Queue" : "Assigned to You"}
                          </span>
                        )}
                        <span className="text-[9px] text-slate-400 font-semibold mt-1">
                          Registered: {new Date(patient.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Google Drive Services Actions */}
                      <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap sm:flex-nowrap">
                        {/* Repertory Quick Action */}
                        <button
                          onClick={() => {
                            setActiveTab("repertory");
                            handleSelectPatientForAnalysis(patient.id);
                          }}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4.5 py-3 rounded-full bg-mint text-white text-xs font-bold uppercase tracking-wider transition-all hover:bg-mint-dark shadow-sm cursor-pointer"
                        >
                          <Brain className="w-4 h-4" />
                          <span>Repertorise Case</span>
                        </button>

                        {/* Google Folder Link */}
                        <a
                          href={patient.folderUrl}
                          onClick={(e) => handleWorkspaceLinkClick(e, patient, "folder")}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-3 rounded-full border border-slate-200 hover:border-slate-800 text-slate-800 text-xs font-bold uppercase tracking-wider transition-all bg-white shadow-sm cursor-pointer"
                        >
                          <Folder className="w-4 h-4 text-amber-500" />
                          <span>Patient Folder</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                        </a>

                        {/* Google Clinical Sheet Link */}
                        <a
                          href={patient.sheetUrl}
                          onClick={(e) => handleWorkspaceLinkClick(e, patient, "sheet")}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-3 rounded-full border border-slate-200 hover:border-slate-800 text-slate-800 text-xs font-bold uppercase tracking-wider transition-all bg-white shadow-sm cursor-pointer"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                          <span>Clinical Sheet</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                        </a>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* TAB 2: AI Repertory Lab */}
          {activeTab === "repertory" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Segment (4 cols): Search and select rubrics */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="glass-panel rounded-3xl border-white/60 p-6 space-y-5">
                  <h3 className="text-sm font-bold text-[#1A2421] uppercase tracking-wider flex items-center gap-2 border-b border-slate-900/5 pb-3">
                    <Sliders className="w-4.5 h-4.5 text-mint" />
                    Repertory Selection
                  </h3>

                  {/* Patient selection link */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Active Case File
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={selectedPatientId}
                        onChange={(e) => handleSelectPatientForAnalysis(e.target.value)}
                        className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs outline-none focus:border-mint"
                      >
                        <option value="">Custom Workspace (No Patient Linked)</option>
                        {patients.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.id})
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          setImportError("");
                          setImportSuccess("");
                          setIsImportModalOpen(true);
                        }}
                        className="px-3 border border-slate-200 hover:border-slate-800 rounded-2xl bg-white hover:bg-slate-50 flex items-center justify-center cursor-pointer transition-colors"
                        title="Import Patients (XLSX / Google Sheet)"
                      >
                        <Upload className="w-4 h-4 text-slate-500" />
                      </button>
                    </div>
                  </div>

                  {/* Chapter Select */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Kentian Chapter
                    </label>
                    <select
                      value={selectedChapter}
                      onChange={(e) => setSelectedChapter(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs outline-none focus:border-mint"
                    >
                      {REPERTORY_CHAPTERS.map((ch) => (
                        <option key={ch} value={ch}>
                          {ch}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Rubric Search Input */}
                  <div className="relative">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Search Rubrics
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Type symptom keywords..."
                        value={rubricSearch}
                        onChange={(e) => setRubricSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-slate-200 focus:border-mint focus:ring-1 focus:ring-mint outline-none rounded-2xl bg-white text-xs font-medium"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Rubrics results list */}
                  <div 
                    data-lenis-prevent
                    className="space-y-2 max-h-[220px] overflow-y-auto border border-slate-900/5 rounded-2xl p-2 bg-white/40"
                  >
                    {filteredRubrics.length === 0 ? (
                      <p className="text-[10px] text-slate-400 text-center py-4">No matching rubrics in this chapter</p>
                    ) : (
                      filteredRubrics.map((rub) => (
                        <button
                          key={rub.id}
                          onClick={() => addRubric(rub)}
                          className="w-full text-left p-2.5 rounded-xl text-xs hover:bg-mint/5 hover:text-mint-dark font-medium transition-all flex items-center justify-between group cursor-pointer border border-transparent hover:border-mint/20"
                        >
                          <span className="truncate">{rub.name}</span>
                          <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Selected Rubrics Panel */}
                <div className="glass-panel rounded-3xl border-white/60 p-6 flex-1 flex flex-col">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
                    Selected Symptom Rubrics ({selectedRubrics.length})
                  </h3>

                  <div 
                    data-lenis-prevent
                    className="space-y-3 flex-1 overflow-y-auto max-h-[300px]"
                  >
                    {selectedRubrics.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 rounded-2xl">
                        <Sliders className="w-8 h-8 text-slate-300 mb-2" />
                        <p className="text-[10px] font-bold text-slate-700">No symptoms selected yet</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">Click rubrics above to begin calculations.</p>
                      </div>
                    ) : (
                      selectedRubrics.map(({ rubric, grade }) => (
                        <div
                          key={rubric.id}
                          className="flex items-center justify-between p-3 rounded-2xl border border-slate-900/5 bg-[#FAF9F6]"
                        >
                          <div className="max-w-[60%]">
                            <span className="text-[8px] text-mint uppercase font-bold tracking-wide block">
                              {rubric.chapter.split(" ")[0]}
                            </span>
                            <span className="text-xs font-semibold text-slate-800 truncate block">{rubric.name}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {/* Intensity Grade picker */}
                            <select
                              value={grade}
                              onChange={(e) => updateGrade(rubric.id, Number(e.target.value))}
                              className="bg-white border border-slate-200 rounded-lg py-1 px-1.5 text-[10px] font-bold text-[#1A2421]"
                            >
                              <option value="1">Mild (1)</option>
                              <option value="2">Moderate (2)</option>
                              <option value="3">Severe (3)</option>
                            </select>

                            <button
                              onClick={() => removeRubric(rubric.id)}
                              className="p-1 hover:text-rose-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right Segment (8 cols): Repertorization Grid & AI Diagnostic */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* Repertorization Grid (Kent's Chart) */}
                <div className="glass-panel rounded-3xl border-white/60 p-6 space-y-4">
                  <h3 className="text-sm font-bold text-[#1A2421] uppercase tracking-wider flex items-center gap-2 border-b border-slate-900/5 pb-3">
                    <Activity className="w-4.5 h-4.5 text-mint" />
                    Radar Opus Repertorization Grid (Top Remedy Computations)
                  </h3>

                  {selectedRubrics.length === 0 ? (
                    <div className="p-12 text-center border border-slate-200/50 rounded-2xl">
                      <p className="text-xs font-bold text-slate-700">Repertorization Grid Inactive</p>
                      <p className="text-[10px] text-slate-400 mt-1">Please select symptom rubrics on the left panel to populate the grid.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-slate-900/5 rounded-2xl bg-white shadow-sm">
                      <table className="w-full border-collapse text-left text-xs">
                        <thead>
                          <tr className="bg-slate-900/5 border-b border-slate-900/5 text-[9px] font-extrabold uppercase text-slate-700 tracking-wider">
                            <th className="p-4 min-w-[200px]">Selected Rubrics</th>
                            <th className="p-4 text-center">Intensity</th>
                            {remedyColumns.map((rem) => (
                              <th key={rem} className="p-4 text-center border-l border-slate-900/5 hover:bg-slate-900/5 cursor-pointer" title={REMEDIES_METADATA[rem]?.fullName}>
                                <div className="font-bold text-mint-dark">{rem}</div>
                                <div className="text-[7px] text-slate-400 normal-case font-medium">{REMEDIES_METADATA[rem]?.source}</div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900/5 font-semibold text-slate-800">
                          {selectedRubrics.map(({ rubric, grade: userGrade }) => (
                            <tr key={rubric.id} className="hover:bg-[#FAF9F6] transition-colors">
                              <td className="p-4 text-xs font-bold">
                                <span className="text-[8px] text-slate-400 block font-normal">{rubric.chapter}</span>
                                {rubric.name}
                              </td>
                              <td className="p-4 text-center">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  userGrade === 3 ? "bg-rose-50 text-rose-700 border border-rose-100" :
                                  userGrade === 2 ? "bg-amber-50 text-amber-700 border border-amber-100" :
                                  "bg-slate-50 text-slate-700 border border-slate-100"
                                }`}>
                                  {userGrade}
                                </span>
                              </td>
                              {remedyColumns.map((rem) => {
                                const remGrade = rubric.remedies[rem];
                                return (
                                  <td key={rem} className="p-4 text-center border-l border-slate-900/5 font-mono font-bold">
                                    {remGrade ? (
                                      <span className={`${
                                        remGrade === 3 ? "text-rose-600 font-extrabold" :
                                        remGrade === 2 ? "text-[#0F766E] italic" :
                                        "text-slate-700 font-normal"
                                      }`}>
                                        {remGrade}
                                      </span>
                                    ) : (
                                      <span className="text-slate-300">-</span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                          
                          {/* Totals Row: Coverage */}
                          <tr className="bg-slate-900/5 border-t-2 border-slate-900/10 text-[10px] font-extrabold uppercase text-slate-700">
                            <td className="p-4">Symptom Coverage</td>
                            <td className="p-4"></td>
                            {remedyColumns.map((rem) => {
                              const scoreObj = remedyScores.find((r) => r.remedy === rem);
                              return (
                                <td key={rem} className="p-4 text-center border-l border-slate-900/5 font-mono text-xs">
                                  {scoreObj?.coverage || "0"}
                                </td>
                              );
                            })}
                          </tr>

                          {/* Totals Row: Sum of Grades */}
                          <tr className="bg-[#FAF9F6] border-t border-slate-900/5 text-[10px] font-extrabold uppercase text-[#1A2421]">
                            <td className="p-4">Sum of Grades</td>
                            <td className="p-4"></td>
                            {remedyColumns.map((rem) => {
                              const scoreObj = remedyScores.find((r) => r.remedy === rem);
                              return (
                                <td key={rem} className="p-4 text-center border-l border-slate-900/5 font-mono text-sm text-[#0F766E]">
                                  {scoreObj?.score || 0}
                                </td>
                              );
                            })}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* AI Diagnostics Hub */}
                <div className="glass-panel rounded-3xl border-white/60 p-6 space-y-4 flex-grow flex flex-col">
                  <div className="flex items-center justify-between border-b border-slate-900/5 pb-3">
                    <h3 className="text-sm font-bold text-[#1A2421] uppercase tracking-wider flex items-center gap-2">
                      <Brain className="w-4.5 h-4.5 text-mint" />
                      AI Diagnostic Brain (Gemini 3.5 Clinical Synthesis)
                    </h3>

                    {selectedPatientId && aiReport && (
                      <button
                        onClick={handleExportAnalysis}
                        disabled={saveStatus === "exporting"}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-[#0F766E] text-[#0F766E] hover:bg-[#0F766E]/5 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer disabled:opacity-50"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{saveStatus === "exporting" ? "Exporting..." : saveStatus === "success" ? "Exported!" : "Export to Patient Sheet"}</span>
                      </button>
                    )}
                  </div>

                  {/* Complaint description review */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Case Analysis Symptoms & Constitutional Profile
                    </label>
                    <textarea
                      value={customComplaint}
                      onChange={(e) => setCustomComplaint(e.target.value)}
                      rows={3}
                      placeholder="Compile patient complaint details here to direct the AI analysis..."
                      className="w-full p-4 border border-slate-200 focus:border-mint outline-none rounded-2xl bg-white text-xs font-semibold"
                    />
                  </div>

                  {/* Trigger AI Button */}
                  <div className="flex justify-start">
                    <button
                      onClick={handleQueryAi}
                      disabled={isAiLoading || selectedRubrics.length === 0}
                      className={`px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-500 inline-flex items-center gap-2 shadow-sm ${
                        selectedRubrics.length > 0 && !isAiLoading
                          ? "bg-mint text-white hover:bg-mint-dark hover:shadow-md cursor-pointer"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                      }`}
                    >
                      {isAiLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Synthesizing Case...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Query AI Medical Brain</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Diagnostics Report Output */}
                  <div data-lenis-prevent className="flex-1 min-h-[250px] border border-slate-900/5 rounded-3xl p-6 bg-white/40 overflow-y-auto max-h-[400px]">
                    {isAiLoading ? (
                      <div className="h-full flex flex-col items-center justify-center py-10 space-y-4">
                        <div className="w-10 h-10 rounded-full border-2 border-mint border-t-transparent animate-spin" />
                        <p className="text-xs font-bold text-slate-700">AI Medical Brain is calculating remedy differentials...</p>
                        <p className="text-[10px] text-slate-400">Performing posology analysis & cross-checking Kent rubrics</p>
                      </div>
                    ) : aiReport ? (
                      <div className="prose prose-xs text-xs font-semibold text-slate-800 leading-relaxed whitespace-pre-line space-y-4 select-text">
                        {aiReport}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center py-10">
                        <Brain className="w-10 h-10 text-slate-300 mb-2" />
                        <p className="text-xs font-bold text-slate-700">Awaiting Consultation Query</p>
                        <p className="text-[10px] text-slate-400 mt-1 max-w-xs">
                          Select rubrics and click &quot;Query AI Medical Brain&quot; to synthesize clinical potencies, posology, and remedy differences.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: Staff Management (Admin Only) */}
          {activeTab === "team" && session?.role === "admin" && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-900/5 pb-3">
                <h3 className="text-sm font-bold text-[#1A2421] uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4.5 h-4.5 text-mint" />
                  Junior Doctors Directory
                </h3>

                <button className="flex items-center gap-1.5 px-4 py-2 bg-mint text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-mint-dark cursor-pointer shadow-sm">
                  <UserPlus className="w-4 h-4" />
                  <span>Invite New Doctor</span>
                </button>
              </div>

              {/* Staff Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Doctor 1 */}
                <div className="glass-panel border-white/60 p-6 rounded-3xl flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-mint/10 border border-mint/20 flex items-center justify-center text-xs font-bold text-mint-dark">
                        DS
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1A2421] leading-none mb-1">Dr. Sarah (Junior)</h4>
                        <span className="text-[9px] text-slate-400 font-semibold">Joined: Dec 2025</span>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-slate-700">
                      <strong>Access Scope:</strong> Assigned patient folders only.
                    </p>
                    <p className="text-[10px] text-[#0F766E] font-bold">
                      Currently managing <strong>2 cases</strong>
                    </p>
                  </div>
                  
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Authorized
                  </span>
                </div>

                {/* Doctor 2 */}
                <div className="glass-panel border-white/60 p-6 rounded-3xl flex items-center justify-between opacity-75">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                        DM
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1A2421] leading-none mb-1">Dr. Maneesh (Intern)</h4>
                        <span className="text-[9px] text-slate-400 font-semibold">Joined: Feb 2026</span>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-slate-700">
                      <strong>Access Scope:</strong> Read-only to assigned records.
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold">
                      Currently managing <strong>0 cases</strong>
                    </p>
                  </div>
                  
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                    Pending Verification
                  </span>
                </div>

              </div>

              {/* Secure Rules Warning */}
              <div className="p-5 border border-white/60 bg-amber-50/50 rounded-2xl flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 font-semibold leading-relaxed">
                  <strong className="text-amber-800 uppercase tracking-wide block mb-1">Firebase Cloud Security Rules Enforced</strong>
                  All directory listings and file requests are audited server-side. Junior doctors are barred from access to folders outside of their explicitly delegated patients (folders not inside their assigned scope return HTTP 403 Forbidden).
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: Materia Medica & Knowledge Hub */}
          {activeTab === "materia-medica" && (
            <div className="space-y-8 animate-fadeIn">
              {!selectedBook ? (
                // 1. Classical Books Library Grid View
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="font-serif text-2xl font-bold text-[#1A2421]">Materia Medica & Classical Knowledge Hub</h2>
                    <p className="text-xs font-semibold text-slate-500 max-w-2xl leading-relaxed">
                      Explore classical homeopathic textbooks from the pioneers of homeopathic science. Search, browse by letter, and study remedy characteristics directly from your clinic workspace.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {MATERIA_MEDICA_BOOKS.map((book) => (
                      <div
                        key={book.id}
                        className="glass-panel rounded-[32px] border-white/60 overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 group"
                      >
                        {/* Vintage Book Cover Style Header */}
                        <div className={`relative h-48 bg-gradient-to-br ${book.coverBg} p-6 flex flex-col justify-between border-b ${book.borderColor} overflow-hidden shadow-inner`}>
                          {/* Book bind overlay edge */}
                          <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/15 border-r border-white/10" />
                          <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-white/5" />
                          
                          <div className="flex justify-between items-start pl-3">
                            <span className={`px-2 py-0.5 text-[8.5px] font-extrabold uppercase rounded tracking-wider ${book.badgeBg} ${book.badgeText}`}>
                              {book.year}
                            </span>
                            <Book className="w-4 h-4 text-white/40" />
                          </div>

                          <div className="pl-3 mt-4">
                            <h3 className="font-serif text-sm md:text-base font-bold text-white leading-snug line-clamp-3 group-hover:text-mint transition-colors">
                              {book.title}
                            </h3>
                            <span className="text-[10px] text-slate-300 font-extrabold uppercase tracking-wider block mt-1.5">
                              {book.author}
                            </span>
                          </div>
                        </div>

                        {/* Card Description */}
                        <div className="p-6 flex flex-col flex-1 bg-white/30 backdrop-blur-md rounded-b-[32px] border border-t-0 border-white/60 shadow-sm">
                          <p className="text-xs font-medium text-slate-600 leading-relaxed mb-6 flex-grow line-clamp-4">
                            {book.description}
                          </p>

                          <div className="space-y-3">
                            <button
                              onClick={() => handleSelectBook(book)}
                              className="w-full text-center py-2.5 rounded-full bg-mint hover:bg-mint-dark text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>Open Reference</span>
                            </button>

                            <a
                              href={book.wikipediaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-1 text-[9px] text-slate-400 hover:text-slate-700 font-bold tracking-wider uppercase transition-colors"
                            >
                              <span>About Author (Wiki)</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // 2. Book Detail View (Remedy Index & Reading Pane)
                <div className="space-y-6">
                  {/* Top Book Header bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900/5 pb-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedBook(null)}
                        className="flex items-center justify-center gap-1 px-3.5 py-2 border border-slate-200 hover:border-slate-800 text-slate-800 text-xs font-bold uppercase tracking-wider transition-all bg-white rounded-full shadow-sm cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Library</span>
                      </button>
                      <div>
                        <h2 className="font-serif text-lg md:text-xl font-bold text-[#1A2421] leading-none mb-1">
                          {selectedBook.title}
                        </h2>
                        <span className="text-[10px] text-mint font-bold uppercase tracking-wider">
                          By {selectedBook.author} · Published {selectedBook.year}
                        </span>
                      </div>
                    </div>

                    <a
                      href={`https://www.materiamedica.info/en/materia-medica/${selectedBook.id}/index`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 px-3.5 py-2 border border-slate-250 hover:border-slate-850 rounded-full text-slate-500 hover:text-slate-800 text-[10px] font-bold tracking-wider uppercase transition-all bg-white shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      <span>Original Link</span>
                    </a>
                  </div>

                  {/* Main Grid: Remedies Index on Left, Reader on Right */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    
                    {/* Index Panel (4 cols) */}
                    <div className="lg:col-span-4 flex flex-col gap-5">
                      <div className="glass-panel rounded-3xl border-white/60 p-5 space-y-4 flex flex-col max-h-[700px]">
                        
                        {/* Search Remedies */}
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search remedies..."
                            value={remedySearchTerm}
                            onChange={(e) => setRemedySearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 focus:border-mint outline-none rounded-xl bg-white text-xs font-semibold text-[#1A2421]"
                          />
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>

                        {/* Quick Letters Jump Box */}
                        <div className="flex flex-wrap gap-1 p-2 rounded-xl bg-slate-900/5 border border-slate-950/5">
                          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => {
                            // Verify if there are any remedies starting with this letter
                            const hasRemedies = remedies.some((r) => r.name.trim().toLowerCase().startsWith(letter.toLowerCase()));
                            return (
                              <button
                                key={letter}
                                onClick={() => handleJumpToLetter(letter)}
                                disabled={!hasRemedies}
                                className={`w-5 h-5 flex items-center justify-center text-[9px] font-bold rounded transition-all cursor-pointer ${
                                  hasRemedies
                                    ? "text-[#1A2421] hover:bg-mint hover:text-white"
                                    : "text-slate-350 cursor-not-allowed opacity-40"
                                }`}
                              >
                                {letter}
                              </button>
                            );
                          })}
                        </div>

                        {/* Remedies Scrollable Box */}
                        <div 
                          data-lenis-prevent
                          className="flex-1 overflow-y-auto pr-1 space-y-1 bg-white/40 border border-slate-900/5 rounded-2xl p-2 min-h-[300px]"
                        >
                          {isRemediesLoading ? (
                            <div className="h-full flex flex-col items-center justify-center py-12 space-y-2">
                              <div className="w-6 h-6 border-2 border-mint border-t-transparent rounded-full animate-spin" />
                              <span className="text-[10px] font-bold text-slate-500">Loading Index...</span>
                            </div>
                          ) : remediesFetchError ? (
                            <div className="text-center py-8 px-4 text-rose-700 text-xs font-semibold">
                              {remediesFetchError}
                            </div>
                          ) : (() => {
                            const filtered = remedies.filter((r) =>
                              r.name.toLowerCase().includes(remedySearchTerm.toLowerCase())
                            );

                            if (filtered.length === 0) {
                              return (
                                <p className="text-[10px] text-slate-400 text-center py-6">
                                  No remedies found matching search term.
                                </p>
                              );
                            }

                            // Keep track of letters to insert division header labels
                            let lastLetter = "";

                            return filtered.map((rem, idx) => {
                              const firstChar = rem.name.trim().charAt(0).toUpperCase();
                              const isFirstOfLetter = firstChar !== lastLetter && /[A-Z]/.test(firstChar);
                              if (isFirstOfLetter) {
                                lastLetter = firstChar;
                              }

                              return (
                                <div key={rem.path + idx} className="space-y-1">
                                  {isFirstOfLetter && (
                                    <div
                                      id={`remedy-letter-${firstChar.toLowerCase()}`}
                                      className="text-[9px] font-extrabold text-mint bg-mint/5 border-y border-mint/10 py-1 px-2.5 uppercase tracking-widest rounded-md select-none mt-2 first:mt-0"
                                    >
                                      {firstChar}
                                    </div>
                                  )}
                                  <button
                                    onClick={() => handleSelectRemedy(rem.path)}
                                    className={`w-full text-left py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                      selectedRemedy?.path === rem.path
                                        ? "bg-mint text-white border-mint shadow-sm"
                                        : "bg-white/70 border-transparent hover:bg-white text-slate-800"
                                    }`}
                                  >
                                    {rem.name}
                                  </button>
                                </div>
                              );
                            });
                          })()}
                        </div>

                      </div>
                    </div>

                    {/* Reading Panel (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col gap-5">
                      <div className="glass-panel rounded-3xl border-white/60 p-6 flex-1 flex flex-col min-h-[450px]">
                        
                        {isRemedyLoading ? (
                          // Remedy Loading State
                          <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                            <div className="w-10 h-10 border-2 border-mint border-t-transparent rounded-full animate-spin" />
                            <h4 className="text-xs font-bold text-slate-700">Fetching Remedy Provings...</h4>
                            <p className="text-[10px] text-slate-400">Querying dynamic database & rendering classical text</p>
                          </div>
                        ) : remedyFetchError ? (
                          // Remedy Fetch Error State
                          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                            <ShieldAlert className="w-8 h-8 text-rose-500 mb-2" />
                            <h4 className="text-xs font-bold text-rose-800">Connection Failed</h4>
                            <p className="text-[10px] text-slate-505 max-w-sm mt-1">
                              {remedyFetchError}
                            </p>
                          </div>
                        ) : selectedRemedy ? (
                          // Active E-Reader Panel View
                          <div className="flex-1 flex flex-col h-full space-y-4">
                            
                            {/* Reader Toolbar options */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900/5 pb-3">
                              <h3 className="font-serif text-base font-bold text-[#1A2421]">
                                {selectedRemedy.title}
                              </h3>

                              {/* Tools: font scale & theme */}
                              <div className="flex items-center gap-4 flex-wrap">
                                
                                {/* Theme picker */}
                                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/5 border border-slate-900/5">
                                  <button
                                    onClick={() => setReaderTheme("light")}
                                    className={`px-2.5 py-1 text-[9px] font-bold uppercase rounded-lg transition-colors cursor-pointer ${
                                      readerTheme === "light"
                                        ? "bg-white text-slate-800 shadow-sm"
                                        : "text-slate-450 hover:text-slate-700"
                                    }`}
                                  >
                                    Light
                                  </button>
                                  <button
                                    onClick={() => setReaderTheme("sepia")}
                                    className={`px-2.5 py-1 text-[9px] font-bold uppercase rounded-lg transition-colors cursor-pointer ${
                                      readerTheme === "sepia"
                                        ? "bg-[#FAF7F0] text-[#3E301F] shadow-sm border border-[#E5DFC9]"
                                        : "text-slate-450 hover:text-[#3E301F]"
                                    }`}
                                  >
                                    Sepia
                                  </button>
                                  <button
                                    onClick={() => setReaderTheme("dark")}
                                    className={`px-2.5 py-1 text-[9px] font-bold uppercase rounded-lg transition-colors cursor-pointer ${
                                      readerTheme === "dark"
                                        ? "bg-[#090D10] text-[#C5D0CD] shadow-sm"
                                        : "text-slate-450 hover:text-slate-200"
                                    }`}
                                  >
                                    Dark
                                  </button>
                                </div>

                                {/* Font scale */}
                                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/5 border border-slate-900/5">
                                  <button
                                    onClick={() => {
                                      const scales: Array<"sm"|"base"|"lg"|"xl"|"2xl"> = ["sm", "base", "lg", "xl", "2xl"];
                                      const idx = scales.indexOf(readerFontSize);
                                      if (idx > 0) setReaderFontSize(scales[idx - 1]);
                                    }}
                                    className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[#1A2421] hover:bg-white rounded-lg cursor-pointer"
                                    title="Decrease Text Size"
                                  >
                                    A-
                                  </button>
                                  <span className="text-[10px] font-extrabold text-slate-400 uppercase w-8 text-center">
                                    Size
                                  </span>
                                  <button
                                    onClick={() => {
                                      const scales: Array<"sm"|"base"|"lg"|"xl"|"2xl"> = ["sm", "base", "lg", "xl", "2xl"];
                                      const idx = scales.indexOf(readerFontSize);
                                      if (idx < scales.length - 1) setReaderFontSize(scales[idx + 1]);
                                    }}
                                    className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[#1A2421] hover:bg-white rounded-lg cursor-pointer"
                                    title="Increase Text Size"
                                  >
                                    A+
                                  </button>
                                </div>

                                {/* Fullscreen Mode Toggle */}
                                <button
                                  onClick={() => setIsReaderFullscreen(true)}
                                  className="p-1.5 flex items-center justify-center text-[#1A2421] hover:bg-[#1A2421]/5 rounded-xl border border-slate-900/5 transition-colors cursor-pointer bg-white"
                                  title="Fullscreen Mode"
                                >
                                  <Maximize2 className="w-4 h-4" />
                                </button>

                              </div>
                            </div>

                            {/* Main Scrollable text area */}
                            <div
                              data-lenis-prevent
                              className={`flex-1 p-6 sm:p-8 rounded-3xl border shadow-sm overflow-y-auto max-h-[500px] font-serif leading-relaxed space-y-4 select-text transition-colors duration-300 ${
                                readerTheme === "sepia"
                                  ? "bg-[#FAF7F0] text-[#3E301F] border-[#E5DFC9] raw-proving-text"
                                  : readerTheme === "dark"
                                  ? "bg-[#090D10] text-[#C5D0CD] border-slate-900 raw-proving-text"
                                  : "bg-white text-slate-800 border-slate-200 raw-proving-text"
                              }`}
                              style={{
                                fontSize:
                                  readerFontSize === "sm" ? "13px" :
                                  readerFontSize === "base" ? "15px" :
                                  readerFontSize === "lg" ? "18px" :
                                  readerFontSize === "xl" ? "21px" : "24px"
                              }}
                              dangerouslySetInnerHTML={{ __html: selectedRemedy.content }}
                            />

                            <div className="text-[10px] text-slate-400 font-semibold text-right italic">
                              * Sourced from free library at materiamedica.info. Provided without warranty.
                            </div>

                          </div>
                        ) : (
                          // E-Reader Blank state
                          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4 border border-dashed border-slate-200 rounded-3xl">
                            <BookOpen className="w-12 h-12 text-slate-300 breathe" />
                            <div>
                              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">No Active Proving Loaded</h4>
                              <p className="text-[10.5px] text-slate-400 mt-1 max-w-sm leading-relaxed">
                                Select a remedy from the list on the left to pull clinical pathogenesy, modalities, and posology notes in the reader pane.
                              </p>
                            </div>
                            
                            <div className="pt-2">
                              <div className="w-32 h-44 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl shadow-md p-4 flex flex-col justify-between text-left select-none relative overflow-hidden opacity-60">
                                <div className="absolute left-0 top-0 bottom-0 w-2 bg-black/20 border-r border-white/5" />
                                <span className="text-[7px] text-slate-500 font-extrabold uppercase tracking-widest">{selectedBook.year}</span>
                                <h5 className="font-serif text-[10px] font-bold text-slate-100 leading-tight mt-2 line-clamp-3">{selectedBook.title}</h5>
                                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block mt-auto">{selectedBook.author}</span>
                              </div>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

        {/* 1. New Case Taking Modal */}
        <AnimatePresence>
          {isNewCaseModalOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  if (!isCreatingCase) setIsNewCaseModalOpen(false);
                }}
                className="fixed inset-0 bg-slate-900/20 backdrop-blur-md z-50 pointer-events-auto"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                data-lenis-prevent
                className="fixed inset-0 m-auto max-w-2xl w-full p-6 md:p-8 bg-[#FAF9F6]/95 border border-white/60 z-[51] shadow-2xl rounded-[36px] flex flex-col pointer-events-auto max-h-[85vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-900/5 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-mint animate-pulse" />
                    <div>
                      <h3 className="text-lg font-bold text-[#1A2421]">New Clinical Case Entry</h3>
                      <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Demographics & Consultation Details</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsNewCaseModalOpen(false)}
                    disabled={isCreatingCase}
                    className="w-8 h-8 rounded-full border border-slate-200 hover:border-slate-800 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
                  >
                    ×
                  </button>
                </div>

                {caseCreationSuccess ? (
                  // Success State
                  <div className="text-center py-8 space-y-6">
                    <div className="w-16 h-16 rounded-full bg-mint/10 border border-mint/20 flex items-center justify-center mx-auto breathe">
                      <CheckCircle className="w-8 h-8 text-mint" />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-serif text-2xl font-bold text-[#1A2421]">Case Sync Complete</h4>
                      <p className="text-xs text-slate-700 font-semibold max-w-md mx-auto leading-relaxed">
                        Google Workspace automation completed successfully. Patient files are generated and linked.
                      </p>
                    </div>

                    {/* Google Service Links */}
                    <div className="glass-panel border-white/50 p-6 rounded-2xl max-w-md w-full mx-auto text-left space-y-3 shadow-sm bg-white/40">
                      <div className="flex items-center gap-1.5 text-xs text-[#0F766E] font-extrabold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" />
                        Patient Workspace Coordinates
                      </div>
                      <div className="flex gap-3 pt-1">
                        <a
                          href={createdFolderUrl}
                          onClick={(e) => handleMockLinkClick(e, createdFolderUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-850 text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 bg-white transition-colors cursor-pointer shadow-sm"
                        >
                          <Folder className="w-4 h-4 text-amber-500" />
                          Folder Link
                        </a>
                        <a
                          href={createdSheetUrl}
                          onClick={(e) => handleMockLinkClick(e, createdSheetUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-855 text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 bg-white transition-colors cursor-pointer shadow-sm"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                          Clinical Sheet
                        </a>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-center gap-3">
                      <button
                        onClick={() => {
                          setIsNewCaseModalOpen(false);
                          setCaseCreationSuccess(false);
                        }}
                        className="px-6 py-2.5 rounded-full bg-mint text-white text-xs font-bold uppercase tracking-wider hover:bg-mint-dark cursor-pointer transition-colors shadow-sm"
                      >
                        Close & View Patient
                      </button>
                    </div>
                  </div>
                ) : (
                  // Form State
                  <form onSubmit={handleCreateCase} className="space-y-5">
                    {caseCreationError && (
                      <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-2.5 text-rose-800 text-xs font-semibold leading-relaxed">
                        <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                        <span>{caseCreationError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-2">Patient Full Name</label>
                        <input
                          type="text"
                          value={newCaseForm.name}
                          onChange={(e) => setNewCaseForm({ ...newCaseForm, name: e.target.value })}
                          placeholder="Rajesh Kumar"
                          className="w-full p-3 border border-slate-200 focus:border-mint outline-none rounded-xl bg-white text-xs font-medium text-[#1A2421]"
                          required
                        />
                      </div>

                      {/* Age & Gender */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-2">Age</label>
                          <input
                            type="number"
                            value={newCaseForm.age}
                            onChange={(e) => setNewCaseForm({ ...newCaseForm, age: e.target.value })}
                            placeholder="45"
                            className="w-full p-3 border border-slate-200 focus:border-mint outline-none rounded-xl bg-white text-xs font-medium text-[#1A2421]"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-2">Gender</label>
                          <select
                            value={newCaseForm.gender}
                            onChange={(e) => setNewCaseForm({ ...newCaseForm, gender: e.target.value })}
                            className="w-full p-3 border border-slate-200 focus:border-mint outline-none rounded-xl bg-white text-xs font-semibold text-[#1A2421]"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Contact */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-2">Contact Phone</label>
                        <input
                          type="tel"
                          value={newCaseForm.phone}
                          onChange={(e) => setNewCaseForm({ ...newCaseForm, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full p-3 border border-slate-200 focus:border-mint outline-none rounded-xl bg-white text-xs font-medium text-[#1A2421]"
                          required
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
                        <input
                          type="email"
                          value={newCaseForm.email}
                          onChange={(e) => setNewCaseForm({ ...newCaseForm, email: e.target.value })}
                          placeholder="rajesh@gmail.com"
                          className="w-full p-3 border border-slate-200 focus:border-mint outline-none rounded-xl bg-white text-xs font-medium text-[#1A2421]"
                          required
                        />
                      </div>

                      {/* Location City / State */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-2">City</label>
                          <input
                            type="text"
                            value={newCaseForm.city}
                            onChange={(e) => setNewCaseForm({ ...newCaseForm, city: e.target.value })}
                            placeholder="Mumbai"
                            className="w-full p-3 border border-slate-200 focus:border-mint outline-none rounded-xl bg-white text-xs font-medium text-[#1A2421]"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-2">State</label>
                          <input
                            type="text"
                            value={newCaseForm.state}
                            onChange={(e) => setNewCaseForm({ ...newCaseForm, state: e.target.value })}
                            placeholder="Maharashtra"
                            className="w-full p-3 border border-slate-200 focus:border-mint outline-none rounded-xl bg-white text-xs font-medium text-[#1A2421]"
                            required
                          />
                        </div>
                      </div>

                      {/* Care Level Selector */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-2">Care Level</label>
                        <select
                          value={newCaseForm.careLevel}
                          onChange={(e) => handleCareLevelChange(e.target.value)}
                          className="w-full p-3 border border-slate-200 focus:border-mint outline-none rounded-xl bg-white text-xs font-semibold text-[#1A2421]"
                        >
                          <option value="🌱 Acute & Wellness Care">🌱 Acute & Wellness Care (₹3,500/mo)</option>
                          <option value="⚡ Standard Chronic Care">⚡ Standard Chronic Care (₹7,500/mo)</option>
                          <option value="🎯 Deep Systemic Care">🎯 Deep Systemic Care (₹12,500/mo)</option>
                          <option value="🫁 Advanced Pathological Care">🫁 Advanced Pathological Care (₹18,500/mo)</option>
                          <option value="🔮 Multisystem Integrative Care">🔮 Multisystem Integrative Care (₹25,000/mo)</option>
                        </select>
                      </div>
                    </div>

                    {/* Chief Complaint */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-2">Chief Complaint & Case Notes</label>
                      <textarea
                        value={newCaseForm.complaint}
                        onChange={(e) => setNewCaseForm({ ...newCaseForm, complaint: e.target.value })}
                        placeholder="Detail the constitutional features, emotional/physical aggregates, modalities, and symptom history..."
                        rows={4}
                        className="w-full p-3 border border-slate-200 focus:border-mint outline-none rounded-xl bg-white text-xs font-medium text-[#1A2421] resize-none"
                        required
                      />
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-4 border-t border-slate-900/5 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsNewCaseModalOpen(false)}
                        disabled={isCreatingCase}
                        className="px-6 py-2.5 rounded-full border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={isCreatingCase}
                        className="px-6 py-2.5 rounded-full bg-mint text-white text-xs font-bold uppercase tracking-wider hover:bg-mint-dark transition-all disabled:opacity-50 inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        {isCreatingCase ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Creating Workspace...</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Create Patient Record</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 2. Import CSV Modal */}
        <AnimatePresence>
          {isImportModalOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsImportModalOpen(false)}
                className="fixed inset-0 bg-slate-900/20 backdrop-blur-md z-50 pointer-events-auto"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                data-lenis-prevent
                className="fixed inset-0 m-auto max-w-md w-full p-6 md:p-8 bg-[#FAF9F6]/95 border border-white/60 z-[51] shadow-2xl rounded-[36px] flex flex-col pointer-events-auto max-h-[80vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-900/5 pb-4 mb-5">
                  <div className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-mint" />
                    <div>
                      <h3 className="text-base font-bold text-[#1A2421]">Import Patients (XLSX / Google Sheet / Drive)</h3>
                      <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Import Existing Patients List</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsImportModalOpen(false)}
                    className="w-8 h-8 rounded-full border border-slate-200 hover:border-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Import Method Toggle */}
                  <div className="flex gap-1.5 p-1 bg-slate-900/5 rounded-2xl border border-slate-900/5 mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        setImportMethod("file");
                        setImportError("");
                        setImportSuccess("");
                        setGooglePatientsList([]);
                        setGoogleFolderFiles([]);
                      }}
                      className={`flex-1 py-2 text-center text-[10px] font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                        importMethod === "file"
                          ? "bg-white text-slate-800 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Local Sheet
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImportMethod("google");
                        setImportError("");
                        setImportSuccess("");
                        setGooglePatientsList([]);
                        setGoogleFolderFiles([]);
                      }}
                      className={`flex-1 py-2 text-center text-[10px] font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                        importMethod === "google"
                          ? "bg-white text-slate-800 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Google Drive
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImportMethod("ai");
                        setImportError("");
                        setImportSuccess("");
                        setGooglePatientsList([]);
                        setGoogleFolderFiles([]);
                      }}
                      className={`flex-1 py-2 text-center text-[10px] font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                        importMethod === "ai"
                          ? "bg-white text-slate-800 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      AI File Scan
                    </button>
                  </div>

                  {importError && (
                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-2.5 text-rose-800 text-xs font-semibold leading-relaxed">
                      <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                      <span>{importError}</span>
                    </div>
                  )}

                  {importSuccess && (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-2.5 text-emerald-800 text-xs font-semibold leading-relaxed">
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{importSuccess}</span>
                    </div>
                  )}

                  {importMethod === "file" ? (
                    <>
                      {/* CSV Template Guide */}
                      <div className="p-4 rounded-2xl border border-slate-900/5 bg-white/40 space-y-2 text-xs font-semibold">
                        <span className="text-[10px] text-slate-700 font-extrabold uppercase tracking-wider block">CSV Columns Mapping Schema</span>
                        <p className="text-[10.5px] text-slate-700 leading-normal">
                          The uploader will automatically map case variables from the first data row. Keep column headers matching these titles:
                        </p>
                        <code className="block p-2 bg-slate-900/5 border border-slate-900/5 rounded font-mono text-[9px] text-slate-700 overflow-x-auto whitespace-nowrap">
                          name, age, gender, email, phone, city, state, complaint, rubrics
                        </code>
                        <p className="text-[9.5px] text-slate-400 italic font-medium">
                          * Rubrics field format: semicolon-separated keywords with intensity weights like `GERD (3); Anxiety (2)`.
                        </p>
                      </div>

                      {/* File Upload Trigger */}
                      <div className="relative border-2 border-dashed border-slate-200 hover:border-mint rounded-2xl p-6 text-center cursor-pointer transition-colors hover:bg-mint/5 group">
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleCSVImport}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Upload className="w-8 h-8 text-slate-400 group-hover:text-mint mx-auto mb-2 transition-colors" />
                        <span className="block text-xs font-bold text-slate-800">Choose Exported Patient CSV File</span>
                        <span className="block text-[9.5px] text-slate-400 font-semibold mt-0.5">Drag & drop or browse your local file</span>
                      </div>
                    </>
                  ) : importMethod === "google" ? (
                    <>
                      {/* Google Sheets Guide */}
                      <div className="p-4 rounded-2xl border border-slate-900/5 bg-white/40 space-y-2 text-xs font-semibold">
                        <span className="text-[10px] text-slate-700 font-extrabold uppercase tracking-wider block">Google Drive & Sheets Sync Setup</span>
                        <p className="text-[10.5px] text-slate-700 leading-normal">
                          Share your Google Sheet or Google Drive folder with the clinic's Service Account email below (with <strong>Viewer</strong> access), or set access to <strong>"Anyone with the link can view"</strong>:
                        </p>
                        <div className="flex items-center gap-1.5 p-2 bg-slate-900/5 border border-slate-900/5 rounded">
                          <code className="block font-mono text-[9px] text-slate-700 overflow-x-auto whitespace-nowrap select-all flex-1">
                            {serviceAccountEmail || "homeo-healthcare-service-acc@clinic-portal.iam.gserviceaccount.com"}
                          </code>
                          <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(serviceAccountEmail || "homeo-healthcare-service-acc@clinic-portal.iam.gserviceaccount.com")}
                            className="text-[9px] uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600 hover:text-slate-800 font-bold active:scale-95 transition-transform cursor-pointer"
                            title="Copy email"
                          >
                            Copy
                          </button>
                        </div>
                        <p className="text-[9.5px] text-slate-400 font-medium">
                          Note: You can paste a <strong>Folder URL</strong> (lists all files inside) or a <strong>Sheet URL</strong>.
                        </p>
                      </div>

                      {/* Google Sheet URL Input */}
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Google Drive Folder / Spreadsheet ID or URL
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={googleSheetUrl}
                            onChange={(e) => setGoogleSheetUrl(e.target.value)}
                            placeholder="https://drive.google.com/drive/folders/... or Sheet link"
                            className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-xs outline-none focus:border-mint"
                          />
                          <button
                            type="button"
                            onClick={handleGoogleSheetImport}
                            disabled={isImportingFromGoogle || !googleSheetUrl}
                            className="px-4 py-2.5 rounded-2xl bg-[#1A2421] hover:bg-slate-800 text-white text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            {isImportingFromGoogle ? "Syncing..." : "Sync Drive"}
                          </button>
                        </div>
                      </div>

                      {/* Google Drive Folder File Selection */}
                      {googleFolderFiles.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-slate-900/5">
                          <span className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">
                            Files in Google Drive Folder ({googleFolderFiles.length} Found)
                          </span>
                          <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 select-none" data-lenis-prevent="true">
                            {googleFolderFiles.map((file, idx) => (
                              <div
                                key={file.id || idx}
                                onClick={() => loadGoogleSheetFile(file.id)}
                                className="p-3 bg-white hover:bg-mint/5 border border-slate-200 hover:border-mint/30 rounded-2xl cursor-pointer transition-all flex justify-between items-center group"
                              >
                                <div className="flex flex-col gap-0.5 flex-1 min-w-0 pr-2">
                                  <span className="text-xs font-bold text-slate-800 group-hover:text-mint transition-colors truncate">
                                    {file.name}
                                  </span>
                                  <span className="text-[9px] text-slate-400 font-semibold truncate">
                                    {file.mimeType.includes("spreadsheet") || file.mimeType.includes("sheet") ? "📊 Spreadsheet" : "📄 Document"}
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-500 group-hover:underline shrink-0 font-semibold">
                                  Load File
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Google Sheets Patient List Selection */}
                      {googlePatientsList.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-slate-900/5">
                          <span className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">
                            Select Patient to Import ({googlePatientsList.length} Found)
                          </span>
                          <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 select-none" data-lenis-prevent="true">
                            {googlePatientsList.map((pat, idx) => (
                              <div
                                key={idx}
                                onClick={() => selectPatientForImport(pat)}
                                className="p-3 bg-white hover:bg-mint/5 border border-slate-200 hover:border-mint/30 rounded-2xl cursor-pointer transition-all flex flex-col gap-0.5 group"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-bold text-slate-800 group-hover:text-mint transition-colors">
                                    {pat.name}
                                  </span>
                                  <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">
                                    {pat.gender} • {pat.age} yrs
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-400 line-clamp-1">
                                  {pat.complaint}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* AI Document Scan Instructions */}
                      <div className="p-4 rounded-2xl border border-slate-900/5 bg-white/40 space-y-2 text-xs font-semibold">
                        <span className="text-[10px] text-slate-700 font-extrabold uppercase tracking-wider block">AI Medical Document Scan</span>
                        <p className="text-[10.5px] text-slate-700 leading-normal">
                          Upload any local clinical record, case history notes, PDF, Word document (DOCX), plain text, or even a photo/screenshot of a case file. The Medical AI will parse and prefill all demographics and symptom rubrics automatically!
                        </p>
                      </div>

                      {/* File Upload Trigger */}
                      <div className="relative border-2 border-dashed border-slate-200 hover:border-mint rounded-2xl p-6 text-center cursor-pointer transition-colors hover:bg-mint/5 group">
                        <input
                          type="file"
                          accept=".txt,.pdf,.docx,.png,.jpg,.jpeg"
                          onChange={handleMedicalFileImport}
                          disabled={isAnalyzingFile}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        {isAnalyzingFile ? (
                          <div className="space-y-2 py-2">
                            <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-mint animate-spin mx-auto"></div>
                            <span className="block text-xs font-bold text-slate-800">Analyzing Document with AI...</span>
                            <span className="block text-[9.5px] text-slate-400 font-semibold mt-0.5">Extracting patient details and clinical history</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-slate-400 group-hover:text-mint mx-auto mb-2 transition-colors" />
                            <span className="block text-xs font-bold text-slate-800">Choose Case Document or Image</span>
                            <span className="block text-[9.5px] text-slate-400 font-semibold mt-0.5">Supports PDF, DOCX, Text, and Photos</span>
                          </>
                        )}
                      </div>
                    </>
                  )}

                  <div className="pt-3 border-t border-slate-900/5 flex justify-end">
                    <button
                      onClick={() => setIsImportModalOpen(false)}
                      className="px-6 py-2 rounded-full border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Fullscreen Materia Medica E-Reader Modal */}
        <AnimatePresence>
          {isReaderFullscreen && selectedRemedy && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className={`fixed inset-0 z-[60] flex flex-col pointer-events-auto overflow-hidden ${
                readerTheme === "sepia"
                  ? "bg-[#FAF7F0] text-[#3E301F]"
                  : readerTheme === "dark"
                  ? "bg-[#090D10] text-[#C5D0CD]"
                  : "bg-white text-slate-850"
              }`}
            >
              {/* Fullscreen Header */}
              <div 
                className={`p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-300 ${
                  readerTheme === "sepia"
                    ? "border-[#E5DFC9] bg-[#F7F3E8]"
                    : readerTheme === "dark"
                    ? "border-slate-900 bg-[#0c1216]"
                    : "border-slate-100 bg-slate-50"
                }`}
              >
                <div>
                  <span className="text-[10px] uppercase font-extrabold tracking-widest text-mint">
                    {selectedBook?.title || "Materia Medica"}
                  </span>
                  <h2 className="font-serif text-lg font-bold leading-tight mt-0.5">
                    {selectedRemedy.title}
                  </h2>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Theme Selector */}
                  <div className={`flex items-center gap-1.5 p-1 rounded-xl transition-colors duration-300 ${
                    readerTheme === "sepia"
                      ? "bg-slate-900/5 border border-slate-900/5"
                      : readerTheme === "dark"
                      ? "bg-white/5 border border-white/5"
                      : "bg-slate-900/5 border border-slate-900/5"
                  }`}>
                    <button
                      onClick={() => setReaderTheme("light")}
                      className={`px-3 py-1.5 text-[9px] font-extrabold uppercase rounded-lg transition-all cursor-pointer ${
                        readerTheme === "light"
                          ? "bg-white text-slate-850 shadow-sm border border-slate-200"
                          : "text-slate-450 hover:text-slate-700"
                      }`}
                    >
                      Light
                    </button>
                    <button
                      onClick={() => setReaderTheme("sepia")}
                      className={`px-3 py-1.5 text-[9px] font-extrabold uppercase rounded-lg transition-all cursor-pointer ${
                        readerTheme === "sepia"
                          ? "bg-[#FAF7F0] text-[#3E301F] shadow-sm border border-[#E5DFC9]"
                          : "text-slate-450 hover:text-[#3E301F]"
                      }`}
                    >
                      Sepia
                    </button>
                    <button
                      onClick={() => setReaderTheme("dark")}
                      className={`px-3 py-1.5 text-[9px] font-extrabold uppercase rounded-lg transition-all cursor-pointer ${
                        readerTheme === "dark"
                          ? "bg-[#090D10] text-[#C5D0CD] shadow-sm"
                          : "text-slate-450 hover:text-slate-200"
                      }`}
                    >
                      Dark
                    </button>
                  </div>

                  {/* Font Scale Selector */}
                  <div className={`flex items-center gap-1.5 p-1 rounded-xl transition-colors duration-300 ${
                    readerTheme === "sepia"
                      ? "bg-slate-900/5 border border-slate-900/5"
                      : readerTheme === "dark"
                      ? "bg-white/5 border border-white/5"
                      : "bg-slate-900/5 border border-slate-900/5"
                  }`}>
                    <button
                      onClick={() => {
                        const scales: Array<"sm"|"base"|"lg"|"xl"|"2xl"> = ["sm", "base", "lg", "xl", "2xl"];
                        const idx = scales.indexOf(readerFontSize);
                        if (idx > 0) setReaderFontSize(scales[idx - 1]);
                      }}
                      className="w-7 h-7 flex items-center justify-center text-xs font-bold hover:bg-white/20 rounded-lg cursor-pointer transition-colors"
                      title="Decrease Text Size"
                    >
                      A-
                    </button>
                    <span className="text-[10px] font-extrabold uppercase w-8 text-center opacity-60">
                      Size
                    </span>
                    <button
                      onClick={() => {
                        const scales: Array<"sm"|"base"|"lg"|"xl"|"2xl"> = ["sm", "base", "lg", "xl", "2xl"];
                        const idx = scales.indexOf(readerFontSize);
                        if (idx < scales.length - 1) setReaderFontSize(scales[idx + 1]);
                      }}
                      className="w-7 h-7 flex items-center justify-center text-xs font-bold hover:bg-white/20 rounded-lg cursor-pointer transition-colors"
                      title="Increase Text Size"
                    >
                      A+
                    </button>
                  </div>

                  {/* Exit Fullscreen Button */}
                  <button
                    onClick={() => setIsReaderFullscreen(false)}
                    className={`px-4 py-2 border rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                      readerTheme === "sepia"
                        ? "border-[#E5DFC9] hover:border-slate-800 hover:bg-slate-900/5 text-[#3E301F]"
                        : readerTheme === "dark"
                        ? "border-slate-800 hover:border-slate-200 hover:bg-white/5 text-[#C5D0CD]"
                        : "border-slate-200 hover:border-slate-800 hover:bg-slate-900/5 text-slate-800"
                    }`}
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>Exit Fullscreen</span>
                  </button>
                </div>
              </div>

              {/* Fullscreen Reading Pane Content */}
              <div 
                data-lenis-prevent
                className="flex-1 overflow-y-auto p-8 md:p-16 select-text flex justify-center"
              >
                <div 
                  className="w-full max-w-3xl font-serif leading-relaxed space-y-6 text-justify pb-24 raw-proving-text"
                  style={{
                    fontSize:
                      readerFontSize === "sm" ? "14px" :
                      readerFontSize === "base" ? "17px" :
                      readerFontSize === "lg" ? "20px" :
                      readerFontSize === "xl" ? "23px" : "26px"
                  }}
                  dangerouslySetInnerHTML={{ __html: selectedRemedy.content }}
                />
              </div>

              {/* Fullscreen Footer */}
              <div 
                className={`p-4 text-[10px] text-center italic transition-colors duration-300 opacity-60 border-t ${
                  readerTheme === "sepia"
                    ? "border-[#E5DFC9] bg-[#F7F3E8]"
                    : readerTheme === "dark"
                    ? "border-slate-900 bg-[#0c1216]"
                    : "border-slate-100 bg-slate-50"
                }`}
              >
                * Sourced from free library at materiamedica.info. Provided without warranty.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Workspace Provisioning Loader Overlay */}
        {isProvisioningWorkspace && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center pointer-events-auto">
            <div className="bg-white p-8 rounded-[36px] max-w-sm w-full text-center space-y-4 border border-white/60 shadow-2xl">
              <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-mint animate-spin mx-auto"></div>
              <h3 className="text-base font-bold text-slate-800">Setting up Google Workspace</h3>
              <p className="text-xs text-slate-400 leading-normal font-semibold">
                Creating real Google Drive folder and clinical case sheet for <strong>{provisioningPatientName}</strong>. Please wait...
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  </div>
  );
}
