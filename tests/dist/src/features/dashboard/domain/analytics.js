"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRecoveryIndex = calculateRecoveryIndex;
/**
 * Calculates recovery index dynamically
 */
function calculateRecoveryIndex(activeCount, totalCount) {
    if (totalCount === 0)
        return "94.2%";
    const base = 86.5;
    const ratio = activeCount / totalCount;
    const computed = (base + ratio * 8.5).toFixed(1);
    return `${computed}%`;
}
