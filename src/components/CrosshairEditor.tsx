import {
  CROSSHAIR_COLOR_LABELS,
  CROSSHAIR_PRESETS,
  CROSSHAIR_STYLE_LABELS,
  applyCrosshairPreset,
  resolveCrosshairRgb,
  withCrosshairPatch,
  type CrosshairSettings,
} from '../data/crosshair'

interface CrosshairEditorProps {
  value: CrosshairSettings
  onChange: (next: CrosshairSettings) => void
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

function CrosshairPreview({ cfg }: { cfg: CrosshairSettings }) {
  const [r, g, b] = resolveCrosshairRgb(cfg)
  const alpha = cfg.useAlpha ? cfg.alpha / 255 : 1
  const color = `rgba(${r}, ${g}, ${b}, ${alpha})`
  const outline = cfg.outline
    ? `${Math.max(1, cfg.outlineThickness)}px solid rgba(0,0,0,0.85)`
    : 'none'

  // Approximate CS2 look in CSS (scale for preview box)
  const showArms = cfg.size > 0 && cfg.thickness > 0
  const arm = Math.max(2, cfg.size * 4)
  const thick = Math.max(1, cfg.thickness * 2)
  const gap = 2 + cfg.gap * 1.5
  const halfGap = Math.max(0, gap)
  // Pure round-dot: size of dot follows thickness (CS2-like)
  const dotPx = cfg.size <= 0
    ? Math.max(4, cfg.thickness * 5)
    : Math.max(2, thick + 1)

  const armStyle = {
    background: color,
    boxShadow: outline !== 'none' ? `0 0 0 ${cfg.outlineThickness}px #000` : undefined,
  } as const

  return (
    <div className="relative mx-auto flex h-36 w-full max-w-md items-center justify-center overflow-hidden rounded border border-[#2a3340] bg-[#0d1520]">
      <img
        src="/icons/crosshair-bg.png"
        alt=""
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />

      {showArms && (
        <>
          {/* Horizontal arms */}
          <div
            className="absolute"
            style={{
              ...armStyle,
              width: arm,
              height: thick,
              left: `calc(50% - ${arm + halfGap}px)`,
              top: `calc(50% - ${thick / 2}px)`,
            }}
          />
          <div
            className="absolute"
            style={{
              ...armStyle,
              width: arm,
              height: thick,
              left: `calc(50% + ${halfGap}px)`,
              top: `calc(50% - ${thick / 2}px)`,
            }}
          />

          {/* Vertical arms (skip top if T-style) */}
          {!cfg.tStyle && (
            <div
              className="absolute"
              style={{
                ...armStyle,
                width: thick,
                height: arm,
                left: `calc(50% - ${thick / 2}px)`,
                top: `calc(50% - ${arm + halfGap}px)`,
              }}
            />
          )}
          <div
            className="absolute"
            style={{
              ...armStyle,
              width: thick,
              height: arm,
              left: `calc(50% - ${thick / 2}px)`,
              top: `calc(50% + ${halfGap}px)`,
            }}
          />
        </>
      )}

      {cfg.dot && (
        <div
          className="absolute rounded-full"
          style={{
            width: dotPx,
            height: dotPx,
            background: color,
            boxShadow: outline !== 'none' ? `0 0 0 ${cfg.outlineThickness}px #000` : undefined,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
    </div>
  )
}

export function CrosshairEditor({ value, onChange }: CrosshairEditorProps) {
  const patch = (p: Partial<Omit<CrosshairSettings, 'presetId'>>) =>
    onChange(withCrosshairPatch(value, p))

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[10px] leading-relaxed text-[#4b5563]">
        Все параметры прицела попадут в результат одной строкой через «;»
        (cl_crosshair…). Скопируй и вставь в консоль (~) целиком.
      </p>
      <CrosshairPreview cfg={value} />

      <div>
        <p className="mb-2 text-xs text-[#9ca3af]">Пресеты</p>
        <div className="flex max-h-28 flex-wrap gap-1.5 overflow-y-auto">
          {CROSSHAIR_PRESETS.map((p) => {
            const active = value.presetId === p.id
            return (
              <button
                key={p.id}
                type="button"
                title={p.subtitle}
                onClick={() => onChange(applyCrosshairPreset(p.id))}
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
            ? 'Свой прицел — правь слайдеры ниже'
            : (CROSSHAIR_PRESETS.find((p) => p.id === value.presetId)?.subtitle ?? '')}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs text-[#9ca3af]">
          Стиль
          <select
            value={value.style}
            onChange={(e) => patch({ style: Number(e.target.value) })}
            className="rounded border border-[#2a3340] bg-[#0a0e14] px-2 py-1.5 text-xs text-white outline-none focus:border-[var(--accent)]"
          >
            {Object.entries(CROSSHAIR_STYLE_LABELS).map(([k, label]) => (
              <option key={k} value={k}>
                {k} — {label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs text-[#9ca3af]">
          Цвет
          <select
            value={value.color}
            onChange={(e) => patch({ color: Number(e.target.value) })}
            className="rounded border border-[#2a3340] bg-[#0a0e14] px-2 py-1.5 text-xs text-white outline-none focus:border-[var(--accent)]"
          >
            {Object.entries(CROSSHAIR_COLOR_LABELS).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <SliderRow
          label="Size"
          value={value.size}
          min={0}
          max={10}
          step={0.5}
          onChange={(size) => patch({ size })}
        />
        <SliderRow
          label="Gap"
          value={value.gap}
          min={-5}
          max={5}
          step={0.5}
          onChange={(gap) => patch({ gap })}
        />
        <SliderRow
          label="Thickness"
          value={value.thickness}
          min={0}
          max={5}
          step={0.5}
          onChange={(thickness) => patch({ thickness })}
        />
        <SliderRow
          label="Outline thickness"
          value={value.outlineThickness}
          min={0}
          max={3}
          step={0.5}
          onChange={(outlineThickness) => patch({ outlineThickness })}
        />
        <SliderRow
          label="Alpha"
          value={value.alpha}
          min={0}
          max={255}
          step={1}
          onChange={(alpha) => patch({ alpha })}
        />
      </div>

      {value.color === 5 && (
        <div className="grid gap-3 sm:grid-cols-3">
          <SliderRow
            label="R"
            value={value.colorR}
            min={0}
            max={255}
            step={1}
            onChange={(colorR) => patch({ colorR })}
          />
          <SliderRow
            label="G"
            value={value.colorG}
            min={0}
            max={255}
            step={1}
            onChange={(colorG) => patch({ colorG })}
          />
          <SliderRow
            label="B"
            value={value.colorB}
            min={0}
            max={255}
            step={1}
            onChange={(colorB) => patch({ colorB })}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <label className="flex cursor-pointer items-center gap-2 text-xs text-[#c4c9d1]">
          <input
            type="checkbox"
            checked={value.dot}
            onChange={() => patch({ dot: !value.dot })}
            className="accent-[var(--accent)]"
          />
          Точка (dot)
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-xs text-[#c4c9d1]">
          <input
            type="checkbox"
            checked={value.outline}
            onChange={() => patch({ outline: !value.outline })}
            className="accent-[var(--accent)]"
          />
          Обводка
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-xs text-[#c4c9d1]">
          <input
            type="checkbox"
            checked={value.tStyle}
            onChange={() => patch({ tStyle: !value.tStyle })}
            className="accent-[var(--accent)]"
          />
          T-style
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-xs text-[#c4c9d1]">
          <input
            type="checkbox"
            checked={value.useAlpha}
            onChange={() => patch({ useAlpha: !value.useAlpha })}
            className="accent-[var(--accent)]"
          />
          Использовать alpha
        </label>
      </div>

      <p className="text-[10px] leading-relaxed text-[#4b5563]">
        Пресеты про — отправная точка из публичных гайдов (значения могут отличаться от
        актуального кода в игре). Превью приблизительное.
      </p>
    </div>
  )
}
