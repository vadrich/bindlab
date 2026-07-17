const COUNT_KEY = 'cs2-bind-usage-count'
const LAST_HIT_KEY = 'cs2-bind-usage-last-hit'
export const USAGE_COOLDOWN_MS = 15_000

export function getUsageCount(): number {
  try {
    const raw = localStorage.getItem(COUNT_KEY)
    const n = raw ? Number.parseInt(raw, 10) : 0
    return Number.isFinite(n) && n >= 0 ? n : 0
  } catch {
    return 0
  }
}

/** Remaining ms until next increment is allowed (0 = ready). */
export function getUsageCooldownRemaining(): number {
  try {
    const last = Number.parseInt(localStorage.getItem(LAST_HIT_KEY) ?? '0', 10)
    if (!Number.isFinite(last) || last <= 0) return 0
    return Math.max(0, USAGE_COOLDOWN_MS - (Date.now() - last))
  } catch {
    return 0
  }
}

/**
 * Increment global usage counter if cooldown elapsed.
 * @returns new count, or null if skipped (cooldown / error)
 */
export function tryIncrementUsage(): number | null {
  if (getUsageCooldownRemaining() > 0) return null
  try {
    const next = getUsageCount() + 1
    localStorage.setItem(COUNT_KEY, String(next))
    localStorage.setItem(LAST_HIT_KEY, String(Date.now()))
    return next
  } catch {
    return null
  }
}

export function formatUsageCount(n: number): string {
  return n.toLocaleString('ru-RU')
}
