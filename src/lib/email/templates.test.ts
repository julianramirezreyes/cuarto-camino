import { describe, expect, it } from "vitest";
import { buildPasswordChangedEmail, buildPasswordResetEmail, buildVerificationEmail } from "./templates";

const url = "https://app.example/api/auth/verify-email?token=abc&callbackURL=%2Fcuenta";

describe("buildVerificationEmail", () => {
  it("is in Spanish, branded and carries the link in both bodies", () => {
    const m = buildVerificationEmail({ to: "ana@example.com", name: "Ana", url });
    expect(m.to).toBe("ana@example.com");
    expect(m.subject).toBe("Confirma tu correo");
    expect(m.text).toContain(url);
    expect(m.text).toMatch(/1 hora/);
    expect(m.text).toMatch(/si no creaste la cuenta/i);
    expect(m.text).toContain("Cuarto Camino");
    expect(m.html).toContain("Cuarto Camino");
    expect(m.html).toContain(`href="${url.replaceAll("&", "&amp;")}"`);
    expect(m.html).toMatch(/1 hora/);
  });

  it("escapes every dynamic value in the HTML", () => {
    const evil = `"><img src=x onerror=alert(1)>`;
    const m = buildVerificationEmail({
      to: "a@example.com",
      name: `<script>alert("x")</script>`,
      url: `https://app.example/?a=1&b="${evil}`,
    });
    expect(m.html).not.toContain("<script>");
    expect(m.html).not.toContain("<img");
    expect(m.html).toContain("&lt;script&gt;");
    expect(m.html).toContain("&quot;");
  });

  it("has no tracking pixels or remote images", () => {
    const m = buildVerificationEmail({ to: "a@example.com", name: "Ana", url });
    expect(m.html).not.toMatch(/<img/i);
  });

  it("works without a name", () => {
    const m = buildVerificationEmail({ to: "a@example.com", url });
    expect(m.text).toMatch(/^Hola,/);
  });
});

describe("buildPasswordResetEmail", () => {
  it("states expiry and that the password does not change if ignored", () => {
    const m = buildPasswordResetEmail({ to: "a@example.com", name: "Ana", url });
    expect(m.subject).toBe("Restablece tu contraseña");
    expect(m.text).toContain(url);
    expect(m.text).toMatch(/1 hora/);
    expect(m.text).toMatch(/si no lo pediste/i);
    expect(m.text).toMatch(/tu contraseña no cambia/i);
    expect(m.html).toContain("&amp;");
  });
  it("escapes the name", () => {
    const m = buildPasswordResetEmail({ to: "a@example.com", name: "<b>x</b>", url });
    expect(m.html).not.toContain("<b>x</b>");
  });
});

describe("buildPasswordChangedEmail", () => {
  it("notifies the change without any link", () => {
    const m = buildPasswordChangedEmail({ to: "a@example.com", name: "Ana" });
    expect(m.subject).toBe("Cambiaste tu contraseña");
    expect(m.text).not.toMatch(/https?:\/\//);
    expect(m.text).toMatch(/si no fuiste tú/i);
  });
});
