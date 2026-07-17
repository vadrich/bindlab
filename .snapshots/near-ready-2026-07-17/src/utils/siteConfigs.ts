import {
  DEFAULT_UTILITIES_CONFIG,
  type UtilitiesConfig,
} from '../data/utilities'
import { ITEM_MAP } from '../data/items'
import { normalizeBuyBinds, type BuyBind } from './buyBinds'

const SITE_CONFIGS_KEY = 'cs2-bind-site-configs'
const MAX_SAVED = 20
export const SHARE_HASH_PREFIX = 'cfg='

export interface ConfigSnapshot {
  v: 1
  name?: string
  selectedIds: string[]
  quantities: Record<string, number>
  bindKey: string
  buyBinds?: BuyBind[]
  utilitiesConfig: UtilitiesConfig
}
export interface SavedSiteConfig {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  snapshot: ConfigSnapshot
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value)
}

function mergeUtilities(saved: unknown): UtilitiesConfig {
  if (!isPlainObject(saved)) return { ...DEFAULT_UTILITIES_CONFIG }
  const out = {
    ...(DEFAULT_UTILITIES_CONFIG as unknown as Record<string, unknown>),
  }
  const src = saved
  for (const key of Object.keys(DEFAULT_UTILITIES_CONFIG)) {
    const defVal = (DEFAULT_UTILITIES_CONFIG as unknown as Record<string, unknown>)[
      key
    ]
    const savedVal = src[key]
    if (isPlainObject(defVal) && isPlainObject(savedVal)) {
      out[key] = { ...defVal, ...savedVal }
    } else if (savedVal !== undefined) {
      out[key] = savedVal
    }
  }
  return out as unknown as UtilitiesConfig
}

export function createSnapshot(input: {
  name?: string
  selectedIds: string[]
  quantities: Record<string, number>
  bindKey: string
  buyBinds?: BuyBind[]
  utilitiesConfig: UtilitiesConfig
}): ConfigSnapshot {
  const selectedIds = input.selectedIds.filter((id) => Boolean(ITEM_MAP[id]))
  const quantities: Record<string, number> = {}
  for (const id of selectedIds) {
    const max = ITEM_MAP[id]?.maxQuantity ?? 1
    const q = input.quantities[id] ?? 1
    quantities[id] = Math.max(1, Math.min(max, Math.round(q)))
  }
  return {
    v: 1,
    name: input.name?.trim() || undefined,
    selectedIds,
    quantities,
    bindKey: input.bindKey.trim(),
    buyBinds: normalizeBuyBinds(input.buyBinds ?? []),
    utilitiesConfig: input.utilitiesConfig,
  }
}

