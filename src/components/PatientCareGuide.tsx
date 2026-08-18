import Link from "next/link";
import { AlertTriangle, CalendarCheck, ClipboardCheck, IndianRupee } from "lucide-react";

const steps = [
  {
    icon: ClipboardCheck,
    title: "Choose a safe starting point",
    text: "Use the short pathway check to separate acute and chronic care. It does not diagnose or prescribe.",
  },
  {
    icon: CalendarCheck,
    title: "Request physician review",
    text: "Share your history and preferred appointment time. A requested slot is confirmed only by the clinic team.",
  },
  {
    icon: IndianRupee,
    title: "Approve the care plan",
    text: "The physician confirms suitability, scope, duration and the exact fee before care or payment begins.",
  },
];

export default function PatientCareGuide() {
  return (
    <section aria-labelledby="patient-care-guide" className="relative px-6 py-20">
      <div className="mx-auto max-w-7xl rounded-[32px] border border-slate-200/80 bg-white/75 p-6 shadow-sm backdrop-blur md:p-10">
        <div className="flex flex-col gap-5 border-b border-slate-200 pb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-mint">For patients</p>
            <h2 id="patient-care-guide" className="font-serif text-3xl font-semibold text-[#1A2421] md:text-4xl">
              Know what happens before you begin
            </h2>
            <p className="mt-4 text-sm font-medium leading-relaxed text-slate-700">
              Start with a transparent plan, then let the physician confirm what is clinically appropriate for you.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/store#care-pathways-pricing" className="rounded-full bg-mint px-6 py-3 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-mint-dark">
              View care plans
            </Link>
            <Link href="/#booking" className="rounded-full border border-mint/30 bg-mint/5 px-6 py-3 text-xs font-bold uppercase tracking-wide text-mint-dark transition-colors hover:bg-mint/10">
              Request appointment
            </Link>
          </div>
        </div>

        <div className="grid gap-5 py-8 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint/10 text-mint-dark">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Step {index + 1}</span>
              </div>
              <h3 className="text-base font-bold text-[#1A2421]">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{text}</p>
            </article>
          ))}
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p className="text-sm leading-relaxed">
            <strong>This is planned, non-emergency care.</strong> For chest pain, severe breathing difficulty, stroke signs, loss of consciousness, severe bleeding or rapidly worsening symptoms, contact local emergency services immediately.
          </p>
        </div>
      </div>
    </section>
  );
}
