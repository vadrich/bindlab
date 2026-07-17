import {
  buildCrosshairCommandLines,
  DEFAULT_CROSSHAIR,
  type CrosshairSettings,
} from './crosshair'
import {
  buildInspectBindLines,
  buildHandsSettingsLines,
  DEFAULT_INSPECT,
  RECOMMENDED_INSPECT,
  type InspectConfig,
} from './inspect'
import {
  buildMouseBindLines,
  buildMouseSettingsLines,
  DEFAULT_MOUSE,
  RECOMMENDED_MOUSE,
  type MouseConfig,
} from './mouse'
import {
  buildNetDisplayCommand,
  DEFAULT_NET_DISPLAY,
  type NetDisplayConfig,
} from './netDisplay'
import {
  buildPracticeBindLines,
  buildPracticeSettingsLines,
  DEFAULT_PRACTICE,
  type PracticeConfig,
} from './practice'
import {
  buildRadarCommandLines,
  DEFAULT_RADAR,
  type RadarSettings,
} from './radar'
import {
  buildVideoLines,
  DEFAULT_VIDEO,
  RECOMMENDED_VIDEO,
  type VideoConfig,
} from './video'
import { joinConsoleCommands } from '../utils/consolePaste'
import {
  buildBuyBindCommands,
  type BuyBind,
} from '../utils/buyBinds'

export type { CrosshairSettings } from './crosshair'
export type { InspectConfig } from './inspect'
export type { HandsConfig, HandsPresetId } from './hands'
export { HANDS_PRESETS, RECOMMENDED_HANDS } from './hands'
export type { MouseConfig } from './mouse'
export type { PracticeConfig } from './practice'
export {
  buildPracticeBhopCommand,
  buildPracticeBhopLines,
} from './practice'
export type { RadarSettings } from './radar'
export type { VideoConfig } from './video'

export type UtilityId =
  | 'net_display'
  | 'performance'
  | 'network'
  | 'crosshair'
  | 'grenades'
  | 'radar'
  | 'movement'
  | 'audio'
  | 'quick'
  | 'practice'
  | 'mouse'
  | 'inspect'
  | 'map_cleanup'
  | 'chat'
  | 'video'

export type UtilityKind = 'bind' | 'settings' | 'mixed'

export interface UtilityMeta {
  id: UtilityId
  label: string
  mark: string
  icon: string
  kind: UtilityKind
  hint: string
}

/** Cards that only emit cvars (no bind key). */
export const SETTINGS_ORDER: UtilityId[] = [
  'performance',
  'network',
  'crosshair',
  'radar',
  'video',
]

/** Cards that emit binds (and mixed cards with settings + binds). */
export const BIND_ORDER: UtilityId[] = [
  'quick',
  'chat',
  'grenades',
  'movement',
  'practice',
  'mouse',
  'inspect',
  'map_cleanup',
  'audio',
  'net_display',
]

export const UTILITY_ORDER: UtilityId[] = [...SETTINGS_ORDER, ...BIND_ORDER]

/** Utilities with sliders — support reset to recommended defaults. */
export const SLIDER_UTILITIES: UtilityId[] = [
  'crosshair',
  'radar',
  'video',
  'audio',
  'mouse',
  'inspect',
]

