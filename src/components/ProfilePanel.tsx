import { useMemo, useState } from 'react'
import {
  UTILITY_META,
  collectEnabledSettingsGroups,
  type UtilitiesConfig,
  type UtilityId,
} from '../data/utilities'
import { useMessages } from '../i18n/I18nProvider'
import { collectActiveBinds } from '../utils/bindConflicts'
import { AuthPanel } from './AuthPanel'
import {
  formatBuyLoadout,
  type BuyBind,
} from '../utils/buyBinds'
import { formatHistoryDate } from '../utils/storage'
import {
  buildShareUrl,
  createSnapshot,
  deleteSavedConfig,
  loadSavedConfigs,
  parseImportedConfig,
  saveNamedConfig,
  type ConfigSnapshot,
  type SavedSiteConfig,
} from '../utils/siteConfigs'

interface ProfilePanelProps {
  selectedIds: string[]
  quantities: Record<string, number>
  bindKey: string
  buyBinds: BuyBind[]
  utilitiesConfig: UtilitiesConfig
  utilitySelectedIds: UtilityId[]
  onApplySnapshot: (snapshot: ConfigSnapshot) => void
  onOpenUtility: (id: UtilityId) => void
  onOpenWeapons: () => void
  onRemoveBuyBind?: (id: string) => void
  onOpenBuyBind?: (id: string) => void
}

