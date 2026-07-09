"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EntityRegistry;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const MemoryRepository_1 = __importDefault(require("../repositories/MemoryRepository"));
const Badge_1 = require("../components/Badge");
const lucide_react_1 = require("lucide-react");
function EntityRegistry({ onEditEntity, onCreateEntity }) {
    const [entities, setEntities] = (0, react_1.useState)([]);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    const [statusFilter, setStatusFilter] = (0, react_1.useState)("all");
    const [typeFilter, setTypeFilter] = (0, react_1.useState)("all");
    const [reviewFilter, setReviewFilter] = (0, react_1.useState)("all");
    // Selection for bulk actions
    const [selectedIds, setSelectedIds] = (0, react_1.useState)([]);
    // Pagination
    const [currentPage, setCurrentPage] = (0, react_1.useState)(1);
    const itemsPerPage = 8;
    const loadData = async () => {
        const list = await MemoryRepository_1.default.getEntities();
        setEntities(list);
    };
    (0, react_1.useEffect)(() => {
        loadData();
    }, []);
    const handleBulkStatusChange = async (newStatus) => {
        if (selectedIds.length === 0)
            return;
        if (!confirm(`Are you sure you want to change the status of ${selectedIds.length} entities to '${newStatus}'?`))
            return;
        for (const id of selectedIds) {
            const match = entities.find(e => e.id === id);
            if (match) {
                await MemoryRepository_1.default.saveEntity({ ...match, editorialStatus: newStatus }, "Bulk Editor", "Administrator", `Bulk status update to '${newStatus}'`);
            }
        }
        setSelectedIds([]);
        await loadData();
    };
    const handleBulkDelete = async () => {
        if (selectedIds.length === 0)
            return;
        if (!confirm(`Are you sure you want to permanently delete ${selectedIds.length} entities?`))
            return;
        for (const id of selectedIds) {
            await MemoryRepository_1.default.deleteEntity(id, "Bulk Editor", "Administrator");
        }
        setSelectedIds([]);
        await loadData();
    };
    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(x => x !== id));
        }
        else {
            setSelectedIds([...selectedIds, id]);
        }
    };
    const toggleSelectAll = () => {
        if (selectedIds.length === paginated.length) {
            setSelectedIds([]);
        }
        else {
            setSelectedIds(paginated.map(e => e.id));
        }
    };
    const handleDeleteItem = async (id) => {
        if (!confirm("Are you sure you want to permanently delete this entity?"))
            return;
        await MemoryRepository_1.default.deleteEntity(id, "Registry", "Administrator");
        await loadData();
    };
    // Filter items
    const filtered = entities.filter(e => {
        const matchesSearch = e.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.slug.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || e.editorialStatus === statusFilter;
        const matchesType = typeFilter === "all" || e.entityType === typeFilter;
        let matchesReview = true;
        if (reviewFilter === "due") {
            matchesReview = e.nextReviewDate ? new Date(e.nextReviewDate) < new Date() : false;
        }
        else if (reviewFilter === "upcoming") {
            const now = new Date();
            const in30Days = new Date();
            in30Days.setDate(now.getDate() + 30);
            matchesReview = e.nextReviewDate ? (new Date(e.nextReviewDate) >= now && new Date(e.nextReviewDate) <= in30Days) : false;
        }
        return matchesSearch && matchesStatus && matchesType && matchesReview;
    });
    // Paginated chunk
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-neutral-900/40 border border-neutral-850 rounded-2xl flex flex-wrap gap-4 items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-2 items-center flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative min-w-[200px] flex-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "h-4 w-4 text-neutral-500" }) }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: searchTerm, onChange: e => { setSearchTerm(e.target.value); setCurrentPage(1); }, placeholder: "Search registry...", className: "w-full text-xs pl-9 pr-3 py-1.5 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-250 focus:outline-none focus:border-cyan-600" })] }), (0, jsx_runtime_1.jsxs)("select", { value: statusFilter, onChange: e => { setStatusFilter(e.target.value); setCurrentPage(1); }, className: "text-xs px-2.5 py-1.5 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-350 focus:outline-none focus:border-cyan-600", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Statuses" }), (0, jsx_runtime_1.jsx)("option", { value: "draft", children: "Draft" }), (0, jsx_runtime_1.jsx)("option", { value: "medical-review", children: "Medical Review" }), (0, jsx_runtime_1.jsx)("option", { value: "legal-review", children: "Legal Review" }), (0, jsx_runtime_1.jsx)("option", { value: "published", children: "Published" }), (0, jsx_runtime_1.jsx)("option", { value: "archived", children: "Archived" })] }), (0, jsx_runtime_1.jsxs)("select", { value: typeFilter, onChange: e => { setTypeFilter(e.target.value); setCurrentPage(1); }, className: "text-xs px-2.5 py-1.5 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-350 focus:outline-none focus:border-cyan-600", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Types" }), (0, jsx_runtime_1.jsx)("option", { value: "disease", children: "Diseases" }), (0, jsx_runtime_1.jsx)("option", { value: "symptom", children: "Symptoms" }), (0, jsx_runtime_1.jsx)("option", { value: "remedy", children: "Remedies" }), (0, jsx_runtime_1.jsx)("option", { value: "lab-test", children: "Lab Tests" }), (0, jsx_runtime_1.jsx)("option", { value: "faq", children: "FAQs" }), (0, jsx_runtime_1.jsx)("option", { value: "research", children: "Research" }), (0, jsx_runtime_1.jsx)("option", { value: "case-study", children: "Case Studies" })] }), (0, jsx_runtime_1.jsxs)("select", { value: reviewFilter, onChange: e => { setReviewFilter(e.target.value); setCurrentPage(1); }, className: "text-xs px-2.5 py-1.5 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-350 focus:outline-none focus:border-cyan-600", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Review Cycles" }), (0, jsx_runtime_1.jsx)("option", { value: "due", children: "Review Overdue" }), (0, jsx_runtime_1.jsx)("option", { value: "upcoming", children: "Review Due in 30 Days" })] })] }), (0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => onCreateEntity("disease"), className: "text-xs bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-[0_2px_8px_rgba(6,182,212,0.2)] transition-all", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4" }), " Add Entity"] })] }), selectedIds.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "p-3 bg-cyan-600/10 border border-cyan-500/20 rounded-xl flex items-center justify-between text-xs text-cyan-400", children: [(0, jsx_runtime_1.jsxs)("span", { children: [selectedIds.length, " entities selected for bulk operations"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => handleBulkStatusChange("published"), className: "px-2 py-0.5 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 rounded border border-emerald-500/25 transition-colors", children: "Publish Selected" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleBulkStatusChange("draft"), className: "px-2 py-0.5 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 rounded border border-neutral-700 transition-colors", children: "Set to Draft" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleBulkDelete, className: "px-2 py-0.5 bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 rounded border border-rose-500/25 transition-colors", children: "Delete Selected" })] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "border border-neutral-850 rounded-2xl bg-neutral-900/40 overflow-hidden backdrop-blur-xl", children: [(0, jsx_runtime_1.jsxs)("table", { className: "w-full text-left border-collapse text-xs text-neutral-300", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { className: "bg-neutral-950/80 text-[10px] text-neutral-500 uppercase tracking-wider font-bold", children: [(0, jsx_runtime_1.jsx)("th", { className: "p-3.5 w-10 text-center", children: (0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: selectedIds.length > 0 && selectedIds.length === paginated.length, onChange: toggleSelectAll, className: "rounded bg-neutral-900 border-neutral-850 text-cyan-600 focus:ring-0 focus:ring-offset-0 cursor-pointer" }) }), (0, jsx_runtime_1.jsx)("th", { className: "p-3.5", children: "ID / Name" }), (0, jsx_runtime_1.jsx)("th", { className: "p-3.5", children: "Type" }), (0, jsx_runtime_1.jsx)("th", { className: "p-3.5", children: "Status" }), (0, jsx_runtime_1.jsx)("th", { className: "p-3.5", children: "Evidence" }), (0, jsx_runtime_1.jsx)("th", { className: "p-3.5", children: "Next Review" }), (0, jsx_runtime_1.jsx)("th", { className: "p-3.5 w-24 text-right", children: "Actions" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "divide-y divide-neutral-850", children: paginated.map(e => {
                                    const isSelected = selectedIds.includes(e.id);
                                    return ((0, jsx_runtime_1.jsxs)("tr", { className: `hover:bg-neutral-850/30 transition-colors ${isSelected ? "bg-cyan-500/5" : ""}`, children: [(0, jsx_runtime_1.jsx)("td", { className: "p-3 w-10 text-center", children: (0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: isSelected, onChange: () => toggleSelect(e.id), className: "rounded bg-neutral-900 border-neutral-805 text-cyan-600 focus:ring-0 focus:ring-offset-0 cursor-pointer" }) }), (0, jsx_runtime_1.jsx)("td", { className: "p-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-0.5", children: [(0, jsx_runtime_1.jsx)("h5", { className: "font-semibold text-neutral-200", children: e.title.en }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-1.5 font-mono text-[9px] text-neutral-500", children: [(0, jsx_runtime_1.jsx)("span", { children: e.id }), (0, jsx_runtime_1.jsx)("span", { children: "/" }), (0, jsx_runtime_1.jsx)("span", { children: e.slug })] })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "p-3 capitalize", children: e.entityType }), (0, jsx_runtime_1.jsx)("td", { className: "p-3", children: (0, jsx_runtime_1.jsx)(Badge_1.EditorialStatusBadge, { status: e.editorialStatus }) }), (0, jsx_runtime_1.jsx)("td", { className: "p-3", children: (0, jsx_runtime_1.jsx)(Badge_1.EvidenceBadge, { level: e.evidenceLevel }) }), (0, jsx_runtime_1.jsx)("td", { className: "p-3 text-neutral-400", children: e.nextReviewDate ? new Date(e.nextReviewDate).toLocaleDateString() : "-" }), (0, jsx_runtime_1.jsx)("td", { className: "p-3 text-right", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end gap-1.5", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => onEditEntity(e), className: "p-1 hover:bg-cyan-500/10 text-neutral-450 hover:text-cyan-400 rounded transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Edit2, { className: "h-3.5 w-3.5" }) }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => handleDeleteItem(e.id), className: "p-1 hover:bg-rose-500/10 text-neutral-450 hover:text-rose-500 rounded transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "h-3.5 w-3.5" }) })] }) })] }, e.id));
                                }) })] }), paginated.length === 0 && ((0, jsx_runtime_1.jsx)("div", { className: "p-12 text-center text-neutral-500 text-xs", children: "No entities match current filter constraints." }))] }), totalPages > 1 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center text-xs text-neutral-400", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Page ", currentPage, " of ", totalPages, " \u2022 Showing ", startIndex + 1, "-", Math.min(startIndex + itemsPerPage, filtered.length), " of ", filtered.length, " entries"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-1.5", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setCurrentPage(prev => Math.max(1, prev - 1)), disabled: currentPage === 1, className: "p-1.5 rounded-lg border border-neutral-850 hover:bg-neutral-850 disabled:opacity-40 disabled:hover:bg-transparent transition-all", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronLeft, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setCurrentPage(prev => Math.min(totalPages, prev + 1)), disabled: currentPage === totalPages, className: "p-1.5 rounded-lg border border-neutral-850 hover:bg-neutral-850 disabled:opacity-40 disabled:hover:bg-transparent transition-all", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { className: "h-4 w-4" }) })] })] }))] }));
}
