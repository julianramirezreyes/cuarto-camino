import { describe, expect, it } from "vitest";
import { buildAlternativeSummaries, buildTypeBundle, isEnneagramType } from "./type-bundle";
import { GET } from "./type/[n]/route";

describe("buildTypeBundle", () => {
  it.each([1, 2, 3, 4, 5, 6, 7, 8, 9] as const)("type %i: only its own slices", (n) => {
    const b = buildTypeBundle(n);
    expect(b.profile.type).toBe(n);
    expect(b.wings).toHaveLength(2);
    expect(b.wings.every((w) => w.type === n)).toBe(true);
    expect(b.subtypes.map((s) => s.instinct).sort()).toEqual(["so", "sp", "sx"]);
    expect(b.levels.map((l) => l.level)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("resolves deduped sources that exist in the registry", () => {
    const b = buildTypeBundle(4);
    const keys = b.sources.map((s) => s.key);
    expect(new Set(keys).size).toBe(keys.length);
    expect(keys.length).toBeGreaterThan(0);
  });

  it("is plain JSON (serializable)", () => {
    const b = buildTypeBundle(7);
    expect(JSON.parse(JSON.stringify(b))).toEqual(b);
  });

  it("validates type numbers", () => {
    expect(isEnneagramType(9)).toBe(true);
    expect(isEnneagramType(0)).toBe(false);
    expect(isEnneagramType(1.5)).toBe(false);
  });

  it("summarises alternatives with the lookAlikes difference when documented", () => {
    const main = buildTypeBundle(1).profile;
    const [first] = main.lookAlikes;
    const out = buildAlternativeSummaries(main, [first.type]);
    expect(out[0].difference).toBe(first.difference);
    expect(out[0].name).toBeTruthy();
  });
});

describe("GET /api/content/type/[n]", () => {
  const call = (n: string) => GET(new Request("http://localhost/api/content/type/" + n), { params: Promise.resolve({ n }) });

  it("returns a public cacheable bundle", async () => {
    const res = await call("3");
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("public, max-age=3600");
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    const body = await res.json();
    expect(body.type).toBe(3);
    expect(body.profile.type).toBe(3);
  });

  it.each(["0", "10", "abc", "1.5", "-1", "03"])("404 for %s", async (n) => {
    const res = await call(n);
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "not_found" });
  });
});