export const UTILITY_META: Record<UtilityId, UtilityMeta> = {
  net_display: {
    id: 'net_display',
    label: 'Отображение сети',
    mark: 'NET',
    icon: '/icons/net-display.svg',
    kind: 'bind',
    hint: 'Телеметрия / cl_showfps на клавишу',
  },
  performance: {
    id: 'performance',
    label: 'Производительность',
    mark: 'FPS',
    icon: '/icons/util-performance.svg',
    kind: 'settings',
    hint: 'FPS, задержка ввода и отключение лишнего HUD — без клавиши',
  },
  network: {
    id: 'network',
    label: 'Сеть',
    mark: 'NET',
    icon: '/icons/util-network.svg',
    kind: 'settings',
    hint: 'Rate, interp, ping поиска MM и предсказание — без клавиши',
  },
  crosshair: {
    id: 'crosshair',
    label: 'Прицел',
    mark: '+',
    icon: '/icons/util-crosshair.svg',
    kind: 'settings',
    hint: 'Настройки прицела — одной строкой в консоль или autoexec',
  },
  grenades: {
    id: 'grenades',
    label: 'Гранаты',
    mark: 'HE',
    icon: '/icons/util-grenades.svg',
    kind: 'bind',
    hint: 'Гранаты и бомба: достать; выброс только для бомбы',
  },
  radar: {
    id: 'radar',
    label: 'Радар и HUD',
    mark: 'HUD',
    icon: '/icons/util-radar.svg',
    kind: 'settings',
    hint: 'Радар и safezone — одной строкой в консоль или autoexec',
  },
  movement: {
    id: 'movement',
    label: 'Прыжки',
    mark: 'JMP',
    icon: '/icons/util-movement.svg',
    kind: 'bind',
    hint: 'Прыжок на колесо и jumpthrow через autoexec (Valve отключила старые макросы)',
  },
  audio: {
    id: 'audio',
    label: 'Звук',
    mark: 'SND',
    icon: '/icons/util-audio.svg',
    kind: 'mixed',
    hint: 'Громкость, музыка, голос и рация — настройки и бинды',
  },
  mouse: {
    id: 'mouse',
    label: 'Мышь',
    mark: 'MSE',
    icon: '/icons/util-mouse.svg',
    kind: 'mixed',
    hint: 'Sensitivity, raw input и бинды смены сенсы',
  },
  inspect: {
    id: 'inspect',
    label: 'Руки / viewmodel',
    mark: 'HND',
    icon: '/icons/util-inspect.svg',
    kind: 'mixed',
    hint: 'Положение рук и оружия на экране — как в CS2',
  },
  chat: {
    id: 'chat',
    label: 'Чат',
    mark: 'SAY',
    icon: '/icons/util-chat.svg',
    kind: 'bind',
    hint: 'say / say_team, mute голоса и фильтр чата',
  },
  quick: {
    id: 'quick',
    label: 'Быстрые команды',
    mark: 'CMD',
    icon: '/icons/util-quick.svg',
    kind: 'bind',
    hint: 'clear / status / disconnect / retry и др.',
  },
  practice: {
    id: 'practice',
    label: 'Практика / офлайн',
    mark: 'PRC',
    icon: '/icons/util-practice.svg',
    kind: 'mixed',
    hint: 'Локальные матчи, боты и тренировка гранат — нужны sv_cheats',
  },
  map_cleanup: {
    id: 'map_cleanup',
    label: 'Очистка карты',
    mark: 'CLR',
    icon: '/icons/util-map-cleanup.svg',
    kind: 'bind',
    hint: 'Функция временно недоступна',
  },
  video: {
    id: 'video',
    label: 'Видео и монитор',
    mark: 'VID',
    icon: '/icons/util-video.svg',
    kind: 'settings',
    hint: 'Gamma, VSync, FSR/CMAA и эффекты — с превью яркости',
  },
}

export interface PerformanceConfig {
  fpsMax: boolean
  fpsMaxUi: boolean
  cqEnabled: boolean
  /** Hide own bullet tracers (less clutter, slight FPS) */
  drawTracersFp: boolean
  /** Engine sleep after client tick — can reduce input latency */
  lowLatencySleep: boolean
  /** Disable animated player models in menus */
  animatePlayerModels: boolean
  /** Disable freeze-cam after death */
  disableFreezecam: boolean
  /** Disable game instructor tips */
  gameInstructor: boolean
  /** Disable automatic help popups */
  autoHelp: boolean
  /** Disable on-screen help tips */
  showHelp: boolean
  /** Disable HTML MOTD on community servers */
  disableHtmlMotd: boolean
}

export interface NetworkConfig {
  updaterate: boolean
  cmdrate: boolean
  rate: boolean
  interpRatio: boolean
  /** Let engine pick min interp from ratio */
  interp: boolean
  /** Server lag compensation for hitreg */
  lagCompensation: boolean
  /** Client-side movement prediction */
  predict: boolean
  /** Max ping when searching Valve MM */
  maxSearchPing: boolean
  /** Seconds before disconnect on silent server */
  timeout: boolean
  /** Max UDP packet size (less fragmentation) */
  maxRoutable: boolean
}

/** @deprecated use CrosshairSettings — kept as alias for clarity in UtilitiesConfig */
export type CrosshairConfig = CrosshairSettings

export type GrenadeAction = 'equip' | 'throw'

export type GrenadeItemId =
  | 'flash'
  | 'smoke'
  | 'he'
  | 'decoy'
  | 'molotov'
  | 'bomb'

export interface GrenadesConfig {
  /** Bomb only: equip or drop. Grenades always equip. */
  bombAction: GrenadeAction
  /** Which items are included in the bind output */
  enabled: Record<GrenadeItemId, boolean>
  flashKey: string
  smokeKey: string
  heKey: string
  decoyKey: string
  molotovKey: string
  bombKey: string
}

export type RadarConfig = RadarSettings

export type ScrollJumpDirection = 'up' | 'down' | 'both'

export interface MovementConfig {
  includeJumpthrow: boolean
  jumpthrowKey: string
  scrollJump: boolean
  scrollJumpDirection: ScrollJumpDirection
}

export interface AudioConfig {
  includeVolume: boolean
  volume: number
  includeVoiceScale: boolean
  voiceScale: number
  includeMusicVolume: boolean
  musicVolume: number
  includeMenuMusic: boolean
  menuMusicVolume: number
  includeMvpVolume: boolean
  mvpVolume: number
  includeRoundStartVolume: boolean
  roundStartVolume: number
  includeRoundEndVolume: boolean
  roundEndVolume: number
  includeObjectiveVolume: boolean
  objectiveVolume: number
  includeTenSecWarning: boolean
  tenSecWarningVolume: number
  includeDeathCameraVolume: boolean
  deathCameraVolume: number
  headphoneEq: boolean
  muteLoseFocus: boolean
  voiceEnable: boolean
  includeVoiceKey: boolean
  voiceKey: string
  includeVoiceMuteToggle: boolean
  voiceMuteToggleKey: string
  includeVolumeUp: boolean
  volumeUpKey: string
  includeVolumeDown: boolean
  volumeDownKey: string
}

