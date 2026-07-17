import { useState, type ReactNode } from 'react'
import {
  NET_DISPLAY_PRESET_HINTS,
  NET_DISPLAY_PRESET_LABELS,
  SHOW_FPS_LEVEL_HINTS,
  SHOW_FPS_LEVEL_LABELS,
  SHOW_FPS_LEVELS,
  type NetDisplayMode,
  type NetDisplayPreset,
  type ShowFpsLevel,
} from '../data/netDisplay'
import {
  BIND_ORDER,
  SETTINGS_ORDER,
  SLIDER_UTILITIES,
  UTILITY_META,
  buildPracticeBhopCommand,
  resetUtilityToRecommended,
  type AudioConfig,
  type ChatConfig,
  type GrenadeAction,
  type GrenadeItemId,
  type GrenadesConfig,
  type InspectConfig,
  type MouseConfig,
  type MovementConfig,
  type NetworkConfig,
  type PerformanceConfig,
  type PracticeConfig,
  type QuickConfig,
  type ScrollJumpDirection,
  type UtilitiesConfig,
  type UtilityId,
} from '../data/utilities'
import { CrosshairEditor } from './CrosshairEditor'
import { RadarEditor } from './RadarEditor'
import { VideoEditor } from './VideoEditor'
import { BindKeyCapture } from './BindKeyCapture'
import { useMessages } from '../i18n/I18nProvider'
import type { SearchTarget } from '../data/configSearch'
import {
  isUtilitySearchHighlight,
  searchSpotlightClass,
} from '../utils/searchHighlight'
import {
  playVolumePreview,
  type VolumePreviewKind,
} from '../utils/volumePreview'

interface UtilitiesPanelProps {
  view: 'home' | 'detail'
  selectedIds: UtilityId[]
  activeId: UtilityId | null
  onOpen: (id: UtilityId) => void
  config: UtilitiesConfig
  onConfigChange: (next: UtilitiesConfig) => void
  bindKey: string
  onBindKeyChange: (key: string) => void
  searchHighlight?: SearchTarget | null
}

const MODE_OPTIONS: { id: NetDisplayMode; label: string }[] = [
  { id: 'toggle', label: 'Обычное нажатие' },
  { id: 'advanced', label: 'Расширенные' },
]

const PRESETS = Object.keys(NET_DISPLAY_PRESET_LABELS) as NetDisplayPreset[]

function AudioSlider({
  label,
  hint,
  enabled,
  value,
  onToggle,
  onValueChange,
  min = 0,
  max = 2,
  step = 0.05,
  preview,
}: {
  label: string
  hint: string
  enabled: boolean
  value: number
  onToggle: () => void
  onValueChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  /** Play CS-like cue when the user releases the slider */
  preview?: VolumePreviewKind
}) {
  const pct = Math.round((value / max) * 100)
  const display =
    Math.round(value * 100) / 100 === Math.floor(value)
      ? String(Math.floor(value))
      : (Math.round(value * 100) / 100).toFixed(2).replace(/0+$/, '').replace(/\.$/, '')
  const ticks = [min, (min + max) / 2, max]

  const playPreview = (raw: string) => {
    if (!enabled || !preview) return
    playVolumePreview(preview, Number(raw), max)
  }

  return (
    <div
      className={[
        'rounded border p-2.5 transition-colors',
        enabled
          ? 'border-[var(--accent)]/50 bg-[var(--accent-soft)]'
          : 'border-[#2a3340] bg-[#0a0e14]',
      ].join(' ')}
    >
      <label className="mb-1 flex cursor-pointer items-center gap-2 text-xs text-[#c4c9d1]">
        <input
          type="checkbox"
          checked={enabled}
          onChange={onToggle}
          className="accent-[var(--accent)]"
        />
        <span className="font-semibold">{label}</span>
        <span className="ml-auto font-mono text-[var(--accent-muted)]">
          {display}{' '}
          <span className="text-[#6b7280]">({pct}%)</span>
        </span>
      </label>
      {!enabled ? (
        <p className="mb-2 text-[10px] leading-relaxed text-[#9ca3af]">{hint}</p>
      ) : null}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={!enabled}
        onChange={(e) => onValueChange(Number(e.target.value))}
        onPointerUp={(e) => playPreview(e.currentTarget.value)}
        onKeyUp={(e) => {
          if (
            e.key === 'ArrowLeft' ||
            e.key === 'ArrowRight' ||
            e.key === 'Home' ||
            e.key === 'End'
          ) {
            playPreview(e.currentTarget.value)
          }
        }}
        className={[
          'w-full accent-[var(--accent)] disabled:opacity-40',
          enabled ? 'mt-1' : '',
        ].join(' ')}
      />
      <div className="mt-0.5 flex justify-between text-[9px] text-[#4b5563]">
        {ticks.map((t) => (
          <span key={t}>{Number.isInteger(t) ? t : t.toFixed(1)}</span>
        ))}
      </div>
    </div>
  )
}

function AudioHintRow({
  checked,
  label,
  hint,
  onChange,
  children,
}: {
  checked: boolean
  label: string
  hint: string
  onChange: () => void
  children?: ReactNode
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
      {checked && children ? <div className="mt-2">{children}</div> : null}
    </div>
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
  hint?: string
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
      {hint && !checked ? (
        <p className="mt-1 text-[10px] leading-relaxed text-[#9ca3af]">{hint}</p>
      ) : null}
    </div>
  )
}

function ActionToggle({
  value,
  onChange,
}: {
  value: GrenadeAction
  onChange: (v: GrenadeAction) => void
}) {
  return (
    <div className="flex gap-1">
      {(
        [
          { id: 'equip', label: 'Достать' },
          { id: 'throw', label: 'Выбросить' },
        ] as const
      ).map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={[
            'flex-1 rounded border px-2 py-1 text-[10px] transition-colors',
            value === opt.id
              ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-muted)]'
              : 'border-[#2a3340] text-[#9ca3af] hover:border-[var(--accent)]/50',
          ].join(' ')}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function ScrollJumpToggle({
  value,
  onChange,
}: {
  value: ScrollJumpDirection
  onChange: (v: ScrollJumpDirection) => void
}) {
  return (
    <div className="flex gap-1">
      {(
        [
          { id: 'down', label: 'Вниз' },
          { id: 'up', label: 'Вверх' },
          { id: 'both', label: 'Оба' },
        ] as const
      ).map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={[
            'flex-1 rounded border px-2 py-1 text-[10px] transition-colors',
            value === opt.id
              ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-muted)]'
              : 'border-[#2a3340] text-[#9ca3af] hover:border-[var(--accent)]/50',
          ].join(' ')}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function JumpthrowGuide() {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-2 overflow-hidden rounded border border-[#2a3340] bg-[#080b10]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-2.5 py-2 text-left transition-colors hover:bg-[#0d1117]"
      >
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af]">
          Инструкция · почему не работает и как через файл
        </span>
        <span
          className={[
            'font-mono text-[10px] text-[var(--accent-muted)] transition-transform',
            open ? 'rotate-90' : '',
          ].join(' ')}
        >
          ›
        </span>
      </button>

      {open && (
        <div className="space-y-2.5 border-t border-[#2a3340] px-2.5 py-2.5 text-[10px] leading-relaxed text-[#6b7280]">
          <p>
            <span className="font-semibold text-[#9ca3af]">Valve</span> с августа 2024
            отключила на официальных серверах алиасы и макросы, которые совмещают прыжок и
            выброс в одном нажатии (<span className="font-mono text-[#9ca3af]">+jump;-attack</span>
            ). Старые бинды jumpthrow из консоли больше не работают и могут привести к кику
            за «input automation».
          </p>
          <p>
            Рабочий обход — скрипт через{' '}
            <span className="font-mono text-[#9ca3af]">autoexec.cfg</span> с привязкой к
            оси мыши (<span className="font-mono text-[#9ca3af]">mouse_x</span>). Приложение
            генерирует именно такой вариант.
          </p>
          <ol className="list-decimal space-y-1.5 pl-3.5 text-[#6b7280]">
            <li>
              Скопируй бинды справа (блок «Бинды»).
            </li>
            <li>
              Открой папку:{' '}
              <span className="font-mono text-[#9ca3af]">
                …\steamapps\common\Counter-Strike Global Offensive\game\csgo\cfg\
              </span>
            </li>
            <li>
              Создай или открой файл{' '}
              <span className="font-mono text-[#9ca3af]">autoexec.cfg</span>, вставь команды,
              сохрани в кодировке UTF-8.
            </li>
            <li>
              В Steam → CS2 → Свойства → параметры запуска добавь:{' '}
              <span className="font-mono text-[#9ca3af]">+exec autoexec.cfg</span>
            </li>
            <li>
              В игре: зажми гранату (ЛКМ) → нажми и отпусти клавишу jumpthrow → чуть сдвинь
              мышь. Без движения мыши скрипт не завершит прыжок.
            </li>
          </ol>
          <p className="text-[#4b5563]">
            Если мышь «залипла» после бинда, введи в консоль:{' '}
            <span className="font-mono text-[#9ca3af]">bind mouse_x yaw</span>
          </p>
          <p className="text-[#4b5563]">
            Альтернатива без скрипта: прыжок на колесо + отпустить ЛКМ вручную в пике прыжка
            — Valve это не запрещает.
          </p>
        </div>
      )}
    </div>
  )
}

function KeyField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-1 text-xs text-[#c4c9d1]">
      <span>{label}</span>
      <BindKeyCapture
        value={value}
        onChange={onChange}
        placeholder="key"
        compact
        className="bg-[#0a0e14] text-[#e5e7eb]"
      />
    </div>
  )
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-[#c4c9d1]">
      <span>{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded border border-[#2a3340] bg-[#0a0e14] px-2 py-1.5 text-xs text-[#e5e7eb] outline-none focus:border-[var(--accent)]"
      />
    </label>
  )
}

function GrenadeKeyRow({
  label,
  selected,
  keyValue,
  onToggle,
  onKeyChange,
  bombAction,
  onBombActionChange,
}: {
  label: string
  selected: boolean
  keyValue: string
  onToggle: () => void
  onKeyChange: (v: string) => void
  bombAction?: GrenadeAction
  onBombActionChange?: (v: GrenadeAction) => void
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onToggle()
        }
      }}
      className={[
        'cursor-pointer rounded border p-2.5 text-left transition-colors',
        selected
          ? 'border-[var(--accent)]/80 bg-[var(--accent-soft)] shadow-[var(--accent-glow)]'
          : 'border-[#2a3340] bg-[#0a0e14] hover:border-[var(--accent)]/50',
      ].join(' ')}
    >
      <p
        className={[
          'mb-2 text-xs font-semibold',
          selected ? 'text-[var(--accent-muted)]' : 'text-[#9ca3af]',
        ].join(' ')}
      >
        {label}
      </p>
      <div
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {selected && bombAction != null && onBombActionChange ? (
          <div className="mb-2">
            <p className="mb-1 text-[10px] text-[#6b7280]">Режим бомбы</p>
            <ActionToggle value={bombAction} onChange={onBombActionChange} />
          </div>
        ) : null}
        <KeyField label="Клавиша" value={keyValue} onChange={onKeyChange} />
      </div>
    </div>
  )
}

