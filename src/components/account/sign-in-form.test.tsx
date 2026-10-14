// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SignInForm } from "./sign-in-form";

afterEach(cleanup);
const submit = () => userEvent.click(screen.getByRole("button", { name: /^entrar/i }));

describe("SignInForm", () => {
  it("uses email/current-password autocomplete", () => {
    render(<SignInForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/correo/i)).toHaveAttribute("autocomplete", "email");
    expect(screen.getByLabelText(/contraseña/i)).toHaveAttribute("autocomplete", "current-password");
  });

  it("validates empty fields and focuses the first", async () => {
    const onSubmit = vi.fn();
    render(<SignInForm onSubmit={onSubmit} />);
    await submit();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/correo/i)).toHaveFocus();
    expect(screen.getByLabelText(/contraseña/i)).toHaveAccessibleDescription(/escribe tu contraseña/i);
  });

  it("shows a generic error that does not reveal whether the email exists", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ ok: false, message: "Correo o contraseña incorrectos." });
    render(<SignInForm onSubmit={onSubmit} />);
    await userEvent.type(screen.getByLabelText(/correo/i), "a@example.com");
    await userEvent.type(screen.getByLabelText(/contraseña/i), "whatever-pass");
    await submit();
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/correo o contraseña incorrectos/i);
    expect(alert.textContent).not.toMatch(/no existe|no encontr|registrad/i);
  });

  it("disables the button while pending and submits once", async () => {
    let resolve!: (v: { ok: true }) => void;
    const onSubmit = vi.fn().mockReturnValue(new Promise((r) => (resolve = r)));
    render(<SignInForm onSubmit={onSubmit} />);
    await userEvent.type(screen.getByLabelText(/correo/i), "a@example.com");
    await userEvent.type(screen.getByLabelText(/contraseña/i), "whatever-pass");
    await submit();
    expect(screen.getByRole("button", { name: /entrando/i })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: /entrando/i }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    resolve({ ok: true });
  });

  it("does not offer a password reset unless email is enabled", () => {
    render(<SignInForm onSubmit={vi.fn()} />);
    expect(document.body.textContent).not.toMatch(/olvid/i);
  });

  it("offers '¿Olvidaste tu contraseña?' when email is enabled", () => {
    render(<SignInForm onSubmit={vi.fn()} showForgotPassword />);
    expect(screen.getByRole("link", { name: /¿olvidaste tu contraseña\?/i })).toHaveAttribute("href", "/cuenta/recuperar");
  });

  it("shows a notice passed by the page", () => {
    render(<SignInForm onSubmit={vi.fn()} notice="Contraseña cambiada." />);
    expect(screen.getByRole("status")).toHaveTextContent("Contraseña cambiada.");
  });

  it("when the server says the email is not verified, shows a specific message and a resend action", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ ok: false, code: "email-not-verified", message: "Tienes que confirmar tu correo." });
    const onResend = vi.fn().mockResolvedValue({ ok: true });
    render(<SignInForm onSubmit={onSubmit} onResendVerification={onResend} />);
    await userEvent.type(screen.getByLabelText(/correo/i), "a@example.com");
    await userEvent.type(screen.getByLabelText(/contraseña/i), "whatever-pass");
    await submit();
    expect(await screen.findByRole("alert")).toHaveTextContent(/confirmar tu correo/i);
    await userEvent.click(screen.getByRole("button", { name: /reenviar correo/i }));
    expect(onResend).toHaveBeenCalledWith("a@example.com");
  });

  it("links to sign-up keeping next", () => {
    render(<SignInForm onSubmit={vi.fn()} next="/resultado" />);
    expect(screen.getByRole("link", { name: /crear cuenta/i })).toHaveAttribute("href", "/cuenta/registro?next=%2Fresultado");
  });
});
