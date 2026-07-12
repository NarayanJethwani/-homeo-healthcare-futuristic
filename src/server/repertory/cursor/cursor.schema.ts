import { z } from "zod";

export const secureCursorPayloadSchema = z.object({
  version: z.literal(1),
  keyId: z.string(),
  purpose: z.enum(["chapter_page", "rubric_search", "rubric_remedies"]),
  organizationId: z.string(),
  accessFingerprint: z.string(),
  sourceId: z.string().optional(),
  editionId: z.string().optional(),
  chapterId: z.string().optional(),
  queryHash: z.string().optional(),
  filterHash: z.string().optional(),
  corpusVersion: z.string(),
  searchIndexVersion: z.string().optional(),
  synonymRegistryVersion: z.string().optional(),
  limit: z.number().int().positive(),
  position: z.union([z.number().int().nonnegative(), z.string()]),
  issuedAt: z.number().int().positive(),
  expiresAt: z.number().int().positive()
}).strict(); // Reject unknown fields
