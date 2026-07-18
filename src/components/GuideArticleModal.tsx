'use client'

import { createPortal } from 'react-dom'
import type { SeoLanding } from '../data/seoLandings'
import {
  accentColorForTopic,
  accentLabelForTopic,
  withAlpha,
} from '../data/seoTheme'
import { useMessages } from '../i18n/I18nProvider'

type Props = {
  landing: SeoLanding
  onClose: () => void
  onOpenGenerator: (href: string) => void
}

/** In-app reader for SEO guides — user stays on BindLab. */
export function GuideArticleModal({
  landing,
  onClose,
  onOpenGenerator,
}: Props) {
  const m = useMessages()
  const accent = accentColorForTopic(landing.topic)
  const accentBorder = withAlpha(accent, 0.4)
  const accentSoft = withAlpha(accent, 0.12)

  return createPortal(
    <div
      className="fixed inset-0 z-[85] flex items-start justify-center overflow-y-auto bg-black/70 px-3 py-8 backdrop-blur-md sm:items-center sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-label={landing.h1}
      onClick={onClose}
    >
      <article
        className="ui-panel panel-enter relative max-h-[min(88vh,840px)] w-full max-w-2xl overflow-y-auto p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:p-6"
        style={{
          borderColor: accentBorder,
          boxShadow: `inset 4px 0 0 ${accent}, 0 24px 80px rgba(0,0,0,0.55)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative z-[1] mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: accent }}
            >
              {m.search.guideBadge} · {accentLabelForTopic(landing.topic)}
            </p>
            <h2 className="mt-1 font-display text-xl font-bold text-zinc-100 sm:text-2xl">
              {landing.h1}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ui-btn-ghost shrink-0 !px-2.5 !py-1.5 text-[10px]"
          >
            Esc
          </button>
        </div>

        <p className="relative z-[1] text-sm leading-relaxed text-zinc-400">
          {landing.lead}
        </p>

        {landing.steps?.length ? (
          <ol className="relative z-[1] mt-5 list-decimal space-y-2 pl-5 text-sm text-zinc-400">
            {landing.steps.map((step) => (
              <li key={step.name}>
                <span className="font-medium text-zinc-200">{step.name}.</span>{' '}
                {step.text}
              </li>
            ))}
          </ol>
        ) : null}

        <div className="relative z-[1] mt-5 space-y-4">
          {landing.sections.map((section) => (
            <section key={section.heading}>
              <h3 className="text-sm font-semibold text-zinc-200">
                {section.heading}
              </h3>
              <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        {landing.faq?.length ? (
          <div
            className="relative z-[1] mt-5 space-y-3 border-t pt-4"
            style={{ borderColor: accentBorder }}
          >
            {landing.faq.map((item) => (
              <div key={item.question}>
                <p className="text-xs font-semibold text-zinc-200">
                  {item.question}
                </p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-zinc-500">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="relative z-[1] mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onOpenGenerator(landing.ctaHref)}
            className="rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-black"
            style={{
              backgroundColor: accent,
              border: `1px solid ${accentBorder}`,
            }}
          >
            {landing.ctaLabel}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-zinc-400"
            style={{
              borderColor: accentBorder,
              backgroundColor: accentSoft,
            }}
          >
            {m.search.closeGuide}
          </button>
        </div>
      </article>
    </div>,
    document.body,
  )
}
