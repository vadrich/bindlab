export type NetDisplayMode = 'toggle' | 'advanced'

/** Ordinary press — telemetry cvars. */
export type NetDisplayPreset = 'telemetry' | 'server_graph'

/** Advanced hold — cl_showfps level while key is held. */
export type ShowFpsLevel = 1 | 2 | 3

export interface NetDisplayConfig {
  mode: NetDisplayMode
  preset: NetDisplayPreset
  showFpsLevel: ShowFpsLevel
}

export const DEFAULT_NET_DISPLAY: NetDisplayConfig = {
  mode: 'toggle',
  preset: 'telemetry',
  showFpsLevel: 1,
}

export const NET_DISPLAY_PRESET_LABELS: Record<NetDisplayPreset, string> = {
  telemetry: 'FPS + потери пакетов',
  server_graph: 'График server recv (только отдельно)',
}

export const NET_DISPLAY_PRESET_HINTS: Record<NetDisplayPreset, string> = {
  telemetry:
    'Включает HUD-телеметрию: FPS/время кадра и процент потерь/задержек пакетов. Нажатие клавиши — показать, ещё раз — скрыть.',
  server_graph:
    'График задержки команд до сервера. В CS2 с FPS/потерями вместе обычно не работает — включай отдельным биндом.',
}

export const SHOW_FPS_LEVEL_LABELS: Record<ShowFpsLevel, string> = {
  1: 'cl_showfps 1 — FPS и карта',
  2: 'cl_showfps 2 — FPS подробно (avg / min / max)',
  3: 'cl_showfps 3 — пинг, скачки, тикрейт',
}

export const SHOW_FPS_LEVEL_HINTS: Record<ShowFpsLevel, string> = {
  1: 'Крупный оверлей: текущий FPS и название карты. Простой режим, меньше цифр на экране.',
  2: 'Подробный FPS: средняя, минимальная и максимальная задержка между кадрами — видно просадки.',
  3: 'Сеть поверх FPS: пинг, его скачки и тикрейт сервера. Занимает много места по центру экрана.',
}

export const SHOW_FPS_LEVELS: ShowFpsLevel[] = [1, 2, 3]

const PRESET_CVARS: Record<NetDisplayPreset, string[]> = {
  telemetry: [
    'cl_hud_telemetry_frametime_show',
    'cl_hud_telemetry_net_misdelivery_show',
  ],
  server_graph: ['cl_hud_telemetry_serverrecvmargin_graph_show'],
}

function sanitizeKey(key: string, fallback: string): string {
  return key.trim().toLowerCase() || fallback
}

/**
 * One console line for (~).
 * toggle  — telemetry toggle bind
 * advanced — hold key to show chosen cl_showfps mode
 */
export function buildNetDisplayCommand(key: string, config: NetDisplayConfig): string {
  const k = sanitizeKey(key, config.mode === 'advanced' ? 'tab' : 'c')

  if (config.mode === 'advanced') {
    const level = config.showFpsLevel
    // Hold: one cvar per alias (safe one-line paste); release → 0
    return `alias +showfps_h "cl_showfps ${level}"; alias -showfps_h "cl_showfps 0"; bind ${k} +showfps_h`
  }

  const cvars = PRESET_CVARS[config.preset]
  if (cvars.length === 0) return ''
  const parts = cvars.map((cvar) => `toggle ${cvar} 0 2`)
  return `bind ${k} "${parts.join('; ')}"`
}
