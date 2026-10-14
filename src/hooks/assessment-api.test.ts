import { afterEach, describe, expect, it, vi } from "vitest";
import { assessmentApi } from "./assessment-api";

afterEach(() => vi.unstubAllGlobals());

describe("assessmentApi.back", () => {
  it("sends the question currently shown so the server can step back repeatedly", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ question: { id: "q1" }, progress: {} }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);
    await assessmentApi.back("a1", "q-type-005");
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/assessments/a1/back");
    expect(JSON.parse(init.body)).toEqual({ questionId: "q-type-005" });
  });
});
