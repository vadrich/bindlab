import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, '../public/icons')

const CY = '#22d3ee'
const BG = '#000000'

/** Same outer contour: continuous rounded square */
function frame() {
  return `<rect x="56" y="56" width="400" height="400" rx="72" ry="72" fill="none" stroke="${CY}" stroke-width="28"/>`
}

function svg(inner) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="${BG}"/>
  ${frame()}
  ${inner}
</svg>
`
}

/** Monochrome cyan icons — more detail, still flat/minimal */
const icons = {
  'net-display.svg': `
  <!-- grid -->
  <line x1="120" y1="360" x2="400" y2="360" stroke="${CY}" stroke-width="10" stroke-linecap="round" opacity="0.45"/>
  <line x1="120" y1="300" x2="400" y2="300" stroke="${CY}" stroke-width="6" stroke-linecap="round" opacity="0.25"/>
  <line x1="120" y1="240" x2="400" y2="240" stroke="${CY}" stroke-width="6" stroke-linecap="round" opacity="0.25"/>
  <line x1="120" y1="180" x2="400" y2="180" stroke="${CY}" stroke-width="6" stroke-linecap="round" opacity="0.25"/>
  <!-- telemetry line -->
  <polyline points="120,340 155,300 190,320 230,250 270,270 310,190 350,220 400,140" fill="none" stroke="${CY}" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="155" cy="300" r="10" fill="${CY}"/>
  <circle cx="230" cy="250" r="10" fill="${CY}"/>
  <circle cx="310" cy="190" r="10" fill="${CY}"/>
  <circle cx="400" cy="140" r="12" fill="${CY}"/>
  <!-- tiny bars -->
  <rect x="130" y="372" width="14" height="28" rx="3" fill="${CY}"/>
  <rect x="156" y="360" width="14" height="40" rx="3" fill="${CY}"/>
  <rect x="182" y="366" width="14" height="34" rx="3" fill="${CY}"/>
`,

  'util-quick.svg': `
  <!-- terminal prompt -->
  <path d="M140 190 L230 256 L140 322" fill="none" stroke="${CY}" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="250" y1="322" x2="370" y2="322" stroke="${CY}" stroke-width="26" stroke-linecap="round"/>
  <!-- secondary command lines -->
  <line x1="250" y1="250" x2="320" y2="250" stroke="${CY}" stroke-width="14" stroke-linecap="round" opacity="0.55"/>
  <line x1="250" y1="280" x2="355" y2="280" stroke="${CY}" stroke-width="14" stroke-linecap="round" opacity="0.55"/>
  <!-- cursor block -->
  <rect x="380" y="300" width="22" height="44" rx="4" fill="${CY}"/>
`,

  'util-performance.svg': `
  <!-- baseline -->
  <line x1="128" y1="360" x2="384" y2="360" stroke="${CY}" stroke-width="10" stroke-linecap="round" opacity="0.4"/>
  <!-- bars with caps -->
  <rect x="138" y="270" width="42" height="90" rx="8" fill="${CY}"/>
  <rect x="198" y="220" width="42" height="140" rx="8" fill="${CY}"/>
  <rect x="258" y="165" width="42" height="195" rx="8" fill="${CY}"/>
  <rect x="318" y="120" width="42" height="240" rx="8" fill="${CY}"/>
  <!-- spark line over bars -->
  <polyline points="159,265 219,215 279,160 339,115" fill="none" stroke="${CY}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>
  <text x="256" y="410" text-anchor="middle" font-family="Segoe UI,Arial,sans-serif" font-size="64" font-weight="700" fill="${CY}">FPS</text>
`,

  'util-network.svg': `
  <g transform="translate(256,300)">
    <circle cx="0" cy="48" r="16" fill="${CY}"/>
    <path d="M-42 18 A52 52 0 0 1 42 18" fill="none" stroke="${CY}" stroke-width="20" stroke-linecap="round"/>
    <path d="M-78 -22 A95 95 0 0 1 78 -22" fill="none" stroke="${CY}" stroke-width="20" stroke-linecap="round"/>
    <path d="M-114 -62 A138 138 0 0 1 114 -62" fill="none" stroke="${CY}" stroke-width="20" stroke-linecap="round"/>
    <path d="M-146 -98 A176 176 0 0 1 146 -98" fill="none" stroke="${CY}" stroke-width="16" stroke-linecap="round" opacity="0.45"/>
  </g>
  <!-- packet dashes -->
  <circle cx="360" cy="170" r="8" fill="${CY}"/>
  <circle cx="380" cy="200" r="6" fill="${CY}" opacity="0.6"/>
  <circle cx="150" cy="180" r="7" fill="${CY}" opacity="0.5"/>
