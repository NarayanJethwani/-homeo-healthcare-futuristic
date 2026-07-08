import React, { useState, useEffect } from "react";
import { KmsKnowledgeEntity, EditorialStatus } from "../types";
import globalKmsRepository from "../repositories/MemoryRepository";
import { EditorialStatusBadge, EvidenceBadge } from "../components/Badge";
import { Search, Filter, Plus, Edit2, Trash2, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

interface EntityRegistryProps {
  onEditEntity: (entity: KmsKnowledgeEntity) => void;
  onCreateEntity: (type: string) => void;
}

export default function EntityRegistry({ onEditEntity, onCreateEntity }: EntityRegistryProps) {
  const [entities, setEntities] = useState<KmsKnowledgeEntity[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [reviewFilter, setReviewFilter] = useState<string>("all");
  
  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadData = async () => {
    const list = await globalKmsRepository.getEntities();
    setEntities(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBulkStatusChange = async (newStatus: EditorialStatus) => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to change the status of ${selectedIds.length} entities to '${newStatus}'?`)) return;

    for (const id of selectedIds) {
      const match = entities.find(e => e.id === id);
      if (match) {
        await globalKmsRepository.saveEntity(
          { ...match, editorialStatus: newStatus },
          "Bulk Editor",
          "Administrator",
          `Bulk status update to '${newStatus}'`
        );
      }
    }
    setSelectedIds([]);
    await loadData();
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to permanently delete ${selectedIds.length} entities?`)) return;

    for (const id of selectedIds) {
      await globalKmsRepository.deleteEntity(id, "Bulk Editor", "Administrator");
    }
    setSelectedIds([]);
    await loadData();
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginated.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginated.map(e => e.id));
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this entity?")) return;
    await globalKmsRepository.deleteEntity(id, "Registry", "Administrator");
    await loadData();
  };

  // Filter items
  const filtered = entities.filter(e => {
    const matchesSearch = 
      e.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || e.editorialStatus === statusFilter;
    const matchesType = typeFilter === "all" || e.entityType === typeFilter;
    
    let matchesReview = true;
    if (reviewFilter === "due") {
      matchesReview = e.nextReviewDate ? new Date(e.nextReviewDate) < new Date() : false;
    } else if (reviewFilter === "upcoming") {
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

  return (
    <div className="space-y-6">
      
      {/* 1. Filtering toolbar controls */}
      <div className="p-4 bg-neutral-900/40 border border-neutral-850 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center flex-1">
          {/* Search bar */}
          <div className="relative min-w-[200px] flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-neutral-500" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search registry..."
              className="w-full text-xs pl-9 pr-3 py-1.5 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-250 focus:outline-none focus:border-cyan-600"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="text-xs px-2.5 py-1.5 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-350 focus:outline-none focus:border-cyan-600"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="medical-review">Medical Review</option>
            <option value="legal-review">Legal Review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }}
            className="text-xs px-2.5 py-1.5 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-350 focus:outline-none focus:border-cyan-600"
          >
            <option value="all">All Types</option>
            <option value="disease">Diseases</option>
            <option value="symptom">Symptoms</option>
            <option value="remedy">Remedies</option>
            <option value="lab-test">Lab Tests</option>
            <option value="faq">FAQs</option>
            <option value="research">Research</option>
            <option value="case-study">Case Studies</option>
          </select>

          {/* Review filter */}
          <select
            value={reviewFilter}
            onChange={e => { setReviewFilter(e.target.value); setCurrentPage(1); }}
            className="text-xs px-2.5 py-1.5 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-350 focus:outline-none focus:border-cyan-600"
          >
            <option value="all">All Review Cycles</option>
            <option value="due">Review Overdue</option>
            <option value="upcoming">Review Due in 30 Days</option>
          </select>
        </div>

        {/* Creation shortcut */}
        <button
          type="button"
          onClick={() => onCreateEntity("disease")}
          className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-[0_2px_8px_rgba(6,182,212,0.2)] transition-all"
        >
          <Plus className="h-4 w-4" /> Add Entity
        </button>
      </div>

      {/* Bulk action toolbar if selections exist */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-cyan-600/10 border border-cyan-500/20 rounded-xl flex items-center justify-between text-xs text-cyan-400">
          <span>{selectedIds.length} entities selected for bulk operations</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkStatusChange("published")}
              className="px-2 py-0.5 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 rounded border border-emerald-500/25 transition-colors"
            >
              Publish Selected
            </button>
            <button
              onClick={() => handleBulkStatusChange("draft")}
              className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 rounded border border-neutral-700 transition-colors"
            >
              Set to Draft
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-2 py-0.5 bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 rounded border border-rose-500/25 transition-colors"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* 2. Main data table */}
      <div className="border border-neutral-850 rounded-2xl bg-neutral-900/40 overflow-hidden backdrop-blur-xl">
        <table className="w-full text-left border-collapse text-xs text-neutral-300">
          <thead>
            <tr className="bg-neutral-950/80 text-[10px] text-neutral-500 uppercase tracking-wider font-bold">
              <th className="p-3.5 w-10 text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.length > 0 && selectedIds.length === paginated.length}
                  onChange={toggleSelectAll}
                  className="rounded bg-neutral-900 border-neutral-850 text-cyan-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
              </th>
              <th className="p-3.5">ID / Name</th>
              <th className="p-3.5">Type</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Evidence</th>
              <th className="p-3.5">Next Review</th>
              <th className="p-3.5 w-24 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-850">
            {paginated.map(e => {
              const isSelected = selectedIds.includes(e.id);
              return (
                <tr key={e.id} className={`hover:bg-neutral-850/30 transition-colors ${
                  isSelected ? "bg-cyan-500/5" : ""
                }`}>
                  <td className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(e.id)}
                      className="rounded bg-neutral-900 border-neutral-805 text-cyan-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                  </td>
                  <td className="p-3">
                    <div className="space-y-0.5">
                      <h5 className="font-semibold text-neutral-200">
                        {e.title.en}
                      </h5>
                      <div className="flex gap-1.5 font-mono text-[9px] text-neutral-500">
                        <span>{e.id}</span>
                        <span>/</span>
                        <span>{e.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 capitalize">{e.entityType}</td>
                  <td className="p-3"><EditorialStatusBadge status={e.editorialStatus} /></td>
                  <td className="p-3"><EvidenceBadge level={e.evidenceLevel} /></td>
                  <td className="p-3 text-neutral-400">
                    {e.nextReviewDate ? new Date(e.nextReviewDate).toLocaleDateString() : "-"}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEditEntity(e)}
                        className="p-1 hover:bg-cyan-500/10 text-neutral-450 hover:text-cyan-400 rounded transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(e.id)}
                        className="p-1 hover:bg-rose-500/10 text-neutral-450 hover:text-rose-500 rounded transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {paginated.length === 0 && (
          <div className="p-12 text-center text-neutral-500 text-xs">
            No entities match current filter constraints.
          </div>
        )}
      </div>

      {/* 3. Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center text-xs text-neutral-400">
          <span>
            Page {currentPage} of {totalPages} &bull; Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filtered.length)} of {filtered.length} entries
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-neutral-850 hover:bg-neutral-850 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-neutral-850 hover:bg-neutral-850 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
