import type { Metadata } from 'next'
import type { SeoLanding } from '../data/seoLandings'
import { SITE_URL } from '../../seo.config'

export function metadataForLanding(landing: SeoLanding): Metadata {
  return {
    title: landing.title,
    description: landing.description,
    keywords: landing.keywords,
    alternates: { canonical: landing.path },
    openGraph: {
      title: landing.title,
      description: landing.description,
      url: `${SITE_URL}${landing.path}`,
      type: 'article',
      locale: 'ru_RU',
    },
    twitter: {
      card: 'summary_large_image',
      title: landing.title,
      description: landing.description,
    },
  }
}
