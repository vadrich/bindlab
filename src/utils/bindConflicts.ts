import type { UtilitiesConfig, UtilityId } from '../data/utilities'
import type { BuyBind } from './buyBinds'
import { formatBuyLoadout } from './buyBinds'

/** One enabled bind that would be emitted into the console. */
export interface BindAssignment {
  /** Normalized CS2 key name (lowercase). */
  key: string
  /** Where the bind comes from. */
  source: 'buy' | UtilityId
  /** Stable id for i18n label, e.g. `inspect.drop`. */
  actionId: string
  /** Optional human label (e.g. weapon list for buy binds). */
  detail?: string
}

export interface KeyConflict {
  key: string
  assignments: BindAssignment[]
}

function normKey(key: string): string {
  return key.trim().toLowerCase()
}

function push(
  out: BindAssignment[],
  key: string,
  source: BindAssignment['source'],
  actionId: string,
  detail?: string,
): void {
  const k = normKey(key)
  if (!k) return
  out.push({ key: k, source, actionId, detail })
}

/**
 * Collect every bind the user currently has enabled in the app
 * (checked utility options + saved buy binds).
 * Buy draft is ignored until Copy — duplicate buy keys are reported then.
 */
export function collectActiveBinds(
  config: UtilitiesConfig,
  options: {
    bindKey: string
    selectedWeaponIds: string[]
    utilitySelectedIds: UtilityId[]
    buyBinds?: BuyBind[]
    quantities?: Record<string, number>
  },
): BindAssignment[] {
  const out: BindAssignment[] = []
  const { bindKey, utilitySelectedIds, buyBinds = [] } = options

  for (const b of buyBinds) {
    push(out, b.key, 'buy', `buy.${b.id}`, formatBuyLoadout(b) || undefined)
  }

  // Shared sidebar key for net_display only (buy draft is not a conflict until Copy)
  if (utilitySelectedIds.includes('net_display') && normKey(bindKey)) {
    push(out, bindKey, 'net_display', 'net_display')
  }

  const g = config.grenades
  if (g.enabled.flash) push(out, g.flashKey, 'grenades', 'grenades.flash')
  if (g.enabled.smoke) push(out, g.smokeKey, 'grenades', 'grenades.smoke')
  if (g.enabled.he) push(out, g.heKey, 'grenades', 'grenades.he')
  if (g.enabled.decoy) push(out, g.decoyKey, 'grenades', 'grenades.decoy')
  if (g.enabled.molotov) push(out, g.molotovKey, 'grenades', 'grenades.molotov')
  if (g.enabled.bomb) push(out, g.bombKey, 'grenades', 'grenades.bomb')

  const mv = config.movement
  if (mv.includeJumpthrow) {
    push(out, mv.jumpthrowKey, 'movement', 'movement.jumpthrow')
  } else if (mv.scrollJump) {
    const dir = mv.scrollJumpDirection
    if (dir === 'up' || dir === 'both') {
      push(out, 'mwheelup', 'movement', 'movement.scroll_up')
    }
    if (dir === 'down' || dir === 'both') {
      push(out, 'mwheeldown', 'movement', 'movement.scroll_down')
    }
  }

  const a = config.audio
  if (a.includeVoiceKey) push(out, a.voiceKey, 'audio', 'audio.voice')
  if (a.includeVoiceMuteToggle) {
    push(out, a.voiceMuteToggleKey, 'audio', 'audio.voice_mute_toggle')
  }
  if (a.includeVolumeUp) push(out, a.volumeUpKey, 'audio', 'audio.volume_up')
  if (a.includeVolumeDown) {
    push(out, a.volumeDownKey, 'audio', 'audio.volume_down')
  }

  const mouse = config.mouse
  if (mouse.includeSensLow) push(out, mouse.sensLowKey, 'mouse', 'mouse.sens_low')
  if (mouse.includeSensReset) {
    push(out, mouse.sensResetKey, 'mouse', 'mouse.sens_reset')
  }

  const insp = config.inspect
  if (insp.includeInspect) push(out, insp.inspectKey, 'inspect', 'inspect.inspect')
  if (insp.includeDrop) push(out, insp.dropKey, 'inspect', 'inspect.drop')
  if (insp.includeHandToggle) {
    push(out, insp.handToggleKey, 'inspect', 'inspect.hand_toggle')
  }

  const q = config.quick
  if (q.includeClear) push(out, q.clearKey, 'quick', 'quick.clear')
  if (q.includeStatus) push(out, q.statusKey, 'quick', 'quick.status')
  if (q.includeDisconnect) {
    push(out, q.disconnectKey, 'quick', 'quick.disconnect')
  }
  if (q.includeRetry) push(out, q.retryKey, 'quick', 'quick.retry')
  if (q.includePing) push(out, q.pingKey, 'quick', 'quick.ping')
  if (q.includeWriteConfig) {
    push(out, q.writeConfigKey, 'quick', 'quick.write_config')
  }
  if (q.includeExecAutoexec) {
    push(out, q.execAutoexecKey, 'quick', 'quick.exec_autoexec')
  }
  if (q.includeQuit) push(out, q.quitKey, 'quick', 'quick.quit')

  const chat = config.chat
  if (chat.includeAll) push(out, chat.allKey, 'chat', 'chat.all')
  if (chat.includeTeam) push(out, chat.teamKey, 'chat', 'chat.team')
  if (chat.includeVoiceMute) {
    push(out, chat.voiceMuteKey, 'chat', 'chat.voice_mute')
  }
  if (chat.includeIgnoreMsg) {
    push(out, chat.ignoreMsgKey, 'chat', 'chat.ignore_msg')
  }

  const p = config.practice
  if (p.includeNoclip) push(out, p.noclipKey, 'practice', 'practice.noclip')
  if (p.includeGod) push(out, p.godKey, 'practice', 'practice.god')
  if (p.includeRestart) push(out, p.restartKey, 'practice', 'practice.restart')
  if (p.includeKill) push(out, p.killKey, 'practice', 'practice.kill')
  if (p.includeRespawn) push(out, p.respawnKey, 'practice', 'practice.respawn')
  if (p.includeBotKick) push(out, p.botKickKey, 'practice', 'practice.bot_kick')
  if (p.includeBotAddT) push(out, p.botAddTKey, 'practice', 'practice.bot_add_t')
  if (p.includeBotAddCt) {
    push(out, p.botAddCtKey, 'practice', 'practice.bot_add_ct')
  }
  if (p.includeBotPlace) push(out, p.botPlaceKey, 'practice', 'practice.bot_place')
  if (p.includeToggleBotStop) {
    push(out, p.toggleBotStopKey, 'practice', 'practice.toggle_bot_stop')
  }
  if (p.includeBotMimic) push(out, p.botMimicKey, 'practice', 'practice.bot_mimic')
  if (p.includeRethrow) push(out, p.rethrowKey, 'practice', 'practice.rethrow')
  if (p.includeClearSmokes) {
    push(out, p.clearSmokesKey, 'practice', 'practice.clear_smokes')
  }

  return out
}

/** Keys that have 2+ different binds assigned. */
export function findKeyConflicts(assignments: BindAssignment[]): KeyConflict[] {
  const byKey = new Map<string, BindAssignment[]>()
  for (const a of assignments) {
    const list = byKey.get(a.key)
    if (list) list.push(a)
    else byKey.set(a.key, [a])
  }

  const conflicts: KeyConflict[] = []
  for (const [key, list] of byKey) {
    // Same key with 2+ assignments = conflict (even same action duplicated)
    const unique = new Map<string, BindAssignment>()
    for (const a of list) {
      unique.set(`${a.source}:${a.actionId}`, a)
    }
    if (unique.size >= 2) {
      conflicts.push({ key, assignments: [...unique.values()] })
    }
  }

  conflicts.sort((a, b) => a.key.localeCompare(b.key))
  return conflicts
}

export function countConflicts(
  config: UtilitiesConfig,
  options: {
    bindKey: string
    selectedWeaponIds: string[]
    utilitySelectedIds: UtilityId[]
    buyBinds?: BuyBind[]
    quantities?: Record<string, number>
  },
): number {
  return findKeyConflicts(collectActiveBinds(config, options)).length
}
