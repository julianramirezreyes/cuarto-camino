// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const h = vi.hoisted(() => ({
  requestPasswordReset: vi.fn(),
  resetPassword: vi.fn(),
  sendVerificationEmail: vi.fn(),
  replace: vi.fn(),
  params: new URLSearchParams(),
}));

vi.mock("@/lib/auth/auth-client", () => ({
  authClient: {
    requestPasswordReset: h.requestPasswordReset,
    resetPassword: h.resetPassword,
    sendVerificationEmail: h.sendVerificationEmail,
  },
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: h.replace, push: vi.fn() }),
  useSearchParams: () => h.params,
}));

import { ForgotPasswordPanel, ResetPasswordPanel, VerifyEmailPanel } from "./recovery-panels";
import { savePendingVerification } from "./pending-verification";

beforeEach(() => {
  h.params = new URLSearchParams();
  sessionStorage.clear();
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("ForgotPasswordPanel", () => {
  it("asks Better Auth to redirect to the reset page and answers generically", async () => {
    h.requestPasswordReset.mockResolvedValue({ data: { status: true }, error: null });
    render(<ForgotPasswordPanel emailEnabled />);
    await userEvent.type(screen.getByLabelText(/correo/i), "x@example.com");
    await userEvent.click(screen.getByRole("button", { name: /enviar instrucciones/i }));
    expect(h.requestPasswordReset).toHaveBeenCalledWith({ email: "x@example.com", redirectTo: "/cuenta/restablecer" });
    expect(await screen.findByRole("status")).toHaveTextContent("Si existe una cuenta con ese correo, te enviamos instrucciones");
  });

  it("answers identically even if the server reports an error other than rate limiting", async () => {
    h.requestPasswordReset.mockResolvedValue({ data: null, error: { status: 400, code: "WHATEVER" } });
    render(<ForgotPasswordPanel emailEnabled />);
    await userEvent.type(screen.getByLabelText(/correo/i), "x@example.com");
    await userEvent.click(screen.getByRole("button", { name: /enviar instrucciones/i }));
    expect(await screen.findByRole("status")).toHaveTextContent("Si existe una cuenta con ese correo");
  });

  it("surfaces a rate limit", async () => {
    h.requestPasswordReset.mockResolvedValue({ data: null, error: { status: 429 } });
    render(<ForgotPasswordPanel emailEnabled />);
    await userEvent.type(screen.getByLabelText(/correo/i), "x@example.com");
    await userEvent.click(screen.getByRole("button", { name: /enviar instrucciones/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/muchos intentos/i);
  });

  it("explains that recovery is unavailable when email is not configured", () => {
    render(<ForgotPasswordPanel emailEnabled={false} />);
    expect(screen.queryByLabelText(/correo/i)).not.toBeInTheDocument();
    expect(screen.getByText(/no está disponible/i)).toBeInTheDocument();
  });
});

describe("ResetPasswordPanel", () => {
  const fill = async () => {
    await userEvent.type(screen.getByLabelText(/^contraseña nueva/i), "una-clave-larga-1");
    await userEvent.type(screen.getByLabelText(/repite la contraseña/i), "una-clave-larga-1");
    await userEvent.click(screen.getByRole("button", { name: /cambiar contraseña/i }));
  };

  it("reads the token from the query and goes to sign-in with a notice on success", async () => {
    h.params = new URLSearchParams("token=abc");
    h.resetPassword.mockResolvedValue({ data: { status: true }, error: null });
    render(<ResetPasswordPanel emailEnabled />);
    await fill();
    expect(h.resetPassword).toHaveBeenCalledWith({ newPassword: "una-clave-larga-1", token: "abc" });
    expect(h.replace).toHaveBeenCalledWith("/cuenta/entrar?restablecida=1");
  });

  it("shows the invalid-link state when the link carried an error", () => {
    h.params = new URLSearchParams("error=INVALID_TOKEN");
    render(<ResetPasswordPanel emailEnabled />);
    expect(screen.getByRole("alert")).toHaveTextContent(/no es válido o ya venció/i);
  });

  it("maps an INVALID_TOKEN response (expired / reused) to the invalid-link state", async () => {
    h.params = new URLSearchParams("token=abc");
    h.resetPassword.mockResolvedValue({ data: null, error: { status: 400, code: "INVALID_TOKEN" } });
    render(<ResetPasswordPanel emailEnabled />);
    await fill();
    expect(await screen.findByRole("alert")).toHaveTextContent(/no es válido o ya venció/i);
    expect(h.replace).not.toHaveBeenCalled();
  });
});

describe("VerifyEmailPanel", () => {
  it("explains to check the inbox, resends with the stored email and the right callback", async () => {
    savePendingVerification({ email: "a@example.com", next: "/resultado", sentAt: Date.now() - 120_000 });
    h.sendVerificationEmail.mockResolvedValue({ data: { status: true }, error: null });
    render(<VerifyEmailPanel emailEnabled />);
    expect(screen.getByText(/revisa tu bandeja de entrada/i)).toBeInTheDocument();
    expect(screen.getByText("a@example.com")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /reenviar correo/i }));
    expect(h.sendVerificationEmail).toHaveBeenCalledWith({
      email: "a@example.com",
      callbackURL: "/cuenta/entrar?verificado=1&next=%2Fresultado",
    });
  });

  it("starts in cooldown when the mail was sent seconds ago", () => {
    savePendingVerification({ email: "a@example.com", next: null, sentAt: Date.now() - 10_000 });
    render(<VerifyEmailPanel emailEnabled />);
    expect(screen.getByRole("button", { name: /reenviar correo/i })).toBeDisabled();
  });

  it("asks for the email when nothing is stored", () => {
    render(<VerifyEmailPanel emailEnabled />);
    expect(screen.getByLabelText(/correo/i)).toBeInTheDocument();
  });

  it("says nothing needs confirming when email is not enabled", () => {
    render(<VerifyEmailPanel emailEnabled={false} />);
    expect(screen.queryByRole("button", { name: /reenviar/i })).not.toBeInTheDocument();
  });
});
