import { describe, expect, it } from "vitest";
import { GET as getProfile } from "./[n]/route";
import { GET as getLenses } from "./lenses/route";
import { RELATIONSHIP_LENSES, RELATIONSHIP_PROFILES } from "@/content/relationships";

const profile = (n: string) =>
  getProfile(new Request("http://localhost/api/content/relationships/" + n), { params: Promise.resolve({ n }) });

describe("GET /api/content/relationships/[n]", () => {
  it.each([1, 2, 3, 4, 5, 6, 7, 8, 9] as const)("returns the profile of type %i, public and cacheable", async (n) => {
    const res = await profile(String(n));
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("public, max-age=3600");
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(await res.json()).toEqual({ profile: RELATIONSHIP_PROFILES[n] });
  });

  it.each(["0", "10", "abc", "1.5", "-1", "03", "lenses2"])("404 for %s, never cached", async (n) => {
    const res = await profile(n);
    expect(res.status).toBe(404);
    expect(res.headers.get("Cache-Control")).toBe("no-store");
    expect(await res.json()).toEqual({ error: "not_found" });
  });
});

describe("GET /api/content/relationships/lenses", () => {
  it("returns the lenses, public and cacheable", async () => {
    const res = await getLenses();
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("public, max-age=3600");
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(await res.json()).toEqual(RELATIONSHIP_LENSES);
  });
});
