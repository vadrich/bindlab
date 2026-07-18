import { useMemo, useState, type FormEvent } from 'react'
import { useAuth, type AuthMode } from '../auth/AuthContext'
import { useMessages } from '../i18n/I18nProvider'

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

export function AuthPanel() {
  const m = useMessages()
  const {
    configured,
    ready,
    user,
    busy,
    error,
    clearError,
    signInEmail,
    signUpEmail,
    signInGoogle,
    resetPassword,
    signOut,
  } = useAuth()

  const [mode, setMode] = useState<AuthMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [info, setInfo] = useState<string | null>(null)

  const errorText = useMemo(
    () => resolveAuthError(error, m.auth),
    [error, m.auth],
  )

  if (!ready) {
    return (
      <section className="ui-panel-inner relative p-4">
        <p className="text-xs text-[var(--text-muted)]">{m.auth.loading}</p>
      </section>
    )
  }

  if (!configured) {
    return (
      <section className="ui-panel-inner relative p-4">
        <h3 className="mb-1 font-display text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-muted)]">
          {m.auth.title}
        </h3>
        <p className="text-[11px] leading-relaxed text-[#6b7280]">
          {m.auth.notConfigured}
        </p>
      </section>
    )
  }

  if (user) {
    const label =
      user.displayName?.trim() || user.email || m.auth.anonymousLabel
    return (
      <section className="ui-panel-inner relative p-4">
        <h3 className="mb-1 font-display text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-muted)]">
          {m.auth.title}
        </h3>
        <p className="mb-3 text-[11px] text-[#6b7280]">{m.auth.signedInHint}</p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{label}</p>
            {user.email && user.displayName ? (
              <p className="truncate text-[11px] text-[var(--text-muted)]">
                {user.email}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() => void signOut()}
            className="rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)] transition-colors hover:border-white/30 hover:text-white disabled:opacity-50"
          >
            {m.auth.signOut}
          </button>
        </div>
        {errorText ? (
          <p className="mt-3 text-[11px] text-rose-300">{errorText}</p>
        ) : null}
      </section>
    )
  }

  const switchMode = (next: AuthMode) => {
    setMode(next)
    clearError()
    setInfo(null)
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setInfo(null)
    if (mode === 'signin') {
      await signInEmail(email, password)
    } else {
      await signUpEmail(email, password, displayName)
    }
  }

  const onReset = async () => {
    setInfo(null)
    clearError()
    if (!email.trim()) {
      setInfo(m.auth.resetNeedEmail)
      return
    }
    const ok = await resetPassword(email)
    if (ok) setInfo(m.auth.resetSent)
  }

  return (
    <section className="ui-panel-inner relative p-4">
      <h3 className="mb-1 font-display text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-muted)]">
        {m.auth.title}
      </h3>
      <p className="mb-3 text-[11px] leading-relaxed text-[#6b7280]">
        {m.auth.lead}
      </p>

      <div className="mb-3 flex gap-1.5">
        <button
          type="button"
          onClick={() => switchMode('signin')}
          className={[
            'rounded-md border px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide transition-colors',
            mode === 'signin'
              ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
              : 'border-white/10 text-[var(--text-muted)] hover:border-white/25',
          ].join(' ')}
        >
          {m.auth.signInTab}
        </button>
        <button
          type="button"
          onClick={() => switchMode('signup')}
          className={[
            'rounded-md border px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide transition-colors',
            mode === 'signup'
              ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
              : 'border-white/10 text-[var(--text-muted)] hover:border-white/25',
          ].join(' ')}
        >
          {m.auth.signUpTab}
        </button>
      </div>

      <form className="flex flex-col gap-2.5" onSubmit={(e) => void onSubmit(e)}>
        {mode === 'signup' ? (
          <label className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wide text-[var(--text-dim)]">
              {m.auth.nameLabel}
            </span>
            <input
              type="text"
              autoComplete="nickname"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={m.auth.namePlaceholder}
              className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none placeholder:text-white/25 focus:border-[var(--accent)]/50"
            />
          </label>
        ) : null}

        <label className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wide text-[var(--text-dim)]">
            {m.auth.emailLabel}
          </span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none placeholder:text-white/25 focus:border-[var(--accent)]/50"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wide text-[var(--text-dim)]">
            {m.auth.passwordLabel}
          </span>
          <input
            type="password"
            required
            minLength={6}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none placeholder:text-white/25 focus:border-[var(--accent)]/50"
          />
        </label>

        {errorText ? (
          <p className="text-[11px] text-rose-300">{errorText}</p>
        ) : null}
        {info ? (
          <p className="text-[11px] text-[var(--accent-muted)]">{info}</p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="rounded-lg border border-[var(--accent)]/50 bg-[var(--accent-soft)] px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[var(--accent)] transition-colors hover:border-[var(--accent)] disabled:opacity-50"
        >
          {busy
            ? m.auth.busy
            : mode === 'signin'
              ? m.auth.signInSubmit
              : m.auth.signUpSubmit}
        </button>
      </form>

      {mode === 'signin' ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => void onReset()}
          className="mt-2 text-left text-[11px] text-[var(--text-muted)] underline-offset-2 hover:text-[var(--accent-muted)] hover:underline disabled:opacity-50"
        >
          {m.auth.forgotPassword}
        </button>
      ) : null}

      <div className="my-3 flex items-center gap-2">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-[10px] uppercase tracking-wide text-white/30">
          {m.auth.or}
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <button
        type="button"
        disabled={busy}
        onClick={() => void signInGoogle()}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-white transition-colors hover:border-white/30 hover:bg-white/10 disabled:opacity-50"
      >
        <GoogleMark />
        {m.auth.google}
      </button>
    </section>
  )
}

function GoogleMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 48 48" aria-hidden>
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
