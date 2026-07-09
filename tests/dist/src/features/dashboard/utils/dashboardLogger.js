"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardLogger = void 0;
/**
 * Central Logger for Dashboard Diagnostics
 */
exports.dashboardLogger = {
    info(message, context) {
        console.log(`[INFO] [Dashboard]: ${message}`, context ? JSON.stringify(context) : "");
    },
    warn(message, context) {
        console.warn(`[WARN] [Dashboard]: ${message}`, context ? JSON.stringify(context) : "");
    },
    error(message, error, context) {
        console.error(`[ERROR] [Dashboard]: ${message}`, error || "", context ? JSON.stringify(context) : "");
    },
    widgetFailure(widgetName, error) {
        this.error(`Widget "${widgetName}" encountered a runtime exception. Boundary caught.`, error);
    }
};
