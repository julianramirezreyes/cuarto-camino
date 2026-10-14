// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ResetPasswordForm } from "./reset-password-form";

afterEach(cleanup);
const submit = () => userEvent.click(screen.getByRole("button", { name: /cambiar contraseña/i }));
const fill = async (a: string, b: string) => {
  await userEvent.type(screen.getByLabelText(/^contraseña nueva/i), a);
  await userEvent.type(screen.getByLabelText(/repite la contraseña/i), b);
};

describe("ResetPasswordForm", () => {
  it("uses new-password autocomplete on both fields", () => {
    render(<ResetPasswordForm token="t" onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/^contraseña nueva/i)).toHaveAttribute("autocomplete", "new-password");
    expect(screen.getByLabelText(/repite la contraseña/i)).toHaveAttribute("autocomplete", "new-password");
  });

  it("enforces the minimum length", async () => {
    const onSubmit = vi.fn();
    render(<ResetPasswordForm token="t" onSubmit={onSubmit} />);
    await fill("corta", "corta");
    await submit();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/^contraseña nueva/i)).toHaveAccessibleDescription(/al menos 10/i);
  });

  it("reports a mismatch and does not submit", async () => {
    const onSubmit = vi.fn();
    render(<ResetPasswordForm token="t" onSubmit={onSubmit} />);
    await fill("una-clave-larga-1", "una-clave-larga-2");
    await submit();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/repite la contraseña/i)).toHaveAccessibleDescription(/no coinciden/i);
    expect(screen.getByLabelText(/repite la contraseña/i)).toHaveFocus();
  });

  it("submits the token's new password once", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ ok: true });
    render(<ResetPasswordForm token="tok" onSubmit={onSubmit} />);
    await fill("una-clave-larga-1", "una-clave-larga-1");
    await submit();
    expect(onSubmit).toHaveBeenCalledWith("una-clave-larga-1");
    expect(await screen.findByRole("status")).toHaveTextContent(/cambió/i);
  });

  it("shows a clear message and a link to request another when the server says the token is invalid or expired", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ ok: false, code: "invalid-token", message: "x" });
    render(<ResetPasswordForm token="tok" onSubmit={onSubmit} />);
    await fill("una-clave-larga-1", "una-clave-larga-1");
    await submit();
    expect(await screen.findByRole("alert")).toHaveTextContent(/no es válido o ya venció/i);
    expect(screen.getByRole("link", { name: /pedir un enlace nuevo/i })).toHaveAttribute("href", "/cuenta/recuperar");
    expect(screen.queryByLabelText(/^contraseña nueva/i)).not.toBeInTheDocument();
  });

  it("shows the invalid-link state without a token or with an error from the link", () => {
    const { rerender } = render(<ResetPasswordForm token={null} onSubmit={vi.fn()} />);
    expect(screen.getByRole("alert")).toHaveTextContent(/no es válido o ya venció/i);
    rerender(<ResetPasswordForm token="t" linkError onSubmit={vi.fn()} />);
    expect(screen.getByRole("alert")).toHaveTextContent(/no es válido o ya venció/i);
  });

  it("shows other failures inline and keeps the form", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ ok: false, message: "Hiciste muchos intentos." });
    render(<ResetPasswordForm token="tok" onSubmit={onSubmit} />);
    await fill("una-clave-larga-1", "una-clave-larga-1");
    await submit();
    expect(await screen.findByRole("alert")).toHaveTextContent(/muchos intentos/i);
    expect(screen.getByLabelText(/^contraseña nueva/i)).toBeInTheDocument();
  });
});
