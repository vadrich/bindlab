import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { HistoryEntry } from '../types'
import type { ArsenalTab } from '../types/modes'
import { buildBindCommand, calcTotal } from '../data/items'
import type { BuyBind } from '../utils/buyBinds'
import {
  NET_DISPLAY_PRESET_LABELS,
  SHOW_FPS_LEVEL_LABELS,
} from '../data/netDisplay'
import {
  buildCombinedUtilitiesCommand,
  buildPartitionedUtilitiesCommands,
  collectProfileCommandLines,
  UTILITY_META,
  utilitiesNeedSharedKey,
  utilityAcceptsBindKey,
  type UtilitiesConfig,
  type UtilityId,
} from '../data/utilities'
import { useMessages } from '../i18n/I18nProvider'
import {
  CS2_CONSOLE_CHAR_LIMIT,
  splitConsoleCommands,
} from '../utils/consoleChunks'
import {
  formatHistoryDate,
  formatPrice,
  loadHistory,
  saveHistory,
} from '../utils/storage'
import { toConsolePaste } from '../utils/consolePaste'
import {
  UNBIND_FOCUS_EVENT,
  UNBIND_PICK_EVENT,
  buildUnbindCommandForKeys,
  collectAppUnbindKeys,
  type UnbindFocusMode,
} from '../utils/unbindFromHistory'
import { collectActiveBinds } from '../utils/bindConflicts'
import { tryIncrementUsage } from '../utils/usageCounter'
import { BindKeyCapture } from './BindKeyCapture'

/** Buy-menu quick picks */
const WEAPON_QUICK_KEYS = [
  'c',
  'f1',
  'f2',
  'f3',
  'f4',
  'f5',
  'mouse4',
  'mouse5',
  'kp_enter',
  'tab',
]

/** Utilities: popular / easy-to-mistype console names */
const UTILITIES_QUICK_KEYS = [
  'alt',
  'tab',
  'shift',
  'ctrl',
  'space',
  'f1',
  'f2',
  'f3',
  'f4',
  'f5',
]

interface SidebarProps {
  tab: ArsenalTab | null
  selectedIds: string[]
  quantities: Record<string, number>
  bindKey: string
  onBindKeyChange: (key: string) => void
  buyBinds: BuyBind[]
  onCommitBuyBind: () => void
  editingBuyBindId?: string | null
  editingBuyLabel?: string | null
  onCancelEditBuyBind?: () => void
  utilitySelectedIds: UtilityId[]
  utilityActiveId: UtilityId | null
  utilityView: 'home' | 'detail'
  utilitiesConfig: UtilitiesConfig
  conflictCount?: number
  /** Clear history / open paste expand (handled in App). */
  onRequestClearHistory?: () => void
  onExpandPaste?: (chunks: string[], index?: number) => void
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="ui-panel relative p-4">
      <h2 className="font-display relative z-[1] mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent-muted)]">
        {title}
      </h2>
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}

function CommandBlock({
  title,
  hint,
  command,
  placeholder,
  copied,
  onCopy,
  copyLabel,
  copiedLabel,
  compact,
}: {
  title: string
  hint?: string
  command: string
  placeholder: string
  copied: boolean
  onCopy: () => void
  copyLabel: string
  copiedLabel: string
  /** Shorter preview — keeps sidebar bottom aligned with arsenal/history. */
  compact?: boolean
}) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">
        {title}
      </p>
      {hint && <p className="mb-2 text-[10px] text-[#4b5563]">{hint}</p>}
      <pre
        className={[
          'mb-2 overflow-auto whitespace-pre-wrap break-all rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-xs leading-relaxed text-[var(--accent-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
          compact ? 'max-h-24' : 'max-h-40',
        ].join(' ')}
      >
        {command || placeholder}
      </pre>
      <button
        type="button"
        disabled={!command}
        onClick={onCopy}
        className="ui-btn-primary w-full"
      >
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  )
}

