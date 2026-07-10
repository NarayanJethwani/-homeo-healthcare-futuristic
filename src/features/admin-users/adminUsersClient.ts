export class AdminUsersClient {
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

  static async listPractitioners() {
    return this.request("/api/admin/users");
  }

  static async getPractitioner(userId: string) {
    return this.request(`/api/admin/users/${userId}`);
  }

  static async createInvitation(input: { email: string; role: string }) {
    return this.request("/api/admin/users/invite", {
      method: "POST",
      body: JSON.stringify(input)
    });
  }

  static async listInvitations() {
    return this.request("/api/admin/users/invitations");
  }

  static async revokeInvitation(inviteId: string) {
    return this.request(`/api/admin/users/invitations/${inviteId}/revoke`, {
      method: "POST"
    });
  }

  static async updatePractitionerProfile(userId: string, patch: any) {
    return this.request(`/api/admin/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(patch)
    });
  }

  static async updateRole(userId: string, role: string) {
    return this.request(`/api/admin/users/${userId}/role`, {
      method: "POST",
      body: JSON.stringify({ role })
    });
  }

  static async suspendUser(userId: string, reason: string) {
    return this.request(`/api/admin/users/${userId}/suspend`, {
      method: "POST",
      body: JSON.stringify({ reason })
    });
  }

  static async reactivateUser(userId: string) {
    return this.request(`/api/admin/users/${userId}/reactivate`, {
      method: "POST"
    });
  }

  static async deactivateUser(userId: string, reason: string) {
    return this.request(`/api/admin/users/${userId}/deactivate`, {
      method: "POST",
      body: JSON.stringify({ reason })
    });
  }

  static async extendSubscription(userId: string, expiresAt: string) {
    return this.request(`/api/admin/users/${userId}/subscription`, {
      method: "POST",
      body: JSON.stringify({ expiresAt })
    });
  }

  static async acceptInvitation(token: string, profileInput: {
    displayName?: string;
    specialties?: string[];
    clinicLocation?: string;
    uid?: string;
  }) {
    return this.request("/api/admin/invitations/accept", {
      method: "POST",
      body: JSON.stringify({ token, profileInput })
    });
  }
}
