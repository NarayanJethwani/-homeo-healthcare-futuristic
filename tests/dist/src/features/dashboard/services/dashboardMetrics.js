"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMockTelemetryMetrics = getMockTelemetryMetrics;
/**
 * Service to fetch server-side health checks and system diagnostics
 */
function getMockTelemetryMetrics() {
    return {
        cpuUsage: parseFloat((15 + Math.random() * 20).toFixed(1)),
        memoryUsage: parseFloat((45 + Math.random() * 10).toFixed(1)),
        activeRequests: Math.floor(5 + Math.random() * 15),
        networkLatencyMs: Math.floor(18 + Math.random() * 32),
        apiSuccessRate: parseFloat((99.2 + Math.random() * 0.8).toFixed(2)),
        timestamp: new Date().toISOString()
    };
}
