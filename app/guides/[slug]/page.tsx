import { notFound } from 'next/navigation'
import { SeoLandingPage } from '../../../src/components/SeoLandingPage'
import {
  landingsByGroup,
  landingSlugs,
} from '../../../src/data/seoLandings'
import { metadataForLanding } from '../../../src/lib/seoLandingMeta'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return landingSlugs('guides').map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const landing = landingsByGroup('guides').find((l) => l.slug === slug)
  if (!landing) return {}
  return metadataForLanding(landing)
}

export default async function GuideLandingPage({ params }: Props) {
  const { slug } = await params
  const landing = landingsByGroup('guides').find((l) => l.slug === slug)
  if (!landing) notFound()
  return <SeoLandingPage landing={landing} />
}
