import { BindLabApp } from '../src/components/BindLabApp'
import { SeoFaqSection } from '../src/components/SeoFaqSection'
import { SEO_FAQ_RU, SITE_DESCRIPTION_RU, SITE_TITLE_RU } from '../seo.config'

export default function HomePage() {
  return (
    <>
      <header className="sr-only">
        <h1>{SITE_TITLE_RU}</h1>
        <p>{SITE_DESCRIPTION_RU}</p>
      </header>
      <div className="min-h-screen">
        <BindLabApp />
      </div>
      <SeoFaqSection items={SEO_FAQ_RU} />
    </>
  )
}
