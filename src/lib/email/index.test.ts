import { describe, expect, it, vi } from "vitest";

const { createTransport } = vi.hoisted(() => ({ createTransport: vi.fn() }));
vi.mock("nodemailer", () => ({ default: { createTransport }, createTransport }));

import { getEmailTransport, isEmailEnabled } from "./index";

const smtp = {
  SMTP_HOST: "smtp.example.com",
  SMTP_PORT: "587",
  SMTP_USER: "user",
  SMTP_PASS: "pass",
  EMAIL_FROM: "Cuarto Camino <no-reply@example.com>",
};

describe("isEmailEnabled", () => {
  it("is false with nothing configured or partial SMTP vars", () => {
    expect(isEmailEnabled({})).toBe(false);
    expect(isEmailEnabled({ ...smtp, SMTP_PASS: "" })).toBe(false);
    expect(isEmailEnabled({ SMTP_HOST: "x" })).toBe(false);
  });
  it("is true with all SMTP vars (transport unset) or EMAIL_TRANSPORT=smtp", () => {
    expect(isEmailEnabled(smtp)).toBe(true);
    expect(isEmailEnabled({ ...smtp, EMAIL_TRANSPORT: "smtp" })).toBe(true);
  });
  it("is false for EMAIL_TRANSPORT=smtp with missing vars", () => {
    expect(isEmailEnabled({ EMAIL_TRANSPORT: "smtp" })).toBe(false);
  });
  it("is true for the outbox outside production and false in production", () => {
    expect(isEmailEnabled({ EMAIL_TRANSPORT: "outbox", NODE_ENV: "development" })).toBe(true);
    expect(isEmailEnabled({ EMAIL_TRANSPORT: "outbox" })).toBe(true);
    expect(isEmailEnabled({ EMAIL_TRANSPORT: "outbox", NODE_ENV: "production" })).toBe(false);
  });
  it("ignores unknown transports", () => {
    expect(isEmailEnabled({ ...smtp, EMAIL_TRANSPORT: "carrier-pigeon" })).toBe(false);
  });
});

describe("getEmailTransport", () => {
  it("returns null when disabled", () => {
    expect(getEmailTransport({})).toBeNull();
  });

  it("builds an SMTP transport; secure only on port 465", async () => {
    const sendMail = vi.fn().mockResolvedValue({});
    createTransport.mockReturnValue({ sendMail });
    const t = getEmailTransport(smtp)!;
    expect(createTransport).toHaveBeenLastCalledWith(
      expect.objectContaining({ host: "smtp.example.com", port: 587, secure: false, auth: { user: "user", pass: "pass" } }),
    );
    await t.send({ to: "a@example.com", subject: "s", text: "t", html: "<p>t</p>" });
    expect(sendMail).toHaveBeenCalledWith({
      from: smtp.EMAIL_FROM,
      to: "a@example.com",
      subject: "s",
      text: "t",
      html: "<p>t</p>",
    });
    getEmailTransport({ ...smtp, SMTP_PORT: "465" });
    expect(createTransport).toHaveBeenLastCalledWith(expect.objectContaining({ port: 465, secure: true }));
  });

  it("rejects an invalid port", () => {
    expect(() => getEmailTransport({ ...smtp, SMTP_PORT: "abc" })).toThrow(/SMTP_PORT/);
  });

  it("outbox: refuses in production (throws at construction)", () => {
    expect(() => getEmailTransport({ EMAIL_TRANSPORT: "outbox", NODE_ENV: "production" })).toThrow(/production/i);
  });

  it("outbox: builds outside production", () => {
    expect(getEmailTransport({ EMAIL_TRANSPORT: "outbox", EMAIL_OUTBOX_FILE: "/tmp/x.jsonl" })).not.toBeNull();
  });
});
