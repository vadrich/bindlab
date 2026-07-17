import type { BuyItem, ItemCategory } from '../types'

/** Images served from Vite `public/weapons/` → `/weapons/{id}.png` */
export function weaponImage(id: string): string {
  return `/weapons/${id}.png`
}

export const CATEGORY_META: Record<
  ItemCategory,
  { label: string; order: number }
> = {
  equipment: { label: '1 EQUIPMENT', order: 0 },
  pistols: { label: '2 PISTOLS', order: 1 },
  smgs: { label: '3 SMGS', order: 2 },
  midtier: { label: '3 MID-TIER', order: 3 },
  rifles: { label: '4 RIFLES', order: 4 },
  grenades: { label: '5 GRENADES', order: 5 },
}

const RAW_ITEMS: Omit<BuyItem, 'image'>[] = [
  // 1 EQUIPMENT
  { id: 'vest', name: 'Kevlar Vest', buyCommand: 'buy vest', price: 650, category: 'equipment' },
  { id: 'vesthelm', name: 'Kevlar+Helmet', buyCommand: 'buy vesthelm', price: 1000, category: 'equipment' },
  { id: 'defuser', name: 'Defuse Kit', buyCommand: 'buy defuser', price: 400, category: 'equipment' },
  { id: 'taser', name: 'Zeus x27', buyCommand: 'buy taser', price: 200, category: 'equipment' },

  // 2 PISTOLS — без P2000, Glock, USP-S
  { id: 'p250', name: 'P250', buyCommand: 'buy p250', price: 300, category: 'pistols' },
  { id: 'fiveseven', name: 'Five-SeveN', buyCommand: 'buy fiveseven', price: 500, category: 'pistols' },
  { id: 'deagle', name: 'Desert Eagle', buyCommand: 'buy deagle', price: 700, category: 'pistols' },
  { id: 'revolver', name: 'R8 Revolver', buyCommand: 'buy revolver', price: 600, category: 'pistols' },
  { id: 'elite', name: 'Dual Berettas', buyCommand: 'buy elite', price: 300, category: 'pistols' },
  { id: 'tec9', name: 'Tec-9', buyCommand: 'buy tec9', price: 500, category: 'pistols' },
  { id: 'cz75a', name: 'CZ75-Auto', buyCommand: 'buy cz75a', price: 500, category: 'pistols' },

  // 3 SMGS
  { id: 'mac10', name: 'MAC-10', buyCommand: 'buy mac10', price: 1050, category: 'smgs' },
  { id: 'mp9', name: 'MP9', buyCommand: 'buy mp9', price: 1250, category: 'smgs' },
  { id: 'mp7', name: 'MP7', buyCommand: 'buy mp7', price: 1500, category: 'smgs' },
  { id: 'ump45', name: 'UMP-45', buyCommand: 'buy ump45', price: 1200, category: 'smgs' },
  { id: 'p90', name: 'P90', buyCommand: 'buy p90', price: 2350, category: 'smgs' },
  { id: 'bizon', name: 'PP-Bizon', buyCommand: 'buy bizon', price: 1400, category: 'smgs' },

  // 3 MID-TIER
  { id: 'nova', name: 'Nova', buyCommand: 'buy nova', price: 1050, category: 'midtier' },
  { id: 'xm1014', name: 'XM1014', buyCommand: 'buy xm1014', price: 2000, category: 'midtier' },
  { id: 'mag7', name: 'MAG-7', buyCommand: 'buy mag7', price: 1300, category: 'midtier' },
  { id: 'sawedoff', name: 'Sawed-Off', buyCommand: 'buy sawedoff', price: 1100, category: 'midtier' },
  { id: 'ssg08', name: 'SSG 08', buyCommand: 'buy ssg08', price: 1700, category: 'midtier' },
  { id: 'm249', name: 'M249', buyCommand: 'buy m249', price: 5200, category: 'midtier' },
  { id: 'negev', name: 'Negev', buyCommand: 'buy negev', price: 1700, category: 'midtier' },

  // 4 RIFLES
  { id: 'm4a1_silencer', name: 'M4A1-S', buyCommand: 'buy m4a1_silencer', price: 2900, category: 'rifles' },
  { id: 'm4a1', name: 'M4A4', buyCommand: 'buy m4a1', price: 2900, category: 'rifles' },
  { id: 'famas', name: 'FAMAS', buyCommand: 'buy famas', price: 2050, category: 'rifles' },
  { id: 'aug', name: 'AUG', buyCommand: 'buy aug', price: 3300, category: 'rifles' },
  { id: 'sg556', name: 'SG 553', buyCommand: 'buy sg556', price: 3000, category: 'rifles' },
  { id: 'awp', name: 'AWP', buyCommand: 'buy awp', price: 4750, category: 'rifles' },
  { id: 'galilar', name: 'Galil AR', buyCommand: 'buy galilar', price: 1800, category: 'rifles' },
  { id: 'ak47', name: 'AK-47', buyCommand: 'buy ak47', price: 2700, category: 'rifles' },
  { id: 'g3sg1', name: 'G3SG1', buyCommand: 'buy g3sg1', price: 5000, category: 'rifles' },
  { id: 'scar20', name: 'SCAR-20', buyCommand: 'buy scar20', price: 5000, category: 'rifles' },

  // 5 GRENADES
  {
    id: 'flashbang',
    name: 'Flashbang',
    buyCommand: 'buy flashbang',
    price: 200,
    category: 'grenades',
    maxQuantity: 2,
  },
  { id: 'smokegrenade', name: 'Smoke', buyCommand: 'buy smokegrenade', price: 300, category: 'grenades' },
  { id: 'hegrenade', name: 'HE Grenade', buyCommand: 'buy hegrenade', price: 300, category: 'grenades' },
  { id: 'molotov', name: 'Molotov', buyCommand: 'buy molotov', price: 400, category: 'grenades' },
  { id: 'incgrenade', name: 'Incendiary', buyCommand: 'buy incgrenade', price: 600, category: 'grenades' },
  { id: 'decoy', name: 'Decoy', buyCommand: 'buy decoy', price: 50, category: 'grenades' },
]

export const BUY_ITEMS: BuyItem[] = RAW_ITEMS.map((item) => ({
  ...item,
  image: weaponImage(item.id),
}))

export const ITEM_MAP = Object.fromEntries(BUY_ITEMS.map((item) => [item.id, item])) as Record<
  string,
  BuyItem
>

export const CATEGORY_ORDER: ItemCategory[] = [
  'equipment',
  'pistols',
  'smgs',
  'midtier',
  'rifles',
  'grenades',
]

export function getItemsByCategory(category: ItemCategory): BuyItem[] {
  return BUY_ITEMS.filter((item) => item.category === category)
}

export function getItemQty(itemId: string, quantities: Record<string, number>): number {
  return quantities[itemId] ?? 1
}

export function calcTotal(
  itemIds: string[],
  quantities: Record<string, number> = {},
): number {
  return itemIds.reduce((sum, id) => {
    const item = ITEM_MAP[id]
    if (!item) return sum
    return sum + item.price * getItemQty(id, quantities)
  }, 0)
}

export function buildBindCommand(
  key: string,
  itemIds: string[],
  quantities: Record<string, number> = {},
): string {
  const buys: string[] = []
  for (const id of itemIds) {
    const item = ITEM_MAP[id]
    if (!item) continue
    const qty = getItemQty(id, quantities)
    for (let i = 0; i < qty; i++) buys.push(item.buyCommand)
  }
  if (!key || buys.length === 0) return ''
  return `bind ${key} "${buys.join('; ')}"`
}
