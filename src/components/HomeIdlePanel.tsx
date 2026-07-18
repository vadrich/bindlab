import { useMessages } from '../i18n/I18nProvider'
import { SiteLogo } from './SiteLogo'

export const TAB_COLOR = {
  weapons: '#ff8a1f',
  utilities: '#2de8ff',
  unbind: '#ff4d5e',
  profile: '#b8f03c',
  notifications: '#d28dff',
} as const

export type HomeHintMode = 'start' | 'tour'

interface HomeIdlePanelProps {
  /** start = 3 left tabs after welcome; tour = all 5 when reopening ! */
  mode: HomeHintMode
}

function ArrowLeft({ color }: { color: string }) {
  return (
    <svg
      width="36"
      height="20"
      viewBox="0 0 36 20"
      aria-hidden
      className="welcome-arrow-pulse shrink-0"
    >
      <path
        d="M34 10H6M6 10L14 3M6 10L14 17"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowUp({ color }: { color: string }) {
  return (
    <svg
      width="22"
      height="36"
      viewBox="0 0 22 36"
      aria-hidden
      className="welcome-arrow-pulse shrink-0"
    >
      <path
        d="M11 34V6M11 6L4 14M11 6L18 14"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Idle / post-welcome center: logo, welcome, colored arrows to tabs. */
export function HomeIdlePanel({ mode }: HomeIdlePanelProps) {
  const m = useMessages()
  const g = m.guide
  const t = m.tabs

  const leftItems = [
    {
      id: 'weapons' as const,
      color: TAB_COLOR.weapons,
      name: t.weapons,
    },
    {
      id: 'utilities' as const,
      color: TAB_COLOR.utilities,
      name: t.utilities,
    },
    {
      id: 'unbind' as const,
      color: TAB_COLOR.unbind,
      name: t.unbind,
    },
  ]

  return (
    <div
      key={mode}
      className="mx-auto flex max-w-xl flex-col items-center px-2 py-6 text-center"
    >
      <SiteLogo className="welcome-logo-in h-16 w-16 text-[var(--accent)]" />
      <p
        className="welcome-fade-up mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300/90"
        style={{ animationDelay: '80ms' }}
      >
        {g.homeEyebrowStart}
      </p>
      <h2
        className="welcome-fade-up mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl"
        style={{ animationDelay: '140ms' }}
      >
        {g.homeTitle}
      </h2>
      <p
        className="welcome-fade-up mt-2 max-w-md text-sm leading-relaxed text-[#c4c9d1]"
        style={{ animationDelay: '220ms' }}
      >
        {g.homeLead}
      </p>

      <div
        className="welcome-fade-up mt-5 flex w-full max-w-md flex-col items-center gap-2 rounded-xl border border-zinc-500/40 bg-zinc-800/40 px-4 py-3"
        style={{ animationDelay: '260ms' }}
      >
        <ArrowUp color="#a1a1aa" />
        <p className="text-center text-sm font-semibold leading-snug text-zinc-200">
          {g.homeSearchHint}
        </p>
        <p className="text-center text-[11px] text-zinc-400">
          {g.homeSearchHintSub}
        </p>
      </div>

      <div
        className="welcome-fade-up mt-8 w-full space-y-3 text-left"
        style={{ animationDelay: '300ms' }}
      >
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">
          {g.homeLeftHint}
        </p>
        {leftItems.map((item, i) => (
          <div
            key={item.id}
            className="welcome-row flex items-start gap-3 rounded-xl border border-white/10 bg-[color-mix(in_srgb,var(--panel-solid)_90%,transparent)] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
            style={{
              borderLeftWidth: 3,
              borderLeftColor: item.color,
              animationDelay: `${360 + i * 90}ms`,
            }}
          >
            <ArrowLeft color={item.color} />
            <div className="min-w-0">
              <p className="text-sm font-bold" style={{ color: item.color }}>
                {item.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
