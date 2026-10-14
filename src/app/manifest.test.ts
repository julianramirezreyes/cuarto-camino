import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import manifest from "./manifest";

const m = manifest();

describe("web manifest", () => {
  it("has the required installability fields", () => {
    expect(m.name).toBe("Cuarto Camino");
    expect(m.short_name).toBeTruthy();
    expect(m.lang).toBe("es");
    expect(m.start_url).toBe("/");
    expect(m.id).toBe("/");
    expect(m.scope).toBe("/");
    expect(m.display).toBe("standalone");
    expect(m.theme_color).toBe("#0b1020");
    expect(m.background_color).toBe("#0b1020");
    expect(m.categories?.length).toBeGreaterThan(0);
  });

  it("declares 192, 512 and maskable 512 PNG icons that exist in public/", () => {
    const icons = m.icons ?? [];
    const has = (sizes: string, purpose?: string) =>
      icons.some((i) => i.sizes === sizes && i.type === "image/png" && i.purpose === purpose);
    expect(has("192x192", "any")).toBe(true);
    expect(has("512x512", "any")).toBe(true);
    expect(has("512x512", "maskable")).toBe(true);
    for (const icon of icons) {
      expect(existsSync(join(process.cwd(), "public", icon.src)), icon.src).toBe(true);
    }
  });

  it("ships the apple-touch-icon", () => {
    expect(existsSync(join(process.cwd(), "public/apple-touch-icon.png"))).toBe(true);
  });
});