function UtilityCard({
  id,
  selected,
  onOpen,
  large = false,
  spotlight = false,
}: {
  id: UtilityId
  selected: boolean
  onOpen: () => void
  large?: boolean
  spotlight?: boolean
}) {
  const m = useMessages()
  const meta = UTILITY_META[id]
  const label = m.utilMeta[id]?.label ?? meta.label
  return (
    <button
      type="button"
      onClick={onOpen}
      id={spotlight ? `search-target-${id}` : undefined}
      className={[
        'flex flex-col overflow-hidden rounded-lg border text-left transition-colors',
        large ? 'w-52 sm:w-56' : 'w-36 sm:w-40',
        searchSpotlightClass(spotlight),
        selected
          ? 'border-[var(--accent)]/80 bg-[var(--accent-soft)] shadow-[var(--accent-glow)]'
          : 'border-[#2a3340] bg-[#0d1117] hover:border-[var(--accent)]/50',
      ].join(' ')}
    >
      <div
        className={[
          'relative flex aspect-square items-center justify-center overflow-hidden bg-black',
          large ? 'p-3' : 'p-2.5',
        ].join(' ')}
      >
        <img
          src={meta.icon}
          alt=""
          draggable={false}
          className="mx-auto max-h-full max-w-full object-contain object-center"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            const fallback = e.currentTarget.nextElementSibling as HTMLElement | null
            if (fallback) fallback.style.display = 'flex'
          }}
        />
        <span
          className={[
            'hidden items-center justify-center rounded-md border border-[#2a3340] bg-[#121820] font-mono font-bold tracking-wide text-[var(--accent-muted)]',
            large ? 'h-20 w-20 text-base' : 'h-16 w-16 text-sm',
          ].join(' ')}
          aria-hidden
        >
          {meta.mark}
        </span>
      </div>
      <span
        className={[
          'border-t border-[#2a3340] px-2 text-center font-semibold leading-tight',
          large ? 'py-2.5 text-sm' : 'py-2 text-[11px]',
          selected ? 'text-[var(--accent-muted)]' : 'text-[#9ca3af]',
        ].join(' ')}
      >
        {label}
      </span>
    </button>
  )
}

function NetDisplaySettings({
  config,
  onConfigChange,
  bindKey,
  onBindKeyChange,
}: {
  config: UtilitiesConfig
  onConfigChange: (next: UtilitiesConfig) => void
  bindKey: string
  onBindKeyChange: (key: string) => void
}) {
  const nd = config.netDisplay
  const tabSelected = (bindKey.trim() || 'tab').toLowerCase() === 'tab'

  return (
    <>
      <p className="mb-2 text-xs text-[#9ca3af]">Режим</p>
      <div className="mb-2 flex flex-wrap gap-2">
        {MODE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() =>
              onConfigChange({
                ...config,
                netDisplay: { ...nd, mode: opt.id },
              })
            }
            className={[
              'rounded border px-3 py-1.5 text-xs transition-colors',
              nd.mode === opt.id
                ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-muted)]'
                : 'border-[#2a3340] text-[#9ca3af] hover:border-[var(--accent)]/50',
            ].join(' ')}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <p className="mb-4 text-[10px] leading-relaxed text-[#4b5563]">
        {nd.mode === 'toggle'
          ? 'Обычное нажатие: каждое нажатие клавиши включает или выключает выбранные показатели.'
          : 'Расширенные: показатели видны только пока клавиша зажата (удобно с Tab вместе со счётом).'}
      </p>

      {nd.mode === 'toggle' ? (
        <>
          <p className="mb-2 text-xs text-[#9ca3af]">Что показывать</p>
          <div className="flex flex-col gap-2">
            {PRESETS.map((preset) => (
              <label
                key={preset}
                className={[
                  'cursor-pointer rounded border p-2.5 text-xs transition-colors',
                  nd.preset === preset
                    ? 'border-[var(--accent)]/50 bg-[var(--accent-soft)] text-[#c4c9d1]'
                    : 'border-[#2a3340] bg-[#0a0e14] text-[#c4c9d1]',
                ].join(' ')}
              >
                <span className="flex items-center gap-2 font-semibold">
                  <input
                    type="radio"
                    name="net-display-preset"
                    checked={nd.preset === preset}
                    onChange={() =>
                      onConfigChange({
                        ...config,
                        netDisplay: { ...nd, preset },
                      })
                    }
                    className="accent-[var(--accent)]"
                  />
                  {NET_DISPLAY_PRESET_LABELS[preset]}
                </span>
                <p className="mt-1 text-[10px] font-normal leading-relaxed text-[#4b5563]">
                  {NET_DISPLAY_PRESET_HINTS[preset]}
                </p>
              </label>
            ))}
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-[#4b5563]">
            Клавишу выбери в правой панели. Строку бинда вставь в консоль (~) целиком.
          </p>
        </>
      ) : (
        <>
          <p className="mb-2 text-xs text-[#9ca3af]">Показать при зажатии клавиши</p>
          <div className="mb-4 flex flex-col gap-2">
            {SHOW_FPS_LEVELS.map((level) => (
              <label
                key={level}
                className={[
                  'cursor-pointer rounded border p-2.5 text-xs transition-colors',
                  nd.showFpsLevel === level
                    ? 'border-[var(--accent)]/50 bg-[var(--accent-soft)] text-[#c4c9d1]'
                    : 'border-[#2a3340] bg-[#0a0e14] text-[#c4c9d1]',
                ].join(' ')}
              >
                <span className="flex items-center gap-2 font-semibold">
                  <input
                    type="radio"
                    name="net-showfps-level"
                    checked={nd.showFpsLevel === level}
                    onChange={() =>
                      onConfigChange({
                        ...config,
                        netDisplay: {
                          ...nd,
                          showFpsLevel: level as ShowFpsLevel,
                        },
                      })
                    }
                    className="accent-[var(--accent)]"
                  />
                  {SHOW_FPS_LEVEL_LABELS[level]}
                </span>
                <p className="mt-1 text-[10px] font-normal leading-relaxed text-[#4b5563]">
                  {SHOW_FPS_LEVEL_HINTS[level]}
                </p>
              </label>
            ))}
          </div>
          <p className="mb-2 text-xs text-[#9ca3af]">Клавиша</p>
          <p className="mb-2 text-[10px] leading-relaxed text-[#6b7280]">
            Рекомендуемая клавиша —{' '}
            <span className="font-mono text-[var(--accent-muted)]">Tab</span>
            : смотришь счёт и сеть вместе, в бою оверлей не мешает.
          </p>
          <button
            type="button"
            onClick={() => onBindKeyChange('tab')}
            className={[
              'mb-3 rounded border px-3 py-1.5 font-mono text-xs transition-colors',
              tabSelected
                ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-muted)]'
                : 'border-[#2a3340] text-[#9ca3af] hover:border-[var(--accent)]/50',
            ].join(' ')}
          >
            tab
          </button>
          <p className="text-[10px] leading-relaxed text-[#4b5563]">
            Пока держишь клавишу — выбранный cl_showfps; отпустил — скрыто (cl_showfps 0).
          </p>
        </>
      )}
    </>
  )
}

function patchPerf(
  config: UtilitiesConfig,
  patch: Partial<PerformanceConfig>,
): UtilitiesConfig {
  return { ...config, performance: { ...config.performance, ...patch } }
}
function patchNet(
  config: UtilitiesConfig,
  patch: Partial<NetworkConfig>,
): UtilitiesConfig {
  return { ...config, network: { ...config.network, ...patch } }
}
function patchGrenades(
  config: UtilitiesConfig,
  patch: Partial<GrenadesConfig>,
): UtilitiesConfig {
  return { ...config, grenades: { ...config.grenades, ...patch } }
}
function patchMovement(
  config: UtilitiesConfig,
  patch: Partial<MovementConfig>,
): UtilitiesConfig {
  return { ...config, movement: { ...config.movement, ...patch } }
}
function patchAudio(
  config: UtilitiesConfig,
  patch: Partial<AudioConfig>,
): UtilitiesConfig {
  return { ...config, audio: { ...config.audio, ...patch } }
}
function patchMouse(
  config: UtilitiesConfig,
  patch: Partial<MouseConfig>,
): UtilitiesConfig {
  return { ...config, mouse: { ...config.mouse, ...patch } }
}
function patchInspect(
  config: UtilitiesConfig,
  patch: Partial<InspectConfig>,
): UtilitiesConfig {
  return { ...config, inspect: { ...config.inspect, ...patch } }
}
function patchQuick(
  config: UtilitiesConfig,
  patch: Partial<QuickConfig>,
): UtilitiesConfig {
  return { ...config, quick: { ...config.quick, ...patch } }
}
function patchChat(
  config: UtilitiesConfig,
  patch: Partial<ChatConfig>,
): UtilitiesConfig {
  return { ...config, chat: { ...config.chat, ...patch } }
}
function patchPractice(
  config: UtilitiesConfig,
  patch: Partial<PracticeConfig>,
): UtilitiesConfig {
  return { ...config, practice: { ...config.practice, ...patch } }
}

