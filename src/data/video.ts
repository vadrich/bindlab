/** Video / monitor cvars for autoexec (no bind key). */

export interface VideoConfig {
  /** r_fullscreen_gamma — works in exclusive fullscreen */
  includeGamma: boolean
  gamma: number

  /** Keep rendering when window loses focus */
  noFocusSleep: boolean

  /** @deprecated Source 1 leftover — not emitted */
  matQueueMode: boolean

  /** @deprecated development-only in CS2 — not emitted */
  disableCmaa: boolean

  /** @deprecated removed / hidden in CS2 — not emitted */
  disableFsr: boolean

  /** @deprecated cheat/hidden particle cvars — not emitted */
  reduceParticles: boolean

  /** Lower ragdoll count (public cvar) */
  disableRagdolls: boolean

  /** Hide engine build watermark */
  hideBuildInfo: boolean

  /** @deprecated removed in CS2 — not emitted */
  disableDof: boolean

  /** @deprecated development-only — not emitted */
  disableSsao: boolean

  /** Disable animated Steam avatars in UI */
  disableAnimatedAvatars: boolean

  /** @deprecated mat_vsync removed — use in-game video settings */
  disableVsync: boolean
}

export const DEFAULT_VIDEO: VideoConfig = {
  includeGamma: false,
  gamma: 2.0,
  noFocusSleep: false,
  matQueueMode: false,
  disableCmaa: false,
  disableFsr: false,
  reduceParticles: false,
  disableRagdolls: false,
  hideBuildInfo: false,
  disableDof: false,
  disableSsao: false,
  disableAnimatedAvatars: false,
  disableVsync: false,
}

/** Values used by «Reset recommended». */
export const RECOMMENDED_VIDEO: VideoConfig = {
  includeGamma: true,
  gamma: 2.0,
  noFocusSleep: true,
  matQueueMode: false,
  disableCmaa: false,
  disableFsr: false,
  reduceParticles: false,
  disableRagdolls: true,
  hideBuildInfo: true,
  disableDof: false,
  disableSsao: false,
  disableAnimatedAvatars: true,
  disableVsync: false,
}

export function clampGamma(n: number): number {
  if (!Number.isFinite(n)) return 2.2
  return Math.max(1.4, Math.min(2.8, Math.round(n * 100) / 100))
}

/** Map CS2 gamma to CSS brightness for preview (lower gamma → brighter). */
export function gammaToPreviewBrightness(gamma: number): number {
  const g = clampGamma(gamma)
  return Math.max(0.7, Math.min(1.45, 2.2 / g))
}

export function buildVideoLines(cfg: VideoConfig): string[] {
  const lines: string[] = []
  if (cfg.includeGamma) {
    lines.push(`r_fullscreen_gamma ${clampGamma(cfg.gamma)}`)
  }
  if (cfg.noFocusSleep) lines.push('engine_no_focus_sleep 0')
  if (cfg.disableRagdolls) {
    lines.push('cl_ragdoll_limit 0')
  }
  if (cfg.hideBuildInfo) lines.push('r_show_build_info 0')
  if (cfg.disableAnimatedAvatars) lines.push('cl_allow_animated_avatars 0')
  return lines
}
