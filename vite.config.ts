import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE_RU,
  SITE_DESCRIPTION_RU,
  SITE_TAGLINE_RU,
  META_KEYWORDS,
  SEMANTIC_CORE,
  buildWebApplicationJsonLd,
  buildWebSiteJsonLd,
  buildFaqJsonLd,
  buildSoftwareAppJsonLd,
} from './seo.config'

const __dirname = dirname(fileURLToPath(import.meta.url))

function seoPlugin() {
  return {
    name: 'cs2-seo',
    transformIndexHtml(html: string) {
      const jsonLd = [
        buildWebApplicationJsonLd(),
        buildWebSiteJsonLd(),
        buildFaqJsonLd(),
        buildSoftwareAppJsonLd(),
      ]
        .map(
          (block) =>
            `<script type="application/ld+json">${JSON.stringify(block)}</script>`,
        )
        .join('\n    ')

      return html
        .replaceAll('%SITE_URL%', SITE_URL)
        .replaceAll('%SITE_TITLE%', SITE_TITLE_RU)
        .replaceAll('%SITE_DESCRIPTION%', SITE_DESCRIPTION_RU)
        .replaceAll('%SITE_KEYWORDS%', META_KEYWORDS)
        .replace('%JSON_LD%', jsonLd)
    },
    closeBundle() {
      const outDir = resolve(__dirname, 'dist')
      mkdirSync(outDir, { recursive: true })

      const host = SITE_URL.replace(/^https?:\/\//, '')
      const robots = `User-agent: *
Allow: /

User-agent: Yandex
Allow: /
Clean-param: q&utm_source&utm_medium&utm_campaign&utm_content&utm_term

User-agent: Googlebot
Allow: /

Host: ${host}

Sitemap: ${SITE_URL}/sitemap.xml
`
      writeFileSync(resolve(outDir, 'robots.txt'), robots)

      const today = new Date().toISOString().slice(0, 10)
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="ru" href="${SITE_URL}/" />
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/" />
  </url>
</urlset>
`
      writeFileSync(resolve(outDir, 'sitemap.xml'), sitemap)

      const manifest = {
        name: `${SITE_NAME} — бинды CS2`,
        short_name: SITE_NAME,
        description: SITE_TAGLINE_RU,
        lang: 'ru',
        dir: 'ltr',
        start_url: '/',
        scope: '/',
        id: '/',
        display: 'standalone',
        orientation: 'any',
        background_color: '#05080e',
        theme_color: '#05080e',
        categories: ['games', 'utilities', 'entertainment'],
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Оружие / бай-бинды',
            short_name: 'Оружие',
            description: 'Собрать buy binds CS2',
            url: '/?tab=weapons',
          },
          {
            name: 'Утилиты',
            short_name: 'Утилиты',
            description: 'Jumpthrow, прицел, настройки CS2',
            url: '/?tab=utilities',
          },
        ],
      }
      writeFileSync(
        resolve(outDir, 'site.webmanifest'),
        JSON.stringify(manifest, null, 2),
      )

      const coreLines = [
        `# BindLab semantic keyword core`,
        `# ${today} · ${SITE_URL}`,
        '',
        '## Primary',
        ...SEMANTIC_CORE.primary.map((k) => `- ${k}`),
        '',
        '## Features',
        ...SEMANTIC_CORE.features.map((k) => `- ${k}`),
        '',
        '## Long-tail',
        ...SEMANTIC_CORE.longTail.map((k) => `- ${k}`),
        '',
        '## Brand',
        ...SEMANTIC_CORE.brand.map((k) => `- ${k}`),
        '',
      ]
      writeFileSync(resolve(outDir, 'semantic-core.txt'), `${coreLines.join('\n')}\n`)
    },
  }
}

export default defineConfig({
  plugins: [react(), seoPlugin()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },
  preview: {
    port: 4173,
  },
})
