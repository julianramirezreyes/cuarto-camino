import { ZodError, type ZodType } from "zod";
import { guestCookieName, guestCookieOptions } from "@/lib/guest";
import { AssessmentError, type AssessmentErrorCode } from "./errors";
import type { GuestService } from "./guest-service";
import type { RateLimiter } from "./rate-limit";
import { clientIp } from "./rate-limit-shared";
import { answerBody, assessmentIdParam, backBody, startBody } from "./schemas";
import type { AssessmentService, Principal } from "./service";

export interface AssessmentApiDeps {
  service: AssessmentService;
  guests: GuestService;
  /** Authenticated user id from the Better Auth session, or null. Never trusts the client. */
  getUserId(request: Request): Promise<string | null>;
  limiters: { general: RateLimiter; start: RateLimiter };
  /** Extra origins accepted by the CSRF check (e.g. the public URL behind a proxy). */
  allowedOrigins?: readonly string[];
  secureCookies: boolean;
}

type IdContext = { params: Promise<{ id: string }> };

const MAX_BODY_BYTES = 2048;

const STATUS_BY_CODE: Record<AssessmentErrorCode, number> = {
  not_found: 404,
  not_complete: 409,
  already_completed: 409,
  question_not_available: 409,
  no_previous: 409,
  version_mismatch: 409,
  invalid_answer: 400,
  consent_required: 400,
};

class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    readonly headers: Record<string, string> = {},
  ) {
    super(code);
  }
}

const BASE_HEADERS = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } as const;

function reply(status: number, body?: unknown, cookies: readonly string[] = [], extra: Record<string, string> = {}) {
  const headers = new Headers({ ...BASE_HEADERS, ...extra });
  for (const c of cookies) headers.append("Set-Cookie", c);
  if (body === undefined) return new Response(null, { status, headers });
  headers.set("Content-Type", "application/json");
  return new Response(JSON.stringify(body), { status, headers });
}

function errorReply(e: unknown, cookies: readonly string[] = []) {
  if (e instanceof HttpError) return reply(e.status, { error: e.code }, cookies, e.headers);
  if (e instanceof AssessmentError) return reply(STATUS_BY_CODE[e.code], { error: e.code }, cookies);
  if (e instanceof ZodError) return reply(400, { error: "invalid_request" }, cookies);
  // Log the error NAME only: driver/ORM messages can embed query parameters (= answers).
  console.error("[assessment-api] unexpected error:", e instanceof Error ? e.name : typeof e);
  return reply(500, { error: "internal_error" }, cookies);
}

/** CSRF defence for cookie-authenticated mutations: the browser must say the request is same-origin. */
export function isSameOrigin(request: Request, allowedOrigins: readonly string[] = []): boolean {
  const origin = request.headers.get("origin");
  if (origin !== null) {
    return origin === new URL(request.url).origin || allowedOrigins.includes(origin);
  }
  return request.headers.get("sec-fetch-site") === "same-origin";
}

function readCookie(request: Request, name: string): string | undefined {
  const header = request.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim() || undefined;
  }
  return undefined;
}

function serializeCookie(name: string, value: string, o: { secure: boolean; maxAge: number }): string {
  return `${name}=${value}; Path=/; Max-Age=${o.maxAge}; HttpOnly; SameSite=Lax${o.secure ? "; Secure" : ""}`;
}

/** Reads and validates a JSON body without ever echoing it back or logging it. */
async function readJson<T>(request: Request, schema: ZodType<T>, optional = false): Promise<T> {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) throw new HttpError(400, "invalid_request");
  if (raw.trim() === "") {
    if (optional) return schema.parse({});
    throw new HttpError(400, "invalid_request");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new HttpError(400, "invalid_request");
  }
  return schema.parse(parsed);
}

function parseId(raw: string): string {
  const parsed = assessmentIdParam.safeParse(raw);
  // A malformed id is indistinguishable from a foreign one.
  if (!parsed.success) throw new AssessmentError("not_found");
  return parsed.data;
}

/**
 * Thin HTTP layer: security gates (CSRF, rate limit), principal resolution, Zod
 * validation, and mapping service errors to statuses. All business rules live in the
 * service. `getDeps` is lazy so importing a route never needs env or a database.
 */
