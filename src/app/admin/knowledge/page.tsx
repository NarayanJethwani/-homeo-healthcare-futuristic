"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  KmsDashboard, 
  EntityRegistry, 
  CitationLibrary, 
  KnowledgeEditor,
  FastTrackGovernancePanel,
  globalKmsRepository,
  KmsKnowledgeEntity,
  EditorialRole
} from "@/features/knowledge-admin";
import { LayoutDashboard, Database, BookOpen, ChevronLeft, ShieldCheck, FileCheck2 } from "lucide-react";

import { normalizeRole } from "@/lib/security/rbac";

interface UserSession {
  uid: string;
  email: string;
  name: string;
  role: string;
}

export default function AdminKmsPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  
  // Tabs: dashboard | registry | citations | governance
  const [activeTab, setActiveTab] = useState<"dashboard" | "registry" | "citations" | "governance">("dashboard");
  const [activeEditEntity, setActiveEditEntity] = useState<KmsKnowledgeEntity | null>(null);
  const [allEntities, setAllEntities] = useState<KmsKnowledgeEntity[]>([]);

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
  const loadAll = async () => {
    const list = await globalKmsRepository.getEntities();
    setAllEntities(list);
  };

  useEffect(() => {
    loadAll();
  }, [activeEditEntity]);

  const handleEditEntity = (e: KmsKnowledgeEntity) => {
    setActiveEditEntity(e);
  };

  const handleCreateEntity = (type: string) => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    const empty: KmsKnowledgeEntity = {
      id: `${type.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      slug: "untitled-slug",
      entityType: type as any,
      title: { en: "", hi: "", gu: "", mr: "", es: "", ar: "" },
      summary: { en: "", hi: "", gu: "", mr: "", es: "", ar: "" },
      relatedEntities: [],
      lastReviewed: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      author: { name: session?.name || "Medical Writer" },
      reviewer: { name: "Dr. Narayan Jethwani", credentials: "MD (Hom)", specialty: "General Therapeutics" },
      evidenceLevel: "Traditional-Literature",
      tags: [],
      canonicalUrl: "",
      editorialStatus: "draft",
      editorialNotes: "",
      nextReviewDate: nextYear.toISOString(),
      versionInfo: {
        version: "1.0.0",
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        reviewed: new Date().toISOString(),
        changelog: []
      },
      content: {},
      readabilityScore: {
        score: 90,
        readingLevel: "Patient Friendly",
        readingTimeMinutes: 1
      },
      seoGeoScores: {
        seoScore: 70,
        geoScore: 65,
        aiReadinessScore: 68
      }
    };
    setActiveEditEntity(empty);
  };

  const handleSaveEntity = async (updated: KmsKnowledgeEntity, reason: string) => {
    const isSuperAdmin = session?.role === "admin" || (session?.role && normalizeRole(session.role) === "super-admin");
    const role: EditorialRole = isSuperAdmin ? "Administrator" : "MedicalEditor";
    await globalKmsRepository.saveEntity(updated, session?.name || "Writer", role, reason);
    setActiveEditEntity(null);
    loadAll();
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] text-slate-400 flex items-center justify-center">
        Loading session...
      </div>
    );
  }

  const isSuperAdmin = session.role === "admin" || (session.role && normalizeRole(session.role) === "super-admin");
  const editorRole: EditorialRole = isSuperAdmin ? "Administrator" : "MedicalEditor";

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-300 font-sans pb-12 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Decorative anti-gravity background glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Navigation path & switcher */}
        <div className="flex justify-between items-center bg-neutral-900/40 p-4 border border-neutral-850 rounded-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (activeEditEntity) {
                  setActiveEditEntity(null);
                } else {
                  router.push("/admin/dashboard");
                }
              }}
              className="p-2 bg-neutral-950 border border-neutral-850 hover:border-neutral-750 text-neutral-400 hover:text-neutral-200 rounded-xl transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-neutral-500 font-mono">WORKSPACE</span>
                <span className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded">
                  Clinical KMS
                </span>
              </div>
              <h1 className="text-base font-extrabold text-neutral-200 leading-tight">
                {activeEditEntity ? "Entity Editor" : "Knowledge Base Dashboard"}
              </h1>
            </div>
          </div>

          {/* Switch tabs (only visible when not editing) */}
          {!activeEditEntity && (
            <div className="flex gap-1.5 bg-neutral-950 border border-neutral-850 p-1.5 rounded-xl">
              {[
                { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
                { id: "registry", label: "Registry", icon: Database },
                { id: "citations", label: "Citations", icon: BookOpen },
                { id: "governance", label: "AI Governance", icon: ShieldCheck }
              ].map(tab => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isSelected 
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" 
                        : "bg-transparent text-neutral-500 hover:text-neutral-350"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                );
              })}
              {isSuperAdmin && (
                <>
                  <button
                    onClick={() => router.push("/admin/knowledge-acquisition")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-400 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 transition-all"
                  >
                    <FileCheck2 className="h-3.5 w-3.5" />
                    Acquisition
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* WORKSPACE BODY */}
        {activeEditEntity ? (
          <KnowledgeEditor
            entity={activeEditEntity}
            allEntities={allEntities}
            currentUser={{ name: session.name, role: editorRole }}
            onSave={handleSaveEntity}
            onCancel={() => setActiveEditEntity(null)}
          />
        ) : (
          <div className="space-y-6">
            {activeTab === "dashboard" && (
              <KmsDashboard
                onEditEntity={handleEditEntity}
                onCreateEntity={handleCreateEntity}
                currentUser={{ name: session.name, role: editorRole }}
              />
            )}

            {activeTab === "registry" && (
              <EntityRegistry
                onEditEntity={handleEditEntity}
                onCreateEntity={handleCreateEntity}
              />
            )}

            {activeTab === "citations" && (
              <CitationLibrary />
            )}

            {activeTab === "governance" && (
              <FastTrackGovernancePanel
                entities={allEntities}
                onReviewEntity={handleEditEntity}
              />
            )}
          </div>
        )}

      </div>
    </div>
  );
}
