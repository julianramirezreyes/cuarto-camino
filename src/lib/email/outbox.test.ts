import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createOutboxTransport, readOutbox } from "./outbox";

let dir: string;
beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "outbox-test-"));
});
afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

const msg = (to: string, n = 1) => ({ to, subject: `s${n}`, text: `t${n}`, html: `<p>${n}</p>` });

describe("createOutboxTransport", () => {
  it("refuses to be constructed in production", () => {
    expect(() => createOutboxTransport({ file: path.join(dir, "o.jsonl"), env: { NODE_ENV: "production" } })).toThrow(
      /production/i,
    );
  });

  it("appends one JSON line per message and creates the directory", async () => {
    const file = path.join(dir, "nested", "deep", "o.jsonl");
    const t = createOutboxTransport({ file, env: { NODE_ENV: "development" } });
    await t.send(msg("a@example.com", 1));
    await t.send(msg("b@example.com", 2));
    const lines = (await readFile(file, "utf8")).trim().split("\n");
    expect(lines).toHaveLength(2);
    expect(JSON.parse(lines[0])).toMatchObject({ to: "a@example.com", subject: "s1" });
    expect(JSON.parse(lines[1]).sentAt).toEqual(expect.any(String));
  });
});

describe("readOutbox", () => {
  it("returns the last messages for an address (case-insensitive), newest last, honouring the limit", async () => {
    const file = path.join(dir, "o.jsonl");
    const t = createOutboxTransport({ file, env: { NODE_ENV: "test" } });
    for (let i = 1; i <= 4; i++) await t.send(msg("Ana@Example.com", i));
    await t.send(msg("other@example.com", 9));
    const got = await readOutbox(file, "ana@example.com", 2);
    expect(got.map((m) => m.subject)).toEqual(["s3", "s4"]);
  });

  it("returns [] when the file does not exist and skips corrupt lines", async () => {
    expect(await readOutbox(path.join(dir, "missing.jsonl"), "a@example.com")).toEqual([]);
  });
});
