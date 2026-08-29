import React from "react";
import ReactDOMServer from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { formatMedicalDate, formatMedicalDateLong } from "../src/features/knowledge/utils/dateFormatter";
import LastReviewedBadge from "../src/features/knowledge/components/LastReviewedBadge";
import EditorialConfidenceBadge from "../src/features/knowledge/components/EditorialConfidenceBadge";
import ReviewedBy from "../src/features/knowledge/components/ReviewedBy";
import TimelineHistory from "../src/features/knowledge/components/TimelineHistory";
import AICitationBlock from "../src/features/knowledge/components/AICitationBlock";
import { DEFAULT_CLINICAL_NOTES } from "../src/features/consultation/types/clinical-notes.types";

// Mock Next.js Link component
vi.mock("next/link", () => {
  return {
    default: ({ href, children, ...props }: any) => {
      return <a href={href} {...props}>{children}</a>;
    }
  };
});

// Mock knowledge graph module dependencies
vi.mock("../src/features/knowledge/graph/knowledgeGraph", () => {
  return {
    getEntityRelationships: () => []
  };
});

// Legacy component simulating the old timezone-sensitive formatting logic
function LegacyReviewedBadge({ reviewedDate }: { reviewedDate: string }) {
  const formattedDate = new Date(reviewedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <span>Reviewed: {formattedDate}</span>
  );
}

describe("Date Formatter Unit Tests", () => {
  it("uses a deterministic unsaved timestamp for the consultation shell", () => {
    expect(DEFAULT_CLINICAL_NOTES.updatedAt).toBe("");
  });

  it("should format valid dates correctly preserving styles and day digits", () => {
    // Normal date short format
    expect(formatMedicalDate("2026-06-30")).toBe("Jun 30, 2026");
    expect(formatMedicalDate("2026-06-30T12:00:00Z")).toBe("Jun 30, 2026");

    // Check that we use 9 instead of 09
    expect(formatMedicalDate("2026-01-09")).toBe("Jan 9, 2026");
    expect(formatMedicalDateLong("2026-01-09")).toBe("January 9, 2026");
  });

  it("should parse leap year dates correctly", () => {
    // 2024 is leap year, 29 Feb is valid
    expect(formatMedicalDate("2024-02-29")).toBe("Feb 29, 2024");
    // 2026 is not leap year, 29 Feb is invalid
    expect(formatMedicalDate("2026-02-29")).toBe("");
  });

  it("should return empty string for invalid or impossible dates", () => {
    expect(formatMedicalDate("")).toBe("");
    expect(formatMedicalDate("invalid-date-string")).toBe("");
    expect(formatMedicalDate("2026-02-31")).toBe(""); // impossible day
    expect(formatMedicalDate("2026-13-10")).toBe(""); // impossible month
  });

  it("should reject invalid/malformed ISO timestamps (negative tests)", () => {
    expect(formatMedicalDate("2026-06-30T99:99:99Z")).toBe(""); // invalid hours, minutes, seconds
    expect(formatMedicalDate("2026-06-30T24:00:00Z")).toBe(""); // hours must be 00-23
    expect(formatMedicalDate("2026-06-30T12:60:00Z")).toBe(""); // minutes must be 00-59
    expect(formatMedicalDate("2026-06-30T12:00:60Z")).toBe(""); // seconds must be 00-59
    expect(formatMedicalDate("2026-06-30T12:00:00+25:00")).toBe(""); // invalid offset hours
  });

  it("should remain timezone invariant", () => {
    // The outputs must match exactly regardless of context
    expect(formatMedicalDate("2026-06-30T01:00:00Z")).toBe("Jun 30, 2026");
    expect(formatMedicalDate("2026-06-30T23:00:00Z")).toBe("Jun 30, 2026");
  });
});

