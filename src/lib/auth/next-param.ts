const MAX_LENGTH = 2000;
const BASE = "http://next-param.invalid";

/**
 * Validates a `?next=` redirect target. Only same-origin relative paths are allowed:
 * a single leading "/", no scheme, no protocol-relative "//" (also after URL parsing,
 * percent-decoding or browser quirks such as "\" or tab/newline stripping), no control chars.
 * Returns the original string when safe, otherwise null.
 */
export function safeNextPath(raw: unknown): string | null {
  if (typeof raw !== "string" || raw.length === 0 || raw.length > MAX_LENGTH) return null;
  if (!raw.startsWith("/") || raw.startsWith("//")) return null;
  // Backslashes (browsers treat them as "/") and any control character.
  if (/[\\\u0000-\u001f\u007f]/.test(raw)) return null;

  let decoded: string;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    return null;
  }
  if (/[\\\u0000-\u001f\u007f]/.test(decoded) || decoded.startsWith("//")) return null;

  let parsed: URL;
  try {
    parsed = new URL(raw, BASE);
  } catch {
    return null;
  }
  if (parsed.origin !== BASE || parsed.pathname.startsWith("//")) return null;
  return raw;
}
