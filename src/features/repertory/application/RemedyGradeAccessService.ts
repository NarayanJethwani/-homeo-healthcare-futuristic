import crypto from "crypto";
import { IRepertoryAccessPolicy } from "../access/RepertoryAccessPolicy";
import { CursorCodec, PaginatedResult } from "./cursorWrapperTypes";
import {
  RepertoryAccessContext,
  RubricRecordId,
  RepertoryEditionId,
  RepertoryEdition
} from "../types/repertoryTypes";
import {
  RubricRemedyGradeView,
  RubricRemedyGradeId,
  RepertoryRemedyRecord,
  RemedyRecordId
} from "../types/remedyTypes";
import { CursorPageRequest } from "../repositories/RepertoryRetrievalRepository";
import { RemedyGradeRepository } from "../repositories/RemedyGradeRepository";
import { PublishedCorpusRepository } from "../repositories/PublishedCorpusRepository";
import { PublishedCorpusRetrievalAdapter } from "../repositories/PublishedCorpusRetrievalAdapter";
import { generateAccessFingerprint } from "../../../server/repertory/cursor/HmacCursorCodec";

export class RemedyGradeAccessService {
  private corpusAdapter: PublishedCorpusRetrievalAdapter;

  constructor(
    private repository: RemedyGradeRepository,
    private accessPolicy: IRepertoryAccessPolicy,
    private cursorCodec: CursorCodec
  ) {
    this.corpusAdapter = new PublishedCorpusRetrievalAdapter();
  }

  private async getEditionRecord(context: RepertoryAccessContext, editionId: RepertoryEditionId): Promise<RepertoryEdition | null> {
    const sources = await this.corpusAdapter.getSources(context);
    for (const src of sources) {
      const eds = await this.corpusAdapter.getEditions(context, src.id);
      const match = eds.find(e => e.id === editionId);
      if (match) return match;
    }
    return null;
  }

  private getAccessFingerprint(context: RepertoryAccessContext, allowedEditionIds: string[]): string {
    const role = context.userRole || "clinician";
    const flags = context.activeFeatureFlags || [];
    return generateAccessFingerprint(context.organizationId || "default", allowedEditionIds, role, flags);
  }

  async getRemediesForRubric(
    context: RepertoryAccessContext,
    rubricRecordId: RubricRecordId,
    page: CursorPageRequest
  ): Promise<PaginatedResult<RubricRemedyGradeView>> {
    // 1. Load rubric to determine edition
    const rubric = await PublishedCorpusRepository.getRubricById(rubricRecordId);
    if (!rubric) {
      throw new Error("Rubric not found");
    }

    const editionId = (rubric.sourceId || "kent_1908") as RepertoryEditionId;
    const edition = await this.getEditionRecord(context, editionId);
    if (!edition) {
      throw new Error("Edition not found");
    }

    // 2. Authorization checks
    const decision = this.accessPolicy.canReadContent(context, edition);
    if (!decision.allowed) {
      throw new Error(`Access denied to edition content: ${decision.reason}`);
    }

    const version = "v1.0.0";
    const limit = page.limit || 50;
    const allowedEditionIds = [editionId];
    const accessFingerprint = this.getAccessFingerprint(context, allowedEditionIds);

    let offset = 0;
    if (page.position !== undefined) {
      const cursorStr = String(page.position);
      const decoded = this.cursorCodec.decode(cursorStr, {
        purpose: "rubric_remedies",
        organizationId: context.organizationId || "default",
        accessFingerprint,
        editionId,
        corpusVersion: version,
        limit
      });
      offset = typeof decoded.position === "number" ? decoded.position : parseInt(decoded.position, 10);
    }

    // 3. Load remedy grades
    const result = await this.repository.getRemediesForRubric(context, rubricRecordId, {
      limit,
      position: offset
    });

    let nextCursor: string | undefined;
    if (result.hasNextPage && result.nextPosition !== undefined) {
      nextCursor = this.cursorCodec.encode({
        purpose: "rubric_remedies",
        organizationId: context.organizationId || "default",
        accessFingerprint,
        editionId,
        corpusVersion: version,
        limit,
        position: result.nextPosition
      });
    }

    return {
      items: result.items,
      hasNextPage: result.hasNextPage,
      nextCursor,
      totalCount: result.totalCount,
      sourceVersion: result.sourceVersion
    };
  }

  async getGradeById(
    context: RepertoryAccessContext,
    gradeId: RubricRemedyGradeId
  ): Promise<RubricRemedyGradeView | null> {
    const view = await this.repository.getGradeById(context, gradeId);
    if (!view) return null;

    const edition = await this.getEditionRecord(context, view.grade.sourceProvenance.editionId);
    if (!edition) return null;

    const decision = this.accessPolicy.canReadContent(context, edition);
    if (!decision.allowed) {
      throw new Error(`Access denied: ${decision.reason}`);
    }

    return view;
  }

  async getRemedyRecord(
    context: RepertoryAccessContext,
    remedyRecordId: RemedyRecordId
  ): Promise<RepertoryRemedyRecord | null> {
    const record = await this.repository.getRemedyRecord(context, remedyRecordId);
    if (!record) return null;

    if (!record.editionId) return null;
    const edition = await this.getEditionRecord(context, record.editionId);
    if (!edition) return null;

    const decision = this.accessPolicy.canReadContent(context, edition);
    if (!decision.allowed) {
      throw new Error(`Access denied: ${decision.reason}`);
    }

    return record;
  }
}

import { PublishedRemedyGradeAdapter } from "../repositories/PublishedRemedyGradeAdapter";
import { RepertoryAccessPolicy } from "../access/RepertoryAccessPolicy";
import { HmacCursorCodec } from "../../../server/repertory/cursor/HmacCursorCodec";

let serviceInstance: RemedyGradeAccessService | null = null;

export function getRemedyGradeAccessService(): RemedyGradeAccessService {
  if (!serviceInstance) {
    const repository = new PublishedRemedyGradeAdapter();
    const accessPolicy = new RepertoryAccessPolicy();
    const cursorCodec = new HmacCursorCodec();

    serviceInstance = new RemedyGradeAccessService(repository, accessPolicy, cursorCodec);
  }
  return serviceInstance;
}
