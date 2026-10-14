/**
 * Legal data shown in the consent notice and the sign-up form: THE ONE PLACE TO COMPLETE.
 *
 * Fill the three `null` fields before sharing the app beyond a closed test group, then BUMP
 * `policyVersion` (it is stored with every consent record, so each version of the notice stays traceable).
 * Nothing here is invented: while a field is `null` the UI says it is pending.
 *
 * Context: Colombian Ley 1581 de 2012 (protección de datos personales). Have the final wording reviewed
 * by someone qualified; this file only holds the data, not legal advice.
 */
export interface LegalConfig {
  /** Nombre o razón social del responsable del tratamiento. */
  controllerName: string | null;
  /** Correo donde las personas pueden ejercer sus derechos (consulta, actualización, supresión). */
  controllerEmail: string | null;
  /** URL pública de la política de privacidad (https, o una ruta propia que empiece con "/"). */
  privacyPolicyUrl: string | null;
  /** Identifier saved with each consent. Change it whenever the notice or the data above changes. */
  policyVersion: string;
  /** Shows the "versión de prueba" banner. Set to false only after content review and the pilot. */
  isPilot: boolean;
}

export const LEGAL: LegalConfig = {
  controllerName: null,
  controllerEmail: null,
  privacyPolicyUrl: null,
  policyVersion: "2026-10-draft",
  isPilot: true,
};

/** https URLs or root-relative paths only: blocks javascript:, data:, protocol-relative and plain http. */
export function isSafeUrl(value: string): boolean {
  if (/^\/(?![/\\])\S*$/.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.length > 0 && !/\s/.test(value);
  } catch {
    return false;
  }
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Human-readable list of what is still missing or invalid (empty when the notice is complete). */
export function pendingLegalFields(config: LegalConfig): string[] {
  const pending: string[] = [];
  if (!config.controllerName?.trim()) pending.push("nombre o razón social del responsable");
  if (!config.controllerEmail || !EMAIL.test(config.controllerEmail.trim())) pending.push("correo de contacto del responsable");
  if (!config.privacyPolicyUrl || !isSafeUrl(config.privacyPolicyUrl.trim())) pending.push("URL de la política de privacidad");
  return pending;
}
