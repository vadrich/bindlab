import {
  TELEGRAM_FEEDBACK_HANDLE,
  TELEGRAM_FEEDBACK_URL,
} from '../data/feedback'
import { UTILITY_META, type UtilityId } from '../data/utilities'
import { useMessages } from '../i18n/I18nProvider'
import type { KeyConflict } from '../utils/bindConflicts'

interface NotificationsPanelProps {
  conflicts: KeyConflict[]
  onOpenUtility: (id: UtilityId) => void
  onOpenWeapons: () => void
  onOpenBuyBind?: (id: string) => void
}

export function NotificationsPanel({
  conflicts,
  onOpenUtility,
  onOpenWeapons,
  onOpenBuyBind,
}: NotificationsPanelProps) {
  const m = useMessages()
  const hasConflicts = conflicts.length > 0

  const sourceLabel = (source: KeyConflict['assignments'][0]['source']) => {
    if (source === 'buy') return m.notifications.sourceBuy
    return m.utilMeta[source]?.label ?? UTILITY_META[source].label
  }

  const actionLabel = (actionId: string, detail?: string) => {
    if (detail) return detail
    if (actionId === 'buy' || actionId.startsWith('buy.')) {
      return m.notifications.actions.buy
    }
    return m.notifications.actions[actionId] ?? actionId
  }

  return (
    <div className="ui-panel relative mx-auto max-w-3xl px-5 py-6">
      <div className="relative z-[1] mb-5">
        <h2 className="font-display text-lg font-bold text-white">{m.notifications.title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
          {m.notifications.lead}
        </p>
      </div>

      <div className="relative z-[1] flex flex-col gap-3">
        {/* Always-on trial / feedback notice */}
        <div className="rounded-xl border border-[var(--accent)]/50 bg-gradient-to-br from-[var(--accent-soft-bg)] to-[var(--accent-soft)] p-4 shadow-[0_0_24px_rgba(var(--accent-rgb),0.2)]">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">
            {m.notifications.trialTitle}
          </p>
          <p className="text-sm leading-relaxed text-[#e5e7eb]">
            {m.notifications.trialBodyBefore}
            <a
              href={TELEGRAM_FEEDBACK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[var(--accent)] underline decoration-[var(--accent)]/40 underline-offset-2 hover:decoration-[var(--accent)]"
            >
              {TELEGRAM_FEEDBACK_HANDLE}
            </a>
            {m.notifications.trialBodyAfter}
          </p>
          <a
            href={TELEGRAM_FEEDBACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex rounded border border-[var(--accent)]/60 bg-[var(--accent-soft-bg)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[var(--accent)] transition-colors hover:border-[var(--accent)]"
          >
            {m.notifications.trialLinkLabel}
          </a>
        </div>

        {!hasConflicts ? (
          <div className="rounded-lg border border-[#2a3340] bg-[#0a0e14] px-4 py-5 text-center">
            <p className="text-sm font-semibold text-[var(--accent-muted)]">
              {m.notifications.emptyTitle}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-[#6b7280]">
              {m.notifications.emptyBody}
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
              {m.notifications.conflictCount.replace(
                '{n}',
                String(conflicts.length),
              )}
            </p>

            {conflicts.map((conflict) => (
              <div
                key={conflict.key}
                className="rounded-lg border border-[var(--accent)]/50 bg-[var(--accent-soft)] p-4"
              >
                <div className="mb-3 flex flex-wrap items-baseline gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#9ca3af]">
                    {m.notifications.keyLabel}
                  </span>
                  <span className="font-mono text-lg font-bold text-[var(--accent)]">
                    {conflict.key}
                  </span>
                </div>
                <p className="mb-2 text-xs text-[#c4c9d1]">
                  {m.notifications.conflictLead}
                </p>
                <ul className="flex flex-col gap-2">
                  {conflict.assignments.map((a) => (
                    <li key={`${a.source}:${a.actionId}`}>
                      <button
                        type="button"
                        onClick={() => {
                          if (a.source === 'buy') {
                            if (
                              onOpenBuyBind &&
                              a.actionId.startsWith('buy.')
                            ) {
                              onOpenBuyBind(a.actionId.slice(4))
                            } else {
                              onOpenWeapons()
                            }
                          } else {
                            onOpenUtility(a.source)
                          }
                        }}
                        className="flex w-full items-start gap-3 rounded border border-[#2a3340] bg-[#0a0e14] px-3 py-2.5 text-left transition-colors hover:border-[var(--accent)]/60"
                      >
                        <span className="mt-0.5 shrink-0 rounded bg-[var(--accent-soft-bg)] px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-[var(--accent)]">
                          {sourceLabel(a.source)}
                        </span>
                        <span className="min-w-0 flex-1 text-sm text-[#e5e7eb]">
                          {actionLabel(a.actionId, a.detail)}
                        </span>
                        <span className="shrink-0 text-[10px] text-[#6b7280]">
                          →
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