export function createAssessmentHandlers(getDeps: () => AssessmentApiDeps) {
  async function gate(request: Request, deps: AssessmentApiDeps, scope: string, limiter: RateLimiter) {
    if (!isSameOrigin(request, deps.allowedOrigins)) throw new HttpError(403, "forbidden_origin");
    const r = await limiter.check(`${scope}:${clientIp(request)}`);
    if (!r.allowed) throw new HttpError(429, "rate_limited", { "Retry-After": String(r.retryAfterSeconds) });
  }

  const cookieName = (deps: AssessmentApiDeps) => guestCookieName(deps.secureCookies);
  const setGuestCookie = (deps: AssessmentApiDeps, token: string) =>
    serializeCookie(cookieName(deps), token, { secure: deps.secureCookies, maxAge: guestCookieOptions(deps.secureCookies).maxAge });
  const clearGuestCookie = (deps: AssessmentApiDeps) =>
    serializeCookie(cookieName(deps), "", { secure: deps.secureCookies, maxAge: 0 });

  async function resolvePrincipal(deps: AssessmentApiDeps, request: Request) {
    const userId = await deps.getUserId(request);
    if (userId) return { principal: { kind: "user", userId } as Principal, cookies: [] as string[] };
    const token = readCookie(request, cookieName(deps));
    const guest = await deps.guests.resolve(token);
    if (!guest || !token) return { principal: null, cookies: [] as string[] };
    return {
      principal: { kind: "guest", guestSessionId: guest.guestSessionId } as Principal,
      cookies: guest.refreshed ? [setGuestCookie(deps, token)] : [],
    };
  }

  /** Principal for routes that only act on existing data: none => 404, like a foreign id. */
  async function requirePrincipal(deps: AssessmentApiDeps, request: Request) {
    const resolved = await resolvePrincipal(deps, request);
    if (!resolved.principal) throw new AssessmentError("not_found");
    return resolved as { principal: Principal; cookies: string[] };
  }

  return {
    async start(request: Request): Promise<Response> {
      try {
        const deps = getDeps();
        await gate(request, deps, "start", deps.limiters.start);
        const body = await readJson(request, startBody);
        const resolved = await resolvePrincipal(deps, request);
        const cookies = [...resolved.cookies];
        let principal = resolved.principal;
        if (!principal) {
          const issued = await deps.guests.issue();
          principal = { kind: "guest", guestSessionId: issued.guestSessionId };
          cookies.push(setGuestCookie(deps, issued.token));
        }
        const view = await deps.service.startOrResume(principal, { granted: true, policyVersion: body.policyVersion });
        return reply(201, view, cookies);
      } catch (e) {
        return errorReply(e);
      }
    },

    async current(request: Request): Promise<Response> {
      try {
        const deps = getDeps();
        const { principal, cookies } = await requirePrincipal(deps, request);
        return reply(200, await deps.service.getCurrent(principal), cookies);
      } catch (e) {
        return errorReply(e);
      }
    },

    async answer(request: Request, ctx: IdContext): Promise<Response> {
      try {
        const deps = getDeps();
        await gate(request, deps, "answer", deps.limiters.general);
        const id = parseId((await ctx.params).id);
        const body = await readJson(request, answerBody);
        const { principal, cookies } = await requirePrincipal(deps, request);
        return reply(200, await deps.service.submitAnswer(principal, id, body.questionId, body.optionId), cookies);
      } catch (e) {
        return errorReply(e);
      }
    },

    async back(request: Request, ctx: IdContext): Promise<Response> {
      try {
        const deps = getDeps();
        await gate(request, deps, "back", deps.limiters.general);
        const id = parseId((await ctx.params).id);
        const body = await readJson(request, backBody, true);
        const { principal, cookies } = await requirePrincipal(deps, request);
        return reply(200, await deps.service.goBack(principal, id, body.questionId), cookies);
      } catch (e) {
        return errorReply(e);
      }
    },

    async pause(request: Request, ctx: IdContext): Promise<Response> {
      try {
        const deps = getDeps();
        await gate(request, deps, "pause", deps.limiters.general);
        const id = parseId((await ctx.params).id);
        const { principal, cookies } = await requirePrincipal(deps, request);
        return reply(200, await deps.service.pause(principal, id), cookies);
      } catch (e) {
        return errorReply(e);
      }
    },

    async result(request: Request, ctx: IdContext): Promise<Response> {
      try {
        const deps = getDeps();
        const id = parseId((await ctx.params).id);
        const { principal, cookies } = await requirePrincipal(deps, request);
        return reply(200, await deps.service.getResult(principal, id), cookies);
      } catch (e) {
        return errorReply(e);
      }
    },

    async remove(request: Request, ctx: IdContext): Promise<Response> {
      try {
        const deps = getDeps();
        await gate(request, deps, "delete", deps.limiters.general);
        const id = parseId((await ctx.params).id);
        const { principal, cookies } = await requirePrincipal(deps, request);
        await deps.service.deleteAssessment(principal, id);
        return reply(204, undefined, cookies);
      } catch (e) {
        return errorReply(e);
      }
    },

    /** Authenticated user + guest cookie. Idempotent: anything that is not a fresh claim answers claimed: 0. */
    async claim(request: Request): Promise<Response> {
      try {
        const deps = getDeps();
        await gate(request, deps, "claim", deps.limiters.general);
        const userId = await deps.getUserId(request);
        if (!userId) throw new HttpError(401, "unauthorized");
        const result = await deps.guests.claim(userId, readCookie(request, cookieName(deps)));
        const spent = result.outcome === "claimed" || result.outcome === "already_claimed";
        return reply(200, { claimed: result.claimed }, spent ? [clearGuestCookie(deps)] : []);
      } catch (e) {
        return errorReply(e);
      }
    },
  };
}

export type AssessmentHandlers = ReturnType<typeof createAssessmentHandlers>;
