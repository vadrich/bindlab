import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SITE_URL, SITE_NAME, SITE_TAGLINE_EN } from './site.config'

const __dirname = dirname(fileURLToPath(import.meta.url))

function seoPlugin() {
  return {
    name: 'cs2-seo',
    transformIndexHtml(html: string) {
      return html.replaceAll('%SITE_URL%', SITE_URL)
    },
    closeBundle() {
      const outDir = resolve(__dirname, 'dist')
      mkdirSync(outDir, { recursive: true })

      const host = SITE_URL.replace(/^https?:\/\//, '')
      const robots = `User-agent: *
Allow: /

Host: ${host}

Sitemap: ${SITE_URL}/sitemap.xml
`
      writeFileSync(resolve(outDir, 'robots.txt'), robots)

      const today = new Date().toISOString().slice(0, 10)
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`
      writeFileSync(resolve(outDir, 'sitemap.xml'), sitemap)

      const manifest = {
        name: SITE_NAME,
        short_name: 'BindLab',
        description: SITE_TAGLINE_EN,
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#05080e',
        theme_color: '#05080e',
        lang: 'ru',
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
            purpose: 'any',
          },
        ],
        categories: ['games', 'utilities'],
      }
      writeFileSync(
        resolve(outDir, 'site.webmanifest'),
        JSON.stringify(manifest, null, 2),
      )
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
