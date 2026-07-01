import React from 'react';
import { GitCommit } from 'lucide-react';

export const ReasoningTimeline: React.FC = () => {
  const steps = [
    { title: 'Suppression Triggers', desc: 'Suppressed skin eruptions, sweat, or emotional grievances.' },
    { title: 'Digestive & Visceral Levels', desc: 'Internalization into functional digestive or respiratory disturbances.' },
    { title: 'Skin & Surface Manifestations', desc: 'Outward projection of chronic load onto skin or mucosal linings.' },
    { title: 'Structural & Joint Involvements', desc: 'Deepening into joints, nerves, and fibrous tissues.' },
    { title: 'Current Constitutional State', desc: 'Final adaptation involving thermals, thirst, sleep, and core mental generals.' }
  ];

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs text-left">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <GitCommit className="w-4 h-4 text-emerald-500" />
          Clinical Timeline & Progression
        </h3>
        <span className="text-[8px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200 font-mono">
          For clinician review only
        </span>
      </div>

      <div className="text-[10px] text-amber-700/85 font-semibold bg-amber-50/60 border border-amber-200/50 p-3 rounded-2xl">
        ⚠️ Clinical reasoning support for clinician review only. Do not prescribe automatically.
      </div>

      <div className="space-y-4 relative pl-4 border-l border-slate-200 ml-2 pt-2">
        {steps.map((step, idx) => (
          <div key={idx} className="relative space-y-1">
            <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
            <div className="text-[10px] font-black text-slate-800">{step.title}</div>
            <div className="text-[9px] text-slate-500 font-semibold">{step.desc}</div>
          </div>
        ))}
      </div>
      
      <div className="bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-2xl text-[9px] text-emerald-800 font-semibold text-center">
        💡 Hering's Law Check: Healing proceeds from above downward, from within outward, and in reverse order of appearance of symptoms.
      </div>
    </div>
  );
};
