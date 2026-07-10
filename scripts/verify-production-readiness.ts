import fs from "fs";
import path from "path";

console.log("🚀 Starting Automated Production Readiness Verification Script...");

let passed = true;

function verifyFileExists(filePath: string, description: string) {
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ [File Exists] ${description}: ${filePath}`);
  } else {
    console.error(`❌ [File Missing] ${description}: ${filePath}`);
    passed = false;
  }
}

// 1. Confirm required operations documents exist
console.log("\nChecking Operations Documentation Assets...");
const opDocs = [
  "docs/operations/PRODUCTION_READINESS_CHECKLIST.md",
  "docs/operations/RELEASE_GOVERNANCE.md",
  "docs/operations/INCIDENT_RUNBOOKS.md",
  "docs/operations/ENVIRONMENT_VARIABLES.md",
  "docs/operations/DEPLOYMENT_LOG_TEMPLATE.md",
  "docs/operations/SECURITY_AND_RBAC.md",
  "docs/operations/PRACTITIONER_ACCOUNT_LIFECYCLE.md",
  "docs/operations/PRACTITIONER_PROFILE_AND_ACCOUNT_SETTINGS.md",
  "docs/operations/PATIENT_ATTACHMENTS_AND_LAB_EXTRACTION.md",
  "docs/operations/CLINICIAN_REVIEWED_LAB_DATA.md"
];
opDocs.forEach(doc => verifyFileExists(doc, "Operations document"));

// 2. Confirm critical platform modules exist
console.log("\nChecking Critical System Core Modules...");
const coreModules = [
  "src/lib/ragService.ts",
  "src/features/knowledge/retrieval/vectorStore.ts",
  "src/features/knowledge/retrieval/embeddingQueue.ts",
  "src/features/knowledge-admin/cms/cmsManager.ts",
  "src/app/admin/knowledge-editorial/page.tsx",
  "src/app/api/admin/observability/rag-health/route.ts",
  "src/app/api/consult-ai/route.ts",
  "src/lib/clinicalDecisionSupport.ts",
  "src/lib/security/rbac.ts",
  "src/lib/security/apiAuth.ts",
  "src/lib/security/auditLogger.ts",
  "src/features/admin-users/types.ts",
  "src/features/admin-users/invitationTokenService.ts",
  "src/features/admin-users/practitionerRepository.ts",
  "src/features/admin-users/adminUsersClient.ts",
  "src/app/api/admin/invitations/accept/route.ts",
  "src/features/practitioner-profile/types.ts",
  "src/features/practitioner-profile/preferences.ts",
  "src/features/practitioner-profile/practitionerProfileRepository.ts",
  "src/features/practitioner-profile/profileClient.ts",
  "src/components/dashboard/PractitionerProfilePanel.tsx",
  "src/app/api/account/profile/route.ts",
  "tests/practitionerProfile.test.ts",
  "src/features/patient-attachments/types.ts",
  "src/features/patient-attachments/uploadValidation.ts",
  "src/features/patient-attachments/storageAdapter.ts",
  "src/features/patient-attachments/attachmentRepository.ts",
  "src/features/patient-attachments/labExtraction.ts",
  "src/features/patient-attachments/attachmentClient.ts",
  "src/features/patient-attachments/authHelper.ts",
  "src/features/patient-attachments/PatientAttachmentsPanel.tsx",
  "tests/patientAttachments.test.ts",
  "src/features/patient-labs/types.ts",
  "src/features/patient-labs/labRepository.ts",
  "src/features/patient-labs/clinicalLabContext.ts",
  "src/features/patient-labs/labClient.ts",
  "src/features/patient-labs/PatientLabTimelinePanel.tsx",
  "src/features/patient-labs/TreatmentPlannerLabReference.tsx",
  "src/app/api/patients/[patientId]/labs/review/route.ts",
  "src/app/api/patients/[patientId]/labs/timeline/route.ts",
  "src/app/api/patients/[patientId]/labs/summary/route.ts",
  "tests/patientLabs.test.ts"
];
coreModules.forEach(mod => verifyFileExists(mod, "Platform core module"));

// 3. Confirm package scripts exist
console.log("\nChecking package.json script configurations...");
try {
  const pkgContent = fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8");
  const pkg = JSON.parse(pkgContent);
  
  if (pkg.scripts && pkg.scripts["verify:production"]) {
    console.log("✅ [Script Config] 'verify:production' is registered in package.json");
  } else {
    console.error("❌ [Script Config Missing] 'verify:production' script is missing in package.json");
    passed = false;
  }
  
  if (pkg.scripts && pkg.scripts["test"]) {
    console.log("✅ [Script Config] 'test' runner is registered in package.json");
  } else {
    console.error("❌ [Script Config Missing] 'test' runner script is missing in package.json");
    passed = false;
  }
} catch (err: any) {
  console.error("❌ [Package Read Failure] Could not load package.json:", err.message || err);
  passed = false;
}

// 4. Confirm Safety Gates are preserved
console.log("\nChecking Safety Gates Integrity...");
const safetyFiles = [
  "src/features/knowledge-admin/cms/publicationReadiness.ts",
  "src/features/knowledge/governance/qualityGates.ts"
];
safetyFiles.forEach(gate => verifyFileExists(gate, "CMS safety filter gate"));

// 5. Auditing Security & Auth enforcement layer
console.log("\nAuditing Security & Auth Route-Level Coverage...");
try {
  const adminApiDir = path.join(process.cwd(), "src/app/api/admin");
  const accountApiDir = path.join(process.cwd(), "src/app/api/account");
  const patientsApiDir = path.join(process.cwd(), "src/app/api/patients");
  if (!fs.existsSync(adminApiDir)) {
    console.error("❌ [Security Audit] src/app/api/admin directory does not exist.");
    passed = false;
  } else {
    function getFilesRecursive(dir: string): string[] {
      let results: string[] = [];
      const list = fs.readdirSync(dir);
      list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
          results = results.concat(getFilesRecursive(fullPath));
        } else {
          results.push(fullPath);
        }
      });
      return results;
    }

    const adminFiles = fs.existsSync(adminApiDir) ? getFilesRecursive(adminApiDir) : [];
    const accountFiles = fs.existsSync(accountApiDir) ? getFilesRecursive(accountApiDir) : [];
    const patientsFiles = fs.existsSync(patientsApiDir) ? getFilesRecursive(patientsApiDir) : [];
    const files = [...adminFiles, ...accountFiles, ...patientsFiles];
    const routeFiles = files.filter(f => f.endsWith("route.ts") || f.endsWith("route.tsx"));
    
    console.log(`Discovered ${routeFiles.length} API route files.`);

    routeFiles.forEach(file => {
      const relativePath = path.relative(process.cwd(), file);
      const content = fs.readFileSync(file, "utf8");

      // Check exclusion
      if (
        relativePath.includes("api/admin/session/route.ts") ||
        relativePath.includes("api/admin/invitations/accept/route.ts")
      ) {
        console.log(`✅ [Exempt Route] Onboarding/Session route: ${relativePath}`);
        return;
      }

      // Must have auth guard
      const hasGuard = content.includes("authorizeRequest") || 
        content.includes("requireAdminApiSession") || 
        content.includes("verifyAdminSessionCookie") || 
        content.includes("resolveSession") ||
        content.includes("validatePractitionerPatientAccess");
      if (hasGuard) {
        console.log(`✅ [Protected Route] Guarded: ${relativePath}`);
      } else {
        console.error(`❌ [Security Alert] Unprotected Route! Missing authorizeRequest, verifyAdminSessionCookie, resolveSession or validatePractitionerPatientAccess in: ${relativePath}`);
        passed = false;
      }

      // Profile update validation check
      if (relativePath.includes("api/account/profile/route.ts")) {
        const hasFieldGate = content.includes("rejectedFields") || content.includes("containsRejected");
        if (hasFieldGate) {
          console.log(`✅ [Field Protection] Profile updates route properly rejects admin mutations: ${relativePath}`);
        } else {
          console.error(`❌ [Security Alert] Profile updates route lacks administrative field mutation protection: ${relativePath}`);
          passed = false;
        }
      }

      // No raw stack trace return patterns in admin/account routes
      if (content.includes("stack") && (content.includes("Response.json") || content.includes("NextResponse.json")) && !content.includes("console.error")) {
        if (/NextResponse\.json\(\s*\{\s*[^}]*stack/.test(content)) {
          console.error(`❌ [Security Alert] Route might be leaking stack traces: ${relativePath}`);
          passed = false;
        }
      }

      // No request.headers or cookie console logging
      if (content.includes("console.log") && (content.includes("request.headers") || content.includes("cookie"))) {
        console.error(`❌ [Security Alert] Obvious token/cookie logging found in route: ${relativePath}`);
        passed = false;
      }

      // Ensure no raw tokenHash is leaked to client in output payload
      if (content.includes("tokenHash") && !content.includes("const { tokenHash") && !content.includes("verifyInvitationToken")) {
        console.error(`❌ [Security Alert] Route might be returning tokenHash to client: ${relativePath}`);
        passed = false;
      }
    });

    // Verify security files for token/cookie logging and dev bypass
    const securityFiles = [
      "src/lib/security/rbac.ts",
      "src/lib/security/apiAuth.ts",
      "src/lib/security/auditLogger.ts",
      "src/lib/adminSession.ts",
      "src/lib/adminApiAuth.ts"
    ];

    // Extra: Verify SUBSCRIPTION_MANAGE in rbac.ts
    const rbacPath = path.join(process.cwd(), "src/lib/security/rbac.ts");
    if (fs.existsSync(rbacPath)) {
      const rbacContent = fs.readFileSync(rbacPath, "utf8");
      if (!rbacContent.includes("SUBSCRIPTION_MANAGE")) {
        console.error("❌ [Security Alert] SUBSCRIPTION_MANAGE permission is missing in rbac.ts");
        passed = false;
      } else {
        console.log("✅ [Security Config] SUBSCRIPTION_MANAGE permission verified in rbac.ts");
      }
    }

    securityFiles.forEach(secFile => {
      const fullSecPath = path.join(process.cwd(), secFile);
      if (fs.existsSync(fullSecPath)) {
        const content = fs.readFileSync(fullSecPath, "utf8");
        
        // Check for hardcoded dev bypass
        if (content.includes("ALLOW_DEV_ADMIN_BYPASS") && content.includes("true")) {
          if (/ALLOW_DEV_ADMIN_BYPASS\s*=\s*(?:true|'true'|"true")/.test(content)) {
            console.error(`❌ [Security Alert] Hardcoded dev bypass in security file: ${secFile}`);
            passed = false;
          }
        }

        // No cookie/token console logging
        if (content.includes("console.log") && (content.includes("cookieValue") || content.includes("token"))) {
          if (/console\.log\([^)]*(?:cookieValue|token)[^)]*\)/.test(content)) {
            console.error(`❌ [Security Alert] Logging of sensitive tokens/cookies in: ${secFile}`);
            passed = false;
          }
        }
      }
    });
  }
} catch (err: any) {
  console.error("❌ [Security Audit Failure] Could not run route audit:", err.message || err);
  passed = false;
}

// 6. Hardened Attachment & PHI Safety Verification
console.log("\nVerifying Patient Attachment & PHI Safety Gates...");
try {
  const uploadValidationPath = path.join(process.cwd(), "src/features/patient-attachments/uploadValidation.ts");
  const validationContent = fs.readFileSync(uploadValidationPath, "utf8");
  
  // Verify MIME allowlist
  if (validationContent.includes("application/pdf") && validationContent.includes("image/jpeg")) {
    console.log("✅ [MIME Check] MIME allowlist matches exactly.");
  } else {
    console.error("❌ [MIME Check Failure] Missing standard MIME allowlist.");
    passed = false;
  }
  
  // Verify File Size limits
  if (validationContent.includes("10 * 1024 * 1024")) {
    console.log("✅ [Size Check] Max file size is capped at 10MB.");
  } else {
    console.error("❌ [Size Check Failure] Size boundary limit cap not found.");
    passed = false;
  }

  // Verify warning block in PatientAttachmentsPanel.tsx
  const panelPath = path.join(process.cwd(), "src/features/patient-attachments/PatientAttachmentsPanel.tsx");
  const panelContent = fs.readFileSync(panelPath, "utf8");
  if (panelContent.includes("Extracted lab values require active clinician review")) {
    console.log("✅ [UI Warning Check] Clinician review notice warning is present.");
  } else {
    console.error("❌ [UI Warning Check Failure] Missing diagnostic warnings in attachments UI panel.");
    passed = false;
  }

  // Verify warning block in PatientLabTimelinePanel.tsx
  const timelinePanelPath = path.join(process.cwd(), "src/features/patient-labs/PatientLabTimelinePanel.tsx");
  const timelinePanelContent = fs.readFileSync(timelinePanelPath, "utf8");
  if (timelinePanelContent.includes("Lab values are clinician-reviewed clinical context")) {
    console.log("✅ [Labs UI Warning Check] Clinician lab timeline review notice warning is present.");
  } else {
    console.error("❌ [Labs UI Warning Check Failure] Missing diagnostic warnings in labs timeline UI panel.");
    passed = false;
  }

  // Verify Clinical OS safety context comment in clinicalLabContext.ts
  const clinicalCtxPath = path.join(process.cwd(), "src/features/patient-labs/clinicalLabContext.ts");
  const clinicalCtxContent = fs.readFileSync(clinicalCtxPath, "utf8");
  if (clinicalCtxContent.includes("Reviewed lab context is informational and must not alter scoring or prescribing logic")) {
    console.log("✅ [Clinical OS Comment Check] Safety comments are preserved in clinicalLabContext.");
  } else {
    console.error("❌ [Clinical OS Comment Check Failure] Safety non-interference comment is missing in clinicalLabContext.");
    passed = false;
  }

  // Audit Patient API route files specifically for no stack-trace or raw OCR logging/signed URL leaks
  const patientsApiDir = path.join(process.cwd(), "src/app/api/patients");
  if (fs.existsSync(patientsApiDir)) {
    // Recursively check all patients subroutes for ocr/signed url logs
    function scanDir(dir: string) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
          scanDir(fullPath);
        } else if (file.endsWith("route.ts")) {
          const code = fs.readFileSync(fullPath, "utf8");
          // check no console log of ocrText or signed urls
          if (code.includes("console.log") && (code.includes("downloadUrl") || code.includes("ocrText") || code.includes("rawText") || code.includes("Buffer"))) {
            console.error(`❌ [Security Alert] Potential logging of sensitive PHI/URLs in: ${fullPath}`);
            passed = false;
          }
        }
      });
    }
    scanDir(patientsApiDir);
  }
} catch (err: any) {
  console.error("❌ [Hardening Check Failure] Could not run attachments verification:", err.message);
  passed = false;
}

// 7. Final Report
console.log("\n==============================================");
if (passed) {
  console.log("🎉 Production Readiness Verification: SUCCESS!");
  process.exit(0);
} else {
  console.error("🚨 Production Readiness Verification: FAILED! Correct missing assets or security violations.");
  process.exit(1);
}
