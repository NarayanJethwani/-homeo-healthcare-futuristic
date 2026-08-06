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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-10">
      <div className="flex items-center gap-2.5 mb-4">
        <PackageCheck className="w-5 h-5 text-emerald-600" aria-hidden="true" />
        <h3 className="text-lg font-bold text-slate-900">Included Homeopathic Medicines & Clinical Care Services</h3>
      </div>

      <p className="text-xs text-slate-600 mb-5 leading-relaxed">
        Every Clinical Care Recommendation prepared by your physician includes complete care management and routine homeopathic medicine supply during your care period:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {INCLUDED_SERVICES_LIST.map((item, index) => (
          <div key={index} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{item}</span>
          </div>
        ))}
      </div>

      {showAdditionalProductsNotice && (
        <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 text-xs text-slate-600 leading-relaxed flex items-start gap-2.5">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <span className="font-semibold text-slate-800 block mb-0.5">Additional Prescribed Products (Conditional Notice):</span>
            {ADDITIONAL_PRODUCTS_DISCLOSURE}
          </div>
        </div>
      )}
    </div>
  );
};
