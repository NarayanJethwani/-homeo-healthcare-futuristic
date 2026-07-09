"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReferencePicker;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const MemoryRepository_1 = __importDefault(require("../repositories/MemoryRepository"));
const lucide_react_1 = require("lucide-react");
function ReferencePicker({ selectedIds, onChange }) {
    const [citations, setCitations] = (0, react_1.useState)([]);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    const [showAddForm, setShowAddForm] = (0, react_1.useState)(false);
    // New citation form
    const [newTitle, setNewTitle] = (0, react_1.useState)("");
    const [newAuthors, setNewAuthors] = (0, react_1.useState)("");
    const [newJournal, setNewJournal] = (0, react_1.useState)("");
    const [newDoi, setNewDoi] = (0, react_1.useState)("");
    const [newPubmed, setNewPubmed] = (0, react_1.useState)("");
    const [newYear, setNewYear] = (0, react_1.useState)(new Date().getFullYear());
    const loadCitations = async () => {
        const list = await MemoryRepository_1.default.getCitations();
        setCitations(list);
    };
    (0, react_1.useEffect)(() => {
        loadCitations();
    }, []);
    const handleToggle = (id) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter(x => x !== id));
        }
        else {
            onChange([...selectedIds, id]);
        }
    };
    const handleAddNew = async (e) => {
        e.preventDefault();
        if (!newTitle.trim())
            return;
        const newId = `CIT-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
        const citation = {
            id: newId,
            title: newTitle,
            authors: newAuthors.split(",").map(a => a.trim()).filter(Boolean),
            journal: newJournal,
            doi: newDoi || undefined,
            pubmedId: newPubmed || undefined,
            year: Number(newYear),
            citationStyle: "AMA",
            usageCount: 0,
            linkedEntities: []
        };
        await MemoryRepository_1.default.saveCitation(citation);
        await loadCitations();
        // Select the newly added reference
        onChange([...selectedIds, newId]);
        // Reset Form
        setNewTitle("");
        setNewAuthors("");
        setNewJournal("");
        setNewDoi("");
        setNewPubmed("");
        setShowAddForm(false);
    };
    const filtered = citations.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.authors.some(a => a.toLowerCase().includes(searchTerm.toLowerCase())));
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("label", { className: "text-sm font-bold text-neutral-300", children: ["Scientific References & Citations (", selectedIds.length, " Linked)"] }), (0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => setShowAddForm(!showAddForm), className: "text-xs flex items-center gap-1 bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-400 px-2 py-1 rounded border border-cyan-500/20 transition-all", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-3 w-3" }), " New Reference"] })] }), showAddForm && ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleAddNew, className: "p-4 border border-cyan-500/20 bg-cyan-500/5 rounded-xl space-y-3", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-xs font-bold text-cyan-400", children: "Add New Reference to Registry" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[10px] text-neutral-400 block", children: "Title *" }), (0, jsx_runtime_1.jsx)("input", { type: "text", required: true, value: newTitle, onChange: e => setNewTitle(e.target.value), placeholder: "e.g. Constitutional treatment of GERD...", className: "w-full text-xs px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-neutral-200 focus:outline-none focus:border-cyan-500" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[10px] text-neutral-400 block", children: "Authors (Comma separated)" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: newAuthors, onChange: e => setNewAuthors(e.target.value), placeholder: "e.g. Jethwani N., Sharma R.", className: "w-full text-xs px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-neutral-200 focus:outline-none" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[10px] text-neutral-400 block", children: "Journal Name" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: newJournal, onChange: e => setNewJournal(e.target.value), placeholder: "e.g. Int J Hom Res", className: "w-full text-xs px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-neutral-200 focus:outline-none" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-3 gap-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[10px] text-neutral-400 block", children: "DOI" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: newDoi, onChange: e => setNewDoi(e.target.value), placeholder: "10.1007...", className: "w-full text-xs px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-neutral-200" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[10px] text-neutral-400 block", children: "PubMed ID" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: newPubmed, onChange: e => setNewPubmed(e.target.value), placeholder: "34892...", className: "w-full text-xs px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-neutral-200" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[10px] text-neutral-400 block", children: "Year" }), (0, jsx_runtime_1.jsx)("input", { type: "number", value: newYear, onChange: e => setNewYear(Number(e.target.value)), className: "w-full text-xs px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-neutral-200" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end gap-2 pt-1", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setShowAddForm(false), className: "text-xs text-neutral-400 hover:text-neutral-200", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "text-xs bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1 rounded", children: "Register & Add" })] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("span", { className: "absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "h-3.5 w-3.5 text-neutral-500" }) }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: searchTerm, onChange: e => setSearchTerm(e.target.value), placeholder: "Search central citation registry...", className: "w-full text-xs pl-8 pr-3 py-1.5 bg-neutral-900 border border-neutral-850 rounded-lg text-neutral-200 focus:outline-none focus:border-cyan-600" })] }), selectedIds.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-1", children: selectedIds.map(id => {
                    const match = citations.find(c => c.id === id);
                    return ((0, jsx_runtime_1.jsxs)("span", { className: "inline-flex items-center gap-1 text-[10px] bg-neutral-800 border border-neutral-750 text-cyan-400 px-2 py-0.5 rounded-full", children: [id, ": ", match ? match.title.substring(0, 30) + "..." : "", (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => handleToggle(id), className: "text-neutral-500 hover:text-rose-500 font-bold ml-1", children: "\u00D7" })] }, id));
                }) })), (0, jsx_runtime_1.jsxs)("div", { className: "max-h-48 overflow-y-auto border border-neutral-850 rounded-lg bg-neutral-950 divide-y divide-neutral-900 custom-scrollbar", children: [filtered.map(c => {
                        const isSelected = selectedIds.includes(c.id);
                        return ((0, jsx_runtime_1.jsxs)("div", { onClick: () => handleToggle(c.id), className: "p-2.5 flex justify-between items-center hover:bg-neutral-900 cursor-pointer transition-colors", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-0.5 pr-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[10px] font-mono text-neutral-500", children: c.id }), (0, jsx_runtime_1.jsx)("h5", { className: "text-xs font-semibold text-neutral-200 leading-tight", children: c.title })] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-[10px] text-neutral-400", children: [c.authors.join(", "), " \u2022 ", (0, jsx_runtime_1.jsx)("i", { children: c.journal }), " (", c.year, ")"] })] }), (0, jsx_runtime_1.jsx)("div", { className: `h-4 w-4 rounded-full border flex items-center justify-center transition-all ${isSelected ? "border-cyan-500 bg-cyan-600 text-neutral-950" : "border-neutral-750"}`, children: isSelected && (0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: "h-3 w-3 stroke-[3]" }) })] }, c.id));
                    }), filtered.length === 0 && ((0, jsx_runtime_1.jsx)("div", { className: "p-4 text-center text-xs text-neutral-500", children: "No matching citations found in registry." }))] })] }));
}
