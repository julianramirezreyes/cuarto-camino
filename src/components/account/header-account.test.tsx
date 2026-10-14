// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const useSession = vi.fn();
vi.mock("@/lib/auth/auth-client", () => ({ authClient: { useSession: () => useSession() } }));

import { HeaderAccount, HeaderAccountView } from "./header-account";

afterEach(cleanup);

describe("HeaderAccountView", () => {
  it("visitors see Entrar and Crear cuenta", () => {
    render(<HeaderAccountView state={{ kind: "visitor" }} />);
    expect(screen.getByRole("link", { name: "Entrar" })).toHaveAttribute("href", "/cuenta/entrar");
    expect(screen.getByRole("link", { name: "Crear cuenta" })).toHaveAttribute("href", "/cuenta/registro");
  });

  it("signed-in users see their name linking to the account page", () => {
    render(<HeaderAccountView state={{ kind: "user", name: "Ana" }} />);
    const link = screen.getByRole("link", { name: /ana/i });
    expect(link).toHaveAttribute("href", "/cuenta");
    expect(screen.queryByRole("link", { name: "Entrar" })).not.toBeInTheDocument();
  });

  it("falls back to 'Mi cuenta' when there is no name", () => {
    render(<HeaderAccountView state={{ kind: "user", name: "" }} />);
    expect(screen.getByRole("link", { name: "Mi cuenta" })).toHaveAttribute("href", "/cuenta");
  });

  it("renders no links while loading (no flash of the wrong state)", () => {
    render(<HeaderAccountView state={{ kind: "loading" }} />);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });
});

describe("HeaderAccount (wired to the session)", () => {
  it("maps pending, no session and session", () => {
    useSession.mockReturnValue({ data: null, isPending: true });
    const { rerender } = render(<HeaderAccount />);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
    useSession.mockReturnValue({ data: null, isPending: false });
    rerender(<HeaderAccount />);
    expect(screen.getByRole("link", { name: "Entrar" })).toBeInTheDocument();
    useSession.mockReturnValue({ data: { user: { name: "Ana", email: "a@x.y" } }, isPending: false });
    rerender(<HeaderAccount />);
    expect(screen.getByRole("link", { name: /ana/i })).toBeInTheDocument();
  });
});
