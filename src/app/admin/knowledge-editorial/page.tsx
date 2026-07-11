"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  globalKmsRepository,
  KmsKnowledgeEntity,
  ReviewStatus,
  HealthIndicator,
  searchConsoleAdapter,
  analyticsAdapter,
  LandingPagePerf,
  SearchConsoleSummary,
  ArticleAnalytics,
  EngagementMismatch,
  getEditorialTasks,
  createEditorialTask,
  assignEditorialTask,
  transitionTaskStatus,
  getWorkflowEvents,
  generateAutomaticCurationTasks,
  isFirestoreWorkflowActive,
  EDITORIAL_REVIEWERS,
  cmsClient,
  EditorialTask,
  EditorialWorkflowEvent,
  EditorialTaskStatus,
  EditorialTaskPriority,
  EditorialTaskType,
  CmsArticleDraft
} from "@/features/knowledge-admin";
import {
  LayoutDashboard,
  ChevronLeft,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Edit2,
  Check,
  RefreshCw,
  TrendingUp,
  Compass,
  Globe,
  Clock,
  Sparkles,
  SearchCode,
  ShieldAlert,
  Activity,
  BookOpen,
  Database,
  Save
} from "lucide-react";
import { AdminRole, Permission, hasPermission } from "@/lib/security/rbac";

interface UserSession {
  uid: string;
  email: string;
  name: string;
  role: "admin" | "doctor" | AdminRole;
}

