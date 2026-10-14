import { connection } from "next/server";
import { assessmentHandlers } from "@/features/assessment/container";

export async function GET(request: Request, ctx: { params: Promise<{ id: string }> }) {
  await connection(); // per-user data: never prerender at build time
  return assessmentHandlers.result(request, ctx);
}
