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

function ArrowUpRight({ color }: { color: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M8 20L20 8M20 8H11M20 8V17"
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
      hint: g.tabWeapons,
    },
    {
      id: 'utilities' as const,
      color: TAB_COLOR.utilities,
      name: t.utilities,
      hint: g.tabUtilities,
    },
    {
      id: 'unbind' as const,
      color: TAB_COLOR.unbind,
      name: t.unbind,
      hint: g.tabUnbind,
    },
  ]

  const headerItems =
    mode === 'tour'
      ? [
          {
            id: 'profile' as const,
            color: TAB_COLOR.profile,
            name: t.profile,
            hint: g.tabProfile,
          },
          {
            id: 'notifications' as const,
            color: TAB_COLOR.notifications,
            name: t.notifications,
            hint: g.tabNotifications,
          },
        ]
      : []

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
        {mode === 'tour' ? g.homeEyebrowTour : g.homeEyebrowStart}
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
        {mode === 'tour' ? g.homeTourLead : g.homeLead}
      </p>

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
              {mode === 'tour' && (
                <p className="mt-0.5 text-[11px] leading-relaxed text-[#9ca3af]">
                  {item.hint}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {headerItems.length > 0 && (
        <div
          className="welcome-fade-up mt-6 w-full space-y-3 text-left"
          style={{ animationDelay: '620ms' }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">
            {g.homeHeaderHint}
          </p>
          {headerItems.map((item, i) => (
            <div
              key={item.id}
              className="welcome-row flex items-start gap-3 rounded-xl border border-white/10 bg-[color-mix(in_srgb,var(--panel-solid)_90%,transparent)] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
              style={{
                borderLeftWidth: 3,
                borderLeftColor: item.color,
                animationDelay: `${700 + i * 90}ms`,
              }}
            >
              <ArrowUpRight color={item.color} />
              <div className="min-w-0">
                <p className="text-sm font-bold" style={{ color: item.color }}>
                  {item.name}
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-[#9ca3af]">
                  {item.hint}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {mode === 'tour' ? (
        <div
          className="welcome-fade-up mt-6 w-full rounded-lg border-2 border-amber-400/80 bg-amber-400/15 px-4 py-3.5 text-left shadow-[0_0_20px_rgba(251,191,36,0.2)]"
          style={{ animationDelay: '900ms' }}
        >
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-300">
            {g.homeRmbTitle}
          </p>
          <p className="text-[13px] font-semibold leading-relaxed text-white">
            {g.homeRmbBody}
          </p>
          <p className="mt-2 rounded border border-amber-400 bg-amber-400 px-2.5 py-1.5 text-center text-[12px] font-bold uppercase tracking-wide text-black">
            {m.tips.rmbShortcut}
          </p>
        </div>
      ) : (
        <p
          className="welcome-fade-up mt-6 text-[12px] leading-relaxed text-[#9ca3af]"
          style={{ animationDelay: '700ms' }}
        >
          {g.homeStartFooter}
        </p>
      )}
    </div>
  )
}