function PracticeBhopBlock({
  cfg,
  onPatch,
}: {
  cfg: PracticeConfig
  onPatch: (patch: Partial<PracticeConfig>) => void
}) {
  const [copied, setCopied] = useState(false)
  const line = buildPracticeBhopCommand(cfg)
  const on = cfg.includeBhop

  const copyLine = async () => {
    if (!line) return
    await navigator.clipboard.writeText(line)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div
      className={[
        'relative overflow-hidden rounded-lg border p-3 transition-colors',
        on
          ? 'border-[var(--accent)]/45 bg-[var(--accent-soft)]'
          : 'border-[#2a3340] bg-[#0d1117]',
      ].join(' ')}
    >
      <div className="relative flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent-muted)]">
            BHOP · готовая строка
          </p>
          <p className="mt-0.5 text-[11px] leading-snug text-[#9ca3af]">
            Connect + bunnyhop cvars в одну вставку в консоль (~)
          </p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 rounded border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-2.5 py-1.5 text-xs font-semibold text-[var(--accent-muted)]">
          <input
            type="checkbox"
            checked={on}
            onChange={() => onPatch({ includeBhop: !on })}
            className="accent-[var(--accent)]"
          />
          Включить
        </label>
      </div>

      {on ? (
        <div className="relative mt-3 flex flex-col gap-2">
          <div
            className={[
              'rounded border p-2 transition-colors',
              cfg.bhopConnect
                ? 'border-[var(--accent)]/40 bg-black/25'
                : 'border-[#2a3340] bg-[#0a0e14]/80',
            ].join(' ')}
          >
            <label className="flex cursor-pointer items-center gap-2 text-xs text-[#e5e7eb]">
              <input
                type="checkbox"
                checked={cfg.bhopConnect}
                onChange={() => onPatch({ bhopConnect: !cfg.bhopConnect })}
                className="accent-[var(--accent)]"
              />
              <span className="font-semibold">connect — подключиться к серверу</span>
            </label>
            {cfg.bhopConnect ? (
              <input
                type="text"
                value={cfg.bhopHost}
                onChange={(e) => onPatch({ bhopHost: e.target.value })}
                placeholder="ip:port или hostname:27015"
                className="mt-2 w-full rounded border border-[#2a3340] bg-[#0a0e14] px-2 py-1.5 font-mono text-xs text-[#e5e7eb] outline-none placeholder:text-[#4b5563] focus:border-[var(--accent)]"
              />
            ) : null}
          </div>

          <div className="grid gap-1.5 sm:grid-cols-2">
            <CheckRow
              checked={cfg.bhopEnable}
              label="sv_enablebunnyhopping 1"
              hint="Разрешает настоящий бхоп (без потери скорости)."
              onChange={() => onPatch({ bhopEnable: !cfg.bhopEnable })}
            />
            <CheckRow
              checked={cfg.bhopAutobhop}
              label="sv_autobunnyhopping 1"
              hint="Автобхоп — прыжок зажат, сервер прыгает сам."
              onChange={() => onPatch({ bhopAutobhop: !cfg.bhopAutobhop })}
            />
            <div
              className={[
                'rounded border p-2.5 transition-colors sm:col-span-2',
                cfg.bhopAirAccelerate
                  ? 'border-[var(--accent)]/50 bg-[var(--accent-soft)]'
                  : 'border-[#2a3340] bg-[#0a0e14]',
              ].join(' ')}
            >
              <label className="flex cursor-pointer items-center gap-2 text-xs text-[#c4c9d1]">
                <input
                  type="checkbox"
                  checked={cfg.bhopAirAccelerate}
                  onChange={() =>
                    onPatch({ bhopAirAccelerate: !cfg.bhopAirAccelerate })
                  }
                  className="accent-[var(--accent)]"
                />
                <span className="font-semibold">sv_airaccelerate</span>
                <input
                  type="number"
                  min={12}
                  max={2000}
                  step={1}
                  disabled={!cfg.bhopAirAccelerate}
                  value={cfg.bhopAirAccelerateValue}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    onPatch({
                      bhopAirAccelerateValue: Number(e.target.value) || 150,
                    })
                  }
                  className="ml-auto w-20 rounded border border-[#2a3340] bg-[#0a0e14] px-2 py-0.5 font-mono text-xs text-[#e5e7eb] outline-none focus:border-[var(--accent)] disabled:opacity-40"
                />
              </label>
              <p className="mt-1 text-[10px] leading-relaxed text-[#4b5563]">
                Выше значение — легче набирать скорость в воздухе (обычно 100–150).
              </p>
            </div>
            <CheckRow
              checked={cfg.bhopNoStamina}
              label="Без стамины"
              hint="sv_staminamax / jumpcost / landcost = 0"
              onChange={() => onPatch({ bhopNoStamina: !cfg.bhopNoStamina })}
            />
            <CheckRow
              checked={cfg.bhopMaxVelocity}
              label="sv_maxvelocity 7000"
              hint="Снимает потолок скорости для длинных серфов."
              onChange={() => onPatch({ bhopMaxVelocity: !cfg.bhopMaxVelocity })}
            />
          </div>

          <div className="mt-1 rounded border border-[var(--accent)]/40 bg-black/40 p-2.5">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--accent-muted)]">
              Одна строка для консоли
            </p>
            <pre className="mb-2 max-h-24 overflow-auto whitespace-pre-wrap break-all font-mono text-[11px] leading-relaxed text-[var(--accent-muted)]">
              {line || 'Включи хотя бы одну опцию выше…'}
            </pre>
            <button
              type="button"
              disabled={!line}
              onClick={() => void copyLine()}
              className="w-full rounded bg-[var(--accent)] py-2 text-sm font-bold uppercase tracking-wide text-[var(--accent-on)] transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-40"
            >
              {copied ? 'Скопировано!' : 'Копировать строку BHOP'}
            </button>
          </div>
        </div>
      ) : (
        <p className="relative mt-2 text-[10px] leading-relaxed text-[#4b5563]">
          Включи блок — получишь connect + настройки бхопа одной готовой строкой.
        </p>
      )}
    </div>
  )
}

