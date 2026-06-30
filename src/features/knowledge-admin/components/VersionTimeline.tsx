import React, { useState } from "react";
import { KmsKnowledgeEntity, VersionChangeLog } from "../types";
import { computeEntityDiff, DiffLine } from "../adapters/diff";
import { History, ArrowLeft, RefreshCw } from "lucide-react";

interface VersionTimelineProps {
  entity: KmsKnowledgeEntity;
  onRollback: (snapshot: string, reason: string) => void;
}

export default function VersionTimeline({ entity, onRollback }: VersionTimelineProps) {
  const [selectedLog, setSelectedLog] = useState<VersionChangeLog | null>(null);
  const [rollbackReason, setRollbackReason] = useState("");

  const handleSelectLog = (log: VersionChangeLog) => {
    setSelectedLog(log);
    setRollbackReason(`Rollback to version ${log.version} from ${log.updatedAt}`);
  };

  const executeRollback = () => {
    if (!selectedLog) return;
    onRollback(selectedLog.snapshot, rollbackReason);
    setSelectedLog(null);
  };

  // Render Diff comparison between current version and selected snapshot
  const renderDiffViewer = () => {
    if (!selectedLog) return null;
    let snapshotObj: any = {};
    try {
      snapshotObj = JSON.parse(selectedLog.snapshot);
    } catch {
      return <div className="text-rose-400 text-xs">Error parsing snapshot.</div>;
    }

    const diffMap = computeEntityDiff(snapshotObj, entity);
    const changedFields = Object.keys(diffMap);

    return (
      <div className="space-y-4 p-4 border border-cyan-500/20 bg-neutral-950 rounded-2xl">
        <div className="flex justify-between items-center pb-2 border-b border-neutral-850">
          <button
            type="button"
            onClick={() => setSelectedLog(null)}
            className="text-xs flex items-center gap-1 text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> Back to History
          </button>
          <span className="text-xs font-semibold text-cyan-400">
            Comparing: Selected Snapshot vs Current Version
          </span>
        </div>

        {/* Diff content list */}
        <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
          {changedFields.map(field => (
            <div key={field} className="space-y-1">
              <h5 className="text-[10px] font-bold font-mono text-neutral-400 uppercase tracking-wide">
                Field: {field}
              </h5>
              <div className="border border-neutral-900 rounded-lg overflow-hidden font-mono text-[10px] leading-relaxed divide-y divide-neutral-900">
                {diffMap[field].map((line: DiffLine, idx: number) => {
                  const bg = line.type === "added" 
                    ? "bg-emerald-500/10 text-emerald-400" 
                    : line.type === "removed" 
                      ? "bg-rose-500/10 text-rose-400" 
                      : "bg-transparent text-neutral-400";
                  const prefix = line.type === "added" ? "+" : line.type === "removed" ? "-" : " ";
                  return (
                    <div key={idx} className={`p-1 flex items-start gap-1 ${bg}`}>
                      <span className="opacity-40 shrink-0 select-none w-3 text-center">{prefix}</span>
                      <pre className="whitespace-pre-wrap font-sans text-xs">{line.text}</pre>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {changedFields.length === 0 && (
            <div className="text-center py-8 text-xs text-neutral-500">
              No differences detected between selected snapshot and current content state.
            </div>
          )}
        </div>

        {/* Rollback trigger section */}
        <div className="pt-3 border-t border-neutral-850 flex flex-col gap-2">
          <label className="text-[10px] text-neutral-400 block font-bold">
            Rollback Reason *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={rollbackReason}
              onChange={e => setRollbackReason(e.target.value)}
              placeholder="e.g. Restoring stable medical guidelines..."
              className="flex-1 text-xs px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-200 focus:outline-none focus:border-cyan-600"
            />
            <button
              type="button"
              onClick={executeRollback}
              className="text-xs bg-rose-600/90 hover:bg-rose-600 text-white font-bold px-4 py-1.5 rounded-lg flex items-center gap-1 shadow-[0_2px_10px_rgba(244,63,94,0.2)] transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Rollback
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Main timeline listing
  return (
    <div className="space-y-4">
      {selectedLog ? renderDiffViewer() : (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 pb-2 border-b border-neutral-850">
            <History className="h-4 w-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-neutral-300">
              Changelog & Version Timeline ({entity.versionInfo.changelog?.length || 0} entries)
            </h4>
          </div>

          <div className="relative border-l border-neutral-800 pl-4 ml-2 space-y-4">
            {entity.versionInfo.changelog?.slice().reverse().map((log: VersionChangeLog, idx: number) => (
              <div key={idx} className="relative group">
                {/* Visual marker dot */}
                <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border border-cyan-500 bg-neutral-950 group-hover:scale-125 transition-transform" />
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-neutral-200">
                      Version {log.version || "1.0.0"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSelectLog(log)}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 hover:underline"
                    >
                      Compare & Rollback
                    </button>
                  </div>
                  
                  <p className="text-[10px] text-neutral-400 leading-tight">
                    By <strong>{log.author}</strong> on {new Date(log.updatedAt).toLocaleString()}
                  </p>
                  
                  <div className="text-xs text-neutral-300 italic">
                    "{log.reason}"
                  </div>

                  {log.fieldsChanged && log.fieldsChanged.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {log.fieldsChanged.map((f: string) => (
                        <span key={f} className="text-[9px] font-mono bg-neutral-850 text-neutral-400 px-1.5 py-0.5 rounded">
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