export interface QuickConfig {
  includeClear: boolean
  clearKey: string
  includeStatus: boolean
  statusKey: string
  includeDisconnect: boolean
  disconnectKey: string
  includeRetry: boolean
  retryKey: string
  includePing: boolean
  pingKey: string
  includeWriteConfig: boolean
  writeConfigKey: string
  includeExecAutoexec: boolean
  execAutoexecKey: string
  includeQuit: boolean
  quitKey: string
}

export interface ChatConfig {
  includeAll: boolean
  allKey: string
  allMessage: string
  includeTeam: boolean
  teamKey: string
  teamMessage: string
  includeVoiceMute: boolean
  voiceMuteKey: string
  includeIgnoreMsg: boolean
  ignoreMsgKey: string
}

export interface UtilitiesConfig {
  netDisplay: NetDisplayConfig
  performance: PerformanceConfig
  network: NetworkConfig
  crosshair: CrosshairConfig
  grenades: GrenadesConfig
  radar: RadarConfig
  movement: MovementConfig
  audio: AudioConfig
  mouse: MouseConfig
  inspect: InspectConfig
  quick: QuickConfig
  chat: ChatConfig
  practice: PracticeConfig
  video: VideoConfig
}

export const DEFAULT_AUDIO: AudioConfig = {
  includeVolume: false,
  volume: 0.35,
  includeVoiceScale: false,
  voiceScale: 0.7,
  includeMusicVolume: false,
  musicVolume: 0.05,
  includeMenuMusic: false,
  menuMusicVolume: 0.05,
  includeMvpVolume: false,
  mvpVolume: 0.15,
  includeRoundStartVolume: false,
  roundStartVolume: 0.2,
  includeRoundEndVolume: false,
  roundEndVolume: 0.2,
  includeObjectiveVolume: false,
  objectiveVolume: 0.3,
  includeTenSecWarning: false,
  tenSecWarningVolume: 0.3,
  includeDeathCameraVolume: false,
  deathCameraVolume: 0,
  headphoneEq: false,
  muteLoseFocus: false,
  voiceEnable: false,
  includeVoiceKey: false,
  voiceKey: 'mouse4',
  includeVoiceMuteToggle: false,
  voiceMuteToggleKey: 'f6',
  includeVolumeUp: false,
  volumeUpKey: 'kp_plus',
  includeVolumeDown: false,
  volumeDownKey: 'kp_minus',
}

/** Values used by «Reset recommended». */
export const RECOMMENDED_AUDIO: AudioConfig = {
  includeVolume: true,
  volume: 0.35,
  includeVoiceScale: true,
  voiceScale: 0.7,
  includeMusicVolume: true,
  musicVolume: 0.05,
  includeMenuMusic: true,
  menuMusicVolume: 0.05,
  includeMvpVolume: true,
  mvpVolume: 0.15,
  includeRoundStartVolume: true,
  roundStartVolume: 0.2,
  includeRoundEndVolume: true,
  roundEndVolume: 0.2,
  includeObjectiveVolume: true,
  objectiveVolume: 0.3,
  includeTenSecWarning: true,
  tenSecWarningVolume: 0.3,
  includeDeathCameraVolume: false,
  deathCameraVolume: 0,
  headphoneEq: true,
  muteLoseFocus: true,
  voiceEnable: true,
  includeVoiceKey: true,
  voiceKey: 'mouse4',
  includeVoiceMuteToggle: false,
  voiceMuteToggleKey: 'f6',
  includeVolumeUp: false,
  volumeUpKey: 'kp_plus',
  includeVolumeDown: false,
  volumeDownKey: 'kp_minus',
}

