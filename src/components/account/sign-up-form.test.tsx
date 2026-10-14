// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SignUpForm } from "./sign-up-form";

afterEach(cleanup);

async function fill(opts: { name?: string; email?: string; password?: string; consent?: boolean } = {}) {
  const { name = "Ana", email = "ana@example.com", password = "una-clave-larga-1", consent = true } = opts;
  if (name) await userEvent.type(screen.getByLabelText(/nombre/i), name);
  if (email) await userEvent.type(screen.getByLabelText(/correo/i), email);
  if (password) await userEvent.type(screen.getByLabelText(/contraseña/i), password);
  if (consent) await userEvent.click(screen.getByRole("checkbox"));
}
const submit = () => userEvent.click(screen.getByRole("button", { name: /crear cuenta/i }));

describe("SignUpForm", () => {
  it("sets the right autocomplete/type attributes and shows the password requirements", () => {
    render(<SignUpForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/correo/i)).toHaveAttribute("autocomplete", "email");
    expect(screen.getByLabelText(/correo/i)).toHaveAttribute("type", "email");
    const pw = screen.getByLabelText(/contraseña/i);
    expect(pw).toHaveAttribute("autocomplete", "new-password");
    expect(pw).toHaveAttribute("type", "password");
    expect(screen.getByText(/al menos 10 caracteres/i)).toBeInTheDocument();
    expect(pw).toHaveAccessibleDescription(/al menos 10 caracteres/i);
  });

  it("is a POST-less form: no password can end up in the URL", () => {
    const { container } = render(<SignUpForm onSubmit={vi.fn()} />);
    const form = container.querySelector("form")!;
    expect(form.getAttribute("method")?.toLowerCase()).toBe("post");
    expect(form).toHaveAttribute("noValidate");
  });

  it("shows validation messages, focuses the first invalid field and does not submit", async () => {
    const onSubmit = vi.fn();
    render(<SignUpForm onSubmit={onSubmit} />);
    await submit();
    expect(onSubmit).not.toHaveBeenCalled();
    const name = screen.getByLabelText(/nombre/i);
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription(/escribe tu nombre/i);
    expect(name).toHaveFocus();
    expect(screen.getByLabelText(/correo/i)).toHaveAccessibleDescription(/correo válido/i);
    expect(screen.getByLabelText(/contraseña/i)).toHaveAccessibleDescription(/10 caracteres/i);
    expect(screen.getByRole("checkbox")).toHaveAccessibleDescription(/necesitamos tu autorización/i);
  });

  it("requires the explicit consent checkbox", async () => {
    const onSubmit = vi.fn();
    render(<SignUpForm onSubmit={onSubmit} />);
    await fill({ consent: false });
    await submit();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("checkbox")).toHaveFocus();
  });

  it("rejects short passwords", async () => {
    const onSubmit = vi.fn();
    render(<SignUpForm onSubmit={onSubmit} />);
    await fill({ password: "corta123" });
    await submit();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/contraseña/i)).toHaveAttribute("aria-invalid", "true");
  });

  it("submits trimmed values once and disables the button while pending (no double submit)", async () => {
    let resolve!: (v: { ok: true }) => void;
    const onSubmit = vi.fn().mockReturnValue(new Promise((r) => (resolve = r)));
    render(<SignUpForm onSubmit={onSubmit} />);
    await fill({ name: "  Ana  ", email: " ana@example.com " });
    await submit();
    await userEvent.click(screen.getByRole("button", { name: /creando/i }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({ name: "Ana", email: "ana@example.com", password: "una-clave-larga-1" });
    expect(screen.getByRole("button", { name: /creando/i })).toBeDisabled();
    resolve({ ok: true });
    await waitFor(() => expect(screen.getByRole("button", { name: /crear cuenta/i })).toBeEnabled());
  });

  it("shows the server error message in an alert and re-enables the form", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ ok: false, message: "No pudimos crear la cuenta." });
    render(<SignUpForm onSubmit={onSubmit} />);
    await fill();
    await submit();
    expect(await screen.findByRole("alert")).toHaveTextContent("No pudimos crear la cuenta.");
    expect(screen.getByRole("button", { name: /crear cuenta/i })).toBeEnabled();
  });

  it("links to the sign-in page keeping the next param", () => {
    render(<SignUpForm onSubmit={vi.fn()} next="/resultado" />);
    expect(screen.getByRole("link", { name: /ya tengo cuenta/i })).toHaveAttribute("href", "/cuenta/entrar?next=%2Fresultado");
  });

  it("explains what is kept and mentions the privacy terms", () => {
    render(<SignUpForm onSubmit={vi.fn()} />);
    const text = document.body.textContent ?? "";
    expect(text).toMatch(/Ley 1581 de 2012/);
    expect(text).toMatch(/eliminar tu cuenta/i);
    expect(text).toMatch(/sin verificar|no verificamos/i);
  });
});
