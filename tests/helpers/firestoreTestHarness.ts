import * as crypto from "crypto";
import { getApps } from "firebase-admin/app";

export function generateSyntheticProjectId(): string {
  const hex = crypto.randomBytes(6).toString("hex");
  return `hh-test-${hex}`;
}

export function validateEmulatorHost(host: string): { host: string; port: number } {
  const lastColonIndex = host.lastIndexOf(":");
  if (lastColonIndex === -1) {
    throw new Error("Configuration Error: Invalid emulator host format.");
  }
  const hostSegment = host.substring(0, lastColonIndex);
  const portSegment = host.substring(lastColonIndex + 1);

  if (hostSegment !== "localhost" && hostSegment !== "127.0.0.1" && hostSegment !== "[::1]") {
    throw new Error("Configuration Error: Invalid emulator host. Only loopback interfaces are allowed.");
  }

  if (!/^[1-9][0-9]*$/.test(portSegment)) {
    throw new Error("Configuration Error: Invalid emulator port.");
  }
  const port = parseInt(portSegment, 10);
  if (port < 1 || port > 65535) {
    throw new Error("Configuration Error: Invalid emulator port.");
  }

  return { host: hostSegment, port };
}

export class FirestoreTestHarness {
  private projectId: string;
  private host: string;

  constructor(projectId?: string) {
    const hostEnv = process.env.FIRESTORE_EMULATOR_HOST;
    if (!hostEnv) {
      throw new Error("Harness Error: FIRESTORE_EMULATOR_HOST must be set.");
    }

    validateEmulatorHost(hostEnv);
    this.host = hostEnv;

    const resolvedProjId = projectId || process.env.FIRESTORE_PROJECT_ID || process.env.GCLOUD_PROJECT || generateSyntheticProjectId();
    if (!/^hh-test-[a-f0-9]{12}$/.test(resolvedProjId)) {
      throw new Error("Harness Error: Invalid project ID format.");
    }

    this.projectId = resolvedProjId;
  }

  getProjectId(): string {
    return this.projectId;
  }

  getEmulatorHost(): string {
    return this.host;
  }

  setupEnvironment() {
    process.env.FIRESTORE_EMULATOR_HOST = this.host;
    process.env.FIRESTORE_PROJECT_ID = this.projectId;
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = this.projectId;
    process.env.GCLOUD_PROJECT = this.projectId;

    // Enforce no production config leaks
    delete process.env.REPERTORY_USE_MOCK_FIRESTORE;
    delete process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    delete process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
    delete process.env.REPERTORY_USE_ADC;
  }

  async clearDocuments() {
    const url = `http://${this.host}/emulator/v1/projects/${this.projectId}/databases/(default)/documents`;
    try {
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Harness Error: Failed to clear database documents.");
      }
    } catch (err) {
      throw new Error("Harness Error: Failed to contact emulator clear documents endpoint.");
    }
  }

  async cleanup() {
    // Closes any admin connections or app instances if required.
    const apps = getApps();
    for (const app of apps) {
      await (app as any).delete();
    }
  }
}
