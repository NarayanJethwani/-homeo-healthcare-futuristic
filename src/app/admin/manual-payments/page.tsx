"use client";

import { useState, useEffect } from "react";
import type { PaymentMethod, ManualPaymentQueueState, ManualPaymentRecord, ManualPaymentAuditEvent } from "@/lib/manualPaymentWorkflow";
import { isPaymentGatewayEnabled } from "@/lib/featureFlags";

export default function AdminManualPaymentsPage() {
  const [activeTab, setActiveTab] = useState<"queue" | "record" | "audit">("queue");
  const [actorRole, setActorRole] = useState<"admin" | "finance" | "care_coordinator" | "patient">("finance");
  const [actorId, setActorId] = useState("fin-staff-101");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states
  const [invoiceId, setInvoiceId] = useState("INV-2026-001");
  const [patientId, setPatientId] = useState("PAT-88492");
  const [amountRupees, setAmountRupees] = useState("4500");
  const [expectedTotalRupees, setExpectedTotalRupees] = useState("4500");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [referenceNumber, setReferenceNumber] = useState("UPI-REF-99881122");
  const [evidenceReference, setEvidenceReference] = useState("EVID-DOC-001");
  const [notes, setNotes] = useState("Paid via Google Pay to clinic UPI ID");

  // Reversal states
  const [reversalPaymentId, setReversalPaymentId] = useState("");
  const [reversalReason, setReversalReason] = useState("");

  // Care activation form
  const [activateInvoiceId, setActivateInvoiceId] = useState("INV-2026-001");
  const [activatePatientId, setActivatePatientId] = useState("PAT-88492");

  // State data fetched from Server APIs
  const [auditEvents, setAuditEvents] = useState<ManualPaymentAuditEvent[]>([]);
  const [currentQueueState, setCurrentQueueState] = useState<ManualPaymentQueueState>("accepted_coordination_pending");
  const [currentRecords, setCurrentRecords] = useState<ManualPaymentRecord[]>([]);
  const [currentStatus, setCurrentStatus] = useState<string>("unpaid");
  const [careActivatedRecord, setCareActivatedRecord] = useState<any>(null);

  const getHeaders = () => ({
    "Content-Type": "application/json",
    "x-actor-id": actorId,
    "x-actor-role": actorRole,
  });

  const fetchQueueData = async (targetInvoice: string) => {
    try {
      const res = await fetch(`/api/admin/manual-payments/queue?invoiceId=${encodeURIComponent(targetInvoice)}`);
      const json = await res.json();
      if (json.success) {
        setCurrentQueueState(json.data.queueState);
        setCurrentRecords(json.data.records || []);
        setCurrentStatus(json.data.paymentStatus || "unpaid");
      }
    } catch {
      // Graceful fallback during SSR / static optimization
    }
  };

  const fetchAuditEvents = async () => {
    try {
      const res = await fetch("/api/admin/manual-payments/audit");
      const json = await res.json();
      if (json.success) {
        setAuditEvents(json.data || []);
      }
    } catch {
      // Graceful fallback
    }
  };

  useEffect(() => {
    fetchQueueData(invoiceId);
    fetchAuditEvents();
  }, [invoiceId]);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const amountPaise = Math.round(parseFloat(amountRupees || "0") * 100);
    const expectedInvoiceTotalPaise = Math.round(parseFloat(expectedTotalRupees || "0") * 100);

    try {
      const res = await fetch("/api/admin/manual-payments/record", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          invoiceId,
          patientId,
          amountPaise,
          expectedInvoiceTotalPaise,
          paymentMethod,
          referenceNumber,
          evidenceReference,
          notes,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setMessage({
          type: "success",
          text: `Payment recorded via Authenticated Server API! Payment ID: ${json.data.paymentId}, Reference: ${json.data.referenceNumber}`,
        });
        fetchQueueData(invoiceId);
        fetchAuditEvents();
      } else {
        setMessage({ type: "error", text: json.error || "Failed to record payment" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: `Network error: ${err.message}` });
    }
  };

  const handleReversePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const res = await fetch("/api/admin/manual-payments/reverse", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          paymentId: reversalPaymentId,
          reversalReason,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setMessage({ type: "success", text: `Payment ${reversalPaymentId} reversed successfully via Server API.` });
        fetchQueueData(invoiceId);
        fetchAuditEvents();
      } else {
        setMessage({ type: "error", text: json.error || "Failed to reverse payment" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: `Network error: ${err.message}` });
    }
  };

  const handleUpdateQueue = async (newState: ManualPaymentQueueState) => {
    try {
      const res = await fetch("/api/admin/manual-payments/queue", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ invoiceId, newState }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setCurrentQueueState(newState);
        setMessage({ type: "success", text: `Queue state updated to '${newState}'` });
      } else {
        setMessage({ type: "error", text: json.error || "Failed to update queue state" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: `Network error: ${err.message}` });
    }
  };

  const handleActivateCare = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const res = await fetch("/api/admin/manual-payments/activate-care", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          careOrderId: `CARE-${Date.now()}`,
          patientId: activatePatientId,
          invoiceId: activateInvoiceId,
          agreementAccepted: true,
          billingDocumentExists: true,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setCareActivatedRecord(json.data);
        setMessage({ type: "success", text: `Care activated successfully via Governed Server API! Order ID: ${json.data.careOrderId}` });
        handleUpdateQueue("activated");
      } else {
        setMessage({ type: "error", text: json.error || "Failed to activate care" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: `Network error: ${err.message}` });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800">
      <header className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full mb-2">
              Controlled Soft-Launch Mode — Server API Backend
            </span>
            <h1 className="text-3xl font-bold text-slate-900">Admin & Finance Payment Portal</h1>
            <p className="text-sm text-slate-600 mt-1">
              Manual Payment Coordination, Evidence Recording, and Governed Care Activation
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-xs font-medium">
            <span>Actor Role:</span>
            <select
              value={actorRole}
              onChange={(e) => setActorRole(e.target.value as any)}
              className="bg-slate-100 border border-slate-300 rounded px-2 py-1 font-bold text-slate-800"
            >
              <option value="finance">Finance Staff</option>
              <option value="admin">Platform Admin</option>
              <option value="care_coordinator">Care Coordinator</option>
              <option value="patient">Patient (Prohibited Write)</option>
            </select>
            <span className="text-slate-400">|</span>
            <span>ID:</span>
            <input
              type="text"
              value={actorId}
              onChange={(e) => setActorId(e.target.value)}
              className="w-24 bg-slate-100 border border-slate-300 rounded px-2 py-1 font-mono"
            />
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between">
          <span>
            ⚙️ Payment Gateway Mode: <strong>{isPaymentGatewayEnabled() ? "ENABLED (Online Razorpay)" : "DISABLED (Manual Payment Coordination Soft Launch)"}</strong>
          </span>
          <span className="font-semibold text-blue-700">Authenticated Server API Routes Active</span>
        </div>
      </header>

      {message && (
        <div
          className={`max-w-6xl mx-auto mb-6 p-4 rounded-xl text-sm font-medium ${
            message.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <main className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 space-x-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("queue")}
            className={`pb-3 transition-colors ${activeTab === "queue" ? "border-b-2 border-teal-600 text-teal-700" : "text-slate-500 hover:text-slate-700"}`}
          >
            📋 Queue & Coordination ({invoiceId})
          </button>
          <button
            onClick={() => setActiveTab("record")}
            className={`pb-3 transition-colors ${activeTab === "record" ? "border-b-2 border-teal-600 text-teal-700" : "text-slate-500 hover:text-slate-700"}`}
          >
            💳 Record Payment / Reversal
          </button>
          <button
            onClick={() => {
              setActiveTab("audit");
              fetchAuditEvents();
            }}
            className={`pb-3 transition-colors ${activeTab === "audit" ? "border-b-2 border-teal-600 text-teal-700" : "text-slate-500 hover:text-slate-700"}`}
          >
            📜 Audit Event Log ({auditEvents.length})
          </button>
        </div>

        {/* Tab 1: Queue & Coordination */}
        {activeTab === "queue" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Manual Payment Queue Workflow</h2>

              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Current Order Queue State:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-bold">
                  {[
                    { id: "accepted_coordination_pending", label: "1. Accepted — Payment Coordination Pending" },
                    { id: "instructions_shared", label: "2. Payment Instructions Shared" },
                    { id: "evidence_received", label: "3. Payment Evidence Received" },
                    { id: "confirmed", label: "4. Payment Confirmed" },
                    { id: "activation_pending", label: "5. Care Activation Pending" },
                    { id: "activated", label: "6. Care Activated" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleUpdateQueue(item.id as ManualPaymentQueueState)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        currentQueueState === item.id
                          ? "bg-teal-600 text-white border-teal-600 shadow"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Server-Recorded Payments for {invoiceId}</h3>
                {currentRecords.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No manual payments recorded yet for this invoice.</p>
                ) : (
                  <div className="space-y-3">
                    {currentRecords.map((r) => (
                      <div key={r.paymentId} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                        <div className="flex justify-between font-bold text-slate-800">
                          <span>
                            {r.paymentMethod.toUpperCase()} | ₹{(r.amountPaise / 100).toFixed(2)} ({r.amountPaise} paise)
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] ${
                              r.status === "received"
                                ? "bg-emerald-100 text-emerald-800"
                                : r.status === "reversed"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {r.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-slate-600">Ref: {r.referenceNumber} | Evidence: {r.evidenceReference || "N/A"}</p>
                        <p className="text-slate-500">Recorded By: {r.recordedBy} at {r.receivedAt}</p>
                        {r.status === "reversed" && (
                          <p className="text-rose-700 font-semibold">Reversed By {r.reversedBy}: {r.reversalReason}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Care Activation Panel */}
              <div className="border-t border-slate-200 pt-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Governed Care Activation Gate</h3>
                {careActivatedRecord ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                    <p className="font-bold text-emerald-800">✅ Care Activated Successfully!</p>
                    <p>Care Order ID: {careActivatedRecord.careOrderId}</p>
                    <p>Activated By: {careActivatedRecord.activatedBy} ({careActivatedRecord.actorRole}) at {careActivatedRecord.activatedAt}</p>
                  </div>
                ) : (
                  <form onSubmit={handleActivateCare} className="flex gap-3 items-end">
                    <div className="flex-1 space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Invoice ID</label>
                      <input
                        type="text"
                        value={activateInvoiceId}
                        onChange={(e) => setActivateInvoiceId(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Patient ID</label>
                      <input
                        type="text"
                        value={activatePatientId}
                        onChange={(e) => setActivatePatientId(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-600 text-white font-bold text-xs rounded-lg hover:bg-teal-700 transition"
                    >
                      Confirm Care Activation via API
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Side summary panel */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm text-xs">
              <h3 className="text-sm font-bold text-slate-900">Active Order Summary</h3>
              <dl className="space-y-2">
                <div className="flex justify-between"><dt className="text-slate-500">Invoice ID</dt><dd className="font-mono font-bold text-slate-900">{invoiceId}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Patient ID</dt><dd className="font-mono font-bold text-slate-900">{patientId}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Payment Status</dt><dd className="font-bold uppercase text-teal-700">{currentStatus}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Queue State</dt><dd className="font-semibold text-slate-800">{currentQueueState}</dd></div>
              </dl>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] leading-relaxed">
                🔒 All actions execute via authenticated server API routes (`/api/admin/manual-payments/*`). Direct client-side state mutation is strictly prevented.
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Record Payment / Reversal */}
        {activeTab === "record" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form onSubmit={handleRecordPayment} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm text-xs">
              <h2 className="text-base font-bold text-slate-900">Record Manual Payment (Server API)</h2>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Invoice ID *</label>
                  <input
                    type="text"
                    required
                    value={invoiceId}
                    onChange={(e) => setInvoiceId(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Patient ID *</label>
                  <input
                    type="text"
                    required
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Payment Amount (₹) *</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={amountRupees}
                    onChange={(e) => setAmountRupees(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  />
                  <span className="text-[10px] text-slate-400">Stored as {Math.round(parseFloat(amountRupees || "0") * 100)} paise</span>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Expected Invoice Total (₹) *</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={expectedTotalRupees}
                    onChange={(e) => setExpectedTotalRupees(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  />
                  <span className="text-[10px] text-slate-400">Exact full payment enforced in v1.0</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Payment Method *</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                >
                  <option value="upi">UPI</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash (Auto-Receipt Reference if empty)</option>
                  <option value="card_terminal">Card Terminal</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Reference Number / UTR</label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  placeholder="e.g. UPI-99881122 (Leave empty for Cash auto-receipt)"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Evidence Reference / Document ID</label>
                <input
                  type="text"
                  value={evidenceReference}
                  onChange={(e) => setEvidenceReference(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  placeholder="e.g. EVID-DOC-001"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Notes / Details</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition text-xs uppercase tracking-wider"
              >
                Submit Payment via Authenticated API
              </button>
            </form>

            <form onSubmit={handleReversePayment} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm text-xs h-fit">
              <h2 className="text-base font-bold text-slate-900 text-rose-700">Non-Destructive Reversal (Server API)</h2>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Payment ID to Reverse *</label>
                <input
                  type="text"
                  required
                  value={reversalPaymentId}
                  onChange={(e) => setReversalPaymentId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  placeholder="pay-xxxx-xxxx"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Reason for Reversal / Correction *</label>
                <textarea
                  required
                  value={reversalReason}
                  onChange={(e) => setReversalReason(e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  placeholder="Document administrative reason for correction (min 5 chars)..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition text-xs uppercase tracking-wider"
              >
                Execute Non-Destructive Reversal via API
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Audit Event Log */}
        {activeTab === "audit" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm text-xs">
            <h2 className="text-base font-bold text-slate-900">Immutable Financial Audit Log (Server Fetched)</h2>
            {auditEvents.length === 0 ? (
              <p className="text-slate-500 italic">No audit events generated yet in this session.</p>
            ) : (
              <div className="space-y-3 font-mono">
                {auditEvents.map((evt) => (
                  <div key={evt.eventId} className="p-3 bg-slate-900 text-slate-100 rounded-xl space-y-1 text-[11px]">
                    <div className="flex justify-between text-teal-400 font-bold">
                      <span>[{evt.eventType}] {evt.eventId}</span>
                      <span>{evt.timestamp}</span>
                    </div>
                    <p className="text-slate-300">Invoice: {evt.invoiceId} | Patient: {evt.patientId}</p>
                    <p className="text-slate-400">Actor: {evt.actorId} (Role: {evt.actorRole})</p>
                    <pre className="text-slate-300 bg-slate-950 p-2 rounded mt-1 overflow-x-auto">
                      {JSON.stringify(evt.details, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
