export type MiasmTypeV1 = 'psora' | 'sycosis' | 'syphilis' | 'tubercular' | 'unclassified';

export interface RubricMiasmClassificationV1 {
  readonly rubricId: string;
  readonly miasms: readonly MiasmTypeV1[];
  readonly provenance: string;
  readonly projectionVersion: '1.0.0';
  readonly reviewStatus: 'draft' | 'reviewed' | 'approved';
  readonly reviewRecordId: string;
  readonly sourceMetadata: {
    readonly referenceBook: string;
    readonly chapter?: string;
    readonly pageNumber?: number;
  };
}

// Feature flag: set to false to ship the clinical UI/features disabled by default in production
export const IS_MIASMATIC_FILTER_ENABLED = false;

// Curated projection database (approved corpus)
// Shipped completely empty in production pending clinical review reconciliation
const RubricMiasmProjectionV1: Readonly<Record<string, Readonly<RubricMiasmClassificationV1>>> = {};

// Deep freeze objects helper
function deepFreeze<T extends object>(obj: T): T {
  Object.freeze(obj);
  Object.keys(obj).forEach(key => {
    const prop = (obj as any)[key];
    if (prop !== null && typeof prop === 'object' && !Object.isFrozen(prop)) {
      deepFreeze(prop);
    }
  });
  return obj;
}

// Freeze production projection
deepFreeze(RubricMiasmProjectionV1);

// Validate a mapping record strictly
export function validateMapping(key: string, record: RubricMiasmClassificationV1): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (record.rubricId !== key) {
    errors.push(`rubricId '${record.rubricId}' does not match dictionary key '${key}'`);
  }

  if (!record.rubricId || typeof record.rubricId !== 'string' || record.rubricId.trim().length === 0) {
    errors.push('Missing or empty rubricId');
  }

  if (!record.miasms || !Array.isArray(record.miasms) || record.miasms.length === 0) {
    errors.push('miasms must be a non-empty array');
  } else {
    const validTokens = new Set(['psora', 'sycosis', 'syphilis', 'tubercular', 'unclassified']);
    const uniqueTokens = new Set<MiasmTypeV1>();

    record.miasms.forEach(m => {
      if (!validTokens.has(m)) {
        errors.push(`Invalid miasm token: ${m}`);
      }
      if (uniqueTokens.has(m)) {
        errors.push(`Duplicate miasm token: ${m}`);
      }
      uniqueTokens.add(m);
    });

    if (record.miasms.includes('unclassified') && record.miasms.length > 1) {
      errors.push('unclassified cannot be combined with other miasms');
    }
  }

  if (!record.provenance || typeof record.provenance !== 'string' || record.provenance.trim().length === 0) {
    errors.push('provenance must be a non-empty string');
  }

  if (record.projectionVersion !== '1.0.0') {
    errors.push("projectionVersion must be exactly '1.0.0'");
  }

  if (record.reviewStatus !== 'approved') {
    errors.push("reviewStatus must be exactly 'approved' in active mappings");
  }

  if (!record.reviewRecordId || !/^rev_[a-zA-Z0-9_]+$/.test(record.reviewRecordId)) {
    errors.push('reviewRecordId must match opaque format rev_[a-zA-Z0-9_]+');
  }

  if (!record.sourceMetadata) {
    errors.push('Missing sourceMetadata');
  } else {
    if (!record.sourceMetadata.referenceBook || typeof record.sourceMetadata.referenceBook !== 'string' || record.sourceMetadata.referenceBook.trim().length === 0) {
      errors.push('sourceMetadata.referenceBook must be a non-empty string');
    }
    if (record.sourceMetadata.pageNumber !== undefined) {
      if (typeof record.sourceMetadata.pageNumber !== 'number' || record.sourceMetadata.pageNumber <= 0 || !Number.isInteger(record.sourceMetadata.pageNumber)) {
        errors.push('sourceMetadata.pageNumber must be a positive integer');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Get the approved miasms for a given rubric ID safely
export function getApprovedMiasmsForRubric(rubricId: string): readonly MiasmTypeV1[] {
  const record = RubricMiasmProjectionV1[rubricId];

  // If missing, default safely to unclassified
  if (!record) {
    return ['unclassified'];
  }

  // Perform runtime validation
  const validation = validateMapping(rubricId, record);
  if (!validation.isValid) {
    // Runtime defensive handling: exclude the malformed entry, emit static warning, return unclassified
    console.warn('[MiasmProjection] Excluding malformed entry');
    return ['unclassified'];
  }

  return record.miasms;
}

// Expose the projection snapshot strictly for build-time validation tests
export function getRawProjectionForValidation(): Readonly<Record<string, Readonly<RubricMiasmClassificationV1>>> {
  return RubricMiasmProjectionV1;
}
