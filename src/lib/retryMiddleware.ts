// Helper to pause execution
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface RetryConfig {
  maxAttempts: number;
  backoffScheduleMs: number[];
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  backoffScheduleMs: [2000, 5000] // Wait 2s after 1st attempt, 5s after 2nd attempt
};

/**
 * Executes a function with exponential backoff and retry.
 * If all attempts fail, it throws an error to notify the router to switch providers.
 */
export async function executeWithRetry<T>(
  operation: (attempt: number) => Promise<T>,
  onRetry?: (error: any, attempt: number, delayMs: number) => void,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  let lastError: any = null;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      console.log(`Executing operation - Attempt ${attempt} of ${config.maxAttempts}`);
      return await operation(attempt);
    } catch (error: any) {
      lastError = error;
      console.warn(`Attempt ${attempt} failed: ${error.message || String(error)}`);

      if (attempt < config.maxAttempts) {
        const delayMs = config.backoffScheduleMs[attempt - 1] || 1000;
        if (onRetry) {
          onRetry(error, attempt, delayMs);
        }
        console.log(`Waiting ${delayMs}ms before next retry...`);
        await sleep(delayMs);
      }
    }
  }

  throw new Error(`All ${config.maxAttempts} retry attempts exhausted. Last error: ${lastError?.message || String(lastError)}`);
}
