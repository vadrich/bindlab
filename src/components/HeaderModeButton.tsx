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
            'group relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 bg-[color-mix(in_srgb,var(--panel-inner)_80%,transparent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-300 ease-out hover:scale-[1.06]',
            searchSpotlightClass(searchPulse),
            active ? `${accentClass} scale-[1.04]` : idleBorderClass,
          ].join(' ')}
        >
          <span
            className={[
              'pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-300',
              active ? 'opacity-100' : 'group-hover:opacity-60',
            ].join(' ')}
            aria-hidden
          />
          <img
            src={iconSrc}
            alt=""
            draggable={false}
            className="relative z-[1] h-[70%] w-[70%] object-contain drop-shadow-[0_0_8px_rgba(0,0,0,0.4)]"
          />
          {badge > 0 && (
            <span className="absolute -right-1 -top-1 z-[1] flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d28dff] px-0.5 text-[9px] font-bold text-black shadow-[0_0_10px_rgba(210,141,255,0.7)]">
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
  profile: 'border-[#b8f03c] shadow-[0_0_20px_rgba(184,240,60,0.5)]',
  notifications: 'border-[#d28dff] shadow-[0_0_20px_rgba(210,141,255,0.5)]',
}

export const HEADER_MODE_IDLE: Record<
  Extract<ArsenalTab, 'profile' | 'notifications'>,
  string
> = {
  profile: 'border-[#b8f03c]/50 hover:border-[#b8f03c] hover:shadow-[0_0_16px_rgba(184,240,60,0.35)]',
  notifications: 'border-[#d28dff]/50 hover:border-[#d28dff] hover:shadow-[0_0_16px_rgba(210,141,255,0.35)]',
}
