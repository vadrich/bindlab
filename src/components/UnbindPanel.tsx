import { useEffect, useMemo, useRef, useState } from 'react'
import type { UtilitiesConfig, UtilityId } from '../data/utilities'
import { useMessages } from '../i18n/I18nProvider'
import type { HistoryEntry } from '../types'
import { collectActiveBinds } from '../utils/bindConflicts'
import type { BuyBind } from '../utils/buyBinds'
import { loadHistory } from '../utils/storage'
import {
  buildUnbindCommandForKeys,
  collectAppUnbindKeys,
  focusUnbindSidebar,
  publishUnbindPickedKeys,
  type UnbindFocusMode,
} from '../utils/unbindFromHistory'

interface UnbindPanelProps {
  bindKey: string
  selectedIds: string[]
  buyBinds?: BuyBind[]
  utilitiesConfig: UtilitiesConfig
  utilitySelectedIds: UtilityId[]
}

/** Full guide for unbindall + selective history/current-config unbinds. */
export function UnbindPanel({
  bindKey,
  selectedIds,
  buyBinds = [],
  utilitiesConfig,
  utilitySelectedIds,
}: UnbindPanelProps) {
  const m = useMessages()
  const u = m.unbind
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory())
  const [selected, setSelected] = useState<UnbindFocusMode | null>(null)
  const [picked, setPicked] = useState<Set<string>>(() => new Set())
  const knownKeysRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const sync = () => setHistory(loadHistory())
    window.addEventListener('cs2-history-updated', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('cs2-history-updated', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const activeKeys = useMemo(
    () =>
      collectActiveBinds(utilitiesConfig, {
        bindKey,
        selectedWeaponIds: selectedIds,
        utilitySelectedIds,
        buyBinds,
      }).map((b) => b.key),
    [utilitiesConfig, bindKey, selectedIds, utilitySelectedIds, buyBinds],
  )

  const availableKeys = useMemo(
    () => collectAppUnbindKeys(history, activeKeys),
    [history, activeKeys],
  )

  // New keys start checked; clearing selection is preserved across list updates.
  useEffect(() => {
    setPicked((prev) => {
      const next = new Set<string>()
      const known = knownKeysRef.current
      for (const key of availableKeys) {
        if (!known.has(key) || prev.has(key)) next.add(key)
      }
      knownKeysRef.current = new Set(availableKeys)
      return next
    })
  }, [availableKeys])

  const pickedList = useMemo(
    () => availableKeys.filter((k) => picked.has(k)),
    [availableKeys, picked],
  )

  const historyCommand = buildUnbindCommandForKeys(pickedList)

  useEffect(() => {
    publishUnbindPickedKeys(pickedList)
  }, [pickedList])

  const pick = (mode: UnbindFocusMode) => {
    setSelected(mode)
    focusUnbindSidebar(mode)
  }

  const toggleKey = (key: string) => {
    setPicked((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
    setSelected('history')
    focusUnbindSidebar('history')
  }

  const selectAll = () => {
    setPicked(new Set(availableKeys))
    setSelected('history')
    focusUnbindSidebar('history')
  }

  const selectNone = () => {
    setPicked(new Set())
    setSelected('history')
    focusUnbindSidebar('history')
  }

  return (
    <div className="ui-panel relative mx-auto max-w-3xl px-5 py-6">
      <div className="relative z-[1]">
      <div
        className="mb-5 rounded-xl border border-[var(--accent)]/45 bg-gradient-to-br from-[var(--accent-soft-bg)] to-black/40 px-4 py-3.5 shadow-[0_0_24px_rgba(var(--accent-rgb),0.15)]"
        role="note"
      >
        <p className="mb-1 text-sm font-bold text-[var(--accent-muted)]">
          {m.tips.unbind.title}
        </p>
        <p className="mb-3 text-[12px] leading-relaxed text-[var(--text-muted)]">
          {m.tips.unbind.lead}
        </p>
        <div className="overflow-hidden rounded-lg border border-white/10">
          <table className="w-full border-collapse text-left text-[11px]">
            <tbody>
              {m.tips.unbind.rows.map((row) => (
                <tr
                  key={row.label}
                  className="border-b border-white/10 last:border-b-0"
                >
                  <th className="w-[28%] whitespace-nowrap bg-black/40 px-3 py-2.5 align-top font-mono font-bold text-[var(--accent-muted)]">
                    {row.label}
                  </th>
                  <td className="bg-black/25 px-3 py-2.5 leading-relaxed text-[#e5e7eb]">
                    {row.body}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-4 flex items-start gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-[var(--accent)] text-3xl font-black leading-none text-[var(--accent)] shadow-[var(--accent-glow)]"
          aria-hidden
        >
          !
        </div>
        <div>
          <p className="mb-1 text-sm font-semibold tracking-wide text-[var(--accent-muted)]">
            {u.title}
          </p>
          <p className="text-[12px] leading-relaxed text-[#9ca3af]">
            {u.leadBefore}{' '}
            <span className="font-semibold text-[var(--accent)]">{u.leadMark1}</span>{' '}
            {u.leadMid}{' '}
            <span className="font-semibold text-[var(--accent)]">{u.leadMark2}</span>{' '}
            {u.leadAfter}
          </p>
        </div>
      </div>

      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">
        {u.choiceTitle}
      </p>
      <div className="mb-5 grid gap-3 lg:grid-cols-2">
        <button
          type="button"
          onClick={() => pick('all')}
          className={[
            'rounded-lg border p-3 text-left transition-all',
            selected === 'all'
              ? 'border-[var(--accent)] bg-[#0a0e14] ring-1 ring-[var(--accent)]'
              : 'border-[#2a3340] bg-[#0a0e14] hover:border-[var(--accent)]/60',
          ].join(' ')}
        >
          <p className="mb-1 text-xs font-bold text-[#c4c9d1]">
            {u.choiceAllTitle}
          </p>
          <p className="mb-2 text-[11px] leading-relaxed text-[#9ca3af]">
            {u.choiceAllBody}
          </p>
          <pre className="overflow-auto whitespace-pre-wrap break-all rounded border border-[#2a3340] bg-[#070b10] p-2 font-mono text-[11px] text-[var(--accent-muted)]">
            unbindall
          </pre>
        </button>

        <div
          className={[
            'rounded-lg border p-3 text-left transition-all',
            selected === 'history'
              ? 'border-[var(--accent)] bg-[#0a0e14] ring-1 ring-[var(--accent)]'
              : 'border-[#2a3340] bg-[#0a0e14]',
          ].join(' ')}
        >
          <button
            type="button"
            onClick={() => pick('history')}
            className="mb-1 w-full text-left"
          >
            <p className="text-xs font-bold text-[#c4c9d1]">
              {u.choiceHistoryTitle}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-[#9ca3af]">
              {u.choiceHistoryBody}
            </p>
          </button>

          {availableKeys.length === 0 ? (
            <p className="mt-2 text-[11px] leading-relaxed text-[#4b5563]">
              {u.choiceHistoryEmpty}
            </p>
          ) : (
            <>
              <div className="mt-2 mb-2 flex flex-wrap items-center gap-2">
                <p className="text-[10px] uppercase tracking-wider text-[#6b7280]">
                  {u.choiceHistoryKeys} ({pickedList.length}/{availableKeys.length})
                </p>
                <button
                  type="button"
                  onClick={selectAll}
                  className="rounded border border-[#2a3340] px-1.5 py-0.5 text-[10px] text-[#9ca3af] hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
                >
                  {u.selectAll}
                </button>
                <button
                  type="button"
                  onClick={selectNone}
                  className="rounded border border-[#2a3340] px-1.5 py-0.5 text-[10px] text-[#9ca3af] hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
                >
                  {u.selectNone}
                </button>
              </div>
              <p className="mb-2 text-[10px] leading-relaxed text-[#6b7280]">
                {u.pickKeysHint}
              </p>
              <ul className="mb-2 grid max-h-40 grid-cols-2 gap-1 overflow-auto sm:grid-cols-3">
                {availableKeys.map((key) => {
                  const on = picked.has(key)
                  return (
                    <li key={key}>
                      <label
                        className={[
                          'flex cursor-pointer items-center gap-1.5 rounded border px-2 py-1.5 font-mono text-[11px] transition-colors',
                          on
                            ? 'border-[var(--accent)]/50 bg-[var(--accent-soft)] text-[var(--accent-muted)]'
                            : 'border-[#2a3340] bg-[#070b10] text-[#6b7280]',
                        ].join(' ')}
                      >
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => toggleKey(key)}
                          className="accent-[var(--accent)]"
                        />
                        {key}
                      </label>
                    </li>
                  )
                })}
              </ul>
              {historyCommand ? (
                <pre className="max-h-28 overflow-auto whitespace-pre-wrap break-all rounded border border-[#2a3340] bg-[#070b10] p-2 font-mono text-[11px] text-[var(--accent-muted)]">
                  {historyCommand}
                </pre>
              ) : (
                <p className="text-[11px] text-[#4b5563]">{u.pickKeysNone}</p>
              )}
            </>
          )}
        </div>
      </div>

      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">
        {u.howTitle}
      </p>
      <ol className="mb-5 list-decimal space-y-2 pl-5 text-[12px] leading-relaxed text-[#9ca3af]">
        <li>
          {u.how1a} <span className="text-[#c4c9d1]">{u.how1b}</span>
        </li>
        <li>
          {u.how2a}{' '}
          <span className="font-mono text-[var(--accent)]">~</span> {u.how2b}
        </li>
        <li>
          {u.how3a}{' '}
          <span className="font-mono text-[var(--accent)]">unbindall</span>{' '}
          {u.how3b}
        </li>
        <li>{u.how4}</li>
        <li>
          {u.how5a} <span className="text-[#c4c9d1]">{u.how5b}</span>
        </li>
        <li>
          {u.how6a} <span className="text-[#c4c9d1]">{u.how6b}</span>
        </li>
        <li>{u.how7}</li>
      </ol>

      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">
        {u.altTitle}
      </p>
      <p className="mb-2 text-[12px] leading-relaxed text-[#9ca3af]">{u.altLead}</p>
      <ol className="mb-5 list-decimal space-y-2 pl-5 text-[12px] leading-relaxed text-[#9ca3af]">
        <li>
          {u.alt1a} <span className="text-[#c4c9d1]">{u.alt1b}</span>
        </li>
        <li>
          {u.alt2a} <span className="text-[#c4c9d1]">{u.alt2b}</span> {u.alt2c}
        </li>
        <li>
          {u.alt3a}{' '}
          <span className="font-mono text-[var(--accent)]">{u.alt3b}</span>
        </li>
        <li>
          {u.alt4a}{' '}
          <span className="font-mono text-[var(--accent)]">config.cfg</span>{' '}
          {u.alt4b}
        </li>
        <li>{u.alt5}</li>
      </ol>

      <p className="text-[11px] leading-relaxed text-[#4b5563]">
        {u.footerBefore}{' '}
        <span className="font-mono">unbindall</span> {u.footerAfter}
      </p>
      </div>
    </div>
  )
}
