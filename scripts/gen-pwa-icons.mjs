// Generates Nook's PWA / home-screen icons: the "Nook" wordmark in the brand
// ink colour on the warm Nook background, with a honey dot accent. Maskable
// variants use a smaller wordmark so it survives the platform safe-zone crop.
// Run: npm run gen:icons
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const BG = "#FAFAF8"; // Nook background
const INK = "#1C1B19"; // Nook ink
const HONEY = "#BE7F33"; // Nook accent

/**
 * Build the wordmark SVG. `scale` is the font-size as a fraction of the canvas.
 * A honey dot sits after the word as a small brand accent.
 */
function wordmarkSvg(size, scale = 0.26) {
  const fontSize = size * scale;
  const dotR = fontSize * 0.11;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${BG}"/>
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle"
        font-family="FreeSans, Helvetica, Arial, sans-serif" font-weight="700"
        font-size="${fontSize}" letter-spacing="-${fontSize * 0.03}" fill="${INK}">Nook</text>
  <circle cx="${size / 2 + fontSize * 1.02}" cy="${size / 2 + fontSize * 0.34}" r="${dotR}" fill="${HONEY}"/>
</svg>`;
}

async function png(size, scale, out) {
  await sharp(Buffer.from(wordmarkSvg(size, scale))).png().toFile(join(root, out));
  console.log("✓", out);
}

await mkdir(join(root, "public/icons"), { recursive: true });

// Standard PWA icons (Android / desktop install).
await png(192, 0.28, "public/icons/icon-192.png");
await png(512, 0.28, "public/icons/icon-512.png");
// Maskable variants — smaller wordmark for the safe-zone crop.
await png(192, 0.2, "public/icons/maskable-192.png");
await png(512, 0.2, "public/icons/maskable-512.png");
// iOS home-screen icon (apple-touch-icon, must be PNG). Next picks up src/app/apple-icon.png.
await png(180, 0.28, "src/app/apple-icon.png");

console.log("Done.");
