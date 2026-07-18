import type { Metadata } from 'next'
import { SEO_LANDINGS } from '../../src/data/seoLandings'
import type { SeoGroup } from '../../src/data/seoTopicTemplates'
import {
  accentColorForTopic,
  withAlpha,
} from '../../src/data/seoTheme'
import { SITE_NAME, SITE_URL } from '../../seo.config'

export const metadata: Metadata = {
  title: 'Гайды CS2 / ксго2 — 500 страниц | BindLab',
  description:
    'Каталог гайдов CS2 и ксго2: карты, оружие, ранги, экономика, настройки и бинды. С каждой страницы можно перейти в генератор BindLab.',
  alternates: { canonical: '/guides' },
  openGraph: {
    title: 'Гайды CS2 / ксго2 · BindLab',
    description: `Каталог из ${SEO_LANDINGS.length} страниц про Counter-Strike 2 с переходом в генератор биндов.`,
    url: `${SITE_URL}/guides`,
  },
}

const GROUPS: { id: SeoGroup; title: string }[] = [
  { id: 'how-to', title: 'Как сделать (бинды и команды)' },
  { id: 'binds', title: 'Бинды и настройки' },
  { id: 'guides', title: 'Конфиг и гайды' },
  { id: 'cs2', title: 'CS2 / ксго2 — карты, оружие, советы' },
]

export default function GuidesHubPage() {
  return (
    <main className="min-h-screen bg-[#141618] px-4 py-12 text-zinc-300">
      <div className="mx-auto max-w-3xl">
        <p className="font-display text-sm font-semibold uppercase tracking-widest text-zinc-500">
          {SITE_NAME}
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
          Гайды CS2 / ксго2
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-zinc-400">
          {SEO_LANDINGS.length} страниц про Counter-Strike 2: карты, оружие,
          ранги, экономику, настройки и бинды. Цель — помочь по теме запроса и
          привести к генератору BindLab, где конфиг копируется в консоль.
        </p>
        <p className="mt-6">
          <a
            href="/"
            className="inline-flex items-center rounded-lg bg-zinc-600 px-5 py-2.5 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-500"
          >
            Открыть генератор BindLab
          </a>
        </p>

        {GROUPS.map((group) => {
          const items = SEO_LANDINGS.filter((l) => l.group === group.id)
          if (!items.length) return null
          return (
            <section key={group.id} className="mt-12">
              <h2 className="font-display text-xl font-semibold text-zinc-100">
                {group.title}{' '}
                <span className="text-base font-normal text-zinc-500">
                  ({items.length})
                </span>
              </h2>
              <ul className="mt-4 max-h-[28rem] space-y-2 overflow-y-auto pr-1">
                {items.map((landing) => {
                  const accent = accentColorForTopic(landing.topic)
                  return (
                    <li key={landing.path}>
                      <a
                        href={landing.path}
                        className="block rounded-lg border bg-zinc-900/60 px-3 py-2 text-sm transition hover:bg-zinc-800/70"
                        style={{
                          borderColor: withAlpha(accent, 0.35),
                          borderLeftWidth: 3,
                          borderLeftColor: accent,
                        }}
                      >
                        <span
                          className="font-medium"
                          style={{ color: accent }}
                        >
                          {landing.h1}
                        </span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>
    </main>
  )
}
