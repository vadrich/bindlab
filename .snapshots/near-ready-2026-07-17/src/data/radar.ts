/** CS2 radar / HUD settings, presets, and console command builder. */

export interface RadarSettings {
  /** Map zoom: lower = more of the map visible (0.25–2) */
  scale: number
  /** Size of radar widget on HUD (0.8–2) */
  hudScale: number
  /** Minimum icon size on radar (0.4–2) */
  iconScale: number
  /** Keep player locked to radar center */
  alwaysCentered: boolean
  /** Rotate map with view direction */
  rotate: boolean
  /** Show player name on crosshair aim */
  showTargetId: boolean
  /** HUD safe zone X/Y (0.5–1) */
  safezoneX: number
  safezoneY: number
  presetId: string
  /** User opted in (edited) — include in profile / full export */
  exportEnabled: boolean
}

export interface RadarPreset {
  id: string
  label: string
  subtitle: string
  settings: Omit<RadarSettings, 'presetId' | 'exportEnabled'>
}

export const DEFAULT_RADAR: RadarSettings = {
  scale: 0.4,
  hudScale: 1.15,
  iconScale: 0.65,
  alwaysCentered: false,
  rotate: true,
  showTargetId: true,
  safezoneX: 0.9,
  safezoneY: 0.9,
  presetId: 'pro-zoom',
  exportEnabled: false,
}

function preset(
  id: string,
  label: string,
  subtitle: string,
  partial: Partial<Omit<RadarSettings, 'presetId' | 'exportEnabled'>>,
): RadarPreset {
  const base = { ...DEFAULT_RADAR }
  delete (base as { presetId?: string }).presetId
  delete (base as { exportEnabled?: boolean }).exportEnabled
  return {
    id,
    label,
    subtitle,
    settings: { ...base, ...partial },
  }
}

export const RADAR_PRESETS: RadarPreset[] = [
  preset('pro-zoom', 'Про (отдаленный)', 'scale 0.4 · HUD 1.15', {
    scale: 0.4,
    hudScale: 1.15,
    iconScale: 0.65,
    alwaysCentered: false,
    rotate: true,
  }),
  preset('wide', 'Максимум карты', 'scale 0.3 · HUD 1.3', {
    scale: 0.3,
    hudScale: 1.3,
    iconScale: 0.7,
    alwaysCentered: false,
    rotate: true,
  }),
  preset('north-up', 'Север сверху', 'rotate 0 · scale 0.45', {
    scale: 0.45,
    hudScale: 1.1,
    iconScale: 0.6,
    alwaysCentered: false,
    rotate: false,
  }),
  preset('default-like', 'Ближе к дефолту', 'scale 0.7 · centered', {
    scale: 0.7,
    hudScale: 1,
    iconScale: 0.6,
    alwaysCentered: true,
    rotate: true,
  }),
]

export function applyRadarPreset(id: string): RadarSettings {
  const p = RADAR_PRESETS.find((x) => x.id === id)
  if (!p) {
    return { ...DEFAULT_RADAR, presetId: 'custom', exportEnabled: true }
  }
  return { ...p.settings, presetId: id, exportEnabled: true }
}

export function withRadarPatch(
  current: RadarSettings,
  patch: Partial<Omit<RadarSettings, 'presetId' | 'exportEnabled'>>,
): RadarSettings {
  return { ...current, ...patch, presetId: 'custom', exportEnabled: true }
}

export function buildRadarCommandLines(cfg: RadarSettings): string[] {
  const fmt = (n: number) => {
    const t = Math.round(n * 100) / 100
    return Number.isInteger(t) ? String(t) : String(t)
  }

  return [
    `cl_radar_scale ${fmt(cfg.scale)}`,
    `cl_hud_radar_scale ${fmt(cfg.hudScale)}`,
    `cl_radar_icon_scale_min ${fmt(cfg.iconScale)}`,
    `cl_radar_always_centered ${cfg.alwaysCentered ? 1 : 0}`,
    `cl_radar_rotate ${cfg.rotate ? 1 : 0}`,
    `hud_showtargetid ${cfg.showTargetId ? 1 : 0}`,
    `safezonex ${fmt(cfg.safezoneX)}`,
    `safezoney ${fmt(cfg.safezoneY)}`,
  ]
}
