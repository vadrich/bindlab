/**
 * After `next export`, enrich robots.txt (Yandex Clean-param) and write
 * semantic-core.txt for internal SEO reference.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'out')

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VITE_SITE_URL ||
  'https://bindlab.ru'
).replace(/\/$/, '')

function main() {
  if (!existsSync(outDir)) {
    console.error('postbuild-seo: out/ not found — run next build first')
    process.exitCode = 1
    return
  }

  const host = SITE_URL.replace(/^https?:\/\//, '')
  const robotsPath = join(outDir, 'robots.txt')
  let robots = existsSync(robotsPath)
    ? readFileSync(robotsPath, 'utf8')
    : `User-agent: *\nAllow: /\n`

  if (!/Clean-param:/i.test(robots)) {
    robots = robots.replace(
      /User-agent:\s*Yandex[\s\S]*?(?=\nUser-agent:|\nSitemap:|\nHost:|$)/i,
      (block) => {
        if (/Clean-param:/i.test(block)) return block
        return `${block.trimEnd()}\nClean-param: q&utm_source&utm_medium&utm_campaign&utm_content&utm_term\n`
      },
    )
    if (!/User-agent:\s*Yandex/i.test(robots)) {
      robots += `\nUser-agent: Yandex\nAllow: /\nClean-param: q&utm_source&utm_medium&utm_campaign&utm_content&utm_term\n`
    }
  }
  if (!/^Host:/im.test(robots)) {
    robots += `\nHost: ${host}\n`
  }
  if (!/Sitemap:/i.test(robots)) {
    robots += `\nSitemap: ${SITE_URL}/sitemap.xml\n`
  }
  writeFileSync(robotsPath, robots.endsWith('\n') ? robots : `${robots}\n`)

  const today = new Date().toISOString().slice(0, 10)
  const semantic = [
    `# BindLab semantic keyword core`,
    `# ${today} · ${SITE_URL}`,
    '',
    'See seo.config.ts SEMANTIC_CORE and /binds/* /guides/* landings.',
    '',
  ].join('\n')
  writeFileSync(join(outDir, 'semantic-core.txt'), semantic)

  mkdirSync(outDir, { recursive: true })
  console.log('postbuild-seo: robots.txt + semantic-core.txt updated')
}

main()
