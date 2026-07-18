import type { MetadataRoute } from 'next'
import { SEO_LANDINGS } from '../src/data/seoLandings'
import { SITE_URL } from '../seo.config'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
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
    priority: landing.group === 'how-to' ? 0.85 : 0.8,
  }))
  return [...hub, ...landings]
}
