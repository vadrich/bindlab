import {
  SITE_NAME,
  SITE_URL,
  type SeoFaqItem,
} from '../../seo.config'
import type { SeoLanding } from '../data/seoLandings'
import { SEO_LANDINGS } from '../data/seoLandings'
import {
  accentColorForTopic,
  accentLabelForTopic,
  withAlpha,
} from '../data/seoTheme'

type Props = {
  landing: SeoLanding
}

function buildHowToJsonLd(landing: SeoLanding): Record<string, unknown> | null {
  if (!landing.steps?.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: landing.h1,
    description: landing.description,
    inLanguage: 'ru-RU',
    totalTime: 'PT3M',
    tool: {
      '@type': 'HowToTool',
      name: SITE_NAME,
    },
    step: landing.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
      url: `${SITE_URL}${landing.path}#step-${i + 1}`,
    })),
  }
}

function buildFaqJsonLd(items: SeoFaqItem[]): Record<string, unknown> | null {
  if (!items.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

function buildBreadcrumbJsonLd(landing: SeoLanding): Record<string, unknown> {
  const groupLabel =
    landing.group === 'how-to'
      ? 'Как сделать'
      : landing.group === 'guides'
        ? 'Гайды'
        : landing.group === 'cs2'
          ? 'CS2'
          : 'Бинды'
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: SITE_NAME,
        item: `${SITE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: groupLabel,
        item: `${SITE_URL}/guides`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: landing.h1,
        item: `${SITE_URL}${landing.path}`,
      },
    ],
  }
}

export function SeoLandingPage({ landing }: Props) {
  const howTo = buildHowToJsonLd(landing)
  const faq = buildFaqJsonLd(landing.faq ?? [])
  const crumbs = buildBreadcrumbJsonLd(landing)
  const accent = accentColorForTopic(landing.topic)
  const accentSoft = withAlpha(accent, 0.12)
  const accentBorder = withAlpha(accent, 0.35)
  const related = SEO_LANDINGS.filter(
    (l) => l.path !== landing.path && l.topic === landing.topic,
  )
    .slice(0, 8)
    .concat(
      SEO_LANDINGS.filter(
        (l) => l.path !== landing.path && l.topic !== landing.topic,
      ).slice(0, 4),
    )

  return (
    <main
      className="min-h-screen px-4 py-12 text-zinc-300"
      style={{
        background: `linear-gradient(180deg, ${accentSoft} 0%, #101214 220px, #141618 480px)`,
      }}
    >
      {howTo ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }}
        />
      ) : null}
      {faq ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
        />
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />

      <article
        className="mx-auto max-w-2xl rounded-2xl border bg-black/25 px-5 py-8 sm:px-8"
        style={{
          borderColor: accentBorder,
          boxShadow: `inset 4px 0 0 ${accent}, 0 20px 60px rgba(0,0,0,0.35)`,
        }}
      >
        <nav className="text-xs text-zinc-500" aria-label="Хлебные крошки">
          <a
            href="/"
            className="hover:underline"
            style={{ color: accent }}
          >
            BindLab
          </a>
          <span className="mx-1.5">/</span>
          <a
            href="/guides"
            className="hover:underline"
            style={{ color: accent }}
          >
            Гайды
          </a>
          <span className="mx-1.5">/</span>
          <span className="text-zinc-500">{landing.h1}</span>
        </nav>

        <p
          className="mt-4 font-display text-sm font-semibold uppercase tracking-widest"
          style={{ color: accent }}
        >
          BindLab · {accentLabelForTopic(landing.topic)}
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
          {landing.h1}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-zinc-400">
          {landing.lead}
        </p>
        <p className="mt-6">
          <a
            href={landing.ctaHref}
            className="inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-semibold text-black transition hover:brightness-110"
            style={{ backgroundColor: accent }}
          >
            {landing.ctaLabel}
          </a>
        </p>

        {landing.steps?.length ? (
          <section className="mt-10" aria-labelledby="steps-heading">
            <h2
              id="steps-heading"
              className="font-display text-xl font-semibold text-zinc-100"
            >
              Пошагово
            </h2>
            <ol className="mt-4 list-decimal space-y-4 pl-5 text-sm leading-relaxed text-zinc-400">
              {landing.steps.map((step, i) => (
                <li key={step.name} id={`step-${i + 1}`}>
                  <span className="font-medium text-zinc-200">{step.name}.</span>{' '}
                  {step.text}
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <div className="mt-10 space-y-8">
          {landing.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-xl font-semibold text-zinc-100">
                {section.heading}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        {landing.faq?.length ? (
          <section className="mt-10" aria-labelledby="landing-faq">
            <h2
              id="landing-faq"
              className="font-display text-xl font-semibold text-zinc-100"
            >
              Частые вопросы
            </h2>
            <dl className="mt-4 space-y-4">
              {landing.faq.map((item) => (
                <div key={item.question}>
                  <dt className="font-medium text-zinc-200">{item.question}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-zinc-400">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        <p className="mt-8 text-xs text-zinc-600">
          Запросы: {landing.keywords.join(', ')}.
        </p>

        <nav
          className="mt-10 border-t pt-8"
          style={{ borderColor: accentBorder }}
          aria-label="Другие гайды"
        >
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Смотрите также
          </h2>
          <ul className="mt-3 flex flex-wrap gap-3 text-sm">
            <li>
              <a
                href="/"
                className="hover:underline"
                style={{ color: accent }}
              >
                Генератор биндов
              </a>
            </li>
            <li>
              <a
                href="/guides"
                className="hover:underline"
                style={{ color: accent }}
              >
                Все гайды
              </a>
            </li>
            {related.map((l) => {
              const c = accentColorForTopic(l.topic)
              return (
                <li key={l.path}>
                  <a
                    href={l.path}
                    className="hover:underline"
                    style={{ color: c }}
                  >
                    {l.h1}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </article>
    </main>
  )
}
