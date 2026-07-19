import { z } from "zod";

export const strictWordRegex = /^[a-zA-Z0-9\s\-\.\/]{2,50}$/;

export const runSchema = (idx: number) => z.object({
  runIndex: z.literal(idx),
  recordingDurationMs: z.number().finite().nonnegative(),
  graphLoadMs: z.number().finite().nonnegative(),
  transitionMs: z.number().finite().nonnegative(),
  iplMs: z.number().finite().nonnegative(),
  averageFps: z.number().finite().nonnegative(),
  p95FrameDurationMs: z.number().finite().nonnegative(),
  maxFrameDurationMs: z.number().finite().nonnegative(),
  longTasksCount: z.number().int().finite().nonnegative(),
  jankEventsCount: z.number().int().finite().nonnegative(),
  maxConsecutiveDropped: z.number().int().finite().nonnegative()
}).strict();

export const completeProfileSchema = z.object({
  status: z.literal("complete"),
  deviceModel: z.string().regex(strictWordRegex),
  osVersion: z.string().regex(strictWordRegex),
  browserVersion: z.string().regex(strictWordRegex),
  cpuSoc: z.string().regex(strictWordRegex),
  debuggerToolVersion: z.string().regex(strictWordRegex),
  refreshRateHz: z.number().int().finite().positive(),
  powerState: z.literal("Normal"),
  runs: z.object({
    cold: z.tuple([runSchema(1), runSchema(2), runSchema(3), runSchema(4), runSchema(5)]),
    warm: z.tuple([runSchema(1), runSchema(2), runSchema(3), runSchema(4), runSchema(5)]),
    memory: z.object({
      baselineMb: z.number().finite().positive(),
      cycle5Mb: z.number().finite().positive(),
      cycle10Mb: z.number().finite().positive(),
      heapDeltaMb: z.number().finite()
    }).strict(),
    accessibility: z.object({
      domFocusRestored: z.boolean(),
      a11yFocusRestored: z.boolean(),
      keyboardFocusNavPass: z.boolean(),
      reducedMotionCompliance: z.boolean(),
      reducedMotionDurationMs: z.number().finite().nonnegative()
    }).strict()
  }).strict()
}).strict();

export const incompleteProfileSchema = z.object({
  status: z.literal("incomplete"),
  reasonCode: z.enum(["REASON_DEVICE_UNAVAILABLE", "REASON_METRIC_UNSUPPORTED", "REASON_TIMING_UNRELIABLE"]),
  reasonDetail: z.enum(["INSUFFICIENT_MEMORY", "CPU_INCOMPATIBILITY", "BROWSER_RESTRICTION", "HARDWARE_LIMITATION"])
}).strict();

export const physicalDeviceReportSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  timestamp: z.string().datetime(),
  commit: z.string().regex(/^[0-9a-f]{40}$/),
  vercelDeploymentId: z.string().regex(/^dpl_(?!.*(placeholder|example|test|fixture))[a-zA-Z0-9\_]+$/i),
  deploymentUrl: z.string().url().refine(val => {
    try {
      const url = new URL(val);
      return url.protocol === "https:" && !url.search && !url.hash &&
             !url.username && !url.password && !url.port &&
             url.host === "homeo-healthcare-futuristic.vercel.app" &&
             url.pathname === "/knowledge/remedies/lycopodium";
    } catch {
      return false;
    }
  }),
  deviceMatrix: z.object({
    "premium-ios": z.discriminatedUnion("status", [completeProfileSchema, incompleteProfileSchema]),
    "constrained-ios": z.discriminatedUnion("status", [completeProfileSchema, incompleteProfileSchema]),
    "constrained-android": z.discriminatedUnion("status", [completeProfileSchema, incompleteProfileSchema])
  }).strict()
}).strict();

export function evaluateReport(data: any): "resolved" | "open-regression" | "incomplete" {
  const profiles = ["premium-ios", "constrained-ios", "constrained-android"] as const;

  let hasIncomplete = false;

  for (const key of profiles) {
    const p = data.deviceMatrix[key];
    if (p.status === "incomplete") {
      hasIncomplete = true;
    } else if (p.status === "complete") {
      // Memory check
      if (p.runs.memory.heapDeltaMb > 15) return "open-regression";

      // Accessibility checks
      const a = p.runs.accessibility;
      if (!a.domFocusRestored || !a.a11yFocusRestored || !a.keyboardFocusNavPass || !a.reducedMotionCompliance) {
        return "open-regression";
      }
      if (a.reducedMotionDurationMs !== 0) return "open-regression";

      // Cold runs checks
      for (const r of p.runs.cold) {
        if (r.graphLoadMs > 3000) return "open-regression";
        if (r.transitionMs > 400) return "open-regression";
        if (r.iplMs > 100) return "open-regression";
        if (r.averageFps < 50) return "open-regression";
        if (r.maxFrameDurationMs > 66) return "open-regression";
        if (r.longTasksCount > 0) return "open-regression";
        if (r.maxConsecutiveDropped > 3) return "open-regression";
        if (r.p95FrameDurationMs > 33.33) return "open-regression";
      }

      // Warm runs checks
      for (const r of p.runs.warm) {
        if (r.graphLoadMs > 1000) return "open-regression";
        if (r.transitionMs > 400) return "open-regression";
        if (r.iplMs > 100) return "open-regression";
        if (r.averageFps < 50) return "open-regression";
        if (r.maxFrameDurationMs > 66) return "open-regression";
        if (r.longTasksCount > 0) return "open-regression";
        if (r.maxConsecutiveDropped > 3) return "open-regression";
        if (r.p95FrameDurationMs > 33.33) return "open-regression";
      }
    }
  }

  if (hasIncomplete) {
    return "incomplete";
  }

  return "resolved";
}

export function scanForLeaks(val: any): void {
  const forbiddenPatterns = [
    /\/Users\//i,
    /\/home\//i,
    /C:\\Users\\/i,
    /[\w\.\-]+@[\w\.\-]+\.\w+/, // Email regex
    /password/i,
    /bearer\s+/i,
    /SESSID/i
  ];

  if (typeof val === "string") {
    for (const pat of forbiddenPatterns) {
      if (pat.test(val)) {
        throw new Error("Validation Error: Restricted pattern detected in report data.");
      }
    }
  } else if (Array.isArray(val)) {
    for (const item of val) scanForLeaks(item);
  } else if (typeof val === "object" && val !== null) {
    for (const k of Object.keys(val)) {
      scanForLeaks(val[k]);
    }
  }
}
