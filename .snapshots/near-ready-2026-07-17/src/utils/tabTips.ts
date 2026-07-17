import type { ArsenalTab } from '../types/modes'

export type TabTipKind = ArsenalTab

const TIP_KEYS: Record<TabTipKind, string> = {
  weapons: 'cs2-tip-weapons-seen',
  utilities: 'cs2-tip-utilities-seen',
  unbind: 'cs2-tip-unbind-seen',
  profile: 'cs2-tip-profile-seen',
  notifications: 'cs2-tip-notifications-seen',
}

function readFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

function writeFlag(key: string): void {
  try {
    localStorage.setItem(key, '1')
  } catch {
    // private mode / quota
  }
}

export function hasSeenTabTip(kind: TabTipKind): boolean {
  return readFlag(TIP_KEYS[kind])
}

export function markTabTipSeen(kind: TabTipKind): void {
  writeFlag(TIP_KEYS[kind])
}

/** @deprecated use hasSeenTabTip('weapons') */
export function hasSeenWeaponsTip(): boolean {
  return hasSeenTabTip('weapons')
}

/** @deprecated use markTabTipSeen('weapons') */
export function markWeaponsTipSeen(): void {
  markTabTipSeen('weapons')
}

/** @deprecated use hasSeenTabTip('utilities') */
export function hasSeenUtilitiesTip(): boolean {
  return hasSeenTabTip('utilities')
}

/** @deprecated use markTabTipSeen('utilities') */
export function markUtilitiesTipSeen(): void {
  markTabTipSeen('utilities')
}
