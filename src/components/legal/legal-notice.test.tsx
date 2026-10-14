// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { LegalConfig } from "@/config/legal";
import { LegalNotice } from "./legal-notice";

afterEach(cleanup);

const base: LegalConfig = {
  controllerName: null,
  controllerEmail: null,
  privacyPolicyUrl: null,
  policyVersion: "2026-10-draft",
  isPilot: true,
};

describe("LegalNotice", () => {
  it("while data is missing it says so and still names the law and the policy version", () => {
    render(<LegalNotice config={base} />);
    const text = document.body.textContent ?? "";
    expect(text).toMatch(/Ley 1581 de 2012/);
    expect(text).toContain("2026-10-draft");
    expect(text).toMatch(/pendientes? de completar/i);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("shows the controller, a mailto link and the policy link once configured", () => {
    render(
      <LegalNotice
        config={{ ...base, controllerName: "Mi Proyecto S.A.S.", controllerEmail: "privacidad@example.com", privacyPolicyUrl: "https://example.com/privacidad" }}
      />,
    );
    expect(screen.getByText(/Mi Proyecto S\.A\.S\./)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "privacidad@example.com" })).toHaveAttribute("href", "mailto:privacidad@example.com");
    const policy = screen.getByRole("link", { name: /política de privacidad/i });
    expect(policy).toHaveAttribute("href", "https://example.com/privacidad");
    expect(policy).toHaveAttribute("rel", expect.stringContaining("noopener"));
    expect(document.body.textContent).not.toMatch(/pendientes? de completar/i);
  });

  it("never renders an unsafe policy URL as a link", () => {
    render(<LegalNotice config={{ ...base, controllerName: "X", controllerEmail: "a@b.co", privacyPolicyUrl: "javascript:alert(1)" }} />);
    expect(screen.queryByRole("link", { name: /política de privacidad/i })).not.toBeInTheDocument();
  });
});
