import { z } from "zod";

const ServerConfigSchema = z.object({
  AI_ROUTER_SECURITY_V2_ENABLED: z.preprocess((val) => val === "true" || val === true || val === "1", z.boolean().default(false)),
  AI_ROUTER_ADVERSARIAL_VALIDATION_ENABLED: z.preprocess((val) => val === "true" || val === true || val === "1", z.boolean().default(false)),
  CLINICAL_PSEUDONYMIZATION_SECRET: z.string().default(() => {
    if (process.env.NEXT_PHASE === "phase-production-build" || process.env.NEXT_BUILD === "true") {
      return "dummy-secret-for-prerendering-phase";
    }
    return "";
  }).refine((val) => {
    if (process.env.NEXT_PHASE === "phase-production-build" || process.env.NEXT_BUILD === "true") return true;
    return val && val.length > 0;
  }, {
    message: "CLINICAL_PSEUDONYMIZATION_SECRET is required at runtime"
  }),
  ALLOWED_ORIGINS: z.string().default("http://localhost:3000,https://homeo.healthcare,https://www.homeo.healthcare"),
  REDIS_URL: z.string().optional()
});

export type ServerConfig = z.infer<typeof ServerConfigSchema>;

export let serverConfig: ServerConfig;

try {
  serverConfig = ServerConfigSchema.parse({
    AI_ROUTER_SECURITY_V2_ENABLED: process.env.AI_ROUTER_SECURITY_V2_ENABLED,
    AI_ROUTER_ADVERSARIAL_VALIDATION_ENABLED: process.env.AI_ROUTER_ADVERSARIAL_VALIDATION_ENABLED,
    CLINICAL_PSEUDONYMIZATION_SECRET: process.env.CLINICAL_PSEUDONYMIZATION_SECRET,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
    REDIS_URL: process.env.REDIS_URL
  });
} catch (err: any) {
  console.error("Startup Configuration Error: Invalid Server Environment Configuration:", err.message || err);
  // Throw a hard error so the environment fails closed if misconfigured
  throw new Error("Startup Configuration Error: Invalid Server Environment Configuration");
}

export function reloadConfigForTesting(envOverrides: Record<string, any>) {
  serverConfig = ServerConfigSchema.parse({
    AI_ROUTER_SECURITY_V2_ENABLED: envOverrides.AI_ROUTER_SECURITY_V2_ENABLED !== undefined ? envOverrides.AI_ROUTER_SECURITY_V2_ENABLED : process.env.AI_ROUTER_SECURITY_V2_ENABLED,
    AI_ROUTER_ADVERSARIAL_VALIDATION_ENABLED: envOverrides.AI_ROUTER_ADVERSARIAL_VALIDATION_ENABLED !== undefined ? envOverrides.AI_ROUTER_ADVERSARIAL_VALIDATION_ENABLED : process.env.AI_ROUTER_ADVERSARIAL_VALIDATION_ENABLED,
    CLINICAL_PSEUDONYMIZATION_SECRET: envOverrides.CLINICAL_PSEUDONYMIZATION_SECRET !== undefined ? envOverrides.CLINICAL_PSEUDONYMIZATION_SECRET : process.env.CLINICAL_PSEUDONYMIZATION_SECRET,
    ALLOWED_ORIGINS: envOverrides.ALLOWED_ORIGINS !== undefined ? envOverrides.ALLOWED_ORIGINS : process.env.ALLOWED_ORIGINS,
    REDIS_URL: envOverrides.REDIS_URL !== undefined ? envOverrides.REDIS_URL : process.env.REDIS_URL
  });
}

import crypto from "crypto";

export function centralKeyedHmac(text: string | undefined, domain: string): string {
  if (!text) return "anonymous";
  const secret = serverConfig?.CLINICAL_PSEUDONYMIZATION_SECRET;
  if (!secret) {
    throw new Error("Pseudonymization secret is missing");
  }
  const payload = `${domain}:${text}`;
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}
