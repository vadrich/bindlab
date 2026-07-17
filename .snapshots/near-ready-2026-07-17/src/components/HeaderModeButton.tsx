import type { ArsenalTab } from '../types/modes'
import { searchSpotlightClass } from '../utils/searchHighlight'
import { InstructionContextMenu } from './InstructionContextMenu'

interface HeaderModeButtonProps {
  id: 'profile' | 'notifications'
  label: string
  active: boolean
  onClick: () => void
  onViewInstruction: () => void
  badge?: number
  /** Border / glow when active */
  accentClass: string
  /** Idle border color matching the icon */
  idleBorderClass: string
  iconSrc: string
  instructionTitle: string
  searchPulse?: boolean
}

/** Frame-only control: colored border, transparent fill, colored icon. */
export function HeaderModeButton({
  id,
  label,
  active,
  onClick,
  onViewInstruction,
  badge = 0,
  accentClass,
  idleBorderClass,
  iconSrc,
  instructionTitle,
  searchPulse = false,
}: HeaderModeButtonProps) {
  return (
    <InstructionContextMenu theme={id} onViewInstruction={onViewInstruction}>
      {({ onContextMenu }) => (
        <button
          type="button"
          onClick={onClick}
          onContextMenu={onContextMenu}
          title={`${label} · ${instructionTitle}`}
          aria-label={label}
          aria-pressed={active}
          className={[
            'relative flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border-2 bg-transparent transition-all',
            searchSpotlightClass(searchPulse),
            active ? accentClass : idleBorderClass,
          ].join(' ')}
        >
          <img
            src={iconSrc}
            alt=""
            draggable={false}
            className="h-[70%] w-[70%] object-contain"
          />
          {badge > 0 && (
            <span className="absolute -right-1 -top-1 z-[1] flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c084fc] px-0.5 text-[9px] font-bold text-black">
              {badge > 9 ? '9+' : badge}
            </span>
          )}
        </button>
      )}
    </InstructionContextMenu>
  )
}

export const HEADER_MODE_ACCENT: Record<
  Extract<ArsenalTab, 'profile' | 'notifications'>,
  string
> = {
  profile: 'border-[#a3e635] shadow-[0_0_14px_rgba(163,230,53,0.4)]',
  notifications: 'border-[#c084fc] shadow-[0_0_14px_rgba(192,132,252,0.4)]',
}

export const HEADER_MODE_IDLE: Record<
  Extract<ArsenalTab, 'profile' | 'notifications'>,
  string
> = {
  profile: 'border-[#a3e635]/55 hover:border-[#a3e635]',
  notifications: 'border-[#c084fc]/55 hover:border-[#c084fc]',
}
