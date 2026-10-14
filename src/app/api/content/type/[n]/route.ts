import { buildTypeBundle, isEnneagramType } from "../../type-bundle";

/** Public editorial content (no user data): safe to cache at the CDN/browser for an hour. */
const HEADERS = { "X-Content-Type-Options": "nosniff" } as const;

export async function GET(_request: Request, ctx: { params: Promise<{ n: string }> }) {
  const { n } = await ctx.params;
  const type = /^[1-9]$/.test(n) ? Number(n) : NaN;
  if (!isEnneagramType(type)) {
    return Response.json({ error: "not_found" }, { status: 404, headers: { ...HEADERS, "Cache-Control": "no-store" } });
  }
  return Response.json(buildTypeBundle(type), { headers: { ...HEADERS, "Cache-Control": "public, max-age=3600" } });
}
