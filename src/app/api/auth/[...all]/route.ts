import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/auth/auth";

// Lazy: importing this route (e.g. during `next build`) must not read env vars or open the database.
export const { GET, POST } = toNextJsHandler((request) => getAuth().handler(request));
