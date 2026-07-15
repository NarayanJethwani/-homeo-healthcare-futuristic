import { NextRequest, NextResponse } from "next/server";
import { getCorsHeaders, isOriginAllowed } from "./aiSecurityHeaders";
import { AccessProfileResolver } from "./accessProfileResolver";
import {
  PublicRequestSchema,
  PatientRequestSchema,
  DoctorRequestSchema
} from "./requestSchemas";
import { CrisisClassifier } from "../crisis/crisisClassifier";
import { CacheKeyCompiler } from "../cache/cacheKey";
import { PromptInjectionGuard } from "../protection/injectionGuard";
import { aiRouterService, OrphanedProviderError } from "@/lib/aiRouter";
import { cacheService, CACHE_TTLS } from "@/lib/cacheService";
import { FirestoreConsentAdapter, ConsentVerificationResult } from "../consent/firestoreConsentAdapter";
import { ContextAuthorization, ContextAuthorizationResult } from "../authorization/contextAuthorization";
import { ClinicalContextProjection } from "./clinicalContextProjection";
import { AIAuditLogger, AIAuditMetadata, AIAuditErrorCode } from "../audit/auditEvent";
import { IPRateLimiter } from "../protection/rateLimiter";
import { getAdminDb } from "@/lib/firebaseAdmin";
import crypto from "crypto";
import { z } from "zod";
import { serverConfig, centralKeyedHmac } from "../config/serverConfig";
import { vercelIpResolver } from "../protection/ipResolver";
import { RedisRateLimiter } from "../protection/redisLimiter";
import { OutputValidator } from "../protection/outputValidator";
import { FAQWhitelistRegistry } from "../config/faqWhitelist";
import { NodeRedisAdapter } from "../protection/redisAdapter";

export interface ConsultAIDependencies {
  aiRouterService: {
    consultAI: (
      query: string,
      systemInstruction: string,
      options: any,
      dataClassification: "phi" | "non-phi",
      signal?: AbortSignal
    ) => Promise<any>;
  };
  cacheService: {
    get: (key: string) => Promise<any>;
    set: (key: string, value: any, ttl: number) => Promise<void>;
  };
  consentAdapter: {
    verifyAiProcessingConsent: (patientId: string) => Promise<ConsentVerificationResult>;
  };
  contextAuthorization: {
    authorizeDoctorContext: (
      doctorId: string,
      context: { patientContextId?: string; encounterId?: string }
    ) => Promise<ContextAuthorizationResult>;
  };
  clinicalContextProjection: {
    project: (patientId: string, organizationId: string, clinicId: string) => Promise<any>;
  };
  auditLogger: {
    logEvent: (metadata: AIAuditMetadata) => Promise<void>;
  };
  ipLimiter: {
    isRateLimited: (ip: string, clock: any, limit?: number) => { limited: boolean; retryAfter?: number };
  };
  clock: {
    now: () => Date;
  };
  uuidGenerator: {
    generate: () => string;
  };
  clientIpResolver?: (request: NextRequest) => string;
  redisClientProvider?: () => Promise<any>;
}

export const prodDeps: ConsultAIDependencies = {
  aiRouterService,
  cacheService,
  consentAdapter: new FirestoreConsentAdapter(),
  contextAuthorization: ContextAuthorization,
  clinicalContextProjection: ClinicalContextProjection,
  auditLogger: AIAuditLogger,
  ipLimiter: IPRateLimiter,
  clock: { now: () => new Date() },
  uuidGenerator: { generate: () => crypto.randomUUID() },
  clientIpResolver: vercelIpResolver,
  redisClientProvider: async () => {
    const client = cacheService.getRedisClient();
    return (client && client.isReady === true) ? new NodeRedisAdapter(client) : null;
  }
};

const ModeEnvelope = z.object({
  mode: z.enum(["public", "patient", "doctor"])
});

