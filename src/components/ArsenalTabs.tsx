import { useMessages } from '../i18n/I18nProvider'
import { ARSENAL_TABS, type ArsenalTab } from '../types/modes'
import type { SearchTarget } from '../data/configSearch'
import { isTabSearchHighlight, searchSpotlightClass } from '../utils/searchHighlight'
import { InstructionContextMenu } from './InstructionContextMenu'

interface ArsenalTabsProps {
  tab: ArsenalTab | null
  onChange: (tab: ArsenalTab) => void
  onViewInstruction: (tab: Extract<ArsenalTab, 'weapons' | 'utilities' | 'unbind'>) => void
  searchHighlight?: SearchTarget | null
}

const ICON_SRC: Record<'weapons' | 'utilities' | 'unbind', string> = {
  weapons: '/icons/weapons.png',
  utilities: '/icons/utilities.png',
  unbind: '/icons/unbind.png',
}

/** Mode tiles: full icons in squares, labels underneath */
export function ArsenalTabs({ tab, onChange, onViewInstruction, searchHighlight = null }: ArsenalTabsProps) {
  const m = useMessages()

  return (
    <div className="flex w-[88px] shrink-0 flex-col gap-4">
      {ARSENAL_TABS.map((item) => {
        const active = tab === item.id
        const label = m.tabs[item.id]
        const id = item.id as 'weapons' | 'utilities' | 'unbind'
        const pulse = isTabSearchHighlight(searchHighlight, item.id)

        return (
          <div key={item.id} className="flex flex-col items-center gap-2">
            <InstructionContextMenu
              theme={id}
              onViewInstruction={() => onViewInstruction(id)}
            >
              {({ onContextMenu }) => (
                <button
                  type="button"
                  onClick={() => onChange(item.id)}
                  onContextMenu={onContextMenu}
                  title={`${label} · ${m.tips.viewInstruction}`}
                  className={[
                    'group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border bg-black/80 transition-all duration-300 ease-out',
                    searchSpotlightClass(pulse),
                    active
                      ? 'tab-active-glow scale-[1.04] border-[var(--accent)]'
                      : 'border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:scale-[1.03] hover:border-[rgba(var(--accent-rgb),0.45)] hover:shadow-[0_0_14px_rgba(var(--accent-rgb),0.18)]',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'pointer-events-none absolute inset-0 bg-gradient-to-br from-[rgba(var(--accent-rgb),0.25)] via-transparent to-transparent opacity-0 transition-opacity duration-300',
                      active ? 'opacity-100' : 'group-hover:opacity-70',
                    ].join(' ')}
                    aria-hidden
                  />
                  <img
                    src={ICON_SRC[id]}
                    alt=""
                    draggable={false}
                    className="relative z-[1] h-[88%] w-[88%] object-contain transition-transform duration-300 group-hover:scale-[1.06]"
                  />
                </button>
              )}
            </InstructionContextMenu>
            <span
              className={[
                'text-center text-[10px] font-bold leading-tight tracking-wide transition-all duration-300',
                active
                  ? 'text-[var(--accent)] drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.55)]'
                  : 'text-[var(--text-dim)]',
              ].join(' ')}
            >
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
