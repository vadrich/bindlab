import { NOVA_ICON_PATH, NOVA_ICON_VIEWBOX } from '../assets/icons/novaPath'

interface WeaponIconProps {
  name: string
  className?: string
}

/** Inline SVG weapon silhouettes in CS2 buy-menu style */
export function WeaponIcon({ name, className = 'h-8 w-full text-white' }: WeaponIconProps) {
  switch (name) {
    case 'nova':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={NOVA_ICON_VIEWBOX}
          fill="none"
          aria-hidden="true"
          shapeRendering="geometricPrecision"
          className={className}
        >
          <path fill="currentColor" d={NOVA_ICON_PATH} />
        </svg>
      )
    default:
      return null
  }
}
