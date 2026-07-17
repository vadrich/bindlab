import { ITEM_MAP } from '../data/items'

/**
 * Inventory groups that compete in CS2: you keep at most one item per group
 * on yourself (bind may still list several — the rest are wasted or for drops).
 */
export type LoadoutGroup = 'armor' | 'pistol' | 'primary' | 'fire_nade'

export function getLoadoutGroup(itemId: string): LoadoutGroup | null {
  if (itemId === 'vest' || itemId === 'vesthelm') return 'armor'
  const item = ITEM_MAP[itemId]
  if (!item) return null
  if (item.category === 'pistols') return 'pistol'
  if (
    item.category === 'smgs' ||
    item.category === 'midtier' ||
    item.category === 'rifles'
  ) {
    return 'primary'
  }
  if (itemId === 'molotov' || itemId === 'incgrenade') return 'fire_nade'
  return null
}

export interface LoadoutConflict {
  group: LoadoutGroup
  ids: string[]
}

/** Selected items that share the same in-game inventory slot. */
export function findLoadoutConflicts(selectedIds: string[]): LoadoutConflict[] {
  const byGroup = new Map<LoadoutGroup, string[]>()
  for (const id of selectedIds) {
    const group = getLoadoutGroup(id)
    if (!group) continue
    const list = byGroup.get(group) ?? []
    list.push(id)
    byGroup.set(group, list)
  }
  const out: LoadoutConflict[] = []
  for (const [group, ids] of byGroup) {
    if (ids.length >= 2) out.push({ group, ids })
  }
  return out
}
