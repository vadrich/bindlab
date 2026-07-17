/** CS2 hand / viewmodel position settings and binds. */

export interface HandsConfig {
  /** Paste viewmodel_* + cl_righthand into console / config */
  includeSettings: boolean
  viewmodelFov: number
  viewmodelOffsetX: number
  viewmodelOffsetY: number
  viewmodelOffsetZ: number
  /** cl_righthand 1 = right hand, 0 = left */
  rightHand: boolean
  includeHandToggle: boolean
  handToggleKey: string
}

export const DEFAULT_HANDS: HandsConfig = {
  includeSettings: false,
  viewmodelFov: 68,
  viewmodelOffsetX: 2.5,
  viewmodelOffsetY: 0,
  viewmodelOffsetZ: -1.5,
  rightHand: true,
  includeHandToggle: false,
  handToggleKey: 'h',
}

/** Popular pro-style viewmodel (screen space). */
export const RECOMMENDED_HANDS: HandsConfig = {
  includeSettings: true,
  viewmodelFov: 68,
  viewmodelOffsetX: 2.5,
  viewmodelOffsetY: 0,
  viewmodelOffsetZ: -1.5,
  rightHand: true,
  includeHandToggle: false,
  handToggleKey: 'h',
}

export type HandsPresetId = 'pro' | 'center' | 'classic' | 'close'

export const HANDS_PRESETS: Record<
  HandsPresetId,
  Pick<
    HandsConfig,
    'viewmodelFov' | 'viewmodelOffsetX' | 'viewmodelOffsetY' | 'viewmodelOffsetZ'
  >
> = {
  /** Common among pros — gun lower-right, more vision */
  pro: {
    viewmodelFov: 68,
    viewmodelOffsetX: 2.5,
    viewmodelOffsetY: 0,
    viewmodelOffsetZ: -1.5,
  },
  /** Balanced / closer to screen center */
  center: {
    viewmodelFov: 60,
    viewmodelOffsetX: 0,
    viewmodelOffsetY: 0,
    viewmodelOffsetZ: 0,
  },
  /** Classic CS feel — closer, more gun */
  classic: {
    viewmodelFov: 54,
    viewmodelOffsetX: 1,
    viewmodelOffsetY: 1,
    viewmodelOffsetZ: -1,
  },
  /** Hands closer to camera */
  close: {
    viewmodelFov: 54,
    viewmodelOffsetX: 2,
    viewmodelOffsetY: -2,
    viewmodelOffsetZ: -2,
  },
}

function clamp(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min
  return Math.min(max, Math.max(min, n))
}

function fmt(n: number, digits = 2): string {
  const rounded = Math.round(n * 10 ** digits) / 10 ** digits
  return Number.isInteger(rounded) ? String(rounded) : String(rounded)
}

function sanitizeKey(key: string, fallback: string): string {
  return key.trim().toLowerCase() || fallback
}

export function clampHands(cfg: HandsConfig): HandsConfig {
  return {
    ...cfg,
    viewmodelFov: clamp(cfg.viewmodelFov, 54, 68),
    viewmodelOffsetX: clamp(cfg.viewmodelOffsetX, -2.5, 2.5),
    viewmodelOffsetY: clamp(cfg.viewmodelOffsetY, -2, 2),
    viewmodelOffsetZ: clamp(cfg.viewmodelOffsetZ, -2, 2),
  }
}

export function buildHandsSettingsLines(cfg: HandsConfig): string[] {
  if (!cfg.includeSettings) return []
  const c = clampHands(cfg)
  return [
    // Keep custom offsets after restart
    'viewmodel_presetpos 0',
    `viewmodel_fov ${fmt(c.viewmodelFov, 1)}`,
    `viewmodel_offset_x ${fmt(c.viewmodelOffsetX)}`,
    `viewmodel_offset_y ${fmt(c.viewmodelOffsetY)}`,
    `viewmodel_offset_z ${fmt(c.viewmodelOffsetZ)}`,
    `cl_righthand ${c.rightHand ? 1 : 0}`,
  ]
}

export function buildHandsBindLines(cfg: HandsConfig): string[] {
  const lines: string[] = []
  if (cfg.includeHandToggle) {
    lines.push(
      `bind ${sanitizeKey(cfg.handToggleKey, 'h')} "toggle cl_righthand 0 1"`,
    )
  }
  return lines
}
