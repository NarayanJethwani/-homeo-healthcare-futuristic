import fs from 'fs';
import path from 'path';
import { RepertoryRepository } from './RepertoryRepository';
import { RepertoryRubric, GraphTriple, MiasmType } from '../types';
import { SEED_RUBRICS, SEED_TRIPLES } from '../data/repertorySeed';

export class MemoryRepertoryRepository implements RepertoryRepository {
  private rubrics: Map<string, RepertoryRubric> = new Map();
  private triples: GraphTriple[] = [];

  constructor() {
    // Seed the database in memory
    SEED_RUBRICS.forEach(r => this.rubrics.set(r.rubricId, { ...r }));
    this.triples = [...SEED_TRIPLES];

    // Load any dynamically ingested public-domain sources
    try {
      const publicDataDir = path.join(process.cwd(), 'public', 'data');
      if (fs.existsSync(publicDataDir)) {
        const files = fs.readdirSync(publicDataDir);
        files.forEach(file => {
          if (file.startsWith('ingested_') && file.endsWith('.json')) {
            const filePath = path.join(publicDataDir, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const rubrics: RepertoryRubric[] = JSON.parse(content);
            rubrics.forEach(r => {
              this.rubrics.set(r.rubricId, { ...r });
              // Dynamically build graph triples for remedy entries
              if (r.relatedRemedies) {
                r.relatedRemedies.forEach(rem => {
                  this.triples.push({
                    subjectId: r.rubricId,
                    predicate: `hasRemedyGrade${rem.grade}` as any,
                    objectId: rem.remedyId
                  });
                });
              }
            });
            console.log(`MemoryRepertoryRepository: Loaded ${rubrics.length} ingested rubrics from ${file}`);
          }
        });
      }
    } catch (e) {
      console.warn("MemoryRepertoryRepository: Failed to load ingested files:", e);
    }
  }

  getRubricsSync(): RepertoryRubric[] {
    return Array.from(this.rubrics.values());
  }

  async getRubrics(filters?: {
    category?: string;
    organSystem?: string;
    miasm?: string;
    remedy?: string;
  }): Promise<RepertoryRubric[]> {
    let result = Array.from(this.rubrics.values());

    if (filters) {
      if (filters.category && filters.category !== 'All') {
        result = result.filter(r => r.category === filters.category);
      }
      if (filters.organSystem && filters.organSystem !== 'All') {
        result = result.filter(r => r.organSystem === filters.organSystem);
      }
      if (filters.miasm && filters.miasm !== 'All') {
        result = result.filter(r => {
          const w = r.miasmaticWeight[filters.miasm as MiasmType];
          return w !== undefined && w > 0.0;
        });
      }
      if (filters.remedy && filters.remedy !== 'All') {
        result = result.filter(r => 
          r.relatedRemedies.some(rem => rem.remedyId.toLowerCase() === filters.remedy!.toLowerCase())
        );
      }
    }

    return result;
  }

  async getRubricById(id: string): Promise<RepertoryRubric | null> {
    const r = this.rubrics.get(id);
    return r ? { ...r } : null;
  }

  async saveRubric(rubric: RepertoryRubric): Promise<RepertoryRubric> {
    this.rubrics.set(rubric.rubricId, { ...rubric });
    return { ...rubric };
  }

  async deleteRubric(id: string): Promise<boolean> {
    return this.rubrics.delete(id);
  }

  async getTriples(): Promise<GraphTriple[]> {
    return [...this.triples];
  }

  async saveTriple(triple: GraphTriple): Promise<void> {
    // Remove if already exists to prevent duplicate triples
    await this.deleteTriple(triple.subjectId, triple.predicate, triple.objectId);
    this.triples.push({ ...triple });
  }

  async deleteTriple(subjectId: string, predicate: string, objectId: string): Promise<boolean> {
    const initialLen = this.triples.length;
    this.triples = this.triples.filter(
      t => !(t.subjectId === subjectId && t.predicate === predicate && t.objectId === objectId)
    );
    return this.triples.length < initialLen;
  }
}
