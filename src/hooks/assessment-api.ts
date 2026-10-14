import type { AssessmentRef, Progress, QuestionDTO } from "./assessment-types";

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
  ) {
    super(code);
    this.name = "ApiError";
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: init?.body ? { "Content-Type": "application/json" } : undefined,
    });
  } catch {
    throw new ApiError("network", 0);
  }
  if (res.status === 204) return undefined as T;
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    // non-JSON body: handled below
  }
  if (!res.ok) {
    const code = (body as { error?: string } | null)?.error ?? "unknown";
    throw new ApiError(code, res.status);
  }
  return body as T;
}

const post = (url: string, payload?: unknown) =>
  request<never>(url, { method: "POST", body: payload === undefined ? undefined : JSON.stringify(payload) });

export interface CurrentResponse {
  assessment: AssessmentRef;
  question: QuestionDTO | null;
  progress: Progress;
}

export interface StartResponse extends CurrentResponse {
  resumed: boolean;
}

export interface AnswerResponse {
  question: QuestionDTO | null;
  progress: Progress;
  done: boolean;
}

export interface BackResponse {
  question: QuestionDTO;
  progress: Progress;
}

export const assessmentApi = {
  /** Returns null when the visitor has no assessment yet (404). */
  async getCurrent(): Promise<CurrentResponse | null> {
    try {
      return await request<CurrentResponse>("/api/assessments/current");
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) return null;
      throw e;
    }
  },
  start: (policyVersion: string) =>
    post("/api/assessments", { consent: true, policyVersion }) as Promise<StartResponse>,
  answer: (id: string, questionId: string, optionId: string) =>
    post(`/api/assessments/${id}/answers`, { questionId, optionId }) as Promise<AnswerResponse>,
  back: (id: string, questionId: string) =>
    post(`/api/assessments/${id}/back`, { questionId }) as Promise<BackResponse>,
  pause: (id: string) => post(`/api/assessments/${id}/pause`) as Promise<{ status: "paused" }>,
  remove: (id: string) => request<void>(`/api/assessments/${id}`, { method: "DELETE" }),
};

export function errorMessage(error: { code: string; status: number }): string {
  if (error.code === "network") {
    return "Parece que no tienes conexión. Revisa tu internet e inténtalo de nuevo.";
  }
  switch (error.status) {
    case 429:
      return "Vamos demasiado rápido. Espera unos segundos e inténtalo de nuevo.";
    case 401:
      return "Tu sesión terminó. Recarga la página para continuar.";
    case 404:
      return "No encontramos tu evaluación. Puedes empezar de nuevo.";
    case 409:
      return "Tu evaluación cambió en otra pestaña. Recarga para ver el estado actual.";
    default:
      return "Algo salió mal de nuestro lado. Inténtalo de nuevo.";
  }
}
