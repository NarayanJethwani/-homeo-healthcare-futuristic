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
  "docs/operations/PRACTITIONER_ACCOUNT_LIFECYCLE.md"
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
  "src/app/api/admin/invitations/accept/route.ts"
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

    const files = getFilesRecursive(adminApiDir);
    const routeFiles = files.filter(f => f.endsWith("route.ts") || f.endsWith("route.tsx"));
    
    console.log(`Discovered ${routeFiles.length} admin API route files.`);

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
      const hasGuard = content.includes("authorizeRequest") || content.includes("requireAdminApiSession");
      if (hasGuard) {
        console.log(`✅ [Protected Route] Guarded: ${relativePath}`);
      } else {
        console.error(`❌ [Security Alert] Unprotected Route! Missing authorizeRequest or requireAdminApiSession in: ${relativePath}`);
        passed = false;
      }

      // No raw stack trace return patterns in admin routes
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

// 6. Final Report
console.log("\n==============================================");
if (passed) {
  console.log("🎉 Production Readiness Verification: SUCCESS!");
  process.exit(0);
} else {
  console.error("🚨 Production Readiness Verification: FAILED! Correct missing assets or security violations.");
  process.exit(1);
}
