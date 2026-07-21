import type {
  EntityType,
  EvidenceLevel,
  KnowledgeEntity,
  LocalizedString,
} from "@/features/knowledge/types";

export const PUBLIC_KNOWLEDGE_ENTITY_KEYS = [
  "id",
  "slug",
  "entityType",
  "editorialStatus",
  "title",
  "summary",
  "canonicalUrl",
  "audience",
  "license",
  "evidenceLevel",
  "tags",
  "readingTimeMinutes",
] as const;

export const PUBLIC_LOCALIZED_STRING_KEYS = [
  "en",
  "hi",
  "gu",
  "mr",
  "es",
  "ar",
] as const;

export interface PublicKnowledgeEntityDTO {
  readonly id: string;
  readonly slug: string;
  readonly entityType: EntityType;
  readonly editorialStatus: "published";
  readonly title: Readonly<LocalizedString>;
  readonly summary: Readonly<LocalizedString>;
  readonly canonicalUrl: string;
  readonly audience: KnowledgeEntity["audience"];
  readonly license: string;
  readonly evidenceLevel: EvidenceLevel;
  readonly tags: readonly string[];
  readonly readingTimeMinutes: number;
}

function serializeLocalizedString(value: LocalizedString): LocalizedString {
  return {
    en: value.en,
    hi: value.hi,
    gu: value.gu,
    mr: value.mr,
    es: value.es,
    ar: value.ar,
  };
}

export function serializePublicKnowledgeEntity(
  entity: KnowledgeEntity,
): PublicKnowledgeEntityDTO | null {
  if (entity.editorialStatus !== "published") {
    return null;
  }

  return {
    id: entity.id,
    slug: entity.slug,
    entityType: entity.entityType,
    editorialStatus: "published",
    title: serializeLocalizedString(entity.title),
    summary: serializeLocalizedString(entity.summary),
    canonicalUrl: entity.canonicalUrl,
    audience: entity.audience,
    license: entity.license,
    evidenceLevel: entity.evidenceLevel,
    tags: [...entity.tags],
    readingTimeMinutes: entity.readingTimeMinutes,
  };
}

export function serializePublishedKnowledgeEntities(
  entities: readonly KnowledgeEntity[],
): PublicKnowledgeEntityDTO[] {
  return entities.flatMap((entity) => {
    const serialized = serializePublicKnowledgeEntity(entity);
    return serialized ? [serialized] : [];
  });
}
