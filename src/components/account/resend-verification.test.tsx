// @vitest-environment jsdom
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ResendVerification } from "./resend-verification";

beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const user = () => userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

describe("ResendVerification", () => {
  it("sends, shows a generic message and starts a 60 s cooldown", async () => {
    const onResend = vi.fn().mockResolvedValue({ ok: true });
    render(<ResendVerification email="a@example.com" onResend={onResend} />);
    await user().click(screen.getByRole("button", { name: /reenviar correo/i }));
    expect(onResend).toHaveBeenCalledWith("a@example.com");
    expect(await screen.findByRole("status")).toHaveTextContent(/si el correo está registrado/i);
    const button = screen.getByRole("button", { name: /reenviar correo/i });
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("60");
  });

  it("counts down and re-enables after 60 seconds", async () => {
    const onResend = vi.fn().mockResolvedValue({ ok: true });
    render(<ResendVerification email="a@example.com" onResend={onResend} />);
    await user().click(screen.getByRole("button", { name: /reenviar correo/i }));
    await screen.findByRole("status");
    await act(async () => void vi.advanceTimersByTime(30_000));
    expect(screen.getByRole("button", { name: /reenviar correo/i })).toHaveTextContent("30");
    await act(async () => void vi.advanceTimersByTime(30_000));
    expect(screen.getByRole("button", { name: /reenviar correo/i })).toBeEnabled();
  });

  it("starts already cooling down when mail was just sent", () => {
    render(<ResendVerification email="a@example.com" onResend={vi.fn()} initialCooldown={42} />);
    expect(screen.getByRole("button", { name: /reenviar correo/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /reenviar correo/i })).toHaveTextContent("42");
  });

  it("does not start a cooldown on failure and shows the error", async () => {
    const onResend = vi.fn().mockResolvedValue({ ok: false, message: "Hiciste muchos intentos." });
    render(<ResendVerification email="a@example.com" onResend={onResend} />);
    await user().click(screen.getByRole("button", { name: /reenviar correo/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/muchos intentos/i);
    expect(screen.getByRole("button", { name: /reenviar correo/i })).toBeEnabled();
  });

  it("asks for the email when it is not known and validates it", async () => {
    const onResend = vi.fn().mockResolvedValue({ ok: true });
    render(<ResendVerification onResend={onResend} />);
    const u = user();
    await u.click(screen.getByRole("button", { name: /reenviar correo/i }));
    expect(onResend).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/correo/i)).toHaveFocus();
    await u.type(screen.getByLabelText(/correo/i), "b@example.com");
    await u.click(screen.getByRole("button", { name: /reenviar correo/i }));
    expect(onResend).toHaveBeenCalledWith("b@example.com");
  });
});
