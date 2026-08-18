"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, CheckCircle2, Loader2, ShieldCheck, Stethoscope } from "lucide-react";
import AccessSupport from "@/components/access/AccessSupport";
import { formatDoctorPortalMonthlyPrice } from "@/lib/doctorSubscriptionConfig";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  registrationCouncil: string;
  registrationNumber: string;
  qualification: string;
  speciality: string;
  clinicName: string;
  city: string;
  state: string;
  consent: boolean;
  website: string;
};

const initialForm: FormState = {
  fullName: "",
  email: "",
  phone: "",
  registrationCouncil: "",
  registrationNumber: "",
  qualification: "",
  speciality: "",
  clinicName: "",
  city: "",
  state: "",
  consent: false,
  website: "",
};

export default function DoctorAccessRequestPage() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const update = (field: keyof FormState, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/doctor-access-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.message || "The request could not be submitted.");
      setMessage(result.message);
      setForm(initialForm);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "The request could not be submitted.");
    } finally {
      setSubmitting(false);
    }
  }

  const fields: Array<{ key: keyof FormState; label: string; placeholder: string; type?: string; required?: boolean }> = [
    { key: "fullName", label: "Full name", placeholder: "Dr. Full Name", required: true },
    { key: "email", label: "Professional email", placeholder: "doctor@example.com", type: "email", required: true },
    { key: "phone", label: "Mobile number", placeholder: "+91 98765 43210", type: "tel", required: true },
    { key: "registrationCouncil", label: "Registration council", placeholder: "State / national medical council", required: true },
    { key: "registrationNumber", label: "Registration number", placeholder: "Official registration number", required: true },
    { key: "qualification", label: "Qualification", placeholder: "e.g. BHMS, MD (Hom.)", required: true },
    { key: "speciality", label: "Speciality (optional)", placeholder: "Clinical area" },
    { key: "clinicName", label: "Clinic / organisation (optional)", placeholder: "Practice name" },
    { key: "city", label: "City", placeholder: "City", required: true },
    { key: "state", label: "State", placeholder: "State", required: true },
  ];

  return (
    <main className="min-h-screen bg-pearl px-5 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-5xl">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-mint dark:text-slate-300">
          <ArrowLeft className="h-4 w-4" /> Back to portal access
        </Link>

        <div className="mt-7 grid gap-7 lg:grid-cols-[1.35fr_0.65fr]">
          <section className="rounded-[32px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,118,110,0.08)] dark:border-slate-800 dark:bg-slate-900/75 md:p-9">
            <div className="flex items-start gap-4">
              <span className="rounded-2xl bg-mint/10 p-3 text-mint"><Stethoscope className="h-7 w-7" /></span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-mint">Clinical workspace</p>
                <h1 className="mt-1 font-serif text-3xl font-bold">Request doctor access</h1>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Submit your professional details for verification. This form does not create an active account or grant access to patient records.
                </p>
              </div>
            </div>

            {message && (
              <div role="status" className="mt-6 flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-200">
                <CheckCircle2 className="h-5 w-5 shrink-0" /> <span>{message}</span>
              </div>
            )}
            {error && <div role="alert" className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-500/10 dark:text-rose-200">{error}</div>}

            <form onSubmit={submit} className="mt-7 grid gap-5 sm:grid-cols-2">
              {fields.map((field) => (
                <label key={field.key} className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {field.label}
                  <input
                    type={field.type || "text"}
                    value={String(form[field.key])}
                    onChange={(event) => update(field.key, event.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    autoComplete={field.key === "email" ? "email" : field.key === "phone" ? "tel" : "off"}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3.5 text-sm font-medium normal-case tracking-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-mint focus:ring-1 focus:ring-mint dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100"
                  />
                </label>
              ))}

              <label className="hidden" aria-hidden="true">
                Website
                <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update("website", event.target.value)} />
              </label>

              <label className="sm:col-span-2 flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700 dark:bg-slate-950/50 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(event) => update("consent", event.target.checked)}
                  required
                  className="mt-1 h-4 w-4 accent-emerald-600"
                />
                <span>I confirm that these professional details are accurate and consent to their use for identity, registration, and access verification.</span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-full bg-mint px-6 py-4 text-sm font-bold text-white transition hover:bg-mint-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                {submitting ? "Submitting securely..." : "Submit for verification"}
              </button>
            </form>
          </section>

          <aside className="space-y-5">
            <section className="rounded-3xl border border-mint/20 bg-mint/5 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-mint">Simple portal subscription</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">First month free</h2>
              <p className="mt-1 text-lg font-bold text-mint-dark dark:text-mint">Then {formatDoctorPortalMonthlyPrice()}</p>
              <p className="mt-3 text-xs leading-5 text-slate-600 dark:text-slate-400">One doctor portal plan. Cancel before renewal. Clinical fees, patient care charges and optional external services are separate.</p>
            </section>
            <section className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 dark:border-slate-800 dark:bg-slate-900/60">
              <div className="flex items-center gap-2 text-mint"><BadgeCheck className="h-5 w-5" /><h2 className="font-bold">What happens next</h2></div>
              <ol className="mt-4 space-y-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                <li><strong className="text-slate-900 dark:text-slate-100">1. Verification:</strong> registration and contact details are reviewed.</li>
                <li><strong className="text-slate-900 dark:text-slate-100">2. Approval:</strong> an authorised administrator assigns the appropriate role.</li>
                <li><strong className="text-slate-900 dark:text-slate-100">3. Secure setup:</strong> approved users receive account setup instructions.</li>
              </ol>
              <p className="mt-5 rounded-2xl bg-amber-50 p-3 text-xs leading-5 text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">Submission is not approval. Do not send identity documents through WhatsApp unless the verification team provides an approved secure method.</p>
            </section>
            <AccessSupport compact />
            <p className="text-center text-xs text-slate-500">Already approved? <Link href="/admin/login" className="font-bold text-mint hover:underline">Doctor sign in</Link></p>
          </aside>
        </div>
      </div>
    </main>
  );
}
