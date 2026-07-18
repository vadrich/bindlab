import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SeoLandingPage } from '../../src/components/SeoLandingPage'
import {
  SEO_P0_SLUGS,
  p0LandingBySlug,
} from '../../src/data/seoP0Landings'
import { metadataForLanding } from '../../src/lib/seoLandingMeta'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return SEO_P0_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const landing = p0LandingBySlug(slug)
  if (!landing) return {}
  return metadataForLanding(landing)
}

export default async function P0LandingPage({ params }: Props) {
  const { slug } = await params
  const landing = p0LandingBySlug(slug)
  if (!landing) notFound()
  return <SeoLandingPage landing={landing} />
}
