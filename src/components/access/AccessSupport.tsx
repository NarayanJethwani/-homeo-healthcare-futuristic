"use client";

import { Mail, MessageCircle, Phone, ShieldAlert } from "lucide-react";

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918446056789";
const whatsappDisplay = process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY || "+91 84460 56789";
const supportPhone = process.env.NEXT_PUBLIC_PAYMENT_PHONE || "8446056789";
const supportEmail = "narayan.jethwani@homeo.healthcare";
const supportMessage =
  "Hello Homeo Healthcare Support, I need help with portal access. I will not share patient information, prescriptions, passwords, or OTPs in this chat.";

export default function AccessSupport({ compact = false }: { compact?: boolean }) {
  return (
    <section
      aria-labelledby="access-support-title"
      className={`rounded-3xl border border-slate-200/70 bg-white/65 dark:border-slate-800 dark:bg-slate-900/60 ${compact ? "p-5" : "p-6 md:p-7"}`}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-emerald-500/10 p-2.5 text-emerald-700 dark:text-emerald-400">
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 id="access-support-title" className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
            Need access help?
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Contact the Homeo Healthcare team for login, account-linking, or registration assistance.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(supportMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          WhatsApp
        </a>
        <a
          href={`tel:${supportPhone}`}
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition hover:border-mint dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          {whatsappDisplay}
        </a>
        <a
          href={`mailto:${supportEmail}?subject=${encodeURIComponent("Portal access support")}`}
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition hover:border-mint dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          Email support
        </a>
      </div>

      <div className="mt-4 flex gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>
          For privacy, never send patient records, prescriptions, passwords, or OTPs through support chat. This channel is not for medical emergencies.
        </p>
      </div>
    </section>
  );
}
