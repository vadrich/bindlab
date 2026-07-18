import type { MetadataRoute } from 'next'
import { SEO_LANDINGS } from '../src/data/seoLandings'
import { SEO_P0_LANDINGS } from '../src/data/seoP0Landings'
import { SITE_URL } from '../seo.config'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const p0Paths = new Set(SEO_P0_LANDINGS.map((l) => l.path))
  const hub: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/guides`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]
  const landings = SEO_LANDINGS.map((landing) => ({
    url: `${SITE_URL}${landing.path}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: p0Paths.has(landing.path)
      ? 0.95
      : landing.group === 'how-to'
        ? 0.85
        : 0.8,
  }))
  return [...hub, ...landings]
}
