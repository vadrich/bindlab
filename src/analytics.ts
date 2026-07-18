/**
 * Yandex Metrika — pageviews + conversion goals.
 * Set NEXT_PUBLIC_YANDEX_METRIKA_ID in .env.local / host env (counter number only).
 * Create goals in Metrika UI: copy_bind, share_config, apply_buy_preset (type: JavaScript event).
 */

import { publicEnv } from './env'

type YmFn = ((...args: unknown[]) => void) & {
  a?: unknown[][]
  l?: number
}

declare global {
  interface Window {
    ym?: YmFn
  }
}

export type AnalyticsGoal =
  | 'copy_bind'
  | 'share_config'
  | 'apply_buy_preset'
  | 'guest_enter'
  | 'google_sign_in'

function parseCounterId(raw: unknown): number | null {
  if (typeof raw !== 'string' || !/^\d{5,12}$/.test(raw.trim())) return null
  const id = Number(raw.trim())
  return Number.isFinite(id) && id > 0 ? id : null
}

function counterId(): number | null {
  return parseCounterId(publicEnv.yandexMetrikaId())
}

export function initAnalytics(): void {
  const id = counterId()
  if (id == null || typeof window === 'undefined') return
  if (document.querySelector('script[data-ym-tag]')) return

  const ym = function (...args: unknown[]) {
    ;(ym.a = ym.a || []).push(args)
  } as YmFn
  ym.l = Date.now()
  window.ym = ym

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://mc.yandex.ru/metrika/tag.js'
  script.dataset.ymTag = String(id)
  document.head.appendChild(script)

  window.ym(id, 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  })
}

/** Fire a Metrika JavaScript goal (no-op if counter missing). */
export function trackGoal(
  goal: AnalyticsGoal,
  params?: Record<string, string | number | boolean>,
): void {
  if (typeof window === 'undefined') return
  const id = counterId()
  if (id == null || typeof window.ym !== 'function') return
  try {
    if (params) window.ym(id, 'reachGoal', goal, params)
    else window.ym(id, 'reachGoal', goal)
  } catch {
    /* ignore */
  }
}
