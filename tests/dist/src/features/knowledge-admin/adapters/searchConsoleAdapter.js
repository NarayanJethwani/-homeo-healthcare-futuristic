"use strict";
/**
 * Search Console Adapter for future SEO Integration.
 * Defines types and data adapters for pulling Search Console performance, coverage, and Core Web Vitals.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchConsoleAdapter = exports.ClientSearchConsoleAdapter = exports.MockSearchConsoleAdapter = void 0;
class MockSearchConsoleAdapter {
    async getSummary() {
        return {
            dataSource: "Mock development data — not live Search Console",
            clicks: 14230,
            impressions: 245000,
            averageCtr: 0.058, // 5.8%
            averagePosition: 12.4,
            coverageErrors: 0,
            coverageWarnings: 4,
            structuredDataErrors: 0,
            structuredDataWarnings: 2, // e.g. missing optional fields
            coreWebVitalsStatus: "Good",
            lcpMs: 1450, // 1.45s
            inpMs: 180, // 180ms
            clsScore: 0.03
        };
    }
    async getTopLandingPages() {
        return [
            {
                url: "/knowledge/diseases/gastroesophageal-reflux-disease",
                title: "GERD (Acid Reflux) Clinical Profile",
                clicks: 4250,
                impressions: 48000,
                ctr: 0.088,
                position: 2.1
            },
            {
                url: "/knowledge/remedies/nux-vomica",
                title: "Nux Vomica Materia Medica",
                clicks: 3120,
                impressions: 39000,
                ctr: 0.080,
                position: 3.4
            },
            {
                url: "/knowledge/diseases/hypothyroidism",
                title: "Hypothyroidism Homeopathic Therapeutics",
                clicks: 2200,
                impressions: 42000,
                ctr: 0.052,
                position: 5.8
            },
            {
                url: "/knowledge/remedies/sulphur",
                title: "Sulphur Constitutional Profile",
                clicks: 1850,
                impressions: 28000,
                ctr: 0.066,
                position: 4.0
            },
            {
                url: "/knowledge/symptoms/chronic-cough",
                title: "Chronic Dry Cough Differential Guide",
                clicks: 980,
                impressions: 21000,
                ctr: 0.046,
                position: 8.5
            }
        ];
    }
    async getPagesWithLowCtr() {
        return [
            {
                url: "/knowledge/diseases/asthma",
                title: "Asthma Homeopathic Management",
                clicks: 120,
                impressions: 18500,
                ctr: 0.006, // High impressions but very low CTR
                position: 9.2
            },
            {
                url: "/knowledge/remedies/pulsatilla-pratensis",
                title: "Pulsatilla Constitutional Overview",
                clicks: 95,
                impressions: 11000,
                ctr: 0.008,
                position: 8.1
            }
        ];
    }
    async getPagesWithImpressionsButPoorRanking() {
        return [
            {
                url: "/knowledge/diseases/eczema",
                title: "Atopic Dermatitis & Eczema Solutions",
                clicks: 45,
                impressions: 34000,
                ctr: 0.001,
                position: 22.4 // High impressions but page 2/3 ranking
            },
            {
                url: "/knowledge/remedies/arsenicum-album",
                title: "Arsenicum Album Constitutional Action",
                clicks: 30,
                impressions: 19800,
                ctr: 0.0015,
                position: 18.9
            }
        ];
    }
    async getPagesNeedingTitleMetaImprovement() {
        return [
            {
                id: "D0014",
                title: "Acne Vulgaris Profile",
                issue: "Meta description too short (45 chars). Recommended range: 110-160 chars.",
                recommendedAction: "Rewrite meta description to specify clinical symptoms and top remedies for Acne."
            },
            {
                id: "R0005",
                title: "Aconitum Napellus Remedy",
                issue: "Title exceeds recommended limit (72 characters).",
                recommendedAction: "Shorten title to 'Aconitum Napellus (Monkshood) | Homeopathic Guide' to prevent search result truncation."
            }
        ];
    }
}
exports.MockSearchConsoleAdapter = MockSearchConsoleAdapter;
class ClientSearchConsoleAdapter {
    constructor() {
        this.mock = new MockSearchConsoleAdapter();
    }
    async fetchTelemetry(action) {
        if (typeof window === "undefined") {
            return null;
        }
        try {
            const res = await fetch(`/api/admin/observability/seo?action=${action}`);
            if (res.ok) {
                const data = await res.json();
                return data[action];
            }
        }
        catch (e) {
            console.warn(`Failed to fetch SEO action ${action}:`, e);
        }
        return null;
    }
    async getSummary() {
        const data = await this.fetchTelemetry("summary");
        return data || this.mock.getSummary();
    }
    async getTopLandingPages() {
        const data = await this.fetchTelemetry("topPages");
        return data || this.mock.getTopLandingPages();
    }
    async getPagesWithLowCtr() {
        const data = await this.fetchTelemetry("lowCtr");
        return data || this.mock.getPagesWithLowCtr();
    }
    async getPagesWithImpressionsButPoorRanking() {
        const data = await this.fetchTelemetry("poorRank");
        return data || this.mock.getPagesWithImpressionsButPoorRanking();
    }
    async getPagesNeedingTitleMetaImprovement() {
        const data = await this.fetchTelemetry("improvements");
        return data || this.mock.getPagesNeedingTitleMetaImprovement();
    }
}
exports.ClientSearchConsoleAdapter = ClientSearchConsoleAdapter;
exports.searchConsoleAdapter = new ClientSearchConsoleAdapter();
