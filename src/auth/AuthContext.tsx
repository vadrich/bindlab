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
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { getFirebaseAuth, isFirebaseConfigured } from '../firebase'

export type AuthMode = 'signin' | 'signup'

interface AuthContextValue {
  configured: boolean
  ready: boolean
  user: User | null
  busy: boolean
  error: string | null
  clearError: () => void
  signInEmail: (email: string, password: string) => Promise<void>
  signUpEmail: (
    email: string,
    password: string,
    displayName?: string,
  ) => Promise<void>
  signInGoogle: () => Promise<void>
  resetPassword: (email: string) => Promise<boolean>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function mapAuthError(code: string | undefined, fallback: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'auth.errorInvalidEmail'
    case 'auth/user-disabled':
      return 'auth.errorUserDisabled'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'auth.errorBadCredentials'
    case 'auth/email-already-in-use':
      return 'auth.errorEmailInUse'
    case 'auth/weak-password':
      return 'auth.errorWeakPassword'
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
    default:
      return fallback
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isFirebaseConfigured()
  const [ready, setReady] = useState(!configured)
  const [user, setUser] = useState<User | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const auth = getFirebaseAuth()
    if (!auth) {
      setReady(true)
      return
    }
    const unsub = onAuthStateChanged(auth, (next) => {
      setUser(next)
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

  const signInEmail = useCallback(
    async (email: string, password: string) => {
      await run(async () => {
        const auth = getFirebaseAuth()!
        await signInWithEmailAndPassword(auth, email.trim(), password)
      })
    },
    [run],
  )

  const signUpEmail = useCallback(
    async (email: string, password: string, displayName?: string) => {
      await run(async () => {
        const auth = getFirebaseAuth()!
        const cred = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password,
        )
        const name = displayName?.trim()
        if (name) {
          await updateProfile(cred.user, { displayName: name })
        }
      })
    },
    [run],
  )

  const signInGoogle = useCallback(async () => {
    await run(async () => {
      const auth = getFirebaseAuth()!
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })
      await signInWithPopup(auth, provider)
    })
  }, [run])

  const resetPassword = useCallback(
    async (email: string): Promise<boolean> => {
      return run(async () => {
        const auth = getFirebaseAuth()!
        await sendPasswordResetEmail(auth, email.trim())
      })
    },
    [run],
  )

  const signOut = useCallback(async () => {
    await run(async () => {
      const auth = getFirebaseAuth()!
      await firebaseSignOut(auth)
    })
  }, [run])

  const value = useMemo(
    () => ({
      configured,
      ready,
      user,
      busy,
      error,
      clearError,
      signInEmail,
      signUpEmail,
      signInGoogle,
      resetPassword,
      signOut,
    }),
    [
      configured,
      ready,
      user,
      busy,
      error,
      clearError,
      signInEmail,
      signUpEmail,
      signInGoogle,
      resetPassword,
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
