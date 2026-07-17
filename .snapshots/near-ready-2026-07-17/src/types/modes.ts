export type ArsenalTab =
  | 'profile'
  | 'notifications'
  | 'weapons'
  | 'utilities'
  | 'unbind'

export type UtilityView = 'home' | 'detail'

/** Left arsenal column — profile & notifications live in the header. */
export const ARSENAL_TABS: { id: ArsenalTab }[] = [
  { id: 'weapons' },
  { id: 'utilities' },
  { id: 'unbind' },
]
