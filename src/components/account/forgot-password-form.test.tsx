// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ForgotPasswordForm } from "./forgot-password-form";

afterEach(cleanup);
const submit = () => userEvent.click(screen.getByRole("button", { name: /enviar instrucciones/i }));

describe("ForgotPasswordForm", () => {
  it("validates the email before submitting", async () => {
    const onSubmit = vi.fn();
    render(<ForgotPasswordForm onSubmit={onSubmit} />);
    await submit();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/correo/i)).toHaveFocus();
    expect(screen.getByLabelText(/correo/i)).toHaveAccessibleDescription(/correo válido/i);
  });

  it("shows the same generic confirmation after submitting and never says whether the account exists", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ ok: true });
    render(<ForgotPasswordForm onSubmit={onSubmit} />);
    await userEvent.type(screen.getByLabelText(/correo/i), "nadie@example.com");
    await submit();
    expect(onSubmit).toHaveBeenCalledWith("nadie@example.com");
    const status = await screen.findByRole("status");
    expect(status).toHaveTextContent("Si existe una cuenta con ese correo, te enviamos instrucciones");
    expect(status.textContent).not.toMatch(/no existe|no encontr/i);
    expect(screen.queryByLabelText(/correo/i)).not.toBeInTheDocument();
  });

  it("shows a non-enumerating error when the request itself failed (rate limit, offline)", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ ok: false, message: "Hiciste muchos intentos seguidos." });
    render(<ForgotPasswordForm onSubmit={onSubmit} />);
    await userEvent.type(screen.getByLabelText(/correo/i), "a@example.com");
    await submit();
    expect(await screen.findByRole("alert")).toHaveTextContent(/muchos intentos/i);
    expect(screen.getByLabelText(/correo/i)).toBeInTheDocument();
  });

  it("submits once while pending", async () => {
    let resolve!: (v: { ok: true }) => void;
    const onSubmit = vi.fn().mockReturnValue(new Promise((r) => (resolve = r)));
    render(<ForgotPasswordForm onSubmit={onSubmit} />);
    await userEvent.type(screen.getByLabelText(/correo/i), "a@example.com");
    await submit();
    await userEvent.click(screen.getByRole("button", { name: /enviando/i }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    resolve({ ok: true });
  });

  it("links back to sign-in", () => {
    render(<ForgotPasswordForm onSubmit={vi.fn()} />);
    expect(screen.getByRole("link", { name: /volver a entrar/i })).toHaveAttribute("href", "/cuenta/entrar");
  });
});
