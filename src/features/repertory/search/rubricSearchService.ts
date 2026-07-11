import { RepertorySearch } from "./repertorySearch";
import { RepertoryRubric } from "../types";
import { RubricId } from "../../../shared/domain/identifiers";

export interface RubricSearchQuery {
  queryText: string;
  category?: string;
  sourceId?: string;
}

export interface RubricSearchResult {
  rubricId: RubricId;
  title: string;
  plainLanguageMeaning: string;
  chapter: string;
  rubricPath: string[];
  sourceId: string;
  sourceName: string;
  remedyCount: number;
}

export interface RubricSearchService {
  search(query: RubricSearchQuery): Promise<RubricSearchResult[]>;
}

export class RepertoryRubricSearchAdapter implements RubricSearchService {
  async search(query: RubricSearchQuery): Promise<RubricSearchResult[]> {
    const filters: any = {};
    if (query.category) filters.category = query.category;
    if (query.sourceId) filters.sourceId = query.sourceId;

    const matches = await RepertorySearch.searchRubrics(query.queryText, filters);

    // Map result into clean domain boundaries without leaking remedy details or raw grades
    return matches.map(m => {
      const r = m.rubric;
      return {
        rubricId: r.rubricId as RubricId,
        title: r.title,
        plainLanguageMeaning: r.plainLanguageMeaning || r.classicalWording,
        chapter: r.organSystem || "General",
        rubricPath: r.hierarchyPath || [r.title],
        sourceId: r.sourceId || "pub_boericke_1927",
        sourceName: r.source || "Boericke Pocket Manual of Homeopathic Materia Medica",
        remedyCount: r.relatedRemedies ? r.relatedRemedies.length : 0
      };
    });
  }
}
export const rubricSearchService = new RepertoryRubricSearchAdapter();
