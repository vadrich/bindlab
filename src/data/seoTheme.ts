import type { SeoTopic } from './seoTopicTemplates'

/** Same palette as BindLab tabs (HomeIdlePanel TAB_COLOR). */
export const SEO_TAB_COLOR = {
  weapons: '#ff8a1f',
  utilities: '#2de8ff',
  unbind: '#ff4d5e',
  profile: '#b8f03c',
  notifications: '#d28dff',
} as const

export type SeoAccentTab = keyof typeof SEO_TAB_COLOR

/** Map SEO topic → BindLab tab color (weapons orange, utilities cyan, …). */
export function accentTabForTopic(topic: SeoTopic): SeoAccentTab {
  switch (topic) {
    case 'buy':
    case 'weapon':
    case 'economy':
      return 'weapons'
    case 'unbind':
      return 'unbind'
    case 'share':
    case 'config':
    case 'autoexec':
    case 'console':
      return 'profile'
    case 'rank':
    case 'tip':
      return 'notifications'
    case 'jumpthrow':
    case 'grenade':
    case 'crosshair':
    case 'radar':
    case 'viewmodel':
    case 'fps':
    case 'sound':
    case 'mouse':
    case 'net':
    case 'practice':
    case 'hud':
    case 'launch':
    case 'settings':
    case 'map':
    case 'mode':
    case 'general':
    default:
      return 'utilities'
  }
}

export function accentColorForTopic(topic: SeoTopic): string {
  return SEO_TAB_COLOR[accentTabForTopic(topic)]
}

export function accentLabelForTopic(topic: SeoTopic): string {
  switch (accentTabForTopic(topic)) {
    case 'weapons':
      return 'Оружие · бай-меню'
    case 'utilities':
      return 'Утилиты'
    case 'unbind':
      return 'Сброс биндов'
    case 'profile':
      return 'Профиль · конфиг'
    case 'notifications':
      return 'Советы · уведомления'
  }
}

export function withAlpha(hex: string, alpha: number): string {
  const raw = hex.replace('#', '')
  const n = parseInt(raw.length === 3 ? raw.replace(/(.)/g, '$1$1') : raw, 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r},${g},${b},${alpha})`
}
