import {
  RADAR_PRESETS,
  applyRadarPreset,
  withRadarPatch,
  type RadarSettings,
} from '../data/radar'

interface RadarEditorProps {
  value: RadarSettings
  onChange: (next: RadarSettings) => void
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-[#9ca3af]">
      <span className="flex justify-between gap-2">
        <span>{label}</span>
        <span className="font-mono text-[var(--accent-muted)]">{value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-[var(--accent)]"
      />
    </label>
  )
}

/** CS-style local player / teammate chevron (view direction up = 0°). */
function RadarPlayerIcon({
  size,
  color,
  rotate = 0,
}: {
  size: number
  color: string
  rotate?: number
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{
        display: 'block',
        transform: `rotate(${rotate}deg)`,
        filter: 'drop-shadow(0 0 1px #000) drop-shadow(0 1px 1px rgba(0,0,0,0.8))',
      }}
    >
      {/* Classic CS player: circle + forward wedge */}
      <circle cx="12" cy="13.5" r="5.2" fill={color} stroke="#0a0a0a" strokeWidth="1.2" />
      <path d="M12 2.2 L16.2 10.2 L12 8.6 L7.8 10.2 Z" fill={color} stroke="#0a0a0a" strokeWidth="0.9" />
    </svg>
  )
}

function RadarEnemyIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      style={{
        display: 'block',
        filter: 'drop-shadow(0 0 1px #000)',
      }}
    >
      <rect
        x="3"
        y="3"
        width="10"
        height="10"
        fill="#e11d1d"
        stroke="#1a0505"
        strokeWidth="1"
        transform="rotate(45 8 8)"
      />
    </svg>
  )
}

