/// <reference types="next" />
/// <reference types="next/image-types/global" />

interface ImportMetaEnv {
  readonly NEXT_PUBLIC_SITE_URL?: string
  readonly NEXT_PUBLIC_YANDEX_METRIKA_ID?: string
  readonly NEXT_PUBLIC_FIREBASE_API_KEY?: string
  readonly NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?: string
  readonly NEXT_PUBLIC_FIREBASE_PROJECT_ID?: string
  readonly NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?: string
  readonly NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?: string
  readonly NEXT_PUBLIC_FIREBASE_APP_ID?: string
  readonly VITE_SITE_URL?: string
  readonly VITE_YANDEX_METRIKA_ID?: string
  readonly VITE_FIREBASE_API_KEY?: string
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string
  readonly VITE_FIREBASE_PROJECT_ID?: string
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string
  readonly VITE_FIREBASE_APP_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
