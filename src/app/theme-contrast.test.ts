import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("./globals.css", import.meta.url), "utf8");

function lum(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const ratio = (a: string, b: string) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** Token map from the first block matching the selector. */
function tokens(selectorStart: string): Record<string, string> {
  const start = css.indexOf(selectorStart);
  expect(start, selectorStart).toBeGreaterThanOrEqual(0);
  const body = css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
  return Object.fromEntries([...body.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]]));
}

const themes = {
  dark: tokens(":root {"),
  "light (explicit)": tokens(':root[data-theme="light"]'),
  "light (system)": tokens(':root:not([data-theme="dark"])'),
};

describe.each(Object.entries(themes))("theme contrast: %s", (_name, t) => {
  it("text meets 4.5:1 on background and card", () => {
    for (const fg of ["foreground", "muted-foreground", "accent", "violet"]) {
      expect(ratio(t[fg], t.background), `${fg}/background`).toBeGreaterThanOrEqual(4.5);
      expect(ratio(t[fg], t.card), `${fg}/card`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("primary button text meets 4.5:1", () => {
    expect(ratio(t["primary-foreground"], t.primary)).toBeGreaterThanOrEqual(4.5);
  });

  it("control borders meet 3:1 on background and card (WCAG 1.4.11)", () => {
    expect(ratio(t["control-border"], t.background)).toBeGreaterThanOrEqual(3);
    expect(ratio(t["control-border"], t.card)).toBeGreaterThanOrEqual(3);
  });

  it("group markers on the diagram meet 3:1 on background and card (non-text, WCAG 1.4.11)", () => {
    for (const token of ["group-1", "group-2", "group-3"]) {
      expect(t[token], `${token} defined`).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(ratio(t[token], t.background), `${token}/background`).toBeGreaterThanOrEqual(3);
      expect(ratio(t[token], t.card), `${token}/card`).toBeGreaterThanOrEqual(3);
    }
  });
});
