// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { forcedChoice, likert, progress } from "./fixtures";

const push = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

import { AssessmentFlow } from "./assessment-flow";

afterEach(cleanup);

type Handler = (init?: RequestInit) => Response | Promise<Response>;
let routes: Record<string, Handler>;
let calls: { key: string; body?: unknown }[];

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

beforeEach(() => {
  push.mockReset();
  calls = [];
  routes = {};
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      const key = `${init?.method ?? "GET"} ${url}`;
      calls.push({ key, body: init?.body ? JSON.parse(init.body as string) : undefined });
      const handler = routes[key];
      if (!handler) throw new Error(`unmocked ${key}`);
      return handler(init);
    }),
  );
});

const assessment = { id: "as1", status: "in_progress" };

function noCurrent() {
  routes["GET /api/assessments/current"] = () => json({ error: "not_found" }, 404);
}
function withCurrent() {
  routes["GET /api/assessments/current"] = () => json({ assessment, question: forcedChoice, progress });
}
function startOk(question = forcedChoice, p = { ...progress, answered: 0, moduleIndex: 0 }) {
  routes["POST /api/assessments"] = () => json({ assessment, question, progress: p, resumed: false }, 201);
}

async function accept() {
  await userEvent.click(await screen.findByRole("checkbox"));
  await userEvent.click(screen.getByRole("button", { name: /comenzar/i }));
}