describe("React Hydration & Timezone-Invariance Verification", () => {
  let container: HTMLDivElement;
  let roots: any[] = [];
  const originalToLocaleDateString = Date.prototype.toLocaleDateString;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    act(() => {
      roots.forEach((root) => {
        try {
          root.unmount();
        } catch (e) {
          // Suppress unmount errors on elements already cleaned up
        }
      });
    });
    roots = [];
    document.body.removeChild(container);
    Date.prototype.toLocaleDateString = originalToLocaleDateString;
  });

  const mockReviewer = {
    name: "Dr. Jane Smith",
    title: "MD (Homeopathy)",
    registration: "12345",
    profileUrl: "/team/jane-smith"
  };

  const mockVersionInfo = {
    version: "1.0.0",
    created: "2026-06-30T01:00:00Z",
    updated: "2026-06-30T01:00:00Z",
    reviewed: "2026-06-30T01:00:00Z"
  };

  const mockEntity: any = {
    id: "D0001",
    entityType: "disease",
    versionInfo: mockVersionInfo,
    evidenceLevel: "High",
    title: { en: "GERD" },
    summary: { en: "Gastroesophageal reflux disease" },
    content: { causes: [], symptoms: [] },
    reviewer: mockReviewer,
    author: { name: "Dr. Jane Smith" },
    canonicalUrl: "https://homeo.healthcare/knowledge/diseases/gerd"
  };

  it("presents pending clinical validation without an unverified label", () => {
    const html = ReactDOMServer.renderToString(
      <EditorialConfidenceBadge
        entity={mockEntity}
        reviewedDate="2026-06-30T01:00:00Z"
      />
    );

    expect(html).toContain("Editorial review complete");
    expect(html).toContain("Validation pending");
    expect(html).toContain("Independent clinical validation is pending");
    expect(html).not.toContain("Unverified");
    expect(html).not.toContain("Dr. Verified");
  });

  it("should prove regression sensitivity: legacy formatter fails, invariant formatter succeeds", () => {
    const legacyErrors: any[] = [];
    const invariantErrors: any[] = [];

    // --- Part A: Legacy Formatter Timezone Hydration Failure ---
    // 1. Force UTC formatting for the server-render phase
    Date.prototype.toLocaleDateString = function (locale, options) {
      return originalToLocaleDateString.call(this, locale, {
        ...options,
        timeZone: "UTC"
      });
    };

    const legacyHtml = ReactDOMServer.renderToString(
      <LegacyReviewedBadge reviewedDate="2026-06-30T01:00:00Z" />
    );
    container.innerHTML = legacyHtml;

    // 2. Force America/New_York formatting for the client hydration phase
    Date.prototype.toLocaleDateString = function (locale, options) {
      return originalToLocaleDateString.call(this, locale, {
        ...options,
        timeZone: "America/New_York"
      });
    };

    // 3. Hydrate legacy badge on simulated client (evaluates to "Jun 29, 2026")
    act(() => {
      const root = hydrateRoot(
        container,
        <LegacyReviewedBadge reviewedDate="2026-06-30T01:00:00Z" />,
        {
          onRecoverableError: (err: any) => {
            legacyErrors.push(err);
          }
        }
      );
      roots.push(root);
    });

    // Verify that the legacy component triggers a recoverable hydration mismatch error
    expect(legacyErrors.length).toBeGreaterThan(0);

    // Clean up roots and container for Part B
    act(() => {
      roots.forEach((r) => r.unmount());
    });
    roots = [];
    container.innerHTML = "";

    // --- Part B: Invariant Formatter Timezone Hydration Success ---
    // 1. Force UTC formatting for the server-render phase
    Date.prototype.toLocaleDateString = function (locale, options) {
      return originalToLocaleDateString.call(this, locale, {
        ...options,
        timeZone: "UTC"
      });
    };

    const badgeHtml = ReactDOMServer.renderToString(
      <LastReviewedBadge reviewedDate="2026-06-30T01:00:00Z" />
    );
    container.innerHTML = badgeHtml;

    // 2. Force America/New_York formatting for the client hydration phase
    Date.prototype.toLocaleDateString = function (locale, options) {
      return originalToLocaleDateString.call(this, locale, {
        ...options,
        timeZone: "America/New_York"
      });
    };

    // 3. Hydrate corrected badge on simulated client
    act(() => {
      const root = hydrateRoot(
        container,
        <LastReviewedBadge reviewedDate="2026-06-30T01:00:00Z" />,
        {
          onRecoverableError: (err: any) => {
            invariantErrors.push(err);
          }
        }
      );
      roots.push(root);
    });

    // Invariant formatter should yield zero hydration errors
    expect(invariantErrors).toHaveLength(0);
  });

  it("should hydrate all date components without warnings", () => {
    const components = [
      <LastReviewedBadge key="1" reviewedDate="2026-06-30T01:00:00Z" />,
      <EditorialConfidenceBadge key="2" entity={mockEntity} reviewedDate="2026-06-30T01:00:00Z" />,
      <ReviewedBy key="3" reviewer={mockReviewer} reviewedDate="2026-06-30T01:00:00Z" />,
      <TimelineHistory key="4" versionInfo={mockVersionInfo} reviewer={mockReviewer} />,
      <AICitationBlock key="5" entity={mockEntity} />
    ];

    components.forEach((component) => {
      const tempContainer = document.createElement("div");
      document.body.appendChild(tempContainer);

      // Force UTC formatting for the server-render phase
      Date.prototype.toLocaleDateString = function (locale, options) {
        return originalToLocaleDateString.call(this, locale, {
          ...options,
          timeZone: "UTC"
        });
      };

      const html = ReactDOMServer.renderToString(component);
      tempContainer.innerHTML = html;

      // Force America/New_York formatting for the client hydration phase
      Date.prototype.toLocaleDateString = function (locale, options) {
        return originalToLocaleDateString.call(this, locale, {
          ...options,
          timeZone: "America/New_York"
        });
      };

      const errors: any[] = [];
      let root: any;
      act(() => {
        root = hydrateRoot(tempContainer, component, {
          onRecoverableError: (err: any) => {
            errors.push(err);
          }
        });
      });

      // Restore
      Date.prototype.toLocaleDateString = originalToLocaleDateString;

      expect(errors).toHaveLength(0);

      // Clean up root and tempContainer
      act(() => {
        root.unmount();
      });
      document.body.removeChild(tempContainer);
    });
  });
});

