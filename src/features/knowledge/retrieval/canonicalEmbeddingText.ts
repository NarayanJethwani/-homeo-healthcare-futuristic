import { KmsKnowledgeEntity } from "../../knowledge-admin/types";

/**
 * Truncate a UTF-8 string to a maximum byte length without splitting multibyte characters.
 * Backs up over UTF-8 continuation bytes (0x80..0xBF) to prevent replacement character corruption.
 */
export function truncateUtf8Bytes(str: string, maxBytes: number): string {
  if (!str || maxBytes <= 0) return "";
  const buf = Buffer.from(str, "utf-8");
  if (buf.length <= maxBytes) return str;

  let len = maxBytes;
  // UTF-8 continuation bytes start with 10xxxxxx (0x80..0xBF)
  while (len > 0 && (buf[len] & 0xc0) === 0x80) {
    len--;
  }
  return buf.subarray(0, len).toString("utf-8");
}

/**
 * Build deterministic canonical embedding text from an authoritative KMS Knowledge Entity.
 */
export function buildCanonicalEmbeddingText(entity: KmsKnowledgeEntity): string {
  if (!entity) return "";

  const title = typeof entity.title === "string"
    ? entity.title
    : (entity.title?.en || "");

  const summary = typeof entity.summary === "string"
    ? entity.summary
    : (entity.summary?.en || "");

  const overview = typeof entity.content?.overview === "string"
    ? entity.content.overview
    : typeof entity.content?.description === "string"
      ? entity.content.description
      : "";

  const categories = Array.isArray((entity as any).categories)
    ? [...(entity as any).categories].sort().join(",")
    : "";

  const tags = Array.isArray(entity.tags)
    ? [...entity.tags].sort().join(",")
    : "";

  const rawText = `Title: ${title}\nType: ${entity.entityType || ""}\nCategories: ${categories}\nSummary: ${summary}\nOverview: ${overview}\nTags: ${tags}`
    .normalize("NFC")
    .trim();

  // Enforce maximum 16 KB (16,384 bytes) byte limit using code-point-aware truncation
  return truncateUtf8Bytes(rawText, 16384);
}

/**
 * Strict canonical JSON serializer.
 * Enforces key sorting, sparse array detection, prototype validation, cycle rejection, and finite number checks.
 */
export function canonicalJsonStringify(val: any, visited = new WeakSet()): string {
  if (val === null) return "null";

  const type = typeof val;

  if (type === "boolean" || type === "string") {
    return JSON.stringify(val);
  }

  if (type === "number") {
    if (!Number.isFinite(val)) {
      throw new Error("Non-finite numbers (NaN/Infinity) are forbidden in canonical JSON.");
    }
    return JSON.stringify(val);
  }

  if (Array.isArray(val)) {
    if (visited.has(val)) {
      throw new Error("Circular references are forbidden in canonical JSON.");
    }
    visited.add(val);

    const items: string[] = [];
    for (let i = 0; i < val.length; i++) {
      if (!(i in val) || val[i] === undefined) {
        throw new Error(`Sparse array or undefined element at index ${i} is forbidden in canonical JSON.`);
      }
      items.push(canonicalJsonStringify(val[i], visited));
    }
    return "[" + items.join(",") + "]";
  }

  if (type === "object") {
    const proto = Object.getPrototypeOf(val);
    if (proto !== null && proto !== Object.prototype) {
      throw new Error("Only plain objects with Object.prototype or null prototype are allowed in canonical JSON.");
    }
    if (visited.has(val)) {
      throw new Error("Circular references are forbidden in canonical JSON.");
    }
    visited.add(val);

    const keys = Object.keys(val).sort();
    const pairs: string[] = [];
    for (const key of keys) {
      const propVal = val[key];
      if (propVal === undefined) {
        throw new Error(`Undefined property '${key}' is forbidden in canonical JSON.`);
      }
      pairs.push(JSON.stringify(key) + ":" + canonicalJsonStringify(propVal, visited));
    }
    return "{" + pairs.join(",") + "}";
  }

  throw new Error(`Unsupported data type '${type}' in canonical JSON.`);
}