describe("AssessmentFlow", () => {
  it("shows consent first when there is no assessment, then the first question", async () => {
    noCurrent();
    startOk();
    render(<AssessmentFlow />);
    await accept();
    expect(await screen.findByRole("heading", { name: forcedChoice.text })).toBeInTheDocument();
    expect(calls.find((c) => c.key === "POST /api/assessments")?.body).toEqual({
      consent: true,
      policyVersion: "2026-10-draft",
    });
  });

  it("offers to resume an existing assessment and continues", async () => {
    withCurrent();
    render(<AssessmentFlow />);
    await userEvent.click(await screen.findByRole("button", { name: "Continuar donde lo dejaste" }));
    expect(await screen.findByRole("heading", { name: forcedChoice.text })).toBeInTheDocument();
  });

  it("starts over: DELETE then POST", async () => {
    withCurrent();
    startOk();
    routes["DELETE /api/assessments/as1"] = () => new Response(null, { status: 204 });
    render(<AssessmentFlow />);
    await userEvent.click(await screen.findByRole("button", { name: "Empezar de nuevo" }));
    await screen.findByRole("heading", { name: forcedChoice.text });
    const keys = calls.map((c) => c.key);
    expect(keys.indexOf("DELETE /api/assessments/as1")).toBeLessThan(keys.indexOf("POST /api/assessments"));
  });

  it("submits the answer immediately on selection and shows the next question", async () => {
    withCurrent();
    routes["POST /api/assessments/as1/answers"] = () =>
      json({ question: likert, progress: { ...progress, answered: 4 }, done: false });
    render(<AssessmentFlow />);
    await userEvent.click(await screen.findByRole("button", { name: "Continuar donde lo dejaste" }));
    await userEvent.click(await screen.findByRole("button", { name: /Busco que todos/ }));
    expect(await screen.findByRole("heading", { name: likert.text })).toBeInTheDocument();
    expect(calls.find((c) => c.key.endsWith("/answers"))?.body).toEqual({ questionId: "q1", optionId: "b" });
  });

  it("navigates to /resultado when done", async () => {
    withCurrent();
    routes["POST /api/assessments/as1/answers"] = () => json({ question: null, progress, done: true });
    render(<AssessmentFlow />);
    await userEvent.click(await screen.findByRole("button", { name: "Continuar donde lo dejaste" }));
    await userEvent.keyboard("1");
    await waitFor(() => expect(push).toHaveBeenCalledWith("/resultado"));
  });

  it("goes back using /back and restores the saved selection", async () => {
    withCurrent();
    routes["POST /api/assessments/as1/back"] = () =>
      json({ question: { ...forcedChoice, selectedOptionId: "a" }, progress: { ...progress, answered: 2 } });
    render(<AssessmentFlow />);
    await userEvent.click(await screen.findByRole("button", { name: "Continuar donde lo dejaste" }));
    await userEvent.click(screen.getByRole("button", { name: /anterior/i }));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /Me anticipo/ })).toHaveAttribute("aria-pressed", "true"),
    );
    expect(calls.some((c) => c.key === "POST /api/assessments/as1/back")).toBe(true);
  });

  it("disables back on the very first question", async () => {
    withCurrent();
    routes["GET /api/assessments/current"] = () =>
      json({ assessment, question: forcedChoice, progress: { ...progress, answered: 0, moduleIndex: 0 } });
    render(<AssessmentFlow />);
    await userEvent.click(await screen.findByRole("button", { name: "Continuar donde lo dejaste" }));
    expect(screen.getByRole("button", { name: /anterior/i })).toBeDisabled();
  });

  async function pauseFromFirstQuestion() {
    withCurrent();
    routes["POST /api/assessments/as1/pause"] = () => json({ status: "paused" });
    render(<AssessmentFlow />);
    await userEvent.click(await screen.findByRole("button", { name: "Continuar donde lo dejaste" }));
    await userEvent.click(screen.getByRole("button", { name: /^pausar$/i }));
    await userEvent.click(screen.getByRole("button", { name: "Pausar y guardar" }));
    expect(await screen.findByRole("heading", { name: /pausa guardada/i })).toBeInTheDocument();
  }

  it("pauses through the dialog and saves the pause on the server", async () => {
    await pauseFromFirstQuestion();
    expect(calls.some((c) => c.key === "POST /api/assessments/as1/pause")).toBe(true);
  });

  it("'Seguir ahora' returns to the same question right away, without asking the server again", async () => {
    await pauseFromFirstQuestion();
    const currentCallsBefore = calls.filter((c) => c.key === "GET /api/assessments/current").length;
    await userEvent.click(screen.getByRole("button", { name: "Seguir ahora" }));
    expect(screen.getByRole("button", { name: /Me anticipo/ })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /pausa guardada/i })).not.toBeInTheDocument();
    expect(calls.filter((c) => c.key === "GET /api/assessments/current")).toHaveLength(currentCallsBefore);
  });

  it("the way out of the pause leads to a DIFFERENT page (a link to the page you are already on does nothing)", async () => {
    await pauseFromFirstQuestion();
    const exit = screen.getByRole("link", { name: /salir y seguir más tarde/i });
    expect(exit).toHaveAttribute("href", "/");
    expect(screen.queryByRole("link", { name: /continuar más tarde/i })).not.toBeInTheDocument();
  });

  it("opens the pause dialog with Escape", async () => {
    withCurrent();
    render(<AssessmentFlow />);
    await userEvent.click(await screen.findByRole("button", { name: "Continuar donde lo dejaste" }));
    await userEvent.keyboard("{Escape}");
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("shows an error with Retry and recovers", async () => {
    withCurrent();
    let attempts = 0;
    routes["POST /api/assessments/as1/answers"] = () =>
      ++attempts === 1
        ? json({ error: "internal" }, 500)
        : json({ question: likert, progress: { ...progress, answered: 4 }, done: false });
    render(<AssessmentFlow />);
    await userEvent.click(await screen.findByRole("button", { name: "Continuar donde lo dejaste" }));
    await userEvent.keyboard("2");
    expect(await screen.findByRole("alert")).toHaveTextContent(/salió mal/i);
    await userEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(await screen.findByRole("heading", { name: likert.text })).toBeInTheDocument();
    expect(attempts).toBe(2);
  });

  it("shows an offline message when the network fails", async () => {
    routes["GET /api/assessments/current"] = () => {
      throw new TypeError("Failed to fetch");
    };
    render(<AssessmentFlow />);
    expect(await screen.findByRole("alert")).toHaveTextContent(/conexión/i);
  });

  it("explains rate limiting", async () => {
    withCurrent();
    routes["POST /api/assessments/as1/answers"] = () => json({ error: "rate_limited" }, 429);
    render(<AssessmentFlow />);
    await userEvent.click(await screen.findByRole("button", { name: "Continuar donde lo dejaste" }));
    await userEvent.keyboard("1");
    expect(await screen.findByRole("alert")).toHaveTextContent(/demasiado rápido/i);
  });
});
