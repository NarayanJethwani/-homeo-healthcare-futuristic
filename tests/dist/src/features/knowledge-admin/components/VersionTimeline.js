"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VersionTimeline;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const diff_1 = require("../adapters/diff");
const lucide_react_1 = require("lucide-react");
function VersionTimeline({ entity, onRollback }) {
    const [selectedLog, setSelectedLog] = (0, react_1.useState)(null);
    const [rollbackReason, setRollbackReason] = (0, react_1.useState)("");
    const handleSelectLog = (log) => {
        setSelectedLog(log);
        setRollbackReason(`Rollback to version ${log.version} from ${log.updatedAt}`);
    };
    const executeRollback = () => {
        if (!selectedLog)
            return;
        onRollback(selectedLog.snapshot, rollbackReason);
        setSelectedLog(null);
    };
    // Render Diff comparison between current version and selected snapshot
    const renderDiffViewer = () => {
        if (!selectedLog)
            return null;
        let snapshotObj = {};
        try {
            snapshotObj = JSON.parse(selectedLog.snapshot);
        }
        catch {
            return (0, jsx_runtime_1.jsx)("div", { className: "text-rose-400 text-xs", children: "Error parsing snapshot." });
        }
        const diffMap = (0, diff_1.computeEntityDiff)(snapshotObj, entity);
        const changedFields = Object.keys(diffMap);
        return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4 p-4 border border-cyan-500/20 bg-neutral-950 rounded-2xl", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center pb-2 border-b border-neutral-850", children: [(0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => setSelectedLog(null), className: "text-xs flex items-center gap-1 text-neutral-400 hover:text-neutral-200 transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { className: "h-3 w-3" }), " Back to History"] }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs font-semibold text-cyan-400", children: "Comparing: Selected Snapshot vs Current Version" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2", children: [changedFields.map(field => ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsxs)("h5", { className: "text-[10px] font-bold font-mono text-neutral-400 uppercase tracking-wide", children: ["Field: ", field] }), (0, jsx_runtime_1.jsx)("div", { className: "border border-neutral-900 rounded-lg overflow-hidden font-mono text-[10px] leading-relaxed divide-y divide-neutral-900", children: diffMap[field].map((line, idx) => {
                                        const bg = line.type === "added"
                                            ? "bg-emerald-500/10 text-emerald-400"
                                            : line.type === "removed"
                                                ? "bg-rose-500/10 text-rose-400"
                                                : "bg-transparent text-neutral-400";
                                        const prefix = line.type === "added" ? "+" : line.type === "removed" ? "-" : " ";
                                        return ((0, jsx_runtime_1.jsxs)("div", { className: `p-1 flex items-start gap-1 ${bg}`, children: [(0, jsx_runtime_1.jsx)("span", { className: "opacity-40 shrink-0 select-none w-3 text-center", children: prefix }), (0, jsx_runtime_1.jsx)("pre", { className: "whitespace-pre-wrap font-sans text-xs", children: line.text })] }, idx));
                                    }) })] }, field))), changedFields.length === 0 && ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-8 text-xs text-neutral-500", children: "No differences detected between selected snapshot and current content state." }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "pt-3 border-t border-neutral-850 flex flex-col gap-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-[10px] text-neutral-400 block font-bold", children: "Rollback Reason *" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: rollbackReason, onChange: e => setRollbackReason(e.target.value), placeholder: "e.g. Restoring stable medical guidelines...", className: "flex-1 text-xs px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-200 focus:outline-none focus:border-cyan-600" }), (0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: executeRollback, className: "text-xs bg-rose-600/90 hover:bg-rose-600 text-white font-bold px-4 py-1.5 rounded-lg flex items-center gap-1 shadow-[0_2px_10px_rgba(244,63,94,0.2)] transition-all", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "h-3.5 w-3.5" }), " Rollback"] })] })] })] }));
    };
    // Main timeline listing
    return ((0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: selectedLog ? renderDiffViewer() : ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5 pb-2 border-b border-neutral-850", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.History, { className: "h-4 w-4 text-cyan-400" }), (0, jsx_runtime_1.jsxs)("h4", { className: "text-xs font-bold text-neutral-300", children: ["Changelog & Version Timeline (", entity.versionInfo.changelog?.length || 0, " entries)"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "relative border-l border-neutral-800 pl-4 ml-2 space-y-4", children: entity.versionInfo.changelog?.slice().reverse().map((log, idx) => ((0, jsx_runtime_1.jsxs)("div", { className: "relative group", children: [(0, jsx_runtime_1.jsx)("span", { className: "absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border border-cyan-500 bg-neutral-950 group-hover:scale-125 transition-transform" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-xs font-bold text-neutral-200", children: ["Version ", log.version || "1.0.0"] }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => handleSelectLog(log), className: "text-[10px] text-cyan-400 hover:text-cyan-300 hover:underline", children: "Compare & Rollback" })] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-[10px] text-neutral-400 leading-tight", children: ["By ", (0, jsx_runtime_1.jsx)("strong", { children: log.author }), " on ", new Date(log.updatedAt).toLocaleString()] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-neutral-300 italic", children: ["\"", log.reason, "\""] }), log.fieldsChanged && log.fieldsChanged.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-1 pt-1", children: log.fieldsChanged.map((f) => ((0, jsx_runtime_1.jsx)("span", { className: "text-[9px] font-mono bg-neutral-850 text-neutral-400 px-1.5 py-0.5 rounded", children: f }, f))) }))] })] }, idx))) })] })) }));
}
