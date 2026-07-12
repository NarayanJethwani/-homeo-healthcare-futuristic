import {
  CursorPageRequest,
  RetrievalResult
} from "./RepertoryRetrievalRepository";
import {
  RepertoryAccessContext,
  RubricRecordId
} from "../types/repertoryTypes";
import {
  RubricRemedyGradeView,
  RubricRemedyGradeId,
  RepertoryRemedyRecord,
  RemedyRecordId
} from "../types/remedyTypes";

export interface RemedyGradeRepository {
  getRemediesForRubric(
    context: RepertoryAccessContext,
    rubricRecordId: RubricRecordId,
    page: CursorPageRequest
  ): Promise<RetrievalResult<RubricRemedyGradeView>>;

  getGradeById(
    context: RepertoryAccessContext,
    gradeId: RubricRemedyGradeId
  ): Promise<RubricRemedyGradeView | null>;

  getRemedyRecord(
    context: RepertoryAccessContext,
    remedyRecordId: RemedyRecordId
  ): Promise<RepertoryRemedyRecord | null>;
}
