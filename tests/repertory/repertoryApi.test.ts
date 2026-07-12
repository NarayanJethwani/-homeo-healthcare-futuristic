import assert from "assert";
import { NextRequest } from "next/server";
import { createAdminSessionCookie } from "../../src/lib/adminSession";
import { GET as getSources } from "../../src/app/api/v1/repertory/knowledge/sources/route";
import { GET as getEditions } from "../../src/app/api/v1/repertory/knowledge/sources/[sourceId]/editions/route";
import { GET as getChapters } from "../../src/app/api/v1/repertory/knowledge/editions/[editionId]/chapters/route";
import { GET as getRubrics } from "../../src/app/api/v1/repertory/knowledge/rubrics/route";
import { GET as getHierarchy } from "../../src/app/api/v1/repertory/knowledge/rubrics/[rubricId]/hierarchy/route";
import { GET as getSearch } from "../../src/app/api/v1/repertory/knowledge/search/route";
import { PublishedCorpusRetrievalAdapter } from "../../src/features/repertory/repositories/PublishedCorpusRetrievalAdapter";

export async function runApiTests() {
  console.log("▶ Running Repertory API Route Security & Authorization Tests...");

  // Mock PublishedCorpusRetrievalAdapter.prototype.getEditions to force licensed rightsStatus for testing
  const originalGetEditions = PublishedCorpusRetrievalAdapter.prototype.getEditions;
  PublishedCorpusRetrievalAdapter.prototype.getEditions = async function(context, sourceId) {
    const list = await originalGetEditions.call(this, context, sourceId);
    return list.map(ed => {
      if (ed.id === "kent_1908") {
        return {
          ...ed,
          rightsStatus: "licensed"
        };
      }
      return ed;
    });
  };

  const generateTestCookie = async (role: string = "super-admin", uid: string = "test-uid") => {
    return await createAdminSessionCookie({
      uid,
      role: role as any,
      exp: Math.floor(Date.now() / 1000) + 3600,
      email: "test@homeo.healthcare",
      name: "Test User"
    });
  };

  const createMockRequest = (url: string, cookieValue?: string, headers: Record<string, string> = {}): NextRequest => {
    const reqHeaders = new Headers();
    if (cookieValue) {
      reqHeaders.set("Cookie", `hh_admin_session_v3=${cookieValue}`);
    }
    for (const [k, v] of Object.entries(headers)) {
      reqHeaders.set(k, v);
    }
    return new NextRequest(url, { headers: reqHeaders });
  };

  const oldBypass = process.env.ALLOW_DEV_ADMIN_BYPASS;
  delete process.env.ALLOW_DEV_ADMIN_BYPASS;

  try {
    // 1. Unauthenticated request: returns 401
    const reqUnauth = createMockRequest("http://localhost/api/v1/repertory/knowledge/sources");
    const resUnauth = await getSources(reqUnauth);
    assert.strictEqual(resUnauth.status, 401, "Unauthenticated request must return 401");

    // 2. Invalid session signature: returns 401
    const reqInvalidSig = createMockRequest("http://localhost/api/v1/repertory/knowledge/sources", "badcookie.signature");
    const resInvalidSig = await getSources(reqInvalidSig);
    assert.strictEqual(resInvalidSig.status, 401, "Invalid signature session must return 401");

    // 3. Authenticated Admin session: returns 200
    const validAdminCookie = await generateTestCookie("super-admin");
    const reqAdmin = createMockRequest("http://localhost/api/v1/repertory/knowledge/sources", validAdminCookie);
    const resAdmin = await getSources(reqAdmin);
    assert.strictEqual(resAdmin.status, 200, "Valid admin cookie should be accepted");

    // 4. Authenticated Clinician: has access to sources list: returns 200
    const validClinicianCookie = await generateTestCookie("operations");
    const reqClinician = createMockRequest("http://localhost/api/v1/repertory/knowledge/sources", validClinicianCookie);
    const resClinician = await getSources(reqClinician);
    assert.strictEqual(resClinician.status, 200, "Clinician should list public / allowed sources");

    // 5. Licensed Edition Request - Organization licensed entitlement active: returns 200
    const reqLicensedActive = createMockRequest(
      "http://localhost/api/v1/repertory/knowledge/rubrics?editionId=kent_1908&chapterId=Mind",
      validClinicianCookie,
      { "x-organization-id": "org-licensed-active" }
    );
    const resLicensedActive = await getRubrics(reqLicensedActive);
    assert.strictEqual(resLicensedActive.status, 200, "Should allow licensed access when entitlement status is active");

    // 6. Licensed Edition Request - Organization licensed entitlement expired: returns 403
    const reqLicensedExpired = createMockRequest(
      "http://localhost/api/v1/repertory/knowledge/rubrics?editionId=kent_1908&chapterId=Mind",
      validClinicianCookie,
      { "x-organization-id": "org-licensed-expired" }
    );
    const resLicensedExpired = await getRubrics(reqLicensedExpired);
    assert.strictEqual(resLicensedExpired.status, 403, "Should deny licensed access when entitlement has expired");

    // 7. Licensed Edition Request - Organization licensed entitlement revoked: returns 403
    const reqLicensedRevoked = createMockRequest(
      "http://localhost/api/v1/repertory/knowledge/rubrics?editionId=kent_1908&chapterId=Mind",
      validClinicianCookie,
      { "x-organization-id": "org-licensed-revoked" }
    );
    const resLicensedRevoked = await getRubrics(reqLicensedRevoked);
    assert.strictEqual(resLicensedRevoked.status, 403, "Should deny licensed access when entitlement is revoked");

    // 8. Licensed Edition Request - Organization licensed entitlement not present: returns 403
    const reqLicensedNone = createMockRequest(
      "http://localhost/api/v1/repertory/knowledge/rubrics?editionId=kent_1908&chapterId=Mind",
      validClinicianCookie,
      { "x-organization-id": "org-nonexistent" }
    );
    const resLicensedNone = await getRubrics(reqLicensedNone);
    assert.strictEqual(resLicensedNone.status, 403, "Should deny licensed access if organization is unentitled");

    // 9. Zod Input boundary validations: returns 400
    const reqBadParams = createMockRequest(
      "http://localhost/api/v1/repertory/knowledge/rubrics?editionId=invalid_id$&chapterId=Mind",
      validClinicianCookie,
      { "x-organization-id": "org-default" }
    );
    const resBadParams = await getRubrics(reqBadParams);
    assert.strictEqual(resBadParams.status, 400, "Should return 400 for invalid query parameter schema");

  } finally {
    // Restore mock
    PublishedCorpusRetrievalAdapter.prototype.getEditions = originalGetEditions;
    if (oldBypass !== undefined) {
      process.env.ALLOW_DEV_ADMIN_BYPASS = oldBypass;
    }
  }

  console.log("✅ Repertory API Route Security & Authorization Tests Passed");
}