export const DEFAULT_UTILITIES_CONFIG: UtilitiesConfig = {
  netDisplay: DEFAULT_NET_DISPLAY,
  performance: {
    fpsMax: false,
    fpsMaxUi: false,
    cqEnabled: false,
    drawTracersFp: false,
    lowLatencySleep: false,
    animatePlayerModels: false,
    disableFreezecam: false,
    gameInstructor: false,
    autoHelp: false,
    showHelp: false,
    disableHtmlMotd: false,
  },
  network: {
    updaterate: false,
    cmdrate: false,
    rate: false,
    interpRatio: false,
    interp: false,
    lagCompensation: false,
    predict: false,
    maxSearchPing: false,
    timeout: false,
    maxRoutable: false,
  },
  crosshair: { ...DEFAULT_CROSSHAIR },
  grenades: {
    bombAction: 'equip',
    enabled: {
      flash: false,
      smoke: false,
      he: false,
      decoy: false,
      molotov: false,
      bomb: false,
    },
    flashKey: 'f',
    smokeKey: 'c',
    heKey: 'z',
    decoyKey: 'b',
    molotovKey: 'v',
    bombKey: 'x',
  },
  radar: { ...DEFAULT_RADAR },
  movement: {
    includeJumpthrow: false,
    jumpthrowKey: 'mouse5',
    scrollJump: false,
    scrollJumpDirection: 'down',
  },
  audio: { ...DEFAULT_AUDIO },
  mouse: { ...DEFAULT_MOUSE },
  inspect: { ...DEFAULT_INSPECT },
  quick: {
    includeClear: false,
    clearKey: 'f9',
    includeStatus: false,
    statusKey: 'f10',
    includeDisconnect: false,
    disconnectKey: 'f11',
    includeRetry: false,
    retryKey: 'f12',
    includePing: false,
    pingKey: 'o',
    includeWriteConfig: false,
    writeConfigKey: 'f7',
    includeExecAutoexec: false,
    execAutoexecKey: 'f6',
    includeQuit: false,
    quitKey: 'end',
  },
  chat: {
    includeAll: false,
    allKey: 'x',
    allMessage: 'GG',
    includeTeam: false,
    teamKey: 'z',
    teamMessage: 'Hello team',
    includeVoiceMute: false,
    voiceMuteKey: 'k',
    includeIgnoreMsg: false,
    ignoreMsgKey: 'j',
  },
  practice: { ...DEFAULT_PRACTICE },
  video: { ...DEFAULT_VIDEO },
}

export interface PartitionedCommands {
  settings: string
  binds: string
}

function sanitizeKey(key: string, fallback: string): string {
  return key.trim().toLowerCase() || fallback
}

function buildPerformanceLines(cfg: PerformanceConfig): string[] {
  const lines: string[] = []
  if (cfg.fpsMax) lines.push('fps_max 0')
  if (cfg.fpsMaxUi) lines.push('fps_max_ui 200')
  if (cfg.cqEnabled) lines.push('cq_enabled 1')
  if (cfg.drawTracersFp) lines.push('r_drawtracers_firstperson 0')
  if (cfg.lowLatencySleep) {
    lines.push('engine_low_latency_sleep_after_client_tick true')
  }
  if (cfg.animatePlayerModels) lines.push('cl_animate_player_models 0')
  if (cfg.disableFreezecam) lines.push('cl_disablefreezecam 1')
  if (cfg.gameInstructor) lines.push('gameinstructor_enable 0')
  if (cfg.autoHelp) lines.push('cl_autohelp 0')
  if (cfg.showHelp) lines.push('cl_showhelp 0')
  if (cfg.disableHtmlMotd) lines.push('cl_disablehtmlmotd 1')
  return lines
}

function buildNetworkLines(cfg: NetworkConfig): string[] {
  const lines: string[] = []
  if (cfg.updaterate) lines.push('cl_updaterate 128')
  if (cfg.cmdrate) lines.push('cl_cmdrate 128')
  if (cfg.rate) lines.push('rate 786432')
  if (cfg.interpRatio) lines.push('cl_interp_ratio 1')
  if (cfg.interp) lines.push('cl_interp 0')
  if (cfg.lagCompensation) lines.push('cl_lagcompensation 1')
  if (cfg.predict) lines.push('cl_predict 1')
  if (cfg.maxSearchPing) lines.push('mm_dedicated_search_maxping 80')
  if (cfg.timeout) lines.push('cl_timeout 60')
  if (cfg.maxRoutable) lines.push('net_maxroutable 1200')
  return lines
}

function buildCrosshairLines(
  cfg: CrosshairSettings,
  mode: 'selected' | 'enabled',
): string[] {
  if (mode === 'enabled' && !cfg.exportEnabled) return []
  return buildCrosshairCommandLines(cfg)
}

/** CS2 grenade / C4 slots (use weapon_* deprecated). */
const GRENADE_SLOTS = {
  flash: 'slot7',
  smoke: 'slot8',
  he: 'slot6',
  decoy: 'slot9',
  molotov: 'slot10',
  bomb: 'slot5',
} as const

function buildGrenadeBind(
  key: string,
  fallbackKey: string,
  item: keyof typeof GRENADE_SLOTS,
  action: GrenadeAction,
): string[] {
  const k = sanitizeKey(key, fallbackKey)
  const slot = GRENADE_SLOTS[item]
  if (action === 'equip') {
    return [`bind ${k} "${slot}"`]
  }
  // Plain bind — no aliases (CS2 often breaks +/- alias drop macros).
  return [`bind ${k} "${slot}; drop"`]
}

