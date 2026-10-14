import { describe, expect, it } from "vitest";
import { safeNextPath } from "./next-param";

describe("safeNextPath", () => {
  it.each(["/resultado", "/evaluacion", "/cuenta", "/biblioteca/tipos/4", "/resultado?x=1#a", "/"])(
    "accepts same-origin relative path %s",
    (p) => expect(safeNextPath(p)).toBe(p),
  );

  it.each([
    "//evil.example",
    "///evil.example",
    "/\\evil.example",
    "\\\\evil.example",
    "\\/evil.example",
    "https://evil.example",
    "http://evil.example/x",
    "javascript:alert(1)",
    "data:text/html,x",
    "mailto:a@b.c",
    "evil.example",
    "resultado",
    "/\t/evil.example",
    "/\n/evil.example",
    "/\r/evil.example",
    "\t//evil.example",
    " //evil.example",
    "/%0a/evil.example",
    "/%09/evil.example",
    "/%2f/evil.example",
    "/%5cevil.example",
    "/../..//evil.example",
    "/\u0000/evil",
    "",
  ])("rejects open-redirect payload %j", (p) => expect(safeNextPath(p)).toBeNull());

  it("handles missing, array and non-string values", () => {
    expect(safeNextPath(undefined)).toBeNull();
    expect(safeNextPath(null)).toBeNull();
    expect(safeNextPath(["/a", "/b"] as unknown as string)).toBeNull();
  });

  it("rejects absurdly long values", () => {
    expect(safeNextPath("/" + "a".repeat(3000))).toBeNull();
  });
});
