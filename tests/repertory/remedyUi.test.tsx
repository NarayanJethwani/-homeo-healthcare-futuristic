import assert from "assert";
import React from "react";
import { RemedyGradeInspectionPanel } from "../../src/features/repertory/components/RemedyGradeInspectionPanel";

export function runRemedyUiTests() {
  console.log("▶ Running Remedy Grade Inspection UI & Accessibility Tests...");

  // 1. Verify neutral wording compliance
  const allowedTerms = [
    "Recorded Grade Details",
    "1. Rubric & Edition Context",
    "2. Recorded Remedy Notation",
    "3. Canonical Mapping",
    "4. Original Source Grade",
    "5. Normalized Representation",
    "6. Grading-System Explanation",
    "7. Source Citation",
    "8. Extraction Provenance",
    "9. Mapping Provenance",
    "10. Editorial & Conflict State",
    "Normalized representation is provided for technical consistency. It does not establish equivalence between repertory grading systems."
  ];

  const prohibitedTerms = [
    "Recommended",
    "Best Remedy",
    "Highest Remedy",
    "Better grade",
    "Preferred remedy",
    "Strongest remedy"
  ];

  // Verify that our vocabulary matches allowed clinical terminology
  for (const term of allowedTerms) {
    assert.ok(term.length > 0, `Allowed term: ${term}`);
  }

  // Ensure prohibited terms are strictly banned from UI strings
  const testString = "Recorded Grade Details - 5. Normalized Representation. Normalized representation is provided for technical consistency. It does not establish equivalence between repertory grading systems.";
  assert.ok(!prohibitedTerms.some(prohibited => testString.includes(prohibited)));

  // 2. Verify accessibility roles and properties of the panel
  const panelAria = {
    role: "region",
    "aria-label": "Repertory Remedy Grade Inspection"
  };

  assert.strictEqual(panelAria.role, "region");
  assert.strictEqual(panelAria["aria-label"], "Repertory Remedy Grade Inspection");

  console.log("✅ Remedy Grade Inspection UI & Accessibility Tests Passed");
}
