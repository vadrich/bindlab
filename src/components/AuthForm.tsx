import { useMemo } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useMessages } from '../i18n/I18nProvider'

function resolveAuthError(
  key: string | null,
  auth: ReturnType<typeof useMessages>['auth'],
): string | null {
  if (!key) return null
  const map: Record<string, string> = {
    'auth.errorUserDisabled': auth.errorUserDisabled,
    'auth.errorPopupClosed': auth.errorPopupClosed,
    'auth.errorPopupBlocked': auth.errorPopupBlocked,
    'auth.errorTooMany': auth.errorTooMany,
    'auth.errorNetwork': auth.errorNetwork,
    'auth.errorNotAllowed': auth.errorNotAllowed,
    'auth.errorUnauthorizedDomain': auth.errorUnauthorizedDomain,
    'auth.errorNotConfigured': auth.errorNotConfigured,
    'auth.errorGeneric': auth.errorGeneric,
  }
  return map[key] ?? auth.errorGeneric
}

function GoogleMark({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
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

type Props = {
  /** Larger controls for the welcome gate */
  variant?: 'panel' | 'gate'
}

/** Google sign-in + guest trial (shared by AuthPanel and WelcomeGuide). */
export function AuthForm({ variant = 'panel' }: Props) {
  const m = useMessages()
  const { busy, error, clearError, signInGoogle, enterAsGuest } = useAuth()

  const errorText = useMemo(
    () => resolveAuthError(error, m.auth),
    [error, m.auth],
  )

  const gate = variant === 'gate'

  return (
    <div className={gate ? 'mt-4 flex flex-col gap-3' : 'flex flex-col gap-2.5'}>
      <button
        type="button"
        disabled={busy}
        onClick={() => {
          clearError()
          void signInGoogle()
        }}
        className={
          gate
            ? 'flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white px-3 py-3 text-sm font-bold uppercase tracking-wide text-[#1a1f28] transition-colors hover:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:opacity-50'
            : 'flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-white transition-colors hover:border-white/30 hover:bg-white/10 disabled:opacity-50'
        }
      >
        <GoogleMark size={gate ? 16 : 14} />
        {busy ? m.auth.busy : gate ? m.guide.authGateGoogle : m.auth.google}
      </button>

      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-[10px] uppercase tracking-wide text-white/30">
          {m.auth.or}
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <button
        type="button"
        disabled={busy}
        onClick={() => enterAsGuest()}
        className={
          gate
            ? 'w-full rounded-lg border border-zinc-500/50 bg-zinc-800/50 px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-zinc-200 transition-colors hover:border-zinc-400 hover:bg-zinc-700/50 disabled:opacity-50'
            : 'w-full rounded-lg border border-white/12 bg-black/30 px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)] transition-colors hover:border-white/25 hover:text-white disabled:opacity-50'
        }
      >
        {gate ? m.guide.authGateGuest : m.auth.guestButton}
      </button>

      <p
        className={
          gate
            ? 'text-center text-[11px] leading-relaxed text-zinc-400'
            : 'text-[10px] leading-relaxed text-[#6b7280]'
        }
      >
        {m.auth.guestHint}
      </p>

      {errorText ? (
        <p className={`text-rose-300 ${gate ? 'text-xs' : 'text-[11px]'}`}>
          {errorText}
        </p>
      ) : null}
    </div>
  )
}
