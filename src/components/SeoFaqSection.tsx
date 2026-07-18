import type { SeoFaqItem } from '../../seo.config'
import { SEO_LANDINGS } from '../data/seoLandings'

type Props = {
  items: SeoFaqItem[]
}

/**
 * Compact FAQ for humans + full guide index hidden visually (still in HTML for crawlers).
 */
export function SeoFaqSection({ items }: Props) {
  return (
    <section
      id="faq"
      className="border-t border-white/10 bg-surface-bg px-4 py-8 text-slate-200"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-3xl">
        <details className="group rounded-xl border border-white/10 bg-black/25 px-4 py-3">
          <summary
            id="faq-heading"
            className="cursor-pointer list-none font-display text-lg font-semibold text-white marker:content-none [&::-webkit-details-marker]:hidden"
          >
            <span className="flex items-center justify-between gap-3">
              Частые вопросы о биндах CS2
              <span className="text-xs font-normal text-slate-500 group-open:hidden">
                открыть
              </span>
              <span className="hidden text-xs font-normal text-slate-500 group-open:inline">
                свернуть
              </span>
            </span>
          </summary>
          <dl className="mt-5 space-y-5 border-t border-white/10 pt-5">
            {items.map((item) => (
              <div key={item.question}>
                <dt className="font-medium text-white">{item.question}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-slate-300">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-sm text-slate-400">
            Ответы также доступны в поиске BindLab (иконка лупы / Ctrl+K) — без
            ухода со страницы.
          </p>
        </details>

        {/* Full internal link graph for crawlers — not shown in the UI */}
        <nav className="sr-only" aria-label="SEO guides index">
          <h2>Гайды CS2 BindLab</h2>
          <ul>
            <li>
              <a href="/guides">Все гайды</a>
            </li>
            {SEO_LANDINGS.map((landing) => (
              <li key={landing.path}>
                <a href={landing.path}>{landing.h1}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
