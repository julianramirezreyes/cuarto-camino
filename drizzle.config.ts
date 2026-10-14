import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Same precedence as the scripts in /scripts: .env.local first, then .env.
config({ path: [".env.local", ".env"], quiet: true });

export default defineConfig({
  schema: "./src/lib/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
});
