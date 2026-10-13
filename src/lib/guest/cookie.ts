import { GUEST_IDLE_TTL_SECONDS } from "./policy";

/** `__Host-` prefix (secure, path=/, no Domain) is only valid over HTTPS, so prod only. */
export const guestCookieName = (secure: boolean): string =>
  secure ? "__Host-cc_guest" : "cc_guest";

export interface GuestCookieOptions {
  httpOnly: true;
  secure: boolean;
  sameSite: "lax";
  path: "/";
  maxAge: number;
}

export function guestCookieOptions(
  secure: boolean = process.env.NODE_ENV === "production",
): GuestCookieOptions {
  return {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: GUEST_IDLE_TTL_SECONDS,
  };
}
