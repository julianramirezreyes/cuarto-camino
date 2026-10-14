// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { POLICY_VERSION } from "@/hooks/assessment-types";
import { ConsentForm } from "./consent-form";

afterEach(cleanup);

describe("ConsentForm", () => {
  it("keeps the submit button disabled until the checkbox is ticked", async () => {
    const onAccept = vi.fn();
    render(<ConsentForm onAccept={onAccept} />);
    const submit = screen.getByRole("button", { name: /comenzar/i });
    expect(submit).toBeDisabled();
    await userEvent.click(screen.getByRole("checkbox"));
    expect(submit).toBeEnabled();
    await userEvent.click(submit);
    expect(onAccept).toHaveBeenCalledTimes(1);
  });

  it("does not call onAccept without consent", async () => {
    const onAccept = vi.fn();
    render(<ConsentForm onAccept={onAccept} />);
    await userEvent.click(screen.getByRole("button", { name: /comenzar/i }));
    expect(onAccept).not.toHaveBeenCalled();
  });

  it("explains what is saved, deletion, provisional result, no diagnosis and Ley 1581", () => {
    render(<ConsentForm onAccept={() => {}} />);
    const text = document.body.textContent ?? "";
    expect(text).toMatch(/qué guardamos/i);
    expect(text).toMatch(/eliminar/i);
    expect(text).toMatch(/provisional/i);
    expect(text).toMatch(/no es un diagnóstico/i);
    expect(text).toMatch(/Ley 1581 de 2012/);
    expect(text).toContain(POLICY_VERSION);
  });

  it("tells the user this is a test version with draft content (pilot banner)", () => {
    render(<ConsentForm onAccept={() => {}} />);
    const banner = screen.getByRole("note", { name: /versión de prueba/i });
    expect(banner).toHaveTextContent(/borrador/i);
    expect(banner).toHaveTextContent(/no ha sido validad/i);
  });

  it("shows the pending-controller note while the legal data is not configured", () => {
    render(<ConsentForm onAccept={() => {}} />);
    expect(document.body.textContent).toMatch(/pendientes de completar/i);
  });

  it("disables the form while busy", () => {
    render(<ConsentForm onAccept={() => {}} busy />);
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });
});