function buildGrenadesLines(cfg: GrenadesConfig): string[] {
  const lines: string[] = []

  if (cfg.enabled.flash) {
    lines.push(...buildGrenadeBind(cfg.flashKey, 'f', 'flash', 'equip'))
  }
  if (cfg.enabled.smoke) {
    lines.push(...buildGrenadeBind(cfg.smokeKey, 'c', 'smoke', 'equip'))
  }
  if (cfg.enabled.he) {
    lines.push(...buildGrenadeBind(cfg.heKey, 'z', 'he', 'equip'))
  }
  if (cfg.enabled.decoy) {
    lines.push(...buildGrenadeBind(cfg.decoyKey, 'b', 'decoy', 'equip'))
  }
  if (cfg.enabled.molotov) {
    lines.push(...buildGrenadeBind(cfg.molotovKey, 'v', 'molotov', 'equip'))
  }
  if (cfg.enabled.bomb) {
    lines.push(
      ...buildGrenadeBind(cfg.bombKey, 'x', 'bomb', cfg.bombAction ?? 'equip'),
    )
  }

  return lines
}

function buildRadarLines(
  cfg: RadarSettings,
  mode: 'selected' | 'enabled',
): string[] {
  if (mode === 'enabled' && !cfg.exportEnabled) return []
  return buildRadarCommandLines(cfg)
}

function buildMovementLines(cfg: MovementConfig): string[] {
  const lines: string[] = []
  // Mutually exclusive in UI; prefer jumpthrow if both somehow set
  const useJumpthrow = cfg.includeJumpthrow
  const useScroll = cfg.scrollJump && !useJumpthrow

  if (useScroll) {
    const dir = cfg.scrollJumpDirection
    if (dir === 'up' || dir === 'both') {
      lines.push('bind "mwheelup" "+jump"')
    }
    if (dir === 'down' || dir === 'both') {
      lines.push('bind "mwheeldown" "+jump"')
    }
  }

  if (useJumpthrow) {
    const k = sanitizeKey(cfg.jumpthrowKey, 'mouse5')
    // Mouse-axis jumpthrow: Valve blocks "+jump;-attack" on one key
    // (cl_allow_multi_input_binds). -jump runs on the next mouse_x move.
    // Requires a tiny mouse flick after releasing the bind key.
    lines.push(
      `alias +muteh "unbind ${k}"`,
      `alias -muteh "bind ${k} +jumpthrow"`,
      'alias revert "bind mouse_x yaw"',
      'alias combo "-jump;revert;-muteh"',
      'alias +jumpthrow "+jump"',
      'alias -jumpthrow "-attack;+muteh;bind mouse_x combo"',
      `bind ${k} +jumpthrow`,
    )
  }

  return lines
}

function formatAudioLevel(n: number, max = 2): string {
  const clamped = Math.min(max, Math.max(0, n))
  const rounded = Math.round(clamped * 100) / 100
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')
}

function buildAudioSettingsLines(cfg: AudioConfig): string[] {
  const lines: string[] = []
  if (cfg.includeVolume) lines.push(`volume ${formatAudioLevel(cfg.volume)}`)
  if (cfg.includeVoiceScale) {
    lines.push(`voice_scale ${formatAudioLevel(cfg.voiceScale)}`)
  }
  if (cfg.includeMusicVolume) {
    lines.push(`snd_musicvolume ${formatAudioLevel(cfg.musicVolume, 1)}`)
  }
  if (cfg.includeMenuMusic) {
    lines.push(`snd_menumusic_volume ${formatAudioLevel(cfg.menuMusicVolume, 1)}`)
  }
  if (cfg.includeMvpVolume) {
    lines.push(`snd_mvp_volume ${formatAudioLevel(cfg.mvpVolume, 1)}`)
  }
  if (cfg.includeRoundStartVolume) {
    lines.push(
      `snd_roundstart_volume ${formatAudioLevel(cfg.roundStartVolume, 1)}`,
    )
  }
  if (cfg.includeRoundEndVolume) {
    lines.push(`snd_roundend_volume ${formatAudioLevel(cfg.roundEndVolume, 1)}`)
  }
  if (cfg.includeObjectiveVolume) {
    lines.push(
      `snd_mapobjective_volume ${formatAudioLevel(cfg.objectiveVolume, 1)}`,
    )
  }
  if (cfg.includeTenSecWarning) {
    lines.push(
      `snd_tensecondwarning_volume ${formatAudioLevel(cfg.tenSecWarningVolume, 1)}`,
    )
  }
  if (cfg.includeDeathCameraVolume) {
    lines.push(
      `snd_deathcamera_volume ${formatAudioLevel(cfg.deathCameraVolume, 1)}`,
    )
  }
  if (cfg.headphoneEq) lines.push('snd_headphone_eq 1')
  if (cfg.muteLoseFocus) lines.push('snd_mute_losefocus 1')
  if (cfg.voiceEnable) lines.push('voice_enable 1')
  return lines
}

