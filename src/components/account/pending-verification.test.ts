// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { clearPendingVerification, cooldownRemaining, loadPendingVerification, savePendingVerification } from "./pending-verification";

afterEach(() => {
  sessionStorage.clear();
  vi.restoreAllMocks();
});

describe("pending verification", () => {
  it("round-trips email, next and the send time", () => {
    savePendingVerification({ email: "a@example.com", next: "/resultado", sentAt: 1000 });
    expect(loadPendingVerification()).toEqual({ email: "a@example.com", next: "/resultado", sentAt: 1000 });
    clearPendingVerification();
    expect(loadPendingVerification()).toBeNull();
  });

  it("ignores corrupt or hostile values", () => {
    sessionStorage.setItem("cc:pending-verification", "{not json");
    expect(loadPendingVerification()).toBeNull();
    sessionStorage.setItem("cc:pending-verification", JSON.stringify({ email: 5, next: "//evil.example", sentAt: "x" }));
    expect(loadPendingVerification()).toBeNull();
    sessionStorage.setItem("cc:pending-verification", JSON.stringify({ email: "a@example.com", next: "//evil.example", sentAt: 1 }));
    expect(loadPendingVerification()?.next).toBeNull();
  });

  it("never throws when storage is unavailable", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => savePendingVerification({ email: "a@example.com", next: null, sentAt: 1 })).not.toThrow();
    expect(loadPendingVerification()).toBeNull();
  });
});

describe("cooldownRemaining", () => {
  it("counts down from 60 s and floors at 0", () => {
    expect(cooldownRemaining(1000, 1000)).toBe(60);
    expect(cooldownRemaining(1000, 31_000)).toBe(30);
    expect(cooldownRemaining(1000, 61_001)).toBe(0);
    expect(cooldownRemaining(1000, 500)).toBe(60);
  });
});
