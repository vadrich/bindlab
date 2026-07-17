/**
 * Map browser keyboard / mouse / wheel events to CS2 (Source) bind key names.
 * Single physical key only — modifiers like Alt are bind keys themselves.
 */

const CODE_TO_CS2: Record<string, string> = {
  Space: 'space',
  Tab: 'tab',
  Enter: 'enter',
  Escape: 'escape',
  Backspace: 'backspace',
  CapsLock: 'capslock',
  ScrollLock: 'scrolllock',
  Pause: 'pause',
  Insert: 'ins',
  Delete: 'del',
  Home: 'home',
  End: 'end',
  PageUp: 'pgup',
  PageDown: 'pgdn',
  ArrowUp: 'uparrow',
  ArrowDown: 'downarrow',
  ArrowLeft: 'leftarrow',
  ArrowRight: 'rightarrow',
  ShiftLeft: 'shift',
  ShiftRight: 'rshift',
  ControlLeft: 'ctrl',
  ControlRight: 'rctrl',
  AltLeft: 'alt',
  AltRight: 'ralt',
  MetaLeft: 'win',
  MetaRight: 'rwin',
  ContextMenu: 'app',
  Semicolon: 'semicolon',
  Quote: "'",
  Comma: ',',
  Period: '.',
  Slash: '/',
  Backslash: '\\',
  BracketLeft: '[',
  BracketRight: ']',
  Minus: '-',
  Equal: '=',
  Backquote: '`',
  IntlBackslash: '\\',
  NumpadDivide: 'kp_slash',
  NumpadMultiply: 'kp_multiply',
  NumpadSubtract: 'kp_minus',
  NumpadAdd: 'kp_plus',
  NumpadEnter: 'kp_enter',
  NumpadDecimal: 'kp_del',
  Numpad0: 'kp_ins',
  Numpad1: 'kp_end',
  Numpad2: 'kp_downarrow',
  Numpad3: 'kp_pgdn',
  Numpad4: 'kp_leftarrow',
  Numpad5: 'kp_5',
  Numpad6: 'kp_rightarrow',
  Numpad7: 'kp_home',
  Numpad8: 'kp_uparrow',
  Numpad9: 'kp_pgup',
}

/** Keyboard → CS2 key name, or null if unmappable. */
export function cs2KeyFromKeyboardEvent(e: KeyboardEvent): string | null {
  const { code } = e

  if (CODE_TO_CS2[code]) return CODE_TO_CS2[code]

  if (/^Key[A-Z]$/.test(code)) return code.slice(3).toLowerCase()
  if (/^Digit[0-9]$/.test(code)) return code.slice(5)
  if (/^F([1-9]|1[0-2])$/.test(code)) return code.toLowerCase()

  // Fallback: printable single character (layout-dependent)
  if (e.key.length === 1 && e.key !== ' ') return e.key.toLowerCase()

  return null
}

/** Mouse button → CS2 key (mouse1–mouse5). */
export function cs2KeyFromMouseButton(button: number): string | null {
  switch (button) {
    case 0:
      return 'mouse1'
    case 1:
      return 'mouse3'
    case 2:
      return 'mouse2'
    case 3:
      return 'mouse4'
    case 4:
      return 'mouse5'
    default:
      return null
  }
}

/** Wheel → mwheelup / mwheeldown. */
export function cs2KeyFromWheelDelta(deltaY: number): string | null {
  if (deltaY < 0) return 'mwheelup'
  if (deltaY > 0) return 'mwheeldown'
  return null
}
