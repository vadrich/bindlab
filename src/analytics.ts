/**
 * Yandex Metrika — pageviews / visitors.
 * Set VITE_YANDEX_METRIKA_ID in .env.local / host env (counter number only).
 */

type YmFn = ((...args: unknown[]) => void) & {
  a?: unknown[][]
  l?: number
}

declare global {
  interface Window {
    ym?: YmFn
  }
}

function parseCounterId(raw: unknown): number | null {
  if (typeof raw !== 'string' || !/^\d{5,12}$/.test(raw.trim())) return null
  const id = Number(raw.trim())
  return Number.isFinite(id) && id > 0 ? id : null
}

export function initAnalytics(): void {
  const id = parseCounterId(import.meta.env.VITE_YANDEX_METRIKA_ID)
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
