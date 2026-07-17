import { useEffect, useRef, useState } from 'react'
import type { UtilityId } from '../data/utilities'
import { useMessages } from '../i18n/I18nProvider'
import type { KeyConflict } from '../utils/bindConflicts'
import { NotificationsPanel } from './NotificationsPanel'

interface NotificationsButtonProps {
  conflicts: KeyConflict[]
  onOpenUtility: (id: UtilityId) => void
  onOpenWeapons: () => void
}

/** Header chip — same height as UsageCounter / LanguageSwitcher. */
export function NotificationsButton({
  conflicts,
  onOpenUtility,
  onOpenWeapons,
}: NotificationsButtonProps) {
  const m = useMessages()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const count = conflicts.length
  const hasConflicts = count > 0

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={m.notifications.title}
        title={m.notifications.title}
        className={[
          'flex h-14 min-w-[4.5rem] flex-col items-end justify-center rounded-lg border px-3 text-right transition-colors',
          open || hasConflicts
            ? 'border-[#f59e0b]/60 bg-[rgba(245,158,11,0.12)]'
            : 'border-[#2a3340] bg-[#0d1117] hover:border-[#f59e0b]/40',
        ].join(' ')}
      >
        <p className="text-[9px] font-semibold uppercase tracking-widest text-[#6b7280]">
          {m.notifications.title}
        </p>
        <p
          className={[
            'font-mono text-lg font-bold tabular-nums leading-tight',
            hasConflicts ? 'text-[#f59e0b]' : 'text-[#6b7280]',
          ].join(' ')}
        >
          {count}
        </p>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-[min(420px,calc(100vw-2rem))] max-h-[min(70vh,520px)] overflow-auto rounded-lg border border-[#2a3340] bg-[#121820] p-4 shadow-xl shadow-black/50">
          <NotificationsPanel
            conflicts={conflicts}
            onOpenUtility={(id) => {
              setOpen(false)
              onOpenUtility(id)
            }}
            onOpenWeapons={() => {
              setOpen(false)
              onOpenWeapons()
            }}
          />
        </div>
      )}
    </div>
  )
}
