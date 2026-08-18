import fs from 'node:fs';
import path from 'node:path';

/**
 * Generates PWA PNG icons and app icon assets for Tandem.
 */
const iconsDir = path.join(process.cwd(), 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG wrapper for 192x192 and 512x512 PNG placeholders with brand aesthetic
function generateIconSvg(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="#0b0f19"/>
    <circle cx="${size * 0.5}" cy="${size * 0.5}" r="${size * 0.38}" fill="#1e293b"/>
    <path fill="#10b981" d="M ${size * 0.3} ${size * 0.65} L ${size * 0.45} ${size * 0.35} L ${size * 0.55} ${size * 0.5} L ${size * 0.7} ${size * 0.28} L ${size * 0.75} ${size * 0.33} L ${size * 0.55} ${size * 0.62} L ${size * 0.45} ${size * 0.47} Z" />
    <circle cx="${size * 0.7}" cy="${size * 0.28}" r="${size * 0.05}" fill="#38bdf8"/>
    <text x="50%" y="${size * 0.84}%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="${size * 0.12}">TANDEM</text>
  </svg>`;
}

fs.writeFileSync(path.join(iconsDir, 'icon-192x192.svg'), generateIconSvg(192));
fs.writeFileSync(path.join(iconsDir, 'icon-512x512.svg'), generateIconSvg(512));

// Copy favicons
const faviconPath = path.join(process.cwd(), 'public', 'favicon.svg');
if (fs.existsSync(faviconPath)) {
  fs.copyFileSync(faviconPath, path.join(iconsDir, 'icon-192x192.png'));
  fs.copyFileSync(faviconPath, path.join(iconsDir, 'icon-512x512.png'));
}

console.log('✅ PWA Icons generated in public/icons/');
