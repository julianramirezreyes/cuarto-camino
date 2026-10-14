import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createOutboxTransport } from "@/lib/email/outbox";
vi.mock("next/server", () => ({ connection: async () => {} }));

import { GET } from "./route";

let dir: string;
let file: string;
beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "dev-outbox-"));
  file = path.join(dir, "o.jsonl");
});
afterEach(async () => {
  vi.unstubAllEnvs();
  await rm(dir, { recursive: true, force: true });
});

const call = (qs: string) => GET(new Request(`http://localhost:3000/api/dev/outbox${qs}`));

describe("GET /api/dev/outbox", () => {
  it("is a 404 in production, even with the outbox selected", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("EMAIL_TRANSPORT", "outbox");
    vi.stubEnv("EMAIL_OUTBOX_FILE", file);
    expect((await call("?to=a@example.com")).status).toBe(404);
  });

  it("is a 404 when the transport is not the outbox", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("EMAIL_TRANSPORT", "smtp");
    expect((await call("?to=a@example.com")).status).toBe(404);
  });

  it("requires the `to` parameter", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("EMAIL_TRANSPORT", "outbox");
    vi.stubEnv("EMAIL_OUTBOX_FILE", file);
    expect((await call("")).status).toBe(400);
  });

  it("returns the last messages for the address, uncached", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("EMAIL_TRANSPORT", "outbox");
    vi.stubEnv("EMAIL_OUTBOX_FILE", file);
    const t = createOutboxTransport({ file, env: { NODE_ENV: "development" } });
    await t.send({ to: "a@example.com", subject: "uno", text: "t", html: "h" });
    await t.send({ to: "b@example.com", subject: "otro", text: "t", html: "h" });
    const res = await call("?to=a@example.com");
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toMatch(/no-store/);
    const body = (await res.json()) as { messages: { subject: string }[] };
    expect(body.messages.map((m) => m.subject)).toEqual(["uno"]);
  });
});
