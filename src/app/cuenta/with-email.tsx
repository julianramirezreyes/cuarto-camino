import type { ReactNode } from "react";
import { connection } from "next/server";
import { isEmailEnabled } from "@/lib/email";

/**
 * Resolves "can this deployment send mail?" per request, inside a Suspense boundary, so the page shell
 * (heading, header) stays statically prerendered while the env-derived flag is never frozen at build time.
 */
export async function WithEmail({ children }: { children: (emailEnabled: boolean) => ReactNode }) {
  await connection();
  return <>{children(isEmailEnabled())}</>;
}
