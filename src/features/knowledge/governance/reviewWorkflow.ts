import { EditorialStatus } from "../types";

export interface WorkflowTransition {
  from: EditorialStatus;
  to: EditorialStatus;
  allowedRoles: string[];
  requiresDualSignoff: boolean;
}

export const REVIEW_WORKFLOW = {
  states: {
    draft: "Initial drafting by qualified content writer or medical student.",
    "medical-review": "Clinical audit of symptoms, remedy references, and warnings by a physician.",
    "legal-review": "Secondary review to confirm safety language and check prohibited-claims constraints.",
    published: "Rendered publicly on the website and indexable by search engines.",
    archived: "Deprioritized or deprecated content, hidden from search indexes.",
  },
  transitions: [
    {
      from: "draft",
      to: "medical-review",
      allowedRoles: ["author"],
      requiresDualSignoff: false,
    },
    {
      from: "medical-review",
      to: "legal-review",
      allowedRoles: ["reviewer"],
      requiresDualSignoff: true,
    },
    {
      from: "legal-review",
      to: "published",
      allowedRoles: ["reviewer"],
      requiresDualSignoff: true,
    },
    {
      from: "published",
      to: "archived",
      allowedRoles: ["reviewer"],
      requiresDualSignoff: false,
    },
    {
      from: "published",
      to: "draft",
      allowedRoles: ["reviewer", "author"],
      requiresDualSignoff: false,
    },
  ] as WorkflowTransition[],
};
