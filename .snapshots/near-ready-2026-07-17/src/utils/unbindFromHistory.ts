import type { HistoryEntry } from '../types'
import { joinConsoleCommands } from './consolePaste'

export type UnbindFocusMode = 'all' | 'history'

export const UNBIND_FOCUS_EVENT = 'cs2-focus-unbind'

export function focusUnbindSidebar(mode: UnbindFocusMode) {
  window.dispatchEvent(
    new CustomEvent(UNBIND_FOCUS_EVENT, { detail: { mode } }),
  )
}

/**
 * Extract CS2 bind keys from a pasted console line / history command.
 * Supports: bind f "...", bind "mouse4" "...", bind mouse5 +jump
 */
export function extractBindKeysFromText(text: string): string[] {
  const keys = new Set<string>()
  const re =
    /\bbind\s+(?:(?:"([^"]+)")|(?:'([^']+)')|([^\s;"']+))/gi
  let match: RegExpExecArray | null
  while ((match = re.exec(text)) !== null) {
    const key = (match[1] ?? match[2] ?? match[3] ?? '').trim().toLowerCase()
    if (!key || key === 'unbind' || key === 'unbindall') continue
    keys.add(key)
  }
  return [...keys]
}

/** Unique bind keys found across copy history (from this app). */
export function collectBindKeysFromHistory(history: HistoryEntry[]): string[] {
  const keys = new Set<string>()
  for (const entry of history) {
    for (const key of extractBindKeysFromText(entry.command)) {
      keys.add(key)
    }
  }
  return [...keys].sort((a, b) => a.localeCompare(b))
}

/**
 * Keys to unbind from this app: copy History plus currently selected /
 * loaded config binds (so a Profile load still works with empty history).
 */
export function collectAppUnbindKeys(
  history: HistoryEntry[],
  activeKeys: string[] = [],
): string[] {
  const keys = new Set(collectBindKeysFromHistory(history))
  for (const raw of activeKeys) {
    const key = raw.trim().toLowerCase()
    if (!key || key === 'unbind' || key === 'unbindall') continue
    keys.add(key)
  }
  return [...keys].sort((a, b) => a.localeCompare(b))
}

/** One console line: unbind each app key (history and/or current config). */
export function buildAppUnbindCommand(
  history: HistoryEntry[],
  activeKeys: string[] = [],
): string {
  return buildUnbindCommandForKeys(collectAppUnbindKeys(history, activeKeys))
}

/** Build `unbind k1; unbind k2; …` for an explicit key list. */
export function buildUnbindCommandForKeys(keys: string[]): string {
  const unique = [
    ...new Set(
      keys
        .map((k) => k.trim().toLowerCase())
        .filter((k) => k && k !== 'unbind' && k !== 'unbindall'),
    ),
  ].sort((a, b) => a.localeCompare(b))
  if (unique.length === 0) return ''
  return joinConsoleCommands(unique.map((key) => `unbind ${key}`))
}

/** @deprecated Prefer buildAppUnbindCommand — kept for callers that only have history. */
export function buildHistoryUnbindCommand(history: HistoryEntry[]): string {
  return buildAppUnbindCommand(history)
}

export const UNBIND_PICK_EVENT = 'cs2-unbind-picked-keys'

/** Tell the sidebar which keys are checked for selective unbind. */
export function publishUnbindPickedKeys(keys: string[]) {
  window.dispatchEvent(
    new CustomEvent(UNBIND_PICK_EVENT, { detail: { keys } }),
  )
}
