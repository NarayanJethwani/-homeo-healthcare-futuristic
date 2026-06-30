/**
 * Central Logger for Dashboard Diagnostics
 */
export const dashboardLogger = {
  info(message: string, context?: any) {
    console.log(`[INFO] [Dashboard]: ${message}`, context ? JSON.stringify(context) : "");
  },

  warn(message: string, context?: any) {
    console.warn(`[WARN] [Dashboard]: ${message}`, context ? JSON.stringify(context) : "");
  },

  error(message: string, error?: any, context?: any) {
    console.error(
      `[ERROR] [Dashboard]: ${message}`,
      error || "",
      context ? JSON.stringify(context) : ""
    );
  },

  widgetFailure(widgetName: string, error: any) {
    this.error(`Widget "${widgetName}" encountered a runtime exception. Boundary caught.`, error);
  }
};
