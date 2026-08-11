import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  HeartHandshake,
  ShieldCheck,
  Stethoscope,
  X,
} from "lucide-react";
import type { SpecialtyClinicalArea } from "@/lib/specialtyPrograms";

interface HealthConcernDetailDialogProps {
  area: SpecialtyClinicalArea;
  imageSrc: string;
  selected: boolean;
  selectedCondition: string;
  onSelectArea: () => void;
  onSelectCondition: (condition: string) => void;
  onContinueToPathways: () => void;
  onClose: () => void;
}

const CARE_STEPS = [
  {
    icon: ClipboardCheck,
    title: "Clinical assessment",
    description: "Your physician reviews symptom patterns, duration, investigations, diagnoses, current medicines and care priorities.",
  },
  {
    icon: Stethoscope,
    title: "Individualized care plan",
    description: "The final pathway, homeopathic prescription, review schedule and professional fee are confirmed after clinical review.",
  },
  {
    icon: HeartHandshake,
    title: "Progress monitoring",
    description: "Follow-ups track meaningful changes, safety, adherence and whether the care plan needs adjustment or referral.",
  },
] as const;

export const HealthConcernDetailDialog: React.FC<HealthConcernDetailDialogProps> = ({
  area,
  imageSrc,
  selected,
  selectedCondition,
  onSelectArea,
  onSelectCondition,
  onContinueToPathways,
  onClose,
}) => {
  const [activeSection, setActiveSection] = useState<"overview" | "conditions" | "plan">("overview");
  const [activeCondition, setActiveCondition] = useState(
    area.conditions.includes(selectedCondition) ? selectedCondition : area.conditions[0]
  );
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.scrollTo({ top: 0 });
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const chooseCondition = (condition: string) => {
    setActiveCondition(condition);
    onSelectCondition(condition);
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm md:items-center md:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="health-concern-dialog-title" className="health-concern-dialog relative max-h-[94vh] w-full max-w-6xl overflow-y-auto rounded-t-[2rem] border border-slate-200 bg-white shadow-2xl md:rounded-[2rem]">
        <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-[var(--store-surface)] px-4 py-3 shadow-sm">
          <button ref={closeButtonRef} type="button" onClick={onClose} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-700 transition-colors hover:bg-slate-50">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to health concerns
          </button>
          <button type="button" onClick={onClose} aria-label="Close health concern information" className="rounded-full border border-slate-200 bg-white p-2 text-slate-700 transition-colors hover:border-mint hover:text-mint-dark">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[400px] overflow-hidden bg-[#071f1a] sm:min-h-[460px] lg:min-h-[700px]">
            <Image src={imageSrc} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" className="scale-110 object-cover opacity-30 blur-2xl" aria-hidden="true" />
            <Image src={imageSrc} alt={`Three-dimensional clinical visualization for ${area.title}`} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain p-2 drop-shadow-[0_18px_36px_rgba(0,0,0,0.4)] md:p-3" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061b17] via-[#061b17]/15 to-transparent" />
            <div className="absolute left-5 top-5 z-10 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 py-1.5 pl-1.5 pr-3 text-white backdrop-blur-md">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white"><Image src="/images/logo.png" alt="" width={27} height={27} className="object-contain" /></span>
              <span className="text-[10px] font-black uppercase tracking-wider">Homeo Healthcare</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-7 text-white md:p-9">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300">{area.specialties.join(" · ")}</span>
              <h2 id="health-concern-dialog-title" className="mt-2 font-serif text-3xl font-semibold leading-tight md:text-4xl">{area.title}</h2>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-emerald-50/90">{area.description}</p>
              <div className="mt-5 flex items-center gap-2 text-[10px] font-bold text-emerald-100">
                <ShieldCheck className="h-4 w-4 text-emerald-300" aria-hidden="true" /> Physician-led · Individualized · Complementary care
              </div>
            </div>
          </div>

          <div className="p-5 md:p-8 lg:p-10">
            <div role="tablist" aria-label={`${area.title} information`} className="grid grid-cols-3 gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1">
              {([['overview', 'Overview'], ['conditions', 'Conditions'], ['plan', 'Care plan']] as const).map(([id, label]) => (
                <button key={id} type="button" role="tab" aria-selected={activeSection === id} onClick={() => setActiveSection(id)} className={`rounded-xl px-3 py-2.5 text-[10px] font-black uppercase tracking-wider transition-colors ${activeSection === id ? "bg-[#1A2421] text-white shadow-sm" : "text-slate-600 hover:bg-white"}`}>
                  {label}
                </button>
              ))}
            </div>

            {activeSection === "overview" && (
              <div className="mt-7 space-y-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-mint">Understanding this health area</span>
                  <h3 className="mt-1 font-serif text-2xl font-bold text-[#1A2421]">A coordinated, whole-person review</h3>
                  <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-600">Patients often experience concerns across more than one system. Your physician considers the main symptoms together with sleep, energy, digestion, emotional wellbeing, medical history and current conventional treatment.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">What we review</span>
                    <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-700">Onset, frequency, triggers, severity, previous treatment response, investigations and how the concern affects daily life.</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">What you receive</span>
                    <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-700">A physician-confirmed starting pathway, transparent care period, review schedule and individualized clinical recommendation.</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-4">
                  <span className="text-xs font-bold text-sky-900">Complementary-care boundary</span>
                  <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-700">{area.supportBoundary}</p>
                </div>
              </div>
            )}

            {activeSection === "conditions" && (
              <div className="mt-7">
                <span className="text-[10px] font-black uppercase tracking-widest text-mint">Common reasons patients enquire</span>
                <h3 className="mt-1 font-serif text-2xl font-bold text-[#1A2421]">Conditions and health concerns</h3>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {area.conditions.map((condition) => (
                    <button key={condition} type="button" aria-pressed={activeCondition === condition} onClick={() => chooseCondition(condition)} className={`flex items-center justify-between gap-3 rounded-2xl border p-3.5 text-left text-xs font-bold transition-all ${activeCondition === condition ? "border-mint bg-mint/10 text-mint-dark ring-1 ring-mint/25" : "border-slate-200 bg-white text-slate-700 hover:border-mint/60"}`}>
                      {condition}{activeCondition === condition && <CheckCircle2 className="h-4 w-4 shrink-0 text-mint" aria-hidden="true" />}
                    </button>
                  ))}
                </div>
                <div className="mt-5 rounded-2xl border border-mint/25 bg-mint/[0.07] p-5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-mint-dark">Selected concern</span>
                  <h4 className="mt-1 text-base font-bold text-[#1A2421]">{activeCondition}</h4>
                  <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-600">A physician review considers whether this concern is established, recurring or part of a wider pattern. Existing diagnoses, investigations and prescribed treatment remain central to safe care planning.</p>
                </div>
              </div>
            )}

            {activeSection === "plan" && (
              <div className="mt-7">
                <span className="text-[10px] font-black uppercase tracking-widest text-mint">Your possible care journey</span>
                <h3 className="mt-1 font-serif text-2xl font-bold text-[#1A2421]">From concern to physician-confirmed plan</h3>
                <div className="mt-5 space-y-3">
                  {CARE_STEPS.map((step, index) => {
                    const Icon = step.icon;
                    return <div key={step.title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mint/10 text-mint-dark"><Icon className="h-5 w-5" aria-hidden="true" /></span><div><span className="text-[9px] font-black uppercase tracking-wider text-mint">Step {index + 1}</span><h4 className="text-sm font-bold text-[#1A2421]">{step.title}</h4><p className="mt-1 text-xs font-semibold leading-relaxed text-slate-600">{step.description}</p></div></div>;
                  })}
                </div>
              </div>
            )}

            <details className="mt-7 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <summary className="flex cursor-pointer list-none items-center gap-2 text-xs font-bold text-[#1A2421]">
                <ShieldCheck className="h-4 w-4 shrink-0 text-mint" aria-hidden="true" /> Safety guidance
              </summary>
              <p className="mt-3 border-t border-slate-200 pt-3 text-[11px] font-semibold leading-relaxed text-slate-600">{area.urgentBoundary}</p>
            </details>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={onSelectArea} className={`flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[10px] font-black uppercase tracking-wider transition-colors ${selected ? "border border-mint bg-mint/10 text-mint-dark" : "bg-mint text-white shadow-md"}`}>
                {selected ? <><CheckCircle2 className="h-4 w-4" /> Health area selected</> : <>Select this health area <ArrowRight className="h-4 w-4" /></>}
              </button>
              <button type="button" onClick={onContinueToPathways} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#1A2421] px-5 py-3.5 text-[10px] font-black uppercase tracking-wider text-white">
                View care pathways <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>,
    document.body
  );
};
