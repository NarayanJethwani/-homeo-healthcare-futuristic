"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  CreditCard,
  Building2,
  Banknote,
  Smartphone,
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

  // Filter patients based on search input
  const filteredPatients = useMemo(() => {
    if (!patientSearch.trim()) return patients.slice(0, 15);
    const query = patientSearch.toLowerCase().trim();
    return patients
      .filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.id?.toLowerCase().includes(query) ||
          p.phone?.toLowerCase().includes(query) ||
          p.complaint?.toLowerCase().includes(query)
      )
      .slice(0, 15);
  }, [patients, patientSearch]);

  // Fetch invoices whenever a patient is selected
  const fetchInvoicesForPatient = async (pid: string) => {
    if (!pid) {
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

  const handleClearPatient = () => {
    setSelectedPatient(null);
    setPatientId("");
    setPatientSearch("");
    setInvoiceId("");
    setAmount("");
    setPatientInvoices([]);
    setIsDropdownOpen(false);
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

    const targetPatientId = selectedPatient ? selectedPatient.id : patientId.trim();
    if (!targetPatientId) {
      setMessage({ type: "error", text: "Please select or specify a Patient ID." });
      setSaving(false);
      return;
    }

    const calculatedAmountPaise = Math.round(Number(amount) * 100);
    if (!calculatedAmountPaise || calculatedAmountPaise <= 0) {
      setMessage({ type: "error", text: "Please enter a valid payment amount." });
      setSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/manual-payments/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: invoiceId.trim() || `INV-${targetPatientId.replace(/[^A-Za-z0-9]/g, "").slice(-6)}-${Date.now().toString().slice(-4)}`,
          patientId: targetPatientId,
          amountPaise: calculatedAmountPaise,
          paymentMethod: method,
          referenceNumber: reference.trim() || undefined,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Could not record payment.");
      }

      setMessage({
        type: "success",
        text: `Receipt ${result.data?.paymentId || "confirmed"} recorded successfully! Invoice marked Paid.`,
      });

      // Reset form fields
      setInvoiceId("");
      setAmount("");
      setReference("");

      // Refresh invoices for current patient
      if (targetPatientId) {
        void fetchInvoicesForPatient(targetPatientId);
      }

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
          <div className="mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Select Patient & Confirm Payment Receipt
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* 1. Patient Selector / Autocomplete */}
            <div className="relative">
              <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Patient Selection *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required={!selectedPatient && !patientId}
                  value={patientSearch}
                  onFocus={() => setIsDropdownOpen(true)}
                  onChange={(e) => {
                    setPatientSearch(e.target.value);
                    setPatientId(e.target.value);
                    setIsDropdownOpen(true);
                    if (selectedPatient && e.target.value !== `${selectedPatient.name} (${selectedPatient.id})`) {
                      setSelectedPatient(null);
                      setPatientInvoices([]);
                    }
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-8 pr-8 text-[11px] font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  placeholder="Search patient name, ID or phone..."
                />
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                {patientSearch && (
                  <button
                    type="button"
                    onClick={handleClearPatient}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Patient Dropdown Menu */}
              {isDropdownOpen && filteredPatients.length > 0 && (
                <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  <div className="px-2 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Matching Patients ({filteredPatients.length})
                  </div>
                  {filteredPatients.map((p) => (
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
                  ))}
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

            {/* Message alert */}
            {message && (
              <div
                className={`flex items-center gap-2 rounded-xl p-2.5 text-[10px] font-semibold sm:col-span-2 ${
                  message.type === "success"
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "border border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-600" />
                )}
                <span>{message.text}</span>
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
          {payments.slice(0, 6).map((payment) => (
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
