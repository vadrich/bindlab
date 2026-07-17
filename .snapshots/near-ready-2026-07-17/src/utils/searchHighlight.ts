import type { SearchTarget } from '../data/configSearch'
import type { ArsenalTab } from '../types/modes'
import type { UtilityId } from '../data/utilities'

export const SEARCH_PULSE_MS = 2800

export function searchSpotlightClass(active: boolean): string {
  return active ? 'search-spotlight' : ''
}

export function isTabSearchHighlight(
  highlight: SearchTarget | null | undefined,
  tab: ArsenalTab,
): boolean {
  if (!highlight) return false
  if (highlight.type === 'tab') return highlight.tab === tab
  if (highlight.type === 'utility' && tab === 'utilities') return true
  return false
}

export function isUtilitySearchHighlight(
  highlight: SearchTarget | null | undefined,
  id: UtilityId,
): boolean {
  return highlight?.type === 'utility' && highlight.id === id
}

export function isUtilitiesHomeHighlight(
  highlight: SearchTarget | null | undefined,
): boolean {
  return highlight?.type === 'tab' && highlight.tab === 'utilities'
}
