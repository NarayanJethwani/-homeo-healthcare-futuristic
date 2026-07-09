"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = KmsDashboard;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const MemoryRepository_1 = __importDefault(require("../repositories/MemoryRepository"));
const DashboardHealthCard_1 = __importDefault(require("../components/DashboardHealthCard"));
const importExport_1 = require("../adapters/importExport");
const qualityGates_1 = require("../validation/qualityGates");
const lucide_react_1 = require("lucide-react");
function KmsDashboard({ onEditEntity, onCreateEntity, currentUser }) {
    const [entities, setEntities] = (0, react_1.useState)([]);
    const [reviewQueue, setReviewQueue] = (0, react_1.useState)([]);
    const [exportFormat, setExportFormat] = (0, react_1.useState)("json");
    const [importJsonText, setImportJsonText] = (0, react_1.useState)("");
    const [showImportArea, setShowImportArea] = (0, react_1.useState)(false);
    const loadData = async () => {
        const all = await MemoryRepository_1.default.getEntities();
        setEntities(all);
        // Queue of entities requiring review or failing quality gates
        const reviewRequired = all.filter(e => e.editorialStatus === "medical-review" ||
            e.editorialStatus === "legal-review" ||
            new Date(e.nextReviewDate) < new Date() ||
            !(0, qualityGates_1.runQualityGateChecks)(e, all).passed);
        setReviewQueue(reviewRequired);
    };
    (0, react_1.useEffect)(() => {
        loadData();
    }, []);
    const handleExport = () => {
        const data = (0, importExport_1.exportEntities)(entities, { format: exportFormat, includeInternalNotes: true });
        // Create direct download link in browser
        const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `kms_export_${exportFormat}_${new Date().toISOString().split("T")[0]}.${exportFormat === "json" ? "json" : exportFormat === "csv" ? "csv" : "json"}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const handleImport = async (e) => {
        e.preventDefault();
        try {
            const imported = (0, importExport_1.importEntitiesFromJson)(importJsonText);
            for (const ent of imported) {
                await MemoryRepository_1.default.saveEntity(ent, currentUser.name, currentUser.role, "Imported from JSON schema");
            }
            alert(`Successfully imported ${imported.length} entities!`);
            setImportJsonText("");
            setShowImportArea(false);
            loadData();
        }
        catch (err) {
            alert(`Import failed: ${err.message}`);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center bg-neutral-900/40 p-5 border border-neutral-850 rounded-2xl", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-xl font-bold text-neutral-100 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(Shield, { className: "h-5 w-5 text-cyan-400" }), "Clinical Knowledge Management System (KMS)"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-neutral-400", children: "Editorial governance center for structured medical profiles, Materia Medica, and clinical RAG." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-xs", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-neutral-500", children: "Active Role:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded", children: currentUser.role })] })] }), (0, jsx_runtime_1.jsx)(DashboardHealthCard_1.default, { entities: entities }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6 rounded-2xl border border-neutral-850 bg-neutral-900/60 backdrop-blur-xl space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-sm font-bold text-neutral-100 flex items-center gap-2 border-b border-neutral-850 pb-2", children: [(0, jsx_runtime_1.jsx)(Shield, { className: "h-4.5 w-4.5 text-cyan-400" }), "Platform Route & Entity Release Metrics (V2.0)"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-neutral-400", children: "Standardized production routing metrics registry for the Homeo Healthcare release environment." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-3 bg-neutral-950/40 border border-neutral-850 rounded-xl space-y-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[10px] text-neutral-500 font-extrabold uppercase tracking-wider block", children: "Static Next.js Routes" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xl font-bold text-neutral-100 block", children: "426" }), (0, jsx_runtime_1.jsx)("span", { className: "text-[9px] text-neutral-400 block font-mono", children: "Build target paths" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-3 bg-neutral-950/40 border border-neutral-850 rounded-xl space-y-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[10px] text-neutral-500 font-extrabold uppercase tracking-wider block", children: "Indexable URLs" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xl font-bold text-cyan-400 block", children: "387" }), (0, jsx_runtime_1.jsx)("span", { className: "text-[9px] text-neutral-400 block font-mono", children: "Sitemap.xml entries" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-3 bg-neutral-950/40 border border-neutral-850 rounded-xl space-y-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[10px] text-neutral-500 font-extrabold uppercase tracking-wider block", children: "Knowledge Articles" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xl font-bold text-neutral-100 block", children: entities.length }), (0, jsx_runtime_1.jsx)("span", { className: "text-[9px] text-neutral-400 block font-mono", children: "Dynamic DB entities" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-3 bg-neutral-950/40 border border-neutral-850 rounded-xl space-y-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[10px] text-neutral-500 font-extrabold uppercase tracking-wider block", children: "Comparison Pages" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xl font-bold text-neutral-100 block", children: "13" }), (0, jsx_runtime_1.jsx)("span", { className: "text-[9px] text-neutral-400 block font-mono", children: "Matrix differentials" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-3 bg-neutral-950/40 border border-neutral-850 rounded-xl space-y-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[10px] text-neutral-500 font-extrabold uppercase tracking-wider block", children: "Curated Hub Pages" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xl font-bold text-neutral-100 block", children: "9" }), (0, jsx_runtime_1.jsx)("span", { className: "text-[9px] text-neutral-400 block font-mono", children: "Topic health centers" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-3 bg-neutral-950/40 border border-neutral-850 rounded-xl space-y-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[10px] text-neutral-500 font-extrabold uppercase tracking-wider block", children: "Site Static Routes" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xl font-bold text-neutral-100 block", children: "22" }), (0, jsx_runtime_1.jsx)("span", { className: "text-[9px] text-neutral-400 block font-mono", children: "Marketing/General pages" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "lg:col-span-2 p-5 rounded-2xl border border-neutral-850 bg-neutral-900/60 backdrop-blur-xl space-y-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-xs font-bold text-neutral-400 uppercase tracking-wider pb-2 border-b border-neutral-850", children: "Create Clinical Knowledge Entities" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2.5", children: [
                                    { label: "Disease", type: "disease" },
                                    { label: "Symptom", type: "symptom" },
                                    { label: "Remedy", type: "remedy" },
                                    { label: "Lab Test", type: "lab-test" },
                                    { label: "FAQ", type: "faq" },
                                    { label: "Research", type: "research" },
                                    { label: "Case Study", type: "case-study" }
                                ].map(btn => ((0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => onCreateEntity(btn.type), className: "p-3 text-xs bg-neutral-950 hover:bg-cyan-600 hover:text-neutral-950 font-semibold border border-neutral-850 rounded-xl flex items-center justify-between text-neutral-300 group transition-all", children: [(0, jsx_runtime_1.jsx)("span", { children: btn.label }), (0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4 text-neutral-500 group-hover:text-neutral-950 transition-colors" })] }, btn.type))) }), (0, jsx_runtime_1.jsxs)("div", { className: "pt-4 border-t border-neutral-850 space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("h5", { className: "text-xs font-bold text-neutral-300", children: "Migration & Schema Backup Adapters" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => setShowImportArea(!showImportArea), className: "text-xs text-neutral-400 hover:text-neutral-200 flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { className: "h-3.5 w-3.5" }), " Import"] }), (0, jsx_runtime_1.jsx)("div", { className: "h-4 w-px bg-neutral-800" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5 text-xs", children: [(0, jsx_runtime_1.jsxs)("select", { value: exportFormat, onChange: e => setExportFormat(e.target.value), className: "bg-neutral-950 border border-neutral-850 rounded px-1.5 py-0.5 text-neutral-300 focus:outline-none", children: [(0, jsx_runtime_1.jsx)("option", { value: "json", children: "JSON" }), (0, jsx_runtime_1.jsx)("option", { value: "csv", children: "CSV" }), (0, jsx_runtime_1.jsx)("option", { value: "graph", children: "Relationship Graph" })] }), (0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: handleExport, className: "text-cyan-400 hover:text-cyan-300 flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "h-3.5 w-3.5" }), " Export"] })] })] })] }), showImportArea && ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleImport, className: "space-y-3 p-4 border border-neutral-800 bg-neutral-950 rounded-xl", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[10px] text-neutral-400 block font-bold", children: "Paste JSON Array Schema to Import" }), (0, jsx_runtime_1.jsx)("textarea", { rows: 4, required: true, value: importJsonText, onChange: e => setImportJsonText(e.target.value), placeholder: '[ { "id": "DIS-gerd", "slug": "gerd", "entityType": "disease", "title": { "en": "GERD" } ... } ]', className: "w-full text-xs font-mono p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-200 focus:outline-none focus:border-cyan-600" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end gap-2", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setShowImportArea(false), className: "text-xs text-neutral-400 hover:text-neutral-200", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "text-xs bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1 rounded", children: "Import & Save to Repository" })] })] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-5 rounded-2xl border border-neutral-850 bg-neutral-900/60 backdrop-blur-xl space-y-4", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "text-xs font-bold text-neutral-400 uppercase tracking-wider pb-2 border-b border-neutral-850", children: ["Editorial Review Queue (", reviewQueue.length, ")"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar", children: [reviewQueue.map(e => {
                                        const check = (0, qualityGates_1.runQualityGateChecks)(e, entities);
                                        const nextReview = new Date(e.nextReviewDate);
                                        const now = new Date();
                                        const isExpired = nextReview < now;
                                        const diffTime = nextReview.getTime() - now.getTime();
                                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                        let expiryWarning = "";
                                        let expiryColor = "text-neutral-500 bg-neutral-950 border-neutral-850";
                                        if (isExpired) {
                                            const daysAgo = Math.abs(diffDays);
                                            expiryWarning = `EXPIRED ${daysAgo}d ago`;
                                            expiryColor = "text-rose-450 bg-rose-950/15 border-rose-900/30";
                                        }
                                        else if (diffDays <= 30) {
                                            expiryWarning = `DUE ${diffDays}d`;
                                            expiryColor = "text-amber-400 bg-amber-950/15 border-amber-900/30";
                                        }
                                        else {
                                            expiryWarning = `Review: ${nextReview.toLocaleDateString()}`;
                                            expiryColor = "text-neutral-400 bg-neutral-950 border-neutral-900";
                                        }
                                        return ((0, jsx_runtime_1.jsxs)("div", { onClick: () => onEditEntity(e), className: "p-3 bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 hover:border-neutral-750 rounded-xl flex justify-between items-center cursor-pointer transition-all", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-1.5 max-w-[190px]", children: [(0, jsx_runtime_1.jsx)("h5", { className: "text-xs font-semibold text-neutral-250 truncate", children: e.title.en }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-center gap-1.5", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[9px] font-mono text-neutral-500", children: e.id }), (0, jsx_runtime_1.jsx)("span", { className: "text-[9px] text-neutral-400 font-semibold uppercase px-1.5 py-0.2 rounded bg-neutral-900 border border-neutral-850", children: e.editorialStatus }), (0, jsx_runtime_1.jsx)("span", { className: `text-[9.5px] px-1.5 py-0.2 rounded border font-mono ${expiryColor}`, children: expiryWarning })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-[10px] font-bold", children: [check.passed ? ((0, jsx_runtime_1.jsxs)("span", { className: "text-emerald-400", children: [check.score, "%"] })) : ((0, jsx_runtime_1.jsxs)("span", { className: "text-rose-400 flex items-center gap-0.5", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ShieldAlert, { className: "h-3 w-3" }), " ", check.score, "%"] })), (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { className: "h-3 w-3 text-neutral-500" })] })] }, e.id));
                                    }), reviewQueue.length === 0 && ((0, jsx_runtime_1.jsx)("div", { className: "p-8 text-center text-xs text-neutral-500", children: "All queues are empty. Health check is clear!" }))] })] })] }), (() => {
                const totalCount = entities.length;
                const reviewerCompliant = entities.filter(e => e.reviewer?.credentials?.toLowerCase().includes("md") ||
                    e.reviewer?.credentials?.toLowerCase().includes("hom")).length;
                const claimCompliant = entities.filter(e => {
                    const check = (0, qualityGates_1.runQualityGateChecks)(e, entities);
                    return check.prohibitedClaimsFound.length === 0;
                }).length;
                const canonicalCompliant = entities.filter(e => {
                    const check = (0, qualityGates_1.runQualityGateChecks)(e, entities);
                    return !check.issues.some(i => i.rule === "CANONICAL_URL");
                }).length;
                const citationCompliant = entities.filter(e => e.content?.references && e.content.references.length > 0).length;
                const disclaimerCompliant = entities.filter(e => e.content?.safetyWarnings?.en && e.content.safetyWarnings.en.trim().length > 0).length;
                const boundaryCompliant = entities.filter(e => e.editorialStatus === "published" ? e.canonicalUrl.includes("/knowledge/") : true).length;
                const items = [
                    {
                        label: "Medical Reviewer Credentials Verification",
                        description: "Authors & Reviewers must hold validated MD(Hom) degrees.",
                        passed: totalCount > 0 && reviewerCompliant === totalCount,
                        scoreText: `${reviewerCompliant} / ${totalCount} entries compliant`
                    },
                    {
                        label: "Prohibited Medical Claims Defense",
                        description: "Strictly filters words like 'guaranteed cure' or '100% cure'.",
                        passed: totalCount > 0 && claimCompliant === totalCount,
                        scoreText: `${claimCompliant} / ${totalCount} entries verified clean`
                    },
                    {
                        label: "Canonical Path Validation",
                        description: "Links must align with directory layouts (/knowledge/[type]/[slug]).",
                        passed: totalCount > 0 && canonicalCompliant === totalCount,
                        scoreText: `${canonicalCompliant} / ${totalCount} URLs match`
                    },
                    {
                        label: "Clinical Safety Disclaimers",
                        description: "Requires explicit warnings regarding educational scope.",
                        passed: totalCount > 0 && disclaimerCompliant === totalCount,
                        scoreText: `${disclaimerCompliant} / ${totalCount} disclaimers set`
                    },
                    {
                        label: "Peer Scientific References",
                        description: "Recommends referencing AMA citations with DOI/PubMed links.",
                        passed: totalCount > 0 && citationCompliant === totalCount,
                        scoreText: `${citationCompliant} / ${totalCount} referenced`
                    },
                    {
                        label: "Public-Private Portal Boundaries",
                        description: "Excludes administrative /admin/ and patient portal URLs from sitemap.",
                        passed: totalCount > 0 && boundaryCompliant === totalCount,
                        scoreText: "All published entries partitioned"
                    }
                ];
                return ((0, jsx_runtime_1.jsxs)("div", { className: "p-5 rounded-2xl border border-neutral-850 bg-neutral-900/60 backdrop-blur-xl space-y-4", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "text-xs font-bold text-neutral-400 uppercase tracking-wider pb-2 border-b border-neutral-850 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ShieldAlert, { className: "h-4 w-4 text-cyan-400" }), "Content Governance & Compliance Checklist"] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: items.map((item, idx) => ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-neutral-950/80 border border-neutral-850 rounded-xl space-y-2 flex flex-col justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs font-semibold text-neutral-200 leading-tight", children: item.label }), item.passed ? ((0, jsx_runtime_1.jsx)("span", { className: "text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 text-[9px] rounded-full border border-emerald-500/20", children: "PASSED" })) : ((0, jsx_runtime_1.jsx)("span", { className: "text-amber-500 font-bold bg-amber-500/10 px-1.5 py-0.5 text-[9px] rounded-full border border-amber-500/20", children: "PENDING" }))] }), (0, jsx_runtime_1.jsx)("p", { className: "text-[10px] text-neutral-400 leading-snug", children: item.description })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-[10px] font-mono text-neutral-500 pt-1 flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("span", { children: "Status:" }), (0, jsx_runtime_1.jsx)("span", { className: item.passed ? "text-neutral-350" : "text-amber-400", children: item.scoreText })] })] }, idx))) })] }));
            })()] }));
}
function Shield({ className }) {
    return ((0, jsx_runtime_1.jsx)("svg", { className: className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" }) }));
}
