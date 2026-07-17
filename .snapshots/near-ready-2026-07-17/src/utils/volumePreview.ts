/**
 * Procedural CS2-like volume previews (Web Audio).
 * Not Valve assets — short synthesized AWP / AK / jump / UI tones
 * so slider levels feel familiar without shipping game files.
 */

export type VolumePreviewKind =
  | 'awp'
  | 'ak'
  | 'jump'
  | 'voice'
  | 'music'
  | 'mvp'
  | 'round'
  | 'warning'
  | 'thud'

let sharedCtx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext
  if (!AC) return null
  if (!sharedCtx) sharedCtx = new AC()
  return sharedCtx
}

function noiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const len = Math.max(1, Math.floor(ctx.sampleRate * seconds))
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  return buf
}

/** Map CS volume (0–max) to audible gain. max=2 → 1.0 is “normal”. */
function levelToGain(level: number, max: number): number {
  if (level <= 0 || max <= 0) return 0
  const norm = Math.min(1.25, Math.max(0, level / Math.min(max, 1)))
  return Math.min(0.9, norm * 0.72)
}

function scheduleGain(
  ctx: AudioContext,
  node: AudioNode,
  gain: number,
  t0: number,
  attack: number,
  hold: number,
  release: number,
) {
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(Math.max(0.0001, gain), t0 + attack)
  g.gain.setValueAtTime(Math.max(0.0001, gain), t0 + attack + hold)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + hold + release)
  node.connect(g)
  g.connect(ctx.destination)
  return g
}

function playAwp(ctx: AudioContext, gain: number, t0: number) {
  // Deep boom + sharp crack
  const boom = ctx.createOscillator()
  boom.type = 'sine'
  boom.frequency.setValueAtTime(55, t0)
  boom.frequency.exponentialRampToValueAtTime(28, t0 + 0.35)
  scheduleGain(ctx, boom, gain * 0.95, t0, 0.004, 0.05, 0.4)
  boom.start(t0)
  boom.stop(t0 + 0.5)

  const crack = ctx.createBufferSource()
  crack.buffer = noiseBuffer(ctx, 0.12)
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 2200
  bp.Q.value = 0.7
  crack.connect(bp)
  scheduleGain(ctx, bp, gain * 0.55, t0, 0.001, 0.02, 0.1)
  crack.start(t0)
  crack.stop(t0 + 0.12)

  const body = ctx.createOscillator()
  body.type = 'triangle'
  body.frequency.setValueAtTime(180, t0)
  body.frequency.exponentialRampToValueAtTime(60, t0 + 0.15)
  scheduleGain(ctx, body, gain * 0.35, t0, 0.002, 0.03, 0.18)
  body.start(t0)
  body.stop(t0 + 0.22)
}

function playAk(ctx: AudioContext, gain: number, t0: number) {
  // Shorter, brighter rifle crack (single shot)
  const crack = ctx.createBufferSource()
  crack.buffer = noiseBuffer(ctx, 0.08)
  const hp = ctx.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 900
  crack.connect(hp)
  scheduleGain(ctx, hp, gain * 0.5, t0, 0.001, 0.015, 0.07)
  crack.start(t0)
  crack.stop(t0 + 0.08)

  const body = ctx.createOscillator()
  body.type = 'square'
  body.frequency.setValueAtTime(140, t0)
  body.frequency.exponentialRampToValueAtTime(70, t0 + 0.08)
  scheduleGain(ctx, body, gain * 0.22, t0, 0.001, 0.02, 0.08)
  body.start(t0)
  body.stop(t0 + 0.12)
}

function playJump(ctx: AudioContext, gain: number, t0: number) {
  // Soft landing / jump whoosh
  const whoosh = ctx.createBufferSource()
  whoosh.buffer = noiseBuffer(ctx, 0.18)
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.setValueAtTime(400, t0)
  bp.frequency.exponentialRampToValueAtTime(180, t0 + 0.15)
  bp.Q.value = 1.2
  whoosh.connect(bp)
  scheduleGain(ctx, bp, gain * 0.35, t0, 0.01, 0.04, 0.12)
  whoosh.start(t0)
  whoosh.stop(t0 + 0.18)

  const thump = ctx.createOscillator()
  thump.type = 'sine'
  thump.frequency.setValueAtTime(90, t0)
  thump.frequency.exponentialRampToValueAtTime(45, t0 + 0.12)
  scheduleGain(ctx, thump, gain * 0.4, t0, 0.005, 0.03, 0.12)
  thump.start(t0)
  thump.stop(t0 + 0.18)
}