export default function KnowledgeEditorialPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [entities, setEntities] = useState<KmsKnowledgeEntity[]>([]);
  const [loading, setLoading] = useState(true);

  // Tabs for the editorial workspace
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<"governance" | "cornerstone" | "seo" | "analytics" | "tasks" | "rag">("governance");

  // RAG Index Health states
  const [ragStats, setRagStats] = useState<any>(null);
  const [ragQueue, setRagQueue] = useState<any[]>([]);
  const [ragStale, setRagStale] = useState<any[]>([]);
  const [isRagLoading, setIsRagLoading] = useState(false);
  const [ragActionMessage, setRagActionMessage] = useState<string | null>(null);

  // Workflow & task management states
  const [tasks, setTasks] = useState<EditorialTask[]>([]);
  const [workflowEvents, setWorkflowEvents] = useState<EditorialWorkflowEvent[]>([]);
  const [isTasksLoading, setIsTasksLoading] = useState(false);
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  const [selectedTask, setSelectedTask] = useState<EditorialTask | null>(null);
  const [assigneeName, setAssigneeName] = useState("");
  const [assigneeRole, setAssigneeRole] = useState("Reviewer");
  const [taskNote, setTaskNote] = useState("");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [transitionStatusField, setTransitionStatusField] = useState<EditorialTaskStatus>("backlog");
  const [persistenceMode, setPersistenceMode] = useState<"Firestore workflow mode" | "Session workflow mode">("Session workflow mode");

  const userHasPermission = (perm: Permission) => {
    if (!session?.role) return false;
    return hasPermission(session.role, perm);
  };

  const renderAccessDenied = (permissionNeeded: string) => (
    <div className="bg-neutral-950 border border-neutral-850 p-8 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 max-w-lg mx-auto my-12">
      <ShieldAlert className="h-12 w-12 text-rose-500" />
      <h3 className="text-lg font-bold text-slate-200">Access Denied</h3>
      <p className="text-xs text-slate-400">
        Your assigned role <span className="text-rose-400 font-semibold uppercase">{session?.role}</span> lacks the required <span className="text-rose-400 font-semibold">{permissionNeeded}</span> privilege key to view this administrative tab surface.
      </p>
    </div>
  );

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCitationHealth, setFilterCitationHealth] = useState<string>("all");
  const [filterSeoStatus, setFilterSeoStatus] = useState<string>("all");
  const [filterCornerstone, setFilterCornerstone] = useState<string>("all");
  const [filterDueReview, setFilterDueReview] = useState<string>("all");
  const [filterMissingReviewer, setFilterMissingReviewer] = useState<string>("all");
  const [filterMissingReferences, setFilterMissingReferences] = useState<string>("all");

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<KmsKnowledgeEntity | null>(null);
  
  // AI Assist & Quality states
  const [activeModalTab, setActiveModalTab] = useState<"general" | "ai" | "draft" | "clinical-review" | "evidence" | "timeline" | "publish">("general");
  const [isGeneratingSummaries, setIsGeneratingSummaries] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);

  // CMS state variables
  const [draftContentField, setDraftContentField] = useState("");
  const [patientSummaryField, setPatientSummaryField] = useState("");
  const [practitionerSummaryField, setPractitionerSummaryField] = useState("");
  const [educationalSummaryField, setEducationalSummaryField] = useState("");
  const [currentDraft, setCurrentDraft] = useState<any | null>(null);
  const [versionsList, setVersionsList] = useState<any[]>([]);
  const [isLoadingCms, setIsLoadingCms] = useState(false);
  const [publishingErrors, setPublishingErrors] = useState<string[] | null>(null);
  const [publicationSuccess, setPublicationSuccess] = useState(false);

  // Reviewer form states
  const [clinicalReviewerName, setClinicalReviewerName] = useState("");
  const [clinicalReviewerRole, setClinicalReviewerRole] = useState("Clinical Reviewer");
  const [clinicalReviewDate, setClinicalReviewDate] = useState("");
  const [clinicalNextReviewDate, setClinicalNextReviewDate] = useState("");
  const [clinicalNotes, setClinicalNotes] = useState("");

  // Evidence profile form states
  const [evidenceStrength, setEvidenceStrength] = useState("moderate");
  const [sourceQuality, setSourceQuality] = useState("primary");
  const [clinicalConfidence, setClinicalConfidence] = useState(75);
  const [editorialConfidence, setEditorialConfidence] = useState(80);
  const [reviewIntervalDays, setReviewIntervalDays] = useState(365);
  const [reviewGracePeriodDays, setReviewGracePeriodDays] = useState(90);
  const [reviewExpiryPolicy, setReviewExpiryPolicy] = useState("ranking-penalty");
  const [evidenceRationale, setEvidenceRationale] = useState("");
  const [classicalSource, setClassicalSource] = useState(false);
  const [modernSource, setModernSource] = useState(false);

  // Publish details
  const [changeSummary, setChangeSummary] = useState("");
  const [isSyncingVector, setIsSyncingVector] = useState(false);
  const [vectorSyncMessage, setVectorSyncMessage] = useState<string | null>(null);
  const [auditComplianceIssues, setAuditComplianceIssues] = useState<string[]>([]);

  // Adapter telemetry states
  const [scSummary, setScSummary] = useState<SearchConsoleSummary | null>(null);
  const [scTopPages, setScTopPages] = useState<LandingPagePerf[]>([]);
  const [scLowCtr, setScLowCtr] = useState<LandingPagePerf[]>([]);
  const [scPoorRank, setScPoorRank] = useState<LandingPagePerf[]>([]);
  const [scImprovements, setScImprovements] = useState<any[]>([]);

  const [analyticsSum, setAnalyticsSum] = useState<any | null>(null);
  const [analyticsTopArticles, setAnalyticsTopArticles] = useState<ArticleAnalytics[]>([]);
  const [analyticsSearches, setAnalyticsSearches] = useState<any[]>([]);
  const [analyticsHighTrafficLowEngagement, setAnalyticsHighTrafficLowEngagement] = useState<EngagementMismatch[]>([]);
  const [analyticsLowTrafficHighImportance, setAnalyticsLowTrafficHighImportance] = useState<EngagementMismatch[]>([]);

  // Check login session
  useEffect(() => {
    const saved = localStorage.getItem("admin_session");
    if (!saved) {
      router.push("/admin/login");
    } else {
      try {
        setSession(JSON.parse(saved));
      } catch {
        router.push("/admin/login");
      }
    }
  }, [router]);

  // Fetch initial data
  const loadEntitiesData = async () => {
    try {
      const data = await globalKmsRepository.getEntities();
      setEntities(data);
    } catch (e) {
      console.error("Failed to load knowledge KMS entities", e);
    } finally {
      setLoading(false);
    }
  };

  const loadAdapterData = async () => {
    // Load SEO telemetry
    const summary = await searchConsoleAdapter.getSummary();
    const topPages = await searchConsoleAdapter.getTopLandingPages();
    const lowCtr = await searchConsoleAdapter.getPagesWithLowCtr();
    const poorRank = await searchConsoleAdapter.getPagesWithImpressionsButPoorRanking();
    const metaImps = await searchConsoleAdapter.getPagesNeedingTitleMetaImprovement();

    setScSummary(summary);
    setScTopPages(topPages);
    setScLowCtr(lowCtr);
    setScPoorRank(poorRank);
    setScImprovements(metaImps);

    // Load Engagement telemetry
    const aSummary = await analyticsAdapter.getSummary();
    const aTop = await analyticsAdapter.getMostReadArticles();
    const aQuery = await analyticsAdapter.getCommonSearchQueries();
    const aHighLow = await analyticsAdapter.getHighTrafficLowEngagementArticles();
    const aLowHigh = await analyticsAdapter.getLowTrafficHighImportanceArticles();

    setAnalyticsSum(aSummary);
    setAnalyticsTopArticles(aTop);
    setAnalyticsSearches(aQuery);
    setAnalyticsHighTrafficLowEngagement(aHighLow);
    setAnalyticsLowTrafficHighImportance(aLowHigh);
  };

  const loadWorkflowData = async () => {
    setIsTasksLoading(true);
    try {
      const list = await getEditorialTasks();
      setTasks(list);
      const evs = await getWorkflowEvents();
      setWorkflowEvents(evs);
      const isFirestore = await isFirestoreWorkflowActive();
      setPersistenceMode(isFirestore ? "Firestore workflow mode" : "Session workflow mode");
    } catch (e) {
      console.error("Failed to load workflow tasks", e);
    } finally {
      setIsTasksLoading(false);
    }
  };

  const triggerAutoTaskGeneration = async () => {
    if (!userHasPermission("WORKFLOW_ASSIGN")) {
      alert("Error: You do not have the required WORKFLOW_ASSIGN permission to perform this action.");
      return;
    }
    setIsGeneratingTasks(true);
    try {
      // Gather active entities to calculate checklist issues
      const data = await globalKmsRepository.getEntities();
      await generateAutomaticCurationTasks(data, session?.name || "System Scheduler");
      await loadWorkflowData();
    } catch (e) {
      console.error("Auto task generation failed", e);
    } finally {
      setIsGeneratingTasks(false);
    }
  };

  const handleAssignTask = async (taskId: string) => {
    if (!userHasPermission("WORKFLOW_ASSIGN")) {
      alert("Error: You do not have the required WORKFLOW_ASSIGN permission to perform this action.");
      return;
    }
    if (!assigneeName) return;
    const ok = await assignEditorialTask(taskId, assigneeName, assigneeRole, session?.name || "Administrator");
    if (ok) {
      setAssigneeName("");
      setIsTaskModalOpen(false);
      await loadWorkflowData();
    }
  };

  const handleTransitionStatus = async (taskId: string, status: EditorialTaskStatus) => {
    if (!userHasPermission("WORKFLOW_ASSIGN")) {
      alert("Error: You do not have the required WORKFLOW_ASSIGN permission to perform this action.");
      return;
    }
    const ok = await transitionTaskStatus(taskId, status, session?.name || "Administrator", taskNote);
    if (ok) {
      setTaskNote("");
      setIsTaskModalOpen(false);
      await loadWorkflowData();
    }
  };

  useEffect(() => {
    loadEntitiesData();
    loadAdapterData();
    fetchRagHealth();
    loadWorkflowData();
  }, []);

  useEffect(() => {
    if (activeWorkspaceTab === "tasks") {
      loadWorkflowData();
    }
  }, [activeWorkspaceTab]);

  async function fetchRagHealth() {
    setIsRagLoading(true);
    try {
      const res = await fetch("/api/admin/observability/rag-health");
      const data = await res.json();
      if (data.success) {
        setRagStats(data.stats);
        setRagQueue(data.queue || []);
        setRagStale(data.stale || []);
      }
    } catch (err) {
      console.error("Failed to fetch RAG Health:", err);
    } finally {
      setIsRagLoading(false);
    }
  }

  const handleRagAction = async (action: "processQueue" | "retryFailedJobs" | "reindexStale") => {
    if (!userHasPermission("RAG_INDEX_MANAGE")) {
      alert("Error: You do not have the required RAG_INDEX_MANAGE permission to perform this action.");
      return;
    }
    setIsRagLoading(true);
    setRagActionMessage(null);
    try {
      const res = await fetch("/api/admin/observability/rag-health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (data.success) {
        setRagActionMessage(`✓ Action "${action}" completed successfully.`);
        await fetchRagHealth();
      } else {
        setRagActionMessage(`❌ Action failed: ${data.error}`);
      }
    } catch (err: any) {
      setRagActionMessage(`❌ Network error: ${err.message}`);
    } finally {
      setIsRagLoading(false);
    }
  };

  useEffect(() => {
    if (activeWorkspaceTab === "rag") {
      fetchRagHealth();
    }
  }, [activeWorkspaceTab]);

  // Action: Mark as Clinically Reviewed
  const handleMarkReviewed = async (id: string) => {
    const target = entities.find(e => e.id === id);
    if (!target) return;

    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    const updated: KmsKnowledgeEntity = {
      ...target,
      reviewStatus: "clinically-reviewed",
      lastClinicalReview: new Date().toISOString().split("T")[0],
      nextClinicalReview: nextYear.toISOString().split("T")[0],
      lastUpdated: new Date().toISOString()
    };

    // Update locally and in MemoryRepo
    await globalKmsRepository.saveEntity(updated, session?.name || "Dr. Narayan Jethwani", "Reviewer", "Marked as reviewed from editorial cockpit");
    
    // Update local react state
    setEntities(prev => prev.map(e => e.id === id ? updated : e));
  };

  // Action: Flag for update
  const handleFlagForUpdate = async (id: string) => {
    const target = entities.find(e => e.id === id);
    if (!target) return;

    const updated: KmsKnowledgeEntity = {
      ...target,
      reviewStatus: "update-required",
      lastUpdated: new Date().toISOString()
    };

    await globalKmsRepository.saveEntity(updated, session?.name || "Dr. Narayan Jethwani", "Reviewer", "Flagged for content update");
    setEntities(prev => prev.map(e => e.id === id ? updated : e));
  };

  // Action: Save Edit Modal changes
  const handleSaveMetadataChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntity) return;

    // Defensive validation for dates
    const lastRev = editingEntity.lastClinicalReview;
    const nextRev = editingEntity.nextClinicalReview;
    const refUpd = editingEntity.referencesUpdated;

    if (lastRev && isNaN(Date.parse(lastRev))) {
      alert("Invalid Last Clinical Review Date format. Please select or enter a valid date.");
      return;
    }
    if (nextRev && isNaN(Date.parse(nextRev))) {
      alert("Invalid Next Clinical Review Date format. Please select or enter a valid date.");
      return;
    }
    if (refUpd && isNaN(Date.parse(refUpd))) {
      alert("Invalid References Verified Date format. Please select or enter a valid date.");
      return;
    }

    const updated = {
      ...editingEntity,
      lastUpdated: new Date().toISOString()
    };

    // Save in Repository
    await globalKmsRepository.saveEntity(updated, session?.name || "Dr. Narayan Jethwani", "Reviewer", "Metadata edit in editorial dashboard");
    
    // Update React State
    setEntities(prev => prev.map(item => item.id === editingEntity.id ? updated : item));
    setIsEditModalOpen(false);
    setEditingEntity(null);
  };

  const openCmsEditor = async (entity: KmsKnowledgeEntity) => {
    setEditingEntity(entity);
    setIsLoadingCms(true);
    setPublishingErrors(null);
    setPublicationSuccess(false);
    setActiveModalTab("general");
    
    // Clear/default clinical reviewer form
    setClinicalReviewerName("");
    setClinicalReviewerRole("Clinical Reviewer");
    setClinicalReviewDate(new Date().toISOString().split("T")[0]);
    
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    setClinicalNextReviewDate(nextYear.toISOString().split("T")[0]);
    setClinicalNotes("");
    setChangeSummary("");

    // Clear/default evidence form
    setEvidenceStrength("moderate");
    setSourceQuality("primary");
    setClinicalConfidence(75);
    setEditorialConfidence(80);
    setReviewIntervalDays(365);
    setReviewGracePeriodDays(90);
    setReviewExpiryPolicy("ranking-penalty");
    setEvidenceRationale("");
    setClassicalSource(false);
    setModernSource(false);

    try {
      const draft = await cmsClient.getDraft(entity.id);
      setCurrentDraft(draft);

      const activeProf = draft?.evidenceProfile || entity.evidenceProfile;
      if (activeProf) {
        setEvidenceStrength(activeProf.evidenceStrength || "moderate");
        setSourceQuality(activeProf.sourceQuality || "primary");
        setClinicalConfidence(activeProf.clinicalConfidence !== undefined ? activeProf.clinicalConfidence : 75);
        setEditorialConfidence(activeProf.editorialConfidence !== undefined ? activeProf.editorialConfidence : 80);
        setReviewIntervalDays(activeProf.reviewIntervalDays !== undefined ? activeProf.reviewIntervalDays : 365);
        setReviewGracePeriodDays(activeProf.reviewGracePeriodDays !== undefined ? activeProf.reviewGracePeriodDays : 90);
        setReviewExpiryPolicy(activeProf.reviewExpiryPolicy || "ranking-penalty");
        setEvidenceRationale(activeProf.rationale || "");
        setClassicalSource(!!activeProf.classicalSource);
        setModernSource(!!activeProf.modernSource);
      }

      if (draft) {
        setDraftContentField(draft.draftContent || "");
        setPatientSummaryField(draft.patientSummary || "");
        setPractitionerSummaryField(draft.practitionerSummary || "");
        setEducationalSummaryField(draft.educationalSummary || "");
        
        if (draft.reviewer) {
          setClinicalReviewerName(draft.reviewer);
          setClinicalReviewerRole(draft.reviewerRole || "Clinical Reviewer");
        }
        if (draft.clinicalReviewDate) {
          setClinicalReviewDate(draft.clinicalReviewDate);
        }
        if (draft.nextReviewDate) {
          setClinicalNextReviewDate(draft.nextReviewDate);
        }

        const vers = await cmsClient.getVersions(entity.id);
        setVersionsList(vers);
      } else {
        setDraftContentField(entity.content?.overview || entity.content?.description || entity.content?.definition || "");
        setPatientSummaryField(entity.summary?.en || "");
        setPractitionerSummaryField(entity.aiKnowledge?.practitionerSummary || "");
        setEducationalSummaryField(entity.aiKnowledge?.educationalSummary || "");
      }
    } catch (err) {
      console.error("Failed to load CMS draft details", err);
    } finally {
      setIsLoadingCms(false);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveDraftChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntity) return;

    if (!userHasPermission("CMS_DRAFT_EDIT")) {
      alert("Error: You do not have the required CMS_DRAFT_EDIT permission to perform this action.");
      return;
    }

    try {
      setIsTasksLoading(true);
      
      const draftData: Partial<CmsArticleDraft> & { articleId: string } = {
        articleId: editingEntity.id,
        title: editingEntity.title.en,
        slug: editingEntity.slug,
        draftContent: draftContentField,
        patientSummary: patientSummaryField,
        practitionerSummary: practitionerSummaryField,
        educationalSummary: educationalSummaryField,
        status: currentDraft?.status || "draft",
        metadata: {
          isCornerstone: editingEntity.isCornerstone,
          evidenceLevel: editingEntity.evidenceLevel,
          tags: editingEntity.tags,
          relatedEntities: editingEntity.relatedEntities
        },
        evidenceProfile: {
          evidenceStrength: evidenceStrength as any,
          sourceQuality: sourceQuality as any,
          clinicalConfidence: Number(clinicalConfidence),
          editorialConfidence: Number(editorialConfidence),
          reviewIntervalDays: Number(reviewIntervalDays),
          reviewGracePeriodDays: Number(reviewGracePeriodDays),
          reviewExpiryPolicy: reviewExpiryPolicy as any,
          rationale: evidenceRationale,
          classicalSource,
          modernSource,
          citationCompleteness: 0,
          assessedBy: "",
          assessedAt: "",
          lastReviewedAt: clinicalReviewDate,
          nextReviewDueAt: clinicalNextReviewDate
        }
      };

      const saved = await cmsClient.saveDraft(draftData, session?.name || "Dr. Narayan Jethwani");
      setCurrentDraft(saved);
      
      const vers = await cmsClient.getVersions(editingEntity.id);
      setVersionsList(vers);

      alert("Draft changes saved successfully.");
    } catch (err: any) {
      alert(`Failed to save draft changes: ${err.message}`);
    } finally {
      setIsTasksLoading(false);
    }
  };

  const handleApproveClinicalReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntity) return;

    if (!userHasPermission("CMS_CLINICAL_APPROVE")) {
      alert("Error: You do not have the required CMS_CLINICAL_APPROVE permission to perform this action.");
      return;
    }

    if (!clinicalReviewerName) {
      alert("Please select a registered clinical reviewer.");
      return;
    }

    try {
      setIsTasksLoading(true);
      const ok = await cmsClient.approveClinicalReview(
        editingEntity.id,
        clinicalReviewerName,
        clinicalReviewerRole,
        clinicalReviewDate,
        clinicalNextReviewDate,
        clinicalNotes,
        session?.name || "Dr. Narayan Jethwani"
      );

      if (ok) {
        const draft = await cmsClient.getDraft(editingEntity.id);
        setCurrentDraft(draft);
        const vers = await cmsClient.getVersions(editingEntity.id);
        setVersionsList(vers);
        alert("Clinical review approved successfully.");
      }
    } catch (err: any) {
      alert(`Failed to approve clinical review: ${err.message}`);
    } finally {
      setIsTasksLoading(false);
    }
  };

  const handlePublishArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntity) return;

    if (!userHasPermission("CMS_PUBLISH")) {
      alert("Error: You do not have the required CMS_PUBLISH permission to perform this action.");
      return;
    }

    if (!changeSummary) {
      alert("Please provide a publication change summary.");
      return;
    }

    if (!confirm("Are you sure you want to publish this article to production? Publishing updates public Knowledge content. Confirm only after human clinical review and final editorial approval.")) {
      return;
    }

    try {
      setIsTasksLoading(true);
      setPublishingErrors(null);
      setPublicationSuccess(false);

      const result = await cmsClient.publishArticle(
        editingEntity.id,
        session?.name || "Dr. Narayan Jethwani",
        changeSummary,
        true
      );

      if (result.success) {
        setPublicationSuccess(true);
        const draft = await cmsClient.getDraft(editingEntity.id);
        setCurrentDraft(draft);
        const vers = await cmsClient.getVersions(editingEntity.id);
        setVersionsList(vers);
        
        // Reload all entities to reflect the newly published data on public list
        const data = await globalKmsRepository.getEntities();
        setEntities(data);
        alert("Article published to production successfully!");
      } else {
        setPublishingErrors(result.errors || ["Failed to publish article."]);
      }
    } catch (err: any) {
      alert(`Failed to publish: ${err.message}`);
    } finally {
      setIsTasksLoading(false);
    }
  };

  const handleRollback = async (versionId: string) => {
    if (!editingEntity) return;

    if (!userHasPermission("CMS_ROLLBACK")) {
      alert("Error: You do not have the required CMS_ROLLBACK permission to perform this action.");
      return;
    }

    if (!confirm("Are you sure you want to rollback to this version snapshot? Unsaved draft changes will be lost and this will update the current draft staging buffer.")) {
      return;
    }

    try {
      setIsTasksLoading(true);
      const draft = await cmsClient.rollbackToVersion(versionId, session?.name || "Dr. Narayan Jethwani", true);
      setCurrentDraft(draft);
      setDraftContentField(draft.draftContent || "");
      setPatientSummaryField(draft.patientSummary || "");
      setPractitionerSummaryField(draft.practitionerSummary || "");
      setEducationalSummaryField(draft.educationalSummary || "");
      
      const vers = await cmsClient.getVersions(editingEntity.id);
      setVersionsList(vers);
      alert("Draft rolled back successfully.");
    } catch (err: any) {
      alert(`Rollback failed: ${err.message}`);
    } finally {
      setIsTasksLoading(false);
    }
  };

  // AI Assist: Generate Patient/Practitioner/Educational Summaries
  const handleGenerateAiSummaries = async () => {
    if (!editingEntity) return;
    setIsGeneratingSummaries(true);
    try {
      const parts: string[] = [];
      const c = editingEntity.content;
      if (c) {
        if (typeof c === "string") parts.push(c);
        else {
          if (c.overview) parts.push(c.overview);
          if (c.definition) parts.push(c.definition);
          if (c.description) parts.push(c.description);
          if (c.clinicalUses) parts.push(c.clinicalUses.join(", "));
          if (c.commonCauses) parts.push(c.commonCauses.join(", "));
          if (c.clinicalInterpretation) parts.push(c.clinicalInterpretation);
        }
      }
      const text = parts.join("\n\n") || editingEntity.summary.en;

      const res = await fetch("/api/admin/generate-summaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingEntity.title.en,
          entityType: editingEntity.entityType,
          contentText: text
        })
      });
      const data = await res.json();
      if (data.success && data.summaries) {
        setEditingEntity(prev => {
          if (!prev) return null;
          return {
            ...prev,
            summary: { ...prev.summary, en: data.summaries.patientSummary },
            aiKnowledge: {
              ...prev.aiKnowledge,
              patientSummary: data.summaries.patientSummary,
              practitionerSummary: data.summaries.practitionerSummary,
              educationalSummary: data.summaries.educationalSummary,
              retrievalSummary: data.summaries.patientSummary,
              differentialSummary: prev.aiKnowledge?.differentialSummary || "",
              graphContext: prev.aiKnowledge?.graphContext || "",
              embeddingText: prev.aiKnowledge?.embeddingText || ""
            },
            aiReadiness: {
              ...prev.aiReadiness,
              patientSummary: data.summaries.patientSummary,
              clinicalSummary: data.summaries.practitionerSummary,
              studentSummary: data.summaries.educationalSummary,
              retrievalSummary: data.summaries.patientSummary,
              keywords: prev.aiReadiness?.keywords || [],
              semanticKeywords: prev.aiReadiness?.semanticKeywords || [],
              bodySystem: prev.aiReadiness?.bodySystem || "general",
              urgency: prev.aiReadiness?.urgency || "routine"
            }
          };
        });
      } else {
        alert(data.error || "Failed to generate AI summaries.");
      }
    } catch (e: any) {
      console.error(e);
      alert("Error generating summaries: " + e.message);
    } finally {
      setIsGeneratingSummaries(false);
    }
  };

  // AI Assist: Audit Content readability, SEO, and claims compliance
  const handlePerformQualityAudit = async () => {
    if (!editingEntity) return;
    setIsAuditing(true);
    setAuditComplianceIssues([]);
    try {
      const parts: string[] = [];
      const c = editingEntity.content;
      if (c) {
        if (typeof c === "string") parts.push(c);
        else {
          if (c.overview) parts.push(c.overview);
          if (c.definition) parts.push(c.definition);
          if (c.description) parts.push(c.description);
          if (c.clinicalUses) parts.push(c.clinicalUses.join(", "));
          if (c.commonCauses) parts.push(c.commonCauses.join(", "));
          if (c.clinicalInterpretation) parts.push(c.clinicalInterpretation);
        }
      }
      const text = parts.join("\n\n") || editingEntity.summary.en;

      const res = await fetch("/api/admin/audit-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingEntity.title.en,
          contentText: text,
          tags: editingEntity.tags || []
        })
      });
      const data = await res.json();
      if (data.success && data.audit) {
        setEditingEntity(prev => {
          if (!prev) return null;
          return {
            ...prev,
            readabilityScore: {
              score: data.audit.readabilityScore,
              readingLevel: data.audit.readingLevel,
              readingTimeMinutes: data.audit.readingTimeMinutes
            },
            seoGeoScores: {
              seoScore: data.audit.seoScore,
              geoScore: data.audit.geoScore,
              aiReadinessScore: data.audit.aiReadinessScore
            },
            tags: data.audit.suggestedTags
          };
        });
        setAuditComplianceIssues(data.audit.complianceIssues || []);
      } else {
        alert(data.error || "Failed to audit content.");
      }
    } catch (e: any) {
      console.error(e);
      alert("Error performing audit: " + e.message);
    } finally {
      setIsAuditing(false);
    }
  };

  // AI Assist: Calculate and cache vector embedding in session store
  const handleSyncVector = async () => {
    if (!editingEntity) return;
    setIsSyncingVector(true);
    setVectorSyncMessage(null);
    try {
      const parts: string[] = [];
      const c = editingEntity.content;
      if (c) {
        if (typeof c === "string") parts.push(c);
        else {
          if (c.overview) parts.push(c.overview);
          if (c.definition) parts.push(c.definition);
          if (c.description) parts.push(c.description);
          if (c.clinicalUses) parts.push(c.clinicalUses.join(", "));
          if (c.commonCauses) parts.push(c.commonCauses.join(", "));
          if (c.clinicalInterpretation) parts.push(c.clinicalInterpretation);
        }
      }
      const text = parts.join("\n\n") || editingEntity.summary.en;

      const res = await fetch("/api/admin/sync-vector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingEntity.id,
          entityType: editingEntity.entityType,
          title: editingEntity.title.en,
          contentText: text
        })
      });
      const data = await res.json();
      if (data.success) {
        setVectorSyncMessage("Session vector cache updated. Persistent vector storage pending.");
      } else {
        alert(data.error || "Failed to sync vector cache.");
      }
    } catch (e: any) {
      console.error(e);
      alert("Error syncing vector cache: " + e.message);
    } finally {
      setIsSyncingVector(false);
    }
  };

  if (!session || loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] text-slate-400 flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-6 w-6 animate-spin text-teal-400" />
          <span>Synchronizing Clinical Workspace...</span>
        </div>
      </div>
    );
  }

  // --- STATS COMPUTATION ---
  const totalArticles = entities.length;
  const clinicallyReviewedCount = entities.filter(e => e.reviewStatus === "clinically-reviewed").length;
  const needsReviewCount = entities.filter(e => e.reviewStatus === "needs-review").length;
  const updateRequiredCount = entities.filter(e => e.reviewStatus === "update-required").length;

  const nowTime = new Date();
  const dueReviewCount = entities.filter(e => {
    if (e.reviewStatus === "update-required") return true;
    if (e.nextClinicalReview) {
      return new Date(e.nextClinicalReview) <= nowTime;
    }
    return false;
  }).length;

  const missingRefsCount = entities.filter(e => !e.content?.references || e.content.references.length === 0).length;
  const weakCitationCount = entities.filter(e => e.citationHealth === "needs-attention" || e.citationHealth === "critical").length;
  const incompleteGraphCount = entities.filter(e => (e.graphCompleteness || 0) < 50).length;
  const seoIssuesCount = entities.filter(e => e.seoStatus === "needs-attention" || e.seoStatus === "critical").length;
  const structuredDataIssuesCount = entities.filter(e => e.structuredDataStatus === "needs-attention" || e.structuredDataStatus === "critical").length;
  const noReviewerCount = entities.filter(e => !e.reviewer || (typeof e.reviewer === "string" ? !e.reviewer.trim() : !e.reviewer?.name?.trim())).length;

  const recentlyUpdatedList = [...entities]
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, 5);

  // --- FILTERED ARTICLES ---
  const filteredEntities = entities.filter(e => {
    // Search
    if (searchTerm) {
      const titleStr = e.title.en.toLowerCase();
      const slugStr = e.slug.toLowerCase();
      const idStr = e.id.toLowerCase();
      if (!titleStr.includes(searchTerm.toLowerCase()) && !slugStr.includes(searchTerm.toLowerCase()) && !idStr.includes(searchTerm.toLowerCase())) {
        return false;
      }
    }

    // Type
    if (filterType !== "all" && e.entityType !== filterType) return false;

    // Status
    if (filterStatus !== "all" && e.reviewStatus !== filterStatus) return false;

    // Citation Health
    if (filterCitationHealth !== "all" && e.citationHealth !== filterCitationHealth) return false;

    // SEO Status
    if (filterSeoStatus !== "all" && e.seoStatus !== filterSeoStatus) return false;

    // Cornerstone
    if (filterCornerstone !== "all") {
      const wantsCornerstone = filterCornerstone === "yes";
      if (!!e.isCornerstone !== wantsCornerstone) return false;
    }

    // Due for Review
    if (filterDueReview !== "all") {
      const isDue = e.reviewStatus === "update-required" || (e.nextClinicalReview ? new Date(e.nextClinicalReview) <= nowTime : false);
      if (isDue !== (filterDueReview === "yes")) return false;
    }

    // Missing Reviewer
    if (filterMissingReviewer !== "all") {
      const isMissing = !e.reviewer || (typeof e.reviewer === "string" ? !e.reviewer.trim() : !e.reviewer?.name?.trim());
      if (isMissing !== (filterMissingReviewer === "yes")) return false;
    }

    // Missing References
    if (filterMissingReferences !== "all") {
      const isMissing = !e.content?.references || e.content.references.length === 0;
      if (isMissing !== (filterMissingReferences === "yes")) return false;
    }

    return true;
  });

  // Cornerstone specific tracker list (first 50)
  const cornerstoneArticles = entities.filter(e => e.isCornerstone);

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-300 font-sans pb-12 antialiased selection:bg-teal-500/30 selection:text-teal-200">
      
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Header Breadcrumbs */}
        <div className="flex justify-between items-center bg-neutral-900/60 p-4 border border-neutral-800 rounded-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="p-2 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-neutral-200 rounded-xl transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase">ADMIN PORTAL</span>
                <span className="text-[10px] bg-teal-950 text-teal-400 border border-teal-900 px-1.5 py-0.5 rounded">
                  Editorial Cockpit v2.1
                </span>
              </div>
              <h1 className="text-lg font-bold text-neutral-100">Clinical Review &amp; Editorial Governance</h1>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.push("/admin/knowledge")}
              className="px-3.5 py-1.5 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-semibold text-slate-400 hover:text-slate-200 rounded-xl transition-all"
            >
              Database Registry
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-neutral-900/40 border border-neutral-800 p-4 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Total Articles</span>
            <span className="text-3xl font-extrabold text-white mt-2">{totalArticles}</span>
            <span className="text-[10px] text-slate-400 mt-1">Across 7 medical models</span>
          </div>
          
          <div className="bg-neutral-900/40 border border-neutral-800 p-4 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Reviewed</span>
            <span className="text-3xl font-extrabold text-emerald-400 mt-2">{clinicallyReviewedCount}</span>
            <span className="text-[10px] text-slate-400 mt-1">{((clinicallyReviewedCount / totalArticles) * 100).toFixed(0)}% verified rate</span>
          </div>

          <div className="bg-neutral-900/40 border border-neutral-800 p-4 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Review Due</span>
            <span className="text-3xl font-extrabold text-amber-500 mt-2">{dueReviewCount}</span>
            <span className="text-[10px] text-slate-400 mt-1">{needsReviewCount} needs audit, {updateRequiredCount} flags</span>
          </div>

          <div className="bg-neutral-900/40 border border-neutral-800 p-4 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Citation Issues</span>
            <span className="text-3xl font-extrabold text-rose-500 mt-2">{weakCitationCount}</span>
            <span className="text-[10px] text-slate-400 mt-1">{missingRefsCount} entirely unreferenced</span>
          </div>

          <div className="bg-neutral-900/40 border border-neutral-800 p-4 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Graph Issues</span>
            <span className="text-3xl font-extrabold text-indigo-400 mt-2">{incompleteGraphCount}</span>
            <span className="text-[10px] text-slate-400 mt-1">Underconnected entities</span>
          </div>
        </div>

        {/* WORKSPACE NAVIGATION TABS */}
        <div className="flex border-b border-neutral-800 gap-1 bg-neutral-950/40 p-1.5 rounded-xl border max-w-2xl">
          {[
            { id: "governance", label: "Cockpit & Reviews", icon: LayoutDashboard },
            { id: "cornerstone", label: "Cornerstone Content", icon: Compass },
            { id: "seo", label: "SEO Readiness", icon: Globe },
            { id: "analytics", label: "Analytics Stats", icon: TrendingUp },
            { id: "tasks", label: "Editorial Workflow", icon: Clock },
            { id: "rag", label: "RAG Index Health", icon: Database }
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = activeWorkspaceTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveWorkspaceTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                    : "bg-transparent text-slate-500 hover:text-slate-350"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* WORKSPACE BODY - GOVERNANCE */}
        {/* WORKSPACE BODY - GOVERNANCE */}
        {activeWorkspaceTab === "governance" && (
          <div className="space-y-6">

            {/* Operational health summary — internal governance only. */}
            <div className="bg-neutral-950 border border-neutral-850 p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-850 pb-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                  <Activity className="h-4 w-4 text-emerald-500" />
                  Operational Health Summary — Internal Governance Only
                </span>
                <span className="text-[10px] text-slate-505 font-mono">V2.8 Governance Layer</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                
                {/* CMS Mode */}
                <div className="p-3 bg-neutral-900/40 border border-neutral-800 rounded-xl">
                  <span className="text-[9px] text-slate-500 uppercase font-semibold">CMS Mode</span>
                  <div className="text-xs font-bold text-slate-200 mt-1">Hybrid Database</div>
                  <span className="text-[9px] text-teal-400 mt-0.5 block">Firestore + Memory fallback</span>
                </div>

                {/* Workflow Mode */}
                <div className="p-3 bg-neutral-900/40 border border-neutral-800 rounded-xl">
                  <span className="text-[9px] text-slate-500 uppercase font-semibold">Workflow Governance</span>
                  <div className="text-xs font-bold text-slate-200 mt-1">Clinical Review Gated</div>
                  <span className="text-[9px] text-teal-400 mt-0.5 block">Gated promotion & confirmation</span>
                </div>

                {/* Vector Store Mode */}
                <div className="p-3 bg-neutral-900/40 border border-neutral-800 rounded-xl">
                  <span className="text-[9px] text-slate-500 uppercase font-semibold">Vector Persistence</span>
                  <div className="text-xs font-bold text-slate-200 mt-1">
                    {ragStats?.persistenceMode === "firestore-hybrid" ? "Firestore Hybrid" : "Memory Fallback"}
                  </div>
                  <span className="text-[9px] text-teal-400 mt-0.5 block">
                    {ragStats?.totalVectors ?? 0} active embedding vectors
                  </span>
                </div>

                {/* Telemetry & Analytics */}
                <div className="p-3 bg-neutral-900/40 border border-neutral-800 rounded-xl">
                  <span className="text-[9px] text-slate-500 uppercase font-semibold">Telemetry & Analytics</span>
                  <div className="text-xs font-bold text-slate-200 mt-1">Privacy-Safe Active</div>
                  <span className="text-[9px] text-emerald-400 mt-0.5 block">PHI/PII auto-redacted</span>
                </div>

                {/* GSC Integration */}
                <div className="p-3 bg-neutral-900/40 border border-neutral-800 rounded-xl">
                  <span className="text-[9px] text-slate-500 uppercase font-semibold">Search Console</span>
                  <div className="text-xs font-bold text-slate-200 mt-1">
                    {scSummary ? "Authenticated" : "Sandbox Mock Mode"}
                  </div>
                  <span className="text-[9px] text-emerald-400 mt-0.5 block">
                    {scSummary ? "GA4 active integration" : "Local analytics fallback"}
                  </span>
                </div>

              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1 border-t border-neutral-900">
                <div className="flex justify-between items-center text-[11px] px-2 py-1 bg-neutral-900/20 rounded border border-neutral-850">
                  <span className="text-slate-400">Failed Indexing Jobs</span>
                  <span className={`font-bold ${ragStats?.failedCount > 0 ? "text-rose-500" : "text-slate-350"}`}>
                    {ragStats?.failedCount ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] px-2 py-1 bg-neutral-900/20 rounded border border-neutral-850">
                  <span className="text-slate-400">Stale Vector Count</span>
                  <span className={`font-bold ${ragStats?.staleCount > 0 ? "text-amber-500" : "text-slate-350"}`}>
                    {ragStats?.staleCount ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] px-2 py-1 bg-neutral-900/20 rounded border border-neutral-850">
                  <span className="text-slate-400">Blocked Drafts</span>
                  <span className="font-bold text-slate-350">
                    {entities.filter(e => e.editorialStatus === "draft" && e.citationHealth === "critical").length}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] px-2 py-1 bg-neutral-900/20 rounded border border-neutral-850">
                  <span className="text-slate-400">Critical Editorial Tasks</span>
                  <span className={`font-bold ${tasks.filter(t => t.status !== "completed" && t.status !== "cancelled").length > 0 ? "text-amber-500" : "text-slate-350"}`}>
                    {tasks.filter(t => t.status !== "completed" && t.status !== "cancelled").length}
                  </span>
                </div>
              </div>
            </div>

            {/* Secondary Audit Summary & Activity logs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Warnings and compliance list */}
              <div className="md:col-span-2 bg-neutral-950 border border-neutral-850 p-4 rounded-2xl flex flex-col justify-between">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-3">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Compliance Warnings &amp; Unassigned Roles
                </h4>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-neutral-900/50 rounded-xl border border-neutral-800">
                    <span className="text-[10px] text-slate-500 block">No Reviewer Assigned</span>
                    <span className="text-lg font-bold text-slate-200 mt-1 block">{noReviewerCount} articles</span>
                  </div>
                  <div className="p-3 bg-neutral-900/50 rounded-xl border border-neutral-800">
                    <span className="text-[10px] text-slate-500 block">SEO Issues Found</span>
                    <span className="text-lg font-bold text-slate-200 mt-1 block">{seoIssuesCount} pages</span>
                  </div>
                  <div className="p-3 bg-neutral-900/50 rounded-xl border border-neutral-800">
                    <span className="text-[10px] text-slate-500 block">Schema Warnings</span>
                    <span className="text-lg font-bold text-slate-200 mt-1 block">{structuredDataIssuesCount} pages</span>
                  </div>
                </div>
              </div>

              {/* Recently updated */}
              <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-2xl">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-3">
                  <Clock className="h-4 w-4 text-teal-400" />
                  Recent Governance Updates
                </h4>
                <div className="space-y-1.5">
                  {recentlyUpdatedList.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-[11px] bg-neutral-900/30 p-1.5 rounded-lg border border-neutral-850/60">
                      <span className="font-semibold text-slate-300 truncate max-w-[140px]">{item.title.en}</span>
                      <span className="text-[9px] text-slate-500 font-mono">{item.lastClinicalReview || item.lastReviewed || "None"}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
            
            {/* Filter controls panel */}
            <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-850 pb-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Filter className="h-3.5 w-3.5 text-teal-500" />
                  Filter Registry Criteria
                </span>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterType("all");
                    setFilterStatus("all");
                    setFilterCitationHealth("all");
                    setFilterSeoStatus("all");
                    setFilterCornerstone("all");
                    setFilterDueReview("all");
                    setFilterMissingReviewer("all");
                    setFilterMissingReferences("all");
                  }}
                  className="text-[10px] text-slate-500 hover:text-teal-400"
                >
                  Reset Filters
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                {/* Search */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-3.5 w-3.5 text-slate-500" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by title, slug, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#070b14] border border-neutral-800 focus:border-teal-500/50 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-all"
                  />
                </div>

                {/* Model Type */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-semibold block">ENTITY MODEL</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full bg-[#070b14] border border-neutral-800 text-xs text-slate-300 rounded-xl p-2 focus:outline-none"
                  >
                    <option value="all">All Models</option>
                    <option value="disease">Diseases</option>
                    <option value="remedy">Remedies</option>
                    <option value="symptom">Symptoms</option>
                    <option value="lab-test">Lab Tests</option>
                    <option value="faq">FAQs</option>
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-semibold block">REVIEW STATUS</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full bg-[#070b14] border border-neutral-800 text-xs text-slate-300 rounded-xl p-2 focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="needs-review">Needs Review</option>
                    <option value="clinically-reviewed">Clinically Reviewed</option>
                    <option value="references-needed">References Needed</option>
                    <option value="update-required">Update Required</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {/* Citation Health */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-semibold block">CITATION HEALTH</label>
                  <select
                    value={filterCitationHealth}
                    onChange={(e) => setFilterCitationHealth(e.target.value)}
                    className="w-full bg-[#070b14] border border-neutral-800 text-xs text-slate-300 rounded-xl p-2 focus:outline-none"
                  >
                    <option value="all">All Health Categories</option>
                    <option value="excellent">Excellent (3+ refs)</option>
                    <option value="good">Good (1-2 refs)</option>
                    <option value="needs-attention">Needs Attention (0 refs)</option>
                  </select>
                </div>

              </div>

              {/* Advanced Flags */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer bg-neutral-900/50 p-2 rounded-xl border border-neutral-800 hover:border-neutral-700">
                  <input
                    type="checkbox"
                    checked={filterCornerstone === "yes"}
                    onChange={(e) => setFilterCornerstone(e.target.checked ? "yes" : "all")}
                    className="rounded text-teal-500 focus:ring-teal-500/20 bg-neutral-950 border-neutral-800"
                  />
                  <span className="text-[10px] text-slate-400 font-medium">Cornerstone Only</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-neutral-900/50 p-2 rounded-xl border border-neutral-800 hover:border-neutral-700">
                  <input
                    type="checkbox"
                    checked={filterDueReview === "yes"}
                    onChange={(e) => setFilterDueReview(e.target.checked ? "yes" : "all")}
                    className="rounded text-teal-500 focus:ring-teal-500/20 bg-neutral-950 border-neutral-800"
                  />
                  <span className="text-[10px] text-slate-400 font-medium">Due for Clinical Review</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-neutral-900/50 p-2 rounded-xl border border-neutral-800 hover:border-neutral-700">
                  <input
                    type="checkbox"
                    checked={filterMissingReviewer === "yes"}
                    onChange={(e) => setFilterMissingReviewer(e.target.checked ? "yes" : "all")}
                    className="rounded text-teal-500 focus:ring-teal-500/20 bg-neutral-950 border-neutral-800"
                  />
                  <span className="text-[10px] text-slate-400 font-medium">Missing Reviewer</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-neutral-900/50 p-2 rounded-xl border border-neutral-800 hover:border-neutral-700">
                  <input
                    type="checkbox"
                    checked={filterMissingReferences === "yes"}
                    onChange={(e) => setFilterMissingReferences(e.target.checked ? "yes" : "all")}
                    className="rounded text-teal-500 focus:ring-teal-500/20 bg-neutral-950 border-neutral-800"
                  />
                  <span className="text-[10px] text-slate-400 font-medium">Missing References</span>
                </label>

                <div className="flex items-center justify-end text-[10px] font-mono text-slate-500 px-2 py-1 bg-neutral-950 rounded-xl border border-neutral-850">
                  Matches: {filteredEntities.length} / {totalArticles}
                </div>
              </div>

            </div>

            {/* Editorial Table */}
            <div className="bg-neutral-950 border border-neutral-850 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-900/60 text-slate-400 font-bold border-b border-neutral-800">
                      <th className="p-4">Title / ID</th>
                      <th className="p-4">Model Type</th>
                      <th className="p-4">Reviewer</th>
                      <th className="p-4">Governance Status</th>
                      <th className="p-4 text-center">Citation Health</th>
                      <th className="p-4 text-center">Graph Links</th>
                      <th className="p-4 text-center">SEO</th>
                      <th className="p-4 text-center">Schema</th>
                      <th className="p-4">Last Reviewed</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900">
                    {filteredEntities.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="p-8 text-center text-slate-500 font-mono">
                          No matching medical entities found under selected criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredEntities.map(e => {
                        const isDue = e.reviewStatus === "update-required" || (e.nextClinicalReview ? new Date(e.nextClinicalReview) <= nowTime : false);
                        const reviewerName = typeof e.reviewer === "string" ? e.reviewer : e.reviewer?.name;

                        return (
                          <tr key={e.id} className="hover:bg-neutral-900/30 transition-colors select-text">
                            
                            {/* Title & Slug */}
                            <td className="p-4 font-semibold text-white">
                              <div className="flex items-center gap-1.5">
                                {e.isCornerstone && (
                                  <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/25 px-1 py-0.2 rounded font-mono font-bold uppercase shrink-0">
                                    Flagship
                                  </span>
                                )}
                                <span>{e.title.en}</span>
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono mt-0.5">{e.id} • {e.slug}</div>
                            </td>

                            {/* Entity Type */}
                            <td className="p-4 text-slate-400 capitalize">
                              {e.entityType === "lab-test" ? "Lab Test" : e.entityType}
                            </td>

                            {/* Reviewer */}
                            <td className="p-4">
                              {reviewerName ? (
                                <div>
                                  <span className="font-semibold text-slate-300">{reviewerName}</span>
                                  <div className="text-[10px] text-slate-500 font-mono">{e.reviewerRole || "Specialist"}</div>
                                </div>
                              ) : (
                                <span className="text-slate-600 italic">Unassigned</span>
                              )}
                            </td>

                            {/* Status */}
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                e.reviewStatus === "clinically-reviewed"
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                  : e.reviewStatus === "update-required"
                                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                    : e.reviewStatus === "needs-review"
                                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                      : "bg-slate-800 text-slate-400 border-slate-700"
                              }`}>
                                {e.reviewStatus === "clinically-reviewed" && <Check className="h-3 w-3" />}
                                {e.reviewStatus === "update-required" && <AlertTriangle className="h-3 w-3 animate-pulse" />}
                                {e.reviewStatus?.replace("-", " ")}
                              </span>
                              {isDue && (
                                <span className="block text-[9px] text-rose-500 mt-1 font-semibold font-mono animate-pulse">
                                  ● REVIEW DUE
                                </span>
                              )}
                            </td>

                            {/* Citation Health */}
                            <td className="p-4 text-center">
                              <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                                e.citationHealth === "excellent"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : e.citationHealth === "good"
                                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                              }`}>
                                {e.citationHealth || "needs-attention"}
                              </span>
                              <div className="text-[10px] text-slate-500 mt-1 font-mono">{e.content?.references?.length || 0} citations</div>
                            </td>

                            {/* Graph Completeness */}
                            <td className="p-4">
                              <div className="flex flex-col items-center justify-center space-y-1">
                                <span className="text-[10px] font-mono text-indigo-400 font-bold">{e.graphCompleteness || 25}%</span>
                                <div className="w-16 h-1 bg-neutral-900 rounded-full overflow-hidden">
                                  <div
                                    className="bg-indigo-500 h-full rounded-full"
                                    style={{ width: `${e.graphCompleteness || 25}%` }}
                                  />
                                </div>
                                <span className="text-[9px] text-slate-500 font-mono">({e.relatedEntities?.length || 0} links)</span>
                              </div>
                            </td>

                            {/* SEO Status */}
                            <td className="p-4 text-center">
                              <span className={`inline-flex px-1.5 py-0.5 rounded text-[9.5px] font-bold uppercase ${
                                e.seoStatus === "excellent"
                                  ? "text-emerald-400"
                                  : e.seoStatus === "good"
                                    ? "text-blue-400"
                                    : "text-amber-500"
                              }`}>
                                {e.seoStatus}
                              </span>
                            </td>

                            {/* Schema Status */}
                            <td className="p-4 text-center">
                              <span className={`inline-flex px-1.5 py-0.5 rounded text-[9.5px] font-bold uppercase ${
                                e.structuredDataStatus === "excellent"
                                  ? "text-emerald-400"
                                  : "text-slate-500"
                              }`}>
                                {e.structuredDataStatus || "good"}
                              </span>
                            </td>

                            {/* Last Reviewed */}
                            <td className="p-4 text-slate-400 font-mono">
                              {e.lastClinicalReview || e.lastReviewed || "None"}
                            </td>

                            {/* Actions */}
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleMarkReviewed(e.id)}
                                  className="p-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 rounded-lg transition-all"
                                  title="Approve / Mark Clinically Reviewed"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleFlagForUpdate(e.id)}
                                  className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 rounded-lg transition-all"
                                  title="Flag for update / Revision Needed"
                                >
                                  <AlertTriangle className="h-3.5 w-3.5" />
                                </button>
                                <button
                                   onClick={() => openCmsEditor(e)}
                                   className="p-1.5 bg-neutral-900 text-slate-300 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-lg transition-all"
                                   title="Edit Editorial Metadata & Draft Content"
                                 >
                                   <Edit2 className="h-3.5 w-3.5" />
                                 </button>
                              </div>
                            </td>

                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* WORKSPACE BODY - CORNERSTONE */}
        {activeWorkspaceTab === "cornerstone" && (
          <div className="space-y-6">
            <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-2xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2">
                <h3 className="text-base font-bold text-slate-100">Cornerstone Content Quality Tracker</h3>
                <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-lg font-mono font-bold uppercase animate-pulse">
                  Provisional List — Pending Editorial Board Approval
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4 max-w-3xl leading-relaxed">
                The platform is anchored on these flagship clinical profiles representing critical homeopathy concepts and high-density patient search volumes. They must maintain 100% data fidelity, validated citations, and practitioner support summaries.
                <span className="text-[10px] text-amber-500/80 block mt-1">
                  * Note: Cornerstone status in the current build is provisional and based on search volume heuristics. Final inclusion requires explicit sign-off from the clinical editorial board.
                </span>
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-900/60 text-slate-400 font-bold border-b border-b-neutral-800">
                      <th className="p-3">Cornerstone Article</th>
                      <th className="p-3 text-center">Reviewer Assigned</th>
                      <th className="p-3 text-center">References Current</th>
                      <th className="p-3 text-center">Clinical Review Current</th>
                      <th className="p-3 text-center">Patient Summary</th>
                      <th className="p-3 text-center">Practitioner Summary</th>
                      <th className="p-3 text-center">Educational Summary</th>
                      <th className="p-3 text-center">Structured Schema</th>
                      <th className="p-3 text-center">Graph Traversable</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900 text-[11px]">
                    {cornerstoneArticles.slice(0, 50).map(c => {
                      const reviewerName = typeof c.reviewer === "string" ? c.reviewer : c.reviewer?.name;
                      const hasReviewer = !!reviewerName?.trim();
                      const isReviewCurrent = c.nextClinicalReview ? new Date(c.nextClinicalReview) > nowTime : false;
                      const hasRefs = !!c.content?.references && c.content.references.length > 0;
                      
                      // Check summaries in aiKnowledge / content / summary
                      const hasPatientSum = !!c.aiKnowledge?.patientSummary || !!c.summary?.en;
                      const hasPracSum = !!c.aiKnowledge?.practitionerSummary || !!c.aiReadiness?.clinicalSummary;
                      const hasEduSum = !!c.aiKnowledge?.educationalSummary || !!c.aiReadiness?.studentSummary;
                      
                      const hasSchema = c.structuredDataStatus === "excellent";
                      const isGraphConnected = (c.relatedEntities?.length || 0) >= 2;

                      return (
                        <tr key={c.id} className="hover:bg-neutral-900/20">
                          <td className="p-3 font-semibold text-white">
                            {c.title.en}
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">{c.id} • {c.entityType}</div>
                          </td>

                          {/* Reviewer Assigned */}
                          <td className="p-3 text-center">
                            {hasReviewer ? (
                              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">ASSIGNED</span>
                            ) : (
                              <span className="text-[10px] text-rose-500 font-bold bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded animate-pulse">UNASSIGNED</span>
                            )}
                          </td>

                          {/* References Current */}
                          <td className="p-3 text-center">
                            {hasRefs ? (
                              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">HEALTHY</span>
                            ) : (
                              <span className="text-[10px] text-rose-500 font-bold bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded animate-pulse">MISSING</span>
                            )}
                          </td>

                          {/* Clinical Review Current */}
                          <td className="p-3 text-center">
                            {isReviewCurrent ? (
                              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">CURRENT</span>
                            ) : (
                              <span className="text-[10px] text-rose-500 font-bold bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded animate-pulse">OVERDUE</span>
                            )}
                          </td>

                          {/* Patient Summary */}
                          <td className="p-3 text-center">
                            {hasPatientSum ? (
                              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 mx-auto" />
                            ) : (
                              <span className="text-[10px] text-rose-500 font-bold bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">MISSING</span>
                            )}
                          </td>

                          {/* Practitioner Summary */}
                          <td className="p-3 text-center">
                            {hasPracSum ? (
                              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 mx-auto" />
                            ) : (
                              <span className="text-[10px] text-rose-500 font-bold bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">MISSING</span>
                            )}
                          </td>

                          {/* Educational Summary */}
                          <td className="p-3 text-center">
                            {hasEduSum ? (
                              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 mx-auto" />
                            ) : (
                              <span className="text-[10px] text-rose-500 font-bold bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">MISSING</span>
                            )}
                          </td>

                          {/* Schema valid */}
                          <td className="p-3 text-center">
                            {hasSchema ? (
                              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">EXCELLENT</span>
                            ) : (
                              <span className="text-[10px] text-amber-500 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">NO SCHEMA</span>
                            )}
                          </td>

                          {/* Graph linked */}
                          <td className="p-3 text-center">
                            {isGraphConnected ? (
                              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">CONNECTED</span>
                            ) : (
                              <span className="text-[10px] text-amber-500 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded animate-pulse">WEAK ({c.relatedEntities?.length || 0})</span>
                            )}
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* WORKSPACE BODY - SEO */}
        {activeWorkspaceTab === "seo" && (
          !userHasPermission("OBSERVABILITY_VIEW") ? (
            renderAccessDenied("OBSERVABILITY_VIEW")
          ) : scSummary ? (
            <div className="space-y-6">
            
            {/* telemetry source notice */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-3 rounded-xl flex items-center gap-2 text-xs">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>Telemetry Source Status: <strong>{scSummary.dataSource}</strong>. GSC integration is in simulation mode for local development.</span>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 p-3 rounded-xl flex items-center gap-2 text-xs">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>Analytics guide editorial prioritization. They do not represent clinical validation.</span>
              </div>
            </div>

            {/* stats panel */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl">
                <span className="text-[10px] text-slate-500 block">Total Organic Clicks</span>
                <span className="text-2xl font-bold text-white mt-1 block">{scSummary.clicks.toLocaleString()}</span>
              </div>
              <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl">
                <span className="text-[10px] text-slate-500 block">Total Organic Impressions</span>
                <span className="text-2xl font-bold text-white mt-1 block">{scSummary.impressions.toLocaleString()}</span>
              </div>
              <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl">
                <span className="text-[10px] text-slate-500 block">Average CTR</span>
                <span className="text-2xl font-bold text-teal-400 mt-1 block">{(scSummary.averageCtr * 100).toFixed(1)}%</span>
              </div>
              <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl">
                <span className="text-[10px] text-slate-500 block">Average Position</span>
                <span className="text-2xl font-bold text-amber-400 mt-1 block">{scSummary.averagePosition}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Top landing pages */}
              <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-2xl space-y-3">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-teal-500" />
                  Top Search Landing Pages
                </h4>
                <div className="space-y-2">
                  {scTopPages.map((page, idx) => (
                    <div key={idx} className="bg-neutral-900/50 p-3 rounded-xl border border-neutral-800 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-semibold text-slate-200">{page.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{page.url}</div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="font-bold text-white">{page.clicks} clicks</div>
                        <div className="text-[10px] text-slate-500">Pos: {page.position}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Crawl errors / Warnings */}
              <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-2xl space-y-4">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                  <SearchCode className="h-4 w-4 text-indigo-400" />
                  Core Web Vitals &amp; Schema Warnings
                </h4>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-neutral-900/50 rounded-xl border border-neutral-800 text-center">
                    <span className="text-[10px] text-slate-500 block">LCP Status</span>
                    <span className="font-bold text-emerald-400 text-sm block mt-1">{scSummary.lcpMs}ms</span>
                    <span className="text-[9px] text-slate-400 font-mono uppercase block mt-0.5">Good</span>
                  </div>
                  <div className="p-3 bg-neutral-900/50 rounded-xl border border-neutral-800 text-center">
                    <span className="text-[10px] text-slate-500 block">INP Action</span>
                    <span className="font-bold text-emerald-400 text-sm block mt-1">{scSummary.inpMs}ms</span>
                    <span className="text-[9px] text-slate-400 font-mono uppercase block mt-0.5">Good</span>
                  </div>
                  <div className="p-3 bg-neutral-900/50 rounded-xl border border-neutral-800 text-center">
                    <span className="text-[10px] text-slate-500 block">Layout Shift</span>
                    <span className="font-bold text-emerald-400 text-sm block mt-1">{scSummary.clsScore}</span>
                    <span className="text-[9px] text-slate-400 font-mono uppercase block mt-0.5">Good</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pages Needing Meta / Title Corrections</h5>
                  {scImprovements.map((page, idx) => (
                    <div key={idx} className="bg-neutral-900/30 p-3 rounded-xl border border-neutral-850 text-xs space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-200">{page.title}</span>
                        <span className="text-[9px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1.5 py-0.2 rounded font-mono uppercase">Update Needed</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed"><strong className="text-slate-500">Issue:</strong> {page.issue}</p>
                      <p className="text-[11px] text-teal-400 leading-relaxed"><strong className="text-slate-500">Fix:</strong> {page.recommendedAction}</p>
                    </div>
                  ))}
                </div>

              </div>

            </div>

            {/* Advanced SEO Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Pages with Low CTR */}
              <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-2xl space-y-3">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Low Click-Through Rate (CTR) Alerts
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  Pages with high organic search impressions but substandard click-through rates. These require optimization of title tag hooks and meta snippet tags to match user search intent.
                </p>
                <div className="space-y-2">
                  {scLowCtr.map((page, idx) => (
                    <div key={idx} className="bg-neutral-900/50 p-3 rounded-xl border border-neutral-800 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-semibold text-slate-200">{page.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{page.url}</div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="font-bold text-rose-450">{(page.ctr * 100).toFixed(1)}% CTR</div>
                        <div className="text-[10px] text-slate-500">Imps: {page.impressions.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impressions but Poor Ranking */}
              <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-2xl space-y-3">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-indigo-400" />
                  High Impressions / Poor Ranking Pages
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  Articles indexed and serving impressions but ranking below page 1 on average. Recommended to add high-quality citations and increase semantic linking density.
                </p>
                <div className="space-y-2">
                  {scPoorRank.map((page, idx) => (
                    <div key={idx} className="bg-neutral-900/50 p-3 rounded-xl border border-neutral-800 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-semibold text-slate-200">{page.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{page.url}</div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="font-bold text-amber-500">Pos: {page.position}</div>
                        <div className="text-[10px] text-slate-500">Imps: {page.impressions.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
          ) : null
        )}

        {/* WORKSPACE BODY - ANALYTICS */}
        {activeWorkspaceTab === "analytics" && (
          !userHasPermission("OBSERVABILITY_VIEW") ? (
            renderAccessDenied("OBSERVABILITY_VIEW")
          ) : analyticsSum ? (
            <div className="space-y-6">
            
            {/* telemetry source notice */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-3 rounded-xl flex items-center gap-2 text-xs">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>Telemetry Source Status: <strong>{analyticsSum.dataSource}</strong>. GA4/Firebase integration is in simulation mode for local development.</span>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 p-3 rounded-xl flex items-center gap-2 text-xs">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>Analytics guide editorial prioritization. They do not represent clinical validation.</span>
              </div>
            </div>

            {/* summary panel */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl">
                <span className="text-[10px] text-slate-500 block">Total Read Sessions</span>
                <span className="text-2xl font-bold text-white mt-1 block">{analyticsSum.totalSessions.toLocaleString()}</span>
              </div>
              <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl">
                <span className="text-[10px] text-slate-500 block">Avg Reading Time</span>
                <span className="text-2xl font-bold text-white mt-1 block">{Math.floor(analyticsSum.avgSessionDurationSeconds / 60)}m {analyticsSum.avgSessionDurationSeconds % 60}s</span>
              </div>
              <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl">
                <span className="text-[10px] text-slate-500 block">Internal Link Clicks</span>
                <span className="text-2xl font-bold text-teal-400 mt-1 block">{analyticsSum.internalLinkClicks}</span>
              </div>
              <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl">
                <span className="text-[10px] text-slate-500 block">Learning Path Completion</span>
                <span className="text-2xl font-bold text-indigo-400 mt-1 block">{(analyticsSum.learningPathCompletionRate * 100).toFixed(0)}%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Engagement Mismatch (High Traffic, Low Engagement) */}
              <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-2xl space-y-3">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  High Traffic / Low Engagement (Content Audits)
                </h4>
                <p className="text-[11px] text-slate-500">
                  These pages attract substantial user visits but show high bounce or brief reading durations. They require layout restructuring or clinical clarity updates.
                </p>
                <div className="space-y-2">
                  {analyticsHighTrafficLowEngagement.map((item, idx) => (
                    <div key={idx} className="bg-neutral-900/50 p-3 rounded-xl border border-neutral-800 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-semibold text-slate-200">{item.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">/knowledge/diseases/{item.slug}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-rose-400">{item.views} views</div>
                        <div className="text-[10px] text-slate-500 font-mono">Engagement Score: {item.engagementScore}/100</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Traffic / High Clinical Importance */}
              <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-2xl space-y-3">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-teal-400" />
                  Low Traffic / High Clinical Importance (Discoverability Boost)
                </h4>
                <p className="text-[11px] text-slate-500">
                  These pages contain critical therapeutic guidelines but receive low organic visits. Consider linking them from higher-traffic landing pages.
                </p>
                <div className="space-y-2">
                  {analyticsLowTrafficHighImportance.map((item, idx) => (
                    <div key={idx} className="bg-neutral-900/50 p-3 rounded-xl border border-neutral-800 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-semibold text-slate-200">{item.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">/knowledge/remedies/{item.slug}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-teal-400">{item.views} views</div>
                        <div className="text-[10px] text-slate-500 font-mono">Clinical Priority: {item.clinicalImportance}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Secondary Analytics Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Most Read Articles */}
              <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-2xl space-y-3">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-teal-400" />
                  Most Visited Clinical Articles
                </h4>
                <div className="space-y-2">
                  {analyticsTopArticles.map((page, idx) => (
                    <div key={idx} className="bg-neutral-900/50 p-3 rounded-xl border border-neutral-800 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-semibold text-slate-200">{page.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">/knowledge/remedies/{page.slug}</div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="font-bold text-white">{page.views.toLocaleString()} views</div>
                        <div className="text-[10px] text-slate-500">Time: {Math.floor(page.avgTimeSeconds / 60)}m {page.avgTimeSeconds % 60}s</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Search Queries */}
              <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-2xl space-y-3">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                  <Search className="h-4 w-4 text-indigo-400" />
                  Common Diagnostic Queries
                </h4>
                <div className="space-y-2">
                  {analyticsSearches.map((item, idx) => (
                    <div key={idx} className="bg-neutral-900/50 p-3 rounded-xl border border-neutral-800 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-semibold text-slate-200">"{item.query}"</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{item.resultsCount} articles matched</div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="font-bold text-white">{item.count} searches</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
          ) : null
        )}

        {/* WORKSPACE BODY - EDITORIAL WORKFLOW */}
        {activeWorkspaceTab === "tasks" && (
          <div className="space-y-6">
            
            {/* Header action bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-neutral-950/40 p-5 rounded-2xl border border-neutral-850">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Clock className="h-5 w-5 text-indigo-400" />
                    Editorial Workflow &amp; Curation Tasks
                  </h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${
                    persistenceMode === "Firestore workflow mode"
                      ? "bg-teal-500/10 text-teal-400 border-teal-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}>
                    {persistenceMode}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Manage clinical assignments, due dates, and transitions. Curation priorities guide workflow prioritization.
                </p>
                <div className="mt-2 text-[10px] text-slate-400 font-semibold bg-neutral-900/60 border border-neutral-850 px-3 py-1.5 rounded-xl max-w-2xl">
                  ⚠️ Note: Workflow tasks support editorial operations. They do not represent clinical approval unless explicitly reviewed and dated.
                </div>
              </div>
              <button
                disabled={isGeneratingTasks}
                onClick={triggerAutoTaskGeneration}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-all shadow-lg shadow-teal-600/10 shrink-0"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isGeneratingTasks ? "animate-spin" : ""}`} />
                {isGeneratingTasks ? "Scanning Database..." : "Scan & Auto-Generate Tasks"}
              </button>
            </div>

            {/* Main Task Cockpit Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Task queue list - 2 columns */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center border-b border-neutral-850 pb-3">
                    <h5 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Active Task Queue ({tasks.length})</h5>
                    {isTasksLoading && <span className="text-[10px] text-slate-500 font-mono animate-pulse">syncing...</span>}
                  </div>

                  {tasks.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 text-xs">
                      No active tasks found in the queue. Click Scan above to auto-generate clinical tasks.
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                      {tasks.map(task => (
                        <div
                          key={task.id}
                          className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row justify-between gap-3 ${
                            selectedTask?.id === task.id
                              ? "bg-teal-500/5 border-teal-500/40"
                              : "bg-neutral-900/40 border-neutral-800 hover:border-neutral-700"
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-white text-xs">{task.articleTitle}</span>
                              <span className="text-[10px] bg-neutral-800 text-slate-400 px-1.5 py-0.2 rounded font-mono uppercase">{task.entityType}</span>
                              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase font-bold border ${
                                task.priority === "critical"
                                  ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                  : task.priority === "high"
                                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                  : "bg-teal-500/10 text-teal-400 border-teal-500/20"
                              }`}>{task.priority}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-semibold">{task.taskType.replace("-", " ")}</p>
                            <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-500 font-mono">
                              <span>Source: {task.source.replace("-", " ")}</span>
                              {task.dueDate && (
                                <span className={new Date(task.dueDate) < new Date() && task.status !== "completed" ? "text-rose-450 font-bold" : ""}>
                                  Due: {task.dueDate}
                                </span>
                              )}
                              <span>Assignee: {task.assignedTo || "Unassigned"}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                            <span className="text-[10px] bg-neutral-850 border border-neutral-800 px-2 py-0.5 rounded-lg text-slate-300 capitalize font-mono">
                              {task.status.replace("-", " ")}
                            </span>
                            <button
                              onClick={() => {
                                setSelectedTask(task);
                                setAssigneeName(task.assignedTo || "");
                                setAssigneeRole(task.reviewerRole || "Reviewer");
                                setTaskNote(task.notes || "");
                                setTransitionStatusField(task.status);
                                setIsTaskModalOpen(true);
                              }}
                              className="p-1.5 hover:bg-neutral-800 rounded-lg text-slate-400 hover:text-white transition-all"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Deadlines & Review Calendar */}
                <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-2xl space-y-3">
                  <h5 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Curation Deadline Timeline</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["Overdue", "This Week", "This Month", "Later"].map((label, idx) => {
                      const count = tasks.filter(t => {
                        if (t.status === "completed") return false;
                        if (!t.dueDate) return label === "Later";
                        const due = new Date(t.dueDate);
                        const nowTime = new Date();
                        if (label === "Overdue") return due < nowTime;
                        const diff = Math.ceil((due.getTime() - nowTime.getTime()) / (1000 * 3600 * 24));
                        if (label === "This Week") return diff >= 0 && diff <= 7;
                        if (label === "This Month") return diff > 7 && diff <= 30;
                        return diff > 30;
                      }).length;

                      return (
                        <div key={idx} className="bg-neutral-900/50 p-3 rounded-xl border border-neutral-800 text-center font-mono">
                          <span className="text-[10px] text-slate-500 block">{label}</span>
                          <span className={`text-xl font-bold block mt-1 ${count > 0 && label === "Overdue" ? "text-rose-400" : "text-white"}`}>
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Audit logs & history - 1 column */}
              <div className="space-y-4">
                <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-2xl space-y-4">
                  <h5 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Curation Audit Trail</h5>
                  <div className="space-y-3 max-h-[80vh] overflow-y-auto pr-1">
                    {workflowEvents.length === 0 ? (
                      <div className="text-center py-8 text-slate-500 text-xs">
                        No recent workflow audit actions logged.
                      </div>
                    ) : (
                      workflowEvents.map((evt, idx) => (
                        <div key={idx} className="p-3 bg-neutral-900/30 rounded-xl border border-neutral-850 text-[11px] space-y-1.5 font-mono">
                          <div className="flex justify-between items-center text-[9px] text-slate-500">
                            <span>Actor: {evt.actor || "System"}</span>
                            <span>{new Date(evt.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-slate-300 font-semibold text-xs capitalize">{evt.eventType.replace("-", " ")}</p>
                          {evt.note && <p className="text-slate-450 italic">"{evt.note}"</p>}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Task Edit Modal */}
            {isTaskModalOpen && selectedTask && (
              <div className="fixed inset-0 z-50 bg-[#04060d]/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-[#0b1120] border border-neutral-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
                  
                  {/* Header */}
                  <div className="p-5 border-b border-neutral-850 flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold text-white">Manage Task Curation</h4>
                      <span className="text-[10px] text-slate-500 font-mono">{selectedTask.articleTitle}</span>
                    </div>
                    <button
                      onClick={() => setIsTaskModalOpen(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Body Form */}
                  <div className="p-5 space-y-4">
                    {/* Assignee Form */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Assign Clinician Reviewer</label>
                      <div className="flex gap-2">
                        <select
                          value={assigneeName}
                          onChange={(e) => {
                            const val = e.target.value;
                            setAssigneeName(val);
                            const rev = EDITORIAL_REVIEWERS.find(r => r.name === val);
                            if (rev) {
                              setAssigneeRole(rev.role);
                            }
                          }}
                          className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                        >
                          <option value="">Select Clinician...</option>
                          {EDITORIAL_REVIEWERS.map(rev => (
                            <option key={rev.id} value={rev.name}>
                              {rev.name} ({rev.role})
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAssignTask(selectedTask.id)}
                          className="px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition-all"
                        >
                          Assign
                        </button>
                      </div>
                    </div>

                    {/* Status transition */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Transition Task Status</label>
                      <div className="flex gap-2">
                        <select
                          value={transitionStatusField}
                          onChange={(e) => setTransitionStatusField(e.target.value as any)}
                          className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        >
                          <option value="backlog">Backlog</option>
                          <option value="assigned">Assigned</option>
                          <option value="in-progress">In Progress</option>
                          <option value="blocked">Blocked</option>
                          <option value="ready-for-review">Ready for Review</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleTransitionStatus(selectedTask.id, transitionStatusField)}
                          className="px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition-all"
                        >
                          Update Status
                        </button>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Add Workflow Notes</label>
                      <textarea
                        value={taskNote}
                        onChange={(e) => setTaskNote(e.target.value)}
                        placeholder="Detail blockers, citations reference updates, or review checklists..."
                        rows={3}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-teal-500 resize-none"
                      />
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {activeWorkspaceTab === "rag" && (
          !userHasPermission("RAG_INDEX_MANAGE") ? (
            renderAccessDenied("RAG_INDEX_MANAGE")
          ) : (
            <div className="space-y-6">
            {/* RAG Health Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-neutral-900/40 border border-neutral-800 p-4 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Vector Index Coverage</span>
                <span className="text-3xl font-extrabold text-teal-400 mt-2">
                  {ragStats?.coveragePercent !== undefined ? `${ragStats.coveragePercent}%` : "0%"}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">Pre-computed coverage percentage</span>
              </div>
              <div className="bg-neutral-900/40 border border-neutral-800 p-4 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Total Stored Vectors</span>
                <span className="text-3xl font-extrabold text-white mt-2">
                  {ragStats?.totalVectors ?? 0}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 font-mono text-[9px] truncate">
                  Dims: {ragStats?.dimensions ?? "N/A"} ({ragStats?.model ?? "N/A"})
                </span>
              </div>
              <div className="bg-neutral-900/40 border border-neutral-800 p-4 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Stale / Unindexed</span>
                <span className="text-3xl font-extrabold text-amber-500 mt-2">
                  {ragStale.length}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">Requires reindexing update</span>
              </div>
              <div className="bg-neutral-900/40 border border-neutral-800 p-4 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Active Queue Jobs</span>
                <span className="text-3xl font-extrabold text-indigo-400 mt-2">
                  {ragQueue.filter((j: any) => j.status === "pending" || j.status === "processing").length}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">Failed queue jobs: {ragQueue.filter((j: any) => j.status === "failed").length}</span>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="p-6 bg-neutral-900/40 border border-neutral-800 rounded-2xl space-y-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Index Actions & Synchronization</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Asynchronously sync CMS changes with the persistent vector store.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    disabled={isRagLoading}
                    onClick={() => handleRagAction("processQueue")}
                    className="px-4 py-2 bg-neutral-950 border border-neutral-850 hover:border-neutral-750 text-slate-350 hover:text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-40"
                  >
                    Process Queue
                  </button>
                  <button
                    disabled={isRagLoading}
                    onClick={() => handleRagAction("reindexStale")}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-40"
                  >
                    Reindex Stale Articles
                  </button>
                  <button
                    disabled={isRagLoading}
                    onClick={() => handleRagAction("retryFailedJobs")}
                    className="px-4 py-2 bg-rose-650/20 border border-rose-500/30 hover:bg-rose-650/35 text-rose-400 rounded-xl text-xs font-semibold transition-all disabled:opacity-40"
                  >
                    Retry Failed Jobs
                  </button>
                </div>
              </div>

              {ragActionMessage && (
                <div className="bg-[#0f172a] border border-blue-900/30 text-blue-400 px-4 py-3 rounded-xl text-[10px] font-semibold">
                  {ragActionMessage}
                </div>
              )}
            </div>

            {/* Queue & Stale lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Queue */}
              <div className="p-6 bg-[#070b14]/50 border border-neutral-800 rounded-2xl flex flex-col h-[55vh]">
                <div className="flex justify-between items-center mb-4 border-b border-neutral-850 pb-2.5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Embedding Queue</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-850 text-slate-400 font-mono">
                    {ragQueue.length} total
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                  {ragQueue.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 text-[10px]">
                      Queue is currently empty.
                    </div>
                  ) : (
                    ragQueue.map((job: any) => (
                      <div key={job.id} className="p-3 bg-neutral-900/40 border border-neutral-850 rounded-xl space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white text-xs truncate max-w-[200px]">{job.title}</span>
                          <span className={`text-[8px] px-1.5 py-0.2 rounded font-mono font-bold uppercase ${
                            job.status === "completed" ? "bg-emerald-500/10 text-emerald-400" :
                            job.status === "processing" ? "bg-blue-500/10 text-blue-400 animate-pulse" :
                            job.status === "failed" ? "bg-rose-500/10 text-rose-400" :
                            "bg-amber-500/10 text-amber-400"
                          }`}>
                            {job.status}
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-500">
                          Job ID: {job.id} | Attempts: {job.attempts} | Updated: {new Date(job.updatedAt).toLocaleTimeString()}
                        </p>
                        {job.error && (
                          <p className="text-[9px] text-rose-400 font-mono mt-1 border-t border-rose-500/10 pt-1">
                            Error: {job.error}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Stale List */}
              <div className="p-6 bg-[#070b14]/50 border border-neutral-800 rounded-2xl flex flex-col h-[55vh]">
                <div className="flex justify-between items-center mb-4 border-b border-neutral-850 pb-2.5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Stale / Missing Vectors</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/20 text-amber-400 font-mono border border-amber-900/20">
                    {ragStale.length} articles
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                  {ragStale.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 text-[10px]">
                      ✓ All published vectors are fully synchronized.
                    </div>
                  ) : (
                    ragStale.map((stale: any) => (
                      <div key={stale.id} className="p-3 bg-neutral-900/40 border border-neutral-850 rounded-xl flex justify-between items-center">
                        <div className="space-y-0.5">
                          <span className="font-bold text-white text-xs">{stale.title}</span>
                          <p className="text-[9px] text-slate-500">
                            ID: {stale.id} | Type: <span className="font-mono uppercase">{stale.entityType}</span>
                          </p>
                        </div>
                        <span className="text-[8px] px-1.5 py-0.5 rounded font-mono bg-amber-500/10 text-amber-400 border border-amber-500/10">
                          OUT-OF-SYNC
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      )}

      </div>

      {/* METADATA EDIT MODAL */}
      {isEditModalOpen && editingEntity && (
        <div className="fixed inset-0 z-50 bg-[#04060d]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1120] border border-neutral-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-neutral-850 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white">Edit Editorial Metadata</h3>
                <span className="text-[10px] text-slate-500 font-mono">{editingEntity.title.en} ({editingEntity.id})</span>
              </div>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingEntity(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex flex-wrap border-b border-neutral-850 px-6 bg-neutral-900/20 gap-1">
              <button
                type="button"
                onClick={() => setActiveModalTab("general")}
                className={`py-2 px-3 text-[11px] font-bold border-b-2 transition-all ${
                  activeModalTab === "general"
                    ? "border-teal-500 text-teal-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Metadata
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab("draft")}
                className={`py-2 px-3 text-[11px] font-bold border-b-2 transition-all ${
                  activeModalTab === "draft"
                    ? "border-teal-500 text-teal-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Draft Content
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab("clinical-review")}
                className={`py-2 px-3 text-[11px] font-bold border-b-2 transition-all ${
                  activeModalTab === "clinical-review"
                    ? "border-teal-500 text-teal-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Clinical Review
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab("evidence")}
                className={`py-2 px-3 text-[11px] font-bold border-b-2 transition-all ${
                  activeModalTab === "evidence"
                    ? "border-teal-500 text-teal-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Evidence & Freshness
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab("timeline")}
                className={`py-2 px-3 text-[11px] font-bold border-b-2 transition-all ${
                  activeModalTab === "timeline"
                    ? "border-teal-500 text-teal-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Version Timeline
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab("publish")}
                className={`py-2 px-3 text-[11px] font-bold border-b-2 transition-all ${
                  activeModalTab === "publish"
                    ? "border-teal-500 text-teal-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Publish Gateway
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab("ai")}
                className={`py-2 px-3 text-[11px] font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeModalTab === "ai"
                    ? "border-teal-500 text-teal-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Sparkles className="h-3 w-3" />
                AI Assist
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              
              {isLoadingCms ? (
                <div className="text-center py-12 text-slate-500 font-mono animate-pulse">
                  Loading draft telemetry...
                </div>
              ) : activeModalTab === "general" ? (
                <form onSubmit={handleSaveMetadataChanges} className="space-y-4">
                  <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-3 rounded-xl">
                    <p className="text-[10px] leading-relaxed font-bold">
                      ⚠️ Session-only changes. Firestore/CMS persistence pending.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Reviewer Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">REVIEWER NAME</label>
                      <input
                        type="text"
                        value={typeof editingEntity.reviewer === "string" ? editingEntity.reviewer : editingEntity.reviewer?.name || ""}
                        onChange={(e) => setEditingEntity({
                          ...editingEntity,
                          reviewer: {
                            ...(typeof editingEntity.reviewer === "object" ? editingEntity.reviewer : {}),
                            name: e.target.value
                          }
                        })}
                        className="w-full bg-[#070b14] border border-neutral-800 rounded-xl p-2.5 text-slate-200 focus:border-teal-500/50 focus:outline-none"
                        required
                      />
                    </div>

                    {/* Reviewer Role */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">REVIEWER ROLE / SPECIALTY</label>
                      <input
                        type="text"
                        value={editingEntity.reviewerRole || ""}
                        onChange={(e) => setEditingEntity({ ...editingEntity, reviewerRole: e.target.value })}
                        className="w-full bg-[#070b14] border border-neutral-800 rounded-xl p-2.5 text-slate-200 focus:border-teal-500/50 focus:outline-none"
                      />
                    </div>

                    {/* Review status */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">REVIEW GOVERNANCE STATUS</label>
                      <select
                        value={editingEntity.reviewStatus || "needs-review"}
                        onChange={(e) => setEditingEntity({ ...editingEntity, reviewStatus: e.target.value as ReviewStatus })}
                        className="w-full bg-[#070b14] border border-neutral-800 rounded-xl p-2.5 text-slate-200 focus:outline-none"
                      >
                        <option value="draft">Draft</option>
                        <option value="needs-review">Needs Review</option>
                        <option value="clinically-reviewed">Clinically Reviewed</option>
                        <option value="references-needed">References Needed</option>
                        <option value="update-required">Update Required</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    {/* Citation Health */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">CITATION HEALTH</label>
                      <select
                        value={editingEntity.citationHealth || "needs-attention"}
                        onChange={(e) => setEditingEntity({ ...editingEntity, citationHealth: e.target.value as HealthIndicator })}
                        className="w-full bg-[#070b14] border border-neutral-800 rounded-xl p-2.5 text-slate-200 focus:outline-none"
                      >
                        <option value="excellent">Excellent (3+ refs)</option>
                        <option value="good">Good (1-2 refs)</option>
                        <option value="needs-attention">Needs Attention (0 refs)</option>
                      </select>
                    </div>

                    {/* Last Clinical Review */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">LAST CLINICAL REVIEW DATE</label>
                      <input
                        type="text"
                        value={editingEntity.lastClinicalReview || ""}
                        onChange={(e) => setEditingEntity({ ...editingEntity, lastClinicalReview: e.target.value })}
                        placeholder="YYYY-MM-DD"
                        className="w-full bg-[#070b14] border border-neutral-800 rounded-xl p-2.5 text-slate-200 focus:border-teal-500/50 focus:outline-none"
                      />
                    </div>

                    {/* Next Clinical Review */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">NEXT CLINICAL REVIEW DEADLINE</label>
                      <input
                        type="text"
                        value={editingEntity.nextClinicalReview || ""}
                        onChange={(e) => setEditingEntity({ ...editingEntity, nextClinicalReview: e.target.value })}
                        placeholder="YYYY-MM-DD"
                        className="w-full bg-[#070b14] border border-neutral-800 rounded-xl p-2.5 text-slate-200 focus:border-teal-500/50 focus:outline-none"
                      />
                    </div>

                    {/* References verified */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">REFERENCES VERIFIED DATE</label>
                      <input
                        type="text"
                        value={editingEntity.referencesUpdated || ""}
                        onChange={(e) => setEditingEntity({ ...editingEntity, referencesUpdated: e.target.value })}
                        placeholder="YYYY-MM-DD"
                        className="w-full bg-[#070b14] border border-neutral-800 rounded-xl p-2.5 text-slate-200 focus:border-teal-500/50 focus:outline-none"
                      />
                    </div>

                    {/* Version */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">ARTICLE VERSION</label>
                      <input
                        type="text"
                        value={editingEntity.version || ""}
                        onChange={(e) => setEditingEntity({ ...editingEntity, version: e.target.value })}
                        className="w-full bg-[#070b14] border border-neutral-800 rounded-xl p-2.5 text-slate-200 focus:border-teal-500/50 focus:outline-none"
                      />
                    </div>

                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="edit-cornerstone"
                      checked={!!editingEntity.isCornerstone}
                      onChange={(e) => setEditingEntity({ ...editingEntity, isCornerstone: e.target.checked })}
                      className="rounded text-teal-500 bg-neutral-950 border-neutral-800 focus:ring-teal-500/20"
                    />
                    <label htmlFor="edit-cornerstone" className="text-[10px] text-slate-400 font-bold uppercase cursor-pointer">Mark as Cornerstone Article</label>
                  </div>

                  {/* Changes summary */}
                  <div className="space-y-1 pt-2">
                    <label className="text-[10px] text-slate-400 font-bold block">CLINICAL CHANGES SINCE LAST REVISION</label>
                    <textarea
                      rows={2}
                      value={editingEntity.clinicalChangesSinceLastRevision || ""}
                      onChange={(e) => setEditingEntity({ ...editingEntity, clinicalChangesSinceLastRevision: e.target.value })}
                      placeholder="Detail specific content updates, dosage changes, or guidelines modifications..."
                      className="w-full bg-[#070b14] border border-neutral-800 rounded-xl p-2.5 text-slate-200 focus:border-teal-500/50 focus:outline-none resize-none"
                    />
                  </div>

                  {/* Editorial Notes */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold block">INTERNAL EDITORIAL NOTES (NEVER PUBLISHED)</label>
                    <textarea
                      rows={3}
                      value={editingEntity.editorialNotes || ""}
                      onChange={(e) => setEditingEntity({ ...editingEntity, editorialNotes: e.target.value })}
                      placeholder="e.g. Dr. Narayan Jethwani completed review on gastrointestinal symptoms. Safe for clinical RAG indexing."
                      className="w-full bg-[#070b14] border border-neutral-800 rounded-xl p-2.5 text-slate-200 focus:border-teal-500/50 focus:outline-none resize-none"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="pt-4 border-t border-neutral-850 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditModalOpen(false);
                        setEditingEntity(null);
                      }}
                      className="px-4 py-2 bg-neutral-900 border border-neutral-850 hover:border-neutral-800 rounded-xl text-slate-400 hover:text-slate-200 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-semibold"
                    >
                      Save Metadata
                    </button>
                  </div>
                </form>
              ) : activeModalTab === "draft" ? (
                <form onSubmit={handleSaveDraftChanges} className="space-y-4">
                  <div className="bg-teal-500/5 border border-teal-500/10 text-teal-400 p-3 rounded-xl text-[10px] leading-relaxed">
                    📝 <strong>Draft Edit Mode</strong>: Changes made here update the draft snapshot. They will not be visible on the public platform until published.
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">DRAFT CONTENT BODY (HTML / MARKDOWN)</label>
                      <textarea
                        rows={8}
                        value={draftContentField}
                        onChange={(e) => setDraftContentField(e.target.value)}
                        placeholder="Article details, material medica guides, clinical studies..."
                        className="w-full bg-[#070b14] border border-neutral-800 rounded-xl p-2.5 text-slate-200 focus:border-teal-500/50 focus:outline-none font-mono"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">PATIENT-FRIENDLY SUMMARY</label>
                      <textarea
                        rows={3}
                        value={patientSummaryField}
                        onChange={(e) => setPatientSummaryField(e.target.value)}
                        placeholder="Simple, warm summary for patients..."
                        className="w-full bg-[#070b14] border border-neutral-800 rounded-xl p-2.5 text-slate-200 focus:border-teal-500/50 focus:outline-none resize-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">PRACTITIONER CLINICAL SUMMARY</label>
                      <textarea
                        rows={3}
                        value={practitionerSummaryField}
                        onChange={(e) => setPractitionerSummaryField(e.target.value)}
                        placeholder="Technical details for clinical practitioners..."
                        className="w-full bg-[#070b14] border border-neutral-800 rounded-xl p-2.5 text-slate-200 focus:border-teal-500/50 focus:outline-none resize-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">EDUCATIONAL STUDENT SUMMARY</label>
                      <textarea
                        rows={3}
                        value={educationalSummaryField}
                        onChange={(e) => setEducationalSummaryField(e.target.value)}
                        placeholder="Keynotes, Organon references, study guides..."
                        className="w-full bg-[#070b14] border border-neutral-800 rounded-xl p-2.5 text-slate-200 focus:border-teal-500/50 focus:outline-none resize-none"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="pt-4 border-t border-neutral-850 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditModalOpen(false);
                        setEditingEntity(null);
                      }}
                      className="px-4 py-2 bg-neutral-900 border border-neutral-850 hover:border-neutral-800 rounded-xl text-slate-400 hover:text-slate-200 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-semibold"
                    >
                      Save Staging Draft
                    </button>
                  </div>
                </form>
              ) : activeModalTab === "clinical-review" ? (
                <form onSubmit={handleApproveClinicalReview} className="space-y-4">
                  <div className="bg-indigo-500/5 border border-indigo-500/10 text-indigo-400 p-3 rounded-xl text-[10px] leading-relaxed">
                    🛡️ <strong>Clinical Approval Gate</strong>: Approve the draft for clinical safety. Approving updates the status to <code>clinically-approved</code>.
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">CLINICAL REVIEWER</label>
                      <select
                        value={clinicalReviewerName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setClinicalReviewerName(val);
                          const rev = EDITORIAL_REVIEWERS.find(r => r.name === val);
                          if (rev) {
                            setClinicalReviewerRole(rev.role);
                          }
                        }}
                        className="w-full bg-[#070b14] border border-neutral-800 rounded-xl p-2.5 text-slate-200 focus:outline-none"
                        required
                      >
                        <option value="">Select registered reviewer...</option>
                        {EDITORIAL_REVIEWERS.map(rev => (
                          <option key={rev.id} value={rev.name}>
                            {rev.name} ({rev.role})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">REVIEWER ROLE / SPECIALTY</label>
                      <input
                        type="text"
                        value={clinicalReviewerRole}
                        onChange={(e) => setClinicalReviewerRole(e.target.value)}
                        className="w-full bg-[#070b14] border border-neutral-800 rounded-xl p-2.5 text-slate-200 focus:outline-none"
                        required
                        readOnly
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">CLINICAL REVIEW DATE</label>
                      <input
                        type="date"
                        value={clinicalReviewDate}
                        onChange={(e) => setClinicalReviewDate(e.target.value)}
                        className="w-full bg-[#070b14] border border-neutral-800 rounded-xl p-2.5 text-slate-200 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">NEXT CLINICAL REVIEW DEADLINE</label>
                      <input
                        type="date"
                        value={clinicalNextReviewDate}
                        onChange={(e) => setClinicalNextReviewDate(e.target.value)}
                        className="w-full bg-[#070b14] border border-neutral-800 rounded-xl p-2.5 text-slate-200 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold block">REVIEW REMARKS & SAFETY NOTES</label>
                    <textarea
                      rows={3}
                      value={clinicalNotes}
                      onChange={(e) => setClinicalNotes(e.target.value)}
                      placeholder="Add specific annotations concerning clinical checks performed..."
                      className="w-full bg-[#070b14] border border-neutral-800 rounded-xl p-2.5 text-slate-200 focus:outline-none resize-none"
                    />
                  </div>

                  {currentDraft && (
                    <div className="text-[10px] text-slate-500 font-mono">
                      Current Draft Status: <span className="uppercase font-bold text-amber-400">{currentDraft.status}</span>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="pt-4 border-t border-neutral-850 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditModalOpen(false);
                        setEditingEntity(null);
                      }}
                      className="px-4 py-2 bg-neutral-900 border border-neutral-850 hover:border-neutral-800 rounded-xl text-slate-400 hover:text-slate-200 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve & Clinical review
                    </button>
                  </div>
                </form>
              ) : activeModalTab === "evidence" ? (
                <form onSubmit={handleSaveDraftChanges} className="space-y-4">
                  <div className="bg-teal-500/5 border border-teal-500/10 text-teal-400 p-3 rounded-xl text-[10px] leading-relaxed">
                    🧬 <strong>Evidence Metadata & Review Freshness Profile</strong>: Structured ratings used by deterministic search priority scoring and AI RAG retrieval.
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">EVIDENCE STRENGTH</label>
                      <select
                        value={evidenceStrength}
                        onChange={(e) => setEvidenceStrength(e.target.value)}
                        className="w-full bg-[#070b14] border border-neutral-850 rounded-xl p-2.5 text-slate-200 focus:outline-none"
                        required
                      >
                        <option value="very-low">Very Low (Level-E / Anecdotal)</option>
                        <option value="low">Low (Level-D / Case Report)</option>
                        <option value="moderate">Moderate (Level-C / Observational)</option>
                        <option value="high">High (Level-B / Controlled Trial)</option>
                        <option value="very-high">Very High (Level-A / Meta-analysis)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">SOURCE QUALITY</label>
                      <select
                        value={sourceQuality}
                        onChange={(e) => setSourceQuality(e.target.value)}
                        className="w-full bg-[#070b14] border border-neutral-850 rounded-xl p-2.5 text-slate-200 focus:outline-none"
                        required
                      >
                        <option value="unverified">Unverified (Self-published / Blog)</option>
                        <option value="secondary">Secondary (Textbook compilation)</option>
                        <option value="primary">Primary (Original historical text)</option>
                        <option value="peer-reviewed">Peer-Reviewed Journal</option>
                        <option value="authoritative">Authoritative (Pharmacopoeia / Consensus)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">CLINICAL CONFIDENCE (0-100)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={clinicalConfidence}
                        onChange={(e) => setClinicalConfidence(parseInt(e.target.value) || 0)}
                        className="w-full bg-[#070b14] border border-neutral-850 rounded-xl p-2.5 text-slate-200 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">EDITORIAL CONFIDENCE (0-100)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editorialConfidence}
                        onChange={(e) => setEditorialConfidence(parseInt(e.target.value) || 0)}
                        className="w-full bg-[#070b14] border border-neutral-850 rounded-xl p-2.5 text-slate-200 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">REVIEW INTERVAL (DAYS)</label>
                      <input
                        type="number"
                        min="1"
                        max="3650"
                        value={reviewIntervalDays}
                        onChange={(e) => setReviewIntervalDays(parseInt(e.target.value) || 365)}
                        className="w-full bg-[#070b14] border border-neutral-850 rounded-xl p-2.5 text-slate-200 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">REVIEW GRACE PERIOD (DAYS)</label>
                      <input
                        type="number"
                        min="0"
                        max="365"
                        value={reviewGracePeriodDays}
                        onChange={(e) => setReviewGracePeriodDays(parseInt(e.target.value) || 90)}
                        className="w-full bg-[#070b14] border border-neutral-850 rounded-xl p-2.5 text-slate-200 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] text-slate-400 font-bold block">REVIEW EXPIRY RETRIEVAL POLICY</label>
                      <select
                        value={reviewExpiryPolicy}
                        onChange={(e) => setReviewExpiryPolicy(e.target.value)}
                        className="w-full bg-[#070b14] border border-neutral-850 rounded-xl p-2.5 text-slate-200 focus:outline-none"
                        required
                      >
                        <option value="flag-only">Flag Only (Warn admins, no search penalty)</option>
                        <option value="ranking-penalty">Ranking Penalty (Demote search priority)</option>
                        <option value="exclude-from-ai">Exclude From AI (Skip in AI context)</option>
                        <option value="exclude-from-all-search">Exclude From All (Hide from public search)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-6 py-2">
                    <label className="flex items-center gap-2 text-slate-300 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={classicalSource}
                        onChange={(e) => setClassicalSource(e.target.checked)}
                        className="rounded border-neutral-800 bg-[#070b14] text-teal-500 focus:ring-0"
                      />
                      <span>CLASSICAL TRADITIONAL SOURCE</span>
                    </label>

                    <label className="flex items-center gap-2 text-slate-300 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={modernSource}
                        onChange={(e) => setModernSource(e.target.checked)}
                        className="rounded border-neutral-800 bg-[#070b14] text-teal-500 focus:ring-0"
                      />
                      <span>MODERN CLINICAL SOURCE</span>
                    </label>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold block">EVIDENCE RATIONALE & CITATION SUMMARY</label>
                    <textarea
                      rows={3}
                      value={evidenceRationale}
                      onChange={(e) => setEvidenceRationale(e.target.value)}
                      placeholder="Explain the clinical basis, supporting studies, and reasoning behind this evidence profile classification..."
                      className="w-full bg-[#070b14] border border-neutral-850 rounded-xl p-2.5 text-slate-200 focus:outline-none resize-none"
                    />
                  </div>

                  {currentDraft?.evidenceProfile && (
                    <div className="p-3 bg-neutral-900/60 border border-neutral-850 rounded-xl space-y-1.5 font-mono text-[9px] text-slate-400">
                      <div>Assessed By: <span className="text-slate-200">{currentDraft.evidenceProfile.assessedBy || "N/A"}</span></div>
                      <div>Assessed At: <span className="text-slate-200">{currentDraft.evidenceProfile.assessedAt || "N/A"}</span></div>
                      <div>Structural Citation Completeness: <span className="text-teal-400 font-bold">{currentDraft.evidenceProfile.citationCompleteness ?? "N/A"}%</span></div>
                      <div>Last Reviewed At: <span className="text-slate-200">{currentDraft.evidenceProfile.lastReviewedAt || "N/A"}</span></div>
                      <div>Next Review Due At: <span className="text-slate-200">{currentDraft.evidenceProfile.nextReviewDueAt || "N/A"}</span></div>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="pt-4 border-t border-neutral-850 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditModalOpen(false);
                        setEditingEntity(null);
                      }}
                      className="px-4 py-2 bg-neutral-900 border border-neutral-850 hover:border-neutral-800 rounded-xl text-slate-400 hover:text-slate-200 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-teal-650 hover:bg-teal-600 text-white rounded-xl font-semibold flex items-center gap-1.5"
                    >
                      <Save className="h-4 w-4" />
                      Save Evidence Settings
                    </button>
                  </div>
                </form>
              ) : activeModalTab === "timeline" ? (
                <div className="space-y-4">
                  <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-2xl">
                    <h5 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">Version History Snapshots</h5>
                    {versionsList.length === 0 ? (
                      <div className="text-center py-6 text-slate-500 text-xs">No version snapshots found. Save a draft to register snapshots.</div>
                    ) : (
                      <div className="space-y-2.5 max-h-[40vh] overflow-y-auto pr-1">
                        {versionsList.map(v => (
                          <div key={v.id} className="p-3 bg-neutral-900/40 border border-neutral-850 rounded-xl flex justify-between items-center gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-xs">Version {v.version}</span>
                                <span className="text-[9px] px-1.5 py-0.2 rounded font-mono uppercase bg-neutral-850 text-slate-400">{v.status}</span>
                              </div>
                              <p className="text-[10px] text-slate-500">
                                Changed by {v.createdBy || "System"} on {new Date(v.createdAt).toLocaleDateString()} at {new Date(v.createdAt).toLocaleTimeString()}
                              </p>
                              <p className="text-[10px] text-slate-300 italic">{v.changeSummary}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRollback(v.id)}
                              className="px-3 py-1.5 bg-indigo-650 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg transition-all shrink-0"
                            >
                              Restore
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : activeModalTab === "publish" ? (
                <form onSubmit={handlePublishArticle} className="space-y-4">
                  <div className="bg-[#0f172a] border border-blue-900/30 text-blue-400 p-3 rounded-xl text-[10px] leading-relaxed">
                    🚀 <strong>Production Publishing</strong>: Publishes the staging draft to the public site and Clinical OS search directory.
                  </div>

                  {currentDraft?.status !== "approved" && currentDraft?.status !== "clinically-approved" && currentDraft?.status !== "ready-to-publish" && currentDraft?.status !== "published" ? (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-xl font-semibold flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <div>
                        Article must be clinically approved by a reviewer before publishing.
                        <p className="text-[9px] font-normal mt-0.5 text-slate-400">Current draft status is &quot;{currentDraft?.status || "draft"}&quot;. Approve under the Clinical Review tab first.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl font-bold flex items-center gap-2 text-[10px]">
                      <Check className="h-4 w-4 text-emerald-400" />
                      ✓ Article satisfies clinical review requirements and is ready for production.
                    </div>
                  )}

                  {publishingErrors && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl space-y-1">
                      <div className="font-bold text-[10px] uppercase flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Gate Validation Failed - Publication Blocked:
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5 text-[10px]">
                        {publishingErrors.map((err, idx) => (
                          <li key={idx}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {publicationSuccess && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-[10px] font-bold">
                      ✓ Article successfully published! Public routes and Vector indices have been updated.
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold block">PUBLISH CHANGE SUMMARY (PUBLIC LOG)</label>
                    <input
                      type="text"
                      value={changeSummary}
                      onChange={(e) => setChangeSummary(e.target.value)}
                      placeholder="e.g. Revised dosing guidelines and added PubMed references."
                      className="w-full bg-[#070b14] border border-neutral-800 rounded-xl p-2.5 text-slate-200 focus:border-teal-500/50 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-3.5 rounded-xl font-bold flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
                    <div>
                      <span>Confirm Production Write-Back</span>
                      <p className="text-[9px] font-normal mt-0.5 text-slate-400">Publishing updates public Knowledge content. Confirm only after human clinical review and final editorial approval.</p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="pt-4 border-t border-neutral-850 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditModalOpen(false);
                        setEditingEntity(null);
                      }}
                      className="px-4 py-2 bg-neutral-900 border border-neutral-850 hover:border-neutral-800 rounded-xl text-slate-400 hover:text-slate-200 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={currentDraft?.status !== "approved" && currentDraft?.status !== "clinically-approved" && currentDraft?.status !== "ready-to-publish" && currentDraft?.status !== "published"}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-650/15"
                    >
                      <Check className="h-4 w-4" />
                      Publish to Production
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {/* Summary Generator */}
                  <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-teal-400" />
                        AI Summary Generator
                      </h4>
                      <button
                        type="button"
                        onClick={handleGenerateAiSummaries}
                        disabled={isGeneratingSummaries}
                        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:bg-neutral-800 disabled:text-slate-500 text-white rounded-lg font-bold flex items-center gap-1 transition-all"
                      >
                        {isGeneratingSummaries ? (
                          <>
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            Drafting...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3 w-3" />
                            Draft Summaries with AI
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      Generates English patient-friendly, practitioner clinical, and student study summaries using Gemini or local fallback LLMs. *Must be verified by a human editor before saving.*
                    </p>
                    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-2.5 rounded-xl text-[10px] font-bold">
                      ⚠️ AI-generated draft suggestions. Requires clinical editorial review before use.
                    </div>

                    <div className="space-y-3 pt-2">
                      {/* Patient Summary */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">PATIENT-FRIENDLY SUMMARY</label>
                        <textarea
                          rows={3}
                          value={editingEntity.aiKnowledge?.patientSummary || editingEntity.summary?.en || ""}
                          onChange={(e) => setEditingEntity({
                            ...editingEntity,
                            summary: { ...editingEntity.summary, en: e.target.value },
                            aiKnowledge: {
                              ...(editingEntity.aiKnowledge || {
                                retrievalSummary: "",
                                differentialSummary: "",
                                practitionerSummary: "",
                                patientSummary: "",
                                educationalSummary: "",
                                graphContext: "",
                                embeddingText: ""
                              }),
                              patientSummary: e.target.value
                            }
                          })}
                          placeholder="e.g. Warm, simple description of the topic..."
                          className="w-full bg-[#070b14] border border-neutral-800 rounded-xl p-2.5 text-slate-200 focus:border-teal-500/50 focus:outline-none resize-none"
                        />
                      </div>

                      {/* Practitioner Summary */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">PRACTITIONER SUMMARY (CLINICAL PATHOPHYSIOLOGY)</label>
                        <textarea
                          rows={3}
                          value={editingEntity.aiKnowledge?.practitionerSummary || editingEntity.aiReadiness?.clinicalSummary || ""}
                          onChange={(e) => setEditingEntity({
                            ...editingEntity,
                            aiKnowledge: {
                              ...(editingEntity.aiKnowledge || {
                                retrievalSummary: "",
                                differentialSummary: "",
                                practitionerSummary: "",
                                patientSummary: "",
                                educationalSummary: "",
                                graphContext: "",
                                embeddingText: ""
                              }),
                              practitionerSummary: e.target.value
                            },
                            aiReadiness: {
                              ...(editingEntity.aiReadiness || {
                                retrievalSummary: "",
                                clinicalSummary: "",
                                patientSummary: "",
                                studentSummary: "",
                                keywords: [],
                                semanticKeywords: [],
                                bodySystem: "general",
                                urgency: "routine"
                              }),
                              clinicalSummary: e.target.value
                            }
                          })}
                          placeholder="e.g. Highly technical description including cytokine profiles, miasmatic affinity..."
                          className="w-full bg-[#070b14] border border-neutral-800 rounded-xl p-2.5 text-slate-200 focus:border-teal-500/50 focus:outline-none resize-none"
                        />
                      </div>

                      {/* Educational Summary */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold block">EDUCATIONAL SUMMARY (STUDENT STUDY GUIDE)</label>
                        <textarea
                          rows={3}
                          value={editingEntity.aiKnowledge?.educationalSummary || editingEntity.aiReadiness?.studentSummary || ""}
                          onChange={(e) => setEditingEntity({
                            ...editingEntity,
                            aiKnowledge: {
                              ...(editingEntity.aiKnowledge || {
                                retrievalSummary: "",
                                differentialSummary: "",
                                practitionerSummary: "",
                                patientSummary: "",
                                educationalSummary: "",
                                graphContext: "",
                                embeddingText: ""
                              }),
                              educationalSummary: e.target.value
                            },
                            aiReadiness: {
                              ...(editingEntity.aiReadiness || {
                                retrievalSummary: "",
                                clinicalSummary: "",
                                patientSummary: "",
                                studentSummary: "",
                                keywords: [],
                                semanticKeywords: [],
                                bodySystem: "general",
                                urgency: "routine"
                              }),
                              studentSummary: e.target.value
                            }
                          })}
                          placeholder="e.g. Keynotes, Organon links, and differentials for study..."
                          className="w-full bg-[#070b14] border border-neutral-800 rounded-xl p-2.5 text-slate-200 focus:border-teal-500/50 focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quality Gate Audit */}
                  <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-2xl space-y-3">
                    <p className="text-[10px] text-slate-500 leading-relaxed italic">
                      This audit is an editorial support tool, not clinical validation.
                    </p>
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <ShieldAlert className="h-4 w-4 text-teal-400" />
                        Clinical Quality & Compliance Audit
                      </h4>
                      <button
                        type="button"
                        onClick={handlePerformQualityAudit}
                        disabled={isAuditing}
                        className="px-3 py-1.5 bg-indigo-650 hover:bg-indigo-600 disabled:bg-neutral-800 disabled:text-slate-500 text-white rounded-lg font-bold flex items-center gap-1 transition-all"
                      >
                        {isAuditing ? (
                          <>
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            Auditing...
                          </>
                        ) : (
                          <>
                            <Activity className="h-3 w-3" />
                            Perform Quality Audit
                          </>
                        )}
                      </button>
                    </div>

                    {/* Compliance Alert Box */}
                    {auditComplianceIssues.length > 0 ? (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl space-y-1">
                        <div className="font-bold text-[10px] uppercase flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          Compliance Warnings Detected:
                        </div>
                        <ul className="list-disc pl-4 space-y-0.5 text-[10px]">
                          {auditComplianceIssues.map((issue, idx) => (
                            <li key={idx}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-[10px] font-bold">
                        ✓ No compliance issues or prohibited homeopathic claims detected.
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-neutral-900/50 p-2.5 rounded-xl border border-neutral-800/80">
                        <span className="text-[10px] text-slate-500 block">Readability Score</span>
                        <span className="text-sm font-bold text-white font-mono">{editingEntity.readabilityScore?.score || 0} / 100</span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">({editingEntity.readabilityScore?.readingLevel || "Mixed"})</span>
                      </div>
                      <div className="bg-neutral-900/50 p-2.5 rounded-xl border border-neutral-800/80">
                        <span className="text-[10px] text-slate-500 block">SEO Score</span>
                        <span className="text-sm font-bold text-white font-mono">{editingEntity.seoGeoScores?.seoScore || 0} / 100</span>
                      </div>
                      <div className="bg-neutral-900/50 p-2.5 rounded-xl border border-neutral-800/80">
                        <span className="text-[10px] text-slate-500 block">Localization Score</span>
                        <span className="text-sm font-bold text-white font-mono">{editingEntity.seoGeoScores?.geoScore || 0} / 100</span>
                      </div>
                      <div className="bg-neutral-900/50 p-2.5 rounded-xl border border-neutral-800/80">
                        <span className="text-[10px] text-slate-500 block">AI Readiness Score</span>
                        <span className="text-sm font-bold text-white font-mono">{editingEntity.seoGeoScores?.aiReadinessScore || 0} / 100</span>
                      </div>
                    </div>
                  </div>

                  {/* Vector Caching */}
                  <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-2xl space-y-3">
                    <p className="text-[10px] text-slate-500 leading-relaxed italic">
                      Syncs the embedding representation of this article to in-memory session cache for clinical RAG search.
                    </p>
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4 text-teal-400" />
                        Semantic Search Vector Caching
                      </h4>
                      <button
                        type="button"
                        onClick={handleSyncVector}
                        disabled={isSyncingVector}
                        className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-750 border border-neutral-750 disabled:bg-neutral-900 disabled:text-slate-600 text-slate-200 rounded-lg font-bold flex items-center gap-1 transition-all"
                      >
                        {isSyncingVector ? (
                          <>
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            Syncing...
                          </>
                        ) : (
                          <>
                            <Check className="h-3 w-3" />
                            Sync Vector Index
                          </>
                        )}
                      </button>
                    </div>

                    {vectorSyncMessage && (
                      <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-3 rounded-xl text-[10px] font-bold animate-pulse">
                        ⚠️ {vectorSyncMessage}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
