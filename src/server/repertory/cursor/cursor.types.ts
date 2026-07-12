export type CursorPurpose = "chapter_page" | "rubric_search" | "rubric_remedies";

export interface SecureCursorPayload {
  version: 1;
  keyId: string;
  purpose: CursorPurpose;
  organizationId: string;
  accessFingerprint: string;
  sourceId?: string;
  editionId?: string;
  chapterId?: string;
  queryHash?: string;
  filterHash?: string;
  corpusVersion: string;
  searchIndexVersion?: string;
  synonymRegistryVersion?: string;
  limit: number;
  position: number | string;
  issuedAt: number;
  expiresAt: number;
}

export interface ExpectedCursorContext {
  purpose: CursorPurpose;
  organizationId: string;
  accessFingerprint: string;
  sourceId?: string;
  editionId?: string;
  chapterId?: string;
  queryHash?: string;
  filterHash?: string;
  corpusVersion: string;
  searchIndexVersion?: string;
  synonymRegistryVersion?: string;
  limit: number;
}

export interface CursorCodec {
  encode(payload: Omit<SecureCursorPayload, "version" | "keyId" | "issuedAt" | "expiresAt">): string;
  decode(cursor: string, expected: ExpectedCursorContext): SecureCursorPayload;
}
