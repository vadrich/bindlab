import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { useMessages } from '../i18n/I18nProvider'
import type { TabTipKind } from '../utils/tabTips'

interface InstructionContextMenuProps {
  /** Tab color for the menu item */
  theme: TabTipKind
  /** Called when user picks “View instruction”. */
  onViewInstruction: () => void
  children: (handlers: {
    onContextMenu: (e: ReactMouseEvent) => void
  }) => ReactNode
}

/** Right-click → “View instruction” menu for tab icons (colored by tab). */
export function InstructionContextMenu({
  theme,
  onViewInstruction,
  children,
}: InstructionContextMenuProps) {
  const m = useMessages()
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!pos) return
    const close = () => setPos(null)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    const onDown = (e: globalThis.MouseEvent) => {
      if (menuRef.current?.contains(e.target as Node)) return
      close()
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('scroll', close, true)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('scroll', close, true)
    }
  }, [pos])

  const onContextMenu = (e: ReactMouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const pad = 8
    const w = 240
    const h = 48
    const x = Math.min(e.clientX, window.innerWidth - w - pad)
    const y = Math.min(e.clientY, window.innerHeight - h - pad)
    setPos({ x: Math.max(pad, x), y: Math.max(pad, y) })
  }

  return (
    <>
      {children({ onContextMenu })}
      {pos &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            data-theme={theme}
            className="fixed z-[80] min-w-[200px] rounded-lg border-2 bg-[#1a1f28] py-1 shadow-2xl shadow-black/60"
            style={{
              left: pos.x,
              top: pos.y,
              borderColor: 'var(--accent)',
              boxShadow: 'var(--accent-glow), 0 12px 40px rgba(0,0,0,0.55)',
            }}
          >
            <button
              type="button"
              role="menuitem"
              className="block w-full px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wide transition-opacity hover:opacity-90"
              style={{
                color: 'var(--accent-on)',
                background: 'var(--accent)',
              }}
              onClick={() => {
                setPos(null)
                onViewInstruction()
              }}
            >
              {m.tips.viewInstruction}
            </button>
          </div>,
          document.body,
        )}
    </>
  )
}
