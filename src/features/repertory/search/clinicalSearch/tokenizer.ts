import { TokenizedText } from "./types";

const COMBINING_MARKS_REGEX = /\p{M}/gu;
const NON_WORD_REGEX = /[^\p{L}\p{N}]+/gu;
const MULTISPACE_REGEX = /\s+/g;

export function normalizeSearchText(input: unknown): string {
  if (input === null || input === undefined) return "";

  return String(input)
    .normalize("NFKD")
    .replace(COMBINING_MARKS_REGEX, "")
    .toLocaleLowerCase("en-IN")
    .replace(NON_WORD_REGEX, " ")
    .replace(MULTISPACE_REGEX, " ")
    .trim();
}

export function tokenize(input: unknown): TokenizedText {
  const original = input === null || input === undefined ? "" : String(input);
  const normalized = normalizeSearchText(original);
  const tokens = normalized ? normalized.split(" ").filter(Boolean) : [];

  return {
    original,
    normalized,
    tokens,
  };
}

export function uniqueTokens(input: unknown): string[] {
  return Array.from(new Set(tokenize(input).tokens));
}
