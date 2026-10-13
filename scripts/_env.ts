import { config } from "dotenv";
import { MissingEnvError, requireDatabaseUrl } from "@/lib/db/env";

/** Loads .env.local / .env and exits with a clear message if DATABASE_URL is missing. */
export function loadEnvOrExit(): void {
  config({ path: [".env.local", ".env"], quiet: true });
  try {
    requireDatabaseUrl();
  } catch (error) {
    if (error instanceof MissingEnvError) {
      console.error(`\n${error.message}\nNothing was changed.\n`);
      process.exit(1);
    }
    throw error;
  }
}