/** In-game CS radar (circular HUD) with live map zoom / rotate / center. */
function RadarPreview({ cfg }: { cfg: RadarSettings }) {
  const padX = Math.round((1 - cfg.safezoneX) * 56)
  const padY = Math.round((1 - cfg.safezoneY) * 44)
  const widget = Math.round(96 + (cfg.hudScale - 0.8) * 70)
  // lower cl_radar_scale = more map visible = smaller image scale
  const mapZoom = 0.72 + cfg.scale * 0.85
  const iconPx = Math.max(10, Math.round(10 + cfg.iconScale * 8))
  const enemyPx = Math.max(8, Math.round(iconPx * 0.85))

  // Map world offset when player isn't locked to center
  const mapPanX = cfg.alwaysCentered ? 0 : 22
  const mapPanY = cfg.alwaysCentered ? 0 : -16
  const viewYaw = -32
  const mapRotate = cfg.rotate ? viewYaw : 0
  const playerRotate = cfg.rotate ? 0 : -viewYaw

  // Screen positions for other players (relative to radar widget)
  const mates = [
    { x: 0.62, y: 0.28, yaw: 40 },
    { x: 0.34, y: 0.56, yaw: -20 },
  ] as const
  const enemies = [{ x: 0.7, y: 0.66 }] as const

  const playerLeft = cfg.alwaysCentered ? 50 : 50 - mapPanX * 0.55
  const playerTop = cfg.alwaysCentered ? 50 : 50 - mapPanY * 0.55

  return (
    <div className="relative mx-auto h-52 w-full max-w-md overflow-hidden rounded border border-[#2a3340] bg-[#070b10]">
      {/* First-person scene (CS dusty / warm mid) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #6a7a88 0%, #4a5a48 28%, #3a4838 55%, #2a3428 78%, #1a2018 100%)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-2/5"
        style={{
          background:
            'linear-gradient(180deg, transparent, rgba(28, 36, 22, 0.85) 40%, #141810)',
        }}
      />
      {/* Soft vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, transparent 35%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Crosshair */}
      <div className="pointer-events-none absolute left-1/2 top-[48%] h-4 w-4 -translate-x-1/2 -translate-y-1/2 opacity-80">
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#dfe6e0]" />
        <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#dfe6e0]" />
      </div>

      {cfg.showTargetId && (
        <div className="pointer-events-none absolute left-1/2 top-[38%] -translate-x-1/2 font-sans text-[11px] font-semibold tracking-wide text-[#9AE39A] [text-shadow:0_1px_2px_#000]">
          Enemy
        </div>
      )}

      {/* Circular CS radar */}
      <div
        className="absolute"
        style={{
          left: padX + 10,
          top: padY + 10,
          width: widget,
          height: widget,
        }}
      >
        {/* Outer ring / bezel */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow:
              '0 0 0 2px rgba(0,0,0,0.85), 0 0 0 3px rgba(80,90,80,0.35), 0 4px 14px rgba(0,0,0,0.65)',
            background: 'rgba(8, 12, 10, 0.92)',
          }}
        />

        {/* Clipped radar contents */}
        <div className="absolute inset-[3px] overflow-hidden rounded-full">
          <div
            className="absolute left-1/2 top-1/2"
            style={{
              width: '185%',
              height: '185%',
              transform: `translate(-50%, -50%) translate(${mapPanX}px, ${mapPanY}px) rotate(${mapRotate}deg) scale(${mapZoom})`,
            }}
          >
            <img
              src="/icons/radar-map.png"
              alt=""
              draggable={false}
              className="pointer-events-none h-full w-full object-cover"
              style={{
                // CS radar: cool grey map on dark, slightly brightened icons contrast
                filter: 'contrast(1.05) brightness(0.92) saturate(0.75)',
              }}
            />
          </div>

          {/* Inner edge darkening like game fog ring */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              boxShadow: 'inset 0 0 18px 6px rgba(0,0,0,0.55)',
              background:
                'radial-gradient(circle at center, transparent 52%, rgba(0,0,0,0.28) 100%)',
            }}
          />

          {/* Teammates */}
          {mates.map((m, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${m.x * 100}%`,
                top: `${m.y * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <RadarPlayerIcon
                size={iconPx}
                color="#3DDC5A"
                rotate={cfg.rotate ? m.yaw - viewYaw : m.yaw}
              />
            </div>
          ))}

          {/* Spotted enemies */}
          {enemies.map((e, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${e.x * 100}%`,
                top: `${e.y * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <RadarEnemyIcon size={enemyPx} />
            </div>
          ))}

          {/* Local player */}
          <div
            className="absolute z-10"
            style={{
              left: `${playerLeft}%`,
              top: `${playerTop}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <RadarPlayerIcon size={iconPx + 2} color="#F4F7F2" rotate={playerRotate} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function RadarEditor({ value, onChange }: RadarEditorProps) {
  const patch = (p: Partial<Omit<RadarSettings, 'presetId'>>) =>
    onChange(withRadarPatch(value, p))

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[10px] leading-relaxed text-[#4b5563]">
        Все параметры радара попадут в результат одной строкой через «;» —
        скопируй и вставь в консоль (~) целиком.
        Превью — круглый радар как в CS: масштаб, поворот и центр обновляются сразу.
      </p>
      <RadarPreview cfg={value} />

      <div>
        <p className="mb-2 text-xs text-[#9ca3af]">Пресеты</p>
        <div className="flex max-h-28 flex-wrap gap-1.5 overflow-y-auto">
          {RADAR_PRESETS.map((p) => {
            const active = value.presetId === p.id
            return (
              <button
                key={p.id}
                type="button"
                title={p.subtitle}
                onClick={() => onChange(applyRadarPreset(p.id))}
                className={[
                  'rounded border px-2 py-1 text-[10px] transition-colors',
                  active
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-muted)]'
                    : 'border-[#2a3340] text-[#9ca3af] hover:border-[var(--accent)]/50',
                ].join(' ')}
              >
                {p.label}
              </button>
            )
          })}
          <button
            type="button"
            disabled={value.presetId === 'custom'}
            onClick={() => onChange({ ...value, presetId: 'custom' })}
            className={[
              'rounded border px-2 py-1 text-[10px] transition-colors',
              value.presetId === 'custom'
                ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-muted)]'
                : 'border-[#2a3340] text-[#6b7280]',
            ].join(' ')}
          >
            Свой
          </button>
        </div>
        <p className="mt-1.5 text-[10px] text-[#4b5563]">
          {value.presetId === 'custom'
            ? 'Свой радар — правь слайдеры ниже'
            : (RADAR_PRESETS.find((p) => p.id === value.presetId)?.subtitle ?? '')}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <SliderRow
          label="Масштаб карты (cl_radar_scale)"
          value={value.scale}
          min={0.25}
          max={2}
          step={0.05}
          onChange={(scale) => patch({ scale })}
        />
        <SliderRow
          label="Размер радара (cl_hud_radar_scale)"
          value={value.hudScale}
          min={0.8}
          max={2}
          step={0.05}
          onChange={(hudScale) => patch({ hudScale })}
        />
        <SliderRow
          label="Иконки (cl_radar_icon_scale_min)"
          value={value.iconScale}
          min={0.4}
          max={2}
          step={0.05}
          onChange={(iconScale) => patch({ iconScale })}
        />
        <SliderRow
          label="Safezone X"
          value={value.safezoneX}
          min={0.5}
          max={1}
          step={0.05}
          onChange={(safezoneX) => patch({ safezoneX })}
        />
        <SliderRow
          label="Safezone Y"
          value={value.safezoneY}
          min={0.5}
          max={1}
          step={0.05}
          onChange={(safezoneY) => patch({ safezoneY })}
        />
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <label className="flex cursor-pointer items-center gap-2 text-xs text-[#c4c9d1]">
          <input
            type="checkbox"
            checked={value.alwaysCentered}
            onChange={() => patch({ alwaysCentered: !value.alwaysCentered })}
            className="accent-[var(--accent)]"
          />
          Всегда в центре (always_centered)
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-xs text-[#c4c9d1]">
          <input
            type="checkbox"
            checked={value.rotate}
            onChange={() => patch({ rotate: !value.rotate })}
            className="accent-[var(--accent)]"
          />
          Поворот с камерой (rotate)
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-xs text-[#c4c9d1]">
          <input
            type="checkbox"
            checked={value.showTargetId}
            onChange={() => patch({ showTargetId: !value.showTargetId })}
            className="accent-[var(--accent)]"
          />
          Имя цели (hud_showtargetid)
        </label>
      </div>

      <p className="text-[10px] leading-relaxed text-[#4b5563]">
        Меньший cl_radar_scale — больше карты на экране. Выключенный always_centered даёт
        читать края карты. Превью приблизительное.
      </p>
    </div>
  )
}
