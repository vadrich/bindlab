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
                    'group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border bg-black transition-all',
                    searchSpotlightClass(pulse),
                    active
                      ? 'border-[var(--accent)] shadow-[var(--accent-glow)]'
                      : 'border-[#2a3340] hover:border-[var(--accent)]/50',
                  ].join(' ')}
                >
                  <img
                    src={ICON_SRC[id]}
                    alt=""
                    draggable={false}
                    className="relative z-[1] h-[88%] w-[88%] object-contain"
                  />
                </button>
              )}
            </InstructionContextMenu>
            <span
              className={[
                'text-center text-[10px] font-semibold leading-tight tracking-wide',
                active ? 'text-[var(--accent)]' : 'text-[#7a8494]',
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
