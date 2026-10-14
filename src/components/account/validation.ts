export const MIN_PASSWORD_LENGTH = 10;
export const MAX_PASSWORD_LENGTH = 128;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateName(name: string): string | undefined {
  const v = name.trim();
  if (!v) return "Escribe tu nombre.";
  if (v.length > 80) return "Usa un nombre de hasta 80 caracteres.";
}

export function validateEmail(email: string): string | undefined {
  const v = email.trim();
  if (!EMAIL.test(v) || v.length > 254) return "Escribe un correo válido, por ejemplo nombre@dominio.com.";
}

export function validateNewPassword(password: string): string | undefined {
  if (password.length < MIN_PASSWORD_LENGTH) return `La contraseña necesita al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  if (password.length > MAX_PASSWORD_LENGTH) return `Usa como máximo ${MAX_PASSWORD_LENGTH} caracteres.`;
}