`,

  'util-crosshair.svg': `
  <!-- main cross with gap -->
  <line x1="256" y1="128" x2="256" y2="210" stroke="${CY}" stroke-width="22" stroke-linecap="round"/>
  <line x1="256" y1="302" x2="256" y2="384" stroke="${CY}" stroke-width="22" stroke-linecap="round"/>
  <line x1="128" y1="256" x2="210" y2="256" stroke="${CY}" stroke-width="22" stroke-linecap="round"/>
  <line x1="302" y1="256" x2="384" y2="256" stroke="${CY}" stroke-width="22" stroke-linecap="round"/>
  <!-- outer ticks -->
  <line x1="256" y1="100" x2="256" y2="118" stroke="${CY}" stroke-width="16" stroke-linecap="round"/>
  <line x1="256" y1="394" x2="256" y2="412" stroke="${CY}" stroke-width="16" stroke-linecap="round"/>
  <line x1="100" y1="256" x2="118" y2="256" stroke="${CY}" stroke-width="16" stroke-linecap="round"/>
  <line x1="394" y1="256" x2="412" y2="256" stroke="${CY}" stroke-width="16" stroke-linecap="round"/>
  <!-- center dot -->
  <circle cx="256" cy="256" r="10" fill="${CY}"/>
`,

  'util-grenades.svg': `
  <g transform="translate(256,268) rotate(-22)">
    <!-- body -->
    <rect x="-58" y="-38" width="116" height="138" rx="30" fill="${CY}"/>
    <!-- texture dots -->
    <circle cx="-24" cy="0" r="9" fill="${BG}"/>
    <circle cx="24" cy="0" r="9" fill="${BG}"/>
    <circle cx="-24" cy="36" r="9" fill="${BG}"/>
    <circle cx="24" cy="36" r="9" fill="${BG}"/>
    <circle cx="-24" cy="72" r="9" fill="${BG}"/>
    <circle cx="24" cy="72" r="9" fill="${BG}"/>
    <!-- seams -->
    <line x1="-40" y1="18" x2="40" y2="18" stroke="${BG}" stroke-width="6" opacity="0.35"/>
    <line x1="-40" y1="54" x2="40" y2="54" stroke="${BG}" stroke-width="6" opacity="0.35"/>
    <!-- spoon / lever -->
    <rect x="-32" y="-78" width="64" height="44" rx="12" fill="${CY}"/>
    <path d="M28 -88 A22 22 0 1 1 48 -70" fill="none" stroke="${CY}" stroke-width="14" stroke-linecap="round"/>
    <!-- pin ring -->
    <circle cx="52" cy="-95" r="14" fill="none" stroke="${CY}" stroke-width="10"/>
  </g>
`,

  'util-radar.svg': `
  <circle cx="256" cy="256" r="132" fill="none" stroke="${CY}" stroke-width="22"/>
  <circle cx="256" cy="256" r="78" fill="none" stroke="${CY}" stroke-width="10" opacity="0.4"/>
  <!-- cardinal ticks -->
  <line x1="256" y1="124" x2="256" y2="150" stroke="${CY}" stroke-width="14" stroke-linecap="round"/>
  <line x1="256" y1="362" x2="256" y2="388" stroke="${CY}" stroke-width="14" stroke-linecap="round"/>
  <line x1="124" y1="256" x2="150" y2="256" stroke="${CY}" stroke-width="14" stroke-linecap="round"/>
  <line x1="362" y1="256" x2="388" y2="256" stroke="${CY}" stroke-width="14" stroke-linecap="round"/>
  <!-- scan wedge -->
  <path d="M256 256 L338 175 A118 118 0 0 0 256 256 Z" fill="${CY}" opacity="0.3"/>
  <!-- player -->
  <polygon points="256,228 244,278 256,266 268,278" fill="${CY}"/>
  <!-- blips -->
  <circle cx="198" cy="200" r="9" fill="${CY}"/>
  <circle cx="318" cy="288" r="9" fill="${CY}"/>
  <circle cx="220" cy="318" r="7" fill="${CY}"/>
  <circle cx="300" cy="210" r="6" fill="${CY}" opacity="0.65"/>
`,

  'util-movement.svg': `
  <!-- ground -->
  <line x1="130" y1="370" x2="380" y2="370" stroke="${CY}" stroke-width="16" stroke-linecap="round"/>
  <!-- jump arc -->
  <path d="M150 300 Q200 300 230 250 Q265 185 300 185 Q340 185 370 240" fill="none" stroke="${CY}" stroke-width="22" stroke-linecap="round"/>
  <!-- arrow tip -->
  <polygon points="370,240 330,228 345,268" fill="${CY}"/>
  <!-- motion dashes -->
  <line x1="165" y1="285" x2="145" y2="265" stroke="${CY}" stroke-width="10" stroke-linecap="round" opacity="0.5"/>
  <line x1="185" y1="270" x2="165" y2="245" stroke="${CY}" stroke-width="10" stroke-linecap="round" opacity="0.35"/>
  <!-- footpad -->
  <ellipse cx="165" cy="355" rx="28" ry="10" fill="${CY}" opacity="0.55"/>
