import { useEffect, useRef, useState } from 'react'
import { useMessages } from '../i18n/I18nProvider'
import {
  cs2KeyFromKeyboardEvent,
  cs2KeyFromMouseButton,
  cs2KeyFromWheelDelta,
} from '../utils/cs2KeyFromEvent'

interface BindKeyCaptureProps {
  value: string
  onChange: (key: string) => void
  placeholder?: string
  /** Compact style for utility card fields */
  compact?: boolean
  className?: string
}

/**
 * Type a CS2 key name, or click «Listen» and press any key / mouse / wheel.
 * Escape cancels listening without changing the value.
 */
export function BindKeyCapture({
  value,
  onChange,
  placeholder = '',
  compact = false,
  className = '',
}: BindKeyCaptureProps) {
  const m = useMessages()
  const [listening, setListening] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const armIgnoreRef = useRef(0)

  useEffect(() => {
    if (!listening) return

    const finish = (key: string) => {
      onChange(key)
      setListening(false)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.key === 'Escape') {
        setListening(false)
        return
      }
      const mapped = cs2KeyFromKeyboardEvent(e)
      if (mapped) finish(mapped)
    }

    const onMouseDown = (e: MouseEvent) => {
      // Ignore the click that armed listening on the Listen button.
      if (Date.now() < armIgnoreRef.current) return
      e.preventDefault()
      e.stopPropagation()
      const mapped = cs2KeyFromMouseButton(e.button)
      if (mapped) finish(mapped)
    }

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const mapped = cs2KeyFromWheelDelta(e.deltaY)
      if (mapped) finish(mapped)
    }

    window.addEventListener('keydown', onKeyDown, true)
    window.addEventListener('mousedown', onMouseDown, true)
    window.addEventListener('contextmenu', onContextMenu, true)
    window.addEventListener('wheel', onWheel, { capture: true, passive: false })

    return () => {
      window.removeEventListener('keydown', onKeyDown, true)
      window.removeEventListener('mousedown', onMouseDown, true)
      window.removeEventListener('contextmenu', onContextMenu, true)
      window.removeEventListener('wheel', onWheel, true)
    }
  }, [listening, onChange])

  const toggleListen = () => {
    if (listening) {
      setListening(false)
      return
    }
    armIgnoreRef.current = Date.now() + 350
    setListening(true)
  }

  const inputClass = [
    'min-w-0 flex-1 rounded-lg border font-mono outline-none transition-all duration-200',
    compact ? 'px-2 py-1.5 text-xs' : 'px-3 py-2 text-sm',
    listening
      ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-transparent caret-transparent shadow-[0_0_16px_rgba(var(--accent-rgb),0.25)]'
      : 'border-white/10 bg-black/40 text-white focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(var(--accent-rgb),0.15)]',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const btnClass = [
    'shrink-0 rounded-lg border font-semibold uppercase tracking-wide transition-all duration-200',
    compact ? 'px-2 py-1.5 text-[10px]' : 'px-3 py-2 text-xs',
    listening
      ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-on)] shadow-[var(--accent-glow)]'
      : 'border-white/10 text-[var(--text-muted)] hover:border-[rgba(var(--accent-rgb),0.5)] hover:text-[var(--accent)] hover:shadow-[0_0_12px_rgba(var(--accent-rgb),0.2)]',
  ].join(' ')

  return (
    <div ref={wrapRef} className={compact ? '' : 'mb-3'}>
      <div className="relative flex gap-2">
        <div className="relative min-w-0 flex-1">
          <input
            type="text"
            value={listening ? '' : value}
            readOnly={listening}
            placeholder={listening ? '' : placeholder}
            onChange={(e) => {
              if (!listening) onChange(e.target.value.trim())
            }}
            className={inputClass}
            aria-label={m.sidebar.bindKey}
            autoComplete="off"
            spellCheck={false}
          />
          {listening && (
            <p
              className={[
                'pointer-events-none absolute inset-0 flex items-center px-3 font-mono text-[var(--accent)]',
                compact ? 'text-xs' : 'text-sm',
              ].join(' ')}
            >
              {m.sidebar.pressKey}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={toggleListen}
          className={btnClass}
          aria-pressed={listening}
          title={m.sidebar.pressKeyHint}
        >
          {listening ? m.sidebar.listeningCancel : m.sidebar.listenKey}
        </button>
      </div>
      {(listening || !compact) && (
        <p
          className={[
            'text-[#4b5563]',
            compact ? 'mt-1 text-[9px] leading-snug' : 'mt-1.5 text-[10px] leading-relaxed',
          ].join(' ')}
        >
          {listening ? m.sidebar.pressKeyHint : m.sidebar.listenKeyHint}
        </p>
      )}
    </div>
  )
}
