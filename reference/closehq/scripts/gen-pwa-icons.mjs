// Generates the PWA / home-screen app icons: a white background with the
// "iClose" wordmark, in the brand ink colour. Run: node scripts/gen-pwa-icons.mjs
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const INK = '#1d1d1f';

/**
 * Build the wordmark SVG — "iClose" in a single uniform weight, large and
 * tight, filling most of the canvas. `scale` is the font-size as a fraction of
 * the canvas; maskable icons use a smaller scale so the word stays inside the
 * platform's safe zone when cropped to a circle/squircle.
 */
function wordmarkSvg(size, scale = 0.28) {
  const fontSize = size * scale;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#ffffff"/>
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle"
        font-family="FreeSans, Helvetica, Arial, sans-serif" font-weight="700"
        font-size="${fontSize}" letter-spacing="-${fontSize * 0.04}" fill="${INK}">iClose</text>
</svg>`;
}

async function png(size, scale, out) {
  await sharp(Buffer.from(wordmarkSvg(size, scale))).png().toFile(join(root, out));
  console.log('✓', out);
}

await mkdir(join(root, 'public/icons'), { recursive: true });

// Standard PWA icons (Android / desktop install).
await png(192, 0.30, 'public/icons/icon-192.png');
await png(512, 0.30, 'public/icons/icon-512.png');
// Maskable variants — smaller wordmark so it survives the safe-zone crop.
await png(192, 0.2, 'public/icons/maskable-192.png');
await png(512, 0.2, 'public/icons/maskable-512.png');
// iOS home-screen icon (apple-touch-icon, must be PNG). Next picks up app/apple-icon.png.
await png(180, 0.30, 'app/apple-icon.png');

console.log('Done.');
