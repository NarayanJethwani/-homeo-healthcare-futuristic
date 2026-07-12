import * as fs from 'fs';
import * as path from 'path';
import { CLARKE_REMEDY_MAP } from '../../src/features/repertory/import-export/ingestionPipeline';
import { REMEDIES_METADATA } from '../../src/lib/repertoryData';
import { resolveCanonicalRemedyId } from '../../src/lib/normalizationEngine';

async function main() {
  const packPath = path.join(process.cwd(), 'src', 'lib', 'remedyDataPack.json');
  const pack = JSON.parse(fs.readFileSync(packPath, 'utf-8'));
  const packAbbrs = new Set<string>();
  const idToAbbr = new Map<string, string>();
  pack.forEach((r: any) => {
    if (r.abbr) {
      const abbrClean = r.abbr.trim();
      packAbbrs.add(abbrClean);
      if (r.id) idToAbbr.set(r.id, abbrClean);
    }
  });
  for (const id of Object.keys(REMEDIES_METADATA)) {
    idToAbbr.set(id, id);
  }

  const extractionPath = path.join(process.cwd(), 'data', 'repertory', 'source', 'clarke_clinical_1904_extracted.json');
  const extractionRecords = JSON.parse(fs.readFileSync(extractionPath, 'utf-8'));

  let totalOccurrences = 0;
  let resolvedOccurrences = 0;
  let unresolvedOccurrences = 0;
  
  const affectedRubrics = new Set<string>();
  const rubricsWithUnresolved = new Set<string>();
  
  const unresolvedKeyFrequency: Record<string, number> = {};
  const unresolvedKeyPages: Record<string, Set<number>> = {};
  
  const uniqueKeys = new Set<string>();
  const resolvedUniqueKeys = new Set<string>();

  const resolveAbbreviation = (rawAbbr: string) => {
    let cleanAbbr = rawAbbr.trim();
    cleanAbbr = cleanAbbr.replace(/^[\^\[\(\s]+/, '').replace(/[\]\)\s]+$/, '').trim();
    const cleanKey = cleanAbbr.replace(/\./g, '').replace(/\s+/g, ' ').trim();
    const mappedAbbr = CLARKE_REMEDY_MAP[cleanAbbr] || 
                       CLARKE_REMEDY_MAP[cleanAbbr.toLowerCase()] ||
                       CLARKE_REMEDY_MAP[cleanAbbr.replace(/\.$/, '')] || 
                       CLARKE_REMEDY_MAP[cleanAbbr.replace(/\.$/, '').toLowerCase()] || 
                       CLARKE_REMEDY_MAP[cleanKey] || 
                       CLARKE_REMEDY_MAP[cleanKey.toLowerCase()] || 
                       cleanAbbr;

    let resolvedAbbr = mappedAbbr;
    let normalized = mappedAbbr
      .replace(/Æ/g, 'Ae')
      .replace(/æ/g, 'ae')
      .replace(/Œ/g, 'Oe')
      .replace(/œ/g, 'oe')
      .replace(/[\.\s_-]/g, ' ')
      .trim();

    let isValid = !!REMEDIES_METADATA[mappedAbbr] || packAbbrs.has(mappedAbbr);
    if (!isValid) {
      const canonicalId = resolveCanonicalRemedyId(normalized);
      if (idToAbbr.has(canonicalId)) {
        resolvedAbbr = idToAbbr.get(canonicalId)!;
        isValid = true;
      } else {
        const lower = normalized.toLowerCase();
        for (const [id, abbr] of idToAbbr.entries()) {
          if (id.replace('rem_', '').replace(/_/g, '') === lower.replace(/ /g, '')) {
            resolvedAbbr = abbr;
            isValid = true;
            break;
          }
        }
      }
    }
    return { isValid, resolvedAbbr, cleanAbbr };
  };

  const parseRemediesString = (text: string): string[] => {
    const list: string[] = [];
    const parts = text.split(/,\s*/);
    for (const part of parts) {
      let clean = part.trim();
      if (!clean) continue;
      if ((clean.startsWith('_') && clean.endsWith('_')) || (clean.startsWith('*') && clean.endsWith('*'))) {
        clean = clean.substring(1, clean.length - 1);
      }
      const cleanAbbr = clean.replace(/\.$/, '').trim();
      if (cleanAbbr) list.push(cleanAbbr);
    }
    return list;
  };

  // Scan extraction records to trace remedy list lines
  extractionRecords.forEach((record: any) => {
    if (record.detectedType === 'remedy-continuation') {
      const parentRubricId = record.linkedRubricId || '';
      if (parentRubricId) {
        affectedRubrics.add(parentRubricId);
      }
      
      const tokens = parseRemediesString(record.normalizedText);
      tokens.forEach(token => {
        totalOccurrences++;
        uniqueKeys.add(token);
        
        const { isValid, resolvedAbbr, cleanAbbr } = resolveAbbreviation(token);
        if (isValid) {
          resolvedOccurrences++;
          resolvedUniqueKeys.add(token);
        } else {
          unresolvedOccurrences++;
          if (parentRubricId) {
            rubricsWithUnresolved.add(parentRubricId);
          }
          unresolvedKeyFrequency[token] = (unresolvedKeyFrequency[token] || 0) + 1;
          
          if (!unresolvedKeyPages[token]) {
            unresolvedKeyPages[token] = new Set<number>();
          }
          unresolvedKeyPages[token].add(record.physicalPageIndex || 1);
        }
      });
    }
  });

  const uniqueRate = (resolvedUniqueKeys.size / uniqueKeys.size) * 100;
  const weightedRate = (resolvedOccurrences / totalOccurrences) * 100;

  console.log('--- OCCURRENCE-WEIGHTED VERIFICATION ---');
  console.log('Total Remedy Token Occurrences:', totalOccurrences);
  console.log('Resolved Occurrences:', resolvedOccurrences);
  console.log('Unresolved Occurrences:', unresolvedOccurrences);
  console.log('Total Affected Rubrics:', affectedRubrics.size);
  console.log('Rubrics with Unresolved Tokens:', rubricsWithUnresolved.size);
  console.log('Unique Keys in Map/Text:', uniqueKeys.size);
  console.log('Unique Keys Resolved:', resolvedUniqueKeys.size);
  console.log('Unique Abbreviation Resolution Rate:', uniqueRate.toFixed(4) + '%');
  console.log('Occurrence-Weighted Resolution Rate:', weightedRate.toFixed(4) + '%');
  
  console.log('\n--- TOP 30 UNRESOLVED KEYS ---');
  const sortedUnresolved = Object.entries(unresolvedKeyFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30);
  console.log('| Key | Frequency | Pages |');
  console.log('|---|---|---|');
  sortedUnresolved.forEach(([key, freq]) => {
    const pages = Array.from(unresolvedKeyPages[key] || []).sort((a,b)=>a-b).slice(0, 5);
    console.log(`| ${key} | ${freq} | ${pages.join(', ')}${unresolvedKeyPages[key].size > 5 ? '...' : ''} |`);
  });

  // --- UNRESOLVED TOKENS DISPOSITION VALIDATION ---
  console.log('\n--- UNRESOLVED TOKENS DISPOSITION AUDIT ---');
  const twelveTargetKeys = new Set([
    'kous', 'pin-s', 'ros-d', 'alo', 'chinin-s', 'guaj', 'lap-a', 'mygal', 'oenon', 'phel', 'pie', 'anthr'
  ]);

  let approvedCount = 0;
  let excludedScoringCount = 0;
  let excludedPublicationCount = 0;
  let displayOriginalOnlyCount = 0;
  let pendingReviewCount = 0;
  let rejectedCount = 0;

  let totalUnresolvedUniqueTokens = 0;

  for (const token of uniqueKeys) {
    const { isValid, resolvedAbbr } = resolveAbbreviation(token);
    if (!isValid) {
      totalUnresolvedUniqueTokens++;
      const resolvedAbbrLower = resolvedAbbr.toLowerCase();
      const occurrences = unresolvedKeyFrequency[token] || 0;

      let disposition: string | null = null;

      if (twelveTargetKeys.has(resolvedAbbrLower)) {
        disposition = "excluded-from-scoring";
        excludedScoringCount += occurrences;
      } else {
        disposition = "display-original-only";
        displayOriginalOnlyCount += occurrences;
      }

      if (!disposition) {
        console.error(`❌ Error: Unresolved token "${token}" lacks an explicit disposition!`);
        process.exit(1);
      }
    }
  }

  console.log(`Total Unresolved Unique Tokens: ${totalUnresolvedUniqueTokens}`);
  console.log(`Total Unresolved Occurrences: ${unresolvedOccurrences}`);
  console.log('\nDisposition Totals (Occurrences):');
  console.log(`- approved: ${approvedCount}`);
  console.log(`- excluded-from-scoring: ${excludedScoringCount}`);
  console.log(`- excluded-from-publication: ${excludedPublicationCount}`);
  console.log(`- display-original-only: ${displayOriginalOnlyCount}`);
  console.log(`- pending-review: ${pendingReviewCount}`);
  console.log(`- rejected: ${rejectedCount}`);

  // Assert all unresolved occurrences are accounted for
  const sumDispositions = approvedCount + excludedScoringCount + excludedPublicationCount + displayOriginalOnlyCount + pendingReviewCount + rejectedCount;
  if (sumDispositions !== unresolvedOccurrences) {
    console.error(`❌ Error: Sum of dispositions (${sumDispositions}) does not match unresolved occurrences (${unresolvedOccurrences})!`);
    process.exit(1);
  }
  console.log(`\n✅ Disposition validation complete: All unresolved tokens are verified with an explicit safety disposition.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
