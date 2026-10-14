import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3400);
const BASE_URL = `http://localhost:${PORT}`;

/**
 * E2E contra el build de PRODUCCIÓN (`next build` + `next start`): es lo que se despliega y
 * el único modo en el que se registra el service worker. Usa Google Chrome instalado
 * (`channel: "chrome"`); no descarga navegadores.
 */
export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  outputDir: "./test-results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Todos los tests comparten una misma base Neon a través de la app: pocos workers.
  workers: process.env.CI ? 1 : 2,
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    locale: "es-CO",
    timezoneId: "America/Bogota",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel: "chrome" } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel: "chrome" } },
  ],
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 600_000,
    stdout: "ignore",
    stderr: "pipe",
    env: {
      // No son secretos: el origen público de la app durante la prueba (CSRF y enlaces).
      BETTER_AUTH_URL: BASE_URL,
      APP_URL: BASE_URL,
    },
  },
});
