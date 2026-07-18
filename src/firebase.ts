import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { publicEnv } from './env'

const firebaseConfig = {
  apiKey: publicEnv.firebase.apiKey(),
  authDomain: publicEnv.firebase.authDomain(),
  projectId: publicEnv.firebase.projectId(),
  storageBucket: publicEnv.firebase.storageBucket(),
  messagingSenderId: publicEnv.firebase.messagingSenderId(),
  appId: publicEnv.firebase.appId(),
}

/** True when all required Firebase env vars are set. */
export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId,
  )
}

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null
  if (!app) {
    app = getApps().length > 0 ? getApps()[0]! : initializeApp(firebaseConfig)
  }
  return app
}

export function getFirebaseAuth(): Auth | null {
  const firebaseApp = getFirebaseApp()
  if (!firebaseApp) return null
  if (!auth) auth = getAuth(firebaseApp)
  return auth
}

export function getFirebaseDb(): Firestore | null {
  const firebaseApp = getFirebaseApp()
  if (!firebaseApp) return null
  if (!db) db = getFirestore(firebaseApp)
  return db
}