export function ProfilePanel({
  selectedIds,
  quantities,
  bindKey,
  buyBinds,
  utilitiesConfig,
  utilitySelectedIds,
  onApplySnapshot,
  onOpenUtility,
  onOpenWeapons,
  onRemoveBuyBind,
  onOpenBuyBind,
}: ProfilePanelProps) {
  const m = useMessages()
  const [configName, setConfigName] = useState('')
  const [saved, setSaved] = useState<SavedSiteConfig[]>(() => loadSavedConfigs())
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const binds = useMemo(
    () =>
      collectActiveBinds(utilitiesConfig, {
        bindKey,
        selectedWeaponIds: selectedIds,
        utilitySelectedIds,
        buyBinds,
        quantities,
      }),
    [utilitiesConfig, bindKey, selectedIds, utilitySelectedIds, buyBinds, quantities],
  )

  const settingsGroups = useMemo(
    () => collectEnabledSettingsGroups(utilitiesConfig),
    [utilitiesConfig],
  )

  const sourceLabel = (source: (typeof binds)[0]['source'] | 'buy') => {
    if (source === 'buy') return m.notifications.sourceBuy
    return m.utilMeta[source]?.label ?? UTILITY_META[source].label
  }

  const bindGroups = useMemo(() => {
    const order: Array<'buy' | UtilityId> = []
    const map = new Map<
      'buy' | UtilityId,
      { key: string; actionId: string; label: string; buyId?: string }[]
    >()

    if (buyBinds.length > 0) {
      order.push('buy')
      map.set(
        'buy',
        buyBinds.map((b) => ({
          key: b.key.trim() || '—',
          actionId: `buy.${b.id}`,
          buyId: b.id,
          label: formatBuyLoadout(b),
        })),
      )
    }

    for (const b of binds) {
      if (b.source === 'buy') continue
      const source = b.source
      if (!map.has(source)) {
        order.push(source)
        map.set(source, [])
      }
      map.get(source)!.push({
        key: b.key,
        actionId: b.actionId,
        label: m.notifications.actions[b.actionId] ?? b.actionId,
      })
    }

    return order.map((id) => ({
      id,
      items: map.get(id) ?? [],
    }))
  }, [binds, buyBinds, m.notifications.actions])

  const flash = (text: string) => {
    setToast(text)
    setTimeout(() => setToast(null), 2200)
  }

  const refreshSaved = () => setSaved(loadSavedConfigs())

  const handleSave = () => {
    const name = configName.trim() || m.profile.defaultName
    const snapshot = createSnapshot({
      name,
      selectedIds,
      quantities,
      bindKey,
      buyBinds,
      utilitiesConfig,
    })
    saveNamedConfig(name, snapshot)
    setConfigName('')
    refreshSaved()
    flash(m.profile.savedToast)
  }

  const handleShare = async (snapshot: ConfigSnapshot, id?: string) => {
    const url = buildShareUrl(snapshot)
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(id ?? 'current')
      setTimeout(() => setCopiedId(null), 2000)
      flash(m.profile.linkCopied)
    } catch {
      flash(m.profile.linkCopyFail)
    }
  }

  const handleImportPaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const snapshot = parseImportedConfig(text)
      if (!snapshot) {
        flash(m.profile.importFail)
        return
      }
      onApplySnapshot(snapshot)
      flash(
        snapshot.name
          ? m.profile.importedNamed.replace('{name}', snapshot.name)
          : m.profile.importOk,
      )
    } catch {
      flash(m.profile.importFail)
    }
  }

  const currentShareSnapshot = useMemo(
    () =>
      createSnapshot({
        selectedIds,
        quantities,
        bindKey,
        buyBinds,
        utilitiesConfig,
      }),
    [selectedIds, quantities, bindKey, buyBinds, utilitiesConfig],
  )

  return (
    <div className="ui-panel relative mx-auto max-w-3xl px-5 py-6">
      <div className="relative z-[1] mb-5">
        <h2 className="font-display text-lg font-bold text-white sm:text-xl">{m.profile.title}</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)]">
          {m.profile.lead}
        </p>
      </div>

      {toast && (
        <p className="mb-4 rounded border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-3 py-2 text-xs text-[var(--accent)]">
          {toast}
        </p>
      )}

      <div className="flex flex-col gap-5 relative z-[1]">
        <AuthPanel />

        <section className="ui-panel-inner relative p-4">
          <h3 className="mb-1 font-display text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-muted)]">
            {m.profile.currentBinds}
          </h3>
          <p className="mb-3 text-[11px] text-[#6b7280]">{m.profile.currentHint}</p>

          {bindGroups.length === 0 ? (
            <p className="text-xs text-[#6b7280]">{m.profile.noBinds}</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {bindGroups.map((group) => (
                <li key={String(group.id)}>
                  <div className="rounded border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-3 py-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (group.id === 'buy') onOpenWeapons()
                        else onOpenUtility(group.id)
                      }}
                      className="mb-1.5 w-full text-left text-[10px] font-bold uppercase tracking-wider text-[var(--accent)] hover:underline"
                    >
                      {sourceLabel(group.id)}
                      <span className="ml-1.5 font-mono font-normal normal-case tracking-normal text-[var(--accent)]/60">
                        · {group.items.length}
                      </span>
                    </button>
                    <ul className="grid grid-cols-1 gap-x-3 gap-y-1.5 sm:grid-cols-2">
                      {group.items.map((item) => (
                        <li
                          key={`${group.id}:${item.actionId}:${item.key}`}
                          className="flex min-w-0 items-center gap-2"
                          title={`${item.key} — ${item.label}`}
                        >
                          {group.id === 'buy' && item.buyId && onOpenBuyBind ? (
                            <button
                              type="button"
                              onClick={() => onOpenBuyBind(item.buyId!)}
                              className="flex min-w-0 flex-1 items-baseline gap-2 rounded px-1 py-0.5 text-left transition-colors hover:bg-[var(--accent-soft-bg)]"
                            >
                              <span className="shrink-0 font-mono text-[11px] font-bold text-[var(--accent-muted)]">
                                {item.key}
                              </span>
                              <span className="min-w-0 truncate text-[11px] leading-snug text-[#e5e7eb]">
                                {item.label}
                              </span>
                            </button>
                          ) : (
                            <>
                              <span className="shrink-0 font-mono text-[11px] font-bold text-[var(--accent-muted)]">
                                {item.key}
                              </span>
                              <span className="min-w-0 flex-1 truncate text-[11px] leading-snug text-[#e5e7eb]">
                                {item.label}
                              </span>
                            </>
                          )}
                          {group.id === 'buy' &&
                            item.buyId &&
                            onRemoveBuyBind && (
                              <button
                                type="button"
                                onClick={() => onRemoveBuyBind(item.buyId!)}
                                className="shrink-0 text-[10px] uppercase tracking-wider text-[#6b7280] hover:text-[var(--accent)]"
                              >
                                {m.sidebar.removeBuyBind}
                              </button>
                            )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="ui-panel-inner relative p-4">
          <h3 className="mb-1 font-display text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-muted)]">
            {m.profile.currentSettings}
          </h3>
          <p className="mb-3 text-[11px] text-[#6b7280]">
            {m.profile.currentSettingsHint}
          </p>

          {settingsGroups.length === 0 ? (
            <p className="text-xs text-[#6b7280]">{m.profile.noSettings}</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {settingsGroups.map((group) => (
                <li key={group.id}>
                  <button
                    type="button"
                    onClick={() => onOpenUtility(group.id)}
                    className="w-full rounded border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-3 py-2 text-left transition-colors hover:border-[var(--accent)]/70"
                  >
                    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
                      {m.utilMeta[group.id]?.label ??
                        UTILITY_META[group.id].label}
                      <span className="ml-1.5 font-mono font-normal normal-case tracking-normal text-[var(--accent)]/60">
                        · {group.lines.length}
                      </span>
                    </p>
                    <ul className="grid grid-cols-2 gap-x-3 gap-y-0.5 sm:grid-cols-3">
                      {group.lines.map((line) => (
                        <li
                          key={line}
                          className="truncate font-mono text-[10px] leading-snug text-[#e5e7eb]"
                          title={line}
                        >
                          {line}
                        </li>
                      ))}
                    </ul>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="ui-panel-inner relative p-4">
          <h3 className="mb-1 font-display text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-muted)]">
            {m.profile.saveTitle}
          </h3>
          <p className="mb-3 text-[11px] text-[#6b7280]">{m.profile.saveHint}</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={configName}
              onChange={(e) => setConfigName(e.target.value)}
              placeholder={m.profile.namePlaceholder}
              maxLength={40}
              className="min-w-0 flex-1 rounded-lg border border-[#2a3340] bg-[#0a0e14] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[var(--accent)]"
            />
            <button
              type="button"
              onClick={handleSave}
              className="ui-btn-primary px-4 sm:w-auto"
            >
              {m.profile.saveButton}
            </button>
          </div>
          <button
            type="button"
            onClick={() => handleShare(currentShareSnapshot)}
            className="ui-btn-ghost mt-2 w-full border-[var(--accent)]/50 text-[var(--accent-muted)]"
          >
            {copiedId === 'current' ? m.common.copied : m.profile.shareCurrent}
          </button>
        </section>

        <section className="ui-panel-inner relative p-4">
          <h3 className="mb-1 font-display text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-muted)]">
            {m.profile.importTitle}
          </h3>
          <p className="mb-3 text-[11px] text-[#6b7280]">{m.profile.importHint}</p>
          <button
            type="button"
            onClick={handleImportPaste}
            className="ui-btn-ghost w-full border-[var(--accent)]/50 py-2.5 text-sm text-[var(--accent-muted)]"
          >
            {m.profile.importButton}
          </button>
        </section>

        <section className="ui-panel-inner relative p-4">
          <h3 className="mb-1 font-display text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-muted)]">
            {m.profile.savedTitle}
          </h3>
          <p className="mb-3 text-[11px] text-[#6b7280]">{m.profile.savedHint}</p>

          {saved.length === 0 ? (
            <p className="text-xs text-[#6b7280]">{m.profile.savedEmpty}</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {saved.map((cfg) => (
                <li
                  key={cfg.id}
                  className="rounded-lg border border-[#2a3340]/90 bg-[#0a0e14] p-3"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">
                        {cfg.name}
                      </p>
                      <p className="text-[10px] text-[#6b7280]">
                        {formatHistoryDate(cfg.updatedAt)}
                        {cfg.snapshot.selectedIds.length > 0
                          ? ` · ${cfg.snapshot.selectedIds.length} ${m.profile.weaponsShort}`
                          : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        onApplySnapshot(cfg.snapshot)
                        flash(m.profile.loadedToast)
                      }}
                      className="rounded border border-[var(--accent)]/60 bg-[var(--accent-soft)] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[var(--accent)] hover:border-[var(--accent)]"
                    >
                      {m.profile.loadButton}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleShare(cfg.snapshot, cfg.id)}
                      className="rounded border border-[#2a3340] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#9ca3af] hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
                    >
                      {copiedId === cfg.id
                        ? m.common.copied
                        : m.profile.shareButton}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteSavedConfig(cfg.id)
                        refreshSaved()
                      }}
                      className="rounded border border-[#2a3340] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#6b7280] hover:border-red-500/50 hover:text-red-400"
                    >
                      {m.profile.deleteButton}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
