"use client";

import React from "react";
import { usePatientMode, AudienceMode } from "../context/PatientModeContext";
import { User, GraduationCap, Stethoscope } from "lucide-react";

export default function PatientModeToggle() {
  const { audienceMode, setAudienceMode } = usePatientMode();

  const options: { id: AudienceMode; label: string; icon: any }[] = [
    { id: "patient", label: "Patient", icon: <User className="h-3.5 w-3.5" /> },
    { id: "student", label: "Student", icon: <GraduationCap className="h-3.5 w-3.5" /> },
    { id: "practitioner", label: "Practitioner", icon: <Stethoscope className="h-3.5 w-3.5" /> }
  ];

  return (
    <div className="flex items-center gap-0.5 bg-neutral-100 dark:bg-neutral-900 p-0.5 border border-neutral-200 dark:border-neutral-850 rounded-xl print-hide">
      {options.map(opt => {
        const isSelected = audienceMode === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => setAudienceMode(opt.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide transition-all cursor-pointer ${
              isSelected
                ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20"
                : "bg-transparent text-neutral-500 hover:text-neutral-750 dark:hover:text-neutral-350"
            }`}
          >
            {opt.icon}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
