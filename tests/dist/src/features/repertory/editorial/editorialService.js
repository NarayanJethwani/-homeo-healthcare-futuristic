"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorialService = void 0;
const editorialRegistry_1 = require("./editorialRegistry");
const editorialValidator_1 = require("./editorialValidator");
class EditorialService {
    /**
     * Performs quality gate audits at start.
     */
    static performQualityChecks() {
        if (this.hasRunQA)
            return;
        const report = editorialValidator_1.EditorialValidator.validateRegistry();
        if (!report.isValid) {
            console.warn(`[CIE QA WARNING]: Editorial validation issues detected:\n${report.issues.join('\n')}`);
        }
        else {
            console.log(`[CIE QA]: Editorial registry quality check PASSED.`);
        }
        this.hasRunQA = true;
    }
    /**
     * Retrieves editorial records for a given remedy, utilizing the lookup cache.
     */
    static async getEditorialRecords(remedyId) {
        this.performQualityChecks();
        if (this.recordCache.has(remedyId)) {
            return this.recordCache.get(remedyId);
        }
        const records = editorialRegistry_1.EDITORIAL_RECORDS_REGISTRY[remedyId] || [];
        this.recordCache.set(remedyId, records);
        return records;
    }
    /**
     * Retrieves source metadata by identifier.
     */
    static async getSourceMetadata(sourceId) {
        this.performQualityChecks();
        if (this.sourceCache.has(sourceId)) {
            return this.sourceCache.get(sourceId);
        }
        const src = editorialRegistry_1.SYSTEM_SOURCES_REGISTRY[sourceId];
        if (src) {
            this.sourceCache.set(sourceId, src);
            return src;
        }
        return null;
    }
}
exports.EditorialService = EditorialService;
EditorialService.recordCache = new Map();
EditorialService.sourceCache = new Map();
EditorialService.hasRunQA = false;
