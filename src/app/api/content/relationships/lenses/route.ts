import { RELATIONSHIP_LENSES } from "@/content/relationships";

/** Public editorial content (no user data): safe to cache at the CDN/browser for an hour. */
export async function GET() {
  return Response.json(RELATIONSHIP_LENSES, {
    headers: { "X-Content-Type-Options": "nosniff", "Cache-Control": "public, max-age=3600" },
  });
}
