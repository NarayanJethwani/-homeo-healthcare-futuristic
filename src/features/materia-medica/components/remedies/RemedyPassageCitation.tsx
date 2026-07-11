import React from "react";
import { FileText, ShieldAlert } from "lucide-react";
import { SampleMateriaMedicaPassage } from "../../types";

type RemedyPassageCitationProps = {
  passage: SampleMateriaMedicaPassage;
};

export const RemedyPassageCitation: React.FC<RemedyPassageCitationProps> = ({ passage }) => {
  return (
    <div className="flex flex-col gap-2 p-3 bg-slate-950/60 border border-slate-900 rounded-xl select-none">
      
      {/* Citation Metadata */}
      <div className="flex flex-col gap-1 text-[10px] text-slate-500 font-mono">
        <div className="flex justify-between">
          <span>Printed Page Range:</span>
          <span className="text-slate-400 font-bold">
            Pages {passage.sourcePageRange.printedPageStart}-{passage.sourcePageRange.printedPageEnd}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Scan Page Index:</span>
          <span className="text-slate-400 font-bold">
            Index {passage.sourcePageRange.scanPageIndexStart}-{passage.sourcePageRange.scanPageIndexEnd}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Reviewer Actor:</span>
          <span className="text-slate-400 font-bold">
            {passage.review.actorUid}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Verification Date:</span>
          <span className="text-slate-400 font-bold">
            {new Date(passage.review.completedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Integrity Badge */}
      <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase bg-slate-950 border border-amber-500/20 text-amber-500 px-2 py-0.5 rounded w-fit">
        <FileText size={11} />
        <span>Verified Integrity</span>
      </div>

    </div>
  );
};
export default RemedyPassageCitation;
