"use client";

import { createAuthClient } from "better-auth/react";

/** Browser client. Same-origin by default (no baseURL): calls go to /api/auth/*. */
export const authClient = createAuthClient();
