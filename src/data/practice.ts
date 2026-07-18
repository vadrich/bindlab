/** Local / offline / workshop practice commands and binds (need sv_cheats). */

import { joinConsoleCommands } from '../utils/consolePaste'

export interface PracticeConfig {
  // --- settings (paste once on local server) ---
  svCheats: boolean
  limitTeams: boolean
  autoTeamBalance: boolean
  roundTime: boolean
  freezeTime: boolean
  buyAnywhere: boolean
  buyTime: boolean
  maxMoney: boolean
  startMoney: boolean
  infiniteAmmo: boolean
  grenadeLimit: boolean
  flashbangLimit: boolean
  grenadeTrajectory: boolean
  grenadeTrajectoryClassic: boolean
  showImpacts: boolean
  showImpactsTime: boolean
  dropKnife: boolean
  ignoreRoundWin: boolean
  botStop: boolean
  warmupEnd: boolean

  /** Highlighted bhop pack → one console line */
  includeBhop: boolean
  bhopConnect: boolean
  bhopHost: string
  bhopEnable: boolean
  bhopAutobhop: boolean
  bhopAirAccelerate: boolean
  bhopAirAccelerateValue: number
  bhopNoStamina: boolean
  bhopMaxVelocity: boolean

  // --- binds ---
  includeNoclip: boolean
  noclipKey: string
  includeGod: boolean
  godKey: string
  includeRestart: boolean
  restartKey: string
  includeBotKick: boolean
  botKickKey: string
  includeBotAddT: boolean
  botAddTKey: string
  includeBotAddCt: boolean
  botAddCtKey: string
  includeBotPlace: boolean
  botPlaceKey: string
  includeToggleBotStop: boolean
  toggleBotStopKey: string
  includeBotMimic: boolean
  botMimicKey: string
  includeRethrow: boolean
  rethrowKey: string
  includeClearSmokes: boolean
  clearSmokesKey: string
  includeKill: boolean
  killKey: string
  includeRespawn: boolean
  respawnKey: string
}

/** Fresh card: nothing selected so the user opts in. */
export const DEFAULT_PRACTICE: PracticeConfig = {
  svCheats: false,
  limitTeams: false,
  autoTeamBalance: false,
  roundTime: false,
  freezeTime: false,
  buyAnywhere: false,
  buyTime: false,
  maxMoney: false,
  startMoney: false,
  infiniteAmmo: false,
  grenadeLimit: false,
  flashbangLimit: false,
  grenadeTrajectory: false,
  grenadeTrajectoryClassic: false,
  showImpacts: false,
  showImpactsTime: false,
  dropKnife: false,
  ignoreRoundWin: false,
  botStop: false,
  warmupEnd: false,

  includeBhop: false,
  bhopConnect: false,
  bhopHost: '',
  bhopEnable: true,
  bhopAutobhop: true,
  bhopAirAccelerate: true,
  bhopAirAccelerateValue: 150,
  bhopNoStamina: true,
  bhopMaxVelocity: true,

  includeNoclip: false,
  noclipKey: 'v',
  includeGod: false,
  godKey: 'g',
  includeRestart: false,
  restartKey: 'p',
  includeBotKick: false,
  botKickKey: 'o',
  includeBotAddT: false,
  botAddTKey: 'i',
  includeBotAddCt: false,
  botAddCtKey: 'u',
  includeBotPlace: false,
  botPlaceKey: 'n',
  includeToggleBotStop: false,
  toggleBotStopKey: 'm',
  includeBotMimic: false,
  botMimicKey: ',',
  includeRethrow: false,
  rethrowKey: 'c',
  includeClearSmokes: false,
  clearSmokesKey: '.',
  includeKill: false,
  killKey: 'k',
  includeRespawn: false,
  respawnKey: 'b',
}

function sanitizeKey(key: string, fallback: string): string {
  return key.trim().toLowerCase() || fallback
}

function clampAirAccel(n: number): number {
  if (!Number.isFinite(n)) return 150
  return Math.max(12, Math.min(2000, Math.round(n)))
}

/** Full bhop pack as separate commands (for one paste line). */
export function buildPracticeBhopLines(cfg: PracticeConfig): string[] {
  if (!cfg.includeBhop) return []
  const lines: string[] = []

  if (cfg.bhopConnect) {
    const host = cfg.bhopHost.trim()
    if (host) lines.push(`connect ${host}`)
  }

  lines.push('sv_cheats 1')

  if (cfg.bhopEnable) lines.push('sv_enablebunnyhopping 1')
  if (cfg.bhopAutobhop) lines.push('sv_autobunnyhopping 1')
  if (cfg.bhopAirAccelerate) {
    lines.push(`sv_airaccelerate ${clampAirAccel(cfg.bhopAirAccelerateValue)}`)
  }
  if (cfg.bhopNoStamina) {
    lines.push('sv_staminamax 0')
    lines.push('sv_staminajumpcost 0')
    lines.push('sv_staminalandcost 0')
  }
  if (cfg.bhopMaxVelocity) lines.push('sv_maxvelocity 7000')

  return lines
}

/** Single console-ready line for the highlighted BHOP block. */
export function buildPracticeBhopCommand(cfg: PracticeConfig): string {
  return joinConsoleCommands(buildPracticeBhopLines(cfg))
}

