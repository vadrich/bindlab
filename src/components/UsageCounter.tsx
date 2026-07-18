import { useEffect, useState } from 'react'
import { useMessages } from '../i18n/I18nProvider'
import {
  formatUsageCount,
  getUsageCount,
  subscribeUsageCount,
} from '../utils/usageCounter'

/** Top-right badge: site-wide bind copy count (all users). */
export function UsageCounter() {
  const m = useMessages()
  const [count, setCount] = useState(() => getUsageCount())

  useEffect(() => {
    const unsub = subscribeUsageCount(setCount)
    const sync = () => setCount(getUsageCount())
    window.addEventListener('cs2-usage-updated', sync)
    window.addEventListener('storage', sync)
    return () => {
      unsub()
      window.removeEventListener('cs2-usage-updated', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  return (
    <div
      className="flex h-14 shrink-0 min-w-[4.5rem] flex-col items-end justify-center rounded-lg border border-[#2a3340] bg-[#0d1117] px-3 text-right"
      title={m.usage.title}
    >
      <p className="text-[9px] font-semibold uppercase tracking-widest text-[#6b7280]">
        {m.usage.label}
      </p>
      <p className="font-mono text-lg font-bold tabular-nums leading-tight text-[var(--accent)]">
        {formatUsageCount(count)}
      </p>
    </div>
  )
}
