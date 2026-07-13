import assert from "node:assert/strict";
import {
  buildDeferredPatientWorkspace,
  classifyWorkspaceProvisioningError,
} from "@/features/clinical-os/application/workspaceProvisioningPolicy";

function run() {
  assert.equal(
    classifyWorkspaceProvisioningError(
      new Error("The user's Drive storage quota has been exceeded."),
    ),
    "drive-quota-exceeded",
  );
  assert.equal(
    classifyWorkspaceProvisioningError(new Error("Permission denied")),
    "permission-denied",
  );
  assert.equal(
    classifyWorkspaceProvisioningError(new Error("upstream unavailable")),
    "temporarily-unavailable",
  );

  const workspace = buildDeferredPatientWorkspace("P/unsafe value");
  assert.equal(workspace.workspaceStatus, "deferred");
  assert.equal(workspace.isMock, true);
  assert.equal(
    workspace.sheetUrl,
    "/admin/mock-sheet?mockId=P%2Funsafe%20value",
  );
  assert.equal(workspace.folderId, "");
  assert.equal(workspace.sheetId, "");

  console.log("workspace provisioning policy tests passed");
}

run();
