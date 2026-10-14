import type { SubmitResult } from "./field";

export type AuthError = { status?: number; code?: string } | null | undefined;

export const RATE_LIMITED = "Hiciste muchos intentos seguidos. Espera un minuto e inténtalo de nuevo.";
export const NETWORK_ERROR = "No pudimos conectar. Revisa tu conexión e inténtalo de nuevo.";

export const isRateLimited = (error: AuthError) => error?.status === 429;

export function signInFailure(error: AuthError): Extract<SubmitResult, { ok: false }> {
  if (isRateLimited(error)) return { ok: false, message: RATE_LIMITED };
  // Better Auth only answers this after the password matched, so it does not reveal unknown emails.
  if (error?.code === "EMAIL_NOT_VERIFIED") {
    return {
      ok: false,
      code: "email-not-verified",
      message: "Tienes que confirmar tu correo antes de entrar. Revisa tu bandeja de entrada o pide otro enlace.",
    };
  }
  return { ok: false, message: "Correo o contraseña incorrectos." };
}

export function signUpFailure(error: AuthError): Extract<SubmitResult, { ok: false }> {
  if (isRateLimited(error)) return { ok: false, message: RATE_LIMITED };
  // Deliberately generic: do not confirm whether an email is already registered.
  return {
    ok: false,
    message: "No pudimos crear la cuenta con esos datos. Si ya tienes una, entra con tu correo y contraseña.",
  };
}
