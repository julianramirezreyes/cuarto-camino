import { notFound } from "next/navigation";
import { ENNEAGRAM_TYPES, type EnneagramType } from "@/domain/enneagram/structure";

/** Parses the [n] route segment; calls notFound() for anything that is not 1..9. */
export function parseTypeParam(n: string): EnneagramType {
  const value = /^[1-9]$/.test(n) ? (Number(n) as EnneagramType) : null;
  if (value === null || !ENNEAGRAM_TYPES.includes(value)) notFound();
  return value;
}

export function typeStaticParams() {
  return ENNEAGRAM_TYPES.map((n) => ({ n: String(n) }));
}

export type TypeParams = { params: Promise<{ n: string }> };
