/**
 * Download official CS2 buy-menu SVG icons and export white PNG silhouettes.
 * Source: https://github.com/Juknum/counter-strike-icons
 * Output: public/weapons/{id}.png
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, '..', 'public', 'weapons')

const RAW_BASE =
  'https://raw.githubusercontent.com/Juknum/counter-strike-icons/main/cs2/panorama/images/icons/equipment'

/** App item id → CS2 equipment SVG filename (without .svg) */
const ICON_MAP = {
  vest: 'kevlar',
  vesthelm: 'armor_helmet',
  defuser: 'defuser',
  taser: 'taser',
  p250: 'p250',
  fiveseven: 'fiveseven',
  deagle: 'deagle',
  revolver: 'revolver',
  elite: 'elite',
  tec9: 'tec9',
  cz75a: 'cz75a',
  mac10: 'mac10',
  mp9: 'mp9',
  mp7: 'mp7',
  ump45: 'ump45',
  p90: 'p90',
  bizon: 'bizon',
  nova: 'nova',
  xm1014: 'xm1014',
  mag7: 'mag7',
  sawedoff: 'sawedoff',
  ssg08: 'ssg08',
  m249: 'm249',
  negev: 'negev',
  m4a1_silencer: 'm4a1_silencer',
  m4a1: 'm4a1',
  famas: 'famas',
  aug: 'aug',
  sg556: 'sg556',
  awp: 'awp',
  g3sg1: 'g3sg1',
  scar20: 'scar20',
  galilar: 'galilar',
  ak47: 'ak47',
  flashbang: 'flashbang',
  smokegrenade: 'smokegrenade',
  hegrenade: 'hegrenade',
  molotov: 'molotov',
  incgrenade: 'incgrenade',
  decoy: 'decoy',
}

/** Force fills/strokes to white so icons match CS2 buy menu cards */
function whitenSvg(svgText) {
  let svg = svgText
    .replace(/fill="(?!none)[^"]*"/gi, 'fill="#ffffff"')
    .replace(/stroke="(?!none)[^"]*"/gi, 'stroke="#ffffff"')
    .replace(/fill:\s*(?!none)[^;"}]+/gi, 'fill:#ffffff')
    .replace(/stroke:\s*(?!none)[^;"}]+/gi, 'stroke:#ffffff')

  // default fill white if root has no fill
  if (!/fill="/i.test(svg)) {
    svg = svg.replace(/<svg\b/i, '<svg fill="#ffffff"')
  }
  return svg
}

async function exportPng(id, svgFile) {
  const url = `${RAW_BASE}/${svgFile}.svg`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} → ${res.status}`)
  const svgText = whitenSvg(await res.text())

  const png = await sharp(Buffer.from(svgText))
    .resize({
      width: 256,
      height: 96,
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer()

  await fs.promises.writeFile(path.join(OUT, `${id}.png`), png)
  console.log('✓', id, '←', svgFile)
}

async function main() {
  await fs.promises.mkdir(OUT, { recursive: true })

  let ok = 0
  let fail = 0
  for (const [id, svgFile] of Object.entries(ICON_MAP)) {
    try {
      await exportPng(id, svgFile)
      ok++
    } catch (err) {
      fail++
      console.error('✗', id, err.message)
    }
  }
  console.log(`\nDone: ${ok} ok, ${fail} failed → ${OUT}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
