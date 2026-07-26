import fs from "node:fs";
import path from "node:path";

const primaryPath = process.argv[2]
  || path.join(process.cwd(), "public", "data", "boenninghausenTherapeuticPocketBookData.json");
const alternatePath = process.argv[3];
const primary = JSON.parse(fs.readFileSync(primaryPath, "utf8"));
const alternate = alternatePath ? JSON.parse(fs.readFileSync(alternatePath, "utf8")) : [];

const artifactPattern = /[<>\\§£©€■•]|\d{2,}|(?:\w[*^]\w)|\b(?:tlie|tfhc|ni£ht|Duriag|ltic|witBi|siSent|llae|saaaa|Hie)\b/i;
const qualityPenalty = (value) => {
  const exotic = (value.match(/[^A-Za-z0-9 .,;:!?()'"*†\-–—/&]/g) || []).length;
  const mixed = (value.match(/[A-Za-z][<>\\§£©€■•^]|[<>\\§£©€■•^][A-Za-z]/g) || []).length;
  const digitNoise = (value.match(/\b\w*\d+\w*\b/g) || []).length;
  return exotic * 3 + mixed * 2 + digitNoise * 2 + (artifactPattern.test(value) ? 3 : 0);
};
const overlapScore = (left, right) => {
  const a = new Set(Object.keys(left.remedies));
  const b = new Set(Object.keys(right.remedies));
  let intersection = 0;
  for (const remedy of a) if (b.has(remedy)) intersection += 1;
  const union = new Set([...a, ...b]).size;
  return intersection / Math.max(1, union);
};

const textSimilarity = (left, right) => {
  const normalize = (value) => value.toLowerCase().replace(/[^a-z]/g, "");
  const bigrams = (value) => {
    const normalized = normalize(value);
    const result = new Set();
    for (let index = 0; index < normalized.length - 1; index += 1) {
      result.add(normalized.slice(index, index + 2));
    }
    return result;
  };
  const a = bigrams(left);
  const b = bigrams(right);
  let intersection = 0;
  for (const gram of a) if (b.has(gram)) intersection += 1;
  return (2 * intersection) / Math.max(1, a.size + b.size);
};

const alignRubrics = (left, right) => {
  const rows = left.length + 1;
  const columns = right.length + 1;
  const scores = Array.from({ length: rows }, () => new Float64Array(columns));
  const moves = Array.from({ length: rows }, () => new Uint8Array(columns));
  const gapPenalty = -0.8;
  for (let row = 1; row < rows; row += 1) {
    scores[row][0] = row * gapPenalty;
    moves[row][0] = 1;
  }
  for (let column = 1; column < columns; column += 1) {
    scores[0][column] = column * gapPenalty;
    moves[0][column] = 2;
  }
  for (let row = 1; row < rows; row += 1) {
    for (let column = 1; column < columns; column += 1) {
      const primary = left[row - 1];
      const alternateRubric = right[column - 1];
      const remedySimilarity = overlapScore(primary, alternateRubric);
      const headingSimilarity = textSimilarity(primary.name, alternateRubric.name);
      const sizeRatio = Math.min(
        Object.keys(primary.remedies).length,
        Object.keys(alternateRubric.remedies).length,
      ) / Math.max(
        1,
        Object.keys(primary.remedies).length,
        Object.keys(alternateRubric.remedies).length,
      );
      const matchValue = remedySimilarity * 5 + headingSimilarity * 3 + sizeRatio - 3;
      const match = scores[row - 1][column - 1] + matchValue;
      const skipPrimary = scores[row - 1][column] + gapPenalty;
      const skipAlternate = scores[row][column - 1] + gapPenalty;
      if (match >= skipPrimary && match >= skipAlternate) {
        scores[row][column] = match;
        moves[row][column] = 0;
      } else if (skipPrimary >= skipAlternate) {
        scores[row][column] = skipPrimary;
        moves[row][column] = 1;
      } else {
        scores[row][column] = skipAlternate;
        moves[row][column] = 2;
      }
    }
  }
  const aligned = new Map();
  let row = left.length;
  let column = right.length;
  while (row > 0 || column > 0) {
    const move = moves[row][column];
    if (row > 0 && column > 0 && move === 0) {
      aligned.set(row - 1, column - 1);
      row -= 1;
      column -= 1;
    } else if (row > 0 && (column === 0 || move === 1)) {
      row -= 1;
    } else {
      column -= 1;
    }
  }
  return aligned;
};

const report = [];
for (const chapter of [...new Set(primary.map((rubric) => rubric.chapter))]) {
  const left = primary.filter((rubric) => rubric.chapter === chapter);
  const right = alternate.filter((rubric) => rubric.chapter === chapter);
  const alignment = alignRubrics(left, right);
  for (let index = 0; index < left.length; index += 1) {
    const rubric = left[index];
    if (qualityPenalty(rubric.name) === 0) continue;
    const alternateIndex = alignment.get(index);
    const candidate = alternateIndex === undefined ? undefined : right[alternateIndex];
    report.push({
      chapter,
      index,
      primary: rubric.name,
      primaryId: rubric.id,
      remedies: Object.keys(rubric.remedies).length,
      alternate: candidate?.name,
      alternateIndex,
      overlap: Number((candidate ? overlapScore(rubric, candidate) : 0).toFixed(3)),
      textSimilarity: Number((candidate ? textSimilarity(rubric.name, candidate.name) : 0).toFixed(3)),
      primaryPenalty: qualityPenalty(rubric.name),
      alternatePenalty: candidate ? qualityPenalty(candidate.name) : null,
    });
  }
}

console.log(JSON.stringify({
  summary: {
    primary: primary.length,
    alternate: alternate.length,
    suspicious: report.length,
    highConfidenceCleaner: report.filter((item) =>
      item.overlap >= 0.7
      && item.alternatePenalty < item.primaryPenalty
    ).length,
  },
  report,
}, null, 2));
