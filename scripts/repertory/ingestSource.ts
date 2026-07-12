import { acquisitionRepository } from '../../src/features/repertory/repositories/AcquisitionRepository';
import { getArtifactStore } from '../../src/features/repertory/import-export/artifactStore';
import { ClarkeRepertoryParser } from '../../src/features/repertory/import-export/parserClarke';
import { IngestionPipeline } from '../../src/features/repertory/import-export/ingestionPipeline';
import { AuditActor, RepertoryExtractionRecord } from '../../src/features/repertory/types';
import * as path from 'path';
import * as fs from 'fs';

async function main() {
  const args = process.argv.slice(2);
  const sourceArgIndex = args.indexOf('--source');
  const recordArgIndex = args.indexOf('--record');

  if (sourceArgIndex === -1) {
    console.error("❌ Error: Missing --source argument");
    process.exit(1);
  }

  const sourceId = args[sourceArgIndex + 1];
  const recordId = recordArgIndex !== -1 ? args[recordArgIndex + 1] : undefined;

  if (sourceId !== 'clarke_clinical_1904') {
    console.error(`❌ Error: Ingestion not supported for source ${sourceId}`);
    process.exit(1);
  }

  const actor: AuditActor = {
    uid: "system_cli",
    role: "integrator"
  };

  // 1. Resolve acquisition record
  const records = await acquisitionRepository.getForSource(sourceId);
  const acquisitionRecord = recordId 
    ? records.find(r => r.id === recordId)
    : records.sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];

  if (!acquisitionRecord) {
    console.error(`❌ Error: No acquisition record found for source: ${sourceId}`);
    process.exit(1);
  }

  console.log(`Using Acquisition Record: ${acquisitionRecord.id} (Status: ${acquisitionRecord.acquisitionStatus})`);

  if (acquisitionRecord.acquisitionStatus !== 'checksum-verified' && acquisitionRecord.acquisitionStatus !== 'acquired') {
    console.error(`❌ Error: Acquisition status must be 'checksum-verified' or 'acquired'. Current status: ${acquisitionRecord.acquisitionStatus}`);
    process.exit(1);
  }

  // 2. Load artifact from store
  const store = getArtifactStore();
  if (!acquisitionRecord.artifactStoragePath) {
    console.error("❌ Error: Acquisition record is missing artifactStoragePath.");
    process.exit(1);
  }

  console.log(`Loading raw source artifact from: ${acquisitionRecord.artifactStoragePath}`);
  const rawBytes = await store.readSource(acquisitionRecord.artifactStoragePath);
  const rawText = rawBytes.toString('utf-8');

  // 3. Update status to in-progress
  await acquisitionRepository.recordExtractionStatus(acquisitionRecord.id, {
    extractionStatus: "in-progress",
    parserVersion: "1.0.0"
  }, actor);

  // 4. Run Parser
  console.log("Parsing document line by line...");
  const parser = new ClarkeRepertoryParser(acquisitionRecord);
  const extractionRecords = parser.parse(rawText);

  // Save the extraction records for audit
  const extractionOutPath = path.join(process.cwd(), 'data', 'repertory', 'source', `${sourceId}_extracted.json`);
  const extractionDir = path.dirname(extractionOutPath);
  if (!fs.existsSync(extractionDir)) {
    fs.mkdirSync(extractionDir, { recursive: true });
  }
  fs.writeFileSync(extractionOutPath, JSON.stringify(extractionRecords, null, 2), 'utf-8');
  console.log(`Saved ${extractionRecords.length} parser extraction lines to ${extractionOutPath}`);

  // 5. Run Parser Validation Checks
  console.log("Running parser validation checks...");
  const validationErrors: string[] = [];

  // Check required sections
  const detectedStates = new Set(extractionRecords.map(r => r.parserState));
  const missingStates = parser.profile.requiredSections.filter((s: any) => !detectedStates.has(s));
  if (missingStates.length > 0) {
    validationErrors.push(`Missing required sections: ${missingStates.join(', ')}`);
  }

  // Check minimum rubric counts
  const rubricCount = extractionRecords.filter(r => r.detectedType === 'rubric').length;
  console.log(`Detected Rubrics: ${rubricCount}`);
  if (rubricCount < 100) {
    validationErrors.push(`Parser found only ${rubricCount} rubrics. Minimum required is 100.`);
  }

  // Check average parser confidence
  const nonIgnored = extractionRecords.filter(r => r.detectedType !== 'ignored');
  const avgConfidence = nonIgnored.reduce((sum, r) => sum + r.parserConfidence, 0) / (nonIgnored.length || 1);
  console.log(`Average Parser Confidence: ${(avgConfidence * 100).toFixed(2)}%`);
  if (avgConfidence < 0.60) {
    validationErrors.push(`Average parser confidence (${(avgConfidence * 100).toFixed(2)}%) is below the minimum threshold of 60%.`);
  }

  if (validationErrors.length > 0) {
    console.error("❌ Validation Failed:");
    validationErrors.forEach(err => console.error(` - ${err}`));
    
    await acquisitionRepository.recordExtractionStatus(acquisitionRecord.id, {
      extractionStatus: "validation-failed",
      parserVersion: "1.0.0"
    }, actor);
    
    process.exit(1);
  }

  console.log("✅ Parser validation checks passed successfully.");
  await acquisitionRepository.recordExtractionStatus(acquisitionRecord.id, {
    extractionStatus: "complete",
    parserVersion: "1.0.0"
  }, actor);

  // 6. Convert extraction records to rawRubrics array for the IngestionPipeline
  console.log("Structuring extracted data for ingestion...");
  const rawRubrics: any[] = [];
  let currentChapter = "";
  let currentRubricName = "";
  let currentRubricPage = 1;
  let currentRemedies: Record<string, number> = {};

  const commitCurrentRubric = () => {
    if (currentRubricName && currentChapter) {
      const cleanedRemedies: Record<string, number> = {};
      for (const [abbr, grade] of Object.entries(currentRemedies)) {
        let cleanAbbr = abbr.trim().replace(/\.$/, '').trim();
        if (cleanAbbr) {
          cleanedRemedies[cleanAbbr] = grade;
        }
      }
      
      rawRubrics.push({
        id: `${sourceId}_rubric_${rawRubrics.length + 1}`,
        chapter: currentChapter,
        name: currentRubricName,
        page: currentRubricPage,
        remedies: cleanedRemedies
      });
    }
    currentRemedies = {};
  };

  const parseRemediesString = (text: string): Record<string, number> => {
    const list: Record<string, number> = {};
    const parts = text.split(/,\s*/);
    for (const part of parts) {
      let clean = part.trim();
      if (!clean) continue;

      let grade = 1;
      if ((clean.startsWith('_') && clean.endsWith('_')) || (clean.startsWith('*') && clean.endsWith('*'))) {
        grade = 2;
        clean = clean.substring(1, clean.length - 1);
      } else if (clean === clean.toUpperCase() && clean.length > 2) {
        grade = 3;
      }
      
      const cleanAbbr = clean.replace(/\.$/, '').trim();
      if (cleanAbbr) {
        list[cleanAbbr] = grade;
      }
    }
    return list;
  };

  for (const record of extractionRecords) {
    if (record.detectedType === 'ignored') continue;

    if (record.parserState === 'clinical') currentChapter = 'Clinical';
    else if (record.parserState === 'causation') currentChapter = 'Causation';
    else if (record.parserState === 'temperaments') currentChapter = 'Temperaments';
    else if (record.parserState === 'clinical-relationships') currentChapter = 'Clinical Relationships';
    else if (record.parserState === 'natural-relationships') currentChapter = 'Natural Relationships';

    if (record.detectedType === 'section') {
      commitCurrentRubric();
      currentRubricName = "";
    } else if (record.detectedType === 'page-anchor') {
      currentRubricPage = record.physicalPageIndex || currentRubricPage;
    } else if (record.detectedType === 'rubric') {
      commitCurrentRubric();
      currentRubricName = record.normalizedText.replace(/:$/, '').trim();
      currentRubricPage = record.physicalPageIndex || currentRubricPage;
    } else if (record.detectedType === 'subrubric') {
      commitCurrentRubric();
      currentRubricName = record.normalizedText.replace(/:$/, '').trim();
      currentRubricPage = record.physicalPageIndex || currentRubricPage;
    } else if (record.detectedType === 'remedy-continuation') {
      const parsedRem = parseRemediesString(record.normalizedText);
      Object.assign(currentRemedies, parsedRem);
    }
  }
  commitCurrentRubric();

  console.log(`Structured ${rawRubrics.length} clinical rubrics.`);

  const rawDataPath = path.join(process.cwd(), 'data', 'repertory', 'source', `${sourceId}RepertoryData.json`);
  fs.writeFileSync(rawDataPath, JSON.stringify(rawRubrics, null, 2), 'utf-8');
  console.log(`Saved structured raw rubrics to ${rawDataPath}`);

  // 7. Invoke Ingestion Pipeline
  console.log("Executing Ingestion Pipeline...");
  const manifest = await IngestionPipeline.ingestSource(sourceId, rawRubrics);

  // 8. Update status to validated
  await acquisitionRepository.recordExtractionStatus(acquisitionRecord.id, {
    extractionStatus: "validated",
    parserVersion: "1.0.0"
  }, actor);

  // 9. Export updated register
  await acquisitionRepository.exportRegister();

  console.log(`✅ Ingestion completed successfully for ${sourceId}.`);
  console.log(`Ingested ${manifest.validationSummary.totalImported} rubrics.`);
  console.log(`Unresolved Remedy Abbreviations count: ${manifest.unresolvedAbbreviationReport.length}`);
}

main().catch(err => {
  console.error("❌ Fatal Error in ingestSource script:", err);
  process.exit(1);
});
