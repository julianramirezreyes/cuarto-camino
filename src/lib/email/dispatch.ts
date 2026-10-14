import { after } from "next/server";
import type { EmailMessage, EmailTransport } from "./types";

type Schedule = (task: Promise<void>) => void;

/**
 * Keeps the work alive after the response is sent. In a Next.js request scope `after()` extends the
 * invocation (waitUntil on Vercel); anywhere else (scripts, tests) it falls back to a detached promise.
 */
const scheduleAfterResponse: Schedule = (task) => {
  try {
    after(() => task);
  } catch {
    void task;
  }
};

/**
 * Sends without blocking the caller: the response time must not reveal whether a mail was sent
 * (account enumeration) and a slow SMTP server must not stall sign-up. Failures never propagate and
 * are logged as a generic code only: never the address, body, link or provider error text.
 */
export async function dispatchEmail(
  transport: EmailTransport,
  message: EmailMessage,
  { schedule = scheduleAfterResponse }: { schedule?: Schedule } = {},
): Promise<void> {
  const task = (async () => {
    try {
      await transport.send(message);
    } catch {
      console.error("[email] email_send_failed");
    }
  })();
  schedule(task);
}
