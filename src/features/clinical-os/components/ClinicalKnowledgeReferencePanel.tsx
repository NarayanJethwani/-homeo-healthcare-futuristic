"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ClinicalWorkspaceReferenceView } from "../application/ClinicalKnowledgeReferenceService";

export function ClinicalKnowledgeReferencePanel({ patientId }: { patientId: string }) {
  const [references, setReferences] = useState<ClinicalWorkspaceReferenceView[]>([]);

  useEffect(() => {
    let active = true;
    fetch(`/api/patients/${encodeURIComponent(patientId)}/knowledge-references`, { cache: "no-store" })
      .then(response => response.ok ? response.json() : null)
      .then(payload => {
        if (active && payload?.success && Array.isArray(payload.references)) setReferences(payload.references);
      })
      .catch(() => {
        if (active) setReferences([]);
      });
    return () => { active = false; };
  }, [patientId]);

  if (references.length === 0) return null;
  return (
    <aside aria-labelledby="clinical-knowledge-reference-title" className="rounded-2xl border border-blue-200 bg-blue-50/60 p-3 text-xs dark:border-blue-900/50 dark:bg-blue-950/20">
      <h3 id="clinical-knowledge-reference-title" className="font-bold text-blue-900 dark:text-blue-200">Reviewed Knowledge references</h3>
      <p className="mt-1 text-blue-700 dark:text-blue-400">Read-only references. They do not change scoring, prescriptions, or pricing.</p>
      <ul className="mt-2 space-y-2">
        {references.map(reference => (
          <li key={reference.referenceId}>
            <Link href={reference.route} className="font-semibold text-blue-700 underline-offset-2 hover:underline dark:text-blue-300">
              {reference.title}
            </Link>
            <div className="text-[10px] text-slate-500">{reference.citation}</div>
          </li>
        ))}
      </ul>
    </aside>
  );
}

