"use client";

import { FormEvent, KeyboardEvent, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Award,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Brain,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Download,
  ExternalLink,
  FileCheck2,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  Library,
  Maximize2,
  MessageSquareText,
  Minimize2,
  PanelRightClose,
  PanelRightOpen,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  X,
} from "lucide-react";
import {
  ACADEMY_SECTIONS,
  ANATOMY_REGIONS,
  ANATOMY_SYSTEMS,
  ASSESSMENT_QUESTIONS,
  PRACTICE_CASES,
  REGIONAL_ANATOMY_REFERENCE,
  getAnatomySystem,
  type AcademySection,
  type AnatomyRegionId,
  type AnatomySystemId,
} from "../data/medicalAcademyData";
import {
  buildPicoQuery,
  formatLiteratureLibraryAsRis,
  sanitizeLiteratureLibrary,
  type AcademyLiteratureCitation,
  type PicoQuestion,
} from "../data/literatureLibrary";
import HoloHumanDissectionToolbar from "./HoloHumanDissectionToolbar";
import HoloHumanPathologySimulator from "./HoloHumanPathologySimulator";
import HoloHumanSearchModal, { type SearchResultItem } from "./HoloHumanSearchModal";
import { REMEDY_TROPISM_DATA } from "../data/remedyTropismData";
import { HOLOHUMAN_SYSTEM_MATERIALS } from "../render/holoHumanMaterials";

type AssistantMode = "teach" | "quiz" | "research" | "homeopathy";
type AtlasLayer = "systems" | "regions";
type AtlasViewMode = "3d" | "2d";

interface AssistantMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  citations?: string[];
  evidenceStatus?: "curated" | "grounded" | "unverified" | "abstained";
}

interface LiteratureSearchResponse {
  success: boolean;
  query?: string;
  total?: number;
  citations?: AcademyLiteratureCitation[];
  retrievedAt?: string;
  error?: string;
}

interface MedicalAcademyWorkspaceProps {
  initialSection?: string;
  isImmersive?: boolean;
  onImmersiveChange?: (active: boolean) => void;
}

interface AcademyProgress {
  completedSystems: AnatomySystemId[];
  masteredQuestionIds: string[];
  reviewQuestionIds: string[];
  assessmentAttempts: number;
  lastUpdated: string | null;
}

const ACADEMY_PROGRESS_STORAGE_KEY = "medical-academy-foundation-progress-v1";
const LITERATURE_LIBRARY_STORAGE_KEY = "medical-academy-literature-library-v1";

const EMPTY_ACADEMY_PROGRESS: AcademyProgress = {
  completedSystems: [],
  masteredQuestionIds: [],
  reviewQuestionIds: [],
  assessmentAttempts: 0,
  lastUpdated: null,
};

function sanitizeStoredIds(value: unknown, allowedIds: readonly string[]): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((id): id is string => typeof id === "string" && allowedIds.includes(id)))];
}

function readAcademyProgress(): AcademyProgress {
  try {
    const stored = window.localStorage.getItem(ACADEMY_PROGRESS_STORAGE_KEY);
    if (!stored) return EMPTY_ACADEMY_PROGRESS;
    const parsed = JSON.parse(stored) as Partial<AcademyProgress>;
    const systemIds = ANATOMY_SYSTEMS.map((system) => system.id);
    const questionIds = ASSESSMENT_QUESTIONS.map((question) => question.id);
    return {
      completedSystems: sanitizeStoredIds(parsed.completedSystems, systemIds) as AnatomySystemId[],
      masteredQuestionIds: sanitizeStoredIds(parsed.masteredQuestionIds, questionIds),
      reviewQuestionIds: sanitizeStoredIds(parsed.reviewQuestionIds, questionIds),
      assessmentAttempts:
        typeof parsed.assessmentAttempts === "number" && Number.isFinite(parsed.assessmentAttempts)
          ? Math.max(0, Math.floor(parsed.assessmentAttempts))
          : 0,
      lastUpdated: typeof parsed.lastUpdated === "string" ? parsed.lastUpdated : null,
    };
  } catch {
    return EMPTY_ACADEMY_PROGRESS;
  }
}

const SECTION_ICONS: Record<AcademySection, typeof BookOpen> = {
  home: GraduationCap,
  learn: BookOpen,
  explore: Search,
  pathology: HeartPulse,
  practice: Stethoscope,
  assess: FileCheck2,
  research: Library,
  certify: Award,
};

const SYSTEM_BUTTON_POSITION: Partial<Record<
  AnatomySystemId,
  { left: string; top: string; label: string }
>> = {
  nervous: { left: "50%", top: "10%", label: "Brain and nervous system" },
  respiratory: { left: "50%", top: "29%", label: "Lungs and respiratory system" },
  cardiovascular: { left: "50%", top: "38%", label: "Heart and cardiovascular system" },
  digestive: { left: "50%", top: "53%", label: "Digestive system" },
  renal: { left: "50%", top: "62%", label: "Kidneys and urinary system" },
};

const ASSISTANT_MODES: Array<{
  id: AssistantMode;
  label: string;
  helper: string;
  icon: typeof BookOpen;
  activeClass: string;
  inactiveClass: string;
}> = [
  {
    id: "teach",
    label: "Teach",
    helper: "Clear explanations",
    icon: BookOpen,
    activeClass: "border-sky-400 bg-sky-50 text-sky-950 ring-sky-200 dark:border-sky-500 dark:bg-sky-950 dark:text-sky-100",
    inactiveClass: "border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50/60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
  },
  {
    id: "quiz",
    label: "Quiz",
    helper: "Recall with rationale",
    icon: CircleHelp,
    activeClass: "border-violet-400 bg-violet-50 text-violet-950 ring-violet-200 dark:border-violet-500 dark:bg-violet-950 dark:text-violet-100",
    inactiveClass: "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:bg-violet-50/60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
  },
  {
    id: "research",
    label: "Research",
    helper: "Citation-required answers",
    icon: Search,
    activeClass: "border-emerald-400 bg-emerald-50 text-emerald-950 ring-emerald-200 dark:border-emerald-500 dark:bg-emerald-950 dark:text-emerald-100",
    inactiveClass: "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
  },
  {
    id: "homeopathy",
    label: "Literature",
    helper: "Tradition vs evidence",
    icon: Library,
    activeClass: "border-amber-400 bg-amber-50 text-amber-950 ring-amber-200 dark:border-amber-500 dark:bg-amber-950 dark:text-amber-100",
    inactiveClass: "border-slate-200 bg-white text-slate-600 hover:border-amber-300 hover:bg-amber-50/60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
  },
];

function safeInitialSection(section?: string): AcademySection {
  return ACADEMY_SECTIONS.some((item) => item.id === section)
    ? (section as AcademySection)
    : "home";
}

function messageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getModePrompt(mode: AssistantMode, systemName: string, question: string): string {
  const shared =
    `This is a foundation-study question about ${systemName}. ` +
    "Do not infer a patient, diagnose, prescribe, recommend a potency, or give treatment instructions. ";

  if (mode === "quiz") {
    return `${shared}Create one concise educational question, then give the answer and rationale. Learner request: ${question}`;
  }
  if (mode === "research") {
    return (
      `${shared}Answer only when supported by retrievable sources. ` +
      "Separate established evidence from hypotheses and state uncertainty. Include source titles and identifiers when available. " +
      `Research question: ${question}`
    );
  }
  if (mode === "homeopathy") {
    return (
      `${shared}Describe historical or traditional homeopathic literature only as literature, not as proven efficacy. ` +
      "Clearly separate traditional claims from contemporary clinical evidence and state safety limits. " +
      `Learner question: ${question}`
    );
  }
  return `${shared}Explain the concept clearly, distinguish anatomy from pathology, and state when a claim requires verification. Question: ${question}`;
}

function TrustBanner() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-emerald-950 sm:flex-row sm:items-center sm:justify-between dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100">
      <div className="flex min-w-0 items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <div>
          <p className="text-sm font-semibold">Foundation Study mode</p>
          <p className="mt-0.5 text-xs leading-5 text-emerald-800 dark:text-emerald-200">
            No patient record is loaded. Content is educational and keeps clinical evidence separate
            from historical literature.
          </p>
        </div>
      </div>
      <span className="w-fit shrink-0 rounded-full border border-emerald-300 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">
        Source transparent
      </span>
    </div>
  );
}

