import type { EmailMessage } from "./types";

const BRAND = "Cuarto Camino";
const EXPIRY = "1 hora";

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Escapes a value for use in HTML text or a double/single-quoted attribute. */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
}

const greeting = (name?: string) => (name?.trim() ? `Hola, ${name.trim()}.` : "Hola,");

interface Layout {
  heading: string;
  paragraphs: string[];
  action?: { label: string; url: string };
  footnote: string;
}

/** Plain-text + HTML bodies from one structure, so they never drift. No images, no tracking. */
function render(layout: Layout, name?: string): Pick<EmailMessage, "text" | "html"> {
  const hello = greeting(name);
  const textParts = [hello, "", ...layout.paragraphs.flatMap((p) => [p, ""])];
  if (layout.action) textParts.push(`${layout.action.label}:`, layout.action.url, "");
  textParts.push(layout.footnote, "", `— ${BRAND}`);

  const p = (s: string) => `<p style="margin:0 0 16px">${escapeHtml(s)}</p>`;
  const html = [
    `<!doctype html><html lang="es"><body style="margin:0;padding:24px;background:#faf7f2;color:#1f1b16;font-family:Georgia,'Times New Roman',serif">`,
    `<div style="max-width:520px;margin:0 auto;font-size:16px;line-height:1.5">`,
    `<p style="margin:0 0 24px;font-size:20px;font-weight:bold">${escapeHtml(BRAND)}</p>`,
    `<h1 style="margin:0 0 16px;font-size:22px">${escapeHtml(layout.heading)}</h1>`,
    p(hello),
    ...layout.paragraphs.map(p),
    layout.action
      ? `<p style="margin:0 0 16px"><a href="${escapeHtml(layout.action.url)}" style="display:inline-block;padding:12px 24px;border-radius:999px;background:#1f1b16;color:#faf7f2;text-decoration:none">${escapeHtml(layout.action.label)}</a></p>` +
        `<p style="margin:0 0 16px;font-size:14px;color:#5b5348">Si el botón no funciona, copia este enlace en tu navegador:<br><span style="word-break:break-all">${escapeHtml(layout.action.url)}</span></p>`
      : "",
    `<p style="margin:24px 0 0;font-size:14px;color:#5b5348">${escapeHtml(layout.footnote)}</p>`,
    `</div></body></html>`,
  ].join("");

  return { text: textParts.join("\n"), html };
}

export function buildVerificationEmail(args: { to: string; name?: string; url: string }): EmailMessage {
  return {
    to: args.to,
    subject: "Confirma tu correo",
    ...render(
      {
        heading: "Confirma tu correo",
        paragraphs: [
          `Gracias por crear tu cuenta en ${BRAND}. Confirma que este correo es tuyo para poder entrar.`,
          `El enlace vale ${EXPIRY}.`,
        ],
        action: { label: "Confirmar mi correo", url: args.url },
        footnote: "Si no creaste la cuenta, ignora este mensaje: no pasará nada.",
      },
      args.name,
    ),
  };
}

export function buildPasswordResetEmail(args: { to: string; name?: string; url: string }): EmailMessage {
  return {
    to: args.to,
    subject: "Restablece tu contraseña",
    ...render(
      {
        heading: "Restablece tu contraseña",
        paragraphs: [
          `Recibimos una solicitud para restablecer la contraseña de tu cuenta en ${BRAND}.`,
          `El enlace vale ${EXPIRY} y solo se puede usar una vez.`,
        ],
        action: { label: "Elegir una contraseña nueva", url: args.url },
        footnote: "Si no lo pediste, ignora este mensaje; tu contraseña no cambia.",
      },
      args.name,
    ),
  };
}

export function buildPasswordChangedEmail(args: { to: string; name?: string }): EmailMessage {
  return {
    to: args.to,
    subject: "Cambiaste tu contraseña",
    ...render(
      {
        heading: "Cambiaste tu contraseña",
        paragraphs: [`La contraseña de tu cuenta en ${BRAND} se cambió hace un momento y cerramos tus sesiones abiertas.`],
        footnote: "Si no fuiste tú, restablece tu contraseña de inmediato desde «¿Olvidaste tu contraseña?» en la página de entrada.",
      },
      args.name,
    ),
  };
}
