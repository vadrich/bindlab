import { useEffect, useState } from 'react'
import { useMessages } from '../i18n/I18nProvider'

const PROFILE_COLOR = '#a3e635'
const CLEAR_DELAY_SEC = 3

interface ClearHistoryModalProps {
  onConfirm: () => void
  onCancel: () => void
}

export function ClearHistoryModal({ onConfirm, onCancel }: ClearHistoryModalProps) {
  const m = useMessages()
  const s = m.sidebar
  const [secondsLeft, setSecondsLeft] = useState(CLEAR_DELAY_SEC)

  useEffect(() => {
    setSecondsLeft(CLEAR_DELAY_SEC)
    const id = window.setInterval(() => {
      setSecondsLeft((n) => {
        if (n <= 1) {
          window.clearInterval(id)
          return 0
        }
        return n - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  const canClear = secondsLeft === 0

  return (
    <div className="mx-auto max-w-lg px-1 py-1">
      <div className="rounded-lg border border-[#3a4555] bg-[#1a1f28] px-5 py-6 shadow-2xl shadow-black/50">
        <h2 className="text-lg font-bold text-white">{s.clearHistoryTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#9ca3af]">
          {s.clearHistoryLead}
        </p>

        <div className="mt-4 rounded-lg border border-[#2a3340] bg-[#141920] p-4">
          <p className="text-sm leading-relaxed text-[#e5e7eb]">
            {s.clearHistoryWarn}
          </p>
        </div>

        <div
          className="mt-3 rounded-lg border border-[#2a3340] bg-[#141920] px-3.5 py-3"
          style={{ borderLeftWidth: 3, borderLeftColor: '#ef4444' }}
        >
          <p className="text-sm leading-relaxed text-[#e5e7eb]">
            {s.clearHistoryUnbindNote}
          </p>
        </div>

        <div
          className="mt-3 rounded-lg border border-[#2a3340] bg-[#141920] px-3.5 py-3"
          style={{ borderLeftWidth: 3, borderLeftColor: PROFILE_COLOR }}
        >
          <p className="text-sm leading-relaxed text-[#e5e7eb]">
            {s.clearHistorySaveBefore}{' '}
            <span className="font-bold" style={{ color: PROFILE_COLOR }}>
              {m.tabs.profile}
            </span>
            {s.clearHistorySaveWhere}
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-[#6b7280] bg-[#2a3340] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:border-[#9ca3af] hover:bg-[#343e4e]"
          >
            {s.clearHistoryCancel}
          </button>
          <button
            type="button"
            disabled={!canClear}
            onClick={onConfirm}
            className={[
              'rounded border px-5 py-2.5 text-sm font-bold uppercase tracking-wide transition-colors',
              canClear
                ? 'border-red-500/70 bg-red-500/20 text-red-300 hover:border-red-400 hover:bg-red-500/30'
                : 'cursor-not-allowed border-[#2a3340] bg-[#121820] text-[#4b5563]',
            ].join(' ')}
          >
            {canClear
              ? s.clearHistoryConfirmBtn
              : s.clearHistoryWait.replace('{n}', String(secondsLeft))}
          </button>
        </div>
      </div>
    </div>
  )
}
