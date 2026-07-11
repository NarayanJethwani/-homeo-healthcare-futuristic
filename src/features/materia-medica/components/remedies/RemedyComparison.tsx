import React from "react";
import { Info, ShieldAlert } from "lucide-react";
import { ComparisonSelection } from "../../search/localSearchTypes";
import { RemedySourceColumn } from "./RemedySourceColumn";
import { ComparisonEmptyState } from "./ComparisonEmptyState";

type RemedyComparisonProps = {
  selections: ComparisonSelection[];
  onRemove: (remedyId: string) => void;
  onReorder: (newSelections: ComparisonSelection[]) => void;
  onOpenInReader: (passageId: string) => void;
};

export const RemedyComparison: React.FC<RemedyComparisonProps> = ({
  selections,
  onRemove,
  onReorder,
  onOpenInReader,
}) => {
  const handleMoveLeft = (remedyId: string) => {
    const idx = selections.findIndex((s) => s.remedyId === remedyId);
    if (idx <= 0) return;
    const updated = [...selections];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    onReorder(updated);
  };

  const handleMoveRight = (remedyId: string) => {
    const idx = selections.findIndex((s) => s.remedyId === remedyId);
    if (idx === -1 || idx >= selections.length - 1) return;
    const updated = [...selections];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    onReorder(updated);
  };

  function getRemedyName(rId: string) {
    if (rId === "aconitum-napellus") return "Aconitum Napellus";
    if (rId === "belladonna") return "Belladonna";
    if (rId === "bryonia") return "Bryonia";
    return rId;
  }

  return (
    <div className="flex flex-col gap-6 w-full select-none" role="region" aria-label="Remedy Comparison Workspace">
      
      {/* Educational Reference Disclaimer (Safety Banner) */}
      <div className="flex items-start gap-3 bg-slate-900 border border-amber-500/20 text-slate-350 p-4 rounded-2xl">
        <ShieldAlert size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
        <div className="text-xs leading-relaxed">
          <strong>Educational Reference Mode Only</strong>: The comparison view is a source-reading and educational tool. It does not generate remedy rankings, prescribing recommendations, treatment advice, AI differential summaries, or clinical probability values.
        </div>
      </div>

      {selections.length === 0 ? (
        <ComparisonEmptyState />
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full overflow-x-auto pb-4" data-lenis-prevent>
          {selections.map((sel, idx) => (
            <RemedySourceColumn
              key={sel.remedyId}
              remedyId={sel.remedyId}
              passageIds={sel.passageIds}
              remedyName={getRemedyName(sel.remedyId)}
              index={idx}
              totalColumns={selections.length}
              onRemove={onRemove}
              onMoveLeft={handleMoveLeft}
              onMoveRight={handleMoveRight}
              onOpenInReader={onOpenInReader}
            />
          ))}
        </div>
      )}

      {/* Limited-corpus warning disclosure */}
      <div className="flex items-start gap-2 bg-slate-950 p-3 rounded-xl border border-slate-900 justify-center">
        <Info size={14} className="text-slate-500 mt-0.5" />
        <span className="text-[10px] text-slate-500 leading-normal">
          Comparing a limited approved sample corpus (max 3 remedies) of Kent's Lectures.
        </span>
      </div>

    </div>
  );
};
export default RemedyComparison;
