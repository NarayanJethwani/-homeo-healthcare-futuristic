"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_RETRY_CONFIG = exports.sleep = void 0;
exports.executeWithRetry = executeWithRetry;
// Helper to pause execution
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
exports.sleep = sleep;
exports.DEFAULT_RETRY_CONFIG = {
    maxAttempts: 3,
    backoffScheduleMs: [2000, 5000] // Wait 2s after 1st attempt, 5s after 2nd attempt
};
/**
 * Executes a function with exponential backoff and retry.
 * If all attempts fail, it throws an error to notify the router to switch providers.
 */
async function executeWithRetry(operation, onRetry, config = exports.DEFAULT_RETRY_CONFIG) {
    let lastError = null;
    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
        try {
            console.log(`Executing operation - Attempt ${attempt} of ${config.maxAttempts}`);
            return await operation(attempt);
        }
        catch (error) {
            lastError = error;
            console.warn(`Attempt ${attempt} failed: ${error.message || String(error)}`);
            if (attempt < config.maxAttempts) {
                const delayMs = config.backoffScheduleMs[attempt - 1] || 1000;
                if (onRetry) {
                    onRetry(error, attempt, delayMs);
                }
                console.log(`Waiting ${delayMs}ms before next retry...`);
                await (0, exports.sleep)(delayMs);
            }
        }
    }
    throw new Error(`All ${config.maxAttempts} retry attempts exhausted. Last error: ${lastError?.message || String(lastError)}`);
}
