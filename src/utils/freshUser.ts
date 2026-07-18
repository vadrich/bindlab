/** localStorage keys that survive a “fresh user” reset */
const USAGE_KEYS = new Set([
  'cs2-bind-usage-count',
  'cs2-bind-usage-last-hit',
])

/**
 * Wipe app data so the next load looks like a first visit.
 * Keeps local usage cache + cooldown (global total lives in Firestore).
 */
export function resetToFreshUser(): { removed: string[] } {
  const removed: string[] = []
  try {
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k) keys.push(k)
    }
    for (const k of keys) {
      if (USAGE_KEYS.has(k)) continue
      if (k.startsWith('cs2-')) {
        localStorage.removeItem(k)
        removed.push(k)
      }
    }
  } catch {
    // private mode / quota
  }
  return { removed }
}

/** If URL has ?fresh=1 (or #fresh), reset storage like a first visit.
 *  Keeps `?fresh=1` in the address bar so every open of this link resets again.
 */
export function applyFreshUserFromUrl(): boolean {
  try {
    const url = new URL(window.location.href)
    const byQuery = url.searchParams.get('fresh') === '1'
    const byHash = url.hash === '#fresh' || url.hash === '#fresh=1'
    if (!byQuery && !byHash) return false

    resetToFreshUser()

    // Normalize hash → query so the bookmarkable link stays stable
    if (byHash && !byQuery) {
      url.hash = ''
      url.searchParams.set('fresh', '1')
      window.history.replaceState(null, '', `${url.pathname}?fresh=1`)
    }
    return true
  } catch {
    return false
  }
}
