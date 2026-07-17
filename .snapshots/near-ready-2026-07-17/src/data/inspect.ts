/** Inspect weapon, drop, and hand switch binds. */

export interface InspectConfig {
  includeInspect: boolean
  inspectKey: string
  includeDrop: boolean
  dropKey: string
  includeHandToggle: boolean
  handToggleKey: string
}

export const DEFAULT_INSPECT: InspectConfig = {
  includeInspect: false,
  inspectKey: 'f',
  includeDrop: false,
  dropKey: 'g',
  includeHandToggle: false,
  handToggleKey: 'capslock',
}

function sanitizeKey(key: string, fallback: string): string {
  return key.trim().toLowerCase() || fallback
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
      `bind ${sanitizeKey(cfg.handToggleKey, 'capslock')} "toggle cl_righthand 0 1"`,
    )
  }
  return lines
}
