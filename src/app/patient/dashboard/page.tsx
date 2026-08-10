"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LogOut,
  Activity,
  User,
  FileSpreadsheet,
  Upload,
  ShieldAlert,
  CheckCircle,
  ClipboardList,
  Paperclip,
  MessageSquare,
  Lock,
  Sun,
  Moon,
  ChevronRight,
  Video,
  MessageCircle,
  RefreshCw
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface PatientProfile {
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
  folderUrl?: string;
  sheetUrl?: string;
  status: string;
  createdAt: string;
  patientInstructions?: string;
  showPatientInstructions?: boolean;
  internalPrescription?: string;
  doctorClinicalNotes?: string;
  showPrescriptionToPatient?: boolean;
  attachments?: { date: string; category: string; target: string; url: string }[];
  followupSubmissions?: { date: string; improvement: string; intensity: number; feedback: string }[];
}

interface Invoice {
  id: string;
  date: string;
  dueDate: string;
  grandTotal: number;
  status: string;
  previewUrl?: string;
  items: { description: string; qty: number; amount: number }[];
}

export default function PatientDashboard() {
  const router = useRouter();
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [patientRecord, setPatientRecord] = useState<PatientProfile | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isCheckingPortalLink, setIsCheckingPortalLink] = useState(false);

  // Follow-up form states
  const [followupImprovement, setFollowupImprovement] = useState("Slight Improvement");
  const [followupIntensity, setFollowupIntensity] = useState(5);
  const [followupFeedback, setFollowupFeedback] = useState("");
  const [followupSuccess, setFollowupSuccess] = useState("");
  const [isSubmittingFollowup, setIsSubmittingFollowup] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadPatientData(patientId: string) {
    try {
      // 1. Load patient profile
      const patientDoc = await getDoc(doc(db, "patients", patientId));
      if (patientDoc.exists()) {
        setPatientRecord(patientDoc.data() as PatientProfile);
      } else {
        // Fallback for mock local data
        if (patientId === "P-000001" || patientId.startsWith("P-")) {
          setPatientRecord({
            id: patientId,
            name: "Aarav Sharma",
            age: "34",
            gender: "Male",
            phone: "+91 98765 43210",
            email: "aarav.sharma@gmail.com",
            location: "Baner, Pune",
            complaint: "Chronic asthma with dry skin flare-ups in cold weather.",
            careLevel: "🌱 Focused Clinical Care",
            durationText: "3-Month Consultation",
            status: "active",
            createdAt: new Date().toISOString(),
            patientInstructions: "Take Remedy 1 twice daily on empty stomach. Avoid raw onions and strong coffee.",
            showPatientInstructions: true,
            internalPrescription: "Sulphur 200C - 1 Dose, followed by Sac Lac 30C.",
            showPrescriptionToPatient: false,
            attachments: [
              { date: "15-06-2026", category: "Lab Result", target: "IgE Blood Test Report.pdf", url: "#" },
              { date: "05-06-2026", category: "Imaging", target: "Chest X-Ray Snapshot.png", url: "#" }
            ],
            followupSubmissions: []
          });
        }
      }

      // 2. Load patient invoices
      try {
        const invoicesRef = collection(db, "invoices");
        const q = query(invoicesRef, where("patientId", "==", patientId));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const list: Invoice[] = [];
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as Invoice);
          });
          setInvoices(list);
        } else {
          // Mock invoices for offline testing
          setInvoices([
            {
              id: "INV-2026-001",
              date: "20-06-2026",
              dueDate: "30-06-2026",
              grandTotal: 6000,
              status: "Paid",
              previewUrl: `/admin/invoice-preview?invoiceNo=INV-2026-001`,
              items: [{ description: "Constitutional Care — 2-week confirmed care period", qty: 2, amount: 6000 }]
            }
          ]);
        }
      } catch (invoiceErr) {
        console.warn("Failed to load invoices from Firestore, using mock fallback:", invoiceErr);
        setInvoices([
          {
            id: "INV-2026-001",
            date: "20-06-2026",
            dueDate: "30-06-2026",
            grandTotal: 6000,
            status: "Paid",
            previewUrl: `/admin/invoice-preview?invoiceNo=INV-2026-001`,
            items: [{ description: "Constitutional Care — 2-week confirmed care period", qty: 2, amount: 6000 }]
          }
        ]);
      }
    } catch (err) {
      console.error("Failed to load patient records:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    // Establish auth observer
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Read local storage session state fallback
        const local = localStorage.getItem("patient_session");
        const parsed = local ? JSON.parse(local) : null;
        
        try {
          // Fetch firestore profile to get linked patientId
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const patientId = userData.patientId || "";
            const name = userData.name || user.email?.split("@")[0] || "Patient";
            
            setSessionUser({
              uid: user.uid,
              email: user.email,
              name,
              patientId
            });

            if (patientId) {
              await loadPatientData(patientId);
            } else {
              setIsLoading(false);
            }
          } else {
            // Local bypass mode or fresh session fallback
            if (parsed && parsed.uid.startsWith("mock-")) {
              setSessionUser(parsed);
              if (parsed.patientId) {
                await loadPatientData(parsed.patientId);
              } else {
                setIsLoading(false);
              }
            } else {
              setIsLoading(false);
            }
          }
        } catch (err) {
          console.error("Error verifying user session:", err);
          setIsLoading(false);
        }
      } else {
        // Checking if we operate in mock/bypass local mode
        const local = localStorage.getItem("patient_session");
        const parsed = local ? JSON.parse(local) : null;
        if (parsed && parsed.uid.startsWith("mock-")) {
          setSessionUser(parsed);
          if (parsed.patientId) {
            await loadPatientData(parsed.patientId);
          } else {
            setIsLoading(false);
          }
        } else {
          router.push("/patient/login");
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/patient/session", { method: "DELETE" });
      await auth.signOut().catch(() => null);
      localStorage.removeItem("patient_session");
      localStorage.removeItem("admin_session");
      window.location.href = "/patient/login";
    } catch (err) {
      console.error("Logout failed:", err);
      window.location.href = "/patient/login";
    }
  };

  const handleCheckPortalLink = async () => {
    setIsCheckingPortalLink(true);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        window.location.href = "/patient/login";
        return;
      }

      const idToken = await currentUser.getIdToken(true);
      const response = await fetch("/api/patient/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || "Unable to refresh portal approval status.");
      }

      window.location.reload();
    } catch (error) {
      console.error("Portal link status refresh failed:", error);
      window.alert(error instanceof Error ? error.message : "Unable to refresh portal approval status.");
      setIsCheckingPortalLink(false);
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
      localStorage.setItem("theme", "light");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setIsUploading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      // Read file as base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Str = (reader.result as string).split(",")[1];
        
        try {
          const res = await fetch("/api/patient/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              patientId: sessionUser.patientId,
              fileName: file.name,
              mimeType: file.type,
              fileData: base64Str
            })
          });

          const data = await res.json();
          if (data.success) {
            setUploadSuccess(`Uploaded '${file.name}' successfully!`);
            // Update UI record
            setPatientRecord(prev => {
              if (!prev) return null;
              return {
                ...prev,
                attachments: data.attachments || [data.attachment, ...(prev.attachments || [])]
              };
            });
          } else {
            setUploadError(data.message || "Failed to upload file.");
          }
        } catch (uploadErr: any) {
          setUploadError(uploadErr.message || "Error submitting upload API request.");
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error("Error parsing file:", err);
      setUploadError("Failed to parse file before upload.");
      setIsUploading(false);
    }
  };

  const handleFollowupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionUser.patientId || !patientRecord) return;

    setIsSubmittingFollowup(true);
    setFollowupSuccess("");

    const newSubmission = {
      date: new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" }),
      improvement: followupImprovement,
      intensity: followupIntensity,
      feedback: followupFeedback
    };

    const currentSubmissions = patientRecord.followupSubmissions || [];
    const updatedSubmissions = [newSubmission, ...currentSubmissions];

    try {
      // Save directly to Firestore patient document
      const patientRef = doc(db, "patients", sessionUser.patientId);
      await updateDoc(patientRef, {
        followupSubmissions: updatedSubmissions
      });

      setPatientRecord(prev => {
        if (!prev) return null;
        return {
          ...prev,
          followupSubmissions: updatedSubmissions
        };
      });

      setFollowupSuccess("Follow-up response submitted successfully to your doctor!");
      setFollowupFeedback("");
    } catch (err) {
      console.warn("Failed to write followup to Firestore, saving locally (offline demo mode):", err);
      setPatientRecord(prev => {
        if (!prev) return null;
        return {
          ...prev,
          followupSubmissions: updatedSubmissions
        };
      });
      setFollowupSuccess("Follow-up saved locally (offline mode).");
      setFollowupFeedback("");
    } finally {
      setIsSubmittingFollowup(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pearl dark:bg-slate-950 flex flex-col items-center justify-center gap-4">
        <Activity className="w-12 h-12 text-mint animate-pulse" />
        <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Synchronizing Patient Portal...</span>
      </div>
    );
  }

  // 1. Account Unlinked Welcome Panel
  if (sessionUser && !sessionUser.patientId) {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918446056789";
    const verificationMessage = [
      "Hello Dr. Narayan Jethwani / Homeo Healthcare team,",
      "I have registered for the patient portal and request identity verification and clinical record linking.",
      `Patient name: ${sessionUser.name || "Patient"}`,
      `Portal email: ${sessionUser.email || "Not available"}`,
      `Portal UID: ${sessionUser.uid}`,
      "I understand that I should not send medical records, prescriptions, passwords, or OTPs in this WhatsApp chat.",
    ].join("\n");

    return (
      <div className="min-h-screen bg-pearl dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="absolute top-28 right-6 md:right-12 z-50 flex items-center gap-3">
          <button
            onClick={toggleTheme}
            type="button"
            className="p-3 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 text-[#1A2421] dark:text-slate-100 hover:scale-105 transition-all shadow-md cursor-pointer"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-full border border-rose-200 hover:border-rose-600 hover:bg-rose-50 text-rose-600 text-xs font-bold uppercase transition-all bg-white dark:bg-slate-900 cursor-pointer shadow-md"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-8 md:p-12 rounded-[32px] border-white/60 shadow-[0_20px_50px_rgba(20,184,166,0.02)] max-w-lg w-full text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7 text-amber-500" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-bold text-[#1A2421] dark:text-slate-150">Case File Linking Required</h2>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Hello, <strong className="text-slate-800 dark:text-slate-200">{sessionUser.name}</strong>. Your patient account has been created successfully, but it is not linked to any clinical case file yet.
            </p>
          </div>

          <div className="bg-[#FAF9F6] dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-850 text-left space-y-3.5">
            <div className="text-xs">
              <span className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-0.5">Your Portal Credentials</span>
              <div className="font-semibold text-slate-700 dark:text-slate-350">
                Email: <span className="font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200">{sessionUser.email}</span>
              </div>
              <div className="font-semibold text-slate-700 dark:text-slate-350 mt-1">
                Portal UID: <span className="font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200">{sessionUser.uid}</span>
              </div>
            </div>

            <div className="text-xs border-t border-slate-200/65 dark:border-slate-800 pt-3 leading-relaxed text-slate-550 dark:text-slate-400 font-medium">
              <span className="block text-[10px] text-amber-600 font-extrabold uppercase tracking-widest mb-1">How to access your records?</span>
              Send the verification request below. Your doctor will confirm your identity and map this secure key to the correct clinical record.
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(verificationMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-emerald-700"
            >
              <MessageCircle className="h-4 w-4" />
              Send UID on WhatsApp
            </a>
            <button
              type="button"
              onClick={handleCheckPortalLink}
              disabled={isCheckingPortalLink}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-700 transition-all hover:border-mint hover:text-mint dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <RefreshCw className={`h-4 w-4 ${isCheckingPortalLink ? "animate-spin" : ""}`} />
              {isCheckingPortalLink ? "Checking..." : "Check Approval Status"}
            </button>
          </div>

          <p className="rounded-xl bg-emerald-50 px-4 py-3 text-[10px] font-semibold leading-5 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-200">
            The WhatsApp message includes only your name, portal email, and Portal UID. Do not add clinical records, prescriptions, passwords, or OTPs.
          </p>

          <p className="text-[10px] text-slate-400 font-semibold italic">Thank you for choosing Homeo Healthcare.</p>
        </motion.div>
      </div>
    );
  }

  // 2. Main Patient Dashboard View (Linked Profile)
  const profile = (patientRecord || {
    id: sessionUser?.patientId || "N/A",
    name: sessionUser?.name || "Patient",
    age: "N/A",
    gender: "N/A",
    phone: "N/A",
    email: sessionUser?.email || "N/A",
    location: "N/A",
    complaint: "N/A",
    careLevel: "N/A",
    durationText: "N/A",
    status: "N/A",
    createdAt: "N/A"
  }) as PatientProfile;

  return (
    <div className="min-h-screen bg-pearl dark:bg-slate-950 px-6 py-10 md:px-12 text-slate-800 dark:text-slate-200">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200/70 dark:border-slate-850 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-mint/10 border border-mint/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-mint" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-serif font-bold text-[#1A2421] dark:text-slate-100">{profile.name}</h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Patient Portal Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={toggleTheme}
            type="button"
            className="p-3 rounded-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 text-[#1A2421] dark:text-slate-100 hover:scale-105 transition-all shadow-sm cursor-pointer ml-auto md:ml-0"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-full border border-rose-200 hover:border-rose-600 hover:bg-rose-50/50 text-rose-600 text-xs font-bold uppercase transition-all bg-white dark:bg-slate-900 cursor-pointer shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Card & Invoices */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 rounded-[28px] border-white/60 space-y-4"
          >
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <User className="w-4 h-4 text-mint" />
              <h3 className="text-xs font-extrabold uppercase text-[#1A2421] dark:text-slate-150 tracking-wider">Demographic Profile</h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-900 font-semibold text-slate-700 dark:text-slate-350">
                <span>Patient ID</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">{profile.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-900 font-semibold text-slate-700 dark:text-slate-350">
                <span>Age / Gender</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{profile.age} Yrs · {profile.gender}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-900 font-semibold text-slate-700 dark:text-slate-350">
                <span>Phone Number</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{profile.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-900 font-semibold text-slate-700 dark:text-slate-350">
                <span>Email Address</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{profile.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-900 font-semibold text-slate-700 dark:text-slate-350">
                <span>Location</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{profile.location}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-900 font-semibold text-slate-700 dark:text-slate-350">
                <span>Care Program</span>
                <span className="font-bold text-mint-dark">{profile.careLevel}</span>
              </div>
            </div>

            <div className="bg-[#FAF9F6] dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 text-xs">
              <span className="font-bold text-[#1A2421] dark:text-slate-100 block mb-1">Registered complaint:</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-sans">{profile.complaint}</p>
            </div>
          </motion.div>

          {/* Invoices List */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 rounded-[28px] border-white/60 space-y-4"
          >
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <FileSpreadsheet className="w-4 h-4 text-mint" />
              <h3 className="text-xs font-extrabold uppercase text-[#1A2421] dark:text-slate-150 tracking-wider">Invoices & Bills</h3>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {invoices.length === 0 ? (
                <p className="text-xs text-slate-500 font-bold text-center py-4">No billing records found.</p>
              ) : (
                invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-3 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200/60 dark:border-slate-850 flex items-center justify-between text-xs hover:border-slate-300 dark:hover:border-slate-800 transition-all"
                  >
                    <div className="space-y-1">
                      <span className="font-bold font-mono text-slate-900 dark:text-slate-100 block">{inv.id}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">Date: {inv.date}</span>
                    </div>

                    <div className="text-right space-y-1">
                      <span className="font-bold block text-slate-950 dark:text-slate-50">₹{inv.grandTotal.toLocaleString("en-IN")}</span>
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                        inv.status === "Paid"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

        </div>

        {/* Right Column: Video Call, Instructions, Files, and Follow-up Submission */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Live Google Meet Video Call Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 md:p-8 rounded-[28px] bg-gradient-to-br from-emerald-900/90 via-slate-900 to-slate-950 text-white border border-emerald-500/30 shadow-[0_15px_35px_rgba(16,185,129,0.15)] relative overflow-hidden space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                    2-Way Live Video Consultation
                  </span>
                </div>
                <h3 className="text-lg font-serif font-bold text-white">
                  Join Google Meet Call with Dr. Jethwani
                </h3>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  Your appointment room is active. Click below to launch your 2-way remote video session.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const meetUrl = "https://meet.google.com/new";
                  window.open(meetUrl, "_blank");
                }}
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full font-extrabold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Video className="w-4 h-4 text-slate-950" />
                <span>Join Google Meet</span>
              </button>
            </div>
          </motion.div>

          {/* Instructions & Prescription Panel */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 md:p-8 rounded-[28px] border-white/60 space-y-6"
          >
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-4">
              <ClipboardList className="w-5 h-5 text-mint" />
              <h3 className="text-sm font-bold uppercase text-[#1A2421] dark:text-slate-100 tracking-wider">Active Treatment & Care Instructions</h3>
            </div>

            {/* Doctor approved instructions */}
            {profile.showPatientInstructions !== false && profile.patientInstructions ? (
              <div className="space-y-2.5">
                <span className="text-[10px] font-extrabold text-mint uppercase tracking-wider">Doctor-Approved Instructions</span>
                <p className="p-4 bg-emerald-50/20 border border-mint/20 text-xs font-semibold rounded-2xl leading-relaxed text-slate-700 dark:text-slate-300 font-sans whitespace-pre-wrap">
                  {profile.patientInstructions}
                </p>
              </div>
            ) : (
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-500 font-bold text-center">
                Your doctor has not issued any specific instruction handouts yet. Please check back later.
              </div>
            )}

            {/* Strict prescription confidentiality toggle block */}
            <div className="border-t border-slate-100 dark:border-slate-850 pt-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1A2421] dark:text-slate-150 uppercase tracking-wider">
                <Lock className="w-4 h-4 text-slate-400" />
                <span>Homeopathic Formula Detail</span>
              </div>

              {profile.showPrescriptionToPatient === true && profile.internalPrescription ? (
                <div className="p-4 bg-purple-50/15 border border-purple-200/40 rounded-2xl text-xs leading-relaxed text-slate-700 dark:text-slate-350 font-mono whitespace-pre-wrap">
                  <span className="text-[9px] font-extrabold text-purple-600 block mb-1.5 uppercase font-sans tracking-wider">Active Clinical Prescription</span>
                  {profile.internalPrescription}
                </div>
              ) : (
                <div className="p-4 bg-slate-900/5 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-900/50 rounded-2xl text-xs flex items-center gap-3 text-slate-500 font-semibold leading-relaxed">
                  <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <span>
                    Remedy formulas, dilutions, and potency selections are kept confidential in accordance with clinical standards. Follow the doctor handouts above or consult the clinic.
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Files & Document Uploads */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 md:p-8 rounded-[28px] border-white/60 space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4">
              <div className="flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-mint" />
                <h3 className="text-sm font-bold uppercase text-[#1A2421] dark:text-slate-100 tracking-wider">Medical Reports & Uploads</h3>
              </div>

              {/* Upload trigger */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:border-slate-800 dark:border-slate-800 dark:hover:border-slate-600 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? "Uploading..." : "Upload File"}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {uploadError && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-[11px] font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>{uploadError}</span>
              </div>
            )}

            {uploadSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-[11px] font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>{uploadSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!profile.attachments || profile.attachments.length === 0 ? (
                <div className="col-span-full py-8 text-center text-xs text-slate-500 font-bold border border-dashed border-slate-250 rounded-2xl bg-slate-50/50">
                  No uploaded lab results or imaging files in your folder.
                </div>
              ) : (
                profile.attachments.map((file, idx) => (
                  <a
                    key={idx}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/50 dark:border-slate-850 hover:border-mint dark:hover:border-mint transition-all flex items-start gap-3 text-xs shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-650 flex-shrink-0">
                      <FileSpreadsheet className="w-4 h-4 text-mint" />
                    </div>
                    <div className="space-y-0.5 overflow-hidden flex-grow">
                      <span className="font-bold text-slate-900 dark:text-slate-100 block truncate" title={file.target}>
                        {file.target}
                      </span>
                      <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                        <span>{file.category}</span>
                        <span>{file.date}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 self-center" />
                  </a>
                ))
              )}
            </div>
          </motion.div>

          {/* Follow-Up feedback submission form */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 md:p-8 rounded-[28px] border-white/60 space-y-6"
          >
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-4">
              <MessageSquare className="w-5 h-5 text-mint" />
              <h3 className="text-sm font-bold uppercase text-[#1A2421] dark:text-slate-100 tracking-wider">OPD Follow-Up Reporting</h3>
            </div>

            {followupSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>{followupSuccess}</span>
              </div>
            )}

            <form onSubmit={handleFollowupSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-slate-700 dark:text-slate-350">Improvement Level</label>
                  <select
                    value={followupImprovement}
                    onChange={(e) => setFollowupImprovement(e.target.value)}
                    className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 outline-none text-xs"
                  >
                    <option value="Cured / Fully Recovered">Cured / Fully Recovered</option>
                    <option value="Significant Improvement">Significant Improvement</option>
                    <option value="Slight Improvement">Slight Improvement</option>
                    <option value="No Change / Status Quo">No Change / Status Quo</option>
                    <option value="Slightly Aggravated">Slightly Aggravated (Healing Crisis)</option>
                    <option value="New Complaints / Shifted Symptoms">New Complaints / Shifted Symptoms</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-slate-700 dark:text-slate-350">Current Symptom Intensity</label>
                    <span className="font-bold text-mint">{followupIntensity}/10</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={followupIntensity}
                    onChange={(e) => setFollowupIntensity(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-mint mt-3"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700 dark:text-slate-350">Detailed Feedback & Symptom Changes</label>
                <textarea
                  value={followupFeedback}
                  onChange={(e) => setFollowupFeedback(e.target.value)}
                  placeholder="Tell your doctor how you feel. Describe any changes in sleep, thermal sensitiveness, digestive health, or mood..."
                  rows={4}
                  className="w-full p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 outline-none text-xs leading-relaxed font-sans"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingFollowup}
                  className="px-6 py-3 bg-mint hover:bg-mint-dark text-white rounded-full font-bold uppercase tracking-wider text-[10px] shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmittingFollowup ? "Submitting..." : "Submit Follow-Up Details"}
                </button>
              </div>
            </form>

            {/* Submission history list */}
            {profile.followupSubmissions && profile.followupSubmissions.length > 0 && (
              <div className="border-t border-slate-100 dark:border-slate-850 pt-5 space-y-3">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Follow-Up History</span>
                <div className="space-y-3.5 max-h-[160px] overflow-y-auto pr-1">
                  {profile.followupSubmissions.map((sub, i) => (
                    <div key={i} className="p-3.5 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-1.5 text-xs">
                      <div className="flex justify-between font-bold text-slate-650">
                        <span className="text-mint">{sub.improvement} (Intensity: {sub.intensity}/10)</span>
                        <span className="text-[10px] text-slate-400">{sub.date}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 font-sans italic leading-relaxed">{sub.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

        </div>

      </div>
    </div>
  );
}
