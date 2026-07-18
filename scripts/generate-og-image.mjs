/**
 * Builds a 1200×630 Open Graph image for social / Discover previews.
 */
import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const out = resolve(__dirname, '../public/og-image.png')

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0c1420"/>
      <stop offset="55%" stop-color="#05080e"/>
      <stop offset="100%" stop-color="#03060b"/>
    </linearGradient>
    <radialGradient id="glow" cx="15%" cy="10%" r="55%">
      <stop offset="0%" stop-color="#ff8a1f" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#ff8a1f" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="85%" cy="20%" r="50%">
      <stop offset="0%" stop-color="#2de8ff" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#2de8ff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>
  <rect x="48" y="48" width="1104" height="534" rx="28" fill="none" stroke="#3a4555" stroke-width="2" opacity="0.75"/>
  <text x="96" y="200" font-family="Segoe UI, Arial, sans-serif" font-size="78" font-weight="800" fill="#ff8a1f">BindLab</text>
  <text x="96" y="275" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="700" fill="#e8eef7">Бинды CS2 за минуту</text>
  <text x="96" y="340" font-family="Segoe UI, Arial, sans-serif" font-size="26" fill="#9aa6b8">Бай-меню · jumpthrow · прицел · радар · конфиг</text>
  <text x="96" y="400" font-family="Segoe UI, Arial, sans-serif" font-size="24" fill="#7a8799">Собери → скопируй в консоль (~) → поделись ссылкой</text>
  <rect x="96" y="460" width="320" height="56" rx="14" fill="#ff8a1f"/>
  <text x="256" y="497" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="26" font-weight="700" fill="#0a0e14">bindlab.ru</text>
  <text x="96" y="555" font-family="Segoe UI, Arial, sans-serif" font-size="20" fill="#6b7280">Бесплатно · без установки · для CS2 / ксго2</text>
</svg>`

const png = await sharp(Buffer.from(svg)).png().toFile(out)
console.log('Wrote', out, `${png.width}x${png.height}`)
