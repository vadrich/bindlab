import { useMessages } from '../i18n/I18nProvider'
import type { TabTipKind } from '../utils/tabTips'

export type { TabTipKind }

interface TabTipModalProps {
  kind: TabTipKind
  onDismiss: () => void
}

/** First-open / reopen tips — color matches the tab theme. */
export function TabTipModal({ kind, onDismiss }: TabTipModalProps) {
  const t = useMessages().tips
  const copy = t[kind]

  return (
    <div className="mx-auto max-w-lg px-1 py-1" data-theme={kind}>
      <div
        className="rounded-lg border-2 bg-[#1a1f28] px-5 py-6 shadow-2xl shadow-black/50"
        style={{
          borderColor: 'var(--accent)',
          boxShadow: 'var(--accent-glow), 0 25px 50px rgba(0,0,0,0.55)',
        }}
      >
        <p
          className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.18em]"
          style={{ color: 'var(--accent-muted)' }}
        >
          {t.instructionBadge}
        </p>
        <h2
          className="text-lg font-bold tracking-tight"
          style={{ color: 'var(--accent)' }}
        >
          {copy.title}
        </h2>

        <div
          className="mt-4 rounded-lg border-2 px-3.5 py-3.5"
          style={{
            borderColor: 'var(--accent)',
            background: 'var(--accent-soft-bg)',
          }}
        >
          <p
            className="mb-2 text-[10px] font-bold uppercase tracking-widest"
            style={{ color: 'var(--accent)' }}
          >
            {t.howLabel}
          </p>
          <p className="text-[13px] font-medium leading-relaxed text-white">
            {copy.lead}
          </p>
        </div>

        <p className="mb-2 mt-4 text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">
          {t.tipsLabel}
        </p>
        <ul className="flex flex-col gap-2.5">
          {copy.points.map((point) => (
            <li
              key={point}
              className="rounded-lg border bg-[#141920] px-3.5 py-3 text-sm leading-relaxed text-[#e5e7eb]"
              style={{
                borderColor: 'color-mix(in srgb, var(--accent) 35%, #2a3340)',
                borderLeftWidth: 3,
                borderLeftColor: 'var(--accent)',
              }}
            >
              {point}
            </li>
          ))}
        </ul>

        {/* Highlighted: how to reopen this instruction */}
        <div
          className="mt-4 rounded-lg border-2 px-3.5 py-3.5"
          style={{
            borderColor: 'var(--accent)',
            background: 'var(--accent-soft)',
            boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--accent) 40%, transparent)',
          }}
        >
          <p
            className="mb-1.5 text-[10px] font-bold uppercase tracking-widest"
            style={{ color: 'var(--accent)' }}
          >
            {t.reopenCalloutTitle}
          </p>
          <p className="text-[13px] font-semibold leading-relaxed text-white">
            {t.reopenHint}
          </p>
          <p
            className="mt-2 rounded border px-2.5 py-1.5 text-center text-[12px] font-bold uppercase tracking-wide"
            style={{
              borderColor: 'var(--accent)',
              color: 'var(--accent-on)',
              background: 'var(--accent)',
            }}
          >
            {t.rmbShortcut}
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-[#c4c9d1]">
            {copy.footer}
          </p>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="mt-5 w-full rounded border py-2.5 text-sm font-bold uppercase tracking-wide transition-opacity hover:opacity-90"
          style={{
            borderColor: 'var(--accent)',
            background: 'var(--accent)',
            color: 'var(--accent-on)',
          }}
        >
          {t.gotIt}
        </button>
      </div>
    </div>
  )
}
