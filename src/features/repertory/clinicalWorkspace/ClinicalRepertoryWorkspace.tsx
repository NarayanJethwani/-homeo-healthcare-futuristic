import React from "react";
import { CLINICAL_REPERTORY_WORKSPACE_SECTIONS } from "./workspaceModel";
import { CLINICAL_WORKSPACE_SAFETY_NOTICE, ClinicalWorkspaceSectionId } from "./types";

export interface ClinicalRepertoryWorkspaceProps {
  renderSection?: (sectionId: ClinicalWorkspaceSectionId) => React.ReactNode;
}

export function ClinicalRepertoryWorkspace({ renderSection }: ClinicalRepertoryWorkspaceProps) {
  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
        {CLINICAL_WORKSPACE_SAFETY_NOTICE}
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

