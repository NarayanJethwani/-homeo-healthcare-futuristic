import React, { Profiler } from "react";
import { render, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import KnowledgeGraphExplorer from "../src/features/knowledge/components/KnowledgeGraphExplorer";

// Mock Next.js Link component to render a standard anchor tag
vi.mock("next/link", () => {
  return {
    default: ({ href, children, ...props }: any) => {
      return <a href={href} {...props}>{children}</a>;
    }
  };
});

// Mock knowledge entities for reproducible tests with all supported entity types
vi.mock("../src/features/knowledge/index", () => {
  return {
    getAllKnowledgeEntities: () => [
      { id: "D0001", slug: "gerd", title: "GERD", entityType: "disease", summary: "Gastroesophageal reflux disease", tags: ["digestive"], editorialStatus: "published" },
      { id: "D0002", slug: "eczema", title: "Eczema", entityType: "disease", summary: "Atopic dermatitis", tags: ["skin"], editorialStatus: "published" },
      { id: "S0001", slug: "heartburn", title: "Heartburn", entityType: "symptom", summary: "Burning sensation", tags: ["chest"], editorialStatus: "published" },
      { id: "R0002", slug: "nux-vomica", title: "Nux Vomica", entityType: "remedy", summary: "Digestive remedy", tags: ["remedy"], editorialStatus: "published" },
      { id: "R0003", slug: "lycopodium", title: "Lycopodium", entityType: "remedy", summary: "Lycopodium clavatum", tags: ["remedy"], editorialStatus: "published" },
      { id: "L0001", slug: "cbc", title: "CBC", entityType: "lab-test", summary: "Complete blood count", tags: ["blood"], editorialStatus: "published" },
      { id: "RES-gerd-2023", slug: "gerd-study", title: "GERD Study", entityType: "research", summary: "Clinical trial", tags: ["study"], editorialStatus: "published" },
      { id: "CAS-eczema-001", slug: "eczema-case", title: "Eczema Case", entityType: "case-study", summary: "Case study of eczema", tags: ["case"], editorialStatus: "published" }
    ]
  };
});

// Mock relationships to map D0001 directly to all entity types
vi.mock("../src/features/knowledge/graph/entityRelationships", () => {
  return {
    KNOWLEDGE_RELATIONSHIPS: [
      { source: "D0001", relation: "hasSymptom", target: "S0001" },
      { source: "D0001", relation: "treatedWith", target: "R0002" },
      { source: "D0001", relation: "investigatedBy", target: "L0001" },
      { source: "D0001", relation: "supportedBy", target: "RES-gerd-2023" },
      { source: "D0001", relation: "supportedBy", target: "CAS-eczema-001" },
      { source: "D0001", relation: "treatedWith", target: "R0003" },
      { source: "D0001", relation: "relatedTo", target: "D0002" }
    ]
  };
});

describe("KnowledgeGraphExplorer React Profiling", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("should profile React render cycles and tab interaction times", async () => {
    const renderDurations: number[] = [];
    const onRender = (
      id: string,
      phase: "mount" | "update" | "nested-update",
      actualDuration: number
    ) => {
      // Collect actual duration of update render cycles
      if (phase === "update") {
        renderDurations.push(actualDuration);
      }
    };

    const { container } = render(
      <Profiler id="KnowledgeGraph" onRender={onRender}>
        <KnowledgeGraphExplorer currentId="D0001" />
      </Profiler>
    );

    // Warm-up phase: 3 runs tabbing through nodes
    const satellites = container.querySelectorAll('[data-testid^="satellite-"]');
    expect(satellites.length).toBeGreaterThan(0);

    for (let run = 0; run < 3; run++) {
      for (const satellite of satellites) {
        act(() => {
          (satellite as HTMLElement).focus();
        });
      }
    }

    // Clear warm-up durations
    renderDurations.length = 0;

    // Measurement phase: 30 runs of sequential focus shifts
    const totalRuns = 30;
    let successCount = 0;
    let failureCount = 0;

    for (let run = 0; run < totalRuns; run++) {
      try {
        for (const satellite of satellites) {
          act(() => {
            (satellite as HTMLElement).focus();
          });
        }
        successCount++;
      } catch (err) {
        failureCount++;
      }
    }

    // Compute statistics
    const sorted = [...renderDurations].sort((a, b) => a - b);
    const count = sorted.length;

    const p50 = count > 0 ? sorted[Math.floor(count * 0.50)] : 0;
    const p95 = count > 0 ? sorted[Math.floor(count * 0.95)] : 0;
    const maxVal = count > 0 ? sorted[count - 1] : 0;

    console.log("=== PHASE A BASELINE METRICS ===");
    console.log(`Total Samples (React Commits): ${count}`);
    console.log(`p50 React Commit Duration: ${p50.toFixed(4)} ms`);
    console.log(`p95 React Commit Duration: ${p95.toFixed(4)} ms`);
    console.log(`Max React Commit Duration: ${maxVal.toFixed(4)} ms`);
    console.log(`Success Rate: ${(successCount / totalRuns * 100).toFixed(1)}%`);
    console.log(`Failure Rate: ${(failureCount / totalRuns * 100).toFixed(1)}%`);
    console.log("================================");

    expect(successCount).toBe(totalRuns);
  });
});
