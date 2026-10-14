import { afterEach, describe, expect, it, vi } from "vitest";
import { dispatchEmail } from "./dispatch";

const message = { to: "secret@example.com", subject: "s", text: "token-in-body", html: "<p>x</p>" };

afterEach(() => vi.restoreAllMocks());

describe("dispatchEmail", () => {
  it("hands the send to the scheduler and returns without waiting for it", async () => {
    let release!: () => void;
    const send = vi.fn(() => new Promise<void>((r) => (release = r)));
    const scheduled: Promise<void>[] = [];
    await dispatchEmail({ send }, message, { schedule: (p) => void scheduled.push(p) });
    expect(send).toHaveBeenCalledWith(message);
    expect(scheduled).toHaveLength(1);
    release();
    await scheduled[0];
  });

  it("swallows send failures and logs only a generic code (no address, body or error text)", async () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    const send = vi.fn().mockRejectedValue(new Error("550 secret@example.com rejected token-in-body"));
    const scheduled: Promise<void>[] = [];
    await dispatchEmail({ send }, message, { schedule: (p) => void scheduled.push(p) });
    await expect(scheduled[0]).resolves.toBeUndefined();
    expect(err).toHaveBeenCalledTimes(1);
    const logged = JSON.stringify(err.mock.calls);
    expect(logged).toContain("email_send_failed");
    expect(logged).not.toContain("secret@example.com");
    expect(logged).not.toContain("token-in-body");
  });

  it("falls back to a detached promise when no request scope exists (default scheduler)", async () => {
    const send = vi.fn().mockResolvedValue(undefined);
    await dispatchEmail({ send }, message);
    await new Promise((r) => setTimeout(r, 0));
    expect(send).toHaveBeenCalledTimes(1);
  });
});
