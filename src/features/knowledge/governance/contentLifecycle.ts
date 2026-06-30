export const CONTENT_LIFECYCLE = {
  defaultReviewIntervalDays: 365, // Annual review target
  revalidationTriggers: [
    "Changes in conventional medical guidelines",
    "New high-quality homeopathic clinical research or trials",
    "Editorial corrections or user-reported feedback",
  ],
  retirementPolicy: {
    criteria: [
      "Obsolete clinical classification",
      "Redundant descriptions merged into higher-level pages",
      "Safety warnings that render the current guide unsafe or misleading",
    ],
    action: "Archived. URL remains valid but serves a 'noindex' instruction and redirects or provides links to replacementEntityId.",
  },
};
