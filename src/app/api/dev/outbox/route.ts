import { connection } from "next/server";
import { DEFAULT_OUTBOX_FILE, readOutbox } from "@/lib/email/outbox";

/**
 * Dev/test only: the last mails the outbox transport wrote for an address, so tests can fetch the
 * verification / reset links. Hard 404 in production and whenever the outbox is not the active transport.
 */
export async function GET(request: Request) {
  // Env-dependent and per request: must never be prerendered at build time.
  await connection();
  if (process.env.NODE_ENV === "production" || process.env.EMAIL_TRANSPORT?.trim().toLowerCase() !== "outbox") {
    return new Response("Not found", { status: 404 });
  }
  const to = new URL(request.url).searchParams.get("to")?.trim();
  if (!to) return Response.json({ error: "missing_to" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  const file = process.env.EMAIL_OUTBOX_FILE?.trim() || DEFAULT_OUTBOX_FILE;
  const messages = await readOutbox(file, to, 10);
  return Response.json({ messages }, { headers: { "Cache-Control": "no-store" } });
}
