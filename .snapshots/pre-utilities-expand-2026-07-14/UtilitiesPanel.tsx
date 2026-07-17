import {

  NET_DISPLAY_PRESET_LABELS,

  SHOW_FPS_LEVEL_LABELS,

  SHOW_FPS_LEVELS,

  type NetDisplayConfig,

  type NetDisplayMode,

  type NetDisplayPreset,

  type ShowFpsLevel,

} from '../data/netDisplay'



interface UtilitiesPanelProps {

  selected: boolean

  onSelect: () => void

  config: NetDisplayConfig

  onConfigChange: (next: NetDisplayConfig) => void

  bindKey: string

  onBindKeyChange: (key: string) => void

}



const PRESETS = Object.keys(NET_DISPLAY_PRESET_LABELS) as NetDisplayPreset[]



const MODE_OPTIONS: { id: NetDisplayMode; label: string }[] = [

  { id: 'toggle', label: 'Обычное нажатие' },

  { id: 'advanced', label: 'Расширенные' },

]



/** Utilities tab: network display card with expand options */

export function UtilitiesPanel({

  selected,

  onSelect,

  config,

  onConfigChange,

  bindKey,

  onBindKeyChange,

}: UtilitiesPanelProps) {

  const tabSelected = (bindKey.trim() || 'tab').toLowerCase() === 'tab'

  return (

    <div className="flex max-w-xl flex-col gap-3">

      <button

        type="button"

        onClick={onSelect}

        className={[

          'flex w-44 flex-col overflow-hidden rounded-lg border text-left transition-colors',

          selected

            ? 'border-[var(--accent)]/80 bg-[var(--accent-soft)] shadow-[var(--accent-glow)]'

            : 'border-[#2a3340] bg-[#0d1117] hover:border-[var(--accent)]/50',

        ].join(' ')}

      >

        <div className="flex aspect-square items-center justify-center bg-black p-3">

          <img

            src="/icons/net-display.png"

            alt=""

            draggable={false}

            className="h-full w-full object-contain"

          />

        </div>

        <span

          className={[

            'border-t border-[#2a3340] px-2 py-2 text-center text-[11px] font-semibold leading-tight',

            selected ? 'text-[var(--accent-muted)]' : 'text-[#9ca3af]',

          ].join(' ')}

        >

          Отображение сети

        </span>

      </button>



      {selected && (

        <div className="rounded-lg border border-[#2a3340] bg-[#0d1117] p-4">

          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">

            Настройки бинда

          </p>



          <p className="mb-2 text-xs text-[#9ca3af]">Режим</p>

          <div className="mb-4 flex flex-wrap gap-2">

            {MODE_OPTIONS.map((opt) => (

              <button

                key={opt.id}

                type="button"

                onClick={() => onConfigChange({ ...config, mode: opt.id })}

                className={[

                  'rounded border px-3 py-1.5 text-xs transition-colors',

                  config.mode === opt.id

                    ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-muted)]'

                    : 'border-[#2a3340] text-[#9ca3af] hover:border-[var(--accent)]/50',

                ].join(' ')}

              >

                {opt.label}

              </button>

            ))}

          </div>



          {config.mode === 'toggle' ? (

            <>

              <p className="mb-2 text-xs text-[#9ca3af]">Что показывать</p>

              <div className="flex flex-col gap-2">

                {PRESETS.map((preset) => (

                  <label

                    key={preset}

                    className="flex cursor-pointer items-center gap-2 text-xs text-[#c4c9d1]"

                  >

                    <input

                      type="radio"

                      name="net-display-preset"

                      checked={config.preset === preset}

                      onChange={() => onConfigChange({ ...config, preset })}

                      className="accent-[var(--accent)]"

                    />

                    {NET_DISPLAY_PRESET_LABELS[preset]}

                  </label>

                ))}

              </div>

              <p className="mt-3 text-[10px] leading-relaxed text-[#4b5563]">

                Телеметрия CS2. Повторное нажатие — вкл/выкл. Справа одна строка для консоли (~).

              </p>

            </>

          ) : (

            <>

              <p className="mb-2 text-xs text-[#9ca3af]">

                Показать при зажатии клавиши

              </p>

              <div className="mb-4 flex flex-col gap-2">

                {SHOW_FPS_LEVELS.map((level) => (

                  <label

                    key={level}

                    className="flex cursor-pointer items-center gap-2 text-xs text-[#c4c9d1]"

                  >

                    <input

                      type="radio"

                      name="net-showfps-level"

                      checked={config.showFpsLevel === level}

                      onChange={() =>

                        onConfigChange({

                          ...config,

                          showFpsLevel: level as ShowFpsLevel,

                        })

                      }

                      className="accent-[var(--accent)]"

                    />

                    {SHOW_FPS_LEVEL_LABELS[level]}

                  </label>

                ))}

              </div>



              <p className="mb-2 text-xs text-[#9ca3af]">Клавиша</p>

              <p className="mb-2 text-[10px] leading-relaxed text-[#6b7280]">

                Рекомендуемая клавиша —{' '}

                <span className="font-mono text-[var(--accent-muted)]">Tab</span> (удобно

                смотреть вместе со счётом)

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

                Пока держишь клавишу — выбранный cl_showfps, отпустил — скрыто. Крупный оверлей

                посередине экрана; удобнее смотреть коротко.

              </p>

            </>

          )}

        </div>

      )}

    </div>

  )

}