export function buildPracticeSettingsLines(cfg: PracticeConfig): string[] {
  const lines: string[] = []

  if (cfg.includeBhop) {
    if (cfg.bhopConnect) {
      const host = cfg.bhopHost.trim()
      if (host) lines.push(`connect ${host}`)
    }
    if (!cfg.svCheats) lines.push('sv_cheats 1')
    if (cfg.bhopEnable) lines.push('sv_enablebunnyhopping 1')
    if (cfg.bhopAutobhop) lines.push('sv_autobunnyhopping 1')
    if (cfg.bhopAirAccelerate) {
      lines.push(`sv_airaccelerate ${clampAirAccel(cfg.bhopAirAccelerateValue)}`)
    }
    if (cfg.bhopNoStamina) {
      lines.push('sv_staminamax 0')
      lines.push('sv_staminajumpcost 0')
      lines.push('sv_staminalandcost 0')
    }
    if (cfg.bhopMaxVelocity) lines.push('sv_maxvelocity 7000')
  }

  if (cfg.svCheats) lines.push('sv_cheats 1')

  if (cfg.roundTime) {
    lines.push('mp_roundtime 60')
    lines.push('mp_roundtime_defuse 60')
  }
  if (cfg.freezeTime) lines.push('mp_freezetime 0')
  if (cfg.ignoreRoundWin) lines.push('mp_ignore_round_win_conditions 1')
  if (cfg.warmupEnd) lines.push('mp_warmup_end')

  if (cfg.maxMoney) lines.push('mp_maxmoney 60000')
  if (cfg.startMoney) lines.push('mp_startmoney 60000')
  if (cfg.buyAnywhere) lines.push('mp_buy_anywhere 1')
  if (cfg.buyTime) lines.push('mp_buytime 60000')

  if (cfg.infiniteAmmo) lines.push('sv_infinite_ammo 1')
  if (cfg.grenadeLimit) lines.push('ammo_grenade_limit_total 5')
  if (cfg.flashbangLimit) lines.push('ammo_grenade_limit_flashbang 2')
  if (cfg.grenadeTrajectory) {
    lines.push('sv_grenade_trajectory_prac_pipreview 1')
  }
  // sv_grenade_trajectory — CS:GO classic; usually inactive in CS2
  if (cfg.grenadeTrajectoryClassic && !cfg.grenadeTrajectory) {
    lines.push('sv_grenade_trajectory_prac_pipreview 1')
  }

  if (cfg.showImpacts) lines.push('sv_showimpacts 1')
  if (cfg.showImpactsTime) lines.push('sv_showimpacts_time 10')

  if (cfg.limitTeams) lines.push('mp_limitteams 0')
  if (cfg.autoTeamBalance) lines.push('mp_autoteambalance 0')
  if (cfg.botStop) lines.push('bot_stop 1')

  if (cfg.dropKnife) lines.push('mp_drop_knife_enable 1')

  return lines
}

export function buildPracticeBindLines(cfg: PracticeConfig): string[] {
  const lines: string[] = []

  if (cfg.includeNoclip) {
    lines.push(`bind ${sanitizeKey(cfg.noclipKey, 'v')} "noclip"`)
  }
  if (cfg.includeGod) {
    lines.push(`bind ${sanitizeKey(cfg.godKey, 'g')} "god"`)
  }

  if (cfg.includeRestart) {
    lines.push(
      `bind ${sanitizeKey(cfg.restartKey, 'p')} "mp_restartgame 1"`,
    )
  }
  if (cfg.includeKill) {
    lines.push(`bind ${sanitizeKey(cfg.killKey, 'k')} "kill"`)
  }
  if (cfg.includeRespawn) {
    lines.push(
      `bind ${sanitizeKey(cfg.respawnKey, 'b')} "mp_respawn_on_death_ct 1; mp_respawn_on_death_t 1"`,
    )
  }

  if (cfg.includeBotKick) {
    lines.push(`bind ${sanitizeKey(cfg.botKickKey, 'o')} "bot_kick"`)
  }
  if (cfg.includeBotAddT) {
    lines.push(`bind ${sanitizeKey(cfg.botAddTKey, 'i')} "bot_add_t"`)
  }
  if (cfg.includeBotAddCt) {
    lines.push(`bind ${sanitizeKey(cfg.botAddCtKey, 'u')} "bot_add_ct"`)
  }
  if (cfg.includeBotPlace) {
    lines.push(`bind ${sanitizeKey(cfg.botPlaceKey, 'n')} "bot_place"`)
  }
  if (cfg.includeToggleBotStop) {
    lines.push(
      `bind ${sanitizeKey(cfg.toggleBotStopKey, 'm')} "toggle bot_stop 0 1"`,
    )
  }
  if (cfg.includeBotMimic) {
    lines.push(
      `bind ${sanitizeKey(cfg.botMimicKey, ',')} "toggle bot_mimic 0 1"`,
    )
  }

  if (cfg.includeRethrow) {
    lines.push(
      `bind ${sanitizeKey(cfg.rethrowKey, 'c')} "sv_rethrow_last_grenade"`,
    )
  }
  if (cfg.includeClearSmokes) {
    lines.push(
      `bind ${sanitizeKey(cfg.clearSmokesKey, '.')} "ent_fire smokegrenade_projectile kill"`,
    )
  }

  return lines
}