export function normalizeSnapshot(raw: unknown): ConfigSnapshot | null {
  if (!isPlainObject(raw)) return null
  if (raw.v !== 1) return null
  const selectedIds = Array.isArray(raw.selectedIds)
    ? raw.selectedIds.filter(
        (id): id is string => typeof id === 'string' && Boolean(ITEM_MAP[id]),
      )
    : []
  const quantities: Record<string, number> = {}
  if (isPlainObject(raw.quantities)) {
    for (const id of selectedIds) {
      const q = raw.quantities[id]
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
  return {
    v: 1,
    name: typeof raw.name === 'string' ? raw.name : undefined,
    selectedIds,
    quantities,
    bindKey: typeof raw.bindKey === 'string' ? raw.bindKey : '',
    buyBinds: normalizeBuyBinds(raw.buyBinds),
    utilitiesConfig: mergeUtilities(raw.utilitiesConfig),
  }
}

function toBase64Url(json: string): string {
  const b64 = btoa(unescape(encodeURIComponent(json)))
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(encoded: string): string {
  const padded = encoded.replace(/-/g, '+').replace(/_/g, '/')
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4))
  return decodeURIComponent(escape(atob(padded + pad)))
}

export function encodeSharePayload(snapshot: ConfigSnapshot): string {
  return toBase64Url(JSON.stringify(snapshot))
}

export function decodeSharePayload(encoded: string): ConfigSnapshot | null {
  try {
    const json = fromBase64Url(encoded.trim())
    return normalizeSnapshot(JSON.parse(json))
  } catch {
    return null
  }
}

/**
 * Parse a share URL, `#cfg=…` fragment, raw payload, or JSON snapshot from clipboard.
 */
export function parseImportedConfig(text: string): ConfigSnapshot | null {
  const trimmed = text.trim()
  if (!trimmed) return null

  try {
    const url = new URL(trimmed)
    const fromHash = readShareFromHash(url.hash)
    if (fromHash) return fromHash
  } catch {
    // not a full URL
  }

  const cfgIdx = trimmed.indexOf(SHARE_HASH_PREFIX)
  if (cfgIdx >= 0) {
    const raw = trimmed.slice(cfgIdx + SHARE_HASH_PREFIX.length)
    const payload = raw.split(/[\s&#?/]/)[0] ?? ''
    const decoded = decodeSharePayload(payload)
    if (decoded) return decoded
  }

  if (trimmed.startsWith('{')) {
    try {
      return normalizeSnapshot(JSON.parse(trimmed))
    } catch {
      return null
    }
  }

  return decodeSharePayload(trimmed)
}

export function buildShareUrl(snapshot: ConfigSnapshot): string {
  const payload = encodeSharePayload(snapshot)
  const base = `${window.location.origin}${window.location.pathname}`
  return `${base}#${SHARE_HASH_PREFIX}${payload}`
}

/** Read `#cfg=...` from location hash. */
export function readShareFromHash(hash = window.location.hash): ConfigSnapshot | null {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash
  if (!raw.startsWith(SHARE_HASH_PREFIX)) return null
  return decodeSharePayload(raw.slice(SHARE_HASH_PREFIX.length))
}

export function clearShareHash(): void {
  try {
    const url = `${window.location.pathname}${window.location.search}`
    window.history.replaceState(null, '', url)
  } catch {
    // ignore
  }
}

export function loadSavedConfigs(): SavedSiteConfig[] {
  try {
    const raw = localStorage.getItem(SITE_CONFIGS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    const out: SavedSiteConfig[] = []
    for (const item of parsed) {
      if (!isPlainObject(item)) continue
      const snapshot = normalizeSnapshot(item.snapshot)
      if (!snapshot) continue
      if (typeof item.id !== 'string' || typeof item.name !== 'string') continue
      out.push({
        id: item.id,
        name: item.name,
        createdAt: typeof item.createdAt === 'number' ? item.createdAt : Date.now(),
        updatedAt: typeof item.updatedAt === 'number' ? item.updatedAt : Date.now(),
        snapshot,
      })
    }
    return out
  } catch {
    return []
  }
}

function persistConfigs(list: SavedSiteConfig[]): void {
  localStorage.setItem(SITE_CONFIGS_KEY, JSON.stringify(list.slice(0, MAX_SAVED)))
}

export function saveNamedConfig(
  name: string,
  snapshot: ConfigSnapshot,
  existingId?: string,
): SavedSiteConfig {
  const list = loadSavedConfigs()
  const now = Date.now()
  const trimmed = name.trim() || 'Config'
  if (existingId) {
    const idx = list.findIndex((c) => c.id === existingId)
    if (idx >= 0) {
      const updated: SavedSiteConfig = {
        ...list[idx],
        name: trimmed,
        updatedAt: now,
        snapshot: { ...snapshot, name: trimmed },
      }
      list[idx] = updated
      persistConfigs(list)
      return updated
    }
  }
  const entry: SavedSiteConfig = {
    id: crypto.randomUUID(),
    name: trimmed,
    createdAt: now,
    updatedAt: now,
    snapshot: { ...snapshot, name: trimmed },
  }
  persistConfigs([entry, ...list].slice(0, MAX_SAVED))
  return entry
}

export function deleteSavedConfig(id: string): void {
  persistConfigs(loadSavedConfigs().filter((c) => c.id !== id))
}
