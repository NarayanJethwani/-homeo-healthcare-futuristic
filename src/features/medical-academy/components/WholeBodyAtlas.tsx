"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, RotateCcw, Search } from "lucide-react";
import { ANATOMY_REGIONS, type AnatomyRegionId, type AnatomySystemId } from "../data/medicalAcademyData";
import AnatomyScene from "../render/human-atlas/scene";
import {
  DEFAULT_VISIBLE,
  SYSTEMS,
  explanation,
  type Atlas,
  type Concept,
  type Part,
  type SceneState,
  type SystemId,
  type View,
} from "../render/human-atlas/anatomy";

const ATLAS_SYSTEMS: Record<AnatomySystemId, SystemId[]> = {
  cardiovascular: ["cardiac", "arterial", "venous"],
  nervous: ["nervous"],
  respiratory: ["respiratory"],
  digestive: ["digestive"],
  renal: ["urinary"],
  skeletal: ["skeletal", "connective"],
  muscular: ["muscular"],
  endocrine: ["endocrine"],
  lymphatic: ["lymphatic"],
  reproductive: ["reproductive"],
  integumentary: ["integumentary"],
  sensory: ["sensory"],
};

const PORTAL_SYSTEM: Record<SystemId, AnatomySystemId> = {
  cardiac: "cardiovascular",
  arterial: "cardiovascular",
  venous: "cardiovascular",
  nervous: "nervous",
  respiratory: "respiratory",
  digestive: "digestive",
  urinary: "renal",
  skeletal: "skeletal",
  connective: "skeletal",
  muscular: "muscular",
  endocrine: "endocrine",
  lymphatic: "lymphatic",
  reproductive: "reproductive",
  integumentary: "integumentary",
  sensory: "sensory",
};

const VIEWS: { id: View; label: string }[] = [
  { id: "three-quarter", label: "3/4" },
  { id: "front", label: "Front" },
  { id: "side", label: "Side" },
  { id: "back", label: "Back" },
];

export interface WholeBodySelection {
  id: string;
  name: string;
  systemId: AnatomySystemId;
  sourceSystem: SystemId;
  description: string;
  pieceCount: number;
}

interface WholeBodyAtlasProps {
  selectedSystem: AnatomySystemId;
  layer: "systems" | "regions";
  selectedRegion: AnatomyRegionId;
  onSelectSystem: (id: AnatomySystemId) => void;
  onSelectRegion: (id: AnatomyRegionId) => void;
  onSelectStructure: (selection: WholeBodySelection | null) => void;
  onUseSimpleMap: () => void;
}

