"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeTextDiff = computeTextDiff;
exports.computeEntityDiff = computeEntityDiff;
/**
 * Computes a line-by-line difference comparison between two text blobs.
 * Uses a basic LCS (Longest Common Subsequence) or direct line-level match checks.
 */
function computeTextDiff(oldText, newText) {
    const oldLines = oldText.split("\n");
    const newLines = newText.split("\n");
    const diffs = [];
    let oIdx = 0;
    let nIdx = 0;
    while (oIdx < oldLines.length || nIdx < newLines.length) {
        if (oIdx < oldLines.length && nIdx < newLines.length) {
            if (oldLines[oIdx] === newLines[nIdx]) {
                diffs.push({
                    type: "unchanged",
                    text: oldLines[oIdx]
                });
                oIdx++;
                nIdx++;
            }
            else {
                // Simple heuristic: check if old line is deleted or new line is inserted
                // Look ahead 1 line to find matches
                if (oIdx + 1 < oldLines.length && oldLines[oIdx + 1] === newLines[nIdx]) {
                    diffs.push({
                        type: "removed",
                        text: oldLines[oIdx]
                    });
                    oIdx++;
                }
                else if (nIdx + 1 < newLines.length && oldLines[oIdx] === newLines[nIdx + 1]) {
                    diffs.push({
                        type: "added",
                        text: newLines[nIdx]
                    });
                    nIdx++;
                }
                else {
                    // Replace: show removal followed by addition
                    diffs.push({
                        type: "removed",
                        text: oldLines[oIdx]
                    });
                    diffs.push({
                        type: "added",
                        text: newLines[nIdx]
                    });
                    oIdx++;
                    nIdx++;
                }
            }
        }
        else if (oIdx < oldLines.length) {
            diffs.push({
                type: "removed",
                text: oldLines[oIdx]
            });
            oIdx++;
        }
        else if (nIdx < newLines.length) {
            diffs.push({
                type: "added",
                text: newLines[nIdx]
            });
            nIdx++;
        }
    }
    return diffs;
}
/**
 * Computes differences between two entity snapshots by serializing them and checking changes.
 */
function computeEntityDiff(oldSnap, newSnap) {
    const diffMap = {};
    const fields = ["title", "summary", "editorialStatus", "evidenceLevel", "tags", "relatedEntities", "editorialNotes"];
    fields.forEach(field => {
        const oldVal = JSON.stringify(oldSnap[field] || "", null, 2);
        const newVal = JSON.stringify(newSnap[field] || "", null, 2);
        if (oldVal !== newVal) {
            diffMap[field] = computeTextDiff(oldVal, newVal);
        }
    });
    return diffMap;
}
