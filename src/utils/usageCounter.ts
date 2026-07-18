import {
  doc,
  getDoc,
  increment,
  onSnapshot,
  setDoc,
  type Unsubscribe,
} from 'firebase/firestore'
import { getFirebaseDb } from '../firebase'

const CACHE_KEY = 'cs2-bind-usage-count'
const LAST_HIT_KEY = 'cs2-bind-usage-last-hit'
const STATS_COLLECTION = 'stats'
const STATS_DOC = 'usage'

export const USAGE_COOLDOWN_MS = 15_000

function readCache(): number {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    const n = raw ? Number.parseInt(raw, 10) : 0
    return Number.isFinite(n) && n >= 0 ? n : 0
  } catch {
    return 0
  }
}

function writeCache(n: number): void {
  try {
    localStorage.setItem(CACHE_KEY, String(n))
  } catch {
    // private mode / quota
  }
}

/** Last known count (local cache). Prefer subscribeUsageCount for live total. */
export function getUsageCount(): number {
  return readCache()
}

/** Remaining ms until next increment is allowed (0 = ready). Per-browser anti-spam. */
export function getUsageCooldownRemaining(): number {
  try {
    const last = Number.parseInt(localStorage.getItem(LAST_HIT_KEY) ?? '0', 10)
    if (!Number.isFinite(last) || last <= 0) return 0
    return Math.max(0, USAGE_COOLDOWN_MS - (Date.now() - last))
  } catch {
    return 0
  }
}

function markCooldown(): void {
  try {
    localStorage.setItem(LAST_HIT_KEY, String(Date.now()))
  } catch {
    // ignore
  }
}

function usageDoc() {
  const db = getFirebaseDb()
  if (!db) return null
  return doc(db, STATS_COLLECTION, STATS_DOC)
}

async function incrementRemote(): Promise<number | null> {
  const ref = usageDoc()
  if (!ref) return null
  await setDoc(ref, { count: increment(1) }, { merge: true })
  const snap = await getDoc(ref)
  const n = snap.data()?.count
  return typeof n === 'number' && Number.isFinite(n) ? n : null
}

/**
 * Increment site-wide usage counter (Firestore) if local cooldown elapsed.
 * Falls back to localStorage when Firebase/Firestore is unavailable.
 * @returns optimistic/new count, or null if skipped (cooldown)
 */
export function tryIncrementUsage(): number | null {
  if (getUsageCooldownRemaining() > 0) return null
  markCooldown()

  const optimistic = readCache() + 1
  writeCache(optimistic)

  if (!usageDoc()) {
    return optimistic
  }

  void incrementRemote()
    .then((n) => {
      if (n != null) {
        writeCache(n)
        window.dispatchEvent(new Event('cs2-usage-updated'))
      }
    })
    .catch(() => {
      // keep optimistic local cache if remote fails
    })

  return optimistic
}

/** Live subscribe to global count. Returns unsubscribe. */
export function subscribeUsageCount(
  onChange: (n: number) => void,
): Unsubscribe | (() => void) {
  const ref = usageDoc()
  if (!ref) {
    onChange(readCache())
    return () => {}
  }

  return onSnapshot(
    ref,
    (snap) => {
      const n = snap.data()?.count
      if (typeof n === 'number' && Number.isFinite(n) && n >= 0) {
        writeCache(n)
        onChange(n)
      } else if (!snap.exists()) {
        onChange(readCache())
      }
    },
    () => {
      onChange(readCache())
    },
  )
}

export function formatUsageCount(n: number): string {
  return n.toLocaleString('ru-RU')
}
