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
    <radialGradient id="glow" cx="20%" cy="0%" r="55%">
      <stop offset="0%" stop-color="#ff8a1f" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#ff8a1f" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="90%" cy="10%" r="45%">
      <stop offset="0%" stop-color="#2de8ff" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#2de8ff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>
  <rect x="48" y="48" width="1104" height="534" rx="28" fill="none" stroke="#3a4555" stroke-width="2" opacity="0.7"/>
  <text x="96" y="220" font-family="Segoe UI, Arial, sans-serif" font-size="72" font-weight="800" fill="#ff8a1f">BindLab</text>
  <text x="96" y="300" font-family="Segoe UI, Arial, sans-serif" font-size="32" font-weight="600" fill="#c5d0e0">Бинды · бай-меню · настройки CS2</text>
  <text x="96" y="370" font-family="Segoe UI, Arial, sans-serif" font-size="26" fill="#8b95a5">Собери конфиг · скопируй в консоль · сохрани и поделись</text>
  <text x="96" y="520" font-family="Segoe UI, Arial, sans-serif" font-size="22" fill="#6b7280">Free · Web · Multi-language</text>
</svg>`

const png = await sharp(Buffer.from(svg)).png().toFile(out)
console.log('Wrote', out, `${png.width}x${png.height}`)
