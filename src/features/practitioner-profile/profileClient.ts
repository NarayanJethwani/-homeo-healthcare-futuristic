import { PractitionerProfileView, PractitionerProfileUpdate } from "./types";
import { PractitionerPreferences } from "./preferences";

export class ProfileClient {
  private static async request(path: string, options?: RequestInit) {
    const res = await fetch(path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {})
      }
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || data.message || `API error (${res.status})`);
    }
    return data;
  }

  static async getProfile(): Promise<{ success: boolean; profile: PractitionerProfileView }> {
    return this.request("/api/account/profile");
  }

  static async updateProfile(patch: PractitionerProfileUpdate): Promise<{ success: boolean; profile: PractitionerProfileView }> {
    return this.request("/api/account/profile", {
      method: "PATCH",
      body: JSON.stringify(patch)
    });
  }

  static async getSecurityActivity(): Promise<{ success: boolean; activity: any[] }> {
    return this.request("/api/account/security-activity");
  }

  static async savePreferences(preferences: PractitionerPreferences): Promise<{ success: boolean; preferences: PractitionerPreferences }> {
    return this.request("/api/account/preferences", {
      method: "POST",
      body: JSON.stringify({ preferences })
    });
  }
}