function buildAudioBindLines(cfg: AudioConfig): string[] {
  const lines: string[] = []
  if (cfg.includeVoiceKey) {
    lines.push(
      `bind ${sanitizeKey(cfg.voiceKey, 'mouse4')} "+voicerecord"`,
    )
  }
  if (cfg.includeVoiceMuteToggle) {
    lines.push(
      `bind ${sanitizeKey(cfg.voiceMuteToggleKey, 'f6')} "toggle voice_enable 0 1"`,
    )
  }
  if (cfg.includeVolumeUp) {
    lines.push(
      `bind ${sanitizeKey(cfg.volumeUpKey, 'kp_plus')} "incrementvar volume 0 2 0.05"`,
    )
  }
  if (cfg.includeVolumeDown) {
    lines.push(
      `bind ${sanitizeKey(cfg.volumeDownKey, 'kp_minus')} "incrementvar volume 0 2 -0.05"`,
    )
  }
  return lines
}

function buildQuickLines(cfg: QuickConfig): string[] {
  const lines: string[] = []
  if (cfg.includeClear) {
    lines.push(`bind ${sanitizeKey(cfg.clearKey, 'f9')} "clear"`)
  }
  if (cfg.includeStatus) {
    lines.push(`bind ${sanitizeKey(cfg.statusKey, 'f10')} "status"`)
  }
  if (cfg.includeDisconnect) {
    lines.push(`bind ${sanitizeKey(cfg.disconnectKey, 'f11')} "disconnect"`)
  }
  if (cfg.includeRetry) {
    lines.push(`bind ${sanitizeKey(cfg.retryKey, 'f12')} "retry"`)
  }
  if (cfg.includePing) {
    lines.push(`bind ${sanitizeKey(cfg.pingKey, 'o')} "ping"`)
  }
  if (cfg.includeWriteConfig) {
    lines.push(
      `bind ${sanitizeKey(cfg.writeConfigKey, 'f7')} "host_writeconfig"`,
    )
  }
  if (cfg.includeExecAutoexec) {
    lines.push(
      `bind ${sanitizeKey(cfg.execAutoexecKey, 'f6')} "exec autoexec.cfg"`,
    )
  }
  if (cfg.includeQuit) {
    lines.push(`bind ${sanitizeKey(cfg.quitKey, 'end')} "quit"`)
  }
  return lines
}

