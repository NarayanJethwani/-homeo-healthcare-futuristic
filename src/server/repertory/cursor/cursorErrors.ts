export type CursorErrorCode =
  | "CURSOR_MALFORMED"
  | "CURSOR_SIGNATURE_INVALID"
  | "CURSOR_EXPIRED"
  | "CURSOR_CONTEXT_MISMATCH"
  | "CURSOR_PURPOSE_MISMATCH"
  | "CURSOR_VERSION_UNSUPPORTED"
  | "CURSOR_STALE"
  | "CURSOR_KEY_UNKNOWN";

export class CursorException extends Error {
  code: CursorErrorCode;
  constructor(code: CursorErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = "CursorException";
    Object.setPrototypeOf(this, CursorException.prototype);
  }
}
