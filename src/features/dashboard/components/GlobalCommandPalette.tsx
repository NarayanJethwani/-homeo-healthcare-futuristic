"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Search, User, FileText, Settings, Sparkles, BookOpen, AlertCircle } from "lucide-react";

interface SearchResultItem {
  id: string;
  type: "patient" | "remedy" | "invoice" | "doctor" | "setting" | "action";
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

interface GlobalCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  patients: any[];
  onSelectPatient: (id: string) => void;
  invoicesList: any[];
  onOpenInvoice: (patient: any) => void;
  setActiveTab: (tabId: any) => void;
  onTriggerQuickAction: (actionKey: string) => void;
  clinicians: any[];
  remediesKeynotes: Record<string, { keynotes: string[]; miasm: string }>;
  reduceMotion?: boolean;
}

export default function GlobalCommandPalette({
  isOpen,
  onClose,
  patients,
  onSelectPatient,
  invoicesList,
  onOpenInvoice,
  setActiveTab,
  onTriggerQuickAction,
  clinicians,
  remediesKeynotes,
  reduceMotion = false,
}: GlobalCommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const searchResults = useMemo(() => {
    const items: SearchResultItem[] = [];
    const normalizedQuery = query.toLowerCase().trim();

    // 1. Settings / Navigation Tabs
    const tabs = [
      { id: "dashboard", label: "Dashboard", desc: "View clinical metrics, alerts, and today's schedule" },
      { id: "intake", label: "AI Intake", desc: "Run guided patient intake and constitutional synthesis" },
      { id: "patients", label: "Patients Directory", desc: "Manage patient registry and clinical timelines" },
      { id: "diagnostics", label: "Diagnostics Affinity", desc: "Search conditions database and affinity index" },
      { id: "analyzer", label: "Report Analyzer", desc: "Ingest lab reports and extract clinical markers" },
      { id: "diet-lifestyle", label: "Diet & Lifestyle", desc: "Set dietary restrictions and meal routines" },
      { id: "treatment-planner", label: "Treatment Planner", desc: "Calculate consultation packages and billing" },
      { id: "nexus-atlas", label: "Nexus Atlas", desc: "Explore repertory rubrics and materia medica" },
      { id: "cie", label: "Clinical OS", desc: "View intelligence cockpit and miasms radar" },
      { id: "medical-academy", label: "Medical Academy", desc: "Participate in physician education and quizzes" },
      { id: "learning-hub", label: "Learning Hub", desc: "Access adaptive learning, simulator labs, and history" },
      { id: "communication", label: "Communications", desc: "Send automated outreach and messages" },
      { id: "ai-router", label: "AI Router Settings", desc: "Manage LLM failover configuration and token budgets" },
      { id: "team", label: "Manage Doctors", desc: "Registry of medical officers and access privileges" },
      { id: "health-intelligence", label: "Public Intake Portal", desc: "Import assessments from patient self-intake" },
    ];

    tabs.forEach((t) => {
      if (!query || t.label.toLowerCase().includes(normalizedQuery) || t.desc.toLowerCase().includes(normalizedQuery)) {
        items.push({
          id: `tab-${t.id}`,
          type: "setting",
          title: t.label,
          subtitle: t.desc,
          icon: Settings,
          action: () => {
            setActiveTab(t.id);
            onClose();
          },
        });
      }
    });

    // 2. Quick Actions
    const actions = [
      { key: "new-patient", label: "New Patient Case", desc: "Register patient case record" },
      { key: "ai-intake", label: "Start AI Intake", desc: "Launch new guided interview session" },
      { key: "upload-report", label: "Upload Report", desc: "Upload and analyze diagnostic PDF reports" },
      { key: "create-prescription", label: "Create Prescription", desc: "Open treatment plan compound config" },
      { key: "schedule-appointment", label: "Schedule Appointment", desc: "Open outreach tab to schedule visit" },
      { key: "generate-invoice", label: "Generate Invoice", desc: "Create billing breakdown statement" },
      { key: "emergency-case", label: "Emergency Intake", desc: "Flag case as urgent and initiate triage" },
      { key: "knowledge-editor", label: "Knowledge Editor", desc: "Open Repertory & Materia Medica KMS Editor" },
    ];

    actions.forEach((a) => {
      if (!query || a.label.toLowerCase().includes(normalizedQuery) || a.desc.toLowerCase().includes(normalizedQuery)) {
        items.push({
          id: `action-${a.key}`,
          type: "action",
          title: a.label,
          subtitle: a.desc,
          icon: Sparkles,
          action: () => {
            onTriggerQuickAction(a.key);
            onClose();
          },
        });
      }
    });

    // 3. Patients Directory Search
    patients.forEach((p) => {
      if (
        query &&
        (p.name.toLowerCase().includes(normalizedQuery) ||
          p.complaint.toLowerCase().includes(normalizedQuery) ||
          (p.phone && p.phone.includes(normalizedQuery)))
      ) {
        items.push({
          id: `patient-${p.id}`,
          type: "patient",
          title: p.name,
          subtitle: `Age: ${p.age}y/o | Chief Complaint: ${p.complaint}`,
          icon: User,
          action: () => {
            onSelectPatient(p.id);
            setActiveTab("patients");
            onClose();
          },
        });
      }
    });

    // 4. Invoices
    invoicesList.forEach((inv) => {
      if (
        query &&
        ((inv.invoiceNo && inv.invoiceNo.toLowerCase().includes(normalizedQuery)) ||
          (inv.patientName && inv.patientName.toLowerCase().includes(normalizedQuery)))
      ) {
        items.push({
          id: `invoice-${inv.id || inv.invoiceNo}`,
          type: "invoice",
          title: inv.invoiceNo || "Invoice Record",
          subtitle: `Patient: ${inv.patientName} | Amount: ₹${inv.amount || inv.grandTotal} | Status: ${inv.status}`,
          icon: FileText,
          action: () => {
            onOpenInvoice(inv);
            onClose();
          },
        });
      }
    });

    // 5. Remedies Keynotes
    Object.entries(remediesKeynotes).forEach(([remCode, meta]) => {
      const keynotesStr = meta.keynotes.join(", ").toLowerCase();
      if (
        query &&
        (remCode.toLowerCase().includes(normalizedQuery) ||
          keynotesStr.includes(normalizedQuery) ||
          meta.miasm.toLowerCase().includes(normalizedQuery))
      ) {
        items.push({
          id: `remedy-${remCode}`,
          type: "remedy",
          title: remCode,
          subtitle: `Miasm: ${meta.miasm} | Keynotes: ${meta.keynotes.slice(0, 2).join(", ")}...`,
          icon: BookOpen,
          action: () => {
            setActiveTab("nexus-atlas");
            onClose();
          },
        });
      }
    });

    // 6. Clinicians
    clinicians.forEach((c) => {
      if (
        query &&
        (c.name.toLowerCase().includes(normalizedQuery) ||
          c.email.toLowerCase().includes(normalizedQuery) ||
          c.role.toLowerCase().includes(normalizedQuery))
      ) {
        items.push({
          id: `doctor-${c.uid || c.email}`,
          type: "doctor",
          title: c.name,
          subtitle: `Role: ${c.role === "admin" ? "Master Clinician" : "Junior Medical Officer"} | Email: ${c.email}`,
          icon: User,
          action: () => {
            setActiveTab("team");
            onClose();
          },
        });
      }
    });

    // Relevance Category Sorting Map (Clinician priority: Patients > Actions > Navigation > Knowledge > Settings)
    const typePriority: Record<string, number> = {
      patient: 1,
      action: 2,
      setting: 3,
      remedy: 4,
      invoice: 5,
      doctor: 6,
    };

    return items.sort((a, b) => typePriority[a.type] - typePriority[b.type]);
  }, [query, patients, invoicesList, remediesKeynotes, clinicians, setActiveTab, onSelectPatient, onOpenInvoice, onTriggerQuickAction, onClose]);

  // Reset index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, searchResults.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + searchResults.length) % Math.max(1, searchResults.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (searchResults[selectedIndex]) {
          searchResults[selectedIndex].action();
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, searchResults, selectedIndex, onClose]);

  // Scroll selected item into view in container
  useEffect(() => {
    if (itemsContainerRef.current) {
      const children = Array.from(itemsContainerRef.current.children);
      // Filter out headers to get correct DOM elements for items
      const itemElements = children.filter((child) => child.getAttribute("role") === "option");
      const selectedEl = itemElements[selectedIndex] as HTMLElement;
      
      if (selectedEl) {
        const container = itemsContainerRef.current;
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.clientHeight;
        const elemTop = selectedEl.offsetTop;
        const elemBottom = elemTop + selectedEl.clientHeight;

        if (elemTop < containerTop) {
          container.scrollTop = elemTop;
        } else if (elemBottom > containerBottom) {
          container.scrollTop = elemBottom - container.clientHeight;
        }
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[100] transition-opacity"
        onClick={onClose}
      />

      {/* Floating command dialog box */}
      <div
        ref={containerRef}
        className={`fixed inset-x-4 top-[12%] mx-auto max-w-2xl bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl shadow-2xl z-[101] overflow-hidden flex flex-col max-h-[60vh] select-none text-slate-850 dark:text-slate-200 ${
          reduceMotion ? "" : "animate-in fade-in zoom-in-95 duration-150"
        }`}
        role="combobox"
        aria-expanded="true"
        aria-haspopup="listbox"
        aria-owns="search-results-list"
        aria-label="Global search command palette"
      >
        {/* Search input field */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-850 shrink-0">
          <Search className="w-5 h-5 text-slate-450" />
          <input
            type="text"
            className="flex-grow bg-transparent border-none outline-none text-xs text-slate-850 dark:text-slate-100 placeholder-slate-450 dark:placeholder-slate-500 font-sans"
            placeholder="Search patient, remedy, page setting, action... (Use ↑↓ Enter)"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-autocomplete="list"
            aria-controls="search-results-list"
            aria-activedescendant={searchResults[selectedIndex] ? `item-${searchResults[selectedIndex].id}` : undefined}
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-202 dark:border-slate-700 rounded text-[9px] font-mono text-slate-450 shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Results listbox container with visual grouping */}
        <div
          ref={itemsContainerRef}
          id="search-results-list"
          role="listbox"
          className="flex-grow overflow-y-auto p-2 scrollbar-thin"
        >
          {searchResults.length > 0 ? (
            searchResults.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;

              // Determine group header visibility
              const showHeader = idx === 0 || searchResults[idx - 1].type !== item.type;
              const categoryTitles: Record<string, string> = {
                patient: "Active Patient Records",
                action: "Clinical Shortcuts & Actions",
                setting: "System Navigation & Settings",
                remedy: "Materia Medica & Knowledge Base",
                invoice: "Invoice & Billing Ledgers",
                doctor: "Medical Officer Directory"
              };

              return (
                <React.Fragment key={item.id}>
                  {showHeader && (
                    <div className="text-[8.5px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-550 px-3.5 pt-3 pb-1 select-none border-t border-slate-100/50 dark:border-slate-800/40 first:border-none">
                      {categoryTitles[item.type] || item.type}
                    </div>
                  )}
                  <div
                    id={`item-${item.id}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={item.action}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all border border-transparent ${
                      isSelected
                        ? "bg-slate-50 dark:bg-slate-850 border-teal-202 dark:border-teal-900 text-teal-650 dark:text-teal-400 shadow-2xs"
                        : "hover:bg-slate-50/50 dark:hover:bg-slate-850/50"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-teal-100/50 dark:bg-teal-950/40 text-teal-650 dark:text-teal-400"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-450 dark:text-slate-500"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="text-[11px] font-extrabold truncate leading-tight text-slate-900 dark:text-slate-200">
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div className="text-[9.5px] text-slate-450 dark:text-slate-500 truncate mt-0.5 font-medium">
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          ) : (
            <div className="p-8 text-center space-y-2" role="status">
              <AlertCircle className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
              <div className="text-xs font-bold text-slate-400 dark:text-slate-550">
                No matching results found
              </div>
              <div className="text-[10px] text-slate-350 dark:text-slate-650 max-w-xs mx-auto leading-relaxed">
                Try searching for specific patient names, clinical complaints, or remedies keynotes.
              </div>
            </div>
          )}
        </div>

        {/* Footer actions helper bar */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-850/50 border-t border-slate-100 dark:border-slate-850 text-[9px] text-slate-400 dark:text-slate-550 flex items-center justify-between shrink-0 font-medium select-none">
          <div className="flex items-center gap-1.5">
            <span>↑↓ to navigate</span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span>Enter to select</span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span>ESC to close</span>
          </div>
          <div>
            Results: {searchResults.length}
          </div>
        </div>
      </div>
    </>
  );
}
