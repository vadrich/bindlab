'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth'
import { getFirebaseAuth, isFirebaseConfigured } from '../firebase'

const GUEST_STORAGE_KEY = 'bindlab.guest'

function readGuestFlag(): boolean {
  try {
    return sessionStorage.getItem(GUEST_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function writeGuestFlag(on: boolean) {
  try {
    if (on) sessionStorage.setItem(GUEST_STORAGE_KEY, '1')
    else sessionStorage.removeItem(GUEST_STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

interface AuthContextValue {
  configured: boolean
  ready: boolean
  user: User | null
  /** Local trial session — unlocks the site, not a Firebase account. */
  isGuest: boolean
  /** Google user or guest trial — enough to dismiss the welcome gate. */
  hasAccess: boolean
  busy: boolean
  error: string | null
  clearError: () => void
  signInGoogle: () => Promise<void>
  enterAsGuest: () => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function mapAuthError(code: string | undefined, fallback: string): string {
  switch (code) {
    case 'auth/popup-closed-by-user':
      return 'auth.errorPopupClosed'
    case 'auth/popup-blocked':
      return 'auth.errorPopupBlocked'
    case 'auth/too-many-requests':
      return 'auth.errorTooMany'
    case 'auth/network-request-failed':
      return 'auth.errorNetwork'
    case 'auth/operation-not-allowed':
      return 'auth.errorNotAllowed'
    case 'auth/unauthorized-domain':
      return 'auth.errorUnauthorizedDomain'
    case 'auth/user-disabled':
      return 'auth.errorUserDisabled'
    default:
      return fallback
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isFirebaseConfigured()
  const [ready, setReady] = useState(!configured)
  const [user, setUser] = useState<User | null>(null)
  const [isGuest, setIsGuest] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsGuest(readGuestFlag())
  }, [])

  useEffect(() => {
    const auth = getFirebaseAuth()
    if (!auth) {
      setReady(true)
      return
    }
    const unsub = onAuthStateChanged(auth, (next) => {
      setUser(next)
      if (next) {
        writeGuestFlag(false)
        setIsGuest(false)
      }
      setReady(true)
    })
    return unsub
  }, [])

  const clearError = useCallback(() => setError(null), [])

  const run = useCallback(async (fn: () => Promise<void>): Promise<boolean> => {
    const auth = getFirebaseAuth()
    if (!auth) {
      setError('auth.errorNotConfigured')
      return false
    }
    setBusy(true)
    setError(null)
    try {
      await fn()
      return true
    } catch (err) {
      const code =
        err && typeof err === 'object' && 'code' in err
          ? String((err as { code?: string }).code)
          : undefined
      setError(mapAuthError(code, 'auth.errorGeneric'))
      return false
    } finally {
      setBusy(false)
    }
  }, [])

  const signInGoogle = useCallback(async () => {
    await run(async () => {
      const auth = getFirebaseAuth()!
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })
      await signInWithPopup(auth, provider)
      writeGuestFlag(false)
      setIsGuest(false)
    })
  }, [run])

  const enterAsGuest = useCallback(() => {
    clearError()
    writeGuestFlag(true)
    setIsGuest(true)
  }, [clearError])

  const signOut = useCallback(async () => {
    writeGuestFlag(false)
    setIsGuest(false)
    if (!user) return
    await run(async () => {
      const auth = getFirebaseAuth()!
      await firebaseSignOut(auth)
    })
  }, [run, user])

  const hasAccess = Boolean(user) || isGuest

  const value = useMemo(
    () => ({
      configured,
      ready,
      user,
      isGuest,
      hasAccess,
      busy,
      error,
      clearError,
      signInGoogle,
      enterAsGuest,
      signOut,
    }),
    [
      configured,
      ready,
      user,
      isGuest,
      hasAccess,
      busy,
      error,
      clearError,
      signInGoogle,
      enterAsGuest,
      signOut,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