function AcademyHome({ onNavigate }: { onNavigate: (section: AcademySection) => void }) {
  const cards = [
    {
      title: "Interactive anatomy",
      copy: "Rotate a full 3D body, explore twelve system layers, or switch to the accessible 2D regional map.",
      icon: Search,
      action: "Open atlas",
      target: "explore" as const,
      color: "text-sky-700 bg-sky-50 border-sky-100 dark:text-sky-300 dark:bg-sky-950/40 dark:border-sky-900",
    },
    {
      title: "Reviewed learning",
      copy: "Study concise modules linked to named, retrievable educational references.",
      icon: BookOpen,
      action: "Browse modules",
      target: "learn" as const,
      color: "text-violet-700 bg-violet-50 border-violet-100 dark:text-violet-300 dark:bg-violet-950/40 dark:border-violet-900",
    },
    {
      title: "Safe AI Assistant",
      copy: "Ask educational questions with visible evidence status and citation-aware abstention.",
      icon: MessageSquareText,
      action: "Ask Assistant",
      target: "explore" as const,
      color: "text-emerald-700 bg-emerald-50 border-emerald-100 dark:text-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-900",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-white shadow-sm dark:border-slate-800">
        <div className="relative px-6 py-8 sm:px-9 sm:py-10">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-teal-400/15 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-blue-500/15 blur-3xl" />
          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-teal-100">
              <Sparkles className="h-3.5 w-3.5" /> Academy v1.8 PICO and comparison release
            </span>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              Learn the body. Follow the evidence. Know the limits.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              A focused medical learning workspace that connects anatomy, foundational physiology,
              practice and source-aware AI without mixing educational content with patient care.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate("explore")}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-teal-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Explore anatomy <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate("research")}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                View source registry
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.title}
              type="button"
              onClick={() => onNavigate(card.target)}
              className={`group rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${card.color}`}
            >
              <Icon className="h-6 w-6" />
              <h3 className="mt-5 text-base font-semibold">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 opacity-80">{card.copy}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold">
                {card.action} <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </span>
            </button>
          );
        })}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <Activity className="h-5 w-5 text-teal-600" />
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Learning pathway</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              A transparent progression with no implied professional accreditation.
            </p>
          </div>
        </div>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {["Understand structures", "Connect function", "Practice reasoning", "Check mastery"].map(
            (step, index) => (
              <li key={step} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-950/60">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-teal-700 shadow-sm dark:bg-slate-800 dark:text-teal-300">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{step}</span>
              </li>
            ),
          )}
        </ol>
      </section>
    </div>
  );
}