function ActiveSettings({
  activeId,
  config,
  onConfigChange,
  bindKey,
  onBindKeyChange,
  spotlight = false,
}: {
  activeId: UtilityId
  config: UtilitiesConfig
  onConfigChange: (next: UtilitiesConfig) => void
  bindKey: string
  onBindKeyChange: (key: string) => void
  spotlight?: boolean
}) {
  const m = useMessages()
  const meta = UTILITY_META[activeId]
  const label = m.utilMeta[activeId]?.label ?? meta.label
  const hint = m.utilMeta[activeId]?.hint ?? meta.hint

  /** Keep sidebar «Клавиша бинда» in sync when editing a field on the card. */
  const setConfigKey = (next: UtilitiesConfig, key: string) => {
    onConfigChange(next)
    onBindKeyChange(key)
  }

  if (activeId === 'map_cleanup') {
    return (
      <div
        id={spotlight ? `search-target-${activeId}` : undefined}
        className={[
          'flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-[#2a3340] bg-[#0d1117] px-6 py-10 text-center',
          searchSpotlightClass(spotlight),
        ].join(' ')}
      >
        <div
          className="mb-5 flex h-24 w-24 items-center justify-center rounded-full border-4 border-[var(--accent)] text-6xl font-black leading-none text-[var(--accent)] shadow-[var(--accent-glow)]"
          aria-hidden
        >
          !
        </div>
        <p className="mb-2 text-sm font-semibold tracking-wide text-[var(--accent-muted)]">
          {m.mapCleanup.title}
        </p>
        <p className="max-w-md text-[12px] leading-relaxed text-[#9ca3af]">
          {m.mapCleanup.body}
        </p>
      </div>
    )
  }

  return (
    <div
      id={spotlight ? `search-target-${activeId}` : undefined}
      className={[
        'rounded-lg border border-[#2a3340] bg-[#0d1117] p-4',
        searchSpotlightClass(spotlight),
      ].join(' ')}
    >
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[var(--accent-muted)]">
            {m.common.settings} · {label}
          </p>
          <p className="text-[10px] text-[#4b5563]">{hint}</p>
        </div>
        {SLIDER_UTILITIES.includes(activeId) ? (
          <button
            type="button"
            onClick={() =>
              onConfigChange(resetUtilityToRecommended(config, activeId))
            }
            title={m.common.resetRecommendedHint}
            className="shrink-0 rounded border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {m.common.resetRecommended}
          </button>
        ) : null}
      </div>

      {activeId === 'net_display' && (
        <NetDisplaySettings
          config={config}
          onConfigChange={onConfigChange}
          bindKey={bindKey}
          onBindKeyChange={onBindKeyChange}
        />
      )}

      {activeId === 'performance' && (
        <div className="flex flex-col gap-2">
          <p className="mb-1 rounded border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-2.5 py-2 text-[10px] leading-relaxed text-[var(--accent-muted)]">
            Чтобы вернуть любую опцию в исходное состояние, скопируй ту же команду, замени
            значение на противоположное (
            <span className="font-mono font-semibold text-[var(--accent)]">0 ↔ 1</span> или{' '}
            <span className="font-mono font-semibold text-[var(--accent)]">true ↔ false</span>) и
            вставь в консоль снова. Например:{' '}
            <span className="font-mono font-semibold text-[var(--accent)]">cl_autohelp 1</span>{' '}
            вместо{' '}
            <span className="font-mono font-semibold text-[var(--accent)]">cl_autohelp 0</span>.
          </p>
          <CheckRow
            checked={config.performance.fpsMax}
            label="fps_max 0"
            hint="Снимает потолок FPS в матче: игра рисует столько кадров, сколько тянет ПК. Обычно выше FPS = плавнее картинка и чуть быстрее отклик мыши."
            onChange={() =>
              onConfigChange(
                patchPerf(config, { fpsMax: !config.performance.fpsMax }),
              )
            }
          />
          <CheckRow
            checked={config.performance.fpsMaxUi}
            label="fps_max_ui 200"
            hint="Ограничивает FPS в меню и на загрузочных экранах (до 200). В самой игре на матч не влияет — экономит ресурсы, когда вы не на сервере."
            onChange={() =>
              onConfigChange(
                patchPerf(config, { fpsMaxUi: !config.performance.fpsMaxUi }),
              )
            }
          />
          <CheckRow
            checked={config.performance.cqEnabled}
            label="cq_enabled 1"
            hint="Включает сжатую очередь команд клиента. Помогает стабильнее отправлять ввод на сервер при микролагах сети; на очень низком пинге разница почти незаметна."
            onChange={() =>
              onConfigChange(
                patchPerf(config, {
                  cqEnabled: !config.performance.cqEnabled,
                }),
              )
            }
          />
          <CheckRow
            checked={config.performance.drawTracersFp}
            label="r_drawtracers_firstperson 0"
            hint="Убирает трассеры своих пуль от первого лица. Меньше визуального шума при стрельбе, чуть легче картинка."
            onChange={() =>
              onConfigChange(
                patchPerf(config, {
                  drawTracersFp: !config.performance.drawTracersFp,
                }),
              )
            }
          />
          <CheckRow
            checked={config.performance.lowLatencySleep}
            label="engine_low_latency_sleep_after_client_tick true"
            hint="Движок «спит» после клиентского тика — на части ПК снижает input lag. Если FPS стал нестабильным, выключи."
            onChange={() =>
              onConfigChange(
                patchPerf(config, {
                  lowLatencySleep: !config.performance.lowLatencySleep,
                }),
              )
            }
          />
          <CheckRow
            checked={config.performance.animatePlayerModels}
            label="cl_animate_player_models 0"
            hint="Отключает анимацию моделей игроков в меню. Меньше нагрузка вне матча, на саму игру почти не влияет."
            onChange={() =>
              onConfigChange(
                patchPerf(config, {
                  animatePlayerModels: !config.performance.animatePlayerModels,
                }),
              )
            }
          />
          <CheckRow
            checked={config.performance.disableFreezecam}
            label="cl_disablefreezecam 1"
            hint="Отключает freeze-cam после смерти: сразу наблюдаешь за тиммейтом, без замедленного «кинематографа»."
            onChange={() =>
              onConfigChange(
                patchPerf(config, {
                  disableFreezecam: !config.performance.disableFreezecam,
                }),
              )
            }
          />
          <CheckRow
            checked={config.performance.gameInstructor}
            label="gameinstructor_enable 0"
            hint="Выключает игровой инструктор (подсказки «куда идти / что делать»). Меньше отвлечений на экране."
            onChange={() =>
              onConfigChange(
                patchPerf(config, {
                  gameInstructor: !config.performance.gameInstructor,
                }),
              )
            }
          />
          <CheckRow
            checked={config.performance.autoHelp}
            label="cl_autohelp 0"
            hint="Отключает автоматические всплывающие подсказки помощи."
            onChange={() =>
              onConfigChange(
                patchPerf(config, { autoHelp: !config.performance.autoHelp }),
              )
            }
          />
          <CheckRow
            checked={config.performance.showHelp}
            label="cl_showhelp 0"
            hint="Скрывает on-screen help tips. Вместе с autohelp и instructor — чистый HUD."
            onChange={() =>
              onConfigChange(
                patchPerf(config, { showHelp: !config.performance.showHelp }),
              )
            }
          />
          <CheckRow
            checked={config.performance.disableHtmlMotd}
            label="cl_disablehtmlmotd 1"
            hint="Не загружает HTML-сообщение дня на community-серверах. Чуть быстрее заход, меньше лишней нагрузки."
            onChange={() =>
              onConfigChange(
                patchPerf(config, {
                  disableHtmlMotd: !config.performance.disableHtmlMotd,
                }),
              )
            }
          />
        </div>
      )}

      {activeId === 'network' && (
        <div className="flex flex-col gap-2">
          <p className="mb-1 rounded border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-2.5 py-2 text-[10px] leading-relaxed text-[var(--accent-muted)]">
            Чтобы откатить настройку, введи ту же команду с другим значением. Например{' '}
            <span className="font-mono font-semibold text-[var(--accent)]">
              cl_interp_ratio 2
            </span>{' '}
            вместо{' '}
            <span className="font-mono font-semibold text-[var(--accent)]">
              cl_interp_ratio 1
            </span>
            , или{' '}
            <span className="font-mono font-semibold text-[var(--accent)]">
              mm_dedicated_search_maxping 150
            </span>{' '}
            для дефолтного лимита пинга.
          </p>
          <CheckRow
            checked={config.network.updaterate}
            label="cl_updaterate 128"
            hint="Сколько обновлений мира в секунду клиент запрашивает у сервера. 128 — стандарт для серверов 128 tick: позиции врагов и события приходят чаще."
            onChange={() =>
              onConfigChange(
                patchNet(config, {
                  updaterate: !config.network.updaterate,
                }),
              )
            }
          />
          <CheckRow
            checked={config.network.cmdrate}
            label="cl_cmdrate 128"
            hint="Сколько ваших команд (движение, выстрелы) в секунду уходит на сервер. 128 подстраивается под тикрейт 128 — ввод обрабатывается чаще."
            onChange={() =>
              onConfigChange(
                patchNet(config, { cmdrate: !config.network.cmdrate }),
              )
            }
          />
          <CheckRow
            checked={config.network.rate}
            label="rate 786432"
            hint="Максимальная скорость обмена данными с сервером (байт/с). Высокое значение не даёт сети «душить» обновления при хорошем интернете."
            onChange={() =>
              onConfigChange(patchNet(config, { rate: !config.network.rate }))
            }
          />
          <CheckRow
            checked={config.network.interpRatio}
            label="cl_interp_ratio 1"
            hint="Меньше интерполяции — картинка ближе к «живому» состоянию сервера. На нестабильном пинге поставь 2 вручную в консоли."
            onChange={() =>
              onConfigChange(
                patchNet(config, {
                  interpRatio: !config.network.interpRatio,
                }),
              )
            }
          />
          <CheckRow
            checked={config.network.interp}
            label="cl_interp 0"
            hint="Просит движок сам выбрать минимальный буфер интерполяции по ratio и сети. Вручную крутить cl_interp в CS2 почти бессмысленно."
            onChange={() =>
              onConfigChange(patchNet(config, { interp: !config.network.interp }))
            }
          />
          <CheckRow
            checked={config.network.lagCompensation}
            label="cl_lagcompensation 1"
            hint="Сервер учитывает ваш пинг при регистрации попаданий. Держите включённым — выключение портит hitreg."
            onChange={() =>
              onConfigChange(
                patchNet(config, {
                  lagCompensation: !config.network.lagCompensation,
                }),
              )
            }
          />
          <CheckRow
            checked={config.network.predict}
            label="cl_predict 1"
            hint="Клиент предсказывает ваше движение локально — управление ощущается отзывчивее. Без этого персонаж «плывёт» за сервером."
            onChange={() =>
              onConfigChange(
                patchNet(config, { predict: !config.network.predict }),
              )
            }
          />
          <CheckRow
            checked={config.network.maxSearchPing}
            label="mm_dedicated_search_maxping 80"
            hint="Максимальный пинг серверов при поиске матча Valve MM. 80 — баланс скорости поиска и комфорта; для жёсткого фильтра — 50."
            onChange={() =>
              onConfigChange(
                patchNet(config, {
                  maxSearchPing: !config.network.maxSearchPing,
                }),
              )
            }
          />
          <CheckRow
            checked={config.network.timeout}
            label="cl_timeout 60"
            hint="Сколько секунд ждать ответа сервера, прежде чем отключиться. 60 снижает случайные дисконнекты при коротких микролагах."
            onChange={() =>
              onConfigChange(
                patchNet(config, { timeout: !config.network.timeout }),
              )
            }
          />
          <CheckRow
            checked={config.network.maxRoutable}
            label="net_maxroutable 1200"
            hint="Максимальный размер UDP-пакета. 1200 уменьшает фрагментацию на плохих маршрутах; на стабильном канале обычно незаметно."
            onChange={() =>
              onConfigChange(
                patchNet(config, {
                  maxRoutable: !config.network.maxRoutable,
                }),
              )
            }
          />
        </div>
      )}

      {activeId === 'crosshair' && (
        <CrosshairEditor
          value={config.crosshair}
          onChange={(crosshair) => onConfigChange({ ...config, crosshair })}
        />
      )}

      {activeId === 'grenades' && (
        <div className="flex flex-col gap-3">
          <p className="text-[10px] leading-relaxed text-[#4b5563]">
            Гранаты всегда достают в руки. Выбросить можно только бомбу — режим на карточке
            «Бомба».
          </p>

          <div className="grid gap-2 sm:grid-cols-2">
            {(
              [
                { id: 'flash', label: 'Флешка', key: 'flashKey' },
                { id: 'smoke', label: 'Смоук', key: 'smokeKey' },
                { id: 'he', label: 'Осколочная', key: 'heKey' },
                { id: 'decoy', label: 'Ложная', key: 'decoyKey' },
                { id: 'molotov', label: 'Молотов / Inc', key: 'molotovKey' },
                { id: 'bomb', label: 'Бомба', key: 'bombKey' },
              ] as const
            ).map((item) => (
              <GrenadeKeyRow
                key={item.id}
                label={item.label}
                selected={config.grenades.enabled[item.id]}
                keyValue={config.grenades[item.key]}
                bombAction={
                  item.id === 'bomb' ? config.grenades.bombAction : undefined
                }
                onBombActionChange={
                  item.id === 'bomb'
                    ? (bombAction) =>
                        onConfigChange(patchGrenades(config, { bombAction }))
                    : undefined
                }
                onToggle={() => {
                  const id = item.id as GrenadeItemId
                  onConfigChange(
                    patchGrenades(config, {
                      enabled: {
                        ...config.grenades.enabled,
                        [id]: !config.grenades.enabled[id],
                      },
                    }),
                  )
                }}
                onKeyChange={(value) =>
                  setConfigKey(patchGrenades(config, { [item.key]: value }), value)
                }
              />
            ))}
          </div>
        </div>
      )}

      {activeId === 'radar' && (
        <RadarEditor
          value={config.radar}
          onChange={(radar) => onConfigChange({ ...config, radar })}
        />
      )}

      {activeId === 'video' && (
        <VideoEditor
          value={config.video}
          onChange={(video) => onConfigChange({ ...config, video })}
        />
      )}

      {activeId === 'movement' && (
        <div className="flex flex-col gap-3">
          <p className="text-[10px] leading-relaxed text-[#4b5563]">
            Можно выбрать только одно: прыжок на колесо или jumpthrow — вместе они конфликтуют.
          </p>
          <AudioHintRow
            checked={config.movement.scrollJump}
            label="Прыжок на колесо"
            hint="Обычный bind на mwheelup / mwheeldown — Valve не ограничивает. Удобно для bunnyhop и ручного jumpthrow."
            onChange={() => {
              const next = !config.movement.scrollJump
              onConfigChange(
                patchMovement(config, {
                  scrollJump: next,
                  ...(next ? { includeJumpthrow: false } : {}),
                }),
              )
            }}
          >
            <p className="mb-1.5 text-[10px] text-[#9ca3af]">Направление прокрутки</p>
            <ScrollJumpToggle
              value={config.movement.scrollJumpDirection}
              onChange={(scrollJumpDirection) =>
                onConfigChange(patchMovement(config, { scrollJumpDirection }))
              }
            />
          </AudioHintRow>

          <AudioHintRow
            checked={config.movement.includeJumpthrow}
            label="Jumpthrow"
            hint="Старые алиасы и макросы Valve отключила. Ниже — гайд через autoexec.cfg."
            onChange={() => {
              const next = !config.movement.includeJumpthrow
              onConfigChange(
                patchMovement(config, {
                  includeJumpthrow: next,
                  ...(next ? { scrollJump: false } : {}),
                }),
              )
            }}
          >
            <KeyField
              label="Клавиша"
              value={config.movement.jumpthrowKey}
              onChange={(jumpthrowKey) =>
                setConfigKey(patchMovement(config, { jumpthrowKey }), jumpthrowKey)
              }
            />
            <JumpthrowGuide />
          </AudioHintRow>
        </div>
      )}

      {activeId === 'audio' && (
        <div className="flex flex-col gap-3">
          <p className="text-[10px] leading-relaxed text-[#4b5563]">
            Громкости с шагом 0.01–0.05. Основные каналы 0–2, музыка и ивенты —
            0–1. Отпусти ползунок — короткий превью-звук (AWP / AK / прыжок и
            т.п.) на выбранной громкости.
          </p>

          <p className="text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">
            Основные
          </p>
          <AudioSlider
            label="volume"
            hint="Общая громкость игры. 0 — тишина, 1 — норма, до 2 — громче."
            enabled={config.audio.includeVolume}
            value={config.audio.volume}
            min={0}
            max={2}
            step={0.01}
            preview="awp"
            onToggle={() =>
              onConfigChange(
                patchAudio(config, {
                  includeVolume: !config.audio.includeVolume,
                }),
              )
            }
            onValueChange={(volume) => onConfigChange(patchAudio(config, { volume }))}
          />
          <AudioSlider
            label="voice_scale"
            hint="Громкость голосового чата тиммейтов."
            enabled={config.audio.includeVoiceScale}
            value={config.audio.voiceScale}
            min={0}
            max={2}
            step={0.01}
            preview="voice"
            onToggle={() =>
              onConfigChange(
                patchAudio(config, {
                  includeVoiceScale: !config.audio.includeVoiceScale,
                }),
              )
            }
            onValueChange={(voiceScale) =>
              onConfigChange(patchAudio(config, { voiceScale }))
            }
          />

          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">
            Музыка и ивенты
          </p>
          <AudioSlider
            label="snd_musicvolume"
            hint="Музыка в матче."
            enabled={config.audio.includeMusicVolume}
            value={config.audio.musicVolume}
            min={0}
            max={1}
            step={0.01}
            preview="music"
            onToggle={() =>
              onConfigChange(
                patchAudio(config, {
                  includeMusicVolume: !config.audio.includeMusicVolume,
                }),
              )
            }
            onValueChange={(musicVolume) =>
              onConfigChange(patchAudio(config, { musicVolume }))
            }
          />
          <AudioSlider
            label="snd_menumusic_volume"
            hint="Музыка в главном меню."
            enabled={config.audio.includeMenuMusic}
            value={config.audio.menuMusicVolume}
            min={0}
            max={1}
            step={0.01}
            preview="music"
            onToggle={() =>
              onConfigChange(
                patchAudio(config, {
                  includeMenuMusic: !config.audio.includeMenuMusic,
                }),
              )
            }
            onValueChange={(menuMusicVolume) =>
              onConfigChange(patchAudio(config, { menuMusicVolume }))
            }
          />
          <AudioSlider
            label="snd_mvp_volume"
            hint="Музыка MVP в конце раунда."
            enabled={config.audio.includeMvpVolume}
            value={config.audio.mvpVolume}
            min={0}
            max={1}
            step={0.01}
            preview="mvp"
            onToggle={() =>
              onConfigChange(
                patchAudio(config, {
                  includeMvpVolume: !config.audio.includeMvpVolume,
                }),
              )
            }
            onValueChange={(mvpVolume) =>
              onConfigChange(patchAudio(config, { mvpVolume }))
            }
          />
          <AudioSlider
            label="snd_roundstart_volume"
            hint="Звук старта раунда. Превью: выстрел AK."
            enabled={config.audio.includeRoundStartVolume}
            value={config.audio.roundStartVolume}
            min={0}
            max={1}
            step={0.01}
            preview="ak"
            onToggle={() =>
              onConfigChange(
                patchAudio(config, {
                  includeRoundStartVolume: !config.audio.includeRoundStartVolume,
                }),
              )
            }
            onValueChange={(roundStartVolume) =>
              onConfigChange(patchAudio(config, { roundStartVolume }))
            }
          />
          <AudioSlider
            label="snd_roundend_volume"
            hint="Звук конца раунда."
            enabled={config.audio.includeRoundEndVolume}
            value={config.audio.roundEndVolume}
            min={0}
            max={1}
            step={0.01}
            preview="round"
            onToggle={() =>
              onConfigChange(
                patchAudio(config, {
                  includeRoundEndVolume: !config.audio.includeRoundEndVolume,
                }),
              )
            }
            onValueChange={(roundEndVolume) =>
              onConfigChange(patchAudio(config, { roundEndVolume }))
            }
          />
          <AudioSlider
            label="snd_mapobjective_volume"
            hint="Звуки целей карты (бомба, заложник и т.п.). Превью: прыжок."
            enabled={config.audio.includeObjectiveVolume}
            value={config.audio.objectiveVolume}
            min={0}
            max={1}
            step={0.01}
            preview="jump"
            onToggle={() =>
              onConfigChange(
                patchAudio(config, {
                  includeObjectiveVolume: !config.audio.includeObjectiveVolume,
                }),
              )
            }
            onValueChange={(objectiveVolume) =>
              onConfigChange(patchAudio(config, { objectiveVolume }))
            }
          />
          <AudioSlider
            label="snd_tensecondwarning_volume"
            hint="Предупреждение за 10 секунд до конца раунда."
            enabled={config.audio.includeTenSecWarning}
            value={config.audio.tenSecWarningVolume}
            min={0}
            max={1}
            step={0.01}
            preview="warning"
            onToggle={() =>
              onConfigChange(
                patchAudio(config, {
                  includeTenSecWarning: !config.audio.includeTenSecWarning,
                }),
              )
            }
            onValueChange={(tenSecWarningVolume) =>
              onConfigChange(patchAudio(config, { tenSecWarningVolume }))
            }
          />
          <AudioSlider
            label="snd_deathcamera_volume"
            hint="Звук камеры смерти. Часто ставят 0."
            enabled={config.audio.includeDeathCameraVolume}
            value={config.audio.deathCameraVolume}
            min={0}
            max={1}
            step={0.01}
            preview="thud"
            onToggle={() =>
              onConfigChange(
                patchAudio(config, {
                  includeDeathCameraVolume:
                    !config.audio.includeDeathCameraVolume,
                }),
              )
            }
            onValueChange={(deathCameraVolume) =>
              onConfigChange(patchAudio(config, { deathCameraVolume }))
            }
          />

          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">
            Качество и фокус
          </p>
          <CheckRow
            checked={config.audio.headphoneEq}
            label="snd_headphone_eq 1"
            hint="Эквалайзер под наушники — шаги и выстрелы чётче по направлению."
            onChange={() =>
              onConfigChange(
                patchAudio(config, { headphoneEq: !config.audio.headphoneEq }),
              )
            }
          />
          <CheckRow
            checked={config.audio.muteLoseFocus}
            label="snd_mute_losefocus 1"
            hint="Глушит игру, когда окно CS2 не в фокусе."
            onChange={() =>
              onConfigChange(
                patchAudio(config, {
                  muteLoseFocus: !config.audio.muteLoseFocus,
                }),
              )
            }
          />
          <CheckRow
            checked={config.audio.voiceEnable}
            label="voice_enable 1"
            hint="Включает голосовой чат (базовая настройка)."
            onChange={() =>
              onConfigChange(
                patchAudio(config, { voiceEnable: !config.audio.voiceEnable }),
              )
            }
          />

          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">
            Бинды
          </p>
          <AudioHintRow
            checked={config.audio.includeVoiceKey}
            label="Рация (+voicerecord)"
            hint="Пока зажата — тебя слышат тиммейты."
            onChange={() =>
              onConfigChange(
                patchAudio(config, {
                  includeVoiceKey: !config.audio.includeVoiceKey,
                }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.audio.voiceKey}
              onChange={(voiceKey) =>
                setConfigKey(patchAudio(config, { voiceKey }), voiceKey)
              }
            />
          </AudioHintRow>
          <AudioHintRow
            checked={config.audio.includeVoiceMuteToggle}
            label="Mute voice (toggle)"
            hint="Вкл/выкл голосовой чат одной клавишей."
            onChange={() =>
              onConfigChange(
                patchAudio(config, {
                  includeVoiceMuteToggle: !config.audio.includeVoiceMuteToggle,
                }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.audio.voiceMuteToggleKey}
              onChange={(voiceMuteToggleKey) =>
                setConfigKey(
                  patchAudio(config, { voiceMuteToggleKey }),
                  voiceMuteToggleKey,
                )
              }
            />
          </AudioHintRow>
          <AudioHintRow
            checked={config.audio.includeVolumeUp}
            label="Volume +"
            hint="Поднять общую громкость на 0.05 (incrementvar)."
            onChange={() =>
              onConfigChange(
                patchAudio(config, {
                  includeVolumeUp: !config.audio.includeVolumeUp,
                }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.audio.volumeUpKey}
              onChange={(volumeUpKey) =>
                setConfigKey(patchAudio(config, { volumeUpKey }), volumeUpKey)
              }
            />
          </AudioHintRow>
          <AudioHintRow
            checked={config.audio.includeVolumeDown}
            label="Volume −"
            hint="Понизить общую громкость на 0.05."
            onChange={() =>
              onConfigChange(
                patchAudio(config, {
                  includeVolumeDown: !config.audio.includeVolumeDown,
                }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.audio.volumeDownKey}
              onChange={(volumeDownKey) =>
                setConfigKey(
                  patchAudio(config, { volumeDownKey }),
                  volumeDownKey,
                )
              }
            />
          </AudioHintRow>
        </div>
      )}

      {activeId === 'mouse' && (
        <div className="flex flex-col gap-3">
          <p className="text-[10px] leading-relaxed text-[#4b5563]">
            Sensitivity, raw input, viewmodel и бинды быстрой смены сенсы (AWP /
            clutch).
          </p>

          <p className="text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">
            Мышь
          </p>
          <AudioSlider
            label="sensitivity"
            hint="Основная чувствительность мыши."
            enabled={config.mouse.includeSensitivity}
            value={config.mouse.sensitivity}
            min={0.01}
            max={10}
            step={0.01}
            onToggle={() =>
              onConfigChange(
                patchMouse(config, {
                  includeSensitivity: !config.mouse.includeSensitivity,
                }),
              )
            }
            onValueChange={(sensitivity) =>
              onConfigChange(patchMouse(config, { sensitivity }))
            }
          />
          <AudioSlider
            label="zoom_sensitivity_ratio_mouse"
            hint="Множитель сенсы в прицеле (AWP / scoped)."
            enabled={config.mouse.includeZoomSens}
            value={config.mouse.zoomSens}
            min={0.01}
            max={3}
            step={0.01}
            onToggle={() =>
              onConfigChange(
                patchMouse(config, {
                  includeZoomSens: !config.mouse.includeZoomSens,
                }),
              )
            }
            onValueChange={(zoomSens) =>
              onConfigChange(patchMouse(config, { zoomSens }))
            }
          />
          <CheckRow
            checked={config.mouse.rawInput}
            label="m_rawinput 1"
            hint="Сырой ввод мыши — без ускорения Windows."
            onChange={() =>
              onConfigChange(
                patchMouse(config, { rawInput: !config.mouse.rawInput }),
              )
            }
          />
          <CheckRow
            checked={config.mouse.noAccel}
            label="Без ускорения мыши"
            hint="m_customaccel 0 + m_mouseaccel1/2 0"
            onChange={() =>
              onConfigChange(
                patchMouse(config, { noAccel: !config.mouse.noAccel }),
              )
            }
          />

          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">
            Viewmodel
          </p>
          <AudioSlider
            label="viewmodel_fov"
            hint="Поле обзора модели оружия (54–68)."
            enabled={config.mouse.includeViewmodelFov}
            value={config.mouse.viewmodelFov}
            min={54}
            max={68}
            step={0.5}
            onToggle={() =>
              onConfigChange(
                patchMouse(config, {
                  includeViewmodelFov: !config.mouse.includeViewmodelFov,
                }),
              )
            }
            onValueChange={(viewmodelFov) =>
              onConfigChange(patchMouse(config, { viewmodelFov }))
            }
          />
          <CheckRow
            checked={config.mouse.includeViewmodelOffsets}
            label="viewmodel_offset x/y/z"
            hint="Сдвиг модели оружия. Значения ниже применяются вместе."
            onChange={() =>
              onConfigChange(
                patchMouse(config, {
                  includeViewmodelOffsets: !config.mouse.includeViewmodelOffsets,
                }),
              )
            }
          />
          {config.mouse.includeViewmodelOffsets ? (
            <div className="grid gap-2 sm:grid-cols-3">
              {(
                [
                  { key: 'viewmodelOffsetX' as const, label: 'offset_x' },
                  { key: 'viewmodelOffsetY' as const, label: 'offset_y' },
                  { key: 'viewmodelOffsetZ' as const, label: 'offset_z' },
                ] as const
              ).map((item) => (
                <label
                  key={item.key}
                  className="flex flex-col gap-1 rounded border border-[#2a3340] bg-[#0a0e14] p-2 text-[10px] text-[#9ca3af]"
                >
                  {item.label}
                  <input
                    type="number"
                    step={0.1}
                    value={config.mouse[item.key]}
                    onChange={(e) =>
                      onConfigChange(
                        patchMouse(config, {
                          [item.key]: Number(e.target.value) || 0,
                        }),
                      )
                    }
                    className="rounded border border-[#2a3340] bg-[#0d1117] px-2 py-1 font-mono text-xs text-[#e5e7eb] outline-none focus:border-[var(--accent)]"
                  />
                </label>
              ))}
            </div>
          ) : null}

          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">
            Бинды сенсы
          </p>
          <AudioHintRow
            checked={config.mouse.includeSensLow}
            label="Низкая сенса"
            hint="Поставить запасную sensitivity (удобно под AWP / clutch)."
            onChange={() =>
              onConfigChange(
                patchMouse(config, {
                  includeSensLow: !config.mouse.includeSensLow,
                }),
              )
            }
          >
            <div className="flex flex-col gap-2">
              <KeyField
                label="Клавиша"
                value={config.mouse.sensLowKey}
                onChange={(sensLowKey) =>
                  setConfigKey(patchMouse(config, { sensLowKey }), sensLowKey)
                }
              />
              <label className="flex items-center gap-2 text-[10px] text-[#9ca3af]">
                Значение
                <input
                  type="number"
                  min={0.01}
                  max={10}
                  step={0.01}
                  value={config.mouse.sensLowValue}
                  onChange={(e) =>
                    onConfigChange(
                      patchMouse(config, {
                        sensLowValue: Number(e.target.value) || 0.8,
                      }),
                    )
                  }
                  className="w-24 rounded border border-[#2a3340] bg-[#0d1117] px-2 py-1 font-mono text-xs text-[#e5e7eb] outline-none focus:border-[var(--accent)]"
                />
              </label>
            </div>
          </AudioHintRow>
          <AudioHintRow
            checked={config.mouse.includeSensReset}
            label="Вернуть основную сенсу"
            hint="Ставит обратно sensitivity из слайдера выше."
            onChange={() =>
              onConfigChange(
                patchMouse(config, {
                  includeSensReset: !config.mouse.includeSensReset,
                }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.mouse.sensResetKey}
              onChange={(sensResetKey) =>
                setConfigKey(patchMouse(config, { sensResetKey }), sensResetKey)
              }
            />
          </AudioHintRow>
        </div>
      )}

      {activeId === 'inspect' && (
        <div className="flex flex-col gap-3">
          <p className="text-[10px] leading-relaxed text-[#4b5563]">
            Осмотр скина, выброс оружия и переключение правой/левой руки.
          </p>
          <AudioHintRow
            checked={config.inspect.includeInspect}
            label="Осмотр оружия"
            hint="+lookatweapon — крутить скин, пока зажата клавиша."
            onChange={() =>
              onConfigChange(
                patchInspect(config, {
                  includeInspect: !config.inspect.includeInspect,
                }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.inspect.inspectKey}
              onChange={(inspectKey) =>
                setConfigKey(patchInspect(config, { inspectKey }), inspectKey)
              }
            />
          </AudioHintRow>
          <AudioHintRow
            checked={config.inspect.includeDrop}
            label="Drop оружия"
            hint="Выбросить текущее оружие на землю."
            onChange={() =>
              onConfigChange(
                patchInspect(config, {
                  includeDrop: !config.inspect.includeDrop,
                }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.inspect.dropKey}
              onChange={(dropKey) =>
                setConfigKey(patchInspect(config, { dropKey }), dropKey)
              }
            />
          </AudioHintRow>
          <AudioHintRow
            checked={config.inspect.includeHandToggle}
            label="Смена руки"
            hint="toggle cl_righthand — оружие слева / справа."
            onChange={() =>
              onConfigChange(
                patchInspect(config, {
                  includeHandToggle: !config.inspect.includeHandToggle,
                }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.inspect.handToggleKey}
              onChange={(handToggleKey) =>
                setConfigKey(
                  patchInspect(config, { handToggleKey }),
                  handToggleKey,
                )
              }
            />
          </AudioHintRow>
        </div>
      )}

      {activeId === 'chat' && (
        <div className="flex flex-col gap-4">
          <p className="text-[10px] leading-relaxed text-[#4b5563]">
            Текстовый и голосовой чат: say / say_team, mute голоса и фильтр сообщений. Клавишу
            можно задать справа в «Клавиша бинда» или у каждой опции отдельно.
          </p>

          <div className="flex flex-col gap-2 rounded border border-[#2a3340] bg-[#0a0e14] p-3">
            <CheckRow
              checked={config.chat.includeAll}
              label='bind … "say …"'
              hint="Общий чат: фразу увидят все игроки на сервере, не только тиммейты."
              onChange={() =>
                onConfigChange(
                  patchChat(config, { includeAll: !config.chat.includeAll }),
                )
              }
            />
            {config.chat.includeAll && (
              <div className="grid gap-2 sm:grid-cols-2">
                <KeyField
                  label="Клавиша"
                  value={config.chat.allKey}
                  onChange={(allKey) =>
                    setConfigKey(patchChat(config, { allKey }), allKey)
                  }
                />
                <TextField
                  label="Фраза"
                  value={config.chat.allMessage}
                  placeholder="GG"
                  onChange={(allMessage) =>
                    onConfigChange(patchChat(config, { allMessage }))
                  }
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 rounded border border-[#2a3340] bg-[#0a0e14] p-3">
            <CheckRow
              checked={config.chat.includeTeam}
              label='bind … "say_team …"'
              hint="Чат команды: сообщение видят только игроки вашей стороны."
              onChange={() =>
                onConfigChange(
                  patchChat(config, { includeTeam: !config.chat.includeTeam }),
                )
              }
            />
            {config.chat.includeTeam && (
              <div className="grid gap-2 sm:grid-cols-2">
                <KeyField
                  label="Клавиша"
                  value={config.chat.teamKey}
                  onChange={(teamKey) =>
                    setConfigKey(patchChat(config, { teamKey }), teamKey)
                  }
                />
                <TextField
                  label="Фраза"
                  value={config.chat.teamMessage}
                  placeholder="Hello team"
                  onChange={(teamMessage) =>
                    onConfigChange(patchChat(config, { teamMessage }))
                  }
                />
              </div>
            )}
          </div>

          <AudioHintRow
            checked={config.chat.includeVoiceMute}
            label="toggle voice_enable"
            hint="Включает / выключает весь голосовой чат одной клавишей (mute всех)."
            onChange={() =>
              onConfigChange(
                patchChat(config, {
                  includeVoiceMute: !config.chat.includeVoiceMute,
                }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.chat.voiceMuteKey}
              onChange={(voiceMuteKey) =>
                setConfigKey(patchChat(config, { voiceMuteKey }), voiceMuteKey)
              }
            />
          </AudioHintRow>

          <AudioHintRow
            checked={config.chat.includeIgnoreMsg}
            label="ignoremsg"
            hint="Циклически меняет фильтр чата: все → только команда → никто. Удобно против спама."
            onChange={() =>
              onConfigChange(
                patchChat(config, {
                  includeIgnoreMsg: !config.chat.includeIgnoreMsg,
                }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.chat.ignoreMsgKey}
              onChange={(ignoreMsgKey) =>
                setConfigKey(patchChat(config, { ignoreMsgKey }), ignoreMsgKey)
              }
            />
          </AudioHintRow>
        </div>
      )}

      {activeId === 'quick' && (
        <div className="flex flex-col gap-3">
          <p className="rounded border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-2.5 py-2 text-[10px] leading-relaxed text-[var(--accent-muted)]">
            Клавишу можно задать справа в «Клавиша бинда» — она проставится во все поля
            ниже. Или укажи разную клавишу у каждой команды отдельно.
          </p>
          <AudioHintRow
            checked={config.quick.includeClear}
            label="clear"
            hint="Очищает текст в консоли разработчика. Удобно перед копированием status или просмотром логов."
            onChange={() =>
              onConfigChange(
                patchQuick(config, {
                  includeClear: !config.quick.includeClear,
                }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.quick.clearKey}
              onChange={(clearKey) =>
                setConfigKey(patchQuick(config, { clearKey }), clearKey)
              }
            />
          </AudioHintRow>

          <AudioHintRow
            checked={config.quick.includeStatus}
            label="status"
            hint="Пишет в консоль список игроков на сервере (ник, SteamID, пинг). Нужен для репортов и проверки лобби."
            onChange={() =>
              onConfigChange(
                patchQuick(config, {
                  includeStatus: !config.quick.includeStatus,
                }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.quick.statusKey}
              onChange={(statusKey) =>
                setConfigKey(patchQuick(config, { statusKey }), statusKey)
              }
            />
          </AudioHintRow>

          <AudioHintRow
            checked={config.quick.includeDisconnect}
            label="disconnect"
            hint="Мгновенно отключает вас от текущего сервера и возвращает в меню. Не путать с выходом из CS2."
            onChange={() =>
              onConfigChange(
                patchQuick(config, {
                  includeDisconnect: !config.quick.includeDisconnect,
                }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.quick.disconnectKey}
              onChange={(disconnectKey) =>
                setConfigKey(patchQuick(config, { disconnectKey }), disconnectKey)
              }
            />
          </AudioHintRow>

          <AudioHintRow
            checked={config.quick.includeRetry}
            label="retry"
            hint="Переподключается к последнему серверу. Удобно после обрыва связи или кика по таймауту."
            onChange={() =>
              onConfigChange(
                patchQuick(config, { includeRetry: !config.quick.includeRetry }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.quick.retryKey}
              onChange={(retryKey) =>
                setConfigKey(patchQuick(config, { retryKey }), retryKey)
              }
            />
          </AudioHintRow>

          <AudioHintRow
            checked={config.quick.includePing}
            label="ping"
            hint="Показывает ваш текущий пинг до сервера в консоли."
            onChange={() =>
              onConfigChange(
                patchQuick(config, { includePing: !config.quick.includePing }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.quick.pingKey}
              onChange={(pingKey) =>
                setConfigKey(patchQuick(config, { pingKey }), pingKey)
              }
            />
          </AudioHintRow>

          <AudioHintRow
            checked={config.quick.includeWriteConfig}
            label="host_writeconfig"
            hint="Сохраняет текущие настройки в config.cfg. Полезно после ручных правок в консоли."
            onChange={() =>
              onConfigChange(
                patchQuick(config, {
                  includeWriteConfig: !config.quick.includeWriteConfig,
                }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.quick.writeConfigKey}
              onChange={(writeConfigKey) =>
                setConfigKey(patchQuick(config, { writeConfigKey }), writeConfigKey)
              }
            />
          </AudioHintRow>

          <AudioHintRow
            checked={config.quick.includeExecAutoexec}
            label="exec autoexec.cfg"
            hint="Перезагружает ваш autoexec.cfg без перезапуска игры — подхватывает свежие бинды и cvar."
            onChange={() =>
              onConfigChange(
                patchQuick(config, {
                  includeExecAutoexec: !config.quick.includeExecAutoexec,
                }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.quick.execAutoexecKey}
              onChange={(execAutoexecKey) =>
                setConfigKey(
                  patchQuick(config, { execAutoexecKey }),
                  execAutoexecKey,
                )
              }
            />
          </AudioHintRow>

          <AudioHintRow
            checked={config.quick.includeQuit}
            label="quit"
            hint="Полностью закрывает CS2. По умолчанию выключено — легко нажать случайно."
            onChange={() =>
              onConfigChange(
                patchQuick(config, { includeQuit: !config.quick.includeQuit }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.quick.quitKey}
              onChange={(quitKey) =>
                setConfigKey(patchQuick(config, { quitKey }), quitKey)
              }
            />
          </AudioHintRow>
        </div>
      )}

      {activeId === 'practice' && (
        <div className="flex flex-col gap-3">
          <p className="rounded border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-2.5 py-2 text-[10px] leading-relaxed text-[var(--accent-muted)]">
            Только для локальных / офлайн / workshop-серверов. В официальном MM большинство
            команд не сработает. Сначала вставь блок «Настройки» (там{' '}
            <span className="font-mono font-semibold text-[var(--accent)]">sv_cheats 1</span>
            ), потом «Бинды».
          </p>

          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent-muted)]">
            Базовые
          </p>
          <CheckRow
            checked={config.practice.svCheats}
            label="sv_cheats 1"
            hint="Включает чит-команды: noclip, god, траектория гранат и др. Без этого большинство опций ниже не работают."
            onChange={() =>
              onConfigChange(
                patchPractice(config, { svCheats: !config.practice.svCheats }),
              )
            }
          />

          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[var(--accent-muted)]">
            Время и раунд
          </p>
          <CheckRow
            checked={config.practice.roundTime}
            label="mp_roundtime 60"
            hint="Длинный раунд (60 мин) — больше времени на тренировку без рестарта."
            onChange={() =>
              onConfigChange(
                patchPractice(config, {
                  roundTime: !config.practice.roundTime,
                }),
              )
            }
          />
          <CheckRow
            checked={config.practice.freezeTime}
            label="mp_freezetime 0"
            hint="Убирает фризтайм в начале раунда — сразу можно бегать и стрелять."
            onChange={() =>
              onConfigChange(
                patchPractice(config, {
                  freezeTime: !config.practice.freezeTime,
                }),
              )
            }
          />
          <CheckRow
            checked={config.practice.ignoreRoundWin}
            label="mp_ignore_round_win_conditions 1"
            hint="Раунд не заканчивается по бомбе, таймеру или вайпу — тренируйся без рестарта."
            onChange={() =>
              onConfigChange(
                patchPractice(config, {
                  ignoreRoundWin: !config.practice.ignoreRoundWin,
                }),
              )
            }
          />
          <CheckRow
            checked={config.practice.warmupEnd}
            label="mp_warmup_end"
            hint="Сразу заканчивает разминку и стартует матч. Обычно вставляют один раз."
            onChange={() =>
              onConfigChange(
                patchPractice(config, {
                  warmupEnd: !config.practice.warmupEnd,
                }),
              )
            }
          />

          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[var(--accent-muted)]">
            Деньги и покупка
          </p>
          <CheckRow
            checked={config.practice.maxMoney}
            label="mp_maxmoney 60000"
            hint="Максимальный баланс — можно держать полную закупку всегда."
            onChange={() =>
              onConfigChange(
                patchPractice(config, {
                  maxMoney: !config.practice.maxMoney,
                }),
              )
            }
          />
          <CheckRow
            checked={config.practice.startMoney}
            label="mp_startmoney 60000"
            hint="Стартовые деньги на максимуме — не нужно ждать эко-раунды."
            onChange={() =>
              onConfigChange(
                patchPractice(config, {
                  startMoney: !config.practice.startMoney,
                }),
              )
            }
          />
          <CheckRow
            checked={config.practice.buyAnywhere}
            label="mp_buy_anywhere 1"
            hint="Покупка оружия в любой точке карты, не только в зоне бая."
            onChange={() =>
              onConfigChange(
                patchPractice(config, {
                  buyAnywhere: !config.practice.buyAnywhere,
                }),
              )
            }
          />
          <CheckRow
            checked={config.practice.buyTime}
            label="mp_buytime 60000"
            hint="Почти безлимитное время на покупку в течение раунда."
            onChange={() =>
              onConfigChange(
                patchPractice(config, { buyTime: !config.practice.buyTime }),
              )
            }
          />

          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[var(--accent-muted)]">
            Патроны и гранаты
          </p>
          <CheckRow
            checked={config.practice.infiniteAmmo}
            label="sv_infinite_ammo 1"
            hint="Бесконечные патроны и гранаты — не нужно возвращаться за амуницией."
            onChange={() =>
              onConfigChange(
                patchPractice(config, {
                  infiniteAmmo: !config.practice.infiniteAmmo,
                }),
              )
            }
          />
          <CheckRow
            checked={config.practice.grenadeLimit}
            label="ammo_grenade_limit_total 5"
            hint="Позволяет носить больше гранат сразу (до 5) — удобно для тренировки смоков."
            onChange={() =>
              onConfigChange(
                patchPractice(config, {
                  grenadeLimit: !config.practice.grenadeLimit,
                }),
              )
            }
          />
          <CheckRow
            checked={config.practice.flashbangLimit}
            label="ammo_grenade_limit_flashbang 2"
            hint="Две флешки в инвентаре — как в обычном матче, удобно учить двойные флеши."
            onChange={() =>
              onConfigChange(
                patchPractice(config, {
                  flashbangLimit: !config.practice.flashbangLimit,
                }),
              )
            }
          />
          <CheckRow
            checked={config.practice.grenadeTrajectory}
            label="sv_grenade_trajectory_prac_pipreview 1"
            hint="Показывает траекторию гранаты (practice preview) — учись смокам и флешкам."
            onChange={() =>
              onConfigChange(
                patchPractice(config, {
                  grenadeTrajectory: !config.practice.grenadeTrajectory,
                }),
              )
            }
          />
          <CheckRow
            checked={config.practice.grenadeTrajectoryClassic}
            label="sv_grenade_trajectory 1"
            hint="Классическая линия полёта гранаты + время отображения 10 сек."
            onChange={() =>
              onConfigChange(
                patchPractice(config, {
                  grenadeTrajectoryClassic:
                    !config.practice.grenadeTrajectoryClassic,
                }),
              )
            }
          />

          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[var(--accent-muted)]">
            Попадания
          </p>
          <CheckRow
            checked={config.practice.showImpacts}
            label="sv_showimpacts 1"
            hint="Подсвечивает точки попаданий пуль — видно, куда реально летят выстрелы."
            onChange={() =>
              onConfigChange(
                patchPractice(config, {
                  showImpacts: !config.practice.showImpacts,
                }),
              )
            }
          />
          <CheckRow
            checked={config.practice.showImpactsTime}
            label="sv_showimpacts_time 10"
            hint="Дольше держит маркеры попаданий на карте (10 секунд)."
            onChange={() =>
              onConfigChange(
                patchPractice(config, {
                  showImpactsTime: !config.practice.showImpactsTime,
                }),
              )
            }
          />

          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[var(--accent-muted)]">
            Команды и боты
          </p>
          <CheckRow
            checked={config.practice.limitTeams}
            label="mp_limitteams 0"
            hint="Снимает лимит игроков в командах — удобно набивать ботов на одну сторону."
            onChange={() =>
              onConfigChange(
                patchPractice(config, {
                  limitTeams: !config.practice.limitTeams,
                }),
              )
            }
          />
          <CheckRow
            checked={config.practice.autoTeamBalance}
            label="mp_autoteambalance 0"
            hint="Отключает автобаланс — боты и игроки не перекидываются между командами."
            onChange={() =>
              onConfigChange(
                patchPractice(config, {
                  autoTeamBalance: !config.practice.autoTeamBalance,
                }),
              )
            }
          />
          <CheckRow
            checked={config.practice.botStop}
            label="bot_stop 1"
            hint="Боты замирают на месте при старте. Дальше удобно переключать биндом toggle bot_stop."
            onChange={() =>
              onConfigChange(
                patchPractice(config, { botStop: !config.practice.botStop }),
              )
            }
          />

          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[var(--accent-muted)]">
            Прочее
          </p>
          <CheckRow
            checked={config.practice.dropKnife}
            label="mp_drop_knife_enable 1"
            hint="Можно выбросить нож — удобно для раскидок с дропом."
            onChange={() =>
              onConfigChange(
                patchPractice(config, {
                  dropKnife: !config.practice.dropKnife,
                }),
              )
            }
          />

          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[var(--accent-muted)]">
            Бинды · передвижение
          </p>
          <p className="text-[10px] leading-relaxed text-[#4b5563]">
            Клавишу можно задать справа в «Клавиша бинда» — она проставится во все поля
            ниже. Или укажи разную клавишу у каждой команды.
          </p>
          <AudioHintRow
            checked={config.practice.includeNoclip}
            label="noclip"
            hint="Полёт сквозь стены — быстрый переход по карте между точками раскидки."
            onChange={() =>
              onConfigChange(
                patchPractice(config, {
                  includeNoclip: !config.practice.includeNoclip,
                }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.practice.noclipKey}
              onChange={(noclipKey) =>
                setConfigKey(patchPractice(config, { noclipKey }), noclipKey)
              }
            />
          </AudioHintRow>
          <AudioHintRow
            checked={config.practice.includeGod}
            label="god"
            hint="Бессмертие — боты и гранаты не убивают. Удобно стоять на точке и кидать смоки."
            onChange={() =>
              onConfigChange(
                patchPractice(config, {
                  includeGod: !config.practice.includeGod,
                }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.practice.godKey}
              onChange={(godKey) =>
                setConfigKey(patchPractice(config, { godKey }), godKey)
              }
            />
          </AudioHintRow>

          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[var(--accent-muted)]">
            Бинды · раунд
          </p>
          <AudioHintRow
            checked={config.practice.includeRestart}
            label="mp_restartgame 1"
            hint="Рестарт раунда через 1 сек — сброс экономики и позиций."
            onChange={() =>
              onConfigChange(
                patchPractice(config, {
                  includeRestart: !config.practice.includeRestart,
                }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.practice.restartKey}
              onChange={(restartKey) =>
                setConfigKey(patchPractice(config, { restartKey }), restartKey)
              }
            />
          </AudioHintRow>
          <AudioHintRow
            checked={config.practice.includeKill}
            label="kill"
            hint="Мгновенно убивает вас — быстрый респаун / смена позиции."
            onChange={() =>
              onConfigChange(
                patchPractice(config, {
                  includeKill: !config.practice.includeKill,
                }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.practice.killKey}
              onChange={(killKey) =>
                setConfigKey(patchPractice(config, { killKey }), killKey)
              }
            />
          </AudioHintRow>
          <AudioHintRow
            checked={config.practice.includeRespawn}
            label="mp_respawn_on_death"
            hint="Включает мгновенный респаун после смерти для CT и T (локальная практика)."
            onChange={() =>
              onConfigChange(
                patchPractice(config, {
                  includeRespawn: !config.practice.includeRespawn,
                }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.practice.respawnKey}
              onChange={(respawnKey) =>
                setConfigKey(patchPractice(config, { respawnKey }), respawnKey)
              }
            />
          </AudioHintRow>

          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[var(--accent-muted)]">
            Бинды · боты
          </p>
          <AudioHintRow
            checked={config.practice.includeBotKick}
            label="bot_kick"
            hint="Кикает всех ботов с сервера."
            onChange={() =>
              onConfigChange(
                patchPractice(config, {
                  includeBotKick: !config.practice.includeBotKick,
                }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.practice.botKickKey}
              onChange={(botKickKey) =>
                setConfigKey(patchPractice(config, { botKickKey }), botKickKey)
              }
            />
          </AudioHintRow>
          <AudioHintRow
            checked={config.practice.includeBotAddT}
            label="bot_add_t"
            hint="Добавляет бота за террористов."
            onChange={() =>
              onConfigChange(
                patchPractice(config, {
                  includeBotAddT: !config.practice.includeBotAddT,
                }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.practice.botAddTKey}
              onChange={(botAddTKey) =>
                setConfigKey(patchPractice(config, { botAddTKey }), botAddTKey)
              }
            />
          </AudioHintRow>
          <AudioHintRow
            checked={config.practice.includeBotAddCt}
            label="bot_add_ct"
            hint="Добавляет бота за контр-террористов."
            onChange={() =>
              onConfigChange(
                patchPractice(config, {
                  includeBotAddCt: !config.practice.includeBotAddCt,
                }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.practice.botAddCtKey}
              onChange={(botAddCtKey) =>
                setConfigKey(
                  patchPractice(config, { botAddCtKey }),
                  botAddCtKey,
                )
              }
            />
          </AudioHintRow>
          <AudioHintRow
            checked={config.practice.includeBotPlace}
            label="bot_place"
            hint="Ставит бота прямо перед тобой — удобно для aim и peek-тренировок."
            onChange={() =>
              onConfigChange(
                patchPractice(config, {
                  includeBotPlace: !config.practice.includeBotPlace,
                }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.practice.botPlaceKey}
              onChange={(botPlaceKey) =>
                setConfigKey(patchPractice(config, { botPlaceKey }), botPlaceKey)
              }
            />
          </AudioHintRow>
          <AudioHintRow
            checked={config.practice.includeToggleBotStop}
            label="toggle bot_stop"
            hint="Вкл/выкл заморозку ботов одной клавишей — не нужно лезть в консоль."
            onChange={() =>
              onConfigChange(
                patchPractice(config, {
                  includeToggleBotStop: !config.practice.includeToggleBotStop,
                }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.practice.toggleBotStopKey}
              onChange={(toggleBotStopKey) =>
                setConfigKey(
                  patchPractice(config, { toggleBotStopKey }),
                  toggleBotStopKey,
                )
              }
            />
          </AudioHintRow>
          <AudioHintRow
            checked={config.practice.includeBotMimic}
            label="toggle bot_mimic"
            hint="Бот копирует твои движения и броски — удобно учить тиммейт-смоки."
            onChange={() =>
              onConfigChange(
                patchPractice(config, {
                  includeBotMimic: !config.practice.includeBotMimic,
                }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.practice.botMimicKey}
              onChange={(botMimicKey) =>
                setConfigKey(patchPractice(config, { botMimicKey }), botMimicKey)
              }
            />
          </AudioHintRow>

          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[var(--accent-muted)]">
            Бинды · гранаты
          </p>
          <AudioHintRow
            checked={config.practice.includeRethrow}
            label="sv_rethrow_last_grenade"
            hint="Повторяет последнюю брошенную гранату — крутить раскидку без перекидывания."
            onChange={() =>
              onConfigChange(
                patchPractice(config, {
                  includeRethrow: !config.practice.includeRethrow,
                }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.practice.rethrowKey}
              onChange={(rethrowKey) =>
                setConfigKey(patchPractice(config, { rethrowKey }), rethrowKey)
              }
            />
          </AudioHintRow>
          <AudioHintRow
            checked={config.practice.includeClearSmokes}
            label="ent_fire … kill (смоки)"
            hint="Удаляет активные смоки с карты. Нужен sv_cheats; на некоторых серверах может не сработать."
            onChange={() =>
              onConfigChange(
                patchPractice(config, {
                  includeClearSmokes: !config.practice.includeClearSmokes,
                }),
              )
            }
          >
            <KeyField
              label="Клавиша"
              value={config.practice.clearSmokesKey}
              onChange={(clearSmokesKey) =>
                setConfigKey(
                  patchPractice(config, { clearSmokesKey }),
                  clearSmokesKey,
                )
              }
            />
          </AudioHintRow>

          <PracticeBhopBlock
            cfg={config.practice}
            onPatch={(patch) => onConfigChange(patchPractice(config, patch))}
          />
        </div>
      )}
    </div>
  )
}

/** Utilities tab: multi-select cards, combined output in sidebar */
export function UtilitiesPanel({
  view,
  selectedIds,
  activeId,
  onOpen,
  config,
  onConfigChange,
  bindKey,
  onBindKeyChange,
  searchHighlight = null,
}: UtilitiesPanelProps) {
  const m = useMessages()

  if (view === 'detail' && activeId) {
    return (
      <div className="flex w-full flex-col gap-4">
        <ActiveSettings
          activeId={activeId}
          config={config}
          onConfigChange={onConfigChange}
          bindKey={bindKey}
          onBindKeyChange={onBindKeyChange}
          spotlight={isUtilitySearchHighlight(searchHighlight, activeId)}
        />
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <p className="text-center text-[10px] text-[#4b5563]">{m.utilHome.tip}</p>

      <div className="rounded-lg border border-[#2a3340] bg-[#0d1117] p-3">
        <p className="mb-1 text-center text-[10px] font-bold uppercase tracking-widest text-[var(--accent-muted)]">
          {m.utilHome.settingsTitle}
        </p>
        <p className="mb-3 text-center text-xs font-medium leading-relaxed text-white">
          {m.utilHome.settingsHint}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {SETTINGS_ORDER.map((id) => (
            <UtilityCard
              key={id}
              id={id}
              selected={selectedIds.includes(id)}
              onOpen={() => onOpen(id)}
              spotlight={isUtilitySearchHighlight(searchHighlight, id)}
            />
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-[#2a3340] bg-[#0d1117] p-3">
        <p className="mb-1 text-center text-[10px] font-bold uppercase tracking-widest text-[var(--accent-muted)]">
          {m.utilHome.bindsTitle}
        </p>
        <p className="mb-3 text-center text-xs font-medium leading-relaxed text-white">
          {m.utilHome.bindsHint}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {BIND_ORDER.map((id) => (
            <UtilityCard
              key={id}
              id={id}
              selected={selectedIds.includes(id)}
              onOpen={() => onOpen(id)}
              spotlight={isUtilitySearchHighlight(searchHighlight, id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
