/** Video / monitor cvars for autoexec (no bind key). */

export interface VideoConfig {
  /** r_fullscreen_gamma — works in exclusive fullscreen */
  includeGamma: boolean
  gamma: number

  /** Keep rendering when window loses focus */
  noFocusSleep: boolean

  /** Multi-threaded materials */
  matQueueMode: boolean

  /** Disable CMAA anti-aliasing (sharper, often more FPS) */
  disableCmaa: boolean

  /** Disable FSR upscaling — native sharpness */
  disableFsr: boolean

  /** Reduce particle density / draw */
  reduceParticles: boolean

  /** Disable ragdolls */
  disableRagdolls: boolean

  /** Hide engine build watermark */
  hideBuildInfo: boolean

  /** Disable depth of field */
  disableDof: boolean

  /** Disable SSAO / ambient occlusion if available */
  disableSsao: boolean

  /** Disable animated Steam avatars in UI */
  disableAnimatedAvatars: boolean

  /** Disable wait-for-vertical-sync via known cvar when present */
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
  matQueueMode: true,
  disableCmaa: true,
  disableFsr: true,
  reduceParticles: false,
  disableRagdolls: true,
  hideBuildInfo: true,
  disableDof: true,
  disableSsao: true,
  disableAnimatedAvatars: true,
  disableVsync: true,
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
  if (cfg.matQueueMode) lines.push('mat_queue_mode 2')
  if (cfg.disableCmaa) lines.push('r_csgo_cmaa_enable 0')
  if (cfg.disableFsr) {
    lines.push('r_csgo_fsr_enable 0')
    lines.push('r_csgo_fsr_upscale 0')
  }
  if (cfg.reduceParticles) {
    lines.push('r_drawparticles 0')
    lines.push('cl_particle_fallback_base 0')
    lines.push('cl_particle_fallback_multiplier 0')
  }
  if (cfg.disableRagdolls) {
    lines.push('cl_ragdoll_limit 0')
    lines.push('cl_disable_ragdolls 1')
  }
  if (cfg.hideBuildInfo) lines.push('r_show_build_info 0')
  if (cfg.disableDof) lines.push('r_dof_enable 0')
  if (cfg.disableSsao) lines.push('r_ssao 0')
  if (cfg.disableAnimatedAvatars) lines.push('cl_allow_animated_avatars 0')
  if (cfg.disableVsync) lines.push('mat_vsync 0')
  return lines
}
