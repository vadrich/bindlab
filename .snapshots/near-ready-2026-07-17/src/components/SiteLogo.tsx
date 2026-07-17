/** Site mark: keycap + crosshair. Color via `currentColor` (follows tab accent). */
export function SiteLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      width={36}
      height={36}
      className={className}
      aria-hidden
      focusable="false"
    >
      <rect width="512" height="512" rx="112" fill="#0a0e14" />

      {/* rounded frame */}
      <rect
        x="56"
        y="56"
        width="400"
        height="400"
        rx="92"
        fill="none"
        stroke="currentColor"
        strokeWidth="26"
      />

      {/* keycap top face */}
      <path
        d="
          M168 176
          C168 158 182 146 200 146
          H312
          C330 146 344 158 344 176
          V236
          C344 254 330 266 312 266
          H200
          C182 266 168 254 168 236
          Z
        "
        fill="none"
        stroke="currentColor"
        strokeWidth="20"
        strokeLinejoin="round"
      />

      {/* keycap body / depth */}
      <path
        d="
          M168 236
          L152 318
          C152 336 166 350 186 350
          H326
          C346 350 360 336 360 318
          L344 236
        "
        fill="none"
        stroke="currentColor"
        strokeWidth="20"
        strokeLinejoin="round"
      />

      {/* front lip */}
      <path
        d="M152 318 H360"
        fill="none"
        stroke="currentColor"
        strokeWidth="16"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* crosshair on face */}
      <g stroke="currentColor" strokeWidth="16" strokeLinecap="round" fill="none">
        <line x1="256" y1="164" x2="256" y2="188" />
        <line x1="256" y1="224" x2="256" y2="248" />
        <line x1="208" y1="206" x2="232" y2="206" />
        <line x1="280" y1="206" x2="304" y2="206" />
      </g>
      <circle cx="256" cy="206" r="8" fill="currentColor" />
    </svg>
  )
}
