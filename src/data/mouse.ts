/** Mouse sensitivity and viewmodel settings / binds. */

export interface MouseConfig {
  includeSensitivity: boolean
  sensitivity: number
  includeZoomSens: boolean
  zoomSens: number
  rawInput: boolean
  noAccel: boolean
  includeViewmodelFov: boolean
  viewmodelFov: number
  includeViewmodelOffsets: boolean
  viewmodelOffsetX: number
  viewmodelOffsetY: number
  viewmodelOffsetZ: number
  /** Bind: temporary lower sens (e.g. AWP / clutch) */
  includeSensLow: boolean
  sensLowKey: string
  sensLowValue: number
  /** Bind: restore main sensitivity */
  includeSensReset: boolean
  sensResetKey: string
}

export const DEFAULT_MOUSE: MouseConfig = {
  includeSensitivity: false,
  sensitivity: 1.25,
  includeZoomSens: false,
  zoomSens: 1,
  rawInput: false,
  noAccel: false,
  includeViewmodelFov: false,
  viewmodelFov: 68,
  includeViewmodelOffsets: false,
  viewmodelOffsetX: 1,
  viewmodelOffsetY: 1,
  viewmodelOffsetZ: -1.5,
  includeSensLow: false,
  sensLowKey: 'mouse4',
  sensLowValue: 0.8,
  includeSensReset: false,
  sensResetKey: 'mouse5',
}

/** Values used by «Reset recommended». */
export const RECOMMENDED_MOUSE: MouseConfig = {
  includeSensitivity: true,
  sensitivity: 1.25,
  includeZoomSens: true,
  zoomSens: 1,
  rawInput: false,
  noAccel: false,
  includeViewmodelFov: false,
  viewmodelFov: 68,
  includeViewmodelOffsets: false,
  viewmodelOffsetX: 1,
  viewmodelOffsetY: 1,
  viewmodelOffsetZ: -1.5,
  includeSensLow: false,
  sensLowKey: 'mouse4',
  sensLowValue: 0.8,
  includeSensReset: false,
  sensResetKey: 'mouse5',
}

function clamp(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min
  return Math.min(max, Math.max(min, n))
}

function fmt(n: number, digits = 3): string {
  const rounded = Math.round(n * 10 ** digits) / 10 ** digits
  return Number.isInteger(rounded) ? String(rounded) : String(rounded)
}

function sanitizeKey(key: string, fallback: string): string {
  return key.trim().toLowerCase() || fallback
}

export function buildMouseSettingsLines(cfg: MouseConfig): string[] {
  const lines: string[] = []
  if (cfg.includeSensitivity) {
    lines.push(`sensitivity ${fmt(clamp(cfg.sensitivity, 0.01, 10))}`)
  }
  if (cfg.includeZoomSens) {
    lines.push(
      `zoom_sensitivity_ratio ${fmt(clamp(cfg.zoomSens, 0.01, 3))}`,
    )
  }
  // m_rawinput / m_customaccel / m_mouseaccel* — removed in CS2 (OS/Steam Input)
  return lines
}

export function buildMouseBindLines(cfg: MouseConfig): string[] {
  const lines: string[] = []
  if (cfg.includeSensLow) {
    const v = fmt(clamp(cfg.sensLowValue, 0.01, 10))
    lines.push(
      `bind ${sanitizeKey(cfg.sensLowKey, 'mouse4')} "sensitivity ${v}"`,
    )
  }
  if (cfg.includeSensReset) {
    const v = fmt(clamp(cfg.sensitivity, 0.01, 10))
    lines.push(
      `bind ${sanitizeKey(cfg.sensResetKey, 'mouse5')} "sensitivity ${v}"`,
    )
  }
  return lines
}
