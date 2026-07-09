"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportExportService = void 0;
const repertoryDb_1 = require("../database/repertoryDb");
class ImportExportService {
    /**
     * Exports the entire database of rubrics as a JSON string.
     */
    static async exportToJSON() {
        const rubrics = await repertoryDb_1.repertoryRepository.getRubrics();
        const triples = await repertoryDb_1.repertoryRepository.getTriples();
        return JSON.stringify({
            version: "1.0.0",
            exportDate: new Date().toISOString(),
            rubrics,
            triples
        }, null, 2);
    }
    /**
     * Exports the rubrics database as a CSV spreadsheet format.
     */
    static async exportToCSV() {
        const rubrics = await repertoryDb_1.repertoryRepository.getRubrics();
        const headers = [
            'rubricId',
            'title',
            'plainLanguageMeaning',
            'classicalWording',
            'category',
            'organSystem',
            'source',
            'reviewer',
            'relatedRemedies'
        ];
        const lines = [headers.join(',')];
        for (const r of rubrics) {
            // Serialize remedies as remedyId:grade:reason;remedyId:grade:reason
            const remediesStr = r.relatedRemedies
                .map(rem => `${rem.remedyId}:${rem.grade}:${rem.keynoteReason.replace(/[|;]/g, '')}`)
                .join(';');
            const row = [
                r.rubricId,
                `"${r.title.replace(/"/g, '""')}"`,
                `"${r.plainLanguageMeaning.replace(/"/g, '""')}"`,
                `"${r.classicalWording.replace(/"/g, '""')}"`,
                r.category,
                r.organSystem,
                r.source,
                r.reviewer,
                `"${remediesStr.replace(/"/g, '""')}"`
            ];
            lines.push(row.join(','));
        }
        return lines.join('\n');
    }
    /**
     * Exports the repertory as interactive MDX documentation.
     */
    static async exportToMDX() {
        const rubrics = await repertoryDb_1.repertoryRepository.getRubrics();
        let mdx = `# Dr. Jethwani's Clinical Repertory Database\n\n`;
        mdx += `*Exported on: ${new Date().toLocaleDateString()}*\n\n`;
        mdx += `This catalog holds modern clinical rubrics and graded remedy coverages for clinical decision support.\n\n`;
        // Group by category
        const categories = Array.from(new Set(rubrics.map(r => r.category)));
        for (const cat of categories) {
            mdx += `## Category: ${cat}\n\n`;
            const catRubrics = rubrics.filter(r => r.category === cat);
            for (const rub of catRubrics) {
                mdx += `### ${rub.title}\n\n`;
                mdx += `* **Classical Wording:** \`${rub.classicalWording}\`\n`;
                mdx += `* **Plain Language:** ${rub.plainLanguageMeaning}\n`;
                mdx += `* **Target System:** ${rub.organSystem}\n`;
                mdx += `* **Source:** ${rub.source} (Reviewed by ${rub.reviewer})\n\n`;
                mdx += `#### Graded Remedy Coverages\n\n`;
                mdx += `| Remedy | Grade | Keynote / Clinical Weight | Differential Notes |\n`;
                mdx += `| :--- | :---: | :--- | :--- |\n`;
                rub.relatedRemedies.forEach(rem => {
                    const gradeLabel = rem.grade === 4 ? 'Grade 4 (Keynote)' : `Grade ${rem.grade}`;
                    mdx += `| **${rem.remedyId}** (${rem.remedyName}) | ${gradeLabel} | ${rem.keynoteReason} | ${rem.differentialNotes || 'None'} |\n`;
                });
                mdx += `\n---\n\n`;
            }
        }
        mdx += `\n---\n\n### Legal Disclaimer\n\n> ⚠️ **Clinical Review Required** — This system provides clinical decision support only. Final diagnosis and prescribing remain the responsibility of the clinician.\n`;
        return mdx;
    }
    /**
     * Exports relationships as NTriples graph triples.
     */
    static async exportToGraphTriples() {
        const triples = await repertoryDb_1.repertoryRepository.getTriples();
        let result = '';
        triples.forEach(t => {
            result += `<${t.subjectId}> <${t.predicate}> <${t.objectId}> .\n`;
        });
        return result;
    }
    /**
     * Imports rubrics from a JSON string into repository.
     */
    static async importRubricsFromJSON(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (data.rubrics && Array.isArray(data.rubrics)) {
                for (const rub of data.rubrics) {
                    // Validate structure minimally
                    if (rub.rubricId && rub.title && rub.category) {
                        await repertoryDb_1.repertoryRepository.saveRubric(rub);
                    }
                }
            }
            if (data.triples && Array.isArray(data.triples)) {
                for (const tr of data.triples) {
                    if (tr.subjectId && tr.predicate && tr.objectId) {
                        await repertoryDb_1.repertoryRepository.saveTriple(tr);
                    }
                }
            }
            return true;
        }
        catch (e) {
            console.error("Failed to import JSON repertory:", e);
            return false;
        }
    }
    /**
     * Imports rubrics from a CSV string into repository.
     */
    static async importRubricsFromCSV(csvString) {
        try {
            const lines = csvString.split('\n');
            if (lines.length < 2)
                return false;
            // Simplistic CSV parser
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line)
                    continue;
                // Regexp to split by commas outside quotes
                const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
                if (!matches || matches.length < 8)
                    continue;
                const rubricId = matches[0].replace(/"/g, '');
                const title = matches[1].replace(/"/g, '');
                const plainLanguageMeaning = matches[2].replace(/"/g, '');
                const classicalWording = matches[3].replace(/"/g, '');
                const category = matches[4].replace(/"/g, '');
                const organSystem = matches[5].replace(/"/g, '');
                const source = matches[6].replace(/"/g, '');
                const reviewer = matches[7].replace(/"/g, '');
                const remediesRaw = matches[8] ? matches[8].replace(/"/g, '') : '';
                // Reconstitute remedies
                const relatedRemedies = remediesRaw.split(';').map(rem => {
                    const parts = rem.split(':');
                    const remedyId = parts[0] || 'Unknown';
                    const grade = parts[1] ? Number(parts[1]) : 1;
                    const keynoteReason = parts[2] || 'Clinical cover';
                    return {
                        remedyId,
                        remedyName: remedyId,
                        grade,
                        confidence: 0.8,
                        keynoteReason,
                        sourceReference: source,
                        clinicalExperienceWeight: 0.8
                    };
                }).filter(r => r.remedyId !== 'Unknown');
                const rubric = {
                    rubricId,
                    title,
                    plainLanguageMeaning,
                    classicalWording,
                    category,
                    organSystem,
                    synonyms: [title.toLowerCase()],
                    patientExpressions: [title.toLowerCase()],
                    clinicalKeywords: [title.toLowerCase()],
                    relatedSymptoms: [],
                    relatedDiseases: [],
                    miasmaticWeight: { Psora: 0.5, Sycosis: 0.2, Syphilis: 0.1, Tubercular: 0.2, Cancerinic: 0.2 },
                    intensityScale: 5,
                    polarity: 'positive',
                    modalities: [],
                    aggravations: [],
                    ameliorations: [],
                    source,
                    confidence: 0.8,
                    author: 'CSV Import',
                    reviewer,
                    lastUpdated: new Date().toISOString(),
                    relatedRemedies
                };
                await repertoryDb_1.repertoryRepository.saveRubric(rubric);
            }
            return true;
        }
        catch (e) {
            console.error("Failed to import CSV repertory:", e);
            return false;
        }
    }
}
exports.ImportExportService = ImportExportService;
