/** CS2 crosshair settings, pro presets, and console command builder. */

export interface CrosshairSettings {
  style: number
  size: number
  gap: number
  thickness: number
  dot: boolean
  outline: boolean
  outlineThickness: number
  /** 0 red … 4 cyan, 5 custom RGB */
  color: number
  colorR: number
  colorG: number
  colorB: number
  alpha: number
  useAlpha: boolean
  tStyle: boolean
  /** Active preset id, or `custom` after manual edits */
  presetId: string
  /** User opted in (edited) — include in profile / full export */
  exportEnabled: boolean
}

export interface CrosshairPreset {
  id: string
  label: string
  subtitle: string
  settings: Omit<CrosshairSettings, 'presetId' | 'exportEnabled'>
}

export const CROSSHAIR_COLOR_LABELS: Record<number, string> = {
  0: 'Красный',
  1: 'Зелёный',
  2: 'Жёлтый',
  3: 'Синий',
  4: 'Голубой',
  5: 'Свой RGB',
}

export const CROSSHAIR_STYLE_LABELS: Record<number, string> = {
  0: 'Default',
  1: 'Default dynamic',
  2: 'Classic',
  3: 'Classic dynamic',
  4: 'Classic static',
  5: 'Legacy',
}

/** Named colors for color 0–4 preview */
export const CROSSHAIR_PRESET_RGB: Record<number, [number, number, number]> = {
  0: [255, 0, 0],
  1: [0, 255, 0],
  2: [255, 255, 0],
  3: [0, 0, 255],
  4: [0, 255, 255],
}

export const DEFAULT_CROSSHAIR: CrosshairSettings = {
  style: 4,
  size: 2,
  gap: -2,
  thickness: 0.5,
  dot: false,
  outline: true,
  outlineThickness: 1,
  color: 1,
  colorR: 50,
  colorG: 250,
  colorB: 50,
  alpha: 255,
  useAlpha: true,
  tStyle: false,
  presetId: 'meta-green',
  exportEnabled: false,
}

function preset(
  id: string,
  label: string,
  subtitle: string,
  partial: Partial<Omit<CrosshairSettings, 'presetId' | 'exportEnabled'>>,
): CrosshairPreset {
  const base = { ...DEFAULT_CROSSHAIR }
  delete (base as { presetId?: string }).presetId
  delete (base as { exportEnabled?: boolean }).exportEnabled
  return {
    id,
    label,
    subtitle,
    settings: { ...base, ...partial },
  }
}

/**
 * Built-in packs: style starters + pro-inspired values from public guides
 * (SensConvert / common 2025–2026 pro meta — approximate, for starting points).
 */