export function Sidebar({
  tab,
  selectedIds,
  quantities,
  bindKey,
  onBindKeyChange,
  buyBinds,
  onCommitBuyBind,
  editingBuyBindId = null,
  editingBuyLabel = null,
  onCancelEditBuyBind,
  utilitySelectedIds,
  utilityActiveId,
  utilityView,
  utilitiesConfig,
  conflictCount = 0,
  onRequestClearHistory,
  onExpandPaste,
}: SidebarProps) {
  const m = useMessages()
  const [copiedKind, setCopiedKind] = useState<
    'settings' | 'binds' | 'all' | 'buy' | 'historyUnbind' | null
  >(null)
  const [copiedPastePart, setCopiedPastePart] = useState<number | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory())
  const [unbindFocus, setUnbindFocus] = useState<UnbindFocusMode | null>(null)
  const [pickedUnbindKeys, setPickedUnbindKeys] = useState<string[] | null>(null)
  const unbindAllBtnRef = useRef<HTMLButtonElement>(null)
  const unbindHistoryBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onFocus = (e: Event) => {
      const mode = (e as CustomEvent<{ mode: UnbindFocusMode }>).detail?.mode
      if (mode !== 'all' && mode !== 'history') return
      setUnbindFocus(mode)
      const btn =
        mode === 'history' ? unbindHistoryBtnRef.current : unbindAllBtnRef.current
      btn?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
    window.addEventListener(UNBIND_FOCUS_EVENT, onFocus)
    return () => window.removeEventListener(UNBIND_FOCUS_EVENT, onFocus)
  }, [])

  useEffect(() => {
    const onPick = (e: Event) => {
      const keys = (e as CustomEvent<{ keys: string[] }>).detail?.keys
      if (!Array.isArray(keys)) return
      setPickedUnbindKeys(keys)
    }
    window.addEventListener(UNBIND_PICK_EVENT, onPick)
    return () => window.removeEventListener(UNBIND_PICK_EVENT, onPick)
  }, [])

  useEffect(() => {
    if (tab !== 'unbind') {
      setUnbindFocus(null)
      setPickedUnbindKeys(null)
    }
  }, [tab])

  useEffect(() => {
    const sync = () => setHistory(loadHistory())
    window.addEventListener('cs2-history-updated', sync)
    return () => window.removeEventListener('cs2-history-updated', sync)
  }, [])

  const isWeapons = tab === 'weapons'
  const isUtilities = tab === 'utilities'
  const isUnbind = tab === 'unbind'
  const isProfile = tab === 'profile'
  const isNotifications = tab === 'notifications'
  const isIdle = tab == null
  const hideBindKey = isIdle || isUnbind || isProfile || isNotifications
  const unbindCommand = 'unbindall'
  const isAdvancedNet =
    isUtilities &&
    utilitySelectedIds.includes('net_display') &&
    utilitiesConfig.netDisplay.mode === 'advanced'
  const needSharedKey = isUtilities && utilitiesNeedSharedKey(utilitySelectedIds)
  const activeAcceptsKey =
    isUtilities &&
    utilityView === 'detail' &&
    utilityActiveId != null &&
    utilityAcceptsBindKey(utilityActiveId)
  const activeIsSettingsOnly =
    isUtilities &&
    utilityView === 'detail' &&
    utilityActiveId != null &&
    !utilityAcceptsBindKey(utilityActiveId)
  const activeLabel =
    utilityActiveId != null
      ? (m.utilMeta[utilityActiveId]?.label ?? UTILITY_META[utilityActiveId].label)
      : ''
  const defaultUtilKey = isAdvancedNet ? 'tab' : 'c'
  const total = calcTotal(selectedIds, quantities)
  const buyCommand = buildBindCommand(bindKey, selectedIds, quantities)

  const effectiveKey = bindKey.trim() || (needSharedKey ? defaultUtilKey : '')
  const partitioned =
    isUtilities && utilitySelectedIds.length > 0
      ? buildPartitionedUtilitiesCommands(
          utilitySelectedIds,
          utilitiesConfig,
          effectiveKey,
        )
      : { settings: '', binds: '' }

  const allCommand =
    isUtilities && utilitySelectedIds.length > 0
      ? buildCombinedUtilitiesCommand(
          utilitySelectedIds,
          utilitiesConfig,
          effectiveKey,
        )
      : ''

  const pasteChunks = useMemo(() => {
    if (!isProfile) return []
    const lines = collectProfileCommandLines({
      config: utilitiesConfig,
      bindKey,
      selectedWeaponIds: selectedIds,
      quantities,
      buyBinds,
      includeNetDisplay: utilitySelectedIds.includes('net_display'),
    })
    return splitConsoleCommands(lines)
  }, [
    isProfile,
    utilitiesConfig,
    bindKey,
    selectedIds,
    quantities,
    buyBinds,
    utilitySelectedIds,
  ])

  const needsPasteSplit = pasteChunks.length > 1
  const totalPasteChars = pasteChunks.reduce((sum, chunk) => sum + chunk.length, 0)

  const activeUnbindKeys = useMemo(
    () =>
      collectActiveBinds(utilitiesConfig, {
        bindKey,
        selectedWeaponIds: selectedIds,
        utilitySelectedIds,
        buyBinds,
        quantities,
      }).map((b) => b.key),
    [utilitiesConfig, bindKey, selectedIds, utilitySelectedIds, buyBinds, quantities],
  )

  const flashCopied = (kind: typeof copiedKind) => {
    setCopiedKind(kind)
    setTimeout(() => setCopiedKind(null), 2000)
  }

  const remember = (command: string) => {
    if (tryIncrementUsage() !== null) {
      window.dispatchEvent(new Event('cs2-usage-updated'))
    }
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      command,
      key: isUtilities || isUnbind ? effectiveKey || '—' : bindKey,
      itemIds: isUtilities
        ? [...utilitySelectedIds]
        : isUnbind
          ? ['unbindall']
          : [...selectedIds],
      total: isUtilities || isUnbind ? 0 : total,
      createdAt: Date.now(),
    }
    const next = [entry, ...history.filter((h) => h.command !== command)].slice(0, 50)
    setHistory(next)
    saveHistory(next)
  }

  const copyText = async (
    text: string,
    kind: 'settings' | 'binds' | 'all' | 'buy' | 'historyUnbind',
  ) => {
    if (!text) return
    const paste = toConsolePaste(text)
    await navigator.clipboard.writeText(paste)
    flashCopied(kind)
    remember(paste)
    if (kind === 'buy') onCommitBuyBind()
  }

  const clearHistory = () => {
    onRequestClearHistory?.()
  }

  const copyHistoryEntry = async (text: string) => {
    await navigator.clipboard.writeText(toConsolePaste(text))
  }

  const copyPastePart = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(toConsolePaste(text))
      if (tryIncrementUsage() !== null) {
        window.dispatchEvent(new Event('cs2-usage-updated'))
      }
      setCopiedPastePart(index)
      setTimeout(() => setCopiedPastePart(null), 2000)
    } catch {
      // clipboard denied — ignore
    }
  }

  const availableUnbindKeys = useMemo(
    () => collectAppUnbindKeys(history, activeUnbindKeys),
    [history, activeUnbindKeys],
  )

  const historyUnbindKeys = pickedUnbindKeys ?? availableUnbindKeys
  const historyUnbindCommand = buildUnbindCommandForKeys(historyUnbindKeys)

  const utilLabels = utilitySelectedIds
    .map((id) => m.utilMeta[id]?.label ?? UTILITY_META[id].label)
    .join(' · ')

  const hasSettings = Boolean(partitioned.settings)
  const hasBinds = Boolean(partitioned.binds)
  const showBoth = hasSettings && hasBinds
  /** Practice dumps long lines — keep previews shorter so history aligns with arsenal. */
  const compactCommands =
    isUtilities && utilityActiveId === 'practice'

  return (
    <div className="flex flex-col gap-4">
      {isIdle && (
        <Panel title={m.guide.openTitle}>
          <p className="text-[12px] leading-relaxed text-[#9ca3af]">
            {m.tips.idleBody}
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-[#6b7280]">
            {m.tips.reopenHint}
          </p>
        </Panel>
      )}

      {!hideBindKey && (
        <Panel title={m.sidebar.bindKey}>
          <BindKeyCapture
            value={bindKey}
            onChange={onBindKeyChange}
            placeholder={
              isUtilities ? defaultUtilKey : m.sidebar.bindKeyPlaceholder
            }
          />
          {isAdvancedNet && (
            <div className="mb-3 rounded border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-3 py-2">
              <p className="mb-2 text-[10px] leading-relaxed text-[#9ca3af]">
                Tab
              </p>
              <button
                type="button"
                onClick={() => onBindKeyChange('tab')}
                className={[
                  'rounded border px-3 py-1.5 font-mono text-xs transition-colors',
                  (bindKey || 'tab').toLowerCase() === 'tab'
                    ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-on)]'
                    : 'border-[var(--accent)]/50 text-[var(--accent)] hover:border-[var(--accent)]',
                ].join(' ')}
              >
                tab
              </button>
            </div>
          )}
          <p className="mb-2 text-[10px] uppercase tracking-wider text-[#4b5563]">
            {m.sidebar.quickKeys}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(isUtilities ? UTILITIES_QUICK_KEYS : WEAPON_QUICK_KEYS).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => onBindKeyChange(key)}
                className={[
                  'rounded border px-2 py-1 font-mono text-xs transition-colors',
                  (bindKey || (isUtilities ? defaultUtilKey : '')).toLowerCase() === key
                    ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-on)]'
                    : 'border-[#2a3340] text-[#9ca3af] hover:border-[var(--accent)]/50',
                ].join(' ')}
              >
                {key}
              </button>
            ))}
          </div>
          {isUtilities && (
            <p className="mt-3 text-[10px] leading-relaxed text-[#4b5563]">
              {needSharedKey
                ? m.sidebar.bindKeyHintShared
                : activeAcceptsKey
                  ? m.sidebar.bindKeyHintUtilities
                  : activeIsSettingsOnly
                    ? m.sidebar.bindKeyHintUtilities
                    : m.sidebar.bindKeyHintUtilities}
              {activeLabel ? ` · ${m.sidebar.activeUtility}: ${activeLabel}` : ''}
            </p>
          )}
        </Panel>
      )}

      <Panel
        title={
          isWeapons
            ? m.sidebar.buyCommand
            : isProfile
              ? m.profile.sidebarTitle
              : isNotifications
                ? m.notifications.title
                : m.common.settings
        }
      >
        {isWeapons && (
          <>
            {editingBuyBindId && (
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded border border-[var(--accent)]/45 bg-[var(--accent-soft)] px-2.5 py-2">
                <p className="min-w-0 text-[11px] leading-snug text-[var(--accent-muted)]">
                  <span className="font-bold uppercase tracking-wider text-[var(--accent)]">
                    {m.sidebar.editingBuyBind}
                  </span>
                  {editingBuyLabel ? (
                    <span className="mt-0.5 block truncate font-mono text-[10px] text-[#9ca3af]">
                      {editingBuyLabel}
                    </span>
                  ) : null}
                  <span className="mt-0.5 block text-[10px] text-[#6b7280]">
                    {m.sidebar.editingBuyBindHint}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => onCancelEditBuyBind?.()}
                  className="shrink-0 rounded border border-[#2a3340] px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
                >
                  {m.sidebar.cancelEditBuyBind}
                </button>
              </div>
            )}
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-xs text-[#6b7280]">$</span>
              <span className="text-lg font-bold text-white">{formatPrice(total)}</span>
            </div>
            <pre className="mb-3 max-h-56 overflow-auto whitespace-pre-wrap break-all rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-xs leading-relaxed text-[var(--accent-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              {buyCommand || m.sidebar.buyPlaceholder}
            </pre>
            <button
              type="button"
              disabled={!buyCommand}
              onClick={() => copyText(buyCommand, 'buy')}
              className="ui-btn-primary mb-2 w-full"
            >
              {copiedKind === 'buy' ? m.common.copied : m.common.copy}
            </button>
          </>
        )}

        {isProfile && (
          <div className="mb-2 rounded border border-[#2a3340] bg-[#0d1117] px-3 py-3">
            <p className="text-sm font-semibold text-[var(--accent-muted)]">
              {m.profile.sidebarLead}
            </p>
            <p className="mt-2 text-[10px] leading-relaxed text-[#6b7280]">
              {m.profile.sidebarHint}
            </p>
          </div>
        )}

        {isNotifications && (
          <div className="mb-2 rounded border border-[#2a3340] bg-[#0d1117] px-3 py-3">
            <p
              className={[
                'text-sm font-semibold',
                conflictCount > 0
                  ? 'text-[var(--accent)]'
                  : 'text-[var(--accent-muted)]',
              ].join(' ')}
            >
              {conflictCount > 0
                ? m.notifications.sidebarWarn.replace(
                    '{n}',
                    String(conflictCount),
                  )
                : m.notifications.sidebarOk}
            </p>
            <p className="mt-2 text-[10px] leading-relaxed text-[#6b7280]">
              {m.notifications.sidebarHint}
            </p>
          </div>
        )}

        {isUnbind && (
          <>
            <p className="mb-3 rounded border border-[#2a3340] bg-[#0d1117] px-2.5 py-2 text-[10px] leading-relaxed text-[#9ca3af]">
              {m.unbind.choiceTitle}: {m.unbind.choiceAllTitle} /{' '}
              {m.unbind.choiceHistoryTitle}
            </p>

            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">
              {m.unbind.choiceAllTitle}
            </p>
            <p className="mb-2 text-[10px] leading-relaxed text-[#4b5563]">
              {m.sidebar.unbindHint}
            </p>
            <pre className="mb-2 max-h-24 overflow-auto whitespace-pre-wrap break-all rounded border border-[#2a3340] bg-[#0d1117] p-3 font-mono text-sm leading-relaxed text-[var(--accent-muted)]">
              {unbindCommand}
            </pre>
            <button
              ref={unbindAllBtnRef}
              type="button"
              onClick={() => copyText(unbindCommand, 'buy')}
              className={[
                'mb-4 w-full rounded border py-2.5 text-sm font-bold uppercase tracking-wide transition-all',
                unbindFocus === 'all'
                  ? 'border-[var(--accent)] bg-[#0d1117] text-[var(--accent)] ring-1 ring-[var(--accent)]'
                  : 'border-[#2a3340] bg-[#0d1117] text-[var(--accent-muted)] hover:border-[var(--accent)]/60 hover:text-[var(--accent)]',
              ].join(' ')}
            >
              {copiedKind === 'buy' ? m.common.copied : m.sidebar.unbindCopy}
            </button>

            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">
              {m.unbind.choiceHistoryTitle}
            </p>
            <p className="mb-2 text-[10px] leading-relaxed text-[#4b5563]">
              {m.sidebar.unbindHistoryHint}
            </p>
            {availableUnbindKeys.length === 0 ? (
              <p className="mb-2 text-xs text-[#4b5563]">
                {m.sidebar.unbindHistoryEmpty}
              </p>
            ) : (
              <>
                <p className="mb-1 text-[10px] text-[#6b7280]">
                  {m.sidebar.unbindHistoryKeys}:{' '}
                  <span className="font-mono text-[var(--accent-muted)]">
                    {historyUnbindKeys.length > 0
                      ? historyUnbindKeys.join(', ')
                      : '—'}
                  </span>
                  <span className="ml-1 text-[#4b5563]">
                    ({historyUnbindKeys.length}/{availableUnbindKeys.length})
                  </span>
                </p>
                {historyUnbindCommand ? (
                  <pre className="mb-2 max-h-28 overflow-auto whitespace-pre-wrap break-all rounded border border-[#2a3340] bg-[#0d1117] p-3 font-mono text-xs leading-relaxed text-[var(--accent-muted)]">
                    {historyUnbindCommand}
                  </pre>
                ) : (
                  <p className="mb-2 text-xs text-[#4b5563]">
                    {m.unbind.pickKeysNone}
                  </p>
                )}
              </>
            )}
            <button
              ref={unbindHistoryBtnRef}
              type="button"
              disabled={!historyUnbindCommand}
              onClick={() => copyText(historyUnbindCommand, 'historyUnbind')}
              className={[
                'mb-2 w-full rounded border py-2.5 text-sm font-bold uppercase tracking-wide transition-all disabled:opacity-40',
                unbindFocus === 'history'
                  ? 'border-[var(--accent)] bg-[#0d1117] text-[var(--accent)] ring-1 ring-[var(--accent)]'
                  : 'border-[#2a3340] bg-[#0d1117] text-[var(--accent-muted)] hover:border-[var(--accent)]/60 hover:text-[var(--accent)]',
              ].join(' ')}
            >
              {copiedKind === 'historyUnbind'
                ? m.common.copied
                : m.sidebar.unbindHistoryCopy}
            </button>
          </>
        )}

        {isUtilities && (
          <>
            {utilitySelectedIds.length > 0 && (
              <p className="mb-3 text-xs text-[#6b7280]">
                {utilLabels}
                {utilitySelectedIds.includes('net_display') && (
                  <>
                    {' '}
                    · сеть:{' '}
                    {utilitiesConfig.netDisplay.mode === 'toggle'
                      ? NET_DISPLAY_PRESET_LABELS[utilitiesConfig.netDisplay.preset]
                      : SHOW_FPS_LEVEL_LABELS[
                          utilitiesConfig.netDisplay.showFpsLevel
                        ]}
                  </>
                )}
              </p>
            )}

            {utilitySelectedIds.length === 0 && (
              <p className="mb-2 text-xs text-[#4b5563]">
                {m.sidebar.settingsPlaceholder}
              </p>
            )}

            {(hasSettings || utilitySelectedIds.length > 0) && (
              <CommandBlock
                title={m.sidebar.settingsBlock}
                hint={m.sidebar.settingsHint}
                command={partitioned.settings}
                placeholder={m.sidebar.settingsPlaceholder}
                copied={copiedKind === 'settings'}
                onCopy={() => copyText(partitioned.settings, 'settings')}
                copyLabel={m.common.copy}
                copiedLabel={m.common.copied}
                compact={compactCommands}
              />
            )}

            {(hasBinds || utilitySelectedIds.length > 0) && (
              <CommandBlock
                title={m.sidebar.bindsBlock}
                hint={m.sidebar.bindsHint}
                command={partitioned.binds}
                placeholder={m.sidebar.bindsPlaceholder}
                copied={copiedKind === 'binds'}
                onCopy={() => copyText(partitioned.binds, 'binds')}
                copyLabel={m.common.copy}
                copiedLabel={m.common.copied}
                compact={compactCommands}
              />
            )}

            {showBoth && (
              <button
                type="button"
                onClick={() => copyText(allCommand, 'all')}
                className="mt-1 w-full rounded border border-[var(--accent)]/50 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--accent-muted)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
              >
                {copiedKind === 'all' ? m.common.copied : m.sidebar.allBlock}
              </button>
            )}
          </>
        )}

        <p className="mt-3 text-center text-[10px] leading-relaxed text-[#4b5563]">
          {m.sidebar.settingsHint}
        </p>
      </Panel>

      <Panel title={m.sidebar.history}>
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-[9px] leading-snug text-[#4b5563]">
            {m.sidebar.clearHistoryHint}
          </p>
          <button
            type="button"
            onClick={clearHistory}
            className="shrink-0 text-[10px] uppercase tracking-wider text-[#4b5563] hover:text-red-400"
            title={m.sidebar.clearHistory}
          >
            ×
          </button>
        </div>
        {history.length === 0 ? (
          <p className="text-xs text-[#4b5563]">{m.sidebar.historyEmpty}</p>
        ) : (
          <div className="flex max-h-40 flex-col gap-2 overflow-y-auto">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start justify-between gap-2 rounded border border-[#2a3340] bg-[#0d1117] p-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-[10px] text-[var(--accent-muted)]">
                    {entry.command}
                  </p>
                  <p className="mt-0.5 text-[9px] text-[#4b5563]">
                    {formatHistoryDate(entry.createdAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => copyHistoryEntry(entry.command)}
                  className="shrink-0 text-[10px] text-[#6b7280] hover:text-[var(--accent-hover)]"
                  title={m.common.copy}
                >
                  ⧉
                </button>
              </div>
            ))}
          </div>
        )}
      </Panel>

      {isProfile && (
        <Panel title={m.profile.pasteTitle}>
          <p className="mb-3 text-[10px] leading-relaxed text-[#4b5563]">
            {m.profile.pasteHint}
          </p>

          {pasteChunks.length === 0 ? (
            <p className="text-xs text-[#4b5563]">{m.profile.pasteEmpty}</p>
          ) : (
            <>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div
                  className={`min-w-0 flex-1 rounded border px-3 py-2.5 ${
                    needsPasteSplit
                      ? 'border-amber-500/40 bg-amber-500/10'
                      : 'border-[#2a3340] bg-[#0d1117]'
                  }`}
                >
                  <p
                    className={`text-sm font-semibold ${
                      needsPasteSplit ? 'text-amber-200' : 'text-[#e5e7eb]'
                    }`}
                  >
                    {m.profile.pasteSummary
                      .replace('{chars}', String(totalPasteChars))
                      .replace('{n}', String(pasteChunks.length))}
                  </p>
                  {needsPasteSplit && (
                    <p className="mt-1.5 text-[10px] leading-relaxed text-amber-200/80">
                      {m.profile.pasteLimitWarn.replace(
                        '{limit}',
                        String(CS2_CONSOLE_CHAR_LIMIT),
                      )}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onExpandPaste?.(pasteChunks, 0)}
                  className="shrink-0 rounded border border-[var(--accent)]/50 px-2.5 py-2 text-[10px] font-bold uppercase tracking-wide text-[var(--accent-muted)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
                >
                  {m.profile.pasteExpand}
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {pasteChunks.map((chunk, i) => (
                  <div
                    key={`paste-${i}`}
                    className="flex flex-wrap items-center justify-between gap-2 rounded border border-[#2a3340] bg-[#0d1117] px-2.5 py-2"
                  >
                    <button
                      type="button"
                      onClick={() => onExpandPaste?.(pasteChunks, i)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">
                        {needsPasteSplit
                          ? m.profile.pastePart
                              .replace('{i}', String(i + 1))
                              .replace('{n}', String(pasteChunks.length))
                          : m.profile.pasteTitle}
                      </p>
                      <p className="mt-0.5 font-mono text-[10px] text-[#6b7280]">
                        {m.profile.pasteChars.replace(
                          '{n}',
                          String(chunk.length),
                        )}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => copyPastePart(chunk, i)}
                      className="ui-btn-primary shrink-0 px-2.5 py-1.5 text-[10px]"
                    >
                      {copiedPastePart === i ? m.common.copied : m.common.copy}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </Panel>
      )}
    </div>
  )
}
