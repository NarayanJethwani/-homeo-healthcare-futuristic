import React from "react";
import { CLINICAL_REPERTORY_WORKSPACE_SECTIONS } from "./workspaceModel";
import { CLINICAL_WORKSPACE_SAFETY_NOTICE, ClinicalWorkspaceSectionId } from "./types";
import { ClinicalSafetyBadge } from "../components/ClinicalSafetyBadge";

export interface ClinicalRepertoryWorkspaceProps {
  children?: React.ReactNode;
  renderSection?: (sectionId: ClinicalWorkspaceSectionId) => React.ReactNode;
}

export function ClinicalRepertoryWorkspace({ children, renderSection }: ClinicalRepertoryWorkspaceProps) {
  if (children) {
    return (
      <section className="space-y-5" data-clinical-workspace="unified">
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Unified Clinical Repertory Workspace</p>
              <h2 className="mt-1 text-lg font-black text-slate-950">Dr. Jethwani Clinical Repertory</h2>
            </div>
            <ClinicalSafetyBadge />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-5 xl:grid-cols-10">
            {CLINICAL_REPERTORY_WORKSPACE_SECTIONS.map((section, index) => (
              <div
                key={section.id}
                data-clinical-section-marker={section.id}
                className="rounded-2xl border border-slate-100 bg-slate-50/70 px-3 py-2"
              >
                <div className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                  {String(index + 1).padStart(2, "0")} · {section.stage}
                </div>
                <div className="mt-1 text-[10px] font-black leading-tight text-slate-800">
                  {section.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
          {CLINICAL_WORKSPACE_SAFETY_NOTICE}.
        </div>

        {children}
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
        {CLINICAL_WORKSPACE_SAFETY_NOTICE}.
      </div>

      <div className="space-y-5">
        {CLINICAL_REPERTORY_WORKSPACE_SECTIONS.map((section) => (
          <section key={section.id} data-clinical-section={section.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3">
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">{section.stage}</p>
              <h3 className="text-base font-black text-slate-900">{section.title}</h3>
            </div>
            {renderSection ? (
              renderSection(section.id)
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                Section ready for incremental integration.
              </div>
            )}
          </section>
        ))}
      </div>
    </section>
  );
}