export function createConsultAIHandler(deps: ConsultAIDependencies) {
  return async (request: NextRequest) => {
    const correlationId = deps.uuidGenerator.generate();
    const origin = request.headers.get("origin");
    
    // Check CORS Origin early using the shared helper
    if (origin && !isOriginAllowed(origin)) {
      return NextResponse.json(
        { success: false, response: "CORS request blocked: Origin not allowed." },
        {
          status: 403,
          headers: {
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-CSRF-Token",
            "Access-Control-Allow-Credentials": "true",
            "Vary": "Origin"
          } // Omit Access-Control-Allow-Origin for disallowed origins
        }
      );
    }

    const headers = getCorsHeaders(origin);

    // Concurrency lease variables
    let leaseToken: string | null = null;
    let actorId: string | undefined = undefined;
    let actorHash: string | undefined = undefined;
    let redisLimiter: RedisRateLimiter | null = null;
    let isOrphanedProvider = false;

    // Establish deadline abort controller
    const deadlineController = new AbortController();
    const deadlineTimeout = setTimeout(() => {
      deadlineController.abort();
    }, 8000); // Strict 8-second request deadline

    // Link request cancel signal to deadline controller
    const onRequestAbort = () => {
      deadlineController.abort();
    };
    if (request.signal) {
      if (request.signal.aborted) {
        deadlineController.abort();
      } else {
        request.signal.addEventListener("abort", onRequestAbort);
      }
    }

    try {
      const checkDeadline = () => {
        if (deadlineController.signal.aborted) {
          throw new Error("DeadlineTimeout");
        }
      };

      // 0. Server-Only V2 Feature Gate
      if (!serverConfig.AI_ROUTER_SECURITY_V2_ENABLED) {
        return NextResponse.json(
          { success: false, response: "Clinical service is temporarily undergoing maintenance. Please contact Dr. Jethwani on WhatsApp." },
          { status: 503, headers }
        );
      }

      // Resolve request-scoped Redis Limiter
      checkDeadline();
      const redisAdapter = deps.redisClientProvider ? await deps.redisClientProvider() : null;
      checkDeadline();
      redisLimiter = new RedisRateLimiter(redisAdapter, deps.clock);

      // 2. Content-Type verification
      const contentType = request.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        return NextResponse.json(
          { success: false, response: "Unsupported content type." },
          { status: 415, headers }
        );
      }

      // 3. Enforce 16 KB body size limit calculated in UTF-8 bytes
      const rawBody = await request.text();
      const byteLen = Buffer.byteLength(rawBody, "utf8");
      if (byteLen > 16384) {
        return NextResponse.json(
          { success: false, response: "Payload size limit exceeded." },
          { status: 413, headers }
        );
      }

      // 4. Parse JSON payload
      let body: any;
      try {
        body = JSON.parse(rawBody);
      } catch {
        return NextResponse.json(
          { success: false, response: "Malformed JSON payload." },
          { status: 400, headers }
        );
      }

      // 5. Query and lang extraction (early schema validation)
      const querySchema = z.object({
        query: z.string().min(1),
        lang: z.string().default("en")
      });
      const queryParse = querySchema.safeParse(body);
      if (!queryParse.success) {
        return NextResponse.json(
          { success: false, response: "Invalid input schema." },
          { status: 400, headers }
        );
      }
      const query = queryParse.data.query;
      const lang = queryParse.data.lang;

      // 6. Multilingual Crisis check (deterministic response check BEFORE auth gates)
      const crisisVerdict = CrisisClassifier.classify(query, lang);
      if (crisisVerdict.type === "immediate-risk" || crisisVerdict.type === "possible-safety-concern") {
        await deps.auditLogger.logEvent({
          eventType: "crisis_blocked",
          correlationId,
          decision: "denied",
          errorCode: "CRISIS_TRIGGERED"
        });

        return NextResponse.json(
          { success: true, response: crisisVerdict.warning },
          { headers }
        );
      }

      // 7. Resolve Client IP via injected trusted resolver
      const resolver = deps.clientIpResolver || vercelIpResolver;
      const clientIp = resolver(request);

      // 8. Resolve Session profile
      checkDeadline();
      const resolution = await AccessProfileResolver.resolve(request);
      checkDeadline();
      if (resolution.errorResponse) {
        return NextResponse.json(
          { success: false, response: resolution.errorResponse.message },
          { status: resolution.errorResponse.status, headers }
        );
      }
      const profile = resolution.profile!;

      // Narrowing actor identities
      let doctorId: string | undefined = undefined;
      let patientId: string | undefined = undefined;
      if (profile.mode === "doctor") {
        doctorId = profile.doctorId;
        actorId = profile.doctorId;
      } else if (profile.mode === "patient") {
        patientId = profile.patientId;
        actorId = profile.uid;
      }

      if (actorId) {
        actorHash = centralKeyedHmac(actorId, "actor");
      }

      const envelope = ModeEnvelope.safeParse(body);
      if (!envelope.success) {
        return NextResponse.json(
          { success: false, response: "Invalid or missing mode parameter." },
          { status: 400, headers }
        );
      }
      const requestedMode = envelope.data.mode;

      // Reject mode escalation
      if (requestedMode === "doctor" && profile.mode !== "doctor") {
        return NextResponse.json(
          { success: false, response: "Access forbidden. Doctor credentials required." },
          { status: 403, headers }
        );
      }

      let effectiveProfileMode = profile.mode;
      if (profile.mode === "public" && requestedMode === "patient") {
        effectiveProfileMode = "public";
      }

      // 9. CSRF validation (Strict Host Matches Only)
      if (effectiveProfileMode !== "public") {
        const host = request.headers.get("host") || "";
        let isCsrfSafe = false;
        if (origin) {
          try {
            const originHost = new URL(origin).host;
            isCsrfSafe = (originHost === host);
          } catch {
            isCsrfSafe = false;
          }
        }
        if (!isCsrfSafe) {
          return NextResponse.json(
            { success: false, response: "CSRF verification failed." },
            { status: 403, headers }
          );
        }
      }

      // 11. Rate Limiting check
      let isRateLimited = false;
      let limitRetryAfter = 60;

      try {
        // IP rate check
        checkDeadline();
        const ipRes = await redisLimiter.checkLimit("ip", clientIp, 15, 500);
        checkDeadline();
        if (!ipRes.allowed) {
          isRateLimited = true;
          limitRetryAfter = ipRes.retryAfter || 60;
        }

        // Actor rate check
        if (!isRateLimited && actorHash) {
          checkDeadline();
          const actRes = await redisLimiter.checkLimit("actor", actorHash, 30, 1000);
          checkDeadline();
          if (!actRes.allowed) {
            isRateLimited = true;
            limitRetryAfter = actRes.retryAfter || 60;
          }
        }
      } catch (err: any) {
        if (err.message === "DeadlineTimeout") throw err;
        // Fallback to clock-injected local rate limiting on Redis outages
        const localRes = deps.ipLimiter.isRateLimited(clientIp, deps.clock);
        if (localRes.limited) {
          isRateLimited = true;
          limitRetryAfter = localRes.retryAfter || 60;
        }

        // Also check actor locally on Redis outage
        if (!isRateLimited && actorId) {
          const localAct = deps.ipLimiter.isRateLimited("actor:" + actorId, deps.clock, 30);
          if (localAct.limited) {
            isRateLimited = true;
            limitRetryAfter = localAct.retryAfter || 60;
          }
        }
      }

      if (isRateLimited) {
        await deps.auditLogger.logEvent({
          eventType: "rate_limited",
          correlationId,
          actorId,
          decision: "denied",
          errorCode: "RATE_LIMITED"
        });
        const retryHeaders = new Headers(headers);
        retryHeaders.set("Retry-After", String(limitRetryAfter));
        return NextResponse.json(
          { success: false, response: "You are sending requests too quickly. Please wait a minute before asking Lucy again." },
          { status: 429, headers: retryHeaders }
        );
      }

      // 12. Input schema checking
      let patientContextId: string | undefined;
      let encounterId: string | undefined;

      if (effectiveProfileMode === "doctor") {
        const parsed = DoctorRequestSchema.safeParse(body);
        if (!parsed.success) {
          return NextResponse.json(
            { success: false, response: "Invalid input schema." },
            { status: 400, headers }
          );
        }
        patientContextId = parsed.data.patientContextId;
        encounterId = parsed.data.encounterId;
      } else if (effectiveProfileMode === "patient") {
        const parsed = PatientRequestSchema.safeParse(body);
        if (!parsed.success) {
          return NextResponse.json(
            { success: false, response: "Invalid input schema." },
            { status: 400, headers }
          );
        }
      } else {
        const parsed = PublicRequestSchema.safeParse(body);
        if (!parsed.success) {
          return NextResponse.json(
            { success: false, response: "Invalid input schema." },
            { status: 400, headers }
          );
        }
      }

      // 13. Prompt Injection guard
      if (PromptInjectionGuard.isPromptInjection(query)) {
        await deps.auditLogger.logEvent({
          eventType: "prompt_injection_blocked",
          correlationId,
          actorId,
          decision: "denied",
          errorCode: "PROMPT_INJECTION"
        });

        return NextResponse.json({
          success: true,
          response: "I am designed exclusively to support your health journey with Homeo Healthcare. I cannot modify my instructions, perform coding tasks, or bypass clinical safety guidelines."
        }, { headers });
      }

      // 14. Server-Side Data Classification Policy
      const isFaq = FAQWhitelistRegistry.isSafeFaq(query);
      const dataClassification: "phi" | "non-phi" = 
        (effectiveProfileMode === "doctor" || effectiveProfileMode === "patient" || !isFaq) ? "phi" : "non-phi";

      const hasPHI = dataClassification === "phi";

      // 15. Tenant authorization & Retrieve clinical projection
      let resolvedOrganizationId = "";
      let resolvedClinicId = "";
      let clinicalContextText = "";

      if (effectiveProfileMode === "doctor") {
        // [P0] Entitlement Checks: Always call authorizeDoctorContext even context-free
        checkDeadline();
        const auth = await deps.contextAuthorization.authorizeDoctorContext(doctorId!, {
          patientContextId,
          encounterId
        });
        checkDeadline();

        if (!auth.authorized) {
          await deps.auditLogger.logEvent({
            eventType: "unauthorized_context_request",
            correlationId,
            actorId: doctorId!,
            decision: "denied",
            errorCode: "UNAUTHORIZED"
          });

          return NextResponse.json(
            { success: false, response: auth.errorReason || "Access forbidden." },
            { status: 403, headers }
          );
        }

        resolvedOrganizationId = auth.organizationId;
        resolvedClinicId = auth.clinicId;

        // EMR Consent validation check if patient/encounter target is present
        const contextTargetId = auth.resolvedPatientId || patientContextId;
        if (contextTargetId) {
          checkDeadline();
          const consent = await deps.consentAdapter.verifyAiProcessingConsent(contextTargetId);
          checkDeadline();
          if (!consent.allowed) {
            return NextResponse.json(
              { success: false, response: "AI processing consent has been withdrawn or is missing." },
              { status: 403, headers }
            );
          }

          // Clinical context projection is treated as PHI and never cached
          checkDeadline();
          const projection = await deps.clinicalContextProjection.project(contextTargetId, resolvedOrganizationId, resolvedClinicId);
          checkDeadline();
          clinicalContextText = `[Clinical Context Projection] Age Band: ${projection.patientAgeBand || "Unknown"}, Sex: ${projection.sexAtBirth || "Unknown"}, Conditions: ${projection.confirmedConditions?.join(", ") || "None"}. Assessment Summary: ${projection.recentAssessmentSummary || "None"}. Encounter Summary: ${projection.encounterSummary || "None"}.`;
        }
      } else if (effectiveProfileMode === "patient") {
        // Verify patient record ownership and linkage server-side
        checkDeadline();
        const patientDoc = await getAdminDb().collection("patients").doc(patientId!).get();
        checkDeadline();
        if (!patientDoc.exists) {
          return NextResponse.json(
            { success: false, response: "Access denied. Patient record not found." },
            { status: 403, headers }
          );
        }
        const patientData = patientDoc.data();
        if (profile.mode !== "patient") {
          return NextResponse.json(
            { success: false, response: "Access denied. Patient credentials required." },
            { status: 403, headers }
          );
        }
        if (!patientData || (patientData.userId !== profile.uid && !patientData.linkedUserIds?.includes(profile.uid))) {
          return NextResponse.json(
            { success: false, response: "Access denied. Patient record session mismatch." },
            { status: 403, headers }
          );
        }
        resolvedOrganizationId = patientData.organizationId || "";
        resolvedClinicId = patientData.clinicId || "";

        // Verify consent
        checkDeadline();
        const consent = await deps.consentAdapter.verifyAiProcessingConsent(patientId!);
        checkDeadline();
        if (!consent.allowed) {
          return NextResponse.json(
            { success: false, response: "AI processing consent has been withdrawn or is missing." },
            { status: 403, headers }
          );
        }

        // Clinical context projection is treated as PHI and never cached
        checkDeadline();
        const projection = await deps.clinicalContextProjection.project(patientId!, resolvedOrganizationId, resolvedClinicId);
        checkDeadline();
        clinicalContextText = `[Clinical Context Projection] Age Band: ${projection.patientAgeBand || "Unknown"}, Sex: ${projection.sexAtBirth || "Unknown"}, Symptoms: ${projection.activeSymptoms?.join(", ") || "None"}. Assessment Summary: ${projection.recentAssessmentSummary || "None"}.`;
      }

      // 15.5 Organization Rate Limiting (for all authenticated modes)
      if (resolvedOrganizationId) {
        try {
          const orgHash = centralKeyedHmac(resolvedOrganizationId, "organization");
          checkDeadline();
          const orgRes = await redisLimiter.checkLimit("org", orgHash, 100, 5000);
          checkDeadline();
          if (!orgRes.allowed) {
            const retryHeaders = new Headers(headers);
            retryHeaders.set("Retry-After", String(orgRes.retryAfter || 60));
            return NextResponse.json(
              { success: false, response: "Organization rate limit exceeded." },
              { status: 429, headers: retryHeaders }
            );
          }
        } catch (err: any) {
          if (err.message === "DeadlineTimeout") throw err;
          // Bounded Local organization rate check fallback (fails closed if exceeded)
          const localOrg = deps.ipLimiter.isRateLimited("org:" + resolvedOrganizationId, deps.clock, 100);
          if (localOrg.limited) {
            const retryHeaders = new Headers(headers);
            retryHeaders.set("Retry-After", String(localOrg.retryAfter || 60));
            return NextResponse.json(
              { success: false, response: "Organization rate limit exceeded." },
              { status: 429, headers: retryHeaders }
            );
          }
        }
      }

      // 16. Compile Cache Key & Lookup (skip entirely if classified as PHI)
      let cacheKey = "";
      if (!hasPHI) {
        checkDeadline();
        cacheKey = await CacheKeyCompiler.compile({
          profile,
          query,
          lang,
          patientContextId,
          encounterId,
          organizationId: resolvedOrganizationId,
          clinicalContextText
        });
        checkDeadline();

        const cached = await deps.cacheService.get(cacheKey);
        checkDeadline();
        if (cached) {
          await deps.auditLogger.logEvent({
            eventType: "cache_hit",
            correlationId,
            actorId: actorId,
            organizationId: resolvedOrganizationId,
            decision: "success",
            errorCode: "SUCCESS"
          });

          return NextResponse.json(
            {
              success: true,
              response: cached.response,
              providerUsed: cached.providerUsed,
              modelUsed: cached.modelUsed,
              cacheHit: true
            },
            { headers }
          );
        }
      }

      // 17. Invoke central AI Router
      let systemInstruction = "You are a scientific clinical AI assistant for Dr. Narayan Jethwani's evidence-based classical homeopathy practice (Homeo Healthcare). ";
      const languageNames: Record<string, string> = {
        en: "English", hi: "Hindi", mr: "Marathi", gu: "Gujarati",
        bn: "Bengali", te: "Telugu", ta: "Tamil", kn: "Kannada"
      };
      const responseLang = languageNames[lang] || "English";
      systemInstruction += `CRITICAL: You MUST write your entire response natively in the ${responseLang} language using its native script. Do not write non-English languages in English alphabets (no transliterating). `;

      if (effectiveProfileMode === "doctor") {
        systemInstruction += "You are in Doctor Mode (Clinical Pathophysiology). Provide highly technical, pathophysiological responses using medical terms. Discuss HPA axis, endocrine axes, cardiovascular dynamics (SVR, TNF-alpha, IL-6), miasmatic analysis, and constitutional selection. Maintain a clinical, scientific tone.";
      } else {
        systemInstruction += "You are in Patient Mode (General Healthcare Assistant). Provide warm, compassionate, patient-facing responses. Use clear, simple language to guide patients. Answer questions directly and understandably, maintaining a supportive, reassuring tone. Never mention you are switching models or providers; keep the personality seamless.";
      }

      if (clinicalContextText) {
        systemInstruction += `\n\n[CONTEXT GROUNDING]\n${clinicalContextText}\n\nStrictly ground your clinical response in this context if applicable. Avoid mentioning any patient identifying info.`;
      }

      systemInstruction += "\n\nCRITICAL: Never mention any homeopathic remedy names, specific medicines, potencies, or dosages to patients. Respond directly and clearly. Only advise booking a WhatsApp consultation with Dr. Narayan Jethwani when treatment, diagnosis, or symptom reviews are requested. Keep responses under 3 paragraphs in markdown formatting.";

      // 10. Concurrency Lease Acquisition (1 concurrent request per User ID)
      // Relocated here immediately before provider execution, after authorization, consent, and projection.
      if (effectiveProfileMode !== "public" && actorHash) {
        checkDeadline();
        try {
          leaseToken = await redisLimiter.acquireLease(actorHash);
          checkDeadline();
          if (!leaseToken) {
            return NextResponse.json(
              { success: false, response: "Too many concurrent requests. Please wait." },
              { status: 429, headers }
            );
          }
        } catch (err: any) {
          if (err.message === "DeadlineTimeout") throw err;
          // Fail-closed on Redis lease errors
          return NextResponse.json(
            { success: false, response: "Service temporarily degraded. Concurrency limit enforced." },
            { status: 429, headers }
          );
        }
      }

      let result;
      try {
        checkDeadline();
        result = await deps.aiRouterService.consultAI(
          query,
          systemInstruction,
          { mode: effectiveProfileMode, lang },
          dataClassification,
          deadlineController.signal
        );
        checkDeadline();
      } catch (err: any) {
        if (err.name === "OrphanedProviderError" || err instanceof OrphanedProviderError || (err instanceof Error && err.message.includes("Grace period timeout"))) {
          isOrphanedProvider = true;
        }
        throw err;
      }

      // Normal lease release immediately after provider settlement and output validation:
      const releaseNormalLease = async () => {
        if (leaseToken && actorHash && redisLimiter && !isOrphanedProvider) {
          try {
            await redisLimiter.releaseLease(actorHash, leaseToken);
            leaseToken = null; // Prevent finally block from releasing it again
          } catch {
            // ignore
          }
        }
      };

      if (result.success) {
        // Release lease now (before slow output-validation audit/writes)
        await releaseNormalLease();

        // Output validation check (Never partially sanitizes; replaces globally on violation)
        const validation = OutputValidator.validate(result.response, effectiveProfileMode);
        if (!validation.valid) {
          await deps.auditLogger.logEvent({
            eventType: "output_validation_blocked",
            correlationId,
            actorId,
            decision: "denied",
            errorCode: "OUTPUT_BLOCKED"
          });
          result.response = validation.response;
        }

        // Cache result if PHI check is disabled for this query
        if (!hasPHI) {
          const ttl = effectiveProfileMode === "public" ? CACHE_TTLS.FAQ : CACHE_TTLS.ARTICLE;
          await deps.cacheService.set(cacheKey, result, ttl);
        }

        // PHI-safe success event after lease release and before response
        await deps.auditLogger.logEvent({
          eventType: "provider_execution_success",
          correlationId,
          actorId: actorId,
          organizationId: resolvedOrganizationId,
          provider: result.providerUsed,
          decision: "success",
          errorCode: "SUCCESS"
        });
      } else {
        await releaseNormalLease();
        throw new Error(`Provider execution failed: ${result.response}`);
      }

      const responseHeaders = headers;
      return NextResponse.json(
        {
          success: true,
          response: result.response,
          providerUsed: result.providerUsed,
          modelUsed: result.modelUsed,
          latencyMs: result.latencyMs,
          correlationId
        },
        { status: 200, headers: responseHeaders }
      );
    } catch (error: any) {
      if (error instanceof OrphanedProviderError || error.name === "OrphanedProviderError" || error.message?.includes("Grace period timeout")) {
        isOrphanedProvider = true;
      }

      let errorMsg = "An unexpected error occurred. Connecting you to local clinical resources.";
      let status = 500;
      let eventType = "internal_error";
      let errorCode: AIAuditErrorCode = "INTERNAL_ERROR";

      if (error.message === "DeadlineTimeout" || (deadlineController && deadlineController.signal.aborted) || error.message?.includes("aborted") || error.name === "AbortError") {
        errorMsg = "Request deadline exceeded. Please retry.";
        status = 504;
        eventType = "timeout_blocked";
        errorCode = "TIMEOUT";
      } else if (isOrphanedProvider) {
        eventType = "orphaned_provider";
        errorCode = "ORPHANED_PROVIDER";
      }

      const auditMeta: AIAuditMetadata = {
        eventType,
        correlationId,
        decision: "denied",
        errorCode
      };
      await deps.auditLogger.logEvent(auditMeta);

      return NextResponse.json(
        {
          success: false,
          response: errorMsg,
          correlationId
        },
        { status, headers }
      );
    } finally {
      clearTimeout(deadlineTimeout);
      if (request.signal) {
        request.signal.removeEventListener("abort", onRequestAbort);
      }
      
      if (!isOrphanedProvider && leaseToken && actorHash && redisLimiter) {
        try {
          await redisLimiter.releaseLease(actorHash, leaseToken);
        } catch {
          // ignore lease release errors to prevent interrupting client responses
        }
      }
    }
  };
}
