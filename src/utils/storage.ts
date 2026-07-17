import { ITEM_MAP } from '../data/items'
import {
  DEFAULT_UTILITIES_CONFIG,
  UTILITY_ORDER,
  type UtilitiesConfig,
  type UtilityId,
} from '../data/utilities'
import type { HistoryEntry } from '../types'
import type { ArsenalTab, UtilityView } from '../types/modes'
import {
  buyBindsFromHistory,
  normalizeBuyBinds,
  type BuyBind,
} from './buyBinds'

const HISTORY_KEY = 'cs2-bind-history'
const APP_STATE_KEY = 'cs2-bind-app-state'
const APP_STATE_VERSION = 3

export interface PersistedAppState {
  version: number
  selectedIds: string[]
  quantities: Record<string, number>
  bindKey: string
  /** Saved weapon buy binds (multiple keys). */
  buyBinds: BuyBind[]
  /** null = no tab selected (idle home / post-welcome) */
  arsenalTab: ArsenalTab | null
  utilitySelectedIds: UtilityId[]
  utilityActiveId: UtilityId | null
  utilityView: UtilityView
  utilitiesConfig: UtilitiesConfig
}

const ARSENAL_TABS: ArsenalTab[] = [
  'profile',
  'notifications',
  'weapons',
  'utilities',
  'unbind',
]
const UTILITY_ID_SET = new Set<string>(UTILITY_ORDER)

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : []
  } catch {
    return []
  }
}

export function saveHistory(history: HistoryEntry[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)))
  try {
    window.dispatchEvent(new Event('cs2-history-updated'))
  } catch {
    // SSR / non-browser — ignore
  }
}

export function formatHistoryDate(ts: number): string {
  const d = new Date(ts)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const mins = String(d.getMinutes()).padStart(2, '0')
  return `${day}.${month}, ${hours}:${mins}`
}

export function formatPrice(price: number): string {
  return '$' + price.toLocaleString('en-US').replace(/,/g, ' ')
}

/** Compact price for buy-menu tiles, e.g. $1050 */
export function formatCardPrice(price: number): string {
  return `$${price}`
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value)
}

/** Merge saved nested config onto defaults so new fields appear after updates. */
function mergeWithDefaults<T>(defaults: T, saved: unknown): T {
  if (!isPlainObject(defaults)) {
    return saved === undefined ? defaults : (saved as T)
  }
  const src = isPlainObject(saved) ? saved : {}
  const out: Record<string, unknown> = {
    ...(defaults as Record<string, unknown>),
  }
  for (const key of Object.keys(defaults as Record<string, unknown>)) {
    const defVal = (defaults as Record<string, unknown>)[key]
    const savedVal = src[key]
    if (isPlainObject(defVal)) {
      out[key] = mergeWithDefaults(defVal, savedVal)
    } else if (savedVal !== undefined) {
      out[key] = savedVal
    }
  }
  return out as T
}

function isUtilityId(id: unknown): id is UtilityId {
  return typeof id === 'string' && UTILITY_ID_SET.has(id)
}

function isArsenalTab(tab: unknown): tab is ArsenalTab {
  return typeof tab === 'string' && ARSENAL_TABS.includes(tab as ArsenalTab)
}

function isUtilityView(view: unknown): view is UtilityView {
  return view === 'home' || view === 'detail'
}

export function getDefaultAppState(): PersistedAppState {
  return {
    version: APP_STATE_VERSION,
    selectedIds: [],
    quantities: {},
    bindKey: '',
    buyBinds: [],
    arsenalTab: null,
    utilitySelectedIds: [],
    utilityActiveId: null,
    utilityView: 'home',
    utilitiesConfig: DEFAULT_UTILITIES_CONFIG,
  }
}

export function loadAppState(): PersistedAppState {
  const defaults = getDefaultAppState()
  try {
    const raw = localStorage.getItem(APP_STATE_KEY)
    if (!raw) return defaults
    const parsed = JSON.parse(raw) as Partial<PersistedAppState>
    if (!parsed || typeof parsed !== 'object') return defaults

    const selectedIds = Array.isArray(parsed.selectedIds)
      ? parsed.selectedIds.filter(
          (id): id is string => typeof id === 'string' && Boolean(ITEM_MAP[id]),
        )
      : []

    const quantities: Record<string, number> = {}
    if (isPlainObject(parsed.quantities)) {
      for (const id of selectedIds) {
        const q = parsed.quantities[id]
        const max = ITEM_MAP[id]?.maxQuantity ?? 1
        if (typeof q === 'number' && Number.isFinite(q)) {
          quantities[id] = Math.max(1, Math.min(max, Math.round(q)))
        } else {
          quantities[id] = 1
        }
      }
    } else {
      for (const id of selectedIds) quantities[id] = 1
    }

    const utilitySelectedIds = Array.isArray(parsed.utilitySelectedIds)
      ? parsed.utilitySelectedIds.filter(isUtilityId)
      : []

    let utilityActiveId: UtilityId | null = isUtilityId(parsed.utilityActiveId)
      ? parsed.utilityActiveId
      : null

    let utilityView: UtilityView = isUtilityView(parsed.utilityView)
      ? parsed.utilityView
      : 'home'

    if (utilityView === 'detail' && !utilityActiveId) {
      utilityView = 'home'
    }
    if (utilityActiveId && !utilitySelectedIds.includes(utilityActiveId)) {
      utilitySelectedIds.push(utilityActiveId)
    }

    const arsenalTab =
      parsed.arsenalTab === null
        ? null
        : isArsenalTab(parsed.arsenalTab)
          ? parsed.arsenalTab
          : defaults.arsenalTab

    // v2+: keep utilities; older saves reset to defaults
    const utilitiesConfig =
      typeof parsed.version === 'number' && parsed.version >= 2
        ? mergeWithDefaults(DEFAULT_UTILITIES_CONFIG, parsed.utilitiesConfig)
        : { ...DEFAULT_UTILITIES_CONFIG }

    let buyBinds = normalizeBuyBinds(
      (parsed as Partial<PersistedAppState>).buyBinds,
    )
    // v3 migration: recover multiple buy binds from copy history
    if (buyBinds.length === 0) {
      buyBinds = buyBindsFromHistory(loadHistory())
    }

    return {
      version: APP_STATE_VERSION,
      selectedIds,
      quantities,
      bindKey: typeof parsed.bindKey === 'string' ? parsed.bindKey : '',
      buyBinds,
      arsenalTab,
      utilitySelectedIds,
      utilityActiveId,
      utilityView,
      utilitiesConfig,
    }
  } catch {
    return defaults
  }
}

export function saveAppState(state: Omit<PersistedAppState, 'version'>): void {
  try {
    const payload: PersistedAppState = {
      version: APP_STATE_VERSION,
      ...state,
    }
    localStorage.setItem(APP_STATE_KEY, JSON.stringify(payload))
  } catch {
    // Quota / private mode — ignore
  }
}