function LearnWorkspace({
  completedSystems,
  onCompleteSystem,
  onOpenSystem,
}: {
  completedSystems: AnatomySystemId[];
  onCompleteSystem: (id: AnatomySystemId) => void;
  onOpenSystem: (id: AnatomySystemId) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
          Reviewed modules
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Core anatomy foundations</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          Every published module names its source and review date. Broader curriculum areas remain
          intentionally unpublished until their content passes the same review standard.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ANATOMY_SYSTEMS.map((system, index) => {
          const completed = completedSystems.includes(system.id);
          return (
          <article
            key={system.id}
            className="flex min-h-64 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold"
                style={{ color: system.accent, backgroundColor: system.lightAccent }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${completed ? "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"}`}>
                {completed ? "Completed" : "Source checked"}
              </span>
            </div>
            <h3 className="mt-5 text-base font-semibold text-slate-950 dark:text-white">{system.name}</h3>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {system.overview}
            </p>
            <div className="mt-auto flex flex-wrap gap-2 pt-5">
              <button
                type="button"
                onClick={() => onOpenSystem(system.id)}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-slate-950 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
              >
                Open in atlas <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                disabled={completed}
                onClick={() => onCompleteSystem(system.id)}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-teal-300 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:cursor-default disabled:border-teal-200 disabled:bg-teal-50 disabled:text-teal-700 dark:border-slate-700 dark:text-slate-200 dark:disabled:border-teal-900 dark:disabled:bg-teal-950/40 dark:disabled:text-teal-300"
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> {completed ? "Completed" : "Mark complete"}
              </button>
            </div>
          </article>
          );
        })}
      </div>
    </div>
  );
}

function BodyMap({
  layer,
  selected,
  selectedRegion,
  onSelect,
  onSelectRegion,
}: {
  layer: AtlasLayer;
  selected: AnatomySystemId;
  selectedRegion: AnatomyRegionId;
  onSelect: (id: AnatomySystemId) => void;
  onSelectRegion: (id: AnatomyRegionId) => void;
}) {
  return (
    <div className="relative mx-auto aspect-[3/5] w-full max-w-[340px]" aria-label="Interactive human anatomy map">
      <svg viewBox="0 0 300 500" role="img" aria-labelledby="body-map-title" className="h-full w-full">
        <title id="body-map-title">Simplified anterior human body outline</title>
        <defs>
          <linearGradient id="bodyFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e2e8f0" />
            <stop offset="1" stopColor="#f8fafc" />
          </linearGradient>
        </defs>
        <circle cx="150" cy="48" r="34" fill="url(#bodyFill)" stroke="#94a3b8" strokeWidth="2" />
        <path
          d="M120 84 C91 96 83 126 78 175 L63 288 C61 302 72 310 82 300 L104 219 L108 326 L87 463 C84 482 105 489 113 470 L149 345 L187 470 C195 489 216 482 213 463 L192 326 L196 219 L218 300 C228 310 239 302 237 288 L222 175 C217 126 209 96 180 84 Z"
          fill="url(#bodyFill)"
          stroke="#94a3b8"
          strokeWidth="2"
        />
        <path d="M150 82 L150 345" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 5" />
        {layer === "systems" && (
          <g aria-hidden="true">
            <ellipse cx="150" cy="47" rx="22" ry="17" fill="#7c3aed" opacity={selected === "nervous" ? 0.75 : 0.18} />
            <path d="M121 124 C101 137 105 186 139 190 L143 128 C137 122 129 121 121 124 Z" fill="#0284c7" opacity={selected === "respiratory" ? 0.7 : 0.16} />
            <path d="M179 124 C199 137 195 186 161 190 L157 128 C163 122 171 121 179 124 Z" fill="#0284c7" opacity={selected === "respiratory" ? 0.7 : 0.16} />
            <path d="M150 151 C131 133 116 160 150 188 C184 160 169 133 150 151 Z" fill="#e11d48" opacity={selected === "cardiovascular" ? 0.85 : 0.18} />
            <path d="M137 210 C117 224 126 270 157 266 C182 262 181 223 158 221 C151 208 146 205 137 210 Z" fill="#b45309" opacity={selected === "digestive" ? 0.72 : 0.16} />
            <ellipse cx="125" cy="252" rx="12" ry="22" fill="#0f766e" opacity={selected === "renal" ? 0.8 : 0.18} />
            <ellipse cx="175" cy="252" rx="12" ry="22" fill="#0f766e" opacity={selected === "renal" ? 0.8 : 0.18} />
          </g>
        )}
      </svg>
      {layer === "systems" && (Object.keys(SYSTEM_BUTTON_POSITION) as AnatomySystemId[]).map((id) => {
        const system = getAnatomySystem(id);
        const position = SYSTEM_BUTTON_POSITION[id]!;
        const isSelected = selected === id;
        return (
          <button
            key={id}
            type="button"
            aria-label={position.label}
            aria-pressed={isSelected}
            onClick={() => onSelect(id)}
            className="group absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-400/40"
            style={{ left: position.left, top: position.top }}
          >
            <span
              className={`absolute rounded-full transition-all ${isSelected ? "h-14 w-14 animate-pulse opacity-20" : "h-10 w-10 opacity-0 group-hover:opacity-15"}`}
              style={{ backgroundColor: system.accent }}
            />
            <span
              className={`relative h-7 w-7 rounded-full border-4 border-white shadow-md transition-all dark:border-slate-900 ${isSelected ? "scale-110" : "group-hover:scale-105"}`}
              style={{ backgroundColor: system.accent }}
            />
            <span className="sr-only">{position.label}</span>
          </button>
        );
      })}
      {layer === "regions" && (
        <div
          className="absolute left-1/2 top-[47%] grid w-[52%] -translate-x-1/2 -translate-y-1/2 grid-cols-3 overflow-hidden rounded-xl border-2 border-teal-700/50 bg-white/80 shadow-sm backdrop-blur-sm dark:bg-slate-950/80"
          aria-label="Nine abdominopelvic regions"
        >
          {ANATOMY_REGIONS.map((region) => (
            <button
              key={region.id}
              type="button"
              aria-pressed={selectedRegion === region.id}
              aria-label={region.name}
              title={region.name}
              onClick={() => onSelectRegion(region.id)}
              className={`aspect-square border border-teal-700/25 p-1 text-[9px] font-bold leading-3 transition focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                selectedRegion === region.id
                  ? "bg-teal-600 text-white"
                  : "text-slate-600 hover:bg-teal-50 dark:text-slate-200 dark:hover:bg-teal-950"
              }`}
            >
              {region.name.replace(" region", "")}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ThreeDAnatomyViewer({ resetToken }: { resetToken: number }) {
  return (
    <div className="relative mt-2 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-inner">
      <iframe
        key={resetToken}
        title="Interactive full human body anatomy model"
        src="https://sketchfab.com/models/9b0b079953b840bc9a13f524b60041e4/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_watermark=1&ui_annotations=1&ui_help=1"
        className="h-[720px] lg:h-[780px] w-full border-0"
        loading="lazy"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
      />
      <div className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/15 bg-slate-950/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
        Full 3D Twin · Drag to rotate · Scroll to zoom
      </div>
    </div>
  );
}

function AnatomyAtlas({
  selected,
  onSelect,
  activeRemedyTropismId,
  onRemedyTropismSelect,
}: {
  selected: AnatomySystemId;
  onSelect: (id: AnatomySystemId) => void;
  activeRemedyTropismId: string | null;
  onRemedyTropismSelect: (remedyId: string | null) => void;
}) {
  const system = getAnatomySystem(selected);
  const [viewMode, setViewMode] = useState<AtlasViewMode>("3d");
  const [layer, setLayer] = useState<AtlasLayer>("systems");
  const [selectedRegion, setSelectedRegion] = useState<AnatomyRegionId>("epigastric");
  const [detailTab, setDetailTab] = useState<"structures" | "functions" | "clinical">("structures");
  const [viewerResetToken, setViewerResetToken] = useState(0);

  // Dissection & Studio State
  const [peelDepth, setPeelDepth] = useState<number>(0);
  const [activeClippingPlane, setActiveClippingPlane] = useState<"none" | "sagittal" | "coronal" | "axial">("none");
  const [xrayGhostMode, setXrayGhostMode] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");

  const region = ANATOMY_REGIONS.find((item) => item.id === selectedRegion) ?? ANATOMY_REGIONS[1];
  const activeRemedy = activeRemedyTropismId ? REMEDY_TROPISM_DATA[activeRemedyTropismId] : null;

  const detailItems =
    detailTab === "structures"
      ? system.structures
      : detailTab === "functions"
        ? system.functions
        : system.clinicalConnections;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
            HoloHuman™ 3D Interactive Anatomy Atlas
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Living Anatomy & Spatial Twin</h2>
        </div>
        <div className="inline-flex w-fit rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-900" aria-label="Atlas view">
          {([['3d', '3D Living Twin'], ['2d', '2D Regional Map']] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setViewMode(id)}
              aria-pressed={viewMode === id}
              className={`min-h-9 rounded-lg px-3 text-[11px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${viewMode === id ? "bg-slate-950 text-white shadow-sm dark:bg-teal-400 dark:text-slate-950" : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[210px_minmax(420px,1.35fr)_minmax(320px,1fr)]">
        <aside className="border-b border-slate-200 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/50 lg:border-b-0 lg:border-r">
          <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Atlas layer</p>
          <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl bg-slate-200/70 p-1 dark:bg-slate-800">
            {([['systems', 'Systems'], ['regions', 'Regions']] as const).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setLayer(id);
                  if (id === "regions") setViewMode("2d");
                }}
                aria-pressed={layer === id && (id === "systems" || viewMode === "2d")}
                className={`min-h-9 rounded-lg px-2 text-[11px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${layer === id && (id === "systems" || viewMode === "2d") ? "bg-white text-slate-950 shadow-sm dark:bg-slate-700 dark:text-white" : "text-slate-500 dark:text-slate-300"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">12 Organ Systems</p>
          <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {ANATOMY_SYSTEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelect(item.id);
                  setLayer("systems");
                }}
                aria-pressed={selected === item.id}
                className={`flex min-h-11 min-w-max items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 lg:min-w-0 ${
                  selected === item.id
                    ? "bg-white text-slate-950 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-white dark:ring-slate-700"
                    : "text-slate-600 hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.accent }} />
                {item.shortName}
              </button>
            ))}
          </div>
        </aside>

        <div className="relative min-h-[850px] flex flex-col justify-between border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white px-5 py-5 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900 lg:border-b-0 lg:border-r">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {viewMode === "3d" ? "Interactive PBR 3D Organism" : `Anterior view · ${layer} layer`}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {viewMode === "3d"
                    ? "Subsurface Scattering · Studio 3-Point Light · X-Ray Ghosting"
                    : layer === "systems"
                      ? "Select a highlighted organ system"
                      : "Select one of the nine standard abdominal regions"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (viewMode === "3d") {
                    setViewerResetToken((value) => value + 1);
                    setPeelDepth(0);
                    setActiveClippingPlane("none");
                    setXrayGhostMode(false);
                    onRemedyTropismSelect(null);
                  } else if (layer === "systems") onSelect("cardiovascular");
                  else setSelectedRegion("epigastric");
                }}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset View
              </button>
            </div>

            {viewMode === "3d" ? (
              <div className="space-y-3">
                <ThreeDAnatomyViewer resetToken={viewerResetToken} />
                
                {/* Embedded BioDigital-Grade Dissection Toolbar */}
                <HoloHumanDissectionToolbar
                  peelDepth={peelDepth}
                  onPeelDepthChange={setPeelDepth}
                  activeClippingPlane={activeClippingPlane}
                  onClippingPlaneChange={setActiveClippingPlane}
                  xrayGhostMode={xrayGhostMode}
                  onXrayGhostModeToggle={() => setXrayGhostMode((v) => !v)}
                  themeMode={themeMode}
                  onThemeModeToggle={() => setThemeMode((m) => (m === "dark" ? "light" : "dark"))}
                  activeRemedyTropismId={activeRemedyTropismId}
                  onRemedyTropismSelect={onRemedyTropismSelect}
                  onResetView={() => {
                    setViewerResetToken((v) => v + 1);
                    setPeelDepth(0);
                    setActiveClippingPlane("none");
                    setXrayGhostMode(false);
                    onRemedyTropismSelect(null);
                  }}
                />
              </div>
            ) : (
              <BodyMap layer={layer} selected={selected} selectedRegion={selectedRegion} onSelect={onSelect} onSelectRegion={setSelectedRegion} />
            )}
          </div>

          <div className="mt-3 flex flex-col gap-2 text-[10px] leading-4 text-slate-500 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200/60 dark:border-slate-800/60 pt-2">
            <span>MeshPhysicalMaterial with calibrated SSS and tone-mapped illumination.</span>
            <a href="https://sketchfab.com/3d-models/animated-full-human-body-anatomy-9b0b079953b840bc9a13f524b60041e4" target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1 font-semibold text-teal-700 underline underline-offset-2 dark:text-teal-300">Model details <ExternalLink className="h-3 w-3" /></a>
          </div>
        </div>

        <section className="min-w-0 p-5 sm:p-6 space-y-4" aria-live="polite">
          {activeRemedy && (
            <div className="rounded-2xl border border-amber-500/40 bg-amber-950/20 p-4 text-amber-100 shadow-sm animate-fadeIn">
              <div className="flex items-center justify-between border-b border-amber-500/30 pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 font-bold text-xs">
                    🌿
                  </span>
                  <span className="font-bold text-xs text-white">{activeRemedy.remedyName}</span>
                </div>
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] font-bold text-amber-300 border border-amber-500/30">
                  {activeRemedy.overallAffinityIntensity}% Tropism
                </span>
              </div>
              <p className="text-[11px] text-amber-200/90 leading-relaxed mb-2">
                <strong>Organ Affinity:</strong> {activeRemedy.targetOrgans.map((o) => o.structureName).join(", ")}.
              </p>
              <p className="text-[10px] text-amber-300/80 leading-relaxed font-mono">
                Keynote: {activeRemedy.targetOrgans[0]?.clinicalKeynotes}
              </p>
            </div>
          )}

          {viewMode === "2d" && layer === "regions" ? (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Selected region</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">{region.name}</h3>
              <p className="mt-1 text-xs font-semibold text-teal-700 dark:text-teal-300">{region.position}</p>
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{region.description}</p>
              <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Typical contents</p>
              <ul className="mt-3 space-y-3">
                {region.typicalContents.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />{item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900 dark:bg-blue-950/30">
                <p className="text-xs font-semibold text-blue-950 dark:text-blue-100">Regional anatomy reference</p>
                <a href={REGIONAL_ANATOMY_REFERENCE.url} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-start gap-1 text-xs leading-5 text-blue-700 underline underline-offset-2 dark:text-blue-300">
                  {REGIONAL_ANATOMY_REFERENCE.title} <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" />
                </a>
                <p className="mt-2 text-[10px] uppercase tracking-wide text-blue-700/70 dark:text-blue-300/70">Typical contents vary by body habitus and anatomy; regions are descriptive, not diagnostic.</p>
              </div>
            </>
          ) : (
          <>
          <div className="flex items-start gap-3">
            <span
              className="mt-1 h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: system.accent }}
            />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Selected system</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">{system.name}</h3>
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{system.overview}</p>

          <div className="mt-4 flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 dark:bg-slate-950">
            {([
              ["structures", "Structures"],
              ["functions", "Functions"],
              ["clinical", "Clinical links"],
            ] as const).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setDetailTab(id)}
                className={`min-h-10 min-w-max flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                  detailTab === id
                    ? "bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <ul className="mt-4 space-y-2.5">
            {detailItems.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-5 text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900 dark:bg-blue-950/30">
            <div className="flex items-start gap-3">
              <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-blue-700 dark:text-blue-300" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-blue-950 dark:text-blue-100">Primary learning reference</p>
                <a
                  href={system.reference.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex items-start gap-1 text-xs leading-5 text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100"
                >
                  {system.reference.title} <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" />
                </a>
                <p className="mt-2 text-[10px] uppercase tracking-wide text-blue-700/70 dark:text-blue-300/70">
                  {system.reference.publisher} · reviewed {system.reference.reviewedOn}
                </p>
              </div>
            </div>
          </div>
          </>
          )}
        </section>
      </div>
    </div>
  );
}

function PracticeWorkspace({ onSelectSystem }: { onSelectSystem: (id: AnatomySystemId) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">Practice</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Foundation reasoning cases</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          These are educational prompts, not real patients. They assess anatomical reasoning without
          generating diagnoses or treatment instructions.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {PRACTICE_CASES.map((practiceCase) => {
          const system = getAnatomySystem(practiceCase.systemId);
          return (
            <article key={practiceCase.id} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: system.accent }} />
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {practiceCase.level}
                </span>
              </div>
              <h3 className="mt-5 text-base font-semibold text-slate-950 dark:text-white">{practiceCase.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{practiceCase.prompt}</p>
              <div className="mt-5 rounded-xl bg-slate-50 p-3 dark:bg-slate-950/60">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Learning objective</p>
                <p className="mt-1 text-xs leading-5 text-slate-700 dark:text-slate-200">{practiceCase.objective}</p>
              </div>
              <button
                type="button"
                onClick={() => onSelectSystem(practiceCase.systemId)}
                className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-teal-300 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-700 dark:text-slate-200"
              >
                Review anatomy <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function AssessmentWorkspace({
  reviewQuestionIds,
  onAnswer,
}: {
  reviewQuestionIds: string[];
  onAnswer: (questionId: string, correct: boolean) => void;
}) {
  const [questionOrder] = useState(() => [
    ...reviewQuestionIds.filter((id) => ASSESSMENT_QUESTIONS.some((question) => question.id === id)),
    ...ASSESSMENT_QUESTIONS.map((question) => question.id).filter((id) => !reviewQuestionIds.includes(id)),
  ]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const question = ASSESSMENT_QUESTIONS.find((item) => item.id === questionOrder[questionIndex]) ?? ASSESSMENT_QUESTIONS[0];
  const answered = selectedAnswer !== null;

  const selectAnswer = (index: number) => {
    if (answered) return;
    setSelectedAnswer(index);
    const correct = index === question.answer;
    if (correct) setScore((current) => current + 1);
    onAnswer(question.id, correct);
  };

  const nextQuestion = () => {
    setQuestionIndex((current) => (current + 1) % questionOrder.length);
    setSelectedAnswer(null);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">Assessment</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Source-linked knowledge check</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          Score {score}/{ASSESSMENT_QUESTIONS.length}
        </span>
      </div>
      {reviewQuestionIds.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
          Review queue active: {reviewQuestionIds.length} missed {reviewQuestionIds.length === 1 ? "concept is" : "concepts are"} presented first. A correct response removes a concept from the queue.
        </div>
      )}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <p className="text-xs font-semibold text-slate-500">
          Question {questionIndex + 1} of {questionOrder.length}
        </p>
        <h3 className="mt-3 text-xl font-semibold leading-8 text-slate-950 dark:text-white">{question.question}</h3>
        <div className="mt-6 grid gap-3">
          {question.options.map((option, index) => {
            const isCorrect = answered && index === question.answer;
            const isIncorrect = answered && index === selectedAnswer && index !== question.answer;
            return (
              <button
                key={option}
                type="button"
                onClick={() => selectAnswer(index)}
                disabled={answered}
                className={`flex min-h-12 items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                  isCorrect
                    ? "border-emerald-400 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100"
                    : isIncorrect
                      ? "border-rose-300 bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-100"
                      : "border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-teal-50/50 disabled:hover:border-slate-200 disabled:hover:bg-transparent dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                <span>{option}</span>
                {isCorrect && <Check className="h-4 w-4 text-emerald-600" />}
                {isIncorrect && <X className="h-4 w-4 text-rose-600" />}
              </button>
            );
          })}
        </div>
        {answered && (
          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30" aria-live="polite">
            <p className="text-sm font-semibold text-blue-950 dark:text-blue-100">
              {selectedAnswer === question.answer ? "Correct" : "Review the answer"}
            </p>
            <p className="mt-1 text-sm leading-6 text-blue-900/80 dark:text-blue-200">{question.rationale}</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <a
                href={question.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 underline underline-offset-2 dark:text-blue-300"
              >
                Verify in source <ExternalLink className="h-3 w-3" />
              </a>
              <button
                type="button"
                onClick={nextQuestion}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Next question <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function SourceRegistry() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">Evidence registry</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Published learning sources</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          A publication-like card is never treated as a citation. Only retrievable references with a
          named publisher and review date are published here.
        </p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="hidden grid-cols-[1.2fr_0.7fr_0.55fr_auto] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 md:grid">
          <span>Reference</span>
          <span>Publisher</span>
          <span>Status</span>
          <span>Access</span>
        </div>
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {ANATOMY_SYSTEMS.map((system) => (
            <div key={system.id} className="grid gap-3 px-5 py-4 md:grid-cols-[1.2fr_0.7fr_0.55fr_auto] md:items-center md:gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{system.reference.title}</p>
                <p className="mt-1 text-xs text-slate-500">Supports {system.name.toLowerCase()}</p>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">{system.reference.publisher}</p>
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                  <CheckCircle2 className="h-3 w-3" /> Reviewed
                </span>
                <p className="mt-1 text-[10px] text-slate-500">{system.reference.reviewedOn}</p>
              </div>
              <a
                href={system.reference.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${system.reference.title}`}
                className="inline-flex min-h-10 w-fit items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-teal-300 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-700 dark:text-slate-200"
              >
                Open <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
          <div className="grid gap-3 px-5 py-4 md:grid-cols-[1.2fr_0.7fr_0.55fr_auto] md:items-center md:gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{REGIONAL_ANATOMY_REFERENCE.title}</p>
              <p className="mt-1 text-xs text-slate-500">Supports the nine-region abdominopelvic layer</p>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">{REGIONAL_ANATOMY_REFERENCE.publisher}</p>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                <CheckCircle2 className="h-3 w-3" /> Reviewed
              </span>
              <p className="mt-1 text-[10px] text-slate-500">{REGIONAL_ANATOMY_REFERENCE.reviewedOn}</p>
            </div>
            <a
              href={REGIONAL_ANATOMY_REFERENCE.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${REGIONAL_ANATOMY_REFERENCE.title}`}
              className="inline-flex min-h-10 w-fit items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-teal-300 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-700 dark:text-slate-200"
            >
              Open <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
        <div className="flex items-start gap-3">
          <FlaskConical className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="text-sm font-semibold">Research publication gate</p>
            <p className="mt-1 text-xs leading-5 opacity-80">
              Claims about efficacy, diagnostics or treatment remain unpublished until a reviewer
              verifies the source, study design, identifier and claim-to-source match.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressWorkspace({ progress }: { progress: AcademyProgress }) {
  const completionPercent = Math.round((progress.completedSystems.length / ANATOMY_SYSTEMS.length) * 100);

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">Progress</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Learning completion records</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          Progress recognises completed educational activity. It does not confer CME credit,
          licensure, board certification or clinical privileges.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-teal-50 p-2.5 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950 dark:text-white">Foundation anatomy</p>
              <p className="text-xs text-slate-500">Five reviewed system modules</p>
            </div>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${completionPercent}%` }} />
          </div>
          <p className="mt-2 text-xs text-slate-500">{progress.completedSystems.length} of {ANATOMY_SYSTEMS.length} modules completed · {completionPercent}%</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950 dark:text-white">Knowledge checks</p>
              <p className="text-xs text-slate-500">Source-linked formative assessment</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-slate-50 p-2 dark:bg-slate-950/60"><p className="text-lg font-bold text-slate-950 dark:text-white">{progress.masteredQuestionIds.length}</p><p className="text-[10px] text-slate-500">Mastered</p></div>
            <div className="rounded-xl bg-amber-50 p-2 dark:bg-amber-950/30"><p className="text-lg font-bold text-amber-800 dark:text-amber-200">{progress.reviewQuestionIds.length}</p><p className="text-[10px] text-amber-700 dark:text-amber-300">Review</p></div>
            <div className="rounded-xl bg-slate-50 p-2 dark:bg-slate-950/60"><p className="text-lg font-bold text-slate-950 dark:text-white">{progress.assessmentAttempts}</p><p className="text-[10px] text-slate-500">Answers</p></div>
          </div>
        </div>
      </div>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-3">
          <div><h3 className="text-sm font-semibold text-slate-950 dark:text-white">System competency map</h3><p className="mt-1 text-xs text-slate-500">Module completion and one source-linked knowledge check contribute equally.</p></div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">Private to this browser</span>
        </div>
        <div className="mt-5 space-y-3">
          {ANATOMY_SYSTEMS.map((system) => {
            const question = ASSESSMENT_QUESTIONS.find((item) => item.systemId === system.id);
            const percent = (progress.completedSystems.includes(system.id) ? 50 : 0) + (question && progress.masteredQuestionIds.includes(question.id) ? 50 : 0);
            return (
              <div key={system.id} className="grid gap-2 sm:grid-cols-[160px_1fr_48px] sm:items-center">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{system.shortName}</p>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full transition-all" style={{ width: `${percent}%`, backgroundColor: system.accent }} /></div>
                <p className="text-right text-xs font-bold text-slate-600 dark:text-slate-300">{percent}%</p>
              </div>
            );
          })}
        </div>
      </section>
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/30">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-700 dark:text-blue-300" />
          <div>
            <p className="text-sm font-semibold text-blue-950 dark:text-blue-100">Credential integrity</p>
            <p className="mt-1 text-xs leading-5 text-blue-900/80 dark:text-blue-200">
              Accredited certificates will only appear after the accrediting organization,
              jurisdiction, approval identifier, validity period and verification URL are recorded.
            </p>
            <p className="mt-2 text-[10px] text-blue-800/70 dark:text-blue-300/70">Progress is stored locally in this browser and is not written to a patient or clinical record.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LiteratureSearchWorkspace({ system }: { system: AnatomySystemId }) {
  const selectedSystem = getAnatomySystem(system);
  const [query, setQuery] = useState(`${selectedSystem.name} anatomy physiology`);
  const [loading, setLoading] = useState(false);
  const [studyType, setStudyType] = useState<"any" | "systematic-review" | "randomized-trial" | "guideline" | "review">("any");
  const [result, setResult] = useState<LiteratureSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [libraryView, setLibraryView] = useState<"results" | "saved">("results");
  const [savedCitations, setSavedCitations] = useState<AcademyLiteratureCitation[]>([]);
  const [libraryReady, setLibraryReady] = useState(false);
  const [picoOpen, setPicoOpen] = useState(false);
  const [pico, setPico] = useState<PicoQuestion>({ population: "", intervention: "", comparison: "", outcome: "" });
  const [comparisonPmids, setComparisonPmids] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LITERATURE_LIBRARY_STORAGE_KEY);
      setSavedCitations(sanitizeLiteratureLibrary(stored ? JSON.parse(stored) : []));
    } catch {
      setSavedCitations([]);
    } finally {
      setLibraryReady(true);
    }
  }, []);

  useEffect(() => {
    if (!libraryReady) return;
    try {
      window.localStorage.setItem(LITERATURE_LIBRARY_STORAGE_KEY, JSON.stringify(savedCitations));
    } catch {
      // Research remains usable when browser policy blocks local persistence.
    }
  }, [libraryReady, savedCitations]);

  const searchLiterature = async (event: FormEvent) => {
    event.preventDefault();
    const normalizedQuery = query.trim();
    if (normalizedQuery.length < 2 || loading) return;
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 18_000);
    try {
      const response = await fetch("/api/admin/medical-academy/literature", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: normalizedQuery, studyType }),
        signal: controller.signal,
      });
      const payload = await response.json() as LiteratureSearchResponse;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || "Literature search is unavailable.");
      }
      setResult(payload);
      setLibraryView("results");
    } catch (searchError) {
      setResult(null);
      setError(searchError instanceof Error && searchError.name !== "AbortError"
        ? searchError.message
        : "PubMed search timed out. No results were generated.");
    } finally {
      window.clearTimeout(timeout);
      setLoading(false);
    }
  };

  const citations = Array.isArray(result?.citations) ? result.citations : [];
  const displayedCitations = libraryView === "saved" ? savedCitations : citations;
  const savedPmids = new Set(savedCitations.map((citation) => citation.pmid));
  const comparisonCitations = comparisonPmids
    .map((pmid) => savedCitations.find((citation) => citation.pmid === pmid))
    .filter((citation): citation is AcademyLiteratureCitation => Boolean(citation));
  const picoFieldCount = Object.values(pico).filter((value) => value.trim()).length;
  const designProfile = savedCitations.reduce<Record<string, number>>((profile, citation) => {
    profile[citation.designSignal] = (profile[citation.designSignal] || 0) + 1;
    return profile;
  }, {});

  const saveCitation = (citation: AcademyLiteratureCitation) => {
    setSavedCitations((current) => current.some((item) => item.pmid === citation.pmid)
      ? current
      : [...current, citation].slice(0, 100));
  };

  const removeCitation = (pmid: string) => {
    setSavedCitations((current) => current.filter((citation) => citation.pmid !== pmid));
    setComparisonPmids((current) => current.filter((savedPmid) => savedPmid !== pmid));
  };

  const applyPicoQuery = () => {
    const nextQuery = buildPicoQuery(pico);
    if (picoFieldCount < 2 || !nextQuery) return;
    setQuery(nextQuery);
    setLibraryView("results");
    setPicoOpen(false);
  };

  const toggleComparison = (pmid: string) => {
    setComparisonPmids((current) => current.includes(pmid)
      ? current.filter((savedPmid) => savedPmid !== pmid)
      : current.length < 3 ? [...current, pmid] : current);
  };

  const exportLibrary = () => {
    if (savedCitations.length === 0) return;
    const blob = new Blob([formatLiteratureLibraryAsRis(savedCitations)], { type: "application/x-research-info-systems;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `ostm-academy-reading-list-${new Date().toISOString().slice(0, 10)}.ris`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white"><Search className="h-4 w-4" /></span>
          <div>
            <h3 className="text-sm font-semibold text-emerald-950 dark:text-emerald-100">Search verified literature</h3>
            <p className="mt-1 text-[11px] leading-5 text-emerald-900/75 dark:text-emerald-200/80">Direct PubMed metadata retrieval. Results are citations, not diagnoses or treatment recommendations.</p>
          </div>
        </div>
        <form onSubmit={searchLiterature} className="mt-4 flex gap-2">
          <label htmlFor="academy-literature-query" className="sr-only">Search PubMed literature</label>
          <input
            id="academy-literature-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            maxLength={240}
            placeholder="Search topic, condition, intervention, or author…"
            className="min-h-11 min-w-0 flex-1 rounded-xl border border-emerald-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-emerald-900 dark:bg-slate-950 dark:text-white"
          />
          <button
            type="submit"
            disabled={query.trim().length < 2 || loading}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-3.5 text-xs font-semibold text-white hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Search className="h-3.5 w-3.5" /> {loading ? "Searching…" : "Search"}
          </button>
        </form>
        <button
          type="button"
          onClick={() => setPicoOpen((current) => !current)}
          aria-expanded={picoOpen}
          className="mt-3 inline-flex min-h-9 items-center gap-2 rounded-xl border border-emerald-300 bg-white/80 px-3 text-[10px] font-bold text-emerald-900 hover:border-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-emerald-800 dark:bg-slate-950 dark:text-emerald-200"
        >
          <FileCheck2 className="h-3.5 w-3.5" /> {picoOpen ? "Hide PICO builder" : "Build a PICO question"}
        </button>
        {picoOpen && (
          <section className="mt-3 rounded-2xl border border-emerald-200 bg-white/75 p-3 dark:border-emerald-900 dark:bg-slate-950/80" aria-label="PICO search builder">
            <div className="grid gap-3 sm:grid-cols-2">
              {([
                ["population", "Population", "Who or what population?"],
                ["intervention", "Intervention", "What intervention or exposure?"],
                ["comparison", "Comparison · optional", "Compared with what?"],
                ["outcome", "Outcome", "Which measurable outcome?"],
              ] as const).map(([field, label, placeholder]) => (
                <label key={field} className="text-[10px] font-bold text-emerald-950 dark:text-emerald-100">
                  {label}
                  <input
                    value={pico[field]}
                    onChange={(event) => setPico((current) => ({ ...current, [field]: event.target.value }))}
                    maxLength={80}
                    placeholder={placeholder}
                    className="mt-1 min-h-10 w-full rounded-xl border border-emerald-200 bg-white px-3 text-xs font-normal text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-emerald-900 dark:bg-slate-900 dark:text-white"
                  />
                </label>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[9px] leading-4 text-emerald-900/65 dark:text-emerald-300/70">Use at least two elements. Describe a learning question only—never enter patient identifiers.</p>
              <button type="button" onClick={applyPicoQuery} disabled={picoFieldCount < 2} className="min-h-9 rounded-xl bg-emerald-700 px-3 text-[10px] font-bold text-white hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-40">Use PICO search</button>
            </div>
          </section>
        )}
        <div className="mt-3 grid grid-cols-2 gap-1.5" aria-label="Study design filter">
          {([
            ["any", "All studies"],
            ["systematic-review", "Systematic reviews"],
            ["randomized-trial", "Randomized trials"],
            ["guideline", "Guidelines"],
            ["review", "Reviews"],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setStudyType(id)}
              aria-pressed={studyType === id}
              className={`min-h-9 rounded-xl border px-2 py-1.5 text-[10px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${studyType === id ? "border-emerald-500 bg-emerald-700 text-white" : "border-emerald-200 bg-white/80 text-emerald-900 hover:border-emerald-400 dark:border-emerald-900 dark:bg-slate-950 dark:text-emerald-200"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[10px] leading-4 text-emerald-900/60 dark:text-emerald-300/70">Do not enter patient names or identifiable clinical information.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
        <div className="grid flex-1 grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-950">
          <button type="button" onClick={() => setLibraryView("results")} aria-pressed={libraryView === "results"} className={`min-h-9 rounded-lg px-2 text-[10px] font-semibold ${libraryView === "results" ? "bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white" : "text-slate-500"}`}>Search results · {citations.length}</button>
          <button type="button" onClick={() => setLibraryView("saved")} aria-pressed={libraryView === "saved"} className={`min-h-9 rounded-lg px-2 text-[10px] font-semibold ${libraryView === "saved" ? "bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white" : "text-slate-500"}`}>Saved library · {savedCitations.length}</button>
        </div>
        <button type="button" onClick={exportLibrary} disabled={savedCitations.length === 0} className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-[10px] font-bold text-slate-700 hover:border-emerald-300 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200"><Download className="h-3.5 w-3.5" /> Export RIS</button>
      </div>

      {libraryView === "saved" && savedCitations.length > 0 && (
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 dark:border-indigo-900 dark:bg-indigo-950/30">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-700 dark:text-indigo-300">Reading-list design profile</p>
            <span className="text-[9px] font-semibold text-indigo-800/70 dark:text-indigo-300/70">Select 2–3 studies to compare</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">{Object.entries(designProfile).map(([design, count]) => <span key={design} className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-indigo-900 shadow-sm dark:bg-slate-900 dark:text-indigo-200">{design} · {count}</span>)}</div>
          <p className="mt-2 text-[9px] leading-4 text-indigo-900/65 dark:text-indigo-300/70">This profile describes study designs only; it is not a risk-of-bias assessment or evidence grade.</p>
        </div>
      )}

      {libraryView === "saved" && comparisonCitations.length === 1 && (
        <div aria-live="polite" className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-[10px] font-semibold text-cyan-900 dark:border-cyan-900 dark:bg-cyan-950/30 dark:text-cyan-200">
          One study selected. Select one or two more saved studies to open the comparison workspace.
        </div>
      )}

      {libraryView === "saved" && comparisonCitations.length >= 2 && (
        <section className="overflow-hidden rounded-2xl border border-cyan-200 bg-white dark:border-cyan-900 dark:bg-slate-900" aria-label="Selected study comparison">
          <div className="flex items-start justify-between gap-3 border-b border-cyan-100 bg-cyan-50/70 p-4 dark:border-cyan-900 dark:bg-cyan-950/30">
            <div>
              <h4 className="text-xs font-bold text-cyan-950 dark:text-cyan-100">Side-by-side study metadata</h4>
              <p className="mt-1 text-[9px] leading-4 text-cyan-900/65 dark:text-cyan-300/70">Descriptive comparison only—not a risk-of-bias assessment, evidence grade, or clinical recommendation.</p>
            </div>
            <button type="button" onClick={() => setComparisonPmids([])} className="min-h-8 shrink-0 rounded-lg border border-cyan-200 bg-white px-2.5 text-[9px] font-bold text-cyan-800 hover:border-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:border-cyan-800 dark:bg-slate-900 dark:text-cyan-200">Clear</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[720px] table-fixed text-left text-[10px]">
              <caption className="sr-only">Comparison of selected saved PubMed studies</caption>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {([
                  ["Study", (citation: AcademyLiteratureCitation) => `${citation.title} · PMID ${citation.pmid}`],
                  ["Design signal", (citation: AcademyLiteratureCitation) => citation.designSignal],
                  ["Publication type", (citation: AcademyLiteratureCitation) => citation.publicationTypes.join(", ") || "Not listed"],
                  ["Journal and date", (citation: AcademyLiteratureCitation) => `${citation.journal} · ${citation.publicationDate}`],
                  ["Abstract", (citation: AcademyLiteratureCitation) => citation.abstractExcerpt || "Not available in this result"],
                  ["Crossref cited-by", (citation: AcademyLiteratureCitation) => citation.crossref?.citedByCount === null || citation.crossref?.citedByCount === undefined ? "Not available" : String(citation.crossref.citedByCount)],
                ] as const).map(([label, render]) => (
                  <tr key={label} className="align-top">
                    <th scope="row" className="w-28 bg-slate-50 px-3 py-3 font-bold text-slate-600 dark:bg-slate-950/60 dark:text-slate-300">{label}</th>
                    {comparisonCitations.map((citation) => <td key={citation.pmid} className="border-l border-slate-100 px-3 py-3 leading-4 text-slate-700 dark:border-slate-800 dark:text-slate-200">{render(citation)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {error && (
        <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
          <p className="font-semibold">No verified literature returned</p><p className="mt-1">{error}</p>
        </div>
      )}

      {libraryView === "results" && result && citations.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          PubMed returned no matching citations. Try broader scientific terms or remove unnecessary qualifiers.
        </div>
      )}

      {libraryView === "saved" && savedCitations.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center dark:border-slate-700 dark:bg-slate-900">
          <Bookmark className="mx-auto h-6 w-6 text-slate-400" />
          <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">No saved citations yet</p>
          <p className="mt-1 text-[11px] leading-5 text-slate-500">Return to search results and save useful PubMed records to build a private reading list.</p>
        </div>
      )}

      {displayedCitations.length > 0 && (
        <section aria-label="PubMed literature results" className="space-y-3">
          <div className="flex items-center justify-between gap-3 px-1">
            <div><p className="text-xs font-bold text-slate-900 dark:text-white">{libraryView === "saved" ? "Saved reading list" : "PubMed results"}</p><p className="mt-0.5 text-[10px] text-slate-500">{libraryView === "saved" ? `${savedCitations.length} private browser records` : `Showing ${citations.length} of ${result?.total ?? citations.length} matches`}</p></div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">{libraryView === "saved" ? "Private library" : "Live metadata"}</span>
          </div>
          {displayedCitations.map((citation, index) => (
            <article key={citation.pmid} className={`rounded-2xl border bg-white p-4 shadow-sm dark:bg-slate-900 ${comparisonPmids.includes(citation.pmid) ? "border-cyan-400 ring-2 ring-cyan-100 dark:border-cyan-600 dark:ring-cyan-950" : "border-slate-200 dark:border-slate-700"}`}>
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{index + 1}</span>
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <a href={citation.pubMedUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold leading-5 text-slate-950 hover:text-emerald-700 hover:underline dark:text-white dark:hover:text-emerald-300">{citation.title}</a>
                    {libraryView === "saved" ? (
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => toggleComparison(citation.pmid)}
                          aria-pressed={comparisonPmids.includes(citation.pmid)}
                          disabled={comparisonPmids.length >= 3 && !comparisonPmids.includes(citation.pmid)}
                          className={`min-h-8 rounded-lg border px-2 text-[9px] font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-35 ${comparisonPmids.includes(citation.pmid) ? "border-cyan-500 bg-cyan-600 text-white" : "border-slate-200 text-slate-500 hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-700 dark:text-slate-300"}`}
                        >
                          {comparisonPmids.includes(citation.pmid) ? "Selected" : "Compare"}
                        </button>
                        <button type="button" onClick={() => removeCitation(citation.pmid)} aria-label={`Remove ${citation.title} from saved library`} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:hover:bg-rose-950/40"><X className="h-3.5 w-3.5" /></button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => saveCitation(citation)} disabled={savedPmids.has(citation.pmid)} aria-label={savedPmids.has(citation.pmid) ? `${citation.title} saved` : `Save ${citation.title}`} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:text-emerald-600 dark:hover:bg-emerald-950/40">{savedPmids.has(citation.pmid) ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}</button>
                    )}
                  </div>
                  <p className="mt-2 text-[11px] leading-4 text-slate-600 dark:text-slate-300">{citation.authors}</p>
                  <p className="mt-1 text-[10px] leading-4 text-slate-500">{citation.journal} · {citation.publicationDate}</p>
                  <span className={`mt-2 inline-flex rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-wide ${
                    citation.designSignal === "Evidence synthesis" ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                      : citation.designSignal === "Randomized trial" ? "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300"
                        : citation.designSignal === "Guideline" ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}>{citation.designSignal}</span>
                  {citation.publicationTypes.length > 0 && <div className="mt-2 flex flex-wrap gap-1">{citation.publicationTypes.map((type) => <span key={type} className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">{type}</span>)}</div>}
                  {citation.abstractExcerpt && (
                    <details className="mt-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-950/60">
                      <summary className="cursor-pointer text-[10px] font-bold text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-slate-200">Read abstract excerpt</summary>
                      <p className="mt-2 text-[11px] leading-5 text-slate-600 dark:text-slate-300">{citation.abstractExcerpt}</p>
                    </details>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a href={citation.pubMedUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:underline dark:text-emerald-300">PMID {citation.pmid} <ExternalLink className="h-3 w-3" /></a>
                    {citation.doi && citation.doiUrl && <a href={citation.doiUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 hover:underline dark:text-blue-300">DOI {citation.doi} <ExternalLink className="h-3 w-3" /></a>}
                  </div>
                  {citation.crossref && (
                    <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-2 text-[10px] leading-4 text-blue-900 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200">
                      <span className="font-bold">Crossref metadata</span>
                      {citation.crossref.publisher && <span> · {citation.crossref.publisher}</span>}
                      {citation.crossref.type && <span> · {citation.crossref.type.replace(/-/g, " ")}</span>}
                      {citation.crossref.citedByCount !== null && <span> · cited by {citation.crossref.citedByCount}</span>}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
          <p className="px-1 text-[9px] leading-4 text-slate-500">
            Metadata supplied by PubMed and optionally enriched through Crossref. Design labels and citation counts describe metadata; they do not establish study quality or clinical applicability.{" "}
            <a href="https://www.ncbi.nlm.nih.gov/home/about/policies/" target="_blank" rel="noreferrer" className="font-semibold text-emerald-700 hover:underline dark:text-emerald-300">NCBI data-use policies</a>
          </p>
        </section>
      )}
    </div>
  );
}

function AssistantPanel({ system, onClose }: { system: AnatomySystemId; onClose: () => void }) {
  const selectedSystem = getAnatomySystem(system);
  const [mode, setMode] = useState<AssistantMode>("teach");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      evidenceStatus: "curated",
      text: "I’m the HoloHuman™ Academy Assistant. I can explain concepts and create study prompts. I do not diagnose, prescribe, or use patient data in Foundation Study mode.",
    },
  ]);

  const suggestedQuestion = useMemo(() => {
    if (mode === "quiz") return `Quiz me on the ${selectedSystem.name}.`;
    if (mode === "research") return `What are the best introductory sources for studying the ${selectedSystem.name}?`;
    if (mode === "homeopathy") {
      return `How should traditional homeopathic literature about the ${selectedSystem.name} be separated from clinical evidence?`;
    }
    return `Teach me the core anatomy of the ${selectedSystem.name}.`;
  }, [mode, selectedSystem.name]);

  const submitQuestion = async (event?: FormEvent) => {
    event?.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    const userMessage: AssistantMessage = { id: messageId(), role: "user", text: question };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10_000);

    try {
      const response = await fetch("/api/consult-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "public",
          lang: "en",
          query: getModePrompt(mode, selectedSystem.name, question),
        }),
        signal: controller.signal,
      });
      const payload = await response.json();
      const citations = Array.isArray(payload.citations)
        ? payload.citations.filter((citation: unknown): citation is string => typeof citation === "string").slice(0, 6)
        : [];
      const requiresGrounding = mode === "research" || mode === "homeopathy";
      const hasGrounding = citations.length > 0;

      let assistantText = typeof payload.response === "string" ? payload.response.trim() : "";
      let evidenceStatus: AssistantMessage["evidenceStatus"] = hasGrounding ? "grounded" : "unverified";

      if (!response.ok || !payload.success || !assistantText) {
        assistantText = "The learning service could not answer that question safely. Please use the reviewed source linked in the atlas and try again later.";
        evidenceStatus = "abstained";
      } else if (requiresGrounding && !hasGrounding) {
        assistantText =
          "I could not produce a source-grounded answer for this request. Research and traditional-literature modes do not display unsupported model output. Use the reviewed source registry or ask a narrower anatomy question.";
        evidenceStatus = "abstained";
      }

      setMessages((current) => [
        ...current,
        {
          id: messageId(),
          role: "assistant",
          text: assistantText,
          citations,
          evidenceStatus,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: messageId(),
          role: "assistant",
          evidenceStatus: "abstained",
          text: "The learning service timed out. No answer was generated. You can continue with the reviewed atlas source while the service recovers.",
        },
      ]);
    } finally {
      window.clearTimeout(timeout);
      setLoading(false);
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submitQuestion();
    }
  };

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-label="HoloHuman Academy Assistant"
      className="relative z-10 flex h-full w-full max-w-[480px] flex-col overflow-hidden bg-white shadow-2xl dark:bg-slate-900 sm:rounded-3xl sm:border sm:border-white/20"
    >
      <header className="border-b border-teal-400/20 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 px-5 pb-5 pt-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-300 to-cyan-400 text-slate-950 shadow-lg shadow-teal-950/40">
              <Brain className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-base font-semibold">HoloHuman™ Academy Assistant</h2>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-teal-200">Learning workspace</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            aria-label="Close HoloHuman Academy Assistant"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
          >
            <PanelRightClose className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] font-semibold">
          <span className="rounded-full border border-teal-300/20 bg-teal-300/10 px-2.5 py-1 text-teal-100">{selectedSystem.shortName}</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">No patient context</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">Evidence aware</span>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-slate-50/90 p-4 dark:border-slate-800 dark:bg-slate-950/80" aria-label="Assistant learning modes">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Choose a learning task</p>
        <div className="grid grid-cols-2 gap-2">
          {ASSISTANT_MODES.map((item) => (
            (() => {
              const ModeIcon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMode(item.id)}
                  aria-pressed={mode === item.id}
                  className={`min-h-[76px] rounded-2xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${mode === item.id ? `shadow-sm ring-1 ${item.activeClass}` : item.inactiveClass}`}
                >
                  <span className="flex items-center gap-2 text-xs font-bold"><ModeIcon className="h-4 w-4" />{item.label}</span>
                  <span className="mt-1.5 block text-[10px] leading-4 opacity-70">{item.helper}</span>
                </button>
              );
            })()
          ))}
        </div>
      </section>

      <div className="flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-white to-slate-50/80 p-4 dark:from-slate-900 dark:to-slate-950" aria-live="polite">
        {mode === "research" ? <LiteratureSearchWorkspace system={system} /> : <>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`rounded-2xl px-3.5 py-3 text-sm leading-6 ${
              message.role === "user"
                ? "ml-10 rounded-br-md bg-gradient-to-br from-teal-600 to-cyan-700 text-white shadow-sm"
                : "mr-5 rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            }`}
          >
            {message.role === "assistant" && message.evidenceStatus && (
              <span
                className={`mb-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                  message.evidenceStatus === "grounded" || message.evidenceStatus === "curated"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    : message.evidenceStatus === "abstained"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {message.evidenceStatus === "curated" && "Safety note"}
                {message.evidenceStatus === "grounded" && "Source grounded"}
                {message.evidenceStatus === "unverified" && "AI explanation · verify"}
                {message.evidenceStatus === "abstained" && "No verified answer"}
              </span>
            )}
            <p className="whitespace-pre-wrap">{message.text}</p>
            {message.citations && message.citations.length > 0 && (
              <div className="mt-3 border-t border-slate-200 pt-2 dark:border-slate-700">
                <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Returned citations</p>
                <ul className="mt-1 space-y-1">
                  {message.citations.map((citation) => (
                    <li key={citation} className="break-words text-[10px] leading-4 text-slate-500 dark:text-slate-400">
                      {citation}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="mr-10 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 dark:border-slate-700 dark:bg-slate-950/60">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="h-2 w-2 animate-pulse rounded-full bg-teal-500" /> Checking the learning route…
            </div>
          </div>
        )}
        </>}
      </div>

      {mode !== "research" && <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <button
          type="button"
          onClick={() => setInput(suggestedQuestion)}
          className="mb-3 w-full rounded-2xl border border-teal-100 bg-teal-50/70 px-3.5 py-2.5 text-left text-[11px] leading-4 text-teal-900 hover:border-teal-300 hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200"
        >
          <span className="font-semibold">Suggested:</span> {suggestedQuestion}
        </button>
        <form onSubmit={submitQuestion} className="flex items-end gap-2">
          <label className="sr-only" htmlFor="academy-assistant-question">Ask an educational medical question</label>
          <textarea
            id="academy-assistant-question"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleInputKeyDown}
            rows={2}
            maxLength={1200}
            placeholder="Ask an educational question…"
            className="min-h-14 flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-teal-950"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Send question"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-md shadow-teal-900/15 transition hover:from-teal-600 hover:to-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <p className="mt-2 text-center text-[9px] leading-4 text-slate-500">
          Educational support only. Verify medical information in the displayed sources.
        </p>
      </div>}
    </aside>
  );
}

export default function MedicalAcademyWorkspace({
  initialSection,
  isImmersive = false,
  onImmersiveChange,
}: MedicalAcademyWorkspaceProps) {
  const [activeSection, setActiveSection] = useState<AcademySection>(() => safeInitialSection(initialSection));
  const [selectedSystem, setSelectedSystem] = useState<AnatomySystemId>("cardiovascular");
  const [activeRemedyTropismId, setActiveRemedyTropismId] = useState<string | null>(null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [progress, setProgress] = useState<AcademyProgress>(EMPTY_ACADEMY_PROGRESS);
  const [progressReady, setProgressReady] = useState(false);

  useEffect(() => {
    setActiveSection(safeInitialSection(initialSection));
  }, [initialSection]);

  useEffect(() => {
    setProgress(readAcademyProgress());
    setProgressReady(true);
  }, []);

  useEffect(() => {
    if (!progressReady) return;
    try {
      window.localStorage.setItem(ACADEMY_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Learning remains usable when private browsing or storage policy blocks persistence.
    }
  }, [progress, progressReady]);

  // Global ⌘K Search Hotkey & Escape Handling
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchModalOpen((open) => !open);
      }
      if (e.key === "Escape") {
        if (searchModalOpen) setSearchModalOpen(false);
        if (assistantOpen) setAssistantOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchModalOpen, assistantOpen]);

  const completeSystemModule = (id: AnatomySystemId) => {
    setProgress((current) => ({
      ...current,
      completedSystems: current.completedSystems.includes(id)
        ? current.completedSystems
        : [...current.completedSystems, id],
      lastUpdated: new Date().toISOString(),
    }));
  };

  const recordAssessmentAnswer = (questionId: string, correct: boolean) => {
    setProgress((current) => ({
      ...current,
      masteredQuestionIds: correct
        ? [...new Set([...current.masteredQuestionIds, questionId])]
        : current.masteredQuestionIds.filter((id) => id !== questionId),
      reviewQuestionIds: correct
        ? current.reviewQuestionIds.filter((id) => id !== questionId)
        : [...new Set([...current.reviewQuestionIds, questionId])],
      assessmentAttempts: current.assessmentAttempts + 1,
      lastUpdated: new Date().toISOString(),
    }));
  };

  const navigateToSystem = (id: AnatomySystemId) => {
    setSelectedSystem(id);
    setActiveSection("explore");
  };

  const handleSearchResultSelection = (item: SearchResultItem) => {
    if (item.category === "pathology") {
      setActiveSection("pathology");
    } else if (item.category === "remedy") {
      setActiveRemedyTropismId(item.id);
      setActiveSection("explore");
    } else {
      // Map system name to AnatomySystemId if recognized
      const matched = ANATOMY_SYSTEMS.find(
        (s) =>
          s.name.toLowerCase().includes(item.systemName.toLowerCase()) ||
          s.shortName.toLowerCase().includes(item.systemName.toLowerCase())
      );
      if (matched) setSelectedSystem(matched.id);
      setActiveSection("explore");
    }
  };

  const renderSection = () => {
    if (activeSection === "home") return <AcademyHome onNavigate={setActiveSection} />;
    if (activeSection === "learn") {
      return (
        <LearnWorkspace
          completedSystems={progress.completedSystems}
          onCompleteSystem={completeSystemModule}
          onOpenSystem={navigateToSystem}
        />
      );
    }
    if (activeSection === "explore") {
      return (
        <AnatomyAtlas
          selected={selectedSystem}
          onSelect={setSelectedSystem}
          activeRemedyTropismId={activeRemedyTropismId}
          onRemedyTropismSelect={setActiveRemedyTropismId}
        />
      );
    }
    if (activeSection === "pathology") {
      return <HoloHumanPathologySimulator />;
    }
    if (activeSection === "practice") return <PracticeWorkspace onSelectSystem={navigateToSystem} />;
    if (activeSection === "assess") {
      return <AssessmentWorkspace reviewQuestionIds={progress.reviewQuestionIds} onAnswer={recordAssessmentAnswer} />;
    }
    if (activeSection === "research") return <SourceRegistry />;
    return <ProgressWorkspace progress={progress} />;
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-100/80 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto min-h-full w-full max-w-[1680px] px-3 py-4 sm:px-5 lg:px-7">
        <header className="mb-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-teal-300 dark:bg-teal-400 dark:text-slate-950">
                <HeartPulse className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-lg font-semibold tracking-tight text-slate-950 dark:text-white sm:text-xl">
                    HoloHuman™ Academy
                  </h1>
                  <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-teal-700 dark:bg-teal-950/50 dark:text-teal-300">
                    Study Workspace
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Evidence-aware foundational medical learning & clinical intelligence</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* ⌘K Search Trigger */}
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="group inline-flex min-h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-teal-400 hover:bg-white hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-teal-500 dark:hover:text-white"
              >
                <Search className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <span className="hidden sm:inline">Search Anatomy & Tropism</span>
                <span className="inline sm:hidden">Search</span>
                <kbd className="ml-1 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-mono text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700">⌘K</kbd>
              </button>

              <button
                type="button"
                onClick={() => setAssistantOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={assistantOpen}
                className="group inline-flex min-h-11 items-center gap-2.5 rounded-2xl bg-gradient-to-r from-slate-950 to-teal-900 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-slate-900/10 transition hover:from-teal-900 hover:to-cyan-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:from-teal-400 dark:to-cyan-400 dark:text-slate-950"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-teal-200 dark:bg-slate-950/10 dark:text-slate-950"><Sparkles className="h-4 w-4" /></span>
                Open HoloHuman™ Academy Assistant
                <PanelRightOpen className="h-4 w-4 opacity-70 transition group-hover:translate-x-0.5" />
              </button>
              {onImmersiveChange && (
                <button
                  type="button"
                  onClick={() => onImmersiveChange(!isImmersive)}
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-teal-300 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-700 dark:text-slate-200"
                >
                  {isImmersive ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  {isImmersive ? "Exit focus" : "Focus mode"}
                </button>
              )}
            </div>
          </div>

          <nav className="mt-5 flex gap-1 overflow-x-auto rounded-2xl bg-slate-100 p-1 dark:bg-slate-950" aria-label="Medical Academy sections">
            {ACADEMY_SECTIONS.map((section) => {
              const Icon = SECTION_ICONS[section.id];
              const selected = section.id === activeSection;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  aria-current={selected ? "page" : undefined}
                  className={`flex min-h-11 min-w-max flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                    selected
                      ? "bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white"
                      : "text-slate-500 hover:bg-white/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                  }`}
                  title={section.description}
                >
                  <Icon className="h-4 w-4" /> {section.label}
                </button>
              );
            })}
          </nav>
        </header>

        <TrustBanner />

        <div className="mt-4 grid grid-cols-1 items-start gap-4">
          <main className="min-w-0">{renderSection()}</main>
        </div>

        {/* ⌘K Search Modal */}
        <HoloHumanSearchModal
          isOpen={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
          onSelectResult={handleSearchResultSelection}
        />

        {assistantOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end bg-slate-950/50 backdrop-blur-sm sm:p-4">
            <button
              type="button"
              aria-label="Close HoloHuman Academy Assistant backdrop"
              onClick={() => setAssistantOpen(false)}
              className="absolute inset-0 cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-400"
            />
            <AssistantPanel system={selectedSystem} onClose={() => setAssistantOpen(false)} />
          </div>
        )}

        <footer className="mt-5 flex flex-col gap-2 border-t border-slate-200 px-1 py-4 text-[10px] leading-5 text-slate-500 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <span>HoloHuman™ Academy · Foundation Study · Educational use only</span>
          <span className="inline-flex items-center gap-1.5">
            <CircleHelp className="h-3 w-3" /> Report questionable content through the clinical knowledge review workflow.
          </span>
        </footer>
      </div>
    </div>
  );
}
