// Regenerates the README screenshots in docs/img using the system Chrome.
// Usage: start a production server (npm run build && npm run start -- -p 3600), then:
//   node scripts/capture-screenshots.mjs [baseUrl]
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:3600";
const out = new URL("../docs/img/", import.meta.url).pathname;
const browser = await chromium.launch({ channel: "chrome" });

async function context(viewport, deviceScaleFactor = 1) {
  return browser.newContext({
    viewport,
    deviceScaleFactor,
    colorScheme: "dark",
    reducedMotion: "reduce",
    extraHTTPHeaders: { "x-forwarded-for": `198.51.100.${Math.floor(Math.random() * 200) + 1}` },
  });
}

// Desktop landing with a type selected.
{
  const ctx = await context({ width: 1180, height: 760 });
  const page = await ctx.newPage();
  await page.goto(base);
  await page.getByRole("button", { name: /^Eneatipo 4/ }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}landing.png` });
  await ctx.close();
}

// Mobile: a question and the results (answers chosen deterministically through the real API).
{
  const ctx = await context({ width: 390, height: 844 }, 2);
  const page = await ctx.newPage();
  const origin = { origin: base, "content-type": "application/json" };
  const start = await (await page.request.post(`${base}/api/assessments`, { headers: origin, data: { consent: true, policyVersion: "2026-10-draft" } })).json();
  const id = start.assessment.id;
  let q = start.question;
  for (let i = 0; i < 6 && q; i++) {
    const r = await (await page.request.post(`${base}/api/assessments/${id}/answers`, { headers: origin, data: { questionId: q.id, optionId: q.options[i % q.options.length].id } })).json();
    q = r.question;
  }
  await page.goto(`${base}/evaluacion`);
  await page.getByRole("button", { name: /Continuar donde lo dejaste/ }).click();
  await page.getByRole("heading").first().waitFor();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${out}pregunta.png` });

  // Finish the assessment through the API, then capture the report.
  let i = 7;
  while (q) {
    const r = await (await page.request.post(`${base}/api/assessments/${id}/answers`, { headers: origin, data: { questionId: q.id, optionId: q.options[(i++ * 7) % q.options.length].id } })).json();
    q = r.question;
  }
  await page.goto(`${base}/resultado`);
  await page.getByText("Interpretación provisional").waitFor({ timeout: 30000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${out}resultado.png` });
  await page.request.delete(`${base}/api/assessments/${id}`, { headers: origin });
  await ctx.close();
}

await browser.close();
console.log("screenshots written to docs/img");
