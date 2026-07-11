import {
  RepertorySource,
  RepertoryEdition,
  RepertoryChapter,
  RepertoryRubricRecord,
  RepertorySourceId,
  RepertoryEditionId,
  RepertoryChapterId,
  RubricRecordId,
  RepertoryAccessContext
} from "../types/repertoryTypes";

export type { RepertoryAccessContext, RubricRecordId };

export interface CursorPageRequest {
  limit?: number;
  position?: number | string;
}

export interface RetrievalResult<T> {
  items: T[];
  hasNextPage: boolean;
  nextPosition?: number | string;
  totalCount?: number;
  sourceVersion: string;
}

export interface RepertoryRetrievalRepository {
  getSources(context: RepertoryAccessContext): Promise<RepertorySource[]>;

  getEditions(
    context: RepertoryAccessContext,
    sourceId: RepertorySourceId
  ): Promise<RepertoryEdition[]>;

  getChapters(
    context: RepertoryAccessContext,
    editionId: RepertoryEditionId
  ): Promise<RepertoryChapter[]>;

  getRubricById(
    context: RepertoryAccessContext,
    rubricId: RubricRecordId
  ): Promise<RepertoryRubricRecord | null>;

  getRubricsByChapter(
    context: RepertoryAccessContext,
    editionId: RepertoryEditionId,
    chapterId: RepertoryChapterId,
    page: CursorPageRequest
  ): Promise<RetrievalResult<RepertoryRubricRecord>>;
}
