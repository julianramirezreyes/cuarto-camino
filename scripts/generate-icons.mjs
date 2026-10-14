// Deterministic icon generator: night-blue disc + minimal nine-point
// enneagram in gold. Uses `sharp` (already present in node_modules as a
// Next.js optional dependency; it is NOT a declared dependency).
// Usage: node scripts/generate-icons.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const BG = "#0b1020";
const DISC = "#141b36";
const GOLD = "#d4af6a";

/** @param {number} size @param {{maskable?: boolean}} opts */
function svg(size, { maskable = false } = {}) {
  const c = size / 2;
  // Maskable icons must keep the motif inside the central 80% safe zone.
  const R = size * (maskable ? 0.3 : 0.36);
  const pt = (n) => {
    const a = ((n % 9) * 40 - 90) * (Math.PI / 180); // point 9 at the top
    return [c + R * Math.cos(a), c + R * Math.sin(a)];
  };
  const f = (v) => v.toFixed(2);
  const poly = (ns) => ns.map((n) => pt(n).map(f).join(",")).join(" ");
  const sw = size * 0.012;
  const dots = Array.from({ length: 9 }, (_, i) => i + 1)
    .map((n) => {
      const [x, y] = pt(n);
      return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(size * 0.02)}" fill="${GOLD}"/>`;
    })
    .join("");
  const disc = maskable
    ? ""
    : `<circle cx="${c}" cy="${c}" r="${f(size * 0.48)}" fill="${DISC}" stroke="${GOLD}" stroke-opacity="0.35" stroke-width="${f(sw)}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
<rect width="${size}" height="${size}" fill="${BG}"/>${disc}
<circle cx="${c}" cy="${c}" r="${f(R)}" fill="none" stroke="${GOLD}" stroke-width="${f(sw)}"/>
<polygon points="${poly([9, 3, 6])}" fill="none" stroke="${GOLD}" stroke-width="${f(sw)}" stroke-linejoin="round"/>
<polyline points="${poly([1, 4, 2, 8, 5, 7, 1])}" fill="none" stroke="${GOLD}" stroke-width="${f(sw)}" stroke-linejoin="round"/>
${dots}
</svg>`;
}

const targets = [
  ["public/icons/icon-192.png", 192, {}],
  ["public/icons/icon-512.png", 512, {}],
  ["public/icons/icon-maskable-512.png", 512, { maskable: true }],
  ["public/icons/favicon-32.png", 32, {}],
  // Apple applies its own rounding; keep full-bleed background, no disc.
  ["public/apple-touch-icon.png", 180, { maskable: true }],
];

mkdirSync("public/icons", { recursive: true });
writeFileSync(join("public/icons", "icon.svg"), svg(512));
for (const [path, size, opts] of targets) {
  await sharp(Buffer.from(svg(size, opts))).png({ compressionLevel: 9 }).toFile(path);
  console.log("wrote", path);
}
