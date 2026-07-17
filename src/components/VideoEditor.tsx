import {
  clampGamma,
  gammaToPreviewBrightness,
  type VideoConfig,
} from '../data/video'
import { useMessages } from '../i18n/I18nProvider'

interface VideoEditorProps {
  value: VideoConfig
  onChange: (next: VideoConfig) => void
}

function patch(value: VideoConfig, next: Partial<VideoConfig>): VideoConfig {
  return { ...value, ...next }
}

function SliderRow({
  label,
  hint,
  value,
  min,
  max,
  step,
  display,
  brighter,
  darker,
  onChange,
}: {
  label: string
  hint: string
  value: number
  min: number
  max: number
  step: number
  display: string
  brighter: string
  darker: string
  onChange: (v: number) => void
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-[#9ca3af]">
      <span className="flex justify-between gap-2">
        <span className="font-semibold text-[#c4c9d1]">{label}</span>
        <span className="font-mono text-[var(--accent-muted)]">{display}</span>
      </span>
      <p className="text-[10px] leading-relaxed text-[#8b939e]">{hint}</p>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-[var(--accent)]"
      />
      <div className="flex justify-between text-[9px] text-[#4b5563]">
        <span>{brighter}</span>
        <span>{darker}</span>
      </div>
    </label>
  )
}

function CheckRow({
  checked,
  label,
  hint,
  onChange,
}: {
  checked: boolean
  label: string
  hint: string
  onChange: () => void
}) {
  return (
    <div
      className={[
        'rounded border p-2.5 transition-colors',
        checked
          ? 'border-[var(--accent)]/50 bg-[var(--accent-soft)]'
          : 'border-[#2a3340] bg-[#0a0e14]',
      ].join(' ')}
    >
      <label className="flex cursor-pointer items-center gap-2 text-xs text-[#c4c9d1]">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="accent-[var(--accent)]"
        />
        <span className="font-semibold">{label}</span>
      </label>
      {!checked ? (
        <p className="mt-1 text-[10px] leading-relaxed text-[#9ca3af]">{hint}</p>
      ) : null}
    </div>
  )
}

/** Dark map-corner mock: shadows + enemy in shade — reacts to gamma. */
function VideoPreview({ cfg }: { cfg: VideoConfig }) {
  const m = useMessages()
  const brightness = cfg.includeGamma
    ? gammaToPreviewBrightness(cfg.gamma)
    : 1
  const particles = !cfg.reduceParticles
  const contrastBoost = 1.08

  return (
    <div className="overflow-hidden rounded border border-[#2a3340] bg-[#070b10]">
      <div className="flex items-center justify-between border-b border-[#2a3340] px-3 py-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">
          {m.video.previewTitle}
        </span>
        <span className="font-mono text-[10px] text-[var(--accent-muted)]">
          {cfg.includeGamma
            ? `gamma ${clampGamma(cfg.gamma).toFixed(2)}`
            : 'gamma off'}
        </span>
      </div>

      <div className="relative mx-auto aspect-[16/9] w-full max-w-xl overflow-hidden">
        <div
          className="absolute inset-0 transition-[filter] duration-150"
          style={{
            filter: `brightness(${brightness}) contrast(${contrastBoost})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a2433] via-[#121820] to-[#0a0e14]" />
          <div className="absolute bottom-0 left-0 right-[28%] top-[22%] bg-gradient-to-r from-[#151c26] to-[#0f141c]" />
          <div className="absolute bottom-0 left-0 top-[30%] w-[42%] bg-gradient-to-tr from-black via-[#05070a]/90 to-transparent" />
          <div className="absolute bottom-0 left-0 h-[55%] w-[35%] bg-gradient-to-t from-black to-transparent opacity-90" />
          <div className="absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-[#080a0e] to-[#12161e]" />
          <div className="absolute bottom-[18%] left-[8%] right-[30%] h-px bg-[#2a3340]/40" />
          <div
            className="absolute bottom-[14%] left-[14%] flex flex-col items-center"
            style={{ opacity: 0.55 + (brightness - 1) * 0.35 }}
          >
            <div className="h-7 w-7 rounded-full bg-[#6b7c8f] shadow-[0_0_12px_rgba(0,0,0,0.8)]" />
            <div className="mt-0.5 h-16 w-11 rounded-md bg-[#5a6a7a]" />
            <div className="mt-0.5 flex gap-1">
              <div className="h-10 w-3.5 rounded-sm bg-[#4b5866]" />
              <div className="h-10 w-3.5 rounded-sm bg-[#4b5866]" />
            </div>
          </div>
          <div className="absolute bottom-[16%] right-[22%] h-14 w-20 rounded-sm border border-[#3d4a5c] bg-[#2a3544] shadow-lg">
            <div className="absolute inset-x-2 top-2 h-1 bg-[#3d4a5c]/80" />
            <div className="absolute inset-x-2 top-5 h-1 bg-[#3d4a5c]/50" />
          </div>
          {particles && (
            <>
              <span className="absolute right-[30%] top-[38%] h-1.5 w-1.5 rounded-full bg-[#fbbf24]/70" />
              <span className="absolute right-[28%] top-[42%] h-1 w-1 rounded-full bg-[#f59e0b]/50" />
              <span className="absolute right-[33%] top-[40%] h-1 w-1 rounded-full bg-[#fde68a]/40" />
            </>
          )}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2">
            <span className="absolute left-1/2 top-0 h-1 w-px -translate-x-1/2 bg-[var(--accent)]/80" />
            <span className="absolute bottom-0 left-1/2 h-1 w-px -translate-x-1/2 bg-[var(--accent)]/80" />
            <span className="absolute left-0 top-1/2 h-px w-1 -translate-y-1/2 bg-[var(--accent)]/80" />
            <span className="absolute right-0 top-1/2 h-px w-1 -translate-y-1/2 bg-[var(--accent)]/80" />
          </div>
        </div>

        <p className="pointer-events-none absolute bottom-2 left-2 right-2 rounded bg-black/55 px-2 py-1 text-[9px] leading-relaxed text-[#9ca3af]">
          {m.video.previewTip}
        </p>
      </div>
    </div>
  )
}

export function VideoEditor({ value, onChange }: VideoEditorProps) {
  const m = useMessages()

  return (
    <div className="flex flex-col gap-4">
      <p className="rounded border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-2.5 py-2 text-[10px] leading-relaxed text-[var(--accent-muted)]">
        {m.video.tipFullscreen}
      </p>

      <VideoPreview cfg={value} />

      <div className="rounded border border-[#2a3340] bg-[#0a0e14] p-3">
        <label className="mb-2 flex cursor-pointer items-center gap-2 text-xs text-[#c4c9d1]">
          <input
            type="checkbox"
            checked={value.includeGamma}
            onChange={() =>
              onChange(patch(value, { includeGamma: !value.includeGamma }))
            }
            className="accent-[var(--accent)]"
          />
          <span className="font-semibold">r_fullscreen_gamma</span>
        </label>
        <SliderRow
          label={m.video.gammaLabel}
          hint={m.video.gammaHint}
          value={value.gamma}
          min={1.4}
          max={2.8}
          step={0.05}
          display={clampGamma(value.gamma).toFixed(2)}
          brighter={m.video.brighter}
          darker={m.video.darker}
          onChange={(gamma) =>
            onChange(patch(value, { gamma: clampGamma(gamma), includeGamma: true }))
          }
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">
          {m.video.sectionMonitor}
        </p>
        <CheckRow
          checked={value.disableVsync}
          label="mat_vsync 0"
          hint="Выключает вертикальную синхронизацию — меньше input lag. Если в игре всё ещё есть рывки, проверь VSync и в панели NVIDIA/AMD."
          onChange={() =>
            onChange(patch(value, { disableVsync: !value.disableVsync }))
          }
        />
        <CheckRow
          checked={value.noFocusSleep}
          label="engine_no_focus_sleep 0"
          hint="Игра не «засыпает» при Alt+Tab — удобно смотреть гайды вторым монитором без просадки FPS."
          onChange={() =>
            onChange(patch(value, { noFocusSleep: !value.noFocusSleep }))
          }
        />
        <CheckRow
          checked={value.matQueueMode}
          label="mat_queue_mode 2"
          hint="Многопоточная обработка материалов — обычно стабильнее FPS на современных CPU."
          onChange={() =>
            onChange(patch(value, { matQueueMode: !value.matQueueMode }))
          }
        />
        <CheckRow
          checked={value.disableCmaa}
          label="r_csgo_cmaa_enable 0"
          hint="Отключает CMAA сглаживание — картинка чуть резче, часто чуть больше FPS."
          onChange={() =>
            onChange(patch(value, { disableCmaa: !value.disableCmaa }))
          }
        />
        <CheckRow
          checked={value.disableFsr}
          label="r_csgo_fsr_enable 0"
          hint="Отключает FSR-апскейл — нативная резкость, если играешь в родном разрешении монитора."
          onChange={() =>
            onChange(patch(value, { disableFsr: !value.disableFsr }))
          }
        />
        <CheckRow
          checked={value.disableDof}
          label="r_dof_enable 0"
          hint="Убирает depth of field (размытие по глубине) — чище картинка и чуть легче GPU."
          onChange={() =>
            onChange(patch(value, { disableDof: !value.disableDof }))
          }
        />
        <CheckRow
          checked={value.disableSsao}
          label="r_ssao 0"
          hint="Отключает ambient occlusion — меньше «грязи» в углах, часто плюс к FPS. На части сборок команда может игнорироваться."
          onChange={() =>
            onChange(patch(value, { disableSsao: !value.disableSsao }))
          }
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">
          {m.video.sectionEffects}
        </p>
        <CheckRow
          checked={value.reduceParticles}
          label="r_drawparticles 0"
          hint="Сильно режет частицы (дым, искры). В превью гаснут жёлтые точки. Может убрать полезный визуальный фидбек — по умолчанию выкл."
          onChange={() =>
            onChange(
              patch(value, { reduceParticles: !value.reduceParticles }),
            )
          }
        />
        <CheckRow
          checked={value.disableRagdolls}
          label="cl_disable_ragdolls 1"
          hint="Отключает тряпичные трупы — меньше мусора на экране и чуть стабильнее FPS в файтах."
          onChange={() =>
            onChange(
              patch(value, { disableRagdolls: !value.disableRagdolls }),
            )
          }
        />
        <CheckRow
          checked={value.hideBuildInfo}
          label="r_show_build_info 0"
          hint="Скрывает служебную строку сборки движка в углу, если она включена."
          onChange={() =>
            onChange(patch(value, { hideBuildInfo: !value.hideBuildInfo }))
          }
        />
        <CheckRow
          checked={value.disableAnimatedAvatars}
          label="cl_allow_animated_avatars 0"
          hint="Отключает анимированные аватарки в UI — чуть меньше нагрузка в меню и табе."
          onChange={() =>
            onChange(
              patch(value, {
                disableAnimatedAvatars: !value.disableAnimatedAvatars,
              }),
            )
          }
        />
      </div>
    </div>
  )
}