/** Strip characters that break cfg quotes / command chaining. */
function sanitizeChatMessage(message: string, fallback: string): string {
  const cleaned = message
    .replace(/["`;]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return cleaned || fallback
}

function buildChatLines(cfg: ChatConfig): string[] {
  const lines: string[] = []
  if (cfg.includeAll) {
    const key = sanitizeKey(cfg.allKey, 'x')
    const msg = sanitizeChatMessage(cfg.allMessage, 'GG')
    lines.push(`bind ${key} "say ${msg}"`)
  }
  if (cfg.includeTeam) {
    const key = sanitizeKey(cfg.teamKey, 'z')
    const msg = sanitizeChatMessage(cfg.teamMessage, 'Hello team')
    lines.push(`bind ${key} "say_team ${msg}"`)
  }
  if (cfg.includeVoiceMute) {
    lines.push(
      `bind ${sanitizeKey(cfg.voiceMuteKey, 'k')} "toggle voice_enable 0 1"`,
    )
  }
  if (cfg.includeIgnoreMsg) {
    lines.push(`bind ${sanitizeKey(cfg.ignoreMsgKey, 'j')} "ignoremsg"`)
  }
  return lines
}

function linesForUtility(
  id: UtilityId,
  config: UtilitiesConfig,
  sharedBindKey: string,
  /** `selected` = user chose this card to copy; `enabled` = profile / opted-in only */
  mode: 'selected' | 'enabled' = 'enabled',
): { settings: string[]; binds: string[] } {
  switch (id) {
    case 'performance':
      return { settings: buildPerformanceLines(config.performance), binds: [] }
    case 'network':
      return { settings: buildNetworkLines(config.network), binds: [] }
    case 'crosshair':
      return {
        settings: buildCrosshairLines(config.crosshair, mode),
        binds: [],
      }
    case 'radar':
      return { settings: buildRadarLines(config.radar, mode), binds: [] }
    case 'video':
      return { settings: buildVideoLines(config.video), binds: [] }
    case 'net_display': {
      const line = buildNetDisplayCommand(sharedBindKey, config.netDisplay)
      return { settings: [], binds: line ? [line] : [] }
    }
    case 'grenades':
      return { settings: [], binds: buildGrenadesLines(config.grenades) }
    case 'movement':
      return { settings: [], binds: buildMovementLines(config.movement) }
    case 'audio':
      return {
        settings: buildAudioSettingsLines(config.audio),
        binds: buildAudioBindLines(config.audio),
      }
    case 'mouse':
      return {
        settings: buildMouseSettingsLines(config.mouse),
        binds: buildMouseBindLines(config.mouse),
      }
    case 'inspect':
      return {
        settings: buildHandsSettingsLines(config.inspect),
        binds: buildInspectBindLines(config.inspect),
      }
    case 'quick':
      return { settings: [], binds: buildQuickLines(config.quick) }
    case 'chat':
      return { settings: [], binds: buildChatLines(config.chat) }
    case 'practice':
      return {
        settings: buildPracticeSettingsLines(config.practice),
        binds: buildPracticeBindLines(config.practice),
      }
    case 'map_cleanup':
      // No working public clear-decals command in CS2 matchmaking
      return { settings: [], binds: [] }
    default:
      return { settings: [], binds: [] }
  }
}

/** Join console commands so a single paste into CS2 (~) runs every line. */
export { joinConsoleCommands, toConsolePaste } from '../utils/consolePaste'

/** Split selected utilities into settings (no bind) and binds blocks. */
export function buildPartitionedUtilitiesCommands(
  selectedIds: UtilityId[],
  config: UtilitiesConfig,
  sharedBindKey: string,
): PartitionedCommands {
  const ordered = UTILITY_ORDER.filter((id) => selectedIds.includes(id))
  const settings: string[] = []
  const binds: string[] = []

  for (const id of ordered) {
    const part = linesForUtility(id, config, sharedBindKey, 'selected')
    settings.push(...part.settings)
    binds.push(...part.binds)
  }

  return {
    settings: joinConsoleCommands(settings),
    binds: joinConsoleCommands(binds),
  }
}

/** Full paste: settings first, then binds (one console-ready line). */
export function buildCombinedUtilitiesCommand(
  selectedIds: UtilityId[],
  config: UtilitiesConfig,
  sharedBindKey: string,
): string {
  const { settings, binds } = buildPartitionedUtilitiesCommands(
    selectedIds,
    config,
    sharedBindKey,
  )
  if (settings && binds) return `${settings}; ${binds}`
  return settings || binds
}

/**
 * Collect every enabled setting/bind from the full utilities config + buy bind.
 * Returns separate command strings (not yet joined) for safe chunking.
 */
export function collectProfileCommandLines(options: {
  config: UtilitiesConfig
  bindKey: string
  selectedWeaponIds: string[]
  quantities: Record<string, number>
  buyBinds?: BuyBind[]
  /** Include net_display bind (uses bindKey). */
  includeNetDisplay?: boolean
}): string[] {
  const {
    config,
    bindKey,
    buyBinds = [],
    includeNetDisplay = false,
  } = options
  const lines: string[] = []

  // Only committed buy binds — draft on the weapons tab is not part of Profile paste
  lines.push(...buildBuyBindCommands(buyBinds))

  const key = bindKey.trim() || 'c'
  for (const id of UTILITY_ORDER) {
    if (id === 'net_display' && !includeNetDisplay) continue
    const part = linesForUtility(id, config, key, 'enabled')
    lines.push(...part.settings, ...part.binds)
  }

  return lines.map((l) => l.trim()).filter(Boolean)
}

/** Enabled settings (cvars) grouped by utility — still checked in the editor. */
export function collectEnabledSettingsGroups(
  config: UtilitiesConfig,
): { id: UtilityId; lines: string[] }[] {
  const groups: { id: UtilityId; lines: string[] }[] = []
  for (const id of UTILITY_ORDER) {
    if (id === 'net_display' || id === 'map_cleanup') continue
    const part = linesForUtility(id, config, 'c', 'enabled')
    if (part.settings.length > 0) {
      groups.push({ id, lines: part.settings })
    }
  }
  return groups
}

export function utilitiesNeedSharedKey(selectedIds: UtilityId[]): boolean {
  return selectedIds.includes('net_display')
}

export function isSettingsUtility(id: UtilityId): boolean {
  return UTILITY_META[id].kind === 'settings'
}

/** Utilities that store bind keys in card config (or use shared key). */
export function utilityAcceptsBindKey(id: UtilityId): boolean {
  const kind = UTILITY_META[id].kind
  return kind === 'bind' || kind === 'mixed'
}

/** Primary key shown in the sidebar for the active utility card. */
export function readUtilityBindKey(
  config: UtilitiesConfig,
  id: UtilityId,
): string {
  switch (id) {
    case 'movement':
      return config.movement.jumpthrowKey
    case 'audio':
      if (config.audio.includeVoiceKey) return config.audio.voiceKey
      if (config.audio.includeVoiceMuteToggle) return config.audio.voiceMuteToggleKey
      if (config.audio.includeVolumeUp) return config.audio.volumeUpKey
      if (config.audio.includeVolumeDown) return config.audio.volumeDownKey
      return config.audio.voiceKey
    case 'mouse':
      if (config.mouse.includeSensLow) return config.mouse.sensLowKey
      if (config.mouse.includeSensReset) return config.mouse.sensResetKey
      return config.mouse.sensLowKey
    case 'inspect':
      if (config.inspect.includeHandToggle) return config.inspect.handToggleKey
      return config.inspect.handToggleKey
    case 'quick': {
      const q = config.quick
      if (q.includeClear) return q.clearKey
      if (q.includeStatus) return q.statusKey
      if (q.includeDisconnect) return q.disconnectKey
      if (q.includeRetry) return q.retryKey
      if (q.includePing) return q.pingKey
      if (q.includeWriteConfig) return q.writeConfigKey
      if (q.includeExecAutoexec) return q.execAutoexecKey
      if (q.includeQuit) return q.quitKey
      return q.clearKey
    }
    case 'chat':
      if (config.chat.includeAll) return config.chat.allKey
      if (config.chat.includeTeam) return config.chat.teamKey
      if (config.chat.includeVoiceMute) return config.chat.voiceMuteKey
      if (config.chat.includeIgnoreMsg) return config.chat.ignoreMsgKey
      return config.chat.allKey
    case 'grenades': {
      const g = config.grenades
      if (g.enabled.flash) return g.flashKey
      if (g.enabled.smoke) return g.smokeKey
      if (g.enabled.he) return g.heKey
      if (g.enabled.decoy) return g.decoyKey
      if (g.enabled.molotov) return g.molotovKey
      if (g.enabled.bomb) return g.bombKey
      return g.flashKey
    }
    case 'practice': {
      const p = config.practice
      if (p.includeNoclip) return p.noclipKey
      if (p.includeGod) return p.godKey
      if (p.includeRestart) return p.restartKey
      if (p.includeKill) return p.killKey
      if (p.includeRespawn) return p.respawnKey
      if (p.includeBotKick) return p.botKickKey
      if (p.includeBotAddT) return p.botAddTKey
      if (p.includeBotAddCt) return p.botAddCtKey
      if (p.includeBotPlace) return p.botPlaceKey
      if (p.includeToggleBotStop) return p.toggleBotStopKey
      if (p.includeBotMimic) return p.botMimicKey
      if (p.includeRethrow) return p.rethrowKey
      if (p.includeClearSmokes) return p.clearSmokesKey
      return p.noclipKey
    }
    case 'net_display':
    case 'map_cleanup':
      return ''
    default:
      return ''
  }
}

/**
 * Apply sidebar bind key into the active utility's key fields.
 * For cards with several binds, fills every enabled (or all) key slots.
 */
export function applyBindKeyToUtility(
  config: UtilitiesConfig,
  id: UtilityId,
  key: string,
): UtilitiesConfig {
  const k = key.trim()
  if (!k) return config

  switch (id) {
    case 'movement':
      return { ...config, movement: { ...config.movement, jumpthrowKey: k } }
    case 'audio':
      return {
        ...config,
        audio: {
          ...config.audio,
          voiceKey: k,
          voiceMuteToggleKey: k,
          volumeUpKey: k,
          volumeDownKey: k,
        },
      }
    case 'mouse':
      return {
        ...config,
        mouse: {
          ...config.mouse,
          sensLowKey: k,
          sensResetKey: k,
        },
      }
    case 'inspect':
      return {
        ...config,
        inspect: {
          ...config.inspect,
          handToggleKey: k,
        },
      }
    case 'quick':
      return {
        ...config,
        quick: {
          ...config.quick,
          clearKey: k,
          statusKey: k,
          disconnectKey: k,
          retryKey: k,
          pingKey: k,
          writeConfigKey: k,
          execAutoexecKey: k,
          quitKey: k,
        },
      }
    case 'chat':
      return {
        ...config,
        chat: {
          ...config.chat,
          allKey: k,
          teamKey: k,
          voiceMuteKey: k,
          ignoreMsgKey: k,
        },
      }
    case 'grenades':
      return {
        ...config,
        grenades: {
          ...config.grenades,
          flashKey: k,
          smokeKey: k,
          heKey: k,
          decoyKey: k,
          molotovKey: k,
          bombKey: k,
        },
      }
    case 'practice':
      return {
        ...config,
        practice: {
          ...config.practice,
          noclipKey: k,
          godKey: k,
          restartKey: k,
          botKickKey: k,
          botAddTKey: k,
          botAddCtKey: k,
          botPlaceKey: k,
          toggleBotStopKey: k,
          botMimicKey: k,
          rethrowKey: k,
          clearSmokesKey: k,
          killKey: k,
          respawnKey: k,
        },
      }
    default:
      return config
  }
}

/** Restore slider-based utility cards to recommended defaults. */
export function resetUtilityToRecommended(
  config: UtilitiesConfig,
  id: UtilityId,
): UtilitiesConfig {
  switch (id) {
    case 'audio':
      return { ...config, audio: { ...RECOMMENDED_AUDIO } }
    case 'mouse':
      return { ...config, mouse: { ...RECOMMENDED_MOUSE } }
    case 'inspect':
      return { ...config, inspect: { ...RECOMMENDED_INSPECT } }
    case 'crosshair':
      return { ...config, crosshair: { ...DEFAULT_CROSSHAIR } }
    case 'radar':
      return { ...config, radar: { ...DEFAULT_RADAR } }
    case 'video':
      return { ...config, video: { ...RECOMMENDED_VIDEO } }
    default:
      return config
  }
}
