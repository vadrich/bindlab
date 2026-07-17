/**
 * In-game style preview of CS2 viewmodel / hand position.
 * Uses a photoreal FPS plate + weapon cutout so players see how it feels in-game.
 * Axes match console: +X right, +Y farther from camera, +Z up.
 */
export function HandsPreview({
  fov,
  offsetX,
  offsetY,
  offsetZ,
  rightHand,
}: {
  fov: number
  offsetX: number
  offsetY: number
  offsetZ: number
  rightHand: boolean
}) {
  const nx = offsetX / 2.5
  const ny = offsetY / 2
  const nz = offsetZ / 2
  const nFov = (fov - 54) / (68 - 54)

  // Higher FOV / +Y → weapon appears smaller (farther)
  const scale = 1.08 - nFov * 0.22 - ny * 0.16
  const tx = nx * 36
  const ty = -nz * 24 + 4
  const mirror = rightHand ? 1 : -1

  return (
    <div className="flex flex-col gap-2">
      <div
        className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black shadow-[inset_0_0_50px_rgba(0,0,0,0.45)]"
        aria-hidden
      >
        {/* Photoreal CS2-style plate */}
        <img
          src="/previews/viewmodel-bg.jpg"
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Soft vignette like game post FX */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 42%, rgba(0,0,0,0.45) 100%)',
          }}
        />

        {/* Classic CS crosshair */}
        <div className="absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2">
          <div className="relative h-6 w-6">
            <span className="absolute left-1/2 top-0 h-2.5 w-px -translate-x-1/2 bg-[#c4f542] shadow-[0_0_4px_rgba(196,245,66,0.8)]" />
            <span className="absolute bottom-0 left-1/2 h-2.5 w-px -translate-x-1/2 bg-[#c4f542] shadow-[0_0_4px_rgba(196,245,66,0.8)]" />
            <span className="absolute left-0 top-1/2 h-px w-2.5 -translate-y-1/2 bg-[#c4f542] shadow-[0_0_4px_rgba(196,245,66,0.8)]" />
            <span className="absolute right-0 top-1/2 h-px w-2.5 -translate-y-1/2 bg-[#c4f542] shadow-[0_0_4px_rgba(196,245,66,0.8)]" />
          </div>
        </div>

        {/* Live viewmodel cutout */}
        <div
          className="absolute bottom-[-4%] z-[3] transition-transform duration-150 ease-out will-change-transform"
          style={{
            left: rightHand ? 'auto' : '-2%',
            right: rightHand ? '-2%' : 'auto',
            width: '72%',
            maxWidth: 520,
            transform: `translate(${tx * mirror}%, ${ty}%) scale(${scale}) scaleX(${mirror})`,
            transformOrigin: rightHand ? '92% 100%' : '8% 100%',
            filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.55))',
          }}
        >
          <img
            src="/previews/viewmodel-gun.png"
            alt=""
            draggable={false}
            className="h-auto w-full select-none"
          />
        </div>

        {/* Fake minimal HUD strip */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] flex items-end justify-between bg-gradient-to-t from-black/70 via-black/25 to-transparent px-3 pb-2 pt-10">
          <div className="font-mono text-[10px] leading-tight text-white/80">
            <div className="text-[9px] uppercase tracking-widest text-white/45">
              Preview · CS2 style
            </div>
            <div>
              HP <span className="text-[#c4f542]">100</span>
              <span className="mx-2 text-white/30">|</span>
              Armor <span className="text-sky-300">100</span>
            </div>
          </div>
          <div className="text-right font-mono text-[10px] text-white/75">
            <div className="text-[15px] font-bold tabular-nums text-white">
              30 <span className="text-[10px] font-normal text-white/50">/ 90</span>
            </div>
            <div className="text-[9px] uppercase tracking-wider text-white/40">
              {rightHand ? 'Right hand' : 'Left hand'}
            </div>
          </div>
        </div>

        <div className="absolute left-2 top-2 z-[4] rounded bg-black/55 px-2 py-1 font-mono text-[9px] text-[#d1d5db] backdrop-blur-sm">
          FOV {fov.toFixed(0)} · X {offsetX.toFixed(1)} · Y {offsetY.toFixed(1)} · Z{' '}
          {offsetZ.toFixed(1)}
        </div>
      </div>
    </div>
  )
}
