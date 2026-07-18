export type BuyPreset = {
  id: string
  /** i18n key under messages.buyPresets */
  labelKey: 'eco' | 'force' | 'fullT' | 'fullCt' | 'awp'
  /** Suggested bind key (user can change) */
  bindKey: string
  itemIds: string[]
  quantities?: Record<string, number>
}

/** One-click loadouts for the weapons tab — easy to demo and share. */
export const BUY_PRESETS: BuyPreset[] = [
  {
    id: 'eco',
    labelKey: 'eco',
    bindKey: 'f1',
    itemIds: ['p250', 'vest'],
  },
  {
    id: 'force',
    labelKey: 'force',
    bindKey: 'f2',
    itemIds: ['ump45', 'deagle', 'vesthelm', 'smokegrenade', 'flashbang'],
  },
  {
    id: 'full-t',
    labelKey: 'fullT',
    bindKey: 'f3',
    itemIds: [
      'ak47',
      'deagle',
      'vesthelm',
      'smokegrenade',
      'flashbang',
      'hegrenade',
      'molotov',
    ],
    quantities: { flashbang: 2 },
  },
  {
    id: 'full-ct',
    labelKey: 'fullCt',
    bindKey: 'f4',
    itemIds: [
      'm4a1_silencer',
      'deagle',
      'vesthelm',
      'defuser',
      'smokegrenade',
      'flashbang',
      'hegrenade',
      'incgrenade',
    ],
    quantities: { flashbang: 2 },
  },
  {
    id: 'awp',
    labelKey: 'awp',
    bindKey: 'f5',
    itemIds: ['awp', 'deagle', 'vesthelm', 'smokegrenade', 'flashbang'],
  },
]
