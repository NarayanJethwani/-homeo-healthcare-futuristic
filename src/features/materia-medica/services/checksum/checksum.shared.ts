export function canonicalizeChecksumText(text: string): string {
  if (!text) return "";
  return text
    .normalize("NFC")
    .replace(/\r\n?/g, "\n");
}
