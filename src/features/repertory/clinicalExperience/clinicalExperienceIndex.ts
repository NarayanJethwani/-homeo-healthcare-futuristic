import { JETHWANI_CLINICAL_EXPERIENCE_REGISTRY } from './clinicalExperienceRegistry';
import { ClinicalExperienceRecord } from './types';

export class ClinicalExperienceIndex {
  private static cache: ClinicalExperienceRecord[] = Object.values(JETHWANI_CLINICAL_EXPERIENCE_REGISTRY);

  /**
   * Searches Dr. Jethwani's clinical observations by query terms.
   */
  public static searchObservations(query: string): ClinicalExperienceRecord[] {
    const term = query.toLowerCase().trim();
    if (!term) return this.cache;

    return this.cache.filter(record => 
      record.title.toLowerCase().includes(term) ||
      record.content.toLowerCase().includes(term) ||
      record.provenance.toLowerCase().includes(term) ||
      (record.remedies && record.remedies.some(r => r.toLowerCase().includes(term))) ||
      (record.rubrics && record.rubrics.some(ru => ru.toLowerCase().includes(term)))
    );
  }

  /**
   * Fetches observations that directly map to a given remedy candidate.
   */
  public static getObservationsForRemedy(remedyId: string): ClinicalExperienceRecord[] {
    const rid = remedyId.toLowerCase().trim();
    return this.cache.filter(record => 
      record.remedies && record.remedies.some(r => r.toLowerCase() === rid)
    );
  }
}
