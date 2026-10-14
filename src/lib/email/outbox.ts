import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { EmailMessage, EmailTransport } from "./types";

export const DEFAULT_OUTBOX_FILE = ".tmp/outbox.jsonl";

type Env = Record<string, string | undefined>;
export type OutboxEntry = EmailMessage & { sentAt: string };

/**
 * Dev/test transport: appends one JSON line per message to a file. It contains full mail bodies
 * (including one-time links), so it must never exist in production: construction throws there.
 */
export function createOutboxTransport({
  file = DEFAULT_OUTBOX_FILE,
  env = process.env,
}: { file?: string; env?: Env } = {}): EmailTransport {
  if (env.NODE_ENV === "production") {
    throw new Error("The outbox email transport is disabled in production. Configure SMTP instead.");
  }
  return {
    async send(message) {
      await mkdir(path.dirname(path.resolve(/*turbopackIgnore: true*/ file)), { recursive: true });
      const entry: OutboxEntry = { ...message, sentAt: new Date().toISOString() };
      await appendFile(file, `${JSON.stringify(entry)}\n`, "utf8");
    },
  };
}

/** Last `limit` messages sent to `to` (case-insensitive), oldest first. Missing file -> []. */
export async function readOutbox(file: string, to: string, limit = 10): Promise<OutboxEntry[]> {
  let raw: string;
  try {
    raw = await readFile(file, "utf8");
  } catch {
    return [];
  }
  const wanted = to.trim().toLowerCase();
  const matches: OutboxEntry[] = [];
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    try {
      const entry = JSON.parse(line) as OutboxEntry;
      if (typeof entry.to === "string" && entry.to.toLowerCase() === wanted) matches.push(entry);
    } catch {
      /* skip corrupt line */
    }
  }
  return matches.slice(-limit);
}
