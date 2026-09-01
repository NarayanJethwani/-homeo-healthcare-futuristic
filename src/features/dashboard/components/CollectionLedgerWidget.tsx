"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  IndianRupee,
  ReceiptText,
  Search,
  User,
  CheckCircle2,
  ChevronDown,
  RefreshCw,
  AlertCircle,
  FileText,
  X,
  PlusCircle,
  ShoppingBag,
  UserCheck,
  Building2,
} from "lucide-react";

export type PaymentReceipt = {
  paymentId: string;
  invoiceId: string;
  patientId: string;
  amountPaise: number;
  paymentMethod: string;
  referenceNumber: string;
  receivedAt: string;
  recordedBy: string;
  status: string;
};

interface PatientSummary {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  careLevel?: string;
  finalPrice?: number;
  complaint?: string;
}

interface InvoiceSummary {
  id: string;
  invoiceNo?: string;
  patientId: string;
  patientName?: string;
  grandTotal?: number;
  status?: string;
  date?: string;
  paymentMode?: string;
  items?: Array<{ description: string; amount: number }>;
}

interface CollectionLedgerWidgetProps {
  payments?: PaymentReceipt[];
  patients?: PatientSummary[];
  onRefresh?: () => Promise<void> | void;
}

export default function CollectionLedgerWidget({
  payments = [],
  patients = [],
  onRefresh,
}: CollectionLedgerWidgetProps) {
  const [open, setOpen] = useState(true);
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<PatientSummary | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [invoiceId, setInvoiceId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("upi");
  const [reference, setReference] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  // Patient's invoices
  const [patientInvoices, setPatientInvoices] = useState<InvoiceSummary[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);

  const total = payments.reduce((sum, payment) => sum + Number(payment.amountPaise || 0), 0) / 100;

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Filter patients based on search input
  const filteredPatients = useMemo(() => {
    if (!patients || patients.length === 0) return [];
    if (!patientSearch.trim()) return patients.slice(0, 50);
    const query = patientSearch.toLowerCase().trim();
    return patients
      .filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.id?.toLowerCase().includes(query) ||
          p.phone?.toLowerCase().includes(query) ||
          p.complaint?.toLowerCase().includes(query)
      )
      .slice(0, 50);
  }, [patients, patientSearch]);

  // Fetch invoices whenever a patient is selected
  const fetchInvoicesForPatient = async (pid: string) => {
    if (!pid || pid.startsWith("WALK-IN") || pid.startsWith("PHARMACY") || pid.startsWith("GENERAL")) {
      setPatientInvoices([]);
      return;
    }
    setLoadingInvoices(true);
    try {
      const response = await fetch(`/api/invoice?patientId=${encodeURIComponent(pid)}`);
      const result = await response.json();
      if (response.ok && result.success) {
        const invoices: InvoiceSummary[] = result.invoices || [];
        setPatientInvoices(invoices);

        // If there's an unpaid invoice, auto-select the first pending one
        const pending = invoices.find((inv) => inv.status !== "Paid");
        if (pending) {
          const invNum = pending.invoiceNo || pending.id;
          setInvoiceId(invNum);
          setAmount(String(pending.grandTotal || ""));
          if (pending.paymentMode) {
            setMethod(pending.paymentMode.toLowerCase().replace(/\s+/g, "_"));
          }
        }
      } else {
        setPatientInvoices([]);
      }
    } catch {
      setPatientInvoices([]);
    } finally {
      setLoadingInvoices(false);
    }
  };

  const handleSelectPatient = (patient: PatientSummary) => {
    setSelectedPatient(patient);
    setPatientId(patient.id);
    setPatientSearch(`${patient.name} (${patient.id})`);
    setIsDropdownOpen(false);
    setMessage(null);

    // Prepopulate expected amount if patient has finalPrice
    if (patient.finalPrice) {
      setAmount(String(patient.finalPrice));
    }

    void fetchInvoicesForPatient(patient.id);
  };

  const handleSelectWalkInPreset = (type: "walkin" | "pharmacy" | "general") => {
    setSelectedPatient(null);
    setPatientInvoices([]);
    setMessage(null);
    setIsDropdownOpen(false);

    const nowStr = Date.now().toString().slice(-4);
    if (type === "walkin") {
      setPatientId("WALK-IN");
      setPatientSearch("Walk-in Patient (WALK-IN)");
      setInvoiceId(`INV-WALKIN-${nowStr}`);
    } else if (type === "pharmacy") {
      setPatientId("PHARMACY");
      setPatientSearch("Pharmacy / Remedy Sale (PHARMACY)");
      setInvoiceId(`INV-PHARM-${nowStr}`);
    } else {
      setPatientId("GENERAL");
      setPatientSearch("General Counter Receipt (GENERAL)");
      setInvoiceId(`INV-GEN-${nowStr}`);
    }
  };

  const handleClearPatient = () => {
    setSelectedPatient(null);
    setPatientId("");
    setPatientSearch("");
    setInvoiceId("");
    setAmount("");
    setPatientInvoices([]);
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  const handleStartNewReceipt = () => {
    setSelectedPatient(null);
    setPatientId("");
    setPatientSearch("");
    setInvoiceId("");
    setAmount("");
    setReference("");
    setPatientInvoices([]);
    setMessage(null);
    setIsDropdownOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleSelectInvoice = (inv: InvoiceSummary) => {
    const invNum = inv.invoiceNo || inv.id;
    setInvoiceId(invNum);
    if (inv.grandTotal) {
      setAmount(String(inv.grandTotal));
    }
    if (inv.paymentMode) {
      const mode = inv.paymentMode.toLowerCase().replace(/\s+/g, "_");
      if (["upi", "bank_transfer", "cash", "card_terminal", "other"].includes(mode)) {
        setMethod(mode);
      }
    }
  };

  const record = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const targetPatientId = selectedPatient ? selectedPatient.id : patientId.trim() || patientSearch.trim();
    if (!targetPatientId) {
      setMessage({ type: "error", text: "Please select a registered patient or choose a Walk-in preset." });
      setSaving(false);
      return;
    }

    const calculatedAmountPaise = Math.round(Number(amount) * 100);
    if (!calculatedAmountPaise || calculatedAmountPaise <= 0) {
      setMessage({ type: "error", text: "Please enter a valid payment amount in Rupees." });
      setSaving(false);
      return;
    }

    try {
      const cleanPatientId = targetPatientId.replace(/[^A-Za-z0-9-_]/g, "").slice(0, 30) || "WALK-IN";
      const autoInvoiceId = invoiceId.trim() || `INV-${cleanPatientId.slice(-6)}-${Date.now().toString().slice(-4)}`;

      const response = await fetch("/api/admin/manual-payments/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: autoInvoiceId,
          patientId: targetPatientId,
          amountPaise: calculatedAmountPaise,
          paymentMethod: method,
          referenceNumber: reference.trim(),
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Could not record payment.");
      }

      setMessage({
        type: "success",
        text: `Receipt confirmed for ₹${Number(amount).toLocaleString("en-IN")} (${autoInvoiceId})! Recorded successfully.`,
      });

      // Clear the current form fields to be ready for next receipt
      setSelectedPatient(null);
      setPatientId("");
      setPatientSearch("");
      setInvoiceId("");
      setAmount("");
      setReference("");
      setPatientInvoices([]);

      await onRefresh?.();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Could not record payment." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <ReceiptText className="h-4 w-4 text-emerald-500" />
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Today&apos;s Confirmed Collections
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-0.5 text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
            <IndianRupee className="h-3.5 w-3.5" />
            {total.toLocaleString("en-IN")}
          </span>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-xl bg-emerald-600 px-3 py-1.5 text-[9px] font-bold text-white transition hover:bg-emerald-700 cursor-pointer"
          >
            {open ? "Hide record form" : "Record payment"}
          </button>
        </div>
      </div>

      {/* Main Payment Recording Form */}
      {open && (
        <form onSubmit={record} className="mt-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-850">
          {/* Quick Preset Receipt Types */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5 dark:border-slate-700/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Receipt Type & Patient Selection:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  handleClearPatient();
                  setIsDropdownOpen(true);
                }}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-700 shadow-xs hover:border-emerald-500 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                <UserCheck className="h-3 w-3 text-emerald-600" />
                <span>Select Registered Patient ({patients.length})</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectWalkInPreset("walkin")}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-700 shadow-xs hover:border-emerald-500 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                <span>🚶 Walk-in Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectWalkInPreset("pharmacy")}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-700 shadow-xs hover:border-emerald-500 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                <ShoppingBag className="h-3 w-3 text-amber-600" />
                <span>Pharmacy / Remedy Sale</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectWalkInPreset("general")}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-700 shadow-xs hover:border-emerald-500 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                <Building2 className="h-3 w-3 text-blue-600" />
                <span>Other / Counter</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* 1. Patient Selector / Autocomplete */}
            <div className="relative" ref={dropdownRef}>
              <div className="mb-1 flex items-center justify-between">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Patient Selection *
                </label>
                <span className="text-[8px] font-semibold text-slate-400">
                  {patients.length ? `${patients.length} patients loaded` : "Type name or pick preset"}
                </span>
              </div>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  required={!selectedPatient && !patientId && !patientSearch.trim()}
                  value={patientSearch}
                  onFocus={() => setIsDropdownOpen(true)}
                  onClick={() => setIsDropdownOpen(true)}
                  onChange={(e) => {
                    setPatientSearch(e.target.value);
                    setPatientId(e.target.value);
                    setIsDropdownOpen(true);
                    if (selectedPatient && e.target.value !== `${selectedPatient.name} (${selectedPatient.id})`) {
                      setSelectedPatient(null);
                      setPatientInvoices([]);
                    }
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-8 pr-16 text-[11px] font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  placeholder="Click to browse or search patients..."
                />
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
                  {patientSearch && (
                    <button
                      type="button"
                      onClick={handleClearPatient}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      title="Clear selection"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    title="Toggle patient list"
                  >
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Patient Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-800">
                  <div className="flex items-center justify-between px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    <span>
                      {patientSearch.trim() ? `Search Results (${filteredPatients.length})` : `All Registered Patients (${filteredPatients.length})`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(false)}
                      className="text-[9px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      Close ✕
                    </button>
                  </div>

                  {/* Preset options in dropdown */}
                  <div className="mb-1 grid grid-cols-3 gap-1 border-b border-slate-100 pb-1.5 pt-0.5 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => handleSelectWalkInPreset("walkin")}
                      className="rounded bg-slate-100 px-1.5 py-1 text-center text-[9px] font-bold text-slate-700 hover:bg-emerald-100 hover:text-emerald-800 dark:bg-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      🚶 Walk-in
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectWalkInPreset("pharmacy")}
                      className="rounded bg-slate-100 px-1.5 py-1 text-center text-[9px] font-bold text-slate-700 hover:bg-amber-100 hover:text-amber-800 dark:bg-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      💊 Pharmacy
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectWalkInPreset("general")}
                      className="rounded bg-slate-100 px-1.5 py-1 text-center text-[9px] font-bold text-slate-700 hover:bg-blue-100 hover:text-blue-800 dark:bg-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      🏥 General
                    </button>
                  </div>

                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPatient(p)}
                        className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[11px] transition hover:bg-emerald-50 dark:hover:bg-slate-700 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <User className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                          <div className="truncate">
                            <span className="font-bold text-slate-800 dark:text-slate-200">{p.name}</span>
                            <span className="ml-1.5 text-[9px] font-bold text-slate-400">({p.id})</span>
                            {p.phone && <span className="ml-1.5 text-[9px] text-slate-400">· {p.phone}</span>}
                          </div>
                        </div>
                        {p.careLevel && (
                          <span className="ml-2 shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-[8px] font-extrabold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {p.careLevel}
                          </span>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-center">
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        No registered patient found matching &ldquo;{patientSearch}&rdquo;.
                      </p>
                      {patientSearch.trim() && (
                        <button
                          type="button"
                          onClick={() => {
                            setPatientId(patientSearch.trim());
                            setIsDropdownOpen(false);
                          }}
                          className="mt-2 inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-emerald-700 cursor-pointer"
                        >
                          <PlusCircle className="h-3 w-3" />
                          <span>Use &ldquo;{patientSearch.trim()}&rdquo; as Custom Patient</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. Invoice Number / Selector */}
            <div>
              <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Invoice Number *
              </label>
              {patientInvoices.length > 0 ? (
                <div className="space-y-1">
                  <select
                    value={invoiceId}
                    onChange={(e) => {
                      const selected = patientInvoices.find(
                        (inv) => (inv.invoiceNo || inv.id) === e.target.value
                      );
                      if (selected) {
                        handleSelectInvoice(selected);
                      } else {
                        setInvoiceId(e.target.value);
                      }
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-800 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <option value="">-- Select Pending / Generated Invoice --</option>
                    {patientInvoices.map((inv) => {
                      const num = inv.invoiceNo || inv.id;
                      return (
                        <option key={num} value={num}>
                          {num} · ₹{(inv.grandTotal || 0).toLocaleString("en-IN")} ({inv.status || "Pending"})
                        </option>
                      );
                    })}
                  </select>
                </div>
              ) : (
                <input
                  required
                  value={invoiceId}
                  onChange={(event) => setInvoiceId(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-800 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  placeholder={loadingInvoices ? "Loading invoices..." : "Invoice number (e.g. INV-2026-001)"}
                />
              )}
            </div>

            {/* 3. Invoice Amount in Rupees */}
            <div>
              <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Exact Invoice Amount (₹) *
              </label>
              <div className="relative">
                <input
                  required
                  min="1"
                  type="number"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-7 pr-3 text-[11px] font-bold text-slate-800 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  placeholder="e.g. 4500"
                />
                <IndianRupee className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* 4. Payment Method */}
            <div>
              <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Payment Method *
              </label>
              <select
                value={method}
                onChange={(event) => setMethod(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-800 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="upi">UPI (Google Pay / PhonePe / Paytm / QR)</option>
                <option value="bank_transfer">Bank Transfer (NEFT / IMPS / RTGS)</option>
                <option value="cash">Cash (Direct Clinic Counter)</option>
                <option value="card_terminal">Card Terminal (POS / Swipe)</option>
                <option value="other">Other Manual Settlement</option>
              </select>
            </div>

            {/* 5. Payment Reference */}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Payment Reference / Transaction UTR
              </label>
              <input
                value={reference}
                onChange={(event) => setReference(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-medium text-slate-800 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                placeholder="UTR / Transaction ID / Bank reference (auto-generates standard cash receipt if blank)"
              />
            </div>

            {/* Selected Patient Invoices Quick View Banner */}
            {selectedPatient && patientInvoices.length > 0 && (
              <div className="sm:col-span-2 rounded-xl border border-emerald-100 bg-emerald-50/50 p-2.5 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-900 dark:text-emerald-300">
                    Patient Invoices for {selectedPatient.name}:
                  </span>
                  <span className="text-[9px] text-emerald-700 dark:text-emerald-400">
                    {patientInvoices.filter((i) => i.status !== "Paid").length} pending
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {patientInvoices.map((inv) => {
                    const num = inv.invoiceNo || inv.id;
                    const isPaid = inv.status === "Paid";
                    const isSelected = invoiceId === num;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleSelectInvoice(inv)}
                        className={`flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[10px] font-bold transition cursor-pointer ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : isPaid
                              ? "border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-800"
                              : "border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200"
                        }`}
                      >
                        <FileText className="h-3 w-3" />
                        <span>{num}</span>
                        <span className="opacity-80">₹{(inv.grandTotal || 0).toLocaleString("en-IN")}</span>
                        <span className="text-[8px] uppercase tracking-wider opacity-90">({inv.status || "Pending"})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Confirm Payment Button */}
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-[11px] font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50 sm:col-span-2 cursor-pointer"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Confirming receipt and generating ledger voucher…</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Confirm Receipt of Payment</span>
                </>
              )}
            </button>

            {/* Message alert & Record Another Receipt button */}
            {message && (
              <div
                className={`flex flex-col gap-2 rounded-xl p-3 sm:col-span-2 ${
                  message.type === "success"
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "border border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300"
                }`}
              >
                <div className="flex items-center gap-2 text-[10px] font-semibold">
                  {message.type === "success" ? (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-600" />
                  )}
                  <span>{message.text}</span>
                </div>
                {message.type === "success" && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleStartNewReceipt}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-[10px] font-bold text-white shadow-xs hover:bg-emerald-700 transition cursor-pointer"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span>Record Another Receipt</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </form>
      )}

      {/* Confirmed Payments Recorded Today */}
      {payments.length ? (
        <div className="mt-3 space-y-2">
          <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
            Recent Confirmed Receipts Today ({payments.length})
          </div>
          {payments.slice(0, 8).map((payment) => (
            <div
              key={payment.paymentId}
              className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl bg-slate-50 px-3 py-2 text-[10px] dark:bg-slate-850"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{payment.invoiceId}</span>
                  <span className="rounded bg-slate-200 px-1.5 py-0.2 text-[8px] font-extrabold uppercase text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                    {payment.paymentMethod}
                  </span>
                  {payment.patientId && (
                    <span className="text-[9px] text-slate-400 font-medium">
                      Patient: {payment.patientId}
                    </span>
                  )}
                </div>
                <span className="mt-0.5 block text-[9px] text-slate-400">
                  Ref: {payment.referenceNumber} · Recorded by {payment.recordedBy} ·{" "}
                  {new Intl.DateTimeFormat("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "Asia/Kolkata",
                  }).format(new Date(payment.receivedAt))}
                </span>
              </div>
              <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                ₹{(payment.amountPaise / 100).toLocaleString("en-IN")}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-7 text-center text-[10px] text-slate-400">
          No confirmed payment receipts have been recorded today. Invoices alone do not count as collection.
        </div>
      )}
    </div>
  );
}
