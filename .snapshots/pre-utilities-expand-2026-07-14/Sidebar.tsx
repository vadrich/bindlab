import { useState, type ReactNode } from 'react'
import type { HistoryEntry } from '../types'
import type { ArsenalTab } from '../types/modes'
import { buildBindCommand, calcTotal } from '../data/items'
import {
  buildNetDisplayCommand,
  NET_DISPLAY_PRESET_LABELS,
  SHOW_FPS_LEVEL_LABELS,
  type NetDisplayConfig,
} from '../data/netDisplay'
import {
  formatHistoryDate,
  formatPrice,
  loadHistory,
  saveHistory,
} from '../utils/storage'
import { tryIncrementUsage } from '../utils/usageCounter'

const QUICK_KEYS = ['c', 'f1', 'f2', 'f3', 'f4', 'f5', 'mouse4', 'mouse5', 'kp_enter', 'tab']

interface SidebarProps {
  tab: ArsenalTab
  selectedIds: string[]
  quantities: Record<string, number>
  bindKey: string
  onBindKeyChange: (key: string) => void
  netDisplaySelected: boolean
  netDisplayConfig: NetDisplayConfig
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-[#2a3340] bg-[#121820] p-4">
      <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#6b7280]">
        {title}
      </h2>
      {children}
    </div>
  )
}

export function Sidebar({
  tab,
  selectedIds,
  quantities,
  bindKey,
  onBindKeyChange,
  netDisplaySelected,
  netDisplayConfig,
}: SidebarProps) {
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory())

  const isUtilities = tab === 'utilities'
  const isAdvancedNet =
    isUtilities && netDisplaySelected && netDisplayConfig.mode === 'advanced'
  const defaultUtilKey = isAdvancedNet ? 'tab' : 'c'
  const total = calcTotal(selectedIds, quantities)
  const buyCommand = buildBindCommand(bindKey, selectedIds, quantities)

  const effectiveKey =
    bindKey.trim() || (isUtilities && netDisplaySelected ? defaultUtilKey : '')
  const netCommand =
    isUtilities && netDisplaySelected
      ? buildNetDisplayCommand(effectiveKey, netDisplayConfig)
      : ''

  const command = isUtilities ? netCommand : buyCommand

  const copyCommand = async () => {
    if (!command) return
    await navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    if (tryIncrementUsage() !== null) {
      window.dispatchEvent(new Event('cs2-usage-updated'))
    }

    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      command,
      key: isUtilities ? effectiveKey || '—' : bindKey,
      itemIds: isUtilities ? ['net_display'] : [...selectedIds],
      total: isUtilities ? 0 : total,
      createdAt: Date.now(),
    }
    const next = [entry, ...history.filter((h) => h.command !== command)].slice(0, 50)
    setHistory(next)
    saveHistory(next)
  }

  const clearHistory = () => {
    setHistory([])
    saveHistory([])
  }

  const copyHistoryEntry = async (text: string) => {
    await navigator.clipboard.writeText(text)
  }

  const placeholder = isUtilities
    ? 'Выбери «Отображение сети» слева'
    : 'bind f3 "..."'

  return (
    <div className="flex flex-col gap-4">
      <Panel title="Клавиша бинда">
        <input
          type="text"
          value={bindKey}
          onChange={(e) => onBindKeyChange(e.target.value.trim())}
          placeholder={isUtilities ? defaultUtilKey : 'f3'}
          className="mb-3 w-full rounded border border-[#2a3340] bg-[#0d1117] px-3 py-2 font-mono text-sm text-white outline-none focus:border-[var(--accent)]"
        />
        {isAdvancedNet && (
          <div className="mb-3 rounded border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-3 py-2">
            <p className="mb-2 text-[10px] leading-relaxed text-[#9ca3af]">
              Для расширенных настроек сети рекомендуемая клавиша —{' '}
              <span className="font-mono text-[var(--accent)]">Tab</span>
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
          Быстрый выбор
        </p>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => onBindKeyChange(key)}
              className={[
                'rounded border px-2 py-1 font-mono text-xs transition-colors',
                (bindKey || (isUtilities && netDisplaySelected ? defaultUtilKey : '')) ===
                key
                  ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-on)]'
                  : 'border-[#2a3340] text-[#9ca3af] hover:border-[var(--accent)]/50',
              ].join(' ')}
            >
              {key}
            </button>
          ))}
        </div>
        {isUtilities && netDisplaySelected && !bindKey.trim() && (
          <p className="mt-2 text-[10px] text-[#4b5563]">
            Если пусто — для «Отображение сети» используется {defaultUtilKey}
          </p>
        )}
      </Panel>

      <Panel title="Результат">
        {!isUtilities && (
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-xs text-[#6b7280]">Сумма</span>
            <span className="text-lg font-bold text-white">{formatPrice(total)}</span>
          </div>
        )}
        {isUtilities && netDisplaySelected && (
          <p className="mb-2 text-xs text-[#6b7280]">
            Отображение сети ·{' '}
            {netDisplayConfig.mode === 'toggle'
              ? NET_DISPLAY_PRESET_LABELS[netDisplayConfig.preset]
              : SHOW_FPS_LEVEL_LABELS[netDisplayConfig.showFpsLevel]}
          </p>
        )}
        <pre className="mb-3 max-h-56 overflow-auto whitespace-pre-wrap break-all rounded border border-[#2a3340] bg-[#0d1117] p-3 font-mono text-xs leading-relaxed text-[var(--accent-muted)]">
          {command || placeholder}
        </pre>
        <button
          type="button"
          disabled={!command}
          onClick={copyCommand}
          className="mb-2 w-full rounded bg-[var(--accent)] py-2.5 text-sm font-bold uppercase tracking-wide text-[var(--accent-on)] transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-40"
        >
          {copied ? 'Скопировано!' : 'Копировать в буфер'}
        </button>
        <p className="text-center text-[10px] leading-relaxed text-[#4b5563]">
          Вставьте команду в консоль CS2 (~) или в autoexec.cfg
        </p>
      </Panel>

      <Panel title="История">
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            onClick={clearHistory}
            className="text-[10px] uppercase tracking-wider text-[#4b5563] hover:text-red-400"
          >
            Очистить
          </button>
        </div>
        {history.length === 0 ? (
          <p className="text-xs text-[#4b5563]">Пока пусто</p>
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
                  title="Копировать"
                >
                  ⊞
                </button>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  )
}
