"use strict";
/**
 * Analytics Adapter for future Web/Application Analytics integration.
 * Defines types and data adapters for capturing user engagement, expand actions, and exits.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsAdapter = exports.ClientAnalyticsAdapter = exports.MockAnalyticsAdapter = void 0;
class MockAnalyticsAdapter {
    async getSummary() {
        return {
            dataSource: "Mock development data — not live analytics",
            totalSessions: 18500,
            avgSessionDurationSeconds: 245, // ~4 minutes
            internalLinkClicks: 9450,
            learningPathCompletionRate: 0.38, // 38%
            faqExpansions: 1240,
            zeroResultSearchCount: 84
        };
    }
    async getMostReadArticles() {
        return [
            {
                slug: "gastroesophageal-reflux-disease",
                title: "GERD (Acid Reflux) Clinical Profile",
                views: 8900,
                avgTimeSeconds: 310, // ~5 minutes
                exitRate: 0.35
            },
            {
                slug: "nux-vomica",
                title: "Nux Vomica Materia Medica",
                views: 7400,
                avgTimeSeconds: 280,
                exitRate: 0.39
            },
            {
                slug: "hypothyroidism",
                title: "Hypothyroidism Homeopathic Therapeutics",
                views: 5200,
                avgTimeSeconds: 295,
                exitRate: 0.32
            },
            {
                slug: "sulphur",
                title: "Sulphur Constitutional Profile",
                views: 4800,
                avgTimeSeconds: 240,
                exitRate: 0.44
            },
            {
                slug: "migraine",
                title: "Migraine Homeopathic Treatment Protocols",
                views: 3900,
                avgTimeSeconds: 325,
                exitRate: 0.28
            }
        ];
    }
    async getCommonSearchQueries() {
        return [
            { query: "acidity", count: 850, resultsCount: 4 },
            { query: "anxiety", count: 620, resultsCount: 2 },
            { query: "nux vomica", count: 480, resultsCount: 1 },
            { query: "thyroid remedies", count: 390, resultsCount: 8 },
            { query: "eczema in kids", count: 180, resultsCount: 0 } // Potential content gap
        ];
    }
    async getHighTrafficLowEngagementArticles() {
        return [
            {
                slug: "acne-vulgaris",
                title: "Acne Vulgaris Profile",
                views: 3100,
                engagementScore: 28, // Low engagement
                clinicalImportance: "Medium"
            },
            {
                slug: "constipation",
                title: "Chronic Constipation Options",
                views: 2400,
                engagementScore: 35,
                clinicalImportance: "High"
            }
        ];
    }
    async getLowTrafficHighImportanceArticles() {
        return [
            {
                slug: "vitamin-b12-deficiency",
                title: "Vitamin B12 Deficiency & Neurological Manifestations",
                views: 240,
                engagementScore: 92, // Extremely high time-on-page
                clinicalImportance: "High"
            },
            {
                slug: "seborrheic-dermatitis",
                title: "Seborrheic Dermatitis Pathophysiology",
                views: 180,
                engagementScore: 88,
                clinicalImportance: "High"
            }
        ];
    }
}
exports.MockAnalyticsAdapter = MockAnalyticsAdapter;
class ClientAnalyticsAdapter {
    constructor() {
        this.mock = new MockAnalyticsAdapter();
    }
    async fetchTelemetry(action) {
        if (typeof window === "undefined") {
            return null;
        }
        try {
            const res = await fetch(`/api/admin/observability/analytics?action=${action}`);
            if (res.ok) {
                const data = await res.json();
                return data[action];
            }
        }
        catch (e) {
            console.warn(`Failed to fetch Analytics action ${action}:`, e);
        }
        return null;
    }
    async getSummary() {
        const data = await this.fetchTelemetry("summary");
        return data || this.mock.getSummary();
    }
    async getMostReadArticles() {
        const data = await this.fetchTelemetry("mostRead");
        return data || this.mock.getMostReadArticles();
    }
    async getCommonSearchQueries() {
        const data = await this.fetchTelemetry("commonQueries");
        return data || this.mock.getCommonSearchQueries();
    }
    async getHighTrafficLowEngagementArticles() {
        const data = await this.fetchTelemetry("highLow");
        return data || this.mock.getHighTrafficLowEngagementArticles();
    }
    async getLowTrafficHighImportanceArticles() {
        const data = await this.fetchTelemetry("lowHigh");
        return data || this.mock.getLowTrafficHighImportanceArticles();
    }
}
exports.ClientAnalyticsAdapter = ClientAnalyticsAdapter;
exports.analyticsAdapter = new ClientAnalyticsAdapter();
