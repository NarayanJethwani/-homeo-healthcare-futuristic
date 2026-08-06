import React from "react";
import { CheckCircle2, Info, PackageCheck } from "lucide-react";
import { INCLUDED_SERVICES_LIST, ADDITIONAL_PRODUCTS_DISCLOSURE } from "../domain/types";

interface IncludedServicesListProps {
  showAdditionalProductsNotice?: boolean;
}

export const IncludedServicesList: React.FC<IncludedServicesListProps> = ({
  showAdditionalProductsNotice = true,
}) => {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white/55 backdrop-blur-md p-6 md:p-8 shadow-sm mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-mint/10 text-mint-dark shrink-0">
          <PackageCheck className="w-6 h-6 text-mint" aria-hidden="true" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-mint uppercase tracking-widest block">Comprehensive Care Included</span>
          <h3 className="font-serif text-2xl font-bold text-[#1A2421]">Included Homeopathic Medicines & Clinical Care Services</h3>
        </div>
      </div>

      <p className="text-sm font-semibold text-slate-600 mb-6 leading-relaxed">
        Every Clinical Care Recommendation prepared by your physician includes complete care management and routine homeopathic medicine supply during your care period:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {INCLUDED_SERVICES_LIST.map((item, index) => (
          <div key={index} className="flex items-start gap-3 p-4 rounded-2xl bg-white/80 border border-slate-200/70 text-xs font-bold text-[#1A2421]">
            <CheckCircle2 className="w-4 h-4 text-mint shrink-0 mt-0.5" aria-hidden="true" />
            <span>{item}</span>
          </div>
        ))}
      </div>

      {showAdditionalProductsNotice && (
        <div className="rounded-2xl bg-sky-50/60 border border-sky-200/70 p-4 text-xs text-slate-700 leading-relaxed flex items-start gap-3">
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <span className="font-bold text-sky-900 block mb-0.5">Additional Prescribed Products (Conditional Notice):</span>
            {ADDITIONAL_PRODUCTS_DISCLOSURE}
          </div>
        </div>
      )}
    </div>
  );
};
