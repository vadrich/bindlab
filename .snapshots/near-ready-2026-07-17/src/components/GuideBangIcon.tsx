/** Guide “!” — SVG so it sits optically centered in the circle. */
export function GuideBangIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={14}
      height={14}
      className={className}
      aria-hidden
      focusable="false"
    >
      <rect x="6.85" y="1.6" width="2.3" height="8.6" rx="1.15" fill="currentColor" />
      <circle cx="8" cy="13.15" r="1.45" fill="currentColor" />
    </svg>
  )
}
