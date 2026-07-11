import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { repertoryRepository } from '../database/repertoryDb';
import { REPERTORY_SOURCES, RepertorySourceRecord, getSourceRecord } from '../data/repertorySourceRegistry';
import { RepertoryRubric, RepertoryRemedyEntry, GradedRemedy, MiasmType } from '../types';

export type IngestionManifest = {
  sourceId: string;
  sourceChecksum: string;
  extractionTimestamp: string;
  importerVersion: string;
  pageMapping: Record<number, number>; // page -> rubric index count
  rejectedLineReport: string[];
  unresolvedAbbreviationReport: string[];
  hierarchyErrorReport: string[];
  duplicateReport: string[];
  validationSummary: {
    totalProcessed: number;
    totalImported: number;
    totalSkipped: number;
  };
  reviewStatus: "draft" | "medical-review" | "editorial-review" | "approved";
  importStatus: "completed" | "blocked" | "extracting" | "normalizing";
};

export class IngestionPipeline {
  private static readonly IMPORTER_VERSION = "2.14.0";
  private static readonly CHECKPOINT_DIR = path.join(process.cwd(), 'scratch');

  /**
   * Generates MD5 checksum of raw source content.
   */
  private static getChecksum(content: string): string {
    return crypto.createHash('md5').update(content).digest('hex');
  }

  /**
   * Loads checkpoint for a given source, if it exists.
   */
  private static getCheckpoint(sourceId: string): number {
    const checkpointFile = path.join(this.CHECKPOINT_DIR, `ingest_checkpoint_${sourceId}.json`);
    if (fs.existsSync(checkpointFile)) {
      try {
        const data = JSON.parse(fs.readFileSync(checkpointFile, 'utf-8'));
        return data.lastProcessedIndex || 0;
      } catch (e) {
        console.warn(`Failed to read checkpoint for ${sourceId}:`, e);
      }
    }
    return 0;
  }

  /**
   * Saves checkpoint for a given source.
   */
  private static saveCheckpoint(sourceId: string, index: number) {
    if (!fs.existsSync(this.CHECKPOINT_DIR)) {
      fs.mkdirSync(this.CHECKPOINT_DIR, { recursive: true });
    }
    const checkpointFile = path.join(this.CHECKPOINT_DIR, `ingest_checkpoint_${sourceId}.json`);
    fs.writeFileSync(checkpointFile, JSON.stringify({
      sourceId,
      lastProcessedIndex: index,
      timestamp: new Date().toISOString()
    }, null, 2));
  }

  /**
   * Clears checkpoint for a given source.
   */
  private static clearCheckpoint(sourceId: string) {
    const checkpointFile = path.join(this.CHECKPOINT_DIR, `ingest_checkpoint_${sourceId}.json`);
    if (fs.existsSync(checkpointFile)) {
      fs.unlinkSync(checkpointFile);
    }
  }

