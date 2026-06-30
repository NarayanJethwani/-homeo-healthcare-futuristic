import robots from "../../../app/robots";
import sitemap from "../../../app/sitemap";
import { getAllKnowledgeEntities } from "../index";

export interface BoundaryCheckResult {
  passed: boolean;
  errors: string[];
  log: string[];
}

/**
 * Validates the safety boundaries of the Clinical Knowledge Platform:
 * 1. Confirms robots.ts explicitly disallows /admin, /patient, /api/admin, /api/patient
 * 2. Confirms robots.ts allows /knowledge
 * 3. Confirms sitemap does NOT contain /admin, /patient
 * 4. Confirms public entity lists only return published entities
 */
export async function verifyClinicalPlatformBoundaries(): Promise<BoundaryCheckResult> {
  const errors: string[] = [];
  const log: string[] = [];

  log.push("Starting clinical platform boundary audit...");

  // 1. Robots.txt audit
  try {
    const robotsRules = robots() as any;
    const rules = robotsRules.rules;
    const disallows = Array.isArray(rules) ? (rules[0]?.disallow || []) : (rules?.disallow || []);
    const allows = Array.isArray(rules) ? (rules[0]?.allow || []) : (rules?.allow || []);

    log.push(`Auditing robots rules. Allows count: ${allows.length}, Disallows count: ${disallows.length}`);

    const expectedDisallows = ["/admin", "/patient", "/api/admin", "/api/patient"];
    for (const d of expectedDisallows) {
      if (!disallows.includes(d)) {
        errors.push(`Robots.txt security failure: missing disallow for '${d}'`);
      } else {
        log.push(`Verified: Robots.txt disallows '${d}'`);
      }
    }

    if (!allows.includes("/knowledge")) {
      errors.push("Robots.txt missing explicit allow indexation for '/knowledge'");
    } else {
      log.push("Verified: Robots.txt allows '/knowledge'");
    }
  } catch (err: any) {
    errors.push(`Error executing robots validation: ${err.message}`);
  }

  // 2. Sitemap audit
  try {
    const sitemapItems = await sitemap();
    log.push(`Auditing sitemap entries. Total generated items: ${sitemapItems.length}`);

    for (const item of sitemapItems) {
      const url = item.url;
      if (url.includes("/admin") || url.includes("/patient")) {
        errors.push(`Sitemap security leak: url '${url}' contains private route coordinates.`);
      }
    }
    log.push("Verified: No sitemap entries contain private route segments.");
  } catch (err: any) {
    errors.push(`Error executing sitemap validation: ${err.message}`);
  }

  // 3. Public Entity Registry audit
  try {
    const entities = getAllKnowledgeEntities();
    log.push(`Auditing entity database registry. Total entities: ${entities.length}`);

    const nonPublished = entities.filter(e => e.editorialStatus !== "published");
    if (nonPublished.length > 0) {
      errors.push(`Entity audit leak: ${nonPublished.length} draft/archived entities found in the active public registry.`);
    } else {
      log.push("Verified: All exported database entities are marked 'published'.");
    }
  } catch (err: any) {
    errors.push(`Error executing registry validation: ${err.message}`);
  }

  const passed = errors.length === 0;
  log.push(`Audit finished. Status: ${passed ? "PASSED" : "FAILED"}`);

  return {
    passed,
    errors,
    log,
  };
}
