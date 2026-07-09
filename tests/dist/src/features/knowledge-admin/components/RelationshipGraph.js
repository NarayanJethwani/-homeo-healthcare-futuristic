"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RelationshipGraph;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const relationshipSuggestions_1 = require("../validation/relationshipSuggestions");
const lucide_react_1 = require("lucide-react");
function RelationshipGraph({ entity, allEntities, onLink, onUnlink }) {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    const [activeTypeFilter, setActiveTypeFilter] = (0, react_1.useState)("all");
    const suggestions = (0, relationshipSuggestions_1.getRelationshipSuggestions)(entity, allEntities);
    const getIcon = (type) => {
        switch (type) {
            case "disease": return (0, jsx_runtime_1.jsx)(lucide_react_1.Stethoscope, { className: "h-4 w-4 text-rose-500" });
            case "symptom": return (0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "h-4 w-4 text-amber-500" });
            case "remedy": return (0, jsx_runtime_1.jsx)(lucide_react_1.Heart, { className: "h-4 w-4 text-emerald-500" });
            case "lab-test": return (0, jsx_runtime_1.jsx)(lucide_react_1.Beaker, { className: "h-4 w-4 text-blue-500" });
            case "faq": return (0, jsx_runtime_1.jsx)(lucide_react_1.HelpCircle, { className: "h-4 w-4 text-purple-500" });
            case "research": return (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-4 w-4 text-indigo-500" });
            case "case-study": return (0, jsx_runtime_1.jsx)(lucide_react_1.UserCheck, { className: "h-4 w-4 text-cyan-400" });
            default: return (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-4 w-4 text-neutral-500" });
        }
    };
    const getPluralHeader = (type) => {
        switch (type) {
            case "disease": return "Diseases";
            case "symptom": return "Symptoms";
            case "remedy": return "Remedies";
            case "lab-test": return "Lab Tests";
            case "faq": return "FAQs";
            case "research": return "Research Papers";
            case "case-study": return "Case Studies";
            default: return "Related";
        }
    };
    // Find linked entities objects
    const linkedObjects = allEntities.filter(e => entity.relatedEntities.includes(e.id));
    // Search items to link
    const linkablePool = allEntities.filter(e => e.id !== entity.id &&
        !entity.relatedEntities.includes(e.id) &&
        (activeTypeFilter === "all" || e.entityType === activeTypeFilter) &&
        (e.title.en.toLowerCase().includes(searchTerm.toLowerCase()) || e.id.toLowerCase().includes(searchTerm.toLowerCase())));
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [suggestions.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 border border-amber-500/20 bg-amber-500/5 rounded-2xl space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5 text-amber-400", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Lightbulb, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("h4", { className: "text-xs font-bold uppercase tracking-wider", children: "Smart Relationship Suggestions" })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2", children: suggestions.map(sug => ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center gap-2 p-2 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-amber-500/40 transition-colors", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [getIcon(sug.type), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-0.5 leading-none", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs font-semibold text-neutral-200 block truncate max-w-[180px]", children: sug.title }), (0, jsx_runtime_1.jsxs)("span", { className: "text-[8px] text-neutral-400 font-mono", children: [sug.reason, " \u2022 ", Math.round(sug.confidence * 100), "% Match"] })] })] }), (0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => onLink(sug.entityId), className: "text-xs bg-amber-500/20 hover:bg-amber-500/40 text-amber-400 px-2 py-0.5 rounded border border-amber-500/25 flex items-center gap-0.5 transition-all", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-3 w-3" }), " Link"] })] }, sug.entityId))) })] })), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "text-xs font-bold text-neutral-350", children: ["Active Knowledge Mappings (", linkedObjects.length, " Connections)"] }), linkedObjects.length > 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2", children: linkedObjects.map(obj => ((0, jsx_runtime_1.jsxs)("div", { className: "p-2.5 bg-neutral-900 border border-neutral-850 rounded-xl flex justify-between items-center hover:border-neutral-700 transition-colors", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2.5", children: [getIcon(obj.entityType), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[9px] font-bold text-neutral-500 block uppercase tracking-wider", children: getPluralHeader(obj.entityType) }), (0, jsx_runtime_1.jsx)("h5", { className: "text-xs font-semibold text-neutral-200", children: obj.title.en })] })] }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => onUnlink(obj.id), className: "text-neutral-500 hover:text-rose-500 p-1", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "h-3.5 w-3.5" }) })] }, obj.id))) })) : ((0, jsx_runtime_1.jsx)("div", { className: "p-6 border border-dashed border-neutral-850 rounded-2xl text-center text-xs text-neutral-500", children: "No active connections configured. Link symptoms, indicated remedies, or diagnostic tests below." }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3 border-t border-neutral-850 pt-5", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-xs font-bold text-neutral-300", children: "Establish New Clinical Connection" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: searchTerm, onChange: e => setSearchTerm(e.target.value), placeholder: "Search entity name or ID...", className: "w-full text-xs px-3 py-1.5 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200 focus:outline-none focus:border-cyan-600 sm:col-span-2" }), (0, jsx_runtime_1.jsxs)("select", { value: activeTypeFilter, onChange: e => setActiveTypeFilter(e.target.value), className: "w-full text-xs px-2.5 py-1.5 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-300 focus:outline-none focus:border-cyan-600", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Types" }), (0, jsx_runtime_1.jsx)("option", { value: "disease", children: "Diseases" }), (0, jsx_runtime_1.jsx)("option", { value: "symptom", children: "Symptoms" }), (0, jsx_runtime_1.jsx)("option", { value: "remedy", children: "Remedies" }), (0, jsx_runtime_1.jsx)("option", { value: "lab-test", children: "Lab Tests" }), (0, jsx_runtime_1.jsx)("option", { value: "faq", children: "FAQs" }), (0, jsx_runtime_1.jsx)("option", { value: "research", children: "Research Summary" }), (0, jsx_runtime_1.jsx)("option", { value: "case-study", children: "Case Studies" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "max-h-48 overflow-y-auto border border-neutral-850 rounded-xl bg-neutral-950 divide-y divide-neutral-900 custom-scrollbar", children: [linkablePool.map(item => ((0, jsx_runtime_1.jsxs)("div", { onClick: () => onLink(item.id), className: "p-2.5 flex justify-between items-center hover:bg-neutral-900 cursor-pointer transition-colors", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [getIcon(item.entityType), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h5", { className: "text-xs font-semibold text-neutral-200", children: item.title.en }), (0, jsx_runtime_1.jsxs)("span", { className: "text-[9px] font-mono text-neutral-500", children: [item.id, " (", item.entityType, ")"] })] })] }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: "text-xs bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600 hover:text-neutral-950 font-bold px-2 py-0.5 rounded transition-all", children: "Link" })] }, item.id))), linkablePool.length === 0 && ((0, jsx_runtime_1.jsx)("div", { className: "p-4 text-center text-xs text-neutral-500", children: "No matching matching entities available." }))] })] })] }));
}
