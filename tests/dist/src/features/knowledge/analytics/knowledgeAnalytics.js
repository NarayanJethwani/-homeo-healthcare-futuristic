"use strict";
/**
 * Clinical Knowledge Platform Analytics helper.
 * Tracks views, search queries, failed searches, filter choices, and page reading times.
 * In a production environment, this delegates to Google Analytics or a custom logger.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKnowledgeAnalyticsSummary = exports.trackPatientModeToggle = exports.trackInternalLinkClick = exports.trackSearch = exports.trackEntityView = void 0;
// In-memory logs for simulation / analytics dashboard access
const analyticsStore = {
    views: [],
    searches: [],
    clicks: []
};
const trackEntityView = (entityId, slug, entityType) => {
    const event = {
        entityId,
        slug,
        entityType,
        timestamp: new Date().toISOString()
    };
    analyticsStore.views.push(event);
    // If window has gtag (Google Analytics)
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "knowledge_view", {
            entity_id: entityId,
            entity_slug: slug,
            entity_type: entityType
        });
    }
    else {
        console.log(`[Clinical Analytics] View Tracked: ${entityType} - ${slug} (${entityId})`);
    }
};
exports.trackEntityView = trackEntityView;
const trackSearch = (query, resultsCount, filterSelected) => {
    const event = {
        query,
        resultsCount,
        filterSelected,
        timestamp: new Date().toISOString()
    };
    analyticsStore.searches.push(event);
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "knowledge_search", {
            search_query: query,
            results_count: resultsCount,
            filter_selected: filterSelected,
            is_failure: resultsCount === 0
        });
    }
    else {
        console.log(`[Clinical Analytics] Search Tracked: "${query}" found ${resultsCount} results (filter: ${filterSelected})`);
    }
};
exports.trackSearch = trackSearch;
const trackInternalLinkClick = (sourceId, targetId, relation) => {
    const event = {
        sourceId,
        targetId,
        relation,
        timestamp: new Date().toISOString()
    };
    analyticsStore.clicks.push(event);
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "knowledge_link_click", {
            source_entity: sourceId,
            target_entity: targetId,
            relation_type: relation
        });
    }
    else {
        console.log(`[Clinical Analytics] Relation Link Clicked: [${sourceId}] -> (${relation}) -> [${targetId}]`);
    }
};
exports.trackInternalLinkClick = trackInternalLinkClick;
const trackPatientModeToggle = (isPatient) => {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "knowledge_mode_toggle", {
            is_patient: isPatient
        });
    }
    else {
        console.log(`[Clinical Analytics] Patient Mode Toggled to: ${isPatient ? "Patient-Friendly" : "Clinical-Standard"}`);
    }
};
exports.trackPatientModeToggle = trackPatientModeToggle;
const getKnowledgeAnalyticsSummary = () => {
    const viewsByEntity = analyticsStore.views.reduce((acc, curr) => {
        acc[curr.entityId] = (acc[curr.entityId] || 0) + 1;
        return acc;
    }, {});
    const failedSearches = analyticsStore.searches.filter(s => s.resultsCount === 0);
    return {
        totalViews: analyticsStore.views.length,
        totalSearches: analyticsStore.searches.length,
        searchFailuresCount: failedSearches.length,
        recentFailedSearches: failedSearches.slice(-10).map(s => s.query),
        mostViewedEntities: Object.entries(viewsByEntity)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
    };
};
exports.getKnowledgeAnalyticsSummary = getKnowledgeAnalyticsSummary;
