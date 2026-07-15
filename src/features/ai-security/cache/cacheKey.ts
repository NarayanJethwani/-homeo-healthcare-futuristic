import { AccessProfile } from "../access/accessProfileResolver";
import crypto from "crypto";

const SCHEMA_VERSION = "v1";
const PROMPT_POLICY_VERSION = "v1";
const KNOWLEDGE_CORPUS_VERSION = "v1.2.0";
const STRUCTURED_OUTPUT_VERSION = "v1";
const PROVIDER_POLICY_VERSION = "v1";
const PROJECTION_VERSION = "v1";
const ENTITLEMENT_VERSION = "v1";

import { centralKeyedHmac } from "../config/serverConfig";

function sha256(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export class CacheKeyCompiler {
  static async compile(params: {
    profile: AccessProfile;
    query: string;
    lang: string;
    patientContextId?: string;
    encounterId?: string;
    organizationId?: string;
    clinicalContextText?: string;
  }): Promise<string> {
    const queryHash = sha256(params.query.trim().toLowerCase() + "_" + params.lang);
    const projectionHash = sha256(params.clinicalContextText || "empty");
    
    let namespace = "public";
    let orgHash = "none";
    let actorHash = "none";
    let contextHash = "none";

    if (params.profile.mode === "patient") {
      namespace = "patient";
      actorHash = centralKeyedHmac(params.profile.uid, "actor");
      contextHash = centralKeyedHmac(params.profile.patientId, "patient");
    } else if (params.profile.mode === "doctor") {
      namespace = "doctor";
      actorHash = centralKeyedHmac(params.profile.doctorId, "actor");
      if (params.organizationId) {
        orgHash = centralKeyedHmac(params.organizationId, "organization");
      }
      const contextId = params.patientContextId || params.encounterId || "none";
      contextHash = centralKeyedHmac(contextId, "patient");
    }

    const segments = [
      SCHEMA_VERSION,
      namespace,
      orgHash,
      actorHash,
      ENTITLEMENT_VERSION,
      contextHash,
      params.lang,
      queryHash,
      PROMPT_POLICY_VERSION,
      KNOWLEDGE_CORPUS_VERSION,
      STRUCTURED_OUTPUT_VERSION,
      PROVIDER_POLICY_VERSION,
      PROJECTION_VERSION,
      projectionHash
    ];

    const compositeString = segments.join(":");
    const finalHash = sha256(compositeString);
    
    return `ai_cache:${namespace}:${finalHash}`;
  }
}
