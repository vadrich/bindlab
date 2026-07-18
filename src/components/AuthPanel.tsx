import { useAuth } from '../auth/AuthContext'
import { useMessages } from '../i18n/I18nProvider'
import { AuthForm } from './AuthForm'

export function AuthPanel() {
  const m = useMessages()
  const {
    configured,
    ready,
    user,
    isGuest,
    busy,
    error,
    signOut,
    signInGoogle,
    clearError,
  } = useAuth()

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
        {error ? (
          <p className="mt-3 text-[11px] text-rose-300">{m.auth.errorGeneric}</p>
        ) : null}
      </section>
    )
  }

  if (isGuest) {
    return (
      <section className="ui-panel-inner relative p-4">
        <h3 className="mb-1 font-display text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-muted)]">
          {m.auth.title}
        </h3>
        <p className="mb-3 text-[11px] leading-relaxed text-[#6b7280]">
          {m.auth.guestSignedInHint}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              clearError()
              void signInGoogle()
            }}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-white transition-colors hover:border-white/30 hover:bg-white/10 disabled:opacity-50"
          >
            {busy ? m.auth.busy : m.auth.google}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void signOut()}
            className="rounded-lg border border-white/15 bg-black/30 px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)] transition-colors hover:border-white/30 hover:text-white disabled:opacity-50"
          >
            {m.auth.signOut}
          </button>
        </div>
        {error ? (
          <p className="mt-3 text-[11px] text-rose-300">{m.auth.errorGeneric}</p>
        ) : null}
      </section>
    )
  }

  return (
    <section className="ui-panel-inner relative p-4">
      <h3 className="mb-1 font-display text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-muted)]">
        {m.auth.title}
      </h3>
      <p className="mb-3 text-[11px] leading-relaxed text-[#6b7280]">
        {m.auth.lead}
      </p>
      <AuthForm variant="panel" />
    </section>
  )
}
