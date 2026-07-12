import assert from "assert";
import { NextRequest } from "next/server";
import { createAdminSessionCookie } from "../../src/lib/adminSession";
import { GET as getRubricRemedies } from "../../src/app/api/v1/repertory/knowledge/rubrics/[rubricId]/remedies/route";
import { GET as getRemedyRecord } from "../../src/app/api/v1/repertory/knowledge/remedies/[remedyRecordId]/route";
import { GET as getGradeRecord } from "../../src/app/api/v1/repertory/knowledge/grades/[gradeId]/route";

export async function runRemedyApiTests() {
  console.log("▶ Running Remedy API Endpoint Verification Tests...");

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

  const validAdminCookie = await generateTestCookie("super-admin");

  // 1. Get Rubric Remedies - Valid Request
  const reqRubric = createMockRequest("http://localhost/api/v1/repertory/knowledge/rubrics/boer_circulatory_heart_4044/remedies", validAdminCookie);
  const resRubric = await getRubricRemedies(reqRubric, {
    params: Promise.resolve({ rubricId: "boer_circulatory_heart_4044" })
  });
  assert.strictEqual(resRubric.status, 200);
  const dataRubric = await resRubric.json();
  assert.ok(dataRubric.data);
  assert.ok(Array.isArray(dataRubric.data));
  assert.strictEqual(dataRubric.metadata.schemaVersion, 2);

  // 2. Get Remedy Record - Valid Request
  const remedyRecordId = "rec_boericke_1927_Arn";
  const reqRemedy = createMockRequest(`http://localhost/api/v1/repertory/knowledge/remedies/${remedyRecordId}`, validAdminCookie);
  const resRemedy = await getRemedyRecord(reqRemedy, {
    params: Promise.resolve({ remedyRecordId })
  });
  assert.strictEqual(resRemedy.status, 200);
  const dataRemedy = await resRemedy.json();
  assert.strictEqual(dataRemedy.data.id, remedyRecordId);
  assert.strictEqual(dataRemedy.data.sourceAbbreviation, "Arn");
  assert.strictEqual(dataRemedy.data.conceptId, "c4b123d4-e29b-4b1d-8c1d-123456789abc");
  assert.strictEqual(dataRemedy.metadata.schemaVersion, 2);

  // 3. Get Grade Record - Valid Request
  if (dataRubric.data.length > 0) {
    const firstItem = dataRubric.data[0];
    const gradeId = firstItem.grade.id;
    const reqGrade = createMockRequest(`http://localhost/api/v1/repertory/knowledge/grades/${gradeId}`, validAdminCookie);
    const resGrade = await getGradeRecord(reqGrade, {
      params: Promise.resolve({ gradeId })
    });
    assert.strictEqual(resGrade.status, 200);
    const dataGrade = await resGrade.json();
    assert.strictEqual(dataGrade.data.grade.id, gradeId);
    assert.strictEqual(dataGrade.metadata.schemaVersion, 2);
    
    // Check backward compatibility field
    assert.ok(dataGrade.data.grade.sourceGrade !== undefined);
  }

  // 4. Unauthenticated Denied Check
  const reqUnauth = createMockRequest("http://localhost/api/v1/repertory/knowledge/rubrics/boer_circulatory_heart_4044/remedies");
  const resUnauth = await getRubricRemedies(reqUnauth, {
    params: Promise.resolve({ rubricId: "boer_circulatory_heart_4044" })
  });
  assert.strictEqual(resUnauth.status, 401);

  console.log("✅ Remedy API Endpoint Verification Tests Passed");
}
