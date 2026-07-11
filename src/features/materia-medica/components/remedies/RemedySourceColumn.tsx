import React, { useState, useEffect } from "react";
import { Loader2, AlertTriangle, ShieldCheck, ArrowLeftRight, Trash2 } from "lucide-react";
import { SampleMateriaMedicaPassage } from "../../types";
import { GovernedMateriaMedicaRepository } from "../../services/GovernedMateriaMedicaRepository";
import { computeSha256Browser } from "../../services/checksum/checksum.browser";
import { RemedyPassageCitation } from "./RemedyPassageCitation";

type RemedySourceColumnProps = {
  remedyId: string;
  passageIds: string[];
  remedyName: string;
  index: number;
  totalColumns: number;
  onRemove: (remedyId: string) => void;
  onMoveLeft?: (remedyId: string) => void;
  onMoveRight?: (remedyId: string) => void;
  onOpenInReader: (passageId: string) => void;
};

type ColumnState =
  | { status: "loading" }
  | { status: "verifying" }
  | { status: "verified"; passages: SampleMateriaMedicaPassage[] }
  | { status: "failed"; reason: "checksum" | "unapproved" | "deprecated" | "empty" };

export const RemedySourceColumn: React.FC<RemedySourceColumnProps> = ({
  remedyId,
  passageIds,
  remedyName,
  index,
  totalColumns,
  onRemove,
  onMoveLeft,
  onMoveRight,
  onOpenInReader,
}) => {
  const [colState, setColState] = useState<ColumnState>({ status: "loading" });

  useEffect(() => {
    let active = true;
    const fetchAndReverify = async () => {
      setColState({ status: "loading" });
      if (passageIds.length === 0) {
        if (active) setColState({ status: "failed", reason: "empty" });
        return;
      }

      try {
        const loadedPassages: SampleMateriaMedicaPassage[] = [];
        
        for (const pId of passageIds) {
          const passage = await GovernedMateriaMedicaRepository.getApprovedPassage(pId);
          if (!passage) {
            if (active) setColState({ status: "failed", reason: "unapproved" });
            return;
          }

          if (active) setColState({ status: "verifying" });

          // Cryptographic re-verification
          const computedOriginalHash = await computeSha256Browser(passage.originalText);
          const computedNormalizedHash = await computeSha256Browser(passage.normalizedText);
          const computedBlocksHash = await computeSha256Browser(JSON.stringify(passage.blocks));

          const isValid =
            computedOriginalHash === passage.originalTextChecksum &&
            computedNormalizedHash === passage.normalizedTextChecksum &&
            computedBlocksHash === passage.blocksChecksum;

          if (!isValid) {
            if (active) setColState({ status: "failed", reason: "checksum" });
            return;
          }

          loadedPassages.push(passage);
        }

        if (active) setColState({ status: "verified", passages: loadedPassages });
      } catch (e) {
        if (active) setColState({ status: "failed", reason: "checksum" });
      }
    };

    fetchAndReverify();
    return () => {
      active = false;
    };
  }, [passageIds]);

  const renderContent = () => {
    switch (colState.status) {
      case "loading":
      case "verifying":
        return (
          <div className="flex flex-col items-center justify-center p-12 text-slate-500 bg-slate-950/20 border border-slate-900 rounded-2xl h-80 gap-2">
            <Loader2 size={24} className="animate-spin text-amber-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Verifying Proving...</span>
          </div>
        );
      case "failed":
        return (
          <div className="flex flex-col items-center justify-center text-center p-6 text-rose-500 border border-rose-950/40 bg-rose-950/5 rounded-2xl h-80 gap-2 select-text">
            <AlertTriangle size={24} />
            <span className="text-xs font-bold">Content unavailable — integrity verification failed.</span>
            <p className="text-[10px] text-slate-500 max-w-[200px]">
              This remedy passage was not displayed because it failed cryptographic revalidation checks.
            </p>
          </div>
        );
      case "verified":
        return (
          <div className="flex flex-col gap-6">
            {colState.passages.map((passage) => (
              <div key={passage.id} className="flex flex-col gap-4 border-b border-slate-900 pb-6 last:border-b-0">
                
                {/* Passage Section Label */}
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 bg-slate-950 p-2 rounded border border-slate-900">
                  Kent's Lectures (1911)
                </div>

                {/* Proving Text blocks */}
                <div className="space-y-4 font-serif text-xs text-slate-350 leading-relaxed max-h-[350px] overflow-y-auto pr-1 select-text" data-lenis-prevent>
                  {passage.blocks.map((block, bIdx) => {
                    if (block.type === "heading") {
                      return <h5 key={bIdx} className="text-amber-500 font-serif font-bold text-sm mt-4">{block.text}</h5>;
                    }
                    if (block.type === "section-label") {
                      return <h6 key={bIdx} className="text-slate-400 font-serif font-bold text-[11px] mt-2 uppercase tracking-wide">{block.text}</h6>;
                    }
                    return <p key={bIdx} className="text-[12px]">{block.text}</p>;
                  })}
                </div>

                {/* Citation */}
                <RemedyPassageCitation passage={passage} />

                {/* Reader Link */}
                <button
                  onClick={() => onOpenInReader(passage.id)}
                  className="w-full text-center py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-100 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Open full lecture
                </button>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col bg-slate-900/30 border border-slate-850 p-5 rounded-2xl gap-4 flex-1 min-w-[280px]">
      
      {/* Column Action Bar */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
        <div>
          <h3 className="text-base font-serif font-bold text-slate-200">
            {remedyName}
          </h3>
          <span className="text-[9px] text-slate-500 font-mono">
            ID: {remedyId}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {onMoveLeft && index > 0 && (
            <button
              onClick={() => onMoveLeft(remedyId)}
              className="p-1 rounded bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
              aria-label="Move column left"
            >
              <ArrowLeftRight size={12} className="transform rotate-180" />
            </button>
          )}
          
          {onMoveRight && index < totalColumns - 1 && (
            <button
              onClick={() => onMoveRight(remedyId)}
              className="p-1 rounded bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
              aria-label="Move column right"
            >
              <ArrowLeftRight size={12} />
            </button>
          )}

          <button
            onClick={() => onRemove(remedyId)}
            className="p-1 rounded bg-slate-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-500 transition-all cursor-pointer"
            aria-label="Remove remedy column"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {renderContent()}

    </div>
  );
};
export default RemedySourceColumn;
