export type ItemCategory =
  | 'equipment'
  | 'pistols'
  | 'smgs'
  | 'midtier'
  | 'rifles'
  | 'grenades'

export interface BuyItem {
  id: string
  name: string
  buyCommand: string
  price: number
  category: ItemCategory
  quantityLabel?: string
  /** Max stackable buys (e.g. flashbang = 2) */
  maxQuantity?: number
  image: string
}

export interface HistoryEntry {
  id: string
  command: string
  key: string
  itemIds: string[]
  total: number
  createdAt: number
}
