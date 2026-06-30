import React from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";

export default function MedicalDisclaimer() {
  return (
    <div className="my-8 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 backdrop-blur-md">
      <div className="flex items-start gap-4">
        <div className="rounded-lg bg-rose-500/10 p-2 text-rose-500">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div>
          <h4 className="font-semibold text-rose-800 dark:text-rose-400 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> Medical Safety Disclaimer
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-rose-900/80 dark:text-rose-300/80">
            All content on the Homeo Healthcare platform is strictly for educational purposes and is
            <strong> not personal medical advice, diagnosis, or treatment</strong>. Homeopathic remedy
            considerations are provided for clinician review or require individualized consultation
            with a qualified physician. Never delay seeking professional medical advice or emergency medical
            care due to content you have read on this website.
          </p>
        </div>
      </div>
    </div>
  );
}
