import React from "react";
import { render, fireEvent, screen, act } from "@testing-library/react";
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

describe("KnowledgeGraphExplorer Integration & Accessibility", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.body.style.overflow = "";
    vi.useRealTimers();
  });

  // TC-001: Navigation & Destination paths
  it("should output correct href paths matching specific entity type routes", () => {
    render(<KnowledgeGraphExplorer currentId="D0001" />);

    // Symptoms link
    const symptomLink = screen.getByTestId("satellite-S0001");
    expect(symptomLink).toHaveAttribute("href", "/knowledge/symptoms/heartburn");

    // Remedies link
    const remedyLink = screen.getByTestId("satellite-R0002");
    expect(remedyLink).toHaveAttribute("href", "/knowledge/remedies/nux-vomica");

    // Lab Test link
    const labLink = screen.getByTestId("satellite-L0001");
    expect(labLink).toHaveAttribute("href", "/knowledge/lab-tests/cbc");

    // Research link
    const researchLink = screen.getByTestId("satellite-RES-gerd-2023");
    expect(researchLink).toHaveAttribute("href", "/knowledge/research/gerd-study");

    // Case Study link
    const caseLink = screen.getByTestId("satellite-CAS-eczema-001");
    expect(caseLink).toHaveAttribute("href", "/knowledge/case-studies/eczema-case");

    // Disease link
    const diseaseLink = screen.getByTestId("satellite-D0002");
    expect(diseaseLink).toHaveAttribute("href", "/knowledge/diseases/eczema");
  });

  // TC-002: Keyboard Focus Parity
  it("should open tooltip details and attach aria-describedby on keyboard focus", async () => {
    render(<KnowledgeGraphExplorer currentId="D0001" />);

    const link = screen.getByTestId("satellite-S0001");
    expect(link).not.toHaveAttribute("aria-describedby");
    expect(screen.queryByText("Burning sensation")).not.toBeInTheDocument();

    // Simulating keyboard focus
    act(() => {
      fireEvent.focus(link);
    });

    // Expect tooltip details card to be open and correctly associated
    expect(link).toHaveAttribute("aria-describedby", "graph-tooltip-details");
    expect(screen.getByText("Burning sensation")).toBeInTheDocument();

    // Blur focus
    act(() => {
      fireEvent.blur(link);
    });
    expect(link).not.toHaveAttribute("aria-describedby");
    expect(screen.queryByText("Burning sensation")).not.toBeInTheDocument();
  });

  // TC-003: Focus Containment Trap (dialog containment)
  it("should wrap focus inside the fullscreen modal on tab/shift-tab", async () => {
    render(<KnowledgeGraphExplorer currentId="D0001" />);

    // Click expand button to open fullscreen
    const expandBtn = screen.getByLabelText("Expand graph to fullscreen");
    act(() => {
      fireEvent.click(expandBtn);
    });

    // Get focusable items in portal
    const closeBtn = screen.getByTestId("close-explorer-btn");
    const satellites = screen.getAllByTestId(/^satellite-/);

    // The first focusable item is close button, last is the last satellite
    const first = closeBtn;
    const last = satellites[satellites.length - 1];

    // Focus last element
    act(() => {
      last.focus();
    });
    expect(document.activeElement).toBe(last);

    // Press Tab on last element -> wraps to first
    act(() => {
      fireEvent.keyDown(last, { key: "Tab", code: "Tab" });
    });
    expect(document.activeElement).toBe(first);

    // Focus first element
    act(() => {
      first.focus();
    });
    expect(document.activeElement).toBe(first);

    // Press Shift+Tab on first element -> wraps to last
    act(() => {
      fireEvent.keyDown(first, { key: "Tab", code: "Tab", shiftKey: true });
    });
    expect(document.activeElement).toBe(last);
  });

  // TC-004: Focus Restoration
  it("should restore focus to trigger element when closing fullscreen explorer", () => {
    render(<KnowledgeGraphExplorer currentId="D0001" />);

    const expandBtn = screen.getByLabelText("Expand graph to fullscreen");
    act(() => {
      expandBtn.focus();
    });
    expect(document.activeElement).toBe(expandBtn);

    // Open fullscreen
    act(() => {
      fireEvent.click(expandBtn);
    });
    expect(screen.getByTestId("close-explorer-btn")).toBeInTheDocument();

    // Close fullscreen
    const closeBtn = screen.getByTestId("close-explorer-btn");
    act(() => {
      fireEvent.click(closeBtn);
    });

    // Assert focus is restored back to expand trigger button
    expect(document.activeElement).toBe(expandBtn);
  });

  // TC-005: Escape to Close
  it("should close fullscreen modal when pressing Escape", () => {
    render(<KnowledgeGraphExplorer currentId="D0001" />);

    const expandBtn = screen.getByLabelText("Expand graph to fullscreen");
    act(() => {
      fireEvent.click(expandBtn);
    });
    expect(screen.getByTestId("close-explorer-btn")).toBeInTheDocument();

    // Press Escape
    act(() => {
      fireEvent.keyDown(window, { key: "Escape", code: "Escape" });
    });

    // Fullscreen should be closed
    expect(screen.queryByTestId("close-explorer-btn")).not.toBeInTheDocument();
  });

  // TC-006: Single-Instance Rendering
  it("should only render exactly one graph instance workspace and unmount inline workspace when fullscreen is active", () => {
    const { queryAllByTestId } = render(<KnowledgeGraphExplorer currentId="D0001" />);

    // Pre-fullscreen: exactly 1 workspace inline
    expect(queryAllByTestId("graph-interactive-workspace")).toHaveLength(1);

    // Trigger fullscreen
    const expandBtn = screen.getByLabelText("Expand graph to fullscreen");
    act(() => {
      fireEvent.click(expandBtn);
    });

    // Fullscreen active: still exactly 1 workspace because inline is unmounted
    expect(queryAllByTestId("graph-interactive-workspace")).toHaveLength(1);

    // Close fullscreen
    const closeBtn = screen.getByTestId("close-explorer-btn");
    act(() => {
      fireEvent.click(closeBtn);
    });

    // Post-fullscreen: exactly 1 workspace inline again
    expect(queryAllByTestId("graph-interactive-workspace")).toHaveLength(1);
  });

  // TC-007: Lifecycle Cleanup on Unmount
  it("should unlock body overflow and cleanup capture-phase event listeners when component unmounts", () => {
    // Set a non-empty preexisting overflow value
    document.body.style.overflow = "scroll";

    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = render(<KnowledgeGraphExplorer currentId="D0001" />);

    // Trigger fullscreen
    const expandBtn = screen.getByLabelText("Expand graph to fullscreen");
    act(() => {
      fireEvent.click(expandBtn);
    });
    expect(document.body.style.overflow).toBe("hidden");

    // Verify keydown listener was registered on capture phase (third arg true)
    const addCalls = addSpy.mock.calls.filter(call => call[0] === "keydown" && call[2] === true);
    expect(addCalls.length).toBeGreaterThanOrEqual(1);
    const registeredHandler = addCalls[0][1];

    // Unmount while active
    act(() => {
      unmount();
    });

    // Assert the capture keydown event listener was cleaned up
    const removeCalls = removeSpy.mock.calls.filter(call => call[0] === "keydown" && call[1] === registeredHandler && call[2] === true);
    expect(removeCalls.length).toBeGreaterThanOrEqual(1);

    // Overflow styling should be restored back to the preexisting non-empty "scroll" value
    expect(document.body.style.overflow).toBe("scroll");

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  // TC-008: Reduced Motion Utility Classes
  it("should include Tailwind motion-reduce:transition-none classes on transition elements", () => {
    render(<KnowledgeGraphExplorer currentId="D0001" />);

    const link = screen.getByTestId("satellite-S0001");
    expect(link.className).toContain("motion-reduce:transition-none");
    expect(link.className).toContain("motion-reduce:hover:scale-100");
    expect(link.className).toContain("motion-reduce:focus:scale-100");
  });

  // TC-009: Initial Focus Transfer and Timeout Cancellation
  it("should transfer focus to close button via fake timer and cancel timer on unmount", () => {
    vi.useFakeTimers();

    // 1. Verify Focus Transfer
    const { unmount: unmountFocus } = render(<KnowledgeGraphExplorer currentId="D0001" />);
    const baseCountFocus = vi.getTimerCount();

    const expandBtnFocus = screen.getByLabelText("Expand graph to fullscreen");
    act(() => {
      fireEvent.click(expandBtnFocus);
    });
    expect(vi.getTimerCount()).toBe(baseCountFocus + 1);

    // Before timer fires, focus is not on close button yet
    expect(document.activeElement).not.toHaveAttribute("data-testid", "close-explorer-btn");

    act(() => {
      vi.advanceTimersByTime(35);
    });
    const closeBtn = screen.getByTestId("close-explorer-btn");
    expect(document.activeElement).toBe(closeBtn);

    act(() => {
      unmountFocus();
    });

    // 2. Verify Timer Cancellation
    const { unmount: unmountCancel } = render(<KnowledgeGraphExplorer currentId="D0001" />);
    const baseCountCancel = vi.getTimerCount();

    const expandBtnCancel = screen.getByLabelText("Expand graph to fullscreen");
    act(() => {
      fireEvent.click(expandBtnCancel);
    });
    expect(vi.getTimerCount()).toBe(baseCountCancel + 1);

    // Unmount immediately before timer fires and verify timer count goes back to base
    act(() => {
      unmountCancel();
    });
    expect(vi.getTimerCount()).toBe(baseCountCancel);

    vi.useRealTimers();
  });
});