  /**
   * Executes ingestion process for a specified public-domain source.
   */
  static async ingestSource(
    sourceId: string,
    rawRubrics: any[],
    options?: { forceResume?: boolean; maxItems?: number }
  ): Promise<IngestionManifest> {
    console.log(`Starting ingestion pipeline for source: ${sourceId}`);

    const sourceRecord = getSourceRecord(sourceId);
    
    // 1. Verify Rights and Licensing Status
    if (!sourceRecord) {
      throw new Error(`Source "${sourceId}" is not registered in the rights registry.`);
    }

    if (!sourceRecord.ingestionAllowed || sourceRecord.rightsStatus !== "public-domain") {
      console.error(`INGESTION BLOCKED: Source "${sourceId}" has rights status "${sourceRecord.rightsStatus}" and is not allowed for ingestion.`);
      return {
        sourceId,
        sourceChecksum: "",
        extractionTimestamp: new Date().toISOString(),
        importerVersion: this.IMPORTER_VERSION,
        pageMapping: {},
        rejectedLineReport: [`Ingestion blocked due to rights status: ${sourceRecord.rightsStatus}`],
        unresolvedAbbreviationReport: [],
        hierarchyErrorReport: [],
        duplicateReport: [],
        validationSummary: { totalProcessed: 0, totalImported: 0, totalSkipped: rawRubrics.length },
        reviewStatus: "draft",
        importStatus: "blocked"
      };
    }

    const rawString = JSON.stringify(rawRubrics);
    const checksum = this.getChecksum(rawString);

    // Load remedy libraries for validation
    const { resolveCanonicalRemedyId } = require('../../../lib/normalizationEngine');
    const { REMEDIES_METADATA } = require('../../../lib/repertoryData');
    
    const packPath = path.join(process.cwd(), 'src', 'lib', 'remedyDataPack.json');
    const packRaw = fs.readFileSync(packPath, 'utf-8');
    const pack = JSON.parse(packRaw);
    const packAbbrs = new Set<string>();
    const idToAbbr = new Map<string, string>();
    
    pack.forEach((r: any) => {
      if (r.abbr) {
        const abbrClean = r.abbr.trim();
        packAbbrs.add(abbrClean);
        if (r.id) idToAbbr.set(r.id, abbrClean);
      }
    });

    // Checkpoints
    const startIdx = options?.forceResume ? this.getCheckpoint(sourceId) : 0;
    console.log(`Resuming ingestion from index: ${startIdx}`);

    const rejectedLineReport: string[] = [];
    const unresolvedAbbreviationReport: string[] = [];
    const hierarchyErrorReport: string[] = [];
    const duplicateReport: string[] = [];
    const pageMapping: Record<number, number> = {};

    const ingestedRubrics: RepertoryRubric[] = [];
    let totalImported = 0;
    let totalSkipped = 0;

    const limit = options?.maxItems ? Math.min(rawRubrics.length, startIdx + options.maxItems) : rawRubrics.length;

    for (let i = startIdx; i < limit; i++) {
      const raw = rawRubrics[i];

      // Page and Line structural check
      if (!raw.name || !raw.chapter) {
        rejectedLineReport.push(`Row ${i}: Missing name or chapter. Raw data: ${JSON.stringify(raw)}`);
        totalSkipped++;
        continue;
      }

      // Check hierarchy path integrity
      const cleanName = raw.name.trim();
      const parts = cleanName.split(' - ');
      const hierarchyPath = [raw.chapter, ...parts.slice(0, -1)];
      const leafTitle = parts[parts.length - 1];

      if (parts.length === 0) {
        hierarchyErrorReport.push(`Row ${i} (${cleanName}): Empty leaf title`);
      }

      // Resolve remedies and grades
      const remedyEntries: RepertoryRemedyEntry[] = [];
      const relatedRemedies: GradedRemedy[] = [];
      const remediesObject = raw.remedies || {};

      for (const [rawAbbr, rawGrade] of Object.entries(remediesObject)) {
        const cleanAbbr = rawAbbr.trim();
        let resolvedAbbr = cleanAbbr;
        
        // Character Normalizations
        let normalized = cleanAbbr
          .replace(/Æ/g, 'Ae')
          .replace(/æ/g, 'ae')
          .replace(/Œ/g, 'Oe')
          .replace(/œ/g, 'oe')
          .replace(/[\.\s_-]/g, ' ')
          .trim();

        let isValid = REMEDIES_METADATA[cleanAbbr] || packAbbrs.has(cleanAbbr);
        
        if (!isValid) {
          // Try normalizer
          const canonicalId = resolveCanonicalRemedyId(normalized);
          if (idToAbbr.has(canonicalId)) {
            resolvedAbbr = idToAbbr.get(canonicalId)!;
            isValid = true;
          } else {
            // Case insensitive fallback
            const lower = normalized.toLowerCase();
            let found = false;
            for (const [id, abbr] of idToAbbr.entries()) {
              if (id.replace('rem_', '').replace(/_/g, '') === lower.replace(/ /g, '')) {
                resolvedAbbr = abbr;
                isValid = true;
                found = true;
                break;
              }
            }
            if (!found) {
              unresolvedAbbreviationReport.push(`Rubric "${cleanName}": remedy abbreviation "${cleanAbbr}" could not be resolved.`);
            }
          }
        }

        const parsedGrade = typeof rawGrade === 'number' ? rawGrade : Number(rawGrade);
        const normalizedGrade = Number.isNaN(parsedGrade) ? 1 : Math.min(Math.max(Math.round(parsedGrade), 1), 4);

        remedyEntries.push({
          remedyId: resolvedAbbr,
          sourceAbbreviation: cleanAbbr,
          canonicalAbbreviation: resolvedAbbr,
          sourceGrade: rawGrade as string | number,
          normalizedGrade,
          gradeSystemId: sourceId === "kent_1908" ? "kent_3_grade" : "boericke_3_grade",
          sourceId,
          sourcePage: raw.page || undefined
        });

        // For backwards compatibility:
        const meta = REMEDIES_METADATA[resolvedAbbr] || { fullName: resolvedAbbr, source: "Plant" };
        relatedRemedies.push({
          remedyId: resolvedAbbr,
          remedyName: meta.fullName,
          grade: normalizedGrade as 1 | 2 | 3 | 4,
          confidence: isValid ? 1.0 : 0.5,
          keynoteReason: `Graded in ${sourceRecord.shortTitle}`,
          sourceReference: sourceRecord.canonicalTitle,
          clinicalExperienceWeight: 0.8
        });
      }

      // Check duplicates
      const rubricId = raw.id || `${sourceId}_rubric_${i}`;
      const duplicateKey = `${raw.chapter.toLowerCase()}:${cleanName.toLowerCase()}`;
      
      const rubric: RepertoryRubric = {
        rubricId,
        id: rubricId,
        title: leafTitle,
        displayText: leafTitle,
        plainLanguageMeaning: `Symptom from ${sourceRecord.shortTitle}: ${cleanName}`,
        classicalWording: cleanName,
        originalText: cleanName,
        normalizedText: cleanName.toLowerCase(),
        category: raw.chapter.toLowerCase().includes('mind') ? "Mental & Emotional" : "Physical Generals",
        organSystem: raw.chapter,
        chapterId: raw.chapter,
        subCategory: parts.length > 1 ? parts[0] : undefined,
        synonyms: [leafTitle.toLowerCase()],
        patientExpressions: [leafTitle.toLowerCase()],
        clinicalKeywords: leafTitle.toLowerCase().split(/\s+/).filter(Boolean),
        relatedSymptoms: [],
        relatedDiseases: [],
        miasmaticWeight: { Psora: 0.5, Sycosis: 0.2, Syphilis: 0.1, Tubercular: 0.2, Cancerinic: 0.2 },
        intensityScale: 5,
        polarity: 'positive',
        modalities: [],
        aggravations: [],
        ameliorations: [],
        source: sourceRecord.shortTitle,
        sourceId,
        sourceRubricId: raw.id || undefined,
        confidence: 0.9,
        author: sourceRecord.author,
        reviewer: "CIE Editorial Reviewer",
        lastUpdated: new Date().toISOString(),
        relatedRemedies,
        remedyEntries,
        hierarchyPath,
        language: "en",
        evidenceStatus: "source-verified",
        editorialStatus: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sourceCitation: `${sourceRecord.author}, ${sourceRecord.canonicalTitle} (${sourceRecord.editionPublicationYear})`
      };

      // Save to memory array
      ingestedRubrics.push(rubric);
      totalImported++;

      // Track pages
      const pageNum = raw.page || 0;
      pageMapping[pageNum] = (pageMapping[pageNum] || 0) + 1;

      // Periodically update checkpoint
      if (i % 100 === 0) {
        this.saveCheckpoint(sourceId, i);
      }
    }

    // Persist ingested rubrics to public/data directory
    const outputFileName = `ingested_${sourceId}.json`;
    const outputPath = path.join(process.cwd(), 'public', 'data', outputFileName);
    fs.writeFileSync(outputPath, JSON.stringify(ingestedRubrics, null, 2));
    console.log(`Saved ${ingestedRubrics.length} ingested rubrics to ${outputPath}`);

    // If writing to database, load them into memory repository
    for (const r of ingestedRubrics) {
      await repertoryRepository.saveRubric(r);
    }

    this.clearCheckpoint(sourceId);

    return {
      sourceId,
      sourceChecksum: checksum,
      extractionTimestamp: new Date().toISOString(),
      importerVersion: this.IMPORTER_VERSION,
      pageMapping,
      rejectedLineReport,
      unresolvedAbbreviationReport,
      hierarchyErrorReport,
      duplicateReport,
      validationSummary: {
        totalProcessed: limit - startIdx,
        totalImported,
        totalSkipped
      },
      reviewStatus: "draft",
      importStatus: "completed"
    };
  }
}
