import { buildBindCommand, ITEM_MAP } from '../data/items'
import type { HistoryEntry } from '../types'

export interface BuyBind {
  id: string
  key: string
  itemIds: string[]
  quantities: Record<string, number>
}

function normKey(key: string): string {
  return key.trim().toLowerCase()
}

function sanitizeQuantities(
  itemIds: string[],
  quantities: Record<string, number>,
): Record<string, number> {
  const out: Record<string, number> = {}
  for (const id of itemIds) {
    if (!ITEM_MAP[id]) continue
    const max = ITEM_MAP[id].maxQuantity ?? 1
    const q = quantities[id] ?? 1
    out[id] = Math.max(1, Math.min(max, Math.round(q)))
  }
  return out
}

export function formatBuyLoadout(b: BuyBind): string {
  return b.itemIds
    .map((id) => {
      const item = ITEM_MAP[id]
      if (!item) return null
      const qty = b.quantities[id] ?? 1
      return qty > 1 ? `${item.name} ×${qty}` : item.name
    })
    .filter(Boolean)
    .join(', ')
}

function loadoutSignature(b: BuyBind): string {
  return b.itemIds
    .map((id) => `${id}:${b.quantities[id] ?? 1}`)
    .sort()
    .join('|')
}

export function sameBuyBind(a: BuyBind, b: BuyBind): boolean {
  return (
    normKey(a.key) === normKey(b.key) &&
    loadoutSignature(a) === loadoutSignature(b)
  )
}

export function createBuyBind(
  key: string,
  itemIds: string[],
  quantities: Record<string, number>,
): BuyBind | null {
  const k = key.trim()
  const ids = itemIds.filter((id) => Boolean(ITEM_MAP[id]))
  if (!k || ids.length === 0) return null
  return {
    id: crypto.randomUUID(),
    key: k,
    itemIds: ids,
    quantities: sanitizeQuantities(ids, quantities),
  }
}

/**
 * Add a buy bind. Same key with a different loadout is kept (conflict).
 * Exact duplicate (same key + same items) is ignored.
 */
export function appendBuyBind(list: BuyBind[], next: BuyBind): BuyBind[] {
  const entry = { ...next, key: next.key.trim() }
  if (list.some((b) => sameBuyBind(b, entry))) return list
  return [...list, entry]
}

/** @deprecated Use appendBuyBind — kept for history migration (last wins). */
export function upsertBuyBind(list: BuyBind[], next: BuyBind): BuyBind[] {
  const k = normKey(next.key)
  const without = list.filter((b) => normKey(b.key) !== k)
  return [...without, { ...next, key: next.key.trim() }]
}

export function removeBuyBind(list: BuyBind[], id: string): BuyBind[] {
  return list.filter((b) => b.id !== id)
}

export function buildBuyBindCommands(list: BuyBind[]): string[] {
  const lines: string[] = []
  for (const b of list) {
    const cmd = buildBindCommand(b.key, b.itemIds, b.quantities)
    if (cmd) lines.push(cmd)
  }
  return lines
}

/**
 * Saved buys + current editor draft (appended, never replacing).
 * Used when a preview of draft+saved is needed; Profile paste uses saved only.
 */
export function mergeBuyBindsWithDraft(
  saved: BuyBind[],
  draftKey: string,
  draftItemIds: string[],
  draftQuantities: Record<string, number>,
): BuyBind[] {
  const draft = createBuyBind(draftKey, draftItemIds, draftQuantities)
  if (!draft) return saved
  return appendBuyBind(saved, draft)
}

export function normalizeBuyBinds(raw: unknown): BuyBind[] {
  if (!Array.isArray(raw)) return []
  const out: BuyBind[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const rec = item as Record<string, unknown>
    const key = typeof rec.key === 'string' ? rec.key.trim() : ''
    const itemIds = Array.isArray(rec.itemIds)
      ? rec.itemIds.filter(
          (id): id is string => typeof id === 'string' && Boolean(ITEM_MAP[id]),
        )
      : []
    if (!key || itemIds.length === 0) continue
    const quantities = isPlainObject(rec.quantities)
      ? sanitizeQuantities(itemIds, rec.quantities as Record<string, number>)
      : sanitizeQuantities(itemIds, {})
    const entry: BuyBind = {
      id: typeof rec.id === 'string' ? rec.id : crypto.randomUUID(),
      key,
      itemIds,
      quantities,
    }
    if (out.some((b) => sameBuyBind(b, entry))) continue
    out.push(entry)
  }
  return out
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value)
}

/** Recover buy binds from copy history (weapon buy copies only). */
export function buyBindsFromHistory(history: HistoryEntry[]): BuyBind[] {
  let list: BuyBind[] = []
  const chronological = [...history].sort((a, b) => a.createdAt - b.createdAt)
  for (const entry of chronological) {
    if (!/buy\s+/i.test(entry.command)) continue
    const ids = entry.itemIds.filter((id) => Boolean(ITEM_MAP[id]))
    if (ids.length === 0) continue
    const keyMatch = entry.command.match(/^\s*bind\s+(\S+)\s+"/i)
    const key =
      keyMatch?.[1] ||
      (entry.key && entry.key !== '—' ? entry.key : '')
    const created = createBuyBind(key, ids, {})
    if (!created) continue
    // History often overwrote same key — keep each distinct loadout as conflict
    list = appendBuyBind(list, created)
  }
  return list
}
