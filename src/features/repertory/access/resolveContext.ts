import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { RepertoryAccessContext, RepertoryEntitlement, RepertoryEditionId } from "../types/repertoryTypes";

const MOCK_ORGANIZATION_ENTITLEMENTS: Record<string, RepertoryEntitlement[]> = {
  "org-default": [
    {
      editionId: "kent_1908" as RepertoryEditionId,
      organizationId: "org-default",
      entitlementType: "internal",
      status: "active"
    },
    {
      editionId: "boericke_1927" as RepertoryEditionId,
      organizationId: "org-default",
      entitlementType: "internal",
      status: "active"
    }
  ],
  "org-licensed-active": [
    {
      editionId: "kent_1908" as RepertoryEditionId,
      organizationId: "org-licensed-active",
      entitlementType: "licensed",
      status: "active"
    }
  ],
  "org-licensed-expired": [
    {
      editionId: "kent_1908" as RepertoryEditionId,
      organizationId: "org-licensed-expired",
      entitlementType: "licensed",
      status: "expired"
    }
  ],
  "org-licensed-revoked": [
    {
      editionId: "kent_1908" as RepertoryEditionId,
      organizationId: "org-licensed-revoked",
      entitlementType: "licensed",
      status: "revoked"
    }
  ]
};

export async function resolveApiContext(
  request: NextRequest,
  permission: string = "repertory.review.read"
): Promise<{
  authorized: boolean;
  context?: RepertoryAccessContext;
  response?: NextResponse;
}> {
  const auth = await authorizeRequest(request, permission as any, request.nextUrl.pathname);
  if (!auth.authorized) {
    return { authorized: false, response: auth.response };
  }

  const userId = auth.session.uid;
  const userRole = auth.session.role;

  // Organization ID is retrieved from headers, which is populated by API gateway / session mapping.
  // Query parameters or body values are not trusted.
  const organizationId = request.headers.get("x-organization-id") || "org-default";

  const entitlements = MOCK_ORGANIZATION_ENTITLEMENTS[organizationId];
  if (!entitlements) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Access denied. Organization entitlement mapping is unavailable." },
        { status: 403 }
      )
    };
  }

  const activeFeatureFlags: string[] = [];
  const ffHeader = request.headers.get("x-feature-flags");
  if (ffHeader) {
    activeFeatureFlags.push(...ffHeader.split(",").map(f => f.trim()));
  }

  return {
    authorized: true,
    context: {
      userId,
      organizationId,
      userRole,
      organizationEntitlements: entitlements,
      activeFeatureFlags
    }
  };
}