function playVoice(ctx: AudioContext, gain: number, t0: number) {
  const o = ctx.createOscillator()
  o.type = 'sawtooth'
  o.frequency.setValueAtTime(220, t0)
  o.frequency.linearRampToValueAtTime(260, t0 + 0.12)
  o.frequency.linearRampToValueAtTime(200, t0 + 0.22)
  const f = ctx.createBiquadFilter()
  f.type = 'bandpass'
  f.frequency.value = 900
  f.Q.value = 2
  o.connect(f)
  scheduleGain(ctx, f, gain * 0.28, t0, 0.02, 0.12, 0.1)
  o.start(t0)
  o.stop(t0 + 0.28)
}

function playMusic(ctx: AudioContext, gain: number, t0: number) {
  const notes = [262, 330, 392]
  notes.forEach((hz, i) => {
    const o = ctx.createOscillator()
    o.type = 'sine'
    o.frequency.value = hz
    const start = t0 + i * 0.08
    scheduleGain(ctx, o, gain * 0.22, start, 0.02, 0.1, 0.15)
    o.start(start)
    o.stop(start + 0.3)
  })
}

function playMvp(ctx: AudioContext, gain: number, t0: number) {
  ;[523, 659, 784].forEach((hz, i) => {
    const o = ctx.createOscillator()
    o.type = 'triangle'
    o.frequency.value = hz
    const start = t0 + i * 0.09
    scheduleGain(ctx, o, gain * 0.3, start, 0.01, 0.12, 0.2)
    o.start(start)
    o.stop(start + 0.4)
  })
}

function playRound(ctx: AudioContext, gain: number, t0: number) {
  const o = ctx.createOscillator()
  o.type = 'square'
  o.frequency.setValueAtTime(440, t0)
  o.frequency.setValueAtTime(660, t0 + 0.12)
  scheduleGain(ctx, o, gain * 0.25, t0, 0.01, 0.2, 0.12)
  o.start(t0)
  o.stop(t0 + 0.4)
}

function playWarning(ctx: AudioContext, gain: number, t0: number) {
  for (let i = 0; i < 3; i++) {
    const o = ctx.createOscillator()
    o.type = 'square'
    o.frequency.value = 880
    const start = t0 + i * 0.14
    scheduleGain(ctx, o, gain * 0.22, start, 0.005, 0.05, 0.05)
    o.start(start)
    o.stop(start + 0.12)
  }
}

function playThud(ctx: AudioContext, gain: number, t0: number) {
  const o = ctx.createOscillator()
  o.type = 'sine'
  o.frequency.setValueAtTime(70, t0)
  o.frequency.exponentialRampToValueAtTime(30, t0 + 0.25)
  scheduleGain(ctx, o, gain * 0.45, t0, 0.01, 0.05, 0.25)
  o.start(t0)
  o.stop(t0 + 0.35)
}

/**
 * Play a short CS-flavoured cue at the given cvar level.
 * Call on slider pointer/touch release (not while dragging).
 */
export function playVolumePreview(
  kind: VolumePreviewKind,
  level: number,
  max = 1,
): void {
  const ctx = getCtx()
  if (!ctx) return
  const gain = levelToGain(level, max)
  if (gain <= 0.001) return

  void ctx.resume().then(() => {
    const t0 = ctx.currentTime + 0.01
    switch (kind) {
      case 'awp':
        playAwp(ctx, gain, t0)
        break
      case 'ak':
        playAk(ctx, gain, t0)
        break
      case 'jump':
        playJump(ctx, gain, t0)
        break
      case 'voice':
        playVoice(ctx, gain, t0)
        break
      case 'music':
        playMusic(ctx, gain, t0)
        break
      case 'mvp':
        playMvp(ctx, gain, t0)
        break
      case 'round':
        playRound(ctx, gain, t0)
        break
      case 'warning':
        playWarning(ctx, gain, t0)
        break
      case 'thud':
        playThud(ctx, gain, t0)
        break
    }
  })
}
