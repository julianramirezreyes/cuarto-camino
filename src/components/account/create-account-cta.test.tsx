// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const useSession = vi.fn();
vi.mock("@/lib/auth/auth-client", () => ({ authClient: { useSession: () => useSession() } }));

import { CreateAccountCta } from "./create-account-cta";

afterEach(cleanup);

describe("CreateAccountCta", () => {
  it("links visitors to sign-up returning to /resultado", () => {
    useSession.mockReturnValue({ data: null, isPending: false });
    render(<CreateAccountCta />);
    expect(screen.getByRole("link", { name: /crear cuenta para conservar tu resultado/i })).toHaveAttribute(
      "href",
      "/cuenta/registro?next=/resultado",
    );
  });
  it("is hidden for signed-in users and while loading", () => {
    useSession.mockReturnValue({ data: { user: { name: "A" } }, isPending: false });
    const { container, rerender } = render(<CreateAccountCta />);
    expect(container).toBeEmptyDOMElement();
    useSession.mockReturnValue({ data: null, isPending: true });
    rerender(<CreateAccountCta />);
    expect(container).toBeEmptyDOMElement();
  });
});
