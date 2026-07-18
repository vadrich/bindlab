import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
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

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.2-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16.1 19 12 24 12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.9 26.8 37 24 37c-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.5 5.7-6.5 7.1l.1.1 6.2 5.2C37.8 38.3 44 33 44 24c0-1.3-.1-2.2-.4-3.5z"
      />
    </svg>
  )
}

function resolveAuthError(
  key: string | null,
  auth: ReturnType<typeof useMessages>['auth'],
): string | null {
  if (!key) return null
  const map: Record<string, string> = {
    'auth.errorInvalidEmail': auth.errorInvalidEmail,
    'auth.errorUserDisabled': auth.errorUserDisabled,
    'auth.errorBadCredentials': auth.errorBadCredentials,
    'auth.errorEmailInUse': auth.errorEmailInUse,
    'auth.errorWeakPassword': auth.errorWeakPassword,
    'auth.errorPopupClosed': auth.errorPopupClosed,
    'auth.errorPopupBlocked': auth.errorPopupBlocked,
    'auth.errorTooMany': auth.errorTooMany,
    'auth.errorNetwork': auth.errorNetwork,
    'auth.errorNotAllowed': auth.errorNotAllowed,
    'auth.errorNotConfigured': auth.errorNotConfigured,
    'auth.errorGeneric': auth.errorGeneric,
  }
  return map[key] ?? auth.errorGeneric
}

export function WelcomeGuide({ onDismiss, locked = false }: WelcomeGuideProps) {
  const m = useMessages()
  const g = m.guide
  const t = m.tabs
  const {
    configured,
    ready,
    user,
    busy,
    error,
    clearError,
    signInGoogle,
  } = useAuth()
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

  const timerDone = !locked || secondsLeft === 0
  /** When Firebase is configured, Google sign-in is required before «Start». */
  const needsGoogle = locked && configured
  const signedIn = Boolean(user)
  const canDismiss =
    timerDone && (!needsGoogle || signedIn) && (ready || !configured)

  const errorText = useMemo(
    () => resolveAuthError(error, m.auth),
    [error, m.auth],
  )

  const startLabel = (() => {
    if (locked && !timerDone) {
      return g.gotItWait.replace('{n}', String(secondsLeft))
    }
    if (needsGoogle && !signedIn) {
      return g.gotItNeedAuth
    }
    return locked ? g.gotIt : g.continue
  })()

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

        {locked && (
          <div
            className="welcome-fade-up mt-5 rounded-xl border border-amber-400/35 bg-amber-400/10 p-4"
            style={{ animationDelay: '180ms' }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-amber-200">
              {g.authGateTitle}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#e5e7eb]">
              {configured ? g.authGateBody : g.authGateNotConfigured}
            </p>

            {!ready && configured ? (
              <p className="mt-3 text-xs text-[#9ca3af]">{g.authGateLoading}</p>
            ) : null}

            {configured && signedIn ? (
              <p className="mt-3 text-sm font-semibold text-emerald-300">
                {g.authGateSignedIn.replace(
                  '{name}',
                  user?.displayName?.trim() ||
                    user?.email ||
                    m.auth.anonymousLabel,
                )}
              </p>
            ) : null}

            {configured && !signedIn ? (
              <button
                type="button"
                disabled={busy || !ready}
                onClick={() => {
                  clearError()
                  void signInGoogle()
                }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white px-3 py-3 text-sm font-bold uppercase tracking-wide text-[#1a1f28] transition-colors hover:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-6"
              >
                <GoogleMark />
                {busy ? m.auth.busy : g.authGateGoogle}
              </button>
            ) : null}

            {errorText ? (
              <p className="mt-3 text-xs leading-relaxed text-rose-300">
                {errorText}
              </p>
            ) : null}
          </div>
        )}

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
              ? 'border-amber-400/60 bg-amber-400/15 text-amber-100 hover:border-amber-300 hover:bg-amber-400/25'
              : 'cursor-not-allowed border-[#2a3340] bg-[#121820] text-[#4b5563]',
          ].join(' ')}
          style={{ animationDelay: '820ms' }}
        >
          {startLabel}
        </button>
      </div>
    </div>
  )
}