export const CROSSHAIR_PRESETS: CrosshairPreset[] = [
  preset('meta-green', 'Meta Green', 'Статика · зелёный · gap -3', {
    style: 4,
    size: 2,
    gap: -3,
    thickness: 0.5,
    color: 1,
    outline: false,
    dot: false,
  }),
  preset('meta-cyan', 'Meta Cyan', 'Статика · голубой · компакт', {
    style: 4,
    size: 1.5,
    gap: -3,
    thickness: 0.5,
    color: 4,
    outline: false,
    dot: false,
  }),
  preset('dot', 'Круглая точка', 'Только точка · без линий (size 0)', {
    style: 4,
    size: 0,
    gap: 0,
    thickness: 1,
    color: 1,
    outline: true,
    outlineThickness: 1,
    dot: true,
    tStyle: false,
  }),
  preset('thick-outline', 'Thick + Outline', 'Видимость на светлых стенах', {
    style: 4,
    size: 2,
    gap: -2,
    thickness: 1,
    color: 1,
    outline: true,
    outlineThickness: 1,
    dot: false,
  }),
  preset('classic-wide', 'Classic Wide', 'Шире · для новичков', {
    style: 4,
    size: 3,
    gap: 0,
    thickness: 1,
    color: 1,
    outline: true,
    dot: false,
  }),
  preset('t-style', 'T-Style', 'Без верхней линии', {
    style: 4,
    size: 2,
    gap: -2,
    thickness: 0.5,
    color: 4,
    outline: false,
    tStyle: true,
    dot: false,
  }),
  preset('white', 'White', 'Белый RGB', {
    style: 4,
    size: 2,
    gap: -3,
    thickness: 0.5,
    color: 5,
    colorR: 255,
    colorG: 255,
    colorB: 255,
    outline: false,
    dot: false,
  }),
  // Pro-inspired (console values from public write-ups)
  preset('niko', 'NiKo', 'size 2 · gap -1 · yellow', {
    style: 4,
    size: 2,
    gap: -1,
    thickness: 0.5,
    color: 2,
    outline: false,
    dot: false,
  }),
  preset('s1mple', 's1mple', 'size 3 · gap -2 · yellow', {
    style: 4,
    size: 3,
    gap: -2,
    thickness: 1,
    color: 2,
    outline: false,
    dot: false,
  }),
  preset('zywoo', 'ZywOo', 'size 2.5 · cyan', {
    style: 4,
    size: 2.5,
    gap: -1,
    thickness: 0.5,
    color: 4,
    outline: false,
    dot: false,
  }),
  preset('donk', 'donk-style', 'Маленький · белый', {
    style: 4,
    size: 1.5,
    gap: -3,
    thickness: 0.5,
    color: 5,
    colorR: 255,
    colorG: 255,
    colorB: 255,
    outline: false,
    dot: false,
  }),
  preset('m0nesy', 'm0NESY-style', 'size 1.5 · green · gap -3', {
    style: 4,
    size: 1.5,
    gap: -3,
    thickness: 0.5,
    color: 1,
    outline: false,
    dot: false,
  }),
]

export function applyCrosshairPreset(id: string): CrosshairSettings {
  const found = CROSSHAIR_PRESETS.find((p) => p.id === id)
  if (!found) {
    return { ...DEFAULT_CROSSHAIR, presetId: 'custom', exportEnabled: true }
  }
  return { ...found.settings, presetId: id, exportEnabled: true }
}

export function withCrosshairPatch(
  current: CrosshairSettings,
  patch: Partial<Omit<CrosshairSettings, 'presetId' | 'exportEnabled'>>,
): CrosshairSettings {
  return { ...current, ...patch, presetId: 'custom', exportEnabled: true }
}

export function resolveCrosshairRgb(cfg: CrosshairSettings): [number, number, number] {
  if (cfg.color === 5) return [cfg.colorR, cfg.colorG, cfg.colorB]
  return CROSSHAIR_PRESET_RGB[cfg.color] ?? [0, 255, 0]
}

export function buildCrosshairCommandLines(cfg: CrosshairSettings): string[] {
  const lines = [
    `cl_crosshairstyle ${cfg.style}`,
    `cl_crosshairsize ${cfg.size}`,
    `cl_crosshairgap ${cfg.gap}`,
    `cl_crosshairthickness ${cfg.thickness}`,
    `cl_crosshairdot ${cfg.dot ? 1 : 0}`,
    `cl_crosshair_drawoutline ${cfg.outline ? 1 : 0}`,
    `cl_crosshair_outlinethickness ${cfg.outlineThickness}`,
    `cl_crosshaircolor ${cfg.color}`,
    `cl_crosshairusealpha ${cfg.useAlpha ? 1 : 0}`,
    `cl_crosshairalpha ${cfg.alpha}`,
    `cl_crosshair_t ${cfg.tStyle ? 1 : 0}`,
  ]
  if (cfg.color === 5) {
    lines.push(`cl_crosshaircolor_r ${cfg.colorR}`)
    lines.push(`cl_crosshaircolor_g ${cfg.colorG}`)
    lines.push(`cl_crosshaircolor_b ${cfg.colorB}`)
  }
  return lines
}
