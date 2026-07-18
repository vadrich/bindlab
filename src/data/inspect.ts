/** Inspect weapon, drop, hand switch, and optional viewmodel FOV. */

export interface InspectConfig {
  includeInspect: boolean
  inspectKey: string
  includeDrop: boolean
  dropKey: string
  includeHandToggle: boolean
  handToggleKey: string
  /** Paste viewmodel_* into console / config */
  includeSettings: boolean
  viewmodelFov: number
  viewmodelOffsetX: number
  viewmodelOffsetY: number
  viewmodelOffsetZ: number
}

export const DEFAULT_INSPECT: InspectConfig = {
  includeInspect: false,
  inspectKey: 'f',
  includeDrop: false,
  dropKey: 'g',
  includeHandToggle: false,
  handToggleKey: 'capslock',
  includeSettings: false,
  viewmodelFov: 68,
  viewmodelOffsetX: 2.5,
  viewmodelOffsetY: 2,
  viewmodelOffsetZ: -2,
}

/** Recommended viewmodel (compact gun, more screen space). */
export const RECOMMENDED_VIEWMODEL = {
  viewmodelFov: 68,
  viewmodelOffsetX: 2.5,
  viewmodelOffsetY: 2,
  viewmodelOffsetZ: -2,
} as const

/** Stock CS2 viewmodel — restore when you want the factory look. */
export const DEFAULT_VIEWMODEL = {
  viewmodelFov: 60,
  viewmodelOffsetX: 1,
  viewmodelOffsetY: 1,
  viewmodelOffsetZ: -1,
} as const

export const RECOMMENDED_INSPECT: InspectConfig = {
  ...DEFAULT_INSPECT,
  includeInspect: true,
  includeDrop: true,
  includeSettings: true,
  ...RECOMMENDED_VIEWMODEL,
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

export function clampInspectViewmodel(cfg: InspectConfig): InspectConfig {
  return {
    ...cfg,
    viewmodelFov: clamp(cfg.viewmodelFov, 54, 68),
    viewmodelOffsetX: clamp(cfg.viewmodelOffsetX, -2.5, 2.5),
    viewmodelOffsetY: clamp(cfg.viewmodelOffsetY, -2, 2),
    viewmodelOffsetZ: clamp(cfg.viewmodelOffsetZ, -2, 2),
  }
}

function matchesViewmodel(
  cfg: InspectConfig,
  preset: typeof DEFAULT_VIEWMODEL | typeof RECOMMENDED_VIEWMODEL,
): boolean {
  const c = clampInspectViewmodel(cfg)
  return (
    c.viewmodelFov === preset.viewmodelFov &&
    c.viewmodelOffsetX === preset.viewmodelOffsetX &&
    c.viewmodelOffsetY === preset.viewmodelOffsetY &&
    c.viewmodelOffsetZ === preset.viewmodelOffsetZ
  )
}

function isDefaultViewmodel(cfg: InspectConfig): boolean {
  return matchesViewmodel(cfg, DEFAULT_VIEWMODEL)
}

export function isRecommendedViewmodelPreset(cfg: InspectConfig): boolean {
  return matchesViewmodel(cfg, RECOMMENDED_VIEWMODEL)
}

export function isDefaultViewmodelPreset(cfg: InspectConfig): boolean {
  return matchesViewmodel(cfg, DEFAULT_VIEWMODEL)
}

export function formatViewmodelLine(cfg: {
  viewmodelFov: number
  viewmodelOffsetX: number
  viewmodelOffsetY: number
  viewmodelOffsetZ: number
}): string {
  return [
    `viewmodel_fov ${fmt(cfg.viewmodelFov, 1)}`,
    `viewmodel_offset_x ${fmt(cfg.viewmodelOffsetX)}`,
    `viewmodel_offset_y ${fmt(cfg.viewmodelOffsetY)}`,
    `viewmodel_offset_z ${fmt(cfg.viewmodelOffsetZ)}`,
  ].join('; ')
}

export function buildInspectSettingsLines(cfg: InspectConfig): string[] {
  if (!cfg.includeSettings) return []
  const c = clampInspectViewmodel(cfg)
  if (isDefaultViewmodel(c)) {
    return [
      'viewmodel_presetpos 1',
      `viewmodel_fov ${fmt(c.viewmodelFov, 1)}`,
      `viewmodel_offset_x ${fmt(c.viewmodelOffsetX)}`,
      `viewmodel_offset_y ${fmt(c.viewmodelOffsetY)}`,
      `viewmodel_offset_z ${fmt(c.viewmodelOffsetZ)}`,
    ]
  }
  return [
    'viewmodel_presetpos 0',
    `viewmodel_fov ${fmt(c.viewmodelFov, 1)}`,
    `viewmodel_offset_x ${fmt(c.viewmodelOffsetX)}`,
    `viewmodel_offset_y ${fmt(c.viewmodelOffsetY)}`,
    `viewmodel_offset_z ${fmt(c.viewmodelOffsetZ)}`,
  ]
}

export function buildInspectBindLines(cfg: InspectConfig): string[] {
  const lines: string[] = []
  if (cfg.includeInspect) {
    lines.push(
      `bind ${sanitizeKey(cfg.inspectKey, 'f')} "+lookatweapon"`,
    )
  }
  if (cfg.includeDrop) {
    lines.push(`bind ${sanitizeKey(cfg.dropKey, 'g')} "drop"`)
  }
  if (cfg.includeHandToggle) {
    lines.push(
      `bind ${sanitizeKey(cfg.handToggleKey, 'capslock')} "switchhands"`,
    )
  }
  return lines
}