`,

  'util-audio.svg': `
  <!-- headset band -->
  <path d="M150 275 V220 A106 106 0 0 1 362 220 V275" fill="none" stroke="${CY}" stroke-width="24" stroke-linecap="round"/>
  <!-- ear cups -->
  <rect x="120" y="255" width="52" height="100" rx="20" fill="${CY}"/>
  <rect x="340" y="255" width="52" height="100" rx="20" fill="${CY}"/>
  <rect x="132" y="270" width="28" height="70" rx="10" fill="${BG}"/>
  <rect x="352" y="270" width="28" height="70" rx="10" fill="${BG}"/>
  <!-- equalizer -->
  <rect x="205" y="250" width="14" height="50" rx="4" fill="${CY}"/>
  <rect x="228" y="230" width="14" height="70" rx="4" fill="${CY}"/>
  <rect x="251" y="215" width="14" height="85" rx="4" fill="${CY}"/>
  <rect x="274" y="230" width="14" height="70" rx="4" fill="${CY}"/>
  <rect x="297" y="250" width="14" height="50" rx="4" fill="${CY}"/>
`,

  'util-map-cleanup.svg': [
    `<!-- splat dots -->`,
    `<circle cx="168" cy="200" r="16" fill="${CY}"/>`,
    `<circle cx="230" cy="160" r="11" fill="${CY}"/>`,
    `<circle cx="200" cy="270" r="13" fill="${CY}"/>`,
    `<circle cx="290" cy="240" r="9" fill="${CY}"/>`,
    `<circle cx="320" cy="185" r="8" fill="${CY}" opacity="0.6"/>`,
    `<circle cx="175" cy="310" r="7" fill="${CY}" opacity="0.5"/>`,
    `<!-- broom / wipe -->`,
    `<path d="M150 350 Q270 285 390 195" fill="none" stroke="${CY}" stroke-width="26" stroke-linecap="round"/>`,
    `<path d="M358 175 L405 215 L385 255" fill="none" stroke="${CY}" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>`,
    `<line x1="170" y1="340" x2="210" y2="310" stroke="${CY}" stroke-width="10" stroke-linecap="round" opacity="0.4"/>`,
  ].join('\n  '),

  'util-unbind.svg': `
  <rect x="118" y="205" width="276" height="160" rx="28" fill="none" stroke="${CY}" stroke-width="22"/>
  <rect x="148" y="235" width="34" height="28" rx="6" fill="${CY}"/>
  <rect x="194" y="235" width="34" height="28" rx="6" fill="${CY}"/>
  <rect x="240" y="235" width="34" height="28" rx="6" fill="${CY}"/>
  <rect x="286" y="235" width="34" height="28" rx="6" fill="${CY}"/>
  <rect x="332" y="235" width="34" height="28" rx="6" fill="${CY}"/>
  <rect x="148" y="280" width="218" height="28" rx="6" fill="${CY}"/>
  <rect x="148" y="320" width="50" height="22" rx="5" fill="${CY}" opacity="0.55"/>
  <rect x="210" y="320" width="50" height="22" rx="5" fill="${CY}" opacity="0.55"/>
  <rect x="272" y="320" width="94" height="22" rx="5" fill="${CY}" opacity="0.55"/>
  <line x1="155" y1="145" x2="360" y2="390" stroke="${CY}" stroke-width="26" stroke-linecap="round"/>
  <line x1="360" y1="145" x2="155" y2="390" stroke="${CY}" stroke-width="26" stroke-linecap="round"/>
`,

  'util-chat.svg': `
  <!-- chat bubble -->
  <path d="M140 160 H372 Q400 160 400 188 V300 Q400 328 372 328 H250 L200 380 L210 328 H140 Q112 328 112 300 V188 Q112 160 140 160 Z" fill="none" stroke="${CY}" stroke-width="22" stroke-linejoin="round"/>
  <!-- message lines -->
  <line x1="160" y1="210" x2="340" y2="210" stroke="${CY}" stroke-width="16" stroke-linecap="round"/>
  <line x1="160" y1="250" x2="300" y2="250" stroke="${CY}" stroke-width="16" stroke-linecap="round"/>
  <line x1="160" y1="290" x2="260" y2="290" stroke="${CY}" stroke-width="16" stroke-linecap="round" opacity="0.55"/>
`,
}

fs.mkdirSync(outDir, { recursive: true })
for (const [name, inner] of Object.entries(icons)) {
  const file = path.join(outDir, name)
  fs.writeFileSync(file, svg(inner), 'utf8')
  console.log('wrote', name)
}
