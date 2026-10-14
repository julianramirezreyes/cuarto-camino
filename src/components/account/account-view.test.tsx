// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AccountView } from "./account-view";

afterEach(cleanup);
const user = { name: "Ana", email: "ana@example.com" };

describe("AccountView", () => {
  it("shows email, name and the sign out action; no dead 'download' button", () => {
    render(<AccountView user={user} onSignOut={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("ana@example.com")).toBeInTheDocument();
    expect(screen.getByText("Ana")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cerrar sesión/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /descargar/i })).not.toBeInTheDocument();
  });

  it("signs out", async () => {
    const onSignOut = vi.fn().mockResolvedValue(undefined);
    render(<AccountView user={user} onSignOut={onSignOut} onDelete={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /cerrar sesión/i }));
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });

  it("asks for confirmation and the password before deleting; cancel deletes nothing", async () => {
    const onDelete = vi.fn();
    render(<AccountView user={user} onSignOut={vi.fn()} onDelete={onDelete} />);
    await userEvent.click(screen.getByRole("button", { name: /eliminar mi cuenta y mis datos/i }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveTextContent(/no se puede deshacer/i);
    expect(dialog).toHaveTextContent(/resultados/i);
    await userEvent.click(within(dialog).getByRole("button", { name: /cancelar/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it("requires the password, calls onDelete once, and confirms", async () => {
    let resolve!: (v: { ok: true }) => void;
    const onDelete = vi.fn().mockReturnValue(new Promise((r) => (resolve = r)));
    render(<AccountView user={user} onSignOut={vi.fn()} onDelete={onDelete} />);
    await userEvent.click(screen.getByRole("button", { name: /eliminar mi cuenta y mis datos/i }));
    const dialog = screen.getByRole("dialog");
    await userEvent.click(within(dialog).getByRole("button", { name: /sí, eliminar/i }));
    expect(onDelete).not.toHaveBeenCalled();
    expect(within(dialog).getByLabelText(/contraseña/i)).toHaveAttribute("autocomplete", "current-password");
    await userEvent.type(within(dialog).getByLabelText(/contraseña/i), "mi-clave-actual");
    await userEvent.click(within(dialog).getByRole("button", { name: /sí, eliminar/i }));
    expect(onDelete).toHaveBeenCalledWith("mi-clave-actual");
    expect(within(dialog).getByRole("button", { name: /eliminando/i })).toBeDisabled();
    resolve({ ok: true });
    expect(await screen.findByText(/eliminamos tu cuenta y tus datos/i)).toBeInTheDocument();
  });

  it("shows an error and keeps the dialog open when deletion fails", async () => {
    const onDelete = vi.fn().mockResolvedValue({ ok: false, message: "No pudimos eliminar tu cuenta." });
    render(<AccountView user={user} onSignOut={vi.fn()} onDelete={onDelete} />);
    await userEvent.click(screen.getByRole("button", { name: /eliminar mi cuenta y mis datos/i }));
    const dialog = screen.getByRole("dialog");
    await userEvent.type(within(dialog).getByLabelText(/contraseña/i), "mala-clave-123");
    await userEvent.click(within(dialog).getByRole("button", { name: /sí, eliminar/i }));
    expect(await within(dialog).findByRole("alert")).toHaveTextContent(/no pudimos eliminar/i);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
