import { useEffect, useState } from 'react'
import { useMessages } from '../i18n/I18nProvider'
import { TAB_COLOR } from './HomeIdlePanel'
import { LanguageSwitcher } from './LanguageSwitcher'

const GOT_IT_DELAY_SEC = 3

interface WelcomeGuideProps {
  onDismiss: () => void
  /** First-visit modal: stronger card contrast over blur; uses «Got it · start» + timer */
  locked?: boolean
}

function TabName({
  color,
  children,
}: {
  color: string
  children: string
}) {
  return (
    <span className="font-bold" style={{ color }}>
      {children}
    </span>
  )
}

export function WelcomeGuide({ onDismiss, locked = false }: WelcomeGuideProps) {
  const m = useMessages()
  const g = m.guide
  const t = m.tabs
  const [secondsLeft, setSecondsLeft] = useState(locked ? GOT_IT_DELAY_SEC : 0)

  useEffect(() => {
    if (!locked) {
      setSecondsLeft(0)
      return
    }
    setSecondsLeft(GOT_IT_DELAY_SEC)
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
  }, [locked])

  const canDismiss = !locked || secondsLeft === 0

  const tabRows: {
    color: string
    name: string
    body: string
  }[] = [
    {
      color: TAB_COLOR.weapons,
      name: t.weapons,
      body: g.tabWeapons,
    },
    {
      color: TAB_COLOR.utilities,
      name: t.utilities,
      body: g.tabUtilities,
    },
    {
      color: TAB_COLOR.unbind,
      name: t.unbind,
      body: g.tabUnbind,
    },
    {
      color: TAB_COLOR.profile,
      name: t.profile,
      body: g.tabProfile,
    },
    {
      color: TAB_COLOR.notifications,
      name: t.notifications,
      body: g.tabNotifications,
    },
  ]

  return (
    <div className="mx-auto max-w-3xl px-1 py-1">
      <div
        className={[
          'welcome-fade-up rounded-lg border border-[#3a4555] bg-[#1a1f28] px-5 py-6',
          locked ? 'shadow-2xl shadow-black/50' : '',
        ].join(' ')}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-300/95">
            {g.importantRead}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-[#6b7280]">
              {m.lang.label}
            </span>
            <LanguageSwitcher />
          </div>
        </div>

        <h2
          className="welcome-fade-up text-xl font-bold text-white sm:text-2xl"
          style={{ animationDelay: '80ms' }}
        >
          {g.title}
        </h2>
        <p
          className="welcome-fade-up mt-2 text-sm leading-relaxed text-[#c4c9d1]"
          style={{ animationDelay: '140ms' }}
        >
          {g.lead}
        </p>

        <div
          className="welcome-fade-up mt-5 grid gap-3 sm:grid-cols-2"
          style={{ animationDelay: '200ms' }}
        >
          <div className="rounded-xl border border-white/10 bg-black/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(var(--accent-rgb),0.4)] hover:shadow-[0_8px_24px_rgba(var(--accent-rgb),0.12)]">
            <p className="text-xs font-bold uppercase tracking-widest text-white">
              {g.pathImmediateTitle}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#e5e7eb]">
              {g.pathImmediateBody}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(var(--accent-rgb),0.4)] hover:shadow-[0_8px_24px_rgba(var(--accent-rgb),0.12)]">
            <p className="text-xs font-bold uppercase tracking-widest text-white">
              {g.pathConfigTitle}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#e5e7eb]">
              {g.pathConfigBody}
            </p>
          </div>
        </div>

        <h3
          className="welcome-fade-up mb-3 mt-6 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]"
          style={{ animationDelay: '280ms' }}
        >
          {g.tabsTitle}
        </h3>
        <ul className="flex flex-col gap-2.5">
          {tabRows.map((row, i) => (
            <li
              key={row.name}
              className="welcome-row rounded-xl border border-white/10 bg-black/25 px-3.5 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20"
              style={{
                borderLeftWidth: 3,
                borderLeftColor: row.color,
                animationDelay: `${320 + i * 70}ms`,
              }}
            >
              <p className="text-sm leading-relaxed text-[#e5e7eb]">
                <TabName color={row.color}>{row.name}</TabName>
                <span className="text-[#6b7280]"> · </span>
                {row.body}
              </p>
            </li>
          ))}
        </ul>

        <p
          className="welcome-fade-up mt-4 text-xs leading-relaxed text-[#6b7280]"
          style={{ animationDelay: '700ms' }}
        >
          {g.sidebarNote}
        </p>
        <p
          className="welcome-fade-up mt-2 text-xs leading-relaxed text-[#9ca3af]"
          style={{ animationDelay: '760ms' }}
        >
          {g.reopenHint}
        </p>

        <button
          type="button"
          disabled={!canDismiss}
          onClick={onDismiss}
          className={[
            'welcome-fade-up mt-5 w-full rounded border py-2.5 text-sm font-bold uppercase tracking-wide transition-colors sm:w-auto sm:px-8',
            canDismiss
              ? 'border-[#6b7280] bg-[#2a3340] text-white hover:border-[#9ca3af] hover:bg-[#343e4e]'
              : 'cursor-not-allowed border-[#2a3340] bg-[#121820] text-[#4b5563]',
          ].join(' ')}
          style={{ animationDelay: '820ms' }}
        >
          {locked
            ? canDismiss
              ? g.gotIt
              : g.gotItWait.replace('{n}', String(secondsLeft))
            : g.continue}
        </button>
      </div>
    </div>
  )
}