export default function WholeBodyAtlas({
  selectedSystem,
  layer,
  selectedRegion,
  onSelectSystem,
  onSelectRegion,
  onSelectStructure,
  onUseSimpleMap,
}: WholeBodyAtlasProps) {
  const [atlas, setAtlas] = useState<Atlas | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [query, setQuery] = useState("");
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [state, setState] = useState<SceneState>(() => ({
    explode: 0,
    visible: [...ATLAS_SYSTEMS[selectedSystem], "integumentary"],
    selected: [],
    isolate: false,
    view: "three-quarter",
    rotate: false,
    reset: 0,
  }));
  const lastSystemRef = useRef(selectedSystem);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/models/human-atlas/atlas.json", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("The anatomy catalogue could not be loaded.");
        return response.json() as Promise<Atlas>;
      })
      .then(setAtlas)
      .catch((error: unknown) => {
        if (error instanceof Error && error.name !== "AbortError") setLoadError(error.message);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (lastSystemRef.current === selectedSystem) return;
    lastSystemRef.current = selectedSystem;
    setSelectedConcept(null);
    setState((previous) => ({
      ...previous,
      visible: [...ATLAS_SYSTEMS[selectedSystem], "integumentary"],
      selected: [],
      isolate: false,
    }));
    onSelectStructure(null);
  }, [selectedSystem, onSelectStructure]);

  const partsById = useMemo(() => new Map(atlas?.parts.map((part) => [part.id, part])), [atlas]);
  const results = useMemo(() => {
    if (!atlas) return [];
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return atlas.concepts
      .filter((concept) => concept.name.toLowerCase().includes(term) || concept.id.toLowerCase().includes(term))
      .sort((left, right) => left.name.length - right.name.length)
      .slice(0, 20);
  }, [atlas, query]);

  const selectConcept = (concept: Concept, part: Part | undefined) => {
    if (!part) return;
    const systemId = PORTAL_SYSTEM[part.system];
    lastSystemRef.current = systemId;
    setSelectedConcept(concept);
    setQuery("");
    setState((previous) => ({
      ...previous,
      selected: concept.elements,
      visible: Array.from(new Set([...ATLAS_SYSTEMS[systemId], "integumentary"])),
      isolate: false,
      rotate: false,
    }));
    onSelectSystem(systemId);
    onSelectStructure({
      id: concept.id,
      name: concept.name,
      systemId,
      sourceSystem: part.system,
      description: explanation(concept.name, part.system),
      pieceCount: concept.elements.length,
    });
  };

  const selectPart = (id: string) => {
    const part = partsById.get(id);
    if (!part) return;
    selectConcept({ id: part.conceptId, name: part.name, elements: [id] }, part);
  };

  const reset = () => {
    setSelectedConcept(null);
    onSelectStructure(null);
    setState((previous) => ({
      explode: 0,
      visible: [...ATLAS_SYSTEMS[selectedSystem], "integumentary"],
      selected: [],
      isolate: false,
      view: "three-quarter",
      rotate: false,
      reset: previous.reset + 1,
    }));
  };

  const region = ANATOMY_REGIONS.find((item) => item.id === selectedRegion) ?? ANATOMY_REGIONS[1];
  const activeCount = atlas?.parts.filter((part) => state.visible.includes(part.system)).length ?? 0;

  return (
    <div className="space-y-3" aria-label="Whole Body Atlas">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-slate-900 dark:text-white">Whole Body Atlas</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {atlas ? `${atlas.parts.length.toLocaleString()} selectable anatomical pieces` : "Loading anatomy catalogue"} · BodyParts3D adult male reference
          </p>
        </div>
        <button type="button" onClick={onUseSimpleMap} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300">
          Simple map
        </button>
      </div>

      <div className="relative h-[510px] overflow-hidden rounded-2xl border border-slate-200 bg-[#f2f3f3] sm:h-[580px] dark:border-slate-700">
        {atlas && !loadError && (
          <AnatomyScene atlas={atlas} state={state} onSelect={selectPart} onProgress={setProgress} onError={setLoadError} />
        )}
        {!loadError && progress < 100 && (
          <div role="status" className="absolute bottom-3 left-3 right-3 z-20 rounded-xl border border-white/80 bg-white/90 p-3 text-xs text-slate-700 shadow-sm backdrop-blur">
            Preparing anatomy · {progress}%
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-teal-600" style={{ width: `${progress}%` }} /></div>
          </div>
        )}
        {loadError && (
          <div role="alert" className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 p-5 text-center text-sm text-slate-700">
            <p>{loadError}</p>
            <button type="button" onClick={onUseSimpleMap} className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Open simple map</button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5" aria-label="Whole body camera controls">
        {VIEWS.map((view) => (
          <button key={view.id} type="button" aria-pressed={state.view === view.id} onClick={() => setState((previous) => ({ ...previous, view: view.id, reset: previous.reset + 1, rotate: false }))} className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold ${state.view === view.id ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
            {view.label}
          </button>
        ))}
        <button type="button" aria-pressed={state.rotate} onClick={() => setState((previous) => ({ ...previous, rotate: !previous.rotate }))} className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{state.rotate ? "Pause" : "Rotate"}</button>
        <button type="button" onClick={reset} className="ml-auto inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"><RotateCcw className="h-3 w-3" /> Reset</button>
      </div>

      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300">
        Separate structures <span className="font-normal">{Math.round(state.explode * 100)}%</span>
        <input type="range" min="0" max="100" value={Math.round(state.explode * 100)} onChange={(event) => setState((previous) => ({ ...previous, explode: Number(event.target.value) / 100, rotate: false, view: Number(event.target.value) > 80 ? "front" : previous.view }))} className="mt-1 block w-full accent-teal-600" />
      </label>

      <div className="flex flex-wrap gap-1.5" aria-label="Anatomy layer presets">
        <button type="button" onClick={() => setState((previous) => ({ ...previous, visible: [...ATLAS_SYSTEMS[selectedSystem], "integumentary"], isolate: false }))} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] dark:border-slate-700">Selected system</button>
        <button type="button" onClick={() => setState((previous) => ({ ...previous, visible: ["cardiac", "respiratory", "digestive", "urinary", "endocrine", "reproductive", "integumentary"], isolate: false }))} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] dark:border-slate-700">Organs</button>
        <button type="button" onClick={() => setState((previous) => ({ ...previous, visible: ["skeletal", "integumentary"], isolate: false }))} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] dark:border-slate-700">Skeleton</button>
        <button type="button" onClick={() => setState((previous) => ({ ...previous, visible: DEFAULT_VISIBLE, isolate: false }))} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] dark:border-slate-700">All</button>
        <span className="self-center text-[10px] text-slate-500">{activeCount.toLocaleString()} visible pieces</span>
      </div>

      <div className="flex flex-wrap gap-1" aria-label="Anatomical systems">
        {SYSTEMS.map((system) => (
          <button key={system.id} type="button" aria-pressed={state.visible.includes(system.id)} onClick={() => setState((previous) => ({ ...previous, visible: previous.visible.includes(system.id) ? previous.visible.filter((id) => id !== system.id) : [...previous.visible, system.id], isolate: false }))} className={`rounded-full border px-2 py-1 text-[10px] ${state.visible.includes(system.id) ? "border-teal-400 bg-teal-50 text-teal-900" : "border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400"}`}>
            {system.name}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
        <input type="search" aria-label="Search anatomical structures" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search heart, stomach, femur…" className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-8 pr-3 text-xs text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
        {query && (
          <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
            {results.length ? results.map((concept) => (
              <button key={concept.id} type="button" onClick={() => selectConcept(concept, partsById.get(concept.elements[0]))} className="block w-full rounded-lg px-2.5 py-2 text-left text-xs text-slate-700 hover:bg-teal-50 dark:text-slate-200 dark:hover:bg-slate-800">
                {concept.name} <span className="text-slate-400">· {concept.id}</span>
              </button>
            )) : <p className="p-2 text-xs text-slate-500">No matching structures</p>}
          </div>
        )}
      </div>

      {selectedConcept && state.selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 p-2.5 text-xs text-teal-900 dark:border-teal-800 dark:bg-teal-950/30 dark:text-teal-200">
          <span className="font-semibold">{selectedConcept.name}</span>
          <button type="button" onClick={() => setState((previous) => ({ ...previous, isolate: !previous.isolate, explode: 0 }))} className="rounded-md border border-teal-300 px-2 py-1 font-semibold dark:border-teal-700">{state.isolate ? "Show context" : "Isolate"}</button>
          <button type="button" onClick={() => { setSelectedConcept(null); onSelectStructure(null); setState((previous) => ({ ...previous, selected: [], isolate: false })); }} className="ml-auto underline">Clear</button>
        </div>
      )}

      {layer === "regions" && (
        <section aria-label="Nine abdominopelvic regions" className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white">Nine abdominal regions</h3>
          <p className="mt-1 text-[11px] text-slate-500">Select a teaching region. Boundaries are conceptual and are not traced on the 3D mesh.</p>
          <div className="mt-3 grid grid-cols-3 gap-1" aria-label="Nine-region grid, patient right on the left">
            {ANATOMY_REGIONS.map((item) => (
              <button key={item.id} type="button" aria-pressed={selectedRegion === item.id} onClick={() => onSelectRegion(item.id)} className={`min-h-11 rounded-md border px-1 text-[10px] font-semibold leading-3 ${selectedRegion === item.id ? "border-teal-600 bg-teal-600 text-white" : "border-slate-200 text-slate-600 hover:bg-teal-50 dark:border-slate-700 dark:text-slate-300"}`}>{item.name.replace(" region", "")}</button>
            ))}
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-900 dark:text-white">{region.name}</p>
          <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">{region.description}</p>
          <p className="mt-1 text-[11px] text-slate-500">Typical contents: {region.typicalContents.join(", ")}</p>
        </section>
      )}

      <p className="text-[10px] leading-4 text-slate-500">
        Educational reference · Adult male anatomy · BodyParts3D CC BY 4.0 · <a href="/models/human-atlas/ATTRIBUTION.md" target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 underline">Source and attribution <ExternalLink className="h-2.5 w-2.5" /></a>
      </p>
    </div>
  );
}
