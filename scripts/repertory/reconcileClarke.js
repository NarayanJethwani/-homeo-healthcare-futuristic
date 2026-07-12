/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Load dynamic data
const rawText = fs.readFileSync('data/repertory/source/aclinicalrepert00clargoog_djvu.txt', 'utf-8');
const lines = rawText.split(/\r?\n/);

const CLARKE_PARSER_PROFILE = {
  pageAnchor: /^Page\s+(\d+)/,
  headerTitle: /^CLINICAL\s+REPERTORY|^REPERTORY\s+OF|^CLARKE'S\s+REPERTORY/,
  footerNum: /^\d+$/,
  blankLine: /^\s*$/,
  divider: /^[-_=\* \t]{5,}$/,
  
  sectionClinical: /^\s*\[The name of/,
  sectionCausation: /^PART II\.?\s*$|^PART IL\.?\s*$/,
  sectionTemperaments: /^PART III\.?\s*$/,
  sectionRelationships: /^PART IV\.?\s*$/,
  sectionNatural: /^PART V\.?\s*$/,
  sectionIndex: /^INDEX OF CLINICAL REPERTORY\s*$/,
  
  mainRubric: /^[A-Z][A-Z\s,\-\(\)\?\/\:\.]+$/,
  subRubricBullet: /^\s+-\s*(.+)/,
  subRubricDoubleBullet: /^\s+--\s*(.+)/,
  subRubricIndent: /^\s{2,}([a-z].+)/,
  remedyList: /^\s{2,}([a-z]{3,4}(?:,\s*[a-z]{3,4})*\.?)$/
};

// Line classification totals
let blankLines = 0;
let frontMatter = 0;
let sectionHeadings = 0;
let rubricsCount = 0;
let subRubricsCount = 0;
let remedyListLines = 0;
let crossReferences = 0;
let pageAnchors = 0;
let headers = 0;
let footers = 0;
let indexContent = 0;
let ignoredLines = 0;
let unresolvedLines = 0;

let currentState = 'front-matter';
const classificationList = [];

lines.forEach((line, index) => {
  const lineNum = index + 1;
  const trimmed = line.trim();
  let classification = '';

  // Blank lines
  if (CLARKE_PARSER_PROFILE.blankLine.test(line)) {
    blankLines++;
    classification = 'Blank lines';
  }
  // Page anchors
  else if (CLARKE_PARSER_PROFILE.pageAnchor.test(line)) {
    pageAnchors++;
    classification = 'Page anchors';
  }
  // Dividers
  else if (CLARKE_PARSER_PROFILE.divider.test(line)) {
    ignoredLines++;
    classification = 'Allowlisted ignored lines';
  }
  // Headers
  else if (CLARKE_PARSER_PROFILE.headerTitle.test(line)) {
    headers++;
    classification = 'Headers';
  }
  // Footers
  else if (CLARKE_PARSER_PROFILE.footerNum.test(line)) {
    footers++;
    classification = 'Footers';
  }
  // State changes based on section headings
  else if (CLARKE_PARSER_PROFILE.sectionClinical.test(line)) {
    currentState = 'clinical';
    sectionHeadings++;
    classification = 'Section headings';
  }
  else if (CLARKE_PARSER_PROFILE.sectionCausation.test(line)) {
    currentState = 'causation';
    sectionHeadings++;
    classification = 'Section headings';
  }
  else if (CLARKE_PARSER_PROFILE.sectionTemperaments.test(line)) {
    currentState = 'temperaments';
    sectionHeadings++;
    classification = 'Section headings';
  }
  else if (CLARKE_PARSER_PROFILE.sectionRelationships.test(line)) {
    currentState = 'relationships';
    sectionHeadings++;
    classification = 'Section headings';
  }
  else if (CLARKE_PARSER_PROFILE.sectionNatural.test(line)) {
    currentState = 'natural';
    sectionHeadings++;
    classification = 'Section headings';
  }
  else if (CLARKE_PARSER_PROFILE.sectionIndex.test(line)) {
    currentState = 'index';
    sectionHeadings++;
    classification = 'Section headings';
  }
  // Processing depending on state
  else if (currentState === 'front-matter') {
    frontMatter++;
    classification = 'Front matter';
  }
  else if (currentState === 'index') {
    indexContent++;
    classification = 'Index or appendix content';
  }
  else {
    // Rubrics
    if (CLARKE_PARSER_PROFILE.mainRubric.test(trimmed)) {
      rubricsCount++;
      classification = 'Rubrics';
    }
    // Sub-rubrics
    else if (CLARKE_PARSER_PROFILE.subRubricBullet.test(line) || CLARKE_PARSER_PROFILE.subRubricDoubleBullet.test(line) || CLARKE_PARSER_PROFILE.subRubricIndent.test(line)) {
      subRubricsCount++;
      classification = 'Sub-rubrics';
    }
    // Remedy lists
    else if (CLARKE_PARSER_PROFILE.remedyList.test(line)) {
      remedyListLines++;
      classification = 'Remedy continuation lines';
    }
    // Cross-references
    else if (line.includes('See also') || line.includes('See ')) {
      crossReferences++;
      classification = 'Cross-references';
    }
    // Unresolved
    else {
      unresolvedLines++;
      classification = 'Unresolved lines';
    }
  }

  classificationList.push({ lineNum, text: line, classification });
});

const totalSum = blankLines + frontMatter + sectionHeadings + rubricsCount + subRubricsCount + remedyListLines + crossReferences + pageAnchors + headers + footers + indexContent + ignoredLines + unresolvedLines;

console.log('--- LINE ACCOUNTING RESULTS ---');
console.log('Blank lines:', blankLines);
console.log('Front matter:', frontMatter);
console.log('Section headings:', sectionHeadings);
console.log('Rubrics:', rubricsCount);
console.log('Sub-rubrics:', subRubricsCount);
console.log('Remedy continuation lines:', remedyListLines);
console.log('Cross-references:', crossReferences);
console.log('Page anchors:', pageAnchors);
console.log('Headers:', headers);
console.log('Footers:', footers);
console.log('Index or appendix content:', indexContent);
console.log('Allowlisted ignored lines:', ignoredLines);
console.log('Unresolved lines:', unresolvedLines);
console.log('Total Summed:', totalSum);
console.log('Raw File lines:', lines.length);

// Page reconciliation
const pageAnchorsFound = [];
lines.forEach((line, idx) => {
  const m = line.match(/^Page\s+(\d+)/);
  if (m) {
    pageAnchorsFound.push({ physicalLine: idx + 1, pageNum: parseInt(m[1]) });
  }
});
console.log('\n--- PAGE RECONCILIATION ---');
console.log('Total page anchors found:', pageAnchorsFound.length);
console.log('Printed page range:', pageAnchorsFound.length > 0 ? `${pageAnchorsFound[0].pageNum} to ${pageAnchorsFound[pageAnchorsFound.length - 1].pageNum}` : 'N/A');

// Save result to temp json for documentation writing
const stats = {
  blankLines,
  frontMatter,
  sectionHeadings,
  rubricsCount,
  subRubricsCount,
  remedyListLines,
  crossReferences,
  pageAnchors,
  headers,
  footers,
  indexContent,
  ignoredLines,
  unresolvedLines,
  totalSum,
  pageAnchorsCount: pageAnchorsFound.length,
  printedPageStart: pageAnchorsFound.length > 0 ? pageAnchorsFound[0].pageNum : 0,
  printedPageEnd: pageAnchorsFound.length > 0 ? pageAnchorsFound[pageAnchorsFound.length - 1].pageNum : 0
};
fs.writeFileSync('data/repertory/reports/clarke-reconciliation-stats.json', JSON.stringify(stats, null, 2));
